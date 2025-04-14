import { GAME_ITEMS, PLAYER_DEFAULT } from './game-constants';
import { GameState } from './game-types';
import { generateRandomPosition } from './game-utils';

export const createDefaultGameState = (): GameState => {
    const items = GAME_ITEMS.map((id, index) => {
        const { x, y } = generateRandomPosition();
        return {
            id,
            x,
            y,
            width: 50,
            height: 50,
            collected: false,
        };
    });

    return {
        player: { ...PLAYER_DEFAULT },
        currentItemIndex: 0,
        items,
        keys: {
            up: false,
            down: false,
            left: false,
            right: false,
            w: false,
            a: false,
            s: false,
            d: false,
        },
        gameComplete: false,
    };
};

export const defaultGameState = createDefaultGameState();
