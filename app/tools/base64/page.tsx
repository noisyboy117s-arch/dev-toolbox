import Base64Tool from "@/app/base64-tool";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Modern Base64 Decoder/Encoder | DevToolbox",
  description: "Secure, client-side Base64 decoding and encoding tool. Convert strings instantly without your data leaving your browser.",
  keywords: ["base64 decode", "base64 encode", "online base64 tool", "developer utility"],
};

export default function Base64Page() {
  return (
    <div className="py-12">
      <Base64Tool />
      
      <section className="max-w-4xl mx-auto px-8 mt-16 prose prose-slate">
        <h2 className="text-2xl font-bold mb-4">What is Base64?</h2>
        <p className="text-gray-700 mb-4">
          Base64 is a group of binary-to-text encoding schemes that represent binary data in an ASCII string format by translating it into a radix-64 representation. It is commonly used when there is a need to encode binary data that needs to be stored and transferred over media that are designed to deal with textual data.
        </p>
        <h3 className="text-xl font-semibold mb-2">Why use our tool?</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li><strong>Privacy First:</strong> Your data is processed locally in your browser. We never see your strings.</li>
          <li><strong>Fast:</strong> Instant conversion as you type or click.</li>
          <li><strong>Ad-Free:</strong> Clean, minimalist interface designed for productivity.</li>
        </ul>
      </section>
    </div>
  );
}
