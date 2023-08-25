let allowedCharacters =
  "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ._";

export function checkIsValidHandle(handle: string): string {
  if (!handle.split("").every((char) => allowedCharacters.includes(char))) {
    return "INVALID_CHARACTERS";
  } else if (handle.length < 3 || handle.length > 24) {
    return "INVALID_LENGTH";
  } else if (
    handle.startsWith("_") ||
    handle.endsWith("_") ||
    handle.startsWith(".") ||
    handle.endsWith(".")
  ) {
    return "INVALID_START_OR_END";
  }

  return "VALID";
}
