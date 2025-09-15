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
  title: "Is This Soup?",
  description: "Gross.",
  keywords: "soup, food, culinary",
  authors: [{ name: "Tom Mitchell" }],
  openGraph: {
    title: "Is This Soup?",
    description: "Gross.",
    url: "https://isthissoup.com",
    siteName: "Is This Soup?",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Is This Soup?",
    description: "Gross.",
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
