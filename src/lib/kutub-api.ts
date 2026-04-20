const API_URL =
  process.env.NEXT_PUBLIC_KUTUB_API || "https://kutub.litensweet.id/api";
const INTERNAL_API_URL = process.env.NEXT_PUBLIC_KUTUB_API || API_URL;

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface PaginatedResponse<T> {
  data: T;
  pagination: Pagination;
}

export interface SingleResponse<T> {
  data: T;
}

export interface DaftarKitab {
  id: number;
  judul: string;
  kategori: string;
  path_orig: string;
  penulis: string;
  publisher: string;
}

export interface KontenKitab {
  id: number;
  kitab_id: number;
  nomor_bagian: number;
  isi_teks: string;
}

export interface SearchResult {
  kitab_id: number;
  judul: string;
  kategori: string;
  penulis: string;
  publisher: string;
  section_id: number;
  nomor_bagian: number;
  isi_teks: string;
  rank: number;
  highlight?: string;
}

export interface KontenResponse {
  kitab_id: number;
  judul: string;
  penulis: string;
  publisher: string;
  sections: KontenKitab[];
}

export interface KategoriResponse {
  data: string[];
  total: number;
}

export async function getKitab(params?: {
  page?: number;
  judul?: string;
  kategori?: string;
  limit?: number;
}): Promise<PaginatedResponse<DaftarKitab[]>> {
  const search = new URLSearchParams();

  if (params?.page) search.set("page", params.page.toString());
  if (params?.judul) search.set("judul", params.judul);
  if (params?.kategori) search.set("kategori", params.kategori);
  if (params?.limit) search.set("limit", params.limit.toString());

  const res = await fetch(`${INTERNAL_API_URL}/v1/kitab?${search}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("failed fetch kitab");

  return res.json();
}

export async function getKitabById(id: string): Promise<SingleResponse<DaftarKitab>> {
  const res = await fetch(`${INTERNAL_API_URL}/v1/kitab/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("failed fetch kitab detail");

  return res.json();
}

export async function getKitabKonten(
  id: string,
  page = 1,
  limit = 20,
  lang?: string
): Promise<PaginatedResponse<KontenResponse>> {
  const search = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });
  if (lang) search.set("lang", lang);

  const res = await fetch(
    `${INTERNAL_API_URL}/v1/kitab/${id}/konten?${search}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("failed fetch kitab konten");

  return res.json();
}

export async function getKitabKontenByHal(
  id: string,
  hal: number,
  limit = 20,
  lang?: string
): Promise<PaginatedResponse<KontenResponse>> {
  const search = new URLSearchParams({
    limit: limit.toString(),
  });
  if (lang) search.set("lang", lang);

  const res = await fetch(
    `${INTERNAL_API_URL}/v1/kitab/${id}/konten/${hal}?${search}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) throw new Error("failed fetch kitab konten by hal");

  return res.json();
}

export async function searchKonten(params: {
  q: string;
  kategori?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResponse<SearchResult[]>> {
  const search = new URLSearchParams();
  search.set("q", params.q);
  if (params.kategori) search.set("kategori", params.kategori);
  if (params.page) search.set("page", params.page.toString());
  if (params.limit) search.set("limit", params.limit.toString());

  const res = await fetch(`${INTERNAL_API_URL}/v1/search?${search}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("failed search konten");

  return res.json();
}

export async function getKategori(): Promise<KategoriResponse> {
  const res = await fetch(`${INTERNAL_API_URL}/v1/kategori`, {
    cache: "force-cache",
  });

  if (!res.ok) throw new Error("failed fetch kategori");

  return res.json();
}
