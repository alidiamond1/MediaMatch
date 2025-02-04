import React, { useState } from 'react';
import MoodFilter from './MoodFilter';
import RecommendationCard from './RecommendationCard';

// Mock data for demonstration
const mockRecommendations = [
  {
    id: 1,
    title: 'The Midnight Library',
    type: 'Book',
    imageUrl: 'https://source.unsplash.com/random/300x450?book',
    rating: 4,
    genres: ['Fiction', 'Fantasy', 'Self-Help'],
    mood: 'reflective'
  },
  {
    id: 2,
    title: 'Inception',
    type: 'Movie',
    imageUrl: 'https://source.unsplash.com/random/300x450?movie',
    rating: 5,
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    mood: 'mysterious'
  },
  {
    id: 3,
    title: 'Pride and Prejudice',
    type: 'Book',
    imageUrl: 'https://source.unsplash.com/random/300x450?classic',
    rating: 4,
    genres: ['Romance', 'Classic', 'Drama'],
    mood: 'romantic'
  },
  // Add more mock items as needed
];

const Dashboard = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [recommendations, setRecommendations] = useState(mockRecommendations);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    // In a real application, this would trigger an API call to get mood-based recommendations
    // For now, we'll just filter the mock data
    if (mood) {
      const filtered = mockRecommendations.filter(item => item.mood === mood);
      setRecommendations(filtered.length > 0 ? filtered : mockRecommendations);
    } else {
      setRecommendations(mockRecommendations);
    }
  };

  const handleRate = (itemId, rating) => {
    setRecommendations(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, rating } : item
      )
    );
    // In a real application, this would also make an API call to save the rating
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to MediaMatch</h1>
        <p className="mt-2 text-gray-600">Discover your next favorite book or movie</p>
      </div>

      <MoodFilter
        selectedMood={selectedMood}
        onMoodSelect={handleMoodSelect}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recommendations.map((item) => (
          <RecommendationCard
            key={item.id}
            {...item}
            onRate={(rating) => handleRate(item.id, rating)}
          />
        ))}
      </div>

      {recommendations.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No recommendations found</h3>
          <p className="mt-2 text-gray-600">Try selecting a different mood or clearing the filter</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 