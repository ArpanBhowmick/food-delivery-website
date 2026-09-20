import { customAlphabet } from "nanoid";

const generateBase62Code = customAlphabet(
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  6,
);

export default generateBase62Code;