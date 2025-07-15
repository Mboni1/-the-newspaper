import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout, checkAuth } = useAuth();
  const navigate = useNavigate();
  
  // Sample initial data with media
  const initialArticles = [
    { 
      id: 1, 
      title: 'Breaking News', 
      description: 'The latest version includes new features',
      author: 'claude', 
      category: 'football',
      status: 'Published',
      mediaUrl: 'https://example.com/images/news1.jpg',
      mediaType: 'image',
      createdAt: '2025-07-15'
    },
    { 
      id: 2, 
      title: 'Sports Championship Results', 
      description: 'The tournament concluded with exciting matches',
      author: 'stanna', 
      category: 'football',
      status: 'Draft',
      mediaUrl: 'https://example.com/videos/sports.mp4',
      mediaType: 'video',
      createdAt: '2025-07-10'
    },
    {
      id: 3, 
      title: 'Rayon sports', 
      description: 'Local team wins regional championship',
      author: 'eric', 
      category: 'football',
      status: 'Published',
      mediaUrl: 'https://example.com/images/news1.jpg',
      mediaType: 'image',
      createdAt: '2025-07-10'
    },
    { 
      id: 4, 
      title: 'BAL', 
      description: 'Basketball Africa League announces new season',
      author: 'jesus', 
      category: 'basketball',
      status: 'Archived',
      mediaUrl: 'https://example.com/videos/sports.mp4',
      mediaType: 'video',
      createdAt: '2025-07-10'
    },
  ];

  const [articles, setArticles] = useState(initialArticles);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    author: '',
    category: 'football',
    status: 'Draft',
    mediaUrl: '',
    mediaType: 'image',
    mediaFile: null,
    createdAt: new Date().toISOString().split('T')[0]
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

  const categories = ['football', 'basketball', 'talents'];
  const statusOptions = ['Draft', 'Published', 'Archived'];

  useEffect(() => {
    checkAuth();
    if (!user) {
      navigate('/login');
    }
  }, [user, checkAuth, navigate]);

  const filteredArticles = articles.filter(article => {
    const searchLower = searchTerm.toLowerCase();
    const articleDate = article.createdAt ? new Date(article.createdAt).toLocaleDateString() : '';
    
    return (
      article.title.toLowerCase().includes(searchLower) ||
      article.author.toLowerCase().includes(searchLower) ||
      article.description.toLowerCase().includes(searchLower) ||
      article.category.toLowerCase().includes(searchLower) ||
      articleDate.includes(searchTerm) ||
      article.status.toLowerCase().includes(searchLower)
    );
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const mediaType = file.type.startsWith('image') ? 'image' : 'video';
        setFormData({
          ...formData,
          mediaUrl: reader.result,
          mediaType,
          mediaFile: file
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedArticle = {
      ...formData,
      updatedAt: new Date().toISOString().split('T')[0],
      createdAt: formData.id ? formData.createdAt : new Date().toISOString().split('T')[0]
    };

    if (formData.id) {
      setArticles(articles.map(article => 
        article.id === formData.id ? updatedArticle : article
      ));
    } else {
      setArticles([...articles, { ...updatedArticle, id: Date.now() }]);
    }
    
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (article) => {
    setFormData(article);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      setArticles(articles.filter(article => article.id !== id));
    }
  };

  const handleRead = (article) => {
    setSelectedArticle(article);
  };

  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      description: '',
      author: '',
      category: 'football',
      status: 'Draft',
      mediaUrl: '',
      mediaType: 'image',
      mediaFile: null,
      createdAt: new Date().toISOString().split('T')[0]
    });
  };

  if (!user) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">News Article Dashboard</h1>
          
          {/* Search and Add */}
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full p-2 pl-8 border rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute left-2 top-3 text-gray-400">🔍</span>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add Article
            </button>
          </div>
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Media</th>
                <th className="px-4 py-3 text-left">Title</th>
                <th className="px-4 py-3 text-left">Description</th>
                <th className="px-4 py-3 text-left">Author</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredArticles.map(article => (
                <tr key={article.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {article.mediaUrl && (
                      article.mediaType === 'image' ? (
                        <img 
                          src={article.mediaUrl} 
                          alt="Article media" 
                          className="h-12 w-16 object-cover rounded"
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = 'https://via.placeholder.com/64';
                          }}
                        />
                      ) : (
                        <div className="h-12 w-16 bg-gray-200 flex items-center justify-center rounded">
                          <span className="text-xs">Video</span>
                        </div>
                      )
                    )}
                  </td>
                  <td className="px-4 py-3">{article.title}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{article.description}</td>
                  <td className="px-4 py-3">{article.author}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs 
                      ${article.category === 'football' ? 'bg-green-100 text-green-800' : 
                        article.category === 'basketball' ? 'bg-orange-100 text-orange-800' : 
                        'bg-blue-100 text-blue-800'}`}>
                      {article.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs 
                      ${article.status === 'Published' ? 'bg-green-100 text-green-800' : 
                        article.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'}`}>
                      {article.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{article.createdAt}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <button 
                      onClick={() => handleRead(article)}
                      className="text-green-600 hover:underline"
                    >
                      Read
                    </button>
                    <button 
                      onClick={() => handleEdit(article)}
                      className="text-blue-600 hover:underline"
                    >
                      Update
                    </button>
                    <button 
                      onClick={() => handleDelete(article.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Article Form Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="p-6">
                <h2 className="text-xl font-bold mb-4">
                  {formData.id ? 'Edit Article' : 'Add New Article'}
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block mb-1">Title*</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Description*</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded min-h-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="6"
                        required
                      />
                    </div>
                    <div>
                      <label className="block mb-1">Author*</label>
                      <input
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block mb-1">Category</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block mb-1">Status</label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block mb-1">Media Type</label>
                      <select
                        name="mediaType"
                        value={formData.mediaType}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                        <option value="">None</option>
                      </select>
                    </div>
                    {formData.mediaType && (
                      <div>
                        <label className="block mb-1">
                          {formData.mediaType === 'image' ? 'Image' : 'Video'} Upload
                        </label>
                        <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
                          {formData.mediaUrl ? (
                            formData.mediaType === 'image' ? (
                              <div className="relative">
                                <img 
                                  src={formData.mediaUrl} 
                                  alt="Preview" 
                                  className="max-h-40 mx-auto"
                                  onError={(e) => {
                                    e.target.onerror = null; 
                                    e.target.src = 'https://via.placeholder.com/300';
                                  }}
                                />
                                <button
                                  type="button"
                                  onClick={() => setFormData({...formData, mediaUrl: '', mediaFile: null})}
                                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                >
                                  ×
                                </button>
                              </div>
                            ) : (
                              <div className="bg-gray-100 p-4 rounded">
                                <p>Video selected</p>
                                <button
                                  type="button"
                                  onClick={() => setFormData({...formData, mediaUrl: '', mediaFile: null})}
                                  className="mt-2 px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                                >
                                  Remove Video
                                </button>
                              </div>
                            )
                          ) : (
                            <div>
                              <label className="cursor-pointer text-blue-600 hover:text-blue-800">
                                Choose {formData.mediaType === 'image' ? 'Image' : 'Video'}
                                <input
                                  type="file"
                                  accept={formData.mediaType === 'image' ? 'image/*' : 'video/*'}
                                  onChange={handleFileChange}
                                  className="hidden"
                                />
                              </label>
                              <p className="text-xs text-gray-500 mt-2">
                                {formData.mediaType === 'image' ? 
                                  'JPG, PNG up to 5MB' : 
                                  'MP4, MOV up to 50MB'}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    <div>
                      <label className="block mb-1">Date</label>
                      <input
                        type="date"
                        name="createdAt"
                        value={formData.createdAt}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      {formData.id ? 'Update' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Read Article Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold">{selectedArticle.title}</h2>
                  <button 
                    onClick={() => setSelectedArticle(null)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <div className="flex items-center mb-4">
                  <span className="text-sm text-gray-600 mr-3">By {selectedArticle.author}</span>
                  <span className={`px-2 py-1 rounded-full text-xs 
                    ${selectedArticle.category === 'football' ? 'bg-green-100 text-green-800' : 
                      selectedArticle.category === 'basketball' ? 'bg-orange-100 text-orange-800' : 
                      'bg-blue-100 text-blue-800'}`}>
                    {selectedArticle.category}
                  </span>
                </div>
                
                {selectedArticle.mediaUrl && (
                  <div className="mb-4">
                    {selectedArticle.mediaType === 'image' ? (
                      <img 
                        src={selectedArticle.mediaUrl} 
                        alt="Article media" 
                        className="w-full h-64 object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = 'https://via.placeholder.com/800x400';
                        }}
                      />
                    ) : (
                      <div className="bg-gray-200 h-64 flex items-center justify-center rounded">
                        <video controls className="w-full h-full">
                          <source src={selectedArticle.mediaUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="prose mb-6">
                  <p className="text-gray-700 whitespace-pre-line">{selectedArticle.description}</p>
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                  <span>Published: {selectedArticle.createdAt}</span>
                  <span className={`px-2 py-1 rounded-full text-xs 
                    ${selectedArticle.status === 'Published' ? 'bg-green-100 text-green-800' : 
                      selectedArticle.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {selectedArticle.status}
                  </span>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="px-4 py-2 border rounded-lg hover:bg-gray-100"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      setSelectedArticle(null);
                      handleEdit(selectedArticle);
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Edit Article
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;