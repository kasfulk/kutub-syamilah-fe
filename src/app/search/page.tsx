import Navbar from "@/components/navbar";
import Search from "@/components/search";
import InfiniteSearchResults from "@/components/infinite-search-results";
import { searchKonten } from "@/lib/kutub-api";

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

        <div>
          {results.data.length > 0 ? (
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
