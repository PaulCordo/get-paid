const { app, ipcMain, dialog } = require("electron");
const path = require("path");
const Datastore = require("nedb");
const fs = require("fs");
const dbPath = path.join(app.getPath("appData"), "get-paid", "data");

module.exports = (mainWindow) => {
  const usersDb = new Datastore(path.join(dbPath, "users.db"));
  usersDb.loadDatabase((err) => {
    if (err) console.error("User database opening error: ", err);
  });

  ipcMain.on("user-create", (event, user) => {
    usersDb.insert(user, (err, user) => {
      if (err) console.error("user-create", err);
      event.reply("user-create", err, user);
    });
  });

  ipcMain.on("user-list", (event) => {
    usersDb.find({}, (err, users = []) => {
      if (err) console.error("user-list", err);
      event.reply("user-list", err, users);
    });
  });

  let userDbs;
  ipcMain.on("open-session", (event, _id) => {
    usersDb.findOne({ _id }, (err, user) => {
      if (err || !_id) {
        console.error("open-session find user: ", err);
        event.reply("open-session", err);
      } else {
        userDbs = {
          documents: new Datastore({
            filename: path.join(dbPath, _id + ".documents.db"),
            autoload: true,
          }),
          clients: new Datastore({
            filename: path.join(dbPath, _id + ".clients.db"),
            autoload: true,
          }),
        };

        userDbs.documents.find({}, (err, documents) => {
          if (err) {
            console.error("open-session open documents: ", err);
            event.reply("open-session", err);
          } else {
            userDbs.clients.find({}, (err, clients) => {
              if (err) {
                console.error("open-session open clients: ", err);
              }
              event.reply("open-session", err, { user, documents, clients });
            });
          }
        });
      }
    });
  });

  ipcMain.on("client-list", (event) => {
    userDbs.clients.find({}, (err, clients = []) => {
      if (err) {
        console.error("client-list-error", err);
      }
      event.reply("client-list", err, clients);
    });
  });

  ipcMain.on("client-upsert", (event, client) => {
    userDbs.clients.update(
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
    userDbs.clients.remove({ _id: client._id }, {}, (err) => {
      if (err) {
        console.error("client-remove", err);
      }
      event.reply("client-remove", err);
    });
  });

  ipcMain.on("document-list", (event) => {
    userDbs.documents.find({}, (err, documents = []) => {
      if (err) {
        console.error("document-list-error", err);
      }
      event.reply("document-list", err, documents);
    });
  });

  function insertDocument(event, document) {
    if (document.draft) {
      userDbs.documents.insert(document, (err) => {
        if (err) {
          console.error("document-save", err);
        }
        event.reply("document-save", err, document);
      });
    } else {
      documentYear = +document.date.slice(0, 4);
      userDbs.documents
        .find({
          number: { $lt: (documentYear + 1) * 1000, $gte: documentYear * 1000 },
          type: document.type,
        })
        .sort({ number: -1 })
        .limit(1)
        .exec((err, [{ number } = {}]) => {
          document.number =
            !number || err ? documentYear * 1000 + 1 : number + 1;
          userDbs.documents.insert(document, (err) => {
            if (err) {
              console.error("document-save", err);
            }
            event.reply("document-save", err, document);
          });
        });
    }
  }

  ipcMain.on("document-save", (event, document) => {
    if (document._id) {
      // try to update an existing draft
      userDbs.documents.update(
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

  ipcMain.on("document-delete", (event, document) => {
    document._id && document.draft
      ? userDbs.documents.remove(
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
          defaultPath: `${document.type}_${document.number}.pdf`,
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
