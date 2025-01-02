import React, { useState } from 'react';

function Menu({ onOptionSelect }) {
    const [showMenu, setShowMenu] = useState(false)
  const options = [
    'Products',
    'Contact',
    'Quotation',
    'About',
    'Delivery',
  ];

  const getEmojiForOption = (option) => {
    switch (option) {
      case 'Products':
        return '📦'; // Box emoji
      case 'Contact':
        return '📞'; // Telephone emoji
      case 'Quotation':
        return '💬'; // Speech balloon emoji
      case 'About':
        return 'ℹ️'; // Info emoji
      case 'Delivery':
        return '🚚'; // Delivery truck emoji
      default:
        return '❔'; // Default emoji
    }
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <>
    {showMenu &&  
        <div 
            className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-20 z-50"
            onClick={() => setShowMenu(false)}>
            <div className="flex flex-col gap-[5px] w-[200px] fixed bottom-[190px] right-[15px]">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => onOptionSelect(option)} // Pass selected option to parent
                  className="bg-gray-200 text-gray-700 py-3 px-5 rounded-xl hover:bg-blue-600 hover:text-white flex items-center"
                >
                  <span className="mr-2">{getEmojiForOption(option)}</span>
                  {capitalize(option)}
                </button>
              ))}
            </div>
        </div>
    }
    <button onClick={() => setShowMenu(!showMenu)} className="fixed bottom-[120px] right-[10px] bg-white text-gray-500 text-[25px] w-[60px] h-[60px] rounded-full z-50 drop-shadow-xl">
        <i className={showMenu? "bi bi-x-lg" : "bi bi-view-list"}></i>
    </button>


   </>
  );
}

export default Menu;
