import React from 'react';
import bot from '../images/bot.png';

function Header() {
  return (
    <div className="fixed top-0 left-0 w-full h-[60px] bg-white z-50 flex items-center px-4 gap-2 shadow-lg">
      <img src={bot} alt="Bot Icon" className="h-[40px] w-[40px] object-contain" />
      <div>
        <p className="text-gray-400 text-[18px] text-left font-semibold">AI ASSITANT  </p>
        <p className="text-gray-400 text-[10px] text-left -mt-[5px]">TTF SACAFFOLDING </p>
      </div>
      
    </div>
  );
}

export default Header;
