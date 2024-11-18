<?php
/**
 *------
 * BGA framework: Gregory Isabelli & Emmanuel Colin & BoardGameArena
 * LoveLinks implementation : © <Your name here> <Your email address here>
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 *
 * Game.php
 *
 * This is the main file for your game logic.
 *
 * In this PHP file, you are going to defines the rules of the game.
 */
declare(strict_types=1);

namespace Bga\Games\LoveLinks;

use BgaSystemException;
use BgaUserException;
use BgaVisibleSystemException;

require_once(APP_GAMEMODULE_PATH . "module/table/table.game.php");

if (!defined('STOCK')) {
    #locations
    define('STOCK', 'stock');
    define('BRACELET', 'bracelet');
    define('COMPLETED', 'completed');
    define('BRONZE', 'bronze');
    define('SILVER', 'silver');
    define('GOLD', 'gold');
    define('TEMP', 'temp');
    define('MASTER', 48);
}

class Game extends \Table
{
    private static array $CARD_TYPES;
    private LoveLinksDeck $deck;
    private ?string $dummyState = null;

    /**
     * Your global variables labels:
     *
     * Here, you can assign labels to global variables you are using for this game. You can use any number of global
     * variables with IDs between 10 and 99. If your game has options (variants), you also have to associate here a
     * label to the corresponding ID in `gameoptions.inc.php`.
     *
     * NOTE: afterward, you can get/set the global variables with `getGameStateValue`, `setGameStateInitialValue` or
     * `setGameStateValue` functions.
     */
    public function __construct()
    {
        parent::__construct();

        $this->initGameStateLabels([
            "round" => 10,
            "placements" => 11,
            "my_first_game_variant" => 100,
            "my_second_game_variant" => 101,
        ]);        

        self::$CARD_TYPES = [
            1 => [
                "key" => 2,
                "lock" => 3,
                "metal" => BRONZE
            ],
            2 => [
                "key" => 2,
                "lock" => 3,
                "metal" => BRONZE
            ],
            3 => [
                "key" => 2,
                "lock" => 4,
                "metal" => BRONZE
            ],
            4 => [
                "key" => 2,
                "lock" => 4,
                "metal" => BRONZE
            ],
            5 => [
                "key" => 2,
                "lock" => 5,
                "metal" => BRONZE
            ],
            6 => [
                "key" => 2,
                "lock" => 5,
                "metal" => BRONZE
            ],
            7 => [
                "key" => 2,
                "lock" => 6,
                "metal" => BRONZE
            ],
            8 => [
                "key" => 2,
                "lock" => 6,
                "metal" => BRONZE
            ],
            9 => [
                "key" => 2,
                "lock" => 7,
                "metal" => BRONZE
            ],
            10 => [
                "key" => 2,
                "lock" => 7,
                "metal" => BRONZE
            ],
            11 => [
                "key" => 2,
                "lock" => 8,
                "metal" => BRONZE
            ],
            12 => [
                "key" => 2,
                "lock" => 8,
                "metal" => BRONZE
            ],
            13 => [
                "key" => 3,
                "lock" => 2,
                "metal" => BRONZE
            ],
            14 => [
                "key" => 3,
                "lock" => 4,
                "metal" => BRONZE
            ],
            15 => [
                "key" => 3,
                "lock" => 4,
                "metal" => BRONZE
            ],
            16 => [
                "key" => 3,
                "lock" => 5,
                "metal" => BRONZE
            ],
            17 => [
                "key" => 3,
                "lock" => 5,
                "metal" => BRONZE
            ],
            18 => [
                "key" => 3,
                "lock" => 6,
                "metal" => BRONZE
            ],
            19 => [
                "key" => 3,
                "lock" => 6,
                "metal" => BRONZE
            ],
            20 => [
                "key" => 3,
                "lock" => 7,
                "metal" => BRONZE
            ],
            21 => [
                "key" => 3,
                "lock" => 7,
                "metal" => BRONZE
            ],
            22 => [
                "key" => 4,
                "lock" => 2,
                "metal" => BRONZE
            ],
            23 => [
                "key" => 4,
                "lock" => 5,
                "metal" => BRONZE
            ],
            24 => [
                "key" => 4,
                "lock" => 5,
                "metal" => BRONZE
            ],
            25 => [
                "key" => 4,
                "lock" => 6,
                "metal" => BRONZE
            ],
            26 => [
                "key" => 4,
                "lock" => 6,
                "metal" => BRONZE
            ],
            27 => [
                "key" => 5,
                "lock" => 2,
                "metal" => BRONZE
            ],
            28 => [
                "key" => 5,
                "lock" => 3,
                "metal" => BRONZE
            ],
            29 => [
                "key" => 5,
                "lock" => 4,
                "metal" => BRONZE
            ],
            30 => [
                "key" => 5,
                "lock" => 4,
                "metal" => BRONZE
            ],
            31 => [
                "key" => 6,
                "lock" => 4,
                "metal" => BRONZE
            ],
            32 => [
                "key" => 7,
                "lock" => 2,
                "metal" => BRONZE
            ],
            33 => [
                "key" => 7,
                "lock" => MASTER,
                "metal" => BRONZE
            ],
            34 => [
                "key" => 7,
                "lock" => MASTER,
                "metal" => BRONZE
            ],
            35 => [
                "key" => 8,
                "lock" => 2,
                "metal" => BRONZE
            ],
            36 => [
                "key" => 2,
                "lock" => 9,
                "metal" => SILVER
            ],
            37 => [
                "key" => 2,
                "lock" => 9,
                "metal" => SILVER
            ],
            38 => [
                "key" => 2,
                "lock" => 10,
                "metal" => SILVER
            ],
            39 => [
                "key" => 2,
                "lock" => 10,
                "metal" => SILVER
            ],
            40 => [
                "key" => 3,
                "lock" => 8,
                "metal" => SILVER
            ],
            41 => [
                "key" => 3,
                "lock" => 8,
                "metal" => SILVER
            ],
            42 => [
                "key" => 3,
                "lock" => 9,
                "metal" => SILVER
            ],
            43 => [
                "key" => 3,
                "lock" => 9,
                "metal" => SILVER
            ],
            44 => [
                "key" => 3,
                "lock" => 10,
                "metal" => SILVER
            ],
            45 => [
                "key" => 3,
                "lock" => 10,
                "metal" => SILVER
            ],
            46 => [
                "key" => 4,
                "lock" => 7,
                "metal" => SILVER
            ],
            47 => [
                "key" => 4,
                "lock" => 7,
                "metal" => SILVER
            ],
            48 => [
                "key" => 4,
                "lock" => 8,
                "metal" => SILVER
            ],
            49 => [
                "key" => 4,
                "lock" => 8,
                "metal" => SILVER
            ],
            50 => [
                "key" => 4,
                "lock" => 9,
                "metal" => SILVER
            ],
            51 => [
                "key" => 4,
                "lock" => 9,
                "metal" => SILVER
            ],
            52 => [
                "key" => 5,
                "lock" => 6,
                "metal" => SILVER
            ],
            53 => [
                "key" => 5,
                "lock" => 6,
                "metal" => SILVER
            ],
            54 => [
                "key" => 5,
                "lock" => 8,
                "metal" => SILVER
            ],
            55 => [
                "key" => 5,
                "lock" => 8,
                "metal" => SILVER
            ],
            56 => [
                "key" => 6,
                "lock" => 7,
                "metal" => SILVER
            ],
            57 => [
                "key" => 7,
                "lock" => 4,
                "metal" => SILVER
            ],
            58 => [
                "key" => 7,
                "lock" => 6,
                "metal" => SILVER
            ],
            59 => [
                "key" => 8,
                "lock" => 4,
                "metal" => SILVER
            ],
            60 => [
                "key" => 9,
                "lock" => 4,
                "metal" => SILVER
            ],
            61 => [
                "key" => 9,
                "lock" => MASTER,
                "metal" => SILVER
            ],
            62 => [
                "key" => 9,
                "lock" => MASTER,
                "metal" => SILVER
            ],
            63 => [
                "key" => 10,
                "lock" => 3,
                "metal" => SILVER
            ],
            64 => [
                "key" => 10,
                "lock" => MASTER,
                "metal" => SILVER
            ],
            65 => [
                "key" => 10,
                "lock" => MASTER,
                "metal" => SILVER
            ],
            66 => [
                "key" => 4,
                "lock" => 10,
                "metal" => GOLD
            ],
            67 => [
                "key" => 4,
                "lock" => 10,
                "metal" => GOLD
            ],
            68 => [
                "key" => 5,
                "lock" => 9,
                "metal" => GOLD
            ],
            69 => [
                "key" => 5,
                "lock" => 9,
                "metal" => GOLD
            ],
            70 => [
                "key" => 5,
                "lock" => 10,
                "metal" => GOLD
            ],
            71 => [
                "key" => 5,
                "lock" => 10,
                "metal" => GOLD
            ],
            72 => [
                "key" => 6,
                "lock" => 8,
                "metal" => GOLD
            ],
            73 => [
                "key" => 6,
                "lock" => 10,
                "metal" => GOLD
            ],
            74 => [
                "key" => 6,
                "lock" => 10,
                "metal" => GOLD
            ],
            75 => [
                "key" => 7,
                "lock" => 8,
                "metal" => GOLD
            ],
            76 => [
                "key" => 7,
                "lock" => 8,
                "metal" => GOLD
            ],
            77 => [
                "key" => 7,
                "lock" => 9,
                "metal" => GOLD
            ],
            78 => [
                "key" => 7,
                "lock" => 10,
                "metal" => GOLD
            ],
            79 => [
                "key" => 7,
                "lock" => 10,
                "metal" => GOLD
            ],
            80 => [
                "key" => 8,
                "lock" => 6,
                "metal" => GOLD
            ],
            81 => [
                "key" => 8,
                "lock" => 9,
                "metal" => GOLD
            ],
            82 => [
                "key" => 8,
                "lock" => 10,
                "metal" => GOLD
            ],
            83 => [
                "key" => 8,
                "lock" => 10,
                "metal" => GOLD
            ],
            84 => [
                "key" => 9,
                "lock" => 6,
                "metal" => GOLD
            ],
            85 => [
                "key" => 9,
                "lock" => 8,
                "metal" => GOLD
            ],
            86 => [
                "key" => 9,
                "lock" => 8,
                "metal" => GOLD
            ],
            87 => [
                "key" => 9,
                "lock" => 10,
                "metal" => GOLD
            ],
            88 => [
                "key" => 9,
                "lock" => 10,
                "metal" => GOLD
            ],
            89 => [
                "key" => 10,
                "lock" => 4,
                "metal" => GOLD
            ],
            90 => [
                "key" => 10,
                "lock" => 7,
                "metal" => GOLD
            ],
            91 => [
                "key" => 10,
                "lock" => 8,
                "metal" => GOLD
            ],
            92 => [
                "key" => 10,
                "lock" => 9,
                "metal" => GOLD
            ],
        ];

        $this->deck = new LoveLinksDeck($this);
        $this->deck->init("card");
    }

