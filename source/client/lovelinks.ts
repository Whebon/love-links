/*
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * LoveLinks implementation : © Bart Swinkels
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 */
/// <amd-module name="bgagame/lovelinks"/>

import Gamegui = require('ebg/core/gamegui');
import "ebg/counter";

import { StaticLoveLinks } from "./components/StaticLoveLinks"
import { CommandManager, Command, ExtendCommand, CompleteCommand, NewBraceletCommand } from "./components/CommandManager"
import { Side } from "./components/Side"
import { Link } from "./components/Link"
import { BraceletArea } from "./components/BraceletArea"
import { TPL } from "./components/TPL"
import { Bracelet } from './components/Bracelet';
import { Supply } from './components/Supply'
import { DbCard } from './components/DbCard';
import { GemstoneColor } from './components/GemstoneColor';

/** The root for all of your game code. */
class LoveLinks extends Gamegui
{
	/**
	 * A table of remaining links
	 */
	public supply: Supply | undefined;

	/**
	 * Unfinished bracelets
	 */
	public bracelets!: BraceletArea;

	/**
	 * Bracelet stock per player
	 */
	public stocks: Record<number, BraceletArea> = {};

	/**
	 * Stock bracelet that is currently selected
	 */
	public selected: Bracelet | undefined;

	/**
	 * Action performed in this turn
	 */
	public commandManager: CommandManager = new CommandManager();

	/**
	 * Stock of the current player
	 */
	public get myStock(): BraceletArea {
		const stock = this.stocks[this.player_id];
		if (!stock) {
			throw new Error("The stock of the current player was not properly initialized");
		}
		return stock;
	}

	/** @gameSpecific See {@link Gamegui} for more information. */
	constructor(){
		super();
		StaticLoveLinks.page = this;
		console.log('lovelinks constructor');
	}

	/** @gameSpecific See {@link Gamegui.setup} for more information. */
	override setup(gamedatas: Gamedatas): void
	{
		console.log( "Starting game setup" );
		console.log(gamedatas);
		TPL.init(this);
		const gamePlayArea = document.getElementById("game_play_area")!;

		//Create the bracelet area
		this.bracelets = new BraceletArea(gamePlayArea, 0, _("Bracelets"), this.onClickBracelet.bind(this));
		for (const player_id in gamedatas.players) {
			const player = gamedatas.players[player_id]!;
			const player_board = document.getElementById("player_board_"+player_id)!;
			const callback = +player_id == this.player_id ? this.onClickMyStock.bind(this) : this.onClickOtherStock.bind(this);
			this.stocks[player_id] = new BraceletArea(player_board, +player_id, undefined, callback); //TPL.stockTitle(player_id)

			// Create empty link slots for each player
			const number_of_slots = gamedatas.round == 1 ? 5 : 4;
			for (let i = 1; i <= number_of_slots; i++) {
				this.stocks[player_id].createBracelet(i);
			}

			// Fill the link slots
			let slot_id = 1;
			for (const i in gamedatas.stocks[player_id]) {
				const link = gamedatas.stocks[player_id][+i]!;
				const slot = this.stocks[player_id].get(slot_id);
				slot.appendLink(Link.ofDbCard(link));
				slot_id += 1;
			}
		}

		// Create the bracelets
		for (const bracelet_id in gamedatas.bracelets) {
			const links = gamedatas.bracelets[bracelet_id]!;
			const bracelet = this.bracelets.createBracelet(+bracelet_id);
			for (const i in links) {
				const link = links[i]!;
				bracelet.appendLink(Link.ofDbCard(link));
			}
		}

		// Create the supply
		this.supply = new Supply(gamePlayArea, _("Supply"));
		for (const link_id in gamedatas.bronze_remaining) {
			this.supply.add(Link.ofId(+link_id));
		}
		for (const link_id in gamedatas.silver_remaining) {
			this.supply.add(Link.ofId(+link_id));
		}
		for (const link_id in gamedatas.gold_remaining) {
			this.supply.add(Link.ofId(+link_id));
		}

		// Setup game notifications to handle (see "setupNotifications" method below)
		this.setupNotifications();

		console.log( "Ending game setup" );
	}

	///////////////////////////////////////////////////
	//// Game & client states
	
