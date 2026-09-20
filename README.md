# پروژه پایه Next.js

پروژه آماده توسعه با این ابزارها:

- Next.js (App Router) و TypeScript
- Tailwind CSS v4
- درایور رسمی MongoDB با اتصال singleton در محیط توسعه
- Zod برای اعتبارسنجی متغیرهای محیطی
- Motion برای انیمیشن React
- فونت Vazirmatn از طریق `next/font`

ابتدا فایل محیطی را بسازید و آدرس MongoDB را وارد کنید:

```bash
cp .env.example .env.local
```

سپس سرور توسعه را اجرا کنید:

```bash
npm run dev
```

صفحه اصلی در [http://localhost:3000](http://localhost:3000) و وضعیت اتصال دیتابیس در
[http://localhost:3000/api/health](http://localhost:3000/api/health) در دسترس است.

صفحه درباره ما در [http://localhost:3000/about](http://localhost:3000/about) قرار دارد.

ساختار رابط کاربری:

- `src/components/about`: بخش‌ها و محتوای صفحه درباره ما
- `src/components/brand`: لوگو و دارایی‌های نمایشی برند
- `src/components/layout`: هدر و فوتر مشترک
- `src/config/site.ts`: ناوبری و تنظیمات ثابت سایت
- `public/brand`: لوگوی رسمی و نشان مستقل سفارش

برای build تولید نیز از دستور `npm run build` استفاده کنید.
