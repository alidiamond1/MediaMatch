import React from 'react';
import { motion } from 'framer-motion';

const moods = [
  { id: 'happy', emoji: '😊', label: 'Happy' },
  { id: 'sad', emoji: '😢', label: 'Sad' },
  { id: 'excited', emoji: '🤩', label: 'Excited' },
  { id: 'relaxed', emoji: '😌', label: 'Relaxed' },
  { id: 'romantic', emoji: '🥰', label: 'Romantic' },
  { id: 'mysterious', emoji: '🤔', label: 'Mysterious' },
];

const MoodFilter = ({ selectedMood, onMoodSelect }) => {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">How are you feeling today?</h2>
      <div className="flex flex-wrap gap-4">
        {moods.map(({ id, emoji, label }) => (
          <motion.button
            key={id}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onMoodSelect(id)}
            className={`flex flex-col items-center p-3 rounded-lg transition-colors ${
              selectedMood === id
                ? 'bg-primary-100 border-2 border-primary-500'
                : 'bg-white border-2 border-gray-200 hover:border-primary-300'
            }`}
          >
            <span className="text-2xl mb-1" role="img" aria-label={label}>
              {emoji}
            </span>
            <span className="text-sm font-medium text-gray-700">{label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default MoodFilter; 