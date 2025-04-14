export interface Player {
    x: number;
    y: number;
    width: number;
    height: number;
    speed: number;
}

export interface GameItem {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    collected: boolean;
}

export interface GameKeys {
    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    w: boolean;
    a: boolean;
    s: boolean;
    d: boolean;
}

export interface GameState {
    player: Player;
    currentItemIndex: number;
    items: GameItem[];
    keys: GameKeys;
    gameComplete: boolean;
}

export interface Position {
    x: number;
    y: number;
}
