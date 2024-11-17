<?php

namespace Bga\Games\LoveLinks;

require_once(APP_GAMEMODULE_PATH.'module/common/deck.game.php');

class LoveLinksDeck extends \Deck {
    private $game;
    private ?int $new_bracelet_id = null;

    function __construct($game) {
        parent::__construct();
        $this->game = $game;
    }

    /**
     * Create the link types and put then into the deck of their corresponding metal
     */
    function createDeck($card_types) {
        $metal = "bronze";
        $nbrs = array(
            BRONZE => 0,
            SILVER => 0,
            GOLD => 0
        );
        foreach ($card_types as $type_id => $card_type) {
            $nbrs[$card_type["metal"]]++;
        }
        foreach ($nbrs as $metal => $nbr) {
            $this->createCards(array(array('type' => 'null', 'type_arg' => 0, 'nbr' => $nbr)), $metal);
            $this->shuffle($metal);
        }
    }

    /**
     * Get a new unique bracelet id
     */
    function getNewBraceletId() {
        if ($this->new_bracelet_id != null) {
            //from cache
            $this->new_bracelet_id += 1;
        }
        else {
            //get the lowest unique bracelet id higher than all existing bracelets
            $this->new_bracelet_id = 1;
            $links = $this->getCardsInLocation(BRACELETS);
            foreach ($links as $link_id => $link) {
                $bracelet_id = $link["location_arg"];
                if ($this->new_bracelet_id <= $bracelet_id) {
                    $this->new_bracelet_id = $bracelet_id + 1;
                }
            }
        }
        return $this->new_bracelet_id;
    }

    /**
     * Assign the given card ids to a player by modifying the 'type_arg'
     * @param array $card_ids
     * @param int $plalyer_id
     */
    function assignCards($card_ids, $player_id) {
        $sql = "UPDATE ".$this->table." SET card_type_arg='".addslashes($player_id)."' ";
        $sql .= "WHERE card_id IN ('".implode( "','", $card_ids )."') ";
        self::DbQuery( $sql );
    }
}