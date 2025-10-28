'use client';

import React from 'react';
import TabButton from '@/components/atoms/TabButton';

interface Tab {
  id: string;
  label: string;
}

interface TabListProps {
  /**
   * Array of tabs
   */
  tabs: Tab[];
  /**
   * Active tab ID
   */
  activeTab: string;
  /**
   * Tab change handler
   */
  onTabChange: (tabId: string) => void;
}

/**
 * TabList - Molecule component for tab navigation
 */
export function TabList({ tabs, activeTab, onTabChange }: TabListProps) {
  return (
    <div className="flex gap-1 border-b border-[rgba(139,92,246,0.2)] pb-2">
      {tabs.map((tab) => (
        <TabButton
          key={tab.id}
          label={tab.label}
          active={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        />
      ))}
    </div>
  );
}

export default TabList;
