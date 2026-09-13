"use client";

import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Info,
  Edit3,
  Sparkles,
  ShieldAlert,
} from "lucide-react";

export interface ClassifiedLineItem {
  item_no: number;
  description: string;
  description_en?: string;
  quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  packages?: string;
  net_weight_kg?: number;
  gross_weight_kg?: number;
  hs_code: string;
  commodity_name_az: string;
  commodity_name_en: string;
  confidence: number;
  confidence_percentage?: number;
  confidence_label?: string;
  review_needed: boolean;
  review_reasons?: string[];
  justification_az: string;
  justification_en: string;
  classification_criteria?: string;
  pitfall_warning?: string;
  export_duty_rate?: string;
  vat_rate?: string;
  alternatives?: Array<{
    hs_code: string;
    commodity_name_az: string;
    commodity_name_en: string;
    reason_why: string;
  }>;
}

interface ClassificationTableProps {
  items: ClassifiedLineItem[];
  onOverrideCode: (itemIndex: number, newCode: string) => void;
  currency: string;
  lang: "az" | "en";
}

export default function ClassificationTable({
  items,
  onOverrideCode,
  currency,
  lang,
}: ClassificationTableProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // expand first item by default
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const getConfidenceBadge = (confidence: number, reviewNeeded: boolean) => {
    const pct = Math.round(confidence * 100);
    if (reviewNeeded || confidence < 0.75) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          <span>{pct}% — {lang === "az" ? "Yoxlama Tələb Olunur" : "Review Needed"}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-2xs">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>{pct}% — {lang === "az" ? "Yüksək Dəqiqlik" : "High Confidence"}</span>
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/50">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-base text-slate-900">
              {lang === "az" ? "Faktura Sətirləri və XİF MN Təsnifatı" : "Extracted Items & HS Classification"}
            </h3>
            <span className="px-2 py-0.5 text-xs font-semibold bg-slate-200 text-slate-700 rounded-md">
              {items.length} {lang === "az" ? "mal mövqeyi" : "items"}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            {lang === "az"
              ? "Hər bir sətir üzrə süni intellekt əsaslandırması, gömrük rüsumu və təsnifat təhlili"
              : "Plain-language customs reasoning, tariff codes, and confidence ratings per line"}
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="inline-flex items-center space-x-1 text-slate-600">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            <span>
              {lang === "az"
                ? "İnsan-Broker Nəzarəti (Human-in-the-loop)"
                : "Human Broker Oversight"}
            </span>
          </span>
        </div>
      </div>

      {/* Items list */}
      <div className="divide-y divide-slate-200">
        {items.map((item, idx) => {
          const isExpanded = expandedIndex === idx;
          const isEditing = editingIndex === idx;

          return (
            <div
              key={idx}
              className={`transition-colors ${
                item.review_needed ? "bg-amber-50/20" : "bg-white"
              }`}
            >
              {/* Row Summary */}
              <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                      #{item.item_no || idx + 1}
                    </span>
                    <span className="font-mono text-sm font-extrabold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-lg border border-brand-200">
                      {item.hs_code}
                    </span>
                    {getConfidenceBadge(item.confidence, item.review_needed)}

                    <span className="text-xs text-slate-500 font-medium">
                      Rüsum: <b className="text-slate-800">{item.export_duty_rate || "0%"}</b> (ƏDV: 0%)
                    </span>
                  </div>

                  <h4 className="font-bold text-sm sm:text-base text-slate-900 leading-snug">
                    {item.description}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    XİF MN Adı: <span className="text-slate-700 italic">{lang === "az" ? item.commodity_name_az : item.commodity_name_en}</span>
                  </p>
                </div>

                {/* Pricing and Action */}
                <div className="flex items-center justify-between lg:justify-end space-x-4 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                  <div className="text-left lg:text-right">
                    <div className="font-bold text-sm sm:text-base text-slate-900">
                      {item.total_price.toLocaleString("en-US", { minimumFractionDigits: 2 })} {currency}
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      {item.quantity.toLocaleString()} {item.unit} @ {item.unit_price} {currency}
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors flex items-center space-x-1 text-xs font-semibold"
                    title="Əsaslandırmanı göstər"
                  >
                    <span>{isExpanded ? (lang === "az" ? "Gizlət" : "Hide") : (lang === "az" ? "Detallar" : "Details")}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Collapsible Reasoning & Details */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-1 bg-slate-50/80 border-t border-slate-200/60 text-xs sm:text-sm space-y-3.5 animate-fadeIn">
                  {/* Human review warning banner if flagged */}
                  {item.review_needed && item.review_reasons && item.review_reasons.length > 0 && (
                    <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 flex items-start space-x-2.5">
                      <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs uppercase tracking-wider text-amber-800">
                          {lang === "az" ? "Broker Diqqətinə / İnsan Təsdiqi Tələb Olunur:" : "Broker Review Required:"}
                        </span>
                        <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs text-amber-900">
                          {item.review_reasons.map((r, rIdx) => (
                            <li key={rIdx}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* AI Plain Language Reasoning Justification */}
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center space-x-2 mb-1.5">
                      <div className="p-1 bg-brand-50 text-brand-600 rounded">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-xs uppercase tracking-wider text-brand-900">
                        {lang === "az" ? "Süni İntellekt Gömrük Əsaslandırması (Justification Reasoning):" : "AI Customs Classification Rationale:"}
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-sans text-xs sm:text-sm">
                      {lang === "az" ? item.justification_az : item.justification_en}
                    </p>
                  </div>

                  {/* Pitfalls & Criteria */}
                  {item.pitfall_warning && (
                    <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-blue-950 flex items-start space-x-2">
                      <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div className="text-xs leading-relaxed">
                        <span className="font-bold text-blue-900">
                          {lang === "az" ? "Təsnifat Qaydası & Tez-tez edilən səhvlər: " : "Classification Pitfall Warning: "}
                        </span>
                        <span>{item.pitfall_warning}</span>
                      </div>
                    </div>
                  )}

                  {/* Alternative codes override selector */}
                  {item.alternatives && item.alternatives.length > 0 && (
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                          {lang === "az" ? "Mümkün Alternativ Kodlar (Broker Dəyişikliyi):" : "Alternative Candidate Codes (Broker Override):"}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.alternatives.map((alt) => (
                          <div
                            key={alt.hs_code}
                            className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-brand-400 transition-colors flex items-center justify-between text-xs"
                          >
                            <div className="pr-2">
                              <span className="font-mono font-bold text-slate-800">{alt.hs_code}</span>
                              <p className="text-slate-500 text-[11px] truncate">
                                {lang === "az" ? alt.commodity_name_az : alt.commodity_name_en}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => onOverrideCode(idx, alt.hs_code)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded border border-brand-200 shrink-0"
                            >
                              {lang === "az" ? "Kodu Seç" : "Select"}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

