import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daily Activity Slots",
  description: "What are you up to today? Plan your day with activity slots.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
