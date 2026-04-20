export default function Navbar() {
  return (
    <nav className="glass py-6 px-12 fixed top-0 left-0 right-0 z-50 flex justify-between items-center transition-all duration-500">
      <div className="flex items-center gap-12">
        <a href="/" className="text-3xl font-display font-bold text-primary tracking-tighter">
          المكتبة الشاملة
        </a>

        <div className="hidden md:flex gap-8 font-label text-sm uppercase tracking-widest text-primary/70">
          <a href="/" className="hover:text-primary transition-colors">الرئيسية</a>
          <a href="/books/" className="hover:text-primary transition-colors">الكتب</a>
          <a href="/categories/" className="hover:text-primary transition-colors">التصنيفات</a>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-primary/60 hover:text-primary transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </button>
        <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary font-bold">
          ك
        </div>
      </div>
    </nav>
  );
}