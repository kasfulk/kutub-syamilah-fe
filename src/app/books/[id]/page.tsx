import Navbar from "@/components/navbar";
import { getKitabById } from "@/lib/kutub-api";

export default async function BookDetail({ params }: any) {
  const { id } = await params;
  const bookRes = await getKitabById(id);
  const kitab = bookRes.data;

  return (
    <div className="bg-surface min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-12 pt-40 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-20 items-start">
          
          {/* Cover / Preview Area (The Parchment Stack) */}
          <div className="parchment-stack aspect-[3/4] p-12 flex flex-col justify-between items-center text-center space-y-8 rounded-sm">
            <div className="space-y-4">
               <p className="font-label text-[10px] uppercase tracking-[0.4em] text-on-surface/40">مخطوطة رقمية</p>
               <div className="h-px w-8 bg-on-surface/10 mx-auto" />
            </div>
            
            <h2 className="text-4xl font-display font-bold leading-relaxed text-primary">
              {kitab.judul}
            </h2>
            
            <div className="space-y-2">
              <p className="font-label text-xs text-on-surface/30">
                تصنيف: {kitab.kategori}
              </p>
            </div>
          </div>

          {/* Details Area */}
          <div className="space-y-16">
            <header className="space-y-6">
              <div className="flex gap-4 items-center">
                 <span className="bg-secondary/10 text-secondary font-label text-[10px] uppercase tracking-widest px-3 py-1 rounded">نادر</span>
                 <span className="text-on-surface/40 font-label text-xs">{kitab.id} #</span>
              </div>
              <h1 className="text-6xl md:text-7xl font-display font-bold text-primary leading-tight">
                {kitab.judul}
              </h1>
              <p className="text-2xl font-body text-on-surface-variant leading-relaxed max-w-2xl italic">
                يعتبر هذا الكتاب من المراجع الهامة في {kitab.kategori}.
              </p>
            </header>

            <div className="flex flex-wrap gap-8">
              <a
                href={`/reader/${id}`}
                className="bg-primary text-surface px-10 py-5 font-label text-sm uppercase tracking-[0.2em] rounded-lg transition-all duration-300 hover:bg-primary-container hover:scale-[1.02] active:scale-95 shadow-xl shadow-primary/10"
              >
                قراءة الكتاب
              </a>
              
              <button className="border border-outline-variant text-primary px-10 py-5 font-label text-sm uppercase tracking-[0.2em] rounded-lg transition-all duration-300 hover:bg-surface-container-low">
                إضافة إلى المفضلات
              </button>
            </div>

            <section className="grid grid-cols-2 md:grid-cols-3 gap-12 pt-16 border-t border-outline-variant/30">
              <div className="space-y-2">
                <p className="font-label text-[10px] uppercase tracking-widest text-on-surface/40">التصنيف</p>
                <p className="font-display text-xl text-primary">{kitab.kategori}</p>
              </div>
              <div className="space-y-2">
                <p className="font-label text-[10px] uppercase tracking-widest text-on-surface/40">الحالة</p>
                <p className="font-display text-xl text-secondary">متوفر</p>
              </div>
            </section>
          </div>

        </div>
      </main>
    </div>
  );
}
