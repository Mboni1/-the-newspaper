import api from "../lib/axios";
import toast from "react-hot-toast";

// Get all locations with pagination + optional provinceId
export const getLocations = async (
  page: number = 1,
  limit: number = 10,
  provinceId?: string | number
) => {
  const res = await api.get(`/location/admin/all`, {
    params: {
      page,
      limit,
      ...(provinceId && provinceId !== "All" ? { provinceId } : {}),
    },
  });
  return res.data; // { data: Location[], total: number }
};

export const searchLocations = async (
  query: string,
  page: number = 1,
  limit: number = 10,
  provinceId?: string
) => {
  if (!query || query.trim().length < 2) return { data: [], total: 0 };

  const res = await api.get(`/location/search/all`, {
    params: {
      query: query.trim(),
      page,
      limit,
      ...(provinceId && provinceId !== "All" ? { provinceId } : {}),
    },
  });

  return res.data;
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
  return await api.post(`/location`, data);
};



