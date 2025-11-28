// src/services/locationService.ts
import api from "../lib/axios";

export interface LocationFormData {
  title: string;
  address: string;
  description?: string;
  latitude: string; // string kuko frontend yawe iri gukoresha string
  longitude: string; // string
  provinceName?: string; // string, niba backend yemera province by name
  images?: File[];
}

// Get all locations with pagination + optional provinceName
export const getLocations = async (
  page: number = 1,
  limit: number = 10,
  provinceName?: string
) => {
  const params: any = { page, limit };
  if (provinceName) params.provinceName = provinceName; // backend yemera string

  const res = await api.get("/location/admin/all", { params });
  return res.data;
};

// Search locations with pagination + optional provinceName
export const searchLocations = async (
  query: string,
  page: number = 1,
  limit: number = 10,
  provinceName?: string
) => {
  if (!query || query.trim().length < 1) return { data: [], total: 0 };

  const params: any = { query: query.trim(), page, limit };
  if (provinceName) params.provinceName = provinceName;

  const res = await api.get("/location/search/all", { params });
  return res.data;
};

// Delete a location
export const deleteLocation = async (id: number) => {
  return await api.delete(`/location/${id}`);
};
  // Get locations by province
export const getLocationsByProvince = async (provinceName: string) => {
  const res = await api.get(`/location/${provinceName}`);
  return res.data;
};

// Update a location
export const updateLocation = async (id: number, data: LocationFormData | FormData) => {
  return await api.patch(`/location/${id}`, data, {
    headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });
};

// Add a new location
export const addLocation = async (data: LocationFormData | FormData) => {
  return await api.post("/location", data, {
    headers: data instanceof FormData ? { "Content-Type": "multipart/form-data" } : undefined,
  });

};





