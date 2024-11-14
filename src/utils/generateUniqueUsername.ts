import { connectToMongoDB } from "@/lib/db/mongodb";

export default async function generateUniqueUsername(email: string) {
  const emailParts = email.split("@");
  const baseUsername = emailParts[0].toLowerCase();
  let candidateUsername = baseUsername;

  if (candidateUsername) {
    return await connectToMongoDB().then(async () => {
      const checkExistingUsername = await User.exists({
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
        const checkExistingUsername = await User.exists({
          username: candidateUsername,
        });

        if (checkExistingUsername === null) {
          console.log({ attempt });
          return candidateUsername;
        }

        attempt++;
      }

      throw new Error("Cannot generate unique username");
    });
  }
}
