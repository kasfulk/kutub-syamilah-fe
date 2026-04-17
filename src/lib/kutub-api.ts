const API_URL = process.env.NEXT_PUBLIC_KUTUB_API || "http://localhost:3000";

export async function getKitab(params?: {
  page?: number;
  judul?: string;
  kategori?: string;
  limit?: number;
}) {
  const search = new URLSearchParams();

  if (params?.page) search.set("page", params.page.toString());
  if (params?.judul) search.set("judul", params.judul);
  if (params?.kategori) search.set("kategori", params.kategori);
  if (params?.limit) search.set("limit", params.limit.toString());

  const res = await fetch(`${API_URL}/v1/kitab?${search}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("failed fetch kitab");

  return res.json();
}

export async function getKitabById(id: string) {
  const res = await fetch(`${API_URL}/v1/kitab/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("failed fetch kitab detail");

  return res.json();
}

export async function getKitabKonten(id: string, page = 1, limit = 20) {
  const res = await fetch(`${API_URL}/v1/kitab/${id}/konten?page=${page}&limit=${limit}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("failed fetch kitab konten");

  return res.json();
}

export async function getKitabKontenByHal(id: string, hal: number, limit = 20) {
  const res = await fetch(`${API_URL}/v1/kitab/${id}/konten/${hal}?limit=${limit}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("failed fetch kitab konten by hal");

  return res.json();
}

export async function searchKonten(params: {
  q: string;
  kategori?: string;
  page?: number;
  limit?: number;
}) {
  const search = new URLSearchParams();
  search.set("q", params.q);
  if (params.kategori) search.set("kategori", params.kategori);
  if (params.page) search.set("page", params.page.toString());
  if (params.limit) search.set("limit", params.limit.toString());

  const res = await fetch(`${API_URL}/v1/search?${search}`, {
    cache: "no-store",
  });

  if (!res.ok) throw new Error("failed search konten");

  return res.json();
}

export async function getKategori() {
  const res = await fetch(`${API_URL}/v1/kategori`, {
    cache: "force-cache",
  });

  if (!res.ok) throw new Error("failed fetch kategori");

  return res.json();
}

