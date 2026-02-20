import UUIDTool from '@/components/UUIDTool';

export const metadata = {
  title: 'UUID Generator - Free Online Tool | DevToolbox',
  description: 'Generate RFC4122 version 4 UUIDs instantly. Create single or multiple unique identifiers with validation and parsing. Free, secure, client-side tool.',
  keywords: ['UUID generator', 'GUID generator', 'unique identifier', 'RFC4122', 'version 4 UUID', 'online tool', 'developer tool'],
  openGraph: {
    title: 'UUID Generator - Free Developer Tool',
    description: 'Generate UUIDs and GUIDs online. Validate and parse UUIDs with detailed information.',
    type: 'website',
  },
};

export default function UUIDPage() {
  return (
    <div className="min-h-screen bg-white">
      <UUIDTool />
    </div>
  );
}
