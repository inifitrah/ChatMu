import type { Metadata } from "next";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import { Toaster } from "@/components/ui/toaster";
export const metadata: Metadata = {
  title: "ChatMu",
  description: "ChatMu is a chat application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
