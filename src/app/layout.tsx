import type { Metadata } from "next";
import "./globals.css";
import SessionWrapper from "@/components/auth/SessionWrapper";
import { Toaster } from "@/components/ui/toaster";
import { connectToMongoDB } from "@/lib/db/mongodb";
import SocketWrapper from "@/components/SocketWrapper";
import ReduxWrapper from "@/components/ReduxWrapper";
export const metadata: Metadata = {
  title: "ChatMu",
  description: "ChatMu is a chat application",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connectToMongoDB();

  return (
    <SessionWrapper>
      <SocketWrapper>
        <ReduxWrapper>
          <html lang="en">
            <body className="text-black">
              {children}
              <Toaster />
            </body>
          </html>
        </ReduxWrapper>
      </SocketWrapper>
    </SessionWrapper>
  );
}
