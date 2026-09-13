"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, FileText, Clipboard, Sparkles, Check, AlertCircle, RefreshCw } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<"file" | "paste">("paste");
  const [pastedText, setPastedText] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sampleMessyText = `COMMERCIAL INVOICE #AZ-GCY-2025/084
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
Attached Docs: Commercial Invoice, Packing List, CMR, AQTA Fitosanitar Sertifikatı`;

  const handlePasteSample = () => {
    setPastedText(sampleMessyText);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pastedText.trim() || loading) return;
    onAnalyzeText(pastedText);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      onUploadFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      onUploadFile(file);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 bg-slate-50/70 px-4 pt-3">
        <button
          onClick={() => setActiveTab("paste")}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "paste"
              ? "border-brand-600 text-brand-600 bg-white rounded-t-lg shadow-2xs"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <Clipboard className="w-4 h-4" />
          <span>{lang === "az" ? "Faktura Mətnini Daxil Et (Demo Üçün Sürətli)" : "Paste Invoice Text"}</span>
        </button>

        <button
          onClick={() => setActiveTab("file")}
          className={`flex items-center space-x-2 px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors ${
            activeTab === "file"
              ? "border-brand-600 text-brand-600 bg-white rounded-t-lg shadow-2xs"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>{lang === "az" ? "PDF / Şəkil Yüklə" : "Upload Document (PDF/Image)"}</span>
        </button>
      </div>

      <div className="p-5">
        {activeTab === "paste" ? (
          <form onSubmit={handleTextSubmit}>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700">
                {lang === "az"
                  ? "Qaimə-faktura və ya qablaşdırma mətni:"
                  : "Commercial Invoice / Packing List text:"}
              </label>
              <button
                type="button"
                onClick={handlePasteSample}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === "az" ? "Nümunə mətni yapışdır" : "Fill sample invoice text"}</span>
              </button>
            </div>

            <textarea
              value={pastedText}
              onChange={(e) => setPastedText(e.target.value)}
              placeholder={
                lang === "az"
                  ? "İstənilən real faktura mətnini, qeyri-formal ixracatçı qeydini və ya cədvəli bura yapışdırın..."
                  : "Paste any unstructured invoice text, packing list or broker notes here..."
              }
              rows={7}
              className="w-full font-mono text-xs sm:text-sm p-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 bg-slate-50/50 text-slate-800"
            />

            <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-slate-500 flex items-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {lang === "az"
                    ? "Qeyri-səlis və ya standart olmayan fakturalar süni intellektlə avtomatik təmizlənir."
                    : "Messy, informal, or multi-language invoice formats are automatically parsed."}
                </span>
              </p>

              <button
                type="submit"
                disabled={!pastedText.trim() || loading}
                className={`w-full sm:w-auto px-6 py-2.5 rounded-xl font-semibold text-sm shadow-md transition-all flex items-center justify-center space-x-2 ${
                  !pastedText.trim() || loading
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
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
                        ? "Sənədi Təhlil Et və Bəyannamə Tərtib Et"
                        : "Analyze & Generate Declaration Draft"}
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
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
                ? "border-brand-500 bg-brand-50/50"
                : "border-slate-300 hover:border-brand-400 bg-slate-50/30"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg,.txt"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-full bg-brand-100 text-brand-600 mx-auto flex items-center justify-center mb-3">
              <UploadCloud className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">
              {selectedFileName
                ? selectedFileName
                : lang === "az"
                ? "Faktura və ya Qablaşdırma Vərəqini Seçin / Sürüşdürün"
                : "Drop Commercial Invoice or Packing List here"}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              PDF, PNG, JPG və ya TXT formatları dəstəklənir (Maks 10 MB)
            </p>
            <button
              type="button"
              className="mt-4 px-4 py-2 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg border border-brand-200 transition-colors"
            >
              {lang === "az" ? "Kompüterdən Fayl Seç" : "Browse from Computer"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

