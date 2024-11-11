import Gamegui = require('ebg/core/gamegui');

import { Link } from "./Link"

interface Coordinates {
    top: number,
    left: number,
    rotate: number
}

interface LinkCoordiates {
    key: Coordinates, 
    lock: Coordinates,
    gemstone: Coordinates,
}

export class Bracelet {
    private static PADDING: number = 10;
    private static LINK_WIDTH: number = 60;
    private static LINK_HEIGHT: number = 60;
    private static GEMSTONE_WIDTH: number = 25;
    private static GEMSTONE_HEIGHT: number = 25;

    private page: Gamegui;
    public container: HTMLElement;
    private links: Link[];

    private removeBracelet: (bracelet: Bracelet) => void;

    /**
     * Create a new bracelet of 1 link
     * @param page gamegui
     * @param parent parent html element of the bracelet
     * @param removeBracelet callback function when the bracelet becomes empty
     */
    constructor(page: Gamegui, parent: HTMLElement, removeBracelet: (bracelet: Bracelet) => void) {
        this.page = page;
        this.links = [];
        this.container = document.createElement("div");
		this.container.classList.add("lovelinks-bracelet");
        this.removeBracelet = removeBracelet;
        parent.appendChild(this.container);
    }

    /**
     * Return the first link in this bracelet
     */
    public get link(): Link {
        if (!this.links[0]) {
            throw new Error("Cannot get the first link from an empty bracelet");
        }
        return this.links[0];
    }

    /**
     * Number of locks that fit in the bracelet
     */
    public get degree(): number {
        return Math.max(5, this.links.length + 2);
    }

    /**
     * Display properties calculated by `calculateDisplayProperties`
     */
    private containerWidth: number = -1;
    private containerHeight: number = -1;
    private circumference: number = -1;
    private radius: number = -1;

    /**
     * Calculate and set display properties based on radius and circumference
     */
    public calculateDisplayProperties() {
        if (this.isCircular()) {
            this.circumference = this.degree * Bracelet.LINK_WIDTH;
            this.radius = this.circumference / (2 * Math.PI);
            this.containerWidth = this.radius * 2 + Bracelet.LINK_WIDTH + Bracelet.PADDING;
            this.containerHeight = this.radius * 2 + Bracelet.LINK_HEIGHT + Bracelet.PADDING;
        }
        else {
            this.containerWidth = (this.links.length + 1) * Bracelet.LINK_WIDTH;
            this.containerHeight = Bracelet.LINK_HEIGHT;
        }
        dojo.setStyle(this.container, 'width', `${this.containerWidth}px`);
        dojo.setStyle(this.container, 'height', `${this.containerHeight}px`);
    }

    /**
     * Register a new Link object on this bracelet
     */
    private registerLink(link: Link) {
        this.container.insertAdjacentHTML('afterbegin', `
            <div style="width: ${Bracelet.LINK_WIDTH}px; height: ${Bracelet.LINK_HEIGHT}px;" class="lovelinks-heart lovelinks-key" id="lovelinks-key-${link.id}">
                <div class="lovelinks-number">${link.key}</div>
            </div>
            <div style="width: ${Bracelet.LINK_WIDTH}px; height: ${Bracelet.LINK_HEIGHT}px;" class="lovelinks-heart lovelinks-lock" id="lovelinks-lock-${link.id}">
                <div class="lovelinks-number">${link.lock}</div>
            </div>
            <div style="width: ${Bracelet.GEMSTONE_WIDTH}px; height: ${Bracelet.GEMSTONE_HEIGHT}px;" class="lovelinks-gemstone" id="lovelinks-gemstone-${link.id}">
            </div>
        `);
        const prevDivs = link.divs;
        const newDivs = {
            key: this.container.querySelector(".lovelinks-key")! as HTMLElement,
            lock: this.container.querySelector(".lovelinks-lock")! as HTMLElement,
            gemstone: this.container.querySelector(".lovelinks-gemstone")! as HTMLElement,
            bracelet: this
        }
        if (prevDivs) {
            this.page.placeOnObject(newDivs.key, prevDivs.key);
            this.page.placeOnObject(newDivs.lock, prevDivs.lock);
            this.page.placeOnObject(newDivs.gemstone, prevDivs.gemstone);
            (prevDivs.bracelet as Bracelet).unregisterLink(link);
        }
        link.divs = newDivs;
        this.updateDisplay();
    }

    /**
     * Remove a link from this bracelet. If the bracelet is empty, destroy it.
     * @returns true if a link was removed this way
    */
    private unregisterLink(link: Link) {
        for (let i = 0; i < this.links.length; i++) {
            if (link == this.links[i]) {
                this.links.splice(i, 1);
                if (link.divs) {
                    link.divs.key.remove();
                    link.divs.lock.remove();
                    link.divs.gemstone.remove();
                    link.divs = undefined;
                }
                if (this.links.length == 0) {
                    this.removeBracelet(this);
                }
                this.updateDisplay();
                return true;
            }
        }
        return false;
    }

