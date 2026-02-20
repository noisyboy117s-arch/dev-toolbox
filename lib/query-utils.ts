export interface QueryParseResult {
  success: boolean;
  data?: Record<string, any>;
  error?: string;
}

export function parseQueryParams(queryString: string): QueryParseResult {
  try {
    // Remove leading ? or # if present
    const cleanQuery = queryString.replace(/^[?#]/, '');
    
    if (!cleanQuery) {
      return { success: true, data: {} };
    }

    const params = new URLSearchParams(cleanQuery);
    const result: Record<string, any> = {};

    for (const [key, value] of params) {
      // Handle arrays (multiple values for same key)
      if (result.hasOwnProperty(key)) {
        if (Array.isArray(result[key])) {
          result[key].push(value);
        } else {
          result[key] = [result[key], value];
        }
      } else {
        // Try to parse as JSON, fallback to string
        try {
          result[key] = JSON.parse(value);
        } catch {
          result[key] = value;
        }
      }
    }

    return { success: true, data: result };
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to parse query parameters' 
    };
  }
}

export function jsonToQueryParams(data: Record<string, any>): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) {
      continue;
    }

    if (Array.isArray(value)) {
      value.forEach(item => {
        if (item !== null && item !== undefined) {
          params.append(key, typeof item === 'object' ? JSON.stringify(item) : String(item));
        }
      });
    } else if (typeof value === 'object') {
      params.append(key, JSON.stringify(value));
    } else {
      params.append(key, String(value));
    }
  }

  return params.toString();
}

export function formatJSON(data: any): string {
  try {
    return JSON.stringify(data, null, 2);
  } catch {
    return String(data);
  }
}

export function validateJSON(jsonString: string): { valid: boolean; error?: string; data?: any } {
  try {
    const data = JSON.parse(jsonString);
    return { valid: true, data };
  } catch (error) {
    return { 
      valid: false, 
      error: error instanceof Error ? error.message : 'Invalid JSON' 
    };
  }
}
