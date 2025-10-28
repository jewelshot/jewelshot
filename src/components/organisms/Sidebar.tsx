/**
 * Sidebar Component
 *
 * Main sidebar with premium glassmorphism effect.
 * Features smooth slide animations, sections, and full navigation menu.
 * Matches mock design exactly.
 *
 * @example
 * ```tsx
 * <Sidebar />
 * ```
 */

'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSidebarStore } from '@/store/sidebarStore';
import SidebarLogo from '@/components/molecules/SidebarLogo';
import NavigationItem from '@/components/molecules/NavigationItem';
import SectionHeader from '@/components/atoms/SectionHeader';
import UserProfile from '@/components/molecules/UserProfile';
import {
  Home,
  Palette,
  Image,
  FolderOpen,
  Sparkles,
  Scissors,
  Droplet,
  Zap,
  Settings,
  CreditCard,
} from 'lucide-react';

// Tools section
const toolsItems = [
  {
    icon: Sparkles,
    label: 'AI Generate',
    href: '/tools/ai-generate',
    badge: { variant: 'pro' as const },
  },
  {
    icon: Scissors,
    label: 'Background Remove',
    href: '/tools/background-remove',
    badge: { variant: 'dot' as const, color: 'green' as const },
  },
  { icon: Droplet, label: 'Color Enhance', href: '/tools/color-enhance' },
  { icon: Zap, label: 'Resize & Crop', href: '/tools/resize-crop' },
];

// Settings section
const settingsItems = [
  {
    icon: Settings,
    label: 'Preferences',
    href: '/settings/preferences',
    shortcut: '⌘,',
  },
  {
    icon: CreditCard,
    label: 'Billing',
    href: '/settings/billing',
    badge: { variant: 'count' as const, count: 1 },
  },
];

export function Sidebar() {
  const { leftOpen } = useSidebarStore();
  const pathname = usePathname();
  const [galleryCount, setGalleryCount] = useState(0);

  // Update gallery count
  useEffect(() => {
    const updateCount = () => {
      if (typeof window !== 'undefined') {
        import('@/lib/gallery-storage').then(({ getGalleryImageCount }) => {
          setGalleryCount(getGalleryImageCount());
        });
      }
    };

    updateCount();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'jewelshot_gallery_images') {
        updateCount();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom event when saving from current tab
    const handleGallerySave = () => updateCount();
    window.addEventListener('gallery-updated', handleGallerySave);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('gallery-updated', handleGallerySave);
    };
  }, []);

  // Main navigation items (dynamic)
  const mainNavItems = [
    { icon: Home, label: 'Home', href: '/', shortcut: '⌘H' },
    {
      icon: Palette,
      label: 'Studio',
      href: '/studio',
      badge: { variant: 'new' as const },
    },
    {
      icon: Image,
      label: 'Gallery',
      href: '/gallery',
      badge:
        galleryCount > 0
          ? { variant: 'count' as const, count: galleryCount }
          : undefined,
    },
    {
      icon: FolderOpen,
      label: 'Projects',
      href: '/projects',
      badge: { variant: 'count' as const, count: 3 },
    },
  ];

  return (
    <aside
      className={`fixed bottom-0 left-0 top-0 z-[100] w-[260px] border-r border-[rgba(139,92,246,0.15)] bg-[rgba(10,10,10,0.7)] shadow-[4px_0_24px_rgba(0,0,0,0.3)] backdrop-blur-[24px] backdrop-saturate-[200%] transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] ${leftOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* Sidebar Content */}
      <div className="sidebar-scroll flex h-full flex-col overflow-y-auto px-4 py-3">
        {/* Logo */}
        <SidebarLogo />

        {/* Divider */}
        <div className="-mx-4 my-3 h-px bg-gradient-to-r from-transparent via-[rgba(139,92,246,0.25)] to-transparent" />

        {/* Main Navigation */}
        <nav className="mb-2 flex flex-col gap-1">
          {mainNavItems.map((item, index) => (
            <NavigationItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={pathname === item.href}
              badge={item.badge}
              shortcut={item.shortcut}
              animationDelay={100 + index * 50}
            />
          ))}
        </nav>

        {/* Tools Section */}
        <SectionHeader title="TOOLS" />
        <nav className="mb-2 flex flex-col gap-1">
          {toolsItems.map((item, index) => (
            <NavigationItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              badge={item.badge}
              animationDelay={300 + index * 50}
            />
          ))}
        </nav>

        {/* Settings Section */}
        <SectionHeader title="SETTINGS" />
        <nav className="mb-4 flex flex-col gap-1">
          {settingsItems.map((item, index) => (
            <NavigationItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              badge={item.badge}
              shortcut={item.shortcut}
              animationDelay={500 + index * 50}
            />
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User Profile */}
        <UserProfile
          name="Yasin"
          status="Premium User"
          avatar="Y"
          online={true}
        />
      </div>
    </aside>
  );
}

export default Sidebar;
