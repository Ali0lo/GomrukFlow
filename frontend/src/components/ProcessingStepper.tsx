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
      icon: FileSearch,
    },
    {
      id: 2,
      title_az: "XİF MN (HS) Təsnifatı & Əsaslandırma",
      title_en: "Tariff Classification & Reasoning",
      desc_az: "Lokal tarif bilik bazası ilə uyğunlaşdırma və risk analizi",
      desc_en: "Matching against 10-digit nomenclature with confidence scoring",
      icon: Sparkles,
    },
    {
      id: 3,
      title_az: "AQTA & Mənşə Sənəd Uyğunluğu",
      title_en: "Compliance & Certificate Check",
      desc_az: "Təyinat bazarı (Aİ/MDB/BƏƏ) üzrə məcburi sənəd tələbləri",
      desc_en: "Evaluating required phytosanitary, origin and lab report rules",
      icon: ShieldCheck,
    },
    {
      id: 4,
      title_az: "Bəyannamə (EK 10) Qaralaması",
      title_en: "Customs Declaration Draft",
      desc_az: "Dövlət Gömrük Komitəsi qrafaları üzrə yekun qaralama",
      desc_en: "Populating standard export declaration boxes for broker review",
      icon: FileCheck,
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {lang === "az" ? "Ağıllı Emal Zənciri (Live Pipeline Tracking)" : "Live Pipeline Execution"}
        </h3>
        <span className="text-xs font-mono font-semibold px-2.5 py-0.5 bg-brand-50 text-brand-700 rounded-full border border-brand-200">
          Step {Math.min(currentStep, 4)} of 4
        </span>
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
                  ? "bg-emerald-50/50 border-emerald-200 text-slate-800"
                  : isCurrent
                  ? "bg-brand-50/70 border-brand-300 ring-2 ring-brand-400/20 shadow-sm"
                  : "bg-slate-50/50 border-slate-200 text-slate-400"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`p-1.5 rounded-lg ${
                    isDone
                      ? "bg-emerald-100 text-emerald-700"
                      : isCurrent
                      ? "bg-brand-600 text-white animate-pulse"
                      : "bg-slate-200 text-slate-500"
                  }`}
                >
                  <StepIcon className="w-4 h-4" />
                </div>

                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-brand-600 animate-spin" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300" />
                )}
              </div>

              <h4
                className={`text-xs font-bold ${
                  isDone
                    ? "text-slate-900"
                    : isCurrent
                    ? "text-brand-900 font-extrabold"
                    : "text-slate-500"
                }`}
              >
                {lang === "az" ? step.title_az : step.title_en}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                {lang === "az" ? step.desc_az : step.desc_en}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

