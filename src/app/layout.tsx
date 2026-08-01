import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sudoku",
  description: "A Sudoku game built with Next.js, React, and TypeScript.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="fixed top-4 right-4 z-10">
          <DarkModeToggle />
        </div>
        {children}
      </body>
    </html>
  );
}
