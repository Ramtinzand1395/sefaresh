"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  IconClipboardList,
  IconPlus,
} from "@tabler/icons-react";
import type {
  CafeRequestListItemView,
  CafeRequestStatus,
} from "@/components/cafe/requests/cafe-request-types";
import { CreateRequestModal } from "@/components/cafe/requests/create-request-modal";
import { RequestCard } from "@/components/cafe/requests/request-card";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

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
}: {
  requests: CafeRequestListItemView[];
}) {
  const router = useRouter();
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
        title="درخواست‌های خرید مواد اولیه"
        description="ثبت، پیگیری و تأیید درخواست‌های خرید ارسالی توسط پرسنل و باریستاها"
        action={
          <Button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full gap-2 sm:w-auto"
          >
            <IconPlus size={18} />
            <span>درخواست خرید جدید</span>
          </Button>
        }
      />

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
          title="هنوز درخواست خریدی ثبت نشده است."
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
