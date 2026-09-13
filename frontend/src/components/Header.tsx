"use client";

import React from "react";
import { ShieldCheck, BookOpen, Database, Sparkles, Globe2, FileSpreadsheet } from "lucide-react";

interface HeaderProps {
  lang: "az" | "en";
  onToggleLang: () => void;
  onOpenTariffModal: () => void;
  onOpenSampleModal?: () => void;
}

export default function Header({
  lang,
  onToggleLang,
  onOpenTariffModal,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-sky-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 font-mono">
                Gömrük<span className="text-brand-600 font-sans">Flow</span>
              </span>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                {lang === "az" ? "Aqro-İxrac Modulu" : "Agri-Export Module"}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {lang === "az"
                ? "Süni İntellektlə Gömrük Təsnifatı və İxrac Sənədləşməsi"
                : "AI Customs Classification & Export Compliance Copilot"}
            </p>
          </div>
        </div>

        {/* Right tools & actions */}
        <div className="flex items-center space-x-3">
          {/* Tariff Database Lookup Button */}
          <button
            onClick={onOpenTariffModal}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-brand-600" />
            <span>{lang === "az" ? "XİF MN Bazası" : "Tariff Database"}</span>
          </button>

          {/* Engine badge */}
          <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{lang === "az" ? "Lokal Qayda Bazası Aktiv" : "Local Rules Active"}</span>
          </div>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-300 shadow-xs transition-colors"
            title="Dili dəyiş / Change language"
          >
            <Globe2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{lang.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

