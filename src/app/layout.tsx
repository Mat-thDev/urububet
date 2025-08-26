import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "UrubuBet",
  description: "Sua plataforma de apostas totalmente confiável.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`flex flex-col min-h-screen bg-gray-900 text-white ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Header />

          <main className="flex-1 container mx-auto px-4 py-8 w-full h-screen">
            {children}
          </main>

          <Footer />
        </Providers>
      </body>
    </html>
  );
}
