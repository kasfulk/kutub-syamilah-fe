"use client";

import { useQueryState } from "nuqs";
import { useTransition } from "react";

interface SearchProps {
  className?: string;
  withDebounce?: boolean;
}

export default function Search({ className = "", withDebounce = true }: SearchProps) {
  const [isPending, startTransition] = useTransition();
  
  // Use nuqs to manage 'q' query parameter
  // shallow: false ensures the server component (SearchPage) re-renders when the URL changes
  const [q, setQ] = useQueryState("q", {
    defaultValue: "",
    shallow: false,
    startTransition,
  });

  function handleInputChange(val: string) {
    setQ(val || null, { 
      shallow: false, 
      throttleMs: withDebounce ? 1500 : 0 
    });
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Force immediate update on submit
    setQ(q, { shallow: false, throttleMs: 0 });
  }

  return (
    <form onSubmit={submit} className="relative w-full max-w-2xl mx-auto group">
      <input
        type="text"
        value={q || ""}
        onChange={(e) => handleInputChange(e.target.value)}
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
            onClick={() => setQ(null)}
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
