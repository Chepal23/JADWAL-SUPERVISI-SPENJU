import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: "Anda adalah asisten kurikulum dan pedagogi profesional untuk SMP Negeri 7 Sentani. Gunakan informasi pencarian web terkini untuk memberikan jawaban yang akurat, terstruktur, dan mendidik terkait metode pembelajaran, RPP, Kurikulum Merdeka, atau materi pelajaran."
      }
    });

    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return NextResponse.json({ text, groundingChunks });
  } catch (error: any) {
    console.error("Gemini search error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
