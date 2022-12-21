import React from "react";

export function AccountDisplay({
  account: {
    name,
    idType,
    idNumber,
    taxId,
    addressLine1,
    addressLine2,
    zipCode,
    city,
    tel,
    email,
  } = {},
  className,
}) {
  return (
    <div className={className}>
      <h4>{name}</h4>
      <h5 className="text-uppercase mb-1">
        {idType} {idNumber}
      </h5>
      {taxId && <h6>N° TVA {taxId}</h6>}
      <address>
        {addressLine1}
        <br />
        {addressLine2}
        {addressLine2 && <br />}
        {zipCode} {city}
        <br />
        <div className="mt-1">
          <a href={"tel:" + tel}> {tel} </a>
          {tel && <br />}
          <a href={"mailto:" + email}> {email} </a>
        </div>
      </address>
    </div>
  );
}
