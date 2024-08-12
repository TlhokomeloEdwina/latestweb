// Slideshow.js
import React, { useState, useEffect } from 'react';

const Slideshow = ({ children }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % React.Children.count(children));
    }, 5000);

    return () => clearInterval(intervalId);
  }, [children]);

  return (
    <div className="relative w-full h-36 overflow-hidden">
      {React.Children.map(children, (child, index) => (
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default Slideshow;
