import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | DevToolbox",
  description: "DevToolbox's commitment to your privacy. No data logging, no server-side processing, just tools.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20 prose prose-slate">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Last Updated: February 13, 2026</p>

      <h2 className="text-2xl font-bold mt-12 mb-4">1. Data Sovereignty</h2>
      <p>
        Your data belongs to you. DevToolbox is designed to function as a **client-side-only** application. This means that when you use our tools (Base64 decoder, JSON formatter, etc.), the processing happens entirely within your web browser. 
      </p>
      <p>
        <strong>We do not send your input data to our servers.</strong> We do not log, store, or share the information you process through our utilities.
      </p>

      <h2 className="text-2xl font-bold mt-12 mb-4">2. Cookies and Tracking</h2>
      <p>
        We use minimal cookies for site functionality and basic, anonymous analytics (like Google Analytics or Vercel Analytics) to understand how many people visit our site and which tools are most popular. These analytics do not capture the content of what you are processing.
      </p>

      <h2 className="text-2xl font-bold mt-12 mb-4">3. Third-Party Ads</h2>
      <p>
        We may display ads through Google AdSense to keep this service free. These third-party vendors may use cookies to serve ads based on your prior visits to this website or other websites. You can opt-out of personalized advertising by visiting Google's Ads Settings.
      </p>

      <h2 className="text-2xl font-bold mt-12 mb-4">4. Security</h2>
      <p>
        Since all processing is done locally, the security of your data is as robust as your own browser and local environment. We recommend using modern, updated browsers to ensure the best performance and security.
      </p>

      <h2 className="text-2xl font-bold mt-12 mb-4">5. Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at support@devtoolbox.tools.
      </p>
    </div>
  );
}
