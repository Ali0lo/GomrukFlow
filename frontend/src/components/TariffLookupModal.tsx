"use client";

import React, { useState, useEffect } from "react";
import { X, Search, Database, BookOpen, AlertTriangle, CheckCircle2 } from "lucide-react";

interface TariffItem {
  hs_code: string;
  commodity_name_az: string;
  commodity_name_en: string;
  category: string;
  export_duty_rate: string;
  vat_rate: string;
  unit: string;
  classification_criteria: string;
  pitfalls: string;
  keywords: string[];
}

interface TariffLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: "az" | "en";
}

export default function TariffLookupModal({
  isOpen,
  onClose,
  lang,
}: TariffLookupModalProps) {
  const [tariffs, setTariffs] = useState<TariffItem[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetch("http://127.0.0.1:8000/api/reference/tariffs")
        .then((res) => res.json())
        .then((data) => {
          setTariffs(data.items || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = tariffs.filter((t) => {
    const q = search.toLowerCase();
    return (
      t.hs_code.toLowerCase().includes(q) ||
      t.commodity_name_az.toLowerCase().includes(q) ||
      t.commodity_name_en.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.toLowerCase().includes(q))
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[88vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-brand-500 text-white rounded-xl shadow-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                {lang === "az"
                  ? "XİF MN (HS) Kənd Təsərrüfatı Tarif Məlumat Bazası"
                  : "Agricultural Tariff Reference Knowledge Base"}
              </h3>
              <p className="text-xs text-slate-500">
                {lang === "az"
                  ? "Azərbaycan Respublikası DGK Nomenklaturası üzrə strukturlaşdırılmış qaydalar"
                  : "Structured local dataset of Azerbaijani export commodity codes & pitfalls"}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                lang === "az"
                  ? "XİF MN kodu, məhsul adı (nar, fındıq, xurma, pomidor) axtarın..."
                  : "Search HS code, product name, or keyword..."
              }
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Catalog List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              Məlumat tapılmadı.
            </div>
          ) : (
            filtered.map((item) => (
              <div key={item.hs_code} className="pt-3 first:pt-0">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-extrabold px-2.5 py-0.5 rounded-lg bg-brand-50 text-brand-700 border border-brand-200">
                      {item.hs_code}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">
                      {lang === "az" ? item.commodity_name_az : item.commodity_name_en}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0 text-xs">
                    <span className="font-semibold text-slate-700">
                      İxrac rüsumu: <b className="text-emerald-700">{item.export_duty_rate}</b>
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  <b className="text-slate-800">Meyar:</b> {item.classification_criteria}
                </p>

                {item.pitfalls && (
                  <div className="mt-2 p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-950 flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <b className="text-amber-900">Tez-tez edilən səhv:</b> {item.pitfalls}
                    </span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Ümumi qeydlər: {filtered.length} mal mövqeyi</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            {lang === "az" ? "Bağla" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}

