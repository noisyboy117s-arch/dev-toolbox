import { describe, it, expect } from 'vitest';
import { formatJSON, validateJSON } from './json-utils';

describe('JSON Utils', () => {
  it('should format JSON correctly', () => {
    const input = '{"a":1}';
    const expected = '{\n  "a": 1\n}';
    expect(formatJSON(input)).toBe(expected);
  });

  it('should validate JSON correctly', () => {
    expect(validateJSON('{"a":1}').valid).toBe(true);
    expect(validateJSON('invalid').valid).toBe(false);
  });
});
