import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tab } from '@headlessui/react';
import useUserStore from '../../store/userStore';
import { StarIcon, ClockIcon, BookmarkIcon } from '@heroicons/react/24/outline';

const ProfilePage = () => {
  const {
    user,
    watchlist,
    watchedMovies,
    removeFromWatchlist,
    removeFromWatched,
    updateMovieRating,
    updateProfile
  } = useUserStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    bio: user?.bio || ''
  });

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Please log in to view your profile
        </h2>
        <p className="text-gray-600">
          You need to be logged in to access your profile, watchlist, and watched movies.
        </p>
      </div>
    );
  }

  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateProfile(editForm);
    setIsEditing(false);
  };

  const renderMovieGrid = (movies, type) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {movies.map((movie) => (
        <motion.div
          key={movie.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow overflow-hidden"
        >
          <div className="relative aspect-[2/3]">
            <img
              src={movie.image}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <button
                  onClick={() =>
                    type === 'watchlist'
                      ? removeFromWatchlist(movie.id)
                      : removeFromWatched(movie.id)
                  }
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
              {movie.title}
            </h3>
            <div className="mt-1 flex items-center justify-between">
              <span className="text-sm text-gray-500">{movie.year}</span>
              {type === 'watched' && (
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => updateMovieRating(movie.id, star)}
                      className={`text-lg ${
                        star <= movie.userRating
                          ? 'text-yellow-400'
                          : 'text-gray-300 hover:text-yellow-400'
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-6">
          {isEditing ? (
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) =>
                    setEditForm({ ...editForm, bio: e.target.value })
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-4">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-20 h-20 rounded-full"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {user.name}
                  </h1>
                  <p className="text-gray-500">{user.email}</p>
                  {user.bio && (
                    <p className="mt-2 text-gray-600 max-w-2xl">{user.bio}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  setEditForm({
                    name: user.name,
                    bio: user.bio || ''
                  });
                  setIsEditing(true);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Tabs */}
      <Tab.Group>
        <Tab.List className="flex space-x-4 border-b border-gray-200 mb-8">
          <Tab
            className={({ selected }) =>
              `px-6 py-3 text-sm font-medium border-b-2 ${
                selected
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`
            }
          >
            <div className="flex items-center space-x-2">
              <BookmarkIcon className="w-5 h-5" />
              <span>Watchlist ({watchlist.length})</span>
            </div>
          </Tab>
          <Tab
            className={({ selected }) =>
              `px-6 py-3 text-sm font-medium border-b-2 ${
                selected
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`
            }
          >
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-5 h-5" />
              <span>Watched ({watchedMovies.length})</span>
            </div>
          </Tab>
        </Tab.List>

        <Tab.Panels>
          <Tab.Panel>
            {watchlist.length > 0 ? (
              renderMovieGrid(watchlist, 'watchlist')
            ) : (
              <div className="text-center py-12">
                <BookmarkIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No items in watchlist
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start adding movies to your watchlist to keep track of what you want to watch.
                </p>
              </div>
            )}
          </Tab.Panel>

          <Tab.Panel>
            {watchedMovies.length > 0 ? (
              renderMovieGrid(watchedMovies, 'watched')
            ) : (
              <div className="text-center py-12">
                <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No watched movies
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Mark movies as watched to keep track of what you've seen and rate them.
                </p>
              </div>
            )}
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default ProfilePage; 