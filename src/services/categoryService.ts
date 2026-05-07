import api from '@/lib/axios';
import { Category } from '@/types';

interface BackendCategory {
  id: number;
  name: string;
  slug: string | null;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  parentId: number | null;
  isVisible: boolean;
  children?: BackendCategory[];
}

interface TreeEnvelope {
  status: string;
  data: BackendCategory[];
}

interface FlatEnvelope {
  status: string;
  data: BackendCategory[];
  pagination?: unknown;
}

// Slug used in URLs: prefer real slug, fall back to string ID
function categorySlug(c: BackendCategory): string {
  return c.slug ?? String(c.id);
}

function mapCategory(c: BackendCategory): Category {
  return {
    id: String(c.id),
    name: c.name,
    slug: categorySlug(c),
    icon: c.icon ?? 'package',
    description: c.description ?? undefined,
    productCount: 0,
    subcategories: (c.children ?? [])
      .filter((ch) => ch.isVisible)
      .map((ch) => ({ name: ch.name, slug: categorySlug(ch) })),
  };
}

export const categoryService = {
  // Uses tree endpoint so children are populated
  getCategories: async (): Promise<Category[]> => {
    const response = await api.get<TreeEnvelope>('/api/categories/tree');
    return (response.data.data ?? [])
      .filter((c) => c.isVisible)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(mapCategory);
  },

  // slug may be the real slug or the numeric ID as string
  getCategoryBySlug: async (slug: string): Promise<Category | null> => {
    const response = await api.get<FlatEnvelope>('/api/categories', {
      params: { page: 1, limit: 100 },
    });
    const all = response.data.data ?? [];
    const found = all.find((c) => c.slug === slug || String(c.id) === slug);
    if (!found) return null;
    // Fetch tree to get children for this category
    const treeResp = await api.get<TreeEnvelope>('/api/categories/tree');
    const treeItem = (treeResp.data.data ?? []).find((c) => c.id === found.id);
    return mapCategory(treeItem ?? found);
  },

  getCategoryIdBySlug: async (slug: string): Promise<number | null> => {
    // If slug is a pure number, it IS the ID
    if (/^\d+$/.test(slug)) return Number(slug);
    const response = await api.get<FlatEnvelope>('/api/categories', {
      params: { page: 1, limit: 100 },
    });
    const found = (response.data.data ?? []).find((c) => c.slug === slug);
    return found ? found.id : null;
  },
};
