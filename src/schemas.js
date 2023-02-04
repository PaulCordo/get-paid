export const accountSchema = {
  title: "account schema",
  version: 0,
  primaryKey: "_id",
  type: "object",
  properties: {
    _id: {
      type: "string",
      maxLength: 100,
    },
    name: {
      type: "string",
    },
    idType: {
      type: "string",
    },
    idNumber: {
      type: "string",
    },
    addressLine1: {
      type: "string",
    },
    addressLine2: {
      type: "string",
    },
    zipCode: { type: "string" },
    city: { type: "string" },
    tel: { type: "string" },
    email: { type: "string" },
  },
  required: ["_id", "name", "addressLine1", "zipCode", "city"],
  indexes: ["name"],
  encrypted: [
    "tel",
    "email",
    "addressLine1",
    "zipCode",
    "city",
    "idType",
    "idNumber",
  ],
};

export const companySchema = {
  ...accountSchema,
  title: "company schema",
  version: 0,
  primaryKey: "_id",
  properties: {
    ...accountSchema.properties,
    _id: undefined,
    name: {
      type: "string",
      maxLength: 100,
    },
    tax: { type: "number", min: 0, default: 0 },
    template: { type: "string" },
    taxId: { type: "string" },
    quoteFormat: { type: "string", default: "D{YYYY}-{NNN}" },
    invoiceFormat: { type: "string", default: "{YYYY}{NNN}" },
    dbVersions: { type: "string", default: "v0.0.3" },
  },
  required: [...accountSchema.required, "idNumber", "idType"],
  encrypted: [
    ...accountSchema.encrypted,
    "tax",
    "template",
    "taxId",
    "quoteFormat",
    "invoiceFormat",
  ],
};

export const documentSchema = {
  title: "document schema",
  version: 0,
  primaryKey: "_id",
  type: "object",
  properties: {
    _id: { type: "string", maxLength: 100 },
    publicId: { type: "string" },
    user: accountSchema,
    type: { type: "string" },
    draft: { type: "boolean" },
    date: { type: "string" },
    validUntil: { type: "string" },
    title: { type: "string" },
    description: { type: "string" },
    client: accountSchema,
    details: {
      // deprecated
      type: "array",
      items: {
        type: "object",
        properties: {
          type: "array",
          items: {
            type: "object",
            minItems: 1,
            properties: {
              name: { type: "string" },
              price: { type: "number" },
              quantity: { type: "number", min: 0 },
              expense: { type: "boolean", default: false },
            },
            required: ["name", "price", "quantity"],
          },
        },
      },
    },
    sections: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          expenses: { type: "boolean" },
          rows: {
            type: "array",
            items: {
              type: "object",
              minItems: 1,
              properties: {
                name: { type: "string" },
                price: { type: "number" },
                quantity: { type: "number", min: 0 },
                expense: { type: "boolean", default: false },
              },
              required: ["name", "price", "quantity"],
            },
          },
        },
      },
    },
    total: { type: "string" },
    creditForInvoice: { type: "string" },
    cancelInvoice: { type: "string" },
  },
  indexes: ["name"],
  encrypted: [
    "details",
    "sections",
    "total",
    "client",
    "user",
    "title",
    "description",
    "publicId",
    "type",
  ],
};
