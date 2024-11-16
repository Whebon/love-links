<?php

namespace Bga\Games\LoveLinks;

require_once(APP_GAMEMODULE_PATH.'module/common/deck.game.php');

class LoveLinksDeck extends \Deck {
    private $game;

    function __construct($game) {
        parent::__construct();
        $this->game = $game;
    }

    /**
     * Create the link types and put then into the deck of their corresponding metal
     */
    function createDeck($card_types) {
        $cards = array();
        $metal = "bronze";
        $nbrs = array(
            "bronze" => 0,
            "silver" => 0,
            "gold" => 0
        );
        foreach ($card_types as $type_id => $card_type) {
            $nbrs[$card_type["metal"]]++;
        }
        foreach ($nbrs as $metal => $nbr) {
            $cards[] = array('type' => 'null', 'type_arg' => 0, 'nbr' => $nbr);
            $this->createCards($cards, $metal);
            $this->shuffle($metal);
        }
    }
}