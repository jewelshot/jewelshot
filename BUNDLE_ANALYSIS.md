# Bundle Analysis Guide

## Setup

```bash
npm install --save-dev @next/bundle-analyzer
```

## Configuration

Create `next.config.with-analyzer.mjs`:

```javascript
import withBundleAnalyzer from '@next/bundle-analyzer';

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default bundleAnalyzer(nextConfig);
```

## Usage

```bash
# Build with analysis
ANALYZE=true npm run build

# Opens in browser with bundle visualization
```

## What to Look For

1. **Large Dependencies**: Look for packages > 100KB
2. **Duplicate Code**: Same code in multiple chunks
3. **Unused Exports**: Tree-shaking opportunities
4. **Route Chunks**: Ensure code splitting is working

## Current Optimizations

- ✅ Dynamic imports for Canvas, Sidebars
- ✅ lucide-react optimized imports
- ✅ SSR disabled for heavy components
- ✅ Loading states for lazy chunks
