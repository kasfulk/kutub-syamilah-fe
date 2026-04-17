import Navbar from "@/components/navbar";
import { getKitab } from "@/lib/kutub-api";

export default async function BooksPage({ searchParams }: any) {
  const query = await searchParams;
  const data = await getKitab({
    kategori: query?.kategori,
    page: query?.page ? parseInt(query.page) : 1
  });

  return (
    <div className="bg-surface min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-12 pt-40 pb-20 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-20">
        <div>
          <header className="mb-20 space-y-4">
            <h1 className="text-6xl md:text-7xl font-display font-bold tracking-tight">
              {query?.kategori ? query.kategori : "خزانة الكتب"}
            </h1>
            <div className="h-1 w-24 bg-secondary/30" />
            <p className="text-on-surface-variant font-body text-xl italic mt-6 max-w-xl">
              تصفح مجموعة واسعة من أمهات الكتب والمصنفات في شتى علوم الشريعة واللغة والتاريخ.
            </p>
          </header>

          <div className="space-y-8">
            {data.data.map((kitab: any) => (
              <a
                key={kitab.id}
                href={`/books/${kitab.id}`}
                className="folio-card block group"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-4">
                    <h3 className="text-3xl font-display text-primary group-hover:text-secondary transition-colors duration-400">
                      {kitab.judul}
                    </h3>
                  </div>
                  <div className="font-label text-xs uppercase tracking-[0.2em] text-on-surface/30 group-hover:text-secondary/60 transition-colors">
                    عرض الكتاب
                  </div>
                </div>
              </a>
            ))}
          </div>
          
          {/* Simple Pagination */}
          <div className="mt-20 flex gap-4 font-label text-sm uppercase tracking-widest text-primary/40">
            {data.pagination?.total_pages > 1 && [...Array(data.pagination.total_pages)].map((_, i) => (
              <a 
                key={i}
                href={`/books?page=${i+1}${query?.kategori ? `&kategori=${query.kategori}` : ''}`}
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${data.pagination.page === i+1 ? 'bg-primary text-surface' : 'hover:bg-primary/5 hover:text-primary'}`}
              >
                {i + 1}
              </a>
            ))}
          </div>
        </div>

        <aside className="space-y-12">
          <section className="space-y-6">
            <h4 className="font-label text-xs uppercase tracking-[0.3em] text-secondary">إحصائيات</h4>
            <div className="bg-surface-container-low p-8 rounded-xl space-y-4">
              <div className="flex justify-between items-baseline border-b border-outline-variant/50 pb-2">
                <span className="text-on-surface-variant font-body">إجمالي الكتب</span>
                <span className="text-xl font-display text-primary">{data.pagination?.total || 0}</span>
              </div>
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
}