import { useState, useEffect } from 'react';
import { Menu, X, Search } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Football', path: '/football' },
    { name: 'Basketball', path: '/basketball' },
    { name: 'Talents', path: '/talents' },
    { name: 'Contact ', path: '/contact' }
  ];

  // Close mobile menu when screen resizes to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(false);
        setSearchOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    alert(`Searching for: ${searchQuery}`);
    setSearchQuery('');
    setSearchOpen(false);
    setIsOpen(false); // Close mobile menu after search
  };

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isOpen && !e.target.closest('.mobile-menu-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <nav className={`sticky top-0 z-50 dark:bg-blue-900 shadow-lg transition-all duration-300 ${
      scrolled ? 'py-2 bg-blue-800' : 'py-4 bg-blue-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <img
              className="h-30 w-auto" // Adjusted for better mobile proportion
              src="src/assets/logo.png" 
              alt="The Halftime Logo"
            />
            <span className="ml-2 text-white font-bold text-xl">The Halftime</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center">
            <div className="ml-10 flex items-center space-x-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.path}
                  className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium transition duration-300 hover:scale-105"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Search Button (Desktop) */}
            <div className="ml-4 flex items-center">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="px-3 py-1 rounded-l-md text-gray-800 focus:outline-none w-40 sm:w-auto"
                    autoFocus
                  />
                  <button 
                    type="submit"
                    className="bg-white text-blue-800 px-3 py-1 rounded-r-md hover:bg-gray-100 transition"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </form>
              ) : (
                <button 
                  onClick={() => setSearchOpen(true)}
                  className="text-white p-2 rounded-full hover:bg-blue-700 transition"
                >
                  <Search className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile menu button and search */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Search Button (Mobile) */}
            <button 
              onClick={() => {
                setSearchOpen(!searchOpen);
                if (isOpen) setIsOpen(false); // Close menu if open
              }}
              className="text-white p-2 rounded-full hover:bg-blue-700 transition"
              aria-label={searchOpen ? "Close search" : "Open search"}
            >
              <Search className="h-5 w-5" />
            </button>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => {
                setIsOpen(!isOpen);
                if (searchOpen) setSearchOpen(false); // Close search if open
              }}
              className="inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none transition duration-300"
              aria-expanded={isOpen}
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Input */}
        {searchOpen && (
          <div className="md:hidden mt-2 mb-4 transition-all duration-300">
            <form onSubmit={handleSearch} className="flex">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="flex-grow px-3 py-2 rounded-l-md text-gray-800 focus:outline-none"
                autoFocus
              />
              <button 
                type="submit"
                className="bg-white text-blue-800 px-3 py-2 rounded-r-md hover:bg-gray-100 transition"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        <div className={`mobile-menu-container md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-800">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.path}
                className="text-white hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium transition duration-300"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;