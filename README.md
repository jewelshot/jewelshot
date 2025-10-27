# 💎 Jewelshot Studio

> Professional AI-powered jewelry photography platform

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

## 🎯 Overview

Jewelshot Studio is a modern SaaS platform that enables jewelry brands to generate professional product photography using AI. Built with Next.js, TypeScript, and Tailwind CSS.

## ✨ Features

- 🎨 **Professional Studio Interface** - Premium aurora background with glassmorphism effects
- 🤖 **AI-Powered Generation** - Integration with fal.ai's Nano Banana model
- 📱 **Responsive Design** - Optimized for both desktop and mobile
- 🎭 **Dual Mode Generation**:
  - **Preset Mode**: Quick 4-step generation (Model, Location, Mood, Ratio)
  - **Advanced Mode**: Full control with 12+ parameters
- 🖼️ **Gallery Management** - View and manage generated images
- 📦 **Batch Processing** - Generate multiple variations at once

## 🚀 Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm or yarn
- Supabase account
- fal.ai API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/jewelshot.git
   cd jewelshot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your credentials:
   - Supabase URL and keys
   - fal.ai API key

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
jewelshot/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # Authentication routes
│   │   ├── (dashboard)/       # Dashboard routes
│   │   └── studio/            # Studio interface
│   ├── components/            # Atomic Design Pattern
│   │   ├── atoms/            # Basic building blocks
│   │   ├── molecules/        # Simple component groups
│   │   ├── organisms/        # Complex UI sections
│   │   └── templates/        # Page layouts
│   ├── features/             # Feature-based modules
│   │   ├── studio/
│   │   ├── auth/
│   │   └── gallery/
│   ├── lib/                  # External integrations
│   │   ├── supabase/
│   │   └── fal-ai/
│   ├── hooks/                # Custom React hooks
│   ├── store/                # Zustand state management
│   └── types/                # TypeScript definitions
└── public/                    # Static assets
```

## 🛠️ Tech Stack

### Core
- **[Next.js 16](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4](https://tailwindcss.com/)** - Utility-first CSS

### State & Forms
- **[Zustand](https://zustand-demo.pmnd.rs/)** - Lightweight state management
- **[React Hook Form](https://react-hook-form.com/)** - Form handling
- **[Zod](https://zod.dev/)** - Schema validation

### Backend & Storage
- **[Supabase](https://supabase.com/)** - Authentication, Database, Storage
- **[fal.ai](https://fal.ai/)** - AI image generation (Nano Banana)

### UI & Animation
- **[shadcn/ui](https://ui.shadcn.com/)** - Component library
- **[Framer Motion](https://www.framer.com/motion/)** - Animations
- **[Lucide React](https://lucide.dev/)** - Icon set

### Development
- **[ESLint](https://eslint.org/)** - Code linting
- **[Prettier](https://prettier.io/)** - Code formatting
- **[Husky](https://typicode.github.io/husky/)** - Git hooks
- **[Vitest](https://vitest.dev/)** - Unit testing

## 📝 Development Workflow

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(studio): add sidebar component
fix(auth): resolve login redirect
docs(readme): update installation steps
test(studio): add aurora background tests
style(ui): improve button spacing
refactor(api): simplify fal.ai integration
```

### Branch Strategy

```
main          # Production-ready code
├── develop   # Development branch
    ├── feature/studio-sidebar
    ├── feature/fal-ai-integration
    └── fix/animation-performance
```

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🚢 Deployment

### Netlify

1. Push your code to GitHub
2. Connect repository to Netlify
3. Configure environment variables
4. Deploy!

### Manual Deployment

```bash
npm run build
npm run start
```

## 📚 Documentation

- [Architecture Decisions](./docs/architecture.md)
- [Component Guidelines](./docs/components.md)
- [API Integration](./docs/api.md)
- [Deployment Guide](./docs/deployment.md)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Your Name**
- GitHub: [@your-username](https://github.com/your-username)

## 🙏 Acknowledgments

- Original design inspiration from studio.html mock
- fal.ai for AI image generation
- Supabase for backend infrastructure

---

**Status:** 🚧 In Development - Step 1: Aurora Background ✅
