import React from "react";
import { Link } from "react-router-dom";
import { Search, Filter, MoreHorizontal, Plus } from "lucide-react";

interface Location {
  id: number;
  name: string;
  district: string;
  longitude: string;
  description: string;
  imageUrl: string;
}

const locations: Location[] = [
  {
    id: 1,
    name: "Volcanoes National Park",
    district: "Musanze",
    longitude: "29.5833°E",
    description:
      "Experience breathtaking natural beauty and pristine wilderness in this stunning destination",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/Mount_Karisimbi.jpg",
  },
  {
    id: 2,
    name: "Kigali Genocide Memorial",
    district: "Gasabo",
    longitude: "30.0644°E",
    description:
      "Discover rich heritage and traditional culture through immersive historical experiences.",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/8/8c/Kigali_Genocide_Memorial_Centre.jpg",
  },
  {
    id: 3,
    name: "Akagera National Park",
    district: "Kayonza",
    longitude: "30.7500°E",
    description:
      "Encounter diverse wildlife and enjoy thrilling safari adventures in their natural habitat.",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/d/d7/Akagera_National_Park.jpg",
  },
  {
    id: 4,
    name: "Nyungwe National Park",
    district: "Rusizi",
    longitude: "29.1333°E",
    description:
      "Experience breathtaking natural beauty and pristine wilderness in this stunning destination",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/d/d7/Nyungwe_National_Park.jpg",
  },
  {
    id: 5,
    name: "Lake kivu",
    district: "Rubavu",
    longitude: "30.0644°E",
    description:
      "Encounter diverse wildlife and enjoy thrilling safari adventures in their natural habitat.",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/d/d7/Lake-Kivu.jpg",
  },
  {
    id: 6,
    name: "King's Palace Museum",
    district: "Nyanza",
    longitude: "30.7500°E",
    description:
      "Discover rich heritage and traditional culture through immersive historical experiences.",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/d/d7/King's Palace Museum.jpg",
  },
];

const LocationsOverviewPage: React.FC = () => {
  return (
    <div className="p-6 pt-20 min-h-screen bg-gray-50">
      {/* Back link */}
      <Link to="/dashboard" className="flex items-center text-gray-700 mb-4">
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
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 flex items-center space-x-2">
          <Plus className="w-5 h-5" /> <span>New</span>
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-3 rounded-xl shadow mb-8">
        <div className="flex items-center flex-1 border rounded-lg px-3 py-2">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search location"
            className="flex-1 outline-none"
          />
        </div>
        <div className="flex items-center border rounded-lg px-3 py-2">
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
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="bg-white rounded-2xl shadow hover:shadow-md transition overflow-hidden"
          >
            {/* Image */}
            <img
              src={loc.imageUrl}
              alt={loc.name}
              className="w-full h-40 object-cover"
            />

            {/* Content */}
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
