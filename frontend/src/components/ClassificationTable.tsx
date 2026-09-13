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
  Search,
  Download,
  Copy,
  Check,
  Percent,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCsv, setCopiedCsv] = useState(false);

  const getConfidenceBadge = (confidence: number, reviewNeeded: boolean) => {
    const pct = Math.round(confidence * 100);
    if (reviewNeeded || confidence < 0.75) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shadow-2xs">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>{pct}% — {lang === "az" ? "Yoxlama Tələb Olunur" : "Review Needed"}</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shadow-2xs">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        <span>{pct}% — {lang === "az" ? "Yüksək Dəqiqlik" : "High Confidence"}</span>
      </span>
    );
  };

  const filteredItems = items.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.description.toLowerCase().includes(q) ||
      item.hs_code.toLowerCase().includes(q) ||
      item.commodity_name_az.toLowerCase().includes(q) ||
      item.commodity_name_en.toLowerCase().includes(q)
    );
  });

  const handleCopyCsv = () => {
    const headers = "No,HS Code,Description,Quantity,Unit,Unit Price,Total Price,Confidence,Review Needed\n";
    const rows = items
      .map(
        (i) =>
          `"${i.item_no}","${i.hs_code}","${i.description.replace(/"/g, '""')}","${i.quantity}","${i.unit}","${i.unit_price}","${i.total_price}","${Math.round(i.confidence * 100)}%","${i.review_needed ? 'YES' : 'NO'}"`
      )
      .join("\n");
    navigator.clipboard.writeText(headers + rows);
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 2000);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      {/* Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 dark:bg-slate-950/60">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              {lang === "az" ? "Faktura Sətirləri və XİF MN Təsnifatı" : "Extracted Items & HS Classification"}
            </h3>
            <span className="px-2 py-0.5 text-xs font-semibold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md">
              {items.length} {lang === "az" ? "mal mövqeyi" : "items"}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {lang === "az"
              ? "Hər bir sətir üzrə süni intellekt əsaslandırması, gömrük rüsumu və təsnifat təhlili"
              : "Plain-language customs reasoning, tariff codes, and confidence ratings per line"}
          </p>
        </div>

        {/* Action buttons: Search & CSV */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "az" ? "Sətirlərdə axtar..." : "Filter items..."}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500 w-40 sm:w-48"
            />
          </div>

          <button
            onClick={handleCopyCsv}
            className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors shadow-2xs"
            title="CSV Formatında Kopyala"
          >
            {copiedCsv ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>{lang === "az" ? "Kopyalandı" : "Copied"}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>CSV</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Items list */}
      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {filteredItems.map((item, idx) => {
          const isExpanded = expandedIndex === idx;

          return (
            <div
              key={idx}
              className={`transition-colors ${
                item.review_needed
                  ? "bg-amber-50/20 dark:bg-amber-950/10"
                  : "bg-white dark:bg-slate-900"
              }`}
            >
              {/* Row Summary */}
              <div className="p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded">
                      #{item.item_no || idx + 1}
                    </span>
                    <span className="font-mono text-sm font-extrabold text-brand-700 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-0.5 rounded-lg border border-brand-200 dark:border-brand-800">
                      {item.hs_code}
                    </span>
                    {getConfidenceBadge(item.confidence, item.review_needed)}

                    <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {lang === "az" ? "İxrac Rüsumu:" : "Export Duty:"} <b className="text-slate-800 dark:text-slate-200">{item.export_duty_rate || "0%"}</b> (ƏDV: 0%)
                    </span>
                  </div>

                  <h4 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                    {item.description}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                    XİF MN: <span className="text-slate-700 dark:text-slate-300 italic">{lang === "az" ? item.commodity_name_az : item.commodity_name_en}</span>
                  </p>
                </div>

                {/* Pricing and Action */}
                <div className="flex items-center justify-between lg:justify-end space-x-4 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 dark:border-slate-800">
                  <div className="text-left lg:text-right">
                    <div className="font-bold text-sm sm:text-base text-slate-900 dark:text-white font-mono">
                      {item.total_price.toLocaleString("en-US", { minimumFractionDigits: 2 })} {currency}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                      {item.quantity.toLocaleString()} {item.unit} @ {item.unit_price} {currency}
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors flex items-center space-x-1 text-xs font-semibold"
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
                <div className="px-5 pb-5 pt-1 bg-slate-50/80 dark:bg-slate-950/70 border-t border-slate-200/60 dark:border-slate-800/80 text-xs sm:text-sm space-y-3.5 animate-fadeIn">
                  {/* Human review warning banner if flagged */}
                  {item.review_needed && item.review_reasons && item.review_reasons.length > 0 && (
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 rounded-xl text-amber-900 dark:text-amber-200 flex items-start space-x-2.5">
                      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300">
                          {lang === "az" ? "Broker Diqqətinə / İnsan Təsdiqi Tələb Olunur:" : "Broker Review Required:"}
                        </span>
                        <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs text-amber-900 dark:text-amber-200">
                          {item.review_reasons.map((r, rIdx) => (
                            <li key={rIdx}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {/* AI Plain Language Reasoning Justification */}
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs">
                    <div className="flex items-center space-x-2 mb-1.5">
                      <div className="p-1 bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 rounded">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-bold text-xs uppercase tracking-wider text-brand-900 dark:text-brand-300">
                        {lang === "az" ? "Süni İntellekt Gömrük Əsaslandırması (Justification Reasoning):" : "AI Customs Classification Rationale:"}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans text-xs sm:text-sm">
                      {lang === "az" ? item.justification_az : item.justification_en}
                    </p>
                  </div>

                  {/* Pitfalls & Criteria */}
                  {item.pitfall_warning && (
                    <div className="p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl text-blue-950 dark:text-blue-200 flex items-start space-x-2">
                      <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                      <div className="text-xs leading-relaxed">
                        <span className="font-bold text-blue-900 dark:text-blue-300">
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
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                          {lang === "az" ? "Mümkün Alternativ Kodlar (Broker Dəyişikliyi):" : "Alternative Candidate Codes (Broker Override):"}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {item.alternatives.map((alt) => (
                          <div
                            key={alt.hs_code}
                            className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-400 dark:hover:border-brand-500 transition-colors flex items-center justify-between text-xs"
                          >
                            <div className="pr-2">
                              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{alt.hs_code}</span>
                              <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate">
                                {lang === "az" ? alt.commodity_name_az : alt.commodity_name_en}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => onOverrideCode(idx, alt.hs_code)}
                              className="px-2.5 py-1 text-[11px] font-semibold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-950 hover:bg-brand-100 rounded border border-brand-200 dark:border-brand-800 shrink-0"
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
