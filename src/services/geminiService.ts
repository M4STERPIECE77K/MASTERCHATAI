
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../../types";

export class GeminiService {
    private ai: GoogleGenAI;

    constructor() {
        this.ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY || '' });
    }

    async *streamChat(messages: Message[]): AsyncGenerator<string> {
        try {
            const history = messages.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            }));
            const lastMessage = history.pop();
            if (!lastMessage) return;

            const chat = this.ai.chats.create({
                model: 'gemini-3-flash-preview',
                config: {
                    systemInstruction: "You are MASTERCHATAI, a world-class AI assistant. You provide concise, accurate, and helpful information. Format your output in clean Markdown.",
                }
            });
            const responseStream = await chat.sendMessageStream({
                message: lastMessage.parts[0].text
            });

            for await (const chunk of responseStream) {
                const text = (chunk as GenerateContentResponse).text;
                if (text) {
                    yield text;
                }
            }
        } catch (error) {
            console.error("Gemini API Error:", error);
            yield "Error: Unable to process request. Please check your connection and try again.";
        }
    }
}

export const geminiService = new GeminiService();
