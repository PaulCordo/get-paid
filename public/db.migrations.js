const { INVOICE } = require("../src/documentTypes");

function noVersion(sessionContext, user, saveUser) {
  // We have to add a publicId field to documents and use the number field only as doucment numbering (count)
  return new Promise((resolve, reject) =>
    sessionContext.documents.find({}, (err, documents) => {
      if (err) {
        console.error("open-session update db version open documents: ", err);
        reject(err);
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
                    number: parseInt(String(document.number).slice(-3), 10),
                    publicId: String(document.number),
                  },
                  (err) => (err ? reject(err) : resolve())
                )
              )
          )
      ).then(() =>
        saveUser({ ...user, dbVersions: "v0.0.1" })
          .catch(reject)
          .then(resolve)
      );
    })
  );
}

function version0_0_1(sessionContext, user, saveUser) {
  return new Promise((resolve, reject) => {
    user.dbVersions = "v0.0.2";
    user.quoteFormat = user.quoteFormat ?? "D{YYYY}-{NNN}";
    user.invoiceFormat = user.invoiceFormat ?? "{YYYY}{NNN}";
    user.tax = isNaN(user.tax) ? 0 : user.tax;
    user.numberFormat = undefined;

    // remove old index on document number as unique constraint is on both type, year and number
    sessionContext.documents.removeIndex("number", (err) => {
      if (err) {
        console.error("open-session cannot remove documents index: ", err);
        reject(err);
      } else {
        // update document numbering system, publicId takes the visual unique format while number track counts
        sessionContext.documents.find({}, (err, documents) => {
          if (err) {
            console.error(
              "open-session update db version open documents: ",
              err
            );
            reject(err);
          } else {
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
            )
              .catch(reject)
              .then(() => saveUser(user).catch(reject).then(resolve));
          }
        });
      }
    });
  });
}

function version0_0_2(sessionContext, user, saveUser) {
  return new Promise((resolve, reject) => {
    user.dbVersions = "v0.0.3";
    // add invoiceId to quotes that where created from them
    sessionContext.documents.find({}, (err, documents) => {
      if (err) {
        console.error("open-session update db version open documents: ", err);
        reject(err);
      } else {
        const quotesFromInvoices = documents
          .filter(({ quoteId, type }) => quoteId && type === INVOICE)
          .map(({ quoteId }) => {
            const document = documents.find(({ _id }) => _id === quoteId);
            return document ? Object.assign(document, { quoteId }) : null;
          })
          .filter((document) => document);
        Promise.all(
          quotesFromInvoices.map(
            (document) =>
              new Promise((resolve, reject) =>
                sessionContext.documents.update(
                  { _id: document._id },
                  document,
                  (err) => (err ? reject(err) : resolve())
                )
              )
          )
        )
          .catch(reject)
          .then(() => saveUser(user).catch(reject).then(resolve));
      }
    });

    saveUser(user).catch(reject).then(resolve);
  });
}

module.exports = {
  noVersion,
  version0_0_1,
  version0_0_2,
};
