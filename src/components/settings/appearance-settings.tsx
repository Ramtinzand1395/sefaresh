import Image from "next/image";
import {
  IconBrowser,
  IconChevronDown,
  IconDeviceDesktop,
  IconLayoutSidebar,
  IconLayoutSidebarRight,
  IconPalette,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { SettingChoice } from "@/components/settings/setting-choice";
import type { LayoutDirection, ThemePreference } from "@/data/settings";

type AppearanceSettingsProps = {
  theme: ThemePreference;
  direction: LayoutDirection;
  language: string;
  saving: boolean;
  onThemeChange: (theme: ThemePreference) => void;
  onDirectionChange: (direction: LayoutDirection) => void;
  onLanguageChange: (language: string) => void;
  onSave: () => void;
};

const themes: Array<{ value: ThemePreference; label: string }> = [
  { value: "light", label: "روشن" },
  { value: "dark", label: "تیره" },
  { value: "system", label: "پیش‌فرض سیستم" },
];

export function AppearanceSettings({
  theme,
  direction,
  language,
  saving,
  onThemeChange,
  onDirectionChange,
  onLanguageChange,
  onSave,
}: AppearanceSettingsProps) {
  return (
    <div>
      <div className="flex min-h-28 items-center justify-between gap-5 rounded-card border border-primary/10 bg-[linear-gradient(135deg,#f6fbff,#e6f2ff)] px-5 py-4 sm:px-8">
        <div>
          <h2 className="text-xl font-black tracking-tight text-ink sm:text-2xl">تنظیمات ظاهر و تم</h2>
          <p className="mt-1 text-sm leading-7 text-ink-muted">مدیریت تم و تنظیمات بصری داشبورد</p>
        </div>
        <span className="grid size-20 shrink-0 place-items-center rounded-full border border-primary/20 bg-white/55 text-primary shadow-sm sm:size-24">
          <IconPalette size={48} stroke={1.45} aria-hidden="true" />
        </span>
      </div>

      <div className="mt-5 lg:w-[68%] lg:min-w-[36rem] lg:mr-auto lg:border-r lg:border-line lg:pr-8">
        <fieldset>
          <legend className="text-base font-black text-ink">تم داشبورد</legend>
          <p className="mt-1 text-sm leading-6 text-ink-muted">تم داشبورد را می‌توانید با ذائقه خودتان هماهنگ کنید.</p>
          <div className="mt-4 grid grid-cols-1 gap-4 min-[480px]:grid-cols-3">
            {themes.map((item) => (
              <SettingChoice
                key={item.value}
                name="dashboard-theme"
                value={item.value}
                label={item.label}
                selected={theme === item.value}
                onSelect={() => onThemeChange(item.value)}
              >
                {item.value === "system" ? (
                  <div className="grid h-16 w-full grid-cols-2 gap-1 overflow-hidden rounded-lg border border-line bg-white p-1">
                    <div className="relative overflow-hidden rounded-md">
                      <Image src="/images/dashboard.png" alt="پیش‌نمایش تم روشن" fill sizes="140px" className="object-cover object-top" />
                    </div>
                    <div className="relative overflow-hidden rounded-md bg-ink">
                      <Image src="/images/dashboard.png" alt="پیش‌نمایش تم تیره" fill sizes="140px" className="object-cover object-top brightness-[.3]" />
                    </div>
                  </div>
                ) : (
                  <div className={item.value === "dark" ? "relative h-16 w-full overflow-hidden rounded-lg bg-ink" : "relative h-16 w-full overflow-hidden rounded-lg bg-white"}>
                    <Image
                      src="/images/dashboard.png"
                      alt={`پیش‌نمایش تم ${item.label}`}
                      fill
                      sizes="280px"
                      className={item.value === "dark" ? "object-cover object-top brightness-[.28] saturate-[.8]" : "object-cover object-top"}
                    />
                  </div>
                )}
              </SettingChoice>
            ))}
          </div>
        </fieldset>

        <div className="mt-5">
          <label htmlFor="settings-language" className="text-base font-black text-ink">زبان</label>
          <p className="mt-1 text-sm leading-6 text-ink-muted">زبان متن‌ها و پیام‌های داشبورد را انتخاب کنید.</p>
          <div className="relative mt-3">
            <IconChevronDown className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" size={18} aria-hidden="true" />
            <select
              id="settings-language"
              value={language}
              onChange={(event) => onLanguageChange(event.target.value)}
              className="h-12 w-full appearance-none rounded-xl border border-line bg-white px-4 pl-11 text-sm font-bold text-ink transition focus:border-primary focus:outline-none"
            >
              <option value="fa">فارسی</option>
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>

        <fieldset className="mt-5">
          <legend className="text-base font-black text-ink">چیدمان</legend>
          <p className="mt-1 text-sm leading-6 text-ink-muted">جهت قرارگیری منوها و محتوای داشبورد</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <SettingChoice
              name="layout-direction"
              value="rtl"
              label="راست‌چین (RTL)"
              selected={direction === "rtl"}
              onSelect={() => onDirectionChange("rtl")}
              contentClassName="min-h-16"
              hideVisibleLabel
            >
              <span className="flex items-center gap-4 text-primary">
                <IconLayoutSidebarRight size={54} stroke={1.25} aria-hidden="true" />
                <bdi className="text-xl font-black text-ink">RTL</bdi>
              </span>
            </SettingChoice>
            <SettingChoice
              name="layout-direction"
              value="ltr"
              label="چپ‌چین (LTR)"
              selected={direction === "ltr"}
              onSelect={() => onDirectionChange("ltr")}
              contentClassName="min-h-16"
              hideVisibleLabel
            >
              <span className="flex items-center gap-4 text-ink-muted">
                <IconLayoutSidebar size={54} stroke={1.25} aria-hidden="true" />
                <bdi className="text-xl font-black text-ink">LTR</bdi>
              </span>
            </SettingChoice>
          </div>
        </fieldset>

        <div className="mt-5 flex flex-col-reverse gap-3 border-t border-line pt-4 sm:flex-row sm:items-center">
          <Button type="button" size="lg" loading={saving} onClick={onSave} className="w-full sm:flex-1">
            ذخیره تغییرات
          </Button>
          <div className="flex items-center justify-center gap-2 text-xs text-ink-muted sm:justify-start">
            {theme === "system" ? <IconDeviceDesktop size={17} aria-hidden="true" /> : <IconBrowser size={17} aria-hidden="true" />}
            پیش‌نمایش بدون ذخیره‌سازی دائمی
          </div>
        </div>
      </div>
    </div>
  );
}
