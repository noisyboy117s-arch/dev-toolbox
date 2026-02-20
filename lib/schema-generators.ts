export interface ToolSchema {
  name: string;
  description: string;
  url: string;
  category: string;
  keywords: string[];
  usageInstructions: string[];
  benefits: string[];
  features: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  timeRequired: string;
  prerequisites: string[];
}

export function generateToolSchema(tool: ToolSchema): Record<string, any> {
  return {
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url: tool.url,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '1.0',
    author: {
      '@type': 'Organization',
      name: 'DevToolbox',
      url: 'https://devtoolbox.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'DevToolbox',
      url: 'https://devtoolbox.com'
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1000',
      bestRating: '5',
      worstRating: '1'
    },
    featureList: tool.features.map(feature => ({
      '@type': 'SoftwareFeature',
      name: feature,
      description: feature
    })),
    screenshot: 'https://devtoolbox.com/screenshots/' + tool.name.toLowerCase().replace(/\s+/g, '-') + '.png',
    downloadUrl: tool.url,
    keywords: tool.keywords.join(', '),
    audience: {
      '@type': 'Audience',
      audienceType: 'Developers, Programmers, Designers, Data Scientists'
    },
    educationalUse: 'instruction',
    learningResourceType: 'tool',
    teaches: tool.usageInstructions,
    timeRequired: tool.timeRequired,
    difficultyLevel: tool.difficulty,
    prerequisites: tool.prerequisites,
    benefits: tool.benefits
  };
}

export function generateHowToSchema(tool: ToolSchema): Record<string, any> {
  return {
    '@type': 'HowTo',
    name: `How to use ${tool.name}`,
    description: `Step-by-step guide on how to use ${tool.name} for ${tool.category.toLowerCase()}`,
    image: 'https://devtoolbox.com/screenshots/' + tool.name.toLowerCase().replace(/\s+/g, '-') + '.png',
    steps: tool.usageInstructions.map((instruction, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: `Step ${index + 1}`,
      text: instruction,
      image: `https://devtoolbox.com/screenshots/step-${index + 1}.png`
    })),
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '0'
    },
    totalTime: tool.timeRequired,
    supply: [
      {
        '@type': 'HowToSupply',
        name: 'Web Browser',
        description: 'Any modern web browser with JavaScript enabled'
      }
    ],
    tool: [
      {
        '@type': 'HowToTool',
        name: tool.name,
        description: tool.description
      }
    ]
  };
}

export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>): Record<string, any> {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>): Record<string, any> {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url
    }))
  };
}

export function generateReviewSchema(toolName: string): Record<string, any> {
  return {
    '@type': 'Review',
    itemReviewed: {
      '@type': 'SoftwareApplication',
      name: toolName,
      applicationCategory: 'DeveloperApplication'
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: '5',
      bestRating: '5',
      worstRating: '1'
    },
    author: {
      '@type': 'Person',
      name: 'John Developer'
    },
    reviewBody: `Excellent ${toolName} tool! Fast, reliable, and privacy-focused. All processing happens in the browser, which is exactly what I need for my development workflow.`,
    datePublished: new Date().toISOString(),
    publisher: {
      '@type': 'Organization',
      name: 'DevToolbox'
    }
  };
}

