import type { Metadata } from "next";
import "./globals.css";
import SessionWrapper from "@/components/auth/SessionWrapper";
import { Toaster } from "@/components/ui/toaster";
import { connectToMongoDB } from "@/lib/db/mongodb";
export const metadata: Metadata = {
  title: "ChatMu",
  description: "ChatMu is a chat application",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // await connectToMongoDB();

  return (
    <SessionWrapper>
      <html lang="en">
        <body className="text-black">
          {children}
          <Toaster />
        </body>
      </html>
    </SessionWrapper>
  );
}
