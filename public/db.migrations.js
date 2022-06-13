const { INVOICE, QUOTE } = require("./documentTypes");

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
  });
}

function version0_0_3(sessionContext, user, saveUser) {
  return new Promise((resolve, reject) => {
    user.dbVersions = "v0.0.4";
    // merge payUntil into validUntil field
    sessionContext.documents.find({}, (err, documents) => {
      if (err) {
        console.error("open-session update db version open documents: ", err);
        reject(err);
      } else {
        const invoices = documents
          .filter(({ type }) => type === INVOICE)
          .map(({ payUntil, ...document }) => ({
            validUntil: payUntil,
            ...document,
          }))
          .filter((document) => document);
        Promise.all(
          invoices.map(
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
  });
}

function version0_0_4(sessionContext, user, saveUser) {
  return new Promise((resolve, reject) => {
    user.dbVersions = "v0.0.5";
    // add publicId to quotes and invoices that have a invoiceId or quoteId

    Promise.all([
      new Promise((resolve, reject) => {
        sessionContext.documents.find(
          { quoteId: { $exists: true }, type: INVOICE },
          (err, invoicesFromQuote) => {
            if (err) {
              console.error(
                "open-session update db version open documents: ",
                err
              );
              reject(err);
            } else {
              resolve(invoicesFromQuote);
            }
          }
        );
      }),
      new Promise((resolve, reject) => {
        sessionContext.documents.find(
          { invoiceId: { $exists: true }, type: QUOTE },
          (err, quotesFromInvoices) => {
            if (err) {
              console.error(
                "open-session update db version open documents: ",
                err
              );
              reject(err);
            } else {
              resolve(quotesFromInvoices);
            }
          }
        );
      }),
    ]).then(([invoicesFromQuote, quotesFromInvoices]) => {
      Promise.all(
        invoicesFromQuote
          .map((document) => {
            const quote = quotesFromInvoices.find(
              ({ _id }) => _id === document.quoteId
            );
            !quote &&
              console.warn(
                `Couldn't find quote ${document.quoteId} linked with invoice ${document.publicId} (${document._id})`
              );
            return {
              ...document,
              quoteId: undefined,
              fromQuote: {
                _id: document.quoteId,
                publicId: quote?.publicId,
              },
            };
          })
          .concat(
            quotesFromInvoices.map((document) => {
              const invoice = invoicesFromQuote.find(
                ({ _id }) => _id === document.invoiceId
              );
              !invoice &&
                console.warn(
                  `Couldn't find invoice ${document.invoiceId} linked with quote ${document.publicId} (${document._id})`
                );
              return {
                ...document,
                invoiceId: undefined,
                toInvoice: {
                  _id: document.invoiceId,
                  publicId: invoice?.publicId,
                },
              };
            })
          )
          .map(
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
    });
  });
}

function version0_0_5(sessionContext, user, saveUser) {
  return new Promise((resolve, reject) => {
    const defaultIdType = "SIREN";
    user.dbVersions = "v0.0.6";
    user.idType = user.idType || defaultIdType;
    // missing idType
    sessionContext.clients.find({}, (err, clients) => {
      if (err) {
        console.error("open-session update db version open clients: ", err);
        reject(err);
      } else {
        Promise.all(
          clients
            .filter(({ idType }) => !idType)
            .map((client) => ({
              ...client,
              idType: defaultIdType,
            }))
            .filter((client) => client)
            .map(
              (client) =>
                new Promise((resolve, reject) =>
                  sessionContext.clients.update(
                    { _id: client._id },
                    client,
                    (err) => (err ? reject(err) : resolve())
                  )
                )
            )
        )
          .catch(reject)
          .then(() =>
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
                    .filter(
                      ({ user, client }) => !user?.idType || !client?.idType
                    )
                    .map(({ user, client, ...document }) => ({
                      user: { ...user, idType: user.idType || defaultIdType },
                      client: client
                        ? {
                            ...client,
                            idType: client.idType || defaultIdType,
                          }
                        : undefined,
                      ...document,
                    }))
                    .filter((document) => document)
                    .map(
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
            })
          );
      }
    });
  });
}

const currentDbVersion = "v0.0.6";

module.exports = {
  currentDbVersion,
  noVersion,
  version0_0_1,
  version0_0_2,
  version0_0_3,
  version0_0_4,
  version0_0_5,
};
