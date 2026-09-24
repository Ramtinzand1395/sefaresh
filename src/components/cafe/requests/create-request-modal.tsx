"use client";

import { useState, useTransition } from "react";
import {
  IconAlertCircle,
  IconCheck,
  IconLoader2,
  IconPackage,
  IconPlus,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import {
  createInternalPurchaseRequestAction,
  searchRequestCatalogProductsAction,
} from "@/app/cafe/requests/actions";
import type {
  CafeRequestPriority,
  CatalogProductSearchView,
} from "@/components/cafe/requests/cafe-request-types";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

type ItemFormRow = {
  id: string;
  type: "catalog" | "custom";
  productId?: string;
  productTitle?: string;
  productBrand?: string;
  productUnit?: string;
  customTitle: string;
  quantity: number;
  note: string;
};

type CreateRequestModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

export function CreateRequestModal({ open, onClose, onSuccess }: CreateRequestModalProps) {
  const [priority, setPriority] = useState<CafeRequestPriority>("normal");
  const [reason, setReason] = useState("");
  const [items, setItems] = useState<ItemFormRow[]>([
    {
      id: "row-1",
      type: "catalog",
      customTitle: "",
      quantity: 1,
      note: "",
    },
  ]);

  const [activeSearchIndex, setActiveSearchIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<CatalogProductSearchView[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const resetForm = () => {
    setPriority("normal");
    setReason("");
    setItems([
      {
        id: `row-${Date.now()}`,
        type: "catalog",
        customTitle: "",
        quantity: 1,
        note: "",
      },
    ]);
    setError(null);
    setActiveSearchIndex(null);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const results = await searchRequestCatalogProductsAction(query);
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectProduct = (index: number, product: CatalogProductSearchView) => {
    setItems((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              productId: product.productId,
              productTitle: product.title,
              productBrand: product.brand,
              productUnit: product.unit,
            }
          : row,
      ),
    );
    setActiveSearchIndex(null);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `row-${Date.now()}`,
        type: "catalog",
        customTitle: "",
        quantity: 1,
        note: "",
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
    if (activeSearchIndex === index) {
      setActiveSearchIndex(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type === "catalog" && !item.productId) {
        setError(`لطفاً برای ردیف ${i + 1} یک کالا از کاتالوگ انتخاب کنید.`);
        return;
      }
      if (item.type === "custom" && !item.customTitle.trim()) {
        setError(`لطفاً عنوان کالای سفارشی را در ردیف ${i + 1} وارد کنید.`);
        return;
      }
      if (item.quantity <= 0) {
        setError(`تعداد در ردیف ${i + 1} باید حداقل ۱ باشد.`);
        return;
      }
    }

    const payload = {
      priority,
      reason: reason.trim() || undefined,
      items: items.map((item) => {
        if (item.type === "catalog") {
          return {
            productId: item.productId,
            quantity: item.quantity,
            note: item.note.trim() || undefined,
          };
        }
        return {
          customTitle: item.customTitle.trim(),
          quantity: item.quantity,
          note: item.note.trim() || undefined,
        };
      }),
    };

    startTransition(async () => {
      const res = await createInternalPurchaseRequestAction(payload);
      if (res.status === "success") {
        onSuccess?.();
        handleClose();
      } else {
        setError(res.message);
      }
    });
  };

  return (
    <Modal
      open={open}
      title="درخواست خرید جدید"
      description="اقلام مورد نیاز خود را برای بررسی و تأیید ثبت کنید."
      width="lg"
      onClose={handleClose}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error ? (
          <div className="flex items-center gap-2 rounded-xl bg-danger-soft p-3 text-xs font-bold text-danger">
            <IconAlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        {/* Priority & Reason */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-bold text-ink">
              اولویت درخواست
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as CafeRequestPriority)}
              className="w-full rounded-control border border-line bg-surface-subtle px-3 py-2.5 text-xs font-medium text-ink focus:border-primary focus:outline-none"
            >
              <option value="low">کم (نیازمند برنامه‌ریزی)</option>
              <option value="normal">عادی (روال معمول)</option>
              <option value="high">بالا (کاهش موجودی)</option>
              <option value="urgent">فوری (اتمام موجودی ضروری)</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-ink">
              دلیل یا شرح کلی (اختیاری)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="مثال: کسری بار بارستا برای آخر هفته"
              className="w-full rounded-control border border-line bg-surface-subtle px-3 py-2.5 text-xs font-medium text-ink placeholder:text-ink-muted/60 focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        {/* Items Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <h3 className="text-xs font-black text-ink">اقلام درخواستی</h3>
            <span className="text-[11px] text-ink-muted">
              حداقل یک قلم کالا الزامی است
            </span>
          </div>

          {items.map((item, index) => (
            <div
              key={item.id}
              className="relative space-y-3 rounded-2xl border border-line bg-surface-subtle/50 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink-muted">
                  قلم {index + 1}
                </span>

                <div className="flex items-center gap-2">
                  <div className="flex rounded-lg border border-line bg-white p-0.5 text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() =>
                        setItems((prev) =>
                          prev.map((r, i) =>
                            i === index ? { ...r, type: "catalog" } : r,
                          ),
                        )
                      }
                      className={`rounded-md px-2.5 py-1 transition ${
                        item.type === "catalog"
                          ? "bg-primary text-white"
                          : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      کالای کاتالوگ
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setItems((prev) =>
                          prev.map((r, i) =>
                            i === index ? { ...r, type: "custom" } : r,
                          ),
                        )
                      }
                      className={`rounded-md px-2.5 py-1 transition ${
                        item.type === "custom"
                          ? "bg-primary text-white"
                          : "text-ink-muted hover:text-ink"
                      }`}
                    >
                      کالای سفارشی
                    </button>
                  </div>

                  {items.length > 1 ? (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="grid size-7 place-items-center rounded-lg text-danger transition hover:bg-danger-soft"
                      aria-label="حذف این قلم"
                    >
                      <IconTrash size={16} />
                    </button>
                  ) : null}
                </div>
              </div>

              {/* Product input based on type */}
              {item.type === "catalog" ? (
                <div>
                  {item.productId ? (
                    <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary-soft/40 p-3">
                      <div className="flex items-center gap-2">
                        <span className="grid size-8 place-items-center rounded-lg bg-primary text-white">
                          <IconPackage size={16} />
                        </span>
                        <div>
                          <p className="text-xs font-black text-ink">
                            {item.productTitle}
                          </p>
                          <p className="text-[10px] text-ink-muted">
                            {item.productBrand ?? "بدون برند"} • واحد: {item.productUnit ?? "عدد"}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setItems((prev) =>
                            prev.map((r, i) =>
                              i === index
                                ? {
                                    ...r,
                                    productId: undefined,
                                    productTitle: undefined,
                                    productBrand: undefined,
                                  }
                                : r,
                            ),
                          )
                        }
                        className="text-xs font-bold text-primary hover:underline"
                      >
                        تغییر کالا
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <IconSearch
                            size={16}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted"
                          />
                          <input
                            type="text"
                            placeholder="جستجوی نام یا برند کالا در کاتالوگ..."
                            value={activeSearchIndex === index ? searchQuery : ""}
                            onFocus={() => {
                              setActiveSearchIndex(index);
                              setSearchQuery("");
                              setSearchResults([]);
                            }}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full rounded-control border border-line bg-white py-2 pl-3 pr-9 text-xs font-medium text-ink placeholder:text-ink-muted/60 focus:border-primary focus:outline-none"
                          />
                          {isSearching ? (
                            <IconLoader2
                              size={16}
                              className="absolute left-3 top-1/2 -translate-y-1/2 animate-spin text-primary"
                            />
                          ) : null}
                        </div>
                      </div>

                      {activeSearchIndex === index && searchResults.length > 0 ? (
                        <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-line bg-white p-1 shadow-float">
                          {searchResults.map((product) => (
                            <button
                              key={product.productId}
                              type="button"
                              onClick={() => handleSelectProduct(index, product)}
                              className="flex w-full items-center justify-between rounded-lg p-2 text-right transition hover:bg-surface-subtle"
                            >
                              <div>
                                <p className="text-xs font-bold text-ink">
                                  {product.title}
                                </p>
                                <p className="text-[10px] text-ink-muted">
                                  {product.brand ?? "بدون برند"} • واحد: {product.unit}
                                </p>
                              </div>
                              <IconCheck size={16} className="text-primary opacity-0 hover:opacity-100" />
                            </button>
                          ))}
                        </div>
                      ) : null}

                      {activeSearchIndex === index &&
                      searchQuery.trim().length > 1 &&
                      !isSearching &&
                      searchResults.length === 0 ? (
                        <div className="absolute z-20 mt-1 w-full rounded-xl border border-line bg-white p-3 text-center text-xs text-ink-muted shadow-float">
                          کالایی با این عنوان یافت نشد. می‌توانید از حالت «کالای سفارشی» استفاده کنید.
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <input
                    type="text"
                    value={item.customTitle}
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((r, i) =>
                          i === index ? { ...r, customTitle: e.target.value } : r,
                        ),
                      )
                    }
                    placeholder="عنوان دقیق کالای درخواستی (مثلاً: شیر پاکتی کم چرب یک لیتری)"
                    className="w-full rounded-control border border-line bg-white px-3 py-2 text-xs font-medium text-ink placeholder:text-ink-muted/60 focus:border-primary focus:outline-none"
                  />
                </div>
              )}

              {/* Quantity & Note */}
              <div className="grid grid-cols-[100px_minmax(0,1fr)] gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-ink-muted">
                    تعداد / مقدار
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((r, i) =>
                          i === index
                            ? { ...r, quantity: Math.max(1, parseInt(e.target.value, 10) || 1) }
                            : r,
                        ),
                      )
                    }
                    className="w-full rounded-control border border-line bg-white px-3 py-2 text-center text-xs font-black text-ink focus:border-primary focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold text-ink-muted">
                    توضیحات این قلم (اختیاری)
                  </label>
                  <input
                    type="text"
                    value={item.note}
                    onChange={(e) =>
                      setItems((prev) =>
                        prev.map((r, i) =>
                          i === index ? { ...r, note: e.target.value } : r,
                        ),
                      )
                    }
                    placeholder="مثال: تاریخ انقضای بیشتر از ۳ ماه"
                    className="w-full rounded-control border border-line bg-white px-3 py-2 text-xs font-medium text-ink placeholder:text-ink-muted/60 focus:border-primary focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleAddItem}
            className="w-full gap-1.5 border-dashed"
          >
            <IconPlus size={16} />
            <span>افزودن قلم کالای دیگر</span>
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 border-t border-line pt-4">
          <Button type="button" variant="secondary" onClick={handleClose} disabled={isPending}>
            انصراف
          </Button>
          <Button type="submit" loading={isPending}>
            ثبت درخواست خرید
          </Button>
        </div>
      </form>
    </Modal>
  );
}
