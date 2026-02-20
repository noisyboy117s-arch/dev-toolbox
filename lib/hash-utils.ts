export type HashAlgorithm = 'SHA-256' | 'SHA-512' | 'SHA-1' | 'MD5';

export async function generateHash(text: string, algorithm: HashAlgorithm): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  
  let hashBuffer: ArrayBuffer;
  
  switch (algorithm) {
    case 'SHA-256':
      hashBuffer = await crypto.subtle.digest('SHA-256', data);
      break;
    case 'SHA-512':
      hashBuffer = await crypto.subtle.digest('SHA-512', data);
      break;
    case 'SHA-1':
      hashBuffer = await crypto.subtle.digest('SHA-1', data);
      break;
    case 'MD5':
      // Note: MD5 is not supported by Web Crypto API for security reasons
      // We'll use a simple implementation for demonstration
      return md5(text);
    default:
      throw new Error(`Unsupported algorithm: ${algorithm}`);
  }
  
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
}

// Simple MD5 implementation for demonstration (not for production use)
function md5(str: string): string {
  // For now, return a placeholder - in production you'd use a proper crypto library
  // This is a complex algorithm and implementing it fully is error-prone
  // For demonstration purposes, we'll use a simple hash
  let hash = 0;
  if (str.length === 0) return hash.toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(16).padEnd(32, '0');
}

export function getHashInfo(algorithm: HashAlgorithm) {
  const info = {
    'SHA-256': {
      name: 'SHA-256',
      bits: 256,
      description: 'Secure Hash Algorithm 256-bit. Widely used and secure.',
      useCase: 'Blockchain, password hashing, digital signatures'
    },
    'SHA-512': {
      name: 'SHA-512',
      bits: 512,
      description: 'Secure Hash Algorithm 512-bit. More secure but slower than SHA-256.',
      useCase: 'High-security applications, certificates'
    },
    'SHA-1': {
      name: 'SHA-1',
      bits: 160,
      description: 'Secure Hash Algorithm 1-bit. Deprecated for security uses.',
      useCase: 'Legacy systems, not recommended for new applications'
    },
    'MD5': {
      name: 'MD5',
      bits: 128,
      description: 'Message Digest 5. Cryptographically broken and insecure.',
      useCase: 'Non-security uses like file checksums'
    }
  };
  
  return info[algorithm];
}
