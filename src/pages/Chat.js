import React, { useEffect, useState } from 'react';
import greenBubble from '../images/greenbubble.png';
import grayBubble from '../images/graybubble.png';
import background from '../images/logo.png';
import Header from '../components/Header';
import { capitalize } from '../Utils';

function Chat() {
  const [currentMessage, setCurrentMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [showOptions, setShowOptions] = useState(true);
  const [data, setData] = useState();
  const [selectedCategory, setSelectedCategory] = useState(null); // Track selected main category
  const [submenuOptions, setSubmenuOptions] = useState([]); // Track submenu options

  const options = [
    'Products',
    'Contact',
    'Quotation',
    'Prices',
    'bout Us',
    'Delivery',
    'Other',
  ];

  useEffect(() => {
    addMessage('server', 'Hello, how can I help you? Please select an option below:');
    getData();
  }, []);


  async function getData() {
    try {
      const information = await import('../data/data.json');  
      setData(information.categories);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const addMessage = (sender, text) => {
    const newMessage = {
      sender: sender,
      timestamp: getTimeStamp(),
      text: text,
    };
    setConversation((prev) => [...prev, newMessage]);
    setCurrentMessage('');
  };

  const getTimeStamp = () => {
    const timestamp = new Date();
    const date = timestamp.toLocaleDateString();
    const time = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${date}|${time}`;
  };

  const handleOptionClick = (option) => {
    console.log(data[option]);
    
    setShowOptions(false);
    setSelectedCategory(option); // Set the selected category
    addMessage('user', option);
    addMessage('server', `Got it! You’re interested in ${option}.`);

    setTimeout(displaySubmenu(option), 500); // Display submenu after a short delay
  };

  const displaySubmenu = (option) => {
    if (data && option) {
      const categoryData = data[option];
  
      if (categoryData) {
        const submenu = [];
  
        // If the category has nested items (e.g., Products), list all item names; otherwise, use keys as submenu options
        if (categoryData.items && Array.isArray(categoryData.items)) {
          submenu.push(...categoryData.items.map((item) => item.name));
        } else {
          submenu.push(...Object.keys(categoryData));
        }
  
        console.log('Submenu options set:', submenu); // Debug statement
        setSubmenuOptions(submenu);
  
        setTimeout(() => {
          addMessage('server', 'Please select an option below to learn more:');
          setShowOptions(true);
        }, 500);
      } else {
        console.log('No data found for selected category:', option); // Debug statement
      }
    } else {
      console.log('Data or option not found'); // Debug statement
    }
  };
  

  const handleSubOptionClick = (subOption) => {
    addMessage('user', subOption);

    const categoryKey = selectedCategory.replace(/[^a-zA-Z]/g, '');
    const categoryData = data[categoryKey];
    
    let subOptionData;
    if (categoryKey === 'Products') {
      subOptionData = categoryData.items.find(item => item.name === subOption);
    } else {
      subOptionData = categoryData[subOption];
    }

    if (subOptionData) {
      addMessage('server', formatAnswer(JSON.stringify(subOptionData)).toString());
      
    }
  };

  const handleKeyDown = (event) => { 
    if (event.key === 'Enter' && !event.shiftKey && currentMessage !== '') { 
      event.preventDefault(); 
      newUserMessage(); 
    } 
  }; 
  
  const newUserMessage = () => { 
    addMessage('user', currentMessage); 
    setCurrentMessage(''); 
  };




  const openAiUrl = process.env.REACT_APP_APIURL;
  async function formatAnswer(answer) {
    let formattedAsnwer
    let prompt = 'Format this JSON so the people can understand: ' +  answer

    try {
        const response = await fetch(openAiUrl + 'generate-text', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: prompt })
        });

        if (!response.ok) {
          throw new Error('Failed to generate text');
        }

        console.log(response.json());
        console.log(typeof(response.json()));
        
        
        return response;
    } catch (error) {
        console.error('Error generating text:', error);
    }
    return '....'
}



  return (
    <div className="chat-page h-screen overflow-hidden mx-auto">
      <Header />
      <img
        src={background}
        className="w-[50%] max-w-[150px] fixed left-[50%] top-[30%] transform -translate-x-[45%] z-[2] opacity-[0.1]"
      />
      <div className="container w-[98%] mx-auto z-1">
        <div className="bubbles relative h-[calc(100vh-110px)] p-[10px] z-[3] overflow-y-scroll rounded-t-lg pt-[70px]">
          {conversation.map((message, index) => (
            <div
              className={`row mb-[5px] flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              key={index}
            >
              <div
                className={`${message.sender === 'user' ? 'user-bubble' : 'server-bubble'} max-w-[80%] w-fit min-w-[60px] py-[8px] px-[15px] rounded-lg text-left ${
                  message.sender === 'user' ? 'bg-[#1fe0ba] text-white' : 'bg-gray-200 text-black'
                }`}
              >
                {message.text.split('\n').map((textPart, idx) => (
                  <React.Fragment key={idx}>
                    {textPart}
                    <br />
                  </React.Fragment>
                ))}
                <p className={`${message.sender === 'user' ? 'text-right' : 'text-left'} text-[6px] lowercase mt-[2px] mb-[-3px]`}>
                  {message.timestamp.split('|')[1]}
                </p>
              </div>
            </div>
          ))}

          {/* Show main options if `showOptions` is true and no category selected */}
          {showOptions && !selectedCategory && (
            <div className="options-container my-4">
              <p className="text-gray-600 text-left">Please select an option below:</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionClick(option)}
                    className="bg-gray-200 text-gray-700 py-1 px-3 rounded hover:bg-blue-600 hover:text-white"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Show submenu options if `showOptions` is true and a category is selected */}
          {showOptions && selectedCategory && submenuOptions.length > 0 && (
            <div className="submenu-container my-4">
              <p className="text-gray-600 text-left">Select a option:</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {submenuOptions.map((subOption, index) => (
                  <button key={index} onClick={() => handleSubOptionClick(subOption)} className="bg-gray-200 text-gray-700 py-1 px-3 rounded hover:bg-blue-600 hover:text-white">
                    {capitalize(subOption)}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Text area for user input */}
        <div className="input-area h-[100px] fixed bottom-[10px] left-0 w-full bg-white z-[997]">
          <textarea
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            value={currentMessage}
            placeholder="Ask me something ..."
            className="w-[98%] h-full p-2 mx-auto resize-none outline-none rounded-lg border border-gray-300 text-[16px]"
          />
        </div>
      </div>
    </div>
  );
}

export default Chat;
