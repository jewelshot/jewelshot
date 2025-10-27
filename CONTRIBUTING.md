# Contributing to Jewelshot Studio

Thank you for your interest in contributing to Jewelshot Studio! 🎉

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/jewelshot.git`
3. Create a feature branch: `git checkout -b feature/your-feature`
4. Make your changes
5. Commit using conventional commits
6. Push to your fork
7. Open a Pull Request

## 📋 Development Workflow

### 1. Branch Naming

```
feature/studio-sidebar      # New features
fix/animation-performance   # Bug fixes
docs/api-documentation      # Documentation
test/component-tests        # Tests
refactor/state-management   # Code refactoring
```

### 2. Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Format
type(scope): subject

# Examples
feat(studio): add aurora background component
fix(auth): resolve login redirect issue
docs(readme): update installation guide
test(studio): add unit tests for prompt generator
refactor(sidebar): improve state management
style(ui): update button styles
chore(deps): update dependencies
```

**Commit will be blocked if it doesn't follow this format!**

### 3. Code Style

- **TypeScript**: Use strict mode
- **Formatting**: Prettier (runs automatically on commit)
- **Linting**: ESLint (runs automatically on commit)
- **Naming Conventions**:
  - Components: `PascalCase` (e.g., `AuroraBackground.tsx`)
  - Hooks: `camelCase` with `use` prefix (e.g., `useStudioState.ts`)
  - Utils: `camelCase` (e.g., `generatePrompt.ts`)
  - Types: `PascalCase` with suffix (e.g., `ProjectContextType`)

### 4. Component Structure

```typescript
/**
 * Component documentation
 * @example
 * <AuroraBackground enabled={true} />
 */

'use client'; // If needed

import React from 'react';

interface ComponentProps {
  /** Prop documentation */
  enabled?: boolean;
}

export function Component({ enabled = true }: ComponentProps) {
  // Implementation
}

export default Component;
```

### 5. Testing Requirements

- ✅ Unit tests for utilities and hooks
- ✅ Component tests for UI components
- ✅ Integration tests for features
- 🎯 Aim for 80%+ coverage

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage
```

### 6. Pre-Commit Checklist

Before committing, ensure:

- [ ] Code is formatted (`npm run format`)
- [ ] No linting errors (`npm run lint`)
- [ ] TypeScript compiles (`npm run type-check`)
- [ ] Tests pass (`npm run test`)
- [ ] Commit message follows convention

_Note: Pre-commit hooks will automatically check most of these!_

## 🏗️ Architecture Guidelines

### Atomic Design Pattern

```
atoms/       # Basic building blocks (Button, Input, Icon)
molecules/   # Simple combinations (FormField, Card)
organisms/   # Complex components (Sidebar, Header)
templates/   # Page layouts
```

### Feature-Based Structure

```
features/
  studio/
    components/    # Feature-specific components
    hooks/        # Feature-specific hooks
    store/        # Feature-specific state
    types/        # Feature-specific types
    utils/        # Feature-specific utilities
    __tests__/    # Feature tests
```

## 📝 Pull Request Guidelines

### PR Title

Use conventional commit format:

```
feat(studio): add sidebar component
```

### PR Description Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] New feature
- [ ] Bug fix
- [ ] Documentation
- [ ] Refactoring
- [ ] Test

## Testing

- [ ] Unit tests added/updated
- [ ] Manual testing completed

## Screenshots (if applicable)

[Add screenshots]

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests pass
```

### Review Process

1. Automated checks must pass (linting, tests, build)
2. At least 1 approval required
3. No merge conflicts
4. Branch is up-to-date with `develop`

## 🐛 Bug Reports

Use GitHub Issues with the bug template:

```markdown
**Describe the bug**
Clear description

**To Reproduce**
Steps to reproduce

**Expected behavior**
What should happen

**Screenshots**
If applicable

**Environment**

- OS: [e.g., macOS]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 20.10]
```

## 💡 Feature Requests

Use GitHub Issues with the feature template:

```markdown
**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should it work?

**Alternatives Considered**
Other approaches

**Additional Context**
Any other information
```

## 🔒 Security

Report security vulnerabilities privately to: [your-email@example.com]

## ❓ Questions

- Join our [Discord](https://discord.gg/jewelshot)
- Check [Documentation](docs/)
- Open a [Discussion](https://github.com/YOUR_USERNAME/jewelshot/discussions)

## 📜 Code of Conduct

- Be respectful
- Be collaborative
- Be professional
- Focus on constructive feedback

---

Thank you for contributing! 🙏
