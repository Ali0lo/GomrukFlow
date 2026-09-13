"use client";

import React, { useState } from "react";
import {
  FileText,
  Printer,
  Copy,
  Check,
  Download,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Building,
  FileSpreadsheet,
} from "lucide-react";

interface DeclarationDraftProps {
  declaration: {
    declaration_id: string;
    regime_type: string;
    created_at: string;
    status: string;
    boxes: any;
    declaration_items: any[];
    summary_totals: {
      total_items_count: number;
      total_invoice_value: number;
      currency: string;
      total_net_weight_kg: number;
      total_gross_weight_kg: number;
    };
    legal_disclaimer: {
      az: string;
      en: string;
    };
  };
  lang: "az" | "en";
  onClose?: () => void;
}

export default function DeclarationDraftView({
  declaration,
  lang,
}: DeclarationDraftProps) {
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const { boxes, declaration_items, summary_totals } = declaration;

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(declaration, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSummary = () => {
    const textReport = `===============================================================
GÖMRÜKFLOW — İXRAC BƏYANNAMƏSİ QARALAMASI (FORM EK 10)
ID: ${declaration.declaration_id} | Tarix: ${declaration.created_at}
===============================================================

1. BƏYANNAMƏ NÖVÜ: ${boxes.box_1_declaration_type.value}
2. İXRACATÇI: ${boxes.box_2_exporter.name} (VÖEN: ${boxes.box_2_exporter.voen})
   Ünvan: ${boxes.box_2_exporter.address}, ${boxes.box_2_exporter.country}
8. ALICI: ${boxes.box_8_consignee.name}
   Ünvan: ${boxes.box_8_consignee.address}
15/17. MARŞRUT: ${boxes.box_15_origin_country.country_name} -> ${boxes.box_17_destination_country.country_name}
20. İNCOTERMS: ${boxes.box_20_delivery_terms.value}
22. FAKTURA DƏYƏRİ: ${boxes.box_22_currency_and_total.formatted}
25. NƏQLİYYAT: ${boxes.box_25_transport.value}

BƏYAN EDİLƏN MALLAR:
---------------------------------------------------------------
${declaration_items
  .map(
    (it) =>
      `#${it.item_number} [${it.box_33_hs_code}] ${it.box_31_description}
   Netto: ${it.box_38_net_mass} kg | Brutto: ${it.box_35_gross_mass} kg | Dəyər: ${it.box_42_item_price} ${summary_totals.currency}`
  )
  .join("\n\n")}

QRAF 44 ƏLAVƏ SƏNƏDLƏR:
---------------------------------------------------------------
${boxes.box_44_documents.documents
  .map((d: any) => `[${d.customs_code}] ${d.document_name} (${d.status.toUpperCase()})`)
  .join("\n")}

QEYD: ${declaration.legal_disclaimer.az}
`;

    const blob = new Blob([textReport], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Declaration_EK10_${declaration.declaration_id}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      {/* Action Header */}
      <div className="p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold px-2 py-0.5 bg-brand-500 text-white rounded">
              {declaration.regime_type}
            </span>
            <h3 className="text-base sm:text-lg font-bold">
              {lang === "az"
                ? "Gömrük Bəyannaməsi Qaralaması (Declaration Draft Form)"
                : "Customs Export Declaration Draft"}
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            ID: {declaration.declaration_id} | Tarix: {declaration.created_at}
          </p>
        </div>

        <div className="flex items-center space-x-2 no-print">
          <button
            onClick={handleCopyJson}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === "az" ? "Kopyalandı" : "Copied"}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>JSON</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadSummary}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
          >
            {downloaded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === "az" ? "Yükləndi" : "Saved"}</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>TXT</span>
              </>
            )}
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white rounded-lg shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{lang === "az" ? "Çap et / PDF" : "Print / PDF"}</span>
          </button>
        </div>
      </div>

      {/* Official-style Disclaimer Banner */}
      <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 text-xs flex items-start space-x-2.5">
        <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <span className="font-bold">
            {lang === "az" ? "DİQQƏT — Qərar Dəstək Modulu: " : "NOTICE — Decision Support Tool: "}
          </span>
          <span>{lang === "az" ? declaration.legal_disclaimer.az : declaration.legal_disclaimer.en}</span>
        </div>
      </div>

      {/* Grid of Declaration Boxes */}
      <div className="p-5 space-y-6">
        {/* Row 1: Exporter & Consignee */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Box 2 Exporter */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              {boxes.box_2_exporter.label_az}
            </span>
            <div className="font-bold text-slate-900 dark:text-white text-sm">{boxes.box_2_exporter.name}</div>
            <div className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              VÖEN / TIN: <span className="font-mono font-bold text-slate-800 dark:text-slate-100">{boxes.box_2_exporter.voen}</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{boxes.box_2_exporter.address}</div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">{boxes.box_2_exporter.country}</div>
          </div>

          {/* Box 8 Consignee */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
              {boxes.box_8_consignee.label_az}
            </span>
            <div className="font-bold text-slate-900 dark:text-white text-sm">{boxes.box_8_consignee.name}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">{boxes.box_8_consignee.address}</div>
            <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-1">
              Təyinat Ölkəsi: {boxes.box_8_consignee.country}
            </div>
          </div>
        </div>

        {/* Row 2: Regimes, Transport, Currencies */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60">
            <span className="text-slate-400 dark:text-slate-500 block font-semibold text-[10px] uppercase">
              Qraf 1: Rejim
            </span>
            <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">{boxes.box_1_declaration_type.value}</span>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60">
            <span className="text-slate-400 dark:text-slate-500 block font-semibold text-[10px] uppercase">
              Qraf 20: Çatdırılma Şərti
            </span>
            <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">{boxes.box_20_delivery_terms.value}</span>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60">
            <span className="text-slate-400 dark:text-slate-500 block font-semibold text-[10px] uppercase">
              Qraf 22: Faktura Dəyəri
            </span>
            <span className="font-mono font-bold text-brand-700 dark:text-brand-400 mt-0.5 block text-sm">
              {boxes.box_22_currency_and_total.formatted}
            </span>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60">
            <span className="text-slate-400 dark:text-slate-500 block font-semibold text-[10px] uppercase">
              Qraf 25: Nəqliyyat Növü
            </span>
            <span className="font-bold text-slate-900 dark:text-slate-100 mt-0.5 block">{boxes.box_25_transport.value}</span>
          </div>
        </div>

        {/* Goods Items Table (Box 31, 33, 35, 38, 42) */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {lang === "az" ? "Qraf 31, 33, 38: Bəyan Edilən Mallar Cədvəli" : "Declared Commodities Table"}
            </h4>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Cəmi Netto: <b className="text-slate-800 dark:text-slate-200">{summary_totals.total_net_weight_kg.toLocaleString()} kg</b> | Brutto: <b className="text-slate-800 dark:text-slate-200">{summary_totals.total_gross_weight_kg.toLocaleString()} kg</b>
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3 w-12">№</th>
                  <th className="p-3">Malın Təsviri & Qablaşdırma (Qraf 31)</th>
                  <th className="p-3 font-mono">XİF MN Kodu (Qraf 33)</th>
                  <th className="p-3 text-right">Netto Çəki (Qraf 38)</th>
                  <th className="p-3 text-right">Brutto Çəki (Qraf 35)</th>
                  <th className="p-3 text-right">Gömrük Dəyəri (Qraf 42)</th>
                  <th className="p-3 text-center">İxrac Rüsumu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900">
                {declaration_items.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 dark:hover:bg-slate-850">
                    <td className="p-3 font-mono text-slate-400 dark:text-slate-500">{item.item_number}</td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900 dark:text-white">{item.box_31_description}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.box_31_packages}</div>
                    </td>
                    <td className="p-3 font-mono font-bold text-brand-700 dark:text-brand-400 whitespace-nowrap">
                      {item.box_33_hs_code}
                    </td>
                    <td className="p-3 text-right font-mono">
                      {item.box_38_net_mass.toLocaleString()} kq
                    </td>
                    <td className="p-3 text-right font-mono">
                      {item.box_35_gross_mass.toLocaleString()} kq
                    </td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900 dark:text-white">
                      {item.box_42_item_price.toLocaleString("en-US", { minimumFractionDigits: 2 })} {summary_totals.currency}
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 rounded font-semibold text-[11px]">
                        0%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Box 44 Attached Documents Reference */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-2.5">
            {boxes.box_44_documents.label_az}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
            {boxes.box_44_documents.documents.map((doc: any, idx: number) => (
              <div
                key={idx}
                className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between"
              >
                <div>
                  <span className="font-mono font-bold text-slate-500 dark:text-slate-400 text-[11px] mr-1.5">
                    [{doc.customs_code}]
                  </span>
                  <span className="font-medium text-slate-800 dark:text-slate-200">{doc.document_name}</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    doc.status === "missing"
                      ? "bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300"
                      : "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300"
                  }`}
                >
                  {doc.status === "missing" ? "ÇATIŞMIR" : "Mövcuddur"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Box 14 Declarant & Verification Notice */}
        <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div>
            <span className="text-slate-400 dark:text-slate-500 font-bold uppercase text-[10px]">
              Qraf 14: Bəyannaməçi / Gömrük Təmsilçisi
            </span>
            <div className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
              {boxes.box_14_declarant.name}
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-[11px]">{boxes.box_14_declarant.note}</p>
          </div>

          <div className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 text-center font-mono text-[11px] border border-slate-200 dark:border-slate-700 shrink-0">
            Broker Elektron İmzası üçün Hazırdır
          </div>
        </div>
      </div>
    </div>
  );
}
