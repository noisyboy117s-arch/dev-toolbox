import { Metadata } from 'next';
import Base64Tool from '@/components/Base64Tool';
import SEOHead from '@/components/SEOHead';
import { generateToolSchema, generateHowToSchema, generateFAQSchema, getToolSchema, generateToolFAQs } from '@/lib/schema-generators';

export const metadata: Metadata = {
  title: 'Base64 Decoder/Encoder - Free Online Tool | DevToolbox',
  description: 'Fast, secure, client-side Base64 encoding and decoding tool. Convert text and files to Base64 format instantly. No data sent to servers - 100% private.',
  keywords: 'base64, encode, decode, converter, text encoding, file encoding, base64 decoder, base64 encoder, online tool',
  authors: [{ name: 'DevToolbox' }],
  creator: 'DevToolbox',
  publisher: 'DevToolbox',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://devtoolbox.com'),
  alternates: {
    canonical: '/base64-tool',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://devtoolbox.com/base64-tool',
    title: 'Base64 Decoder/Encoder - Free Online Tool',
    description: 'Fast, secure, client-side Base64 encoding and decoding tool. Convert text and files to Base64 format instantly.',
    siteName: 'DevToolbox',
    images: [
      {
        url: 'https://devtoolbox.com/og-base64-tool.png',
        width: 1200,
        height: 630,
        alt: 'Base64 Decoder/Encoder Tool - DevToolbox',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base64 Decoder/Encoder - Free Online Tool',
    description: 'Fast, secure, client-side Base64 encoding and decoding tool. Convert text and files to Base64 format instantly.',
    images: ['https://devtoolbox.com/og-base64-tool.png'],
    creator: '@devtoolbox',
    site: '@devtoolbox',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
};

export default function Base64ToolPage() {
  const toolSchema = getToolSchema('base64-tool');
  const toolFAQs = generateToolFAQs('base64-tool');
  
  const schemas = [];
  
  if (toolSchema) {
    schemas.push(generateToolSchema(toolSchema));
    schemas.push(generateHowToSchema(toolSchema));
  }
  
  if (toolFAQs.length > 0) {
    schemas.push(generateFAQSchema(toolFAQs));
  }

  return (
    <>
      <SEOHead
        title="Base64 Decoder/Encoder"
        description="Fast, secure, client-side Base64 encoding and decoding tool. Convert text and files to Base64 format instantly. No data sent to servers - 100% private."
        canonical="/base64-tool"
        ogImage="/og-base64-tool.png"
        keywords="base64, encode, decode, converter, text encoding, file encoding, base64 decoder, base64 encoder, online tool"
        schema={schemas}
      />
      <Base64Tool />
    </>
  );
}
