import { Resend } from "resend";
export async function sendVerificationEmail(email: string, token: string) {
  const resend = new Resend(process.env.RESEND_API_KEY as string);

  const costumLink = `http://localhost:3000/auth/verify?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "codinginbet@gmail.com",
    subject: "Verify your email",
    html: `<p>Please verify your email to click the link below: <a href="${costumLink}">Here</a></p>`,
  });
}
