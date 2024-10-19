// import React, { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
// import DOMPurify from 'dompurify';
// import { Search, Star, ChevronDown, ChevronUp, Home, Film, Heart, User, X } from 'lucide-react';

// const genreMap = {
//   28: "Action",
//   12: "Adventure",
//   16: "Animation",
//   35: "Comedy",
//   80: "Crime",
//   99: "Documentary",
//   18: "Drama",
//   10751: "Family",
//   14: "Fantasy",
//   36: "History",
//   27: "Horror",
//   10402: "Music",
//   9648: "Mystery",
//   10749: "Romance",
//   878: "Science Fiction",
//   10770: "TV Movie",
//   53: "Thriller",
//   10752: "War",
//   37: "Western"
// };


// const TopBar = () => {
//   const { scrollY } = useScroll();
  
//   const backgroundColor = useTransform(
//     scrollY,
//     [0, 50],
//     ['rgba(31, 41, 55, 0)', 'rgba(31, 41, 55, 0.9)']
//   );

//   const textColor = useTransform(
//     scrollY,
//     [0, 50],
//     ['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.8)']
//   );

//   return (
//     <motion.div
//       className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
//       style={{ backgroundColor }}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
//         <div className="flex justify-between items-center">
//           <motion.h1 
//             className="text-2xl font-bold"
//             style={{ color: textColor }}
//           >
//             MovieMaster
//           </motion.h1>
//           <nav>
//             <motion.ul className="flex space-x-6" style={{ color: textColor }}>
//               {['Home', 'Movies', 'Favorites', 'Profile'].map((item, index) => (
//                 <motion.li key={item}
//                   whileHover={{ scale: 1.1 }}
//                   whileTap={{ scale: 0.95 }}
//                 >
//                   <button className="flex items-center">
//                     {index === 0 && <Home size={18} className="mr-1" />}
//                     {index === 1 && <Film size={18} className="mr-1" />}
//                     {index === 2 && <Heart size={18} className="mr-1" />}
//                     {index === 3 && <User size={18} className="mr-1" />}
//                     {item}
//                   </button>
//                 </motion.li>
//               ))}
//             </motion.ul>
//           </nav>
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// const FeaturedFilm = ({ movie, isPlayingTrailer, onWatchTrailer }) => {
//   const [trailerKey, setTrailerKey] = useState(null);
//   const iframeRef = useRef(null);

//   useEffect(() => {
//     const fetchTrailer = async () => {
//       if (isPlayingTrailer && movie) {
//         const url = `https://api.themoviedb.org/3/movie/${movie.id}/videos?language=en-US`;
//         const options = {
//           method: 'GET',
//           headers: {
//             accept: 'application/json',
//             Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiODRhMDg2MWQzYjE0ZDliZWY2MWZlM2E1ZmVhYTNiZiIsIm5iZiI6MTcyODAwNjEwNC4yNTg4MTMsInN1YiI6IjY2ZmU2ZWM0Zjg3OGFkZmVkMDg0ZGUxMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hnWcQfCI4JrFvtlpHw-GS3o0ASpBdKOJZnuNW7Vmxcc'
//           }
//         };

//         try {
//           const response = await fetch(url, options);
//           const data = await response.json();
//           const trailer = data.results.find(video => video.type === "Trailer");
//           if (trailer) {
//             setTrailerKey(trailer.key);
//           }
//         } catch (error) {
//           console.error('Error fetching trailer:', error);
//         }
//       }
//     };

//     fetchTrailer();
//   }, [isPlayingTrailer, movie]);

//   useEffect(() => {
//     const handleTrailerEnd = () => {
//       onWatchTrailer(false);
//     };

//     const iframe = iframeRef.current;
//     if (iframe) {
//       iframe.addEventListener('ended', handleTrailerEnd);
//     }

//     return () => {
//       if (iframe) {
//         iframe.removeEventListener('ended', handleTrailerEnd);
//       }
//     };
//   }, [onWatchTrailer]);

//   if (!movie) return null;

//   const genres = movie.genre_ids.map(id => genreMap[id] || "Unknown").join(", ");

