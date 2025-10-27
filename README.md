# 💎 Jewelshot Studio

> AI-powered jewelry photography platform with premium prompt generation

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## 🚀 Overview

Jewelshot Studio is a professional SaaS platform for generating AI-powered jewelry photography using advanced prompt engineering and fal.ai's Nano Banana model.

### ✨ Features

- 🎨 **Aurora Background** - Premium animated gradient effects
- 🎯 **Preset Mode** - Quick 4-step prompt generation
- 🎛️ **Advanced Mode** - 12+ parameter control
- 📸 **Image Upload** - Direct integration with Supabase Storage
- 🤖 **AI Generation** - fal.ai Nano Banana integration
- 📱 **Responsive Design** - Desktop-first with mobile optimization

## 🏗️ Architecture

```
jewelshot/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # Atomic Design Pattern
│   │   ├── atoms/       # Basic components (AuroraBackground, Button, etc.)
│   │   ├── molecules/   # Composite components
│   │   ├── organisms/   # Complex components
│   │   └── templates/   # Page layouts
│   ├── features/        # Feature-based modules
│   ├── lib/             # External integrations (Supabase, fal.ai)
│   └── hooks/           # Custom React hooks
```

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **State:** Zustand
- **Forms:** React Hook Form + Zod
- **Animations:** Framer Motion
- **Database:** Supabase
- **Storage:** Supabase Storage
- **AI:** fal.ai (Nano Banana)
- **Deployment:** Netlify
- **Testing:** Vitest + React Testing Library

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/jewelshot/jewelshot.git

# Navigate to project
cd jewelshot

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Add your API keys:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - FAL_AI_API_KEY

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 🧪 Development

```bash
# Development server
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Formatting
npm run format
npm run format:check

# Build for production
npm run build

# Start production server
npm start
```

## 📝 Commit Convention

This project uses [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(studio): add aurora background component
fix(auth): resolve login redirect issue
docs(readme): update installation guide
test(studio): add unit tests for prompt generator
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `perf`, `ci`

## 🌿 Branch Strategy

```
main            # Production-ready code
└── develop     # Integration branch
    ├── feature/studio-sidebar
    ├── feature/fal-ai-integration
    └── fix/animation-performance
```

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🔗 Links

- [Documentation](docs/)
- [fal.ai Documentation](https://fal.ai/models/fal-ai/nano-banana/edit/api)
- [Supabase Docs](https://supabase.com/docs)

---

**Current Status:** 🚧 In Development (Step 1: Aurora Background ✅)

**Next Steps:**

- [ ] Sidebar Component
- [ ] Project Context Form
- [ ] Preset Mode
- [ ] Advanced Mode
- [ ] fal.ai Integration
- [ ] Authentication & Database

---

Built with ❤️ by [Your Name]
