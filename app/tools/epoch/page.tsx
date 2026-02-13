import EpochTool from "@/components/EpochTool";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Epoch Converter | DevToolbox",
  description: "Convert Unix timestamps to human-readable dates and vice-versa. Supports seconds and milliseconds.",
  keywords: ["epoch converter", "unix timestamp", "date to epoch", "epoch to date", "online tool"],
};

export default function EpochPage() {
  return (
    <div className="py-12">
      <EpochTool />
      
      <section className="max-w-4xl mx-auto px-8 mt-16 prose prose-slate text-black">
        <h2 className="text-2xl font-bold mb-4">What is Unix Time?</h2>
        <p className="text-gray-700 mb-4">
          Unix time (also known as Epoch time) is a system for describing a point in time. It is the number of seconds that have elapsed since the Unix epoch, minus leap seconds; the Unix epoch is 00:00:00 UTC on 1 January 1970.
        </p>
        <h3 className="text-xl font-semibold mb-2">How to use this tool?</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-700">
          <li><strong>Timestamp to Date:</strong> Enter a Unix timestamp (seconds or milliseconds) to see the human-readable UTC and Local date.</li>
          <li><strong>Date to Timestamp:</strong> Enter a date string or use the current time to get the Unix epoch value.</li>
          <li><strong>Real-time:</strong> The tool shows the current Unix timestamp updating every second.</li>
        </ul>
      </section>
    </div>
  );
}
