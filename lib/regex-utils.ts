export interface RegexMatch {
  match: string;
  start: number;
  end: number;
  groups?: string[];
}

export interface RegexTestResult {
  isValid: boolean;
  matches: RegexMatch[];
  error?: string;
}

export function testRegex(pattern: string, flags: string, text: string): RegexTestResult {
  try {
    const regex = new RegExp(pattern, flags);
    const matches: RegexMatch[] = [];
    let match;

    while ((match = regex.exec(text)) !== null) {
      matches.push({
        match: match[0],
        start: match.index,
        end: match.index + match[0].length,
        groups: match.slice(1)
      });
    }

    return {
      isValid: true,
      matches
    };
  } catch (error) {
    return {
      isValid: false,
      matches: [],
      error: error instanceof Error ? error.message : 'Invalid regex pattern'
    };
  }
}

export function getRegexFlags(): { flag: string; description: string }[] {
  return [
    { flag: 'g', description: 'Global - Find all matches rather than stopping after the first match' },
    { flag: 'i', description: 'Case Insensitive - Match without regard to case' },
    { flag: 'm', description: 'Multiline - Treat beginning and end characters (^ and $) as working over multiple lines' },
    { flag: 's', description: 'Dot All - Allows the dot (.) to match newline characters' },
    { flag: 'u', description: 'Unicode - Treat pattern as a sequence of Unicode code points' },
    { flag: 'y', description: 'Sticky - Matches only from the index indicated by the lastIndex property' }
  ];
}

export function getCommonRegexPatterns(): { name: string; pattern: string; description: string }[] {
  return [
    {
      name: 'Email',
      pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
      description: 'Matches most email addresses'
    },
    {
      name: 'URL',
      pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&\\/\\/=]*)',
      description: 'Matches HTTP and HTTPS URLs'
    },
    {
      name: 'Phone Number (US)',
      pattern: '\\(?([0-9]{3})\\)?[-.\\s]?([0-9]{3})[-.\\s]?([0-9]{4})',
      description: 'Matches US phone numbers in various formats'
    },
    {
      name: 'IPv4 Address',
      pattern: '\\b(?:[0-9]{1,3}\\.){3}[0-9]{1,3}\\b',
      description: 'Matches IPv4 addresses'
    },
    {
      name: 'Hex Color',
      pattern: '#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})',
      description: 'Matches hex color codes'
    },
    {
      name: 'Date (YYYY-MM-DD)',
      pattern: '\\d{4}-\\d{2}-\\d{2}',
      description: 'Matches dates in YYYY-MM-DD format'
    },
    {
      name: 'Username',
      pattern: '[a-zA-Z0-9_]{3,20}',
      description: 'Matches usernames with 3-20 alphanumeric characters and underscores'
    },
    {
      name: 'HTML Tags',
      pattern: '<([a-z][a-z0-9]*)(?:[^>]*)>(.*?)<\\/\\1>',
      description: 'Matches HTML opening and closing tags'
    }
  ];
}

export function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
}