    /////////////////////////////////////////////////
    ///////  ~actions
    
    public function actMultipleActions($actions) {
        $VALID_ACTIONS = [
             "playerTurn" => ["actPlaceLink", "actNewBracelet"],
             "newBracelet" => ["actNewBracelet"],
             "endTurn" => []
        ];
        $this->dummyState = "playerTurn";
        foreach ($actions as $named_action) {
            $name = $named_action['name'];
            $args = $named_action['args'];
            if (in_array($name, $VALID_ACTIONS[$this->dummyState])) {
                if (method_exists($this, $name)) {
                    call_user_func_array([$this, $name], $args);
                } else {
                    throw new BgaSystemException("Action '".$name."'does not exist");
                }
            }
            else {
                $dummyState = $this->dummyState;
                throw new BgaSystemException("Action '$name' is not valid in dummyState '$dummyState'");
            }
        }
        if ($this->dummyState != "endTurn") {
            $dummyState = "endTurn";
            throw new BgaSystemException("Sequence of actions did not lead to dummyState '$dummyState'");
        }
        $this->gamestate->nextState("trEndTurn");
    }

    /**
     * @param int $link_id. must be a link from the active player's stock
     * @param int $bracelet_id. corresponds to a location arg
     * @param string $side. "key" | "lock" | "both"
     */
    public function actPlaceLink(int $link_id, int $bracelet_id, string $side): void {
        //get links from the expected locations
        $player_id = $this->getActivePlayerId();
        $this->deck->getCardsFromLocation(array($link_id), STOCK.$player_id);
        $bracelet = $this->deck->getCardsInLocation(BRACELET.$bracelet_id, null, 'location_arg');
        if (count($bracelet) == 0) {
            throw new BgaSystemException("Unable to extend an empty bracelet ($bracelet_id)");
        }

        //verify placement rules
        if ($side == "key" || $side == "both") {
            $key_link_id = reset($bracelet)["id"];
            $lock_link_id = $link_id;
            if (!$this->isValidConnection($key_link_id, $lock_link_id)) {
                throw new BgaUserException(_("The placed link does not connect to the key side of the bracelet"));
            }
        }
        if ($side == "lock" || $side == "both") {
            $key_link_id = $link_id;
            $lock_link_id = end($bracelet)["id"];
            if (!$this->isValidConnection($key_link_id, $lock_link_id)) {
                throw new BgaUserException(_("The placed link does not connect to the lock side of the bracelet"));
            }
        }

        //extend the bracelet
        $location_arg = $side == "key" ? reset($bracelet)["location_arg"] - 1 : end($bracelet)["location_arg"] + 1;
        $this->deck->moveCard($link_id, BRACELET.$bracelet_id, $location_arg);

        //increase the number of placements this turn
        $placements = $this->getGameStateValue("placements");
        $this->setGameStateValue("placements", $placements + 1);

        //if the player cannot make a move, they need to start a new bracelet as a free action
        $placements = $this->getGameStateValue("placements");
        if ($placements == 2) {
            $this->dummyState = "endTurn";
            $this->gamestate->nextState("trEndTurn");
        }

        //if the player completed a bracelet, they need to start a new bracelet as a free action
        if ($side == "both") {
            throw new BgaUserException("TODO: complete bracelet, something with trNewBracelet"); //TODO
        }
        
        
        //continue or end turn 
        if ($placements == 2) {
            $this->dummyState = "endTurn";
            throw new BgaVisibleSystemException("TODO: ONLY if the undo setting is turned off, change states");
            $this->gamestate->nextState("trEndTurn");
        }
    }

