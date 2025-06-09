// app/api/analyze-garment/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const dynamic = "force-dynamic"; // <-- ADD THIS LINE

const API_URL = "https://api.openai.com/v1/chat/completions";
const API_KEY = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  try {
    if (!API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not set" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { base64Image } = body;

    if (!base64Image) {
      return NextResponse.json(
        { error: "Missing image data" },
        { status: 400 }
      );
    }

    const prompt = `
Analyze this fashion garment and reply ONLY with JSON like:
{
  "gender": "MALE",
  "type": "BOTTOM"
}
Rules:
- No markdown (no \`\`\`)
- Use only MALE, FEMALE for gender
- Use only TOP, BOTTOM, DRESS for type
- DO NOT explain anything or add extra text
`;

    const response = await axios.post(
      API_URL,
      {
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`,
                },
              },
            ],
          },
        ],
        max_tokens: 300,
        temperature: 0.2,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    let content = response.data.choices[0]?.message?.content || "";
    content = content.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(content);

    return NextResponse.json(parsed, { status: 200 });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { error: "Failed to analyze garment" },
      { status: 500 }
    );
  }
}
