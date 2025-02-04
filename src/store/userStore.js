import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      watchlist: [],
      watchedMovies: [],
      followers: [],
      following: [],
      favoriteGenres: [],
      recommendations: [],
      reviews: [],
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Validate email and password
          if (!email || !password) {
            throw new Error('Please fill in all fields');
          }

          // Check if user exists in localStorage
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const user = users.find(u => u.email === email);

          if (!user) {
            throw new Error('User not found');
          }

          if (user.password !== password) {
            throw new Error('Invalid password');
          }

          // Create session
          const session = {
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`,
            bio: user.bio || '',
            favoriteGenres: user.favoriteGenres || [],
            joinedDate: user.joinedDate,
            lastLogin: new Date().toISOString()
          };

          set({
            user: session,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          return true;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return false;
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          // Validate inputs
          if (!name || !email || !password) {
            throw new Error('Please fill in all fields');
          }

          if (password.length < 6) {
            throw new Error('Password must be at least 6 characters');
          }

          // Check if email is valid
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            throw new Error('Please enter a valid email');
          }

          // Get existing users
          const users = JSON.parse(localStorage.getItem('users') || '[]');

          // Check if user already exists
          if (users.some(user => user.email === email)) {
            throw new Error('Email already registered');
          }

          // Create new user
          const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
            bio: '',
            favoriteGenres: [],
            joinedDate: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };

          // Save to localStorage
          localStorage.setItem('users', JSON.stringify([...users, newUser]));

          // Create session
          const session = {
            ...newUser,
            password: undefined // Remove password from session
          };

          set({
            user: session,
            isAuthenticated: true,
            isLoading: false,
            error: null
          });

          return true;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          watchlist: [],
          watchedMovies: [],
          followers: [],
          following: [],
          reviews: [],
          recommendations: []
        });
      },

      updateProfile: async (updates) => {
        try {
          const { user } = get();
          if (!user) throw new Error('Not authenticated');

          // Get all users
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const userIndex = users.findIndex(u => u.id === user.id);

          if (userIndex === -1) throw new Error('User not found');

          // Update user in localStorage
          const updatedUser = { ...users[userIndex], ...updates };
          users[userIndex] = updatedUser;
          localStorage.setItem('users', JSON.stringify(users));

          // Update session
          set({
            user: {
              ...user,
              ...updates
            }
          });

          return true;
        } catch (error) {
          set({ error: error.message });
          return false;
        }
      },

      deleteAccount: async (password) => {
        try {
          const { user } = get();
          if (!user) throw new Error('Not authenticated');

          // Get all users
          const users = JSON.parse(localStorage.getItem('users') || '[]');
          const userIndex = users.findIndex(u => u.id === user.id);

          if (userIndex === -1) throw new Error('User not found');

          // Verify password
          if (users[userIndex].password !== password) {
            throw new Error('Invalid password');
          }

          // Remove user from localStorage
          users.splice(userIndex, 1);
          localStorage.setItem('users', JSON.stringify(users));

          // Clear session
          get().logout();

          return true;
        } catch (error) {
          set({ error: error.message });
          return false;
        }
      },

      followUser: (userToFollow) => {
        set((state) => ({
          following: [...state.following, userToFollow]
        }));
      },

      unfollowUser: (userId) => {
        set((state) => ({
          following: state.following.filter(u => u.id !== userId)
        }));
      },

      addReview: (movieId, review) => {
        set((state) => ({
          reviews: [...state.reviews, {
            id: Date.now().toString(),
            movieId,
            userId: state.user.id,
            text: review.text,
            rating: review.rating,
            createdAt: new Date().toISOString(),
            likes: 0,
            comments: []
          }]
        }));
      },

      likeReview: (reviewId) => {
        set((state) => ({
          reviews: state.reviews.map(review =>
            review.id === reviewId
              ? { ...review, likes: review.likes + 1 }
              : review
          )
        }));
      },

      addComment: (reviewId, comment) => {
        set((state) => ({
          reviews: state.reviews.map(review =>
            review.id === reviewId
              ? {
                  ...review,
                  comments: [...review.comments, {
                    id: Date.now().toString(),
                    userId: state.user.id,
                    text: comment,
                    createdAt: new Date().toISOString()
                  }]
                }
              : review
          )
        }));
      },

      updateFavoriteGenres: (genres) => {
        set((state) => ({
          user: { ...state.user, favoriteGenres: genres }
        }));
      },

      addToWatchlist: (movie) => {
        set((state) => ({
          watchlist: [...state.watchlist, { 
            ...movie, 
            addedAt: new Date().toISOString(),
            addedBy: state.user.id 
          }]
        }));
      },

      removeFromWatchlist: (movieId) => {
        set((state) => ({
          watchlist: state.watchlist.filter(movie => movie.id !== movieId)
        }));
      },

      addToWatched: (movie, rating) => {
        set((state) => ({
          watchedMovies: [...state.watchedMovies, { 
            ...movie, 
            watchedAt: new Date().toISOString(),
            userRating: rating,
            review: '',
            watchedBy: state.user.id
          }],
          watchlist: state.watchlist.filter(m => m.id !== movie.id)
        }));
      },

      removeFromWatched: (movieId) => {
        set((state) => ({
          watchedMovies: state.watchedMovies.filter(movie => movie.id !== movieId)
        }));
      },

      updateMovieRating: (movieId, rating) => {
        set((state) => ({
          watchedMovies: state.watchedMovies.map(movie =>
            movie.id === movieId ? { ...movie, userRating: rating } : movie
          )
        }));
      },

      isInWatchlist: (movieId) => {
        return get().watchlist.some(movie => movie.id === movieId);
      },

      isWatched: (movieId) => {
        return get().watchedMovies.some(movie => movie.id === movieId);
      }
    }),
    {
      name: 'user-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useUserStore; 