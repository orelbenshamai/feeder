"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { clearCart } from "@/lib/cart";
import { formatILS } from "@/lib/pricing";
import { media } from "@/lib/media";
import Link from "next/link";

type OrderItem = {
  productName?: string;
  bundleLabel?: string;
  sizeLabel: string;
  colorLabel: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  productId: string;
};

type Order = {
  orderId: string;
  status: string;
  totalPrice: number;
  items: OrderItem[];
  contact: {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    street: string;
    city: string;
    zip?: string;
  };
  createdAt: string;
};

const PRODUCT_FALLBACK_IMAGE: Record<string, string> = {
  prod_mesudar_feeder_001: media("medium_gray_1.png"),
  prod_mesudar_mat_001: media("mat_gray_1.png"),
};

type Status = "verifying" | "success" | "failed" | "error";

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <svg className="h-10 w-10 animate-spin text-clay" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    }>
      <CheckoutSuccessInner />
    </Suspense>
  );
}

function CheckoutSuccessInner() {
  const params = useSearchParams();
  const verified = useRef(false);
  const [status, setStatus] = useState<Status>("verifying");
  const [order, setOrder] = useState<Order | null>(null);
  const [paidAmount, setPaidAmount] = useState<string | null>(null);

  // Break out of iframe if loaded inside Hyp's modal
  useEffect(() => {
    if (typeof window !== "undefined" && window !== window.top) {
      window.top!.location.href = window.location.href;
    }
  }, []);

  useEffect(() => {
    if (verified.current) return;
    verified.current = true;

    // Preview mode — bypass Hyp verification with mock data
    if (params.get("preview") === "true") {
      setStatus("success");
      setPaidAmount("179");
      setOrder({
        orderId: "ORD-PREVIEW",
        status: "paid",
        totalPrice: 179,
        items: [
          {
            productName: "עמדת ההאכלה MESUDAR",
            sizeLabel: "בינוני",
            colorLabel: "אפור",
            price: 179,
            quantity: 1,
            productId: "prod_mesudar_feeder_001",
          },
        ],
        contact: {
          firstName: "ישראל",
          lastName: "ישראלי",
          phone: "050-1234567",
          email: "israel@example.com",
          street: "הרצל 1",
          city: "תל אביב",
          zip: "6100000",
        },
        createdAt: new Date().toISOString(),
      });
      return;
    }

    const id = params.get("Id");
    const ccode = params.get("CCode");
    const sign = params.get("Sign");
    const orderId = params.get("Order");
    const amount = params.get("Amount");

    if (!id || !ccode || !sign) {
      setStatus("error");
      return;
    }

    if (amount) setPaidAmount(amount);

    const payload: Record<string, string> = {};
    params.forEach((v, k) => { payload[k] = v; });

    fetch("/api/checkout/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(r => r.json())
      .then(async (data: { valid?: boolean; error?: string }) => {
        if (data.error || !data.valid) {
          setStatus(data.valid === false ? "failed" : "error");
          return;
        }

        clearCart();
        setStatus("success");

        // Fetch full order details
        if (orderId) {
          try {
            const res = await fetch(`/api/checkout/order?orderId=${encodeURIComponent(orderId)}`);
            if (res.ok) setOrder(await res.json());
          } catch { /* non-critical */ }
        }
      })
      .catch(() => setStatus("error"));
  }, [params]);

  return (
    <main dir="rtl" className="min-h-screen bg-cream">
      {status === "verifying" && (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          <svg className="h-10 w-10 animate-spin text-clay" viewBox="0 0 24 24" fill="none" aria-hidden>
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <p className="text-sm text-stone">מאמת תשלום…</p>
        </div>
      )}

      {status === "success" && (
        <div className="mx-auto max-w-xl px-5 py-12">

          {/* Header */}
          <div className="mb-10 flex flex-col items-center text-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-clay/12 ring-1 ring-clay/25">
              <svg viewBox="0 0 24 24" className="h-8 w-8 text-clay" fill="none" aria-hidden>
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-ink">ההזמנה התקבלה!</h1>
              <p className="mt-2 text-base text-stone">
                תודה{order ? `, ${order.contact.firstName}` : ""}! נשלח עדכון בקרוב.
              </p>
              {order && (
                <p className="mt-1 text-xs text-stone/60">מספר הזמנה: {order.orderId}</p>
              )}
            </div>
          </div>

          {order ? (
            <div className="flex flex-col gap-5">

              {/* Items */}
              <section className="rounded-2xl border border-line/60 bg-white overflow-hidden">
                <div className="border-b border-line/60 px-5 py-3.5">
                  <h2 className="text-sm font-bold text-ink">פרטי ההזמנה</h2>
                </div>
                <ul className="divide-y divide-line/40">
                  {order.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-4 px-5 py-4">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-cream">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageUrl ?? PRODUCT_FALLBACK_IMAGE[item.productId] ?? media("product_image.png")}
                          alt=""
                          className="h-full w-full object-contain p-1"
                          draggable={false}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-ink leading-snug">
                          {item.bundleLabel ?? item.productName ?? "מוצר"}
                        </p>
                        <p className="text-xs text-stone mt-0.5">
                          {item.sizeLabel} · {item.colorLabel} · כמות: {item.quantity}
                        </p>
                      </div>
                      <p className="shrink-0 text-sm font-bold text-ink">
                        {formatILS(item.price * item.quantity)}
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="flex items-center justify-between border-t border-line/60 px-5 py-4 bg-cream/60">
                  <span className="text-sm font-semibold text-stone">סה״כ שולם</span>
                  <span className="text-lg font-bold text-ink">
                    {paidAmount ? `₪${paidAmount}` : formatILS(order.totalPrice)}
                  </span>
                </div>
              </section>

              {/* Delivery details */}
              <section className="rounded-2xl border border-line/60 bg-white overflow-hidden">
                <div className="border-b border-line/60 px-5 py-3.5">
                  <h2 className="text-sm font-bold text-ink">פרטי משלוח</h2>
                </div>
                <dl className="divide-y divide-line/40">
                  <Row label="שם" value={`${order.contact.firstName} ${order.contact.lastName}`} />
                  <Row label="טלפון" value={order.contact.phone} />
                  {order.contact.email && <Row label="אימייל" value={order.contact.email} />}
                  <Row label="כתובת" value={`${order.contact.street}, ${order.contact.city}${order.contact.zip ? ` ${order.contact.zip}` : ""}`} />
                </dl>
              </section>

            </div>
          ) : (
            <div className="rounded-2xl border border-line/60 bg-white px-6 py-8 text-center text-sm text-stone">
              טוען פרטי הזמנה…
            </div>
          )}

          <Link
            href="/"
            className="mt-8 flex w-full items-center justify-center rounded-2xl bg-ink py-3.5 text-sm font-bold text-cream transition hover:bg-ink/90"
          >
            חזרה לחנות
          </Link>
        </div>
      )}

      {status === "failed" && (
        <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-red-500" fill="none" aria-hidden>
              <path d="M6 18L18 6M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">התשלום נכשל</h1>
            <p className="mt-2 text-base text-stone">לא הצלחנו לעבד את התשלום. ניתן לנסות שוב.</p>
          </div>
          <Link href="/checkout" className="mt-2 text-sm font-semibold text-clay hover:underline">
            חזרה לתשלום
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone/10">
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-stone" fill="none" aria-hidden>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/>
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">משהו השתבש</h1>
            <p className="mt-2 text-base text-stone">לא ניתן לאמת את התשלום. אנא פנו אלינו.</p>
          </div>
          <Link href="/" className="text-sm font-semibold text-clay hover:underline">חזרה לחנות</Link>
        </div>
      )}
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-2 px-5 py-3.5">
      <dt className="text-xs font-semibold text-stone shrink-0">{label}:</dt>
      <dd className="text-sm text-ink">{value}</dd>
    </div>
  );
}
