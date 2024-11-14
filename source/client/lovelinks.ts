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
				bracelet.appendLink(new Link(0, 0, 0));
			}
		}

		// debug: create some bracelets
		for (let i = 0; i < 5; i++) {
			const bracelet = this.bracelets.createBracelet();
			bracelet.appendLink(new Link(0, 0, 0));
			bracelet.appendLink(new Link(0, 0, 0));
			bracelet.appendLink(new Link(0, 0, 0));
			bracelet.appendLink(new Link(0, 0, 0));
			bracelet.appendLink(new Link(0, 0, 0));
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
		
		switch( stateName )
		{
		case 'dummmy':
			break;
		}
	}

	/** @gameSpecific See {@link Gamegui.onLeavingState} for more information. */
	override onLeavingState(stateName: GameStateName): void
	{
		console.log( 'Leaving state: '+stateName );
		
		switch( stateName )
		{
		case 'dummmy':
			break;
		}
	}

	/** @gameSpecific See {@link Gamegui.onUpdateActionButtons} for more information. */
	override onUpdateActionButtons(stateName: GameStateName, args: AnyGameStateArgs | null): void
	{
		console.log( 'onUpdateActionButtons: ' + stateName, args );

		if(!this.isCurrentPlayerActive())
			return;

		switch( stateName )
		{
		case 'dummmy':
			// Add buttons if needed
			break;
		}
	}

	///////////////////////////////////////////////////
	//// Utility methods
	
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
		console.log("Other Stock");
	}

	/**
	 * Player clicks on a bracelet in a stock
	 * @param bracelet bracelet
	 * @param link link
	 * @param side side
	 */
	public onClickMyStock(bracelet: Bracelet, link: Link, side: Side) {
		this.bracelets.deselectAll();
		this.myStock.deselectAll();
		if (this.selected == bracelet) {
			this.selected = undefined;
			return;
		}
		bracelet.select('both');
		this.selected = bracelet;
		this.bracelets.highlightPossibleLinks(link);
	}

	/**
	 * Player clicks on a public bracelet
	 * @param bracelet bracelet
	 * @param link link
	 * @param side side
	 */
	public onClickBracelet(bracelet: Bracelet, link: Link, side: Side) {
		if (!this.selected) {
			this.showMessage(_("Please select a link from your stock"), 'info');
			return;
		}
		if (side == 'key' && Link.isValidConnection(link, this.selected.lock_link)) {
			this.bracelets.deselectAll();
			this.myStock.deselectAll();
			bracelet.prependLink(this.selected.lock_link);
		}
		if (side == 'lock' && Link.isValidConnection(this.selected.key_link, link)) {
			this.bracelets.deselectAll();
			this.myStock.deselectAll();
			bracelet.appendLink(this.selected.key_link);
		}
	}

	// /**
	//  * Toggles the bracelet side and returns true if the given bracelet side is now selected
	//  */
	// toggle(bracelet: Bracelet, side: Side) {
	// 	for (let i = 0; i < this.selection.length; i++) {
	// 		const element = this.selection[i]!;
	// 		if (bracelet == element.bracelet && side == element.side) {
	// 			this.selection.splice(i, 1);
	// 			bracelet.deselect(side);
	// 			return false;
	// 		}
	// 	}
	// 	this.selection.push({
	// 		bracelet: bracelet,
	// 		side: side
	// 	})
	// 	bracelet.select(side);
	// 	return true;
	// }

	// /**
	//  * Deselect the most recently selected bracelet side
	//  */
	// deselectLast() {
	// 	const element = this.selection.pop()!;
	// 	if (element) {
	// 		element.bracelet.deselect(element.side);
	// 	}
	// }

	// /**
	//  * Deselect all but the most recently selected bracelet side
	//  */
	// deselectAllButLast() {
	// 	for (let i = 0; i < this.selection.length - 1; i++) {
	// 		const element = this.selection[i]!;
	// 		element.bracelet.deselect(element.side);
			
	// 	}
	// 	this.selection.splice(0, this.selection.length - 1);
	// }

	// /**
	//  * Deselect all bracelet sides
	//  */
	// deselectAll() {
	// 	for (let i = 0; i < this.selection.length; i++) {
	// 		const element = this.selection[i]!;
	// 		element.bracelet.deselect(element.side);
	// 	}
	// 	this.selection = [];
	// }


	// isValidSelection(): boolean {
	// 	var player_key = undefined;
	// 	var player_lock = undefined;
	// 	var bracelet_key = undefined;
	// 	var bracelet_lock = undefined;
	// 	for (let i = 0; i < this.selection.length - 1; i++) {
	// 		const element = this.selection[i]!;
	// 		if (element.bracelet.player_id > 0 && element.side == 'key') {
	// 			player_key = element;
	// 		}
	// 	}
	// }

	isValidConnection(key: number, lock: number) {
		return true;
	}

	abc() {
		const bracelet1 = this.bracelets.bracelets[0]!;
		const bracelet2 = this.myStock.bracelets[1]!;
		bracelet1.prependLink(bracelet2.key_link);
	}

	///////////////////////////////////////////////////
	//// isClickable

	isClickable(bracelet: Bracelet, side: Side): boolean {
		return true;
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
	//// Event Handlers

	onClick(bracelet: Bracelet, side: Side): void {
		bracelet.toggle(side);
		// const isSelected = this.toggle(bracelet, side);
		// if (bracelet.player_id == 0) {
		// 	if (side == 'key') {
		// 		this.selection_public_key = bracelet;
		// 	}
		// 	else {
		// 		this.selection_public_lock = bracelet;
		// 	}
		// }
		// else {
		// 	if (side == 'key') {
		// 		this.selection_stock_key = bracelet;
		// 	}
		// 	else {
		// 		this.selection_stock_lock = bracelet;
		// 	}
		// }
		// if (!this.isValidSelection()) {
		// 	this.selection_public_key = undefined;
		// 	this.selection_public_lock = undefined;
		// 	this.selection_stock_key = undefined;
		// 	this.selection_stock_lock = undefined;
		// 	return this.onClick(bracelet, side);
		// }

	}

	///////////////////////////////////////////////////
	//// Player's action
	
	/*
		Here, you are defining methods to handle player's action (ex: results of mouse click on game objects).
		
		Most of the time, these methods:
		- check the action is possible at this game state.
		- make a call to the game server
	*/
	
	/*
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