	/** @gameSpecific See {@link Gamegui.onEnteringState} for more information. */
	override onEnteringState(stateName: GameStateName, args: CurrentStateArgs): void
	{
		console.log( 'Entering state: '+stateName );
		
		switch(stateName) {
			case 'playerTurn':
				this.nextAction();
				break;
			case 'newBracelet':
				this.myStock.deselectAll();
				break;
			case 'client_placeLink':
				this.myStock.deselectAll();
				//check if any move is possible
				for (const slot of this.myStock.bracelets) {
					if (slot.size() > 0) {
						console.log(slot);
						const possible_moves = this.bracelets.highlightPossibleLinks(slot.lock_link);
						if (possible_moves > 0) {
							console.log(possible_moves+" possible moves");
							console.log(slot.lock_link);
							this.bracelets.deselectAll();
							return;
						}
					}
				}
				//no moves are possible, move to newBracelet instead
				this.setClientState('newBracelet', {
					descriptionmyturn: _("${you} must select a link to start a new bracelet (because you cannot extend any bracelet)")
				})
				break;
			case 'client_completeBracelet':
				this.commandManager.bracelet.setBlinking(true);
				break;
		}
	}

	/** @gameSpecific See {@link Gamegui.onLeavingState} for more information. */
	override onLeavingState(stateName: GameStateName): void
	{
		console.log( 'Leaving state: '+stateName );
		
		switch(stateName) {
			case 'client_placeLink':
				this.bracelets.deselectAll();
				this.myStock.deselectAll();
				this.selected = undefined;
				break;
			case 'client_completeBracelet':
				this.bracelets.setBlinking(false);
				break;

		}
	}

	/** @gameSpecific See {@link Gamegui.onUpdateActionButtons} for more information. */
	override onUpdateActionButtons(stateName: GameStateName, args: AnyGameStateArgs | null): void
	{
		console.log( 'onUpdateActionButtons: ' + stateName, args );

		if(!this.isCurrentPlayerActive())
			return;

		switch(stateName) {
			case 'newBracelet':
				this.addActionButton("new-bracelet-button", _("New Bracelet"), "onNewBracelet");
				if (this.commandManager.numberOfPlacements() > 0) {
					this.addUndoButton();
				}
				break;
			case 'client_placeLink':
				if (this.commandManager.numberOfPlacements() > 0) {
					this.addUndoButton();
				}
				break;
			case 'client_completeBracelet':
				this.addActionButton("complete-button", _("Complete"), "onCompleteBracelet");
				this.addActionButton("skip-button", _("Extend"), "nextAction"); //, undefined, false, 'gray'
				this.addUndoButton();
				break;
			case 'client_confirm':
				this.addActionButton("confirm-button", _("Confirm"), "onSubmitCommands");
				this.addUndoButton();
				break;
		}
	}

	public addUndoButton() {
		this.addActionButton("undo-button", _("Undo"), "onUndo", undefined, false, 'gray');
	}

	
	///////////////////////////////////////////////////
	//// Utility methods
	
	/*
		Here, you can defines some utility methods that you can use everywhere in your typescript
		script.
	*/

	/**
	 * Show a pulse animation for the specified link id
	 */
	public pulseLink(link_id: number) {
		for (let elem_id of [`#lovelinks-key-${link_id}`, `#lovelinks-lock-${link_id}`, `#lovelinks-gemstone-${link_id}`]) {
			const elem = document.querySelector(elem_id);
			if (!elem) {
				console.warn(`Pulse animation failed: '${elem_id}' not found`);
			}
			else {
				elem.classList.add("lovelinks-pulse");
				setTimeout(() => {
					elem?.classList?.remove("lovelinks-pulse");
				}, 1000);
			}
		}
	}


	///////////////////////////////////////////////////
	//// Click Events
	
	/*
		Here, you can defines some utility methods that you can use everywhere in your typescript
		script.
	*/

	/**
	 * Player clicks on a bracelet in another stock
	 * @param bracelet bracelet
	 * @param link link
	 * @param side side
	 */
	public onClickOtherStock(bracelet: Bracelet, link: Link, side: Side) {
		switch(this.gamedatas.gamestate.name) {
			case 'newBracelet':
			case 'client_placeLink':
				if (!this.selected) {
					this.showMessage(_("Please select a link from your stock"), 'error');
					return;
				}
				break;
		}
	}

