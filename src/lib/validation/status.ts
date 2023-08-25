export function validateStatus(status: string) {
  if (status.length < 3) {
    return "MIN_LENGTH";
  }
  if (status.length > 280) {
    return "MAX_LENGTH";
  }
  return "VALID";
}

export function validateOptions({
  author,
  audience,
}: {
  author: string;
  audience: string;
}) {
  if (author !== "user" && author !== "anonymous") {
    return "INVALID_AUTHOR";
  }
  if (audience !== "circle" && audience !== "school" && audience !== "everyone") {
    return "INVALID_AUDIENCE";
  }

  if (author === "anonymous" && audience === "circle") {
    return "INVALID_OPTIONS";
  }
  return "VALID";
}
