/**
 * Lint-Staged Configuration
 *
 * Runs linters and formatters on staged files before commit.
 * Ensures code quality and consistency in the codebase.
 *
 * @see https://github.com/okonet/lint-staged
 */

module.exports = {
  // TypeScript and JavaScript files
  '*.{ts,tsx,js,jsx}': [
    // Format with Prettier
    'prettier --write',
    // Lint with ESLint (auto-fix where possible)
    'eslint --fix',
    // Type check (only for staged files)
    () => 'tsc --noEmit',
  ],

  // JSON, Markdown, YAML files
  '*.{json,md,yml,yaml}': [
    // Format with Prettier
    'prettier --write',
  ],

  // CSS and SCSS files
  '*.{css,scss}': [
    // Format with Prettier
    'prettier --write',
  ],

  // Prisma schema files
  '*.prisma': [
    // Format Prisma schema
    'npx prisma format',
  ],
}
