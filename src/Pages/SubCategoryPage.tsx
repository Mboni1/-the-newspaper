import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Plus, Search, X } from "lucide-react";
import api from "../lib/axios";

interface Business {
  id: number;
  title: string;
  description: string;
  image: string;
  services: number;
  featuredImage: string;
  placeImg: string;
}

const limit = 3;

const SubCategoryPage: React.FC = () => {
  const [business, setBusiness] = useState<Business | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [page, setPage] = useState(1);
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
  });

  // Fetch business from sub categories
  useEffect(() => {
    const fetchBusinessAndServices = async () => {
      try {
        setLoading(true);
        if (name) {
          const resOne = await api.get(`/place-item/subcategory/${name}`);
          const dataOne = await resOne.data;
          setBusiness(dataOne.data || null);
          const resServices = await api.get(`/place-item/subcategory/${name}`);
          const dataServices = await resServices.data;

          setBusinesses(
            Array.isArray(dataServices.data) ? dataServices.data : []
          );
        }
      } catch (error) {
        console.error("Error fetching business:", error);
        setBusiness(null);
        setBusinesses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessAndServices();
  }, [name]);

  // Modal handlers
  const handleAdd = () => {
    setEditingBusiness(null);
    setFormData({ name: "", description: "", image: "" });
    setIsModalOpen(true);
  };

  const handleEdit = (biz: Business, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingBusiness(biz);
    setFormData({
      name: biz.title || "",
      description: biz.description || "",
      image: biz.featuredImage || "",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setBusinesses(businesses.filter((b) => b.id !== id));
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.description.trim()) return;

    if (editingBusiness) {
      setBusinesses(
        businesses.map((b) =>
          b.id === editingBusiness.id
            ? { ...b, ...formData, featuredImage: formData.image }
            : b
        )
      );
      if (business && business.id === editingBusiness.id) {
        setBusiness({
          ...business,
          ...formData,
          featuredImage: formData.image,
        });
      }
    } else {
      const newBusiness: Business = {
        id: Date.now(),
        ...formData,
        services: 0,
        featuredImage: formData.image,
      };
      setBusinesses([...businesses, newBusiness]);
    }
    setIsModalOpen(false);
  };

  // Search + Pagination
  const filteredBusinesses = businesses.filter((b) => {
    const bizName = b.title?.toLowerCase() || "";
    const bizDesc = b.description?.toLowerCase() || "";
    const query = search.toLowerCase();
    return bizName.includes(query) || bizDesc.includes(query);
  });

  const totalPages = Math.ceil(filteredBusinesses.length / limit);
  const paginatedBusinesses = filteredBusinesses.slice(
    (page - 1) * limit,
    page * limit
  );

  if (loading) return <p className="p-8">Loading businesses...</p>;
  if (!business) return <p className="p-8 text-red-500">Business not found.</p>;
  return (
    <div className="p-6 pt-20 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline"
      >
        ← Back to Sub Category
      </button>

      <div className="bg-white p-6 mt-6 rounded-2xl shadow">
        {/* Main business info */}
        <h1 className="text-3xl font-bold mb-2">{business.title}</h1>
        <p className="text-gray-600 mb-2">{business.description}</p>
        <p className="text-sm text-blue-600 mb-4">
          {business.services} services available
        </p>
        {business.placeImg && (
          <img
            src={business.placeImg}
            alt={business.title}
            className="w-full max-w-md object-cover rounded-xl mb-4"
          />
        )}

        {/* CRUD + Search */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Manage Businesses</h2>
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-3 py-1 rounded-xl flex items-center hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-1" /> New
          </button>
        </div>

        <div className="flex items-center border rounded-xl px-3 py-2 mb-4 bg-white shadow-sm">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search businesses..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full outline-none bg-transparent"
          />
        </div>
        {/* Businesses list with image on right */}
        <div className="space-y-4">
          {paginatedBusinesses.map((biz) => (
            <div
              key={biz.id}
              className="flex justify-between items-center bg-gray-50 rounded-2xl shadow p-4 cursor-pointer hover:bg-gray-100 transition"
            >
              <div className="flex-1 pr-4">
                <h3 className="font-semibold text-lg">{biz.title}</h3>
                {/* Description */}
                <div className="flex space-x-4 mt-2">
                  <button
                    onClick={(e) => handleEdit(biz, e)}
                    className="text-blue-600 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDelete(biz.id, e)}
                    className="text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
              {biz.placeImg && (
                <img
                  src={biz.placeImg}
                  alt={biz.title}
                  className="w-24 h-20 object-cover rounded-xl"
                />
              )}
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="px-3 py-1 bg-blue-600 rounded disabled:opacity-50"
            >
              Prev
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="px-3 py-1 bg-blue-600 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                {editingBusiness ? "Edit Business" : "New Business"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Business name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 outline-none"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 outline-none"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
                className="w-full border rounded-lg px-3 py-2 outline-none"
              />
            </div>

            <div className="flex justify-end mt-6 space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubCategoryPage;
