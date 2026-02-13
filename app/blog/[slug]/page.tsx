import { Metadata } from "next";
import Link from "next/link";

export default function BlogPost({ params }: { params: { slug: string } }) {
  // In a real app, you'd fetch this from a CMS or MDX files
  return (
    <div className="max-w-3xl mx-auto px-4 py-20">
      <Link href="/blog" className="text-gray-500 hover:text-black mb-8 inline-block">
        ← Back to blog
      </Link>
      
      <article className="prose lg:prose-xl">
        <h1 className="text-4xl font-bold mb-4">How to Safely Handle Base64 in Production</h1>
        <div className="text-gray-500 mb-8">Published on Feb 13, 2026</div>
        
        <p>
          Base64 is everywhere—from data URIs to authentication headers. But many developers treat it as "encryption," which it definitely is not. 
        </p>

        <h2 className="text-2xl font-bold mt-8 mb-4">The Performance Trap</h2>
        <p>
          Decoding large Base64 strings on the main thread can cause layout jank. In modern web apps, you should consider using Web Workers for heavy lifting...
        </p>

        <div className="bg-gray-100 p-6 rounded-xl mt-12">
          <h3 className="text-xl font-bold mb-2">Try the tool</h3>
          <p>We built a clean, client-side decoder to help you debug Base64 strings safely.</p>
          <Link href="/tools/base64" className="inline-block mt-4 px-6 py-2 bg-black text-white rounded-lg">
            Open Base64 Tool
          </Link>
        </div>
      </article>
    </div>
  );
}
