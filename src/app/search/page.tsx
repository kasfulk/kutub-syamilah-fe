"use client";

import Navbar from "@/components/navbar";
import Search from "@/components/search";
import InfiniteSearchResults from "@/components/infinite-search-results";
import { searchKonten, type SearchResult, type PaginatedResponse } from "@/lib/kutub-api";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [results, setResults] = useState<PaginatedResponse<SearchResult[]>>({
    data: [],
    pagination: { page: 1, limit: 10, total: 0, total_pages: 0 }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (q) {
      setLoading(true);
      searchKonten({ q, limit: 10 })
        .then((res) => {
          setResults(res);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
          setResults({ data: [], pagination: { page: 1, limit: 10, total: 0, total_pages: 0 } });
        });
    } else {
      setResults({ data: [], pagination: { page: 1, limit: 10, total: 0, total_pages: 0 } });
    }
  }, [q]);

  return (
    <div className="bg-surface min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-6 lg:px-12 pt-40 pb-20">
        <header className="mb-20 space-y-12 sticky top-24 z-40 bg-surface/80 backdrop-blur-md py-4 -mx-6 px-6 lg:-mx-12 lg:px-12 rounded-b-3xl border-b border-outline-variant/10 transition-all duration-500 group/header">
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-secondary/60">
              <span className="font-label tracking-[0.2em] uppercase text-[8px] lg:text-[10px]">بحث متقدم</span>
              <div className="h-px w-12 bg-outline-variant/20" />
              <div className="flex gap-4 font-label text-[10px] uppercase tracking-wider">
                 <span className="text-on-surface/30">العنوان</span>
                 <span className="text-on-surface/30">المؤلف</span>
                 <span className="text-on-surface/30">التصنيف</span>
              </div>
            </div>
            <h1 className="text-4xl lg:text-6xl font-display font-bold text-primary tracking-tighter transition-all duration-500 group-hover/header:text-secondary">
              {q ? `آثار: ${q}` : "البحث الشامل"}
            </h1>
          </div>
          
          <Suspense fallback={<div className="h-16 w-full animate-pulse bg-surface/5 rounded-xl" />}>
            <Search className="!text-primary" autoFocus={true}/>
          </Suspense>
        </header>

        <div>
          {loading ? (
             <div className="flex flex-col items-center justify-center py-32 space-y-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="font-label text-xs uppercase tracking-[0.3em] text-primary/40 animate-pulse">جاري البحث في المكتبة...</p>
             </div>
          ) : results.data.length > 0 ? (
            <InfiniteSearchResults initialData={results} query={q} />
          ) : q ? (
            <div className="text-center py-20 bg-surface-container-low rounded-2xl border border-dashed border-outline-variant/30">
               <p className="font-body text-2xl text-on-surface-variant italic">لم نعثر على نتائج مطابقة لـ "{q}"</p>
               <p className="font-label text-sm text-on-surface/30 mt-4">حاول البحث باستخدام كلمات مفتاحية أخرى</p>
            </div>
          ) : (
            <div className="text-center py-20">
               <p className="font-body text-2xl text-on-surface-variant italic">ابدأ البحث في آلاف الكتب الإسلامية</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="bg-surface min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
