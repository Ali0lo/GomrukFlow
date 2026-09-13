"use client";

import React from "react";
import { Sparkles, Apple, Nut, Warehouse, ArrowRight, ShieldAlert, Loader2, Weight, DollarSign, MapPin } from "lucide-react";

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
  line_items?: Array<{
    quantity: number;
    unit: string;
    total_price: number;
  }>;
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
      return <Nut className="w-5 h-5 text-amber-500" />;
    } else {
      return <Warehouse className="w-5 h-5 text-emerald-500" />;
    }
  };

  const getCardStats = (sample: SampleInvoice) => {
    if (sample.id.includes("goychay")) {
      return { val: "42,200 EUR", weight: "26.3 ton", target: "Almaniya (Aİ)", risk: "EUR.1 Çatışmır" };
    } else if (sample.id.includes("zaqatala")) {
      return { val: "134,800 EUR", weight: "22.0 ton", target: "İtaliya (Aİ)", risk: "Aflatoksin Protokolu Yoxdur" };
    } else {
      return { val: "37,600 USD", weight: "18.0 ton", target: "Dubay (BƏƏ)", risk: "Form C Mənşə Sənədi" };
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-navy-900 dark:from-slate-950 dark:via-slate-900 dark:to-navy-950 text-white rounded-2xl p-5 sm:p-6 shadow-xl border border-slate-700/60 dark:border-slate-800 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center space-x-2.5">
          <div className="p-1.5 bg-brand-500/20 text-brand-400 rounded-lg border border-brand-500/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span>{lang === "az" ? "1-Klik Canlı Nümayiş Ssenariləri" : "1-Click Live Pitch Demo Invoices"}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-brand-500/30 text-brand-300 border border-brand-400/30">
                PITCH READY
              </span>
            </h2>
          </div>
        </div>
        <span className="text-xs text-slate-400 font-medium">
          {lang === "az"
            ? "Münsiflər qarşısında 0 risklə dərhal icra edin"
            : "Guaranteed zero-lag live pitch execution"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {samples.map((sample) => {
          const isSelected = selectedId === sample.id;
          const stats = getCardStats(sample);
          return (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              disabled={loading}
              className={`text-left p-4 rounded-xl border transition-all duration-200 relative group flex flex-col justify-between ${
                isSelected
                  ? "bg-brand-950/80 border-brand-400 shadow-lg shadow-brand-500/20 ring-2 ring-brand-400/40 translate-y-[-2px]"
                  : "bg-slate-800/80 dark:bg-slate-900/80 hover:bg-slate-800 dark:hover:bg-slate-850 border-slate-700/70 hover:border-slate-500"
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div className="p-2 bg-slate-900/90 dark:bg-slate-950 rounded-lg border border-slate-700 dark:border-slate-800 shadow-xs">
                    {getIcon(sample.id)}
                  </div>
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                      sample.id.includes("zaqatala")
                        ? "bg-amber-950/80 text-amber-300 border-amber-800/60"
                        : sample.id.includes("goychay")
                        ? "bg-rose-950/80 text-rose-300 border-rose-800/60"
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

                {/* Micro Stats Row */}
                <div className="mt-3 flex items-center justify-between text-[11px] bg-slate-900/60 dark:bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-700/50">
                  <span className="font-mono text-emerald-400 font-bold">{stats.val}</span>
                  <span className="text-slate-400 font-medium">{stats.weight}</span>
                  <span className="text-slate-300 font-medium">{stats.target}</span>
                </div>
              </div>

              <div className="mt-3.5 pt-3 border-t border-slate-700/60 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-amber-400/90 font-medium text-[11px] truncate max-w-[140px]" title={stats.risk}>
                  ⚠️ {stats.risk}
                </span>

                <span className="font-bold text-brand-400 group-hover:translate-x-0.5 transition-transform flex items-center space-x-1 shrink-0">
                  {loading && isSelected ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{lang === "az" ? "Hesablanır..." : "Running..."}</span>
                    </>
                  ) : (
                    <>
                      <span>{lang === "az" ? "Yüklə & İcra et" : "Run Demo"}</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </>
                  )}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
