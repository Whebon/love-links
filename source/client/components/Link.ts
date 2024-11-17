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
    public static links: Map<number, Link> = new Map<number, Link>();

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

    public static ofId(id: number, gemstone: number = 0) {
        const link = StaticLoveLinks.page.gamedatas.card_types[id];
        if (!link) {
            throw new Error(`Link ${id} does not not exist`);
        }
        return new Link(link.key, link.lock, gemstone, id);
    }

    /**
     * Get the link corresponding to the given id
     */
    public static get(link_id: number) {
        const link = this.links.get(link_id);
        if (!link) {
            throw new Error(`Link ${link_id} is unknown.`)
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

