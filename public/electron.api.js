const { app, ipcMain, dialog } = require("electron");
const path = require("path");
const Datastore = require("nedb");
const fs = require("fs");
const { INVOICE } = require("../src/documentTypes");
const dbPath = path.join(app.getPath("appData"), "get-paid", "data");

module.exports = (mainWindow) => {
  const usersDb = new Datastore(path.join(dbPath, "users.db"));
  usersDb.loadDatabase((err) => {
    if (err) console.error("User database opening error: ", err);
  });

  ipcMain.on("user-create", (event, user) => {
    usersDb.insert(
      { ...user, dbVersions: "v0.0.1", numberFormat: "{YYYY}{NNN}" },
      (err, user) => {
        if (err) console.error("user-create", err);
        event.reply("user-create", err, user);
      }
    );
  });
  ipcMain.on("user-upsert", (event, user) => {
    usersDb.update({ _id: user._id }, user, { upsert: true }, (err) => {
      if (err) {
        console.error("user-upsert", err);
      }
      event.reply("user-upsert", err, user);
    });
  });

  ipcMain.on("user-list", (event) => {
    usersDb.find({}, (err, users = []) => {
      if (err) console.error("user-list", err);
      event.reply("user-list", err, users);
    });
  });

  let sessionContext;
  ipcMain.on("open-session", (event, _id) => {
    usersDb.findOne({ _id }, (err, user) => {
      if (err || !_id) {
        console.error("open-session find user: ", err);
        event.reply("open-session", err);
      } else {
        sessionContext = {
          documents: new Datastore({
            filename: path.join(dbPath, _id + ".documents.db"),
            autoload: true,
          }),
          clients: new Datastore({
            filename: path.join(dbPath, _id + ".clients.db"),
            autoload: true,
          }),
          yearConfigs: openYearConfigsDb(_id),
          user,
        };
        // indexes
        sessionContext.documents.ensureIndex(
          { fieldName: "date" },
          (err) =>
            err &&
            console.error("open-session ensure documents year index: ", err)
        );
        sessionContext.documents.ensureIndex(
          { fieldName: "type" },
          (err) =>
            err &&
            console.error("open-session ensure documents type index: ", err)
        );
        // migration from previous versions
        new Promise((resolve, reject) => {
          if (!user.dbVersions) {
            // remove old index on document number as unique constraint is on both type, year and number
            sessionContext.documents.removeIndex(
              "number",
              (err) =>
                err &&
                console.error("open-session remove documents index: ", err)
            );
            user.dbVersions = "v0.0.1";
            user.quoteFormat = "D{YYYY}-{NNN}";
            user.invoiceFormat = "{YYYY}{NNN}";
            sessionContext.documents.find({}, (err, documents) => {
              if (err) {
                console.error(
                  "open-session update db version open documents: ",
                  err
                );
              }
              Promise.all(
                documents
                  .filter(({ number }) => number)
                  .map(
                    (document) =>
                      new Promise((resolve, reject) =>
                        sessionContext.documents.update(
                          { _id: document._id },
                          {
                            ...document,
                            number: parseInt(
                              String(document.number).slice(-3),
                              10
                            ),
                            publicId: String(document.number),
                          },
                          (err) => (err ? reject(err) : resolve())
                        )
                      )
                  )
              ).then(() =>
                usersDb.update({ _id: user._id }, user, (err) => {
                  if (err) {
                    console.error(
                      `update db version to ${user.dbVersions} `,
                      err
                    );
                    reject(err);
                  } else {
                    resolve();
                  }
                })
              );
            });
          } else {
            resolve();
          }
        }).then(() =>
          sessionContext.documents.find({}, (err, documents) => {
            if (err) {
              console.error("open-session open documents: ", err);
              event.reply("open-session", err);
            } else {
              sessionContext.clients.find({}, (err, clients) => {
                if (err) {
                  console.error("open-session open clients: ", err);
                }
                event.reply("open-session", err, { user, documents, clients });
              });
            }
          })
        );
      }
    });
  });

  ipcMain.on("client-list", (event) => {
    sessionContext.clients.find({}, (err, clients = []) => {
      if (err) {
        console.error("client-list-error", err);
      }
      event.reply("client-list", err, clients);
    });
  });

  ipcMain.on("client-upsert", (event, client) => {
    sessionContext.clients.update(
      { _id: client._id },
      client,
      { upsert: true },
      (err) => {
        if (err) {
          console.error("client-upsert", err);
        }
        event.reply("client-upsert", err);
      }
    );
  });

  ipcMain.on("client-remove", (event, client) => {
    sessionContext.clients.remove({ _id: client._id }, {}, (err) => {
      if (err) {
        console.error("client-remove", err);
      }
      event.reply("client-remove", err);
    });
  });

  ipcMain.on("document-list", (event) => {
    sessionContext.documents.find({}, (err, documents = []) => {
      if (err) {
        console.error("document-list-error", err);
      }
      event.reply("document-list", err, documents);
    });
  });

  function insertDocument(event, document) {
    sessionContext.documents.insert(document, (err) => {
      if (err) {
        console.error("document-save", err);
      }
      event.reply("document-save", err, document);
    });
  }

  ipcMain.on("document-save", (event, document) => {
    new Promise((resolve) => {
      if (!document.draft) {
        const documentYear = document.date.slice(0, 4);
        sessionContext.documents
          .find({
            date: {
              $lt: (Number(documentYear) + 1).toString().padStart(4, "0"),
              $gte: documentYear,
            },
            type: document.type,
          })
          .sort({ number: -1 })
          .limit(1)
          .exec((err, [{ number } = {}]) => {
            document.number = !number || err ? 1 : number + 1;
            const format =
              document.type === INVOICE
                ? sessionContext.user.invoiceFormat
                : sessionContext.user.quoteFormat;
            document.publicId = getDocumentPublicId(
              format,
              documentYear,
              document.number
            );
            resolve(document);
          });
      } else {
        resolve(document);
      }
    }).then((document) => {
      if (document._id) {
        // try to update an existing draft
        sessionContext.documents.update(
          { _id: document._id, draft: true },
          document,
          (err, numAffected) => {
            if (err) {
              console.error("document-save", err);
              event.reply("document-save", err);
            }
            if (numAffected) {
              event.reply("document-save", err, document);
            } else {
              insertDocument(event, document);
            }
          }
        );
      } else {
        insertDocument(event, document);
      }
    });
  });

  ipcMain.on("document-delete", (event, document) => {
    document._id && document.draft
      ? sessionContext.documents.remove(
          { _id: document._id, draft: true },
          {},
          (err, numRemoved) => {
            if (err) {
              console.error("document-save", err);
            }
            event.reply("document-delete", err, numRemoved);
          }
        )
      : event.reply(
          "document-delete",
          new Error("You can only remove a draft with an _id"),
          0
        );
  });

  ipcMain.on("document-download", (event, document) => {
    mainWindow.webContents
      .printToPDF({ pageSize: "A4" })
      .then((data) => {
        const name = dialog.showSaveDialogSync(mainWindow, {
          defaultPath: `${document.type}_${document.publicId}.pdf`,
          title: "Enregistrer le document",
        });
        if (!name || name.length == 0) {
          event.reply("document-download");
        } else {
          fs.writeFile(name, data, (err) => {
            if (err) {
              console.error("document-download", err);
            }
            event.reply("document-download", err);
          });
        }
      })
      .catch((err) => {
        console.error("document-download", err);
        event.reply("document-download", err);
      });
  });
};

function openYearConfigsDb(userId) {
  const yearConfigsDb = new Datastore({
    filename: path.join(dbPath, userId + ".yearConfig.db"),
    autoload: true,
  });
  yearConfigsDb.ensureIndex(
    { fieldName: "year", unique: true },
    (err) =>
      err && console.error("openYearConfig ensure yearConfig index: ", err)
  );
  return yearConfigsDb;
}

function getDocumentPublicId(formatString, year, number) {
  number = String(number);
  const numberFormatIdentifier = /\{N+\}/g;
  year = String(parseInt(year, 10));
  const yearFormatIdentifier = /\{Y+\}/g;
  return formatString
    .replaceAll(numberFormatIdentifier, (match) =>
      number.padStart(match.length - 2, "0")
    )
    .replaceAll(yearFormatIdentifier, (match) => {
      const charCount = match.length - 2;
      if (charCount === 2) {
        // special case, return only the last two digits
        return year.slice(-2);
      }
      return year.padStart(charCount, "0");
    });
}
