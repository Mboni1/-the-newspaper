import api from "../lib/axios";

export const login = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  const { token, user } = res.data;

  
  localStorage.setItem("token", token);
  localStorage.setItem("userEmail", user.email);

  // Optional: update status 
  await api.patch(`/user/status/${user.id}`, { status: "Active" });

  return { token, user };
};