import "server-only";
import { DJANGO_API_URL } from "./config";
import type { CatalogMeta, ListingType } from "@/types";

/**
 * Catalog data (categories, plans, employment types, etc.) is admin-editable
 * but changes rarely, so it's safe to cache for a few minutes instead of
 * hitting Django on every page render.
 */
export async function getCatalogMeta(type: ListingType): Promise<CatalogMeta> {
  const res = await fetch(`${DJANGO_API_URL}/catalog/meta/?type=${type}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) {
    return { categories: [], plans: [] };
  }
  return res.json();
}
