import type { Metadata } from "next";
import "./globals.css";
import Cursor from "./components/Cursor";

export const metadata: Metadata = {
  title: "OJAS Wellness",
  description: "Ayurvedic Wellness · Sync your rhythm with the cosmic pulse",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Notable&family=EB+Garamond:ital,wght@0,400;0,700;1,400&family=Space+Mono:wght@400;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased overflow-x-hidden relative bg-background text-on-background">
        <Cursor />
        {children}
      </body>
    </html>
  );
}
