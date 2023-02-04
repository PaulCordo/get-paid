import { INVOICE } from "./documentTypes";

export const logInUser = async (name, password) => {
  const response = await fetch(
    `${process.env.REACT_APP_COUCHDB_URL}/_session`,
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        name,
        password,
      }),
    }
  );
  if (response.ok) {
    return;
  } else {
    switch (response.status) {
      case 403:
        throw new Error("Forbidden");
    }
  }
  throw new Error("Unknown error");
};

export const getUserCompanyName = async (userName) => {
  // load user role
  const response = await fetch(
    `${process.env.REACT_APP_COUCHDB_URL}/_users/org.couchdb.user:${userName}`,
    {
      credentials: "include",
    }
  );
  if (response.ok) {
    const { roles } = await response.json();
    // we use user's role field to store the company name that will be used as prefix for our collections and local db
    const companyName = roles?.find(() => true);
    if (companyName) {
      return companyName;
    } else {
      throw new Error("No role set for this user");
    }
  } else {
    switch (response.status) {
      case 403:
        throw new Error("Forbidden");
      case 404:
        throw new Error("User doesn't exist");
    }
  }
};

export const getAllCollectionDocuments = async (collection) =>
  (await collection.find().exec()).map((doc) => doc.toJSON());

export function getDocumentPublicId(formatString, year, number) {
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

export async function tryUpdateBilledQuote(document, database) {
  if (!document.draft && document.fromQuote && document._id) {
    await database.documents.findOne(document.fromQuote._id).update({
      $set: {
        archived: true,
        toInvoice: { _id: document._id, publicId: document.publicId },
      },
    });
  }
  return document;
}

export async function tryUpdateCanceledInvoice(document, database) {
  if (
    !document.draft &&
    document.cancelInvoice &&
    document.type === INVOICE &&
    document._id
  ) {
    await database.documents.findOne(document.cancelInvoice._id).update({
      $set: { canceledBy: document._id, archived: true },
    });
  }
  return document;
}

export async function tryUpdateCreditedInvoice(document, database) {
  if (
    !document.draft &&
    document.creditForInvoice &&
    document.type === INVOICE &&
    document._id
  ) {
    await database.documents
      .findOne(document.creditForInvoice._id)
      .update({ $set: { creditedBy: document._id } });
  }
  return document;
}

export async function tryUpdateDraftOrInsert(document, database) {
  if (document._id) {
    // try to update an existing draft
    const draftDoc = await database.documents
      .findOne({ selector: { _id: document._id, draft: true } })
      .exec();
    if (draftDoc) {
      await draftDoc.update(document);
      return document;
    }
  }
  await database.documents.insert(document);
  return document;
}
