import './style/Loader.css'

// WorkoutLoader.jsx

import React from 'react';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader">
        {/* Replace 'dumbbell.svg' with your own SVG file or use an online SVG source */}
        <img
          src="data:image/png;base64,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"
          alt="Dumbbell Icon"
        />
      </div>
    </div>
  );
};

export default Loader;
