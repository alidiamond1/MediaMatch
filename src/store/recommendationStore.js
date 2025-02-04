import { create } from 'zustand';
import { getTrendingMovies, searchMovies, getMovieDetails } from '../services/tmdbApi';

const useRecommendationStore = create((set, get) => ({
  recommendations: [],
  filteredRecommendations: [],
  selectedMood: null,
  selectedGenres: [],
  selectedItem: null,
  isDetailModalOpen: false,
  isLoading: false,
  error: null,
  searchQuery: '',
  currentPage: 1,
  totalPages: 1,
  hasMore: true,
  sortBy: 'popularity',
  sortOrder: 'desc',
  viewMode: 'grid', // 'grid' or 'list'

  setRecommendations: (movies) => set({ 
    recommendations: movies,
    filteredRecommendations: movies,
    currentPage: 1,
    hasMore: false 
  }),

  setViewMode: (mode) => set({ viewMode: mode }),

  setSorting: (sortBy, sortOrder = 'desc') => set((state) => {
    const sorted = [...state.recommendations].sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'rating':
          valueA = a.rating;
          valueB = b.rating;
          break;
        case 'year':
          valueA = a.year;
          valueB = b.year;
          break;
        case 'title':
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
          break;
        case 'votes':
          valueA = a.voteCount;
          valueB = b.voteCount;
          break;
        case 'runtime':
          valueA = a.runtime || 0;
          valueB = b.runtime || 0;
          break;
        case 'popularity':
        default:
          valueA = a.popularity;
          valueB = b.popularity;
      }

      if (sortOrder === 'asc') {
        return valueA > valueB ? 1 : -1;
      }
      return valueA < valueB ? 1 : -1;
    });

    return {
      recommendations: sorted,
      sortBy,
      sortOrder
    };
  }),

  setSelectedGenres: (genres) => set((state) => {
    const filtered = genres.length > 0
      ? state.recommendations.filter(item => 
          item.genres?.some(genre => genres.includes(genre)) ||
          item.genre?.some(genreId => genres.includes(genreId.toString()))
        )
      : state.recommendations;
    
    return {
      selectedGenres: genres,
      filteredRecommendations: state.selectedMood
        ? filtered.filter(item => item.mood.includes(state.selectedMood))
        : filtered
    };
  }),

  setSelectedMood: (mood) => set((state) => {
    let filtered = state.recommendations;
    
    if (state.selectedGenres.length > 0) {
      filtered = filtered.filter(item => 
        item.genres?.some(genre => state.selectedGenres.includes(genre)) ||
        item.genre?.some(genreId => state.selectedGenres.includes(genreId.toString()))
      );
    }
    
    if (mood) {
      filtered = filtered.filter(item => item.mood.includes(mood));
    }

    return {
      selectedMood: mood,
      filteredRecommendations: filtered
    };
  }),

  // Initialize the store with trending movies
  initializeStore: async () => {
    set({ isLoading: true, recommendations: [], currentPage: 1 });
    try {
      const { movies, totalPages, currentPage } = await getTrendingMovies(1);
      set({ 
        recommendations: movies,
        totalPages,
        currentPage,
        hasMore: currentPage < totalPages,
        isLoading: false 
      });
      get().setSorting('popularity', 'desc');
    } catch (error) {
      set({ 
        error: 'Failed to fetch trending movies',
        isLoading: false 
      });
    }
  },

  // Load more movies
  loadMore: async () => {
    const { currentPage, totalPages, isLoading, searchQuery } = get();
    
    if (isLoading || currentPage >= totalPages) return;

    set({ isLoading: true });
    try {
      const nextPage = currentPage + 1;
      const { movies, totalPages: newTotalPages } = searchQuery
        ? await searchMovies(searchQuery, nextPage)
        : await getTrendingMovies(nextPage);

      set((state) => ({ 
        recommendations: [...state.recommendations, ...movies],
        currentPage: nextPage,
        totalPages: newTotalPages,
        hasMore: nextPage < newTotalPages,
        isLoading: false
      }));
    } catch (error) {
      set({ 
        error: 'Failed to load more movies',
        isLoading: false 
      });
    }
  },

  // Search movies
  searchMovies: async (query) => {
    set({ isLoading: true, searchQuery: query, recommendations: [], currentPage: 1 });
    try {
      const { movies, totalPages, currentPage } = await searchMovies(query, 1);
      set({ 
        recommendations: movies,
        totalPages,
        currentPage,
        hasMore: currentPage < totalPages,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: 'Failed to search movies',
        isLoading: false 
      });
    }
  },

  // Get detailed movie information
  loadMovieDetails: async (movieId) => {
    try {
      const movieDetails = await getMovieDetails(movieId);
      if (movieDetails) {
        set((state) => ({
          recommendations: state.recommendations.map(item =>
            item.id === movieId ? { ...item, ...movieDetails } : item
          ),
          selectedItem: movieDetails,
          isDetailModalOpen: true
        }));
      }
    } catch (error) {
      set({ error: 'Failed to load movie details' });
    }
  },

  getRecommendations: () => {
    const { recommendations, filteredRecommendations, selectedMood, selectedGenres } = get();
    return selectedMood || selectedGenres.length > 0 ? filteredRecommendations : recommendations;
  },

  setSelectedItem: (itemId) => {
    const { loadMovieDetails } = get();
    loadMovieDetails(itemId);
  },

  closeDetailModal: () => set({ isDetailModalOpen: false }),

  setUserRating: (itemId, rating) => set((state) => ({
    recommendations: state.recommendations.map(item =>
      item.id === itemId ? { ...item, userRating: rating } : item
    )
  }))
}));

export default useRecommendationStore; 