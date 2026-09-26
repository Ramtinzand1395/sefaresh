"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  IconArrowLeft,
  IconClipboardList,
  IconFileText,
  IconPlus,
} from "@tabler/icons-react";
import type {
  CafeRequestListItemView,
  CafeRequestStatus,
  RfqListItemView,
} from "@/components/cafe/requests/cafe-request-types";
import { CreateRequestModal } from "@/components/cafe/requests/create-request-modal";
import { RequestCard } from "@/components/cafe/requests/request-card";
import { RfqListCard } from "@/components/cafe/requests/rfq-list-card";
import {
  formatPersianNumber,
} from "@/components/cafe/shopping-list/shopping-list-types";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

type MainViewTab = "rfqs" | "internal_requests";
type FilterTab = "all" | CafeRequestStatus;

const filterTabs: { id: FilterTab; label: string }[] = [
  { id: "all", label: "همه درخواست‌ها" },
  { id: "pending", label: "در انتظار بررسی" },
  { id: "approved", label: "تأیید شده" },
  { id: "partially_approved", label: "تأیید جزئی" },
  { id: "rejected", label: "رد شده" },
];

export function CafeRequestsPage({
  requests,
  rfqs = [],
}: {
  requests: CafeRequestListItemView[];
  rfqs?: RfqListItemView[];
}) {
  const router = useRouter();
  const [mainTab, setMainTab] = useState<MainViewTab>(() => {
    return rfqs.length > 0 ? "rfqs" : "internal_requests";
  });
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredRequests = useMemo(() => {
    if (activeTab === "all") return requests;
    return requests.filter((r) => r.status === activeTab);
  }, [requests, activeTab]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="مدیریت تدارکات کافه"
        title="درخواست‌ها و استعلام‌های خرید"
        description="پیگیری استعلام‌های قیمت از تأمین‌کنندگان (RFQ) و مدیریت درخواست‌های خرید داخلی پرسنل"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/cafe/shopping-list"
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control border border-line bg-white px-4 text-xs font-bold text-ink transition hover:border-primary/30 hover:bg-primary-soft sm:text-sm"
            >
              <IconFileText size={18} className="text-primary" />
              <span>لیست خرید و ارسال استعلام</span>
            </Link>

            <Button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="w-full gap-2 sm:w-auto"
            >
              <IconPlus size={18} />
              <span>درخواست خرید داخلی جدید</span>
            </Button>
          </div>
        }
      />

      {/* Main Section Switcher (RFQs vs Internal Requests) */}
      <div className="flex border-b border-line">
        <button
          type="button"
          onClick={() => setMainTab("rfqs")}
          className={`relative pb-3 text-sm font-black transition ${
            mainTab === "rfqs"
              ? "text-primary"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          <span className="flex items-center gap-2">
            <IconFileText size={18} />
            <span>استعلام‌های قیمت خرید (RFQ)</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                mainTab === "rfqs"
                  ? "bg-primary text-white"
                  : "bg-surface-subtle text-ink-muted"
              }`}
            >
              {formatPersianNumber(rfqs.length)}
            </span>
          </span>
          {mainTab === "rfqs" ? (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
          ) : null}
        </button>

        <button
          type="button"
          onClick={() => setMainTab("internal_requests")}
          className={`relative mr-6 pb-3 text-sm font-black transition ${
            mainTab === "internal_requests"
              ? "text-primary"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          <span className="flex items-center gap-2">
            <IconClipboardList size={18} />
            <span>درخواست‌های خرید داخلی کافه</span>
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                mainTab === "internal_requests"
                  ? "bg-primary text-white"
                  : "bg-surface-subtle text-ink-muted"
              }`}
            >
              {formatPersianNumber(requests.length)}
            </span>
          </span>
          {mainTab === "internal_requests" ? (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
          ) : null}
        </button>
      </div>

      {/* RFQs Tab Content */}
      {mainTab === "rfqs" ? (
        <div className="space-y-4">
          {rfqs.length > 0 ? (
            <div className="grid gap-3.5">
              {rfqs.map((rfq) => (
                <RfqListCard key={rfq.id} rfq={rfq} />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={IconFileText}
              title="هنوز استعلام خریدی ارسال نشده است."
              description="می‌توانید اقلام مورد نیاز کافه را از بخش «لیست خرید» انتخاب کرده و برای استعلام رسمی قیمت برای تأمین‌کنندگان ارسال کنید."
              action={
                <Link
                  href="/cafe/shopping-list"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-control bg-primary px-5 text-sm font-bold text-white transition hover:bg-primary-hover"
                >
                  <span>رفتن به لیست خرید</span>
                  <IconArrowLeft size={16} />
                </Link>
              }
            />
          )}
        </div>
      ) : (
        /* Internal Requests Tab Content */
        <div className="space-y-4">
          {requests.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2 border-b border-line pb-3">
              {filterTabs.map((tab) => {
                const count =
                  tab.id === "all"
                    ? requests.length
                    : requests.filter((r) => r.status === tab.id).length;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                      activeTab === tab.id
                        ? "bg-primary text-white"
                        : "bg-surface-subtle text-ink-muted hover:bg-surface-subtle/80 hover:text-ink"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                        activeTab === tab.id
                          ? "bg-white/20 text-white"
                          : "bg-line/60 text-ink-muted"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : null}

          {filteredRequests.length > 0 ? (
            <div className="grid gap-3">
              {filteredRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          ) : requests.length > 0 ? (
            <EmptyState
              icon={IconClipboardList}
              title="درخواستی در این وضعیت یافت نشد"
              description="می‌توانید فیلترهای دیگر را انتخاب کنید."
            />
          ) : (
            <EmptyState
              icon={IconClipboardList}
              title="هنوز درخواست خرید داخلی ثبت نشده است."
              description="پرسنل یا باریستا می‌توانند اقلام و مواد اولیه مورد نیاز را از این بخش ثبت کنند."
              action={
                <Button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="gap-2"
                >
                  <IconPlus size={18} />
                  <span>ثبت درخواست خرید</span>
                </Button>
              }
            />
          )}
        </div>
      )}

      <CreateRequestModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </div>
  );
}
