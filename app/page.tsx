import Link from "next/link";

export default function Home() {
  const tools = [
    {
      name: "Base64 Decoder/Encoder",
      description: "Secure, client-side Base64 conversion.",
      href: "/tools/base64",
      icon: "🔡",
    },
    {
      name: "JSON Formatter",
      description: "Clean and validate your JSON strings.",
      href: "/tools/json",
      icon: "📦",
    },
    {
      name: "Epoch Converter",
      description: "Unix timestamps to human dates.",
      href: "/tools/epoch",
      icon: "🕒",
    },
    {
      name: "Cron Generator",
      description: "Generate and explain cron expressions.",
      href: "/tools/cron",
      icon: "⏰",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-black">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          DevToolbox
        </h1>
        <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto">
          Essential utilities for developers. Fast, private, and 100% ad-free.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link
            key={tool.name}
            href={tool.href}
            className="relative group bg-white p-8 border rounded-2xl shadow-sm hover:shadow-md transition-all border-gray-100 hover:border-black"
          >
            <div className="text-4xl mb-4">{tool.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-black">
              {tool.name}
            </h3>
            <p className="mt-2 text-gray-500">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-20 bg-black rounded-3xl p-12 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Why DevToolbox?</h2>
        <p className="text-gray-400 max-w-3xl mx-auto text-lg">
          We got tired of using 10-year-old websites cluttered with tracking pixels and flashing banners just to decode a string. DevToolbox is built for the modern engineer.
        </p>
      </div>
    </div>
  );
}
