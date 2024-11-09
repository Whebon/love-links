/**
 * Contains 2 hearts and 1 gemstone
 */
export class Link {
    private static UNIQUE_ID: number = 1;

    public id: number;
    public key: number;
    public lock: number;
    public gemstone: number;

    constructor(key: number, lock: number, gemstone: number) {
        this.id = Link.UNIQUE_ID++;
        this.key = key
        this.lock = lock
        this.gemstone = gemstone
    }
}

