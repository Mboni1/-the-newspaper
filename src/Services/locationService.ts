import api from "../lib/axios";

// Get all locations with pagination + optional provinceId
export const getLocations = async (
  page: number = 1,
  limit: number = 6,
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

// Search locations with query + optional provinceId
export const searchLocations = async (
  query: string,
  page: number = 1,
  limit: number = 6,
  provinceId?: string
) => {
  const res = await api.get(`/location/search/all`, {
    params: {
      query,
      page,
      limit,
      ...(provinceId && provinceId !== "All" ? { provinceId } : {}),
    },
  });
  return res.data; // { data: Location[], total: number }
};

// Delete, update, add 
export const deleteLocation = async (id: number) => {
  return await api.delete(`/locations/${id}`);
};

export const updateLocation = async (id: number, data: any) => {
  return await api.patch(`/locations/${id}`, data);
};

export const addLocation = async (data: any) => {
  return await api.post(`/location`, data);
};


