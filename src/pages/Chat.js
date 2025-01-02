import React, { useEffect, useState } from 'react';
import greenBubble from '../images/greenbubble.png';
import grayBubble from '../images/graybubble.png';
import background from '../images/logo.png';
import Header from '../components/Header';
import { capitalize } from '../Utils';
import icon from '../images/bot.png'
import loader from '../images/loader.gif'
import Menu from '../components/Menu';
import Loader from '../components/Loader';



function Chat() {
  const [currentMessage, setCurrentMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [showOptions, setShowOptions] = useState(true);
  const [data, setData] = useState();
  const [selectedCategory, setSelectedCategory] = useState(null); // Track selected main category
  const [submenuOptions, setSubmenuOptions] = useState([]); // Track submenu options
  const [isLoading, setIsLoading] = useState(false)


  useEffect(() => {
      getData();
      addMessage('server',"Hi there 👋 \n I'm your virtual assistant, here to help with all your scaffolding and formwork needs. Whether youre looking for product details, technical support, or project advice, I'm here to assist you. \n How can I help you today? ")
  }, []);

  useEffect(() => {
      window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth', // Optional: for smooth scrolling
      });
  }, [conversation]);

  async function getData() {
      try {
      const information = await import('../data/data.json');  
      setData(information.categories);
      } catch (error) {
      console.error('Error fetching data:', error);
      }
  }

  const addMessage = (sender, text = '') => {
      const newMessage = {
      sender: sender,
      timestamp: getTimeStamp(),
      text: String(text), // Ensure text is a string
      };
      setConversation((prev) => [...prev, newMessage]);
      setCurrentMessage('');
      setIsLoading(false)
  };

  const getTimeStamp = () => {
      const timestamp = new Date();
      const date = timestamp.toLocaleDateString();
      const time = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `${date}|${time}`;
  };

  const handleOptionClick = (option) => {
      console.log(option);
      addMessage('user', option);
      switch (option) {
        case 'Delivery':
          AIFormatText(data.Delivery)
          break;
        case 'Contact':
          AIFormatText(data.Contact)
          break;
        case 'Products':
          displaySubmenu(option);
          setSelectedCategory(option);
          break;
        case 'Quotation': 
          AIFormatText(data.Quotation)
          break;
        default:
          break;
      }
  };

  const displaySubmenu = (option) => {
      if (data && option) {
      const categoryData = data[option];
      if (categoryData) {
          const submenu = [];
          if (categoryData.items && Array.isArray(categoryData.items)) {
          submenu.push(...categoryData.items.map((item) => item.name));
          } else {
          submenu.push(...Object.keys(categoryData));
          }
          console.log('Submenu options set:', submenu);
          setSubmenuOptions(submenu);
      } else {
          console.log('No data found for selected category:', option);
      }
      } else {
      console.log('Data or option not found');
      }
  };

  const openAiUrl = process.env.REACT_APP_APIURL;
  async function rawAnswer(question, data) {
      const prompt = `
      You are an expert assistant. Answer the question below intelligently:
      - If the question is directly related to the provided data, use the relevant parts of the data to answer.
      - If the question is not related to the data, respond based on general knowledge and ignore the provided data.
      - Do not include programming terms like JSON, keys, or objects in your response.
      - Use bullet points or short sentences for clarity and readability.
      - Concrete answer.
      - Highlight important elements or keys using **bold text** when necessary. For example: **key**.
      - Do not include symbols like {}, [], :, <>, or anything that a non-technical person might find confusing.
      - Always present the information in a way that a regular person can easily understand.
      
      Here is the data (use only if relevant):
      ${JSON.stringify(data, null, 2)}
      
      Question: ${question}s
      `;
      try {
          setIsLoading(true);
          const response = await fetch(openAiUrl + 'generate-text', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: prompt })
      });
  
      if (!response.ok) {
          setIsLoading(false)
          throw new Error('Failed to generate text');
      }
  
      const responseData = await response.json(); 
      const generatedText = responseData.trimStart(); // Trim the leading spaces
      console.log(generatedText);
      addMessage('server', generatedText);
      } catch (error) {
      console.error('Error generating text:', error);
      return 'Sorry, something went wrong while generating the response.';
      }
  }
  async function formattedAnswer(answer) {
          
      const prompt = ` 
      Organize the information in a clear and readable format using bullet points or short sentences. 
      Use bold text when necessary to highlight important elements or keys. 
      For example, format keys like this: **key**.
      Do not use any programming terms like JSON, keys, or objects. 
      Do not include any symbols like {}, [], :, <>, or anything that a non-technical person might find confusing. 
      
      Here is the data to explain: ${answer}
      `; 

      try {
      setIsLoading(true)
      const response = await fetch(openAiUrl + 'generate-text', {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt: prompt })
      });
      if (!response.ok) {
          setIsLoading(false)
          throw new Error('Failed to generate text');
      }
      const data = await response.json(); // Parse response once
      console.log(data);
      addMessage('server', data);
      } catch (error) {
      console.error('Error generating text:', error);
      return 'Sorry, something went wrong while generating the response.';
      }
  }

  const handleSubOptionClick = async (subOption) => {
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
      formattedAnswer(JSON.stringify(subOptionData, null, 2));      
      }
  };

  const handleKeyDown = (event) => {
      if (event.key === 'Enter' && !event.shiftKey && currentMessage.trim() !== '') {
      event.preventDefault(); // Prevent default behavior
      addMessage('user', currentMessage); // Add user message to the conversation
      rawAnswer(currentMessage, data); // Pass the currentMessage and data to rawAnswer
      setCurrentMessage(''); // Clear the input field
      }
  };

  function parseBoldText(text) {
      const parts = text.split(/(\*\*.*?\*\*)/); // Split text into parts, keeping bold markers
      return parts.map((part, index) =>
      part.startsWith('**') && part.endsWith('**') ? (
          <strong key={index}>{part.slice(2, -2)}</strong> // Remove ** and wrap in <strong>
      ) : (
          <React.Fragment key={index}>{part}</React.Fragment>
      )
      );
  }

  const AIFormatText = async (text) => {
    const prompt = `re-write this text as an AI asssitant, dont use greetings, use a professional way of answer:  ${text}`; 
    try {
    setIsLoading(true)
    const response = await fetch(openAiUrl + 'generate-text', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt })
    });
    if (!response.ok) {
        setIsLoading(false)
        throw new Error('Failed to generate text');
    }
    const data = await response.json(); // Parse response once
    console.log(data);
    addMessage('server', data);
    } catch (error) {
    console.error('Error generating text:', error);
    return 'Sorry, something went wrong while generating the response.';
    }
  }


  return (
    <div className="chat-page h-screen overflow-hidden mx-auto">
      <Header />
      <img src={background} className="w-[50%] max-w-[150px] fixed left-[50%] top-[30%] transform -translate-x-[45%] z-[2] opacity-[0.05]" />
      <div className="container w-[98%] mx-auto z-1">
        <div className="max-w-[800px] m-auto bubbles relative h-[calc(100vh-110px)] p-[10px] z-[3] overflow-y-scroll rounded-t-lg pt-[70px]">
          {conversation.map((message, index) => (
            <div className={`row mb-[5px] flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`} key={index}>
              <div
                className={`${message.sender === 'user' ? 'user-bubble' : 'server-bubble'} max-w-[80%] w-fit min-w-[60px] py-[8px] px-[15px] rounded-2xl text-left ${message.sender === 'user' ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}>
                {(typeof message.text === 'string' ? message.text.split('\n') : [message.text]).map((textPart, idx) => (
                  <React.Fragment key={idx}>
                    {/* <Typewriter text={message.t} /> */}
                    {parseBoldText(textPart)}
                    <br />
                  </React.Fragment>
                ))}
                <p className={`${message.sender === 'user' ? 'text-right' : 'text-left'} text-[6px] lowercase mt-[2px] mb-[-3px]`}>
                  {message.timestamp ? message.timestamp.split('|')[1] : ''}
                </p>
              </div>
            </div>
          ))}

          {isLoading ? (
              <Loader />
            ):(
            <>
              <Menu onOptionSelect={handleOptionClick} />
              {/* Show submenu options if `showOptions` is true and a category is selected */}
              {showOptions && selectedCategory && submenuOptions.length > 0 && (
                <div className="submenu-container my-4">
                  <p className="text-gray-600 text-left">Select an option:</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {submenuOptions.map((subOption, index) => (
                      <button key={index} onClick={() => handleSubOptionClick(subOption)} className="bg-gray-200 text-gray-700 py-3 px-3 rounded-2xl hover:bg-blue-600 hover:text-white">
                        {capitalize(subOption)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            
              </>
            )}
        </div>
        
        {/* Text area for user input */}
        <div className="max-w-[800px] w-full  mx-auto h-[100px] fixed bottom-[10px] left-1/2 transform -translate-x-1/2 bg-white z-50">
          <textarea
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            value={currentMessage}
            placeholder="Ask me something ..."
            className="w-[98%] mx-auto h-full p-2 mx-auto resize-none outline-none rounded-lg border border-gray-300 text-[16px]"
          />
        </div>
        
      </div>
    </div>
  );
}

export default Chat;
