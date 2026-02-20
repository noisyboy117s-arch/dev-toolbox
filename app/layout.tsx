import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import AdSense from "@/components/AdSense";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevToolbox - Free Online Developer Tools",
  description: "Fast, privacy-focused developer tools. Base64, JSON, JWT, Hash, UUID, Regex, Color picker and more. All processing happens in your browser.",
  keywords: ["developer tools", "online utilities", "base64", "json formatter", "jwt debugger", "hash generator", "uuid generator", "regex tester", "color picker", "web development"],
  authors: [{ name: "DevToolbox" }],
  creator: "DevToolbox",
  publisher: "DevToolbox",
  robots: "index, follow",
  openGraph: {
    title: "DevToolbox - Free Online Developer Tools",
    description: "Fast, privacy-focused developer tools. Base64, JSON, JWT, Hash, UUID, Regex, Color picker and more.",
    url: "https://devtoolbox.com",
    siteName: "DevToolbox",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevToolbox - Free Developer Tools",
    description: "Fast, privacy-focused developer tools for modern developers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const currentYear = new Date().getFullYear();

  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7306192465226218"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col`}
      >
        <ThemeProvider>
          <Navbar />
          
          <div className="max-w-7xl mx-auto w-full px-4">
            <AdSense slot="1234567890" type="leaderboard" />
          </div>

          <div className="flex-grow flex flex-col md:flex-row max-w-7xl mx-auto w-full gap-12 px-4">
            <main className="flex-grow min-w-0">{children}</main>
            
            <aside className="hidden lg:block w-[300px] shrink-0">
              <div className="sticky top-24">
                <AdSense slot="0987654321" type="rectangle" />
              </div>
            </aside>
          </div>

          <footer className="border-t border-gray-200 dark:border-gray-700 py-8 mt-auto text-gray-500 dark:text-gray-400">
            <div className="max-w-7xl mx-auto px-4 text-center text-sm flex flex-col md:flex-row justify-center items-center gap-4">
              <span suppressHydrationWarning> {currentYear} DevToolbox. Built for speed and privacy.</span>
              <div className="flex gap-4">
                <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300">Privacy Policy</Link>
                <Link href="/about" className="hover:text-gray-700 dark:hover:text-gray-300">About</Link>
                <Link href="/contact" className="hover:text-gray-700 dark:hover:text-gray-300">Contact</Link>
              </div>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
// Deploy Trigger: Sat Feb 14 18:02:47 UTC 2026
