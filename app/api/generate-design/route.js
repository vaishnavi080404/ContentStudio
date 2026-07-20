import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      templateCategory,
      templateId,
      formData,
      canvasWidth,
      canvasHeight,
    } = body;

    const prompt = `You are a professional graphic designer. Generate a complete design layout for a ${templateCategory} design.

Canvas size: ${canvasWidth}x${canvasHeight}px

User details:
${Object.entries(formData)
  .map(([key, val]) => `- ${key}: ${val}`)
  .join("\n")}

Return a JSON object with this exact structure:
{
  "bgColor": "#hexcolor",
  "headline": {
    "text": "...",
    "fontSize": 48,
    "fontFamily": "Playfair Display",
    "color": "#hexcolor",
    "left": 75,
    "top": 60,
    "width": ${canvasWidth - 150},
    "textAlign": "left",
    "fontWeight": "bold"
  },
  "subheading": {
    "text": "...",
    "fontSize": 24,
    "fontFamily": "Raleway",
    "color": "#hexcolor",
    "left": 75,
    "top": 140,
    "width": ${canvasWidth - 150},
    "textAlign": "left"
  },
  "bodyText": {
    "text": "...",
    "fontSize": 16,
    "fontFamily": "Raleway",
    "color": "#hexcolor",
    "left": 75,
    "top": 200,
    "width": ${canvasWidth - 150},
    "textAlign": "left"
  },
  "shapes": [
    {
      "fabricType": "rect",
      "left": 0,
      "top": 0,
      "width": ${canvasWidth},
      "height": 8,
      "fill": "#hexcolor"
    }
  ]
}

Rules:
- Choose fonts that match the mood (luxury: Playfair Display/Cormorant Garamond, modern: Poppins/Montserrat, friendly: Nunito/Quicksand)
- Create a cohesive color palette — bgColor and text colors must have good contrast
- shapes array can have 1-5 decorative shapes (rects, circles) positioned tastefully
- All positions must fit within ${canvasWidth}x${canvasHeight}
- Make it look professional and attractive
- Text content must match the user's provided details
- For festival/celebration designs use warm vibrant colors
- For business/corporate use clean professional colors
- For social media use bold eye-catching colors`;

    // free tier gets deprioritized under load, so 503s are common and usually
    // resolve themselves within a couple seconds — retry before giving up
    let response;
    let lastErr;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        response = await ai.models.generateContent({
          model: "gemini-flash-latest",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        });
        break;
      } catch (err) {
        lastErr = err;
        console.error(`attempt ${attempt + 1} failed — status: ${err.status}, message: ${err.message}`);
        const isOverloaded = err.status === 503 || err.message?.includes("overloaded");
        if (!isOverloaded || attempt === 2) throw err;
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1))); // 1s, 2s backoff
      }
    }

    // res.text can come back empty if the model got blocked/truncated, so guard it
    const raw = response.text;
    if (!raw) {
      throw new Error("Empty response from Gemini");
    }

    const design = JSON.parse(raw);
    console.log("generated design:", JSON.stringify(design, null, 2));

    return NextResponse.json({ design });
  } catch (err) {
    console.error("generate-design error:", err);

    // send a proper error response instead of crashing
    return NextResponse.json(
      { error: err.message || "Failed to generate design" },
      { status: 500 },
    );
  }
}