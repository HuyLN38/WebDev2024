import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MovieCard from '../components/MovieCard';
import MovieDetails from '../components/MovieDetails';
import { fetchMovieData } from '../utils/api';
import { getCookie } from '../contexts/AuthContext';
import { getFavorites } from '../utils/auth';
import SearchBar from '../components/SearchBar';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [ratingRange, setRatingRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState({});
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const userId = getCookie('userId');
  

  const ratingRanges = [
    { value: 'all', label: 'All Ratings 🎬' },
    { value: '0-3', label: 'Meh 😕 (0-3)' },
    { value: '3-6', label: 'Okay 🙂 (3-6)' },
    { value: '6-8', label: 'Pretty Good 😊 (6-8)' },
    { value: '8-10', label: 'Amazing! 🤩 (8-10)' }
  ];

  const fetchGenres = async () => {
    const genresData = await fetchMovieData('https://api.themoviedb.org/3/genre/movie/list?language=en');
    if (genresData && genresData.genres) {
      setGenres(genresData.genres);
    }
  };

  const handleSearch = async (query) => {
    setIsSearching(true);
    setIsLoading(true);
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`;
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiODRhMDg2MWQzYjE0ZDliZWY2MWZlM2E1ZmVhYTNiZiIsIm5iZiI6MTcyOTMwMzQyMy45ODQzMzcsInN1YiI6IjY2ZmU2ZWM0Zjg3OGFkZmVkMDg0ZGUxMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.ZKYk6aqobNrqaX3cAP8u3P_5y2xoqkt9nofnBzPW2_s'
      }
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      setSearchResults(data.results);
      setTotalPages(data.total_pages);
      setCurrentPage(1);
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearch = () => {
    setIsSearching(false);
    setSearchResults([]);
    fetchMovies();
  };

  const fetchMovies = async (page = 1, loadMore = false) => {
    setIsLoading(true);
    const baseUrl = 'https://api.themoviedb.org/3/discover/movie?';
    const params = new URLSearchParams({
      include_adult: 'false',
      include_video: 'false',
      language: 'en-US',
      page: page.toString(),
      sort_by: 'popularity.desc',
    });

    if (selectedGenres.length > 0) {
      params.append('with_genres', selectedGenres.join(','));
    }

    if (ratingRange !== 'all') {
      const [min, max] = ratingRange.split('-');
      params.append('vote_average.gte', min);
      params.append('vote_average.lte', max);
    }

    const url = baseUrl + params.toString();
    
    try {
      const data = await fetchMovieData(url);
      if (data && data.results) {
        if (loadMore) {
          setMovies(prevMovies => [...prevMovies, ...data.results]);
        } else {
          setMovies(data.results);
        }
        setTotalPages(data.total_pages);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenreToggle = (genreId) => {
    setSelectedGenres(prev => 
      prev.includes(genreId) 
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  const handleRatingChange = (range) => {
    setRatingRange(range);
  };

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      fetchMovies(currentPage + 1, true);
    }
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchMovies(1);
  };

  useEffect(() => {
    fetchGenres();
    fetchMovies();
    if (userId) {
      fetchFavorites();
    }
  }, [userId]);

  const fetchFavorites = async () => {
    try {
      const userFavorites = await getFavorites(userId);
      setFavorites(userId);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const handleFavoriteToggle = (movieId) => {
    setFavorites(prev => ({
      ...prev,
      [movieId]: !prev[movieId]
    }));
  };

  return (
    <div className="flex flex-col md:flex-row pt-16">
      {/* Filter Top Bar for Small Screens */}
      
      <div className="md:hidden bg-gray-100 p-4 sticky top-16 z-10">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Filters</h2>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-blue-500 text-white px-3 py-1 rounded-full"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        {showFilters && (
          <div className="mt-4">
            <div className="mb-4">
            <SearchBar onSearch={handleSearch} />
              {isSearching && (
                <button
                  onClick={clearSearch}
                  className="w-full mt-2 bg-red-500 text-white py-2 rounded hover:bg-red-600"
                >
                  Clear Search
                </button>
              )}
              <h3 className="text-xl font-semibold mb-2">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {genres.map(genre => (
                  <button
                    key={genre.id}
                    onClick={() => handleGenreToggle(genre.id)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedGenres.includes(genre.id)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Rating Range</h3>
              <div className="space-y-2">
                {ratingRanges.map(range => (
                  <button
                    key={range.value}
                    onClick={() => handleRatingChange(range.value)}
                    className={`w-full text-left px-3 py-2 rounded ${
                      ratingRange === range.value
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-700'
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={applyFilters}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Apply Filters
            </button>
          </div>
        )}
      </div>

      {/* Sidebar for Medium and Larger Screens */}
      <div className="hidden md:block w-72 p-4 bg-gray-100 min-h-screen sticky top-16">
        <h2 className="text-2xl font-bold mb-4">Filters</h2>
        <SearchBar onSearch={handleSearch} />
        {isSearching && (
          <button
            onClick={clearSearch}
            className="w-full mt-2 bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            Clear Search
          </button>
        )}
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Genres</h3>
          <div className="flex flex-wrap gap-2">
            {genres.map(genre => (
              <button
                key={genre.id}
                onClick={() => handleGenreToggle(genre.id)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedGenres.includes(genre.id)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {genre.name}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Rating Range</h3>
          <div className="space-y-2">
            {ratingRanges.map(range => (
              <button
                key={range.value}
                onClick={() => handleRatingChange(range.value)}
                className={`w-full text-left px-3 py-2 rounded ${
                  ratingRange === range.value
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-gray-700'
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={applyFilters}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Apply Filters
        </button>
      </div>

      {/* Movie List */}
      <div className="flex-1 p-4">
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {(isSearching ? searchResults : movies).map(movie => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={setSelectedMovie}
                isFavorite={favorites[movie.id] || false}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </AnimatePresence>
        </motion.div>
        {currentPage < totalPages && (
          <div className="mt-8 text-center">
            <button
              onClick={handleLoadMore}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>

      {/* Movie Details Popup */}
      <AnimatePresence>
        {selectedMovie && (
          <MovieDetails
            movie={selectedMovie}
            onClose={() => setSelectedMovie(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Movies;