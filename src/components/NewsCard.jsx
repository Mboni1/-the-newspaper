// NewsCard.jsx
import React from 'react';

const NewsCard = ({ id, title, excerpt, date, image, category, author, link, onClick, isActive }) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 ${isActive ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => onClick(id)}
    >
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-medium text-blue-600 uppercase">
            {category === 'rwanda' ? 'Rwanda' : category === 'local' ? 'Region' : 'World'}
          </span>
          <time className="text-xs text-gray-500">{date}</time>
        </div>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-gray-700 text-sm mb-4">{excerpt}</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">By {author}</span>
          <a 
            href={link} 
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          >
            Read More
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
