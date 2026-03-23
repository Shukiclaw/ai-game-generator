import { NextRequest, NextResponse } from "next/server";
import { GameSpec } from "../../types/game";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const GAME_GENERATOR_PROMPT = `You are an expert AI game designer and developer. Create unique, engaging game specifications in JSON format based on the user's description.

## AVAILABLE COMPONENTS (Use creatively for rich gameplay):

BASIC UI:
- Card: Flip cards for memory games. Props: value (emoji), isFlipped, isMatched, onClick
- Button: Interactive buttons. Props: variant (primary/secondary/danger/success/neon), size, onClick
- Grid: Layout container. Props: columns (1-6), gap

GAMEPLAY & DISPLAY:
- ScoreBoard: Display score/highScore/turns/level
- Timer: Countdown/count-up with progress bar. Props: seconds, maxSeconds, format (seconds/minutes)
- QuestionCard: Quiz question with category/difficulty badges
- AnswerOption: Multiple choice with A/B/C/D lettering
- Clicker: Large circular click target. Props: emoji, size (sm/md/lg/xl)
- Upgrade: Purchaseable upgrade cards. Props: name, description, cost, effect, owned

NEW ADVANCED COMPONENTS:
- Entity: Characters/enemies that move. Props: x, y, emoji, color, health, maxHealth, isPlayer, onClick
- Projectile: Shots/missiles. Props: x, y, direction (up/down/left/right), emoji, trail
- Collectible: Items to collect. Props: type (coin/star/gem/heart/powerup), emoji, value, onCollect
- Obstacle: Things to avoid. Props: x, y, type (spike/block/laser/pit/enemy), damage, isMoving
- HealthBar: HP display. Props: current, max, label, showValue, variant (default/segmented/hearts), size
- ProgressBar: Progress tracking. Props: value, max, label, showPercentage, color
- AnimatedSprite: Animated game sprites. Props: frames (emoji array), frameRate, isPlaying, size
- PhysicsBody: Physics-enabled objects with gravity/bounce. Props: x, y, vx, vy, emoji, color, mass
- Draggable: Draggable puzzle pieces. Props: id, x, y, emoji, label, snapToGrid, gridSize
- ParticleEffect: Visual effects. Props: type (explosion/sparkle/smoke/hearts/stars), count, color
- Joystick: Mobile-style controls. Props: size, onMove(x, y), onEnd
- PowerUp: Temporary boost buttons. Props: type (speed/shield/double/magnet/freeze), duration, isActive
- GameContainer: Game area with grid background. Props: width, height

## GAME TYPE EXAMPLES & CREATIVE CONSTRAINTS:

SPACE SHOOTER (Entity + Projectile + HealthBar + ParticleEffect):
- Player Entity at bottom, enemy Entities spawning from top
- Projectile with direction="up" for player shots, "down" for enemies
- HealthBar for player HP and boss HP
- ParticleEffect type="explosion" on enemy death
- Collectible type="powerup" for weapon upgrades

PLATFORMER (PhysicsBody + Collectible + Obstacle):
- PhysicsBody with gravity for player character
- Collectible type="coin" scattered on platforms
- Obstacle type="spike" or "pit" to avoid
- Entity for enemies that patrol
- Joystick or Button for left/right movement and jump

PUZZLE DRAG (Draggable + Grid):
- Multiple Draggable components with snapToGrid=true
- Grid layout showing drop zones
- Collectible as reward for completing puzzle
- ProgressBar showing puzzle completion percentage

RACING GAME (Entity + Joystick + ProgressBar):
- Entity for player car with emoji
- Joystick for steering control
- ProgressBar showing race progress
- Obstacle for other cars/road hazards
- ParticleEffect type="smoke" for tire burnout

RPG BATTLE (HealthBar + Entity + PowerUp):
- Two Entity components (player and enemy)
- HealthBar with variant="segmented" or "hearts"
- PowerUp buttons for special attacks
- Button for attack/defend actions
- ParticleEffect type="hearts" on heal, "stars" on crit

## DESIGN PRINCIPLES:

1. THEME: Create cohesive color schemes:
   - Space: Deep purples (#1e1b4b), cyans (#06b6d4), neon blues
   - Nature: Forest greens (#166534), earth tones (#92400e), sky blues
   - Tech: Electric blues (#2563eb), hot pinks (#ec4899), cyans
   - Retro: Warm oranges (#f97316), yellows (#eab308), browns

2. COLORS: Always use hex codes. Suggestions:
   - Primary: #06b6d4 (cyan), #3b82f6 (blue), #8b5cf6 (purple)
   - Secondary: Complementary accent
   - Background: #0f172a (dark slate), #1e1b4b (deep indigo)
   - Text: #f8fafc (white), #e2e8f0 (light gray)

3. STATE MANAGEMENT: Include ALL needed state:
   - Core: score, turns, timer, isPlaying, gameOver
   - Game-specific: playerX, playerY, enemies[], projectiles[], collected[], health
   - UI: currentLevel, selectedItem, powerUps[]

4. COMPONENT ARRANGEMENT:
   - Header: ScoreBoard + Timer
   - Main: GameContainer with Entities/Collectibles/Obstacles positioned absolutely
   - Controls: Joystick, Buttons, or Draggable pieces
   - Feedback: ParticleEffect, HealthBar, ProgressBar

5. GAME BALANCE:
   - Reasonable difficulty curve
   - Clear win/lose conditions
   - Rewarding feedback (animations, sounds implied)

6. BE CREATIVE: Mix components in unexpected ways!
   - Draggable physics objects
   - Collectible that triggers ParticleEffect
   - PowerUp that modifies Entity speed
   - Obstacles that shoot Projectiles

## JSON STRUCTURE:

{
  "name": "Creative Game Title",
  "description": "Brief engaging description",
  "theme": {
    "colors": {
      "primary": "#06b6d4",
      "secondary": "#8b5cf6",
      "background": "#0f172a",
      "text": "#f8fafc"
    },
    "font": "Inter"
  },
  "initialState": {
    "score": 0,
    "turns": 0,
    "timer": 0,
    "isPlaying": true,
    "gameOver": false,
    // Add game-specific state
  },
  "components": [
    // Ordered array of components to render
  ],
  "logic": {
    "onInit": "initialization actions",
    "onAction": { "actionName": "handler" },
    "onTimer": "timer handler"
  }
}

CRITICAL RULES:
1. Respond ONLY with valid JSON - no markdown, no explanations
2. Use hex color codes in theme.colors
3. Position absolutely-positioned components (Entity, Obstacle, Collectible) with x,y coordinates
4. Include complete initialState with ALL variables
5. Create games that are actually playable and fun
6. Be creative - unexpected combinations make memorable games!
7. Ensure theme colors create good contrast and visual appeal
8. Use emojis liberally for visual elements - they're instant art!`;

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
        model: "moonshotai/kimi-k2.5",
        messages: [
          { role: "system", content: GAME_GENERATOR_PROMPT },
          { role: "user", content: `Create a game: ${description}` }
        ],
        temperature: 0.8,
        max_tokens: 6000,
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
