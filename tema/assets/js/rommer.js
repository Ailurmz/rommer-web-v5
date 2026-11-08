/* =========================================================
   ROMMER — Prototipo e-commerce
   - Catálogo de EJEMPLO (nombres y precios placeholder)
   - Carrito con drawer (en WordPress lo reemplaza WooCommerce)
   - Animaciones: GSAP + ScrollTrigger + Lenis
   - Carruseles: Swiper
   ========================================================= */
(function () {
  "use strict";

  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var RM = window.ROMMER || {};
  var IMG = RM.img || "assets/img/";
  var FREE_SHIP = RM.freeShip || 50000;
  var KIT = RM.kit || { n1: 3, p1: .15, n2: 4, p2: .20 };
  function src(f) { f = f || ""; return /^(https?:)?\/\//.test(f) || f.charAt(0) === "/" || f.indexOf("./") === 0 ? f : IMG + f; }
  function purl(p) { return p && p.url ? p.url : "producto.html#" + (p ? p.id : ""); }
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Almacenamiento seguro ---------- */
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    sget: function (k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } },
    sset: function (k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }
  };

  var money = (function () {
    var f;
    try { f = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }); } catch (e) { f = null; }
    return function (n) { return f ? f.format(n).replace(/\s/g, "") : "$" + Math.round(n).toLocaleString("es-AR"); };
  })();

  /* ---------- Tintes de envase (el envase real es rosa; los demás colores son placeholder) ---------- */
  var TINT = {
    pink: "none",
    magenta: "hue-rotate(-10deg) saturate(1.6) brightness(.82)",
    sky: "hue-rotate(-118deg) saturate(1.05) brightness(1.02)",
    orange: "hue-rotate(58deg) saturate(1.5) brightness(1.04)",
    yellow: "hue-rotate(80deg) saturate(1.9) brightness(1.18)",
    red: "hue-rotate(32deg) saturate(2) brightness(.86)",
    violet: "hue-rotate(-48deg) saturate(1.1)"
  };
  var COLOR = { pink: "#FD97CF", magenta: "#CC3888", sky: "#4EA3E2", yellow: "#FFE500", orange: "#FF931E", red: "#EB2600", cream: "#FBF2E1", violet: "#C9B6F2" };

  /* ---------- Catálogo de ejemplo ---------- */
  /* Catálogo: precios de ejemplo. Para cambiar una foto, reemplazá el archivo en assets/img (campo img). */
  var EJ = " (Texto de ejemplo.)";
  var PRODUCTS = [
    { id: "shampoo-keratin", name: "Shampoo Keratin", line: "Reparación", cat: "Shampoo", img: "p-keratin.webp", bg: "pink", badge: "Más vendido",
      sizes: [{ l: "250cc", sub: "Para casa", p: 12900 }, { l: "1L", sub: "Tamaño salón", p: 32900 }],
      claim: "Repara el daño. Fortalece cada fibra.", rating: 4.9, reviews: 128, step: 1,
      desc: "El Shampoo con Keratina complementa los tratamientos químicos como tinturas, decoloraciones y alisados. Ayuda a nutrir y devolver cuerpo, brillo y una apariencia más saludable. Su keratina hidrolizada favorece la hidratación, repara la elasticidad y fortalece cada cabello, dejándolo más brillante, manejable y protegido.",
      uso: "Aplicá sobre cabello húmedo con un suave masaje. Dejá actuar y enjuagá con abundante agua tibia. Repetí la operación.",
      ingr: "Water, Sodium laureth sulfate, Cocamide DEA, Glycol stearate, Sodium chloride, Hydrolyzed keratin, Fragrance (Butylphenyl methylpropional), Benzyl salicylate, Hexyl cinnamal, Methylchloroisothiazolinone, Methylisothiazolinone, Citric acid.",
      actives: ["Keratina hidrolizada", "Pro-vitamina B5", "Aminoácidos reparadores"], gallery: ["m-cereza.webp", "m-hotgirls.webp"] },
    { id: "shampoo-acid", name: "Shampoo Acid", line: "Alisado", cat: "Shampoo", img: "p-acid.webp", bg: "sky", badge: "Post-alisado",
      sizes: [{ l: "250cc", sub: "Para casa", p: 13500 }, { l: "1L", sub: "Tamaño salón", p: 33900 }],
      claim: "Cierra la cutícula. Prolonga el alisado.", rating: 4.8, reviews: 86, step: 1,
      desc: "Shampoo de pH ácido pensado para después del alisado y los procesos químicos. Sella la cutícula, prolonga el efecto liso y deja el pelo suave y con movimiento." + EJ,
      uso: "Aplicá sobre cabello húmedo, masajeá y enjuagá. Ideal para usar en cada lavado después del alisado." + EJ,
      actives: ["pH balanceado", "Ácido láctico", "Pro-vitamina B5"], gallery: ["m-traje.webp", "m-pelo-largo.webp"] },
    { id: "shampoo-coconut", name: "Shampoo Coconut", line: "Nutrición", cat: "Shampoo", img: "p-coconut.webp", bg: "yellow", compare: 15200, badge: "-15%",
      sizes: [{ l: "250cc", sub: "Para casa", p: 12900 }, { l: "1L", sub: "Tamaño salón", p: 32900 }],
      claim: "Nutrición profunda. Brillo natural.", rating: 4.9, reviews: 112, step: 1,
      desc: "Con aceite de coco y aceite de argán: nutre el pelo seco u opaco desde el primer lavado y le devuelve el brillo natural, sin apelmazar." + EJ,
      uso: "Aplicá sobre cabello húmedo, masajeá de medios a puntas y enjuagá con agua tibia." + EJ,
      actives: ["Aceite de coco", "Aceite de argán", "Vitamina E"], gallery: ["m-atardecer.webp", "m-hotgirls-logo.webp"] },
    { id: "shampoo-neutral", name: "Shampoo Neutral", line: "Uso diario", cat: "Shampoo", img: "p-neutral.webp", bg: "cream",
      sizes: [{ l: "250cc", sub: "Para casa", p: 11900 }, { l: "1L", sub: "Tamaño salón", p: 29900 }],
      claim: "Limpia sin resecar. Equilibrio y frescura.", rating: 4.7, reviews: 64, step: 1,
      desc: "El shampoo de todos los días: limpia suave, respeta el pH natural del cuero cabelludo y deja el pelo liviano y fresco." + EJ,
      uso: "Aplicá sobre cabello húmedo, masajeá y enjuagá. Apto para uso diario." + EJ,
      actives: ["pH balanceado", "Glicerina vegetal", "Pantenol"], gallery: ["m-rulos.webp", "m-espalda.webp"] },
    { id: "thermo-shield", name: "Thermo Shield Complex", line: "Protección térmica", cat: "Protector térmico", img: "p-thermo.webp", bg: "pink", compare: 16900, badge: "-14%",
      sizes: [{ l: "100cc", sub: "Spray", p: 14500 }],
      claim: "Protege hasta 230°C. Brillo y control del frizz.", rating: 4.9, reviews: 143, step: 3,
      desc: "Protector térmico en spray: cuida el pelo del calor de la planchita, la buclera y el secador hasta 230°C, controla el frizz y suma brillo." + EJ,
      uso: "Rociá sobre el cabello húmedo o seco, a 20 cm de distancia, antes de usar calor. No hace falta enjuagar." + EJ,
      actives: ["Keratina hidrolizada", "Pro-vitamina B5", "Siliconas protectoras"], gallery: ["m-ibiza.webp", "m-hero-rosa.webp"] },
    { id: "kit-hot-girl", name: "Kit Hot Girl", line: "Rutina completa", cat: "Kits", img: "p-keratin.webp", bg: "pink", compare: 40300, badge: "Kit",
      sizes: [{ l: "3 productos", sub: "Keratin + Coconut + Thermo Shield", p: 34900 }],
      claim: "La rutina completa, con descuento.", rating: 5, reviews: 41, isKit: true,
      desc: "Shampoo Keratin, Shampoo Coconut y Thermo Shield Complex: limpiá, nutrí y protegé en una sola compra." + EJ,
      actives: ["Keratina hidrolizada", "Aceite de coco", "Protección hasta 230°C"], gallery: ["m-hotgirls.webp", "spot-lineup.webp"] }
  ];
  if (RM.products && RM.products.length) PRODUCTS = RM.products;
  var byId = function (id) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i]; return null; };

  /* ---------- Stock ---------- */
  var ST = RM.stockTxt || { label: "Agotado", btn: "Sin stock por ahora", wa: "", waMsg: "", lowN: 0, low: "", max: "No hay más unidades disponibles de este producto.", cart: "" };
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function sizeOk(p, i) { var s = p && p.sizes[i]; return !!p && p.stock !== false && (!s || s.ok !== false); }
  function anyOk(p) { if (!p || p.stock === false) return false; if (!p.sizes.length) return true; for (var i = 0; i < p.sizes.length; i++) if (sizeOk(p, i)) return true; return false; }
  function firstOk(p) { for (var i = 0; i < p.sizes.length; i++) if (sizeOk(p, i)) return i; return 0; }
  function maxOf(p, i) { var s = p && p.sizes[i]; return s && s.max != null ? s.max : Infinity; }
  var outText = function () { return ST.btn || ST.label || "Agotado"; };
  /* Cuotas y descuento por transferencia (se eligen en el panel) */
  var CUO = RM.cuotas || { n: 3, txt: "{n} cuotas sin interés de {monto}" };
  var TRF = RM.transfer || { p: 10, txt: "{p}% OFF pagando por transferencia" };
  function cuotasTxt(price) { return CUO.n > 0 && CUO.txt && price ? CUO.txt.replace("{n}", CUO.n).replace("{monto}", money(Math.ceil(price / CUO.n))) : ""; }
  function cuotasHTML(price) {
    if (!(CUO.n > 0 && CUO.txt && price)) return "";
    var t = esc(CUO.txt.replace("{n}", CUO.n)), i = t.indexOf("{monto}"), m = money(Math.ceil(price / CUO.n));
    return i < 0 ? "<b>" + t + "</b>" : "<b>" + t.slice(0, i).replace(/\s+de\s*$/, "") + "</b>" + t.slice(0, i).match(/\s+de\s*$|$/)[0] + m + t.slice(i + 7);
  }
  function transferTxt() { return TRF.p > 0 && TRF.txt ? TRF.txt.replace("{p}", TRF.p) : ""; }
  /* Textos editables (Personalizar → Opciones de Rommer) */
  var TX = RM.txt || {};
  function tx(k, d) { return TX[k] != null ? TX[k] : d; }
  function nb(h) { return String(h).replace(/ <b>/g, "&nbsp;<b>").replace(/<\/b> /g, "</b>&nbsp;"); }
  function stars(n) { n = Math.max(0, Math.min(5, Math.round(n || 0))); return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n); }
  var pdpPaint = null;

  /* ---------- Stickers (SVG redibujados del PDF — reemplazar por los originales) ---------- */
  function starPath(cx, cy, n, ro, ri, rot) {
    var d = "", a = (rot || -90) * Math.PI / 180, step = Math.PI / n;
    for (var i = 0; i < n * 2; i++) {
      var r = i % 2 ? ri : ro, x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
      d += (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1); a += step;
    }
    return d + "Z";
  }
  var FD = "font-family:Blur,'Rommer Display',Fredoka,sans-serif;font-stretch:125%;font-weight:700";
  var STICKERS = {
    smiley: '<svg viewBox="0 0 140 140"><circle cx="70" cy="70" r="66" fill="#FFE500"/><g style="' + FD + '" fill="#1B1B1B" font-size="17" text-anchor="middle"><text x="70" y="44">HAIRCARE</text><text x="70" y="62">BUT MAKE</text><text x="34" y="80" text-anchor="start">IT</text><text x="106" y="80" text-anchor="end">FUN</text></g><path d="M38 90 Q70 126 102 90" fill="none" stroke="#1B1B1B" stroke-width="5" stroke-linecap="round"/></svg>',
    approved: '<svg viewBox="0 0 220 120"><g transform="rotate(-8 110 60)"><ellipse cx="110" cy="60" rx="104" ry="48" fill="#EB2600" stroke="#2A2A2A" stroke-width="7"/><g style="' + FD + '" fill="#2A2A2A" text-anchor="middle"><text x="110" y="56" font-size="30">ROMMER</text><text x="110" y="86" font-size="30">APPROVED</text></g></g></svg>',
    proheart: '<svg viewBox="0 0 120 120"><path d="' + starPath(60, 62, 5, 56, 30) + '" fill="#FBF2E1" stroke="#2A2A2A" stroke-width="7" stroke-linejoin="round"/><g style="' + FD + ';font-stretch:100%" fill="#1B1B1B" font-size="10.5" text-anchor="middle"><text x="60" y="54">PRO AT</text><text x="60" y="65">HEART</text><text x="60" y="76">COOL BY</text><text x="60" y="87">NATURE.</text></g></svg>',
    burst: '<svg viewBox="0 0 140 140"><path d="' + starPath(70, 70, 12, 64, 44) + '" fill="#FD97CF" stroke="#2A2A2A" stroke-width="8" stroke-linejoin="round"/></svg>',
    cherry: '<svg viewBox="0 0 130 150"><path d="M64 60 C66 34 78 16 98 8" fill="none" stroke="#0E7A3A" stroke-width="7" stroke-linecap="round"/><path d="M98 8 C114 4 126 14 126 28 C110 30 98 22 98 8Z" fill="#0E7A3A"/><circle cx="64" cy="94" r="50" fill="#FBF2E1" stroke="#EB2600" stroke-width="12"/><text x="64" y="112" text-anchor="middle" style="' + FD + ';font-stretch:100%" font-size="52" fill="#EB2600">rr</text></svg>',
    motion: '<svg viewBox="0 0 230 100"><rect x="2" y="2" width="226" height="96" fill="#EB2600"/><g style="' + FD + ';font-stretch:80%" fill="#FBF2E1" font-size="34"><text x="12" y="46" textLength="206" lengthAdjust="spacingAndGlyphs">HAIR IN MOTION.</text><text x="12" y="84" textLength="206" lengthAdjust="spacingAndGlyphs">BRAND IN MOTION.</text></g></svg>',
    structured: '<svg viewBox="0 0 240 130"><ellipse cx="120" cy="65" rx="114" ry="58" fill="#1B1B1B" transform="rotate(-10 120 65)"/><path d="' + starPath(120, 66, 4, 70, 18, -80) + '" fill="#CC3888"/><g transform="rotate(-12 120 65)" text-anchor="middle"><text x="120" y="62" style="font-family:Inter,sans-serif;font-weight:800" font-size="24" fill="#FBF2E1">STRUCTURED,</text><text x="122" y="90" style="font-family:Inter,sans-serif;font-weight:800;font-style:italic" font-size="22" fill="#FBF2E1">but never rigid.</text></g></svg>',
    rr: '<svg viewBox="0 0 160 120"><ellipse cx="80" cy="60" rx="76" ry="56" fill="#4EA3E2"/><ellipse cx="80" cy="60" rx="58" ry="40" fill="none" stroke="#FFE500" stroke-width="12"/><text x="80" y="82" text-anchor="middle" style="' + FD + ';font-stretch:100%" font-size="62" fill="#FFE500">rr</text></svg>',
    heart: '<svg viewBox="0 0 120 90"><text x="60" y="76" text-anchor="middle" style="' + FD + '" font-size="86" fill="#CC3888">&lt;3</text></svg>',
    star: function (fill, stroke) { return '<svg viewBox="0 0 100 100"><path d="' + starPath(50, 53, 5, 44, 22) + '" fill="' + (fill || "#FFE500") + '" stroke="' + (stroke || "#2A2A2A") + '" stroke-width="9" stroke-linejoin="round"/></svg>'; },
    spark: function (fill) { return '<svg viewBox="0 0 100 100"><path d="' + starPath(50, 50, 4, 48, 10, -90) + '" fill="' + (fill || "#1B1B1B") + '"/></svg>'; }
  };
  var MONO = {
    smiley: { "#FFE500": "#111111", "#1B1B1B": "#FFFFFF" },
    approved: { "#EB2600": "#FFFFFF", "#2A2A2A": "#111111" },
    proheart: { "#FBF2E1": "#FFFFFF", "#2A2A2A": "#111111", "#1B1B1B": "#111111" },
    burst: { "#FD97CF": "#FFFFFF", "#2A2A2A": "#111111" },
    cherry: { "#0E7A3A": "#111111", "#FBF2E1": "#FFFFFF", "#EB2600": "#111111" },
    motion: { "#EB2600": "#111111", "#FBF2E1": "#FFFFFF" },
    structured: { "#1B1B1B": "#111111", "#CC3888": "#5A5A5A", "#FBF2E1": "#FFFFFF" },
    rr: { "#4EA3E2": "#111111", "#FFE500": "#FFFFFF" },
    heart: { "#CC3888": "#111111" }
  };
  function stickerSVG(name, a, b, tone) {
    var mono = tone !== "color";
    if (mono && (name === "star" || name === "spark")) { a = "#FFFFFF"; b = "#111111"; }
    var s = STICKERS[name]; s = typeof s === "function" ? s(a, b) : (s || "");
    if (mono && MONO[name]) Object.keys(MONO[name]).forEach(function (k) { s = s.split(k).join(MONO[name][k]); });
    return s;
  }
  /* Stickers originales de la marca (assets/img/st-*.webp). Para cambiar uno, reemplazá el archivo. */
  var STICKER_IMG = {
    smiley: "st-smiley.webp", approved: "st-approved.webp", proheart: "st-estrella.webp", cherry: "st-cereza.webp",
    rr: "st-rr.webp", structured: "st-structured.webp", motion: "st-logo.webp", burst: "st-corazon.webp",
    star: "st-r.webp", heart: "st-corazon.webp"
  };
  function hydrateStickers(root) {
    $$("[data-sticker]", root).forEach(function (el) {
      if (el.dataset.done) return;
      var file = (RM.stickers && RM.stickers[el.dataset.sticker]) || STICKER_IMG[el.dataset.sticker];
      el.innerHTML = file ? '<img src="' + src(file) + '" alt="" draggable="false" loading="lazy">' : stickerSVG(el.dataset.sticker, el.dataset.fill, el.dataset.stroke, el.dataset.tone);
      el.dataset.done = "1";
    });
  }
  function wordmark() { return '<span class="wordmark" aria-label="rommer"><i class="L"></i><i class="L"></i><i class="L"></i><i class="L"></i><i class="L"></i><i class="L"></i></span>'; }

  /* ---------- Íconos ---------- */
  var ICON = {
    arrowR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    arrowL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>'
  };

  /* ---------- Cupón (bienvenida o cargado a mano) ---------- */
  var CP = store.get("rommer-coupon", null);
  function cpSave(c) { CP = c; store.set("rommer-coupon", c); renderCart(); if (window.RommerPaintCoupon) window.RommerPaintCoupon(); }
  function cpOn() { return !!(CP && CP.code && CP.on); }
  /* Descuento del cupón sobre un monto (igual que WooCommerce: % o monto fijo, con compra mínima) */
  function cpDiscount(amount) {
    if (!cpOn() || !amount || (CP.min && amount < CP.min)) return 0;
    if (CP.type === "percent") return Math.round(amount * CP.amount / 100);
    if (CP.type === "fixed") return Math.min(amount, CP.amount);
    return 0;
  }

  /* ---------- Carrito ---------- */
  var cart = store.get("rommer-cart", []);
  function priceOf(item) { var p = byId(item.id); if (!p) return 0; var s = p.sizes[item.size] || p.sizes[0]; return s.p; }
  function cartQty() { return cart.reduce(function (a, i) { return a + i.qty; }, 0); }
  function cartSubtotal() { return cart.reduce(function (a, i) { return a + priceOf(i) * i.qty; }, 0); }
  function kitDiscountRate() { var q = cart.reduce(function (a, i) { var p = byId(i.id); return a + (p && !p.isKit ? i.qty : 0); }, 0); return q >= KIT.n2 ? KIT.p2 : q >= KIT.n1 ? KIT.p1 : 0; }
  function kitBase() { return cart.reduce(function (a, i) { var p = byId(i.id); return a + (p && !p.isKit ? priceOf(i) * i.qty : 0); }, 0); }
  function saveCart() { store.set("rommer-cart", cart); renderCart(); }
  function addToCart(id, size, qty, opts) {
    size = size || 0; qty = qty || 1;
    var p = byId(id);
    if (!sizeOk(p, size)) { toast(esc(outText())); return; }
    var f = null; cart.forEach(function (i) { if (i.id === id && i.size === size) f = i; });
    var room = maxOf(p, size) - (f ? f.qty : 0);
    if (room <= 0) { if (ST.max) toast(esc(ST.max)); return; }
    if (qty > room) { qty = room; if (ST.max) toast(esc(ST.max)); }
    if (f) f.qty += qty; else cart.push({ id: id, size: size, qty: qty });
    saveCart();
    var c = $(".cart-count"); if (c) { c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); }
    if (!opts || !opts.silent) openDrawer();
  }

  /* Lo que se agotó sale del changuito; las cantidades no pasan de lo disponible. */
  function cleanCart() {
    var gone = [];
    cart = cart.filter(function (i) {
      var p = byId(i.id); if (!p) return true;
      if (!sizeOk(p, i.size)) { gone.push(p.name); return false; }
      var mx = maxOf(p, i.size); if (i.qty > mx) i.qty = mx;
      return i.qty > 0;
    });
    if (gone.length) { store.set("rommer-cart", cart); if (ST.cart) toast(esc(ST.cart.replace("{productos}", gone.join(", ")))); }
  }

  function renderCart() {
    cleanCart();
    var count = cartQty();
    $$(".cart-count").forEach(function (c) { c.textContent = count; c.classList.toggle("has-items", count > 0); });
    var d = $("#drawer"); if (!d) return;
    $(".js-cart-n", d).textContent = count ? "(" + count + ")" : "";
    var sub = cartSubtotal(), rate = kitDiscountRate(), cpd = cpDiscount(sub), cpf = sub ? (sub - cpd) / sub : 1;
    var disc = Math.round(kitBase() * cpf * rate), total = sub - cpd - disc;
    // envío gratis
    var left = Math.max(0, FREE_SHIP - total), pct = Math.min(100, total / FREE_SHIP * 100);
    var ship = $(".ship", d);
    ship.classList.toggle("is-free", left === 0 && count > 0);
    $(".ship p", d).innerHTML = count === 0 ? tx("ship0", "Envío gratis en compras desde <b>" + money(FREE_SHIP) + "</b>") :
      left > 0 ? tx("shipLeft", "Te faltan <b>{monto}</b> para el envío gratis :)").replace("{monto}", money(left)) : tx("shipOk", "¡Tenés <b>envío gratis</b>! <3");
    $(".ship__fill", d).style.width = pct + "%";
    $(".ship__knob", d).style.left = pct + "%";
    // promo kit
    var km = $(".kit-msg", d), nk = cart.reduce(function (a, i) { var p = byId(i.id); return a + (p && !p.isKit ? i.qty : 0); }, 0);
    if (count === 0) km.hidden = true;
    else {
      km.hidden = false;
      var falta1 = KIT.n1 - nk, kmsg = rate === KIT.p2 ? tx("kit2", "Armaste tu kit: <b>" + Math.round(KIT.p2 * 100) + "% OFF</b> aplicado") : rate === KIT.p1 ? tx("kit1", "Kit de " + KIT.n1 + ": <b>" + Math.round(KIT.p1 * 100) + "% OFF</b>. Sumá {faltan} más y es " + Math.round(KIT.p2 * 100) + "%") : tx("kit0", "Sumá {productos} más y armás tu kit con " + Math.round(KIT.p1 * 100) + "% OFF");
      kmsg = kmsg.replace("{faltan}", KIT.n2 - nk).replace("{productos}", falta1 + (falta1 > 1 ? " productos" : " producto"));
      km.innerHTML = '<span class="r-dot"></span>' + nb(kmsg); km.hidden = !kmsg;
    }
    // líneas
    var body = $(".drawer__body", d);
    if (!count) {
      body.innerHTML = '<div class="empty"><span class="sticker float" data-sticker="smiley" data-tone="color"></span><p class="h-sm display">' + esc(tx("emptyT", "Tu changuito está vacío")) + "</p>" + (tx("emptyP", "") ? "<p>" + esc(tx("emptyP", "")) + "</p>" : "") + (tx("emptyBtn", "Ver productos") ? '<a class="btn btn--ink btn--sm" href="' + esc(tx("emptyLink", (RM.home || "index.html") + "#mas-vendidos")) + '">' + esc(tx("emptyBtn", "Ver productos")) + "</a>" : "") + "</div>";
      hydrateStickers(body);
    } else {
      body.innerHTML = cart.map(function (i, idx) {
        var p = byId(i.id); if (!p) return "";
        var s = p.sizes[i.size] || p.sizes[0];
        return '<div class="line"><a class="line__img" href="' + purl(p) + '" ><img src="' + src(p.img) + '" alt=""></a>' +
          '<div><h4>' + p.name + '</h4><small>' + s.l + " · " + s.sub + '</small><div class="qty"><button aria-label="Restar" data-q="-1" data-i="' + idx + '">−</button><output>' + i.qty + '</output><button aria-label="Sumar" data-q="1" data-i="' + idx + '">+</button></div></div>' +
          '<div class="line__right"><span class="line__price">' + money(s.p * i.qty) + '</span><button class="line__rm" data-rm="' + idx + '">' + esc(tx("rm", "Quitar")) + '</button></div></div>';
      }).join("");
    }
    // upsell: productos que no están en el carrito
    var inCart = cart.map(function (i) { return i.id; });
    var ups = PRODUCTS.filter(function (p) { return inCart.indexOf(p.id) < 0 && !p.isKit && anyOk(p); }).slice(0, 4);
    $(".upsell__row", d).innerHTML = ups.map(function (p) {
      var fi = firstOk(p);
      return '<div class="mini"><div class="mini__img"><img src="' + src(p.img) + '" alt=""></div><div><b>' + p.name + '</b><small>' + money(p.sizes[fi].p) + '</small><br><button data-add="' + p.id + '" data-size="' + fi + '">' + esc(tx("addMini", "+ Agregar")) + "</button></div></div>";
    }).join("");
    $(".upsell", d).hidden = !ups.length;
    // totales
    $(".js-sub", d).textContent = money(sub);
    var dr = $(".js-disc-row", d); dr.hidden = !disc; $(".js-disc", d).textContent = "−" + money(disc);
    $(".js-total", d).textContent = money(total);
    var cr = $(".js-cp-row", d);
    if (cr) {
      cr.hidden = !cpd;
      $(".js-cp-label", d).textContent = tx("cpLine", "Cupón {codigo}").replace("{codigo}", CP ? CP.code : "");
      $(".js-cp", d).textContent = "−" + money(cpd);
      var on = $(".js-cp-on", d), op = $(".js-cp-open", d), fm = $(".js-cp-form", d), msg = $(".js-cp-msg", d);
      var needMin = CP && CP.on && CP.min && sub < CP.min;
      on.hidden = !(CP && CP.code && !CP.on); on.textContent = "🎁 " + tx("cpUse", "Usar mi cupón") + " " + (CP ? CP.code : "");
      op.hidden = !!(CP && CP.code) || !fm.hidden;
      if (needMin) { msg.textContent = tx("cpMin", "Este cupón vale en compras desde {monto}.").replace("{monto}", money(CP.min)); msg.hidden = false; }
      else if (msg.dataset.keep !== "1") msg.hidden = true;
    }
    var ct = cuotasTxt(total); $(".js-cuotas", d).textContent = ct ? tx("cuotas", "o {detalle}").replace("{detalle}", ct) : "";
    $(".js-checkout", d).disabled = !count;
  }

  var lenis = null;
  function openDrawer() { var d = $("#drawer"); if (!d) return; d.classList.add("is-open"); $("#overlay").classList.add("is-open"); d.setAttribute("aria-hidden", "false"); if (lenis) lenis.stop(); setTimeout(function () { var b = $(".drawer__head button", d); if (b) b.focus({ preventScroll: true }); }, 50); }
  function closeAll() {
    $$(".drawer, .overlay, .search, .mmenu, .mega").forEach(function (e) { e.classList.remove("is-open"); });
    var d = $("#drawer"); if (d) d.setAttribute("aria-hidden", "true");
    $$("[aria-expanded='true']").forEach(function (b) { b.setAttribute("aria-expanded", "false"); });
    if (lenis) lenis.start();
  }

  function cartUI() {
    document.addEventListener("click", function (e) {
      var t = e.target.closest("[data-q],[data-rm],[data-add],.js-open-cart,.js-close,.js-checkout,#overlay");
      if (!t) return;
      if (t.dataset.q) {
        var i = cart[+t.dataset.i];
        if (+t.dataset.q > 0 && i.qty >= maxOf(byId(i.id), i.size)) { if (ST.max) toast(esc(ST.max)); return; }
        i.qty += +t.dataset.q; if (i.qty < 1) cart.splice(+t.dataset.i, 1); saveCart();
      }
      else if (t.dataset.rm) { cart.splice(+t.dataset.rm, 1); saveCart(); }
      else if (t.dataset.add) {
        var card = t.closest("[data-card]"); var size = card ? +(card.dataset.size || 0) : +(t.dataset.size || 0);
        addToCart(t.dataset.add, size, 1, { silent: !!t.closest("#drawer") });
        if (t.classList.contains("add-btn")) { t.classList.add("is-added"); var o = t.innerHTML; t.innerHTML = "<span>" + esc(tx("added", "¡Agregado! <3")) + "</span>"; setTimeout(function () { t.classList.remove("is-added"); t.innerHTML = o; }, 1300); }
      }
      else if (t.classList.contains("js-open-cart")) { e.preventDefault(); openDrawer(); }
      else if (t.classList.contains("js-checkout")) {
        if (RM.checkout) {
          var items = cart.map(function (i) { var p = byId(i.id); if (!p) return ""; var s = p.sizes[i.size] || p.sizes[0]; return (s.vid || p.wcId) + ":" + i.qty; }).filter(Boolean).join(",");
          location.href = RM.checkout + (RM.checkout.indexOf("?") > -1 ? "&" : "?") + "rommer_cart=" + encodeURIComponent(items) + (cpOn() ? "&rommer_coupon=" + encodeURIComponent(CP.code) : "");
        } else toast("En WordPress este botón lleva al checkout de WooCommerce con Mercado Pago :)");
      }
      else closeAll();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });
    var d = $("#drawer");
    if (d && $(".js-cp-box", d)) {
      var fm = $(".js-cp-form", d), msg = $(".js-cp-msg", d);
      $(".js-cp-open", d).addEventListener("click", function () { fm.hidden = false; this.hidden = true; $("input", fm).focus(); });
      $(".js-cp-on", d).addEventListener("click", function () { if (CP) { CP.on = true; cpSave(CP); } });
      $(".js-cp-off", d).addEventListener("click", function () { if (CP) { CP.on = false; cpSave(CP); } });
      fm.addEventListener("submit", function (e) {
        e.preventDefault();
        var code = $("input", fm).value.trim().toUpperCase(); if (!code) return;
        var show = function (t) { msg.textContent = t; msg.hidden = false; msg.dataset.keep = "1"; setTimeout(function () { msg.dataset.keep = ""; }, 4000); };
        var ok = function (r) { fm.hidden = true; $("input", fm).value = ""; msg.hidden = true; cpSave({ code: r.code, type: r.type, amount: r.amount, min: r.min, on: true }); };
        if (!RM.ajax) { if (POP.demo && code === POP.demo.toUpperCase()) ok({ code: code, type: "percent", amount: POP.p || 10, min: 0 }); else show(tx("cpErr", "Ese cupón no existe.")); return; }
        var f = new FormData(); f.append("action", "rommer_coupon"); f.append("code", code);
        fetch(RM.ajax, { method: "POST", body: f, credentials: "same-origin" }).then(function (r) { return r.json(); }).then(function (r) { if (r.ok) ok(r); else show(r.msg || tx("cpErr", "Ese cupón no existe.")); }).catch(function () { show(tx("cpErr", "Ese cupón no existe.")); });
      });
    }
    renderCart();
  }

  /* ---------- Toast ---------- */
  var toastT;
  function toast(msg) {
    var t = $(".toast"); if (!t) { t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
    t.innerHTML = '<span class="r-dot"></span><span>' + msg + "</span>"; t.classList.add("is-on");
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove("is-on"); }, 3200);
  }

  /* ---------- Tarjeta de producto ---------- */
  function cardHTML(p) {
    var s0 = p.sizes[0], sale = p.compare && p.sizes.length;
    var badge = p.badge ? '<span class="pcard__badge' + (p.compare ? " pcard__badge--sale" : "") + '">' + p.badge + "</span>" : "";
    var seg = p.sizes.length > 1 ? '<div class="seg" role="group" aria-label="Tamaño">' + p.sizes.map(function (s, i) { return '<button type="button" aria-pressed="' + (i === 0) + '" data-size="' + i + '">' + s.l + "</button>"; }).join("") + "</div>" : '<div class="seg"><button type="button" aria-pressed="true">' + s0.l + "</button></div>";
    var stk = ["smiley", "approved", "proheart", "cherry", "rr", "burst", "star", "structured"][PRODUCTS.indexOf(p) % 8];
    return '<article class="pcard" data-card data-size="0">' +
      '<a class="pcard__media" href="' + purl(p) + '" aria-label="' + p.name + '">' + badge +
      '<img class="main" src="' + src(p.img) + '" alt="' + p.name + '" loading="lazy"><img class="alt" src="' + src(p.img) + '" alt="" loading="lazy">' +
      '<span class="pcard__sticker" data-sticker="' + stk + '" data-tone="color"></span></a>' +
      '<div class="pcard__body"><h3 class="pcard__title"><a href="' + purl(p) + '">' + p.name + '</a></h3><p class="pcard__sub">' + p.line + " · " + p.claim + "</p>" +
      '<div class="pcard__rating"' + (p.reviews ? "" : ' style="visibility:hidden"') + '><span class="stars">' + stars(p.rating) + "</span>" + p.rating.toFixed(1).replace(".", ",") + " (" + p.reviews + ")</div>" + seg +
      '<button class="add-btn" type="button" data-add="' + p.id + '"><span>' + esc(tx("add", "Agregar")) + '</span><span class="js-price">' + (sale ? "<s>" + money(p.compare) + "</s>" : "") + money(s0.p) + "</span></button>" +
      '<div class="cuotas js-cuotas-card">' + esc(cuotasTxt(s0.p)) + "</div></div></article>";
  }
  function setCardSize(card, p, i) {
    card.dataset.size = i;
    $$(".seg [data-size]", card).forEach(function (x) { x.setAttribute("aria-pressed", +x.dataset.size === i); });
    var s = p.sizes[i];
    $(".js-price", card).innerHTML = (p.compare && i === 0 ? "<s>" + money(p.compare) + "</s>" : "") + money(s.p);
    $(".js-cuotas-card", card).textContent = cuotasTxt(s.p);
  }
  function bindCards(root) {
    root.addEventListener("click", function (e) {
      var b = e.target.closest(".seg [data-size]"); if (!b || b.disabled) return;
      var card = b.closest("[data-card]");
      setCardSize(card, byId($("[data-add]", card).dataset.add), +b.dataset.size);
    });
  }
  /* Botón de compra: si no hay stock, queda bloqueado con el texto de “agotado”. */
  function paintBtn(btn, ok, short) {
    var t = $("span", btn); if (!t) return;
    if (btn.dataset.txt == null) btn.dataset.txt = t.textContent;
    btn.disabled = !ok;
    t.textContent = ok ? btn.dataset.txt : short ? (ST.label || outText()) : outText();
  }
  function paintCard(card) {
    var btn = $(".add-btn[data-add]", card), p = btn && byId(btn.dataset.add); if (!p) return;
    var out = !anyOk(p);
    card.classList.toggle("is-out", out);
    var tag = $(".pcard__out", card);
    if (out && ST.label && !tag) { tag = document.createElement("span"); tag.className = "pcard__out"; tag.textContent = ST.label; $(".pcard__media", card).appendChild(tag); }
    if (tag) tag.hidden = !out;
    $$(".seg [data-size]", card).forEach(function (b) { var ok = sizeOk(p, +b.dataset.size); b.disabled = !ok; b.classList.toggle("is-out", !ok && !out); });
    if (!out && !sizeOk(p, +(card.dataset.size || 0))) setCardSize(card, p, firstOk(p));
    paintBtn(btn, !out, true);
  }
  function paintAll() {
    $$("[data-card]").forEach(paintCard);
    $$(".add-btn[data-add]").forEach(function (b) { if (!b.closest("[data-card]")) paintBtn(b, anyOk(byId(b.dataset.add)), true); });
    if (pdpPaint) pdpPaint();
  }
  function renderProducts(el) {
    var ids = (el.dataset.products || "").split(",").map(function (s) { return s.trim(); });
    var list = ids[0] === "all" ? PRODUCTS : ids.map(byId).filter(Boolean);
    $(".swiper-wrapper", el).innerHTML = list.map(function (p) { return '<div class="swiper-slide">' + cardHTML(p) + "</div>"; }).join("");
    hydrateStickers(el); bindCards(el);
    $$("[data-card]", el).forEach(paintCard);
  }

  /* ---------- Carruseles (Swiper) + barra de progreso con la "r" ---------- */
  function carousel(el, opts) {
    if (typeof Swiper === "undefined") return null;
    var sec = el.closest("[data-carousel-wrap]") || el.parentElement;
    var prev = $(".js-prev", sec), next = $(".js-next", sec), prog = $(".r-progress", sec);
    var sw = new Swiper(el, Object.assign({
      slidesPerView: "auto", spaceBetween: 14, grabCursor: true, watchSlidesProgress: true,
      freeMode: { enabled: true, momentumRatio: .6, sticky: false },
      navigation: prev && next ? { prevEl: prev, nextEl: next } : undefined,
      breakpoints: { 768: { spaceBetween: 18 } }
    }, opts || {}));
    function upd() {
      if (!prog) return;
      var p = Math.max(0, Math.min(1, sw.progress || 0)), w = 12 + p * 88;
      $(".r-progress__fill", prog).style.width = w + "%"; $(".r-progress__knob", prog).style.left = w + "%";
      $(".r-progress__knob", prog).style.transform = "rotate(" + (p * 360) + "deg)";
    }
    sw.on("progress", upd); sw.on("resize", upd); upd();
    return sw;
  }

  /* ---------- Header, anuncio, menú, buscador ---------- */
  function headerUI() {
    var h = $(".header");
    var onScroll = function () { if (h) h.classList.toggle("is-solid", window.scrollY > 40); };
    window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

    var msgs = $$(".announce__msg"), k = 0;
    if (msgs.length) { msgs[0].classList.add("is-on"); setInterval(function () { var a = msgs[k]; a.classList.remove("is-on"); a.classList.add("is-out"); k = (k + 1) % msgs.length; var b = msgs[k]; b.classList.remove("is-out"); void b.offsetWidth; b.classList.add("is-on"); setTimeout(function () { a.classList.remove("is-out"); }, 700); }, 3800); }

    var mt = $(".js-mega"), mega = $(".mega"), timer;
    if (mt && mega) {
      var open = function () { clearTimeout(timer); mega.classList.add("is-open"); mt.setAttribute("aria-expanded", "true"); };
      var close = function () { timer = setTimeout(function () { mega.classList.remove("is-open"); mt.setAttribute("aria-expanded", "false"); }, 160); };
      mt.addEventListener("mouseenter", open); mt.addEventListener("mouseleave", close);
      mega.addEventListener("mouseenter", open); mega.addEventListener("mouseleave", close);
      mt.addEventListener("click", function () { mega.classList.contains("is-open") ? close() : open(); });
    }
    var mm = $(".mmenu");
    $$(".js-burger").forEach(function (b) { b.addEventListener("click", function () { mm.classList.add("is-open"); if (lenis) lenis.stop(); if (window.gsap && !REDUCED) gsap.from($$(".mmenu a.big"), { y: 60, opacity: 0, rotate: 4, stagger: .06, duration: .7, ease: "back.out(1.6)", delay: .15 }); }); });
    $$(".mmenu a").forEach(function (a) { a.addEventListener("click", closeAll); });

    var se = $(".search"), si = $(".search__input"), sr = $(".search__results");
    $$(".js-search").forEach(function (b) { b.addEventListener("click", function () { se.classList.add("is-open"); if (lenis) lenis.stop(); setTimeout(function () { si.focus(); }, 60); doSearch(""); }); });
    if (se) se.addEventListener("click", function (e) { if (e.target === se) closeAll(); });
    function doSearch(q) {
      q = q.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
      var res = PRODUCTS.filter(function (p) { return !q || (p.name + " " + p.line + " " + p.cat + " " + p.claim).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").indexOf(q) > -1; }).slice(0, 6);
      sr.innerHTML = res.length ? res.map(function (p) { return '<a class="search__item" href="' + purl(p) + '"><span class="search__thumb"><img src="' + src(p.img) + '" alt=""></span><span><b>' + p.name + "</b><br><small>" + p.line + " · " + money(p.sizes[firstOk(p)].p) + (anyOk(p) || !ST.label ? "" : " · <b>" + esc(ST.label) + "</b>") + "</small></span></a>"; }).join("") : '<p class="search__hint">' + esc(tx("searchNone", 'No encontramos eso :( Probá con "keratina", "hidratación" o "frizz".')) + "</p>";
    }
    if (si) si.addEventListener("input", function () { doSearch(si.value); });
  }

  /* ---------- Cursor "r" ---------- */
  function cursor() {
    if (REDUCED || window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    var c = document.createElement("div"); c.className = "cursor"; c.innerHTML = '<span class="r-dot"></span>'; document.body.appendChild(c);
    var x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y, rot = 0;
    window.addEventListener("mousemove", function (e) { x = e.clientX; y = e.clientY; c.classList.add("is-on"); }, { passive: true });
    document.addEventListener("mouseleave", function () { c.classList.remove("is-on"); });
    document.addEventListener("mouseover", function (e) { c.classList.toggle("is-hover", !!e.target.closest("a,button,.ba,[data-sticker],input,select,summary")); });
    (function loop() { cx += (x - cx) * .2; cy += (y - cy) * .2; rot += (x - cx) * .02; c.style.transform = "translate(" + cx + "px," + cy + "px) rotate(" + rot + "deg)"; requestAnimationFrame(loop); })();
  }

  /* ---------- Antes / después ---------- */
  function beforeAfter() {
    $$(".ba").forEach(function (ba) {
      var drag = false;
      var set = function (cx) { var r = ba.getBoundingClientRect(); var p = Math.max(3, Math.min(97, (cx - r.left) / r.width * 100)); ba.style.setProperty("--pos", p + "%"); };
      ba.addEventListener("pointerdown", function (e) { drag = true; ba.setPointerCapture(e.pointerId); set(e.clientX); });
      ba.addEventListener("pointermove", function (e) { if (drag) set(e.clientX); });
      ba.addEventListener("pointerup", function () { drag = false; });
      ba.addEventListener("keydown", function (e) { var cur = parseFloat(getComputedStyle(ba).getPropertyValue("--pos")) || 50; if (e.key === "ArrowLeft") ba.style.setProperty("--pos", Math.max(3, cur - 5) + "%"); if (e.key === "ArrowRight") ba.style.setProperty("--pos", Math.min(97, cur + 5) + "%"); });
    });
  }

  /* ---------- Pestañas producto estrella ---------- */
  function tabs() {
    $$("[data-tabs]").forEach(function (wrap) {
      var btns = $$("[role=tab]", wrap), sec = wrap.closest(".star-prod");
      btns.forEach(function (b) {
        b.addEventListener("click", function () {
          btns.forEach(function (x) { x.setAttribute("aria-selected", x === b); var pnl = document.getElementById(x.getAttribute("aria-controls")); pnl.hidden = x !== b; });
          if (sec) {
            sec.style.setProperty("--tabc", COLOR[b.dataset.c]);
            var imgs = (b.dataset.imgs || "").split(",");
            $$(".star-prod__bottle img", sec).forEach(function (im, k) { if (imgs[k]) im.src = src(imgs[k]); });
          }
          var pnl = document.getElementById(b.getAttribute("aria-controls"));
          if (window.gsap && !REDUCED) gsap.from($$("li, .h-md, .btn", pnl), { y: 18, opacity: 0, stagger: .05, duration: .5, ease: "back.out(1.5)" });
          if (window.gsap && !REDUCED && sec) gsap.fromTo($(".star-prod__bottle", sec), { rotate: -8, scale: .94 }, { rotate: 0, scale: 1, duration: .8, ease: "elastic.out(1,.5)" });
        });
      });
    });
  }

  /* ---------- Formularios demo ---------- */
  function forms() {
    $$("form[data-demo]").forEach(function (f) { f.addEventListener("submit", function (e) {
      e.preventDefault();
      if (f.dataset.wa && RM.whatsapp) {
        var lines = [f.dataset.wa];
        $$("input", f).forEach(function (inp) { var lb = inp.closest(".field") && $("label", inp.closest(".field")); if (inp.value.trim()) lines.push((lb ? lb.textContent.trim() + ": " : "") + inp.value.trim()); });
        window.open("https://wa.me/" + RM.whatsapp + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
      }
      if (f.dataset.demo) toast(esc(f.dataset.demo)); f.reset();
    }); });
    /* Rommer Pro: cada botón abre su formulario */
    $$(".js-pro-tab").forEach(function (b) { b.addEventListener("click", function () {
      $$(".js-pro-tab").forEach(function (x) { var on = x === b; x.setAttribute("aria-pressed", on); var fm = document.getElementById(x.getAttribute("aria-controls")); if (fm) fm.hidden = !on; x.classList.toggle("btn--ink", on); x.classList.toggle("btn--line", !on); });
      var fm = document.getElementById(b.getAttribute("aria-controls")); if (fm) { var i = $("input", fm); if (i) i.focus({ preventScroll: true }); }
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }); });
    $$(".js-soon").forEach(function (a) { a.addEventListener("click", function (e) { e.preventDefault(); if (a.dataset.soon) toast(esc(a.dataset.soon)); }); });
  }

  /* ---------- Lenis + GSAP ---------- */
  function smooth() {
    if (REDUCED || typeof Lenis === "undefined") return;
    lenis = new Lenis({ duration: 1.1, smoothWheel: true }); window.RM_LENIS = lenis;
    if (window.gsap && window.ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0);
    } else { (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(); }
    $$('a[href^="#"]').forEach(function (a) { a.addEventListener("click", function (e) { var id = a.getAttribute("href"); if (id.length > 1 && $(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -90 }); } }); });
  }

  function intro(after) {
    var pre = $(".preloader");
    var seen = store.sget("rommer-intro");
    if (!pre || REDUCED || !window.gsap || seen) { if (pre) pre.classList.add("is-skip"); after(); return; }
    store.sset("rommer-intro", "1");
    var L = $$(".wordmark .L", pre);
    var tl = gsap.timeline({ onComplete: function () { pre.classList.add("is-skip"); } });
    tl.from(L, { yPercent: 120, scaleY: .3, opacity: 0, stagger: .07, duration: .7, ease: "back.out(2.2)" })
      .to($(".preloader__bar i", pre), { scaleX: 1, duration: .6, ease: "power2.inOut" }, "-=.4")
      .to(L, { scaleY: 1.25, yPercent: -6, stagger: .03, duration: .18, ease: "power2.out" })
      .to(L, { scaleY: .1, yPercent: 40, opacity: 0, stagger: .03, duration: .3, ease: "power3.in" })
      .to(pre, { clipPath: "inset(0 0 100% 0 round 0 0 40px 40px)", duration: .7, ease: "power4.inOut" }, "-=.15")
      .add(after, "-=.45");
  }

  function animations(page) {
    if (REDUCED || !window.gsap || !window.ScrollTrigger) { document.documentElement.classList.add("no-motion"); return; }
    gsap.registerPlugin(ScrollTrigger);
    var mm = gsap.matchMedia();

    // Reveal genérico
    ScrollTrigger.batch(".reveal", { start: "top 92%", once: true, onEnter: function (els) { gsap.fromTo(els, { opacity: .35, y: 40 }, { opacity: 1, y: 0, duration: .9, stagger: .08, ease: "power3.out" }); } });

    // Stickers con parallax de mouse
    var par = $$("[data-depth]");
    if (par.length && matchMedia("(hover: hover)").matches) {
      window.addEventListener("mousemove", function (e) {
        var x = e.clientX / innerWidth - .5, y = e.clientY / innerHeight - .5;
        par.forEach(function (el) { var d = +el.dataset.depth; gsap.to(el, { x: x * d * 60, y: y * d * 60, duration: 1.2, ease: "power3.out" }); });
      }, { passive: true });
    }
    // Stickers que aparecen al entrar
    $$(".pop").forEach(function (el) { gsap.from(el, { scale: 0, rotate: -40, duration: .9, ease: "back.out(2.4)", scrollTrigger: { trigger: el, start: "top 90%" } }); });

    if (page === "home") homeAnimations(mm);
    if (page === "product") productAnimations();

    // Wordmark del footer
    var fw = $$(".footer__word .L");
    if (fw.length) gsap.from(fw, { yPercent: 110, scaleY: .4, stagger: .06, ease: "back.out(1.6)", duration: 1, scrollTrigger: { trigger: ".footer__word", start: "top 95%", end: "bottom bottom", toggleActions: "play none none reverse" } });
  }

  function heroIntro() {
    if (REDUCED || !window.gsap) return;
    var tl = gsap.timeline();
    tl.from(".hero__title .line > span", { yPercent: 115, rotate: 4, duration: 1, stagger: .09, ease: "power4.out" })
      .from(".hero__copy .lead, .hero__ctas, .hero__copy .eyebrow", { y: 24, opacity: 0, stagger: .08, duration: .7, ease: "power3.out" }, "-=.6")
      .from(".hero__word .L", { yPercent: 105, scaleY: .25, stagger: .07, duration: 1.1, ease: "elastic.out(1, .55)" }, "-=.8")
      .from(".hero .sticker", { scale: 0, rotate: -60, stagger: .08, duration: .8, ease: "back.out(2.5)" }, "-=.9")
      .to(".hero__scribble path", { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut" }, "-=.6");
    return tl;
  }

  function homeAnimations(mm) {
    // Wordmark del hero se "derrite" con el scroll
    var hl = $$(".hero__word .L");
    var melt = [0, 14, -8, 18, -6, 10];
    gsap.to(hl, { yPercent: function (i) { return melt[i]; }, scaleY: function (i) { return i % 2 ? 1.22 : .9; }, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .6 } });
    gsap.to(".hero__media img, .hero__media video", { yPercent: 10, scale: 1.08, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });

    // Banners 50/50 parallax
    $$(".duo__card img").forEach(function (img) { gsap.fromTo(img, { yPercent: -10 }, { yPercent: 0, ease: "none", scrollTrigger: { trigger: img.parentElement, scrub: true } }); });

    // Método: pin en desktop
    var steps = $$(".step"), imgs = $$(".method__img");
    function setStep(i) { steps.forEach(function (s, k) { s.classList.toggle("is-active", k === i); }); imgs.forEach(function (m, k) { m.classList.toggle("is-active", k === i); }); }
    setStep(0);
    mm.add("(min-width: 901px)", function () {
      ScrollTrigger.create({ trigger: ".method", start: "top top+=10", end: "+=180%", pin: true, scrub: true, onUpdate: function (st) { setStep(Math.min(2, Math.floor(st.progress * 3))); } });
    });
    mm.add("(max-width: 900px)", function () {
      steps.forEach(function (s, i) { ScrollTrigger.create({ trigger: s, start: "top 70%", end: "bottom 40%", onToggle: function (st) { if (st.isActive) setStep(i); } }); });
    });

    // Producto estrella: el envase rota con el scroll (secuencia de 4 vistas)
    var frames = $$(".star-prod__bottle img");
    if (frames.length) {
      ScrollTrigger.create({ trigger: ".star-prod", start: "top 70%", end: "bottom 30%", scrub: true, onUpdate: function (st) { var i = Math.min(frames.length - 1, Math.floor(st.progress * frames.length)); frames.forEach(function (f, k) { f.classList.toggle("is-active", k === i); }); } });
      gsap.fromTo(".star-prod__bottle", { rotate: -6, y: 40 }, { rotate: 6, y: -40, ease: "none", scrollTrigger: { trigger: ".star-prod", scrub: true } });
    }

    // Video full-bleed
    gsap.fromTo(".film__media", { scale: 1.06 }, { scale: 1, ease: "none", scrollTrigger: { trigger: ".film", start: "top bottom", end: "bottom top", scrub: true } });
    gsap.from(".film .w", { yPercent: 100, opacity: 0, rotate: 6, stagger: .06, duration: .8, ease: "back.out(1.8)", scrollTrigger: { trigger: ".film", start: "top 60%" } });

    gsap.from(".need", { y: 80, rotate: function (i) { return i % 2 ? 6 : -6; }, opacity: 0, stagger: .08, duration: .9, ease: "back.out(1.4)", scrollTrigger: { trigger: ".needs", start: "top 85%" } });

    // Kit: abanico de envases
    var fan = $$(".kit__fan img");
    if (fan.length) {
      var ang = [-24, -8, 8, 24], xs = [-90, -35, 35, 90];
      gsap.set(fan, { xPercent: -50 });
      gsap.fromTo(fan, { rotate: 0, x: 0 }, { rotate: function (i) { return ang[i]; }, x: function (i) { return xs[i] + "%"; }, duration: 1.2, stagger: .05, ease: "elastic.out(1,.6)", scrollTrigger: { trigger: ".kit", start: "top 70%" } });
      gsap.from(".kit__word", { scale: .6, rotate: -14, opacity: 0, duration: 1, ease: "back.out(1.8)", scrollTrigger: { trigger: ".kit", start: "top 75%" } });
    }

    // Manifiesto: las palabras vuelan a su lugar
    var words = $$(".cloud span");
    words.forEach(function (w, i) {
      gsap.fromTo(w, { x: (i % 2 ? 1 : -1) * (120 + i * 40), y: 80 + i * 20, rotate: (i % 2 ? 1 : -1) * 25, opacity: 0 }, { x: 0, y: 0, rotate: 0, opacity: 1, ease: "power2.out", scrollTrigger: { trigger: ".manifesto", start: "top 80%", end: "center 55%", scrub: .8 } });
    });

    // Destacado: tarjeta flotante
    gsap.from(".spot__card", { y: 60, opacity: 0, rotate: -3, duration: 1, ease: "back.out(1.6)", scrollTrigger: { trigger: ".spot", start: "top 70%" } });
  }

  function productAnimations() {
    gsap.from(".info > *", { y: 30, opacity: 0, stagger: .05, duration: .8, ease: "power3.out", delay: .1 });
    gsap.from(".gallery__main", { scale: .94, opacity: 0, duration: 1, ease: "power3.out" });
  }

  /* =========================================================
     PÁGINAS
     ========================================================= */
  function initHome() {
    $$("[data-products]").forEach(renderProducts);
    $$(".js-carousel").forEach(function (el) { carousel(el); });
    beforeAfter(); tabs();
    // Destacado flotante: kit
    var k = byId(RM.spot || "kit-hot-girl"), sc = $(".spot__card");
    if (k && sc) sc.innerHTML = '<div class="spot__thumb"><img src="' + src(k.thumb || (k.packs && k.gallery && k.gallery[0]) || k.img) + '" alt=""></div><div>' + (tx("spotChip", "Kit · ahorrás {monto}") ? '<span class="chip chip--pink">' + esc(tx("spotChip", "Kit · ahorrás {monto}").replace("{monto}", money((k.compare || k.sizes[0].p) - k.sizes[0].p))) + "</span>" : "") + '<h3 style="margin-top:8px">' + k.name + "</h3><p>" + esc(tx("spotDesc", "") || k.claim || "") + "</p></div>" +
      '<button class="add-btn" type="button" data-add="' + k.id + '"><span>' + esc(tx("spotBtn", "Agregar kit")) + "</span><span>" + (k.compare ? "<s>" + money(k.compare) + "</s>" : "") + money(k.sizes[0].p) + "</span></button>";
  }

  function initProduct() {
    if (!$(".pdp")) return;
    var id = RM.current || decodeURIComponent((location.hash || "").slice(1)) || new URLSearchParams(location.search).get("id") || "shampoo-keratin";
    window.addEventListener("hashchange", function () { if (byId(location.hash.slice(1))) { location.reload(); } });
    var p = byId(id) || PRODUCTS[0];
    document.title = p.name + " — Rommer";
    var root = $(".pdp");
    $$(".js-p-name").forEach(function (e) { e.textContent = p.name; });
    $(".js-p-line").textContent = p.line; $(".js-p-cat").textContent = p.cat;
    $(".js-p-crumb-cat").textContent = p.cat;
    $(".js-p-claim").textContent = p.claim;
    var pr = $(".js-p-rating"), ps = $(".info__rating .stars");
    if (p.reviews) { pr.textContent = p.rating.toFixed(1).replace(".", ",") + " · " + tx(p.reviews === 1 ? "rvN1" : "rvN", p.reviews === 1 ? "{n} reseña" : "{n} reseñas").replace("{n}", p.reviews); if (ps) ps.textContent = stars(p.rating); }
    else if (RM.rvFirst) { pr.textContent = RM.rvFirst; if (ps) ps.classList.add("is-empty"); }
    else $(".info__rating").style.display = "none";
    var ro = $(".js-rev-open"), rf = $(".rev-form");
    if (ro && rf) ro.addEventListener("click", function () { rf.hidden = !rf.hidden; ro.hidden = !rf.hidden; if (!rf.hidden) { var t = $("textarea", rf); if (t) t.focus({ preventScroll: true }); } if (window.ScrollTrigger) ScrollTrigger.refresh(); });
    /* Lo que el producto no tiene cargado, no se muestra. */
    $(".js-p-desc").textContent = p.desc ? p.desc.split(".").slice(0, 2).join(".") + "." : "";
    $(".js-p-longdesc").textContent = p.desc || "";
    $(".js-p-uso").textContent = p.uso || "";
    $(".js-p-ingr").textContent = p.ingr || "";
    [["desc", p.desc], ["uso", p.uso], ["ingr", p.ingr]].forEach(function (a) { var el = $(".js-acc-" + a[0]); if (el && !a[1]) el.style.display = "none"; });
    var chipC = ["pink", "yellow", "sky"];
    $(".benefit-chips").innerHTML = p.actives.map(function (a, i) { return '<span style="--c:' + COLOR[chipC[i]] + '"><i class="r-dot"></i>' + a + "</span>"; }).join("");
    if (p.badge) { var bc = $(".js-p-badge"); bc.textContent = p.badge; bc.hidden = false; }

    // Galería
    var slides = p.packs ? p.packs.map(function (f) { return { src: src(f), bottle: true }; }) : p.id === "shampoo-keratin" ? [0, 1, 2, 3].map(function (i) { return { src: IMG + "bottle-" + i + ".webp", bottle: true }; }) : [{ src: src(p.img), bottle: true }];
    if (p.isKit && !p.packs) slides = ["p-keratin.webp", "p-coconut.webp", "p-thermo.webp"].map(function (f) { return { src: IMG + f, bottle: true }; });
    (p.gallery || []).forEach(function (f) { slides.push({ src: src(f) }); });
    if (p.video) slides.splice(Math.min(1, slides.length), 0, { src: src(p.img), video: p.video });
    $(".gallery__main .swiper-wrapper").innerHTML = slides.map(function (s, i) {
      if (s.video) return '<div class="swiper-slide swiper-slide--video"><video class="gallery__video" src="' + esc(s.video) + '" poster="' + s.src + '" muted loop playsinline preload="metadata"></video></div>';
      return '<div class="swiper-slide"><img class="' + (s.bottle ? "bottle" : "") + '" src="' + s.src + '" alt="' + p.name + " — imagen " + (i + 1) + '"' + (i ? ' loading="lazy"' : "") + "></div>"; }).join("");
    $(".gallery__thumbs").innerHTML = slides.map(function (s, i) { return '<button type="button" aria-label="' + (s.video ? "Ver video" : "Ver imagen " + (i + 1)) + '" aria-current="' + (i === 0) + '"' + (s.video ? ' class="thumb--video"' : "") + '><img class="' + (s.bottle ? "bottle" : "") + '" src="' + s.src + '" alt="" loading="lazy">' + (s.video ? '<span class="thumb__play">▶</span>' : "") + "</button>"; }).join("");
    // Las fotos de envase recortadas (fondo transparente) se muestran enteras
    $$(".gallery__main .swiper-slide img:not(.bottle), .gallery__thumbs img:not(.bottle)").forEach(function (im) {
      var check = function () {
        try {
          var c = document.createElement("canvas"); c.width = c.height = 8; var x = c.getContext("2d"); x.drawImage(im, 0, 0, 8, 8);
          if (x.getImageData(0, 0, 1, 1).data[3] < 20) im.classList.add("bottle");
        } catch (e) {}
      };
      if (im.complete) check(); else im.addEventListener("load", check);
    });
    var gsw = typeof Swiper !== "undefined" ? new Swiper(".gallery__main .swiper", { pagination: { el: ".gallery__main .swiper-pagination", clickable: true }, speed: 600, grabCursor: true }) : null;
    var thumbs = $$(".gallery__thumbs button");
    thumbs.forEach(function (b, i) { b.addEventListener("click", function () { if (gsw) gsw.slideTo(i); }); });
    if (gsw) gsw.on("slideChange", function () { thumbs.forEach(function (b, i) { b.setAttribute("aria-current", i === gsw.activeIndex); }); });
    /* El video de la galería se reproduce cuando está a la vista */
    function galleryVideo() { $$(".gallery__video").forEach(function (v) { var on = gsw ? v.closest(".swiper-slide") === gsw.slides[gsw.activeIndex] : true; if (on && !REDUCED) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } else v.pause(); }); }
    if (gsw) gsw.on("slideChange", galleryVideo);
    galleryVideo();
    // Zoom
    if (matchMedia("(hover: hover)").matches) {
      $$(".gallery__main .swiper-slide").forEach(function (sl) {
        var img = $("img", sl); if (!img) return;
        sl.addEventListener("mousemove", function (e) { var r = sl.getBoundingClientRect(); img.style.transformOrigin = ((e.clientX - r.left) / r.width * 100) + "% " + ((e.clientY - r.top) / r.height * 100) + "%"; img.style.transform = "scale(1.9)"; });
        sl.addEventListener("mouseleave", function () { img.style.transform = ""; });
      });
    }

    // Tamaños, precio, cantidad
    var state = { size: firstOk(p), qty: 1 };
    $(".sizes").innerHTML = p.sizes.map(function (s, i) { return '<button type="button" class="size" aria-pressed="' + (i === 0) + '" data-i="' + i + '"><b>' + s.l + "</b><small>" + s.sub + " · " + money(s.p) + "</small></button>"; }).join("");
    function upd() {
      var s = p.sizes[state.size], total = s.p * state.qty;
      $(".price__now").textContent = money(s.p);
      var was = $(".price__was"), off = $(".price__off");
      if (p.compare && state.size === 0) { was.hidden = off.hidden = false; was.textContent = money(p.compare); off.textContent = "-" + Math.round((1 - s.p / p.compare) * 100) + "%"; } else { was.hidden = off.hidden = true; }
      $(".price__cuotas").innerHTML = [cuotasHTML(s.p), esc(transferTxt())].filter(Boolean).join(" · ");
      $(".js-buy-total").textContent = money(total);
      $(".js-sticky-price").textContent = s.l + " · " + money(s.p);
      paintCoupon();
      $(".qty output", $(".buy")).textContent = state.qty;
    }
    /* Cupón en la ficha: precio con descuento y “Usar mi cupón”, o invitación a pedirlo */
    function paintCoupon() {
      var box = $(".js-cp-pdp"); if (!box) return;
      var s = p.sizes[state.size], html = "";
      if (CP && CP.code && (CP.type === "percent" || CP.type === "fixed")) {
        var tmp = CP.on; CP.on = true; var dsc = cpDiscount(s.p * state.qty); CP.on = tmp;
        var pct = CP.type === "percent" ? CP.amount : 0;
        html = '<span class="cp-pdp__t">🎁 ' + esc(tx("cpHave", "Tenés {cupon}% OFF de bienvenida").replace("{cupon}", pct || "")) + "</span>";
        if (dsc) html += '<span class="cp-pdp__p">' + esc(tx("cpPrice", "Con tu cupón: {precio}").replace("{precio}", money(s.p * state.qty - dsc))) + "</span>";
        html += CP.on ? '<span class="cp-pdp__on">' + esc(tx("cpUsing", "✓ Cupón aplicado")) + '</span><button type="button" class="cp-x js-cp-pdp-off">' + esc(tx("cpLater", "Usarlo en otra compra")) + "</button>"
          : '<button type="button" class="btn btn--ink btn--sm js-cp-pdp-on">' + esc(tx("cpUse", "Usar mi cupón")) + "</button>";
      } else if (window.RommerPopup && tx("cpInvite", "") && !(store.get("rommer-pop", {}) || {}).done) {
        html = '<span class="cp-pdp__t">🎁 ' + esc(tx("cpInvite", "").replace("{cupon}", POP.p || "")) + '</span><button type="button" class="cp-x js-cp-pdp-pop">' + esc(tx("cpInviteBtn", "Quiero mi cupón")) + "</button>";
      }
      box.innerHTML = html; box.hidden = !html;
    }
    window.RommerPaintCoupon = paintCoupon;
    document.addEventListener("click", function (e) {
      if (e.target.closest(".js-cp-pdp-on") && CP) { CP.on = true; cpSave(CP); }
      if (e.target.closest(".js-cp-pdp-off") && CP) { CP.on = false; cpSave(CP); }
      if (e.target.closest(".js-cp-pdp-pop") && window.RommerPopup) window.RommerPopup.open();
    });
    $(".sizes").addEventListener("click", function (e) { var b = e.target.closest(".size"); if (!b || b.disabled) return; state.size = +b.dataset.i; paint(); });
    $(".buy").addEventListener("click", function (e) {
      var q = e.target.closest("[data-pq]"); if (!q) return;
      var n = Math.max(1, state.qty + +q.dataset.pq), mx = maxOf(p, state.size);
      if (n > mx) { if (ST.max) toast(esc(ST.max)); n = Math.max(1, mx); }
      state.qty = n; upd();
    });
    $$(".js-buy").forEach(function (b) { b.addEventListener("click", function () { addToCart(p.id, state.size, state.qty); }); });
    /* Stock en la ficha: tamaños agotados, botón bloqueado, “avisame” y últimas unidades. */
    function paint() {
      var outAll = !anyOk(p);
      if (!outAll && !sizeOk(p, state.size)) state.size = firstOk(p);
      $$(".size").forEach(function (b) { var i = +b.dataset.i, ok = sizeOk(p, i); b.disabled = !ok; b.classList.toggle("is-out", !ok && !outAll); b.setAttribute("aria-pressed", i === state.size); });
      var ok = sizeOk(p, state.size), mx = maxOf(p, state.size);
      if (state.qty > mx) state.qty = Math.max(1, mx);
      $$(".js-buy").forEach(function (b) { paintBtn(b, ok); });
      var note = $(".stock-note");
      if (!note) { note = document.createElement("div"); note.className = "stock-note"; $(".buy").insertAdjacentElement("afterend", note); }
      var html = "";
      if (!ok) {
        if (ST.label) html = '<span class="stock-note__out">' + esc(ST.label) + "</span>";
        if (ST.wa && RM.whatsapp) html += '<a class="btn btn--line btn--sm" target="_blank" rel="noopener" href="https://wa.me/' + RM.whatsapp + "?text=" + encodeURIComponent((ST.waMsg || "").replace("{producto}", p.name + (p.sizes.length > 1 ? " " + p.sizes[state.size].l : ""))) + '">' + esc(ST.wa) + "</a>";
      } else if (mx !== Infinity && ST.lowN && mx <= ST.lowN && ST.low) html = '<span class="stock-note__low">' + esc(ST.low.replace("{n}", mx)) + "</span>";
      note.innerHTML = html; note.hidden = !html;
      upd();
    }
    pdpPaint = paint;
    paint();

    // Envío
    var cf = $(".ship-calc");
    var SH = RM.shipTxt || { err: "Ingresá un código postal válido (ej. 1414).", state: "Elegí tu provincia", none: "", free: "Gratis", freeFrom: "" };
    var shipMem = store.get("rommer-cp", {}) || {};
    if (shipMem.cp) $("input", cf).value = shipMem.cp;
    cf.addEventListener("submit", function (e) {
      e.preventDefault(); var cp = $("input", cf).value.trim().toUpperCase().replace(/\s/g, ""), out = $(".ship-calc__res");
      if (!/^\d{4}$|^[A-Z]\d{4}[A-Z]{3}$/.test(cp)) { out.textContent = SH.err; return; }
      if (RM.ajax) {
        var sel = $("select", out), st = sel ? sel.value : (shipMem.st || "");
        var f = new FormData(); f.append("action", "rommer_ship"); f.append("cp", cp); f.append("state", st);
        f.append("id", (p.sizes[state.size] || {}).vid || p.wcId || ""); f.append("qty", state.qty); f.append("extra", cartSubtotal());
        out.innerHTML = '<span class="ship-load">…</span>';
        fetch(RM.ajax, { method: "POST", body: f, credentials: "same-origin" }).then(function (r) { return r.json(); }).then(function (r) {
          if (r.error) { out.textContent = r.error; return; }
          var html = "";
          if (r.states) {
            html += '<label class="ship-state"><span>' + esc(SH.state) + '</span><select><option value=""></option>' + Object.keys(r.states).map(function (k) { return '<option value="' + esc(k) + '"' + (k === r.state ? " selected" : "") + ">" + esc(r.states[k]) + "</option>"; }).join("") + "</select></label>";
          }
          if (!r.needState) {
            shipMem = { cp: cp, st: r.state || "" }; store.set("rommer-cp", shipMem);
            html += r.rates.length ? r.rates.map(function (x) { return '<div class="ship-rate"><span>' + esc(x.label) + "</span><b>" + (x.cost > 0 ? money(x.cost) : esc(SH.free)) + "</b></div>"; }).join("") : (SH.none ? "<p>" + esc(SH.none) + "</p>" : "");
            if (r.freeFrom && SH.freeFrom) html += '<small class="ship-free">' + esc(SH.freeFrom.replace("{monto}", money(r.freeFrom))) + "</small>";
          }
          out.innerHTML = html;
          var ns = $("select", out); if (ns) ns.addEventListener("change", function () { if (ns.value) { shipMem.st = ns.value; cf.dispatchEvent(new Event("submit", { cancelable: true })); } });
        }).catch(function () { out.textContent = SH.none; });
        return;
      }
      var caba = /^1[0-4]\d\d$/.test(cp) || /^c/i.test(cp);
      out.innerHTML = "🚚 Envío a domicilio: <b>" + (caba ? money(3900) : money(6900)) + "</b> · llega en " + (caba ? "24–48 h" : "3–5 días hábiles") + "<br>📍 Retiro en local: <b>gratis</b> · Gratis desde " + money(FREE_SHIP) + " <small>(valores de ejemplo)</small>";
    });

    // Rutina completa: Limpiá (shampoo) → Tratá (nutrición) → Protegé (Thermo Shield)
    var R = RM.routine || ["shampoo-keratin", "shampoo-coconut", "thermo-shield"];
    var sh = p.cat === "Shampoo" ? p : (byId(R[0]) || p);
    var pick = [sh, byId(sh.id === R[1] ? R[0] : R[1]), byId(R[2])].filter(anyOk);
    $(".routine").style.display = pick.length < 2 ? "none" : "";
    var stepName = tx("steps", ["Limpiá", "Tratá", "Protegé"]), stepC = ["yellow", "pink", "orange"];
    var full = pick.reduce(function (a, x) { return a + x.sizes[firstOk(x)].p; }, 0), off = Math.round(full * (1 - KIT.p1));
    $(".routine__grid").innerHTML = pick.map(function (x, i) {
      return '<div class="rstep"><span class="rstep__n" style="--c:' + COLOR[stepC[i]] + '">' + (i + 1) + '</span><a class="rstep__img" href="' + purl(x) + '"><img src="' + src(x.img) + '" alt="' + x.name + '" loading="lazy"></a><div><small>' + esc(tx("step", "Paso {n} · {paso}").replace("{n}", i + 1).replace("{paso}", stepName[i] || "")) + "</small><h4>" + x.name + "</h4><small>" + money(x.sizes[firstOk(x)].p) + "</small></div></div>";
    }).join("") + '<div class="routine__sum"><p class="mix">' + tx("routineSum", "Llevá la <em>rutina</em> completa") + '</p><div><s>' + money(full) + '</s> <span class="big">' + money(off) + '</span></div><small>' + esc(tx("routineOff", Math.round(KIT.p1 * 100) + "% OFF aplicado por armar tu kit")) + '</small><button class="btn btn--ink js-routine" type="button">' + esc(tx("routineBtn", "Agregar rutina al changuito")) + "</button></div>";
    $(".js-routine").addEventListener("click", function () { pick.forEach(function (x, i) { addToCart(x.id, firstOk(x), 1, { silent: i < pick.length - 1 }); }); });

    // Relacionados
    var rel = $("[data-related]");
    if (rel) { rel.dataset.products = PRODUCTS.filter(function (x) { return x.id !== p.id; }).map(function (x) { return x.id; }).join(","); renderProducts(rel); carousel(rel); }

    // Barra de compra fija en mobile
    var sb = $(".sticky-buy"), main = $(".buy .add-btn");
    if (sb && main && "IntersectionObserver" in window) new IntersectionObserver(function (en) { sb.classList.toggle("is-on", !en[0].isIntersecting && en[0].boundingClientRect.top < 0); }).observe(main);
  }

  /* =========================================================
     INIT
     ========================================================= */
  document.addEventListener("DOMContentLoaded", function () {
    var page = document.body.dataset.page;
    $$(".js-wordmark").forEach(function (e) { e.outerHTML = wordmark(); });
    hydrateStickers(document);
    headerUI(); cartUI(); forms(); cursor();
    if (page === "home") initHome();
    if (page === "product") initProduct();
    paintAll();
    freshStock();
    videos();
    popup();
    hydrateStickers(document);
    smooth();
    animations(page);
    if (page === "home" && !REDUCED && window.gsap) {
      gsap.set(".hero__card", { autoAlpha: 1 });
      var tlHero = heroIntro(); if (tlHero) tlHero.pause();
      intro(function () { if (tlHero) tlHero.play(); });
    } else intro(function () {});
    window.addEventListener("load", function () { if (window.ScrollTrigger) ScrollTrigger.refresh(); });
  });

  /* Videos en lugar de fotos: se reproducen cuando se ven y se pausan al salir de la pantalla.
     Con “movimiento reducido” o ahorro de datos queda la foto. */
  function videos() {
    var vids = $$("video.rm-video"); if (!vids.length) return;
    var save = navigator.connection && navigator.connection.saveData;
    if (REDUCED || save) return;
    var play = function (v) { v.muted = true; if (v.preload !== "auto") { v.preload = "auto"; v.load(); } var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); };
    if (!("IntersectionObserver" in window)) { vids.forEach(play); return; }
    var io = new IntersectionObserver(function (en) { en.forEach(function (e) { if (e.isIntersecting) play(e.target); else e.target.pause(); }); }, { rootMargin: "150px" });
    vids.forEach(function (v) { io.observe(v); });
  }

  /* ---------- Popup de bienvenida y newsletter ---------- */
  var POP = RM.popup || { on: false };
  var popKey = "rommer-pop";
  function popState() { return store.get(popKey, {}) || {}; }
  function subscribe(form, done) {
    var email = $("input[type=email]", form), err = $(".js-sub-err", form), btn = $("button[type=submit]", form);
    var v = (email.value || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { if (err) { err.textContent = tx("popErr", "Revisá el email, parece que tiene un error."); err.hidden = false; } else toast(esc(tx("popErr", "Revisá el email."))); email.focus(); return; }
    if (err) err.hidden = true;
    btn.disabled = true;
    var finish = function (r) {
      btn.disabled = false;
      if (!r || !r.ok) { var m = (r && r.msg) || tx("popErr", "No se pudo suscribir. Probá de nuevo."); if (err) { err.textContent = m; err.hidden = false; } else toast(esc(m)); return; }
      store.set(popKey, { done: 1, code: r.code });
      cpSave({ code: r.code, type: r.type || "percent", amount: r.amount || POP.p || 10, min: r.min || 0, on: true });
      done(r);
    };
    if (!RM.ajax) { setTimeout(function () { finish({ ok: true, code: POP.demo || "HOLAROMMER10", type: "percent", amount: POP.p || 10, min: 0 }); }, 400); return; } // vista de demostración
    var f = new FormData(form); f.append("action", "rommer_subscribe"); f.append("src", form.dataset.src || "popup");
    fetch(RM.ajax, { method: "POST", body: f, credentials: "same-origin" }).then(function (r) { return r.json(); }).then(finish).catch(function () { finish(null); });
  }
  function popup() {
    var pop = $("#rm-pop");
    $$("form.js-sub").forEach(function (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        subscribe(form, function (r) {
          if (form.dataset.src === "popup" && pop) showCode(r);
          else { toast(esc((POP.newsOk || "¡Listo! Tu código es {codigo}").replace("{codigo}", r.code))); form.reset(); }
        });
      });
    });
    if (!pop) return;
    var opened = false, shown = false, timer = null;
    /* auto: lo abrió la web sola (tiempo o mouse hacia arriba). Se abre una sola vez por visita. */
    function open(auto) {
      if (opened || (auto === true && (shown || store.sget("rommer-pop-visto")))) return;
      opened = true; shown = true; clearTimeout(timer);
      pop.hidden = false; void pop.offsetWidth; pop.classList.add("is-open");
      if (lenis) lenis.stop();
      setTimeout(function () { var i = $("input[type=email]", pop); if (i && matchMedia("(hover: hover)").matches) i.focus({ preventScroll: true }); }, 350);
    }
    function close() {
      if (!opened) return; opened = false;
      pop.classList.remove("is-open"); setTimeout(function () { pop.hidden = true; }, 300);
      if (lenis) lenis.start();
      store.sset("rommer-pop-visto", "1"); // en esta visita no vuelve a aparecer
      showTab(true);
      var st = popState(); if (!st.done && POP.days > 0) store.set(popKey, { closed: Date.now() });
    }
    /* Pestaña chica que queda al cerrarlo, para volver a abrirlo */
    var tab = null;
    if (POP.tab) {
      tab = document.createElement("button"); tab.type = "button"; tab.className = "pop-tab"; tab.hidden = true;
      tab.textContent = POP.tab.replace("{cupon}", POP.p || ""); document.body.appendChild(tab);
      tab.addEventListener("click", function () { open(); });
    }
    function showTab(on) { if (tab) tab.hidden = !on || !!popState().done; }
    function showCode(r) {
      showTab(false);
      $(".js-pop-form", pop).hidden = true; $(".js-pop-ok", pop).hidden = false;
      $(".js-pop-code", pop).textContent = r.code;
      var t = $(".js-pop-ok-text", pop); if (r.dup && t.dataset.dup) t.textContent = t.dataset.dup;
    }
    window.RommerPopup = { open: open, close: close };
    if (window.RommerPaintCoupon) window.RommerPaintCoupon();
    $$(".js-pop-close", pop).forEach(function (b) { b.addEventListener("click", function () { close(); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    $(".js-pop-copy", pop).addEventListener("click", function () {
      var b = this, code = $(".js-pop-code", pop).textContent, ok = function () { var o = b.textContent; b.textContent = b.dataset.done || "¡Copiado!"; setTimeout(function () { b.textContent = o; }, 1600); };
      if (navigator.clipboard) navigator.clipboard.writeText(code).then(ok, ok); else ok();
    });
    var forced = /[?&]bienvenida\b/.test(location.search);
    var st = popState();
    if (forced) { if (st.done) showCode({ code: st.code }); setTimeout(open, 600); return; }
    if (!POP.on || st.done) return;
    if (store.sget("rommer-pop-visto")) { showTab(true); return; }
    if (POP.days > 0 && st.closed && Date.now() - st.closed < POP.days * 864e5) return;
    var touch = !matchMedia("(hover: hover)").matches;
    if (touch && POP.scroll > 0) {
      /* En el celular: aparece al bajar un % de la página (o, si la página es corta, por tiempo) */
      var onScroll = function () {
        var h = document.documentElement.scrollHeight - innerHeight;
        if (h > 200 && scrollY / h * 100 >= POP.scroll) { removeEventListener("scroll", onScroll); open(true); }
      };
      addEventListener("scroll", onScroll, { passive: true });
      if (document.documentElement.scrollHeight - innerHeight <= 200) timer = setTimeout(function () { open(true); }, Math.max(1, POP.delay || 6) * 1000);
    } else timer = setTimeout(function () { open(true); }, Math.max(1, POP.delay || 6) * 1000);
    if (matchMedia("(hover: hover)").matches) document.addEventListener("mouseout", function (e) { if (!e.relatedTarget && e.clientY < 8) open(true); });
  }

  /* Disponibilidad al momento: aunque la página esté en caché, el stock se consulta de nuevo. */
  function freshStock() {
    if (!RM.ajax || !RM.products || !window.fetch) return;
    fetch(RM.ajax + "?action=rommer_stock", { credentials: "same-origin" }).then(function (r) { return r.json(); }).then(function (m) {
      PRODUCTS.forEach(function (p) {
        var x = m[p.id]; if (!x) return;
        p.stock = x.ok;
        (x.sizes || []).forEach(function (s, i) { if (p.sizes[i]) { p.sizes[i].ok = s.ok; p.sizes[i].max = s.max; } });
      });
      paintAll(); renderCart();
    }).catch(function () {});
  }

  window.Rommer = { PRODUCTS: PRODUCTS, addToCart: addToCart, openDrawer: openDrawer };
})();
