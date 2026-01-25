/**
 * Prettier Configuration
 *
 * Code formatting rules for consistent code style across the project.
 *
 * @see https://prettier.io/docs/en/options.html
 */

module.exports = {
  // Use single quotes instead of double quotes
  singleQuote: true,

  // Add semicolons at the end of statements
  semi: false,

  // Use 2 spaces for indentation
  tabWidth: 2,

  // Use spaces instead of tabs
  useTabs: false,

  // Print width (line length)
  printWidth: 100,

  // Trailing commas where valid in ES5 (objects, arrays, etc.)
  trailingComma: 'es5',

  // Add spaces inside bracket notation
  bracketSpacing: true,

  // Put > of multi-line JSX at end of last line instead of new line
  bracketSameLine: false,

  // Arrow function parentheses (always include)
  arrowParens: 'always',

  // Line endings (auto-detect)
  endOfLine: 'auto',

  // Plugin for organizing imports (optional, requires prettier-plugin-organize-imports)
  // plugins: ['prettier-plugin-organize-imports'],
}
