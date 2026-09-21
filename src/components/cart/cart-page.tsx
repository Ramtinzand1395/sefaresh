"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { IconCheck } from "@tabler/icons-react";
import { CartItemsStep } from "@/components/cart/cart-items-step";
import { CartModals, type CartModalState } from "@/components/cart/cart-modals";
import { CartStepper } from "@/components/cart/cart-stepper";
import { CartSummary } from "@/components/cart/cart-summary";
import { CheckoutDetailsStep } from "@/components/cart/checkout-details-step";
import { PaymentStep } from "@/components/cart/payment-step";
import { PageHeader } from "@/components/dashboard/page-header";
import { checkoutCosts, defaultDeliveryAddress, deliverySlots, initialCartItems, type CartItem, type DeliveryAddress } from "@/data/cart";

export function CartPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [items, setItems] = useState<CartItem[]>(initialCartItems);
  const [address, setAddress] = useState<DeliveryAddress>(defaultDeliveryAddress);
  const [selectedSlotId, setSelectedSlotId] = useState(deliverySlots[1].id);
  const [paymentMethod, setPaymentMethod] = useState<"after-approval" | "online">("after-approval");
  const [emailInvoice, setEmailInvoice] = useState(true);
  const [modal, setModal] = useState<CartModalState>(null);
  const [notice, setNotice] = useState("");
  const reduceMotion = useReducedMotion();

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.price * item.quantity, 0), [items]);
  const shipping = items.length ? checkoutCosts.shipping : 0;
  const discount = items.length >= 3 ? checkoutCosts.discount : 0;
  const total = Math.max(0, subtotal + shipping - discount);

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2800);
  };

  const changeQuantity = (id: string, quantity: number) => setItems((current) => current.map((item) => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item));
  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
    showNotice("کالا از سبد حذف شد.");
  };
  const addItem = (item: CartItem) => {
    setItems((current) => current.some((currentItem) => currentItem.id === item.id) ? current : [...current, item]);
    showNotice(`${item.name} به سبد اضافه شد.`);
  };

  const goNext = () => {
    if (step < 3) setStep((step + 1) as 2 | 3);
    else setModal("success");
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  };

  const resetFlow = () => {
    setItems(initialCartItems);
    setStep(1);
    setPaymentMethod("after-approval");
    setModal(null);
  };

  return (
    <>
      <PageHeader title={step === 1 ? "سبد خرید" : step === 2 ? "تأیید اطلاعات سفارش" : "پرداخت سفارش"} description={step === 1 ? "اقلام انتخاب‌شده را بررسی کنید و برای ثبت سفارش ادامه دهید." : step === 2 ? "اطلاعات تحویل و روش پرداخت را بررسی و تأیید کنید." : "روش پرداخت خود را انتخاب کنید تا سفارش شما ثبت و بررسی شود."} />
      <CartStepper step={step} />

      <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="min-w-0">
          {step === 1 ? <CartItemsStep items={items} onAddProduct={() => setModal("catalog")} onChangeQuantity={changeQuantity} onRemove={removeItem} /> : null}
          {step === 2 ? <CheckoutDetailsStep address={address} slots={deliverySlots} selectedSlotId={selectedSlotId} paymentMethod={paymentMethod} onEditAddress={() => setModal("address")} onOpenDelivery={() => setModal("delivery")} onSelectSlot={setSelectedSlotId} onSelectPayment={setPaymentMethod} /> : null}
          {step === 3 ? <PaymentStep method={paymentMethod} gateway="zarinpal" emailInvoice={emailInvoice} onSelectMethod={setPaymentMethod} onToggleInvoice={() => setEmailInvoice((value) => !value)} /> : null}
        </div>
        <aside className="min-w-0"><CartSummary step={step} itemCount={items.length} subtotal={subtotal} shipping={shipping} discount={discount} total={total} disabled={!items.length} onNext={goNext} onBack={() => { setStep((step - 1) as 1 | 2); window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }); }} /></aside>
      </div>

      <CartModals key={`${address.title}-${address.street}-${selectedSlotId}`} modal={modal} items={items} address={address} deliverySlots={deliverySlots} selectedSlotId={selectedSlotId} orderNumber="۱۲۹۵" onClose={() => setModal(null)} onAddItem={addItem} onSaveAddress={(nextAddress) => { setAddress(nextAddress); setModal(null); showNotice("آدرس تحویل به‌روزرسانی شد."); }} onSaveDelivery={(slotId) => { setSelectedSlotId(slotId); setModal(null); showNotice("زمان تحویل ثبت شد."); }} onReset={resetFlow} />

      <div className="sr-only" role="status" aria-live="polite">{notice}</div>
      <AnimatePresence>{notice ? <motion.div role="status" className="fixed bottom-4 left-1/2 z-[90] flex min-h-12 -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-xl bg-ink px-4 text-xs font-bold text-white shadow-float" initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}><span className="grid size-7 place-items-center rounded-full bg-success"><IconCheck size={17} aria-hidden="true" /></span>{notice}</motion.div> : null}</AnimatePresence>
    </>
  );
}
