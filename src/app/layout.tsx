import type { Metadata } from "next";
import { Geist, Geist_Mono, Martian_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./_components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const martianMono = Martian_Mono({
  variable: "--martian-mono",
  subsets: ["latin"],
  weight: "500",
});

export const metadata: Metadata = {
  title: "Stonks",
  description: "Stockmarketsimulator by Voxelstudios, pour la fête de l'école",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${martianMono.variable} antialiased pt-5 pb-30 md:pb-5 md:pt-20`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
