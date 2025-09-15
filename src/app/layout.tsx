import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Is This Soup? - The Ultimate Culinary Question",
  description: "Ask the ultimate question for the modern culinary philosopher. Discover whether your favorite foods qualify as soup with AI-powered wisdom.",
  keywords: "soup, food, culinary, philosophy, AI, cooking, recipes",
  authors: [{ name: "Is This Soup" }],
  openGraph: {
    title: "Is This Soup? - The Ultimate Culinary Question",
    description: "Ask the ultimate question for the modern culinary philosopher. Discover whether your favorite foods qualify as soup with AI-powered wisdom.",
    url: "https://isthissoup.com",
    siteName: "Is This Soup?",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Is This Soup? - The Ultimate Culinary Question",
    description: "Ask the ultimate question for the modern culinary philosopher.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
