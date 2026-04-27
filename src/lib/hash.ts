/**
 * SHA-256 hashing helpers built on top of the Web Crypto API.
 *
 * The admin password is never stored in plain text. Instead, only the SHA-256
 * digest of the password is persisted (in `src/data/auth.json` for the
 * deployed default and in `localStorage` for in-browser overrides), and the
 * `login` flow hashes user input with the same function before comparing.
 */

/** Hex-encode an `ArrayBuffer`. */
function toHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

/** Returns the lowercase-hex SHA-256 digest of the given string. */
export async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return toHex(digest);
}

/**
 * Constant-time equality check for two hex strings of the same length.
 * Avoids timing side-channels when comparing password hashes.
 */
export function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}
