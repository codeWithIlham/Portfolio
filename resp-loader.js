/* ============================================================
   resp-loader.js — Portfolio Ilham Amirat — v9
   + Bouton "?" aide complète
   + Canvas animation code/réseau flottant en arrière-plan
   + Switch Simple ↔ Max corrigé
   ============================================================ */
(function () {
  'use strict';

  /* ══════════════════════════════════════════════════════
     1. BLOQUER LE BOOT
  ══════════════════════════════════════════════════════ */
  window.runBoot = function () { };
  window.endBoot = function () {
    var boot   = document.getElementById('boot');
    var app    = document.getElementById('app');
    var simple = document.getElementById('simple-version');
    if (boot)   { boot.style.cssText = 'display:none!important'; }
    if (app)    { app.style.display = 'none'; app.style.opacity = '0'; }
    if (simple) { simple.style.cssText = 'display:block;position:fixed;inset:0;z-index:40;overflow-y:auto'; }
    window.currentVersion = 'simple';
    window._rlReady = true;
    afterBootReady();
  };

  /* ══════════════════════════════════════════════════════
     2. CSS
  ══════════════════════════════════════════════════════ */
  var blockStyle = document.createElement('style');
  blockStyle.id = 'rl-block';
  blockStyle.textContent =
    '#boot{display:none!important}' +
    '#app{display:none!important;opacity:0!important}';
  (document.head || document.documentElement).appendChild(blockStyle);

  var decoStyle = document.createElement('style');
  decoStyle.id = 'rl-deco';
  decoStyle.textContent = [
    '#simple-version{display:block;position:fixed;inset:0;z-index:40;overflow-y:auto;background:var(--simple-bg,#0a0f1a);font-family:"Syne",sans-serif}',
    '.version-switcher,.sv-maxbtn{display:none!important}',

    /* Canvas background */
    '#rl-canvas{position:fixed;inset:0;z-index:0;pointer-events:none;opacity:1}',
    '#particles .particle{display:none!important}',

    /* Pill */
    '#rl-pill{position:fixed;bottom:28px;right:18px;z-index:99999;display:inline-flex;align-items:center;gap:7px;height:36px;padding:0 16px;border-radius:999px;cursor:pointer;font-family:"JetBrains Mono",monospace;font-size:11px;font-weight:700;border:1.5px solid transparent;background:linear-gradient(var(--bg2,#161b22),var(--bg2,#161b22)) padding-box,linear-gradient(135deg,#58a6ff 0%,#7ee787 50%,#d2a8ff 100%) border-box;color:var(--text,#e6edf3);box-shadow:0 4px 20px rgba(88,166,255,.35);transition:transform .2s,box-shadow .2s;user-select:none}',
    '#rl-pill:hover{transform:translateY(-2px);box-shadow:0 6px 28px rgba(88,166,255,.55)}',
    '#rl-pill:active{transform:translateY(0)}',
    '[data-theme="light"] #rl-pill{background:linear-gradient(#fff,#f6f8fa) padding-box,linear-gradient(135deg,#0969da 0%,#1a7f37 50%,#6639ba 100%) border-box;color:#1f2328;box-shadow:0 4px 16px rgba(9,105,218,.25)}',
    '#rl-pill .rl-dot{width:7px;height:7px;border-radius:50%;background:#58a6ff;box-shadow:0 0 6px #58a6ff;transition:background .3s,box-shadow .3s}',
    '#rl-pill.is-max .rl-dot{background:#7ee787;box-shadow:0 0 6px #7ee787}',

    /* Bouton "?" */
    '#rl-help-btn{position:fixed;bottom:28px;right:130px;z-index:99999;width:36px;height:36px;border-radius:50%;cursor:pointer;font-family:"JetBrains Mono",monospace;font-size:16px;font-weight:900;border:1.5px solid transparent;background:linear-gradient(var(--bg2,#161b22),var(--bg2,#161b22)) padding-box,linear-gradient(135deg,#d2a8ff 0%,#58a6ff 50%,#7ee787 100%) border-box;color:#d2a8ff;box-shadow:0 4px 20px rgba(210,168,255,.3);transition:transform .25s,box-shadow .25s,color .2s;display:flex;align-items:center;justify-content:center;line-height:1}',
    '#rl-help-btn:hover{transform:translateY(-2px) rotate(20deg);box-shadow:0 6px 28px rgba(210,168,255,.6);color:#fff}',
    '[data-theme="light"] #rl-help-btn{background:linear-gradient(#fff,#f6f8fa) padding-box,linear-gradient(135deg,#6639ba 0%,#0969da 50%,#1a7f37 100%) border-box;color:#6639ba;box-shadow:0 4px 16px rgba(102,57,186,.2)}',

    /* Modal aide */
    '#rl-help-modal{display:none;position:fixed;inset:0;z-index:100000;align-items:center;justify-content:center;background:rgba(0,0,0,.75);backdrop-filter:blur(10px)}',
    '#rl-help-modal.open{display:flex}',
    '#rl-help-box{background:var(--bg2,#161b22);border:1px solid rgba(210,168,255,.2);border-radius:16px;width:100%;max-width:700px;max-height:88vh;overflow:hidden;display:flex;flex-direction:column;box-shadow:0 32px 80px rgba(0,0,0,.7),0 0 0 1px rgba(88,166,255,.07);animation:rlModalIn .3s cubic-bezier(.34,1.4,.64,1);margin:16px}',
    '@keyframes rlModalIn{from{opacity:0;transform:translateY(24px) scale(.95)}to{opacity:1;transform:none}}',

    '#rl-help-header{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:linear-gradient(135deg,rgba(88,166,255,.07),rgba(210,168,255,.05));border-bottom:1px solid rgba(255,255,255,.06);flex-shrink:0}',
    '#rl-help-header h2{font-family:"JetBrains Mono",monospace;font-size:13px;font-weight:700;color:var(--text,#e6edf3);margin:0;display:flex;align-items:center;gap:8px}',
    '.rl-h-badge{font-size:9px;padding:2px 8px;border-radius:20px;background:rgba(88,166,255,.14);color:#58a6ff;border:1px solid rgba(88,166,255,.28);letter-spacing:1px;text-transform:uppercase;font-weight:700}',
    '#rl-help-close{width:28px;height:28px;border-radius:8px;border:1px solid rgba(255,255,255,.09);background:transparent;color:var(--dim,#8b949e);font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .18s;line-height:1}',
    '#rl-help-close:hover{background:rgba(255,255,255,.07);color:#e6edf3;border-color:rgba(255,255,255,.18)}',

    '#rl-help-body{overflow-y:auto;padding:18px 18px 8px;flex:1;scrollbar-width:thin;scrollbar-color:rgba(88,166,255,.3) transparent}',
    '#rl-help-body::-webkit-scrollbar{width:4px}',
    '#rl-help-body::-webkit-scrollbar-thumb{background:rgba(88,166,255,.3);border-radius:2px}',

    '.rl-cat{margin-bottom:22px}',
    '.rl-cat-title{font-family:"JetBrains Mono",monospace;font-size:9px;font-weight:800;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:9px;display:flex;align-items:center;gap:8px}',
    '.rl-cat-title::after{content:"";flex:1;height:1px;background:rgba(255,255,255,.05)}',
    '.rl-cat.nav .rl-cat-title{color:#58a6ff}',
    '.rl-cat.info .rl-cat-title{color:#7ee787}',
    '.rl-cat.action .rl-cat-title{color:#ffa657}',
    '.rl-cat.fun .rl-cat-title{color:#d2a8ff}',
    '.rl-cat.system .rl-cat-title{color:#ff7b72}',

    '.rl-cmds{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:5px}',
    '.rl-cmd{display:flex;align-items:flex-start;gap:10px;padding:9px 12px;border-radius:9px;background:rgba(255,255,255,.022);border:1px solid rgba(255,255,255,.045);transition:all .18s;cursor:default}',
    '.rl-cmd:hover{background:rgba(88,166,255,.055);border-color:rgba(88,166,255,.18);transform:translateX(3px)}',
    '.rl-cmd-icon{font-size:16px;flex-shrink:0;line-height:1;margin-top:1px}',
    '.rl-cmd-name{font-family:"JetBrains Mono",monospace;font-size:11px;font-weight:700;color:var(--text,#e6edf3);margin-bottom:2px;display:flex;align-items:center;gap:5px;flex-wrap:wrap}',
    '.rl-cmd-tag{font-size:9px;padding:1px 6px;border-radius:4px;font-weight:700;letter-spacing:.4px;flex-shrink:0}',
    '.rl-cat.nav .rl-cmd-tag{background:rgba(88,166,255,.14);color:#58a6ff}',
    '.rl-cat.info .rl-cmd-tag{background:rgba(126,231,135,.12);color:#7ee787}',
    '.rl-cat.action .rl-cmd-tag{background:rgba(255,166,87,.12);color:#ffa657}',
    '.rl-cat.fun .rl-cmd-tag{background:rgba(210,168,255,.12);color:#d2a8ff}',
    '.rl-cat.system .rl-cmd-tag{background:rgba(255,123,114,.1);color:#ff7b72}',
    '.rl-cmd-desc{font-size:10px;color:rgba(139,148,158,.85);line-height:1.55;margin-bottom:4px}',
    '.rl-cmd-ex{font-family:"JetBrains Mono",monospace;font-size:9px;color:rgba(88,166,255,.65);padding:2px 7px;background:rgba(88,166,255,.055);border-radius:4px;display:inline-block;border:1px solid rgba(88,166,255,.12)}',

    '#rl-help-footer{padding:10px 18px;border-top:1px solid rgba(255,255,255,.05);display:flex;align-items:center;justify-content:space-between;font-family:"JetBrains Mono",monospace;font-size:10px;color:rgba(139,148,158,.55);flex-shrink:0;background:rgba(0,0,0,.12)}',
    '#rl-help-footer kbd{padding:2px 6px;border-radius:4px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);color:rgba(139,148,158,.75);font-size:9px}',

    /* Cards aurora */
    '@keyframes auroraShift{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}',
    '@keyframes iconFloat{0%,100%{transform:translateY(0) rotate(-2deg)}50%{transform:translateY(-3px) rotate(2deg)}}',
    '.rs-card{position:relative!important;padding:20px 22px 18px!important;border-radius:20px 8px 20px 8px!important;background:transparent!important;border:none!important;overflow:hidden!important;isolation:isolate;transition:transform .4s cubic-bezier(.34,1.3,.64,1),box-shadow .4s!important}',
    '.rs-card::before{content:"";position:absolute;inset:0;border-radius:inherit;background:rgba(13,18,30,.75);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.07);z-index:-2}',
    '.rs-card::after{content:"";position:absolute;inset:-1.5px;border-radius:21.5px 9.5px 21.5px 9.5px;background-size:300% 300%;animation:auroraShift 5s ease infinite;z-index:-1;opacity:.5;transition:opacity .4s}',
    '.rs-card.blue::after{background-image:linear-gradient(135deg,#58a6ff,#388bfd,#7ee787,#58a6ff,#d2a8ff,#58a6ff)}',
    '.rs-card.green::after{background-image:linear-gradient(135deg,#7ee787,#56d364,#58a6ff,#7ee787,#a5d6ff,#7ee787)}',
    '.rs-card.amber::after{background-image:linear-gradient(135deg,#ffa657,#f0883e,#ff7b72,#ffa657,#ffd68a,#ffa657)}',
    '.rs-card.violet::after{background-image:linear-gradient(135deg,#d2a8ff,#bc8cff,#58a6ff,#d2a8ff,#ffa657,#d2a8ff)}',
    '.rs-card.red::after{background-image:linear-gradient(135deg,#ff7b72,#f85149,#ffa657,#ff7b72,#d2a8ff,#ff7b72)}',
    '.rs-card:hover{transform:translateY(-5px) scale(1.015)!important}',
    '.rs-card:hover::after{opacity:.9}',
    '.rs-icon{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:46px!important;height:46px!important;font-size:22px!important;border-radius:12px 5px 12px 5px!important;margin-bottom:12px!important;animation:iconFloat 4s ease-in-out infinite!important}',
    '.rs-card.blue .rs-icon{background:rgba(88,166,255,.14);border:1px solid rgba(88,166,255,.3)}',
    '.rs-card.green .rs-icon{background:rgba(126,231,135,.12);border:1px solid rgba(126,231,135,.3)}',
    '.rs-card.amber .rs-icon{background:rgba(255,166,87,.12);border:1px solid rgba(255,166,87,.3)}',
    '.rs-card.violet .rs-icon{background:rgba(210,168,255,.12);border:1px solid rgba(210,168,255,.3)}',
    '.rs-card.red .rs-icon{background:rgba(255,123,114,.12);border:1px solid rgba(255,123,114,.3)}',
    '.rs-card:hover .rs-icon{animation:none!important;transform:scale(1.1) rotate(-5deg)!important}',
    '.rs-label{font-size:9px!important;font-weight:800!important;letter-spacing:1.8px!important;text-transform:uppercase!important;margin-bottom:4px!important;display:block!important}',
    '.rs-card.blue .rs-label{color:#79c0ff!important}',
    '.rs-card.green .rs-label{color:#7ee787!important}',
    '.rs-card.amber .rs-label{color:#ffa657!important}',
    '.rs-card.violet .rs-label{color:#d2a8ff!important}',
    '.rs-card.red .rs-label{color:#ff7b72!important}',
    '.rs-value{color:#e6edf3!important;font-size:13px!important;font-weight:700!important;margin-bottom:3px!important}',
    '.rs-sub{color:rgba(139,148,158,.9)!important;font-size:11px!important;line-height:1.6}',
    '.rs-tag{font-size:10px!important;padding:2px 9px!important;border-radius:99px!important;font-weight:600!important;border:1px solid!important}',
    '.rs-tag.blue{background:rgba(88,166,255,.1)!important;border-color:rgba(88,166,255,.3)!important;color:#79c0ff!important}',
    '.rs-tag.green{background:rgba(126,231,135,.1)!important;border-color:rgba(126,231,135,.3)!important;color:#7ee787!important}',
    '.rs-tag.amber{background:rgba(255,166,87,.1)!important;border-color:rgba(255,166,87,.3)!important;color:#ffa657!important}',
    '.rs-tag.violet{background:rgba(210,168,255,.1)!important;border-color:rgba(210,168,255,.3)!important;color:#d2a8ff!important}',
    '.rs-tag.red{background:rgba(255,123,114,.1)!important;border-color:rgba(255,123,114,.3)!important;color:#ff7b72!important}',
    '.rs-contact-row{border-radius:10px 4px 10px 4px!important;padding:9px 13px!important;border-bottom:none!important;margin-bottom:4px!important;background:rgba(255,255,255,.025)!important;border:1px solid rgba(255,255,255,.05)!important;transition:background .2s,transform .2s!important}',
    '.rs-contact-row:hover{background:rgba(88,166,255,.07)!important;transform:translateX(4px);border-color:rgba(88,166,255,.2)!important}',
    '.rs-list li{border-radius:8px 3px 8px 3px!important;padding:9px 13px!important;border-bottom:none!important;margin-bottom:4px!important;background:rgba(255,255,255,.02)!important;border:1px solid rgba(255,255,255,.04)!important;transition:background .2s,padding-left .2s!important}',
    '.rs-list li:hover{background:rgba(88,166,255,.06)!important;padding-left:20px!important}',
    '.rs-title{position:relative!important;padding-left:13px!important;margin-bottom:12px!important;font-size:10px!important;font-weight:700!important;letter-spacing:2px!important;text-transform:uppercase!important;color:rgba(139,148,158,.8)!important}',
    '.rs-title::before{content:"";position:absolute;left:0;top:50%;transform:translateY(-50%);width:3px;height:13px;background:linear-gradient(180deg,#58a6ff,#7ee787);border-radius:3px}',
    '.proj-clickable{cursor:pointer!important}',
    '[data-theme="light"] .rs-card::before{background:rgba(255,255,255,.88)!important}',
    '[data-theme="light"] .rs-value{color:#1f2328!important}',
    '[data-theme="light"] .rs-sub{color:#424a53!important}',
    '@media(max-width:600px){.rl-cmds{grid-template-columns:1fr}#rl-help-box{max-height:95vh;margin:0;border-radius:0}}'
  ].join('');
  (document.head || document.documentElement).appendChild(decoStyle);

  /* ══════════════════════════════════════════════════════
     3. CANVAS — code rain + réseau neuronal
  ══════════════════════════════════════════════════════ */
  var _raf, _canvas, _ctx;

  var TOKENS = [
    'const','let ','var ','import','export','return','async','await',
    'function','class ','if (','for (','while(','=> {','.map(','.filter(',
    '.reduce(','useState','useEffect','computed','ref(','reactive(',
    'npm run','git push','git commit -m','ssh -i key','docker run -d',
    'sudo apt','cd ~/dev','ls -la','chmod 755','curl -X POST',
    '#!/bin/bash','python3 -m','pip install','flask --debug','uvicorn main',
    'SELECT *','FROM users','WHERE id=','JOIN ON','INSERT INTO',
    '{ }','[ ]','();','&&','||','...','null','undefined','true','false',
    '0x3FA2','ff:00:1a','192.168.1.','10.0.0.1','::1 ',
    'POST /api/v1','GET /health','HTTP/2 200','404 Not Found','500 Error',
    'TCP SYN','ACK ','RST','ICMP','UDP ',
    '<div>','</div>','<App/>','v-model','@click','@Input()',
    'λ ','Σ ','∞ ','π ','≡ ','≠ ','∀ ','∃ ',
    '#58a6ff','#7ee787','#d2a8ff','rgba(88,166','border:1px'
  ];

  var COLORS_DARK  = ['#58a6ff','#7ee787','#d2a8ff','#ffa657','#79c0ff','#56d364','#bc8cff','#ffd68a'];
  var COLORS_LIGHT = ['#0969da','#1a7f37','#6639ba','#9a6700','#0550ae','#1f6feb','#5a32a3'];

  function getColors() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? COLORS_LIGHT : COLORS_DARK;
  }
  function rndColor() { var c = getColors(); return c[Math.floor(Math.random()*c.length)]; }

  var cols_data  = [];
  var nodes_data = [];
  var N_NODES = 32;
  var COL_W   = 24;

  function resizeCanvas() {
    var W = _canvas.width  = window.innerWidth;
    var H = _canvas.height = window.innerHeight;

    /* Colonnes flottantes */
    var nc = Math.ceil(W / COL_W);
    cols_data = [];
    for (var i = 0; i < nc; i++) {
      cols_data.push({
        x:     i * COL_W + COL_W / 2,
        y:     Math.random() * -H * 1.5,
        speed: 0.2 + Math.random() * 0.45,
        token: TOKENS[Math.floor(Math.random()*TOKENS.length)],
        alpha: 0.032 + Math.random() * 0.055,
        color: rndColor(),
        size:  9 + Math.floor(Math.random()*4),
        on:    Math.random() > 0.45
      });
    }

    /* Nœuds réseau */
    nodes_data = [];
    for (var n = 0; n < N_NODES; n++) {
      nodes_data.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random()-.5) * 0.28,
        vy: (Math.random()-.5) * 0.28,
        r:  1.5 + Math.random() * 2.5,
        color: rndColor(),
        lbl: TOKENS[Math.floor(Math.random()*TOKENS.length)],
        showLbl: Math.random() > 0.45,
        pulse: Math.random() * Math.PI * 2
      });
    }
  }

  function drawFrame() {
    var W = _canvas.width, H = _canvas.height;
    var dark = document.documentElement.getAttribute('data-theme') !== 'light';
    _ctx.clearRect(0, 0, W, H);

    /* ── Tokens flottants ── */
    for (var i = 0; i < cols_data.length; i++) {
      var c = cols_data[i];
      if (!c.on) continue;
      _ctx.globalAlpha = c.alpha;
      _ctx.fillStyle   = c.color;
      _ctx.font        = c.size + 'px "JetBrains Mono",monospace';
      _ctx.fillText(c.token, c.x, c.y);
      c.y += c.speed;
      if (c.y > H + 60) {
        c.y     = -60;
        c.token = TOKENS[Math.floor(Math.random()*TOKENS.length)];
        c.color = rndColor();
        c.alpha = 0.028 + Math.random() * 0.05;
        c.size  = 9 + Math.floor(Math.random()*4);
      }
    }

    /* ── Réseau : edges ── */
    for (var a = 0; a < nodes_data.length; a++) {
      for (var b = a+1; b < nodes_data.length; b++) {
        var dx = nodes_data[a].x - nodes_data[b].x;
        var dy = nodes_data[a].y - nodes_data[b].y;
        var d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 155) {
          _ctx.globalAlpha = (1 - d/155) * (dark ? 0.10 : 0.055);
          _ctx.strokeStyle  = dark ? '#58a6ff' : '#0969da';
          _ctx.lineWidth    = 0.6;
          _ctx.beginPath();
          _ctx.moveTo(nodes_data[a].x, nodes_data[a].y);
          _ctx.lineTo(nodes_data[b].x, nodes_data[b].y);
          _ctx.stroke();
        }
      }
    }

    /* ── Réseau : nodes ── */
    for (var n = 0; n < nodes_data.length; n++) {
      var nd = nodes_data[n];
      nd.x += nd.vx; nd.y += nd.vy;
      nd.pulse += 0.018;
      if (nd.x < 0 || nd.x > W) nd.vx *= -1;
      if (nd.y < 0 || nd.y > H) nd.vy *= -1;

      var pulse = 0.7 + 0.3 * Math.sin(nd.pulse);
      _ctx.globalAlpha = (dark ? 0.38 : 0.22) * pulse;
      _ctx.fillStyle   = nd.color;
      _ctx.beginPath();
      _ctx.arc(nd.x, nd.y, nd.r * pulse, 0, Math.PI*2);
      _ctx.fill();

      if (nd.showLbl) {
        _ctx.globalAlpha = (dark ? 0.085 : 0.055) * pulse;
        _ctx.fillStyle   = nd.color;
        _ctx.font        = '9px "JetBrains Mono",monospace';
        _ctx.fillText(nd.lbl, nd.x + nd.r + 4, nd.y + 3);
      }
    }

    _ctx.globalAlpha = 1;
    _raf = requestAnimationFrame(drawFrame);
  }

  function initCanvas() {
    if (document.getElementById('rl-canvas')) return;
    _canvas = document.createElement('canvas');
    _canvas.id = 'rl-canvas';
    document.body.insertBefore(_canvas, document.body.firstChild);
    _ctx = _canvas.getContext('2d');
    resizeCanvas();
    drawFrame();
    window.addEventListener('resize', resizeCanvas);
    document.addEventListener('visibilitychange', function() {
      if (document.hidden) cancelAnimationFrame(_raf);
      else drawFrame();
    });
  }

  /* ══════════════════════════════════════════════════════
     4. SWITCH VERSIONS
  ══════════════════════════════════════════════════════ */
  var maxInitialized = false;

  function goSimple() {
    blockStyle.textContent =
      '#boot{display:none!important}' +
      '#app{display:none!important;opacity:0!important}';
    var simple = document.getElementById('simple-version');
    var app    = document.getElementById('app');
    if (simple) simple.style.cssText = 'display:block;position:fixed;inset:0;z-index:40;overflow-y:auto;background:var(--simple-bg,#0a0f1a);font-family:"Syne",sans-serif';
    if (app)    app.style.display = 'none';
    window.currentVersion = 'simple';
    updatePill();
    window.scrollTo({top:0,behavior:'smooth'});
    var helpBtn = document.getElementById('rl-help-btn');
    if (helpBtn) helpBtn.style.display = 'none';
  }

  function goMax() {
    blockStyle.textContent = '#boot{display:none!important}';
    var simple = document.getElementById('simple-version');
    if (simple) simple.style.display = 'none';
    var app = document.getElementById('app');
    if (app) app.style.cssText = 'display:flex;opacity:1;height:100%;flex-direction:column;';
    var boot = document.getElementById('boot');
    if (boot) boot.style.cssText = 'display:none!important';
    window.currentVersion = 'max';
    updatePill();
    if (!maxInitialized) {
      maxInitialized = true;
      if (typeof window.buildTree    === 'function') window.buildTree();
      if (typeof window.initTerminal === 'function') window.initTerminal();
      setTimeout(function() {
        enrichTerminal();
        addShimmerToCards();
        var tp = window.tp || function(){};
        tp('dim','────────────────────────────────────────');
        tp('ok', "  Bienvenue dans le portfolio d'Ilham 👩‍💻");
        tp('blue','  → help   pour les commandes · bouton ❓ pour le guide');
        tp('dim','────────────────────────────────────────');
        tp('dim','');
        var inp = document.getElementById('term-input');
        if (inp) inp.focus();
      }, 80);
    } else {
      setTimeout(addShimmerToCards, 80);
    }
    var helpBtn = document.getElementById('rl-help-btn');
    if (helpBtn) helpBtn.style.display = 'flex';
  }

  function updatePill() {
    var pill = document.getElementById('rl-pill');
    if (pill) {
      var isMax = window.currentVersion === 'max';
      pill.classList.toggle('is-max', isMax);
      pill.querySelector('span').textContent = isMax ? '✦ Base' : '⌨ Prestige';
    }
    var bm = document.getElementById('vbtn-max'), bs = document.getElementById('vbtn-simple');
    if (bm) bm.classList.toggle('active', window.currentVersion==='max');
    if (bs) bs.classList.toggle('active', window.currentVersion==='simple');
  }

  /* ══════════════════════════════════════════════════════
     5. PILL + BOUTON "?"
  ══════════════════════════════════════════════════════ */
  function createControls() {
    if (!document.getElementById('rl-pill')) {
      var p = document.createElement('button');
      p.id = 'rl-pill';
      p.innerHTML = '<div class="rl-dot"></div><span>⌨ Prestige</span>';
      document.body.appendChild(p);
      p.addEventListener('click', function() {
        if (window.currentVersion === 'max') goSimple(); else goMax();
      });
    }
    if (!document.getElementById('rl-help-btn')) {
      var h = document.createElement('button');
      h.id = 'rl-help-btn';
      h.title = 'Aide — guide des commandes';
      h.textContent = '?';
      document.body.appendChild(h);
      h.addEventListener('click', openHelp);
    }
  }

  /* ══════════════════════════════════════════════════════
     6. MODAL AIDE
  ══════════════════════════════════════════════════════ */
  var HELP_DATA = [
    { cat:'nav', label:'🗂 Fichiers — ouvrir avec "open <nom>"', cmds:[
      {icon:'📄',name:'open README.md',         tag:'fichier', desc:'Coordonnées complètes, langues maîtrisées, référent ETNA Yagan PERROT.',  ex:'open README.md'},
      {icon:'⚡',name:'open technologies.md',    tag:'fichier', desc:'Stack complète : frameworks, backend, DevOps, bases de données, outils.', ex:'open technologies.md'},
      {icon:'💚',name:'open src/bio.md',          tag:'fichier', desc:'Qui je suis, ma philosophie de code, pourquoi ce métier, mon parcours.',  ex:'open src/bio.md'},
      {icon:'🗂',name:'open src/projects.md',     tag:'fichier', desc:'Mes 4 projets réels avec screenshots interactifs cliquables.',            ex:'open src/projects.md'},
      {icon:'🐧',name:'open src/skills.md',       tag:'fichier', desc:'Compétences détaillées : Linux, Docker, Bash, réseau TCP/IP, SSH.',       ex:'open src/skills.md'},
      {icon:'✨',name:'open src/atouts-hobbies.md',tag:'fichier',desc:'Atouts personnels, soft skills, hobbies et centres d\'intérêt.',          ex:'open src/atouts-hobbies.md'},
      {icon:'🔐',name:'open about/informations.md',tag:'fichier',desc:'Contact direct, disponibilité Juin 2026, modalités d\'alternance.',       ex:'open about/informations.md'},
      {icon:'🎯',name:'open je-cherche-quoi.md',  tag:'fichier', desc:'Projet professionnel, environnement idéal, ce que j\'apporte.',           ex:'open je-cherche-quoi.md'},
    ]},
    { cat:'info', label:'💡 Informations rapides', cmds:[
      {icon:'👤',name:'whoami',   tag:'info', desc:'Résumé express : qui je suis, où je suis, ma stack, ma dispo.',        ex:'whoami'},
      {icon:'⚡',name:'stack',    tag:'info', desc:'Stack technique complète dans le terminal en un coup d\'œil.',          ex:'stack'},
      {icon:'🌍',name:'langues',  tag:'info', desc:'Mes 3 langues : Arabe (maternel), Anglais (courant), Français (TCF).',  ex:'langues'},
      {icon:'🗂',name:'projects', tag:'info', desc:'Liste des 4 projets avec les technos utilisées.',                       ex:'projects'},
      {icon:'📅',name:'dispo',    tag:'info', desc:'Disponibilité Juin 2026, rythme alternance, localisation.',             ex:'dispo'},
      {icon:'📋',name:'ls',       tag:'info', desc:'Liste tous les fichiers disponibles dans le portfolio.',                ex:'ls'},
      {icon:'🌳',name:'tree',     tag:'info', desc:'Arborescence complète du repo façon terminal.',                         ex:'tree'},
      {icon:'🖥', name:'neofetch', tag:'info', desc:'Profil ASCII style Linux — stats visuelles en mode hacker.',           ex:'neofetch'},
    ]},
    { cat:'action', label:'🚀 Actions directes', cmds:[
      {icon:'✉', name:'contact',  tag:'action', desc:'Ouvre le formulaire de contact pour écrire directement à Ilham.',    ex:'contact'},
      {icon:'📄',name:'cv',        tag:'action', desc:'Télécharge le CV PDF dans un nouvel onglet.',                        ex:'cv'},
      {icon:'🗺',name:'map',       tag:'action', desc:'Ouvre la Navigation Map — vue d\'ensemble de tous les fichiers.',    ex:'map'},
      {icon:'👤',name:'profile',   tag:'action', desc:'Ouvre le modal profil : formation, projets, compétences, langues.',  ex:'profile'},
      {icon:'📧',name:'email',     tag:'action', desc:'Ouvre ton client mail avec l\'adresse d\'Ilham pré-remplie.',        ex:'email'},
      {icon:'💼',name:'linkedin',  tag:'action', desc:'Ouvre le profil LinkedIn dans un nouvel onglet.',                    ex:'linkedin'},
      {icon:'⎇', name:'github',    tag:'action', desc:'Ouvre GitHub codeWithIlham dans un nouvel onglet.',                  ex:'github'},
      {icon:'🎨',name:'theme',     tag:'action', desc:'Bascule thème sombre ↔ clair en temps réel.',                       ex:'theme'},
    ]},
    { cat:'fun', label:'🎲 Easter eggs & fun', cmds:[
      {icon:'🎲',name:'fortune', tag:'fun', desc:'Citation tech inspirante tirée au hasard.',                              ex:'fortune'},
      {icon:'😂',name:'joke',    tag:'fun', desc:'Une blague de dev. Peut faire rire ou gémir profondément.',              ex:'joke'},
      {icon:'🌧',name:'matrix',  tag:'fun', desc:'Pluie de symboles Matrix dans le terminal. Style garanti.',             ex:'matrix'},
      {icon:'☕',name:'coffee',  tag:'fun', desc:'Caféination d\'urgence. +200% productivité immédiate.',                  ex:'coffee'},
      {icon:'🔒',name:'sudo',    tag:'fun', desc:'Tentative d\'accès super-admin. Spoiler : tu n\'es pas Ilham.',          ex:'sudo rm -rf /'},
    ]},
    { cat:'system', label:'⚙️ Système', cmds:[
      {icon:'🗑',name:'clear', tag:'system', desc:'Efface tout le terminal. Repart sur une page vierge.',                 ex:'clear'},
    ]}
  ];

  function buildHelpModal() {
    if (document.getElementById('rl-help-modal')) return;
    var modal = document.createElement('div');
    modal.id = 'rl-help-modal';
    var html = '<div id="rl-help-box"><div id="rl-help-header"><h2>📡 Guide des commandes <span class="rl-h-badge">Terminal</span></h2><button id="rl-help-close">✕</button></div><div id="rl-help-body">';
    HELP_DATA.forEach(function(g) {
      html += '<div class="rl-cat '+g.cat+'"><div class="rl-cat-title">'+g.label+'</div><div class="rl-cmds">';
      g.cmds.forEach(function(cmd) {
        html += '<div class="rl-cmd"><span class="rl-cmd-icon">'+cmd.icon+'</span><div>';
        html += '<div class="rl-cmd-name"><span style="font-family:\'JetBrains Mono\',monospace;color:var(--text,#e6edf3)">'+cmd.name+'</span><span class="rl-cmd-tag">'+cmd.tag+'</span></div>';
        html += '<div class="rl-cmd-desc">'+cmd.desc+'</div>';
        html += '<span class="rl-cmd-ex">$ '+cmd.ex+'</span>';
        html += '</div></div>';
      });
      html += '</div></div>';
    });
    html += '</div><div id="rl-help-footer"><span>💡 Disponible dans la <strong style="color:#58a6ff">Version Prestige</strong> — terminal en bas</span><span><kbd>Esc</kbd> fermer</span></div></div>';
    modal.innerHTML = html;
    document.body.appendChild(modal);
    modal.addEventListener('click', function(e){ if(e.target===modal) modal.classList.remove('open'); });
    document.getElementById('rl-help-close').addEventListener('click', function(){ modal.classList.remove('open'); });
  }

  function openHelp() {
    buildHelpModal();
    document.getElementById('rl-help-modal').classList.add('open');
  }

  /* ══════════════════════════════════════════════════════
     7. SHIMMER
  ══════════════════════════════════════════════════════ */
  function addShimmerToCards() {
    document.querySelectorAll('.rs-card:not([data-s])').forEach(function(c){ c.setAttribute('data-s','1'); });
  }

  /* ══════════════════════════════════════════════════════
     8. TERMINAL ENRICHI
  ══════════════════════════════════════════════════════ */
  function enrichTerminal() {
    var inp = document.getElementById('term-input');
    if (!inp) return;
    var fresh = inp.cloneNode(true);
    inp.parentNode.replaceChild(fresh, inp);
    var tp = function(t,x){ if(typeof window.tp==='function') window.tp(t,x); };
    var FILES = ['README.md','technologies.md','je-cherche-quoi.md','src/bio.md','src/projects.md','src/skills.md','src/atouts-hobbies.md','about/informations.md'];
    var CMDS = {
      help:    function(){ tp('dim',''); tp('blue','  ╭─ Commandes ─────────────────────────────────────────╮'); [['ls / tree','lister les fichiers'],['open <fichier>','ouvrir un fichier'],['whoami','qui est Ilham'],['stack','stack technique'],['langues','langues parlées'],['projects','liste projets'],['contact','formulaire contact'],['cv','CV PDF'],['dispo','disponibilité'],['map','navigation map'],['profile','profil modal'],['neofetch','profil ASCII'],['email','email direct'],['linkedin','LinkedIn'],['github','GitHub'],['fortune','citation'],['joke','blague dev'],['matrix','pluie code'],['coffee','café ☕'],['sudo','accès admin…'],['theme','thème clair/sombre'],['clear','effacer terminal']].forEach(function(x){tp('blue','  │  '+x[0].padEnd(22)+' · '+x[1]);}); tp('blue','  ╰─────────────────────────────────────────────────────╯'); tp('dim','  💡 Clique sur le bouton ❓ pour le guide visuel complet'); tp('dim',''); },
      ls:      function(){ tp('dim',''); tp('dim','  📄 README.md  ⚡ technologies.md  🎯 je-cherche-quoi.md'); tp('dim','  📁 src/  →  💚 bio.md · 🗂 projects.md · 🐧 skills.md · ✨ atouts-hobbies.md'); tp('dim','  📁 about/  →  🔐 informations.md'); tp('dim',''); },
      tree:    function(){ tp('dim',''); tp('blue','  📦 portfolio/'); tp('dim','  ├── 📄 README.md'); tp('dim','  ├── ⚡ technologies.md'); tp('dim','  ├── 🎯 je-cherche-quoi.md'); tp('dim','  ├── 📁 src/'); tp('dim','  │   ├── 💚 bio.md'); tp('dim','  │   ├── 🗂 projects.md'); tp('dim','  │   ├── 🐧 skills.md'); tp('dim','  │   └── ✨ atouts-hobbies.md'); tp('dim','  └── 📁 about/'); tp('dim','      └── 🔐 informations.md'); tp('dim',''); },
      whoami:  function(){ tp('dim',''); tp('green','  👩‍💻 Ilham Amirat — Conceptrice Développeuse · Bac+3 ETNA'); tp('dim','     🇲🇦→🇫🇷 · Ivry-sur-Seine · Alternance · Dispo Juin 2026'); tp('dim','     Vue.js · React · Angular · Python · Docker · Linux'); tp('dim',''); },
      stack:   function(){ tp('dim',''); tp('amber','  Frontend : Vue.js 3 · React · Angular · TypeScript · HTML/CSS'); tp('amber','  Backend  : Python · Flask · FastAPI · PostgreSQL · SQL'); tp('violet','  DevOps   : Linux · Docker · Bash · Git · SSH · TCP/IP'); tp('dim',''); },
      langues: function(){ tp('dim',''); tp('amber','  🇲🇦 Arabe   — Langue maternelle'); tp('blue','  🇬🇧 Anglais — Courant'); tp('violet','  🇫🇷 Français — Intermédiaire avancé · TCF'); tp('dim',''); },
      projects:function(){ tp('dim',''); tp('blue','  🐳 Compose-ton-vote → Docker · Python · Redis'); tp('green','  ✅ To-Do-Manager    → Vue.js 3 · Pinia · TypeScript'); tp('amber','  📇 Contact-CRM      → Angular · RxJS · REST API'); tp('violet','  🎨 UX/UI Design     → Figma · Design System'); tp('dim',''); },
      contact: function(){ if(typeof window.openContact==='function') window.openContact(); tp('dim','  → Formulaire ouvert'); },
      dispo:   function(){ tp('dim',''); tp('ok','  ✓ Disponible : Juin 2026 · Alternance · Île-de-France'); tp('dim',''); },
      map:     function(){ if(typeof window.openMap==='function') window.openMap(); tp('dim','  → Map ouverte'); },
      profile: function(){ if(typeof window.openProfile==='function') window.openProfile(); tp('dim','  → Profil ouvert'); },
      cv:      function(){ window.open('cv-ilham.pdf','_blank'); tp('dim','  → CV PDF ouvert'); },
      email:   function(){ window.location.href='mailto:amiratilham4@gmail.com'; tp('ok','  📧 amiratilham4@gmail.com'); },
      linkedin:function(){ window.open('https://linkedin.com/in/ilhamamirat','_blank'); tp('blue','  → LinkedIn ouvert'); },
      github:  function(){ window.open('https://github.com/codeWithIlham','_blank'); tp('violet','  → GitHub ouvert'); },
      neofetch:function(){ tp('dim',''); tp('blue','       █████╗      ilham@portfolio'); tp('blue','      ██╔══██╗     ─────────────────────────'); tp('blue','      ███████║     OS      : Portfolio v9'); tp('blue','      ██╔══██║     Stack   : Vue · React · Angular'); tp('blue','      ╚═╝  ╚═╝     Dispo   : Juin 2026 ✓'); tp('green','                  Langues : 🇲🇦 🇬🇧 🇫🇷'); tp('dim',''); },
      fortune: function(){ var Q=["Le code propre se lit comme un roman. — R.C. Martin","D'abord faire que ça marche. — Kent Beck","La simplicité est la sophistication suprême. — Da Vinci","Any fool can write code a computer understands. — Fowler"]; tp('violet','  ✨ '+Q[Math.floor(Math.random()*Q.length)]); tp('dim',''); },
      joke:    function(){ var J=[['Pourquoi les devs préfèrent le mode sombre ?','La lumière attire les bugs 🐛'],['99 bugs in the code...','Take one down — 127 bugs 😭'],['Combien de devs pour changer une ampoule ?','Aucun, c\'est un problème hardware.']]; var j=J[Math.floor(Math.random()*J.length)]; tp('amber','  😂 '+j[0]); tp('dim','     → '+j[1]); tp('dim',''); },
      matrix:  function(){ var C='01λπ∞▓░◆█'; for(var i=0;i<7;i++){var l='  ';for(var j=0;j<40;j++)l+=C[Math.floor(Math.random()*C.length)]+' ';tp('green',l);} tp('dim',''); },
      coffee:  function(){ tp('amber','  ☕☕☕  CAFÉ EN COURS — productivité +200%  ☕☕☕'); tp('dim','  Attention : trop de café = commits à 3h du matin'); tp('dim',''); },
      sudo:    function(){ tp('red','  ⚠ Permission denied — vous n\'êtes pas Ilham !'); tp('dim','  Essayez avec le formulaire de contact à la place :)'); tp('dim',''); },
      clear:   function(){ if(typeof window.clearTerm==='function') window.clearTerm(); }
    };
    var hist=[]; var histIdx=-1;
    fresh.addEventListener('keydown', function(e){
      if(e.key==='Enter'){
        var val=fresh.value.trim(); fresh.value=''; histIdx=-1;
        if(!val) return;
        hist.unshift(val);
        tp('blue','ilham@portfolio:~$ '+val);
        var parts=val.split(/\s+/), cmd=parts[0].toLowerCase(), args=parts.slice(1);
        if(cmd==='open'||cmd==='cat'){
          var target=args.join(' '), found=null;
          for(var i=0;i<FILES.length;i++){ if(FILES[i]===target||FILES[i].endsWith('/'+target)||FILES[i]===target+'.md'){found=FILES[i];break;} }
          if(found&&typeof window.openFile==='function'){ if(window.currentVersion!=='max'){goMax();setTimeout(function(){window.openFile(found);},200);}else window.openFile(found); }
          else tp('err','  bash: '+target+': No such file or directory');
          return;
        }
        if(CMDS[cmd]){CMDS[cmd](args);return;}
        tp('err','  bash: '+cmd+': command not found  (tape "help" ou clique ❓)');
      }
      if(e.key==='ArrowUp')  {histIdx=Math.min(histIdx+1,hist.length-1);fresh.value=hist[histIdx]||'';}
      if(e.key==='ArrowDown'){histIdx=Math.max(histIdx-1,-1);fresh.value=histIdx===-1?'':hist[histIdx];}
    });
  }

  /* ══════════════════════════════════════════════════════
     9. INIT
  ══════════════════════════════════════════════════════ */
  function afterBootReady() {
    window.switchToMax    = goMax;
    window.switchToSimple = goSimple;
    createControls();
    var helpBtn = document.getElementById('rl-help-btn');
    if (helpBtn) helpBtn.style.display = 'none';
    buildHelpModal();
    initCanvas();
    new MutationObserver(addShimmerToCards).observe(document.body,{childList:true,subtree:true});
    document.addEventListener('keydown', function(e){
      if((e.ctrlKey||e.metaKey)&&e.key==='p'){e.preventDefault();if(typeof window.openMap==='function')window.openMap();}
      if(e.key==='Escape'){
        ['contact-modal','project-modal','profile-modal','map-modal','rl-help-modal'].forEach(function(id){
          var el=document.getElementById(id);
          if(el){el.classList.remove('open');if(id!=='rl-help-modal')el.style.display='';}
        });
      }
    });
  }

  /* ══════════════════════════════════════════════════════
     10. FALLBACK
  ══════════════════════════════════════════════════════ */
  window.addEventListener('load', function(){
    if(!window._rlReady){
      window._rlReady=true;
      var boot=document.getElementById('boot'),app=document.getElementById('app'),simple=document.getElementById('simple-version');
      if(boot)  boot.style.cssText='display:none!important';
      if(app)   {app.style.display='none';app.style.opacity='0';}
      if(simple)simple.style.cssText='display:block;position:fixed;inset:0;z-index:40;overflow-y:auto;background:var(--simple-bg,#0a0f1a);font-family:"Syne",sans-serif';
      window.currentVersion='simple';
      afterBootReady();
    }
  });

})();