    /**
     * Should this bracelet be circular?
     */
    private isCircular() {
        return (this.links.length >= 4);
    }

    /**
     * Get the left and top coordinates of the ith link in the bracelet
     */
    private getCoordinates(i: number): LinkCoordiates {
        const lineCoords = {
            key: {
                top: 0,
                left: (i+1)*Bracelet.LINK_WIDTH,
                rotate: 0
            },
            lock: {
                top: 0,
                left: (i+2)*Bracelet.LINK_WIDTH,
                rotate: 0
            },
            gemstone: {
                top: Bracelet.LINK_HEIGHT/4,
                left: (i+3/2)*Bracelet.LINK_WIDTH,
                rotate: 0
            }
        }
        const toCoordinates = this.isCircular() ? this.toCircularCoordinates.bind(this) : this.toStraightCoordinates.bind(this);
        return {
            key: toCoordinates(lineCoords.key),
            lock: toCoordinates(lineCoords.lock),
            gemstone: toCoordinates(lineCoords.gemstone),
        }
    }

    /**
     * Maps a point on a line to a point on a line within the box
     * @param coords straight coordinates of the top. `left` should be in the interval `[0, circumference]`
     * @param circumference total circumference of the circle
     */
    private toStraightCoordinates(coords: Coordinates): Coordinates {
        return {
            left: coords.left + - Bracelet.LINK_WIDTH/2 + Bracelet.PADDING,
            top: coords.top + Bracelet.LINK_HEIGHT/2 + Bracelet.PADDING,
            rotate: 0
        }
    }

    /**
     * Maps a point on a line to a point on a circle
     * @param coords straight coordinates of the top. `left` should be in the interval `[0, circumference]`
     * @param circumference total circumference of the circle
     */
    private toCircularCoordinates(coords: Coordinates): Coordinates {
        const radius = this.radius - coords.top;
        const angle = (coords.left / this.circumference) * 2 * Math.PI;
        return {
            left: radius*Math.sin(angle) + this.containerWidth/2 + Bracelet.PADDING,
            top: -radius*Math.cos(angle) + this.containerHeight/2 + Bracelet.PADDING,
            rotate: angle
        }
    }

    /**
     * Add a new link in front of the bracelet
     */
    public prependLink(link: Link) {
        this.links.splice(0, 0, link);
        this.registerLink(link);
    }

    /**
     * Add a new link at the end of the bracelet
     */
    public appendLink(link: Link) {
        this.links.push(link);
        this.registerLink(link);
    }

    /**
     * Workaround to reflow trigger reflow for css transitions
     */
    private reflowLink(link: Link) {
        if (!link.divs) {
            throw new Error(`Link ${link.id} is not registered`);
        }
        link.divs.key.offsetHeight;
        link.divs.lock.offsetHeight;
        link.divs.gemstone.offsetHeight;
    }

    /**
     * Update the position of the links in the bracelet
     */
    public updateDisplay() {
        this.calculateDisplayProperties();
        for (let i = 0; i < this.links.length; i++) {
            const link = this.links[i]!;
            const coords = this.getCoordinates(i);
            if (!link.divs) {
                throw new Error(`Link ${link.id} is not registered`);
            }
            this.reflowLink(link);

            //key position
            dojo.setStyle(link.divs.key, 'left', `${coords.key.left - Bracelet.LINK_WIDTH/2}px`);
            dojo.setStyle(link.divs.key, 'top', `${coords.key.top - Bracelet.LINK_HEIGHT/2}px`);
            dojo.setStyle(link.divs.key,  'transform', `rotate(${coords.key.rotate}rad)`);

            //lock position
            dojo.setStyle(link.divs.lock, 'opacity', i < this.links.length - 1 ? '0.5' : '1');
            dojo.setStyle(link.divs.lock, 'left', `${coords.lock.left - Bracelet.LINK_WIDTH/2}px`);
            dojo.setStyle(link.divs.lock, 'top', `${coords.lock.top - Bracelet.LINK_HEIGHT/2}px`);
            dojo.setStyle(link.divs.lock, 'transform', `rotate(${coords.lock.rotate}rad)`);

            //gemstone position
            dojo.setStyle(link.divs.gemstone, 'left', `${coords.gemstone.left - Bracelet.GEMSTONE_WIDTH/2}px`);
            dojo.setStyle(link.divs.gemstone, 'top', `${coords.gemstone.top  - Bracelet.GEMSTONE_HEIGHT/2}px`);
            dojo.setStyle(link.divs.gemstone, 'transform', `rotate(${coords.gemstone.rotate}rad)`);
        }
    }
}