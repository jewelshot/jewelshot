/**
 * Commitlint Configuration
 * Enforces conventional commit messages
 *
 * Format: type(scope?): subject
 *
 * Examples:
 * - feat(studio): add aurora background component
 * - fix(auth): resolve login redirect issue
 * - docs(readme): update installation guide
 * - test(studio): add unit tests for prompt generator
 * - refactor(sidebar): improve state management
 * - style(ui): update button styles
 * - chore(deps): update dependencies
 */

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New feature
        'fix', // Bug fix
        'docs', // Documentation
        'style', // Formatting, missing semi colons, etc
        'refactor', // Code refactoring
        'test', // Adding tests
        'chore', // Maintenance tasks
        'perf', // Performance improvements
        'ci', // CI/CD changes
        'build', // Build system changes
        'revert', // Revert previous commit
      ],
    ],
    'scope-enum': [
      2,
      'always',
      [
        'studio', // Studio page
        'auth', // Authentication
        'gallery', // Gallery page
        'batch', // Batch processing
        'ui', // UI components
        'api', // API integrations
        'db', // Database
        'config', // Configuration
        'deps', // Dependencies
        'types', // TypeScript types
        'test', // Testing
        'docs', // Documentation
      ],
    ],
    'subject-case': [2, 'always', 'lower-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
  },
};
