import { Pinecone } from '@pinecone-database/pinecone';

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY, 
    environment: process.env.PINECONE_ENVIRONMENT
  });
  
export default async (req, res) => {
    console.log("pinecone");
    
    console.log(req.body);
    
    if (req.method !== 'POST') {
      return res.status(405).end();
    }
    const embedding = req.body.embedding[0].embedding; 
    const priceFilter = parseFloat(req.body.price);
    const dateFilter = req.body.dateFilter;
    const unixTimestamp = Date.parse(dateFilter) / 1000;
    const topK = 10;

    try {
      const index = pinecone.index("verizon-products");
        
      if (isNaN(priceFilter)) {
        const data = await index.query({ topK: topK, vector: embedding, includeMetadata: true, 
                                         filter: { date_released: { "$gte": unixTimestamp }} });
        console.log(data);
        res.status(200).json(data);
      } else {
        const data = await index.query({ topK: topK, vector: embedding, includeMetadata: true, 
                                         filter: {"$and" : [{"price": { "$lte": priceFilter } }, 
                                                            { "date_released": { "$gte": unixTimestamp }}]
                                                 }});
        console.log(data);
        res.status(200).json(data);
      }

      

    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Failed to fetch OpenAI embedding.' });
    }
  };