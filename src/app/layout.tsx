import type { Metadata } from "next";
import "./globals.css";
import SessionWrapper from "@/components/auth/SessionWrapper";
import { Toaster } from "@/components/ui/toaster";
import SocketWrapper from "@/components/SocketWrapper";
import ReduxWrapper from "@/components/ReduxWrapper";
import { ThemeProvider } from "@/components/ThemeProvider";
export const metadata: Metadata = {
  title: "ChatMu",
  description: "ChatMu is a chat application",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionWrapper>
      <SocketWrapper>
        <ReduxWrapper>
          <html lang="en">
            <body className="text-foreground bg-background-dim">
              <ThemeProvider
                attribute="class"
                enableSystem
                disableTransitionOnChange
                defaultTheme="dark"
              >
                {children}
                <Toaster />
              </ThemeProvider>
            </body>
          </html>
        </ReduxWrapper>
      </SocketWrapper>
    </SessionWrapper>
  );
}
