import {
  Phone,
  MapPin,
  Clock,
  Star,
  Plane,
  Car,
  Bed,
  Wifi,
  CreditCard,
  Utensils,
  Ticket,
  ShoppingBag,
  Hospital,
  ShieldAlert,
} from "lucide-react";

type Business = {
  id: number;
  name: string;
  address: string;
  phone: string;
  hours: string;
  image: string;
  category: string;
  rating?: number;
};

// Map category → icon
const categoryIcons: Record<string, React.ElementType> = {
  "Travel & Emergency": ShieldAlert,
  Transportation: Car,
  Accomodation: Bed,
  Communication: Wifi,
  "Money & Payments": CreditCard,
  "Food & Dining": Utensils,
  "Events & Tours": Ticket,
  Shopping: ShoppingBag,
  "Health & Wellness": Hospital,
};
const businesses: Business[] = [
  {
    id: 1,
    name: "US Embassy Kigali",
    address: "KG 7 Ave, Kigali",
    phone: "+250 252 580 888",
    hours: "8:00 AM - 17:00 PM",
    image: "https://source.unsplash.com/400x250/?restaurant",
    category: "Travel & Emergency",
    rating: 4.8,
  },
  {
    id: 2,
    name: "Kigali Travel Health Clinic",
    address: "KN 3 Rd, Kigali",
    phone: "+250 788 777 888",
    hours: "5:00 PM - 2:00 AM",
    image: "https://source.unsplash.com/400x250/?cafe",
    category: "Travel & Emergency",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Kigali Genocide Memorial",
    address: "KG 14 Ave, Gisozi",
    phone: "+250 252 536 505",
    hours: "8:00 AM - 5:00 PM",
    image: "https://source.unsplash.com/400x250/?memorial",
    category: "Events & Tours",
    rating: 4.8,
  },
  {
    id: 4,
    name: "Rwanda Eco Tours",
    address: "KN 5 Ave, Kigali",
    phone: "+250 788 999 000",
    hours: "7:00 AM - 6:00 PM",
    image: "https://source.unsplash.com/400x250/?mountains",
    category: "Events & Tours",
    rating: 4.8,
  },
  {
    id: 5,
    name: "Kigali City Tower Mall",
    address: "KN 4 Ave, Kigali",
    phone: "+250 252 597 500",
    hours: "9:00 AM - 9:00 PM",
    image: "https://source.unsplash.com/400x250/?shopping-mall",
    category: "Shopping",
    rating: 4.4,
  },
  {
    id: 6,
    name: "Kimironko Market",
    address: "Kimironko, Kigali",
    phone: "+250 788 444 555",
    hours: "6:00 AM - 6:00 PM",
    image: "https://source.unsplash.com/400x250/?market",
    category: "Shopping",
    rating: 4.2,
  },
  {
    id: 7,
    name: "Kigali Bus Services",
    address: "Nyabugogo Bus Terminal",
    phone: "+250 788 444 555",
    hours: "5:00 AM - 10:00 PM",
    image: "https://source.unsplash.com/400x250/?market",
    category: "Transportation",
    rating: 4.2,
  },
  {
    id: 8,
    name: "Kigali Serena Hotel",
    address: "KN 3 Ave, Kigali",
    phone: "+250 788 444 555",
    hours: "24/7",
    image: "https://source.unsplash.com/400x250/?market",
    category: "Accomodation",
    rating: 4.8,
  },
  {
    id: 9,
    name: "Heaven Boutique Hotel",
    address: "KG 7 Ave, Kigali",
    phone: "+250 788 444 555",
    hours: "24/7",
    image: "https://source.unsplash.com/400x250/?market",
    category: "Accomodation",
    rating: 4.5,
  },
  {
    id: 10,
    name: "MTN Rwanda Service Center",
    address: "KN 4 Ave, Kigali",
    phone: "+250 788 444 555",
    hours: "8:00 AM - 18:00 PM",
    image: "https://source.unsplash.com/400x250/?market",
    category: "Communication",
    rating: 4.3,
  },
  {
    id: 11,
    name: "Airtel Rwanda Store",
    address: "KG 11 Ave, Kigali",
    phone: "+250 788 444 555",
    hours: "8:00 AM - 19:00 PM",
    image: "https://source.unsplash.com/400x250/?market",
    category: "Communication",
    rating: 4.2,
  },
  {
    id: 12,
    name: "Bank of Kigali",
    address: "KN 2 Ave, Kigali",
    phone: "+250 788 444 555",
    hours: "8:00 AM - 17:00 PM",
    image: "https://source.unsplash.com/400x250/?market",
    category: "Money & Payments",
    rating: 4.6,
  },
  {
    id: 13,
    name: "Equity Bank Rwanda",
    address: "KG 5 Ave, Kigali",
    phone: "+250 788 444 555",
    hours: "6:00 AM - 17:00 PM",
    image: "https://source.unsplash.com/400x250/?market",
    category: "Money & Payments",
    rating: 4.4,
  },
  {
    id: 14,
    name: "King Faisal Hospital",
    address: "KG 544 St, Kigali",
    phone: "+250 788 444 555",
    hours: "24/7",
    image: "https://source.unsplash.com/400x250/?market",
    category: "Health & Wellness",
    rating: 4.8,
  },
  {
    id: 15,
    name: "Pharmacy Plus",
    address: "KN 1 Ave, Kigali",
    phone: "+250 788 444 555",
    hours: "7:00 AM - 22:00 PM",
    image: "https://source.unsplash.com/400x250/?market",
    category: "Health & Wellness",
    rating: 4.5,
  },
  {
    id: 16,
    name: "Heaven Restaurant",
    address: "KG 7 Ave, Kigali",
    phone: "+250 788 444 555",
    hours: "10:00 AM - 23:00 PM",
    image: "https://source.unsplash.com/400x250/?market",
    category: "Food & Dining",
    rating: 4.7,
  },
  {
    id: 17,
    name: "Repub Rouge",
    address: "KN 3 Ave, Kigali",
    phone: "+250 788 444 555",
    hours: "5:00 pM - 2:00 AM",
    image: "https://source.unsplash.com/400x250/?market",
    category: "Food & Dining",
    rating: 4.6,
  },
  {
    id: 18,
    name: "Move Rwanda Car Rental",
    address: "KG 9 Ave, Kigali",
    phone: "+250 788 444 555",
    hours: "24/7",
    image: "https://source.unsplash.com/400x250/?market",
    category: "Transportation",
    rating: 4.7,
  },
];

