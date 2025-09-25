import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import api from "../lib/axios";
import toast from "react-hot-toast";

// Data types
interface ChartData {
  name: string;
  value: number;
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
        const payload = (res.data.data || []).map((item: any) => ({
          name: item.name,
          value: item.value,
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
        const payload = (res.data.data || []).map((item: any) => ({
          name: item.name,
          value: item.value,
        }));
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
          <h2 className="text-gray-500 text-sm">{selected} distribution</h2>
        </div>

        {/* Dropdown */}
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

      {/* Loading state */}
      {loading ? (
        <p className="text-center text-gray-500 py-10">
          Loading {selected.toLowerCase()} analytics...
        </p>
      ) : (
        <div className="flex flex-col sm:flex-row items-center px-10 pt-10 gap-10">
          {/* Donut Chart */}
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

          {/* Legend */}
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
      )}
    </div>
  );
};

export default UserLocation;
