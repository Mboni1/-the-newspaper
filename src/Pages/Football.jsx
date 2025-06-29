import React, { useState, useEffect } from 'react';
import NewsCard from '../Components/NewsCard';
import LoadingSpinner from '../Components/LoadingSpinner';
import ErrorMessage from '../Components/ErrorMessage';
import FilterTabs from '../Components/FilterTabs';

const Football = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'local', 'international', 'rwanda'

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Simulate API fetch with football-specific data
        const mockArticles = [
          {
            id: 1,
            title: 'APR FC Secures League Title',
            excerpt: 'APR FC clinches the national championship with three games to spare.',
            content: 'Detailed match report and celebration highlights...',
            date: '15 June 2025',
            category: 'rwanda',
            image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            author: 'Jean de Dieu Nsengimana'
          },
          {
            id: 2,
            title: 'CHAN 2025 Qualifiers Begin',
            excerpt: 'Rwanda Amavubi prepares for crucial qualifiers against Tanzania.',
            date: '12 June 2025',
            category: 'local',
            image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            author: 'Marie Claire Uwase'
          },
          {
            id: 3,
            title: 'UEFA Champions League Final',
            excerpt: 'Manchester City defeats Real Madrid in thrilling final match.',
            date: '10 June 2025',
            category: 'international',
            image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            author: 'Thomas Johnson'
          },
          {
            id: 4,
            title: 'Rayon Sports New Signing',
            excerpt: 'Burundian striker joins the Blues ahead of continental competition.',
            date: '8 June 2025',
            category: 'rwanda',
            image: 'https://images.unsplash.com/photo-1579952363872-3e036b5d1c8d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            author: 'Eric Murangwa'
          },
          {
            id: 5,
            title: 'Africa Cup of Nations Draw',
            excerpt: 'Group stage matchups revealed for 2025 tournament in Morocco.',
            date: '5 June 2025',
            category: 'local',
            image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            author: 'Aisha Niyigena'
          },
          {
            id: 6,
            title: 'World Cup 2026 Qualifiers',
            excerpt: 'African teams begin journey to North American tournament.',
            date: '1 June 2025',
            category: 'international',
            image: 'https://images.unsplash.com/photo-1598880940080-ff9a29891fa8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            author: 'David Smith'
          },
           {
            id: 7,
            title: 'Africa Cup of Nations Draw',
            excerpt: 'Group stage matchups revealed for 2025 tournament in Morocco.',
            date: '5 June 2025',
            category: 'local',
            image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            author: 'Aisha Niyigena'
          },
        ];
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setArticles(mockArticles);
      } catch (err) {
        setError('Failed to load football news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const filteredArticles = filter === 'all' 
    ? articles 
    : articles.filter(article => article.category === filter);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <section className="py-12 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-blue-800 mb-2">Football News</h1>
          <p className="text-lg text-gray-600">Latest updates from Rwanda and world football</p>
        </header>

        {/* Filter Tabs */}
        <FilterTabs 
          filters={[
            { id: 'all', label: 'All News' },
            { id: 'rwanda', label: 'Rwanda Premier League' },
            { id: 'local', label: 'Regional News' },
            { id: 'international', label: 'World Football' }
          ]}
          activeFilter={filter}
          onFilterChange={setFilter}
        />

        {/* Featured Article (for 'all' filter) */}
        {filter === 'all' && articles.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b pb-2">Featured Story</h2>
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <img 
                    src={articles[0].image} 
                    alt={articles[0].title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8 md:w-1/2">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-blue-600">
                      {articles[0].category === 'rwanda' ? 'Rwanda Football' : 
                       articles[0].category === 'local' ? 'East Africa' : 'World Football'}
                    </span>
                    <time className="text-sm text-gray-500">{articles[0].date}</time>
                  </div>
                  <h2 className="text-2xl font-bold mb-4">{articles[0].title}</h2>
                  <p className="text-gray-700 mb-6">{articles[0].excerpt}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">By {articles[0].author}</span>
                    <a 
                      href={`/football/${articles[0].id}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Read Full Story
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.length > 0 ? (
            filteredArticles
              .filter(article => filter !== 'all' || article.id !== 1) // Exclude featured from grid when showing all
              .map((article) => (
                <NewsCard 
                  key={article.id}
                  {...article}
                  link={`/football/${article.id}`}
                />
              ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-xl text-gray-600">No articles found in this category</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Football;