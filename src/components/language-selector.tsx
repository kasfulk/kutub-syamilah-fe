import Link from 'next/link';

interface LanguageSelectorProps {
  id: string | number;
  page?: number;
  h?: string;
  lang?: string;
}

export function LanguageSelector({ id, page, h, lang }: LanguageSelectorProps) {
  const languages = [
    { code: '', label: 'أصل' },
    { code: 'id', label: 'ID' },
    { code: 'en', label: 'EN' }
  ];

  // Logic to generate the correct base path
  const baseUrl = page && page > 1 ? `/reader/${id}/${page}` : `/reader/${id}`;

  return (
    <div className="flex bg-surface-container-low rounded-xl p-1 border border-outline-variant/10 mr-2">
      {languages.map((l) => {
        const params = new URLSearchParams();
        if (h) params.set('h', h);
        if (l.code) params.set('lang', l.code);
        const search = params.toString();
        const href = `${baseUrl}${search ? `?${search}` : ''}`;

        const isActive = (lang === l.code || (!lang && l.code === ''));

        return (
          <Link
            key={l.code}
            href={href}
            className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all duration-300 ${
              isActive
                ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                : 'text-on-surface/40 hover:text-on-surface/70'
            }`}
          >
            {l.label}
          </Link>
        );
      })}
    </div>
  );
}
