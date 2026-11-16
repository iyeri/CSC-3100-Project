export const userKeys = [
  "uid",
  "username",
  "name",
  "calpoly_email",
  "bio",
  "pfp_url",
  "credit_balance",
  "on_campus",
  "date_joined",
  "account_status",
];

function isObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOnlyAllowedKeys(body, allowedKeys) {
  return Object.keys(body).every((key) => allowedKeys.includes(key));
}

export function isValidNewUser(body) {
  return (
    isObject(body) &&
    body.uid === undefined &&
    body.username !== undefined &&
    body.calpoly_email !== undefined &&
    hasOnlyAllowedKeys(body, userKeys)
  );
}

export function isValidUserUpdate(body) {
  return (
    isObject(body) &&
    body.uid === undefined &&
    hasOnlyAllowedKeys(body, userKeys)
  );
}