    /**
     * @param int $link_id. this will also be the id for the new bracelet
    */
    public function actNewBracelet(int $link_id) {
        $this->createBraceletFromActivePlayer($link_id);

        //2 cases:
        // * if the player cannot make a move, they are allowed to start a new bracelet
        // * if the player completed a bracelet, they need to start a new bracelet as a free action

        $this->dummyState = "playerTurn";
        throw new BgaVisibleSystemException("TODO: ONLY if the undo setting is turned off, change states");
        $this->gamestate->nextState("trPlayerTurn");
    }

    /**
     * Player action, example content.
     *
     * In this scenario, each time a player plays a card, this method will be called. This method is called directly
     * by the action trigger on the front side with `bgaPerformAction`.
     *
     * @throws BgaUserException
     */
    public function actPlayCard(int $card_id): void
    {
        // Retrieve the active player ID.
        $player_id = (int)$this->getActivePlayerId();

        // check input values
        $args = $this->argPlayerTurn();
        $playableCardsIds = $args['playableCardsIds'];
        if (!in_array($card_id, $playableCardsIds)) {
            throw new \BgaUserException('Invalid card choice');
        }

        // Add your game logic to play a card here.
        $card_name = self::$CARD_TYPES[$card_id]['card_name'];

        // Notify all players about the card played.
        $this->notifyAllPlayers("cardPlayed", clienttranslate('${player_name} plays ${card_name}'), [
            "player_id" => $player_id,
            "player_name" => $this->getActivePlayerName(),
            "card_name" => $card_name,
            "card_id" => $card_id,
            "i18n" => ['card_name'],
        ]);

        // at the end of the action, move to the next state
        $this->gamestate->nextState("playCard");
    }

