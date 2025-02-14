import { isUserExists } from "@/data-access/user";
import { User } from "@/lib/db/models/auth";

export default async function generateUniqueUsername(email: string) {
  const emailParts = email.split("@");
  const baseUsername = emailParts[0].toLowerCase();
  let candidateUsername = baseUsername;

  if (candidateUsername) {
    const checkExistingUsername = await isUserExists({
      username: candidateUsername,
    });

    if (checkExistingUsername === null) {
      return candidateUsername;
    }

    const generateRandomSuffix = (attempt: number) => {
      const maxRange = Math.pow(10, 2 + attempt);
      return Math.floor(Math.random() * maxRange);
    };

    let attempt = 0;
    const MAX_ATTEMPTS = 10;
    while (attempt < MAX_ATTEMPTS) {
      candidateUsername = `${baseUsername}${generateRandomSuffix(attempt)}`;
      const checkExistingUsername = await isUserExists({
        username: candidateUsername,
      });

      if (checkExistingUsername === null) {
        return candidateUsername;
      }

      attempt++;
    }

    throw new Error("Cannot generate unique username");
  }
  return candidateUsername;
}
