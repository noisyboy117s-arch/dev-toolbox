import ColorTool from '@/components/ColorTool';

export const metadata = {
  title: 'Color Picker & Converter - HEX, RGB, HSL | DevToolbox',
  description: 'Free online color picker with HEX, RGB, and HSL conversion. Real-time preview, contrast checker, and color history. Developer-friendly tool.',
  keywords: ['color picker', 'hex converter', 'rgb converter', 'hsl converter', 'color tool', 'web design', 'developer tool'],
  openGraph: {
    title: 'Color Picker & Converter - Free Developer Tool',
    description: 'Convert colors between HEX, RGB, and HSL formats with real-time preview.',
    type: 'website',
  },
};

export default function ColorPage() {
  return (
    <div className="min-h-screen bg-white">
      <ColorTool />
    </div>
  );
}
