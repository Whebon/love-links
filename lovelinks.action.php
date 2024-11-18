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

	public function actMultipleActions()
	{
		self::setAjaxMode();

		/** @var string $actions */
		$actions = self::getArg('actions', AT_json, true);

		$this->game->actMultipleActions( $actions );
		self::ajaxResponse();
	}

	public function actPlaceLink()
	{
		self::setAjaxMode();

		/** @var int $link_id */
		$link_id = self::getArg('link_id', AT_int, true);
		/** @var int $bracelet_id */
		$bracelet_id = self::getArg('bracelet_id', AT_int, true);
		/** @var string $side */
		$side = self::getArg('side', AT_enum, true, );

		$this->game->actPlaceLink( $link_id, $bracelet_id, $side );
		self::ajaxResponse();
	}

	public function actNewBracelet()
	{
		self::setAjaxMode();

		/** @var int $link_id */
		$link_id = self::getArg('link_id', AT_int, true);

		$this->game->actNewBracelet( $link_id );
		self::ajaxResponse();
	}
}