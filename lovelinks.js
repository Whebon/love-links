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
define("components/GemstoneColor", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("components/DbCard", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("components/Metal", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
});
define("components/Link", ["require", "exports", "components/StaticLoveLinks"], function (require, exports, StaticLoveLinks_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Link = void 0;
    var Link = (function () {
        function Link(key, lock, gemstone, id) {
            if (id) {
                this.id = id;
            }
            else {
                this.id = Link.UNIQUE_ID;
                Link.UNIQUE_ID++;
            }
            Link.links.set(this.id, this);
            this.key = key;
            this.lock = lock;
            this.gemstone = gemstone;
        }
        Object.defineProperty(Link.prototype, "metal", {
            get: function () {
                var link = StaticLoveLinks_1.StaticLoveLinks.page.gamedatas.card_types[this.id];
                if (!link) {
                    throw new Error("Link ".concat(this.id, "'s metal is not defined by the server"));
                }
                return link.metal;
            },
            enumerable: false,
            configurable: true
        });
        Link.prototype.key_displayed = function () {
            return this.key == Link.MASTER ? "M" : this.key;
        };
        Link.prototype.lock_displayed = function () {
            return this.lock == Link.MASTER ? "M" : this.lock;
        };
        Link.ofDbCard = function (dbCard) {
            return Link.ofId(+dbCard.id, +dbCard.type_arg);
        };
        Link.ofId = function (id, gemstone) {
            var _a;
            if (gemstone === void 0) { gemstone = 0; }
            var type = StaticLoveLinks_1.StaticLoveLinks.page.gamedatas.card_types[id];
            if (!type) {
                throw new Error("Link ".concat(id, " does not not exist"));
            }
            var link = (_a = this.get(id)) !== null && _a !== void 0 ? _a : new Link(type.key, type.lock, gemstone, id);
            link.gemstone = gemstone;
            return link;
        };
        Link.get = function (link_id) {
            return this.links.get(link_id);
        };
        Link.isValidConnection = function (key_link, lock_link) {
            var key = key_link.key;
            var lock = lock_link.lock;
            return lock % key == 0;
        };
        Link.UNIQUE_ID = 999;
        Link.links = new Map();
        Link.MASTER = 48;
        return Link;
    }());
    exports.Link = Link;
});
define("components/Supply", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Supply = void 0;
    var Supply = (function () {
        function Supply(parent, title) {
            if (title) {
                var wrap = document.createElement('div');
                wrap.classList.add("whiteblock");
                parent.appendChild(wrap);
                wrap.innerHTML = "\n                <h3 class=\"lovelinks-title\">".concat(title, "</h3>\n                <div class=\"lovelinks-supply-table-wrap\">\n                    <div class=\"lovelinks-supply-table\"></div>\n                </div>\n            ");
                this.container = wrap.querySelector(".lovelinks-supply-table");
            }
            else {
                this.container = document.createElement('div');
                this.container.classList.add("lovelinks-supply-table");
                parent.appendChild(this.container);
            }
            this.cells = [];
            for (var i = 0; i < 9; i++) {
                this.cells.push([]);
                for (var j = 0; j < 10; j++) {
                    var cell = document.createElement('div');
                    cell.classList.add("lovelinks-supply-cell");
                    this.container.appendChild(cell);
                    this.cells[this.cells.length - 1].push(cell);
                }
            }
        }
        Supply.prototype.add = function (link) {
            var cell = this.linkToCell(link);
            var dot = document.createElement('div');
            dot.classList.add("lovelinks-dot", "lovelinks-dot-" + link.metal);
            cell.appendChild(dot);
        };
        Supply.prototype.remove = function (link) {
            console.log("supply.remove");
            var cell = this.linkToCell(link);
            var child = cell.lastChild;
            if (!child) {
                console.log(link);
                console.warn("Attempted to remove a link that is not in the supply");
                return;
            }
            cell.removeChild(child);
        };
        Supply.prototype.linkToCell = function (link) {
            var i = Math.min(8, link.key - 2);
            var j = Math.min(9, link.lock - 2);
            if (!this.cells[i] || !this.cells[i][j]) {
                console.log(this.cells);
                throw new Error("this.cells is not setup properly, cell[".concat(i, "][").concat(j, "] is not defined"));
            }
            return this.cells[i][j];
        };
        return Supply;
    }());
    exports.Supply = Supply;
});
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
define("components/Bracelet", ["require", "exports", "components/StaticLoveLinks"], function (require, exports, StaticLoveLinks_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Bracelet = void 0;
    var Bracelet = (function () {
        function Bracelet(parent, bracelet_id, player_id, onClickBracelet) {
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
            this.bracelet_id = bracelet_id;
            this.player_id = player_id;
            this.onClickBracelet = onClickBracelet;
            this.isComplete = false;
            this.isBlinking = false;
            parent.appendChild(this.container);
            this.updateDisplay();
        }
        Object.defineProperty(Bracelet.prototype, "GEMSTONE_FACTOR", {
            get: function () {
                return 0.875;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Bracelet.prototype, "GEMSTONE_WIDTH", {
            get: function () {
                return (this.player_id == 0) ? 28 : 24;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Bracelet.prototype, "LINK_WIDTH", {
            get: function () {
                return (this.player_id == 0) ? 66 : 44;
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
                    console.log(this.links);
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
                if (this.isComplete) {
                    return this.links.length;
                }
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
            this.containerWidth = Math.max(this.containerWidth, +dojo.getStyle(this.container, 'width'));
            this.containerHeight = Math.max(this.containerHeight, +dojo.getStyle(this.container, 'height'));
            dojo.setStyle(this.container, 'width', "".concat(this.containerWidth, "px"));
            dojo.setStyle(this.container, 'height', "".concat(this.containerHeight, "px"));
        };
        Bracelet.prototype.registerLink = function (link) {
            var _this = this;
            var color = StaticLoveLinks_2.StaticLoveLinks.page.getGemstoneColor(link.gemstone);
            var metal = link.metal;
            this.container.insertAdjacentHTML('afterbegin', "\n            <div style=\"width: ".concat(this.LINK_WIDTH, "px; height: ").concat(this.LINK_HEIGHT, "px;\" class=\"lovelinks-heart lovelinks-key lovelinks-").concat(metal, "\" id=\"lovelinks-key-").concat(link.id, "\">\n                <div class=\"lovelinks-number\">").concat(link.key_displayed(), "</div>\n            </div>\n            <div style=\"width: ").concat(this.LINK_WIDTH, "px; height: ").concat(this.LINK_HEIGHT, "px;\" class=\"lovelinks-heart lovelinks-lock lovelinks-").concat(metal, "\" id=\"lovelinks-lock-").concat(link.id, "\">\n                <div class=\"lovelinks-number\">").concat(link.lock_displayed(), "</div>\n            </div>\n            <div style=\"width: ").concat(this.GEMSTONE_WIDTH, "px; height: ").concat(this.GEMSTONE_HEIGHT, "px;\" class=\"lovelinks-gemstoneholder lovelinks-").concat(metal, "\" id=\"lovelinks-gemstone-").concat(link.id, "\">\n                <div style=\"width: ").concat(this.GEMSTONE_WIDTH * this.GEMSTONE_FACTOR, "px; height: ").concat(this.GEMSTONE_HEIGHT * this.GEMSTONE_FACTOR, "px;\" \n                class=\"lovelinks-gemstone lovelinks-gemstone-color-").concat(color, "\"></div>\n            </div>\n        "));
            var prevDivs = link.divs;
            var newDivs = {
                key: this.container.querySelector(".lovelinks-key"),
                lock: this.container.querySelector(".lovelinks-lock"),
                gemstone: this.container.querySelector(".lovelinks-gemstoneholder"),
                bracelet: this
            };
            if (prevDivs) {
                StaticLoveLinks_2.StaticLoveLinks.page.placeOnObject(newDivs.key, prevDivs.key);
                StaticLoveLinks_2.StaticLoveLinks.page.placeOnObject(newDivs.lock, prevDivs.lock);
                StaticLoveLinks_2.StaticLoveLinks.page.placeOnObject(newDivs.gemstone, prevDivs.gemstone);
                prevDivs.bracelet.unregisterLink(link);
            }
            else {
                var supply = StaticLoveLinks_2.StaticLoveLinks.page.supply;
                if (supply) {
                    var cell = supply.linkToCell(link);
                    StaticLoveLinks_2.StaticLoveLinks.page.placeOnObject(newDivs.key, cell);
                    StaticLoveLinks_2.StaticLoveLinks.page.placeOnObject(newDivs.lock, cell);
                    StaticLoveLinks_2.StaticLoveLinks.page.placeOnObject(newDivs.gemstone, cell);
                    setTimeout(function () {
                        link.divs = newDivs;
                        _this.updateDisplay();
                    }, 1000);
                    return;
                }
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
            var horizontalOffset = (this.containerWidth - this.LINK_WIDTH * (this.links.length + 1)) / 2;
            var verticalOffset = (this.containerHeight - this.LINK_HEIGHT) / 2;
            return {
                left: coords.left + -this.LINK_WIDTH / 2 + this.PADDING + horizontalOffset,
                top: coords.top + this.LINK_HEIGHT / 2 + this.PADDING + verticalOffset,
                rotate: 0
            };
        };
        Bracelet.prototype.toCircularCoordinates = function (coords) {
            var radius = this.radius - coords.top;
            var angle = (coords.left / this.circumference) * 2 * Math.PI;
            if (this.isComplete) {
                angle -= 2 * Math.PI / (this.links.length);
            }
            return {
                left: radius * Math.sin(angle) + this.containerWidth / 2 + this.PADDING,
                top: -radius * Math.cos(angle) + this.containerHeight / 2 + this.PADDING,
                rotate: angle
            };
        };
        Bracelet.prototype.remove = function () {
            if (this.links.length > 0) {
                throw new Error("Only empty bracelets can be removed. Please make sure all links are properly unregistered");
            }
            this.container.remove();
        };
        Bracelet.prototype.containsLink = function (link) {
            for (var _i = 0, _a = this.links; _i < _a.length; _i++) {
                var myLink = _a[_i];
                if (myLink.id == link.id) {
                    return true;
                }
            }
            return false;
        };
        Bracelet.prototype.prependLink = function (link) {
            this.links.splice(0, 0, link);
            this.registerLink(link);
        };
        Bracelet.prototype.appendLink = function (link) {
            this.links.push(link);
            this.registerLink(link);
        };
        Bracelet.prototype.canBeCompleted = function () {
            return (this.links.length >= 5);
        };
        Bracelet.prototype.setComplete = function (state) {
            this.isComplete = state;
            this.updateDisplay();
        };
        Bracelet.prototype.setBlinking = function (state) {
            this.isBlinking = state;
            this.updateDisplay();
        };
        Bracelet.prototype.size = function () {
            return this.links.length;
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
                if (!this.isBlinking) {
                    link.divs.key.classList.remove("lovelinks-blinking");
                }
                dojo.setStyle(link.divs.key, 'left', "".concat(coords.key.left - this.LINK_WIDTH / 2, "px"));
                dojo.setStyle(link.divs.key, 'top', "".concat(coords.key.top - this.LINK_HEIGHT / 2, "px"));
                this.setRotate(link.divs.key, coords.key.rotate);
                if (!this.isComplete && i == 0) {
                    if (this.isBlinking) {
                        link.divs.key.classList.add("lovelinks-blinking");
                    }
                    if (StaticLoveLinks_2.StaticLoveLinks.page.isClickable(this, 'key')) {
                        link.divs.key.classList.add("lovelinks-clickable");
                        link.divs.key.addEventListener('click', this.onClickKeyBound);
                    }
                }
                else {
                    link.divs.key.classList.remove("lovelinks-clickable");
                    link.divs.key.removeEventListener('click', this.onClickKeyBound);
                }
                if (!this.isBlinking) {
                    link.divs.lock.classList.remove("lovelinks-blinking");
                }
                dojo.setStyle(link.divs.lock, 'opacity', this.isComplete || i < this.links.length - 1 ? '0.5' : '1');
                dojo.setStyle(link.divs.lock, 'left', "".concat(coords.lock.left - this.LINK_WIDTH / 2, "px"));
                dojo.setStyle(link.divs.lock, 'top', "".concat(coords.lock.top - this.LINK_HEIGHT / 2, "px"));
                this.setRotate(link.divs.lock, coords.lock.rotate);
                if (!this.isComplete && i == this.links.length - 1) {
                    if (this.isBlinking) {
                        link.divs.lock.classList.add("lovelinks-blinking");
                    }
                    if (StaticLoveLinks_2.StaticLoveLinks.page.isClickable(this, 'lock')) {
                        link.divs.lock.classList.add("lovelinks-clickable");
                        link.divs.lock.addEventListener('click', this.onClickLockBound);
                    }
                }
                else {
                    link.divs.lock.classList.remove("lovelinks-clickable");
                    link.divs.lock.removeEventListener('click', this.onClickLockBound);
                }
                dojo.setStyle(link.divs.gemstone, 'left', "".concat(coords.gemstone.left - this.GEMSTONE_WIDTH / 2, "px"));
                dojo.setStyle(link.divs.gemstone, 'top', "".concat(coords.gemstone.top - this.GEMSTONE_HEIGHT / 2, "px"));
                dojo.setStyle(link.divs.gemstone, 'rotate', "".concat(coords.gemstone.rotate, "rad"));
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
        BraceletArea.prototype.setBlinking = function (state) {
            for (var i = 0; i < this.bracelets.length; i++) {
                var bracelet = this.bracelets[i];
                bracelet.setBlinking(state);
            }
        };
        BraceletArea.prototype.removeBraceletIdsAbove = function (bracelet_id) {
            for (var i = 0; i < this.bracelets.length; i++) {
                if (this.bracelets[i].bracelet_id > bracelet_id) {
                    this.bracelets[i].remove();
                    this.bracelets.splice(i, 1);
                    return;
                }
            }
        };
        BraceletArea.prototype.remove = function (bracelet) {
            for (var i = 0; i < this.bracelets.length; i++) {
                if (bracelet.bracelet_id == this.bracelets[i].bracelet_id) {
                    bracelet.remove();
                    this.bracelets.splice(i, 1);
                    return;
                }
            }
            console.log(this.bracelets);
            throw new Error("Bracelet ".concat(bracelet.bracelet_id, " not found"));
        };
        BraceletArea.prototype.countNonEmptyBracelets = function () {
            var count = 0;
            for (var i = 0; i < this.bracelets.length; i++) {
                var bracelet = this.bracelets[i];
                if (bracelet.size() > 0) {
                    count++;
                }
            }
            return count;
        };
        BraceletArea.prototype.containsLink = function (link) {
            for (var i = 0; i < this.bracelets.length; i++) {
                var bracelet = this.bracelets[i];
                if (bracelet.containsLink(link)) {
                    return true;
                }
            }
            return false;
        };
        BraceletArea.prototype.getBraceletWithLink = function (link) {
            for (var i = 0; i < this.bracelets.length; i++) {
                var bracelet = this.bracelets[i];
                if (bracelet.containsLink(link)) {
                    return bracelet;
                }
            }
            return undefined;
        };
        BraceletArea.prototype.highlightPossibleLinks = function (link) {
            var _a, _b;
            var count = 0;
            for (var i = 0; i < this.bracelets.length; i++) {
                var bracelet = this.bracelets[i];
                if (!bracelet.isComplete) {
                    if (Link_1.Link.isValidConnection(bracelet.key_link, link)) {
                        (_a = bracelet.key_link.divs) === null || _a === void 0 ? void 0 : _a.key.classList.add("lovelinks-highlighted");
                        count += 1;
                    }
                    if (Link_1.Link.isValidConnection(link, bracelet.lock_link)) {
                        (_b = bracelet.lock_link.divs) === null || _b === void 0 ? void 0 : _b.lock.classList.add("lovelinks-highlighted");
                        count += 1;
                    }
                }
            }
            return count;
        };
        BraceletArea.prototype.deselectAll = function () {
            for (var i = 0; i < this.bracelets.length; i++) {
                var bracelet = this.bracelets[i];
                bracelet.deselectAll();
            }
        };
        BraceletArea.prototype.createBracelet = function (bracelet_id) {
            var bracelet = new Bracelet_1.Bracelet(this.container, bracelet_id, this.player_id, this.onClickBracelet);
            this.bracelets.push(bracelet);
            return bracelet;
        };
        BraceletArea.prototype.get = function (bracelet_id) {
            for (var _i = 0, _a = this.bracelets; _i < _a.length; _i++) {
                var bracelet = _a[_i];
                if (bracelet.bracelet_id == bracelet_id) {
                    return bracelet;
                }
            }
            console.log(this.container);
            throw new Error("Bracelet " + bracelet_id + " does not exist in this BraceletArea");
        };
        return BraceletArea;
    }());
    exports.BraceletArea = BraceletArea;
});
define("components/CommandManager", ["require", "exports", "components/StaticLoveLinks", "components/Link"], function (require, exports, StaticLoveLinks_3, Link_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.NewBraceletCommand = exports.CompleteCommand = exports.ExtendCommand = exports.CommandManager = void 0;
    var CommandManager = (function () {
        function CommandManager() {
            this.commands = [];
        }
        Object.defineProperty(CommandManager.prototype, "bracelet", {
            get: function () {
                if (this.commands.length == 0) {
                    throw new Error("No command has been executed this turn");
                }
                var command = this.commands[this.commands.length - 1];
                return command.bracelet;
            },
            enumerable: false,
            configurable: true
        });
        CommandManager.prototype.hasCommands = function () {
            return this.commands.length > 0;
        };
        CommandManager.prototype.execute = function (command) {
            this.commands.push(command);
            command.execute();
        };
        CommandManager.prototype.undo = function () {
            var _a;
            (_a = this.commands.pop()) === null || _a === void 0 ? void 0 : _a.undo();
        };
        CommandManager.prototype.undoAll = function () {
            while (true) {
                var command = this.commands.pop();
                if (!command) {
                    break;
                }
                command.undo();
            }
        };
        CommandManager.prototype.clearAll = function () {
            this.commands = [];
        };
        CommandManager.prototype.numberOfPlacements = function () {
            var placements = 0;
            for (var _i = 0, _a = this.commands; _i < _a.length; _i++) {
                var command = _a[_i];
                if (command instanceof ExtendCommand) {
                    placements += 1;
                }
            }
            return placements;
        };
        CommandManager.prototype.lastCommandIsACompletion = function () {
            if (this.commands.length == 0) {
                return false;
            }
            var lastCommand = this.commands[this.commands.length - 1];
            return (lastCommand instanceof CompleteCommand);
        };
        CommandManager.prototype.toActs = function () {
            var acts = [];
            for (var _i = 0, _a = this.commands; _i < _a.length; _i++) {
                var command = _a[_i];
                var act = command.toAct();
                if (act) {
                    acts.push(act);
                }
                else if (command instanceof CompleteCommand) {
                    var extendCommand = acts[acts.length - 1];
                    extendCommand.args.side = "both";
                }
                else {
                    console.log(act);
                    throw new Error("Failed to convert a command to a server action");
                }
            }
            return acts;
        };
        ;
        return CommandManager;
    }());
    exports.CommandManager = CommandManager;
    var ExtendCommand = (function () {
        function ExtendCommand(bracelet, playerBracelet, side) {
            this.link = undefined;
            this.playerBracelet = playerBracelet;
            this.bracelet = bracelet;
            this.side = side;
        }
        ExtendCommand.prototype.execute = function () {
            this.link = this.playerBracelet.key_link;
            switch (this.side) {
                case 'key':
                    this.bracelet.prependLink(this.link);
                    break;
                case 'lock':
                    this.bracelet.appendLink(this.link);
                    break;
            }
            if (Link_2.Link.isValidConnection(this.bracelet.key_link, this.bracelet.lock_link) && this.bracelet.canBeCompleted()) {
                StaticLoveLinks_3.StaticLoveLinks.page.setClientState('client_completeBracelet', {
                    descriptionmyturn: _("${you} may choose to complete or extend this bracelet")
                });
            }
            else {
                StaticLoveLinks_3.StaticLoveLinks.page.nextAction();
            }
        };
        ExtendCommand.prototype.undo = function () {
            switch (this.side) {
                case 'key':
                    this.playerBracelet.prependLink(this.bracelet.key_link);
                    break;
                case 'lock':
                    this.playerBracelet.appendLink(this.bracelet.lock_link);
                    break;
            }
        };
        ExtendCommand.prototype.toAct = function () {
            if (!this.link) {
                throw new Error("ExtendCommand has no link, make sure to 'execute' the command");
            }
            return {
                name: "actPlaceLink",
                args: {
                    link_id: this.link.id,
                    bracelet_id: this.bracelet.bracelet_id,
                    side: this.side
                }
            };
        };
        return ExtendCommand;
    }());
    exports.ExtendCommand = ExtendCommand;
    var CompleteCommand = (function () {
        function CompleteCommand(commandManager, bracelet) {
            this.commandManager = commandManager;
            this.bracelet = bracelet;
        }
        CompleteCommand.prototype.execute = function () {
            this.bracelet.setComplete(true);
        };
        CompleteCommand.prototype.undo = function () {
            this.bracelet.setComplete(false);
            this.commandManager.undo();
        };
        CompleteCommand.prototype.toAct = function () {
            return undefined;
        };
        return CompleteCommand;
    }());
    exports.CompleteCommand = CompleteCommand;
    var NewBraceletCommand = (function () {
        function NewBraceletCommand(commandManager, playerBracelet, bracelets) {
            this.commandManager = commandManager;
            this.playerBracelet = playerBracelet;
            this.bracelets = bracelets;
            this.link = this.playerBracelet.lock_link;
            this.bracelet = this.bracelets.createBracelet(this.link.id);
        }
        NewBraceletCommand.prototype.execute = function () {
            this.bracelet.appendLink(this.link);
            StaticLoveLinks_3.StaticLoveLinks.page.nextAction();
        };
        NewBraceletCommand.prototype.undo = function () {
            this.playerBracelet.appendLink(this.link);
            this.bracelets.remove(this.bracelet);
        };
        NewBraceletCommand.prototype.toAct = function () {
            if (!this.link) {
                throw new Error("ExtendCommand has no link, make sure to 'execute' the command");
            }
            return {
                name: "actNewBracelet",
                args: {
                    link_id: this.link.id
                }
            };
        };
        return NewBraceletCommand;
    }());
    exports.NewBraceletCommand = NewBraceletCommand;
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
define("bgagame/lovelinks", ["require", "exports", "ebg/core/gamegui", "components/StaticLoveLinks", "components/CommandManager", "components/Link", "components/BraceletArea", "components/TPL", "components/Supply", "ebg/counter"], function (require, exports, Gamegui, StaticLoveLinks_4, CommandManager_1, Link_3, BraceletArea_1, TPL_1, Supply_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var LoveLinks = (function (_super) {
        __extends(LoveLinks, _super);
        function LoveLinks() {
            var _this = _super.call(this) || this;
            _this.stocks = {};
            _this.commandManager = new CommandManager_1.CommandManager();
            StaticLoveLinks_4.StaticLoveLinks.page = _this;
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
            console.log(gamedatas);
            TPL_1.TPL.init(this);
            var gamePlayArea = document.getElementById("game_play_area");
            this.bracelets = new BraceletArea_1.BraceletArea(gamePlayArea, 0, _("Bracelets"), this.onClickBracelet.bind(this));
            for (var player_id in gamedatas.players) {
                var player = gamedatas.players[player_id];
                var player_board = document.getElementById("player_board_" + player_id);
                var callback = +player_id == this.player_id ? this.onClickMyStock.bind(this) : this.onClickOtherStock.bind(this);
                this.stocks[player_id] = new BraceletArea_1.BraceletArea(player_board, +player_id, undefined, callback);
                var number_of_slots = gamedatas.round == 1 ? 5 : 4;
                for (var i = 1; i <= number_of_slots; i++) {
                    this.stocks[player_id].createBracelet(i);
                }
                var slot_id = 1;
                for (var i in gamedatas.stocks[player_id]) {
                    var link = gamedatas.stocks[player_id][+i];
                    var slot = this.stocks[player_id].get(slot_id);
                    slot.appendLink(Link_3.Link.ofDbCard(link));
                    slot_id += 1;
                }
            }
            for (var bracelet_id in gamedatas.bracelets) {
                var links = gamedatas.bracelets[bracelet_id];
                var bracelet = this.bracelets.createBracelet(+bracelet_id);
                for (var i in links) {
                    var link = links[i];
                    bracelet.appendLink(Link_3.Link.ofDbCard(link));
                }
            }
            this.supply = new Supply_1.Supply(gamePlayArea, _("Supply"));
            for (var link_id in gamedatas.bronze_remaining) {
                this.supply.add(Link_3.Link.ofId(+link_id));
            }
            for (var link_id in gamedatas.silver_remaining) {
                this.supply.add(Link_3.Link.ofId(+link_id));
            }
            for (var link_id in gamedatas.gold_remaining) {
                this.supply.add(Link_3.Link.ofId(+link_id));
            }
            this.setupNotifications();
            console.log("Ending game setup");
        };
        LoveLinks.prototype.onEnteringState = function (stateName, args) {
            console.log('Entering state: ' + stateName);
            switch (stateName) {
                case 'playerTurn':
                    this.nextAction();
                    break;
                case 'newBracelet':
                    this.myStock.deselectAll();
                    break;
                case 'client_placeLink':
                    this.myStock.deselectAll();
                    for (var _i = 0, _a = this.myStock.bracelets; _i < _a.length; _i++) {
                        var slot = _a[_i];
                        if (slot.size() > 0) {
                            console.log(slot);
                            var possible_moves = this.bracelets.highlightPossibleLinks(slot.lock_link);
                            if (possible_moves > 0) {
                                console.log(possible_moves + " possible moves");
                                console.log(slot.lock_link);
                                this.bracelets.deselectAll();
                                return;
                            }
                        }
                    }
                    this.setClientState('newBracelet', {
                        descriptionmyturn: _("${you} must select a link to start a new bracelet (because you cannot extend any bracelet)")
                    });
                    break;
                case 'client_completeBracelet':
                    this.commandManager.bracelet.setBlinking(true);
                    break;
            }
        };
        LoveLinks.prototype.onLeavingState = function (stateName) {
            console.log('Leaving state: ' + stateName);
            switch (stateName) {
                case 'client_placeLink':
                    this.bracelets.deselectAll();
                    this.myStock.deselectAll();
                    this.selected = undefined;
                    break;
                case 'client_completeBracelet':
                    this.bracelets.setBlinking(false);
                    break;
            }
        };
        LoveLinks.prototype.onUpdateActionButtons = function (stateName, args) {
            console.log('onUpdateActionButtons: ' + stateName, args);
            if (!this.isCurrentPlayerActive())
                return;
            switch (stateName) {
                case 'newBracelet':
                    this.addActionButton("new-bracelet-button", _("New Bracelet"), "onNewBracelet");
                    if (this.commandManager.numberOfPlacements() > 0) {
                        this.addUndoButton();
                    }
                    break;
                case 'client_placeLink':
                    if (this.commandManager.numberOfPlacements() > 0) {
                        this.addUndoButton();
                    }
                    break;
                case 'client_completeBracelet':
                    this.addActionButton("complete-button", _("Complete"), "onCompleteBracelet");
                    this.addActionButton("skip-button", _("Extend"), "nextAction");
                    this.addUndoButton();
                    break;
                case 'client_confirm':
                    this.addActionButton("confirm-button", _("Confirm"), "onSubmitCommands");
                    this.addUndoButton();
                    break;
            }
        };
        LoveLinks.prototype.addUndoButton = function () {
            this.addActionButton("undo-button", _("Undo"), "onUndo", undefined, false, 'gray');
        };
        LoveLinks.prototype.pulseLink = function (link_id) {
            var _loop_1 = function (elem_id) {
                var elem = document.querySelector(elem_id);
                if (!elem) {
                    console.warn("Pulse animation failed: '".concat(elem_id, "' not found"));
                }
                else {
                    elem.classList.add("lovelinks-pulse");
                    setTimeout(function () {
                        var _a;
                        (_a = elem === null || elem === void 0 ? void 0 : elem.classList) === null || _a === void 0 ? void 0 : _a.remove("lovelinks-pulse");
                    }, 1000);
                }
            };
            for (var _i = 0, _a = ["#lovelinks-key-".concat(link_id), "#lovelinks-lock-".concat(link_id), "#lovelinks-gemstone-".concat(link_id)]; _i < _a.length; _i++) {
                var elem_id = _a[_i];
                _loop_1(elem_id);
            }
        };
        LoveLinks.prototype.onClickOtherStock = function (bracelet, link, side) {
            switch (this.gamedatas.gamestate.name) {
                case 'newBracelet':
                case 'client_placeLink':
                    if (!this.selected) {
                        this.showMessage(_("Please select a link from your stock"), 'error');
                        return;
                    }
                    break;
            }
        };
        LoveLinks.prototype.onClickMyStock = function (playerBracelet, link, side) {
            if (!this.isCurrentPlayerActive()) {
                this.showMessage(_("It is not your turn"), 'error');
                return;
            }
            switch (this.gamedatas.gamestate.name) {
                case 'newBracelet':
                    this.myStock.deselectAll();
                    if (this.selected == playerBracelet) {
                        this.selected = undefined;
                        return;
                    }
                    playerBracelet.select('both');
                    this.selected = playerBracelet;
                    break;
                case 'client_placeLink':
                    this.bracelets.deselectAll();
                    this.myStock.deselectAll();
                    if (this.selected == playerBracelet) {
                        this.selected = undefined;
                        return;
                    }
                    playerBracelet.select('both');
                    this.selected = playerBracelet;
                    this.bracelets.highlightPossibleLinks(link);
                    break;
                case 'client_completeBracelet':
                    this.showMessage(_("Please choose to complete or extend this bracelet"), 'error');
                    break;
            }
        };
        LoveLinks.prototype.onClickBracelet = function (bracelet, link, side) {
            if (!this.isCurrentPlayerActive()) {
                this.showMessage(_("It is not your turn"), 'error');
                return;
            }
            switch (this.gamedatas.gamestate.name) {
                case 'client_placeLink':
                    if (!this.selected) {
                        this.showMessage(_("Please select a link from your stock"), 'error');
                        return;
                    }
                    switch (side) {
                        case 'key':
                            if (Link_3.Link.isValidConnection(link, this.selected.lock_link)) {
                                this.bracelets.deselectAll();
                                this.myStock.deselectAll();
                                this.commandManager.execute(new CommandManager_1.ExtendCommand(bracelet, this.selected, side));
                                this.selected = undefined;
                            }
                            else {
                                this.showMessage(_("This link doesn't fit here"), 'error');
                            }
                            break;
                        case 'lock':
                            if (Link_3.Link.isValidConnection(this.selected.key_link, link)) {
                                this.bracelets.deselectAll();
                                this.myStock.deselectAll();
                                this.commandManager.execute(new CommandManager_1.ExtendCommand(bracelet, this.selected, side));
                                this.selected = undefined;
                            }
                            else {
                                this.showMessage(_("This link doesn't fit here"), 'error');
                                return;
                            }
                            break;
                    }
                    break;
                case 'client_completeBracelet':
                    if (bracelet != this.commandManager.bracelet) {
                        this.showMessage(_("You can only complete the bracelet you just added a link to"), 'error');
                        return;
                    }
                    this.onCompleteBracelet();
                    break;
            }
        };
        LoveLinks.prototype.abc = function () {
            var bracelet1 = this.bracelets.bracelets[0];
            var bracelet2 = this.myStock.bracelets[1];
            bracelet1.prependLink(bracelet2.key_link);
        };
        LoveLinks.prototype.isClickable = function (bracelet, side) {
            return (bracelet.player_id == this.player_id || bracelet.player_id == 0);
        };
        LoveLinks.prototype.onNewBracelet = function () {
            if (!this.selected) {
                this.showMessage(_("Please select a link from your stock"), 'error');
                return;
            }
            this.myStock.deselectAll();
            this.commandManager.execute(new CommandManager_1.NewBraceletCommand(this.commandManager, this.selected, this.bracelets));
            this.nextAction();
        };
        LoveLinks.prototype.onUndo = function () {
            this.commandManager.undo();
            this.removeActionButtons();
            this.onUpdateActionButtons(this.gamedatas.gamestate.name, this.gamedatas.gamestate.args);
            this.nextAction();
        };
        LoveLinks.prototype.onCompleteBracelet = function () {
            this.commandManager.execute(new CommandManager_1.CompleteCommand(this.commandManager, this.commandManager.bracelet));
            this.nextAction();
        };
        LoveLinks.prototype.onSubmitCommands = function () {
            var _this = this;
            console.log(this.commandManager.toActs());
            this.bgaPerformAction('actMultipleActions', {
                actions: JSON.stringify(this.commandManager.toActs())
            }).then(function () {
                _this.commandManager.clearAll();
            });
        };
        LoveLinks.prototype.nextAction = function () {
            console.log("nextAction");
            var placements = this.commandManager.numberOfPlacements();
            if (this.myStock.countNonEmptyBracelets() == 0) {
                this.setClientState('client_confirm', {
                    descriptionmyturn: _("${you} must confirm your placements")
                });
                return;
            }
            else if (this.commandManager.lastCommandIsACompletion()) {
                this.setClientState('newBracelet', {
                    descriptionmyturn: _("${you} must select a link to start a new bracelet (because you completed a bracelet)")
                });
            }
            else if (placements == 2) {
                this.setClientState('client_confirm', {
                    descriptionmyturn: _("${you} must confirm your placements")
                });
                return;
            }
            else if (placements == 1) {
                this.setClientState('client_placeLink', {
                    descriptionmyturn: _("${you} must place another link")
                });
                return;
            }
            else if (placements == 0) {
                this.setClientState('client_placeLink', {
                    descriptionmyturn: _("${you} must place a link")
                });
                return;
            }
            else {
                throw new Error("Unexpected number of placements this turn: ".concat(placements));
            }
        };
        LoveLinks.prototype.getGemstoneColor = function (player_id) {
            var player = this.gamedatas.players[player_id];
            if (!player) {
                return "undefined";
            }
            switch (player.color) {
                case "ff0000":
                    return "red";
                case "008000":
                    return "green";
                case "0000ff":
                    return "blue";
                case "ffa500":
                    return "yellow";
                case "000000":
                    return "black";
                case "ffffff":
                    return "white";
                case "e94190":
                    return "pink";
                case "982fff":
                    return "purple";
                case "72c3b1":
                    return "cyan";
                case "f07f16":
                    return "orange";
                case "bdd002":
                    return "khaki";
                case "7b7b7b":
                    return "gray";
                default:
                    console.warn("Player color ${player.color} is not supported");
                    return "gray";
            }
        };
        LoveLinks.prototype.setupNotifications = function () {
            var _this = this;
            console.log('notifications subscriptions setup');
            var notifs = [
                ['newBracelet', 1000],
                ['refillStock', 2000],
                ['placeLink', 1000],
                ['startRound', 1]
            ];
            notifs.forEach(function (notif) {
                dojo.subscribe(notif[0], _this, "notif_".concat(notif[0]));
                _this.notifqueue.setSynchronous(notif[0], notif[1]);
            });
        };
        LoveLinks.prototype.notif_placeLink = function (notif) {
            console.log('notif_placeLink', notif);
            var link = Link_3.Link.ofDbCard(notif.args.link);
            var stock = this.stocks[notif.args.player_id];
            var slot = stock.getBraceletWithLink(link);
            if (!slot) {
                if (notif.args.player_id != this.player_id) {
                    var name_1 = this.gamedatas.players[notif.args.player_id].name;
                    throw new Error("Link #".concat(notif.args.link.id, " as not found in ").concat(name_1, "'s Stock"));
                }
                this.pulseLink(+notif.args.link.id);
                return;
            }
            var bracelet = this.bracelets.get(notif.args.bracelet_id);
            switch (notif.args.side) {
                case 'key':
                    bracelet.prependLink(link);
                    break;
                case 'lock':
                    bracelet.appendLink(link);
                    break;
                case 'both':
                    bracelet.appendLink(link);
                    bracelet.setComplete(true);
                    break;
            }
        };
        LoveLinks.prototype.notif_newBracelet = function (notif) {
            console.log('notif_newBracelet', notif);
            if (this.bracelets.containsLink(Link_3.Link.ofId(notif.args.link_id))) {
                console.log("pulse");
                this.pulseLink(+notif.args.link_id);
            }
            else {
                console.log("new bracelet");
                var bracelet = this.bracelets.createBracelet(notif.args.link_id);
                bracelet.appendLink(Link_3.Link.ofId(notif.args.link_id, notif.args.player_id));
            }
        };
        LoveLinks.prototype.notif_refillStock = function (notif) {
            var _a;
            console.log('notif_refillStock', notif);
            var stock = this.stocks[notif.args.player_id];
            if (!stock) {
                throw new Error("Player " + notif.args.player_id + " does not have a Stock component");
            }
            var slot_id = 1;
            var slot;
            for (var i in notif.args.links) {
                while (!slot || slot.size() > 0) {
                    slot = stock.get(slot_id);
                    slot_id++;
                }
                var link = Link_3.Link.ofDbCard(notif.args.links[+i]);
                slot.appendLink(link);
                (_a = this.supply) === null || _a === void 0 ? void 0 : _a.remove(link);
            }
        };
        LoveLinks.prototype.notif_startRound = function (notif) {
            console.log('notif_startRound', notif);
            this.gamedatas.round = notif.args.round;
            for (var _i = 0, _a = this.gamedatas.playerorder; _i < _a.length; _i++) {
                var player_id = _a[_i];
                var number_of_slots = this.gamedatas.round == 1 ? 5 : 4;
                this.stocks[player_id].removeBraceletIdsAbove(number_of_slots);
            }
        };
        return LoveLinks;
    }(Gamegui));
    dojo.setObject("bgagame.lovelinks", LoveLinks);
});
