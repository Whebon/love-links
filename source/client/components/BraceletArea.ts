import Gamegui = require('ebg/core/gamegui');

import { Bracelet } from "./Bracelet"

/**
 * Manages a collection of bracelets within an enclosed area
 */
export class BraceletArea {
    private page: Gamegui;
    private container: HTMLElement;

    public bracelets: Bracelet[];
    
    constructor(page: Gamegui, parent: HTMLElement, title: string) {
        this.page = page;
        this.bracelets = [];
        const wrap = document.createElement('div');
        wrap.classList.add("whiteblock");
        parent.appendChild(wrap);
        wrap.innerHTML = `
            <h3 class="lovelinks-title">${title}</h3>
            <div class="lovelinks-bracelet-area"></div>
        `;
        this.container = wrap.querySelector(".lovelinks-bracelet-area")!;
    }

    public createBracelet(): Bracelet {
        const bracelet = new Bracelet(this.page, this.container);
        this.bracelets.push(bracelet);
        return bracelet;
    }
}