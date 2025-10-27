# 🚀 GitHub Setup Guide

## Adım 1: GitHub'da Yeni Repository Oluştur

1. **GitHub'a git:** https://github.com/new
2. **Repository ayarları:**
   - Repository name: `jewelshot`
   - Description: `💎 Professional AI-powered jewelry photography platform`
   - Visibility: `Public` veya `Private`
   - ❌ **Initialize this repository with a README** - İŞARETLEME (zaten README var)
   - ❌ Add .gitignore - İŞARETLEME (zaten var)
   - ❌ Choose a license - İŞARETLEME (sonra ekleyeceğiz)

3. **Create repository** butonuna tıkla

---

## Adım 2: Local Repository'yi Hazırla

Terminal'de şu komutları çalıştır:

```bash
cd /Users/yasin/Desktop/vortex/jewelshot
```

### Git durumunu kontrol et
```bash
git status
```

### İlk commit için dosyaları ekle
```bash
git add .
git commit -m "feat: initial project setup with aurora background

- Next.js 16 + TypeScript + Tailwind CSS 4
- Atomic design folder structure
- AuroraBackground component with 4 gradient blobs
- Premium animations (28-32s cycles)
- Professional README and CONTRIBUTING guides

Step 1 of studio.html migration complete ✅"
```

---

## Adım 3: GitHub Remote Ekle ve Push

GitHub'da oluşturduğun repository'nin URL'ini kullan:

```bash
# Remote ekle (URL'i kendi repository'inle değiştir)
git remote add origin https://github.com/KULLANICI_ADIN/jewelshot.git

# Branch'i main olarak ayarla (eğer değilse)
git branch -M main

# İlk push
git push -u origin main
```

**Not:** Eğer GitHub authentication isterse:
- Username: GitHub kullanıcı adın
- Password: Personal Access Token (PAT) kullan
  - Token oluşturmak için: Settings → Developer settings → Personal access tokens → Generate new token

---

## Adım 4: Branch Yapısını Kur

```bash
# Develop branch'i oluştur
git checkout -b develop
git push -u origin develop

# Main'e geri dön
git checkout main
```

---

## Adım 5: GitHub Repository Ayarları

GitHub repository sayfanda:

### 1. Branch Protection (Settings → Branches)
**Main branch için:**
- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging
- ✅ Require branches to be up to date before merging

**Develop branch için:**
- ✅ Require a pull request before merging

### 2. Topics (Ana sayfa)
Şu tag'leri ekle:
```
nextjs, typescript, tailwind, supabase, ai, jewelry, photography, saas
```

### 3. About (Ana sayfa)
- Website: `https://jewelshot.netlify.app` (deploy sonrası)
- Description: `💎 Professional AI-powered jewelry photography platform`
- ✅ Use repository topics

---

## 📋 Gelecekteki Commit'ler İçin Workflow

### Yeni Feature Geliştirme

```bash
# Develop branch'e geç
git checkout develop

# Feature branch oluştur
git checkout -b feature/sidebar-component

# Değişiklikleri yap...

# Test et
npm test
npm run lint
npm run build

# Commit et
git add .
git commit -m "feat(studio): add sidebar component with glassmorphism"

# Push et
git push origin feature/sidebar-component
```

### GitHub'da Pull Request Aç

1. **GitHub'da** `Compare & pull request` butonuna tıkla
2. **Base:** `develop` ← **Compare:** `feature/sidebar-component`
3. **Başlık:** Commit mesajı gibi
4. **Açıklama:** Detaylı ne yaptığını anlat
5. **Create pull request**
6. Review sonrası **Merge**
7. Feature branch'i sil

### Develop'ı Main'e Merge

```bash
# Yeterli feature toplandığında
git checkout main
git merge develop
git push origin main

# Tag ekle (versiyon)
git tag -a v0.1.0 -m "Step 1: Aurora Background"
git push origin v0.1.0
```

---

## 🏷️ Versioning Strategy

[Semantic Versioning](https://semver.org/) kullan: `MAJOR.MINOR.PATCH`

```
v0.1.0 - Step 1: Aurora Background ✅
v0.2.0 - Step 2: Sidebar Component
v0.3.0 - Step 3: Project Context Form
v1.0.0 - Complete Studio (Production ready)
```

### Tag Oluşturma
```bash
git tag -a v0.1.0 -m "feat: aurora background component"
git push origin v0.1.0
```

---

## 📊 GitHub Issues ve Projects

### Issue Template Oluştur

`.github/ISSUE_TEMPLATE/bug_report.md` oluştur

### Project Board Kur

1. Projects → New project
2. Template: **Board**
3. Columns:
   - 📋 Backlog
   - 🔨 In Progress
   - 👀 In Review
   - ✅ Done

### Migration Milestones

1. **Milestone: Studio Migration**
   - [ ] Step 1: Aurora Background ✅
   - [ ] Step 2: Sidebar Component
   - [ ] Step 3: Project Context Form
   - [ ] Step 4: Preset Mode
   - [ ] Step 5: Advanced Mode
   - [ ] Step 6: fal.ai Integration
   - [ ] Step 7: Supabase Auth
   - [ ] Step 8: Gallery & Batch

---

## 🔐 Environment Variables

GitHub Actions için secrets ekle:
- Settings → Secrets and variables → Actions → New repository secret

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
FAL_KEY
```

---

## 🤖 GitHub Actions (CI/CD)

`.github/workflows/ci.yml` oluştur:

```yaml
name: CI

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'
    
    - run: npm ci
    - run: npm run lint
    - run: npm run type-check
    - run: npm test
    - run: npm run build
```

---

## 📝 Commit Mesajları Cheat Sheet

```bash
# Yeni özellik
git commit -m "feat(studio): add aurora background"

# Bug fix
git commit -m "fix(auth): resolve login redirect"

# Dokümantasyon
git commit -m "docs(readme): update installation steps"

# Test
git commit -m "test(studio): add aurora component tests"

# Style (kod formatı)
git commit -m "style(ui): improve button spacing"

# Refactor
git commit -m "refactor(api): simplify fal.ai integration"

# Performans
git commit -m "perf(aurora): optimize blob animations"

# Chore (maintenance)
git commit -m "chore(deps): update dependencies"
```

---

## ✅ Checklist

- [ ] GitHub'da repository oluşturuldu
- [ ] Local repo remote'a bağlandı
- [ ] İlk commit push edildi
- [ ] Develop branch oluşturuldu
- [ ] Branch protection kuralları eklendi
- [ ] Topics ve description ayarlandı
- [ ] .env.local.template oluşturuldu
- [ ] README.md güncellendi
- [ ] CONTRIBUTING.md eklendi

---

**Şimdi hazırsın! Profesyonel bir şekilde geliştirmeye devam edebilirsin.** 🚀

