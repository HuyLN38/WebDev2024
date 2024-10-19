import React from 'react';
import { Link } from 'react-router-dom';

const FeaturedFilm = ({ movie, onWatchTrailer, onCloseTrailer, isPlayingTrailer, trailerKey }) => {
  return (
    <div className="relative h-[70vh] bg-black">
      {isPlayingTrailer && trailerKey ? (
        <div className="w-full h-full">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=0`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Movie Trailer"
          ></iframe>
          <button
            onClick={onCloseTrailer}
            className="absolute top-4 mt-14 right-4 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors"
          >
            Close Trailer
          </button>
        </div>
      ) : (
        <>
          <img 
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title} 
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">{movie.title}</h1>
              <p className="text-xl text-white mb-6 max-w-2xl">{movie.overview}</p>
              <button 
                onClick={() => onWatchTrailer(movie.id)}
                className="bg-red-600 text-white px-6 py-3 rounded-full hover:bg-red-700 transition-colors inline-block mr-4"
              >
                Watch Trailer
              </button>
              <Link 
                className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors inline-block"
              >
                More Info
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FeaturedFilm;