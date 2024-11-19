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
     * Set blinking for all bracelets in the area
     */
    public setBlinking(state: boolean) {
        for (let i = 0; i < this.bracelets.length; i++) {
            const bracelet =this.bracelets[i]!;
            bracelet.setBlinking(state);
        }
    }

    /**
     * Remove and delete all bracelets with a bracelet id above `bracelet_id`
     */
    public removeBraceletIdsAbove(bracelet_id: number) {
        for (let i = 0; i < this.bracelets.length; i++) {
            if (this.bracelets[i]!.bracelet_id > bracelet_id) {
                this.bracelets[i]!.remove();
                this.bracelets.splice(i, 1);
                return;
            }
        }
    }

    /**
     * Remove the given bracelet
     */
    public remove(bracelet: Bracelet) {
        for (let i = 0; i < this.bracelets.length; i++) {
            if (bracelet.bracelet_id == this.bracelets[i]!.bracelet_id) {
                bracelet.remove();
                this.bracelets.splice(i, 1);
                return;
            }
        }
        console.log(this.bracelets);
        throw new Error(`Bracelet ${bracelet.bracelet_id} not found`);
    }

    /**
     * @returns number of non empty bracelets in this area
     */
    public countNonEmptyBracelets(): number {
        let count = 0;
        for (let i = 0; i < this.bracelets.length; i++) {
            const bracelet = this.bracelets[i]!;
            if (bracelet.size() > 0) {
                count++;
            }
        }
        return count;
    }

    /**
     * @returns true if the specified link is somewhere in the bracelet area
     */
    public containsLink(link: Link): boolean {
        for (let i = 0; i < this.bracelets.length; i++) {
            const bracelet = this.bracelets[i]!;
            if (bracelet.containsLink(link)) {
                return true;
            }
        }
        return false;
    }

    /**
     * @returns the bracelet containing the given link
     */
    public getBraceletWithLink(link: Link): Bracelet | undefined {
        for (let i = 0; i < this.bracelets.length; i++) {
            const bracelet = this.bracelets[i]!;
            if (bracelet.containsLink(link)) {
                return bracelet;
            }
        }
        return undefined;
    }

    /**
     * highlight all links that connect to the link
     * @returns number of valid moves
     */
    public highlightPossibleLinks(link: Link): number {
        let count = 0;
        for (let i = 0; i < this.bracelets.length; i++) {
            const bracelet = this.bracelets[i]!;
            if (!bracelet.isComplete) {
                if (Link.isValidConnection(bracelet.key_link, link)) {
                    bracelet.key_link.divs?.key.classList.add("lovelinks-highlighted");
                    count += 1;
                }
                if (Link.isValidConnection(link, bracelet.lock_link)) {
                    bracelet.lock_link.divs?.lock.classList.add("lovelinks-highlighted");
                    count += 1;
                }
            }
        }
        return count;
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
