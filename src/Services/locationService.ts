// src/services/locationService.ts
import api from "../lib/axios";

// Get all locations with pagination + optional provinceId
export const getLocations = async (
  page: number = 1,
  limit: number = 10,
  provinceId?: number
) => {
  const response = await api.get("/location/admin/all", {
    params: {
      page,
      limit,
      ...(provinceId ? { provinceId } : {}), // hit only if not undefined
    },
  });
  return response.data; // { data: Location[], total: number }
};

// Search locations with pagination + optional provinceId
export const searchLocations = async (
  query: string,
  page: number = 1,
  limit: number = 10,
  provinceId?: number
) => {
  if (!query || query.trim().length < 2) return { data: [], total: 0 };

  const response = await api.get("/location/search/all", {
    params: {
      query: query.trim(),
      page,
      limit,
      ...(provinceId ? { provinceId } : {}), // hit only if not undefined
    },
  });
  return response.data;
};

// Delete location
export const deleteLocation = async (id: number) => {
  return await api.delete(`/location/${id}`);
};

// Update location
export const updateLocation = async (id: number, data: any) => {
  return await api.patch(`/location/${id}`, data);
};

// Add location
export const addLocation = async (data: any) => {
  return await api.post("/location", data);
};




