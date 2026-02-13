import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | DevToolbox",
  description: "Learn about the mission behind DevToolbox—providing fast, private, and ad-free utilities for the modern developer.",
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 prose prose-slate">
      <h1 className="text-4xl font-bold mb-8">About DevToolbox</h1>
      <p className="text-xl text-gray-600 leading-relaxed mb-8">
        We built DevToolbox because we were tired of using developer utilities from 2010 that are cluttered with intrusive ads, tracking scripts, and clunky interfaces.
      </p>
      
      <h2 className="text-2xl font-bold mt-12 mb-4">Our Mission</h2>
      <p>
        Our goal is to provide the fastest, most reliable, and most private developer utilities on the web. We believe that tools like Base64 decoders, JSON formatters, and Cron generators should be simple, efficient, and respect your data.
      </p>

      <h2 className="text-2xl font-bold mt-12 mb-4">Privacy First</h2>
      <p>
        Most "online" tools send your data to their servers for processing. Not us. **DevToolbox processes everything locally in your browser.** Whether you're decoding a sensitive API key or formatting a large JSON file, that data never leaves your machine.
      </p>

      <div className="bg-black text-white p-8 rounded-2xl mt-16">
        <h3 className="text-xl font-bold mb-4 text-white">Built by Developers, for Developers</h3>
        <p className="text-gray-300">
          We're constantly adding new tools and improving our existing ones. If you have a suggestion or found a bug, we'd love to hear from you.
        </p>
      </div>
    </div>
  );
}
