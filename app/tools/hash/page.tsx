import HashTool from '@/components/HashTool';

export const metadata = {
  title: 'Hash Generator - SHA-256, SHA-512, MD5 | DevToolbox',
  description: 'Generate secure cryptographic hashes online. Supports SHA-256, SHA-512, SHA-1, and MD5 algorithms. Fast, free, client-side processing.',
  keywords: ['hash generator', 'SHA-256', 'SHA-512', 'MD5', 'SHA-1', 'cryptographic hash', 'online tool', 'developer tool'],
  openGraph: {
    title: 'Hash Generator - Free Online Tool',
    description: 'Generate SHA-256, SHA-512, SHA-1, and MD5 hashes securely in your browser.',
    type: 'website',
  },
};

export default function HashPage() {
  return (
    <div className="min-h-screen bg-white">
      <HashTool />
    </div>
  );
}
