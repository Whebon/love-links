import Gamegui = require('ebg/core/gamegui');

import { StaticLoveLinks } from "./StaticLoveLinks"
import { Link } from "./Link"
import { Side } from './Side';

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
    private get GEMSTONE_WIDTH() {
        return (this.player_id == 0) ? 25 : 20;
    }

    private get LINK_WIDTH() {
        return (this.player_id == 0) ? 65 : 45;
    }

    private get LINK_HEIGHT() { return this.LINK_WIDTH;}
    private get GEMSTONE_HEIGHT() { return this.GEMSTONE_WIDTH;}

    private PADDING: number = 0;

    public container: HTMLElement;
    public player_id: number
    private links: Link[];
    private onClickBracelet: (bracelet: Bracelet, link: Link, side: Side) => void;

    public isComplete: boolean;
    public isBlinking: boolean;

    /**
     * Create a new bracelet of 1 link
     * @param page gamegui
     * @param parent parent html element of the bracelet
     */
    constructor(parent: HTMLElement, player_id: number, onClickBracelet: (bracelet: Bracelet, link: Link, side: Side) => void) {
        this.links = [];
        this.container = document.createElement("div");
		this.container.classList.add("lovelinks-bracelet");
        this.player_id = player_id;
        this.onClickBracelet = onClickBracelet;
        this.isComplete = false;
        this.isBlinking = false;
        parent.appendChild(this.container);
    }

    /**
     * Return the first link in this bracelet
     */
    public get key_link(): Link {
        if (!this.links[0]) {
            throw new Error("Cannot get the first link from an empty bracelet");
        }
        return this.links[0];
    }

    /**
     * Return the last link in this bracelet
     */
    public get lock_link(): Link {
        if (this.links.length == 0) {
            throw new Error("Cannot get the last link from an empty bracelet");
        }
        return this.links[this.links.length - 1]!;
    }

    /**
     * Number of locks that fit in the bracelet
     */
    public get degree(): number {
        if (this.isComplete) {
            return this.links.length;
        }
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
            this.circumference = this.degree * this.LINK_WIDTH;
            this.radius = this.circumference / (2 * Math.PI);
            this.containerWidth = this.radius * 2 + this.LINK_WIDTH + this.PADDING;
            this.containerHeight = this.radius * 2 + this.LINK_HEIGHT + this.PADDING;
        }
        else {
            // Math.max(2, ...) is there to ensure that the empty bracelet takes as much space as a 1-link bracelet
            this.containerWidth = Math.max(2, (this.links.length + 1)) * this.LINK_WIDTH;
            this.containerHeight = this.LINK_HEIGHT;
        }
        dojo.setStyle(this.container, 'width', `${this.containerWidth}px`);
        dojo.setStyle(this.container, 'height', `${this.containerHeight}px`);
    }

    /**
     * Register a new Link object on this bracelet
     */
    private registerLink(link: Link) {
        this.container.insertAdjacentHTML('afterbegin', `
            <div style="width: ${this.LINK_WIDTH}px; height: ${this.LINK_HEIGHT}px;" class="lovelinks-heart lovelinks-key" id="lovelinks-key-${link.id}">
                <div class="lovelinks-number">${link.key}</div>
            </div>
            <div style="width: ${this.LINK_WIDTH}px; height: ${this.LINK_HEIGHT}px;" class="lovelinks-heart lovelinks-lock" id="lovelinks-lock-${link.id}">
                <div class="lovelinks-number">${link.lock}</div>
            </div>
            <div style="width: ${this.GEMSTONE_WIDTH}px; height: ${this.GEMSTONE_HEIGHT}px;" class="lovelinks-gemstone" id="lovelinks-gemstone-${link.id}">
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
            StaticLoveLinks.page.placeOnObject(newDivs.key, prevDivs.key);
            StaticLoveLinks.page.placeOnObject(newDivs.lock, prevDivs.lock);
            StaticLoveLinks.page.placeOnObject(newDivs.gemstone, prevDivs.gemstone);
            (prevDivs.bracelet as Bracelet).unregisterLink(link);
        }
        link.divs = newDivs;
        this.updateDisplay();
    }

    /**
     * Remove a link from this this. If the bracelet is empty, destroy it.
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
                left: (i+1)*this.LINK_WIDTH,
                rotate: 0
            },
            lock: {
                top: 0,
                left: (i+2)*this.LINK_WIDTH,
                rotate: 0
            },
            gemstone: {
                top: this.LINK_HEIGHT/4,
                left: (i+3/2)*this.LINK_WIDTH,
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
            left: coords.left + - this.LINK_WIDTH/2 + this.PADDING,
            top: coords.top + this.LINK_HEIGHT/2 + this.PADDING,
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
        let angle = (coords.left / this.circumference) * 2 * Math.PI;
        if (this.isComplete) {
            angle -= 2*Math.PI / (this.links.length);
        }
        return {
            left: radius*Math.sin(angle) + this.containerWidth/2 + this.PADDING,
            top: -radius*Math.cos(angle) + this.containerHeight/2 + this.PADDING,
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
     * If `true`, close the bracelet loop.
     * If `false`, open the bracelet loop.
     */
    public setComplete(state: boolean) {
        this.isComplete = state;
        this.updateDisplay();
    }

    /**
     * If `true`, blinking the end points of the bracelets
     */
    public setBlinking(state: boolean){
        this.isBlinking = state;
        this.updateDisplay();
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
            if (!this.isBlinking) {
                link.divs.key.classList.remove("lovelinks-blinking");
            }
            dojo.setStyle(link.divs.key, 'left', `${coords.key.left - this.LINK_WIDTH/2}px`);
            dojo.setStyle(link.divs.key, 'top', `${coords.key.top - this.LINK_HEIGHT/2}px`);
            //dojo.setStyle(link.divs.key,  'rotate', `${coords.key.rotate}rad`);
            this.setRotate(link.divs.key, coords.key.rotate);
            if (!this.isComplete && i == 0) {
                if (this.isBlinking) {
                    link.divs.key.classList.add("lovelinks-blinking");
                }
                if ((StaticLoveLinks.page as any).isClickable(this, 'key')) {
                    link.divs.key.classList.add("lovelinks-clickable");
                    link.divs.key.addEventListener('click', this.onClickKeyBound);
                }
            }
            else {
                link.divs.key.classList.remove("lovelinks-clickable");
                link.divs.key.removeEventListener('click', this.onClickKeyBound)
            }

            //lock position
            if (!this.isBlinking) {
                link.divs.lock.classList.remove("lovelinks-blinking");
            }
            dojo.setStyle(link.divs.lock, 'opacity', this.isComplete || i < this.links.length - 1 ? '0.5' : '1');
            dojo.setStyle(link.divs.lock, 'left', `${coords.lock.left - this.LINK_WIDTH/2}px`);
            dojo.setStyle(link.divs.lock, 'top', `${coords.lock.top - this.LINK_HEIGHT/2}px`);
            //dojo.setStyle(link.divs.lock,  'rotate', `${coords.lock.rotate}rad`);
            this.setRotate(link.divs.lock, coords.lock.rotate);
            if (!this.isComplete && i == this.links.length - 1) {
                if (this.isBlinking) {
                    link.divs.lock.classList.add("lovelinks-blinking");
                }
                if ((StaticLoveLinks.page as any).isClickable(this, 'lock')) {
                    link.divs.lock.classList.add("lovelinks-clickable");
                    link.divs.lock.addEventListener('click', this.onClickLockBound);
                }
            }
            else {
                link.divs.lock.classList.remove("lovelinks-clickable");
                link.divs.lock.removeEventListener('click', this.onClickLockBound);
            }

            //gemstone position
            dojo.setStyle(link.divs.gemstone, 'left', `${coords.gemstone.left - this.GEMSTONE_WIDTH/2}px`);
            dojo.setStyle(link.divs.gemstone, 'top', `${coords.gemstone.top  - this.GEMSTONE_HEIGHT/2}px`);
            //dojo.setStyle(link.divs.gemstone,  'rotate', `${coords.gemstone.rotate}rad`);
            this.setRotate(link.divs.gemstone, coords.gemstone.rotate);
        }
    }


    /**
     * Update the rotation by making the smallest turn
     */
    public setRotate(element: HTMLElement, angle: number) {
        const style = dojo.getStyle(element, 'rotate')! as string;
        const matchRad = style.match(/[-+]?[0-9]*\.?[0-9]+rad/);
        const matchDeg = style.match(/[-+]?[0-9]*\.?[0-9]+deg/);
        const prevAngle = matchRad ? parseFloat(matchRad[0]) : matchDeg ? parseFloat(matchDeg[0]) / 180 * Math.PI : 0;
        while (angle - prevAngle < -Math.PI) {
            console.log("+");
            angle += 2*Math.PI
        }
        while (angle - prevAngle > Math.PI) {
            angle -= 2*Math.PI  
        }
        dojo.setStyle(element,  'rotate', `${angle}rad`);
    }
    

    /**
     * @param side (optional) If provided, toggle a specific side of the bracelet. Otherwise, toggle the entire braclet
     */
    public toggle(side: Side | 'both') {
        switch (side) {
            case 'key':
                this.key_link.divs?.key.classList.toggle("lovelinks-selected");
                break;
            case 'lock':
                this.lock_link.divs?.lock.classList.toggle("lovelinks-selected");
                break;
            case 'both':
                this.container.classList.toggle("lovelinks-selected");
                break;
        }
    }

    /**
     * @param side (optional) If provided, select a specific side of the bracelet. Otherwise, select the entire braclet
     */
    public select(side: Side | 'both') {
        switch (side) {
            case 'key':
                this.key_link.divs?.key.classList.add("lovelinks-selected");
                break;
            case 'lock':
                this.lock_link.divs?.lock.classList.add("lovelinks-selected");
                break;
            case 'both':
                this.container.classList.add("lovelinks-selected");
                break;
        }
    }

    /**
     * @param side (optional) If provided, deselect a specific side of the bracelet. Otherwise, deselect the entire braclet
     */
    public deselect(side: Side | 'both') {
        switch (side) {
            case 'key':
                this.key_link.divs?.key.classList.remove("lovelinks-selected", "lovelinks-highlighted");
                break;
            case 'lock':
                this.lock_link.divs?.lock.classList.remove("lovelinks-selected", "lovelinks-highlighted");
                break;
            case 'both':
                this.container.classList.remove("lovelinks-selected", "lovelinks-highlighted");
                break;
        }
    }

    /**
     * Deselect all links in the bracelet
     */
    public deselectAll() {
        for (const link of this.links) {
            link.divs?.key.classList.remove("lovelinks-selected", "lovelinks-highlighted");
            link.divs?.lock.classList.remove("lovelinks-selected", "lovelinks-highlighted");
            this.container.classList.remove("lovelinks-selected", "lovelinks-highlighted");
        }
    }

    /**
     * Click key callback function
     */
    private onClickKeyBound = this.onClickKey.bind(this);
    private onClickKey() {
        this.onClickBracelet(this, this.links[0]!, 'key');
    }

    /**
     * Click lock callback function
     */
    private onClickLockBound = this.onClickLock.bind(this);
    private onClickLock() {
        this.onClickBracelet(this, this.links[this.links.length-1]!, 'lock');
    }

    //TODO: safely delete this
    // private onClickBound = this.onClick.bind(this);
    // private onClick(evt: MouseEvent) {
    //     const target = evt.target as HTMLElement | undefined;
    //     if (target) {
    //         const match = target.id.match(/(\w+)-(\w+)-(\d+)$/);
    //         if (match && match[1] && match[2] && match[3]) {
    //             const side = match[2];
    //             const id = parseInt(match[3], 10);
    //             switch (side) {
    //                 case 'key':
    //                 case 'lock':
    //                     (StaticLoveLinks.page as any).onClick(this, side);
    //                     break;
    //                 default:
    //                     throw new Error(`Unexpected side: ${side}. Expected 'key' or 'lock'.`)
    //             }
    //         }
    //         else {
    //             throw new Error(`'${target.id}' is not of the expected format 'lovelinks-key-1234' or 'lovelinks-lock-1234'"`)
    //         }
    //     }
    // }
}
