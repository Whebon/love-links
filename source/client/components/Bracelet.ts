import { StaticLoveLinks } from "./StaticLoveLinks"
import { Link } from "./Link"
import { Side } from './Side';
import { Rays } from './Rays';

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
    /**
     * Proportial size of the gemstone within the gemstone holder
     */
    private get GEMSTONE_FACTOR() {
        return 0.875; //factor 
    }

    /**
     * Width of the gemstone (+holder) in pixels
     */
    private get GEMSTONE_WIDTH() {
        return (this.player_id == 0) ? 28 : 24;
    }

    /**
     * Width of a key/lock in pixels
     */
    private get LINK_WIDTH() {
        return (this.player_id == 0) ? 66 : 44;
    }

    private get LINK_HEIGHT() { return this.LINK_WIDTH;}
    private get GEMSTONE_HEIGHT() { return this.GEMSTONE_WIDTH;}

    private PADDING: number = 0;

    public container: HTMLElement;
    public bracelet_id: number;
    public player_id: number;
    public links: Link[];
    private onClickBracelet: (bracelet: Bracelet, link: Link, side: Side) => void;

    public isComplete: boolean;
    public isBlinking: boolean;

    /**
     * Create a new bracelet of 1 link
     * @param page gamegui
     * @param parent parent html element of the bracelet
     */
    constructor(parent: HTMLElement, bracelet_id: number, player_id: number, onClickBracelet: (bracelet: Bracelet, link: Link, side: Side) => void) {
        this.links = [];
        this.container = document.createElement("div");
		this.container.classList.add("lovelinks-bracelet");
        this.bracelet_id = bracelet_id;
        this.player_id = player_id;
        this.onClickBracelet = onClickBracelet;
        this.isComplete = false;
        this.isBlinking = false;
        parent.appendChild(this.container);
        this.updateDisplay();
    }

    /**
     * Return the first link in this bracelet
     */
    public get key_link(): Link {
        if (!this.links[0]) {
            console.log(this.links);
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
        // Only increase the container size. Otherwise the flexbox keeps wrapping back and forth between 1 and 2 rows
        this.containerWidth = Math.max(this.containerWidth, +dojo.getStyle(this.container, 'width'));
        this.containerHeight = Math.max(this.containerHeight, +dojo.getStyle(this.container, 'height'));
        dojo.setStyle(this.container, 'width', `${this.containerWidth}px`);
        dojo.setStyle(this.container, 'height', `${this.containerHeight}px`);
    }

    /**
     * Register a new Link object on this bracelet
     */
    private registerLink(link: Link) {
        const color = StaticLoveLinks.page.getGemstoneColor(link.gemstone);
        const metal = link.metal;
        const bonus = link.bonus;
        this.container.insertAdjacentHTML('afterbegin', `
            <div style="width: ${this.LINK_WIDTH}px; height: ${this.LINK_HEIGHT}px;" class="lovelinks-heart lovelinks-key lovelinks-${metal}" id="lovelinks-key-${link.id}">
                <div class="lovelinks-number">${link.key_displayed()}</div>
            </div>
            <div style="width: ${this.LINK_WIDTH}px; height: ${this.LINK_HEIGHT}px;" class="lovelinks-heart lovelinks-lock lovelinks-${metal}" id="lovelinks-lock-${link.id}">
                <div class="lovelinks-number">${link.lock_displayed()}</div>
            </div>
            <div style="width: ${this.GEMSTONE_WIDTH}px; height: ${this.GEMSTONE_HEIGHT}px;" class="lovelinks-gemstoneholder lovelinks-${metal} lovelinks-${bonus}" id="lovelinks-gemstone-${link.id}">
                <div style="width: ${this.GEMSTONE_WIDTH*this.GEMSTONE_FACTOR}px; height: ${this.GEMSTONE_HEIGHT*this.GEMSTONE_FACTOR}px;" 
                class="lovelinks-gemstone lovelinks-gemstone-color-${color}"></div>
            </div>
        `);
        const prevDivs = link.divs;
        const newDivs = {
            key: this.container.querySelector(".lovelinks-key")! as HTMLElement,
            lock: this.container.querySelector(".lovelinks-lock")! as HTMLElement,
            gemstone: this.container.querySelector(".lovelinks-gemstoneholder")! as HTMLElement,
            bracelet: this
        }
        if (prevDivs) {
            StaticLoveLinks.page.placeOnObject(newDivs.key, prevDivs.key);
            StaticLoveLinks.page.placeOnObject(newDivs.lock, prevDivs.lock);
            StaticLoveLinks.page.placeOnObject(newDivs.gemstone, prevDivs.gemstone);
            (prevDivs.bracelet as Bracelet).unregisterLink(link);
        }
        else {
            const supply = StaticLoveLinks.page.supply;
            if (supply) {
                const cell = supply.linkToCell(link);
                StaticLoveLinks.page.placeOnObject(newDivs.key, cell);
                StaticLoveLinks.page.placeOnObject(newDivs.lock, cell);
                StaticLoveLinks.page.placeOnObject(newDivs.gemstone,cell);
                setTimeout(() => {
                    link.divs = newDivs;
                    this.updateDisplay();
                }, 1000);
                return;
            }
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
        const horizontalOffset = (this.containerWidth-this.LINK_WIDTH*(this.links.length+1))/2;
        const verticalOffset = (this.containerHeight-this.LINK_HEIGHT)/2;
        return {
            left: coords.left + - this.LINK_WIDTH/2 + this.PADDING + horizontalOffset,
            top: coords.top + this.LINK_HEIGHT/2 + this.PADDING + verticalOffset,
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
     * Fade out delete this bracelet. Then remove it.
     */
    public fadeOut(to?: string) {
        const fadeAnimation = dojo.fadeOut({ 
            node: this.container, 
            //end: () => dojo.destroy(this.container),
            duration: 1000
        });
        fadeAnimation.play();
        setTimeout(() => {
            dojo.setStyle(this.container, 'width', `0px`);
            dojo.setStyle(this.container, 'height', `0px`);
        }, 1000);
        setTimeout(() => {
            this.container.remove();
        }, 2000);
    }

    /**
     * Remove and delete this bracelet. Only empty bracelets can be removed.
     */
    public remove() {
        if (this.links.length > 0) {
            throw new Error("Only empty bracelets can be removed. Please make sure all links are properly unregistered");
        }
        this.container.remove();
    }

    /**
     * @returns true if this bracelet contains a link with the same id as the specified link
     */
    public containsLink(link: Link): boolean {
        for (const myLink of this.links) {
            if (myLink.id == link.id) {
                return true;
            }
        }
        return false;
    }

    /**
     * Add a new link in front of the bracelet (key side)
     */
    public prependLink(link: Link) {
        this.links.splice(0, 0, link);
        this.registerLink(link);
        if (this.links.length >= 2) {
            const link1 = this.links[0]!;
            const link2 = this.links[1]!;
            setTimeout(() => {
                this.addRays(link1, link2);
            }, 1000);
        }
    }

    /**
     * Add a new link at the end of the bracelet (lock side)
     */
    public appendLink(link: Link) {
        this.links.push(link);
        this.registerLink(link);
        if (this.links.length >= 2) {
            const n = this.links.length;
            const link1 = this.links[n-2]!;
            const link2 = this.links[n-1]!;
            setTimeout(() => {
                this.addRays(link1, link2);
            }, 1000);
        }
    }

    /**
     * @returns true if the player can complete this bracelet
     */
    public canBeCompleted(): boolean {
        return (this.links.length >= 5);
    }

    /**
     * If `true`, close the bracelet loop.
     * If `false`, open the bracelet loop.
     */
    public setComplete(state: boolean) {
        this.isComplete = state;
        if (this.isComplete) {
            const n = this.links.length;
            const link1 = this.links[n-1]!;
            const link2 = this.links[0]!;
            setTimeout(() => {
                this.addRays(link1, link2);
            }, 1000);
        }
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
     * Number of links in this bracelet
     */
    public size(): number {
        return this.links.length;
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

    /*
    * Adds "lovelinks-rays".
    * Numbers are written on the key and lock individually
    * Rays are written only on the lock
    * @example: 
    * link 1: 7 - 4 
    * link 2: 4 - 5
    * The 4-lock and 4-key will be visually connected.
    */
    public addRays(link1: Link, link2: Link) {
        if (!this.containsLink(link1) || !this.containsLink(link2)) {
            return;
        }
        const lock_div = link1.divs!.lock;
        const key_div = link2.divs!.key;
        lock_div.appendChild(Rays.getRayImage(link2.key, link1.lock));
        key_div.appendChild(Rays.getRayImage(link2.key, link1.lock));
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
            //dojo.setStyle(link.divs.key, 'opacity', this.isComplete || i > 0 ? '0.5' : '1');
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
            dojo.setStyle(link.divs.gemstone,  'rotate', `${coords.gemstone.rotate}rad`);
            this.setRotate(link.divs.gemstone, coords.gemstone.rotate);

            //remove rays at the end points of the bracelet
            this.lock_link.divs?.lock.querySelector(".lovelinks-rays")?.remove();
            this.key_link.divs?.key.querySelector(".lovelinks-rays")?.remove();
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
