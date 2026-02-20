export interface FormatOptions {
  uppercase: boolean;
  commaFirst: boolean;
  indentSize: number;
  keywordStyle: 'upper' | 'lower' | 'capitalize';
}

export interface FormatResult {
  success: boolean;
  formatted?: string;
  error?: string;
}

const SQL_KEYWORDS = [
  'SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN',
  'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE', 'CREATE', 'TABLE',
  'ALTER', 'DROP', 'INDEX', 'PRIMARY', 'KEY', 'FOREIGN', 'REFERENCES',
  'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL', 'OUTER', 'ON', 'AS', 'GROUP',
  'BY', 'HAVING', 'ORDER', 'ASC', 'DESC', 'LIMIT', 'OFFSET', 'UNION',
  'ALL', 'DISTINCT', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'EXISTS',
  'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'IF', 'NULL', 'IS', 'TRUE',
  'FALSE', 'AND', 'OR', 'XOR', 'BEGIN', 'TRANSACTION', 'COMMIT', 'ROLLBACK'
];

function isKeyword(word: string): boolean {
  return SQL_KEYWORDS.includes(word.toUpperCase());
}

function formatKeyword(word: string, style: FormatOptions['keywordStyle']): string {
  switch (style) {
    case 'upper':
      return word.toUpperCase();
    case 'lower':
      return word.toLowerCase();
    case 'capitalize':
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    default:
      return word;
  }
}

function createIndent(level: number, size: number): string {
  return ' '.repeat(level * size);
}

export function formatSQL(sql: string, options: FormatOptions): FormatResult {
  try {
    if (!sql.trim()) {
      return { success: true, formatted: '' };
    }

    let formatted = '';
    let indentLevel = 0;
    let inString = false;
    let stringChar = '';
    let currentWord = '';
    let lastChar = '';
    
    const lines = sql.split('\n');
    
    for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
      const line = lines[lineIndex];
      
      for (let charIndex = 0; charIndex < line.length; charIndex++) {
        const char = line[charIndex];
        const nextChar = line[charIndex + 1] || '';
        
        // Handle strings
        if ((char === "'" || char === '"' || char === '`') && !inString) {
          inString = true;
          stringChar = char;
          formatted += char;
          currentWord = '';
        } else if (char === stringChar && inString && lastChar !== '\\') {
          inString = false;
          formatted += char;
          currentWord = '';
          stringChar = '';
        } else if (inString) {
          formatted += char;
          currentWord = '';
        } else {
          // Handle comments
          if (char === '-' && nextChar === '-') {
            formatted += line.substring(charIndex);
            break;
          }
          
          // Handle whitespace
          if (/\s/.test(char)) {
            if (currentWord) {
              const word = currentWord.trim();
              const isKw = isKeyword(word);
              
              if (isKw) {
                // Handle indent changes
                if (['FROM', 'WHERE', 'GROUP', 'ORDER', 'HAVING'].includes(word.toUpperCase())) {
                  if (indentLevel > 0) {
                    formatted = formatted.trimEnd() + '\n' + createIndent(indentLevel, options.indentSize);
                  }
                }
                
                formatted += formatKeyword(word, options.keywordStyle);
                currentWord = '';
              } else {
                formatted += word;
                currentWord = '';
              }
            }
            
            // Add space or newline
            if (char === '\n') {
              formatted += '\n' + createIndent(indentLevel, options.indentSize);
            } else if (formatted && !formatted.endsWith(' ') && !formatted.endsWith('\n')) {
              formatted += ' ';
            }
          } else {
            currentWord += char;
            
            // Handle parentheses
            if (char === '(') {
              if (currentWord.length > 1) {
                formatted += currentWord.slice(0, -1);
                currentWord = '(';
              }
              formatted += '(';
              indentLevel++;
              currentWord = '';
            } else if (char === ')') {
              if (currentWord.length > 1) {
                formatted += currentWord.slice(0, -1);
                currentWord = ')';
              }
              indentLevel = Math.max(0, indentLevel - 1);
              formatted += ')';
              currentWord = '';
            }
            // Handle commas
            else if (char === ',') {
              if (options.commaFirst) {
                formatted = formatted.trimEnd();
                formatted += '\n' + createIndent(indentLevel, options.indentSize) + ',';
              } else {
                formatted += ',';
              }
              currentWord = '';
            }
          }
        }
        
        lastChar = char;
      }
      
      // End of line processing
      if (currentWord && !inString) {
        const word = currentWord.trim();
        if (isKeyword(word)) {
          formatted += formatKeyword(word, options.keywordStyle);
        } else {
          formatted += word;
        }
        currentWord = '';
      }
      
      if (lineIndex < lines.length - 1) {
        formatted += '\n';
      }
    }
    
    // Clean up extra whitespace
    formatted = formatted
      .replace(/\n\s*\n/g, '\n')
      .replace(/\s+$/gm, '')
      .trim();
    
    return { success: true, formatted };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to format SQL' 
    };
  }
}

export function minifySQL(sql: string): FormatResult {
  try {
    if (!sql.trim()) {
      return { success: true, formatted: '' };
    }

    let minified = '';
    let inString = false;
    let stringChar = '';
    let lastChar = '';
    
    for (let i = 0; i < sql.length; i++) {
      const char = sql[i];
      const nextChar = sql[i + 1] || '';
      
      // Skip comments
      if (char === '-' && nextChar === '-') {
        while (i < sql.length && sql[i] !== '\n') i++;
        continue;
      }
      
      // Handle strings
      if ((char === "'" || char === '"' || char === '`') && !inString) {
        inString = true;
        stringChar = char;
        minified += char;
      } else if (char === stringChar && inString && lastChar !== '\\') {
        inString = false;
        minified += char;
        stringChar = '';
      } else if (inString) {
        minified += char;
      } else if (!/\s/.test(char)) {
        minified += char;
      } else if (/\S/.test(lastChar) && /\S/.test(sql[i + 1] || '')) {
        minified += ' ';
      }
      
      lastChar = char;
    }
    
    return { success: true, formatted: minified.trim() };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to minify SQL' 
    };
  }
}

export function validateSQL(sql: string): { valid: boolean; error?: string } {
  try {
    if (!sql.trim()) {
      return { valid: true };
    }
    
    // Basic validation - check for balanced parentheses and quotes
    let parentheses = 0;
    let inString = false;
    let stringChar = '';
    let lastChar = '';
    
    for (let i = 0; i < sql.length; i++) {
      const char = sql[i];
      
      if ((char === "'" || char === '"' || char === '`') && !inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar && inString && lastChar !== '\\') {
        inString = false;
        stringChar = '';
      } else if (!inString) {
        if (char === '(') parentheses++;
        else if (char === ')') parentheses--;
      }
      
      lastChar = char;
    }
    
    if (parentheses !== 0) {
      return { valid: false, error: 'Unbalanced parentheses' };
    }
    
    if (inString) {
      return { valid: false, error: 'Unclosed string' };
    }
    
    return { valid: true };
  } catch (error) {
    return { 
      valid: false, 
      error: error instanceof Error ? error.message : 'Invalid SQL' 
    };
  }
}
