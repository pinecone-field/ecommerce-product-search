// pages/api/openai-create-embedding.js
import OpenAI from 'openai';

export default async (req, res) => {
  console.log("openai-create-embedding");
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { inputValue } = req.body;

  try {
    const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY
    });
    
    const response = await openai.embeddings.create({
      input: inputValue,
      model: "text-embedding-ada-002"
    });
    const embedding = response.data;
    res.status(200).json(embedding);
   
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch OpenAI embedding.' });
  }
};