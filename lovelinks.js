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
define("components/StaticLoveLinks", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.StaticLoveLinks = void 0;
    var StaticLoveLinks = (function () {
        function StaticLoveLinks() {
        }
        return StaticLoveLinks;
    }());
    exports.StaticLoveLinks = StaticLoveLinks;
});
define("components/Side", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("components/Link", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Link = void 0;
    var Link = (function () {
        function Link(key, lock, gemstone) {
            this.id = Link.UNIQUE_ID;
            Link.links.set(this.id, this);
            Link.UNIQUE_ID++;
            this.key = key;
            this.lock = lock;
            this.gemstone = gemstone;
        }
        Link.get = function (link_id) {
            var link = this.links.get(link_id);
            if (!link) {
                throw new Error("Link ".concat(link_id, " is unknown."));
            }
            return link;
        };
        Link.isValidConnection = function (key_link, lock_link) {
            return true;
        };
        Link.UNIQUE_ID = 1;
        Link.links = new Map();
        return Link;
    }());
    exports.Link = Link;
});
define("components/Bracelet", ["require", "exports", "components/StaticLoveLinks"], function (require, exports, StaticLoveLinks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Bracelet = void 0;
    var Bracelet = (function () {
        function Bracelet(parent, player_id, onClickBracelet) {
            this.PADDING = 0;
            this.containerWidth = -1;
            this.containerHeight = -1;
            this.circumference = -1;
            this.radius = -1;
            this.onClickKeyBound = this.onClickKey.bind(this);
            this.onClickLockBound = this.onClickLock.bind(this);
            this.links = [];
            this.container = document.createElement("div");
            this.container.classList.add("lovelinks-bracelet");
            this.player_id = player_id;
            this.onClickBracelet = onClickBracelet;
            parent.appendChild(this.container);
        }
        Object.defineProperty(Bracelet.prototype, "GEMSTONE_WIDTH", {
            get: function () {
                return (this.player_id == 0) ? 25 : 20;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Bracelet.prototype, "LINK_WIDTH", {
            get: function () {
                return (this.player_id == 0) ? 65 : 45;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Bracelet.prototype, "LINK_HEIGHT", {
            get: function () { return this.LINK_WIDTH; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Bracelet.prototype, "GEMSTONE_HEIGHT", {
            get: function () { return this.GEMSTONE_WIDTH; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Bracelet.prototype, "key_link", {
            get: function () {
                if (!this.links[0]) {
                    throw new Error("Cannot get the first link from an empty bracelet");
                }
                return this.links[0];
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Bracelet.prototype, "lock_link", {
            get: function () {
                if (this.links.length == 0) {
                    throw new Error("Cannot get the last link from an empty bracelet");
                }
                return this.links[this.links.length - 1];
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
                this.circumference = this.degree * this.LINK_WIDTH;
                this.radius = this.circumference / (2 * Math.PI);
                this.containerWidth = this.radius * 2 + this.LINK_WIDTH + this.PADDING;
                this.containerHeight = this.radius * 2 + this.LINK_HEIGHT + this.PADDING;
            }
            else {
                this.containerWidth = Math.max(2, (this.links.length + 1)) * this.LINK_WIDTH;
                this.containerHeight = this.LINK_HEIGHT;
            }
            dojo.setStyle(this.container, 'width', "".concat(this.containerWidth, "px"));
            dojo.setStyle(this.container, 'height', "".concat(this.containerHeight, "px"));
        };
        Bracelet.prototype.registerLink = function (link) {
            this.container.insertAdjacentHTML('afterbegin', "\n            <div style=\"width: ".concat(this.LINK_WIDTH, "px; height: ").concat(this.LINK_HEIGHT, "px;\" class=\"lovelinks-heart lovelinks-key\" id=\"lovelinks-key-").concat(link.id, "\">\n                <div class=\"lovelinks-number\">").concat(link.key, "</div>\n            </div>\n            <div style=\"width: ").concat(this.LINK_WIDTH, "px; height: ").concat(this.LINK_HEIGHT, "px;\" class=\"lovelinks-heart lovelinks-lock\" id=\"lovelinks-lock-").concat(link.id, "\">\n                <div class=\"lovelinks-number\">").concat(link.lock, "</div>\n            </div>\n            <div style=\"width: ").concat(this.GEMSTONE_WIDTH, "px; height: ").concat(this.GEMSTONE_HEIGHT, "px;\" class=\"lovelinks-gemstone\" id=\"lovelinks-gemstone-").concat(link.id, "\">\n            </div>\n        "));
            var prevDivs = link.divs;
            var newDivs = {
                key: this.container.querySelector(".lovelinks-key"),
                lock: this.container.querySelector(".lovelinks-lock"),
                gemstone: this.container.querySelector(".lovelinks-gemstone"),
                bracelet: this
            };
            if (prevDivs) {
                StaticLoveLinks_1.StaticLoveLinks.page.placeOnObject(newDivs.key, prevDivs.key);
                StaticLoveLinks_1.StaticLoveLinks.page.placeOnObject(newDivs.lock, prevDivs.lock);
                StaticLoveLinks_1.StaticLoveLinks.page.placeOnObject(newDivs.gemstone, prevDivs.gemstone);
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
                    left: (i + 1) * this.LINK_WIDTH,
                    rotate: 0
                },
                lock: {
                    top: 0,
                    left: (i + 2) * this.LINK_WIDTH,
                    rotate: 0
                },
                gemstone: {
                    top: this.LINK_HEIGHT / 4,
                    left: (i + 3 / 2) * this.LINK_WIDTH,
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
                left: coords.left + -this.LINK_WIDTH / 2 + this.PADDING,
                top: coords.top + this.LINK_HEIGHT / 2 + this.PADDING,
                rotate: 0
            };
        };
        Bracelet.prototype.toCircularCoordinates = function (coords) {
            var radius = this.radius - coords.top;
            var angle = (coords.left / this.circumference) * 2 * Math.PI;
            return {
                left: radius * Math.sin(angle) + this.containerWidth / 2 + this.PADDING,
                top: -radius * Math.cos(angle) + this.containerHeight / 2 + this.PADDING,
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
                dojo.setStyle(link.divs.key, 'left', "".concat(coords.key.left - this.LINK_WIDTH / 2, "px"));
                dojo.setStyle(link.divs.key, 'top', "".concat(coords.key.top - this.LINK_HEIGHT / 2, "px"));
                this.setRotate(link.divs.key, coords.key.rotate);
                if (i == 0 && StaticLoveLinks_1.StaticLoveLinks.page.isClickable(this, 'key')) {
                    link.divs.key.classList.add("lovelinks-clickable");
                    link.divs.key.addEventListener('click', this.onClickKeyBound);
                }
                else {
                    link.divs.key.classList.remove("lovelinks-clickable");
                    link.divs.key.removeEventListener('click', this.onClickKeyBound);
                }
                dojo.setStyle(link.divs.lock, 'opacity', i < this.links.length - 1 ? '0.5' : '1');
                dojo.setStyle(link.divs.lock, 'left', "".concat(coords.lock.left - this.LINK_WIDTH / 2, "px"));
                dojo.setStyle(link.divs.lock, 'top', "".concat(coords.lock.top - this.LINK_HEIGHT / 2, "px"));
                this.setRotate(link.divs.lock, coords.lock.rotate);
                if (i == this.links.length - 1 && StaticLoveLinks_1.StaticLoveLinks.page.isClickable(this, 'lock')) {
                    link.divs.lock.classList.add("lovelinks-clickable");
                    link.divs.lock.addEventListener('click', this.onClickLockBound);
                }
                else {
                    link.divs.lock.classList.remove("lovelinks-clickable");
                    link.divs.lock.removeEventListener('click', this.onClickLockBound);
                }
                dojo.setStyle(link.divs.gemstone, 'left', "".concat(coords.gemstone.left - this.GEMSTONE_WIDTH / 2, "px"));
                dojo.setStyle(link.divs.gemstone, 'top', "".concat(coords.gemstone.top - this.GEMSTONE_HEIGHT / 2, "px"));
                this.setRotate(link.divs.gemstone, coords.gemstone.rotate);
            }
        };
        Bracelet.prototype.setRotate = function (element, angle) {
            var style = dojo.getStyle(element, 'rotate');
            var matchRad = style.match(/[-+]?[0-9]*\.?[0-9]+rad/);
            var matchDeg = style.match(/[-+]?[0-9]*\.?[0-9]+deg/);
            var prevAngle = matchRad ? parseFloat(matchRad[0]) : matchDeg ? parseFloat(matchDeg[0]) / 180 * Math.PI : 0;
            while (angle - prevAngle < -Math.PI) {
                console.log("+");
                angle += 2 * Math.PI;
            }
            while (angle - prevAngle > Math.PI) {
                console.log("-");
                angle -= 2 * Math.PI;
            }
            dojo.setStyle(element, 'rotate', "".concat(angle, "rad"));
        };
        Bracelet.prototype.toggle = function (side) {
            var _a, _b;
            switch (side) {
                case 'key':
                    (_a = this.key_link.divs) === null || _a === void 0 ? void 0 : _a.key.classList.toggle("lovelinks-selected");
                    break;
                case 'lock':
                    (_b = this.lock_link.divs) === null || _b === void 0 ? void 0 : _b.lock.classList.toggle("lovelinks-selected");
                    break;
                case 'both':
                    this.container.classList.toggle("lovelinks-selected");
                    break;
            }
        };
        Bracelet.prototype.select = function (side) {
            var _a, _b;
            switch (side) {
                case 'key':
                    (_a = this.key_link.divs) === null || _a === void 0 ? void 0 : _a.key.classList.add("lovelinks-selected");
                    break;
                case 'lock':
                    (_b = this.lock_link.divs) === null || _b === void 0 ? void 0 : _b.lock.classList.add("lovelinks-selected");
                    break;
                case 'both':
                    this.container.classList.add("lovelinks-selected");
                    break;
            }
        };
        Bracelet.prototype.deselect = function (side) {
            var _a, _b;
            switch (side) {
                case 'key':
                    (_a = this.key_link.divs) === null || _a === void 0 ? void 0 : _a.key.classList.remove("lovelinks-selected", "lovelinks-highlighted");
                    break;
                case 'lock':
                    (_b = this.lock_link.divs) === null || _b === void 0 ? void 0 : _b.lock.classList.remove("lovelinks-selected", "lovelinks-highlighted");
                    break;
                case 'both':
                    this.container.classList.remove("lovelinks-selected", "lovelinks-highlighted");
                    break;
            }
        };
        Bracelet.prototype.deselectAll = function () {
            var _a, _b;
            for (var _i = 0, _c = this.links; _i < _c.length; _i++) {
                var link = _c[_i];
                (_a = link.divs) === null || _a === void 0 ? void 0 : _a.key.classList.remove("lovelinks-selected", "lovelinks-highlighted");
                (_b = link.divs) === null || _b === void 0 ? void 0 : _b.lock.classList.remove("lovelinks-selected", "lovelinks-highlighted");
                this.container.classList.remove("lovelinks-selected", "lovelinks-highlighted");
            }
        };
        Bracelet.prototype.onClickKey = function () {
            this.onClickBracelet(this, this.links[0], 'key');
        };
        Bracelet.prototype.onClickLock = function () {
            this.onClickBracelet(this, this.links[this.links.length - 1], 'lock');
        };
        return Bracelet;
    }());
    exports.Bracelet = Bracelet;
});
define("components/BraceletArea", ["require", "exports", "components/Bracelet", "components/Link"], function (require, exports, Bracelet_1, Link_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.BraceletArea = void 0;
    var BraceletArea = (function () {
        function BraceletArea(parent, player_id, title, onClickBracelet) {
            this.bracelets = [];
            if (title) {
                var wrap = document.createElement('div');
                wrap.classList.add("whiteblock");
                parent.appendChild(wrap);
                wrap.innerHTML = "\n                <h3 class=\"lovelinks-title\">".concat(title, "</h3>\n                <div class=\"lovelinks-bracelet-area\"></div>\n            ");
                this.container = wrap.querySelector(".lovelinks-bracelet-area");
            }
            else {
                this.container = document.createElement('div');
                this.container.classList.add("lovelinks-bracelet-area");
                parent.appendChild(this.container);
            }
            this.player_id = player_id;
            this.onClickBracelet = onClickBracelet;
        }
        BraceletArea.prototype.highlightPossibleLinks = function (link) {
            var _a, _b;
            for (var i = 0; i < this.bracelets.length; i++) {
                var bracelet = this.bracelets[i];
                if (Link_1.Link.isValidConnection(bracelet.key_link, link)) {
                    (_a = bracelet.key_link.divs) === null || _a === void 0 ? void 0 : _a.key.classList.add("lovelinks-highlighted");
                }
                if (Link_1.Link.isValidConnection(bracelet.lock_link, link)) {
                    (_b = bracelet.lock_link.divs) === null || _b === void 0 ? void 0 : _b.lock.classList.add("lovelinks-highlighted");
                }
            }
        };
        BraceletArea.prototype.deselectAll = function () {
            for (var i = 0; i < this.bracelets.length; i++) {
                var bracelet = this.bracelets[i];
                bracelet.deselectAll();
            }
        };
        BraceletArea.prototype.createBracelet = function () {
            var bracelet = new Bracelet_1.Bracelet(this.container, this.player_id, this.onClickBracelet);
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
define("bgagame/lovelinks", ["require", "exports", "ebg/core/gamegui", "components/StaticLoveLinks", "components/Link", "components/BraceletArea", "components/TPL", "ebg/counter"], function (require, exports, Gamegui, StaticLoveLinks_2, Link_2, BraceletArea_1, TPL_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoveLinks = (function (_super) {
        __extends(LoveLinks, _super);
        function LoveLinks() {
            var _this = _super.call(this) || this;
            _this.stocks = {};
            StaticLoveLinks_2.StaticLoveLinks.page = _this;
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
            this.bracelets = new BraceletArea_1.BraceletArea(gamePlayArea, 0, _("Bracelets"), this.onClickBracelet.bind(this));
            for (var player_id in gamedatas.players) {
                var player = gamedatas.players[player_id];
                var player_board = document.getElementById("player_board_" + player_id);
                var callback = +player_id == this.player_id ? this.onClickMyStock.bind(this) : this.onClickOtherStock.bind(this);
                this.stocks[player_id] = new BraceletArea_1.BraceletArea(player_board, +player_id, undefined, callback);
                for (var i = 0; i < 5; i++) {
                    var bracelet = this.stocks[player_id].createBracelet();
                    bracelet.appendLink(new Link_2.Link(0, 0, 0));
                }
            }
            for (var i = 0; i < 5; i++) {
                var bracelet = this.bracelets.createBracelet();
                bracelet.appendLink(new Link_2.Link(0, 0, 0));
                bracelet.appendLink(new Link_2.Link(0, 0, 0));
                bracelet.appendLink(new Link_2.Link(0, 0, 0));
                bracelet.appendLink(new Link_2.Link(0, 0, 0));
                bracelet.appendLink(new Link_2.Link(0, 0, 0));
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
        LoveLinks.prototype.onClickOtherStock = function (bracelet, link, side) {
            console.log("Other Stock");
        };
        LoveLinks.prototype.onClickMyStock = function (bracelet, link, side) {
            this.bracelets.deselectAll();
            this.myStock.deselectAll();
            if (this.selected == bracelet) {
                this.selected = undefined;
                return;
            }
            bracelet.select('both');
            this.selected = bracelet;
            this.bracelets.highlightPossibleLinks(link);
        };
        LoveLinks.prototype.onClickBracelet = function (bracelet, link, side) {
            if (!this.selected) {
                this.showMessage(_("Please select a link from your stock"), 'info');
                return;
            }
            if (side == 'key' && Link_2.Link.isValidConnection(link, this.selected.lock_link)) {
                this.bracelets.deselectAll();
                this.myStock.deselectAll();
                bracelet.prependLink(this.selected.lock_link);
            }
            if (side == 'lock' && Link_2.Link.isValidConnection(this.selected.key_link, link)) {
                this.bracelets.deselectAll();
                this.myStock.deselectAll();
                bracelet.appendLink(this.selected.key_link);
            }
        };
        LoveLinks.prototype.isValidConnection = function (key, lock) {
            return true;
        };
        LoveLinks.prototype.abc = function () {
            var bracelet1 = this.bracelets.bracelets[0];
            var bracelet2 = this.myStock.bracelets[1];
            bracelet1.prependLink(bracelet2.key_link);
        };
        LoveLinks.prototype.isClickable = function (bracelet, side) {
            return true;
        };
        LoveLinks.prototype.onClick = function (bracelet, side) {
            bracelet.toggle(side);
        };
        LoveLinks.prototype.setupNotifications = function () {
            console.log('notifications subscriptions setup');
        };
        return LoveLinks;
    }(Gamegui));
    dojo.setObject("bgagame.lovelinks", LoveLinks);
});
