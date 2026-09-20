import Image from "next/image";
import { IconArrowLeft, IconPlayerPlayFilled, IconPlus } from "@tabler/icons-react";
import { Card } from "@/components/ui/card";

export function WelcomeCard() {
  return (
    <Card className="relative min-h-[25rem] overflow-hidden border-primary/10 bg-[#dcecff] lg:min-h-[27rem] xl:h-full">
      <Image
        src="/images/hero-ordering.webp"
        alt="راهنمای سفارش هوشمند مواد اولیه"
        fill
        priority
        sizes="(max-width: 1279px) 100vw, 360px"
        className="object-cover object-[49%_center]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(229,240,255,.98)_0%,rgba(229,240,255,.88)_28%,rgba(229,240,255,.04)_62%)]" />

      <div className="relative z-10 flex h-full min-h-[25rem] flex-col p-6 lg:min-h-[27rem]">
        <div className="mr-auto max-w-[15rem] text-right">
          <p className="text-2xl font-black text-ink">سلام!</p>
          <h1 className="mt-3 text-xl font-black leading-9 text-primary">
            خرید هوشمندانه‌تر،
            <br />
            کسب‌وکار قوی‌تر
          </h1>
          <p className="mt-3 text-sm leading-7 text-ink-muted">
            ما اینجاییم تا تهیه مواد اولیه کافه و رستوران شما ساده‌تر، سریع‌تر و مطمئن‌تر باشد.
          </p>
        </div>

        <div className="mt-auto space-y-3">
          <button
            type="button"
            className="flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-primary px-4 text-sm font-black text-white shadow-lg shadow-primary/20 transition hover:bg-primary-hover"
          >
            <IconPlus size={21} aria-hidden="true" />
            ثبت درخواست مواد اولیه
            <IconArrowLeft className="mr-auto" size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white/85 px-4 text-sm font-black text-primary backdrop-blur transition hover:bg-white"
          >
            <IconPlayerPlayFilled size={20} aria-hidden="true" />
            راهنمای شروع کار
          </button>
        </div>
      </div>
    </Card>
  );
}
