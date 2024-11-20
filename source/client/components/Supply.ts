import { Link } from "./Link";

export class Supply {
    private container: HTMLElement
    private cells: HTMLElement[][]
   
    constructor(parent: HTMLElement, title: String) {
        if (title) {
            const wrap = document.createElement('div');
            wrap.classList.add("whiteblock");
            parent.appendChild(wrap);
            wrap.innerHTML = `
                <h3 class="lovelinks-title">${title}</h3>
                <div class="lovelinks-supply-table-wrap">
                    <div class="lovelinks-supply-table"></div>
                </div>
            `;
            this.container = wrap.querySelector(".lovelinks-supply-table")!;
        }
        else {
            this.container = document.createElement('div');
            this.container.classList.add("lovelinks-supply-table");
            parent.appendChild(this.container);
        }

        this.cells = [];
        for (let i = 0; i < 9; i++) {
            this.cells.push([])
            for (let j = 0; j < 10; j++) {
                const cell = document.createElement('div');
                cell.classList.add("lovelinks-supply-cell");
                this.container.appendChild(cell);
                this.cells[this.cells.length-1]!.push(cell);
            }
        }
    }

    /**
     * Add a link to the table
     */
    public add(link: Link) {
        const cell = this.linkToCell(link);
        const dot = document.createElement('div');
        dot.classList.add("lovelinks-dot", "lovelinks-dot-"+link.metal);
        cell.appendChild(dot);
    }

    /**
     * Remove a link from the table
     */
    public remove(link: Link) {
        console.log("supply.remove");
        const cell = this.linkToCell(link);
        const child = cell.lastChild;
        if (!child) {
            console.log(link);
            console.warn("Attempted to remove a link that is not in the supply");
            return;
        }
        cell.removeChild(child);
    }
    
    /**
     * Get the cell corresponding to the given link
     */
    public linkToCell(link: Link): HTMLElement {
        const i = Math.min(8, link.key - 2);
        const j = Math.min(9, link.lock - 2);
        if (!this.cells[i] || !this.cells[i][j]) {
            console.log(this.cells);
            throw new Error(`this.cells is not setup properly, cell[${i}][${j}] is not defined`);
        }
        return this.cells[i][j];
    }
}