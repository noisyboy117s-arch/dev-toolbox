export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

export interface PasswordStrength {
  score: number;
  level: 'weak' | 'fair' | 'good' | 'strong' | 'very-strong';
  entropy: number;
  crackTime: string;
  feedback: string[];
}

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const SIMILAR = 'ilLoO01';
const AMBIGUOUS = '{}[]()/\\\'"`~,;.<>';

export function generatePassword(options: PasswordOptions): string {
  let charset = '';
  
  if (options.includeLowercase) charset += LOWERCASE;
  if (options.includeUppercase) charset += UPPERCASE;
  if (options.includeNumbers) charset += NUMBERS;
  if (options.includeSymbols) charset += SYMBOLS;
  
  if (options.excludeSimilar) {
    charset = charset.split('').filter(char => !SIMILAR.includes(char)).join('');
  }
  
  if (options.excludeAmbiguous) {
    charset = charset.split('').filter(char => !AMBIGUOUS.includes(char)).join('');
  }
  
  if (!charset) return '';
  
  let password = '';
  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);
  
  for (let i = 0; i < options.length; i++) {
    password += charset[array[i] % charset.length];
  }
  
  return password;
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      level: 'weak',
      entropy: 0,
      crackTime: 'instant',
      feedback: ['Password is required']
    };
  }

  let charsetSize = 0;
  const feedback: string[] = [];
  
  // Check character types
  if (/[a-z]/.test(password)) charsetSize += 26;
  else feedback.push('Add lowercase letters');
  
  if (/[A-Z]/.test(password)) charsetSize += 26;
  else feedback.push('Add uppercase letters');
  
  if (/[0-9]/.test(password)) charsetSize += 10;
  else feedback.push('Add numbers');
  
  if (/[^a-zA-Z0-9]/.test(password)) charsetSize += 32;
  else feedback.push('Add special characters');
  
  // Calculate entropy
  const entropy = password.length * Math.log2(charsetSize);
  
  // Calculate score (0-100)
  let score = 0;
  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 20;
  if (password.length >= 16) score += 20;
  if (charsetSize >= 62) score += 20;
  if (charsetSize >= 94) score += 20;
  
  // Determine strength level
  let level: PasswordStrength['level'] = 'weak';
  if (score >= 80) level = 'very-strong';
  else if (score >= 60) level = 'strong';
  else if (score >= 40) level = 'good';
  else if (score >= 20) level = 'fair';
  
  // Calculate crack time (simplified)
  const combinations = Math.pow(charsetSize, password.length);
  const secondsToCrack = combinations / 1000000000; // Assuming 1 billion guesses per second
  
  let crackTime = 'instant';
  if (secondsToCrack > 1) crackTime = `${Math.round(secondsToCrack)} seconds`;
  if (secondsToCrack > 60) crackTime = `${Math.round(secondsToCrack / 60)} minutes`;
  if (secondsToCrack > 3600) crackTime = `${Math.round(secondsToCrack / 3600)} hours`;
  if (secondsToCrack > 86400) crackTime = `${Math.round(secondsToCrack / 86400)} days`;
  if (secondsToCrack > 2592000) crackTime = `${Math.round(secondsToCrack / 2592000)} months`;
  if (secondsToCrack > 31536000) crackTime = `${Math.round(secondsToCrack / 31536000)} years`;
  if (secondsToCrack > 3153600000) crackTime = 'centuries';
  if (secondsToCrack > 3153600000000) crackTime = 'millennia';
  
  // Additional feedback
  if (password.length < 12) {
    feedback.push('Use at least 12 characters');
  }
  
  if (/(.)\1{2,}/.test(password)) {
    feedback.push('Avoid repeated characters');
  }
  
  if (/123|abc|qwe/i.test(password)) {
    feedback.push('Avoid sequential patterns');
  }
  
  if (feedback.length === 0) {
    feedback.push('Strong password!');
  }
  
  return {
    score,
    level,
    entropy: Math.round(entropy * 100) / 100,
    crackTime,
    feedback
  };
}

export function getPasswordStrengthColor(level: PasswordStrength['level']): string {
  switch (level) {
    case 'weak': return 'bg-red-500';
    case 'fair': return 'bg-orange-500';
    case 'good': return 'bg-yellow-500';
    case 'strong': return 'bg-blue-500';
    case 'very-strong': return 'bg-green-500';
    default: return 'bg-gray-500';
  }
}

export function getPasswordStrengthTextColor(level: PasswordStrength['level']): string {
  switch (level) {
    case 'weak': return 'text-red-700 dark:text-red-300';
    case 'fair': return 'text-orange-700 dark:text-orange-300';
    case 'good': return 'text-yellow-700 dark:text-yellow-300';
    case 'strong': return 'text-blue-700 dark:text-blue-300';
    case 'very-strong': return 'text-green-700 dark:text-green-300';
    default: return 'text-gray-700 dark:text-gray-300';
  }
}
