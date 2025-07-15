import React, { useEffect, useState } from 'react';
import {
  getArticles,
  getArticle,
  createArticle as apiCreateArticle,
  updateArticle as apiUpdateArticle,
  deleteArticle as apiDeleteArticle,
} from '../Api/ArticleApi';

const Article = () => {
  const [articles, setArticles] = useState([]);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [featuredArticle, setFeaturedArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    headline: '',
    content: '',
    description: '',
    id: null
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const res = await getArticles();
      setArticles(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch articles:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchArticleById = async (id) => {
    try {
      const res = await getArticle(id);
      setCurrentArticle(res.data.data);
      setFormData({
        headline: res.data.data.headline,
        content: res.data.data.content,
        description: res.data.data.description || '',
        id: res.data.data.id
      });
    } catch (err) {
      console.error('Failed to fetch article:', err);
    }
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 const handleCreateArticle = async () => {
  try {
    console.log('Sending data:', formData);

    const res = await apiCreateArticle(formData);
    console.log('Response:', res);

    // ✅ Reba structure isanzwe: niba article isubizwa nka res.data
    const newArticle = res.data?.data || res.data;

    setArticles([...articles, newArticle]);

    // 🧹 Siga form yiteguye indi nkuru
    setFormData({ headline: '', content: '', description: '', id: null });

  } catch (err) {
    console.error('Failed to create article:', err.response?.data || err.message);
  }
};


  const handleUpdateArticle = async () => {
    if (!formData.id) return;
    try {
      const res = await apiUpdateArticle(formData.id, formData);
      fetchArticles();
      setCurrentArticle(null);
      setFormData({ headline: '', content: '', description: '', id: null });
    } catch (err) {
      console.error('Failed to update article:', err);
    }
  };

  const handleDeleteArticle = async (id) => {
    try {
      await apiDeleteArticle(id);
      fetchArticles();
    } catch (err) {
      console.error('Failed to delete article:', err);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArticleClick = (article) => {
    setFeaturedArticle(article);
    //window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <p className="text-center text-gray-600">Loading articles...</p>;
  if (!loading && articles.length === 0) return <p className="text-center text-gray-500 mt-8">No articles found.</p>;

  return (
    <section className="py-12 bg-gray-50" aria-labelledby="recent-news-heading">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-blue-900">
          Current Sports Updates
        </h2>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Featured Article */}
          <main className="lg:w-2/3">
            {featuredArticle && (
              <article className="bg-white rounded-lg shadow-xl overflow-hidden mb-8">
                <div className="h-64 bg-gray-200 flex items-center justify-center text-gray-500">
                  <span>Featured Image</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3 justify-between text-sm text-gray-500">
                    <span className="inline-block bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-md">
                      {featuredArticle.category?.name || 'General'}
                    </span>
                    <span>{new Date(featuredArticle.createdAt).toLocaleDateString()}</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    {featuredArticle.headline}
                  </h2>
                  <p className="text-gray-600 mb-6">{featuredArticle.content}</p>
                  <p className="text-sm text-gray-400 italic mb-4">
                    By {featuredArticle.author?.name || 'Unknown Author'}
                  </p>
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    Read Full Story
                  </button>
                </div>
              </article>
            )}
          </main>

          {/* Sidebar with Other Articles */}
          <aside className="lg:w-1/3">
            <h3 className="text-xl font-semibold mb-6 text-gray-800 border-b pb-2">
              More Updates
            </h3>
            <div className="space-y-6">
              {articles
                .filter(article => featuredArticle ? article.id !== featuredArticle.id : true)
                .map((article) => (
                  <article 
                    key={article.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                    onClick={() => handleArticleClick(article)}
                  >
                    <div className="h-32 bg-gray-200 flex items-center justify-center text-gray-500">
                      <span>Article Image</span>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center mb-2 justify-between text-xs text-gray-500">
                        <span className="inline-block bg-blue-100 text-blue-600 px-2 py-1 rounded-md">
                          {article.category?.name || 'General'}
                        </span>
                        <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-800 line-clamp-2">
                        {article.headline}
                      </h3>
                      <p className="text-sm text-gray-400 italic">
                        By {article.author?.name || 'Unknown Author'}
                      </p>
                    </div>
                  </article>
                ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default Article;