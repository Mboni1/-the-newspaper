import React, { useState, useEffect } from 'react';
import NewsCard from '../Components/NewsCard';
import LoadingSpinner from '../Components/LoadingSpinner';
import ErrorMessage from '../Components/ErrorMessage';

const Basketball = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'local', 'international'

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        // Simulate API fetch with your static data
        const mockArticles = [
          {
            id: 1,
            title: 'Rwanda Patriots Big Win',
            excerpt: 'The Patriots dominated the game last night, securing a crucial victory in the national league.',
            content: 'Detailed game analysis and player statistics from the Patriots victory...',
            date: '28 June 2025',
            category: 'local',
            image: 'https://images.unsplash.com/photo-1606761568499-6c87bdee0b56?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          },
          {
            id: 2,
            title: 'BAL Tournament Recap',
            excerpt: 'A thrilling match between Petro de Luanda and US Monastir left fans speechless.',
            content: 'Complete breakdown of the BAL tournament game with highlights...',
            date: '25 June 2025',
            category: 'international',
            image: 'https://images.unsplash.com/photo-1581579185169-bcf68ff97a7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          },
          {
            id: 3,
            title: 'Local League Rising Talents',
            excerpt: 'Young talents shine in the Kigali City basketball league, showcasing incredible skill.',
            content: 'Profiles of the most promising young players in the local league...',
            date: '22 June 2025',
            category: 'local',
            image: 'https://images.unsplash.com/photo-1551754651-0fdb3f429fd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          },
          {
            id: 4,
            title: 'NBA Africa Game 2025 Preview',
            excerpt: 'African stars prepare to face Team World in the annual showcase event.',
            date: '20 June 2025',
            category: 'international',
            image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          },
          {
            id: 4,
            title: 'NBA Africa Game 2025 Preview',
            excerpt: 'African stars prepare to face Team World in the annual showcase event.',
            date: '20 June 2025',
            category: 'international',
            image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          },
          {
            id: 4,
            title: 'NBA Africa Game 2025 Preview',
            excerpt: 'African stars prepare to face Team World in the annual showcase event.',
            date: '20 June 2025',
            category: 'international',
            image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          }
        ];
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800));
        setArticles(mockArticles);
      } catch (err) {
        setError('Failed to load articles. Please try again later.');
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
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-blue-800 text-center">Basketball News</h1>
        
        {/* Filter Controls */}
        <div className="flex justify-center mb-8 space-x-4">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-full ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'}`}
          >
            All News
          </button>
          <button 
            onClick={() => setFilter('local')}
            className={`px-4 py-2 rounded-full ${filter === 'local' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'}`}
          >
            Local
          </button>
          <button 
            onClick={() => setFilter('international')}
            className={`px-4 py-2 rounded-full ${filter === 'international' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'}`}
          >
            International
          </button>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <NewsCard 
                key={article.id} 
                {...article}
                link={`/basketball/${article.id}`}
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

export default Basketball;