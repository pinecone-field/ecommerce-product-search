// components/ChatComponent.js
import { useState } from 'react';
import '../styles/chat-styles.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const SearchComponent = () => {

  const [inputValue, setInputValue] = useState('');
  const [pineconeContext, setPineconeContext] = useState(null);
  const [chatResponse, setChatResponse] = useState(null);
  const [price, setPrice] = useState(1000.00);
  const startDate = new Date('2009-01-01');
  const [selectedDate, setSelectedDate] = useState(startDate);
  let rowCount = 1;

  const handlePineconeQuery = async (embedding, price, selectedDate) => {
    console.log("handle pinecone query");
    try {

        const requestBody = {
          embedding: embedding,
          price: price,
          dateFilter: selectedDate
        };
       
        const response = await fetch('/api/pinecone', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch embedding');
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error generating embedding:", error);
      }
    };
  
  const handleGenerateEmbedding = async () => {
  
    try {
        const response = await fetch('/api/openai-create-embedding', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputValue }),
        });
      
        if (!response.ok) {
          throw new Error('Failed to fetch embedding');
        }
        
        const data = await response.json();
        console.log(data);
        return data;
      } catch (error) {
        console.error("Error generating embedding:", error);
    }
  };

  const handleChatCompletion = async (inputValue, pineconeContext) => {
  
    try {
        const requestBody = {
          inputValue: inputValue,
          pineconeContext: pineconeContext,
        };

        const response = await fetch('/api/openai-chat-completion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
      
        if (!response.ok) {
          throw new Error('Failed to fetch embedding');
        }
      
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error generating genai response:", error);
      }
  };

  const handleSemanticSearchButtonClick = async () => {
    setPineconeContext(null);
    setChatResponse(null);
    const embedding = await handleGenerateEmbedding();
    const pineconeContext = await handlePineconeQuery(embedding, price, selectedDate);
    setPineconeContext(pineconeContext);
  };

  const handleGenAIButtonClick = async () => {
    setPineconeContext(null);
    setChatResponse(null);
    const embedding = await handleGenerateEmbedding();
    const pineconeContext = await handlePineconeQuery(embedding, price, selectedDate);
    const gptResponse = await handleChatCompletion(inputValue, pineconeContext);
    setChatResponse(gptResponse);
    setPineconeContext(pineconeContext);
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const convertUnixTimestampToMMDDYYYY = (unixTimestamp) => {
    const date = new Date(unixTimestamp * 1000); // Convert from seconds to milliseconds
  
    // Get the individual date components
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to month since it's zero-based
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
  
    // Create the MM/DD/YYYY date string
    const formattedDate = `${month}/${day}/${year}`;
  
    return formattedDate;
  };
  
  return ( 
    <div>
      <div className="form-container">
        <div>
          <label>Maximum Price:</label>
          <input
            type="text"
            value={price}
            onChange={handlePriceChange}
            placeholder="Enter max price"
          />
        </div>
        <div>
        <label>Release Date After:</label>
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="MM/dd/yyyy"
          isClearable
          showYearDropdown
          scrollableYearDropdown
        />
    </div>
    </div>
      <div className="chatInput">
        <textarea className='textarea'
          rows="3"
          cols="70"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSemanticSearchButtonClick} className='button'>Semantic</button>
        <button onClick={handleGenAIButtonClick} className='button'>Gen AI</button>
      </div>
      <div>
          {chatResponse && (
            <div>
              <h3 className='resultTitle'>Search Result - GenAI</h3>
              <div className='one-column-container'>
                <pre>{chatResponse}</pre>
              </div>
             
            </div>
          )}
          {pineconeContext && (
          <div>
            <h3 className='resultTitle'>Search Result - Semantic </h3>
              {pineconeContext.matches.map((match) => 
                (
                <div className='two-column-container'>
                  <div key={match.id} className="two-column-item">
                    <div className="left-column">
                      <b>{rowCount++}</b>
                    </div>
                    <div className="right-column">
                      <p><b>Supplier: </b> {match.metadata.supplier}</p>
                      <p><b>Title: </b><a href={match.metadata.img_high} target='_blank' className='titleLink'>{match.metadata.title}</a></p>
                      <p><b>Short Description: </b> {match.metadata.short_description}</p>
                      <p><b>Name: </b> {match.metadata.name}</p>
                      <p><b>ID: </b> {match.metadata.id}</p>
                      <p><b>Price: </b> {match.metadata.price}</p>
                      <p><b>Date Released: </b> {convertUnixTimestampToMMDDYYYY(match.metadata.date_released)}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;
