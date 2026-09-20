"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { settingsTabs, type SettingsTabId } from "@/data/settings";

type SettingsTabsProps = {
  activeTab: SettingsTabId;
  onChange: (tab: SettingsTabId) => void;
};

export function SettingsTabs({ activeTab, onChange }: SettingsTabsProps) {
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeTabRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeTab]);

  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6">
      <div
        role="tablist"
        aria-label="بخش‌های تنظیمات"
        className="flex min-w-max border-b border-line"
      >
        {settingsTabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              ref={isActive ? activeTabRef : undefined}
              id={`settings-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="settings-panel"
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative min-h-14 px-3 text-sm font-black whitespace-nowrap transition-colors sm:px-4",
                isActive ? "text-primary" : "text-ink hover:text-primary",
                "after:absolute after:inset-x-3 after:bottom-0 after:h-0.5 after:rounded-full after:transition-colors",
                isActive ? "after:bg-primary" : "after:bg-transparent",
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
