"use client";

import Navbar from "@/components/navbar";
import { getKitab, getKitabById, type DaftarKitab, type PaginatedResponse } from "@/lib/kutub-api";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function BooksContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const kategoriParam = searchParams.get("kategori") || undefined;
  const pageParam = searchParams.get("page") || "1";
  const page = parseInt(pageParam);

  const [data, setData] = useState<PaginatedResponse<DaftarKitab[]> | null>(null);
  const [kitab, setKitab] = useState<DaftarKitab | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (id) {
      getKitabById(id)
        .then((res) => {
          setKitab(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      getKitab({ kategori: kategoriParam, page })
        .then((res) => {
          setData(res);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [id, kategoriParam, page]);

  if (loading) {
    return (
      <div className="bg-surface min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (id && kitab) {
    return (
      <div className="bg-surface min-h-screen">
        <Navbar />
        <main className="max-w-7xl mx-auto px-12 pt-40 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-20 items-start">
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
                  href={`/reader?id=${id}`}
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

  if (!data) return null;

  return (
    <div className="bg-surface min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-12 pt-40 pb-20 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-20">
        <div>
          <header className="mb-20 space-y-4">
            <h1 className="text-6xl md:text-7xl font-display font-bold tracking-tight">
              {kategoriParam ? kategoriParam : "خزانة الكتب"}
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
                href={`/books?id=${kitab.id}`}
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

          <div className="mt-20 flex gap-4 font-label text-sm uppercase tracking-widest text-primary/40">
            {data.pagination?.total_pages > 1 && [...Array(data.pagination.total_pages)].map((_, i) => (
              <a
                key={i}
                href={`/books?page=${i + 1}${kategoriParam ? `&kategori=${kategoriParam}` : ""}`}
                className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${data.pagination.page === i + 1 ? "bg-primary text-surface" : "hover:bg-primary/5 hover:text-primary"}`}
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

export default function BooksPage() {
  return (
    <Suspense fallback={
      <div className="bg-surface min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      </div>
    }>
      <BooksContent />
    </Suspense>
  );
}