import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DevBlog | Engineering Insights & Guides",
  description: "Tips, tutorials, and deep dives into software engineering, web development, and security.",
};

const posts = [
  {
    title: "How to Safely Handle Base64 in Production",
    excerpt: "Learn the best practices for encoding and decoding binary data without compromising security or performance.",
    date: "Feb 13, 2026",
    slug: "safe-base64-production",
  },
];

export default function BlogHome() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-bold mb-12">Engineering Blog</h1>
      
      <div className="space-y-12">
        {posts.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/blog/${post.slug}`}>
              <time className="text-sm text-gray-500">{post.date}</time>
              <h2 className="text-2xl font-bold mt-2 group-hover:underline">{post.title}</h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="mt-4 font-semibold text-black">Read article →</div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
