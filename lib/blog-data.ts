export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  content: string;
}

export const posts: Post[] = [
  {
    slug: 'safely-handle-base64',
    title: 'How to Safely Handle Base64 in Production',
    date: '2026-02-13',
    description: 'Learn the best practices for Base64 encoding and decoding in modern web applications.',
    content: `
      <p>Base64 is everywhere—from data URIs to authentication headers. But many developers treat it as "encryption," which it definitely is not.</p>
      <h2 class="text-2xl font-bold mt-8 mb-4">The Performance Trap</h2>
      <p>Decoding large Base64 strings on the main thread can cause layout jank. In modern web apps, you should consider using Web Workers for heavy lifting...</p>
    `,
  },
  {
    slug: 'json-best-practices-2026',
    title: 'JSON Best Practices for Modern Developers in 2026',
    date: '2026-02-13',
    description: 'Why valid JSON is more important than ever in the age of AI and Large Language Models.',
    content: `
      <p>JSON has become the lingua franca of the web. As we move deeper into the age of AI-driven development, the structure and validity of your JSON data are more critical than ever.</p>
      <h2 class="text-2xl font-bold mt-8 mb-4">Why AI Needs Clean JSON</h2>
      <p>When prompts return structured data, small syntax errors can break your entire automation pipeline. Validating and formatting JSON before ingestion is now a non-negotiable step.</p>
      <h2 class="text-2xl font-bold mt-8 mb-4">Tool Spotlight: JSON Formatter</h2>
      <p>Use our JSON Formatter to quickly debug and validate your data before feeding it to your models.</p>
    `,
  },
  {
    slug: 'mastering-unix-timestamps',
    title: 'Mastering Unix Timestamps: Seconds vs Milliseconds',
    date: '2026-02-13',
    description: 'A guide to understanding epoch time and avoiding common pitfalls in distributed systems.',
    content: `
      <p>Unix time is simple in theory but tricky in practice. The most common mistake? Mixing up seconds and milliseconds.</p>
      <h2 class="text-2xl font-bold mt-8 mb-4">The 10-Digit Rule</h2>
      <p>Generally, if your timestamp has 10 digits, it's in seconds. If it has 13 digits, it's in milliseconds. Distributed systems often prefer microseconds (16 digits), especially in high-frequency trading or logging.</p>
      <h2 class="text-2xl font-bold mt-8 mb-4">UTC is Your Best Friend</h2>
      <p>Always store timestamps in UTC. Convert to local time only at the edge of your application (the UI).</p>
    `,
  },
  {
    slug: 'simplifying-cron-jobs',
    title: 'Simplifying Cron Jobs for Complex Schedules',
    date: '2026-02-13',
    description: 'Stop guessing cron expressions. Learn how to build reliable schedules for your background tasks.',
    content: `
      <p>Cron expressions are powerful but notoriously hard to read. A single misplaced asterisk can lead to a server meltdown if a task runs every second instead of every hour.</p>
      <h2 class="text-2xl font-bold mt-8 mb-4">Standard vs Non-Standard Cron</h2>
      <p>Be aware that different platforms (AWS Lambda, Google Cloud Scheduler, Jenkins) have slightly different cron implementations. Always test your expression in the specific environment.</p>
      <h2 class="text-2xl font-bold mt-8 mb-4">Human-Readable Cron</h2>
      <p>When documenting your code, always include a human-readable comment above your cron expression. Better yet, use a generator to visualize the schedule.</p>
    `,
  }
];
