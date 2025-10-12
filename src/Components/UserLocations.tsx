import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import api from "../lib/axios";
import toast from "react-hot-toast";

interface ChartData {
  name: string;
  title: string;
  value: number;
  [key: string]: string | number;
}

const COLORS = ["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#dbeafe"];
const options = ["Countries", "Categories", "Businesses"] as const;
type OptionType = (typeof options)[number];

const UserLocation: React.FC = () => {
  const [selected, setSelected] = useState<OptionType>("Countries");
  const [data, setData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCountries = async () => {
      setLoading(true);
      try {
        const res = await api.get("/analytics/countries");

        const payload = (res.data.data || []).map((item: any) => ({
          name: item.country,
          value: item.percentage ?? item.count,
        }));
        setData(payload);
      } catch (err) {
        console.error("Failed to fetch countries analytics:", err);
        toast.error("Failed to fetch countries analytics");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await api.get("/analytics/categories");
        console.log("Categories Response:", res.data);

        // Extract category name and count
        const payload = (res.data.data || []).map((item: any) => ({
          name: item.categoryItem?.name || "Unknown",
          value: item.count || 0,
        }));

        setData(payload);
      } catch (err) {
        console.error("Failed to fetch categories analytics:", err);
        toast.error("Failed to fetch categories analytics");
      } finally {
        setLoading(false);
      }
    };

    const fetchPlaceItems = async () => {
      setLoading(true);
      try {
        const res = await api.get("/analytics/placeitem");
        console.log("Businesses Response:", res.data);

        // Extract business data correctly
        const payload = (res.data.data || []).map((item: any) => {
          const businessName =
            item.placeItem?.title ||
            item.businessItem?.title ||
            item.title ||
            "Unknown Business";
          const countValue =
            item._count?.placeItemId || item.count || item.value || 0;

          return {
            name: businessName,
            value: countValue,
          };
        });

        setData(payload);
      } catch (err) {
        console.error("Failed to fetch business analytics:", err);
        toast.error("Failed to fetch business analytics");
      } finally {
        setLoading(false);
      }
    };

    if (selected === "Countries") fetchCountries();
    else if (selected === "Categories") fetchCategories();
    else if (selected === "Businesses") fetchPlaceItems();
  }, [selected]);

  return (
    <div className="bg-white shadow rounded-lg p-4 py-8 px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <p className="text-lg font-semibold py-1.5">
            Geographic Distribution of Users
          </p>
          <h2 className="text-gray-500 text-sm py-1.5">
            {selected} distribution
          </h2>
        </div>

        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value as OptionType)}
          className="border px-3 py-1 rounded-lg text-sm text-gray-600 cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      {/* Loading */}
      {loading ? (
        <p className="text-center text-gray-500 py-10">
          Loading {selected.toLowerCase()} analytics...
        </p>
      ) : selected === "Countries" ? (
        //  Show Chart for Countries
        <div className="flex flex-col sm:flex-row items-center px-10 pt-10 gap-10">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <ul className="space-y-2">
            {data.map((entry, index) => (
              <li key={index} className="flex justify-between gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></span>
                  <span>{entry.name}</span>
                </div>
                <span className="font-medium">{entry.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        // Show List for Categories or Businesses with better layout and scrolling
        <div className="px-2 pt-4">
          <h3 className="text-md font-semibold mb-4 ">
            Most Used {selected} Today
          </h3>

          {data.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">
              No {selected.toLowerCase()} found today.
            </p>
          ) : (
            <div className="max-h-80 overflow-y-auto pr-2">
              <ul className="space-y-3">
                {data.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Ranking number */}
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>

                      {/* Name with truncation for long text */}
                      <span className="text-sm font-medium text-gray-800 truncate flex-1">
                        {item.name}
                      </span>
                    </div>

                    {/* Count badge */}
                    <div className="flex-shrink-0 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold ml-3">
                      {item.value}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserLocation;
