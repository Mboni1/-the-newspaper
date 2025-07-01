import { useState, useEffect } from 'react';

const LocalSearch = ({ articles = [], initialQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const handleSearch = (e) => {
    try {
      e?.preventDefault();
      
      const query = searchQuery.trim().toLowerCase();

      if (!query) {
        setMessage('Please enter a search term');
        setResults([]);
        return;
      }

      if (!Array.isArray(articles)) {
        throw new Error('Invalid articles data');
      }

      const filtered = articles.filter(item => {
        try {
          return (
            item.title?.toLowerCase().includes(query) || 
            item.excerpt?.toLowerCase().includes(query) ||
            item.content?.toLowerCase().includes(query)
          );
        } catch (err) {
          console.error('Error filtering article:', item, err);
          return false;
        }
      });

      setResults(filtered);
      setMessage(filtered.length > 0 
        ? `${filtered.length} results found` 
        : 'No results found');
      setError(null);
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Search error:', err);
    }
  };

  // Automatically search if initialQuery is provided
  useEffect(() => {
    if (initialQuery) {
      handleSearch();
    }
  }, [initialQuery]);

  if (error) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-4 bg-red-50 rounded shadow">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <form onSubmit={handleSearch} className="flex items-center gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search news..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-md"
          aria-label="Search input"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          aria-label="Search"
        >
          Search
        </button>
      </form>

      {message && <p className="mt-4 text-gray-700">{message}</p>}

      {results.length > 0 && (
        <ul className="mt-4 space-y-2">
          {results.map((item) => (
            <li key={item.id} className="p-3 bg-gray-100 rounded hover:bg-gray-200 transition">
              <a 
                href={`/article/${item.id}`} 
                className="text-blue-700 font-semibold"
                aria-label={`Read article: ${item.title}`}
              >
                {item.title}
              </a>
              <p className="text-sm text-gray-600 mt-1">{item.excerpt}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocalSearch;