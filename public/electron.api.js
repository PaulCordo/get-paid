const { app, ipcMain, dialog } = require("electron");
const path = require("path");
const Datastore = require("nedb");
const fs = require("fs");
const { INVOICE } = require("./documentTypes");
const dbPath = path.join(app.getPath("appData"), "get-paid", "data");
const migrations = require("./db.migrations");
const { currentDbVersion } = migrations;

function addUserDefaults(user) {
  user.dbVersions = "v0.0.3";
  user.quoteFormat = user.quoteFormat ?? "D{YYYY}-{NNN}";
  user.invoiceFormat = user.invoiceFormat ?? "{YYYY}{NNN}";
  user.tax = isNaN(user.tax) ? 0 : user.tax;
  return user;
}

module.exports = (mainWindow) => {
  console.info(`DB is located in ${dbPath}`);
  const usersDb = new Datastore(path.join(dbPath, "users.db"));
  usersDb.loadDatabase((err) => {
    if (err) console.error("User database opening error: ", err);
  });

  ipcMain.on("user-create", (event, user) => {
    usersDb.insert(addUserDefaults(user), (err, user) => {
      if (err) console.error("user-create", err);
      event.reply("user-create", err, user);
    });
  });
  ipcMain.on("user-upsert", (event, user) => {
    usersDb.update(
      { _id: user._id },
      addUserDefaults(user),
      { upsert: true },
      (err) => {
        if (err) {
          console.error("user-upsert", err);
        }
        event.reply("user-upsert", err, user);
      }
    );
  });

  ipcMain.on("user-list", (event) => {
    usersDb.find({}, (err, users = []) => {
      if (err) console.error("user-list", err);
      event.reply("user-list", err, users);
    });
  });

  let sessionContext;
  ipcMain.on("open-session", (event, _id) => {
    usersDb.findOne({ _id }, async (err, user) => {
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
        const saveUser = (updatedUser) =>
          new Promise((resolve, reject) =>
            usersDb.update({ _id: user._id }, updatedUser, (err) => {
              if (err) {
                console.error(
                  `update db version to ${updatedUser.dbVersions} `,
                  err
                );
                reject(err);
              } else {
                resolve();
              }
            })
          );
        if (user.dbVersions > currentDbVersion) {
          console.error(
            `FATAL: User ${user.name} id ${user._id} has a dbVersions of ${user.dbVersions}, max allowed by this program is ${currentDbVersion}`
          );
          app.quit();
        }
        // we might have to save our new user after migrating
        switch (user.dbVersions) {
          case undefined:
            await migrations.noVersion(sessionContext, user, saveUser);
          // falls through
          case "v0.0.1":
            await migrations.version0_0_1(sessionContext, user, saveUser);
          // falls through
          case "v0.0.2":
            await migrations.version0_0_2(sessionContext, user, saveUser);
          // falls through
          case "v0.0.3":
            await migrations.version0_0_3(sessionContext, user, saveUser);
          // falls through
          case "v0.0.4":
            await migrations.version0_0_4(sessionContext, user, saveUser);
          // falls through
          case "v0.0.5":
            await migrations.version0_0_5(sessionContext, user, saveUser);
          // falls through
          case currentDbVersion:
            break;
          default:
            console.error(
              `user dbVersions has an invalid value of ${user.dbVersions}`
            );
            app.quit();
        }

        sessionContext.documents.find({}, (err, documents) => {
          if (err) {
            console.error("open-session open documents: ", err);
            event.reply("open-session", err);
          } else {
            sessionContext.clients.find({}, (err, clients) => {
              if (err) {
                console.error("open-session open clients: ", err);
              }
              event.reply("open-session", err, {
                user,
                documents,
                clients,
              });
            });
          }
        });
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

  ipcMain.on("document-save", (event, document) => {
    console.debug("document-save");
    addDocumentPublicId(document, sessionContext)
      .then((document) => tryUpdateDraftOrInsert(document, sessionContext))
      .then((document) => tryUpdateBilledQuote(document, sessionContext))
      .then((document) => tryUpdateCanceledInvoice(document, sessionContext))
      .then((document) => tryUpdateCreditedInvoice(document, sessionContext))
      .then((document) => {
        event.reply("document-save", undefined, document);
      })
      .catch((err) => {
        console.error("document-save", err.message, err.error);
        event.reply("document-save", err, document);
      });
  });

  ipcMain.on("document-delete", (event, document) => {
    document._id && document.draft
      ? sessionContext.documents.remove(
          { _id: document._id, draft: true },
          {},
          (err, numRemoved) => {
            if (err) {
              console.error("document-delete", err);
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

  ipcMain.on("document-set-paid", (event, document) => {
    document._id
      ? sessionContext.documents.update(
          { _id: document._id },
          { $set: { paid: document.paid } },
          (err, numReplaced) => {
            if (err) {
              console.error("document-set-paid", err);
            }
            event.reply("document-set-paid", err, numReplaced);
          }
        )
      : event.reply(
          "document-set-paid",
          new Error("You can only update a document with an _id"),
          0
        );
  });

  ipcMain.on("document-archive", (event, document) => {
    document._id
      ? sessionContext.documents.update(
          { _id: document._id },
          { $set: { archived: document.archived } },
          (err, numReplaced) => {
            if (err) {
              console.error("document-archive", err);
            }
            event.reply("document-archive", err, numReplaced);
          }
        )
      : event.reply(
          "document-archive",
          new Error("You can only update a document with an _id"),
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

function addDocumentPublicId(document, sessionContext) {
  return new Promise((resolve) => {
    console.debug("addDocumentPublicId");
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
  });
}

function tryUpdateBilledQuote(document, sessionContext) {
  return new Promise((resolve, reject) => {
    console.debug("tryUpdateBilledQuote");
    if (!document.draft && document.fromQuote && document._id) {
      sessionContext.documents.update(
        { _id: document.fromQuote._id },
        {
          $set: {
            archived: true,
            toInvoice: { _id: document._id, publicId: document.publicId },
          },
        },
        (error) => {
          if (error) {
            reject({
              message: "Couldn't update billed quote",
              error,
            });
          } else {
            resolve(document);
          }
        }
      );
    } else {
      resolve(document);
    }
  });
}

function tryUpdateCanceledInvoice(document, sessionContext) {
  return new Promise((resolve, reject) => {
    console.debug("tryUpdateCanceledInvoice");
    if (
      !document.draft &&
      document.cancelInvoice &&
      document.type === INVOICE &&
      document._id
    ) {
      sessionContext.documents.update(
        { _id: document.cancelInvoice._id },
        { $set: { canceledBy: document._id, archived: true } },
        {},
        (error) => {
          if (error) {
            reject({
              message: "Couldn't update canceled Invoice",
              error,
            });
          } else {
            resolve(document);
          }
        }
      );
    } else {
      resolve(document);
    }
  });
}

function tryUpdateCreditedInvoice(document, sessionContext) {
  return new Promise((resolve, reject) => {
    console.debug("tryUpdateCreditedInvoice");
    if (
      !document.draft &&
      document.creditForInvoice &&
      document.type === INVOICE &&
      document._id
    ) {
      sessionContext.documents.update(
        { _id: document.creditForInvoice._id },
        { $set: { creditedBy: document._id } },
        {},
        (error) => {
          if (error) {
            reject({
              message: "Couldn't update credited Invoice",
              error,
            });
          } else {
            resolve(document);
          }
        }
      );
    } else {
      resolve(document);
    }
  });
}

function tryUpdateDraftOrInsert(document, sessionContext) {
  return new Promise((resolve, reject) => {
    console.debug("tryUpdateDraftOrInsert");
    if (document._id) {
      // try to update an existing draft
      sessionContext.documents.update(
        { _id: document._id, draft: true },
        document,
        (error, numAffected) => {
          if (error) {
            reject({ message: "Can't update existing draft", error, document });
          } else if (numAffected) {
            resolve(document);
          } else {
            sessionContext.documents.insert(document, (error, document) =>
              error
                ? reject({
                    message:
                      "Couldn't insert new document after failing updating draft",
                    error,
                    document,
                  })
                : resolve(document)
            );
          }
        }
      );
    } else {
      sessionContext.documents.insert(document, (error, document) =>
        error
          ? reject({ message: "Couldn't insert new document", error, document })
          : resolve(document)
      );
    }
  });
}
