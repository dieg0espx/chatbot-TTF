import React from 'react';
import useTypewriter from '../hooks/useTypewriter'; // Ensure the path is correct

const Typewriter = ({ text = '', speed = 100 }) => {
  const displayText = useTypewriter(text, speed);

  return <p className="font-mono">{displayText}</p>;
};

export default Typewriter;
