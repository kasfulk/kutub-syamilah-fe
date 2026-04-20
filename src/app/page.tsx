"use client";

import Navbar from "@/components/navbar";
import Search from "@/components/search";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  useEffect(() => {
    if (query) {
      router.push(`/search/?q=${encodeURIComponent(query)}`);
    }
  }, [query, router]);

  return (
    <div className="relative min-h-screen">
      <Navbar />

      <section className="velvet-depth flex items-center justify-center min-h-[90vh] px-12 pt-20 overflow-hidden relative">
        {/* Subtle Decorative Background Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-5 pointer-events-none rotate-12">
          <span className="text-[40rem] font-display text-surface leading-none select-none">
            كتاب
          </span>
        </div>

        <div className="relative z-10 w-full max-w-5xl text-center space-y-16">
          <div className="space-y-6">
            <p className="font-label text-secondary tracking-[0.3em] uppercase text-lg animate-fade-in">
              منصة التراث الرقمي
            </p>
            <h1 className="text-surface text-8xl md:text-9xl font-display font-bold leading-tight tracking-tighter transition-all duration-700 hover:scale-[1.02] cursor-default">
              المكتبة الشاملة
            </h1>
            <p className="text-surface/60 font-body text-2xl max-w-2xl mx-auto leading-relaxed">
              كنز المعرفة الإسلامية بين يديك، بحث ذكي وسريع في آلاف المجلدات العلمية والأدبية
            </p>
          </div>

          <div className="pt-8">
            <Suspense fallback={<div className="h-20 w-full animate-pulse bg-surface/10 rounded-xl" />}>
              <Search withDebounce={false} />
            </Suspense>
          </div>

          <div className="pt-16 flex justify-center gap-12 font-label text-xs uppercase tracking-widest text-surface/40">
            <div className="flex flex-col gap-2">
              <span className="text-surface/80 text-xl font-display tracking-normal">١٠٠٠+</span>
              <span>كتاب</span>
            </div>
            <div className="w-px h-12 bg-surface/10 self-center" />
            <div className="flex flex-col gap-2">
              <span className="text-surface/80 text-xl font-display tracking-normal">٢٠+</span>
              <span>تصنيف</span>
            </div>
            <div className="w-px h-12 bg-surface/10 self-center" />
            <div className="flex flex-col gap-2">
              <span className="text-surface/80 text-xl font-display tracking-normal">بحث</span>
              <span>دقيق</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="relative min-h-screen bg-surface flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}