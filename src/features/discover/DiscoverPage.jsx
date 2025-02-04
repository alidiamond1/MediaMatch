import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import useUserStore from '../../store/userStore';
import { getTrendingMovies, searchMovies } from '../../services/tmdbApi';

const genres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' }
];

const sortOptions = [
  { label: 'Popularity', value: 'popularity.desc' },
  { label: 'Rating', value: 'vote_average.desc' },
  { label: 'Release Date', value: 'release_date.desc' },
  { label: 'Title A-Z', value: 'title.asc' }
];

const DiscoverPage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedSort, setSelectedSort] = useState(sortOptions[0].value);
  const [showFilters, setShowFilters] = useState(false);
  const { user, addToWatchlist, isInWatchlist } = useUserStore();

  useEffect(() => {
    loadMovies();
  }, [selectedGenres, selectedSort]);

  const loadMovies = async () => {
    setLoading(true);
    try {
      const { movies } = await getTrendingMovies(1);
      setMovies(movies);
    } catch (error) {
      console.error('Error loading movies:', error);
    }
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const { movies } = await searchMovies(searchQuery);
      setMovies(movies);
    } catch (error) {
      console.error('Error searching movies:', error);
    }
    setLoading(false);
  };

  const toggleGenre = (genreId) => {
    setSelectedGenres(prev =>
      prev.includes(genreId)
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search and Filter Header */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Discover</h1>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            <FunnelIcon className="w-5 h-5 mr-2" />
            Filters
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search movies..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Search
          </button>
        </form>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white rounded-lg shadow p-6 space-y-6"
          >
            {/* Sort Options */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Sort By</h3>
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedSort(option.value)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      selectedSort === option.value
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Genre Filters */}
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() => toggleGenre(genre.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      selectedGenres.includes(genre.id)
                        ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 aspect-[2/3] rounded-lg mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow overflow-hidden group hover:shadow-lg transition-shadow duration-300"
            >
              <div className="relative aspect-[2/3] overflow-hidden">
                <img
                  src={movie.image}
                  alt={movie.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex justify-between items-center">
                      <p className="text-white text-sm font-medium">View Details</p>
                      {user && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isInWatchlist(movie.id)) {
                              addToWatchlist(movie);
                            }
                          }}
                          className={`p-2 rounded-full ${
                            isInWatchlist(movie.id)
                              ? 'bg-gray-200 text-gray-600'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          {isInWatchlist(movie.id) ? '✓' : '+'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                  {movie.title}
                </h3>
                <div className="mt-1 flex items-center justify-between">
                  <span className="text-sm text-gray-500">{movie.year}</span>
                  <span className="flex items-center text-yellow-400">
                    <span className="text-lg">★</span>
                    <span className="ml-1 text-sm text-gray-600">
                      {movie.rating.toFixed(1)}
                    </span>
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscoverPage; 