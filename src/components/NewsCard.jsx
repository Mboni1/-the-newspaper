import React from 'react';

const NewsCard = ({ title, excerpt, date, image }) => (
  <div className="bg-gray-50 rounded-lg shadow hover:shadow-lg transition-shadow">
    <img
      src={image}
      alt={title}
      className="w-full h-48 object-cover rounded-t-lg"
      loading="lazy"
    />
    <div className="p-4">
      <span className="text-sm text-gray-500">{date}</span>
      <h3 className="text-xl font-semibold text-blue-700 mt-2 mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{excerpt}</p>
      <button className="mt-4 text-blue-600 hover:underline">Read more</button>
    </div>
  </div>
);

export default NewsCard;
