import JWTTool from '@/components/JWTTool';

export const metadata = {
  title: 'JWT Debugger & Parser - Free Online Tool | DevToolbox',
  description: 'Decode and inspect JSON Web Tokens (JWT) with our free online debugger. View headers, payloads, signatures, and expiration times. Secure, client-side processing.',
  keywords: ['JWT debugger', 'JWT parser', 'JSON Web Token', 'token decoder', 'JWT analyzer', 'online tool', 'developer tool'],
  openGraph: {
    title: 'JWT Debugger & Parser - Free Developer Tool',
    description: 'Free online JWT debugger and parser. Decode JSON Web Tokens securely in your browser.',
    type: 'website',
  },
};

export default function JWTParse() {
  return (
    <div className="min-h-screen bg-white">
      <JWTTool />
    </div>
  );
}
