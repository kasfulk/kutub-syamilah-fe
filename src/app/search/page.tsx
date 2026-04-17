import Navbar from "@/components/navbar";
import Search from "@/components/search";
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

export default async function SearchPage({ searchParams }: any) {
  const query = await searchParams;
  const q = query?.q;
  const results = q ? await searchKonten({ q }) : { data: [] };

  return (
    <div className="bg-surface min-h-screen">
      <Navbar />

      <main className="max-w-5xl mx-auto px-12 pt-40 pb-20">
        <header className="mb-20 space-y-12">
          <div className="space-y-4">
            <p className="font-label text-secondary tracking-[0.3em] uppercase text-[10px]">نتائج البحث في المخطوطات</p>
            <h1 className="text-6xl font-display font-bold text-primary tracking-tighter">
              {q ? `آثار: ${q}` : "البحث الشامل"}
            </h1>
          </div>
          
          <Search defaultValue={q} className="!text-primary" />
        </header>

        <div className="space-y-16">
          {results.data.length > 0 ? (
            results.data.map((r: SearchResult) => (
              <div key={r.section_id} className="group cursor-default">
                <div className="flex justify-between items-end mb-6">
                   <div className="space-y-1">
                      <h3 className="text-3xl font-display text-primary transition-colors group-hover:text-secondary">
                         {r.judul}
                      </h3>
                      <p className="font-label text-[15] uppercase tracking-[0.2em] text-on-surface/40">
                        {r.penulis} • {r.kategori}
                      </p>
                   </div>
                   <a href={`/reader/${r.kitab_id}`} className="font-label text-[15] uppercase tracking-widest text-on-surface/30 hover:text-secondary transition-colors">
                      انتقل للموضع ←
                   </a>
                </div>
                
                <div className="folio-card !py-10 !px-12 bg-surface-container-low/50 group-hover:bg-surface-container-low transition-colors duration-500">
                  <a href={`/reader/${r.kitab_id}/${r.nomor_bagian}`} className="hover:text-secondary transition-colors">
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
            ))
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
