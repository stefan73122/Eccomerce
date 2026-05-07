import api from '@/lib/axios';
import { Store, StoresApiResponse } from '@/types';

/**
 * Obtener todas las tiendas activas (sin paginación)
 */
export async function getStores(): Promise<Store[]> {
  try {
    const response = await api.get<StoresApiResponse>('/api/stores', {
      params: { includeInactive: false },
    });
    return response.data.data || [];
  } catch (error: any) {
    console.error('Error fetching stores:', error);
    return [];
  }
}

/**
 * Obtener una tienda por ID
 */
export async function getStoreById(id: string | number): Promise<Store | null> {
  try {
    const response = await api.get<{ status: string; data: Store }>(`/api/stores/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.error(`Error fetching store ${id}:`, error);
    return null;
  }
}

/**
 * Obtener tiendas por región (sin paginación)
 */
export async function getStoresByRegion(regionId: number): Promise<Store[]> {
  try {
    const response = await api.get<StoresApiResponse>(`/api/stores/by-region/${regionId}`);
    return response.data.data || [];
  } catch (error: any) {
    console.error(`Error fetching stores for region ${regionId}:`, error);
    return [];
  }
}

/**
 * Buscar tiendas (sin paginación)
 */
export async function searchStores(query: string): Promise<Store[]> {
  try {
    if (!query || query.trim() === '') {
      return getStores();
    }
    const response = await api.get<StoresApiResponse>('/api/stores/search', {
      params: { q: query, includeInactive: false },
    });
    return response.data.data || [];
  } catch (error: any) {
    console.error('Error searching stores:', error);
    return [];
  }
}

/**
 * Obtener tiendas cercanas (excluyendo la actual)
 */
export async function getNearbyStores(storeId: string | number, limit = 3): Promise<Store[]> {
  try {
    const allStores = await getStores();
    return allStores.filter((s) => s.id.toString() !== storeId.toString()).slice(0, limit);
  } catch (error: any) {
    console.error('Error fetching nearby stores:', error);
    return [];
  }
}
