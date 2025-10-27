# Contributing to Jewelshot Studio

## 🎯 Development Philosophy

- **Clean Code**: Write self-documenting, maintainable code
- **Test-Driven**: Every feature must have tests
- **Atomic Design**: Follow atomic component structure
- **Type Safety**: Leverage TypeScript fully

## 📝 Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples
```bash
feat(studio): add aurora background component

Implemented 4 gradient blobs with smooth animations
- Deep purple, indigo, teal, and crimson gradients
- 28-32s animation cycles
- GPU-accelerated CSS animations

Closes #123
```

```bash
fix(auth): resolve token refresh issue

Token was not refreshing correctly after 1 hour
Added retry logic with exponential backoff

Fixes #456
```

## 🌳 Branch Strategy

```
main                    # Production-ready
├── develop            # Integration branch
    ├── feature/*      # New features
    ├── fix/*          # Bug fixes
    └── hotfix/*       # Urgent production fixes
```

### Branch Naming
- `feature/studio-sidebar` - New features
- `fix/animation-performance` - Bug fixes
- `hotfix/security-patch` - Urgent fixes
- `refactor/state-management` - Code improvements
- `docs/api-documentation` - Documentation

## 🧪 Testing Requirements

### Before Submitting PR
- [ ] All tests pass: `npm test`
- [ ] No linting errors: `npm run lint`
- [ ] Code formatted: `npm run format`
- [ ] TypeScript compiles: `npm run type-check`
- [ ] Build succeeds: `npm run build`

### Test Coverage
- Minimum 80% coverage required
- Every utility function must have tests
- Every component must have tests

## 📁 File Structure

### Component Guidelines
```typescript
// src/components/atoms/Button.tsx

/**
 * Button Component
 * 
 * Primary action button with variants and sizes
 * 
 * @example
 * <Button variant="primary" size="lg">
 *   Click Me
 * </Button>
 */

'use client';

import React from 'react';
import { type ButtonProps } from './Button.types';

export function Button({ 
  children, 
  variant = 'primary',
  size = 'md',
  ...props 
}: ButtonProps) {
  return (
    <button 
      className={buttonStyles({ variant, size })}
      {...props}
    >
      {children}
    </button>
  );
}
```

### Naming Conventions
- **Components**: PascalCase (`AuroraBackground.tsx`)
- **Hooks**: camelCase with `use` prefix (`useStudioState.ts`)
- **Utils**: camelCase (`generatePrompt.ts`)
- **Types**: PascalCase with suffix (`ButtonProps`, `StudioState`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)

## 🔄 Pull Request Process

1. **Fork & Clone**
   ```bash
   git clone https://github.com/your-username/jewelshot.git
   cd jewelshot
   ```

2. **Create Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Write clean, tested code
   - Follow naming conventions
   - Add JSDoc comments

4. **Test Locally**
   ```bash
   npm test
   npm run lint
   npm run build
   ```

5. **Commit**
   ```bash
   git add .
   git commit -m "feat(scope): your message"
   ```

6. **Push & PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   - Open PR on GitHub
   - Fill in PR template
   - Request review

## 📋 PR Checklist

- [ ] Follows atomic design pattern
- [ ] Includes TypeScript types
- [ ] Has JSDoc documentation
- [ ] Tests added/updated
- [ ] No console.logs (use proper logging)
- [ ] Responsive on mobile
- [ ] Accessible (ARIA labels, keyboard navigation)
- [ ] No performance regressions

## 🎨 Code Style

### TypeScript
```typescript
// Good ✅
interface UserProfile {
  id: string;
  name: string;
  email: string;
}

export function getUserProfile(id: string): Promise<UserProfile> {
  // ...
}

// Bad ❌
function getUserProfile(id: any): any {
  // ...
}
```

### React
```typescript
// Good ✅
'use client';

import { type FC } from 'react';

interface Props {
  title: string;
  onClose: () => void;
}

export const Modal: FC<Props> = ({ title, onClose }) => {
  return (
    <div role="dialog" aria-label={title}>
      {/* ... */}
    </div>
  );
};

// Bad ❌
export default function Modal(props: any) {
  return <div>{props.title}</div>;
}
```

## 🐛 Bug Reports

Use GitHub Issues with this template:

```markdown
**Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Screenshots**
If applicable

**Environment**
- OS: [e.g. macOS 14]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.2.0]
```

## 💡 Feature Requests

```markdown
**Feature Description**
Clear description of the feature

**Use Case**
Why is this needed?

**Proposed Solution**
How should it work?

**Alternatives Considered**
Other approaches you thought about
```

## 📞 Questions?

- Open a Discussion on GitHub
- Check existing Issues and PRs
- Review documentation

---

Thank you for contributing to Jewelshot Studio! 💎

