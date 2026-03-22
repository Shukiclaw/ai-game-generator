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

export interface GameSpec {
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
  initialState: GameState;
  components: GameComponent[];
  logic: {
    onInit?: string;
    onAction?: Record<string, string>;
    onTimer?: string;
  };
}

export interface GeneratedGame {
  spec: GameSpec;
  timestamp: number;
}
