import { DbCard } from "./DbCard";
import { Metal } from "./Metal";
import { StaticLoveLinks } from "./StaticLoveLinks";

/**
 * Uniquely points to divs representing this link
 */
export interface LinkDivs {
    key: HTMLElement, 
    lock: HTMLElement,
    gemstone: HTMLElement,
    bracelet: any
}

/**
 * Contains 2 hearts and 1 gemstone
 */
export class Link {
    private static UNIQUE_ID: number = 999;
    private static links: Map<number, Link> = new Map<number, Link>();
    private static MASTER = 48;

    public id: number;
    public key: number;
    public lock: number;
    public gemstone: number;
    public divs: LinkDivs | undefined; //unique representation of this link on screen

    constructor(key: number, lock: number, gemstone: number, id?: number) {
        if(id) {
            this.id = id;
        }
        else {
            this.id = Link.UNIQUE_ID;
            Link.UNIQUE_ID++;
        }
        Link.links.set(this.id, this);
        this.key = key
        this.lock = lock
        this.gemstone = gemstone
    }

    public get metal(): Metal {
        const link = StaticLoveLinks.page.gamedatas.card_types[this.id];
        if (!link) {
            throw new Error(`Link ${this.id}'s metal is not defined by the server`);
        }
        return link.metal;
    }
    
    public key_displayed(): string | number {
        return this.key == Link.MASTER ? "M" : this.key;
    }

    public lock_displayed(): string | number {
        return this.lock == Link.MASTER ? "M" : this.lock;
    }

    public static ofDbCard(dbCard: DbCard) {
        return Link.ofId(+dbCard.id, +dbCard.type_arg);
    }

    public static ofId(id: number, gemstone: number = 0) {
        const type = StaticLoveLinks.page.gamedatas.card_types[id];
        if (!type) {
            throw new Error(`Link ${id} does not not exist`);
        }
        let link = this.get(id) ?? new Link(type.key, type.lock, gemstone, id);
        link.gemstone = gemstone;
        return link;
    }

    /**
     * Get the link corresponding to the given id
     */
    public static get(link_id: number): Link | undefined {
        const link = this.links.get(link_id);
        if (!link) {
            console.log(`Link ${link_id} is unknown.`);
            return undefined;
        }
        return link;
    }

    /**
     * Returns true if `key_link` and `lock_link` can connect
     */
    public static isValidConnection(key_link: Link, lock_link: Link) {
        const key = key_link.key;
        const lock = lock_link.lock;
        return lock % key == 0;
    }

    //TODO: safely delete this
    // public selectKey() {
    //     this.divs?.key.classList.add("lovelinks-selected");
    // }
    // public selectLock() {
    //     this.divs?.lock.classList.add("lovelinks-selected");
    // }
}

