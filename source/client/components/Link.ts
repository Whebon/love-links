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

    public id: number;
    public key: number;
    public lock: number;
    public gemstone: number;
    public divs: LinkDivs | undefined; //unique representation of this link on screen

    constructor(key: number, lock: number, gemstone: number) {
        this.id = Link.UNIQUE_ID++;
        this.key = key
        this.lock = lock
        this.gemstone = gemstone
    }
}

