import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are a helpful disaster management assistant. You specialize in:

1. Emergency Response Planning
2. Risk Assessment and Mitigation
3. Evacuation Procedures
4. Resource Management
5. Communication Protocols
6. Post-Disaster Recovery
7. Business Continuity Planning
8. Public Safety Information

Provide accurate, helpful, and actionable advice. Always prioritize safety and follow established emergency management best practices. If you're unsure about specific local procedures, recommend consulting local emergency management authorities.

Keep responses concise but informative. For emergency situations, provide immediate actionable steps first, then additional context.`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ reply: "Gemini API key not set." }, { status: 500 });
    }

    // Initialize Gemini client
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Prepend system prompt to the conversation
    const systemMessage = {
      role: "user",
      parts: [{ text: SYSTEM_PROMPT }],
    };

    const systemResponse = {
      role: "model",
      parts: [{ text: "I understand. I'm ready to assist with disaster management questions and provide helpful, safety-focused guidance." }],
    };

    // Convert OpenAI-style messages to Gemini's format
    const geminiMessages = [
      systemMessage,
      systemResponse,
      ...messages.map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : msg.role,
        parts: [{ text: msg.content }],
      }))
    ];

    // Send to Gemini
    const result = await model.generateContent({ contents: geminiMessages });
    const response = result.response;
    const reply = response.text();
    
    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ reply: "AI error: " + error.message }, { status: 500 });
  }
}