    public function actPass(): void
    {
        // Retrieve the active player ID.
        $player_id = (int)$this->getActivePlayerId();

        // Notify all players about the choice to pass.
        $this->notifyAllPlayers("cardPlayed", clienttranslate('${player_name} passes'), [
            "player_id" => $player_id,
            "player_name" => $this->getActivePlayerName(),
        ]);

        // at the end of the action, move to the next state
        $this->gamestate->nextState("pass");
    }

    /**
     * Game state arguments, example content.
     *
     * This method returns some additional information that is very specific to the `playerTurn` game state.
     *
     * @return array
     * @see ./states.inc.php
     */
    public function argPlayerTurn(): array
    {
        // Get some values from the current game situation from the database.

        return [
            "playableCardsIds" => [1, 2],
        ];
    }

    /**
     * Compute and return the current game progression.
     *
     * The number returned must be an integer between 0 and 100.
     *
     * This method is called each time we are in a game state with the "updateGameProgression" property set to true.
     *
     * @return int
     * @see ./states.inc.php
     */
    public function getGameProgression()
    {
        // TODO: compute and return the game progression

        return 0;
    }

    /////////////////////////////////////////////////
    ///////  ~states

    public function stStartRound(): void {
        //update the round counter
        $round = $this->getGameStateValue("round");
        if ($round == 3) {
            $this->gamestate->nextState("trEndGame");
            return;
        }
        $round += 1;
        $this->setGameStateValue("round", $round);

        $players = $this->loadPlayersBasicInfos();
        foreach ($players as $player_id => $player) {
            $this->refillStock($player_id, $round);
        }

        $this->refillBracelets($round);
        
        $this->gamestate->nextState("trPlayerTurn");
    }


