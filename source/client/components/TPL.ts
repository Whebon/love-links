import Gamegui = require("bga-ts-template/typescript/types/ebg/core/gamegui");

/**
 * HTML Templates
 */
export class TPL {
    private static page: Gamegui;

    public static init(page: Gamegui) {
        TPL.page = page;
    }
    
    public static stockTitle(player_id: string): string {
        const player = TPL.page.gamedatas.players[+player_id]!;
        const name = TPL.page.getCurrentPlayerId() == +player_id ? _("Your") : player.name+_("\'s");
        return `
            <span style="color:#${player.color};">${name}</span> ${_("stock")}
        `
    }
}