	/**
	 * Player clicks on a bracelet in a stock
	 * @param playerBracelet a slot in the stock
	 * @param link link
	 * @param side side
	 */
	public onClickMyStock(playerBracelet: Bracelet, link: Link, side: Side) {
		if(!this.isCurrentPlayerActive()) {
			this.showMessage(_("It is not your turn"), 'error');
			return;
		}

		switch(this.gamedatas.gamestate.name) {
			case 'newBracelet':
				this.myStock.deselectAll();
				if (this.selected == playerBracelet) {
					this.selected = undefined;
					return;
				}
				playerBracelet.select('both');
				this.selected = playerBracelet;
				break;
			case 'client_placeLink':
				this.bracelets.deselectAll();
				this.myStock.deselectAll();
				if (this.selected == playerBracelet) {
					this.selected = undefined;
					return;
				}
				playerBracelet.select('both');
				this.selected = playerBracelet;
				this.bracelets.highlightPossibleLinks(link);
				break;
			case 'client_completeBracelet':
				this.showMessage(_("Please choose to complete or extend this bracelet"), 'error');
				break;
		}
	}

	/**
	 * Player clicks on a public bracelet
	 * @param bracelet bracelet
	 * @param link link
	 * @param side side
	 */
	public onClickBracelet(bracelet: Bracelet, link: Link, side: Side) {
		if(!this.isCurrentPlayerActive()) {
			this.showMessage(_("It is not your turn"), 'error');
			return;
		}
		
		switch(this.gamedatas.gamestate.name) {
			case 'client_placeLink':
				if (!this.selected) {
					this.showMessage(_("Please select a link from your stock"), 'error');
					return;
				}
				switch (side) {
					case 'key':
						if (Link.isValidConnection(link, this.selected.lock_link)) {
							this.bracelets.deselectAll();
							this.myStock.deselectAll();
							this.commandManager.execute(new ExtendCommand(bracelet, this.selected, side));
							this.selected = undefined;
						}
						else {
							this.showMessage(_("This link doesn't fit here"), 'error');
						}
						break;
					case 'lock':
						if (Link.isValidConnection(this.selected.key_link, link)) {
							this.bracelets.deselectAll();
							this.myStock.deselectAll();
							this.commandManager.execute(new ExtendCommand(bracelet, this.selected, side));
							this.selected = undefined;
						}
						else {
							this.showMessage(_("This link doesn't fit here"), 'error');
							return;
						}
						break;
				}
				break;
			case 'client_completeBracelet':
				if (bracelet != this.commandManager.bracelet) {
					this.showMessage(_("You can only complete the bracelet you just added a link to"), 'error');
					return;
				}
				this.onCompleteBracelet();
				break;
		}
	}

	abc() {
		const bracelet1 = this.bracelets.bracelets[0]!;
		const bracelet2 = this.myStock.bracelets[1]!;
		bracelet1.prependLink(bracelet2.key_link);
	}

	///////////////////////////////////////////////////
	//// isClickable

	isClickable(bracelet: Bracelet, side: Side): boolean {
		return (bracelet.player_id == this.player_id || bracelet.player_id == 0);

		// switch(this.gamedatas.gamestate.name) {
		// 	case 'client_completeBracelet':
		// 		return (bracelet == this.commandManager.bracelet);
		// 	case 'client_placeLink':
		// 		console.log(bracelet.player_id);
		// 		return (bracelet.player_id == this.player_id || bracelet.player_id == 0);
		// }
		// return false;

		// switch(bracelet.type) {
		// 	case 'opponent_stock':bracelets
		// 		return false;
		// 	case 'public':
		// 		if (this.selection.bracelet.key === undefined) {
		// 			return true;
		// 		}
		// 		if (this.selection_public.part != part) {
		// 			if (part === 'key' && this.checkLink(link, this.selection_public.link)) {
						
		// 			}
		// 			else if (part === 'lock' && this.checkLink(this.selection_public.link, link)) {

		// 			}
		// 		}
		// 		return false;
		// 	case 'stock':
		// 		if (this.selection_stock === undefined) {
		// 			return true;
		// 		}
		// 		return false;
		// }
	}

	///////////////////////////////////////////////////
	//// Client States


	///////////////////////////////////////////////////
	//// Player's action
	