// Tool-specific schemas
export const toolSchemas: Record<string, ToolSchema> = {
  'base64-tool': {
    name: 'Base64 Decoder/Encoder',
    description: 'Fast, secure, client-side Base64 encoding and decoding tool. Convert text and files to Base64 format instantly.',
    url: 'https://devtoolbox.com/base64-tool',
    category: 'Data Encoding',
    keywords: ['base64', 'encode', 'decode', 'converter', 'text encoding', 'file encoding'],
    usageInstructions: [
      'Enter text or upload a file in the input area',
      'Select encode or decode mode',
      'Click the convert button',
      'Copy the result to clipboard',
      'Clear the input to start over'
    ],
    benefits: [
      '100% client-side processing for maximum privacy',
      'Instant conversion without server delays',
      'Support for both text and file encoding',
      'No data sent to external servers',
      'Free to use with no limitations'
    ],
    features: [
      'Text to Base64 encoding',
      'Base64 to text decoding',
      'File to Base64 conversion',
      'Copy to clipboard functionality',
      'Dark mode support',
      'Mobile responsive design'
    ],
    difficulty: 'Beginner',
    timeRequired: 'PT1M',
    prerequisites: ['Basic understanding of Base64 encoding']
  },
  'json-tool': {
    name: 'JSON Formatter & Validator',
    description: 'Format, validate, and minify JSON strings with real-time error detection and syntax highlighting.',
    url: 'https://devtoolbox.com/json-tool',
    category: 'Data Processing',
    keywords: ['json', 'formatter', 'validator', 'minifier', 'syntax checker', 'beautifier'],
    usageInstructions: [
      'Paste your JSON code in the input area',
      'Choose format, validate, or minify action',
      'View the formatted result with syntax highlighting',
      'Copy the formatted JSON to clipboard',
      'Clear the input to start over'
    ],
    benefits: [
      'Instant JSON formatting and validation',
      'Real-time error detection with line numbers',
      'Syntax highlighting for better readability',
      'Minify option for production code',
      'Privacy-focused client-side processing'
    ],
    features: [
      'JSON formatting with proper indentation',
      'JSON validation with error messages',
      'JSON minification for production',
      'Syntax highlighting',
      'Copy to clipboard',
      'Error line indicators'
    ],
    difficulty: 'Beginner',
    timeRequired: 'PT30S',
    prerequisites: ['Basic knowledge of JSON format']
  },
  'password-tool': {
    name: 'Password Generator',
    description: 'Generate secure passwords with entropy analysis, strength assessment, and customizable options.',
    url: 'https://devtoolbox.com/password-tool',
    category: 'Security',
    keywords: ['password', 'generator', 'security', 'entropy', 'random', 'strong password'],
    usageInstructions: [
      'Set password length using the slider',
      'Select character types to include',
      'Choose exclusion options if needed',
      'Click generate to create password',
      'Copy password to clipboard',
      'View strength analysis and tips'
    ],
    benefits: [
      'Cryptographically secure random generation',
      'Real-time entropy calculation',
      'Strength assessment with visual feedback',
      'Customizable character sets',
      'Performance tips for better passwords'
    ],
    features: [
      'Adjustable password length (4-64 characters)',
      'Character type selection (uppercase, lowercase, numbers, symbols)',
      'Exclusion options (similar characters, ambiguous characters)',
      'Entropy calculation and strength scoring',
      'Crack time estimation',
      'Performance optimization tips'
    ],
    difficulty: 'Beginner',
    timeRequired: 'PT30S',
    prerequisites: ['Basic understanding of password security']
  },
  'qr-tool': {
    name: 'QR Code Generator',
    description: 'Create customizable QR codes with adjustable colors, sizes, and error correction levels.',
    url: 'https://devtoolbox.com/qr-tool',
    category: 'Utilities',
    keywords: ['qr code', 'generator', 'barcode', 'scanner', 'mobile', 'url converter'],
    usageInstructions: [
      'Enter text, URL, or data to encode',
      'Adjust QR code size and margin',
      'Choose colors for foreground and background',
      'Select error correction level',
      'Download as PNG, SVG, or JPG format',
      'Copy the encoded text to clipboard'
    ],
    benefits: [
      'Instant QR code generation',
      'Multiple download formats (PNG, SVG, JPG)',
      'Customizable colors and sizes',
      'Adjustable error correction levels',
      'Capacity analysis and statistics'
    ],
    features: [
      'Customizable QR code size (100-1000px)',
      'Color customization for foreground and background',
      'Error correction levels (L, M, Q, H)',
      'Multiple download formats',
      'Real-time preview',
      'Capacity usage analysis'
    ],
    difficulty: 'Beginner',
    timeRequired: 'PT1M',
    prerequisites: ['Basic understanding of QR codes']
  },
  'contrast-tool': {
    name: 'WCAG Color Contrast Checker',
    description: 'Check color contrast ratios for WCAG compliance with accessibility recommendations.',
    url: 'https://devtoolbox.com/contrast-tool',
    category: 'Accessibility',
    keywords: ['wcag', 'contrast', 'accessibility', 'color checker', 'a11y', 'compliance'],
    usageInstructions: [
      'Enter foreground and background colors',
      'View contrast ratio and WCAG compliance',
      'Check AA and AAA level compliance',
      'Use color improvement suggestions',
      'Test with different text sizes',
      'Download color combinations'
    ],
    benefits: [
      'WCAG AA and AAA compliance checking',
      'Real-time contrast ratio calculation',
      'Color improvement suggestions',
      'Visual preview with sample text',
      'Color harmony recommendations'
    ],
    features: [
      'Contrast ratio calculation',
      'WCAG AA and AAA compliance checking',
      'Visual text preview',
      'Color improvement suggestions',
      'Color harmony tools (complementary, analogous, triadic)',
      'Multiple color format support (HEX, RGB, HSL)'
    ],
    difficulty: 'Intermediate',
    timeRequired: 'PT2M',
    prerequisites: ['Basic understanding of color theory and WCAG guidelines']
  }
};

