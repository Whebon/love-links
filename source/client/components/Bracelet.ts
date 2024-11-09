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
    private static LINK_WIDTH: number = 100;
    private static LINK_HEIGHT: number = 100;

    private links: Link[];
    private container: HTMLElement;
    private width: number;
    private height: number

    private keys: Map<number, HTMLElement> = new Map<number, HTMLElement>();
    private locks: Map<number, HTMLElement> = new Map<number, HTMLElement>(); 
    private gemstones: Map<number, HTMLElement> = new Map<number, HTMLElement>();

    /**
     * Create a new bracelet of 1 link
     * @param page gamegui
     * @param parent parent html element of the bracelet
     * @param width width of the container in pixels
     * @param height height of the container in pixels
     */
    constructor(page: Gamegui, parent: HTMLElement, width: number, height: number) {
        this.links = [];
        this.container = document.createElement("div");
		this.container.className = "lovelinks-bracelet";
        parent.appendChild(this.container);
        this.width = width;
        this.height = height;
        dojo.setStyle(this.container, 'width', `${width}px`);
        dojo.setStyle(this.container, 'height', `${height}px`);
    }

    /**
     * Create a new Link object for this bracelet
     */
    private createLink(key: number, lock: number, gemstone: number) {
        const link = new Link(key, lock, gemstone);
        this.container.insertAdjacentHTML('afterbegin', `
            <div class="lovelinks-heart lovelinks-key"></div>
            <div class="lovelinks-heart lovelinks-lock"></div>
            <div class="lovelinks-gemstone"></div>
        `);
        this.keys.set(link.id, this.container.querySelector(".lovelinks-key")!);
        this.locks.set(link.id, this.container.querySelector(".lovelinks-lock")!);
        this.gemstones.set(link.id, this.container.querySelector(".lovelinks-gemstone")!);
        return link;
    }

    /**
     * Get the left and top coordinates of the ith link in the bracelet
     */
    private getCoordinates(i: number): LinkCoordiates {
        const coordinates = {
            key: {
                top: 0,
                left: i*Bracelet.LINK_WIDTH,
                rotate: 0
            },
            lock: {
                top: 0,
                left: (i+1)*Bracelet.LINK_WIDTH,
                rotate: 0
            },
            gemstone: {
                top: Bracelet.LINK_HEIGHT/4,
                left: (i+1/2)*Bracelet.LINK_WIDTH,
                rotate: 0
            }
        }
        if (this.links.length < 2) {
            return {
                key: this.toStraightCoordinates(coordinates.key),
                lock: this.toStraightCoordinates(coordinates.lock),
                gemstone: this.toStraightCoordinates(coordinates.gemstone),
            }
        }
        else{
            const n = this.links.length + 2;
            return {
                key: this.toCircularCoordinates(coordinates.key, n*Bracelet.LINK_WIDTH),
                lock: this.toCircularCoordinates(coordinates.lock, n*Bracelet.LINK_WIDTH),
                gemstone: this.toCircularCoordinates(coordinates.gemstone, n*Bracelet.LINK_WIDTH),
            }
        }
    }

    
    /**
     * Maps a point on a straight line to a point on a straight line within the bracelet container
     */
    private toStraightCoordinates(coords: Coordinates) {
        return coords;
    }

    /**
     * Maps a point on a straight line to a point on a circle
     */
    private toCircularCoordinates(coords: Coordinates, length: number): Coordinates {
        const radius = length / (2 * Math.PI) - coords.top;
        const angle = (coords.left / length) * 2 * Math.PI;
        const width = 2*radius + Bracelet.LINK_WIDTH;
        const height = 2*radius + Bracelet.LINK_WIDTH;
        return {
            left: radius*Math.sin(angle) + width/2,
            top: radius*Math.cos(angle) + height/2,
            rotate: angle
        }
    }


    /**
     * Add a new link in front of the bracelet
     */
    public prependLink(key: number, lock: number, gemstone: number) {
        const link = this.createLink(key, lock, gemstone);
        this.links.splice(0, 0, link);
        this.updateDisplay();
    }

    /**
     * Add a new link at the end of the bracelet
     */
    public appendLink(key: number, lock: number, gemstone: number) {
        const link = this.createLink(key, lock, gemstone);
        this.links.push(link);
        this.updateDisplay();
    }

    /**
     * Update the position of the links in the bracelet
     */
    public updateDisplay() {
        for (let i = 0; i < this.links.length; i++) {
            const link = this.links[i]!;
            const key = this.keys.get(link.id)!;
            const lock = this.locks.get(link.id)!;
            const gemstone = this.gemstones.get(link.id)!;
            const coords = this.getCoordinates(i);
            dojo.setStyle(key, 'left', `${coords.key.left}px`);
            dojo.setStyle(key, 'top', `${coords.key.top}px`);
            dojo.setStyle(key, 'transform', `translate(-50%, -50%) rotate(${Math.PI-coords.key.rotate}rad)`);

            dojo.setStyle(lock, 'left', `${coords.lock.left}px`);
            dojo.setStyle(lock, 'top', `${coords.lock.top}px`);
            dojo.setStyle(lock, 'transform', `translate(-50%, -50%) rotate(${Math.PI-coords.lock.rotate}rad)`);

            dojo.setStyle(gemstone, 'left', `${coords.gemstone.left}px`);
            dojo.setStyle(gemstone, 'top', `${coords.gemstone.top}px`);
            dojo.setStyle(gemstone, 'transform', `translate(-50%, -50%) rotate(${Math.PI-coords.gemstone.rotate}rad)`);
            console.log(coords);
        }
    }
}