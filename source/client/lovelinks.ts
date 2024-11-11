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

import { Link } from "./components/Link"
import { BraceletArea } from "./components/BraceletArea"
import { TPL } from "./components/TPL"

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
		console.log('lovelinks constructor');
	}

	/** @gameSpecific See {@link Gamegui.setup} for more information. */
	override setup(gamedatas: Gamedatas): void
	{
		console.log( "Starting game setup" );
		TPL.init(this);
		const gamePlayArea = document.getElementById("game_play_area")!;

		this.bracelets = new BraceletArea(this, gamePlayArea, _("Bracelets"));
		for (const player_id in gamedatas.players) {
			const player = gamedatas.players[player_id]!;
			this.stocks[player_id] = new BraceletArea(this, gamePlayArea, TPL.stockTitle(player_id));

			// debug: create some bracelets
			for (let i = 0; i < 5; i++) {
				const bracelet = this.stocks[player_id].createBracelet();
				bracelet.appendLink(new Link(0, 0, 0));
			}

		}

		// debug: create some bracelets
		for (let i = 0; i < 3; i++) {
			const bracelet = this.bracelets.createBracelet();
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

	abc() {
		const bracelet1 = this.bracelets.bracelets[0]!;
		const bracelet2 = this.myStock.bracelets[1]!;
		bracelet1.prependLink(bracelet2.link);
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