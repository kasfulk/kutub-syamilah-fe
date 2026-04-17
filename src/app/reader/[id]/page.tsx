import { getKitabKonten, getKitabById } from "@/lib/kutub-api";
import InfiniteReader from "@/components/infinite-reader";

export default async function Reader({ params, searchParams }: any) {
  const { id } = await params;
  const query = await searchParams;
  const page = query?.page ? parseInt(query.page) : 1;
  
  const [content, bookResponse] = await Promise.all([
    getKitabKonten(id, page),
    getKitabById(id)
  ]);
  const kitab = bookResponse.data;

  return (
    <div className="flex bg-surface-container overflow-hidden min-h-screen">
      
      {/* Editorial Sidebar */}
      <aside className="w-80 glass border-l border-outline-variant/10 flex flex-col fixed inset-y-0 right-0 z-30">
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
                   المقدمة
                </div>
                <div className="text-on-surface-variant font-body text-lg pr-4 py-1 hover:text-primary transition-colors cursor-pointer">
                   الباب الأول
                </div>
             </nav>
           </div>
        </div>
      </aside>

      {/* Main Reading Area (The Manuscript Viewer) */}
      <main className="flex-1 mr-80 relative bg-surface">
        
        {/* Floating Header */}
        <header className="sticky top-0 z-20 py-6 px-12 glass flex justify-between items-center transition-all duration-500">
           <div className="font-label text-xs text-on-surface/30 uppercase tracking-widest">
             وضع القراءة الشامل
           </div>
           <div className="flex gap-4">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-primary/5 text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              </button>
           </div>
        </header>

        {/* The Infinite Scroller */}
        <InfiniteReader id={id} initialData={content} initialPage={page} />

      </main>
    </div>
  );
}
