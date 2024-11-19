<?php

namespace Bga\Games\LoveLinks;

use BgaSystemException;

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

    //TODO: safely delete this
    // /**
    //  * Get a new unique bracelet id
    //  */
    // function getNewBraceletId() {
    //     if ($this->new_bracelet_id != null) {
    //         //from cache
    //         $this->new_bracelet_id += 1;
    //     }
    //     else {
    //         //get the lowest unique bracelet id higher than all existing bracelets
    //         $this->new_bracelet_id = 1;
    //         $links = array_merge($this->getCardsInLocation(COMPLETED), $this->getCardsInLocation(BRACELET));
    //         foreach ($links as $link_id => $link) {
    //             $bracelet_id = $link["location_arg"];
    //             if ($this->new_bracelet_id <= $bracelet_id) {
    //                 $this->new_bracelet_id = $bracelet_id + 1;
    //             }
    //         }
    //     }
    //     return $this->new_bracelet_id;
    // }

    function getCardFromLocation($card_id, $location, $location_arg = null) {
        return current($this->getCardsFromLocation(array($card_id), $location, $location_arg));
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

    /**
     * Get cards in a bracelet location grouped by bracelet
     */
    function getBracelets(string $location_prefix): array {
        if ($location_prefix != BRACELET && $location_prefix != COMPLETED) {
            throw new BgaSystemException("getBracelets is only defined for bracelet locations, not '".$location_prefix."'");
        }
        $all_links = $this->getCardsInLocationPrefix($location_prefix);
        $bracelets = array();
        foreach ($all_links as $link) {
            $bracelet_id = substr($link["location"], strlen($location_prefix));
            if (!array_key_exists($bracelet_id, $bracelets)) {
                $bracelets[$bracelet_id] = array();
            }
            $bracelets[$bracelet_id][] = $link;
        }
        return $bracelets;
    }

    function getCardsInLocationPrefix($location_prefix) {
        $result = array();
        $sql = "SELECT card_id id, card_type type, card_type_arg type_arg, card_location location, card_location_arg location_arg ";
        $sql .= "FROM ".$this->table;
        $sql .= " WHERE card_location LIKE '".addslashes($location_prefix)."%' ";
        $sql .= "ORDER BY location_arg";
        $dbres = self::DbQuery( $sql );
        while( $row = mysql_fetch_assoc( $dbres ) ){
            $result[] = $row;
        }
        return $result;
    }
}