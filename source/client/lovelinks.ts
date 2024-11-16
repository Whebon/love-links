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
import { CommandManager, Command, ExtendCommand, CompleteCommand } from "./components/CommandManager"
import { Side } from "./components/Side"
import { Link } from "./components/Link"
import { BraceletArea } from "./components/BraceletArea"
import { TPL } from "./components/TPL"
import { Bracelet } from './components/Bracelet';

/** The root for all of your game code. */
class LoveLinks extends Gamegui
{
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
		TPL.init(this);
		const gamePlayArea = document.getElementById("game_play_area")!;

		this.bracelets = new BraceletArea(gamePlayArea, 0, _("Bracelets"), this.onClickBracelet.bind(this));
		for (const player_id in gamedatas.players) {
			const player = gamedatas.players[player_id]!;
			const player_board = document.getElementById("player_board_"+player_id)!;
			const callback = +player_id == this.player_id ? this.onClickMyStock.bind(this) : this.onClickOtherStock.bind(this);
			this.stocks[player_id] = new BraceletArea(player_board, +player_id, undefined, callback); //TPL.stockTitle(player_id)

			// debug: create some bracelets
			for (let i = 0; i < 5; i++) {
				const bracelet = this.stocks[player_id].createBracelet();
				bracelet.appendLink(new Link(i%2, i%3, 0));
			}
		}

		// debug: create some bracelets
		for (let i = 0; i < 5; i++) {
			const bracelet = this.bracelets.createBracelet();
			bracelet.appendLink(new Link(1, 0, 0));
			bracelet.appendLink(new Link(1, 0, 0));
			bracelet.appendLink(new Link(1, 0, 0));
			bracelet.appendLink(new Link(1, 0, 0));
			bracelet.appendLink(new Link(1, 0, 0));
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
				this.commandManager.bracelet.setBlinking(false);
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
			case 'client_placeLink':
				if (this.commandManager.numberOfPlacements() > 0) {
					this.addActionButton("undo-button", _("Undo"), "onUndo", undefined, false, 'gray');
				}
				break;
			case 'client_completeBracelet':
				this.addActionButton("complete-button", _("Complete"), "onCompleteBracelet");
				this.addActionButton("skip-button", _("Skip"), "nextAction", undefined, false, 'gray');
				break;
			case 'client_confirm':
				this.addActionButton("confirm-button", _("Confirm"), "onSubmitCommands");
				this.addActionButton("undo-button", _("Undo"), "onUndo", undefined, false, 'gray');
				break;
		}
	}

	
	///////////////////////////////////////////////////
	//// Utility methods
	
	/*
		Here, you can defines some utility methods that you can use everywhere in your typescript
		script.
	*/



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
	 * @param bracelet bracelet
	 * @param link link
	 * @param side side
	 */
	public onClickMyStock(bracelet: Bracelet, link: Link, side: Side) {
		if(!this.isCurrentPlayerActive()) {
			this.showMessage(_("It is not your turn"), 'error');
			return;
		}

		switch(this.gamedatas.gamestate.name) {
			case 'client_placeLink':
				this.bracelets.deselectAll();
				this.myStock.deselectAll();
				if (this.selected == bracelet) {
					this.selected = undefined;
					return;
				}
				bracelet.select('both');
				this.selected = bracelet;
				this.bracelets.highlightPossibleLinks(link);
				break;
			case 'client_completeBracelet':
				this.showMessage(_("Please choose whether or not to complete the bracelet"), 'error');
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
		console.log(this.commandManager.asJson());
		this.bgaPerformAction("actSubmitCommands", {
			commands: this.commandManager.asJson()
		})
	}

	public nextAction() {
		console.log("nextAction");
		const placements = this.commandManager.numberOfPlacements();
		if (placements == 0) {
			this.setClientState('client_placeLink', {
				descriptionmyturn: _("${you} must place a link")
			})
		}
		else if (placements == 1) {
			this.setClientState('client_placeLink', {
				descriptionmyturn: _("${you} must place another link")
			})
		}
		else if (placements == 2) {
			this.setClientState('client_confirm', {
				descriptionmyturn: _("${you} must confirm your placements")
			})
		}
		else {
			throw new Error(`Unexpected number of placements this turn: ${placements}`);
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
		
		// TODO: here, associate your game notifications with local methods
		
		// With base Gamegui class...
		// dojo.subscribe( 'cardPlayed', this, "notif_cardPlayed" );

		// With GameguiCookbook::Common class...
		// this.subscribeNotif( 'cardPlayed', this.notif_cardPlayed ); // Adds type safety to the subscription
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
}


// The global 'bgagame.lovelinks' class is instantiated when the page is loaded. The following code sets this variable to your game class.
dojo.setObject( "bgagame.lovelinks", LoveLinks );
// Same as: (window.bgagame ??= {}).lovelinks = LoveLinks;