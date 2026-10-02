import { describe, expect, it } from 'vitest';

// Pure helpers mirrored from scripts/ so tests run offline.
// (Scripts themselves need testnet; these cover the logic shapes.)

/** Same rule as the address check in the examples: G + 55 base32 chars. */
function isValidAddress(address: string): boolean {
  return /^G[A-Z2-7]{55}$/.test(address.trim());
}

/** Memo format used across examples: PREFIX-xxxxxx. */
function makeMemo(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

describe('starter helpers', () => {
  it('accepts a well-formed address', () => {
    expect(isValidAddress('G' + 'A'.repeat(55))).toBe(true);
  });

  it('rejects bad addresses', () => {
    expect(isValidAddress('')).toBe(false);
    expect(isValidAddress('GABC')).toBe(false);
  });

  it('makes unique memos under the 28-char Horizon limit', () => {
    const a = makeMemo('demo');
    const b = makeMemo('demo');
    expect(a).not.toBe(b);
    expect(a.length).toBeLessThanOrEqual(28);
  });
});
