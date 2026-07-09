import type { Metadata, Viewport } from "next";
import { APP_DESCRIPTION, APP_DEVELOPER, APP_NAME } from "@/constants/app";
import "./globals.css";

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
  creator: APP_DEVELOPER.name
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#eef3f8"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
