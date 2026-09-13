"use client";

import React, { useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  XCircle,
  FileText,
  AlertOctagon,
  HelpCircle,
  Building,
  ExternalLink,
  Check,
  Filter,
} from "lucide-react";

export interface ComplianceCheckItem {
  doc_key: string;
  customs_code: string;
  name_az: string;
  name_en: string;
  issuing_authority: string;
  description_az: string;
  description_en: string;
  status: "provided" | "missing" | "recommended";
  status_label_az: string;
  status_label_en: string;
  severity: "critical" | "warning" | "success";
  impact_note_az: string;
  impact_note_en: string;
}

interface DocumentComplianceCardProps {
  compliance: {
    overall_status: string;
    overall_status_az: string;
    missing_count: number;
    destination_zone: string;
    destination_country: string;
    customs_regulatory_note: string;
    checklist: ComplianceCheckItem[];
  };
  lang: "az" | "en";
}

export default function DocumentComplianceCard({
  compliance,
  lang,
}: DocumentComplianceCardProps) {
  const [filterMode, setFilterMode] = useState<"all" | "missing" | "provided">("all");
  const isActionRequired = compliance.missing_count > 0;

  const filteredChecklist = compliance.checklist.filter((item) => {
    if (filterMode === "missing") return item.status === "missing";
    if (filterMode === "provided") return item.status === "provided";
    return true;
  });

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      {/* Header Banner */}
      <div
        className={`p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isActionRequired
            ? "bg-rose-50/80 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60 text-rose-950 dark:text-rose-200"
            : "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60 text-emerald-950 dark:text-emerald-200"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`p-2.5 rounded-xl shadow-xs ${
              isActionRequired
                ? "bg-rose-600 dark:bg-rose-500 text-white"
                : "bg-emerald-600 dark:bg-emerald-500 text-white"
            }`}
          >
            {isActionRequired ? (
              <ShieldAlert className="w-6 h-6" />
            ) : (
              <ShieldCheck className="w-6 h-6" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-base">
                {lang === "az"
                  ? "Tələb Olunan Sənəd Yoxlama Siyahısı (Compliance Checklist)"
                  : "Required Document Checklist"}
              </h3>
              <span
                className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isActionRequired
                    ? "bg-rose-200 dark:bg-rose-900/80 text-rose-900 dark:text-rose-200 border border-rose-300 dark:border-rose-800"
                    : "bg-emerald-200 dark:bg-emerald-900/80 text-emerald-900 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-800"
                }`}
              >
                {isActionRequired
                  ? lang === "az"
                    ? `${compliance.missing_count} Vacib Sənəd Çatışmır`
                    : `${compliance.missing_count} Missing Documents`
                  : lang === "az"
                  ? "Tam Uyğundur"
                  : "Fully Compliant"}
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {lang === "az"
                ? `Təyinat ölkəsi: ${compliance.destination_country} (${compliance.destination_zone} İxrac Zonası)`
                : `Destination Market: ${compliance.destination_country} (${compliance.destination_zone} Export Zone)`}
            </p>
          </div>
        </div>

        {/* Regulatory summary badge */}
        <div className="text-xs bg-white/90 dark:bg-slate-950/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 max-w-sm">
          <span className="font-semibold text-slate-900 dark:text-white">
            {lang === "az" ? "Rejim Qaydası: " : "Regulation: "}
          </span>
          <span className="text-[11px] leading-tight">
            {compliance.customs_regulatory_note}
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-5 pt-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilterMode("all")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterMode === "all"
                ? "bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {lang === "az" ? "Bütün Sənədlər" : "All Documents"} ({compliance.checklist.length})
          </button>
          <button
            onClick={() => setFilterMode("missing")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors flex items-center space-x-1 ${
              filterMode === "missing"
                ? "bg-rose-600 text-white"
                : "text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            }`}
          >
            <span>{lang === "az" ? "Çatışmayanlar" : "Missing"}</span>
            <span className="px-1.5 py-0.2 bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200 rounded-full text-[10px]">
              {compliance.missing_count}
            </span>
          </button>
          <button
            onClick={() => setFilterMode("provided")}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterMode === "provided"
                ? "bg-emerald-600 text-white"
                : "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
            }`}
          >
            {lang === "az" ? "Təqdim Edilənlər" : "Provided"} ({compliance.checklist.length - compliance.missing_count})
          </button>
        </div>

        <span className="text-slate-400 dark:text-slate-500 font-mono text-[11px] hidden sm:block">
          Qraf 44 Avtomatlaşdırması
        </span>
      </div>

      {/* Checklist items */}
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filteredChecklist.map((item, idx) => {
            const isMissing = item.status === "missing";
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isMissing
                    ? "bg-rose-50/40 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/60 ring-1 ring-rose-400/20 shadow-2xs"
                    : "bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                        {item.customs_code}
                      </span>
                      <h4
                        className={`font-bold text-xs sm:text-sm leading-snug ${
                          isMissing ? "text-rose-950 dark:text-rose-200 font-extrabold" : "text-slate-900 dark:text-white"
                        }`}
                      >
                        {lang === "az" ? item.name_az : item.name_en}
                      </h4>
                    </div>

                    {isMissing ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800 shrink-0">
                        <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                        <span>{lang === "az" ? "ÇATIŞMIR" : "MISSING"}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shrink-0">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>{lang === "az" ? "Mövcuddur" : "Provided"}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                    <Building className="w-3 h-3 text-slate-400" />
                    <span>{item.issuing_authority}</span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {lang === "az" ? item.description_az : item.description_en}
                  </p>
                </div>

                {/* Impact Note */}
                <div
                  className={`mt-3 pt-2.5 border-t text-xs leading-snug flex items-start space-x-1.5 ${
                    isMissing
                      ? "border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-300 font-medium"
                      : "border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {isMissing && <AlertOctagon className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />}
                  <span>{lang === "az" ? item.impact_note_az : item.impact_note_en}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
