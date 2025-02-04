import { useEffect, useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import useRecommendationStore from '../../store/recommendationStore';
import DetailModal from './DetailModal';
import { getMoviesByMood } from '../../services/tmdbApi';

const moodFilters = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '😢', label: 'Sad', value: 'sad' },
  { emoji: '🤩', label: 'Excited', value: 'excited' },
  { emoji: '😌', label: 'Relaxed', value: 'relaxed' },
  { emoji: '🤔', label: 'Thought-provoking', value: 'thought-provoking' },
  { emoji: '💝', label: 'Romantic', value: 'romantic' },
  { emoji: '😱', label: 'Intense', value: 'intense' },
  { emoji: '🔍', label: 'Mysterious', value: 'mysterious' },
  { emoji: '🌟', label: 'Magical', value: 'magical' },
  { emoji: '🎭', label: 'Dramatic', value: 'dramatic' },
  { emoji: '😂', label: 'Funny', value: 'funny' },
  { emoji: '🎪', label: 'Adventurous', value: 'adventurous' },
  { emoji: '🌌', label: 'Mind-bending', value: 'mind-bending' },
  { emoji: '🎬', label: 'Action-packed', value: 'action-packed' },
  { emoji: '👻', label: 'Spooky', value: 'spooky' }
];

const sortOptions = [
  { label: 'Popularity', value: 'popularity' },
  { label: 'Rating', value: 'rating' },
  { label: 'Year', value: 'year' },
  { label: 'Title', value: 'title' },
];

const DashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const loadingRef = useRef(null);
  const [isLoadingMood, setIsLoadingMood] = useState(false);
  
  const { 
    selectedMood, 
    setSelectedMood, 
    getRecommendations,
    selectedItem,
    isDetailModalOpen,
    setSelectedItem,
    closeDetailModal,
    setUserRating,
    initializeStore,
    searchMovies,
    loadMore,
    isLoading,
    hasMore,
    error,
    setSorting,
    sortBy,
    sortOrder,
    setRecommendations
  } = useRecommendationStore();
  
  const recommendations = getRecommendations();

  useEffect(() => {
    initializeStore();
  }, []);

  useEffect(() => {
    const loadMoodBasedMovies = async () => {
      if (selectedMood) {
        setIsLoadingMood(true);
        try {
          const { movies } = await getMoviesByMood(selectedMood);
          if (movies && movies.length > 0) {
            setRecommendations(movies);
          } else {
            setRecommendations([]);
          }
        } catch (error) {
          console.error('Error loading mood-based movies:', error);
          setRecommendations([]);
        } finally {
          setIsLoadingMood(false);
        }
      } else {
        initializeStore(); // Reset to trending movies when no mood is selected
      }
    };

    loadMoodBasedMovies();
  }, [selectedMood, setRecommendations]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchMovies(searchTerm);
    }
  };

  const handleSort = (value) => {
    setSorting(value, value === sortBy ? (sortOrder === 'desc' ? 'asc' : 'desc') : 'desc');
  };

  // Intersection Observer for infinite scrolling
  const observer = useRef();
  const lastMovieElementRef = useCallback((node) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore]);

  return (
    <div className="space-y-8">
      {/* Search and Sort Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="max-w-7xl mx-auto space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for movies..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Search
            </button>
          </form>
          
          <div className="flex flex-wrap gap-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSort(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  sortBy === option.value
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                {option.label}
                {sortBy === option.value && (
                  <span className="ml-1">
                    {sortOrder === 'desc' ? '↓' : '↑'}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mood Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">How are you feeling today?</h2>
        <div className="flex flex-wrap gap-4">
          {moodFilters.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(selectedMood === mood.value ? null : mood.value)}
              className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
                selectedMood === mood.value
                  ? 'bg-indigo-100 text-indigo-700 ring-2 ring-indigo-500'
                  : 'hover:bg-gray-100'
              }`}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-sm mt-1">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recommendations Grid */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {selectedMood 
              ? `${moodFilters.find(m => m.value === selectedMood)?.emoji} ${moodFilters.find(m => m.value === selectedMood)?.label} Movies`
              : 'Trending Movies'}
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={() => setSelectedMood(null)}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                !selectedMood 
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              All
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        {(isLoading || isLoadingMood) ? (
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
            {recommendations.map((item, index) => (
              <motion.div
                key={item.id}
                ref={index === recommendations.length - 1 ? lastMovieElementRef : null}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.1, 1) }}
                className="bg-white rounded-lg shadow overflow-hidden group hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => setSelectedItem(item.id)}
              >
                <div className="relative aspect-[2/3] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <p className="text-sm font-medium">View Details</p>
                      <p className="text-xs mt-1 opacity-75">
                        {item.voteCount?.toLocaleString()} votes
                      </p>
                    </div>
                  </div>
                  {item.userRating && (
                    <div className="absolute top-2 right-2 bg-yellow-400 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                      {item.userRating}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-indigo-600 uppercase bg-indigo-50 px-2 py-1 rounded">
                        {item.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {item.year}
                      </span>
                    </div>
                    <span className="flex items-center text-yellow-400">
                      <span className="text-lg">★</span>
                      <span className="ml-1 text-sm text-gray-600">{item.rating.toFixed(1)}</span>
                    </span>
                  </div>
                  <h3 className="mt-2 text-lg font-medium text-gray-900 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{item.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.mood.map((m) => (
                      <span 
                        key={m} 
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex justify-center mt-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {/* End of results message */}
        {!isLoading && !hasMore && recommendations.length > 0 && (
          <div className="text-center mt-8 text-gray-500">
            No more movies to load
          </div>
        )}
      </div>

      <DetailModal
        isOpen={isDetailModalOpen}
        onClose={closeDetailModal}
        item={selectedItem}
        onRate={setUserRating}
      />
    </div>
  );
};

export default DashboardPage; 