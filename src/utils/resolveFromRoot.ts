import path from "path";

/**
 * Resolves a path relative to the project root (where `src/index.ts` is run from).
 * @param relativePath - e.g., "templates/email.hbs", "env/.env"
 * @returns Absolute path
 */
export function resolveFromRoot(relativePath: string): string {
  return path.resolve(process.cwd(), relativePath);
}
