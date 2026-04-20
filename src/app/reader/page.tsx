"use client";

import { getKitabKontenByHal, getKitabById, type KontenResponse, type DaftarKitab, type PaginatedResponse, type KontenKitab } from "@/lib/kutub-api";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/navbar";

function highlightText(text: string, query?: string) {
  if (!query) return text;
  
  // Basic escaping for regex
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, "gi");
  
  return text.replace(regex, '<mark>$1</mark>');
}

function ReaderContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const pageParam = searchParams.get("page") || "1";
  const page = parseInt(pageParam);
  const h = searchParams.get("h");
  const lang = searchParams.get("lang") || "";

  const [content, setContent] = useState<PaginatedResponse<KontenResponse> | null>(null);
  const [kitab, setKitab] = useState<DaftarKitab | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setLoading(true);
      Promise.all([
        getKitabKontenByHal(id, page, 1, lang),
        getKitabById(id)
      ])
        .then(([contentRes, bookRes]) => {
          setContent(contentRes);
          setKitab(bookRes.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id, page, lang]);

  if (loading || !content || !kitab) {
    return (
      <div className="flex bg-surface-container items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="font-label text-xs uppercase tracking-[0.3em] text-primary/40 animate-pulse">جاري تحميل الصفحة...</p>
        </div>
      </div>
    );
  }

  const isArabic = !lang || (lang !== 'id' && lang !== 'en');
  const sections = content.data.sections;
  const totalPages = content.pagination.total_pages;

  return (
    <div className="flex bg-surface-container overflow-hidden min-h-screen">
      
      {/* Editorial Sidebar */}
      <aside className="w-80 glass border-l border-outline-variant/10 hidden lg:flex flex-col fixed inset-y-0 right-0 z-30">
        <div className="p-8 border-b border-outline-variant/10">
          {h && (
            <a href={`/search/?q=${h}`} className="font-label text-[10px] text-secondary/60 uppercase tracking-[0.2em] hover:text-secondary transition-colors mb-4 block">
              ← العودة للبحث
            </a>
          )}
          <a href={`/books/?id=${id}`} className="font-label text-xs text-secondary uppercase tracking-[0.3em] hover:opacity-70 transition-opacity">
            ← العودة للكتاب
          </a>
          <h2 className="text-2xl font-display font-bold mt-6 leading-tight text-primary">
            {kitab.judul}
          </h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
           <div className="space-y-2">
             <p className="font-label text-[10px] uppercase tracking-widest text-on-surface/40">الفصول</p>
             <nav className="space-y-4">
                <div className="text-primary font-body text-lg border-r-2 border-secondary pr-4 py-1">
                   {sections[0]?.nomor_bagian ? `الجزء ${sections[0].nomor_bagian}` : "المحتوى"}
                </div>
             </nav>
           </div>
        </div>
      </aside>

      {/* Main Reading Area (The Manuscript Viewer) */}
      <main className="flex-1 mr-0 lg:mr-80 relative bg-surface pb-32">
        
        {/* Floating Header */}
        <header className="sticky top-0 z-20 py-4 px-6 lg:px-12 glass flex justify-between items-center transition-all duration-500 border-b border-outline-variant/5">
           <div className="flex items-center gap-6" style={{ direction: 'rtl' }}>
              <div className="flex flex-col">
                <h1 className="text-sm lg:text-lg font-display font-bold text-primary truncate max-w-[150px] sm:max-w-[250px] lg:max-w-md">
                  {kitab.judul}
                </h1>
                <p className="text-[10px] lg:text-xs font-label text-secondary truncate">
                  {kitab.penulis}
                </p>
              </div>
              <div className="hidden sm:block h-8 w-px bg-outline-variant/20" />
              <div className="hidden md:flex flex-col items-start">
                <span className="text-[8px] uppercase tracking-widest text-on-surface/40 leading-none mb-1">التصنيف</span>
                <span className="text-[10px] lg:text-xs font-label text-on-surface/60">{kitab.kategori}</span>
              </div>
           </div>

            <div className="flex gap-3 items-center">
                <div className="flex flex-col items-end mr-4 hidden sm:flex">
                   <span className="text-[8px] uppercase tracking-widest text-on-surface/40 leading-none mb-1">الصفحة</span>
                   <span className="font-display text-xs font-bold text-primary">
                      {page} <span className="text-on-surface/20 font-normal">/</span> {totalPages}
                   </span>
                </div>
                {h && (
                 <a 
                   href={`/search/?q=${h}`}
                   className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-high hover:bg-primary/5 text-primary transition-all duration-300 border border-outline-variant/10"
                   title="العودة للبحث"
                 >
                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                 </a>
                )}
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-high hover:bg-primary/5 text-primary transition-all duration-300 border border-outline-variant/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                </button>
             </div>
        </header>

        {/* Focused Section Content */}
        <article className="max-w-4xl mx-auto px-6 py-12 lg:px-12 lg:py-24 space-y-12">
          {sections.length > 0 ? (
            sections.map((section: KontenKitab) => (
              <div key={section.id} className="animate-fade-in space-y-10">
                <p 
                  className={`text-3xl lg:text-4xl leading-[2.4] text-on-surface font-body text-justify transition-all duration-1000 ${
                    isArabic ? 'font-arabic' : 'font-sans italic opacity-90'
                  }`}
                  style={{ direction: isArabic ? 'rtl' : 'ltr' }}
                  dangerouslySetInnerHTML={{ __html: highlightText(section.isi_teks, h as string) }}
                />
              </div>
            ))
          ) : (
            <div className="text-center py-20 opacity-30 italic font-body text-2xl">
              لا يوجد محتوى في هذا الموضع
            </div>
          )}
        </article>

        {/* Floating Navigation Footer */}
        <footer className="fixed bottom-12 left-6 right-6 lg:left-12 lg:right-[calc(48px+20rem)] z-30 pointer-events-none">
          <div className="max-w-md mx-auto glass rounded-2xl p-2 flex justify-between items-center pointer-events-auto shadow-2xl shadow-primary/10 border border-outline-variant/10">
            {page > 1 ? (
              <a 
                href={`/reader/?id=${id}&page=${page - 1}${h ? `&h=${h}` : ""}${lang ? `&lang=${lang}` : ""}`}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-on-primary transition-all duration-300"
                title="الصفحة السابقة"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
              </a>
            ) : (
              <div className="w-12 h-12" />
            )}

            <div className="flex flex-col items-center gap-1">
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface/40 leading-none">الصفحة</span>
              <span className="font-display text-lg font-bold text-primary tracking-widest leading-none">
                 {page} <span className="text-on-surface/20 font-normal">/</span> {totalPages}
              </span>
            </div>

            {page < totalPages ? (
              <a 
                href={`/reader/?id=${id}&page=${page + 1}${h ? `&h=${h}` : ""}${lang ? `&lang=${lang}` : ""}`}
                className="w-12 h-12 flex items-center justify-center rounded-xl bg-primary/5 text-primary hover:bg-primary hover:text-on-primary transition-all duration-300"
                title="الصفحة التالية"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              </a>
            ) : (
              <div className="w-12 h-12" />
            )}
          </div>
        </footer>

      </main>
    </div>
  );
}

export default function ReaderPage() {
  return (
    <Suspense fallback={
      <div className="flex bg-surface-container items-center justify-center min-h-screen">
         <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <ReaderContent />
    </Suspense>
  );
}
