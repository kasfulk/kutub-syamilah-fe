"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getKitabKonten } from "@/lib/kutub-api";

interface InfiniteReaderProps {
  id: string;
  initialData: any;
  initialPage: number;
}

export default function InfiniteReader({ id, initialData, initialPage }: InfiniteReaderProps) {
  const [pages, setPages] = useState<any[]>([initialData]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPage < initialData.pagination.total_pages);
  
  const [showFooter, setShowFooter] = useState(true);
  const lastScrollY = useRef(0);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Handle intersection for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && hasMore && !loading) {
        loadMore();
      }
    },
    [hasMore, loading]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "200px",
      threshold: 0,
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [handleObserver]);

  // Handle scroll for footer visibility (Show on scroll-up)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < lastScrollY.current) {
        setShowFooter(true);
      } else if (currentScrollY > 100) {
        setShowFooter(false);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function loadMore() {
    setLoading(true);
    try {
      const nextPage = currentPage + 1;
      const data = await getKitabKonten(id, nextPage);
      setPages((prev) => [...prev, data]);
      setCurrentPage(nextPage);
      setHasMore(nextPage < data.pagination.total_pages);
    } catch (error) {
      console.error("Failed to load more pages:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <article className="max-w-4xl mx-auto px-6 py-12 lg:px-12 lg:py-24 space-y-24">
        {pages.map((pageData, pageIdx) => (
          <div key={`${id}-page-${pageIdx + 1}`} className="space-y-12 animate-fade-in">
            <div className="flex items-center gap-8 opacity-20 hover:opacity-100 transition-opacity duration-700">
               <div className="h-px flex-1 bg-on-surface" />
               <span className="font-label text-xs uppercase tracking-[0.4em]">الصفحة {pageIdx + initialPage}</span>
               <div className="h-px flex-1 bg-on-surface" />
            </div>

            <div className="space-y-10">
              {pageData.data.sections.map((row: any) => (
                <p
                  key={row.id}
                  className="text-2xl lg:text-3xl leading-[2.2] text-on-surface font-body text-justify transition-all duration-1000"
                  style={{ direction: 'rtl' }}
                  dangerouslySetInnerHTML={{ __html: row.isi_teks }}
                />
              ))}
            </div>
          </div>
        ))}

        {/* Loading Indicator / Observer Target */}
        <div ref={observerTarget} className="py-20 text-center">
          {loading && (
            <div className="inline-flex gap-2">
               <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:-0.3s]" />
               <div className="w-2 h-2 bg-secondary rounded-full animate-bounce [animation-delay:-0.15s]" />
               <div className="w-2 h-2 bg-secondary rounded-full animate-bounce" />
            </div>
          )}
          {!hasMore && pages.length > 0 && (
            <p className="font-label text-xs uppercase tracking-widest text-on-surface/20">نهاية الكتاب</p>
          )}
        </div>
      </article>

      <footer 
        className={`fixed bottom-12 left-6 right-6 lg:left-12 lg:right-[calc(48px+20rem)] z-20 pointer-events-none transition-all duration-700 ease-editorial ${showFooter ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}
      >
        <div className="max-w-md mx-auto glass rounded-2xl p-4 flex justify-between items-center pointer-events-auto shadow-2xl shadow-primary/10 border border-outline-variant/10">
          <div className="px-6 py-3 font-label text-[10px] uppercase tracking-widest text-primary/40 leading-none">
             أنت تقرأ الآن
          </div>
          
          <div className="flex items-center gap-4">
            <span className="font-label text-xs text-primary font-bold tracking-widest">
              {currentPage} / {initialData.pagination.total_pages}
            </span>
          </div>

          <div className="h-8 w-px bg-outline-variant/20 mx-2" />
          
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-primary/5 text-primary transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
          </button>
        </div>
      </footer>
    </div>
  );
}
