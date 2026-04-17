"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Search() {
  const [q, setQ] = useState("");
  const router = useRouter();

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q)}`);
    }
  }

  return (
    <form onSubmit={submit} className="relative w-full max-w-2xl mx-auto group">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="ابحث عن كتاب، مؤلف، أو موضوع..."
        className="w-full bg-surface/10 border-b border-surface/20 text-surface text-2xl py-6 px-4 outline-none transition-all duration-500 focus:border-secondary focus:bg-surface/15 placeholder:text-surface/40 font-body italic"
      />
      <button 
        type="submit"
        className="absolute left-4 top-1/2 -translate-y-1/2 text-surface/60 hover:text-secondary transition-colors duration-300"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </button>
      
      <div className="absolute -bottom-px right-0 left-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-700 ease-editorial" />
    </form>
  );
}
