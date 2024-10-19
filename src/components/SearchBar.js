  import React, { useState } from 'react';
  import { Search } from 'lucide-react';

  const SearchBar = ({ onSearch }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
      e.preventDefault();
      onSearch(query);
    };

    return (
      <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row">
          <div className="relative flex-grow">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search movies..."
              className="w-full px-4 py-2 border border-gray-30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="mt-2 sm:mt-0 px-2 py-2 bg-blue-500 text-white rounded-b-md sm:rounded-r-md sm:rounded-l-none hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
          >
            <Search size={20} className="mr-2" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </form>
    );
  };

  export default SearchBar;