import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Header from './Components/Header';
import Home from './Pages/Home';
import Footer from './Components/Footer';
import Football from './Pages/Football';
import Basketball from './Pages/Basketball';
import Talents from './Pages/Talents';
import Contact from './Pages/Contact';
import LocalSearch from './Components/LocalSearch';
import Dashboard from './Pages/Dashboard';
import Login from './Login';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from './AuthContext';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const handleHeaderSearch = (query) => {
    setSearchTerm(query);
    setShowSearchResults(true);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header onSearch={handleHeaderSearch} />

          <main className="flex-grow">
            {showSearchResults ? (
              <LocalSearch initialQuery={searchTerm} />
            ) : (
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/football" element={<Football />} />
                <Route path="/basketball" element={<Basketball />} />
                <Route path="/talents" element={<Talents />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  } 
                />
              </Routes>
            )}
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