//   return (
//     <div className="relative h-[calc(100vh-64px)] mb-8"> {/* Increased height */}
//       {isPlayingTrailer && trailerKey ? (
//         <div className="w-full h-full relative"> {/* Added relative positioning */}
//           <iframe
//             ref={iframeRef}
//             src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&enablejsapi=1`}
//             title="Movie Trailer"
//             className="w-full h-full"
//             frameBorder="0"
//             allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//             allowFullScreen
//           ></iframe>
//           <button
//             className="absolute top-14 right-4 mt-3 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors z-10"
//             onClick={() => onWatchTrailer(false)}
//           >
//             <X size={24} />
//           </button>
//         </div>
//       ) : (
//         <>
//           <img 
//             src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
//             alt={movie.title} 
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//             <div className="text-center text-white max-w-3xl px-4">
//               <h2 className="text-4xl font-bold mb-2">{movie.title}</h2>
//               <p className="text-xl mb-4">{movie.overview}</p>
//               <p className="text-lg mb-4">Genres: {genres}</p>
//               <div className="flex justify-center items-center mb-4">
//                 <Star className="text-yellow-400 mr-1" size={24} />
//                 <span className="text-2xl">{movie.vote_average.toFixed(1)}</span>
//               </div>
//               <motion.button 
//                 className="bg-red-600 text-white px-6 py-2 rounded-full hover:bg-red-700 transition-colors"
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => onWatchTrailer(true)}
//               >
//                 Watch Trailer
//               </motion.button>
//             </div>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };


// const MovieCard = ({ movie, onClick }) => {
//   const primaryGenre = movie.genre_ids[0] ? genreMap[movie.genre_ids[0]] : "Unknown";
//   const secondaryGenre = movie.genre_ids[1] ? genreMap[movie.genre_ids[1]] : null;

//   return (
//     <motion.div
//       layout
//       animate={{ opacity: 1 }}
//       initial={{ opacity: 0 }}
//       exit={{ opacity: 0 }}
//       className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
//       onClick={() => onClick(movie)}
//       whileHover={{ y: -5 }}
//     >
//       <img 
//         src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
//         alt={movie.title} 
//         className="w-full h-48 object-cover" 
//       />
//       <div className="p-4">
//         <h3 className="text-lg font-semibold mb-2">{movie.title}</h3>
//         <div className="flex items-center justify-between">
//           <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
//             {primaryGenre}
//           </span>
//           <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
//             {secondaryGenre}
//           </span>
//           <div className="flex items-center">
//             <Star className="text-yellow-400 mr-1" size={16} />
//             <span>{movie.vote_average.toFixed(1)}</span>
//           </div>
//         </div>
//       </div>
//     </motion.div>
//   );
// };


// const MovieDetails = ({ movie, onClose }) => {
//   const [reviews, setReviews] = useState([]);
//   const genres = movie.genre_ids.map(id => genreMap[id] || "Unknown").join(", ");

//   useEffect(() => {
//     const fetchReviews = async () => {
//       const url = `https://api.themoviedb.org/3/movie/${movie.id}/reviews?language=en-US&page=1`;
//       const options = {
//         method: 'GET',
//         headers: {
//           accept: 'application/json',
//           Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiODRhMDg2MWQzYjE0ZDliZWY2MWZlM2E1ZmVhYTNiZiIsIm5iZiI6MTcyODAwNjEwNC4yNTg4MTMsInN1YiI6IjY2ZmU2ZWM0Zjg3OGFkZmVkMDg0ZGUxMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hnWcQfCI4JrFvtlpHw-GS3o0ASpBdKOJZnuNW7Vmxcc'
//         }
//       };

//       try {
//         const response = await fetch(url, options);
//         const data = await response.json();
//         setReviews(data.results);
//       } catch (error) {
//         console.error('Error fetching reviews:', error);
//       }
//     };

//     fetchReviews();
//   }, [movie.id]);

//   const sanitizeHTML = (html) => {
//     return {
//       __html: DOMPurify.sanitize(html)
//     };
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 50 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: 50 }}
//       className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 overflow-y-auto"
//       onClick={onClose}
//     >
//       <div
//         className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-full overflow-y-auto"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h2 className="text-3xl font-bold mb-4">{movie.title}</h2>
//         <div className="relative mb-4">
//           <img
//             src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
//             alt={movie.title}
//             className="w-full h-auto object-cover rounded-lg"
//           />
//         </div>
//         <div className="mb-4">
//           <h3 className="text-xl font-semibold mb-2">Genres:</h3>
//           <p>{genres}</p>
//         </div>
//         <div className="mb-4">
//           <h3 className="text-xl font-semibold mb-2">Overview:</h3>
//           <p>{movie.overview}</p>
//         </div>
//         <div className="mb-4">
//           <h3 className="text-xl font-semibold mb-2">Rating:</h3>
//           <div className="flex items-center">
//             <Star className="text-yellow-400 mr-1" size={20} />
//             <span className="text-lg font-semibold">{movie.vote_average.toFixed(1)}</span>
//             <span className="ml-2 text-gray-600">({movie.vote_count} votes)</span>
//           </div>
//         </div>
//         <div className="mb-4">
//           <h3 className="text-xl font-semibold mb-2">Release Date:</h3>
//           <p>{movie.release_date}</p>
//         </div>
//         <div className="mb-4">
//           <h3 className="text-xl font-semibold mb-2">Reviews:</h3>
//           {reviews.length > 0 ? (
//             reviews.map((review, index) => (
//               <div key={review.id} className="mb-4 p-4 bg-gray-100 rounded-lg">
//                 <p className="font-semibold">{review.author}</p>
//                 <p className="text-sm text-gray-600 mb-2">{new Date(review.created_at).toLocaleDateString()}</p>
//                 <div dangerouslySetInnerHTML={sanitizeHTML(review.content)} />
//               </div>
//             ))
//           ) : (
//             <p>No reviews available.</p>
//           )}
//         </div>
//         <button
//           className="bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
//           onClick={onClose}
//         >
//           Close
//         </button>
//       </div>
//     </motion.div>
//   );
// };


