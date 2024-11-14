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
    private static UNIQUE_ID: number = 1;
    public static links: Map<number, Link> = new Map<number, Link>();

    public id: number;
    public key: number;
    public lock: number;
    public gemstone: number;
    public divs: LinkDivs | undefined; //unique representation of this link on screen

    constructor(key: number, lock: number, gemstone: number) {
        this.id = Link.UNIQUE_ID;
        Link.links.set(this.id, this);
        Link.UNIQUE_ID++;
        this.key = key
        this.lock = lock
        this.gemstone = gemstone
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
        return true;
    }

    //TODO: safely delete this
    // public selectKey() {
    //     this.divs?.key.classList.add("lovelinks-selected");
    // }
    // public selectLock() {
    //     this.divs?.lock.classList.add("lovelinks-selected");
    // }
}

