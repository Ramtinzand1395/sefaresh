"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { IconCheck, IconChevronLeft, IconSettings } from "@tabler/icons-react";
import { AppearanceSettings } from "@/components/settings/appearance-settings";
import { SettingsTabs } from "@/components/settings/settings-tabs";
import {
  settingsPreview,
  type LayoutDirection,
  type SettingsTabId,
  type ThemePreference,
} from "@/data/settings";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTabId>("appearance");
  const [theme, setTheme] = useState<ThemePreference>("light");
  const [direction, setDirection] = useState<LayoutDirection>("rtl");
  const [language, setLanguage] = useState("fa");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const reduceMotion = useReducedMotion();

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await new Promise((resolve) => window.setTimeout(resolve, 550));
    setSaving(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 3200);
  }

  const preview = activeTab === "appearance" ? null : settingsPreview[activeTab];

  return (
    <section className="min-h-[calc(100dvh-7rem)] rounded-card border border-white/80 bg-white p-4 shadow-card sm:p-6">
      <header>
        <p className="text-xs font-bold text-primary">مدیریت حساب و ترجیحات</p>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-ink sm:text-3xl">تنظیمات</h1>
        <p className="mt-2 text-sm leading-7 text-ink-muted">مدیریت حساب کاربری، اطلاعات کسب‌وکار و تنظیمات اعلان‌ها</p>
      </header>

      <div className="mt-4">
        <SettingsTabs activeTab={activeTab} onChange={setActiveTab} />
      </div>

      <div
        id="settings-panel"
        role="tabpanel"
        aria-labelledby={`settings-tab-${activeTab}`}
        className="mt-4 min-h-[36rem] rounded-card border border-line bg-white p-4 shadow-[0_6px_24px_rgb(20_43_74_/_0.035)] sm:p-5"
      >
        {activeTab === "appearance" ? (
          <AppearanceSettings
            theme={theme}
            direction={direction}
            language={language}
            saving={saving}
            onThemeChange={setTheme}
            onDirectionChange={setDirection}
            onLanguageChange={setLanguage}
            onSave={handleSave}
          />
        ) : preview ? (
          <div className="mx-auto max-w-3xl py-2 sm:py-6">
            <div className="flex items-center gap-4 rounded-card border border-primary/10 bg-primary-soft/65 p-5 sm:p-7">
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-white text-primary shadow-sm">
                <IconSettings size={28} stroke={1.6} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-lg font-black text-ink sm:text-xl">{preview.title}</h2>
                <p className="mt-1 text-sm leading-6 text-ink-muted">{preview.description}</p>
              </div>
            </div>
            <dl className="mt-5 divide-y divide-line overflow-hidden rounded-card border border-line">
              {preview.items.map((item) => (
                <div key={item.label} className="flex flex-col gap-2 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <dt className="text-sm font-bold text-ink">{item.label}</dt>
                  <dd className="flex items-center gap-2 text-sm text-ink-muted">
                    {item.value}
                    <IconChevronLeft size={17} aria-hidden="true" />
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-xs leading-6 text-ink-muted">این داده‌ها نمایشی هستند و در این نسخه به پایگاه داده متصل نمی‌شوند.</p>
          </div>
        ) : null}
      </div>

      <AnimatePresence>
        {saved ? (
          <motion.div
            role="status"
            className="fixed bottom-5 left-1/2 z-50 flex min-h-12 -translate-x-1/2 items-center gap-3 rounded-xl border border-success/20 bg-white px-4 text-sm font-bold text-success shadow-float"
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <span className="grid size-7 place-items-center rounded-full bg-success-soft">
              <IconCheck size={17} aria-hidden="true" />
            </span>
            تغییرات نمایشی ذخیره شد
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}
