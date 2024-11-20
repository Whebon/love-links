import Gamegui = require('ebg/core/gamegui');
import { GemstoneColor } from './GemstoneColor';
import { Supply } from './Supply';

/**
 * Global static singleton reference to the main page
 */
export class StaticLoveLinks {
    public static page: Gamegui & {
        supply: Supply | undefined;
        nextAction: () => void;
        getGemstoneColor: (player_id: number) => GemstoneColor;
    };
}
