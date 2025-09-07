import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Globe, Users } from "lucide-react";

interface CountryStat {
  name: string;
  visitors: number;
}

const defaultData: CountryStat[] = [
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
  const [allCountries, setAllCountries] = useState<string[]>([]);
  const [filterTerm, setFilterTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  // Fetch all countries
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch("https://restcountries.com/v3.1/all");
        const data = await res.json();
        const names: string[] = data
          .map((c: any) => c.name.common)
          .sort((a: string, b: string) => a.localeCompare(b));
        setAllCountries(names);
      } catch (error) {
        console.error("Error fetching world countries:", error);
      }
    };
    fetchAll();
  }, []);

  // Filter countries
  const filteredAll = allCountries.filter((name) =>
    name.toLowerCase().includes(filterTerm.toLowerCase())
  );

  // Decide which stats to show
  const statsToShow =
    selectedCountry && defaultData.find((c) => c.name === selectedCountry)
      ? [defaultData.find((c) => c.name === selectedCountry)!]
      : defaultData;

  return (
    <div className="pt-20 min-h-screen bg-gray-50 p-6">
      {/* Back link */}
      <Link to="/dashboard" className="text-blue-600 hover:underline text-sm">
        ← Back to Dashboard
      </Link>

      {/* Header */}
      <h1 className="text-2xl font-bold mt-4">Visitor Analytics</h1>
      <p className="text-gray-600 mb-6">
        Track where your visitors are coming from globally
      </p>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="flex items-center w-full sm:w-2/3 bg-white rounded-lg px-3 py-4 shadow-sm">
          <Search className="text-gray-400 w-5 h-5 mr-2" />
          <input
            type="text"
            value={filterTerm}
            onChange={(e) => setFilterTerm(e.target.value)}
            placeholder="Search countries..."
            className="flex-1 outline-none text-sm"
          />
        </div>
        <div className="flex items-center w-full sm:w-1/3 bg-white rounded-lg px-3 py-4 shadow-sm">
          <Globe className="text-gray-400 w-5 h-5 mr-2" />
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="flex-1 outline-none text-sm bg-transparent"
          >
            <option value="">All Countries</option>
            {filteredAll.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Country Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {statsToShow.map((country) => (
          <div
            key={country.name}
            className="relative bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition"
          >
            <h2 className="font-semibold text-gray-800 mb-4">{country.name}</h2>

            <div className="bg-gray-100 rounded-sm p-2 flex items-center justify-start gap-2 shadow-sm w-fit">
              <Users className="w-5 h-5 text-gray-500" />
              <p className="text-2xl font-bold text-blue-600">
                {country.visitors.toLocaleString()}
              </p>
              <span className="text-gray-600 text-sm font-medium">
                Visitors
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisitorAnalyticsPage;
