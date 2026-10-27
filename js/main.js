// nonce community — hero hex dump, nonce ticker, mobile menu
(function () {
  // ---- hex dump: block 0x07E2 with the genesis message in the ASCII column ----
  var hex = document.getElementById('hex');
  if (hex) {
    var s = 2018;
    var rnd = function () { s = (s * 1103515245 + 12345) & 0x7fffffff; return (s >> 16) & 255; };
    var b = [1, 0, 0, 0], i;
    for (i = 0; i < 32; i++) b.push(0);
    for (i = 0; i < 32; i++) b.push(rnd());
    b.push(0x29, 0xab, 0x5f, 0x49, 0xff, 0xff, 0x00, 0x1d, 0x1d, 0xac, 0x2b, 0x7c);
    b.push(0x01, 0x01, 0x00, 0x00, 0x00, 0x01);
    for (i = 0; i < 32; i++) b.push(0);
    b.push(0xff, 0xff, 0xff, 0xff, 0x4d, 0x04, 0xff, 0xff, 0x00, 0x1d, 0x01, 0x04, 0x51);
    var msg = 'nonce 01/Aug/2018 We connect trustworthy people building trustless technologies';
    var start = b.length;
    for (i = 0; i < msg.length; i++) b.push(msg.charCodeAt(i));
    var end = b.length;
    while (b.length < 18 * 16) b.push(rnd());
    var h2 = function (x) { return ('0' + x.toString(16).toUpperCase()).slice(-2); };
    var frag = document.createDocumentFragment();
    for (var r = 0; r < 18; r++) {
      var sl = b.slice(r * 16, r * 16 + 16);
      var row = document.createElement('div');
      var hot = r * 16 + 16 > start && r * 16 < end;
      var off = document.createElement('span'); off.className = 'off';
      off.textContent = ('0000000' + (r * 16).toString(16).toUpperCase()).slice(-8);
      var hx = document.createElement('span'); hx.className = hot ? 'hot' : 'dim';
      hx.textContent = sl.slice(0, 8).map(h2).join(' ') + '  ' + sl.slice(8).map(h2).join(' ');
      var as = document.createElement('span'); as.className = hot ? 'hot' : 'dim';
      as.textContent = sl.map(function (c) { return c >= 32 && c < 127 ? String.fromCharCode(c) : '.'; }).join('');
      row.appendChild(off); row.appendChild(hx); row.appendChild(as);
      frag.appendChild(row);
    }
    hex.appendChild(frag);
  }

  // ---- nonce ticker ----
  var t = document.getElementById('nonce');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (t && !reduce) {
    var n = 0x7C2BAC1D;
    setInterval(function () {
      n = (n + 1 + Math.floor(Math.random() * 4096)) >>> 0;
      t.textContent = '0x' + ('0000000' + n.toString(16).toUpperCase()).slice(-8);
    }, 220);
  }

  // ---- mobile menu ----
  var btn = document.querySelector('.menu-btn, .lt-menu');
  var nav = btn && document.getElementById(btn.getAttribute('aria-controls'));
  if (btn && nav) {
    var set = function (open) { nav.setAttribute('data-open', open ? 'true' : 'false'); btn.setAttribute('aria-expanded', open ? 'true' : 'false'); };
    btn.addEventListener('click', function () { set(nav.getAttribute('data-open') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') set(false); });
  }
})();
