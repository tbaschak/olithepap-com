// Generated by CoffeeScript 1.3.3
(function() {
    var e, t;
    e = function() {
        function e(e) {
            var t, n;
            this.options = {
                target: "instafeed",
                get: "popular",
                resolution: "thumbnail",
                sortBy: "most-recent",
                links: !1,
                limit: 30,
                mock: !1
            };
            if (typeof e == "object")
                for (t in e) n = e[t], this.options[t] = n;
            this.unique = this._genKey()
        }
        return e.prototype.run = function() {
            var t, n, r;
            if (typeof this.options.clientId != "string" && typeof this.options.accessToken != "string") throw new Error("Missing clientId or accessToken.");
            if (typeof this.options.accessToken != "string" && typeof this.options.clientId != "string") throw new Error("Missing clientId or accessToken.");
            return this.options.before != null && typeof this.options.before == "function" && this.options.before.call(this), typeof document != "undefined" && document !== null && (r = document.createElement("script"), r.id = "instafeed-fetcher", r.src = this._buildUrl(), t = document.getElementsByTagName("head"), t[0].appendChild(r), n = "instafeedCache" + this.unique, window[n] = new e(this.options), window[n].unique = this.unique), !0
        }, e.prototype.parse = function(e) {
            var t, n, r, i, s, o, u, a, f, l, c, h, p, d, v;
            if (typeof e != "object") {
                if (this.options.error != null && typeof this.options.error == "function") return this.options.error.call(this, "Invalid JSON data"), !1;
                throw new Error("Invalid JSON response")
            }
            if (e.meta.code !== 200) {
                if (this.options.error != null && typeof this.options.error == "function") return this.options.error.call(this, e.meta.error_message), !1;
                throw new Error("Error from Instagram: " + e.meta.error_message)
            }
            if (e.data.length === 0) {
                if (this.options.error != null && typeof this.options.error == "function") return this.options.error.call(this, "No images were returned from Instagram"), !1;
                throw new Error("No images were returned from Instagram")
            }
            this.options.success != null && typeof this.options.success == "function" && this.options.success.call(this, e);
            if (this.options.sortBy !== "most-recent") {
                this.options.sortBy === "random" ? c = ["", "random"] : c = this.options.sortBy.split("-"), l = c[0] === "least" ? !0 : !1;
                switch (c[1]) {
                    case "random":
                        e.data.sort(function() {
                            return .5 - Math.random()
                        });
                        break;
                    case "recent":
                        e.data = this._sortBy(e.data, "created_time", l);
                        break;
                    case "liked":
                        e.data = this._sortBy(e.data, "likes.count", l);
                        break;
                    case "commented":
                        e.data = this._sortBy(e.data, "comments.count", l);
                        break;
                    default:
                        throw new Error("Invalid option for sortBy: '" + this.options.sortBy + "'.")
                }
            }
            if (typeof document != "undefined" && document !== null && this.options.mock === !1) {
                document.getElementById(this.options.target).innerHTML = "", u = e.data, u.length > this.options.limit && (u = u.slice(0, this.options.limit + 1 || 9e9));
                if (this.options.template != null && typeof this.options.template == "string") {
                    i = "", o = "";
                    for (h = 0, d = u.length; h < d; h++) s = u[h], o = this._makeTemplate(this.options.template, {
                        model: s,
                        id: s.id,
                        link: s.link,
                        image: s.images[this.options.resolution].url,
                        caption: this._getObjectProperty(s, "caption.text"),
                        likes: s.likes.count,
                        comments: s.comments.count,
                        location: this._getObjectProperty(s, "location.name")
                    }), i += o;
                    document.getElementById(this.options.target).innerHTML = i
                } else {
                    n = document.createDocumentFragment();
                    for (p = 0, v = u.length; p < v; p++) s = u[p], a = document.createElement("img"), a.src = s.images[this.options.resolution].url, this.options.links === !0 ? (t = document.createElement("a"), t.href = s.link, t.appendChild(a), n.appendChild(t)) : n.appendChild(a);
                    document.getElementById(this.options.target).appendChild(n)
                }
                r = document.getElementsByTagName("head")[0], r.removeChild(document.getElementById("instafeed-fetcher")), f = "instafeedCache" + this.unique, delete window[f]
            }
            return this.options.after != null && typeof this.options.after == "function" && this.options.after.call(this), !0
        }, e.prototype._buildUrl = function() {
            var e, t, n;
            e = "https://api.instagram.com/v1";
            switch (this.options.get) {
                case "popular":
                    t = "media/popular";
                    break;
                case "tagged":
                    if (typeof this.options.tagName != "string") throw new Error("No tag name specified. Use the 'tagName' option.");
                    t = "tags/" + this.options.tagName + "/media/recent";
                    break;
                case "location":
                    if (typeof this.options.locationId != "number") throw new Error("No location specified. Use the 'locationId' option.");
                    t = "locations/" + this.options.locationId + "/media/recent";
                    break;
                case "user":
                    if (typeof this.options.userId != "number") throw new Error("No user specified. Use the 'userId' option.");
                    if (typeof this.options.accessToken != "string") throw new Error("No access token. Use the 'accessToken' option.");
                    t = "users/" + this.options.userId + "/media/recent";
                    break;
                default:
                    throw new Error("Invalid option for get: '" + this.options.get + "'.")
            }
            return n = "" + e + "/" + t, this.options.accessToken != null ? n += "?access_token=" + this.options.accessToken : n += "?client_id=" + this.options.clientId, n += "&count=" + this.options.limit, n += "&callback=instafeedCache" + this.unique + ".parse", n
        }, e.prototype._genKey = function() {
            var e;
            return e = function() {
                return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1)
            }, "" + e() + e() + e() + e()
        }, e.prototype._makeTemplate = function(e, t) {
            var n, r, i, s, o;
            r = /(?:\{{2})([\w\[\]\.]+)(?:\}{2})/, n = e;
            while (r.test(n)) i = n.match(r)[1], s = (o = this._getObjectProperty(t, i)) != null ? o : "", n = n.replace(r, "" + s);
            return n
        }, e.prototype._getObjectProperty = function(e, t) {
            var n, r;
            t = t.replace(/\[(\w+)\]/g, ".$1"), r = t.split(".");
            while (r.length) {
                n = r.shift();
                if (!(e != null && n in e)) return null;
                e = e[n]
            }
            return e
        }, e.prototype._sortBy = function(e, t, n) {
            var r;
            return r = function(e, r) {
                var i, s;
                return i = this._getObjectProperty(e, t), s = this._getObjectProperty(r, t), n ? i > s ? 1 : -1 : i < s ? 1 : -1
            }, e.sort(r.bind(this)), e
        }, e
    }(), t = typeof exports != "undefined" && exports !== null ? exports : window, t.Instafeed = e
}).call(this);
! function(e, t) {
    "object" == typeof exports ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : e.Spinner = t()
}(this, function() {
    "use strict";

    function e(e, t) {
        var n, r = document.createElement(e || "div");
        for (n in t) r[n] = t[n];
        return r
    }

    function t(e) {
        for (var t = 1, n = arguments.length; n > t; t++) e.appendChild(arguments[t]);
        return e
    }

    function n(e, t, n, r) {
        var i = ["opacity", t, ~~ (100 * e), n, r].join("-"),
            s = .01 + n / r * 100,
            o = Math.max(1 - (1 - e) / t * (100 - s), e),
            u = l.substring(0, l.indexOf("Animation")).toLowerCase(),
            a = u && "-" + u + "-" || "";
        return h[i] || (p.insertRule("@" + a + "keyframes " + i + "{0%{opacity:" + o + "}" + s + "%{opacity:" + e + "}" + (s + .01) + "%{opacity:1}" + (s + t) % 100 + "%{opacity:" + e + "}100%{opacity:" + o + "}}", p.cssRules.length), h[i] = 1), i
    }

    function r(e, t) {
        var n, r, i = e.style;
        for (t = t.charAt(0).toUpperCase() + t.slice(1), r = 0; r < c.length; r++)
            if (n = c[r] + t, void 0 !== i[n]) return n;
        return void 0 !== i[t] ? t : void 0
    }

    function i(e, t) {
        for (var n in t) e.style[r(e, n) || n] = t[n];
        return e
    }

    function s(e) {
        for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) void 0 === e[r] && (e[r] = n[r])
        }
        return e
    }

    function o(e) {
        for (var t = {
            x: e.offsetLeft,
            y: e.offsetTop
        }; e = e.offsetParent;) t.x += e.offsetLeft, t.y += e.offsetTop;
        return t
    }

    function u(e, t) {
        return "string" == typeof e ? e : e[t % e.length]
    }

    function a(e) {
        return "undefined" == typeof this ? new a(e) : (this.opts = s(e || {}, a.defaults, d), void 0)
    }

    function f() {
        function n(t, n) {
            return e("<" + t + ' xmlns="urn:schemas-microsoft.com:vml" class="spin-vml">', n)
        }
        p.addRule(".spin-vml", "behavior:url(#default#VML)"), a.prototype.lines = function(e, r) {
            function s() {
                return i(n("group", {
                    coordsize: l + " " + l,
                    coordorigin: -f + " " + -f
                }), {
                    width: l,
                    height: l
                })
            }

            function o(e, o, a) {
                t(h, t(i(s(), {
                    rotation: 360 / r.lines * e + "deg",
                    left: ~~o
                }), t(i(n("roundrect", {
                    arcsize: r.corners
                }), {
                    width: f,
                    height: r.width,
                    left: r.radius,
                    top: -r.width >> 1,
                    filter: a
                }), n("fill", {
                    color: u(r.color, e),
                    opacity: r.opacity
                }), n("stroke", {
                    opacity: 0
                }))))
            }
            var a, f = r.length + r.width,
                l = 2 * f,
                c = 2 * -(r.width + r.length) + "px",
                h = i(s(), {
                    position: "absolute",
                    top: c,
                    left: c
                });
            if (r.shadow)
                for (a = 1; a <= r.lines; a++) o(a, -2, "progid:DXImageTransform.Microsoft.Blur(pixelradius=2,makeshadow=1,shadowopacity=.3)");
            for (a = 1; a <= r.lines; a++) o(a);
            return t(e, h)
        }, a.prototype.opacity = function(e, t, n, r) {
            var i = e.firstChild;
            r = r.shadow && r.lines || 0, i && t + r < i.childNodes.length && (i = i.childNodes[t + r], i = i && i.firstChild, i = i && i.firstChild, i && (i.opacity = n))
        }
    }
    var l, c = ["webkit", "Moz", "ms", "O"],
        h = {}, p = function() {
            var n = e("style", {
                type: "text/css"
            });
            return t(document.getElementsByTagName("head")[0], n), n.sheet || n.styleSheet
        }(),
        d = {
            lines: 12,
            length: 7,
            width: 5,
            radius: 10,
            rotate: 0,
            corners: 1,
            color: "#000",
            direction: 1,
            speed: 1,
            trail: 100,
            opacity: .25,
            fps: 20,
            zIndex: 2e9,
            className: "spinner",
            top: "auto",
            left: "auto",
            position: "relative"
        };
    a.defaults = {}, s(a.prototype, {
        spin: function(t) {
            this.stop();
            var n, r, s = this,
                u = s.opts,
                a = s.el = i(e(0, {
                    className: u.className
                }), {
                    position: u.position,
                    width: 0,
                    zIndex: u.zIndex
                }),
                f = u.radius + u.length + u.width;
            if (t && (t.insertBefore(a, t.firstChild || null), r = o(t), n = o(a), i(a, {
                left: ("auto" == u.left ? r.x - n.x + (t.offsetWidth >> 1) : parseInt(u.left, 10) + f) + "px",
                top: ("auto" == u.top ? r.y - n.y + (t.offsetHeight >> 1) : parseInt(u.top, 10) + f) + "px"
            })), a.setAttribute("role", "progressbar"), s.lines(a, s.opts), !l) {
                var c, h = 0,
                    p = (u.lines - 1) * (1 - u.direction) / 2,
                    d = u.fps,
                    v = d / u.speed,
                    m = (1 - u.opacity) / (v * u.trail / 100),
                    y = v / u.lines;
                ! function b() {
                    h++;
                    for (var e = 0; e < u.lines; e++) c = Math.max(1 - (h + (u.lines - e) * y) % v * m, u.opacity), s.opacity(a, e * u.direction + p, c, u);
                    s.timeout = s.el && setTimeout(b, ~~ (1e3 / d))
                }()
            }
            return s
        },
        stop: function() {
            var e = this.el;
            return e && (clearTimeout(this.timeout), e.parentNode && e.parentNode.removeChild(e), this.el = void 0), this
        },
        lines: function(r, s) {
            function o(t, n) {
                return i(e(), {
                    position: "absolute",
                    width: s.length + s.width + "px",
                    height: s.width + "px",
                    background: t,
                    boxShadow: n,
                    transformOrigin: "left",
                    transform: "rotate(" + ~~(360 / s.lines * f + s.rotate) + "deg) translate(" + s.radius + "px,0)",
                    borderRadius: (s.corners * s.width >> 1) + "px"
                })
            }
            for (var a, f = 0, c = (s.lines - 1) * (1 - s.direction) / 2; f < s.lines; f++) a = i(e(), {
                position: "absolute",
                top: 1 + ~(s.width / 2) + "px",
                transform: s.hwaccel ? "translate3d(0,0,0)" : "",
                opacity: s.opacity,
                animation: l && n(s.opacity, s.trail, c + f * s.direction, s.lines) + " " + 1 / s.speed + "s linear infinite"
            }), s.shadow && t(a, i(o("#000", "0 0 4px #000"), {
                top: "2px"
            })), t(r, t(a, o(u(s.color, f), "0 0 1px rgba(0,0,0,.1)")));
            return r
        },
        opacity: function(e, t, n) {
            t < e.childNodes.length && (e.childNodes[t].style.opacity = n)
        }
    });
    var v = i(e("group"), {
        behavior: "url(#default#VML)"
    });
    return !r(v, "transform") && v.adj ? f() : l = r(v, "animation"), a
});
var dug = function(opts) {
    function render(tpl, data, delims) {
        function dotData(d, dotKey) {
            var invert = "",
                filters = dotKey.split("|"),
                name = filters.shift();
            if (name.indexOf("!") > -1) {
                name = name.replace(/!/ig, "");
                invert = "!"
            }
            try {
                val = eval(invert + "d['" + name.split(".").join("']['") + "']");
                if (filters)
                    for (var i = 0, max = filters.length; i < max; ++i) {
                        var chunks = filters[i].split(":"),
                            filter = chunks.shift(),
                            params = chunks;
                        f = eval(filter);
                        typeof f == "function" && (newval = f.apply(d, [val].concat(params)));
                        val = newval
                    }
            } catch (e) {
                val = ""
            }
            return val
        }
        tpl = unescape(tpl);
        var delims = delims || ["{{", "}}"],
            scopeMatch = new RegExp(delims[0] + "[^" + delims[1] + "]*" + delims[1], "igm"),
            matches = tpl.match(scopeMatch);
        if (!matches) return tpl;
        for (var i = 0, matchCount = matches.length, m; m = matches[i], i < matchCount; i++) {
            tagMatch = new RegExp(delims[0] + "|" + delims[1], "ig"), scopeName = m.replace(tagMatch, "");
            if (scopeName[0] == "#") {
                name = scopeName.slice(1, scopeName.length);
                startFrag = tpl.indexOf(m);
                endFrag = tpl.indexOf(m.replace("#", "/")) + m.length;
                frag = tpl.substring(startFrag + m.length, endFrag - m.length);
                dataFrag = dotData(data, name);
                rendered = "";
                if (dataFrag) {
                    if (dataFrag.constructor == Array)
                        for (var i = 0, max = dataFrag.length; i < max; ++i) rendered += render(frag, dataFrag[i]);
                    else rendered = render(frag, dataFrag, delims);
                    startFrag = tpl.indexOf(m);
                    endFrag = tpl.indexOf(m.replace("#", "/")) + m.length;
                    tpl = tpl.slice(0, startFrag) + rendered + tpl.slice(endFrag, tpl.length)
                }
            } else {
                val = dotData(data, scopeName) || "";
                tpl = tpl.replace(m, val)
            }
        }
        return tpl
    }
    if (this.constructor != dug) {
        dug.instance = (new dug(opts)).show();
        return dug.instance
    }
    var options = {
        target: null,
        endpoint: "",
        templateDelimiters: ["{{", "}}"],
        callbackParam: "callback",
        cacheExpire: 12e4,
        beforeRender: function() {},
        afterRender: function() {},
        success: function() {},
        error: function() {},
        template: "You need a template, silly :P"
    }, getTemplate = function(e) {
            var e = e || options.template,
                t;
            if (e.match(/^(#|\.)\w/)) {
                if ("querySelectorAll" in document) {
                    t = document.querySelectorAll(e);
                    t.length > 0 && (t = t[0])
                } else t = document.getElementById(e.replace(/^#/, ""));
                t && "tagName" in t && (e = t.innerHTML)
            }
            return e
        }, ext = function(e, t) {
            for (var n in t) n in e && (e[n] && e[n].constructor == Object ? ext(e[n], t[n]) : e[n] = t[n])
        }, ago = function(e) {
            var t = new Date(e || ""),
                n = ((new Date).getTime() - t.getTime()) / 1e3,
                r = Math.floor(n / 86400);
            if (isNaN(r) || r < 0) return;
            return r == 0 && (n < 60 && "just now" || n < 120 && "1 minute ago" || n < 3600 && Math.floor(n / 60) + " minutes ago" || n < 7200 && "1 hour ago" || n < 86400 && Math.floor(n / 3600) + " hours ago") || r == 1 && "Yesterday" || r < 7 && r + " days ago" || r < 31 && Math.ceil(r / 7) + " week" + (Math.ceil(r / 7) > 1 ? "s" : "") + " ago" || r < 365 && Math.ceil(r / 30) + " months ago" || r >= 365 && Math.ceil(r / 365) + " year" + (Math.ceil(r / 365) > 1 ? "s" : "") + " ago"
        }, cache = function(e, t) {
            if (typeof localStorage === undefined || typeof JSON === undefined) return null;
            var n = (new Date).getTime(),
                r = null;
            if (t == undefined) {
                try {
                    r = JSON.parse(unescape(localStorage.getItem(e)))
                } catch (i) {}
                if (r)
                    if (n - r.time < options.cacheExpire) r = r.data;
                    else {
                        localStorage.removeItem(e);
                        r = null
                    } else r = null;
                return r
            }
            try {
                localStorage.setItem(e, escape(JSON.stringify({
                    time: n,
                    data: t
                })))
            } catch (i) {
                console.log(i)
            }
        }, get = function() {
            dug.requests = dug.requests == undefined ? 1 : dug.requests + 1;
            var e = document.createElement("script"),
                t = "callback" + dug.requests,
                n = document.body.children,
                r = document.scripts[document.scripts.length - 1],
                i = render(options.endpoint),
                s = r.parentNode.nodeName != "head";
            dug[t] = function(e, t) {
                e = e.results ? e.results : e;
                t !== !0 && cache(i, e);
                var n = document.createElement("div");
                options.beforeRender.call(this, e);
                n.innerHTML = render(getTemplate(), e, options.templateDelimiters);
                if (options.target == null) {
                    r.parentNode.insertBefore(n, r);
                    options.target = n
                } else options.target.nodeName ? options.target.innerHTML = n.innerHTML : typeof options.target == "string" && (document.getElementById(options.target).innerHTML = n.innerHTML);
                options.afterRender.call(this, options.target);
                options.success.call(this, e)
            };
            e.onerror = options.error;
            if (cachedData = cache(i)) dug[t](cachedData, !0);
            else {
                e.src = i + (i.indexOf("?") > -1 ? "&" : "?") + options.callbackParam + "=dug." + t;
                document.getElementsByTagName("head")[0].appendChild(e)
            }
        }, init = function(e) {
            e && e != undefined && e.constructor == Object && ext(options, e)
        };
    for (var o in options)(function(e) {
        this[e] = function(t) {
            if (!arguments.length) return options[e];
            options[e] = t
        }
    }).call(this, o);
    this.show = function(e) {
        init(e);
        get();
        return this
    };
    dug.render = render;
    dug.extend = ext;
    dug.cache = cache;
    dug.ago = ago;
    init(opts)
};
dug._script = document.scripts[document.scripts.length - 1];
(function(e, t, n) {
    e.fn.simplyScroll = function(t) {
        return this.each(function() {
            new e.simplyScroll(this, t)
        })
    };
    var r = {
        customClass: "simply-scroll",
        frameRate: 24,
        speed: 1,
        orientation: "horizontal",
        auto: !0,
        autoMode: "loop",
        manualMode: "end",
        direction: "forwards",
        pauseOnHover: !0,
        pauseOnTouch: !0,
        pauseButton: !1,
        startOnLoad: !1
    };
    e.simplyScroll = function(n, i) {
        var s = this;
        this.o = e.extend({}, r, i || {});
        this.isAuto = !1 !== this.o.auto && null !== this.o.autoMode.match(/^loop|bounce$/);
        this.isRTL = (this.isHorizontal = null !== this.o.orientation.match(/^horizontal|vertical$/) && this.o.orientation == r.orientation) && "rtl" == e("html").attr("dir");
        this.isForwards = !this.isAuto || this.isAuto && null !== this.o.direction.match(/^forwards|backwards$/) && this.o.direction == r.direction && !this.isRTL;
        this.isLoop = this.isAuto && "loop" == this.o.autoMode || !this.isAuto && "loop" == this.o.manualMode;
        this.events = (this.supportsTouch = "createTouch" in document) ? {
            start: "touchstart MozTouchDown",
            move: "touchmove MozTouchMove",
            end: "touchend touchcancel MozTouchRelease"
        } : {
            start: "mouseenter",
            end: "mouseleave"
        };
        this.$list = e(n);
        var o = this.$list.children();
        this.$list.addClass("simply-scroll-list").wrap('<div class="simply-scroll-clip"></div>').parent().wrap('<div class="' + this.o.customClass + ' simply-scroll-container"></div>');
        this.isAuto ? this.o.pauseButton && (this.$list.parent().parent().prepend('<div class="simply-scroll-btn simply-scroll-btn-pause"></div>'), this.o.pauseOnHover = !1) : this.$list.parent().parent().prepend('<div class="simply-scroll-forward"></div>').prepend('<div class="simply-scroll-back"></div>');
        if (1 < o.length) {
            var u = !1,
                a = 0;
            this.isHorizontal ? (o.each(function() {
                a += e(this).outerWidth(!0)
            }), u = o.eq(0).outerWidth(!0) * o.length !== a) : (o.each(function() {
                a += e(this).outerHeight(!0)
            }), u = o.eq(0).outerHeight(!0) * o.length !== a);
            u && (this.$list = this.$list.wrap("<div></div>").parent().addClass("simply-scroll-list"), this.isHorizontal ? this.$list.children().css({
                "float": "left",
                width: a + "px"
            }) : this.$list.children().css({
                height: a + "px"
            }))
        }
        this.o.startOnLoad ? e(t).load(function() {
            s.init()
        }) : this.init()
    };
    e.simplyScroll.fn = e.simplyScroll.prototype = {};
    e.simplyScroll.fn.extend = e.simplyScroll.extend = e.extend;
    e.simplyScroll.fn.extend({
        init: function() {
            this.$items = this.$list.children();
            this.$clip = this.$list.parent();
            this.$container = this.$clip.parent();
            this.$btnBack = e(".simply-scroll-back", this.$container);
            this.$btnForward = e(".simply-scroll-forward", this.$container);
            this.isHorizontal ? (this.itemMax = this.$items.eq(0).outerWidth(!0), this.clipMax = this.$clip.width(), this.dimension = "width", this.moveBackClass = "simply-scroll-btn-left", this.moveForwardClass = "simply-scroll-btn-right", this.scrollPos = "Left") : (this.itemMax = this.$items.eq(0).outerHeight(!0), this.clipMax = this.$clip.height(), this.dimension = "height", this.moveBackClass = "simply-scroll-btn-up", this.moveForwardClass = "simply-scroll-btn-down", this.scrollPos = "Top");
            this.posMin = 0;
            this.posMax = this.$items.length * this.itemMax;
            var t = Math.ceil(this.clipMax / this.itemMax);
            if (this.isAuto && "loop" == this.o.autoMode) this.$list.css(this.dimension, this.posMax + this.itemMax * t + "px"), this.posMax += this.clipMax - this.o.speed, this.isForwards ? (this.$items.slice(0, t).clone(!0).appendTo(this.$list), this.resetPosition = 0) : (this.$items.slice(-t).clone(!0).prependTo(this.$list), this.resetPosition = this.$items.length * this.itemMax, this.isRTL && (this.$clip[0].dir = "ltr", this.$items.css("float", "right")));
            else if (!this.isAuto && "loop" == this.o.manualMode) {
                this.posMax += this.itemMax * t;
                this.$list.css(this.dimension, this.posMax + this.itemMax * t + "px");
                this.posMax += this.clipMax - this.o.speed;
                this.$items.slice(0, t).clone(!0).appendTo(this.$list);
                this.$items.slice(-t).clone(!0).prependTo(this.$list);
                this.resetPositionForwards = this.resetPosition = t * this.itemMax;
                this.resetPositionBackwards = this.$items.length * this.itemMax;
                var r = this;
                this.$btnBack.bind(this.events.start, function() {
                    r.isForwards = !1;
                    r.resetPosition = r.resetPositionBackwards
                });
                this.$btnForward.bind(this.events.start, function() {
                    r.isForwards = !0;
                    r.resetPosition = r.resetPositionForwards
                })
            } else this.$list.css(this.dimension, this.posMax + "px"), this.isForwards ? this.resetPosition = 0 : (this.resetPosition = this.$items.length * this.itemMax, this.isRTL && (this.$clip[0].dir = "ltr", this.$items.css("float", "right")));
            this.resetPos();
            this.interval = null;
            this.intervalDelay = Math.floor(1e3 / this.o.frameRate);
            if (this.isAuto || "end" != this.o.manualMode)
                for (; 0 !== this.itemMax % this.o.speed;)
                    if (this.o.speed--, 0 === this.o.speed) {
                        this.o.speed = 1;
                        break
                    }
            r = this;
            this.trigger = null;
            this.funcMoveBack = function(e) {
                e !== n && e.preventDefault();
                r.trigger = !r.isAuto && r.o.manualMode == "end" ? this : null;
                r.isAuto ? r.isForwards ? r.moveBack() : r.moveForward() : r.moveBack()
            };
            this.funcMoveForward = function(e) {
                e !== n && e.preventDefault();
                r.trigger = !r.isAuto && r.o.manualMode == "end" ? this : null;
                r.isAuto ? r.isForwards ? r.moveForward() : r.moveBack() : r.moveForward()
            };
            this.funcMovePause = function() {
                r.movePause()
            };
            this.funcMoveStop = function() {
                r.moveStop()
            };
            this.funcMoveResume = function() {
                r.moveResume()
            };
            if (this.isAuto) {
                this.paused = !1;
                var s = function() {
                    if (r.paused === !1) {
                        r.paused = !0;
                        r.funcMovePause()
                    } else {
                        r.paused = !1;
                        r.funcMoveResume()
                    }
                    return r.paused
                };
                this.supportsTouch && this.$items.find("a").length && (this.supportsTouch = !1);
                if (this.isAuto && this.o.pauseOnHover && !this.supportsTouch) this.$clip.bind(this.events.start, this.funcMovePause).bind(this.events.end, this.funcMoveResume);
                else if (this.isAuto && this.o.pauseOnTouch && !this.o.pauseButton && this.supportsTouch) {
                    var o, u;
                    this.$clip.bind(this.events.start, function(e) {
                        s();
                        var t = e.originalEvent.touches[0];
                        o = r.isHorizontal ? t.pageX : t.pageY;
                        u = r.$clip[0]["scroll" + r.scrollPos];
                        e.stopPropagation();
                        e.preventDefault()
                    }).bind(this.events.move, function(e) {
                        e.stopPropagation();
                        e.preventDefault();
                        e = e.originalEvent.touches[0];
                        e = o - (r.isHorizontal ? e.pageX : e.pageY) + u;
                        e < 0 ? e = 0 : e > r.posMax && (e = r.posMax);
                        r.$clip[0]["scroll" + r.scrollPos] = e;
                        r.funcMovePause();
                        r.paused = !0
                    })
                } else this.o.pauseButton && (this.$btnPause = e(".simply-scroll-btn-pause", this.$container).bind("click", function(t) {
                    t.preventDefault();
                    s() ? e(this).addClass("active") : e(this).removeClass("active")
                }));
                this.funcMoveForward()
            } else this.$btnBack.addClass("simply-scroll-btn " + this.moveBackClass).bind(this.events.start, this.funcMoveBack).bind(this.events.end, this.funcMoveStop), this.$btnForward.addClass("simply-scroll-btn " + this.moveForwardClass).bind(this.events.start, this.funcMoveForward).bind(this.events.end, this.funcMoveStop), "end" == this.o.manualMode && (this.isRTL ? this.$btnForward.addClass("disabled") : this.$btnBack.addClass("disabled"))
        },
        moveForward: function() {
            var e = this;
            this.movement = "forward";
            null !== this.trigger && this.$btnBack.removeClass("disabled");
            e.interval = setInterval(function() {
                e.$clip[0]["scroll" + e.scrollPos] < e.posMax - e.clipMax ? e.$clip[0]["scroll" + e.scrollPos] += e.o.speed : e.isLoop ? e.resetPos() : e.moveStop(e.movement)
            }, e.intervalDelay)
        },
        moveBack: function() {
            var e = this;
            this.movement = "back";
            null !== this.trigger && this.$btnForward.removeClass("disabled");
            e.interval = setInterval(function() {
                e.$clip[0]["scroll" + e.scrollPos] > e.posMin ? e.$clip[0]["scroll" + e.scrollPos] -= e.o.speed : e.isLoop ? e.resetPos() : e.moveStop(e.movement)
            }, e.intervalDelay)
        },
        movePause: function() {
            clearInterval(this.interval)
        },
        moveStop: function(t) {
            this.movePause();
            null !== this.trigger && ("undefined" != typeof t && e(this.trigger).addClass("disabled"), this.trigger = null);
            this.isAuto && "bounce" == this.o.autoMode && ("forward" == t ? this.moveBack() : this.moveForward())
        },
        moveResume: function() {
            "forward" == this.movement ? this.moveForward() : this.moveBack()
        },
        resetPos: function() {
            this.$clip[0]["scroll" + this.scrollPos] = this.resetPosition
        }
    })
})(jQuery, window);
jQuery(document).ready(function(e) {
    var t = {
        lines: 9,
        length: 6,
        width: 3,
        radius: 9,
        corners: 1,
        rotate: 0,
        direction: 1,
        color: "#fff",
        speed: 1,
        trail: 60,
        shadow: !1,
        hwaccel: !1,
        className: "spinner",
        zIndex: 2e9,
        top: "auto",
        left: "auto"
    }, n = document.getElementById("instagram_spinner"),
        r = (new Spinner(t)).spin(n),
        i = new Instafeed({
            get: "user",
            target: "instagram_list",
            userId: 1240335488,
            limit: 30,
            accessToken: "1240335488.467ede5.be2ebbe738d04f5ab7e082710f5aab28",
            resolution: "low_resolution",
            after: function() {
                e("#instagram_list").simplyScroll({
                    speed: 1,
                    frameRate: 20,
                    orientation: "horizontal",
                    direction: "forwards",
                    customClass: "instagram_scroller"
                });
                e("#instagram_spinner").remove()
            }
        });
    i.run()
});
