"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { IconCheck, IconMilk } from "@tabler/icons-react";

const suppliers = [
  {
    name: "تأمین کرمان",
    product: "شیر کم‌چرب پگاه یک لیتری",
    price: "۱۳۲,۰۰۰",
    delivery: "۲ روز",
    shipping: "۲۵,۰۰۰",
    updated: "امروز ۱۱:۲۰",
  },
  {
    name: "زرین تجارت",
    product: "شیر کم‌چرب پگاه یک لیتری",
    price: "۱۲۵,۰۰۰",
    delivery: "فردا",
    shipping: "۱۵,۰۰۰",
    updated: "امروز ۰۹:۱۵",
  },
  {
    name: "پخش بهار",
    product: "شیر کم‌چرب پگاه یک لیتری",
    price: "۱۳۰,۰۰۰",
    delivery: "۲ روز",
    shipping: "۲۰,۰۰۰",
    updated: "امروز ۱۰:۳۵",
  },
];

export function SupplierComparison() {
  const [selected, setSelected] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-3">
        {suppliers.map((supplier, index) => {
          const isSelected = selected === index;

          return (
            <motion.button
              type="button"
              key={supplier.name}
              onClick={() => {
                setSelected(index);
                setSubmitted(false);
              }}
              whileHover={reduceMotion ? undefined : { y: -4 }}
              className={`relative rounded-2xl border bg-white p-5 text-right shadow-sm transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 ${
                isSelected
                  ? "border-blue-500 ring-2 ring-blue-100"
                  : "border-slate-200 hover:border-blue-200"
              }`}
              aria-pressed={isSelected}
            >
              <span
                className={`absolute left-5 top-5 grid size-5 place-items-center rounded-full border ${
                  isSelected
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-slate-300"
                }`}
                aria-hidden="true"
              >
                {isSelected && <IconCheck size={13} stroke={3} />}
              </span>
              <div className="flex items-start gap-3 pl-8">
                <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <IconMilk size={30} stroke={1.7} />
                </span>
                <span>
                  <strong className="block text-base text-slate-950">
                    {supplier.name}
                  </strong>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">
                    {supplier.product}
                  </span>
                </span>
              </div>
              <dl className="mt-5 space-y-3 border-t border-slate-100 pt-4 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">قیمت واحد</dt>
                  <dd className={isSelected ? "font-bold text-emerald-600" : "font-bold"}>
                    {supplier.price} تومان
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">هزینه ارسال</dt>
                  <dd>{supplier.shipping} تومان</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-slate-500">زمان تحویل</dt>
                  <dd className={isSelected ? "font-bold text-emerald-600" : ""}>
                    {supplier.delivery}
                  </dd>
                </div>
                <div className="flex justify-between gap-3 border-t border-slate-100 pt-3 text-xs">
                  <dt className="text-slate-400">آخرین به‌روزرسانی</dt>
                  <dd className="text-slate-600">{supplier.updated}</dd>
                </div>
              </dl>
            </motion.button>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-600 px-10 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600"
        >
          مقایسه و ثبت سفارش از {suppliers[selected].name}
        </button>
        <p className="min-h-6 text-sm font-medium text-emerald-600" aria-live="polite">
          {submitted ? "تأمین‌کننده انتخاب شد؛ برای تکمیل سفارش وارد حساب شوید." : ""}
        </p>
      </div>
    </div>
  );
}
