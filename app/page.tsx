"use client";

import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import { Download, Minus, Plus, RotateCcw } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { ResumeForm } from "@/components/resume-form";
import { ResumePreview } from "@/components/resume-preview";
import { RESUME_STORAGE_KEY } from "@/lib/constants";
import { DEFAULT_RESUME_DATA } from "@/lib/default-resume";
import { IResume } from "@/types/resume";

const cloneDefaultResume = (): IResume =>
  JSON.parse(JSON.stringify(DEFAULT_RESUME_DATA)) as IResume;

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f4f5f7]" />}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const [resumeData, setResumeData] = useState<IResume>(cloneDefaultResume);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [previewScale, setPreviewScale] = useState(0.9);

  const searchParams = useSearchParams();
  const isPdfRender = useMemo(
    () => searchParams.get("pdf") === "1",
    [searchParams],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.localStorage.getItem(RESUME_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as IResume;
        setResumeData(parsed);
      }
    } catch (error) {
      console.error("Failed to read resume data", error);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated || typeof window === "undefined") {
      return;
    }
    try {
      window.localStorage.setItem(RESUME_STORAGE_KEY, JSON.stringify(resumeData));
    } catch (error) {
      console.error("Failed to persist resume data", error);
    }
  }, [resumeData, hasHydrated]);

  const handleResumeChange = useCallback((updater: (prev: IResume) => IResume) => {
    setResumeData((prev) => updater(prev));
  }, []);

  const clampScale = useCallback((next: number) => {
    const clamped = Math.min(1.6, Math.max(0.5, next));
    return parseFloat(clamped.toFixed(2));
  }, []);

  const zoomOut = useCallback(() => {
    setPreviewScale((prev) => clampScale(prev - 0.1));
  }, [clampScale]);

  const zoomIn = useCallback(() => {
    setPreviewScale((prev) => clampScale(prev + 0.1));
  }, [clampScale]);

  const zoomReset = useCallback(() => {
    setPreviewScale(1);
  }, []);

  const handleDownload = useCallback(async () => {
    try {
      setIsGeneratingPdf(true);
      const response = await fetch("/api/resume-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ origin: window.location.origin, resume: resumeData }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const fileName = `${resumeData.profile.name.replace(/\s+/g, "_")}_Resume.pdf`;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download failed", error);
      alert(
        "Failed to generate PDF. Please try again."
      );
    } finally {
      setIsGeneratingPdf(false);
    }
  }, [resumeData]);

  if (isPdfRender) {
    return (
      <div className="bg-white">
        <ResumePreview
          resume={resumeData}
          onDownload={() => {}}
          isGeneratingPdf={false}
          isPdfRender
          showDownloadButton={false}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f5f7]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="hidden w-full max-w-105 border-r border-slate-200 bg-white shadow-sm lg:block">
          <div className="sticky top-0 h-screen overflow-y-auto px-5 py-6">
            <ResumeForm value={resumeData} onChange={handleResumeChange} />
          </div>
        </aside>

        <main className="relative flex-1 overflow-hidden">
          <div className="lg:hidden px-4 pb-4 pt-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <ResumeForm value={resumeData} onChange={handleResumeChange} />
            </div>
          </div>

          <div className="absolute left-5 top-28 z-20 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-lg backdrop-blur">
            <button
              type="button"
              onClick={zoomOut}
              className="flex items-center justify-center rounded-xl p-2 text-slate-700 transition hover:bg-slate-100"
              aria-label="Zoom out"
            >
              <Minus className="size-4" />
            </button>
            <button
              type="button"
              onClick={zoomReset}
              className="flex items-center justify-center rounded-xl p-2 text-slate-700 transition hover:bg-slate-100"
              aria-label="Reset zoom"
            >
              <RotateCcw className="size-4" />
            </button>
            <button
              type="button"
              onClick={zoomIn}
              className="flex items-center justify-center rounded-xl p-2 text-slate-700 transition hover:bg-slate-100"
              aria-label="Zoom in"
            >
              <Plus className="size-4" />
            </button>
            <div className="mx-1 h-px bg-slate-200" />
            <button
              type="button"
              onClick={handleDownload}
              disabled={isGeneratingPdf}
              className="flex items-center justify-center rounded-xl p-2 text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Download PDF"
            >
              <Download className="size-4" />
            </button>
            <div className="text-center text-[11px] font-medium text-slate-500">
              {Math.round(previewScale * 100)}%
            </div>
          </div>

          <div className="flex h-full flex-col items-center overflow-auto px-4 py-10 lg:px-12">
            <div className="w-full max-w-[240mm]">
              <ResumePreview
                resume={resumeData}
                onDownload={handleDownload}
                isGeneratingPdf={isGeneratingPdf}
                isPdfRender={false}
                showDownloadButton={false}
                scale={previewScale}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
