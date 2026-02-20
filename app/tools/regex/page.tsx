import RegexTool from '@/components/RegexTool';

export const metadata = {
  title: 'Regex Tester - Free Online Tool | DevToolbox',
  description: 'Test regular expressions with real-time highlighting. Common patterns, flags, and detailed match information. Free, client-side regex testing tool.',
  keywords: ['regex tester', 'regular expression', 'regex pattern', 'online regex', 'pattern matching', 'developer tool'],
  openGraph: {
    title: 'Regex Tester - Free Developer Tool',
    description: 'Test and debug regular expressions with real-time highlighting and match details.',
    type: 'website',
  },
};

export default function RegexPage() {
  return (
    <div className="min-h-screen bg-white">
      <RegexTool />
    </div>
  );
}
