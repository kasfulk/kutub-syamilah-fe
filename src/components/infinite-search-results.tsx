"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { searchKonten } from "@/lib/kutub-api";

interface SearchResult {
  kitab_id: number;
  judul: string;
  kategori: string;
  penulis: string;
  publisher: string;
  section_id: number;
  nomor_bagian: number;
  isi_teks: string;
  rank: number;
  highlight: string;
}

interface InfiniteSearchResultsProps {
  initialData: {
    data: SearchResult[];
    pagination?: {
      page: number;
      total_pages: number;
    };
  };
  query: string;
}

export default function InfiniteSearchResults({ initialData, query }: InfiniteSearchResultsProps) {
  const [results, setResults] = useState<SearchResult[]>(initialData.data);
  const [currentPage, setCurrentPage] = useState(initialData.pagination?.page || 1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(
    initialData.pagination ? currentPage < initialData.pagination.total_pages : false
  );
  
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading) {
        loadMore();
      }
    },
    [hasMore, loading, currentPage]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "400px", // Load earlier for smoother experience
      threshold: 0,
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [handleObserver]);

  // Reset state when query changes
  useEffect(() => {
    setResults(initialData.data);
    setCurrentPage(initialData.pagination?.page || 1);
    setHasMore(initialData.pagination ? (initialData.pagination.page < initialData.pagination.total_pages) : false);
  }, [initialData, query]);

  async function loadMore() {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const nextPage = currentPage + 1;
      const response = await searchKonten({ q: query, page: nextPage });
      
      if (response.data && response.data.length > 0) {
        setResults((prev) => [...prev, ...response.data]);
        setCurrentPage(nextPage);
        setHasMore(nextPage < (response.pagination?.total_pages || 0));
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more search results:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-16">
      {results.map((r: SearchResult, idx) => (
        <div key={`${r.section_id}-${idx}`} className="group cursor-default animate-fade-in">
          <div className="flex justify-between items-end mb-6">
            <div className="space-y-1">
              <h3 className="text-3xl font-display text-primary transition-colors group-hover:text-secondary">
                {r.judul}
              </h3>
              <p className="font-label text-[15px] uppercase tracking-[0.2em] text-on-surface/40">
                {r.penulis} • {r.kategori}
              </p>
            </div>
            <a 
              href={`/reader/${r.kitab_id}/${r.nomor_bagian}`} 
              className="font-label text-[15px] uppercase tracking-widest text-on-surface/30 hover:text-secondary transition-colors"
            >
              انتقل للموضع ←
            </a>
          </div>
          
          <div className="folio-card !py-10 !px-12 bg-surface-container-low/50 group-hover:bg-surface-container-low transition-colors duration-500">
            <a href={`/reader/${r.kitab_id}/${r.nomor_bagian}?h=${encodeURIComponent(query)}`} className="hover:text-secondary transition-colors">
              <p 
                className="text-2xl font-body leading-loose text-on-surface/80"
                dangerouslySetInnerHTML={{ __html: r.highlight || r.isi_teks }}
              />
            </a>
            <div className="mt-8 flex gap-4 font-label text-[10px] uppercase tracking-widest text-on-surface/20">
               <a href={`/reader/${r.kitab_id}/${r.nomor_bagian}`} className="hover:text-secondary transition-colors">
                  <span>مصدر الكتاب: {r.judul}</span>
               </a>
               <span>•</span>
               <span>رقم الصفحة: {r.nomor_bagian || "..."}</span>
            </div>
          </div>
        </div>
      ))}

      {/* Loading Indicator / Observer Target */}
      <div ref={observerTarget} className="py-20 text-center min-h-[100px] flex flex-col items-center justify-center">
        {loading && (
          <div className="flex flex-col items-center gap-4">
            <div className="inline-flex gap-2">
               <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:-0.3s]" />
               <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]" />
               <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" />
            </div>
            <p className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary/50">جاري تحميل المزيد...</p>
          </div>
        )}
        {!hasMore && results.length > 0 && (
          <div className="space-y-4">
            <div className="h-px w-20 bg-on-surface/10 mx-auto" />
            <p className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface/20">نهاية نتائج البحث</p>
          </div>
        )}
      </div>
    </div>
  );
}
