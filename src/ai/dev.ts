import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-chat.ts';
import '@/ai/flows/generate-suggested-prompts.ts';
import '@/ai/flows/enhance-failed-response.ts';
import { chat } from '@/ai/flows/chat.ts';

import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Proxy route for the chat flow
app.post('/chatFlow', async (req, res) => {
  try {
    const result = await chat(req.body.data);
    res.json({ result });
  } catch (err: any) {
    console.error('Flow error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
});

// Run server
const PORT = 3400;
app.listen(PORT, () => {
  console.log(`🚀 Genkit dev API wrapper running on http://127.0.0.1:${PORT}`);
});
