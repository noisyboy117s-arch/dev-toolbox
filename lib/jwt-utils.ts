export interface JWTPayload {
  [key: string]: any;
}

export interface JWTHeader {
  alg?: string;
  typ?: string;
  [key: string]: any;
}

export interface JWTParsed {
  header: JWTHeader;
  payload: JWTPayload;
  signature: string;
  valid: boolean;
  error?: string;
}

export function parseJWT(token: string): JWTParsed {
  try {
    const parts = token.split('.');
    
    if (parts.length !== 3) {
      return {
        header: {},
        payload: {},
        signature: '',
        valid: false,
        error: 'Invalid JWT format. Expected 3 parts separated by dots.'
      };
    }

    // Parse header
    let header: JWTHeader = {};
    try {
      const headerJson = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
      header = JSON.parse(headerJson);
    } catch (e) {
      return {
        header: {},
        payload: {},
        signature: '',
        valid: false,
        error: 'Invalid JWT header. Could not parse base64 or JSON.'
      };
    }

    // Parse payload
    let payload: JWTPayload = {};
    try {
      const payloadJson = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
      payload = JSON.parse(payloadJson);
    } catch (e) {
      return {
        header: {},
        payload: {},
        signature: '',
        valid: false,
        error: 'Invalid JWT payload. Could not parse base64 or JSON.'
      };
    }

    return {
      header,
      payload,
      signature: parts[2],
      valid: true
    };
  } catch (error) {
    return {
      header: {},
      payload: {},
      signature: '',
      valid: false,
      error: 'Failed to parse JWT token.'
    };
  }
}

export function formatJSON(obj: any): string {
  try {
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return 'Invalid JSON';
  }
}

export function isTokenExpired(payload: JWTPayload): boolean {
  if (!payload.exp) {
    return false; // No expiration claim
  }
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

export function getTokenExpirationTime(payload: JWTPayload): string | null {
  if (!payload.exp) {
    return null;
  }
  
  return new Date(payload.exp * 1000).toISOString();
}

export function getTokenIssuedAtTime(payload: JWTPayload): string | null {
  if (!payload.iat) {
    return null;
  }
  
  return new Date(payload.iat * 1000).toISOString();
}
