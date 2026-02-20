"use client";
import Link from "next/link";

export default function Home() {
  const tools = [
    {
      name: "Base64 Decoder/Encoder",
      description: "Secure, client-side Base64 conversion.",
      href: "/base64-tool",
      icon: "🔡",
    },
    {
      name: "JSON Formatter",
      description: "Clean and validate your JSON strings.",
      href: "/json-tool",
      icon: "📦",
    },
    {
      name: "Epoch Converter",
      description: "Unix timestamps to human dates.",
      href: "/epoch-tool",
      icon: "🕒",
    },
    {
      name: "Cron Generator",
      description: "Generate and explain cron expressions.",
      href: "/cron-tool",
      icon: "⏰",
    },
    {
      name: "URL Encoder/Decoder",
      description: "Encode and decode URLs safely.",
      href: "/url-tool",
      icon: "🔗",
    },
    {
      name: "JWT Debugger",
      description: "Decode and inspect JSON Web Tokens.",
      href: "/jwt-tool",
      icon: "🔐",
    },
    {
      name: "Hash Generator",
      description: "Generate SHA-256, SHA-512, MD5 hashes.",
      href: "/hash-tool",
      icon: "#️",
    },
    {
      name: "UUID Generator",
      description: "Generate unique identifiers instantly.",
      href: "/uuid-tool",
      icon: "🆔",
    },
    {
      name: "Regex Tester",
      description: "Test patterns with real-time highlighting.",
      href: "/regex-tool",
      icon: "🔍",
    },
    {
      name: "Color Picker",
      description: "Convert HEX, RGB, HSL color formats.",
      href: "/color-tool",
      icon: "🎨",
    },
    {
      name: "Query Parameters Converter",
      description: "Convert between URL query params and JSON.",
      href: "/query-tool",
      icon: "🔍",
    },
    {
      name: "Password Generator",
      description: "Generate secure passwords with entropy analysis.",
      href: "/password-tool",
      icon: "🔑",
    },
    {
      name: "SQL Formatter",
      description: "Format and validate SQL queries beautifully.",
      href: "/sql-tool",
      icon: "🗃️",
    },
    {
      name: "Postgres EXPLAIN Explainer",
      description: "Parse and analyze PostgreSQL query execution plans.",
      href: "/postgres-tool",
      icon: "🐘",
    },
    {
      name: "Markdown Editor",
      description: "Write and preview Markdown in real-time.",
      href: "/markdown-tool",
      icon: "📝",
    },
    {
      name: "Diff Viewer",
      description: "Compare text and code with visual diff.",
      href: "/diff-tool",
      icon: "🔄",
    },
    {
      name: "SVG Viewer & Editor",
      description: "View, edit, and optimize SVG files.",
      href: "/svg-tool",
      icon: "🎨",
    },
    {
      name: "Image to Base64",
      description: "Convert images to Base64 format instantly.",
      href: "/image-tool",
      icon: "🖼️",
    },
    {
      name: "Lorem Ipsum Generator",
      description: "Generate placeholder text for designs.",
      href: "/lorem-tool",
      icon: "📝",
    },
    {
      name: "QR Code Generator",
      description: "Create customizable QR codes.",
      href: "/qr-tool",
      icon: "📱",
    },
    {
      name: "WCAG Contrast Checker",
      description: "Check color contrast for accessibility.",
      href: "/contrast-tool",
      icon: "🎨",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "DevToolbox",
    "description": "Fast, privacy-focused developer tools. Base64, JSON, JWT, Hash, UUID, Regex, Color, Query Params, Password, SQL, Postgres, Markdown, Diff, SVG, Image, Lorem, QR, WCAG tools and more. All processing happens in your browser.",
    "url": "https://devtoolbox.com",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": tools.map(tool => ({
      "@type": "SoftwareApplication",
      "name": tool.name,
      "description": tool.description,
      "url": `https://devtoolbox.com${tool.href}`
    }))
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-black dark:text-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 sm:text-6xl">
          DevToolbox
        </h1>
        <p className="mt-4 text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Essential utilities for developers. Fast, private, and developer-focused.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {tools.map((tool) => (
          <Link
            key={tool.name}
            href={tool.href}
            className="relative group bg-white dark:bg-gray-800 p-8 border rounded-2xl shadow-sm hover:shadow-md transition-all border-gray-100 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
          >
            <div className="text-4xl mb-4">{tool.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-gray-700 dark:group-hover:text-gray-300">
              {tool.name}
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-20 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-3xl p-12 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Why DevToolbox?</h2>
        <p className="text-gray-300 max-w-3xl mx-auto text-lg">
          We got tired of using 10-year-old websites cluttered with tracking pixels just to decode a string. DevToolbox is built for the modern engineer.
        </p>
      </div>

      <div className="my-[150px]">
        <AdSense slot="5566778899" type="responsive" />
      </div>
    </div>
  );
}

import AdSense from "@/components/AdSense";
