import React from 'react';

const Article = () => {
  const articles = [
    {
        id: 1,
      title: "APR FC won the final match",
      excerpt: "The football team APR FC won...",
      fullContent: "APR FC yarushanwe na Rayon Sports mu mukino wa nyuma wa shampiyona y'umupira w'amaguru. APR FC yatsinze Rayon Sports ku mpande zitandatu (6-5) nyuma y'ibihe by'impuzandengo ku gipimo cy'amaguru. Ikipe ya APR FC yaje gutwara igikombe cya shampiyona y'u Rwanda mu mwaka wa 2024.",
      category: "Football",
      date: "27 May 2025",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e",
      isFeatured: true
    },
      {
      id: 2,
      title: "REG Are The Champions",
      excerpt: "The REG team won the basketball championship...",
      fullContent: "Ikipe ya REG yegukanye igikombe cya basketball mu Rwanda mu mwaka wa 2024. REG yatsinze Patriots ku mpande 78-72 mu mukino wa nyuma wabereye i Kigali. Uyu mukino wari urushanwa rwa nyuma rwa shampiyona y'igihugu ya basketball.",
      category: "Basketball",
      date: "25 June 2025",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc",
      isFeatured: true
    },
      {
      id: 3,
      title: "How to support young talents?",
      excerpt: "In Rwanda, there continues to be a noticeable presence of children with football talent...",
      fullContent: "In Rwanda, many talented young footballers are emerging, but they face limited opportunities to join top-tier academies where they can develop their skills.",
      category: "Talents",
      date: "20 June 2025",
      image: "https://images.unsplash.com/photo-1592656094267-764a60363a2c",
      isFeatured: true
    },
  ];

  return (
    <section className="py-12 bg-gray-50" aria-labelledby="recent-news-heading">
      <div className="container mx-auto px-4">
        <h2 id="recent-news-heading" className="text-3xl font-bold text-center mb-8 text-blue-900">
         Current Sports Updates
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
                  alt={article.title ? `${article.title}` : "Image"}
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
                  Read More
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
            Related News
          </button>
        </div>
      </div>
    </section>
  );
};

export default Article;