// src/services/locationService.ts
import api from "../lib/axios";

// ✅ Get all locations with pagination + optional provinceId
export const getLocations = async (
  page: number = 1,
  limit: number = 10,
  provinceId?: number
) => {
  const params: any = { page, limit };
  if (provinceId) params.provinceId = provinceId;

  const res = await api.get("/location/admin/all", { params });
  return res.data; // expected: { data: Location[], total: number }
};

// ✅ Search locations with pagination + optional provinceId
export const searchLocations = async (
  query: string,
  page: number = 1,
  limit: number = 10,
  provinceId?: number
) => {
  // avoid sending too-short queries
  if (!query || query.trim().length < 2) return { data: [], total: 0 };

  const params: any = { query: query.trim(), page, limit };
  if (provinceId) params.provinceId = provinceId;

  const res = await api.get("/location/search/all", { params });
  return res.data;
};

// ✅ Delete a location
export const deleteLocation = async (id: number) => {
  return await api.delete(`/location/${id}`);
};

// ✅ Update a location
export const updateLocation = async (id: number, data: any) => {
  return await api.patch(`/location/${id}`, data);
};

// ✅ Add a new location
export const addLocation = async (data: any) => {
  return await api.post("/location", data);
};




