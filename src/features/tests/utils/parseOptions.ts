/**
 * Safely parses options from backend, handling both JSON string and JS array string formats.
 * @param options Raw options string or array
 * @returns string[]
 */
export function parseOptions(options: string | string[]): string[] {
  if (Array.isArray(options)) return options;
  if (typeof options !== 'string') return [];
  // If already valid JSON, parse
  try {
    return JSON.parse(options);
  } catch {
    // Try to fix single-quoted array: ['1', '2', '3']
    if (options.startsWith("[") && options.includes("'")) {
      const fixed = options.replace(/'/g, '"');
      try {
        return JSON.parse(fixed);
      } catch {
        return [];
      }
    }
    return [];
  }
}
