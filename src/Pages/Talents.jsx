import React, { useState, useEffect } from 'react';
import TalentCard from '../components/TalentCard';
import LoadingSpinner from '../Components/LoadingSpinner';
import ErrorMessage from '../Components/ErrorMessage';
import FilterTabs from '../Components/FilterTabs';
import { FcFeedback } from 'react-icons/fc';

const Talents = () => {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'football', 'basketball', 'athletics', 'other'

  useEffect(() => {
    const fetchTalents = async () => {
      try {
        // Simulate API fetch with talent-specific data
        const mockTalents = [
          {
            id: 1,
            name: 'Jean Claude Niyomugabo',
            age: 17,
            sport: 'football',
            position: 'Attacking Midfielder',
            bio: 'Star player from APR FC academy with exceptional dribbling skills',
            achievements: 'MVP U-17 Tournoi de l\'Amitié 2024',
            image: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            location: 'Kigali, Rwanda',
            potential: 4.8,
            video: 'https://youtu.be/sample1'
          },
          {
            id: 2,
            name: 'kamanzi',
            age: 16,
            sport: 'basketball',
            position: 'pointer',
            bio: 'Standout performer at the recent FIBA U16 African Championship',
            achievements: 'All-Tournament Team 2024',
            image: 'https://images.unsplash.com/photo-1606761568499-6c87bdee0b56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            location: 'Huye, Rwanda',
            potential: 4.5,
            video: 'https://youtu.be/sample2'
          },
          {
            id: 3,
            name: 'Eric Nshuti',
            age: 18,
            sport: 'Football',
            position: 'winger',
            bio: 'Rwanda U17',
            achievements: 'Gold Medal - East African Junior Championships',
            image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            location: 'Musanze, Rwanda',
            potential: 4.9,
            video: 'https://youtu.be/sample3'
          },
          {
            id: 4,
            name: 'danilo',
            age: 15,
            sport: 'football',
            position: 'left back',
            bio: 'Dominant young player',
            achievements: 'Best player CAN U21',
            image: 'https://images.unsplash.com/photo-1592656094267-764a60363a2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            location: 'Rubavu, Rwanda',
            potential: 4.3,
            video: 'https://youtu.be/sample4'
          },
          {
            id: 5,
            name: 'David Habimana',
            age: 17,
            sport: 'football',
            position: 'Center Back',
            bio: 'Physically imposing defender with excellent leadership qualities',
            achievements: 'Captain Rwanda U17 National Team',
            image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            location: 'Nyagatare, Rwanda',
            potential: 4.6,
            video: 'https://youtu.be/sample5'
          },
          {
            id: 6,
            name: 'dida',
            age: 14,
            sport: 'football',
            position: 'foward',
            bio: 'Promising young player',
            achievements: '5 Gold Medals - Rwanda Youth Games',
            image: 'https://images.unsplash.com/photo-1551754651-0fdb3f429fd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            location: 'Kigali, Rwanda',
            potential: 4.7,
            video: 'https://youtu.be/sample6'
          },
          {
            id: 5,
            name: 'David Habimana',
            age: 17,
            sport: 'football',
            position: 'Center Back',
            bio: 'Physically imposing defender with excellent leadership qualities',
            achievements: 'Captain Rwanda U17 National Team',
            image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            location: 'Nyagatare, Rwanda',
            potential: 4.6,
            video: 'https://youtu.be/sample5'
          },
    
        ];
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setTalents(mockTalents);
      } catch (err) {
        setError('Failed to load talents. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTalents();
  }, []);

  const filteredTalents = filter === 'all' 
    ? talents 
    : talents.filter(talent => talent.sport === filter);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <section className="py-12 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">Rising Sports Talents</h1>
          <p className="text-lg text-gray-600">Discover Rwanda's next generation of sports stars</p>
        </header>

        {/* Filter Tabs */}
        <FilterTabs 
          filters={[
            { id: 'all', label: 'All Talents' },
            { id: 'football', label: 'Football' },
            { id: 'basketball', label: 'Basketball' },
            { id: 'other', label: 'Other Sports' }
          ]}
          activeFilter={filter}
          onFilterChange={setFilter}
        />

        {/* Featured Talent (for 'all' filter) */}
        {filter === 'all' && talents.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">Featured Talent</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 relative">
                  <img 
                    src={talents[0].image} 
                    alt={talents[0].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                    <span className="text-white font-medium">{talents[0].name}</span>
                  </div>
                </div>
                <div className="p-8 md:w-2/3">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-blue-600 capitalize">
                      {talents[0].sport}
                      {talents[0].position ? ` • ${talents[0].position}` : ''}
                      {talents[0].discipline ? ` • ${talents[0].discipline}` : ''}
                    </span>
                    <div className="flex items-center">
                      <span className="text-yellow-500 mr-1">★</span>
                      <span className="font-medium">{talents[0].potential}/5</span>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">{talents[0].name}, {talents[0].age}</h2>
                  <p className="text-gray-700 mb-4">{talents[0].bio}</p>
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-800 mb-2">Notable Achievements:</h3>
                    <p className="text-gray-600">{talents[0].achievements}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">{talents[0].location}</span>
                    <div className="flex space-x-3">
                      <a 
                        href={talents[0].video}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
                      >
                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M10 16.5l6-4.5-6-4.5v9zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                        </svg>
                        Watch Highlights
                      </a>
                      <a 
                        href={`/talents/${talents[0].id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Full Profile
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Talents Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTalents.length > 0 ? (
            filteredTalents
              .filter(talent => filter !== 'all' || talent.id !== 1) // Exclude featured from grid when showing all
              .map((talent) => (
                <TalentCard 
                  key={talent.id}
                  {...talent}
                  link={`/talents/${talent.id}`}
                />
              ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-600">No talents found in this category</p>
            </div>
          )}
        </div>
    
      </div>
    </section>
  );
};

export default Talents;