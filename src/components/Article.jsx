import React from 'react';

const Article = () => {
  const articles = [
    {
      id: 1,
      title: 'Football',
      excerpt: 'Ikipe Ikunzwe cyane mu Rwanda ikomeje kwiyubaka nyuma yuko ibuze igikombe cya shampiyona season ishize ikibwe na mucyeba APR fc.',
      category: 'Umupira wamaguru',
      date: '27 Kamena 2025',
      image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 2,
      excerpt: 'Nyuma yigihe gito ikubitiwe muri Bal ikomejwe no kugayikira mumikino yimbere mugihugu.',
      category: 'Basketball',
      date: '25 Kamena 2025',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: 3,
      title: 'Talents',
      excerpt: 'Mumurejye wa Gahanga hagaragaye impano zidasazwe mu ikipe ya Nunga fc.',
      category: 'Impano',
      date: '10 Kamena 2025',
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    }
  ];

  return (
    <section className="py-12 bg-gray-50" aria-labelledby="recent-news-heading">
      <div className="container mx-auto px-4">
        <h2 id="recent-news-heading" className="text-3xl font-bold text-center mb-8 text-blue-900">
          Amakuru Agezweho Muri Siporo
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <article 
              key={article.id} 
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              aria-labelledby={`article-${article.id}-title`}
            >
              {/* Article Image */}
              <div className="h-48 overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title ? `Ifoto y'ingingo: ${article.title}` : "Ifoto y'ingingo"}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              
              {/* Article Content */}
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-md mr-2">
                    {article.category}
                  </span>
                  <span className="text-gray-500 text-sm">{article.date}</span>
                </div>
                
                <h3 id={`article-${article.id}-title`} className="text-xl font-semibold mb-2 text-gray-800">
                  {article.title || 'Ingingo idasobanuwe'}
                </h3>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                
                <button 
                  className="text-blue-600 hover:text-blue-600 font-medium transition-colors flex items-center"
                  aria-label={`Soma byinshi kuri ${article.title || 'iyi ngingo'}`}
                >
                  Soma byose
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
</svg>
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors">
            Reba Izindi Nkuru
          </button>
        </div>
      </div>
    </section>
  );
};

export default Article;