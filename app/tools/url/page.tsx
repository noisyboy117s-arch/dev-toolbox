import URLTool from '@/components/URLTool';

export const metadata = {
  title: 'URL Encoder/Decoder - Free Online Tool | DevToolbox',
  description: 'Encode and decode URLs safely with our free online tool. Supports URL encoding, decoding, and Base64URL encoding. Perfect for developers working with APIs and web development.',
  keywords: ['URL encoder', 'URL decoder', 'Base64URL', 'encodeURIComponent', 'decodeURIComponent', 'online tool', 'developer tool'],
  openGraph: {
    title: 'URL Encoder/Decoder - Free Developer Tool',
    description: 'Free online URL encoder and decoder tool. Fast, secure, client-side processing.',
    type: 'website',
  },
};

export default function URLPage() {
  return (
    <div className="min-h-screen bg-white">
      <URLTool />
    </div>
  );
}
