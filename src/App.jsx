import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Header from './Components/Header';
import Home from './Pages/Home';
import Footer from './Components/Footer';
import Football from './Pages/Football';
import Basketball from './Pages/Basketball';
import Talents from './Pages/Talents';
import Contact from './Pages/Contact';
import LocalSearch from './Components/LocalSearch';
import Article from './Components/Article';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleHeaderSearch = (query) => {
    setSearchTerm(query);
    setShowSearchResults(true);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header onSearch={handleHeaderSearch} />
        
        <main className="flex-grow">
          {showSearchResults ? (
            <LocalSearch articles={Article.articles} initialQuery={searchTerm} />
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/football" element={<Football />} />
              <Route path="/basketball" element={<Basketball />} />
              <Route path="/talents" element={<Talents />} />
              <Route path="/contact" element={<Contact />} />
              {/* Add any additional routes here */}
            </Routes>
          )}
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;