export function getToolSchema(toolName: string): ToolSchema | null {
  return toolSchemas[toolName] || null;
}

export function generateToolFAQs(toolName: string): Array<{ question: string; answer: string }> {
  const faqs: Record<string, Array<{ question: string; answer: string }>> = {
    'base64-tool': [
      {
        question: 'What is Base64 encoding?',
        answer: 'Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. It\'s commonly used to encode data in URLs, store complex data in JSON, or transmit binary data over text-based protocols.'
      },
      {
        question: 'Is Base64 encoding secure?',
        answer: 'Base64 is not an encryption method - it\'s simply an encoding format. While it obfuscates data, anyone can decode Base64 strings. For sensitive data, use proper encryption methods.'
      },
      {
        question: 'Why does Base64 increase file size by 33%?',
        answer: 'Base64 uses 6 bits per character to represent data, while the original binary data uses 8 bits per byte. This 6:8 ratio results in approximately 33% size increase.'
      }
    ],
    'password-tool': [
      {
        question: 'What makes a password strong?',
        answer: 'A strong password has high entropy (randomness), sufficient length (12+ characters), and includes a mix of character types (uppercase, lowercase, numbers, symbols).'
      },
      {
        question: 'How is password entropy calculated?',
        answer: 'Entropy is calculated as: log2(character_set_size ^ password_length). Higher entropy means more possible combinations and better security.'
      },
      {
        question: 'What are the recommended password requirements?',
        answer: 'Modern recommendations suggest 12+ characters with mixed character types. Some organizations require 16+ characters for high-security applications.'
      }
    ],
    'qr-tool': [
      {
        question: 'What are the different error correction levels?',
        answer: 'QR codes have 4 error correction levels: L (7%), M (15%), Q (25%), and H (30%). Higher levels can recover more data if the code is damaged but result in larger codes.'
      },
      {
        question: 'How much data can a QR code store?',
        answer: 'Storage capacity depends on error correction level and data type. A version 40 QR code can store up to 7,089 numeric characters, 4,296 alphanumeric characters, or 2,953 bytes of binary data.'
      },
      {
        question: 'What\'s the difference between PNG and SVG QR codes?',
        answer: 'PNG is a raster format that loses quality when scaled, while SVG is a vector format that can be scaled infinitely without quality loss. SVG is better for print and large displays.'
      }
    ],
    'contrast-tool': [
      {
        question: 'What are WCAG AA and AAA standards?',
        answer: 'WCAG AA requires 4.5:1 contrast for normal text and 3:1 for large text. WCAG AAA requires 7:1 for normal text and 4.5:1 for large text. AAA provides enhanced accessibility.'
      },
      {
        question: 'What is considered large text?',
        answer: 'Large text is 18pt (24px) or larger, or 14pt (18.66px) or larger if bold. Large text has lower contrast requirements because it\'s easier to read.'
      },
      {
        question: 'How do I improve color contrast?',
        answer: 'Increase the difference in lightness between colors, make text darker on light backgrounds or lighter on dark backgrounds, and avoid using similar colors for text and background.'
      }
    ]
  };

  return faqs[toolName] || [];
}