    /**
     * Game state action, example content.
     *
     * The action method of state `nextPlayer` is called everytime the current game state is set to `nextPlayer`.
     */
    public function stEndTurn(): void {
        // Reset the placements game state variable
        $this->setGameStateValue("placements", 0);

        // Retrieve the active player ID.
        $player_id = (int)$this->getActivePlayerId();

        // Give some extra time to the active player when he completed an action
        $this->giveExtraTime($player_id);
        
        $this->activeNextPlayer();

        //TODO: detect if we should move to the next round (stocks are empty).
        $allStockEmpty = false;
        if ($allStockEmpty) {
            $this->gamestate->nextState("trStartRound");
        }
        else {
            $this->gamestate->nextState("trPlayerTurn");
        }
    }

    
    /////////////////////////////////////////////////
    ///////  ~utility

    /**
     * A player creates a new bracelet
     * @param int $link_id
     */
    public function createBraceletFromActivePlayer(int $link_id) {
        $player_id = $this->getActivePlayerId();
        //$bracelet_id = $this->deck->getNewBraceletId(); //TODO: safely remove this
        $this->deck->moveCard($link_id, BRACELET.$link_id);
        $this->deck->assignCards(array($link_id), $player_id);
        $this->notifyAllPlayers('newBracelet', clienttranslate('${player_name} starts a new bracelet with ${link_name}'), array(
            "player_id" => $player_id,
            "player_name" => $this->getPlayerNameById($player_id),
            "link_id" => $link_id,
            "link_name" => $this->getLinkName($link_id)
        ));
    }

    /**
     * Create a new bracelet
     * @param int $link_id
     */
    public function createBraceletFromSupply(int $link_id) {
        //$bracelet_id = $this->deck->getNewBraceletId(); //TODO: safely remove this
        $this->deck->moveCard($link_id, BRACELET.$link_id);
        $this->notifyAllPlayers('newBracelet', clienttranslate('Starting a new bracelet with ${link_name}'), array(
            "link_name" => $this->getLinkName($link_id),
            "link_id" => $link_id
        ));
    }
    

