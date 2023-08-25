import { OpenAI as OpenAIApi } from "openai";

const OpenAI = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY,
});

export { OpenAI };
