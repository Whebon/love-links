/*
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * LoveLinks implementation : © Bart Swinkels
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 */

import { DbCard } from './components/DbCard';
import { Side } from './components/Side';
import { Metal } from './components/Metal';
import { Bonus } from './components/Bonus';

// If you have any imports/exports in this file, 'declare global' is access/merge your game specific types with framework types. 'export {};' is used to avoid possible confusion with imports/exports.
declare global {

	/** @gameSpecific Add game specific notifications / arguments here. See {@link NotifTypes} for more information. */
	interface NotifTypes {
		// [name: string]: any; // Uncomment to remove type safety on notification names and arguments
		'newBracelet': {
			player_id?: number, //(optional) if not provided, do not attach a gemstone
			link_id: number
		},
		'refillStock': {
			player_id: number,
			links: {[link_id: number]: DbCard}
		}
		'placeLink': {
			player_id: number,
			bracelet_id: number,
			link: DbCard,
			side: Side | "both"
		}
		'startRound': {
			round: number
		}
		'removeBracelet': {
			player_id: number,
			bracelet_id: number,
			nbr_links: number,
			links: {[link_id: number]: DbCard}
		}
		'scoreBracelet': {
			player_id: number,
			bracelet_id: number,
			points: number
		}
		'debugMessage': {
			msg: string
		}
	}

	/** @gameSpecific Add game specific gamedatas arguments here. See {@link Gamedatas} for more information. */
	interface Gamedatas {
		// [key: string | number]: Record<keyof any, any>; // Uncomment to remove type safety on game state arguments
		'card_types': {
			[link_id: number]: {
				key: number,
				lock: number,
				metal: Metal,
				bonus: Bonus
			}
		}
		'round': number
		'stocks': {[player_id: number]: {[link_id: number]: DbCard}}
		'bracelets': {[bracelet_id: number]: {[i: number]: DbCard}}
		'completed': {[bracelet_id: number]: {[i: number]: DbCard}}
		'bronze_remaining': {[link_id: number]: DbCard},
		'silver_remaining': {[link_id: number]: DbCard},
		'gold_remaining': {[link_id: number]: DbCard}
	}

	//
	// When gamestates.jsonc is enabled in the config, the following types are automatically generated. And you should not add to anything to 'GameStates' or 'PlayerActions'. If gamestates.jsonc is enabled, 'GameStates' and 'PlayerActions' can be removed from this file.
	//

	interface GameStates {
		// [id: number]: string | { name: string, argsType: object} | any; // Uncomment to remove type safety with ids, names, and arguments for game states
	}

	/** @gameSpecific Add game specific player actions / arguments here. See {@link PlayerActions} for more information. */
	interface PlayerActions {
		// [action: string]: Record<keyof any, any>; // Uncomment to remove type safety on player action names and arguments
	}

	/** @gameSpecific Add game specific client game states */
	interface ClientGameStates {
		'newBracelet': {}
		'client_placeLink': {}
		'client_completeBracelet': {}
		'client_confirm': {}
	}
}

export {}; // Force this file to be a module.