export interface GameState {
  score: number;
  turns: number;
  timer: number;
  isPlaying: boolean;
  gameOver: boolean;
  [key: string]: any;
}

export interface GameComponent {
  type: string;
  props?: Record<string, any>;
  children?: GameComponent[] | string;
}

export interface GameTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  font: string;
}

export interface GameLogic {
  onInit?: string;
  onAction?: Record<string, string>;
  onTimer?: string;
}

export interface GameSpec {
  name: string;
  description: string;
  theme: GameTheme;
  initialState: GameState;
  components: GameComponent[];
  logic: GameLogic;
}

export interface GeneratedGame {
  spec: GameSpec;
  timestamp: number;
}

// Entity component props
export interface EntityProps {
  id?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  emoji?: string;
  color?: string;
  health?: number;
  maxHealth?: number;
  isPlayer?: boolean;
}

// Projectile component props
export interface ProjectileProps {
  id?: string;
  x: number;
  y: number;
  direction: "up" | "down" | "left" | "right";
  emoji?: string;
  color?: string;
  size?: number;
  speed?: number;
}

// Collectible component props
export interface CollectibleProps {
  id?: string;
  x?: number;
  y?: number;
  type: "coin" | "star" | "gem" | "heart" | "powerup" | "custom";
  emoji?: string;
  value?: number;
}

// Obstacle component props
export interface ObstacleProps {
  id?: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  type: "spike" | "block" | "laser" | "pit" | "enemy" | "custom";
  emoji?: string;
  color?: string;
  damage?: number;
}

// HealthBar component props
export interface HealthBarProps {
  current: number;
  max: number;
  label?: string;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "segmented" | "hearts";
}

// ProgressBar component props
export interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  color?: string;
  size?: "sm" | "md" | "lg";
}

// AnimatedSprite component props
export interface AnimatedSpriteProps {
  id?: string;
  x?: number;
  y?: number;
  frames: string[];
  frameRate?: number;
  isPlaying?: boolean;
  size?: number;
}

// PhysicsBody component props
export interface PhysicsBodyProps {
  id?: string;
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  width?: number;
  height?: number;
  mass?: number;
  emoji?: string;
  color?: string;
}

// Draggable component props
export interface DraggableProps {
  id: string;
  x: number;
  y: number;
  emoji?: string;
  label?: string;
  color?: string;
  size?: number;
  snapToGrid?: boolean;
  gridSize?: number;
}

// ParticleEffect component props
export interface ParticleEffectProps {
  id?: string;
  x: number;
  y: number;
  type?: "explosion" | "sparkle" | "smoke" | "hearts" | "stars";
  count?: number;
  color?: string;
  duration?: number;
}

// Joystick component props
export interface JoystickProps {
  size?: number;
}

// PowerUp component props
export interface PowerUpProps {
  id?: string;
  type: "speed" | "shield" | "double" | "magnet" | "freeze" | "custom";
  emoji?: string;
  name?: string;
  duration?: number;
  isActive?: boolean;
}

// GameContainer component props
export interface GameContainerProps {
  width?: number;
  height?: number;
}
