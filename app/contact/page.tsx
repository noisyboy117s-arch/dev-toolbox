import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | DevToolbox",
  description: "Get in touch with the DevToolbox team for feedback, support, or feature requests.",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-8">Contact Us</h1>
      <p className="text-lg text-gray-600 mb-12">
        Have a question, feedback, or a suggestion for a new tool? We'd love to hear from you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-xl font-bold mb-4">Email</h2>
          <p className="text-gray-600 mb-2">For general inquiries and support:</p>
          <a href="mailto:support@devtoolbox.tools" className="text-blue-600 hover:underline font-semibold">
            support@devtoolbox.tools
          </a>

          <h2 className="text-xl font-bold mt-8 mb-4">Open Source</h2>
          <p className="text-gray-600 mb-2">Report bugs or contribute on GitHub:</p>
          <a href="https://github.com/noisyboy117s-arch/dev-toolbox" className="text-blue-600 hover:underline font-semibold">
            Visit GitHub Repository
          </a>
        </div>

        <div className="bg-gray-50 p-8 rounded-2xl border">
          <h2 className="text-xl font-bold mb-4">Quick Feedback</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Message</label>
              <textarea rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 border" placeholder="Tell us what's on your mind..."></textarea>
            </div>
            <button type="submit" className="w-full bg-black text-white py-2 px-4 rounded-md font-semibold hover:bg-gray-800 transition">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
