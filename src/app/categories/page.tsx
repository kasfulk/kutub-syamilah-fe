import Navbar from "@/components/navbar";
import { getKategori } from "@/lib/kutub-api";

export default async function Categories() {
  const data = await getKategori();

  return (
    <div className="bg-surface min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-12 pt-40 pb-20">
        <header className="mb-24 flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="space-y-6 max-w-2xl">
            <p className="font-label text-secondary tracking-[0.4em] uppercase text-[10px]">خريطة العلوم</p>
            <h1 className="text-7xl font-display font-bold text-primary tracking-tighter">
              أقسام المعرفة
            </h1>
            <p className="text-xl font-body text-on-surface-variant italic leading-relaxed">
              استكشف كنوز المكتبة من خلال تصنيفات علمية دقيقة، تبدأ من علوم القرآن الكريم وتصل إلى الأدب والتاريخ.
            </p>
          </div>
          <div className="font-label text-sm text-on-surface/30 lowercase tracking-widest pb-2">
            إجمالي الفئات: {data.total || 0}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {data.data.map((cat: string, index: number) => (
            <a
              key={cat}
              href={`/books?kategori=${encodeURIComponent(cat)}`}
              className="group block"
            >
              <div className="folio-card h-full flex flex-col justify-between space-y-12">
                <div className="space-y-4">
                  <span className="font-label text-[10px] text-on-surface/20 group-hover:text-secondary/40 transition-colors">
                    0{index + 1} /
                  </span>
                  <h2 className="text-4xl font-display text-primary group-hover:text-secondary transition-colors duration-500 leading-tight">
                    {cat}
                  </h2>
                </div>
                
                <div className="flex justify-end">
                   <div className="w-12 h-px bg-on-surface/10 group-hover:w-24 group-hover:bg-secondary/30 transition-all duration-700" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}