	/*
		Here, you are defining methods to handle player's action (ex: results of mouse click on game objects).
		
		Most of the time, these methods:
		- check the action is possible at this game state.
		- make a call to the game server
	*/

	public onNewBracelet() {
		if (!this.selected) {
			this.showMessage(_("Please select a link from your stock"), 'error');
			return;
		}
		this.myStock.deselectAll();
		this.commandManager.execute(new NewBraceletCommand(this.commandManager, this.selected, this.bracelets));
		this.nextAction();
	}

	public onUndo(){
		this.commandManager.undo();
		this.removeActionButtons();
		this.onUpdateActionButtons(this.gamedatas.gamestate.name, this.gamedatas.gamestate.args);
		this.nextAction();
	}

	public onCompleteBracelet() {
		this.commandManager.execute(new CompleteCommand(this.commandManager, this.commandManager.bracelet));
		this.nextAction();
	}

	public onSubmitCommands() {
		console.log(this.commandManager.toActs());
		this.bgaPerformAction('actMultipleActions', {
			actions:JSON.stringify(this.commandManager.toActs())
		}).then(() => {
			this.commandManager.clearAll();
		});
	}

	public nextAction() {
		console.log("nextAction");
		const placements = this.commandManager.numberOfPlacements();
		if (this.myStock.countNonEmptyBracelets() == 0) {
			//When a stock is empty, prematurely end the player's turn
			this.setClientState('client_confirm', {
				descriptionmyturn: _("${you} must confirm your placements")
			})
			return;
		} 
		else if (this.commandManager.lastCommandIsACompletion()) {
			//When the last action was a complete bracelet action, you must place a new bracelet
			this.setClientState('newBracelet', {
				descriptionmyturn: _("${you} must select a link to start a new bracelet (because you completed a bracelet)")
			})
		}
		else if (placements == 2) {
			//Confirm your 2 placements
			this.setClientState('client_confirm', {
				descriptionmyturn: _("${you} must confirm your placements")
			})
			return;
		}
		else if (placements == 1) {
			//Place your 2nd link
			this.setClientState('client_placeLink', {
				descriptionmyturn: _("${you} must place another link")
			})
			return;
		}
		else if (placements == 0) {
			//Place your 1st link
			this.setClientState('client_placeLink', {
				descriptionmyturn: _("${you} must place a link")
			})
			return;
		}
		else {
			throw new Error(`Unexpected number of placements this turn: ${placements}`);
		}
	}
	
	public getGemstoneColor(player_id: number): GemstoneColor {
		const player = this.gamedatas.players[player_id];
		if (!player) {
			return "undefined";
		}
		switch(player.color) {
			case "ff0000": 
				return "red";
			case "008000": 
				return "green";
			case "0000ff": 
				return "blue";
			case "ffa500": 
				return "yellow"
			case "000000": 
				return "black";
			case "ffffff": 
				return "white";
			case "e94190": 
				return "pink";
			case "982fff": 
				return "purple";
			case "72c3b1": 
				return "cyan";
			case "f07f16": 
				return "orange";
			case "bdd002": 
				return "khaki";
			case "7b7b7b": 
				return "gray";
			default:
				console.warn("Player color ${player.color} is not supported");
				return "gray";
		}
	}

	/* console.log("-");
	Example:
	onMyMethodToCall1( evt: Event )
	{
		console.log( 'onMyMethodToCall1' );

		// Preventing default browser reaction
		evt.preventDefault();

		//	With base Gamegui class...

		// Check that this action is possible (see "possibleactions" in states.inc.php)
		if(!this.checkAction( 'myAction' ))
			return;

		this.ajaxcall( "/yourgamename/yourgamename/myAction.html", { 
			lock: true, 
			myArgument1: arg1,
			myArgument2: arg2,
		}, this, function( result ) {
			// What to do after the server call if it succeeded
			// (most of the time: nothing)
		}, function( is_error) {

			// What to do after the server call in anyway (success or failure)
			// (most of the time: nothing)
		} );


		//	With GameguiCookbook::Common...
		this.ajaxAction( 'myAction', { myArgument1: arg1, myArgument2: arg2 }, (is_error) => {} );
	}
	*/

	///////////////////////////////////////////////////
	//// Reaction to cometD notifications

