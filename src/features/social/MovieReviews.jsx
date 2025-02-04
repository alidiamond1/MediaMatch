import { useState } from 'react';
import { motion } from 'framer-motion';
import useUserStore from '../../store/userStore';

const ReviewCard = ({ review, onLike, onComment }) => {
  const [comment, setComment] = useState('');
  const { user } = useUserStore();

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onComment(review.id, comment);
      setComment('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow p-4 space-y-4"
    >
      <div className="flex items-start space-x-4">
        <img
          src={`https://ui-avatars.com/api/?name=${review.userId}&background=random`}
          alt="User avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">User {review.userId}</h3>
            <span className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
          <div className="mt-1 flex items-center">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`text-lg ${
                  i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                ★
              </span>
            ))}
          </div>
          <p className="mt-2 text-gray-600">{review.text}</p>
          <div className="mt-3 flex items-center space-x-4">
            <button
              onClick={() => onLike(review.id)}
              className="flex items-center text-gray-500 hover:text-indigo-600"
            >
              <span className="mr-1">👍</span>
              {review.likes} likes
            </button>
            <span className="text-gray-500">
              {review.comments.length} comments
            </span>
          </div>
        </div>
      </div>

      {/* Comments */}
      {review.comments.length > 0 && (
        <div className="ml-14 space-y-3">
          {review.comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-sm">User {comment.userId}</span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-600">{comment.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Add Comment Form */}
      {user && (
        <form onSubmit={handleSubmitComment} className="ml-14">
          <div className="flex gap-2">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!comment.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              Comment
            </button>
          </div>
        </form>
      )}
    </motion.div>
  );
};

const MovieReviews = ({ movieId }) => {
  const [newReview, setNewReview] = useState({ text: '', rating: 0 });
  const { user, reviews, addReview, likeReview, addComment } = useUserStore();

  const movieReviews = reviews.filter(review => review.movieId === movieId);

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (newReview.text.trim() && newReview.rating > 0) {
      addReview(movieId, newReview);
      setNewReview({ text: '', rating: 0 });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-gray-900">Reviews</h2>

      {/* Add Review Form */}
      {user && (
        <form onSubmit={handleSubmitReview} className="bg-white rounded-lg shadow p-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewReview({ ...newReview, rating: star })}
                    className={`text-2xl ${
                      star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Review
              </label>
              <textarea
                value={newReview.text}
                onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Write your review..."
              />
            </div>
            <button
              type="submit"
              disabled={!newReview.text.trim() || newReview.rating === 0}
              className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              Submit Review
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {movieReviews.length > 0 ? (
          movieReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onLike={likeReview}
              onComment={addComment}
            />
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            No reviews yet. Be the first to review!
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieReviews; 