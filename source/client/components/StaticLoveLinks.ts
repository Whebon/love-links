import Gamegui = require('ebg/core/gamegui');

/**
 * Global static singleton reference to the main page
 */
export class StaticLoveLinks {
    public static page: Gamegui & {
        nextAction: () => void;
    };
}
