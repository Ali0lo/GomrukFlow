"use client";

import React from "react";
import { CheckCircle2, Loader2, Circle, FileSearch, Sparkles, ShieldCheck, FileCheck } from "lucide-react";

interface ProcessingStepperProps {
  currentStep: number; // 1 to 4
  lang: "az" | "en";
}

export default function ProcessingStepper({ currentStep, lang }: ProcessingStepperProps) {
  const steps = [
    {
      id: 1,
      title_az: "Sənəd Oxunur & Məlumat Çıxarılır",
      title_en: "Document OCR & Extraction",
      desc_az: "İxracatçı VÖEN, alıcı, çatdırılma şərtləri və sətir detalları",
      desc_en: "Parsing header, exporter TIN, consignee, quantities and values",
      time: "~0.3s",
      icon: FileSearch,
    },
    {
      id: 2,
      title_az: "XİF MN (HS) Təsnifatı & Əsaslandırma",
      title_en: "Tariff Classification & Reasoning",
      desc_az: "Lokal tarif bilik bazası ilə uyğunlaşdırma və risk analizi",
      desc_en: "Matching against 10-digit nomenclature with confidence scoring",
      time: "~0.5s",
      icon: Sparkles,
    },
    {
      id: 3,
      title_az: "AQTA & Mənşə Sənəd Uyğunluğu",
      title_en: "Compliance & Certificate Check",
      desc_az: "Təyinat bazarı (Aİ/MDB/BƏƏ) üzrə məcburi sənəd tələbləri",
      desc_en: "Evaluating required phytosanitary, origin and lab report rules",
      time: "~0.4s",
      icon: ShieldCheck,
    },
    {
      id: 4,
      title_az: "Bəyannamə (EK 10) Qaralaması",
      title_en: "Customs Declaration Draft",
      desc_az: "Dövlət Gömrük Komitəsi qrafaları üzrə yekun qaralama",
      desc_en: "Populating standard export declaration boxes for broker review",
      time: "~0.3s",
      icon: FileCheck,
    },
  ];

  const progressPct = Math.min(100, Math.round((currentStep / 4) * 100));

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-xs border border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-brand-500 animate-ping"></span>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {lang === "az" ? "Ağıllı Emal Zənciri (Live Pipeline Tracking)" : "Live Pipeline Execution"}
          </h3>
        </div>
        <span className="text-xs font-mono font-bold px-2.5 py-0.5 bg-brand-50 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 rounded-full border border-brand-200 dark:border-brand-800">
          Step {Math.min(currentStep, 4)} / 4 ({progressPct}%)
        </span>
      </div>

      {/* Progress Bar Line */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-4">
        <div
          className="bg-gradient-to-r from-brand-600 via-sky-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {steps.map((step) => {
          const isDone = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isPending = currentStep < step.id;
          const StepIcon = step.icon;

          return (
            <div
              key={step.id}
              className={`p-3.5 rounded-xl border transition-all duration-300 ${
                isDone
                  ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/60 text-slate-800 dark:text-slate-200"
                  : isCurrent
                  ? "bg-brand-50/80 dark:bg-brand-950/40 border-brand-300 dark:border-brand-700 ring-2 ring-brand-400/20 shadow-xs"
                  : "bg-slate-50/50 dark:bg-slate-950/30 border-slate-200 dark:border-slate-800/80 text-slate-400 dark:text-slate-500"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-1.5 rounded-lg ${
                    isDone
                      ? "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300"
                      : isCurrent
                      ? "bg-brand-600 dark:bg-brand-500 text-white animate-pulse"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  <StepIcon className="w-4 h-4" />
                </div>

                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-mono font-semibold text-slate-400 dark:text-slate-500">
                    {step.time}
                  </span>
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 className="w-4 h-4 text-brand-600 dark:text-brand-400 animate-spin" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" />
                  )}
                </div>
              </div>

              <h4
                className={`text-xs font-bold ${
                  isDone
                    ? "text-slate-900 dark:text-white"
                    : isCurrent
                    ? "text-brand-900 dark:text-brand-200 font-extrabold"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {lang === "az" ? step.title_az : step.title_en}
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                {lang === "az" ? step.desc_az : step.desc_en}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