    /**
     * Try to refill the stock of the player_id by drawing links from the supply
     */
    public function refillStock($player_id, $round = null) {
        if (!$round) {
            $round = $this->getGameStateValue("round");
        }
        switch($round) {
            case 1:
                $stock_size = 5;
                $metal = BRONZE;
                break;
            case 2:
                $stock_size = 4;
                $metal = SILVER;
                break;
            case 3:
                $stock_size = 4;
                $metal = GOLD;
                break;
            default:
                throw new BgaSystemException("Round ".$round." does not support refilling the stock");
                break;
        }
        $nbr = $stock_size - count($this->deck->getCardsInLocation(STOCK.$player_id));
        if ($nbr > 0) {
            $links = $this->deck->pickCardsForLocation($nbr, $metal, STOCK.$player_id);
            $this->notifyAllPlayers('refillStock', clienttranslate('${player_name} draws ${nbr} links from the supply'), array(
                "player_id" => $player_id,
                "player_name" => $this->getPlayerNameById($player_id),
                "nbr" => count($links),
                "links" => $links
            ));
        }
    }

    /**
     * At the start of the round, increase the number of bracelets to 5 by drawing links from the supply
     */
    public function refillBracelets($round) {
        if (!$round) {
            $round = $this->getGameStateValue("round");
        }
        switch($round) {
            case 1:
                $nbr = 5;
                $metal = BRONZE;
                break;
            case 2:
                $nbr = 5;
                $metal = SILVER;
                break;
            case 3:
                $nbr = 5;
                $metal = GOLD;
                break;
            default:
                throw new BgaSystemException("Round ".$round." does not support refilling the bracelets");
                break;
        }
        $links = $this->deck->pickCardsForLocation($nbr, $metal, TEMP);
        if (count($links) != $nbr) {
            throw new BgaSystemException("Expected the $metal supply to have $nbr links");
        }
        foreach ($links as $link) {
            $this->createBraceletFromSupply((int)$link["id"]);
        }
    }

    /**
     * Migrate database.
     *
     * You don't have to care about this until your game has been published on BGA. Once your game is on BGA, this
     * method is called everytime the system detects a game running with your old database scheme. In this case, if you
     * change your database scheme, you just have to apply the needed changes in order to update the game database and
     * allow the game to continue to run with your new version.
     *
     * @param int $from_version
     * @return void
     */
    public function upgradeTableDb($from_version)
    {
//       if ($from_version <= 1404301345)
//       {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = "ALTER TABLE DBPREFIX_xxxxxxx ....";
//            $this->applyDbUpgradeToAllDB( $sql );
//       }
//
//       if ($from_version <= 1405061421)
//       {
//            // ! important ! Use DBPREFIX_<table_name> for all tables
//
//            $sql = "CREATE TABLE DBPREFIX_xxxxxxx ....";
//            $this->applyDbUpgradeToAllDB( $sql );
//       }
    }

    /*
     * Gather all information about current game situation (visible by the current player).
     *
     * The method is called each time the game interface is displayed to a player, i.e.:
     *
     * - when the game starts
     * - when a player refreshes the game page (F5)
     */
    protected function getAllDatas()
    {
        $result = [];

        // WARNING: We must only return information visible by the current player.
        $current_player_id = (int) $this->getCurrentPlayerId();

        // Get information about players.
        // NOTE: you can retrieve some extra field you added for "player" table in `dbmodel.sql` if you need it.
        $result["players"] = $this->getCollectionFromDb(
            "SELECT `player_id` `id`, `player_score` `score` FROM `player`"
        );

        $result["round"] = $this->getGameStateValue("round");
        $result["placements"] = $this->getGameStateValue("placements");

        $result["card_types"] = self::$CARD_TYPES;
        $result["bronze_remaining"] = $this->deck->getCardsInLocation(BRONZE);
        $result["silver_remaining"] = $this->deck->getCardsInLocation(SILVER);
        $result["gold_remaining"] = $this->deck->getCardsInLocation(GOLD);

        $result["bracelets"] = $this->deck->getBracelets(BRACELET);
        $result["completed"] = $this->deck->getBracelets(COMPLETED);

        $result["stocks"] = array();
        foreach ($result["players"] as $player_id => $player) {
            $result["stocks"][$player_id] = $this->deck->getCardsInLocation(STOCK.$player_id);
        }

        // TODO: Gather all information about current game situation (visible by player $current_player_id).

        return $result;
    }

    //////////////////////////////////////////////
    /////////// Link functions

