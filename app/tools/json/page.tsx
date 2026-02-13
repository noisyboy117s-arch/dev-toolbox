import JSONTool from "@/components/JSONTool";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator | DevToolbox",
  description: "Free online JSON formatter and validator. Clean, beautify, and validate your JSON data instantly. Secure and client-side only.",
  keywords: ["json formatter", "json validator", "beautify json", "online json tool", "developer utility"],
};

export default function JSONPage() {
  return (
    <div className="py-12">
      <JSONTool />
      
      <section className="max-w-4xl mx-auto px-8 mt-16 prose prose-slate text-black">
        <h2 className="text-2xl font-bold mb-4">What is JSON Formatter?</h2>
        <p className="text-gray-700 mb-4">
          JSON (JavaScript Object Notation) is a lightweight data-interchange format. It is easy for humans to read and write and easy for machines to parse and generate. Our JSON Formatter helps you make minified or messy JSON data readable by adding proper indentation and line breaks.
        </p>
        <h3 className="text-xl font-semibold mb-2">Features of our JSON tool</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li><strong>Formatting:</strong> Pretty-print your JSON with custom indentation.</li>
          <li><strong>Validation:</strong> Instant syntax checking to ensure your JSON is valid.</li>
          <li><strong>Privacy:</strong> All processing is done in your browser. Your data stays on your machine.</li>
          <li><strong>Minification:</strong> Easily compress your JSON for production use.</li>
        </ul>
      </section>
    </div>
  );
}
