import { NextRequest, NextResponse } from "next/server";
import { GameSpec } from "../../types/game";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const GAME_GENERATOR_PROMPT = `You are an AI game generator. Create a game specification in JSON format based on the user's description.

Available components:
- Card: A flip card (for memory games) with front/back content
- Button: Interactive button with variants (primary, secondary, danger, success)
- Grid: Layout container with configurable columns
- ScoreBoard: Displays score, highScore, turns, level
- Timer: Countdown or count-up timer display
- QuestionCard: Shows a question with category/difficulty
- AnswerOption: Multiple choice answer button
- Clicker: Large clickable target for clicker games
- Upgrade: Purchaseable upgrade with cost and effects
- GameOver: End game screen with restart options

The game spec must follow this TypeScript interface:

interface GameSpec {
  name: string;
  description: string;
  theme: {
    colors: {
      primary: string;
      secondary: string;
      background: string;
      text: string;
    };
    font: string;
  };
  initialState: {
    score: number;
    turns: number;
    timer: number;
    isPlaying: boolean;
    gameOver: boolean;
    [key: string]: any;
  };
  components: Array<{
    type: string;
    props?: Record<string, any>;
    children?: any[];
  }>;
}

Rules:
1. Keep games simple and playable
2. Use hex color codes for theme
3. initialState must include all game state variables needed
4. Create engaging, interactive games
5. Memory games need cards with values (emojis work great)
6. Quiz games need questions and answers
7. Clicker games need upgrades and click targets
8. Always include ScoreBoard for scoring

Respond ONLY with valid JSON. No markdown, no code blocks, just the JSON object.`;

export async function POST(request: NextRequest) {
  if (!OPENROUTER_API_KEY) {
    return NextResponse.json(
      { error: "OPENROUTER_API_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    const { description } = await request.json();

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "Description is required" },
        { status: 400 }
      );
    }

    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://ai-game-generator.vercel.app",
        "X-Title": "AI Game Generator",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-flash-001",
        messages: [
          { role: "system", content: GAME_GENERATOR_PROMPT },
          { role: "user", content: `Create a game: ${description}` }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `OpenRouter API error: ${error}` },
        { status: 500 }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: "No content in response" },
        { status: 500 }
      );
    }

    // Extract JSON from the response
    let jsonStr = content;
    
    // Try to extract JSON from markdown code blocks
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }
    
    // Remove any leading/trailing whitespace and newlines
    jsonStr = jsonStr.trim();
    
    // Handle potential trailing commas in JSON
    jsonStr = jsonStr.replace(/,\s*([}\]])/g, "$1");

    try {
      const gameSpec: GameSpec = JSON.parse(jsonStr);
      return NextResponse.json({ game: gameSpec });
    } catch (e: any) {
      console.error("Failed to parse game spec:", content);
      return NextResponse.json(
        { error: `Failed to parse game specification: ${e.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
