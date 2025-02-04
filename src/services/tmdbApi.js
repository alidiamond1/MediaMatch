import axios from 'axios';

// Load environment variables
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// Create axios instance with default config
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

// Add request interceptor for error handling
tmdbApi.interceptors.request.use(
  (config) => {
    // Add any request processing here
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
tmdbApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', error.response.data);
      throw new Error(error.response.data.status_message || 'An error occurred with the movie service');
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', error.request);
      throw new Error('No response from movie service');
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', error.message);
      throw new Error('Error setting up request');
    }
  }
);

export const getTrendingMovies = async (page = 1) => {
  try {
    const response = await tmdbApi.get('/trending/movie/week', {
      params: { page }
    });
    return {
      movies: response.data.results.map(formatMovieData),
      totalPages: response.data.total_pages,
      currentPage: response.data.page
    };
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return { movies: [], totalPages: 0, currentPage: 1 };
  }
};

export const searchMovies = async (query, page = 1) => {
  try {
    const response = await tmdbApi.get('/search/movie', {
      params: { query, page }
    });
    return {
      movies: response.data.results.map(formatMovieData),
      totalPages: response.data.total_pages,
      currentPage: response.data.page
    };
  } catch (error) {
    console.error('Error searching movies:', error);
    return { movies: [], totalPages: 0, currentPage: 1 };
  }
};

const formatMovieData = (movie) => ({
  id: movie.id,
  title: movie.title,
  type: 'movie',
  rating: movie.vote_average / 2,
  image: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : '/placeholder-movie.jpg',
  genre: movie.genre_ids,
  mood: getMoodFromGenres(movie.genre_ids),
  description: movie.overview,
  year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A',
  director: '',
  userRating: null,
  popularity: movie.popularity,
  voteCount: movie.vote_count
});

export const getMovieDetails = async (movieId) => {
  try {
    const [movieResponse, creditsResponse] = await Promise.all([
      tmdbApi.get(`/movie/${movieId}`),
      tmdbApi.get(`/movie/${movieId}/credits`)
    ]);

    const movie = movieResponse.data;
    const credits = creditsResponse.data;
    const director = credits.crew.find(person => person.job === 'Director');

    return {
      id: movie.id,
      title: movie.title,
      type: 'movie',
      rating: movie.vote_average / 2,
      image: `${TMDB_IMAGE_BASE_URL}${movie.poster_path}`,
      genre: movie.genres.map(g => g.name),
      mood: getMoodFromGenres(movie.genres.map(g => g.id)),
      description: movie.overview,
      year: new Date(movie.release_date).getFullYear(),
      director: director ? director.name : 'Unknown',
      userRating: null,
      runtime: movie.runtime,
      language: movie.original_language,
      budget: movie.budget,
      revenue: movie.revenue,
      cast: credits.cast.slice(0, 5).map(actor => ({
        id: actor.id,
        name: actor.name,
        character: actor.character,
        image: actor.profile_path ? `${TMDB_IMAGE_BASE_URL}${actor.profile_path}` : null
      }))
    };
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
};

// Helper function to map genres to moods
const getMoodFromGenres = (genreIds) => {
  const genreMoodMap = {
    28: ['excited', 'intense'], // Action
    12: ['excited', 'adventurous'], // Adventure
    16: ['happy', 'relaxed'], // Animation
    35: ['happy', 'funny'], // Comedy
    80: ['intense', 'dark'], // Crime
    99: ['thought-provoking', 'informative'], // Documentary
    18: ['emotional', 'reflective'], // Drama
    10751: ['happy', 'relaxed'], // Family
    14: ['excited', 'magical'], // Fantasy
    36: ['thought-provoking', 'reflective'], // History
    27: ['intense', 'dark'], // Horror
    10402: ['happy', 'relaxed'], // Music
    9648: ['intense', 'mysterious'], // Mystery
    10749: ['romantic', 'emotional'], // Romance
    878: ['mind-bending', 'excited'], // Science Fiction
    53: ['intense', 'suspenseful'], // Thriller
    10752: ['intense', 'emotional'], // War
    37: ['adventurous', 'intense'], // Western
  };

  const moods = new Set();
  genreIds.forEach(genreId => {
    if (genreMoodMap[genreId]) {
      genreMoodMap[genreId].forEach(mood => moods.add(mood));
    }
  });

  return Array.from(moods);
};

// Helper function to map moods to genres
const moodToGenreMap = {
  'happy': [35, 16, 10751], // Comedy, Animation, Family
  'sad': [18, 10749], // Drama, Romance
  'excited': [28, 12, 878], // Action, Adventure, Science Fiction
  'relaxed': [35, 10751], // Comedy, Family
  'thought-provoking': [99, 36, 18], // Documentary, History, Drama
  'romantic': [10749, 35], // Romance, Comedy
  'intense': [53, 27, 80], // Thriller, Horror, Crime
  'mysterious': [9648, 80], // Mystery, Crime
  'magical': [14, 16], // Fantasy, Animation
  'dramatic': [18, 36], // Drama, History
  'funny': [35], // Comedy
  'adventurous': [12, 28], // Adventure, Action
  'mind-bending': [878, 9648], // Science Fiction, Mystery
  'action-packed': [28, 53], // Action, Thriller
  'spooky': [27, 9648] // Horror, Mystery
};

export const getMoviesByMood = async (mood, page = 1) => {
  try {
    const genreIds = moodToGenreMap[mood] || [];
    if (!genreIds.length) return { movies: [], totalPages: 0, currentPage: 1 };

    const response = await tmdbApi.get('/discover/movie', {
      params: {
        page,
        with_genres: genreIds.join(','),
        sort_by: 'popularity.desc',
        'vote_count.gte': 100 // Ensure we get movies with sufficient votes
      }
    });

    return {
      movies: response.data.results.map(formatMovieData),
      totalPages: response.data.total_pages,
      currentPage: response.data.page
    };
  } catch (error) {
    console.error('Error fetching movies by mood:', error);
    return { movies: [], totalPages: 0, currentPage: 1 };
  }
};

export default tmdbApi; 