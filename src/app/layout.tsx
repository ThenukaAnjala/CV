import type { Metadata } from "next";
import { APP_DEVELOPER } from "@/constants/app";
import "./globals.css";

export const metadata: Metadata = {
  title: "ATS Resume Builder",
  description: "Create, check, and export an ATS-friendly resume locally in your browser.",
  creator: APP_DEVELOPER.name
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