	/** @gameSpecific See {@link Gamegui.setupNotifications} for more information. */
	override setupNotifications()
	{
		console.log( 'notifications subscriptions setup' );
		
		//[notif_type, duration, has_private_arguments]
		const notifs: ([keyof NotifTypes, number])[] = [
			['newBracelet', 1000],
			['refillStock', 2000],
			['placeLink', 1000],
			['startRound', 1]
		];

		notifs.forEach((notif) => {
			dojo.subscribe(notif[0], this, `notif_${notif[0]}`);
			this.notifqueue.setSynchronous(notif[0], notif[1]);
		});
	}

	/*
	Example:
	
	// The argument here should be one of there things:
	// - `Notif`: A notification with all possible arguments defined by the NotifTypes interface. See {@link Notif}.
	// - `NotifFrom<'cardPlayed'>`: A notification matching any other notification with the same arguments as 'cardPlayed' (A type can be used here instead). See {@link NotifFrom}.
	// - `NotifAs<'cardPlayed'>`: A notification that is explicitly a 'cardPlayed' Notif. See {@link NotifAs}.
	notif_cardPlayed( notif: NotifFrom<'cardPlayed'> )
	{
		console.log( 'notif_cardPlayed', notif );
		// Note: notif.args contains the arguments specified during you "notifyAllPlayers" / "notifyPlayer" PHP call
	}
	*/

	notif_placeLink(notif: NotifFrom<'placeLink'>) {
		console.log('notif_placeLink', notif);
		let link = Link.ofDbCard(notif.args.link);
		const stock = this.stocks[notif.args.player_id]!;
		const slot = stock.getBraceletWithLink(link);
		if (!slot) {
			if (notif.args.player_id != this.player_id) {
				const name = this.gamedatas.players[notif.args.player_id]!.name;
				throw new Error(`Link #${notif.args.link.id} as not found in ${name}'s Stock`);
			}
			//the link is already in place, play a pulse animation instead
			this.pulseLink(+notif.args.link.id);
			return;
		}
		//link = slot!.key_link; //get the link from the slot //TODO: safely remove this, this should be handled by Link.ofDbCard now
		const bracelet = this.bracelets.get(notif.args.bracelet_id);
		switch(notif.args.side) {
			case 'key':
				bracelet.prependLink(link);
				break;
			case 'lock':
				bracelet.appendLink(link);
				break;
			case 'both':
				bracelet.appendLink(link);
				bracelet.setComplete(true);
				break;
		}
	}

	notif_newBracelet(notif: NotifFrom<'newBracelet'>) {
		console.log('notif_newBracelet', notif);
		if (this.bracelets.containsLink(Link.ofId(notif.args.link_id))) {
			//the link is already in place, play a pulse animation instead
			console.log("pulse");
			this.pulseLink(+notif.args.link_id);
		}
		else {
			//actually create a new bracelet
			console.log("new bracelet");
			const bracelet = this.bracelets.createBracelet(notif.args.link_id);
			bracelet.appendLink(Link.ofId(notif.args.link_id, notif.args.player_id));
		}
	}

	notif_refillStock(notif: NotifFrom<'refillStock'>) {
		console.log('notif_refillStock', notif);
		const stock = this.stocks[notif.args.player_id];
		if (!stock) {
			throw new Error("Player "+notif.args.player_id+" does not have a Stock component");
		}
		let slot_id = 1;
		var slot;
		for (const i in notif.args.links) {
			while (!slot || slot.size() > 0) {
				slot = stock.get(slot_id);
				slot_id++;
			}
			const link = Link.ofDbCard(notif.args.links[+i]!);
			slot.appendLink(link);
			this.supply?.remove(link);
		}
	}

	notif_startRound(notif: NotifFrom<'startRound'>) {
		console.log('notif_startRound', notif);
		this.gamedatas.round = notif.args.round;
		//reduce the number of slots at the start of the round
		for (let player_id of this.gamedatas.playerorder) {
			const number_of_slots = this.gamedatas.round == 1 ? 5 : 4;
			this.stocks[player_id]!.removeBraceletIdsAbove(number_of_slots);
		}
	}
}


// The global 'bgagame.lovelinks' class is instantiated when the page is loaded. The following code sets this variable to your game class.
dojo.setObject( "bgagame.lovelinks", LoveLinks );
// Same as: (window.bgagame ??= {}).lovelinks = LoveLinks;