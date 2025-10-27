/**
 * Sidebar Component
 *
 * Main sidebar with premium glassmorphism effect.
 * Features smooth slide animations and navigation menu.
 *
 * @example
 * ```tsx
 * <Sidebar />
 * ```
 */

'use client';

import React from 'react';
import { useSidebarStore } from '@/store/sidebarStore';
import SidebarLogo from '@/components/molecules/SidebarLogo';
import NavigationItem from '@/components/atoms/NavigationItem';

const navigationItems = [
  { icon: '🏠', label: 'Home', href: '/' },
  { icon: '🎨', label: 'Studio', href: '/studio', active: true },
  { icon: '🖼️', label: 'Gallery', href: '/gallery' },
  { icon: '📦', label: 'Batch', href: '/batch' },
  { icon: '⚙️', label: 'Settings', href: '/settings' },
];

export function Sidebar() {
  const isOpen = useSidebarStore((state) => state.isOpen);

  return (
    <aside
      className={`fixed top-0 left-0 z-[100] h-screen w-[260px] border-r border-[rgba(139,92,246,0.15)] bg-[rgba(10,10,10,0.7)] shadow-[4px_0_24px_rgba(0,0,0,0.3)] backdrop-blur-[24px] backdrop-saturate-[200%] transition-transform duration-[800ms] ease-[cubic-bezier(0.4,0.0,0.2,1)] ${isOpen ? 'translate-x-0' : '-translate-x-full'} `}
    >
      {/* Sidebar Content */}
      <div className="scrollbar-thin scrollbar-thumb-[rgba(139,92,246,0.2)] scrollbar-track-transparent hover:scrollbar-thumb-[rgba(139,92,246,0.4)] flex h-full flex-col overflow-y-auto p-3">
        {/* Logo */}
        <SidebarLogo />

        {/* Divider */}
        <div className="my-2.5 h-px bg-gradient-to-r from-transparent via-[rgba(139,92,246,0.2)] to-transparent" />

        {/* Navigation */}
        <nav className="mb-3 flex flex-col gap-0.5">
          {navigationItems.map((item, index) => (
            <NavigationItem
              key={item.href}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={item.active}
              animationDelay={100 + index * 50}
            />
          ))}
        </nav>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer (optional) */}
        <div className="py-2 text-center text-[10px] text-white/30">v0.1.0</div>
      </div>
    </aside>
  );
}

export default Sidebar;
