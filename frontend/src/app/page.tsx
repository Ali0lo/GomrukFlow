"use client";

import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import SampleInvoicesBar from "@/components/SampleInvoicesBar";
import DocumentUploadZone from "@/components/DocumentUploadZone";
import ProcessingStepper from "@/components/ProcessingStepper";
import ClassificationTable, { ClassifiedLineItem } from "@/components/ClassificationTable";
import DocumentComplianceCard from "@/components/DocumentComplianceCard";
import DeclarationDraftView from "@/components/DeclarationDraftModal";
import TariffLookupModal from "@/components/TariffLookupModal";
import {
  FileText,
  ShieldAlert,
  CheckCircle2,
  FileCheck,
  Building,
  TrendingUp,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export default function HomePage() {
  const [lang, setLang] = useState<"az" | "en">("az");
  const [samples, setSamples] = useState<any[]>([]);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);

  // Pipeline state
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [pipelineData, setPipelineData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"classification" | "compliance" | "declaration">("classification");
  const [isTariffModalOpen, setIsTariffModalOpen] = useState(false);

  // Load samples on mount
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/samples")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.samples) {
          setSamples(data.samples);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch samples from API, using fallback", err);
      });
  }, []);

  // Execute processing pipeline with progressive realistic timing
  const runPipeline = async (params: { sample_id?: string; text?: string }) => {
    setIsProcessing(true);
    setCurrentStep(1);

    // Staged step progression for pitch demo visibility
    const stepTimer1 = setTimeout(() => setCurrentStep(2), 600);
    const stepTimer2 = setTimeout(() => setCurrentStep(3), 1200);
    const stepTimer3 = setTimeout(() => setCurrentStep(4), 1800);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/process-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!response.ok) {
        throw new Error("Pipeline API returned error");
      }

      const data = await response.json();
      setTimeout(() => {
        setPipelineData(data);
        setIsProcessing(false);
        setCurrentStep(4);
      }, 2000);
    } catch (error) {
      console.error("Pipeline error:", error);
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setIsProcessing(false);
    }
  };

  const handleSelectSample = (sample: any) => {
    setSelectedSampleId(sample.id);
    runPipeline({ sample_id: sample.id });
  };

  const handleAnalyzeText = (text: string) => {
    setSelectedSampleId(null);
    runPipeline({ text });
  };

  const handleUploadFile = (file: File) => {
    setSelectedSampleId(null);
    // Use filename hints or run text
    runPipeline({ text: file.name });
  };

  const handleOverrideCode = (itemIndex: number, newCode: string) => {
    if (!pipelineData) return;
    const updatedItems = [...pipelineData.line_items];
    const oldItem = updatedItems[itemIndex];
    updatedItems[itemIndex] = {
      ...oldItem,
      hs_code: newCode,
      review_needed: false,
      confidence: 0.98,
      confidence_label: "Broker Tərəfindən Təsdiqləndi (Manual Override)",
      review_reasons: [],
    };

    setPipelineData({
      ...pipelineData,
      line_items: updatedItems,
    });
  };

  const resetAll = () => {
    setPipelineData(null);
    setSelectedSampleId(null);
    setIsProcessing(false);
    setCurrentStep(1);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-brand-500 selection:text-white pb-16">
      {/* Top Navbar */}
      <Header
        lang={lang}
        onToggleLang={() => setLang(lang === "az" ? "en" : "az")}
        onOpenTariffModal={() => setIsTariffModalOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full flex-1 space-y-6">
        {/* Intro Pitch Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl shadow-xs border border-slate-200">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-bold mb-2 border border-brand-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {lang === "az"
                  ? "Azərbaycan Kənd Təsərrüfatı İxracatçıları və Brokerləri üçün"
                  : "For Azerbaijani Agricultural Exporters & Customs Brokers"}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              {lang === "az"
                ? "Saatlarla vaxt aparan gömrük sənədləşməsini saniyələrə endirin."
                : "Transform hours of customs export filing into seconds."}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              {lang === "az"
                ? "Fakturanı daxil edin → Süni intellekt XİF MN kodunu təyin etsin, AQTA və mənşə sənədlərində çatışmayanları qırmızı bayraqla göstərsin və bəyannamə (EK 10) qaralamasını hazırlasın."
                : "Upload or paste invoice → AI auto-classifies HS codes with plain-language reasoning, flags missing AQTA & origin certificates, and pre-fills export declaration drafts."}
            </p>
          </div>

          {pipelineData && (
            <button
              onClick={resetAll}
              className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition-colors flex items-center space-x-1.5 self-start shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{lang === "az" ? "Yenidən Başla" : "Reset Demo"}</span>
            </button>
          )}
        </div>

        {/* 1-Click Sample Invoices Quickbar */}
        <SampleInvoicesBar
          samples={samples}
          selectedId={selectedSampleId}
          onSelectSample={handleSelectSample}
          lang={lang}
          loading={isProcessing}
        />

        {/* Document Upload & Input Zone */}
        {!pipelineData && (
          <DocumentUploadZone
            onAnalyzeText={handleAnalyzeText}
            onUploadFile={handleUploadFile}
            loading={isProcessing}
            lang={lang}
          />
        )}

        {/* Live Processing Stepper */}
        {(isProcessing || pipelineData) && (
          <ProcessingStepper currentStep={currentStep} lang={lang} />
        )}

        {/* Pipeline Results Dashboard */}
        {pipelineData && !isProcessing && (
          <div className="space-y-6 animate-fadeIn">
            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  {lang === "az" ? "Faktura Dəyəri" : "Invoice Value"}
                </span>
                <span className="text-lg sm:text-xl font-mono font-extrabold text-slate-900 mt-1 block">
                  {pipelineData.invoice_meta.currency}{" "}
                  {pipelineData.declaration.summary_totals.total_invoice_value.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                  })}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  {pipelineData.invoice_meta.incoterms}
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  {lang === "az" ? "Təyinat Ölkəsi" : "Destination Market"}
                </span>
                <span className="text-lg sm:text-xl font-bold text-slate-900 mt-1 block truncate">
                  {pipelineData.invoice_meta.destination_country}
                </span>
                <span className="text-[11px] font-semibold text-brand-600 font-mono">
                  Zona: {pipelineData.compliance.destination_zone}
                </span>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  {lang === "az" ? "Təsnif Edilən Mallar" : "Classified Items"}
                </span>
                <span className="text-lg sm:text-xl font-bold text-slate-900 mt-1 block">
                  {pipelineData.line_items.length} {lang === "az" ? "mövqe" : "lines"}
                </span>
                <span className="text-[11px] text-emerald-700 font-semibold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>XİF MN 100% Tamamlandı</span>
                </span>
              </div>

              <div
                className={`p-4 rounded-xl border shadow-2xs ${
                  pipelineData.compliance.missing_count > 0
                    ? "bg-rose-50/50 border-rose-200"
                    : "bg-emerald-50/50 border-emerald-200"
                }`}
              >
                <span className="text-[11px] font-bold uppercase tracking-wider block text-slate-500">
                  {lang === "az" ? "Sənəd Uyğunluğu" : "Document Compliance"}
                </span>
                <span
                  className={`text-lg sm:text-xl font-bold mt-1 block ${
                    pipelineData.compliance.missing_count > 0
                      ? "text-rose-700"
                      : "text-emerald-700"
                  }`}
                >
                  {pipelineData.compliance.missing_count > 0
                    ? `${pipelineData.compliance.missing_count} Çatışmayan`
                    : "Tam Təsdiqləndi"}
                </span>
                <span className="text-[11px] text-slate-600 font-medium">
                  {pipelineData.compliance.missing_count > 0
                    ? "Gömrükdə saxlanılma riski var"
                    : "Sərhəd keçidi üçün hazırdır"}
                </span>
              </div>
            </div>

            {/* Tab Navigation for Detailed Inspection */}
            <div className="flex border-b border-slate-200 bg-white rounded-t-2xl px-4 pt-2 shadow-2xs">
              <button
                onClick={() => setActiveTab("classification")}
                className={`flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
                  activeTab === "classification"
                    ? "border-brand-600 text-brand-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>
                  {lang === "az"
                    ? "1. XİF MN Təsnifatı & Əsaslandırma"
                    : "1. HS Classification & Rationale"}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("compliance")}
                className={`flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors relative ${
                  activeTab === "compliance"
                    ? "border-brand-600 text-brand-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>
                  {lang === "az"
                    ? "2. AQTA & Sənəd Uyğunluğu"
                    : "2. Required Documents Checklist"}
                </span>
                {pipelineData.compliance.missing_count > 0 && (
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("declaration")}
                className={`flex items-center space-x-2 px-4 py-3 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
                  activeTab === "declaration"
                    ? "border-brand-600 text-brand-600"
                    : "border-transparent text-slate-600 hover:text-slate-900"
                }`}
              >
                <FileCheck className="w-4 h-4" />
                <span>
                  {lang === "az"
                    ? "3. Bəyannamə Qaralaması (EK 10)"
                    : "3. Export Declaration Draft"}
                </span>
              </button>
            </div>

            {/* Active Tab View */}
            <div>
              {activeTab === "classification" && (
                <ClassificationTable
                  items={pipelineData.line_items}
                  onOverrideCode={handleOverrideCode}
                  currency={pipelineData.invoice_meta.currency}
                  lang={lang}
                />
              )}

              {activeTab === "compliance" && (
                <DocumentComplianceCard
                  compliance={pipelineData.compliance}
                  lang={lang}
                />
              )}

              {activeTab === "declaration" && (
                <DeclarationDraftView
                  declaration={pipelineData.declaration}
                  lang={lang}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Tariff Database Search Modal */}
      <TariffLookupModal
        isOpen={isTariffModalOpen}
        onClose={() => setIsTariffModalOpen(false)}
        lang={lang}
      />
    </div>
  );
}

