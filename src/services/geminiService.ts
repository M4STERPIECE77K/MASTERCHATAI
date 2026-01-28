
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Message } from "../../types";

export class GeminiService {
    private ai: GoogleGenerativeAI;

    constructor() {
        this.ai = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY || '');
    }

    async *streamChat(messages: Message[]): AsyncGenerator<string> {
        try {
            const chat = this.ai.getGenerativeModel({
                model: 'gemini-1.5-flash-latest',
                systemInstruction: "You are MASTERCHATAI, a world-class AI assistant. You provide concise, accurate, and helpful information. Format your output in clean Markdown.",
            });

            const lastMessage = messages[messages.length - 1];
            const history = messages.slice(0, -1).map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content || (msg.attachments ? `[Selected ${msg.attachments.length} files]` : "Empty message") }]
            }));

            const chatSession = chat.startChat({ history });

            const promptParts: any[] = [];
            
            // Add text content if present
            if (lastMessage.content) {
                promptParts.push({ text: lastMessage.content });
            }

            // Process attachments
            if (lastMessage.attachments && lastMessage.attachments.length > 0) {
                for (const attachment of lastMessage.attachments) {
                    if (attachment.type.startsWith('image/')) {
                        // Handle images with base64 data
                        const base64Data = attachment.url.split(',')[1];
                        if (base64Data) {
                            promptParts.push({
                                inlineData: {
                                    data: base64Data,
                                    mimeType: attachment.type
                                }
                            });
                        }
                    } else if (
                        attachment.type.startsWith('text/') || 
                        attachment.type === 'application/json' ||
                        attachment.type === 'application/javascript' ||
                        attachment.type === 'application/xml' ||
                        attachment.name.match(/\.(txt|md|csv|log|js|ts|tsx|jsx|py|java|cpp|c|h|css|html|xml|json|yaml|yml)$/i)
                    ) {
                        // Handle text-based files
                        try {
                            const base64Data = attachment.url.split(',')[1];
                            if (base64Data) {
                                const textContent = atob(base64Data);
                                promptParts.push({ 
                                    text: `\n\n--- Content of file "${attachment.name}" ---\n${textContent}\n--- End of file ---\n` 
                                });
                            }
                        } catch (error) {
                            console.error(`Error reading file ${attachment.name}:`, error);
                            promptParts.push({ 
                                text: `\n[Unable to read file: ${attachment.name}]` 
                            });
                        }
                    } else if (attachment.type === 'application/pdf') {
                        // PDFs need special handling - inform user
                        promptParts.push({ 
                            text: `\n[PDF file attached: ${attachment.name}. Note: PDF content extraction is limited. Please describe what you need from this PDF.]` 
                        });
                    } else {
                        // Other file types
                        promptParts.push({ 
                            text: `\n[File attached: ${attachment.name} (${attachment.type}). This file type may not be fully supported. Please describe what you need.]` 
                        });
                    }
                }
            }

            // If no content or attachments, add a default message
            if (promptParts.length === 0) {
                promptParts.push({ text: "Hello" });
            }

            const responseStream = await chatSession.sendMessageStream(promptParts);

            for await (const chunk of responseStream.stream) {
                const text = chunk.text();
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
