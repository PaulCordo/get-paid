import React from "react";

export function AccountDisplay({
  client: {
    name,
    idType,
    idNumber,
    addressLine1,
    addressLine2,
    zipCode,
    city,
    tel,
    email,
  },
}) {
  return (
    <div>
      <h4>{name}</h4>
      <h5 className="text-uppercase mb-1">
        {idType} {idNumber}
      </h5>
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
