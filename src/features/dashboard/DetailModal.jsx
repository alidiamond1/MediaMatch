import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { motion } from 'framer-motion';
import useUserStore from '../../store/userStore';
import MovieReviews from '../social/MovieReviews';

const StarRating = ({ rating, onRate, userRating }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onRate(star)}
          className={`text-2xl transition-colors ${
            (userRating && star <= userRating) ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const DetailModal = ({ isOpen, onClose, item, onRate }) => {
  const [activeTab, setActiveTab] = useState('details');
  const { 
    isAuthenticated,
    addToWatchlist,
    removeFromWatchlist,
    addToWatched,
    removeFromWatched,
    isInWatchlist,
    isWatched,
    user
  } = useUserStore();

  if (!item) return null;

  const isInUserWatchlist = isInWatchlist(item.id);
  const isInUserWatched = isWatched(item.id);

  const handleWatchlistClick = () => {
    if (isInUserWatchlist) {
      removeFromWatchlist(item.id);
    } else {
      addToWatchlist(item);
    }
  };

  const handleWatchedClick = () => {
    if (isInUserWatched) {
      removeFromWatched(item.id);
    } else {
      addToWatched(item, item.userRating);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
                <div className="flex gap-6 p-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-1/3"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full rounded-lg shadow-lg"
                    />
                    {isAuthenticated && (
                      <div className="mt-4 space-y-2">
                        <button
                          onClick={handleWatchlistClick}
                          className={`w-full px-4 py-2 rounded-md text-sm font-medium ${
                            isInUserWatchlist
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-indigo-600 text-white hover:bg-indigo-700'
                          }`}
                        >
                          {isInUserWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                        </button>
                        <button
                          onClick={handleWatchedClick}
                          className={`w-full px-4 py-2 rounded-md text-sm font-medium ${
                            isInUserWatched
                              ? 'bg-gray-100 text-gray-700'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {isInUserWatched ? 'Mark as Unwatched' : 'Mark as Watched'}
                        </button>
                      </div>
                    )}
                  </motion.div>
                  
                  <div className="w-2/3">
                    <Dialog.Title className="text-2xl font-bold text-gray-900">
                      {item.title}
                    </Dialog.Title>
                    
                    <div className="mt-4 border-b border-gray-200">
                      <nav className="-mb-px flex space-x-8">
                        <button
                          onClick={() => setActiveTab('details')}
                          className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'details'
                              ? 'border-indigo-500 text-indigo-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          Details
                        </button>
                        <button
                          onClick={() => setActiveTab('reviews')}
                          className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'reviews'
                              ? 'border-indigo-500 text-indigo-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          Reviews & Comments
                        </button>
                      </nav>
                    </div>

                    {activeTab === 'details' ? (
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                            {item.type}
                          </span>
                          <span className="text-sm text-gray-500">
                            {item.year}
                          </span>
                          <span className="text-sm text-gray-500">
                            {item.type === 'movie' ? `Dir. ${item.director}` : `By ${item.author}`}
                          </span>
                        </div>

                        <p className="text-gray-600">{item.description}</p>

                        <div className="space-y-2">
                          <h3 className="font-medium text-gray-900">Moods</h3>
                          <div className="flex flex-wrap gap-2">
                            {item.mood.map((m) => (
                              <span
                                key={m}
                                className="text-sm bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>

                        {isAuthenticated && (
                          <div className="space-y-2">
                            <h3 className="font-medium text-gray-900">Rate this {item.type}</h3>
                            <StarRating
                              rating={item.rating}
                              userRating={item.userRating}
                              onRate={(rating) => {
                                onRate(item.id, rating);
                                if (!isInUserWatched) {
                                  addToWatched(item, rating);
                                }
                              }}
                            />
                          </div>
                        )}

                        <div className="flex justify-between items-center pt-4">
                          <div className="flex items-center text-yellow-400">
                            <span className="text-lg">★</span>
                            <span className="ml-1 text-sm text-gray-600">
                              {item.rating} Global Rating
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4">
                        <MovieReviews movieId={item.id} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 flex justify-end">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DetailModal; 