"use client";

import { useCallback, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { IconCheck, IconClipboardPlus } from "@tabler/icons-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { OrderFilters, type DateRange } from "@/components/orders/order-filters";
import { OrderInsights } from "@/components/orders/order-insights";
import { OrderModals, type OrderModalState } from "@/components/orders/order-modals";
import { OrderStats } from "@/components/orders/order-stats";
import { OrdersList } from "@/components/orders/orders-list";
import { orders, type OrderStatus } from "@/data/orders";

const normalize = (value: string) => value.trim().toLocaleLowerCase("fa-IR");

export function OrdersPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | OrderStatus>("all");
  const [dateRange, setDateRange] = useState<DateRange>("all");
  const [supplier, setSupplier] = useState("all");
  const [modal, setModal] = useState<OrderModalState>(null);
  const [notice, setNotice] = useState("");
  const reduceMotion = useReducedMotion();

  const filteredOrders = useMemo(() => {
    const needle = normalize(query);
    const rangeCount = dateRange === "week" ? 3 : dateRange === "month" ? 5 : orders.length;

    return orders.slice(0, rangeCount).filter((order) => {
      const searchableText = normalize(`${order.id} ${order.supplier} ${order.statusLabel} ${order.products.map((product) => product.name).join(" ")}`);
      return (
        (!needle || searchableText.includes(needle)) &&
        (status === "all" || order.status === status) &&
        (supplier === "all" || order.supplierId === supplier)
      );
    });
  }, [dateRange, query, status, supplier]);

  const closeModal = useCallback(() => setModal(null), []);

  const resetFilters = () => {
    setQuery("");
    setStatus("all");
    setDateRange("all");
    setSupplier("all");
  };

  const showNotice = (message: string) => {
    setModal(null);
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3200);
  };

  const openOrderById = (orderId: string) => {
    const knownOrder = orders.find((order) => order.id === orderId);
    setModal({ type: "details", order: knownOrder ?? { ...orders[0], id: orderId, status: "pending", statusLabel: "در انتظار تأیید" } });
  };

  return (
    <>
      <PageHeader
        title="سفارش‌ها"
        description="تمام خریدهای خود را یکجا مدیریت و پیگیری کنید."
        action={
          <Button type="button" size="lg" className="w-full sm:w-auto" onClick={() => setModal({ type: "request" })}>
            <IconClipboardPlus size={20} aria-hidden="true" />
            ثبت درخواست جدید
          </Button>
        }
      />

      <OrderStats />
      <OrderFilters
        query={query}
        status={status}
        dateRange={dateRange}
        supplier={supplier}
        resultCount={filteredOrders.length}
        onQueryChange={setQuery}
        onStatusChange={setStatus}
        onDateRangeChange={setDateRange}
        onSupplierChange={setSupplier}
        onReset={resetFilters}
      />
      <OrdersList
        orders={filteredOrders}
        onOpenDetails={(order) => setModal({ type: "details", order })}
        onOpenSupplier={(supplierId) => setModal({ type: "supplier", supplierId })}
        onOpenComparison={() => setModal({ type: "comparison" })}
        onResetFilters={resetFilters}
      />
      <OrderInsights onOpenOrder={openOrderById} />

      <OrderModals
        modal={modal}
        onClose={closeModal}
        onDone={showNotice}
        onOpenComparison={() => setModal({ type: "comparison" })}
      />

      <div className="sr-only" role="status" aria-live="polite">{notice}</div>
      <AnimatePresence>
        {notice ? (
          <motion.div
            role="status"
            className="fixed bottom-4 left-1/2 z-[90] flex min-h-12 -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-xl bg-ink px-4 text-xs font-bold text-white shadow-float"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <span className="grid size-7 place-items-center rounded-full bg-success text-white"><IconCheck size={17} aria-hidden="true" /></span>
            {notice}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
