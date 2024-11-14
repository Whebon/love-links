<?php
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

class action_lovelinks extends APP_GameAction
{
	/** @var lovelinks $game */
	protected $game; // Enforces functions exist on Table class

	// Constructor: please do not modify
	public function __default()
	{
		if (self::isArg('notifwindow')) {
			$this->view = "common_notifwindow";
			$this->viewArgs['table'] = self::getArg("table", AT_posint, true);
		} else {
			$this->view = "lovelinks_lovelinks";
			self::trace("Complete reinitialization of board game");
		}
	}

	public function actSubmitCommands()
	{
		self::setAjaxMode();

		/** @var string $commands */
		$commands = self::getArg('commands', AT_json, true);

		$this->game->actSubmitCommands( $commands );
		self::ajaxResponse();
	}
}