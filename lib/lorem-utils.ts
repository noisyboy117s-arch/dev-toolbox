export interface LoremOptions {
  type: 'words' | 'sentences' | 'paragraphs';
  count: number;
  startWithLorem: boolean;
}

const words = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
  'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
  'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
  'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
  'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
  'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
  'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum', 'at', 'vero', 'eos',
  'accusamus', 'accusantium', 'doloremque', 'laudantium', 'totam', 'rem',
  'aperiam', 'eaque', 'ipsa', 'quae', 'ab', 'illo', 'inventore', 'veritatis',
  'et', 'quasi', 'architecto', 'beatae', 'vitae', 'dicta', 'sunt', 'explicabo',
  'nemo', 'ipsam', 'voluptatem', 'quia', 'voluptas', 'aspernatur', 'aut',
  'odit', 'aut', 'fugit', 'sed', 'quia', 'consequuntur', 'magni', 'dolores',
  'ratione', 'sequi', 'nesciunt', 'neque', 'porro', 'quisquam', 'est',
  'labore', 'et', 'dolore', 'magnam', 'aliquam', 'quaerat', 'voluptatem',
  'ut', 'enim', 'ad', 'minima', 'veniam', 'quis', 'nostrum', 'exercitationem',
  'ullam', 'corporis', 'suscipit', 'laboriosam', 'nisi', 'aliquid', 'ex',
  'ea', 'commodi', 'consequatur', 'quis', 'autem', 'vel', 'eum', 'iure',
  'reprehenderit', 'qui', 'ea', 'voluptate', 'velit', 'esse', 'quam', 'nihil',
  'molestiae', 'consequatur', 'vel', 'illum', 'dolorem', 'eum', 'fugiat',
  'quo', 'voluptas', 'nulla', 'pariatur', 'at', 'vero', 'accusamus', 'accusantium',
  'doloremque', 'laudantium', 'totam', 'rem', 'aperiam', 'eaque', 'ipsa',
  'quae', 'ab', 'illo', 'inventore', 'veritatis', 'et', 'quasi', 'architecto',
  'beatae', 'vitae', 'dicta', 'sunt', 'explicabo', 'nemo', ' enim', 'ipsam',
  'voluptatem', 'quia', 'voluptas', 'aspernatur', 'aut', 'odit', 'aut',
  'fugit', 'sed', 'quia', 'consequuntur', 'magni', 'dolores', 'eos', 'qui',
  'ratione', 'voluptatem', 'sequi', 'nesciunt', 'neque', 'porro', 'quisquam',
  'est', 'qui', 'dolorem', 'ipsum', 'quia', 'dolor', 'sit', 'amet',
  'consectetur', 'adipisci', 'velit', 'sed', 'quia', 'non', 'numquam', 'eius',
  'modi', 'tempora', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magnam',
  'aliquam', 'quaerat', 'voluptatem', 'ut', 'enim', 'ad', 'minima', 'veniam',
  'quis', 'nostrum', 'exercitationem', 'ullam', 'corporis', 'suscipit',
  'laboriosam', 'nisi', 'aliquid', 'ex', 'ea', 'commodi', 'consequatur', 'quis',
  'autem', 'vel', 'eum', 'iure', 'reprehenderit', 'qui', 'in', 'ea', 'voluptate',
  'velit', 'esse', 'quam', 'nihil', 'molestiae', 'consequatur', 'vel', 'illum',
  'dolorem', 'eum', 'fugiat', 'quo', 'voluptas', 'nulla', 'pariatur'
];

const sentenceTemplates = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit.',
  'At vero eos et accusamus et iusto odio dignissimos ducimus.',
  'Et harum quidem rerum facilis est et expedita distinctio.',
  'Temporibus autem quibusdam et aut officiis debitis aut rerum.'
];

export function generateLorem(options: LoremOptions): string {
  const { type, count, startWithLorem } = options;
  
  switch (type) {
    case 'words':
      return generateWords(count, startWithLorem);
    case 'sentences':
      return generateSentences(count, startWithLorem);
    case 'paragraphs':
      return generateParagraphs(count, startWithLorem);
    default:
      return '';
  }
}

function generateWords(count: number, startWithLorem: boolean): string {
  if (count <= 0) return '';
  
  let result: string[] = [];
  
  if (startWithLorem && count > 0) {
    result.push('Lorem');
    if (count > 1) result.push('ipsum');
    if (count > 2) result.push('dolor');
    if (count > 3) result.push('sit');
    if (count > 4) result.push('amet');
  }
  
  while (result.length < count) {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    if (!result.includes(randomWord) || result.length > words.length / 2) {
      result.push(randomWord);
    }
  }
  
  return result.slice(0, count).join(' ');
}

function generateSentences(count: number, startWithLorem: boolean): string {
  if (count <= 0) return '';
  
  let sentences: string[] = [];
  
  if (startWithLorem && count > 0) {
    sentences.push(sentenceTemplates[0]);
  }
  
  while (sentences.length < count) {
    const template = sentenceTemplates[Math.floor(Math.random() * sentenceTemplates.length)];
    if (!sentences.includes(template) || sentences.length > sentenceTemplates.length / 2) {
      sentences.push(template);
    }
  }
  
  return sentences.slice(0, count).join(' ');
}

function generateParagraphs(count: number, startWithLorem: boolean): string {
  if (count <= 0) return '';
  
  const paragraphs: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const sentencesInParagraph = Math.floor(Math.random() * 4) + 3; // 3-6 sentences per paragraph
    const sentences = generateSentences(
      sentencesInParagraph,
      startWithLorem && i === 0
    );
    paragraphs.push(sentences);
  }
  
  return paragraphs.join('\n\n');
}

export function getLoremStats(text: string): {
  words: number;
  sentences: number;
  paragraphs: number;
  characters: number;
  charactersNoSpaces: number;
} {
  const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0).length;
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, '').length;
  
  return {
    words,
    sentences,
    paragraphs,
    characters,
    charactersNoSpaces
  };
}

export const commonPhrases = {
  design: [
    'Design is not just what it looks like and feels like. Design is how it works.',
    'Good design is obvious. Great design is transparent.',
    'Simplicity is the ultimate sophistication.',
    'Design creates culture. Culture shapes values.',
    'The details are not the details. They make the design.'
  ],
  development: [
    'Code is like humor. When you have to explain it, it\'s bad.',
    'First, solve the problem. Then, write the code.',
    'The best way to predict the future is to implement it.',
    'Make it work, make it right, make it fast.',
    'Programs must be written for people to read, and only incidentally for machines.'
  ],
  business: [
    'The customer is always right.',
    'Business opportunities are like buses, there\'s always another one coming.',
    'Your most unhappy customers are your greatest source of learning.',
    'Chase the vision, not the money.',
    'The way to get started is to quit talking and begin doing.'
  ]
};

export function generateCustomText(category: keyof typeof commonPhrases, count: number): string {
  const phrases = commonPhrases[category];
  const selected: string[] = [];
  
  for (let i = 0; i < count; i++) {
    const phrase = phrases[Math.floor(Math.random() * phrases.length)];
    if (!selected.includes(phrase) || selected.length >= phrases.length) {
      selected.push(phrase);
    }
  }
  
  return selected.slice(0, count).join('\n\n');
}
