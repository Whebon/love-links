import Gamegui = require('ebg/core/gamegui');
import { GemstoneColor } from './GemstoneColor';

/**
 * Global static singleton reference to the main page
 */
export class StaticLoveLinks {
    public static page: Gamegui & {
        supply: any;
        nextAction: () => void;
        getGemstoneColor: (player_id: number) => GemstoneColor;
    };
}
