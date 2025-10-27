# ⚡ Quick Start - GitHub'a Gönderme

## 🎯 Hızlı Özet

3 adımda GitHub'a gönder:

### 1️⃣ GitHub'da Repository Oluştur
- https://github.com/new adresine git
- İsim: `jewelshot`
- Açıklama: `💎 Professional AI-powered jewelry photography platform`
- Public/Private seç
- ❌ **README, .gitignore, license ekleme** (zaten var)
- **Create repository** tıkla

### 2️⃣ Terminal Komutları (jewelshot klasöründe)

```bash
cd /Users/yasin/Desktop/vortex/jewelshot

# Git durumunu kontrol et
git status

# Tüm dosyaları ekle
git add .

# İlk commit
git commit -m "feat: initial project setup with aurora background

- Next.js 16 + TypeScript + Tailwind CSS 4
- Atomic design folder structure
- AuroraBackground component with 4 gradient blobs
- Premium animations (28-32s cycles)
- Professional README and CONTRIBUTING guides

Step 1 of studio.html migration complete ✅"

# Remote ekle (URL'i kendininkiyle değiştir!)
git remote add origin https://github.com/KULLANICI_ADIN/jewelshot.git

# Main branch'e push
git branch -M main
git push -u origin main

# Develop branch oluştur
git checkout -b develop
git push -u origin develop
git checkout main
```

### 3️⃣ GitHub'da Ayarlar

**Repository → Settings → Branches:**
- Main branch için protection ekle
- ✅ Require pull request before merging

**Ana Sayfa:**
- Topics ekle: `nextjs`, `typescript`, `tailwind`, `ai`, `jewelry`, `saas`

---

## 🔄 Gelecekteki Geliştirmeler İçin

### Her Yeni Feature İçin:

```bash
# 1. Develop'tan yeni branch
git checkout develop
git checkout -b feature/sidebar-component

# 2. Kod yaz, test et
npm run dev
npm run lint
npm run type-check
npm run build

# 3. Commit
git add .
git commit -m "feat(studio): add sidebar component"

# 4. Push
git push origin feature/sidebar-component
```

### GitHub'da:
1. **Compare & Pull Request** tıkla
2. Base: `develop` ← Compare: `feature/sidebar-component`
3. **Create Pull Request**
4. Review sonrası **Merge**

---

## 📝 Commit Mesajı Formatı

```
feat(scope): kısa açıklama
fix(scope): bug açıklaması
docs(scope): dokümantasyon
test(scope): test ekleme
style(scope): format değişikliği
refactor(scope): kod iyileştirmesi
```

**Örnekler:**
```bash
git commit -m "feat(studio): add aurora background"
git commit -m "fix(auth): resolve login redirect"
git commit -m "docs(readme): update installation"
```

---

## ✅ İlk Push Sonrası Checklist

- [ ] GitHub'da repository görünüyor
- [ ] README.md düzgün görünüyor
- [ ] Main ve develop branch'leri var
- [ ] Topics eklendi
- [ ] Branch protection aktif

---

**Daha Detaylı Bilgi:** `GITHUB_SETUP.md` dosyasına bak

**Katkı Kuralları:** `CONTRIBUTING.md` dosyasına bak

**Proje Dokümantasyonu:** `README.md` dosyasına bak

---

🎉 **Hazırsın! Profesyonel geliştirmeye başlayabilirsin.**

