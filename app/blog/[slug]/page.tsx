import { Metadata } from "next";
import Link from "next/link";
import { posts } from "@/lib/blog-data";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return { title: 'Post Not Found' };
  
  return {
    title: `${post.title} | DevToolbox Blog`,
    description: post.description,
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-black">
      <Link href="/blog" className="text-gray-500 hover:text-black mb-8 inline-block">
        ← Back to blog
      </Link>
      
      <article className="prose lg:prose-xl max-w-none">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-500 mb-8">Published on {post.date}</div>
        
        <div dangerouslySetInnerHTML={{ __html: post.content }} />

        <div className="bg-gray-100 p-6 rounded-xl mt-12">
          <h3 className="text-xl font-bold mb-2">Try our tools</h3>
          <p>We build clean, client-side tools to help developers be more productive.</p>
          <div className="flex gap-4 mt-4">
            <Link href="/tools/json" className="px-4 py-2 bg-black text-white rounded-lg text-sm">
              JSON Formatter
            </Link>
            <Link href="/tools/epoch" className="px-4 py-2 bg-black text-white rounded-lg text-sm">
              Epoch Converter
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
