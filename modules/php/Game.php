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

use function PHPSTORM_META\map;

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
    define('MASTER', 240);
    define('NOBONUS', 'nobonus');
    define('EMERALD', 'emerald');
    define('DIAMOND', 'diamond');
}

class Game extends \Table
{
    private static int $SHORT_GAME_POINTS_TO_WIN = 90;
    private static array $CARD_TYPES;
    private static int $PLACEMENTS_PER_TURN = 2;
    private LoveLinksDeck $deck;
    private ?string $dummyTransition; //used for the undo feature

    const TEAM_1_3 = 1;
	const TEAM_1_2 = 2;
	const TEAM_1_4 = 3;
	const TEAM_RANDOM = 4;

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
            "mandatory_new_bracelet" => 12,
            "is_second_perfect_match" => 13,
            "zombie_turn" => 14,
            "game_length" => 100,
            "allow_undo" => 101,
            "teams" => 102,
        ]);        

        self::$CARD_TYPES = [
            1 => [
                "key" => 2,
                "lock" => 3,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            2 => [
                "key" => 2,
                "lock" => 3,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            3 => [
                "key" => 2,
                "lock" => 4,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            4 => [
                "key" => 2,
                "lock" => 4,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            5 => [
                "key" => 2,
                "lock" => 5,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            6 => [
                "key" => 2,
                "lock" => 5,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            7 => [
                "key" => 2,
                "lock" => 6,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            8 => [
                "key" => 2,
                "lock" => 6,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            9 => [
                "key" => 2,
                "lock" => 7,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            10 => [
                "key" => 2,
                "lock" => 7,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            11 => [
                "key" => 2,
                "lock" => 8,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            12 => [
                "key" => 2,
                "lock" => 8,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            13 => [
                "key" => 3,
                "lock" => 2,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            14 => [
                "key" => 3,
                "lock" => 4,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            15 => [
                "key" => 3,
                "lock" => 4,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            16 => [
                "key" => 3,
                "lock" => 5,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            17 => [
                "key" => 3,
                "lock" => 5,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            18 => [
                "key" => 3,
                "lock" => 6,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            19 => [
                "key" => 3,
                "lock" => 6,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            20 => [
                "key" => 3,
                "lock" => 7,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            21 => [
                "key" => 3,
                "lock" => 7,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            22 => [
                "key" => 4,
                "lock" => 2,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            23 => [
                "key" => 4,
                "lock" => 5,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            24 => [
                "key" => 4,
                "lock" => 5,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            25 => [
                "key" => 4,
                "lock" => 6,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            26 => [
                "key" => 4,
                "lock" => 6,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            27 => [
                "key" => 5,
                "lock" => 2,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            28 => [
                "key" => 5,
                "lock" => 3,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            29 => [
                "key" => 5,
                "lock" => 4,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            30 => [
                "key" => 5,
                "lock" => 4,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            31 => [
                "key" => 6,
                "lock" => 4,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            32 => [
                "key" => 7,
                "lock" => 2,
                "metal" => BRONZE,
                "bonus" => DIAMOND
            ],
            33 => [
                "key" => 7,
                "lock" => MASTER,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            34 => [
                "key" => 7,
                "lock" => MASTER,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            35 => [
                "key" => 8,
                "lock" => 2,
                "metal" => BRONZE,
                "bonus" => NOBONUS
            ],
            36 => [
                "key" => 2,
                "lock" => 9,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            37 => [
                "key" => 2,
                "lock" => 9,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            38 => [
                "key" => 2,
                "lock" => 10,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            39 => [
                "key" => 2,
                "lock" => 10,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            40 => [
                "key" => 3,
                "lock" => 8,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            41 => [
                "key" => 3,
                "lock" => 8,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            42 => [
                "key" => 3,
                "lock" => 9,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            43 => [
                "key" => 3,
                "lock" => 9,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            44 => [
                "key" => 3,
                "lock" => 10,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            45 => [
                "key" => 3,
                "lock" => 10,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            46 => [
                "key" => 4,
                "lock" => 7,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            47 => [
                "key" => 4,
                "lock" => 7,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            48 => [
                "key" => 4,
                "lock" => 8,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            49 => [
                "key" => 4,
                "lock" => 8,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            50 => [
                "key" => 4,
                "lock" => 9,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            51 => [
                "key" => 4,
                "lock" => 9,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            52 => [
                "key" => 5,
                "lock" => 6,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            53 => [
                "key" => 5,
                "lock" => 6,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            54 => [
                "key" => 5,
                "lock" => 8,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            55 => [
                "key" => 5,
                "lock" => 8,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            56 => [
                "key" => 6,
                "lock" => 7,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            57 => [
                "key" => 7,
                "lock" => 4,
                "metal" => SILVER,
                "bonus" => EMERALD
            ],
            58 => [
                "key" => 7,
                "lock" => 6,
                "metal" => SILVER,
                "bonus" => EMERALD
            ],
            59 => [
                "key" => 8,
                "lock" => 4,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            60 => [
                "key" => 9,
                "lock" => 4,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            61 => [
                "key" => 9,
                "lock" => MASTER,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            62 => [
                "key" => 9,
                "lock" => MASTER,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            63 => [
                "key" => 10,
                "lock" => 3,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            64 => [
                "key" => 10,
                "lock" => MASTER,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            65 => [
                "key" => 10,
                "lock" => MASTER,
                "metal" => SILVER,
                "bonus" => NOBONUS
            ],
            66 => [
                "key" => 4,
                "lock" => 10,
                "metal" => GOLD,
                "bonus" => NOBONUS
            ],
            67 => [
                "key" => 4,
                "lock" => 10,
                "metal" => GOLD,
                "bonus" => NOBONUS
            ],
            68 => [
                "key" => 5,
                "lock" => 7,
                "metal" => GOLD,
                "bonus" => NOBONUS
            ],
            69 => [
                "key" => 5,
                "lock" => 9,
                "metal" => GOLD,
                "bonus" => NOBONUS
            ],
            70 => [
                "key" => 5,
                "lock" => 9,
                "metal" => GOLD,
                "bonus" => NOBONUS
            ],
            71 => [
                "key" => 5,
                "lock" => 10,
                "metal" => GOLD,
                "bonus" => NOBONUS
            ],
            72 => [
                "key" => 5,
                "lock" => 10,
                "metal" => GOLD,
                "bonus" => NOBONUS
            ],
            73 => [
                "key" => 5,
                "lock" => MASTER,
                "metal" => GOLD,
                "bonus" => NOBONUS
            ],
            74 => [
                "key" => 6,
                "lock" => 8,
                "metal" => GOLD,
                "bonus" => NOBONUS
            ],
            75 => [
                "key" => 6,
                "lock" => 10,
                "metal" => GOLD,
                "bonus" => NOBONUS
            ],
            76 => [
                "key" => 6,
                "lock" => 10,
                "metal" => GOLD,
                "bonus" => NOBONUS
            ],
            77 => [
                "key" => 7,
                "lock" => 8,
                "metal" => GOLD,
                "bonus" => EMERALD
            ],
            78 => [
                "key" => 7,
                "lock" => 8,
                "metal" => GOLD,
                "bonus" => EMERALD
            ],
            79 => [
                "key" => 7,
                "lock" => 9,
                "metal" => GOLD,
                "bonus" => EMERALD
            ],
            80 => [
                "key" => 7,
                "lock" => 10,
                "metal" => GOLD,
                "bonus" => EMERALD
            ],
            81 => [
                "key" => 7,
                "lock" => 10,
                "metal" => GOLD,
                "bonus" => EMERALD
            ],
            82 => [
                "key" => 8,
                "lock" => 6,
                "metal" => GOLD,
                "bonus" => NOBONUS
            ],
            83 => [
                "key" => 8,
                "lock" => 9,
                "metal" => GOLD,
                "bonus" => NOBONUS
            ],
            84 => [
                "key" => 8,
                "lock" => 10,
                "metal" => GOLD,
                "bonus" => NOBONUS
            ],
            85 => [
                "key" => 8,
                "lock" => 10,
                "metal" => GOLD,
                "bonus" => NOBONUS
            ],
            86 => [
                "key" => 9,
                "lock" => 6,
                "metal" => GOLD,
                "bonus" => NOBONUS
            ],
            87 => [
                "key" => 9,
                "lock" => 8,
                "metal" => GOLD,
                "bonus" => NOBONUS
            ],
            88 => [
                "key" => 9,
                "lock" => 8,
                "metal" => GOLD,
                "bonus" => NOBONUS
            ],
            89 => [
                "key" => 9,
                "lock" => 10,
                "metal" => GOLD,
                "bonus" => NOBONUS
            ],
            90 => [
                "key" => 9,
                "lock" => 10,
                "metal" => GOLD,
                "bonus" => NOBONUS
            ],
            91 => [
                "key" => 10,
                "lock" => 4,
                "metal" => GOLD,
                "bonus" => NOBONUS
            ],
            92 => [
                "key" => 10,
                "lock" => 7,
                "metal" => GOLD,
                "bonus" => DIAMOND
            ],
            93 => [
                "key" => 10,
                "lock" => 8,
                "metal" => GOLD,
                "bonus" => NOBONUS
            ],
            94 => [
                "key" => 10,
                "lock" => 9,
                "metal" => GOLD,
                "bonus" => NOBONUS
            ],
        ];

        $this->deck = new LoveLinksDeck($this);
        $this->deck->init("card");
    }

    /////////////////////////////////////////////////
    ///////  ~actions
    
    public function actMultipleActions($actions) {
        $VALID_ACTIONS = [
             "trPlayerTurn" => ["actPlaceLink", "actNewBracelet"],
             "trNewBracelet" => ["actNewBracelet"],
             "trEndTurn" => []
        ];
        $this->dummyTransition = "trPlayerTurn";
        foreach ($actions as $named_action) {
            $name = $named_action['name'];
            $args = $named_action['args'];
            if (in_array($name, $VALID_ACTIONS[$this->dummyTransition])) {
                if (method_exists($this, $name)) {
                    call_user_func_array([$this, $name], $args);
                } else {
                    throw new BgaSystemException("Action '".$name."'does not exist");
                }
            }
            else {
                $dummyTransition = $this->dummyTransition;
                throw new BgaSystemException("Action '$name' is not valid after dummyTransition '$dummyTransition'");
            }
        }
        if ($this->dummyTransition != "trEndTurn") {
            $dummyTransition = "trEndTurn";
            throw new BgaSystemException("Sequence of actions did not lead to dummyTransition '$dummyTransition'");
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
        $link = $this->deck->getCardFromLocation($link_id, STOCK.$player_id);
        $bracelet = $this->deck->getCardsInLocation(BRACELET.$bracelet_id, null, 'location_arg');
        if (count($bracelet) == 0) {
            throw new BgaSystemException("Unable to extend an empty bracelet ($bracelet_id)");
        }

        //verify placement rules
        if ($side == "key" || $side == "both") {
            $key_link_id = reset($bracelet)["id"];
            $lock_link_id = $link_id;
            if (!$this->isValidConnection($key_link_id, $lock_link_id)) {
                throw new BgaUserException(_("The placed link does not connect to the key side of the bracelet")." (#$key_link_id & #$lock_link_id)");
            }
        }
        if ($side == "lock" || $side == "both") {
            $key_link_id = $link_id;
            $lock_link_id = end($bracelet)["id"];
            if (!$this->isValidConnection($key_link_id, $lock_link_id)) {
                throw new BgaUserException(_("The placed link does not connect to the lock side of the bracelet")." (#$key_link_id & #$lock_link_id)");
            }
        }

        //check if the bracelet is long enough
        if ($side == "both" && count($bracelet) < 4) {
            throw new BgaUserException(_("Complete bracelets must be of at least length 5"));
        }

        //extend the bracelet
        $location_arg = $side == "key" ? reset($bracelet)["location_arg"] - 1 : end($bracelet)["location_arg"] + 1;
        $this->deck->moveCard($link_id, BRACELET.$bracelet_id, $location_arg);

        //notify the players
        $this->notifyAllPlayers('placeLink', clienttranslate('${player_name} places ${link_name}'), array(
            "player_id" => $player_id,
            "player_name" => $this->getPlayerNameById($player_id),
            "link" => $link,
            "link_id" => $link_id,
            "link_name" => $this->getLinkName($link_id),
            "bracelet_id" => $bracelet_id,
            "side" => $side
        ));

        //master lock penalty
        $this->masterLockPenalty($player_id, $bracelet_id, $link);

        //score "Matching Link Points"
        $this->scoreBraceletMatchingLink($player_id, $bracelet_id, $bracelet, $link_id, $side);

        //score points for completing a bracelet
        if ($side == "both") {
            $this->completeBracelet($bracelet_id);
        }

        //if this was a regular placement, increase the number of placements this turn
        $placements = $this->getGameStateValue("placements");
        if ($side != "both") {
            $placements += 1;
            $this->setGameStateValue("placements", $placements);
        }

        ////////////////////////////////////
        //////// next state

        //if the player ran out of links, end their turn
        $linksLeft = $this->deck->countCardsInLocation(STOCK.$player_id);
        if ($linksLeft == 0) {
            $this->dummyNextState("trEndTurn");
            return;
        }
       
        //if the player completed a bracelet, they need to start a new bracelet as a free action
        if ($side == "both") {
            $this->setGameStateValue("mandatory_new_bracelet", 1);
            $this->dummyNextState("trNewBracelet");
            return;
        }
        
        //continue or end turn 
        if ($placements == self::$PLACEMENTS_PER_TURN) {
            $this->dummyNextState("trEndTurn");
            return;
        }

        $this->dummyNextState("trPlayerTurn"); //needed for the zombie turn check...
    }

    /**
     * @param int $link_id. this will also be the id for the new bracelet
    */
    public function actNewBracelet(int $link_id) {
        $player_id = $player_id = $this->getActivePlayerId();
        $link = $this->deck->getCardFromLocation($link_id, STOCK.$player_id);

        //2 cases:
        // * if the player completed a bracelet, they need to start a new bracelet as a free action (mandatory_new_bracelet)
        // * if the player cannot make a move, they are allowed to start a new bracelet

        //make sure the player is allowed to start a new bracelet
        $mandatory_new_bracelet = $this->getGameStateValue("mandatory_new_bracelet");
        if ($mandatory_new_bracelet) {
            $this->setGameStateValue("mandatory_new_bracelet", 0);
        }
        else if ($this->hasPossibleMoves($player_id)) {
            throw new BgaUserException(_("Unable to start a new bracelet. You must extend an existing bracelet if possible."));
        }

        //create the new bracelet
        $bracelet_id = $link_id;
        $this->createBraceletFromActivePlayer($bracelet_id);

        //master lock penalty
        $this->masterLockPenalty($player_id, $bracelet_id, $link);

        //increase the number of placements this turn (if this is a "free action", the bracelet completion was not counted as a placement)
        $placements = $this->getGameStateValue("placements");
        $placements += 1;
        $this->setGameStateValue("placements", $placements);

        //if the player ran out of links, end their turn
        $linksLeft = $this->deck->countCardsInLocation(STOCK.$player_id);
        if ($linksLeft == 0) {
            $this->dummyNextState("trEndTurn");
            return;
        }

        //continue or end turn
        $placements = $this->getGameStateValue("placements");
        if ($placements == self::$PLACEMENTS_PER_TURN) {
            $this->dummyNextState("trEndTurn");
            return;
        }
        else {
            $this->dummyNextState("trPlayerTurn");
            return;
        }
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
    public function getGameProgression() {
        $counts = $this->deck->countCardsInLocations();
        $players = $this->loadPlayersBasicInfos();
        $total = count(self::$CARD_TYPES);
        $remaining = ($counts[BRONZE] ?? 0) + ($counts[SILVER] ?? 0) + ($counts[GOLD] ?? 0); 
        foreach ($players as $player_id => $player) {
            $remaining += $counts[STOCK.$player_id] ?? 0;
        }
        $long_game_progression = 100*(1 - $remaining/$total);
        if ($this->isLongGame()) {
            return $long_game_progression;
        }
        $short_game_progression = 100 * $this->dbGetMaxScore() / self::$SHORT_GAME_POINTS_TO_WIN;
        return max($short_game_progression, $long_game_progression);
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
        $msg = '';
        if ($round == 2) {
            $msg = clienttranslate('Bronze round complete, the silver round has begun');
        }
        else if ($round == 3) {
            $msg = clienttranslate('Silver round complete, the gold round has begun');
        }
        $this->notifyAllPlayers("startRound", $msg, array("round" => $round));

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
        // Refill the player's stock
        $player_id = (int)$this->getActivePlayerId();
        $round = $this->getGameStateValue("round");
        $this->refillStock($player_id, $round);

        // Increment the placement counter
        $placements = $this->getGameStateValue("placements", 0);
        $sql = "UPDATE player SET player_placements=player_placements+$placements WHERE player_id='$player_id'";
        $this->DbQuery($sql);

        // Reset the placements game state variable
        $this->setGameStateValue("placements", 0);
        $this->setGameStateValue("is_second_perfect_match", 0);
        $this->setGameStateValue("zombie_turn", 0);

        // Update the points per turn statistic
        $half_turns = $this->dbGetPlacements($player_id);
        $turns = $half_turns/2;
        $total_score = $this->dbGetScore($player_id);
        $points_per_turn = $total_score / max(1, $turns);
        $this->setStat($points_per_turn, "points_per_turn", $player_id);

        // Give some extra time to the active player when he completed an action
        $this->giveExtraTime($player_id, 60);

        // Activate the next player with a non-empty stock
        $locations = $this->deck->countCardsInLocations(STOCK.$player_id);
        $table = $this->getNextPlayerTable();
        $next_player_id = $player_id;
        while (true) {
            $next_player_id = $table[$next_player_id];
            if (key_exists(STOCK.$next_player_id, $locations)) {
                $this->gamestate->changeActivePlayer($next_player_id); //typically the next player
                $trigger_next_round = false;
                break;
            }
            if ($next_player_id == $player_id) {
                $trigger_next_round = true;
                break;
            }
        }

        //Check if the game has been won (short game only)
        if (!$this->isLongGame() && $this->dbGetScore($player_id) >= self::$SHORT_GAME_POINTS_TO_WIN) {
            $this->gamestate->nextState("trEndGame");
            return;
        }

        //Start the next round or next round
        if ($trigger_next_round) {
            $this->activeNextPlayer();
            $this->gamestate->nextState("trStartRound");
            return;
        }
        else {
            $this->gamestate->nextState("trPlayerTurn");
            return;
        }
    }

    
    /////////////////////////////////////////////////
    ///////  ~scoring

    /**
     * The active player completed a bracelet and scores points
     */
    public function completeBracelet($bracelet_id) {
        $player_id = $this->getActivePlayerId();
        $links = $this->deck->getCardsInLocation(BRACELET.$bracelet_id);
        $this->incStat(1, "bracelet_completed", $player_id);

        $this->notifyAllPlayers('startBraceletScoring', clienttranslate('${player_name} completed a bracelet'), array(
            "player_name" => $this->getPlayerNameById($player_id),
            "bracelet_id" => $bracelet_id
        ));

        $this->scoreBraceletMetal($player_id, $bracelet_id, $links);
        $this->scoreBraceletLongBracelet($player_id, $bracelet_id, $links);
        $this->scoreBraceletGemstone($player_id, $bracelet_id, $links);
        $this->scoreBraceletDomination($player_id, $bracelet_id, $links);
        $this->scoreBraceletDiamond($player_id, $bracelet_id, $links);
        $this->scoreBraceletEmerald($player_id, $bracelet_id, $links);
        $this->scoreBraceletTiebreaking($player_id, $bracelet_id, $links);

        $this->deck->moveAllCardsInLocationKeepOrder(BRACELET.$bracelet_id, COMPLETED.$bracelet_id);
        $this->notifyAllPlayers('removeBracelet', '', array(
            "player_id" => $player_id,
            "player_name" => $this->getPlayerNameById($player_id),
            "bracelet_id" => $bracelet_id,
            "links" => $links,
            "nbr_links" => count($links)
        ));
    }

    public function scoreBraceletMetal($player_id, $bracelet_id, $links) {
        $counts = array(
            BRONZE => 0,
            SILVER => 0,
            GOLD => 0
        );
        foreach ($links as $link_id => $link) {
            $counts[$this->getMetal($link_id)]++;
        }
        $this->scoreBracelet($player_id, $bracelet_id, 2*$counts[BRONZE], 'bronze', clienttranslate('${points} Metal points for ${player_name} scores ${points} points for ${nbr} bronze links(s)'), array(
            "nbr" => $counts[BRONZE]
        ));
        $this->scoreBracelet($player_id, $bracelet_id, 3*$counts[SILVER],  'silver', clienttranslate('${points} Metal points: ${player_name} scores ${points} points for ${nbr} silver links(s)'), array(
            "nbr" => $counts[SILVER]
        ));
        $this->scoreBracelet($player_id, $bracelet_id, 5*$counts[GOLD], 'gold', clienttranslate('${points} Metal points: ${player_name} scores ${points} points for ${nbr} golden link(s)'), array(
            "nbr" => $counts[GOLD]
        ));
        $this->incStat(2*$counts[BRONZE] + 3*$counts[SILVER] + 5*$counts[GOLD], "bronze_points", $player_id);
    }

    public function scoreBraceletLongBracelet($player_id, $bracelet_id, $links) {
        $length = count($links);
        $points = max(0, 2*$length-10);
        $this->scoreBracelet($player_id, $bracelet_id, $points, 'long', clienttranslate('${points} Long bracelet points: ${player_name} scores ${points} points for a bracelet of length ${length}'), array(
            "length" => $length
        ));
        $this->incStat($points, "long_bracelet_points", $player_id);
    }

    public function scoreBraceletGemstone($player_id, $bracelet_id, $links) {
        $players = $this->loadPlayersBasicInfos();
        $teammate_id = $this->getTeammateId($player_id);
        $playerGemstones = 0;
        foreach ($links as $link) {
            if ($link["type_arg"] == $player_id || $link["type_arg"] == $teammate_id) {
                $playerGemstones += 1;
            }
        }
        foreach ($players as $opponent_id => $opponent) {
            if ($opponent_id != $player_id && $opponent_id != $teammate_id) {
                $opponent_teammate_id = $this->getTeammateId($opponent_id);
                if ($opponent_teammate_id > $opponent_id) {
                    continue; //symmetry breaking: only penalize the opponent team once
                }
                $opponentGemstones = 0;
                foreach ($links as $link) {
                    if ($link["type_arg"] == $opponent_id || $link["type_arg"] == $opponent_teammate_id) {
                        $opponentGemstones += 1;
                    }
                }
                //die("[playerGemstones: $playerGemstones] [opponentGemstones: $opponentGemstones]");
                $points = $opponentGemstones > $playerGemstones ? -5 : 0;
                $msg = ($teammate_id == 0) ? 
                    clienttranslate('${points} Gemstone points: ${player_name}\' team loses ${negative_points} points, because they have ${opponentGemstones} gemstones in the bracelet (and the active player has ${playerGemstones} gemstones in the bracelet).') :
                    clienttranslate('${points} Gemstone points: ${player_name} loses ${negative_points} points, because they have ${opponentGemstones} gemstones in the bracelet (and the active team has ${playerGemstones} gemstones in the bracelet).');
                $this->scoreBracelet($opponent_id, $bracelet_id, $points, 'gemstones', $msg, array(
                        "opponentGemstones" => $opponentGemstones,
                        "playerGemstones" => $playerGemstones,
                        "negative_points" => -$points
                    )
                );
                $this->incStat($points, "gemstone_points", $player_id);
            }
        }
    }

    public function scoreBraceletDomination($player_id, $bracelet_id, $links) {
        $teammate_id = $this->getTeammateId($player_id);
        foreach ($links as $link_id => $link) {
            if ($link["type_arg"] != 0 && $link["type_arg"] != $player_id && $link["type_arg"] != $teammate_id) {
                return; //skip domination points if any gemstone is non-empty, non-owned
            }
        }
        $this->scoreBracelet($player_id, $bracelet_id, 10, 'domination', clienttranslate('${points} Domination points: ${player_name} scores ${points} points'), array());
        $this->incStat(10, "domination_points", $player_id);
    }

    public function scoreBraceletDiamond($player_id, $bracelet_id, $links) {
        $count = 0;
        foreach ($links as $link_id => $link) {
            if ($this->getBonus($link_id) == DIAMOND) {
                $count++;
            }
        }
        $points = 10*$count;
        $this->scoreBracelet($player_id, $bracelet_id, $points, 'diamond', clienttranslate('${points} Diamond points: ${player_name} scores ${points} points for ${nbr} diamond links(s)'), array(
            "nbr" => $count
        ));
        $this->incStat($points, "diamond_points", $player_id);
    }

    public function scoreBraceletEmerald($player_id, $bracelet_id, $links) {
        $count = 0;
        foreach ($links as $link_id => $link) {
            if ($this->getBonus($link_id) == EMERALD) {
                $count++;
            }
        }
        $points = 5*$count;
        $this->scoreBracelet($player_id, $bracelet_id, $points, 'emerald', clienttranslate('${points} Emerald points: ${player_name} scores ${points} points for ${nbr} emerald links(s)'), array(
            "nbr" => $count
        ));
        $this->incStat($points, "diamond_points", $player_id);
    }

    public function scoreBraceletMatchingLink($player_id, $bracelet_id, $bracelet, $link_id, $side) {
        $matches = 0;
        if ($side == "key" || $side == "both") {
            $key_link_id = reset($bracelet)["id"];
            $lock_link_id = $link_id;
            if ($this->isPerfectMatch($key_link_id, $lock_link_id)) {
                $matches += 1;
            }
        }
        if ($side == "lock" || $side == "both") {
            $key_link_id = $link_id;
            $lock_link_id = end($bracelet)["id"];
            if ($this->isPerfectMatch($key_link_id, $lock_link_id)) {
                $matches += 1;
            }
        }

        if ($matches == 0) {
            return;
        }

        if ($side == "both") {
            $points = 4*$matches;
            $suffix = ($matches == 1) ? 
                clienttranslate('points for the matching their link on one side') :
                clienttranslate('points for the matching their link on both sides');
        }
        else if ($this->getGameStateValue("is_second_perfect_match") == 1) {
            $points = 3;
            $suffix = clienttranslate('points for extending a bracelet with a matching link twice in one turn');
        }
        else {
            $points = 1;
            $suffix = clienttranslate('point for extending a bracelet with a matching link');
            $this->setGameStateValue("is_second_perfect_match", 1);
        }
    
        $this->scoreBracelet($player_id, $bracelet_id, $points, 'matching', clienttranslate('${points} Matching link points: ${player_name} scores ${points} ${suffix}'), array(
            "suffix" => $suffix
        ));
        $this->incStat($points, "matching_link_points", $player_id);
    }

    public function scoreBraceletTiebreaking($player_id, $bracelet_id, $links) {
        //count gemstones of other players
        $points = 0;
        $teammate_id = $this->getTeammateId($player_id);
        foreach ($links as $link) {
            if ($link["type_arg"] != 0 && $link["type_arg"] != $player_id && $link["type_arg"] != $teammate_id) {
                $points++;
            }
        }
        $sql = "UPDATE player SET player_score_aux=player_score_aux+$points WHERE player_id='$player_id' OR player_teammate_id='$player_id'";
        $this->DbQuery($sql);
        $this->incStat($points, "captured_gemstones", $player_id);
    }

    public function masterLockPenalty($player_id, $bracelet_id, $link) {
        if ($this->getLock((int)$link["id"]) == MASTER) {
            $points = -2;
            $this->scoreBracelet($player_id, $bracelet_id, $points, 'master', clienttranslate('${points} Master Lock Penalty: ${player_name} loses ${negative_points} points for placing the master lock'), array(
                "negative_points" => -$points
            ));
            $this->incStat(-2, "master_lock_penalties", $player_id);
        }
    }

    /**
     * Score points for a bracelet and notify players
     */
    public function scoreBracelet(mixed $player_id, mixed $bracelet_id, int $points, string $keyword, string $notificationLog, array $additionalNotificationArgs) {
        if ($points == 0) {
            return;
        }
        $notificationArgs = array_merge( array(
            "player_id" => $player_id,
            "player_name" => $this->getPlayerNameById($player_id),
            "bracelet_id" => $bracelet_id,
            "points" => $points,
            "keyword" => $keyword
        ), $additionalNotificationArgs);
        $this->notifyAllPlayers('scoreBracelet', $notificationLog, $notificationArgs);
        $sql = "UPDATE player SET player_score = player_score + $points WHERE player_id='$player_id' OR player_teammate_id='$player_id'";
        $this->DbQuery($sql);
    }

    /////////////////////////////////////////////////
    ///////  ~utility
    
    /**
     * Return the the player_id of the teammate of the given player_id. In non-teambased games, return -1 instead.
     */
    public function getTeammateId($player_id) {
        if (count($this->players) < 4) {
            return -1;
        }
        $sql = "SELECT player_teammate_id teammate_id FROM player WHERE player_id='$player_id'";
        $dbres = self::DbQuery( $sql );
        $row = mysql_fetch_assoc( $dbres );
        return $row['teammate_id'] > 0 ? $row['teammate_id'] : -1;
    }

    /**
     * Returns true if the given player_id is able to place down a piece
     */
    public function hasPossibleMoves($player_id) {
        $bracelets = $this->deck->getBracelets(BRACELET);
        $playerLinks = $this->deck->getCardsInLocation(STOCK.$player_id);
        foreach ($playerLinks as $playerLink) {
            foreach ($bracelets as $bracelet) {
                $key_link_id = reset($bracelet)["id"];
                $lock_link_id = end($bracelet)["id"];
                if ($this->isValidConnection($key_link_id, $playerLink["id"])) {
                    return true;
                }
                if ($this->isValidConnection($playerLink["id"], $lock_link_id)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * $this->gamestate->nextState(state), but behaves differently based on the "Allow undo" setting
     * On: stay in "playerTurn", but transition the dummy state
     * Off: actually transition to the state
     */
    public function dummyNextState(string $transition) {
        if ($this->allowUndo()) {
            $this->dummyTransition = $transition;
        }
        else {
            $this->gamestate->nextState($transition);
        }
    }
    
    /**
     * Converts an array of dbcards to an array of card ids
     * @param array $dbcards `$dbcards`
     * @return array `$card_ids`
     */
    function toCardIds(array $dbcards){
        $card_ids = array();
        foreach ($dbcards as $card) {
            $card_ids[] = $card["id"];
        }
        return $card_ids;
    }

    /**
     * Returns true based on the game option
     */
    function allowUndo() {
        return $this->getGameStateValue("allow_undo") == 1 && $this->getGameStateValue("zombie_turn") == 0;
    }

    /**
     * Returns true based on the game option
     */
    function isLongGame() {
        return $this->getGameStateValue("game_length") == 1;
    }

    /**
     * Get the placements of a particular player
     */
    function dbGetPlacements($player_id) {
        return $this->getUniqueValueFromDB("SELECT player_placements FROM player WHERE player_id='$player_id'");
    }

    /**
     * Get the score of a particular player
     */
    function dbGetScore($player_id) {
        return $this->getUniqueValueFromDB("SELECT player_score FROM player WHERE player_id='$player_id'");
    }

    /**
     * Get the maximum score among all players
     */
    function dbGetMaxScore() {
        return $this->getUniqueValueFromDB("SELECT MAX(player_score) FROM player");
    }

    /**
     * A player creates a new bracelet
     * @param int $link_id
     */
    public function createBraceletFromActivePlayer(int $link_id) {
        $player_id = $this->getActivePlayerId();
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
     * Create a new bracelet with a link
     */
    public function createBraceletFromSupply(int $link_id) {
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
            if (count($links) > 0) { 
                $this->deck->assignCards($this->toCardIds($links), $player_id);
                foreach ($links as &$link) {
                    $link["type_arg"] = $player_id;
                }
                $this->notifyAllPlayers('refillStock', clienttranslate('${player_name} draws ${nbr} new links from the supply (${link_names})'), array(
                    "player_id" => $player_id,
                    "player_name" => $this->getPlayerNameById($player_id),
                    "nbr" => count($links),
                    "links" => $links,
                    "link_names" => $this->getLinkNames($links)
                ));
            }
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
        $nbr -= count($this->deck->getBracelets(BRACELET));
        if ($nbr > 0) {
            $links = $this->deck->pickCardsForLocation($nbr, $metal, TEMP);
            if (count($links) != $nbr) {
                throw new BgaSystemException("Expected the $metal supply to have $nbr links");
            }
            foreach ($links as $link) {
                $this->createBraceletFromSupply((int)$link["id"]);
            }
        }
    }

    /**
     * Get first link id corresponding to a key lock pair
     */
    function getLinkId($key, $lock) {
        if ($lock == 0) {
            $lock = MASTER;
        }
        foreach (self::$CARD_TYPES as $type_id => $card_type) {
            if ($card_type["key"] == $key && $card_type["lock"] == $lock) {
                return $type_id;
            }
        }
        throw new BgaUserException("link $key - $lock does not exist");
    }

    /////////////////////////////////////////////////
    ///////  ~debug

    /**
     * Move all links back into the supply
     */
    function debugDestroyAll() {
        $links = $this->deck->getCardsInLocationPrefix("");
        foreach ($links as $_ => $link) { 
            $this->deck->moveCard($link["id"], $this->getMetal((int)$link["id"]));
        }
        $this->notifyAllPlayers('debugMessage', '', array('msg' => "debugDestroyAll successful, please REFRESH the page"));
    }

    /**
     * Move all links in bracelets back into the supply
     */
    function debugDestroyBracelets() {
        $links = $this->deck->getCardsInLocationPrefix(BRACELET);
        foreach ($links as $_ => $link) { 
            $this->deck->moveCard($link["id"], $this->getMetal((int)$link["id"]));
        }
    }

    /**
     * Move all links in the current player's stock back into the supply
     */
    function debugDestroyStock($player_id) {
        $links = $this->deck->getCardsInLocationPrefix(STOCK.$player_id);
        foreach ($links as $_ => $link) { 
            $this->deck->moveCard($link["id"], $this->getMetal((int)$link["id"]));
        }
    }

    /**
     * examples: 
     * debugBracelet(2,7,7,10,10,4,4,7)
     * debugBracelet(2,7,7,10,10,M,10,3)
     */
    function debugBracelet(...$key_lock_values) {
        $this->debugDestroyBracelets();
        $this->_debugBracelet(1000, ...$key_lock_values); 
    } 
    function debugBracelet1(...$key_lock_values) {
        $this->debugDestroyBracelets();
        $this->_debugBracelet(1001, ...$key_lock_values); 
    } 
    function debugBracelet2(...$key_lock_values) {
        $this->_debugBracelet(1002, ...$key_lock_values); 
    } 
    function debugBracelet3(...$key_lock_values) {
        $this->_debugBracelet(1003, ...$key_lock_values); 
    } 
    function debugBracelet4(...$key_lock_values) {
        $this->_debugBracelet(1004, ...$key_lock_values); 
    } 
    function debugBracelet5(...$key_lock_values) {
        $this->_debugBracelet(1005, ...$key_lock_values); 
    } 
    function _debugBracelet($bracelet_id, ...$key_lock_values) {
        $n = count($key_lock_values);
        if ($n % 2 == 1) {
            throw new BgaUserException("Please provide an even number of values");
        }
        for ($i = 0; $i < $n; $i+=2) { 
            $key = (int)$key_lock_values[$i];
            $lock = (int)$key_lock_values[$i+1];
            $link_id = $this->getLinkId($key, $lock);
            $gemstone = array_rand($this->getNextPlayerTable());
            $this->deck->assignCards(array($link_id), $gemstone);
            $this->deck->moveCard($link_id, BRACELET.$bracelet_id, $i/2);
        }
        $this->notifyAllPlayers('debugMessage', '', array('msg' => "debugBracelet successful, please REFRESH the page"));
    }

    /**
     * example: debugStock(7,2,7,4)
     */
    function debugStock(...$key_lock_values) {
        $player_id = $this->getCurrentPlayerId();
        $this->debugDestroyStock($player_id);
        $n = count($key_lock_values);
        if ($n % 2 == 1) {
            throw new BgaUserException("Please provide an even number of values");
        }
        for ($i = 0; $i < $n; $i+=2) { 
            $key = (int)$key_lock_values[$i];
            $lock = (int)$key_lock_values[$i+1];
            $link_id = $this->getLinkId($key, $lock);
            $this->deck->assignCards(array($link_id), $player_id);
            $this->deck->moveCard($link_id, STOCK.$player_id, $i/2);
        }
        $this->notifyAllPlayers('debugMessage', '', array('msg' => "debugStock successful, please REFRESH the page"));
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
            "SELECT `player_id` `id`, `player_score` `score`, `player_score_aux` `score_aux` FROM `player`"
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

        $result["allow_undo"] = $this->allowUndo();

        $result["points_to_win"] = $this->isLongGame() ? 0 : self::$SHORT_GAME_POINTS_TO_WIN;

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
        if ($lock == MASTER) {
            return in_array($key, [2, 3, 4, 5, 6, 8]);
        }
        return $lock % $key === 0;
    }

    /**
     * Returns true if `key_link` and `lock_link` match perfectly
     * @param mixed $key_link_id link id of the link on the KEY side
     * @param mixed $lock_link_id link id of the link on the LOCK side
     */
    public function isPerfectMatch(mixed $key_link_id, mixed $lock_link_id) {
        $key = self::$CARD_TYPES[$key_link_id]["key"];
        $lock = self::$CARD_TYPES[$lock_link_id]["lock"];
        return $lock == $key;
    }

    public function getLinkNames(array $links) {
        $n = count($links);
        $names = "";
        for ($i = 0; $i < $n; $i++) { 
            $names .= $this->getLinkName((int)$links[$i]["id"]);
            if ($i < $n - 2) {
                $names .= ", ";
            }
            else if ($i == $n - 2) {
                $names .= _(" and ");
            }
        }
        return $names;
    }

    public function getLinkName(int $link_id) {
        $link = clienttranslate("link");
        $key = $this->getKey($link_id) == MASTER ? "M" : $this->getKey($link_id);
        $lock = $this->getLock($link_id) == MASTER ? "M" : $this->getLock($link_id);
        return $link." ".$key."-".$lock;
    }

    public function getMetal(int $link_id) {
        return self::$CARD_TYPES[$link_id]["metal"];
    }

    public function getBonus(int $link_id) {
        return self::$CARD_TYPES[$link_id]["bonus"];
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

        // Create the players
        if (count($players) < 4) {
            // Free for all (2 or 3 players)
            static::DbQuery(
                sprintf(
                    "INSERT INTO player (player_id, player_color, player_canal, player_name, player_avatar) VALUES %s",
                    implode(",", $query_values)
                )
            );
    
            $this->reattributeColorsBasedOnPreferences($players, $gameinfos["player_colors"]);
            $this->reloadPlayersBasicInfos();
        }
        else {
            // Team based game (4 players, 2v2)
            // Retrieve inital player order ([0=>playerId1, 1=>playerId2, ...])
            $playerInitialOrder = [];
            foreach ($players as $playerId => $player) {
                $playerInitialOrder[$player['player_table_order']] = $playerId;
            }
            ksort($playerInitialOrder);
            $playerInitialOrder = array_flip(array_values($playerInitialOrder));
            // Player order based on 'teams' option
            $playerOrder = [0, 1, 2, 3];
            switch (self::getGameStateValue('teams')) {
                case self::TEAM_1_2:
                    $playerOrder = [0, 2, 1, 3];
                    break;
                case self::TEAM_1_4:
                    $playerOrder = [0, 1, 3, 2];
                    break;
                case self::TEAM_RANDOM:
                    shuffle($playerOrder);
                    break;
                case self::TEAM_1_3:
                    break;
            }

            $teammateIds = [];
            foreach( $players as $playerId => $player){
                $no = ($playerOrder[$playerInitialOrder[$playerId]] + 2) % 4;
                $teammateIds[$no] = $playerId;
            }

            // Create players
            // Note: if you added some extra field on "player" table in the database (dbmodel.sql), you can initialized it there.
            $sql = "INSERT INTO player (player_id, player_canal, player_name, player_avatar, player_no, player_teammate_id) VALUES ";
            $values = array();
            foreach( $players as $playerId => $player )
            {
                $no = $playerOrder[$playerInitialOrder[$playerId]];
                $values[] = 
                "('".$playerId."'
                ,'".$player['player_canal'].
                "','".addslashes( $player['player_name'] ).
                "','".addslashes( $player['player_avatar'] ).
                "','".$no.
                "','".$teammateIds[$no]."'
                )";
            }
            $sql .= implode( ',', $values );
            self::DbQuery( $sql );

            //update team colors
            self::DbQuery (" UPDATE player SET player_color = 'ff0000' WHERE player_no = 0 ");
            self::DbQuery (" UPDATE player SET player_color = '008000' WHERE player_no = 1 ");
            self::DbQuery (" UPDATE player SET player_color = 'ff0000' WHERE player_no = 2 ");
            self::DbQuery (" UPDATE player SET player_color = '008000' WHERE player_no = 3 ");

            $this->reloadPlayersBasicInfos();
        }

        // Init global values with their initial values.

        // Dummy content.
        $this->setGameStateInitialValue("round", 0);
        $this->setGameStateInitialValue("placements", 0);
        $this->setGameStateInitialValue("mandatory_new_bracelet", 0);
        $this->setGameStateInitialValue("is_second_perfect_match", 0);

        // Init game statistics.
        $this->initStat("player", "points_per_turn", 0);
        $this->initStat("player", "bracelet_completed", 0);
        $this->initStat("player", "captured_gemstones", 0);
        $this->initStat("player", "bronze_points", 0);
        $this->initStat("player", "long_bracelet_points", 0);
        $this->initStat("player", "gemstone_points", 0);
        $this->initStat("player", "domination_points", 0);
        $this->initStat("player", "diamond_points", 0);
        $this->initStat("player", "matching_link_points", 0);
        $this->initStat("player", "master_lock_penalties", 0);

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

        $this->setGameStateValue("zombie_turn", 1);

        if ($state["type"] === "activeplayer") {
            switch ($state_name) {
                case "newBracelet":
                    //start a new bracelet
                    $links = $this->deck->getCardsInLocation(STOCK.$active_player);
                    $link_id = array_rand($links);
                    $this->actNewBracelet($link_id);
                    $this->setGameStateValue("zombie_turn", 0);
                    return;
                case "playerTurn":
                    //place the first link possible
                    $bracelets = $this->deck->getBracelets(BRACELET);
                    $playerLinks = $this->deck->getCardsInLocation(STOCK.$active_player);
                    foreach ($playerLinks as $playerLink) {
                        foreach ($bracelets as $bracelet_id => $bracelet) {
                            $key_link_id = reset($bracelet)["id"];
                            $lock_link_id = end($bracelet)["id"];
                            if ($this->isValidConnection($key_link_id, $playerLink["id"])) {
                                $this->actPlaceLink((int)$playerLink["id"], (int)$bracelet_id, "key");
                                $this->setGameStateValue("zombie_turn", 0);
                                return;
                            }
                            if ($this->isValidConnection($playerLink["id"], $lock_link_id)) {
                                $this->actPlaceLink((int)$playerLink["id"], (int)$bracelet_id, "lock");
                                $this->setGameStateValue("zombie_turn", 0);
                                return;
                            }
                        }
                    }
                    //else, start a new bracelet
                    $links = $this->deck->getCardsInLocation(STOCK.$active_player);
                    $link_id = array_rand($links);
                    $this->actNewBracelet($link_id);
                    $this->setGameStateValue("zombie_turn", 0);
                    return;
            }
        }

        // // Make sure player is in a non-blocking status for role turn.
        // if ($state["type"] === "multipleactiveplayer") {
        //     $this->gamestate->setPlayerNonMultiactive($active_player, '');
        //     return;
        // }

        throw new \feException("Zombie mode not supported at this game state: \"{$state_name}\".");
    }
}
