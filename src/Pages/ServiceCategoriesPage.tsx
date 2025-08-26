import React from "react";
import { Link } from "react-router-dom";

import {
  Plane,
  Bus,
  Bed,
  Wifi,
  CreditCard,
  Heart,
  Utensils,
  Map,
  ShoppingBag,
  MoreHorizontal,
} from "lucide-react";

interface Category {
  id: number;
  name: string;
  services: number;
  description: string;
  icon: React.ElementType;
  link: string;
}

const categories: Category[] = [
  {
    id: 1,
    name: "Travel & Emergency Info",
    services: 24,
    description:
      "Essential travel documents, emergency contacts, and safety information",
    icon: Plane,
    link: "/categories/travel",
  },
  {
    id: 2,
    name: "Transportation Services",
    services: 18,
    description:
      "Public transport, ride-sharing, car rentals, and navigation services",
    icon: Bus,
    link: "/categories/transport",
  },
  {
    id: 3,
    name: "Accommodation & Booking Services",
    services: 32,
    description: "Hotels, hostels, vacation rentals, and booking platforms",
    icon: Bed,
    link: "/categories/accommodation",
  },
  {
    id: 4,
    name: "Communication & Connectivity",
    services: 15,
    description: "Internet access, phone services, and communication apps",
    icon: Wifi,
    link: "/categories/communication",
  },
  {
    id: 5,
    name: "Money & Payments",
    services: 21,
    description: "Banking services, currency exchange, and payment methods",
    icon: CreditCard,
    link: "/categories/money",
  },
  {
    id: 6,
    name: "Health & Wellness",
    services: 27,
    description:
      "Medical services, pharmacies, fitness centers, and wellness facilities",
    icon: Heart,
    link: "/categories/health",
  },
  {
    id: 7,
    name: "Food & Dining",
    services: 45,
    description:
      "Restaurants, cafes, food delivery, and local cuisine recommendations",
    icon: Utensils,
    link: "/categories/food",
  },
  {
    id: 8,
    name: "Local Events, Attractions & Tours",
    services: 38,
    description:
      "Tourist attractions, guided tours, cultural events, and entertainment",
    icon: Map,
    link: "/categories/events",
  },
  {
    id: 9,
    name: "Shopping",
    services: 29,
    description: "Retail stores, markets, souvenirs, and shopping centers",
    icon: ShoppingBag,
    link: "/categories/shopping",
  },
  {
    id: 10,
    name: "More",
    services: 12,
    description: "Additional services and miscellaneous categories",
    icon: MoreHorizontal,
    link: "/categories/more",
  },
];

const ServiceCategories: React.FC = () => {
  return (
    <div className="p-8 pt-20 px-8 py-8 bg-gray-50 min-h-screen">
      <Link
        to="/dashboard"
        className="text-blue-600 hover:underline inline-block mb-4"
      >
        ← Back to Dashboard
      </Link>

      <h1 className="text-3xl font-bold mb-2">Service Categories</h1>
      <p className="text-gray-600 mb-8">
        Explore our comprehensive range of services organized by category to
        help you find exactly what you need.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3 mb-3">
              <category.icon className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold">{category.name}</h2>
            </div>
            <p className="text-sm text-blue-600 font-medium mb-2">
              {category.services} services
            </p>
            <p className="text-gray-600 text-sm mb-4">{category.description}</p>
            <Link
              to={category.link}
              className="text-blue-600 text-sm font-semibold hover:underline"
            >
              EXPLORE CATEGORY →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCategories;
