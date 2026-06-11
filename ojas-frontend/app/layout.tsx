import type { Metadata } from "next";
import "./globals.css";
import Cursor from "./components/Cursor";
import { EmberCanvas } from "./components/music/EmberCanvas";

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
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,700;1,400&family=Space+Mono:wght@400;700&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased overflow-x-hidden relative bg-forest-ink text-surface-cream min-h-screen flex flex-col transition-colors duration-500">
        {/* Global Animated Background */}
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
          <div 
            className="absolute inset-0 opacity-80" 
            style={{
                background: 'linear-gradient(-45deg, #050f0a, #004d2c, #c06080, #050f0a)',
                backgroundSize: '400% 400%',
                animation: 'mesh-shift 20s ease infinite',
            }}
          />
          <EmberCanvas />
        </div>

        <Cursor />
        {children}
      </body>
    </html>
  );
}
