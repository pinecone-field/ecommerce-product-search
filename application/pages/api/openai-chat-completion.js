// pages/api/openai-chat-completion.js
import OpenAI from 'openai';

const convertUnixTimestampToMMDDYYYY = (unixTimestamp) => {

  if (unixTimestamp === null || unixTimestamp === undefined) {
    return "N/A";
  }

  const date = new Date(unixTimestamp * 1000); // Convert from seconds to milliseconds

  // Get the individual date components
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to month since it's zero-based
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();

  // Create the MM/DD/YYYY date string
  const formattedDate = `${month}/${day}/${year}`;

  return formattedDate;
};

export default async (req, res) => {
  console.log("openai-chat-completion");

  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  try {
    const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY
    });

    console.log("right before openai competion");
    console.log("context below");
    
    delete req.body.pineconeContext.matches[0].metadata["_node_content"];
    //hack to swap unix timestamp to something llm can understand
    req.body.pineconeContext.matches[0].metadata["date_released"] = convertUnixTimestampToMMDDYYYY(req.body.pineconeContext.matches[0].metadata["date_released"]);

    const context = JSON.stringify(req.body.pineconeContext.matches[0].metadata);
    const searchText = req.body.inputValue;
    console.log(context);
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{"role": "system", "content": "You are a helpful assistant."},
                 {"role": "user", "content": `Please answer this question: ${searchText}`},
                 {"role": "user", "content": `Using this product record data: ${context}`},
                 {"role": "user", "content": `Release date is equivalent to 'date_released'`},
                 {"role": "user", "content": "If record does not match inquiry, reply with '???'"},
                ],
    });
    
    const answer = response.choices[0].message.content;
    console.log(answer);
    
    res.status(200).json(answer);
   
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Failed to fetch OpenAI completion.' });
  }
};
