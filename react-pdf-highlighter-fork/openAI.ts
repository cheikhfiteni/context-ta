// openAI.ts
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: `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`,  dangerouslyAllowBrowser: true });

// Need to only handle the first prompt and otherwise loop the prompts together.
// Can make reference to specific text later
const handlePrompt = (text: string, chatInput: string) => {
  return "Make a reference to this specific highlighted text: " + text + "\n" + chatInput;
}

export const callOpenAI = async (prompt: string) => {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "assistant", content: prompt }],
    model: "gpt-4-0125-preview",
  });
  return completion.choices[0].message.content;
}

export const callOpenAIStream = async (messages: any[], onChunkReceived: (chunk: string) => void) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-4-0125-preview",
    messages: messages,
    stream: true,
  });

  for await (const chunk of completion) {
    if (chunk.choices[0].delta && chunk.choices[0].delta.content) {
      onChunkReceived(chunk.choices[0].delta.content);
    }
  }
}