// const App = () => {
//   const [movies, setMovies] = useState([]);
//   const [featuredMovie, setFeaturedMovie] = useState(null);
//   const [selectedMovie, setSelectedMovie] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortOrder, setSortOrder] = useState('asc');
//   const [selectedGenre, setSelectedGenre] = useState('All');
//   const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);

//   useEffect(() => {
//     const fetchMovies = async () => {
//       const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
//       const options = {
//         method: 'GET',
//         headers: {
//           accept: 'application/json',
//           Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJiODRhMDg2MWQzYjE0ZDliZWY2MWZlM2E1ZmVhYTNiZiIsIm5iZiI6MTcyODAwNjEwNC4yNTg4MTMsInN1YiI6IjY2ZmU2ZWM0Zjg3OGFkZmVkMDg0ZGUxMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.hnWcQfCI4JrFvtlpHw-GS3o0ASpBdKOJZnuNW7Vmxcc'
//         }
//       };

//       try {
//         const response = await fetch(url, options);
//         const data = await response.json();
//         setMovies(data.results);
        
//         const mostPopularMovie = data.results.reduce((prev, current) => 
//           (prev.popularity > current.popularity) ? prev : current
//         );
//         setFeaturedMovie(mostPopularMovie);
//       } catch (error) {
//         console.error('Error fetching movies:', error);
//       }
//     };

//     fetchMovies();
//   }, []);

//   const genres = ['All', ...new Set(movies.flatMap(movie => movie.genre_ids.map(id => genreMap[id])).filter(Boolean))];

//   const filteredMovies = movies.filter(movie =>
//     movie.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
//     (selectedGenre === 'All' || movie.genre_ids.some(id => genreMap[id] === selectedGenre))
//   ).sort((a, b) => {
//     if (sortOrder === 'asc') {
//       return a.title.localeCompare(b.title);
//     } else {
//       return b.title.localeCompare(a.title);
//     }
//   });

//   const handleWatchTrailer = (play) => {
//     setIsPlayingTrailer(play);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <TopBar />
//       <FeaturedFilm 
//         movie={featuredMovie} 
//         isPlayingTrailer={isPlayingTrailer} 
//         onWatchTrailer={handleWatchTrailer} 
//       />
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
//         <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
//           <div className="relative flex-grow w-full sm:w-auto mb-4 sm:mb-0">
//             <input
//               type="text"
//               placeholder="Search movies..."
//               className="w-full p-2 pl-10 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//             />
//             <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
//           </div>
//           <div className="flex space-x-4">
//             <select
//               className="p-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={selectedGenre}
//               onChange={(e) => setSelectedGenre(e.target.value)}
//             >
//               {genres.map(genre => (
//                 <option key={genre} value={genre}>{genre}</option>
//               ))}
//             </select>
//             <button
//               className="px-4 py-2 bg-blue-500 text-white rounded-full flex items-center hover:bg-blue-600 transition-colors"
//               onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
//             >
//               Sort
//               {sortOrder === 'asc' ? <ChevronUp className="ml-1" size={20} /> : <ChevronDown className="ml-1" size={20} />}
//             </button>
//           </div>
//         </div>
//         <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           <AnimatePresence>
//             {filteredMovies.map(movie => (
//               <MovieCard key={movie.id} movie={movie} onClick={setSelectedMovie} />
//             ))}
//           </AnimatePresence>
//         </motion.div>
//       </div>
//       <AnimatePresence>
//         {selectedMovie && <MovieDetails movie={selectedMovie} onClose={() => setSelectedMovie(null)} />}
//       </AnimatePresence>
//     </div>
//   );
// };

// export default App;

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import TopBar from './components/TopBar';
import Home from './pages/Home';
import Movies from './pages/Movies';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <TopBar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;