import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Home, Film, Heart, User, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLocation } from 'react-router-dom';

const TopBar = ({ user }) => {
  const { scrollY } = useScroll();
  const { currentUser, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
  };

  const backgroundColor = useTransform(
    scrollY,
    [0, 20],
    isHomePage ? ['rgba(31, 41, 55, 0)', 'rgba(31, 41, 55, 0.9)'] : ['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.0)']
  );

  const textColor = useTransform(
    scrollY,
    [0, 20],
    isHomePage ? ['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.8)'] : ['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0.0)']
  );

  useEffect(() => {
    // Detect if the screen is mobile based on window size
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call on mount to set initial state

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{ backgroundColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <motion.h1 
            className="text-2xl font-bold"
            style={{ color: textColor }}
            whileHover={{ scale: 1.5 }} 
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/">MovieMaster</Link>
          </motion.h1>

          {isMobile ? (
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMenu(!showMenu)}
                className="text-gray-700"
              >
                <Menu size={24} />
              </motion.button>

              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                  <Link
                        to="/"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowMenu(false)}
                      >
                        <Home size={18} className="mr-1 inline-block" />
                        Home
                      </Link>
                      <Link
                        to="/movies"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowMenu(false)}
                      >
                        <Film size={18} className="mr-1 inline-block" />
                        Movies
                      </Link>
                  {currentUser ? (
                    <>
                      <Link
                        to="/favorites"
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-100"
                        onClick={() => setShowMenu(false)}
                      >
                        <Heart size={18} className="mr-1 inline-block" />
                        Favorites
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <User size={18} className="mr-1 inline-block" />
                        Logout
                      </motion.button>
                    </>
                  ) : (
                    <Link to="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <User size={18} className="mr-1 inline-block" /> Login
                    </Link>
                  )}
                </div>
              )}
            </div>
          ) : (
            <nav>
               <motion.ul className="flex space-x-6" style={{ color: textColor }}>
              <NavItem to="/" icon={<Home size={18} />} text="Home" />
              <NavItem to="/movies" icon={<Film size={18} />} text="Movies" />
              <NavItem to="/favorites" icon={<Heart size={18} />} text="Favorites" />
              {currentUser ? (
                <div className="relative ">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                      onClick={() => setShowDropdown(!showDropdown)}
                      className=" focus:outline-none"
                    >
                      <User size={18} className="mr-1 inline-block" />
                      Hello, {currentUser.displayName}
                  </motion.button>
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                      <Link 
                        to="/favorites" 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowDropdown(false)}
                      >
                        Favorites
                      </Link>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Logout
                      </motion.button>
                    </div>
                  )}
                </div>
              ) : (
                <Link to="/login" className="mx-2"><User size={18} className="mr-1 inline-block" />Login</Link>
              )}
            </motion.ul>
            </nav>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const NavItem = ({ to, icon, text }) => (
  <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
    <Link to={to} className="flex items-center">
      {icon}
      <span className="ml-1">{text}</span>
    </Link>
  </motion.li>
);
export default TopBar;
