"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart } from "./CartContext";
import { getSettings, initStore } from "@/app/lib/store";

export default function CartDrawer() {
  const {
    items,
    setQuantity,
    removeItem,
    clear,
    totalPrice,
    isOpen,
    closeCart,
  } = useCart();
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [messageTemplate, setMessageTemplate] = useState("");

  useEffect(() => {
    initStore();
    const s = getSettings();
    setWhatsappNumber(s.whatsappNumber ?? "");
    setMessageTemplate(
      s.whatsappMessageTemplate ||
        "Hello GFO Foods! I would like to order:\n\n{items}\n\nEstimated Total: \u20a6{total}\n\nKindly confirm my order and provide payment details. Thank you!",
    );
  }, []);

  function buildWhatsAppUrl() {
    const itemsText = items
      .map(
        (i) =>
          `\u2022 ${i.productName}${i.variantLabel ? ` (${i.variantLabel})` : ""} \u00d7 ${i.quantity} \u2014 \u20a6${(i.price * i.quantity).toLocaleString()}`,
      )
      .join("\n");
    const message = messageTemplate
      .replace("{items}", itemsText)
      .replace("{total}", totalPrice.toLocaleString());
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  return (
    <>
      {/* Overlay - Subtler backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/30 z-100 backdrop-blur-xs animate-in fade-in duration-500"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer - Modern rounded aesthetic - smaller scale */}
      <div
        className={`fixed top-4 right-4 bottom-4 w-[380px] max-w-[calc(100vw-32px)] bg-white z-101 flex flex-col rounded-5xl border border-slate-100 transition-all duration-700 cubic-bezier(0.16, 1, 0.3, 1) ${
          isOpen ? "translate-x-0 opacity-100" : "translate-x-[110%] opacity-0"
        }`}
      >
        {/* Header - Modern rounding & tight hierarchy */}
        <div className="px-8 py-8 border-b border-slate-50 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-display font-bold text-slate-900 tracking-tight uppercase">
              Your Cart
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1.5">
              Review items
            </p>
          </div>
          <button
            onClick={closeCart}
            className="w-10 h-10 bg-slate-50 rounded-full border border-transparent hover:bg-slate-100 flex items-center justify-center transition-all active:scale-90"
            aria-label="Close cart"
          >
            <svg
              className="w-5 h-5 text-slate-400 group-hover:text-slate-900"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content - tight proximity cards */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-6 text-center animate-in fade-in duration-500">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                <svg
                  className="w-8 h-8 text-slate-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007Z"
                  />
                </svg>
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                The cart feels light
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item, i) => (
                <li
                  key={item.productId}
                  className="group flex gap-4 p-4 border border-slate-50 hover:bg-slate-50 transition-all rounded-3xl"
                >
                  {/* Image - modern rounding */}
                  <div className="w-16 h-20 bg-slate-100 rounded-2xl relative shrink-0 overflow-hidden m-0.5">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200" />
                    )}
                  </div>

                  {/* Info - tight spacing */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[13px] font-bold text-slate-950 leading-tight line-clamp-1">
                          {item.productName}
                        </p>
                        <button
                          onClick={() =>
                            removeItem(item.productId, item.variantLabel)
                          }
                          className="text-slate-300 hover:text-red-500 transition-colors p-0.5"
                          aria-label="Remove item"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2.5}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18 18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 line-clamp-1">
                        {item.unit}{" "}
                        {item.variantLabel ? `| ${item.variantLabel}` : ""}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <p className="text-[15px] font-bold text-slate-900 tabular-nums">
                        &#8358;{(item.price * item.quantity).toLocaleString()}
                      </p>

                      {/* Qty controls - rounded pill */}
                      <div className="flex items-center bg-white p-1 rounded-full border border-slate-100">
                        <button
                          onClick={() =>
                            setQuantity(
                              item.productId,
                              item.quantity - 1,
                              item.variantLabel,
                            )
                          }
                          className="w-7 h-7 rounded-full hover:bg-slate-50 text-slate-900 font-bold flex items-center justify-center transition-all text-xs"
                        >
                          -
                        </button>
                        <span className="text-[11px] font-bold w-7 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            setQuantity(
                              item.productId,
                              item.quantity + 1,
                              item.variantLabel,
                            )
                          }
                          className="w-7 h-7 rounded-full hover:bg-slate-50 text-slate-900 font-bold flex items-center justify-center transition-all text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer - sharp CTA */}
        {items.length > 0 && (
          <div className="p-8 bg-slate-50 border-t border-slate-100 space-y-6 rounded-b-5xl">
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] font-bold tracking-[0.3em] text-slate-400 uppercase">
                Subtotal
              </span>
              <span className="text-2xl font-display font-bold text-slate-950 tabular-nums">
                &#8358;{totalPrice.toLocaleString()}
              </span>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] text-slate-400 text-center leading-relaxed font-medium">
                Orders are finalized via WhatsApp. We will confirm availability
                and delivery details.
              </p>

              {whatsappNumber ? (
                <a
                  href={buildWhatsAppUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-slate-950 hover:bg-emerald-600 text-white py-4 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] transition-all text-center flex items-center justify-center gap-3 active:scale-[0.98] shadow-lg shadow-slate-200"
                >
                  Checkout on WhatsApp
                </a>
              ) : (
                <div className="p-4 bg-white border border-slate-100 rounded-full text-center">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                    WhatsApp Integration Inactive
                  </p>
                </div>
              )}

              <button
                onClick={clear}
                className="w-full text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors py-1"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
