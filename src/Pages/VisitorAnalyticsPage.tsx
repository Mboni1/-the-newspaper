import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Globe, Users } from "lucide-react";

interface CountryStat {
  name: string;
  visitors: number;
}

const countries: CountryStat[] = [
  { name: "United States", visitors: 2847 },
  { name: "United Kingdom", visitors: 1923 },
  { name: "Germany", visitors: 1456 },
  { name: "France", visitors: 1234 },
  { name: "Canada", visitors: 987 },
  { name: "Netherlands", visitors: 756 },
  { name: "Belgium", visitors: 543 },
  { name: "Australia", visitors: 432 },
];

const VisitorAnalyticsPage: React.FC = () => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (country: string) => {
    setOpenMenu(openMenu === country ? null : country);
  };

  return (
    <div className="pt-20 min-h-screen bg-gray-50 p-6">
      {/* Back Button */}
      <Link to="/dashboard" className="text-blue-600 hover:underline text-sm">
        ← Back to Dashboard
      </Link>

      {/* Header */}
      <h1 className="text-2xl font-bold mt-4">Visitor Analytics</h1>
      <p className="text-gray-600 mb-6">
        Track which countries your visitors are coming from to Rwanda
      </p>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex items-center w-full sm:w-2/3 bg-white  rounded-lg px-3 py-4 shadow-sm">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search countries or regions..."
            className="flex-1 outline-none text-sm"
          />
        </div>
        <div className="flex items-center w-full sm:w-1/3 bg-white  rounded-lg px-3 py-4 shadow-sm">
          <Globe className="text-gray-400 w-5 h-5 mr-2" />
          <select className="flex-1 outline-none text-sm bg-transparent">
            <option>Select a country...</option>
            {countries.map((c) => (
              <option key={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Country Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {countries.map((country) => (
          <div
            key={country.name}
            className="relative bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
          >
            {/* Ellipsis Button */}
            <button
              onClick={() => toggleMenu(country.name)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              ⋯
            </button>

            {/* Card Content */}
            <h2 className="font-semibold text-gray-800 mb-4">{country.name}</h2>

            <div className="bg-gray-100 rounded-sm p-2  flex-col items-center  shadow-sm w-40">
              <div className="flex flex-col items-start">
                <Users className="w-5 h-5 text-gray-500" />
                <span className="text-gray-600 text-sm font-medium">
                  Visitors
                </span>
              </div>
              <p className="text-2xl font-bold text-blue-600 mt-2">
                {country.visitors.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisitorAnalyticsPage;
