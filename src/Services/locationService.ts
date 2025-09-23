// src/Services/locationService.ts
import api from "../lib/axios";

// Get all locations with pagination
export const getLocations = async (page: number = 1, limit: number = 6) => {
  const res = await api.get(`/location/admin/all?page=${page}&limit=${limit}`);
  return res.data; // { data: Location[], total: number }
};

export const searchLocations = async (
  query: string,
  province: string,
  page: number = 1,
  limit: number = 6
) => {
  const provinceParam = province === "All" ? "" : province;
  const res = await api.get(
    `/location/search/all?query=${query}&province=${provinceParam}&page=${page}&limit=${limit}`
  );
  return res.data; // { data: Location[], total: number }
};

// Delete a location
export const deleteLocation = async (id: number) => {
  return await api.delete(`/locations/${id}`);
};

// Update a location
export const updateLocation = async (id: number, data: any) => {
  return await api.patch(`/locations/${id}`, data);
};

// Add a new location
export const addLocation = async (data: any) => {
  return await api.post(`/location`, data);
};

