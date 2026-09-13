"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  Clipboard,
  Sparkles,
  Check,
  AlertCircle,
  RefreshCw,
  X,
  FileCheck2,
  Trash2,
} from "lucide-react";

interface DocumentUploadZoneProps {
  onAnalyzeText: (text: string) => void;
  onUploadFile: (file: File) => void;
  loading: boolean;
  lang: "az" | "en";
}

export default function DocumentUploadZone({
  onAnalyzeText,
  onUploadFile,
  loading,
  lang,
}: DocumentUploadZoneProps) {
  const [activeTab, setActiveTab] = useState<"paste" | "file">("paste");
  const [pastedText, setPastedText] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const samplePresets = [
    {
      label_az: "Göyçay Nar & Şirə",
      label_en: "Goychay Pomegranate",
      text: `COMMERCIAL INVOICE #AZ-GCY-2025/084
Date: 18.10.2025
Exporter: Göyçay Aqro-İxracat MMC, VÖEN: 2301498111, Göyçay, Azərbaycan
Buyer: FrischeFrucht Import & Handel GmbH, Grossmarkt Fruchtallee 12, 20097 Hamburg, Germany
Delivery Terms: CIP Hamburg (Incoterms 2020)
Transport: Refrigerated TIR Truck (Mercedes 99-ZZ-412)
Currency: EUR

Goods Description:
1. Təzə Göyçay Narı (Gülöyşə sortu, I sort təzə yığım, 400-600qr) - 20,000 kq @ 1.45 EUR = 29,000.00 EUR
2. 100% Təbii Nar Şirəsi (Qatqısız, əlavə şəkərsiz, Brix 22, 1L şüşə butulka) - 6,000 litr @ 2.20 EUR = 13,200.00 EUR

Total Invoice Amount: 42,200.00 EUR
Attached Docs: Commercial Invoice, Packing List, CMR, AQTA Fitosanitar Sertifikatı`,
    },
    {
      label_az: "Zaqatala Fındıq",
      label_en: "Zaqatala Hazelnuts",
      text: `FAKTURA / INVOICE #INV-ZQT-9921
Tarix: 04.11.2025
İxracatçı: Zaqatala Fındıq Emalı və Ticarət ASC (VÖEN: 3600287141, Zaqatala)
Alıcı: Piemonte Dolciaria SpA, Via Cuneo 42, 12051 Alba (CN), Italy
Çatdırılma: FCA Zaqatala
Valyuta: EUR

Malların siyahısı:
1. Ləpələnmiş Meşə Fındığı (Atababa növü, 11-13mm, təmizlənmiş ləpə, nəmlik 5.8%) - 18,000 kq @ 6.80 EUR = 122,400.00 EUR
2. Qabıqlı Təbii Meşə Fındığı (Qabıqlı bütöv çərəzlik fındıq) - 4,000 kq @ 3.10 EUR = 12,400.00 EUR

Cəmi: 134,800.00 EUR
Qoşma sənədlər: Müqavilə #09-IT, CMR, Qaimə, EUR.1 sertifikatı, AQTA Fitosanitar arayışı.`,
    },
    {
      label_az: "Xaçmaz Pomidor & Qax Xurma",
      label_en: "Khachmaz Tomatoes",
      text: `COMMERCIAL INVOICE #EKO-UAE-552
Date: 20.11.2025
Shipper: Xaçmaz Eko-Tərəvəz MMC, VÖEN 1802937401, Khachmaz, Azerbaijan
Consignee: Gulf Fresh Food Trading LLC, Central Fruit & Veg Market, Dubai, UAE
Terms: CPT Dubai International Airport
Currency: USD

Items:
1. Təzə İstixana Pomidoru (Çəhrayı Pink Paradise, 1-ci sort) - 14,000 kq @ 1.60 USD = 22,400.00 USD
2. Qurudulmuş Qax Xurması (Təbii günəş qurusu, bütöv) - 4,000 kq @ 3.80 USD = 15,200.00 USD

Total: 37,600.00 USD
Attached: Invoice, Packing List, AQTA Phyto Certificate`,
    },
    {
      label_az: "Qeyri-formal Qısa Faktura",
      label_en: "Informal Broker Note",
      text: `Hesab faktura N 41
12 noyabr 2025
Gonderen: Quba Meyve Baglari MMC, Voen: 1902847111
Alıcı: Moscow Fresh Trade OOO, Rusiya Federasiyasi
Catdirilma: Dəmiryolu ilə Moskvaya

Mallar:
1. Quba alması (qırmızı qış sortu, I sort) - 15000 kq, qiyməti 0.85 USD, cəmi 12750 USD
2. Qax quru xurması (təbii quru, qutusuz) - 3000 kq, qiyməti 2.50 USD, cəmi 7500 USD

Senedler: Faktura, CMR, AQTA fitosanitar arayışı`,
    },
  ];

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim() || loading) return;
    onAnalyzeText(pastedText);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      onUploadFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      onUploadFile(file);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xs border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
      {/* Tab Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 px-4 pt-3">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab("paste")}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "paste"
                ? "border-brand-600 dark:border-brand-400 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900 rounded-t-lg shadow-2xs"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Clipboard className="w-4 h-4" />
            <span>{lang === "az" ? "Faktura Mətni ilə Təhlil" : "Paste Invoice Text"}</span>
          </button>

          <button
            onClick={() => setActiveTab("file")}
            className={`flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "file"
                ? "border-brand-600 dark:border-brand-400 text-brand-600 dark:text-brand-400 bg-white dark:bg-slate-900 rounded-t-lg shadow-2xs"
                : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            <span>{lang === "az" ? "PDF / Şəkil Sənəd Yüklə" : "Upload Document (PDF/Image)"}</span>
          </button>
        </div>

        {activeTab === "paste" && pastedText && (
          <button
            type="button"
            onClick={() => setPastedText("")}
            className="text-xs font-semibold text-slate-400 hover:text-rose-500 transition-colors flex items-center space-x-1 mb-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{lang === "az" ? "Təmizlə" : "Clear"}</span>
          </button>
        )}
      </div>

      <div className="p-5">
        {activeTab === "paste" ? (
          <form onSubmit={handleTextSubmit}>
            {/* Quick Sample Presets */}
            <div className="mb-3">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                {lang === "az" ? "Sürətli nümunə şablonları:" : "Quick sample presets:"}
              </span>
              <div className="flex flex-wrap gap-2">
                {samplePresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setPastedText(preset.text)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-700 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all flex items-center space-x-1"
                  >
                    <Sparkles className="w-3 h-3 text-brand-500" />
                    <span>{lang === "az" ? preset.label_az : preset.label_en}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder={
                  lang === "az"
                    ? "İstənilən real faktura mətnini, qeyri-formal ixracatçı qeydini və ya cədvəli bura yapışdırın...\nNümunə:\n1. 20 ton təzə Göyçay narı @ 1.45 EUR\n2. 5000 şüşə nar şirəsi @ 2.20 EUR"
                    : "Paste any invoice text, packing list or informal broker notes here..."
                }
                rows={7}
                className="w-full font-mono text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-600 transition-colors"
              />
              <div className="absolute right-3 bottom-3 text-[11px] font-mono text-slate-400 dark:text-slate-500 bg-white/80 dark:bg-slate-900/80 px-2 py-0.5 rounded">
                {pastedText.length} {lang === "az" ? "simvol" : "chars"}
              </div>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-brand-500 shrink-0" />
                <span>
                  {lang === "az"
                    ? "Qeyri-səlis, informal və qarışıq dillərdə sənədlər dözümlü heuristika ilə emal olunur."
                    : "Messy, informal or multilingual formats are parsed with fault-tolerant heuristics."}
                </span>
              </p>

              <button
                type="submit"
                disabled={!pastedText.trim() || loading}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center space-x-2 ${
                  !pastedText.trim() || loading
                    ? "bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed shadow-none"
                    : "bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/20 active:scale-98"
                }`}
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{lang === "az" ? "Təhlil edilir..." : "Processing Pipeline..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {lang === "az"
                        ? "Sənədi Təhlil Et və Bəyannamə Hazırla"
                        : "Analyze & Generate Declaration Draft"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                dragOver
                  ? "border-brand-500 bg-brand-50/50 dark:bg-brand-950/30"
                  : "border-slate-300 dark:border-slate-700 hover:border-brand-400 bg-slate-50/50 dark:bg-slate-950/50"
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf,.png,.jpg,.jpeg,.txt"
                className="hidden"
              />
              <div className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-950/80 text-brand-600 dark:text-brand-400 mx-auto flex items-center justify-center mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {selectedFile
                  ? selectedFile.name
                  : lang === "az"
                  ? "Faktura və ya Qablaşdırma Vərəqini Seçin / Sürüşdürün"
                  : "Drop Commercial Invoice or Packing List here"}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                PDF, PNG, JPG və ya TXT formatları dəstəklənir (Maks 10 MB)
              </p>
              <button
                type="button"
                className="mt-4 px-4 py-2 text-xs font-semibold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 hover:bg-brand-100 rounded-lg border border-brand-200 dark:border-brand-800 transition-colors"
              >
                {lang === "az" ? "Kompüterdən Fayl Seç" : "Browse from Computer"}
              </button>
            </div>

            {selectedFile && (
              <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs">
                  <FileCheck2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedFile.name}</span>
                  <span className="text-slate-400 font-mono">({Math.round(selectedFile.size / 1024)} KB)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