    /**
     * Returns true if `key_link` and `lock_link` can connect
     * @param mixed $key_link_id link id of the link on the KEY side
     * @param mixed $lock_link_id link id of the link on the LOCK side
     */
    public function isValidConnection(mixed $key_link_id, mixed $lock_link_id)  {
        $key = self::$CARD_TYPES[$key_link_id]["key"];
        $lock = self::$CARD_TYPES[$lock_link_id]["lock"];
        return $lock % $key === 0;
    }

    public function getLinkName(int $link_id) {
        $link = clienttranslate("link");
        $key = $this->getKey($link_id) == MASTER ? "M" : $this->getKey($link_id);
        $lock = $this->getLock($link_id) == MASTER ? "M" : $this->getLock($link_id);
        return $link." ".$key."-".$lock;
    }


    public function getKey(int $link_id) {
        return self::$CARD_TYPES[$link_id]["key"];
    }

    public function getLock(int $link_id) {
        return self::$CARD_TYPES[$link_id]["lock"];
    }

    /**
     * Returns the game name.
     *
     * IMPORTANT: Please do not modify.
     */
    protected function getGameName()
    {
        return "lovelinks";
    }

    /**
     * This method is called only once, when a new game is launched. In this method, you must setup the game
     *  according to the game rules, so that the game is ready to be played.
     */
    protected function setupNewGame($players, $options = [])
    {
        // Set the colors of the players with HTML color code. The default below is red/green/blue/orange/brown. The
        // number of colors defined here must correspond to the maximum number of players allowed for the gams.
        $gameinfos = $this->getGameinfos();
        $default_colors = $gameinfos['player_colors'];

        foreach ($players as $player_id => $player) {
            // Now you can access both $player_id and $player array
            $query_values[] = vsprintf("('%s', '%s', '%s', '%s', '%s')", [
                $player_id,
                array_shift($default_colors),
                $player["player_canal"],
                addslashes($player["player_name"]),
                addslashes($player["player_avatar"]),
            ]);
        }

        // Create players based on generic information.
        //
        // NOTE: You can add extra field on player table in the database (see dbmodel.sql) and initialize
        // additional fields directly here.
        static::DbQuery(
            sprintf(
                "INSERT INTO player (player_id, player_color, player_canal, player_name, player_avatar) VALUES %s",
                implode(",", $query_values)
            )
        );

        $this->reattributeColorsBasedOnPreferences($players, $gameinfos["player_colors"]);
        $this->reloadPlayersBasicInfos();

        // Init global values with their initial values.

        // Dummy content.
        $this->setGameStateInitialValue("round", 0);
        $this->setGameStateInitialValue("placements", 0);

        // Init game statistics.
        //
        // NOTE: statistics used in this file must be defined in your `stats.inc.php` file.

        // Dummy content.
        // $this->initStat("table", "table_teststat1", 0);
        // $this->initStat("player", "player_teststat1", 0);

        // Create the links
        $this->deck->createDeck(self::$CARD_TYPES);

        // Activate first player once everything has been initialized and ready.
        $this->activeNextPlayer();
    }

    /**
     * This method is called each time it is the turn of a player who has quit the game (= "zombie" player).
     * You can do whatever you want in order to make sure the turn of this player ends appropriately
     * (ex: pass).
     *
     * Important: your zombie code will be called when the player leaves the game. This action is triggered
     * from the main site and propagated to the gameserver from a server, not from a browser.
     * As a consequence, there is no current player associated to this action. In your zombieTurn function,
     * you must _never_ use `getCurrentPlayerId()` or `getCurrentPlayerName()`, otherwise it will fail with a
     * "Not logged" error message.
     *
     * @param array{ type: string, name: string } $state
     * @param int $active_player
     * @return void
     * @throws feException if the zombie mode is not supported at this game state.
     */
    protected function zombieTurn(array $state, int $active_player): void
    {
        $state_name = $state["name"];

        if ($state["type"] === "activeplayer") {
            switch ($state_name) {
                default:
                {
                    $this->gamestate->nextState("zombiePass");
                    break;
                }
            }

            return;
        }

        // Make sure player is in a non-blocking status for role turn.
        if ($state["type"] === "multipleactiveplayer") {
            $this->gamestate->setPlayerNonMultiactive($active_player, '');
            return;
        }

        throw new \feException("Zombie mode not supported at this game state: \"{$state_name}\".");
    }
}
