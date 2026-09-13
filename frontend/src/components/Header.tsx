"use client";

import React from "react";
import { ShieldCheck, Database, Globe2, Sun, Moon, Github, Sparkles } from "lucide-react";

interface HeaderProps {
  lang: "az" | "en";
  theme: "light" | "dark";
  onToggleLang: () => void;
  onToggleTheme: () => void;
  onOpenTariffModal: () => void;
}

export default function Header({
  lang,
  theme,
  onToggleLang,
  onToggleTheme,
  onOpenTariffModal,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Tagline */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-sky-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 ring-1 ring-white/20">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white font-mono">
                Gömrük<span className="text-brand-600 dark:text-brand-400 font-sans">Flow</span>
              </span>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 rounded-full border border-emerald-200 dark:border-emerald-800">
                {lang === "az" ? "Aqro-İxrac Modulu" : "Agri-Export"}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
              {lang === "az"
                ? "Süni İntellektlə Gömrük Təsnifatı və İxrac Sənədləşməsi"
                : "AI Customs Classification & Export Compliance Copilot"}
            </p>
          </div>
        </div>

        {/* Right tools & actions */}
        <div className="flex items-center space-x-2 sm:space-x-2.5">
          {/* Tariff Database Lookup Button */}
          <button
            onClick={onOpenTariffModal}
            className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>{lang === "az" ? "XİF MN Bazası" : "Tariff Database"}</span>
          </button>

          {/* Engine badge */}
          <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{lang === "az" ? "Lokal Qaydalar Aktiv" : "Local Rules Active"}</span>
          </div>

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleTheme}
            aria-label="Toggle Theme"
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            title={theme === "dark" ? "İşıqlı rejimə keç" : "Qaranlıq rejimə keç (Dark Mode)"}
          >
            {theme === "dark" ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg border border-slate-300 dark:border-slate-700 shadow-2xs transition-colors"
            title="Dili dəyiş / Change language"
          >
            <Globe2 className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <span>{lang.toUpperCase()}</span>
          </button>

          {/* GitHub link */}
          <a
            href="https://github.com/Ali0lo/GomrukFlow"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
            title="GitHub Repository"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
}
