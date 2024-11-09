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
        function Link(key, lock, gemstone) {
            this.id = Link.UNIQUE_ID++;
            this.key = key;
            this.lock = lock;
            this.gemstone = gemstone;
        }
        Link.UNIQUE_ID = 1;
        return Link;
    }());
    exports.Link = Link;
});
define("components/Bracelet", ["require", "exports", "components/Link"], function (require, exports, Link_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Bracelet = void 0;
    var Bracelet = (function () {
        function Bracelet(page, parent, width, height) {
            this.keys = new Map();
            this.locks = new Map();
            this.gemstones = new Map();
            this.links = [];
            this.container = document.createElement("div");
            this.container.className = "lovelinks-bracelet";
            parent.appendChild(this.container);
            this.width = width;
            this.height = height;
            dojo.setStyle(this.container, 'width', "".concat(width, "px"));
            dojo.setStyle(this.container, 'height', "".concat(height, "px"));
        }
        Bracelet.prototype.createLink = function (key, lock, gemstone) {
            var link = new Link_1.Link(key, lock, gemstone);
            this.container.insertAdjacentHTML('afterbegin', "\n            <div class=\"lovelinks-heart lovelinks-key\"></div>\n            <div class=\"lovelinks-heart lovelinks-lock\"></div>\n            <div class=\"lovelinks-gemstone\"></div>\n        ");
            this.keys.set(link.id, this.container.querySelector(".lovelinks-key"));
            this.locks.set(link.id, this.container.querySelector(".lovelinks-lock"));
            this.gemstones.set(link.id, this.container.querySelector(".lovelinks-gemstone"));
            return link;
        };
        Bracelet.prototype.getCoordinates = function (i) {
            var coordinates = {
                key: {
                    top: 0,
                    left: i * Bracelet.LINK_WIDTH,
                    rotate: 0
                },
                lock: {
                    top: 0,
                    left: (i + 1) * Bracelet.LINK_WIDTH,
                    rotate: 0
                },
                gemstone: {
                    top: Bracelet.LINK_HEIGHT / 4,
                    left: (i + 1 / 2) * Bracelet.LINK_WIDTH,
                    rotate: 0
                }
            };
            if (this.links.length < 2) {
                return {
                    key: this.toStraightCoordinates(coordinates.key),
                    lock: this.toStraightCoordinates(coordinates.lock),
                    gemstone: this.toStraightCoordinates(coordinates.gemstone),
                };
            }
            else {
                var n = this.links.length + 2;
                return {
                    key: this.toCircularCoordinates(coordinates.key, n * Bracelet.LINK_WIDTH),
                    lock: this.toCircularCoordinates(coordinates.lock, n * Bracelet.LINK_WIDTH),
                    gemstone: this.toCircularCoordinates(coordinates.gemstone, n * Bracelet.LINK_WIDTH),
                };
            }
        };
        Bracelet.prototype.toStraightCoordinates = function (coords) {
            return coords;
        };
        Bracelet.prototype.toCircularCoordinates = function (coords, length) {
            var radius = length / (2 * Math.PI) - coords.top;
            var angle = (coords.left / length) * 2 * Math.PI;
            var width = 2 * radius + Bracelet.LINK_WIDTH;
            var height = 2 * radius + Bracelet.LINK_WIDTH;
            return {
                left: radius * Math.sin(angle) + width / 2,
                top: radius * Math.cos(angle) + height / 2,
                rotate: angle
            };
        };
        Bracelet.prototype.prependLink = function (key, lock, gemstone) {
            var link = this.createLink(key, lock, gemstone);
            this.links.splice(0, 0, link);
            this.updateDisplay();
        };
        Bracelet.prototype.appendLink = function (key, lock, gemstone) {
            var link = this.createLink(key, lock, gemstone);
            this.links.push(link);
            this.updateDisplay();
        };
        Bracelet.prototype.updateDisplay = function () {
            for (var i = 0; i < this.links.length; i++) {
                var link = this.links[i];
                var key = this.keys.get(link.id);
                var lock = this.locks.get(link.id);
                var gemstone = this.gemstones.get(link.id);
                var coords = this.getCoordinates(i);
                dojo.setStyle(key, 'left', "".concat(coords.key.left, "px"));
                dojo.setStyle(key, 'top', "".concat(coords.key.top, "px"));
                dojo.setStyle(key, 'transform', "translate(-50%, -50%) rotate(".concat(Math.PI - coords.key.rotate, "rad)"));
                dojo.setStyle(lock, 'left', "".concat(coords.lock.left, "px"));
                dojo.setStyle(lock, 'top', "".concat(coords.lock.top, "px"));
                dojo.setStyle(lock, 'transform', "translate(-50%, -50%) rotate(".concat(Math.PI - coords.lock.rotate, "rad)"));
                dojo.setStyle(gemstone, 'left', "".concat(coords.gemstone.left, "px"));
                dojo.setStyle(gemstone, 'top', "".concat(coords.gemstone.top, "px"));
                dojo.setStyle(gemstone, 'transform', "translate(-50%, -50%) rotate(".concat(Math.PI - coords.gemstone.rotate, "rad)"));
                console.log(coords);
            }
        };
        Bracelet.LINK_WIDTH = 100;
        Bracelet.LINK_HEIGHT = 100;
        return Bracelet;
    }());
    exports.Bracelet = Bracelet;
});
define("bgagame/lovelinks", ["require", "exports", "ebg/core/gamegui", "components/Bracelet", "ebg/counter"], function (require, exports, Gamegui, Bracelet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoveLinks = (function (_super) {
        __extends(LoveLinks, _super);
        function LoveLinks() {
            var _this = _super.call(this) || this;
            _this.bracelets = [];
            console.log('lovelinks constructor');
            return _this;
        }
        LoveLinks.prototype.setup = function (gamedatas) {
            console.log("Starting game setup");
            for (var player_id in gamedatas.players) {
                var player = gamedatas.players[player_id];
            }
            var gamePlayArea = document.getElementById("game_play_area");
            var bracelet = new Bracelet_1.Bracelet(this, gamePlayArea, 100, 100);
            bracelet.appendLink(2, 4, 0);
            bracelet.appendLink(8, 5, 0);
            bracelet.appendLink(5, 7, 0);
            bracelet.appendLink(7, 3, 0);
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
