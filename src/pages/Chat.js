import React, { useEffect, useState } from 'react'
import greenBubble from '../images/greenbubble.png'
import grayBubble from '../images/graybubble.png'
import background from '../images/logo.png'
import Header from '../components/Header'
import { getFirestore, doc, getDoc, collection, addDoc, query, getDocs, } from 'firebase/firestore';
import { app } from '../Firebase';


function Chat() { 
    const [currentMessage, setCurrentMessage] = useState('')
    const [conversation,setConversation] = useState([])
    const [serverResponse, setServerResponse] = useState('')
    const [waitingResponse, setWaitingResponse] = useState(false)
    const [prompt, setPrompt] = useState('')


    const companyInfoString = `
    Company Name: TTF SCAFFOLDING
    Description: **IMPORTANT:** At TTF SCAFFOLDING, we specialize **exclusively** in scaffolding rental services for **formwork and slabbing**. We do not provide scaffolding for any other types of construction or purposes—**only** for slabbing and formwork.
    About Us: In TTF SCAFFOLDING, we take pride in our extensive expertise in Suspended Slab Shoring Rental and Engineering in Greater Vancouver. Our commitment to excellence and safety sets us apart as a reliable choice for construction professionals focused on slabbing and formwork. With years of experience in the industry, we are dedicated to delivering top-quality equipment and unparalleled service to ensure the success of your slabbing and formwork projects—**nothing else**.
    Products: Aluminum Frames: 10K Aluminum Shoring Frames are made of a special high-strength aluminum alloy. Their strength / lite-weight ratio greatly facilitates handling and erecting. The horizontal (serrated) ledgers make climbing safer and help to secure wood planks. Jet Locks are spaced at 605mm (2ft) centers to enable frames to be inter-braced with standard Cross Braces when erected more than one tier high. 10K Shoring System is built to safely support loads of up to 10,000 pounds/leg with a Factor of Safety of 2.5:1 per CSA and SSFI. Frame capacities vary, depending on the number of tiers in height, the lengths of extensions, amount of bracing, whether inter-bracing has been used, and if there are any lateral or wind loads imposed. The normal testing configuration of the 10K Shoring System exceeds the requirements of both the CSA and the SSFI of the USA. A tower, 3 tiers high, consisting of 6ft high frames, with Screw Jacks extended 12”, top and bottom, is loaded to failure. The load rating of the frames is then determined by dividing the failure load by the required Safety Factor. Available Sizes: 6’H x 4’W, 5’H x 4’W, 4’H x 4’W.
     Also, we have Steel Frames: Steel Shoring Frames are made of high-quality steel tubes and accessories which are galvanized or painted. Using the component and accessories, Steel Frames can be adapted to any geometry, steps, and slopes. The 10K Steel Shoring System is built to safely support loads of up to 4,535 kg (10,000 lb) with a Factor of Safety of 2.5:1 per CSA and SSFI. Frame capacities vary, depending on the number of tiers in height, the lengths of extensions, amount of bracing, whether inter-bracing has been used, and if there are any lateral or wind loads imposed. Available Sizes: 6’H x 4’W, 5’H x 4’W, 4’H x 4’W, 3’H x 4’W.
    Services: Scaffolding rental **exclusively** for slabbing and formwork, Custom scaffolding solutions **only** for slabbing and formwork, Delivery and pickup, Safety equipment guidelines.
    Contact Information: Email - info@ttfscaffolding.com, Phone - 778 898 5301, Address - 10979 Olsen Rd, Surrey, BC V3V 3S9, Canada.
  `;

    const openAiUrl = process.env.REACT_APP_APIURL;
    // const openAiUrl = 'http://192.168.1.205:4000';

    useEffect(()=>{
        const bubblesElement = document.getElementById('bubbles');
        if (bubblesElement) {
            bubblesElement.scrollTop = bubblesElement.scrollHeight;
        }
    },[conversation])

    useEffect(()=>{
        if(serverResponse !== ''){
            addMessage('server', serverResponse)   
        }
    },[serverResponse])

    function getTimeStamp(){
        const timestamp = new Date();
        const date = timestamp.toLocaleDateString();
        const time = timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return `${date}|${time}`;
    }

    const addMessage = (sender, text) => {
        const newMessage = {
          sender: sender,
          timestamp: getTimeStamp(),
          text: text
        };
        setConversation([...conversation, newMessage]);
        setCurrentMessage('')
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey && currentMessage !== '') {
          event.preventDefault(); // Prevent new line (unless Shift is pressed)
         newUserMessage()
        }
    };
    
    function newUserMessage(){
        sendRequest()
        addMessage('user', currentMessage); // Add the message
        setCurrentMessage(''); // Clear the current message
    }
    function formatConversation() {
      return conversation
        .map((message) => `${message.sender === 'user' ? 'User' : 'Assistant'}: ${message.text}`)
        .join('\n');
    }
    
    async function sendRequest() {
        setWaitingResponse(true);
        
        // Include the entire conversation history in the prompt
        const formattedConversation = formatConversation();
        const fullPrompt = `
          Answer **only** using the information provided below,
          short answers only, do not provide all the given information, only the answer,
          You are a virtual assistant for TTF SCAFFOLDING. Answer **only** using the information provided below.
          If the user asks something that is not covered in the information, respond with:
          "I'm sorry, I don't have that information available. " then provide contact information for futher inquiries.
          Here is the conversation so far:
          ${formattedConversation}
          
          Now, respond to the user's latest message: ${currentMessage} with this information: ${companyInfoString}.
        `;
        
        try {
            const response = await fetch('https://open-ai-ttf.vercel.app/generate-text', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ prompt: fullPrompt })
            });
      
            if (!response.ok) {
              throw new Error('Failed to generate text');
            }
      
            const data = await response.json();
            setServerResponse(data);
            setWaitingResponse(false);
        } catch (error) {
            console.error('Error generating text:', error);
            setWaitingResponse(false); // Stop waiting even in case of an error
        }
    }

  
  return (
    <div className='chat-page'>
      <Header />
      <img src={background} className='background'/> 
      
      <div className='container'>
        <div className='bubbles' id="bubbles">
          {conversation.map((message, index) => (
              <div className='row' key={index}>
                <div className={message.sender == 'user' ?'user-bubble':'server-bubble'}>
                {message.text.split('\n').map((textPart, idx) => (
                    <React.Fragment key={idx}>
                      {textPart}
                      <br></br>
                    </React.Fragment>
                  ))}
                  <p className={message.sender === 'user' ? 'user-time-delivery' : 'server-time-delivery'}>{message.timestamp.split('|')[1]}</p>
                </div>
                <img src={message.sender === 'user' ? greenBubble : grayBubble} className={message.sender == 'user' ?'user-tail':'server-tail'}/>
              </div>
            ))}
            <div className='waiting' style={{display: waitingResponse ? "block":"none"}}>
              <div className='writting'>
                <i className="bi bi-circle-fill circle"></i>
                <i className="bi bi-circle-fill circle"></i>
                <i className="bi bi-circle-fill circle"></i>
              </div>
              <img src={grayBubble} className='server-tail'/>
            </div>

        </div>
        <div className='input-area'>
          <div className='container'>
              <div id="txt">
                  <textarea onChange={(e)=>setCurrentMessage(e.target.value)} onKeyDown={handleKeyDown} value={currentMessage} placeholder='Ask me something ...'/>
              </div>
              <div id="sbmt">
              <i className="bi bi-arrow-up-circle-fill iconBtnSbmt" onClick={() => currentMessage !== '' && newUserMessage()}></i>
              </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
