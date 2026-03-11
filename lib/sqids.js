import Sqids from "sqids";

const sqids = new Sqids({
  minLength: 5,
});

export function encodeSqid(value) {
  const numericValue = Number(value);

  if (!Number.isInteger(numericValue) || numericValue < 0) {
    return null;
  }

  return sqids.encode([numericValue]);
}

export function decodeSqid(value) {
  const decodedValues = sqids.decode(value);

  if (decodedValues.length !== 1) {
    return null;
  }

  const [decodedValue] = decodedValues;

  if (encodeSqid(decodedValue) !== value) {
    return null;
  }

  return decodedValue;
}
