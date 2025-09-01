import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, Filter, MoreHorizontal } from "lucide-react";
import axios from "axios";

interface Location {
  id: number;
  name: string;
  district: string;
  longitude: string;
  description: string;
  imageUrl: string;
}

const LocationsOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get("https://nearme-bn.onrender.com/location", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        setLocations(res.data.data || []);
        setLoading(false);
      } catch (err: any) {
        setError(err.message || "Failed to fetch locations");
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  if (loading) return <p className="p-6 pt-20">Loading locations...</p>;
  if (error) return <p className="p-6 pt-20 text-red-500">{error}</p>;

  return (
    <div className="p-6 pt-20 min-h-screen bg-gray-50">
      {/* Back link */}
      <Link
        to="/dashboard"
        className="text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Locations Overview</h1>
          <p className="text-gray-600">
            Detailed insights into visitor activities across Rwanda&apos;s
            destinations
          </p>
        </div>
        <button
          onClick={() => navigate("/add-location")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow-md"
        >
          + New
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl shadow mb-8">
        <div className="flex items-center w-full px-3 py-2 rounded-xl bg-white shadow-sm">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search location"
            className="flex-1 outline-none"
          />
        </div>
        <div className="flex items-center relative rounded-lg px-3 py-2">
          <Filter className="text-gray-400 w-5 h-5 mr-2" />
          <select className="outline-none bg-transparent">
            <option>All Provinces</option>
            <option>Northern</option>
            <option>Southern</option>
            <option>Eastern</option>
            <option>Western</option>
            <option>Kigali City</option>
          </select>
        </div>
      </div>

      {/* Locations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {locations?.map((loc) => (
          <div
            key={loc.id}
            className="bg-white rounded-2xl shadow hover:shadow-md transition overflow-hidden"
          >
            <img
              src={loc.imageUrl}
              alt={loc.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <div className="flex items-start justify-between">
                <h2 className="font-bold text-lg">{loc.name}</h2>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal />
                </button>
              </div>
              <div className="flex gap-2 mt-2">
                <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-lg">
                  {loc.district}
                </span>
                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-lg">
                  Longitude: {loc.longitude}
                </span>
              </div>
              <p className="text-gray-600 text-sm mt-3">{loc.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LocationsOverviewPage;
