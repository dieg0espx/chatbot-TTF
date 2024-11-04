import React from 'react';
import bot from '../images/bot.png';

function Header() {
  return (
    <div className="fixed top-0 left-0 w-full h-[60px] bg-black bg-opacity-30 backdrop-blur-lg z-50 rounded-b-3xl flex items-center px-4 gap-2">
      <img src={bot} alt="Bot Icon" className="h-[40px] w-[40px] object-contain" />
      <div>
        <p className="text-white text-[18px] text-left font-semibold">AI ASSITANT  </p>
        <p className="text-white text-[10px] text-left -mt-[5px]">TTF SACAFFOLDING </p>
      </div>
      
    </div>
  );
}

export default Header;
