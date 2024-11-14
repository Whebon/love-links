import Gamegui = require('ebg/core/gamegui');

import { StaticLoveLinks } from './StaticLoveLinks';
import { Bracelet } from "./Bracelet"
import { Link } from './Link';
import { Side } from './Side';

export interface Command {
    bracelet: Bracelet;
    execute(): void
    undo(): void
}

export class CommandManager {
    private commands: Command[] = [];

    constructor() {}

    public get bracelet(): Bracelet {
        if (this.commands.length == 0) {
            throw new Error("No command has been execute this turn");
        }
        const command = this.commands[this.commands.length-1]!;
        return command.bracelet;
    }

    public hasCommands(): boolean {
        return this.commands.length > 0;
    }

    public execute(command: Command) {
        this.commands.push(command);
        command.execute();
    }

    public undo() {
        this.commands.pop()?.undo();
    }

    public undoAll() {
        while (true) {
            const command = this.commands.pop();
            if (!command) {
                 break;
            }
            command.undo();
        }
    }
}

export class ExtendCommand implements Command {
    public bracelet: Bracelet;
    public playerBracelet: Bracelet;
    public side: Side;

    /**
     * Extend the `bracelet` to with the `playerBracelet` on the `side` side
     */
    constructor(bracelet: Bracelet, playerBracelet: Bracelet, side: Side) {
        this.playerBracelet = playerBracelet;
        this.bracelet = bracelet
        this.side = side;
    }

    public execute() {
        switch(this.side) {
            case 'key':
                this.bracelet.prependLink(this.playerBracelet.key_link);
                break;
            case 'lock':
                this.bracelet.appendLink(this.playerBracelet.lock_link);
                break;
        }
        if (Link.isValidConnection(this.bracelet.key_link, this.bracelet.lock_link)) {
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
}
