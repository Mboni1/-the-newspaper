import React from 'react';
import { Link } from 'react-router-dom';

const TalentCard = ({ name, age, sport, position, discipline, image, potential, link }) => {
  const sportColors = {
    football: 'bg-green-100 text-green-800',
    basketball: 'bg-orange-100 text-orange-800',
    athletics: 'bg-red-100 text-red-800',
    other: 'bg-purple-100 text-purple-800'
  };

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <h3 className="text-white font-bold text-lg">{name}, {age}</h3>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <span className={`text-xs px-2 py-1 rounded-md ${
            sportColors[sport] || sportColors.other
          }`}>
            {sport === 'other' ? discipline : position || discipline || sport}
          </span>
          <div className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span className="font-medium text-sm">{potential}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4">
          <Link
            to={link}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center"
          >
            View Profile
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TalentCard;