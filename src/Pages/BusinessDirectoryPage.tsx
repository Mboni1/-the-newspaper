// src/pages/BusinessDirectoryPage.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building,
  MoreHorizontal,
  Search,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import api from "../lib/axios";

interface Business {
  id: number;
  name: string;
  address: string;
  category: string;
  placeImg: string[];
  coords: string[];
  icon?: React.ElementType;
}

// Search + Filter Bar
interface SearchFilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  category,
  setCategory,
}) => (
  <div className="flex flex-col sm:flex-row gap-3 w-full mb-6">
    <div className="flex items-center w-full px-4 py-2 rounded-xl border border-gray-300 focus-within:ring-2 focus-within:ring-blue-500">
      <Search className="text-gray-400 w-5 h-5 mr-2" />
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-1 outline-none bg-transparent"
      />
    </div>
    <div className="relative">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="px-4 py-2 rounded-xl border border-gray-300 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500"
      >
        <option value="All">All categories</option>
        <option value="Hotels">Hotels</option>
        <option value="Restaurants">Restaurants</option>
        <option value="Shops">Shops</option>
        <option value="Museums">Museums</option>
      </select>
    </div>
  </div>
);

// Simple Pagination
interface SimplePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const SimplePagination: React.FC<SimplePaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => (
  <div className="flex justify-center items-center gap-4 mt-6">
    <button
      onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
      disabled={currentPage === 1}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
    >
      Prev
    </button>
    <span>
      Page {currentPage} of {totalPages}
    </span>
    <button
      onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
      disabled={currentPage === totalPages}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
    >
      Next
    </button>
  </div>
);

const limit = 3;

const BusinessDirectoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Dropdown state for each business
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

  // Edit Modal state
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [editName, setEditName] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/category/adminfetchbuz/all?page=${currentPage}&limit=${limit}&search=${searchTerm}`
      );
      const mappedData: Business[] = (res.data.data || []).map((item: any) => ({
        id: item.id,
        name: item.title,
        address: item.location,
        category: item.subCategory?.name || "Uncategorized",
        placeImg: item.placeImg || [],
        coords: item.coords || [],
        icon: Building,
      }));
      setBusinesses(mappedData);
      setTotalPages(Math.ceil(res.data.total / limit) || 1);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch businesses.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses();
  }, [currentPage, searchTerm]);

  const filteredBusinesses = businesses.filter((b) => {
    const matchesCategory = category === "All" || b.category === category;
    const matchesSearch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Delete business
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this business?")) return;
    try {
      await api.delete(`/business/${id}`);
      setBusinesses((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete business");
    }
  };

  // Open Edit Modal
  const openEditModal = (business: Business) => {
    setEditingBusiness(business);
    setEditName(business.name);
    setEditAddress(business.address);
    setEditCategory(business.category);
  };

  // Submit Edit
  const handleEditSubmit = async () => {
    if (!editingBusiness) return;

    const formData = new FormData();
    formData.append("title", editName);
    formData.append("location", editAddress);
    formData.append("subCategory", editCategory);
    if (editImage) formData.append("placeImg", editImage);

    try {
      await api.put(`/business/${editingBusiness.id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // Update locally
      setBusinesses((prev) =>
        prev.map((b) =>
          b.id === editingBusiness.id
            ? {
                ...b,
                name: editName,
                address: editAddress,
                category: editCategory,
              }
            : b
        )
      );
      setEditingBusiness(null);
    } catch (err) {
      console.error(err);
      alert("Failed to update business");
    }
  };

  return (
    <div className="p-6 pt-20 px-10 py-10 bg-gray-50 min-h-screen">
      <Link
        to="/dashboard"
        className="text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to Dashboard
      </Link>

      {/* Header + New */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Business Directory</h1>
          <p className="text-gray-600">
            Manage and organize all listed businesses in one place.
          </p>
        </div>
        <button
          onClick={() => navigate("/add-business")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md"
        >
          + New
        </button>
      </div>

      {/* Search / Filter */}
      <SearchFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        category={category}
        setCategory={setCategory}
      />

      {/* Loading / Error */}
      {loading && <p className="p-4">Loading businesses...</p>}
      {error && <p className="p-4 text-red-500">{error}</p>}

      {/* Business Grid */}
      <div className="p-6 px-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBusinesses.map((business) => {
          const Icon = business.icon || Building;
          return (
            <div
              key={business.id}
              className="bg-white rounded-2xl shadow-sm p-3 hover:shadow-md transition w-full relative"
            >
              {business.placeImg.length > 0 && (
                <img
                  src={business.placeImg[0]}
                  alt={business.name}
                  className="w-full h-70 object-cover rounded-lg"
                />
              )}

              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">{business.name}</h2>
                    <p className="text-gray-500 text-sm">{business.address}</p>
                  </div>

                  {/* Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenDropdownId(
                          openDropdownId === business.id ? null : business.id
                        )
                      }
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MoreHorizontal />
                    </button>

                    {openDropdownId === business.id && (
                      <div className="absolute right-5 mt-3 w-32 h-18 bg-white -translate-y-7 border rounded-md shadow-lg z-10">
                        <button
                          onClick={() => openEditModal(business)}
                          className="flex items-center w-full px-3 py-2 text-left hover:bg-gray-100"
                        >
                          <Edit className="w-4 h-4 mr-2" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(business.id)}
                          className="flex items-center w-full px-3 py-1 text-left hover:bg-gray-100 text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center mt-3 text-blue-600 font-medium text-sm">
                  <Icon className="w-5 h-5 mr-2" />
                  {business.category}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <SimplePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* Edit Modal */}
      {editingBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-96 p-6 relative">
            <button
              onClick={() => setEditingBusiness(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X />
            </button>
            <h2 className="text-xl font-bold mb-4">Edit Business</h2>

            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Name"
              className="w-full mb-3 px-3 py-2 border rounded"
            />
            <input
              type="text"
              value={editAddress}
              onChange={(e) => setEditAddress(e.target.value)}
              placeholder="Address"
              className="w-full mb-3 px-3 py-2 border rounded"
            />
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="w-full mb-3 px-3 py-2 border rounded"
            >
              <option value="Hotels">Hotels</option>
              <option value="Restaurants">Restaurants</option>
              <option value="Shops">Shops</option>
              <option value="Museums">Museums</option>
            </select>

            {/* Image Upload */}
            <label className="block mb-2 font-medium">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setEditImage(e.target.files ? e.target.files[0] : null)
              }
              className="w-full mb-3"
            />

            {/* Preview */}
            {editImage ? (
              <img
                src={URL.createObjectURL(editImage)}
                alt="Preview"
                className="w-full h-40 object-cover rounded mb-3"
              />
            ) : editingBusiness.placeImg.length > 0 ? (
              <img
                src={editingBusiness.placeImg[0]}
                alt="Current"
                className="w-full h-40 object-cover rounded mb-3"
              />
            ) : null}

            <button
              onClick={handleEditSubmit}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDirectoryPage;
