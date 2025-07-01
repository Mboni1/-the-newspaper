import React, { useState, useEffect } from 'react';
import NewsCard from '../Components/NewsCard';
import LoadingSpinner from '../Components/LoadingSpinner';
import ErrorMessage from '../Components/ErrorMessage';
import FilterTabs from '../Components/FilterTabs';

const Basketball = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'local', 'international'
  const [featuredArticle, setFeaturedArticle] = useState(null);

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
            author: 'xxxxxxxxxx',
          },
          {
            id: 2,
            title: 'BAL Tournament Recap',
            excerpt: 'A thrilling match between Petro de Luanda and US Monastir left fans speechless.',
            content: 'Complete breakdown of the BAL tournament game with highlights...',
            date: '25 June 2025',
            category: 'international',
            image: 'https://images.unsplash.com/photo-1581579185169-bcf68ff97a7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            author: 'xxxxxxxxxx',
          },
          {
            id: 3,
            title: 'Local League Rising Talents',
            excerpt: 'Young talents shine in the Kigali City basketball league, showcasing incredible skill.',
            content: 'Profiles of the most promising young players in the local league...',
            date: '22 June 2025',
            category: 'local',
            image: 'https://images.unsplash.com/photo-1551754651-0fdb3f429fd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            author: 'xxxxxxxxxx',
          },
          {
            id: 4,
            title: 'NBA Africa Game 2025 Preview',
            excerpt: 'African stars prepare to face Team World in the annual showcase event.',
            date: '20 June 2025',
            category: 'international',
            image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            author: 'xxxxxxxxxx',
          },
          {
            id: 4,
            title: 'NBA Africa Game 2025 Preview',
            excerpt: 'African stars prepare to face Team World in the annual showcase event.',
            date: '20 June 2025',
            category: 'international',
            image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            author: 'xxxxxxxxxx',
          },
          {
            id: 4,
            title: 'NBA Africa Game 2025 Preview',
            excerpt: 'African stars prepare to face Team World in the annual showcase event.',
            date: '20 June 2025',
            category: 'international',
            image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
            author: 'xxxxxxxxxx',
          }
        ];
        
       await new Promise(resolve => setTimeout(resolve, 800));
        setArticles(mockArticles);
        setFeaturedArticle(mockArticles[0]);
      } catch (err) {
        setError('Failed to load football news. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleArticleClick = (article) => {
    setFeaturedArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredArticles = filter === 'all' 
    ? articles 
    : articles.filter(article => article.category === filter);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <section className="py-8 px-4 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Main Content Area - Featured Article */}
        <main className="lg:w-2/3">
          <header className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-blue-800 mb-2">Basketball News</h1>
            <p className="text-lg text-gray-600">Latest updates from Rwanda and world basketball</p>
          </header>

          <FilterTabs 
            filters={[
              { id: 'all', label: 'All News' },
              { id: 'rwanda', label: 'Rwanda League' },
              { id: 'local', label: 'Regional' },
              { id: 'international', label: 'World' }
            ]}
            activeFilter={filter}
            onFilterChange={setFilter}
          />

          {featuredArticle && (
            <article className="mt-8 bg-white rounded-xl shadow-lg overflow-hidden">
              <img 
                src={featuredArticle.image} 
                alt={featuredArticle.title}
                className="w-full h-64 md:h-80 object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm font-medium text-blue-600 uppercase">
                    {featuredArticle.category === 'rwanda' ? 'Rwanda Football' : 
                     featuredArticle.category === 'local' ? 'East Africa' : 'World Football'}
                  </span>
                  <time className="text-sm text-gray-500">{featuredArticle.date}</time>
                </div>
                <h2 className="text-2xl font-bold mb-4">{featuredArticle.title}</h2>
                <p className="text-gray-700 mb-6">{featuredArticle.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">By {featuredArticle.author}</span>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    Read Full Story
                  </button>
                </div>
              </div>
            </article>
          )}
        </main>

        {/* Aside - News Cards */}
        <aside className="lg:w-1/3 mt-8 lg:mt-20">
          <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">More News</h2>
          <div className="space-y-4">
            {filteredArticles
              .filter(article => article.id !== featuredArticle?.id)
              .map((article) => (
                <NewsCard 
                  key={article.id}
                  {...article}
                  onClick={() => handleArticleClick(article)}
                  compact={true}
                />
              ))}
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Basketball;