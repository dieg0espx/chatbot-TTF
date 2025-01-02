import { useState, useEffect } from 'react';

const useTypewriter = (text, typingSpeed = 100) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let currentIndex = 0;

    const interval = setInterval(() => {
      setDisplayedText((prev) => prev + text[currentIndex]);
      currentIndex += 1;

      if (currentIndex >= text.length) {
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [text, typingSpeed]);

  return displayedText;
};

export default useTypewriter;
