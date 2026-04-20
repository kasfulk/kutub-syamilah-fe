"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useTransition } from "react";

interface SearchProps {
  defaultValue?: string;
  className?: string;
  withDebounce?:   boolean;
}

export default function Search({ defaultValue = "", className = "", withDebounce = true }: SearchProps) {
  const [q, setQ] = useState(defaultValue);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Sync state with defaultValue (for browser back/forward)
  useEffect(() => {
    setQ(defaultValue);
  }, [defaultValue]);

  // Handle debounce for real-time search
  useEffect(() => {
    if (q === defaultValue) return; // Skip if no change from initial

    const timer = setTimeout(() => {
      startTransition(() => {
        if (withDebounce) {
          if (q.trim()) {
            router.replace(`/search?q=${encodeURIComponent(q)}`);
          } else if (defaultValue) {
            router.replace(`/search`); // Clear query if empty but was present
          }
        }
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [q, defaultValue, router]);

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
        className={`w-full bg-surface/10 border-b border-surface/20 text-surface text-2xl py-6 px-4 pr-12 outline-none transition-all duration-500 focus:border-secondary focus:bg-surface/15 placeholder:text-surface/40 font-body ${className}`}
      />
      
      {/* Search Icon */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-surface/30 group-focus-within:text-secondary transition-colors duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
      </div>

      {/* Loading / Clear Button Box */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
        {isPending && (
          <div className="w-5 h-5 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" />
        )}
        
        {q && (
          <button 
            type="button"
            onClick={() => setQ("")}
            className="text-surface/20 hover:text-secondary transition-colors duration-300"
            title="مسح البحث"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        )}
      </div>
      
      {/* Editorial Focus Line */}
      <div className="absolute -bottom-px right-0 left-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent scale-x-0 group-focus-within:scale-x-100 transition-transform duration-700 ease-editorial" />
    </form>
  );
}
