import React, { useState, useEffect } from 'react';
import TalentCard from '../components/TalentCard';
import LoadingSpinner from '../Components/LoadingSpinner';
import ErrorMessage from '../Components/ErrorMessage';
import FilterTabs from '../Components/FilterTabs';

const Talents = () => {
  const [talents, setTalents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [featuredTalent, setFeaturedTalent] = useState(null);

  useEffect(() => {
    const fetchTalents = async () => {
      try {
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
            id: 7,
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
        
        await new Promise(resolve => setTimeout(resolve, 800));
        setTalents(mockTalents);
        setFeaturedTalent(mockTalents[0]);
      } catch (err) {
        setError('Failed to load talents. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTalents();
  }, []);

  const handleTalentClick = (talent) => {
    setFeaturedTalent(talent);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredTalents = filter === 'all' 
    ? talents 
    : talents.filter(talent => talent.sport === filter);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <section className="py-8 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Main Content Area - Featured Talent */}
        <main className="lg:w-2/3">
          <header className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">Rising Sports Talents</h1>
            <p className="text-lg text-gray-600">Discover Rwanda's next generation of sports stars</p>
          </header>

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

          {featuredTalent && (
            <article className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
              <img 
                src={featuredTalent.image} 
                alt={featuredTalent.name}
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-blue-600 capitalize">
                    {featuredTalent.sport}
                    {featuredTalent.position ? ` • ${featuredTalent.position}` : ''}
                  </span>
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★</span>
                    <span className="font-medium">{featuredTalent.potential}/5</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">{featuredTalent.name}, {featuredTalent.age}</h2>
                <p className="text-gray-600 mb-1">{featuredTalent.location}</p>
                <p className="text-gray-700 mb-4">{featuredTalent.bio}</p>
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-800 mb-1">Achievements:</h3>
                  <p className="text-gray-600">{featuredTalent.achievements}</p>
                </div>
                <div className="flex justify-between items-center">
                  <a 
                    href={featuredTalent.video}
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
                    href={`/talents/${featuredTalent.id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Full Profile
                  </a>
                </div>
              </div>
            </article>
          )}
        </main>

        {/* Aside - Talent Cards */}
        <aside className="lg:w-1/3 mt-8 lg:mt-20">
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">More Talents</h2>
          <div className="space-y-4">
            {filteredTalents
              .filter(talent => talent.id !== featuredTalent?.id)
              .map((talent) => (
                <TalentCard 
                  key={talent.id}
                  {...talent}
                  onClick={() => handleTalentClick(talent)}
                  compact={true}
                />
              ))}
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Talents;