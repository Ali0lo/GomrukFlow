"use client";

import React from "react";
import { Sparkles, Apple, Nut, Warehouse, ArrowRight, ShieldAlert } from "lucide-react";

interface SampleInvoice {
  id: string;
  title_az: string;
  title_en: string;
  badge: string;
  summary_az: string;
  summary_en: string;
  invoice_meta: {
    destination_country: string;
    currency: string;
    total_amount?: number;
  };
  demonstration_points: string[];
}

interface SampleInvoicesBarProps {
  samples: SampleInvoice[];
  selectedId: string | null;
  onSelectSample: (sample: SampleInvoice) => void;
  lang: "az" | "en";
  loading: boolean;
}

export default function SampleInvoicesBar({
  samples,
  selectedId,
  onSelectSample,
  lang,
  loading,
}: SampleInvoicesBarProps) {
  const getIcon = (id: string) => {
    if (id.includes("goychay")) {
      return <Apple className="w-5 h-5 text-rose-500" />;
    } else if (id.includes("zaqatala")) {
      return <Nut className="w-5 h-5 text-amber-600" />;
    } else {
      return <Warehouse className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-navy-900 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-700/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-brand-500/20 text-brand-400 rounded-lg border border-brand-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-white">
            {lang === "az"
              ? "1-Klik Canlı Nümayiş Ssenariləri (Startup Pitch Demo)"
              : "1-Click Live Pitch Demo Invoices"}
          </h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          {lang === "az"
            ? "Münsiflər qarşısında dərhal sınaqdan keçirmək üçün seçin"
            : "Select a realistic shipment scenario for instant execution"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {samples.map((sample) => {
          const isSelected = selectedId === sample.id;
          return (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              disabled={loading}
              className={`text-left p-4 rounded-xl border transition-all duration-200 relative group flex flex-col justify-between ${
                isSelected
                  ? "bg-brand-950/70 border-brand-400 shadow-md shadow-brand-500/20 ring-2 ring-brand-400/30"
                  : "bg-slate-800/80 hover:bg-slate-800 border-slate-700/80 hover:border-slate-500/80"
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 bg-slate-900/80 rounded-lg border border-slate-700">
                    {getIcon(sample.id)}
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                      sample.id.includes("zaqatala")
                        ? "bg-amber-950/80 text-amber-300 border-amber-800/60"
                        : "bg-sky-950/80 text-sky-300 border-sky-800/60"
                    }`}
                  >
                    {sample.badge}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-white group-hover:text-brand-300 transition-colors">
                  {lang === "az" ? sample.title_az : sample.title_en}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {lang === "az" ? sample.summary_az : sample.summary_en}
                </p>
              </div>

              <div className="mt-3.5 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-mono">
                  {sample.invoice_meta.destination_country}
                </span>
                <span className="font-semibold text-brand-400 group-hover:translate-x-0.5 transition-transform flex items-center space-x-1">
                  <span>{lang === "az" ? "Yüklə & İcra et" : "Load & Run"}</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

