export function encodeURL(text: string): string {
  try {
    return encodeURIComponent(text);
  } catch (error) {
    throw new Error('Failed to encode URL');
  }
}

export function decodeURL(encodedText: string): string {
  try {
    return decodeURIComponent(encodedText);
  } catch (error) {
    throw new Error('Failed to decode URL. Invalid URL encoding.');
  }
}

export function encodeURLComponent(text: string): string {
  try {
    return encodeURIComponent(text);
  } catch (error) {
    throw new Error('Failed to encode URL component');
  }
}

export function decodeURLComponent(encodedText: string): string {
  try {
    return decodeURIComponent(encodedText);
  } catch (error) {
    throw new Error('Failed to decode URL component. Invalid URL encoding.');
  }
}

export function encodeBase64URL(text: string): string {
  try {
    return btoa(text)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
  } catch (error) {
    throw new Error('Failed to encode Base64URL');
  }
}

export function decodeBase64URL(encodedText: string): string {
  try {
    // Add padding back
    const padded = encodedText + '='.repeat((4 - encodedText.length % 4) % 4);
    return atob(padded.replace(/-/g, '+').replace(/_/g, '/'));
  } catch (error) {
    throw new Error('Failed to decode Base64URL. Invalid Base64URL encoding.');
  }
}
