import React from 'react';
import bot from '../images/bot.png';

function Header() {
  return (
    <div className="fixed top-0 left-0 w-full h-[60px] bg-white z-50 flex items-center justify-between px-4 gap-2 shadow-lg">
      <div className="flex items-center gap-2">
        <img src={bot} alt="Bot Icon" className="h-[40px] w-[40px] object-contain" />
        <div>
          <p className="text-gray-400 text-[18px] text-left font-semibold">AI ASSISTANT</p>
          <p className="text-gray-400 text-[10px] text-left -mt-[5px]">TTF SCAFFOLDING</p>
        </div>
      </div>

      <a href="tel:7788985301" className="text-gray-500 hover:text-blue-500">
        <i className="bi bi-telephone-plus text-[23px]"></i>
      </a>
    </div>
  );
}

export default Header;
