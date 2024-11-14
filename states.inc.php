<?php
declare(strict_types=1);
/*
 * THIS FILE HAS BEEN AUTOMATICALLY GENERATED. ANY CHANGES MADE DIRECTLY MAY BE OVERWRITTEN.
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * LoveLinks implementation : © Bart Swinkels
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 */

/**
 * TYPE CHECKING ONLY, this function is never called.
 * If there are any undefined function errors here, you MUST rename the action within the game states file, or create the function in the game class.
 * If the function does not match the parameters correctly, you are either calling an invalid function, or you have incorrectly added parameters to a state function.
 */
if (false) {
	/** @var lovelinks $game */
	$game->stEndTurn();
}

$machinestates = array(
	1 => array(
		'name' => 'gameSetup',
		'description' => '',
		'type' => 'manager',
		'action' => 'stGameSetup',
		'transitions' => array(
			'' => 2,
		),
	),
	2 => array(
		'name' => 'playerTurn',
		'description' => clienttranslate('${actplayer} must take actions'),
		'descriptionmyturn' => clienttranslate('${you} must take actions'),
		'type' => 'activeplayer',
		'possibleactions' => ['actSubmitCommands'],
		'transitions' => array(
			'trEndTurn' => 3,
		),
	),
	3 => array(
		'name' => 'endTurn',
		'description' => '',
		'type' => 'game',
		'action' => 'stEndTurn',
		'updateGameProgression' => true,
		'transitions' => array(
			'trNextTurn' => 2,
			'trEndGame' => 99,
		),
	),
	99 => array(
		'name' => 'gameEnd',
		'description' => clienttranslate('End of game'),
		'type' => 'manager',
		'action' => 'stGameEnd',
		'args' => 'argGameEnd',
	),
);