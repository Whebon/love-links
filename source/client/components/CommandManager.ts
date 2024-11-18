import Gamegui = require('ebg/core/gamegui');

import { StaticLoveLinks } from './StaticLoveLinks';
import { Bracelet } from "./Bracelet"
import { Link } from './Link';
import { Side } from './Side';

type NamedPlayerAction<K extends keyof PlayerActions> = {
    name: K;
    args: PlayerActions[K]
};

export interface Command {
    bracelet: Bracelet;

    execute(): void;
    undo(): void;

    /**
     * Each command may correspond to a player action on the server side. This method converts a command to an act
     */
    toAct(): NamedPlayerAction<keyof PlayerActions> | undefined
}

export interface Act {}

export class CommandManager {
    private commands: Command[] = [];

    constructor() {}

    /**
     * @returns the bracelet related to the previous command
     */
    public get bracelet(): Bracelet {
        if (this.commands.length == 0) {
            throw new Error("No command has been executed this turn");
        }
        const command = this.commands[this.commands.length-1]!;
        return command.bracelet;
    }

    /**
     * @returns true if any commands exist
     */
    public hasCommands(): boolean {
        return this.commands.length > 0;
    }

    /**
     * Push and execute a new command
     */
    public execute(command: Command) {
        this.commands.push(command);
        command.execute();
    }

    /**
     * Undo the last command
     */
    public undo() {
        this.commands.pop()?.undo();
    }

    /**
     * Undo all commands
     */
    public undoAll() {
        while (true) {
            const command = this.commands.pop();
            if (!command) {
                 break;
            }
            command.undo();
        }
    }

    /**
     * Clear all commands
     */
    public clearAll() {
        this.commands = [];
    }


    /**
     * @returns the number of placements commands stored
     */
    public numberOfPlacements() {
        let placements = 0;
        for (const command of this.commands) {
            if (command instanceof ExtendCommand) {
                placements += 1;
            }
        }
        return placements;
    }

    /**
     * Converts the executed client commands to a list of server actions
     */
    public toActs(): NamedPlayerAction<keyof PlayerActions>[] {
        const acts: NamedPlayerAction<keyof PlayerActions>[] = [];
        for (const command of this.commands) {
            const act = command.toAct();
            if (act) {
                acts.push(act);
            }
            else if (command instanceof CompleteCommand) {
                const extendCommand = acts[acts.length-1];
                (extendCommand as NamedPlayerAction<'actPlaceLink'>).args.side = "both";
            }
            else {
                console.log(act);
                throw new Error("Failed to convert a command to a server action");
            }
        }
        return acts;
    };
}

export class ExtendCommand implements Command {
    public link: Link | undefined;
    public bracelet: Bracelet;
    public playerBracelet: Bracelet;
    public side: Side;

    /**
     * Extend the `bracelet` to with the `playerBracelet` on the `side` side
     */
    constructor(bracelet: Bracelet, playerBracelet: Bracelet, side: Side) {
        this.link = undefined;
        this.playerBracelet = playerBracelet;
        this.bracelet = bracelet
        this.side = side;
    }

    public execute() {
        this.link = this.playerBracelet.key_link;
        switch(this.side) {
            case 'key':
                this.bracelet.prependLink(this.link);
                break;
            case 'lock':
                this.bracelet.appendLink(this.link);
                break;
        }
        if (Link.isValidConnection(this.bracelet.key_link, this.bracelet.lock_link) && this.bracelet.canBeCompleted()) {
			StaticLoveLinks.page.setClientState('client_completeBracelet', {
                descriptionmyturn: _("${you} may complete this bracelet")
            })
        }
        else {
            StaticLoveLinks.page.nextAction();
        }
    }

    public undo() {
        switch(this.side) {
            case 'key':
                this.playerBracelet.prependLink(this.bracelet.key_link);
                break;
            case 'lock':
                this.playerBracelet.appendLink(this.bracelet.lock_link);
                break;
        }
    }

    public toAct(): NamedPlayerAction<"actPlaceLink"> {
        if (!this.link) {
            throw new Error("ExtendCommand has no link, make sure to 'execute' the command");
        }
        return {
            name: "actPlaceLink",
            args: {
                link_id: this.link.id,
                bracelet_id: this.bracelet.bracelet_id,
                side: this.side
            }
        };
    }
}

export class CompleteCommand implements Command {

    private commandManager: CommandManager;
    public bracelet: Bracelet;

    /**
     * Complete the `bracelet`
     */
    constructor(commandManager: CommandManager, bracelet: Bracelet) {
        this.commandManager = commandManager;
        this.bracelet = bracelet;
    }

    public execute() {
        this.bracelet.setComplete(true);
    }

    public undo() {
        this.bracelet.setComplete(false);
        this.commandManager.undo();
    }

    /**
     * A complete action is supposed to merge with the previous ExtendCommand
     */
    public toAct(): undefined {
        return undefined
    }
}
