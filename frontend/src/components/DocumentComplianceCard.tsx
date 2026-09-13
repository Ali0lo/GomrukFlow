"use client";

import React from "react";
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  XCircle,
  FileText,
  AlertOctagon,
  HelpCircle,
  Building,
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
  const isActionRequired = compliance.missing_count > 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Header Banner */}
      <div
        className={`p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          isActionRequired
            ? "bg-rose-50/70 border-rose-200 text-rose-950"
            : "bg-emerald-50/70 border-emerald-200 text-emerald-950"
        }`}
      >
        <div className="flex items-center space-x-3">
          <div
            className={`p-2.5 rounded-xl shadow-xs ${
              isActionRequired
                ? "bg-rose-600 text-white"
                : "bg-emerald-600 text-white"
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
                    ? "bg-rose-200 text-rose-900 border border-rose-300"
                    : "bg-emerald-200 text-emerald-900 border border-emerald-300"
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
            <p className="text-xs text-slate-600 mt-0.5">
              {lang === "az"
                ? `Təyinat ölkəsi: ${compliance.destination_country} (${compliance.destination_zone})`
                : `Destination Country: ${compliance.destination_country} (${compliance.destination_zone})`}
            </p>
          </div>
        </div>

        {/* Regulatory summary badge */}
        <div className="text-xs bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 max-w-sm">
          <span className="font-semibold text-slate-900">
            {lang === "az" ? "Rejim Qaydası: " : "Regulation: "}
          </span>
          <span className="text-[11px] leading-tight">
            {compliance.customs_regulatory_note}
          </span>
        </div>
      </div>

      {/* Checklist items */}
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {compliance.checklist.map((item, idx) => {
            const isMissing = item.status === "missing";
            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                  isMissing
                    ? "bg-rose-50/40 border-rose-300 ring-1 ring-rose-400/20 shadow-2xs"
                    : "bg-slate-50/60 border-slate-200"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-white rounded border border-slate-200 text-slate-700">
                        {item.customs_code}
                      </span>
                      <h4
                        className={`font-bold text-xs sm:text-sm leading-snug ${
                          isMissing ? "text-rose-950 font-extrabold" : "text-slate-900"
                        }`}
                      >
                        {lang === "az" ? item.name_az : item.name_en}
                      </h4>
                    </div>

                    {isMissing ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300 shrink-0">
                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                        <span>{lang === "az" ? "ÇATIŞMIR" : "MISSING"}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shrink-0">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{lang === "az" ? "Mövcuddur" : "Provided"}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 mb-2">
                    <Building className="w-3 h-3 text-slate-400" />
                    <span>{item.issuing_authority}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {lang === "az" ? item.description_az : item.description_en}
                  </p>
                </div>

                {/* Impact Note */}
                <div
                  className={`mt-3 pt-2.5 border-t text-xs leading-snug flex items-start space-x-1.5 ${
                    isMissing
                      ? "border-rose-200 text-rose-900 font-medium"
                      : "border-slate-200/80 text-slate-500"
                  }`}
                >
                  {isMissing && <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />}
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

