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
define("components/Bracelet", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Bracelet = void 0;
    var Bracelet = (function () {
        function Bracelet(page, parent) {
            this.containerWidth = -1;
            this.containerHeight = -1;
            this.circumference = -1;
            this.radius = -1;
            this.page = page;
            this.links = [];
            this.container = document.createElement("div");
            this.container.classList.add("lovelinks-bracelet");
            parent.appendChild(this.container);
        }
        Object.defineProperty(Bracelet.prototype, "link", {
            get: function () {
                if (!this.links[0]) {
                    throw new Error("Cannot get the first link from an empty bracelet");
                }
                return this.links[0];
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Bracelet.prototype, "degree", {
            get: function () {
                return Math.max(5, this.links.length + 2);
            },
            enumerable: false,
            configurable: true
        });
        Bracelet.prototype.calculateDisplayProperties = function () {
            if (this.isCircular()) {
                this.circumference = this.degree * Bracelet.LINK_WIDTH;
                this.radius = this.circumference / (2 * Math.PI);
                this.containerWidth = this.radius * 2 + Bracelet.LINK_WIDTH + Bracelet.PADDING;
                this.containerHeight = this.radius * 2 + Bracelet.LINK_HEIGHT + Bracelet.PADDING;
            }
            else {
                this.containerWidth = Math.max(2, (this.links.length + 1)) * Bracelet.LINK_WIDTH;
                this.containerHeight = Bracelet.LINK_HEIGHT;
            }
            dojo.setStyle(this.container, 'width', "".concat(this.containerWidth, "px"));
            dojo.setStyle(this.container, 'height', "".concat(this.containerHeight, "px"));
        };
        Bracelet.prototype.registerLink = function (link) {
            this.container.insertAdjacentHTML('afterbegin', "\n            <div style=\"width: ".concat(Bracelet.LINK_WIDTH, "px; height: ").concat(Bracelet.LINK_HEIGHT, "px;\" class=\"lovelinks-heart lovelinks-key\" id=\"lovelinks-key-").concat(link.id, "\">\n                <div class=\"lovelinks-number\">").concat(link.key, "</div>\n            </div>\n            <div style=\"width: ").concat(Bracelet.LINK_WIDTH, "px; height: ").concat(Bracelet.LINK_HEIGHT, "px;\" class=\"lovelinks-heart lovelinks-lock\" id=\"lovelinks-lock-").concat(link.id, "\">\n                <div class=\"lovelinks-number\">").concat(link.lock, "</div>\n            </div>\n            <div style=\"width: ").concat(Bracelet.GEMSTONE_WIDTH, "px; height: ").concat(Bracelet.GEMSTONE_HEIGHT, "px;\" class=\"lovelinks-gemstone\" id=\"lovelinks-gemstone-").concat(link.id, "\">\n            </div>\n        "));
            var prevDivs = link.divs;
            var newDivs = {
                key: this.container.querySelector(".lovelinks-key"),
                lock: this.container.querySelector(".lovelinks-lock"),
                gemstone: this.container.querySelector(".lovelinks-gemstone"),
                bracelet: this
            };
            if (prevDivs) {
                this.page.placeOnObject(newDivs.key, prevDivs.key);
                this.page.placeOnObject(newDivs.lock, prevDivs.lock);
                this.page.placeOnObject(newDivs.gemstone, prevDivs.gemstone);
                prevDivs.bracelet.unregisterLink(link);
            }
            link.divs = newDivs;
            this.updateDisplay();
        };
        Bracelet.prototype.unregisterLink = function (link) {
            for (var i = 0; i < this.links.length; i++) {
                if (link == this.links[i]) {
                    this.links.splice(i, 1);
                    if (link.divs) {
                        link.divs.key.remove();
                        link.divs.lock.remove();
                        link.divs.gemstone.remove();
                        link.divs = undefined;
                    }
                    this.updateDisplay();
                    return true;
                }
            }
            return false;
        };
        Bracelet.prototype.isCircular = function () {
            return (this.links.length >= 4);
        };
        Bracelet.prototype.getCoordinates = function (i) {
            var lineCoords = {
                key: {
                    top: 0,
                    left: (i + 1) * Bracelet.LINK_WIDTH,
                    rotate: 0
                },
                lock: {
                    top: 0,
                    left: (i + 2) * Bracelet.LINK_WIDTH,
                    rotate: 0
                },
                gemstone: {
                    top: Bracelet.LINK_HEIGHT / 4,
                    left: (i + 3 / 2) * Bracelet.LINK_WIDTH,
                    rotate: 0
                }
            };
            var toCoordinates = this.isCircular() ? this.toCircularCoordinates.bind(this) : this.toStraightCoordinates.bind(this);
            return {
                key: toCoordinates(lineCoords.key),
                lock: toCoordinates(lineCoords.lock),
                gemstone: toCoordinates(lineCoords.gemstone),
            };
        };
        Bracelet.prototype.toStraightCoordinates = function (coords) {
            return {
                left: coords.left + -Bracelet.LINK_WIDTH / 2 + Bracelet.PADDING,
                top: coords.top + Bracelet.LINK_HEIGHT / 2 + Bracelet.PADDING,
                rotate: 0
            };
        };
        Bracelet.prototype.toCircularCoordinates = function (coords) {
            var radius = this.radius - coords.top;
            var angle = (coords.left / this.circumference) * 2 * Math.PI;
            return {
                left: radius * Math.sin(angle) + this.containerWidth / 2 + Bracelet.PADDING,
                top: -radius * Math.cos(angle) + this.containerHeight / 2 + Bracelet.PADDING,
                rotate: angle
            };
        };
        Bracelet.prototype.prependLink = function (link) {
            this.links.splice(0, 0, link);
            this.registerLink(link);
        };
        Bracelet.prototype.appendLink = function (link) {
            this.links.push(link);
            this.registerLink(link);
        };
        Bracelet.prototype.reflowLink = function (link) {
            if (!link.divs) {
                throw new Error("Link ".concat(link.id, " is not registered"));
            }
            link.divs.key.offsetHeight;
            link.divs.lock.offsetHeight;
            link.divs.gemstone.offsetHeight;
        };
        Bracelet.prototype.updateDisplay = function () {
            this.calculateDisplayProperties();
            for (var i = 0; i < this.links.length; i++) {
                var link = this.links[i];
                var coords = this.getCoordinates(i);
                if (!link.divs) {
                    throw new Error("Link ".concat(link.id, " is not registered"));
                }
                this.reflowLink(link);
                dojo.setStyle(link.divs.key, 'left', "".concat(coords.key.left - Bracelet.LINK_WIDTH / 2, "px"));
                dojo.setStyle(link.divs.key, 'top', "".concat(coords.key.top - Bracelet.LINK_HEIGHT / 2, "px"));
                dojo.setStyle(link.divs.key, 'transform', "rotate(".concat(coords.key.rotate, "rad)"));
                dojo.setStyle(link.divs.lock, 'opacity', i < this.links.length - 1 ? '0.5' : '1');
                dojo.setStyle(link.divs.lock, 'left', "".concat(coords.lock.left - Bracelet.LINK_WIDTH / 2, "px"));
                dojo.setStyle(link.divs.lock, 'top', "".concat(coords.lock.top - Bracelet.LINK_HEIGHT / 2, "px"));
                dojo.setStyle(link.divs.lock, 'transform', "rotate(".concat(coords.lock.rotate, "rad)"));
                dojo.setStyle(link.divs.gemstone, 'left', "".concat(coords.gemstone.left - Bracelet.GEMSTONE_WIDTH / 2, "px"));
                dojo.setStyle(link.divs.gemstone, 'top', "".concat(coords.gemstone.top - Bracelet.GEMSTONE_HEIGHT / 2, "px"));
                dojo.setStyle(link.divs.gemstone, 'transform', "rotate(".concat(coords.gemstone.rotate, "rad)"));
            }
        };
        Bracelet.PADDING = 10;
        Bracelet.LINK_WIDTH = 60;
        Bracelet.LINK_HEIGHT = 60;
        Bracelet.GEMSTONE_WIDTH = 25;
        Bracelet.GEMSTONE_HEIGHT = 25;
        return Bracelet;
    }());
    exports.Bracelet = Bracelet;
});
define("components/BraceletArea", ["require", "exports", "components/Bracelet"], function (require, exports, Bracelet_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BraceletArea = void 0;
    var BraceletArea = (function () {
        function BraceletArea(page, parent, title) {
            this.page = page;
            this.bracelets = [];
            var wrap = document.createElement('div');
            wrap.classList.add("whiteblock");
            parent.appendChild(wrap);
            wrap.innerHTML = "\n            <h3 class=\"lovelinks-title\">".concat(title, "</h3>\n            <div class=\"lovelinks-bracelet-area\"></div>\n        ");
            this.container = wrap.querySelector(".lovelinks-bracelet-area");
        }
        BraceletArea.prototype.createBracelet = function () {
            var bracelet = new Bracelet_1.Bracelet(this.page, this.container);
            this.bracelets.push(bracelet);
            return bracelet;
        };
        return BraceletArea;
    }());
    exports.BraceletArea = BraceletArea;
});
define("components/TPL", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TPL = void 0;
    var TPL = (function () {
        function TPL() {
        }
        TPL.init = function (page) {
            TPL.page = page;
        };
        TPL.stockTitle = function (player_id) {
            var player = TPL.page.gamedatas.players[+player_id];
            var name = TPL.page.getCurrentPlayerId() == +player_id ? _("Your") : player.name + _("\'s");
            return "\n            <span style=\"color:#".concat(player.color, ";\">").concat(name, "</span> ").concat(_("stock"), "\n        ");
        };
        return TPL;
    }());
    exports.TPL = TPL;
});
define("bgagame/lovelinks", ["require", "exports", "ebg/core/gamegui", "components/Link", "components/BraceletArea", "components/TPL", "ebg/counter"], function (require, exports, Gamegui, Link_1, BraceletArea_1, TPL_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoveLinks = (function (_super) {
        __extends(LoveLinks, _super);
        function LoveLinks() {
            var _this = _super.call(this) || this;
            _this.stocks = {};
            console.log('lovelinks constructor');
            return _this;
        }
        Object.defineProperty(LoveLinks.prototype, "myStock", {
            get: function () {
                var stock = this.stocks[this.player_id];
                if (!stock) {
                    throw new Error("The stock of the current player was not properly initialized");
                }
                return stock;
            },
            enumerable: false,
            configurable: true
        });
        LoveLinks.prototype.setup = function (gamedatas) {
            console.log("Starting game setup");
            TPL_1.TPL.init(this);
            var gamePlayArea = document.getElementById("game_play_area");
            this.bracelets = new BraceletArea_1.BraceletArea(this, gamePlayArea, _("Bracelets"));
            for (var player_id in gamedatas.players) {
                var player = gamedatas.players[player_id];
                this.stocks[player_id] = new BraceletArea_1.BraceletArea(this, gamePlayArea, TPL_1.TPL.stockTitle(player_id));
                for (var i = 0; i < 5; i++) {
                    var bracelet = this.stocks[player_id].createBracelet();
                    bracelet.appendLink(new Link_1.Link(0, 0, 0));
                }
            }
            for (var i = 0; i < 3; i++) {
                var bracelet = this.bracelets.createBracelet();
                bracelet.appendLink(new Link_1.Link(0, 0, 0));
                bracelet.appendLink(new Link_1.Link(0, 0, 0));
                bracelet.appendLink(new Link_1.Link(0, 0, 0));
            }
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
        LoveLinks.prototype.abc = function () {
            var bracelet1 = this.bracelets.bracelets[0];
            var bracelet2 = this.myStock.bracelets[1];
            bracelet1.prependLink(bracelet2.link);
        };
        LoveLinks.prototype.setupNotifications = function () {
            console.log('notifications subscriptions setup');
        };
        return LoveLinks;
    }(Gamegui));
    dojo.setObject("bgagame.lovelinks", LoveLinks);
});
