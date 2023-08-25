export function checkIsEduEmail(email: string) {
  if (email.split("@").length !== 2) throw new Error("Invalid email");

  let [username, domain] = email.split("@");

  let subdomains = domain.split(".");
  let isEdu = false;

  for (let i = 0; i < subdomains.length - 1; i++) {
    if (subdomains[i] === "edu") {
      isEdu = true;
      break;
    }
  }

  return isEdu;
}
