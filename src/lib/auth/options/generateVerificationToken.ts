import { allowedCharacters } from "@/lib/auth/options/allowedCharacters";

function generateVerificationToken() {
  let n = 6;
  let token = "";
  for (var i = 0; i < n; i++) {
    token +=
      allowedCharacters[Math.floor(Math.random() * allowedCharacters.length)];
  }
  return token;
}

export { generateVerificationToken };
