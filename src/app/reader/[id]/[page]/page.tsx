import { getKitabKontenByHal, getKitabById } from "@/lib/kutub-api";

export default async function PaginatedReader({ params }: any) {
  const { id, page: pageParam } = await params;
  const page = parseInt(pageParam);
  
  const [content, bookResponse] = await Promise.all([
    getKitabKontenByHal(id, page, 1), // Fetch only 1 section for focused view
    getKitabById(id)
  ]);
  
  const kitab = bookResponse.data;
  const sections = content.data.sections;
  const totalPages = content.pagination.total_pages;

  return (
    <div className="flex bg-surface-container overflow-hidden min-h-screen">
      
      {/* Editorial Sidebar */}
      <aside className="w-80 glass border-l border-outline-variant/10 hidden lg:flex flex-col fixed inset-y-0 right-0 z-30">
        <div className="p-8 border-b border-outline-variant/10">
          <a href={`/books/${id}`} className="font-label text-xs text-secondary uppercase tracking-[0.3em] hover:opacity-70 transition-opacity">
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
        <header className="sticky top-0 z-20 py-6 px-6 lg:px-12 glass flex justify-between items-center transition-all duration-500">
           <div className="font-label text-xs text-on-surface/30 uppercase tracking-widest">
             وضع الصفحة المحددة
           </div>

           <div className="flex gap-4">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary/5 text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              </button>
           </div>
        </header>

        {/* Focused Section Content */}
        <article className="max-w-4xl mx-auto px-6 py-12 lg:px-12 lg:py-24 space-y-12">
          {sections.length > 0 ? (
            sections.map((section: any) => (
              <div key={section.id} className="animate-fade-in space-y-10">
                <p 
                  className="text-3xl lg:text-4xl leading-[2.4] text-on-surface font-body text-justify transition-all duration-1000"
                  style={{ direction: 'rtl' }}
                  dangerouslySetInnerHTML={{ __html: section.isi_teks }}
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
                href={`/reader/${id}/${page - 1}`}
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
                href={`/reader/${id}/${page + 1}`}
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
