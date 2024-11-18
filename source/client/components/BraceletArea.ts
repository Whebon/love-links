import Gamegui = require('ebg/core/gamegui');

import { StaticLoveLinks } from './StaticLoveLinks';
import { Bracelet } from "./Bracelet"
import { Link } from './Link';
import { Side } from './Side';

/**
 * Manages a collection of bracelets within an enclosed area
 */
export class BraceletArea {
    private container: HTMLElement;
    private player_id: number;

    public bracelets: Bracelet[];
    private onClickBracelet: (bracelet: Bracelet, link: Link, side: Side) => void;
    
    /**
     * @param parent HTML parent of the area
     * @param player_id owner of the area
     * @param title (optional) if provided, wrap the BraceletArea with a whiteblock and this title
     */
    constructor(parent: HTMLElement, player_id: number, title: string | undefined, onClickBracelet: (bracelet: Bracelet, link: Link, side: Side) => void) {
        this.bracelets = [];
        if (title) {
            const wrap = document.createElement('div');
            wrap.classList.add("whiteblock");
            parent.appendChild(wrap);
            wrap.innerHTML = `
                <h3 class="lovelinks-title">${title}</h3>
                <div class="lovelinks-bracelet-area"></div>
            `;
            this.container = wrap.querySelector(".lovelinks-bracelet-area")!;
        }
        else {
            this.container = document.createElement('div');
            this.container.classList.add("lovelinks-bracelet-area");
            parent.appendChild(this.container);
        }
        this.player_id = player_id;
        this.onClickBracelet = onClickBracelet;
    }

    /**
     * highlight all links that connect to the link
     */
    public highlightPossibleLinks(link: Link) {
        for (let i = 0; i < this.bracelets.length; i++) {
            const bracelet = this.bracelets[i]!;
            if (!bracelet.isComplete) {
                if (Link.isValidConnection(bracelet.key_link, link)) {
                    bracelet.key_link.divs?.key.classList.add("lovelinks-highlighted");
                }
                if (Link.isValidConnection(link, bracelet.lock_link)) {
                    bracelet.lock_link.divs?.lock.classList.add("lovelinks-highlighted");
                }
            }
        }
    }

    public deselectAll() {
        for (let i = 0; i < this.bracelets.length; i++) {
            const bracelet = this.bracelets[i];
            bracelet!.deselectAll();
        }
    }

    /**
     * @param bracelet_id (optional) server id associated with this bracelet
     * @returns 
     */
    public createBracelet(bracelet_id: number): Bracelet {
        const bracelet = new Bracelet(this.container, bracelet_id, this.player_id, this.onClickBracelet);
        this.bracelets.push(bracelet);
        return bracelet;
    }

    /**
     * Get a bracelet by id
     */
    public get(bracelet_id: number): Bracelet {
        for (const bracelet of this.bracelets) {
            if (bracelet.bracelet_id == bracelet_id) {
                return bracelet;
            }
            
        }
        console.log(this.container);
        throw new Error("Bracelet "+bracelet_id+" does not exist in this BraceletArea");
    }
}
