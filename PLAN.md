# DevToolbox: Architecture & SEO Strategy

## 1. Tech Stack (Low Cost, High Performance)
- **Framework:** Next.js (App Router) - Critical for SEO (SSR/ISR).
- **Styling:** Tailwind CSS + Shadcn UI (Modern, dark-mode first).
- **Content:** MDX for blogs (Easy to manage, high SEO value).
- **Deployment:** Vercel or Netlify (Free tier handles high traffic well).

## 2. Utility Pages Strategy
Each utility (Base64, JSON, Epoch) will have:
- **Dedicated Route:** `/tools/base64-decode`
- **Semantic HTML:** Proper `<h1>`, `<label>`, and `aria-labels` (helps AI agents understand the tool).
- **Client-Side Processing:** All logic happens in the browser (Privacy win + Speed).

## 3. SEO & AI Optimization (AEO - Answer Engine Optimization)
To rank on **Google** and **AI Tools (ChatGPT, Perplexity)**:

### For Google:
- **Long-tail Blog Content:** Write guides like "How to decode Base64 in Python vs JavaScript" to capture high-intent traffic.
- **Core Web Vitals:** Ensure 100/100 performance scores. AI and Google both reward speed.
- **Schema Markup:** Use `SoftwareApplication` schema for the tools and `FAQPage` schema for the blogs.

### For AI Search (ChatGPT/Perplexity):
- **Structured Data:** Use JSON-LD to clearly define what the tool does.
- **Plain Language Summaries:** AI "scraps" content better when there's a clear 2-3 sentence summary of the page's utility.
- **Citations:** Link to high-authority docs (MDN, Wikipedia) in blogs; AI models love verifying facts against known sources.
- **Natural Language Headings:** Use "What is a Unix Epoch?" instead of just "Definition."

## 4. Roadmap
- [ ] Phase 1: Core Layout + Base64 Utility.
- [ ] Phase 2: JSON Formatter + Epoch Converter.
- [ ] Phase 3: MDX Blog System.
- [ ] Phase 4: Schema & SEO Meta-tag Optimization.
