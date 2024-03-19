// openAI.ts
import OpenAI from "openai";
const openai = new OpenAI({ apiKey: `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`,  dangerouslyAllowBrowser: true });

export const callOpenAI = async (prompt: string) => {
  const completion = await openai.chat.completions.create({
    messages: [{ role: "assistant", content: prompt }],
    model: "gpt-4-0125-preview",
  });
  return completion.choices[0].message.content;
}