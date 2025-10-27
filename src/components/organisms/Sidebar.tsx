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

import React from 'react';
import { useLayoutStore } from '@/store/layoutStore';
import SidebarLogo from '@/components/molecules/SidebarLogo';
import NavigationItem from '@/components/atoms/NavigationItem';
import SectionHeader from '@/components/atoms/SectionHeader';
import UserProfile from '@/components/molecules/UserProfile';

// Main navigation items
const mainNavItems = [
  { icon: '🏠', label: 'Home', href: '/', shortcut: '⌘H' },
  {
    icon: '🎨',
    label: 'Studio',
    href: '/studio',
    active: true,
    badge: { variant: 'new' as const },
  },
  {
    icon: '🖼️',
    label: 'Gallery',
    href: '/gallery',
    badge: { variant: 'count' as const, count: 24 },
  },
  {
    icon: '📦',
    label: 'Projects',
    href: '/projects',
    badge: { variant: 'count' as const, count: 3 },
  },
];

// Tools section
const toolsItems = [
  {
    icon: '✨',
    label: 'AI Generate',
    href: '/tools/ai-generate',
    badge: { variant: 'pro' as const },
  },
  {
    icon: '✂️',
    label: 'Background Remove',
    href: '/tools/background-remove',
    badge: { variant: 'dot' as const, color: 'green' as const },
  },
  { icon: '🎨', label: 'Color Enhance', href: '/tools/color-enhance' },
  { icon: '⚡', label: 'Resize & Crop', href: '/tools/resize-crop' },
];

// Settings section
const settingsItems = [
  {
    icon: '⚙️',
    label: 'Preferences',
    href: '/settings/preferences',
    shortcut: '⌘,',
  },
  {
    icon: '💳',
    label: 'Billing',
    href: '/settings/billing',
    badge: { variant: 'count' as const, count: 1 },
  },
];

export function Sidebar() {
  const { leftOpen, topOpen, bottomOpen } = useLayoutStore();

  return (
    <aside
      className={`fixed left-0 z-[100] w-[260px] border-r border-[rgba(139,92,246,0.15)] bg-[rgba(10,10,10,0.7)] shadow-[4px_0_24px_rgba(0,0,0,0.3)] backdrop-blur-[24px] backdrop-saturate-[200%] transition-all duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] ${leftOpen ? 'translate-x-0' : '-translate-x-full'} `}
      style={{
        top: topOpen ? '64px' : '0px',
        bottom: bottomOpen ? '40px' : '0px',
      }}
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
              active={item.active}
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