export default function BusinessGrid() {
  return (
    <div className="max-w-10xl mx-auto p-8">
      {/* Grid of Businesses */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {businesses.map((biz) => {
          const Icon = categoryIcons[biz.category];
          return (
            <div
              key={biz.id}
              className="bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden"
            >
              <div className="relative">
                <img
                  src={biz.image}
                  alt={biz.name}
                  className="w-full h-40 object-cover"
                />
                {/* Category + Rating Badge */}
                <div className="absolute top-0 left-3 flex items-center gap-1 bg-blue-600 text-white text-xs px-3 py-1 rounded-full shadow">
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{biz.category}</span>
                </div>

                {biz.rating && (
                  <div className="absolute top-3 right-3 flex items-center bg-white text-gray-800 text-xs px-2 py-1 rounded-full shadow">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    {biz.rating}
                  </div>
                )}
              </div>
              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {biz.name}
                </h3>

                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  {biz.address}
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <Phone className="w-4 h-4 mr-1" />
                  {biz.phone}
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-3">
                  <Clock className="w-4 h-4 mr-1" />
                  {biz.hours}
                </div>

                <a
                  href="#"
                  className="text-blue-600 font-medium text-sm hover:underline"
                >
                  View Details →
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center bg-white shadow rounded-2xl p-6">
        <div>
          <p className="text-2xl font-bold text-blue-600">18</p>
          <p className="text-gray-500 text-sm">Total Businesses</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-blue-600">10</p>
          <p className="text-gray-500 text-sm">Categories</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-blue-600">4.6</p>
          <p className="text-gray-500 text-sm">Average Rating</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-blue-600">24/7</p>
          <p className="text-gray-500 text-sm">Support Available</p>
        </div>
      </div>
    </div>
  );
}
