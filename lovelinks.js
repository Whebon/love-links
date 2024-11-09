var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define("components/Link", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Link = void 0;
    var Link = (function () {
        function Link(page) {
            this.page = page;
        }
        return Link;
    }());
    exports.Link = Link;
});
define("components/Bracelet", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Bracelet = void 0;
    var Bracelet = (function () {
        function Bracelet(page) {
            this.page = page;
        }
        return Bracelet;
    }());
    exports.Bracelet = Bracelet;
});
define("bgagame/lovelinks", ["require", "exports", "ebg/core/gamegui", "ebg/counter"], function (require, exports, Gamegui) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoveLinks = (function (_super) {
        __extends(LoveLinks, _super);
        function LoveLinks() {
            var _this = _super.call(this) || this;
            console.log('lovelinks constructor');
            return _this;
        }
        LoveLinks.prototype.setup = function (gamedatas) {
            console.log("Starting game setup");
            for (var player_id in gamedatas.players) {
                var player = gamedatas.players[player_id];
            }
            document.getElementById('game_play_area').insertAdjacentHTML('beforeend', "\n\t\t\t<div class=\"lovelinks-link\">\n\t\t\t\t<div class=\"lovelinks-heart\"></div>\n\t\t\t\t<div class=\"lovelinks-heart\" style=\"left: 100px\"></div>\n\t\t\t\t<div class=\"lovelinks-gemstone\"></div>\n\t\t\t</div>\n\t\t");
            this.setupNotifications();
            console.log("Ending game setup");
        };
        LoveLinks.prototype.onEnteringState = function (stateName, args) {
            console.log('Entering state: ' + stateName);
            switch (stateName) {
                case 'dummmy':
                    break;
            }
        };
        LoveLinks.prototype.onLeavingState = function (stateName) {
            console.log('Leaving state: ' + stateName);
            switch (stateName) {
                case 'dummmy':
                    break;
            }
        };
        LoveLinks.prototype.onUpdateActionButtons = function (stateName, args) {
            console.log('onUpdateActionButtons: ' + stateName, args);
            if (!this.isCurrentPlayerActive())
                return;
            switch (stateName) {
                case 'dummmy':
                    break;
            }
        };
        LoveLinks.prototype.setupNotifications = function () {
            console.log('notifications subscriptions setup');
        };
        return LoveLinks;
    }(Gamegui));
    dojo.setObject("bgagame.lovelinks", LoveLinks);
});
