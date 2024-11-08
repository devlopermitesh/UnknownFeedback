// src/app/api/suggest-message/route.ts

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

interface GenerateRequestBody {
  input: string;
}

interface GenerateResponse {
  response: string;
  error?: string;
}

// POST method handle karne ke liye named export
export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  // Agar API key nahi milti, toh error response bhejte hain
  if (!apiKey) {
    return NextResponse.json({ response: '', error: 'API key is missing' }, { status: 500 });
  }

  try {
    // Google AI client ko initialize karte hain
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash', // Model name
    });

    // Generation configuration
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: 'text/plain',
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
  const prompt="Please create a list of three open-ended and engaging questions formatted as a single string, with each question separated by ||. These questions are intended for an anonymous social messaging platform, similar to Qooh.me, and should be appropriate for a diverse audience. Focus on universal themes that encourage friendly and positive interaction, avoiding personal or sensitive topics. The questions should be intriguing and foster curiosity, contributing to a welcoming and inclusive conversational environment. For example, your output should be formatted like this: What's a hobby you've recently started? || If you could have dinner with any historical figure, who would it be? || What's a simple thing that makes you happy?"
    

    // Chat session ko message bhejte hain aur response lete hain
    const result = await chatSession.sendMessage(prompt);
    return NextResponse.json({ response: result.response.text() });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ response: '', error: 'Error generating response' }, { status: 500 });
  }
}
