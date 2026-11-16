/*
 * BUBLIOTS
 * Copyright (c) directly2you ltd. All rights reserved.
 * No part of this game (code, graphics, sounds, music) may be copied, modified
 * or redistributed without written permission of directly2you ltd.
 *
 * HTML5 rewrite of the original Flash (Flex) game by Entropiarts.
 * Graphics and sounds are the original assets extracted from Bubliots.swf.
 * Rules were reconstructed from the compiled game code.
 */
'use strict';
(function () {
  // ---------------------------------------------------------------- constants
  var W = 783, H = 574, COLS = 15, ROWS = 15, S = 33, R = S / 2;
  var TX = 123, TY = 15;                       // top-left corner of the playfield
  var LEFT = TX + R, RIGHT = TX + COLS * S;    // limits for the centre of a flying gem
  var GUN_Y = 505, GUN_W = 190, GUN_H = 64, GUN_MIN = 103, GUN_MAX = 650 - GUN_W;
  var GUN_SPEED = 180;                         // 7.5 px per frame at 24 fps
  var SHOT_SPEED = 1100, HIT = 28;
  var DESCENT_TIME = 7, COEF_TIME = 60, COEF_START = 4;
  var DANGER_PENALTY = 10, QUESTION_BONUS = 13;
  var COEF_COLORS = ['#ff0000', '#ff8a00', '#ffda00', '#f0ff00', '#00ff00'];
  var A = 'bubliots/assets/';
  var COPYRIGHT = '\u00a9 directly2you ltd. All rights reserved.';
  var GEM_IMG = { R: 'imageRed', G: 'imageGreen', B: 'imageBlue', Y: 'imageYellow', S: 'imageSkull', W: 'imageWhite', Q: 'imageQuestion' };
  var SKILL_TEXT = { R: 'napisExplosion', B: 'napisFreeze', G: 'napisTimewarp', Y: 'napisRampage' };
  var BOSS_ROWS = {
    Invader: [".....GGG.......", ".SSSBGGBSSS....", "..SSBGRGBSS....", "..SBGRRGBS.....", "..SBGRYRGBS....", "BBBGRYYRGBBB...", "BBBBGRYRGBBBB..", "B..BGRRGB..B...", ".S..BGRGG..S...", "....BGGB.......", ".....BGB.......", ".....BB........"],
    Bombcarier: [".......G.......", "..GBBBGGBBBG...", "..GBSYYGYYSBG..", ".GBSYGYYGYSBG..", ".GBSYGGBGGYSBG.", ".GSRRGBBGRRSG..", "..GRBRBBBRBRG..", "..RBBRYYRBBR...", "..RYYYRYRYYYR..", ".RY..YRRY..YR.."],
    Piramider: [".......G.......", ".....YGGY......", ".....RYYYR.....", "....RRBBRR.....", "....SRBSBRS....", "...SGGBBGGS....", "...GGBGGGBGG...", "..YYBBYYBBYY...", "..Y.YBY.YBY.Y..", ".Y..YY..YY..Y..", ".....S...S....."],
    Insect: ["......BBB......", "..RRRBBBBRRR...", "..RGGRBBBRGGR..", ".RGGGRRRRGGGR..", "..RGGRYYYRGGR..", "..RRRYRRYRRR...", "..BBBYRRRYBBB..", ".BYYBYRRYBYYB..", "..BBB.YYY.BBB.."],
    Schnek: ["...BBBBBBBBB...", "..BSRRRRRRSB...", "...BRGGGGGRB...", "...RGYYYYGR....", "...RGYBBBYGR...", ".GRGYBRRBYGRG..", "..GGYBRRRBYGG..", "..SGYBRRBYGS...", "......BBB......"],
    EvilDiamond: ["..BRRYYBBG.....", ".BRSRYBSBY.....", "...SSRBSS......", ".GBYYYBRRY.....", "..GBBGGYYR.....", "..GRRSRRY......", "...RBBRBR......", "...BYYYB.......", "....GGRG.......", "....YRG........", ".....YG........", ".....R........."],
    Flowerboss: [".SSS......SSS..", ".RRS.BBB.SRR...", ".RSRSBGGBSRSR..", ".RRSSGSGSSRR...", "...SRRGGRRS....", "...YYRBRYY.....", "...YSYRRYSY....", "...YYSSSYY.....", "...SSSGGSSS....", "..S.SGSGS.S....", "......GG......."]
  };
  var BOSS_SEQ = { Invader: 'RYRGYRY', Schnek: 'RRBRYBG', Flowerboss: 'YYGYYRRGRSS' };
  var LEVELS = ['', '', '', 'Invader', '', '', '', 'Bombcarier', '', '', '', 'EvilDiamond', '', '', '', 'Flowerboss',
    '', '', '', 'Insect', '', '', '', 'Piramider', '', '', '', 'Schnek'];

  var IMAGES = ['imageRed', 'imageGreen', 'imageBlue', 'imageYellow', 'imageSkull', 'imageWhite', 'imageQuestion',
    'imageGun', 'imageSipkaLeft', 'imageSipkaRight', 'dangerImage', 'backgroundImage', 'backgroundImageMask',
    'lavobok', 'pravobok', 'pravaStranaLajf', 'pravaStranaSoundON', 'pravaStranaSoundOFF',
    'lavaStranaMenuButtonOff', 'lavaStranaMenuButtonGlow', 'lavaStranaMenuButtonActive',
    'napisStart', 'napisLevel', 'napisExplosion', 'napisFreeze', 'napisRampage', 'napisTimewarp',
    'menuPodklad', 'menuPlayOff', 'menuPlayRollover', 'menuPlayActive',
    'menuHowToPlayOff', 'menuHowToPlayRollover', 'menuHowToPlayActive',
    'menuRanklistOff', 'menuRanklistRollover', 'menuRanklistActive', 'tutorial',
    'inGameMenu', 'inGameMenuNewGameOff', 'inGameMenuNewGameGlow', 'inGameMenuNewGameActive',
    'inGameMenuContinueOff', 'inGameMenuContinueGlow', 'inGameMenuContinueActive',
    'inGameMenuExitOff', 'inGameMenuExitGlow', 'inGameMenuExitActive',
    'GameOver_podklad', 'GameOver_submitOff', 'GameOver_submitRollover', 'GameOver_submitActive',
    'GameOver_cancelOff', 'GameOver_cancelRollover', 'GameOver_cancelActive',
    'ScoreDialog_podklad', 'ScoreDialog_playAgainOff', 'ScoreDialog_playAgainRollover', 'ScoreDialog_playAgainActive',
    'ScoreDialog_publishOff', 'ScoreDialog_publishRollover', 'ScoreDialog_publishActive'];
  for (var d = 0; d < 10; d++) { IMAGES.push('nR' + d); IMAGES.push('nB' + d); }
  var SOUNDS = ['zvukSpojenie1', 'zvukSpojenie2', 'zvukVybuchSmrtky1', 'zvukVystrelenieGulicky2',
    'zvukBonusGulicka1', 'zvukBonusGulicka2', 'zvukBonusGulicka3', 'zvukBonusGulicka4',
    'zvukBonusCislo1', 'zvukBonusCislo2', 'zvukBonusGameOver1', 'zvukBonusLifeLoss1'];

  // ---------------------------------------------------------------- setup
  var cv = document.getElementById('bubliots');
  var nameInput = document.getElementById('bubliots-name');
  if (!cv) return;
  var g = cv.getContext('2d');

  // ---------------------------------------------------------------- domain lock
  // The game only runs on the domains listed below (and their subdomains) and on a
  // local computer. tools/build.js replaces the list with hashes in the minified build.
  function hsh(str) { var h = 5381; for (var i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0; return h; }
  var ALLOWED = /*LOCK-START*/['directly2you.github.io', 'd2u.sk', 'geniots.com', 'entropiarts.com'].map(hsh)/*LOCK-END*/;
  function allowedHost() {
    var h = (location.hostname || '').toLowerCase();
    if (location.protocol === 'file:' || h === '' || h === 'localhost' || h === '127.0.0.1' || h === '[::1]') return true;
    var parts = h.split('.');
    for (var i = 0; i < parts.length - 1; i++) if (ALLOWED.indexOf(hsh(parts.slice(i).join('.'))) >= 0) return true;
    return false;
  }
  if (!allowedHost()) {
    g.fillStyle = '#05090f'; g.fillRect(0, 0, 783, 574);
    g.fillStyle = '#18d1f8'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = 'bold 18px Verdana, Geneva, sans-serif';
    g.fillText('BUBLIOTS', 391, 250);
    g.font = '13px Verdana, Geneva, sans-serif';
    g.fillText('This copy of the game is not authorized to run on this website.', 391, 285);
    g.fillText('\u00a9 directly2you ltd. All rights reserved.', 391, 310);
    return;
  }
  var img = {}, snd = {}, loaded = 0;

  IMAGES.forEach(function (n) {
    var i = new Image();
    i.onload = i.onerror = function () { loaded++; };
    i.src = A + n + '.png';
    img[n] = i;
  });
  SOUNDS.forEach(function (n) {
    try { var a = new Audio(A + n + '.mp3'); a.preload = 'auto'; snd[n] = a; } catch (e) { /* no audio */ }
  });

  // sound settings: effects and music can be switched separately (remembered in the browser)
  var sfxOn = true, musicOn = true, soundMenu = false;
  try {
    var saved = JSON.parse(localStorage.getItem('bubliots.sound') || '{}');
    if (saved.sfx === false) sfxOn = false;
    if (saved.music === false) musicOn = false;
  } catch (e) { /* storage unavailable */ }
  function saveSound() {
    try { localStorage.setItem('bubliots.sound', JSON.stringify({ sfx: sfxOn, music: musicOn })); } catch (e) { /* ignore */ }
  }
  var SM = { x: 634, y: 458, w: 142, h: 68, row: 26 };   // sound menu above the speaker icon
  // background music (original Bubliots soundtrack), plays while a game is running
  var music = null;
  try { music = new Audio(A + 'music.mp3'); music.loop = true; music.volume = 0.35; music.preload = 'auto'; } catch (e) { music = null; }
  function syncMusic() {
    if (!music) return;
    var want = musicOn && screen === 'play' && dialog !== 'menu' && !document.hidden;
    try {
      if (want && music.paused) { var p = music.play(); if (p && p.catch) p.catch(function () { }); }
      else if (!want && !music.paused) music.pause();
    } catch (e) { /* ignore */ }
  }
  function sfx(n) {
    if (!sfxOn || !snd[n]) return;
    try { var a = snd[n].cloneNode(); a.volume = 0.6; var p = a.play(); if (p && p.catch) p.catch(function () { }); } catch (e) { /* ignore */ }
  }
  function rnd(n) { return Math.floor(Math.random() * n); }
  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  // ---------------------------------------------------------------- state
  var screen = 'loading';       // loading | menu | howto | rank | play
  var dialog = null;            // null | 'menu' | 'gameover' | 'score'
  var phase = 'intro';          // intro | aim | busy
  var grid, parity, level, lvl, boss, bossSteps;
  var score, life, coef, coefT, descentT, freezeT, rampageOn, rampageCount, pendingGreen;
  var gunX, keyL = false, keyR = false, gunDir = 0;
  var bullet, nextBullet, flying, shot;
  var fallers = [], tweens = [], effects = [], popups = [], rings = [];
  var clock = 0, bestSession = 0, lastName = '';
  var mouse = { x: W / 2, y: 200 }, pressed = null, touchGun = false;

  // ---------------------------------------------------------------- tweens
  function tween(dur, update, done) { tweens.push({ t: 0, dur: dur, update: update, done: done }); }
  function stepTweens(dt) {
    var list = tweens.slice();
    for (var i = 0; i < list.length; i++) {
      var tw = list[i];
      if (tweens.indexOf(tw) < 0) continue;
      tw.t += dt;
      var k = tw.dur > 0 ? Math.min(1, tw.t / tw.dur) : 1;
      if (tw.update) tw.update(k);
      if (k >= 1) {
        var ix = tweens.indexOf(tw);
        if (ix >= 0) tweens.splice(ix, 1);
        if (tw.done) tw.done();
      }
    }
  }

  // ---------------------------------------------------------------- grid helpers
  function odd(r) { return ((r + parity) & 1) === 1; }
  function cx(r, c) { return TX + (odd(r) ? R : 0) + c * S + R; }
  function cy(r) { return TY + r * S + R; }
  function gem(t) { return { t: t, a: 1, dx: 0, dy: 0, anchor: false }; }
  function neighbours(r, c) {
    var o = odd(r) ? 1 : -1;
    var list = [[r, c - 1], [r, c + 1], [r - 1, c], [r + 1, c], [r - 1, c + o], [r + 1, c + o]], out = [];
    for (var i = 0; i < list.length; i++) {
      var a = list[i][0], b = list[i][1];
      if (a >= 0 && a < ROWS && b >= 0 && b < COLS) out.push({ r: a, c: b });
    }
    return out;
  }
  function emptyRow() { var a = []; for (var c = 0; c < COLS; c++) a.push(null); return a; }
  function eachGem(fn) {
    for (var r = 0; r < ROWS; r++) for (var c = 0; c < COLS; c++) if (grid[r][c]) fn(grid[r][c], r, c);
  }

  // ---------------------------------------------------------------- generator (GameItemGenerator)
  function makeGenerator() {
    var dist = { R: 20, G: 20, B: 20, Y: 20, W: 6, S: 12, Q: 2 };
    var n = { R: 0, G: 0, B: 0, Y: 0, W: 0, S: 0, Q: 0 };
    return {
      pick: function (src) {
        if (!src.length) return 'R';
        var tot = 0, k;
        for (k in n) tot += n[k];
        var cand = src;
        if (tot > 0) {
          var f = src.filter(function (t) { return n[t] / tot * 100 < dist[t]; });
          if (f.length) cand = f;
        }
        var t = cand[rnd(cand.length)];
        n[t]++;
        return t;
      }
    };
  }
  function genBullet() {
    if (level.pointer < level.seq.length) return level.seq[level.pointer++];
    return level.gen.pick(level.gunSrc);
  }

  // ---------------------------------------------------------------- game flow
  function newGame() {
    score = 0; life = 3; lvl = 0;
    dialog = null; hideName(); soundMenu = false;
    screen = 'play';
    startLevel();
  }

  function startLevel() {
    if (!allowedHost()) { screen = 'menu'; return; }
    var name = LEVELS[lvl], r, c;
    boss = !!name;
    level = {
      gen: makeGenerator(), pointer: 0, seq: (BOSS_SEQ[name] || '').split(''),
      tableSrc: ['R', 'B', 'G', 'Y', 'Q', 'S'], gunSrc: ['R', 'B', 'G', 'Y', 'W', 'S']
    };
    grid = []; parity = 0; bossSteps = 3;
    for (r = 0; r < ROWS; r++) grid.push(emptyRow());
    if (boss) {
      var rows = BOSS_ROWS[name] || [];
      for (r = 0; r < rows.length && r < ROWS; r++) {
        for (c = 0; c < COLS && c < rows[r].length; c++) {
          if (rows[r][c] !== '.') { grid[r][c] = gem(rows[r][c]); grid[r][c].anchor = (r === 0); }
        }
      }
    } else {
      for (r = 0; r < ROWS / 3; r++) for (c = 0; c < COLS; c++) grid[r][c] = gem(level.gen.pick(level.tableSrc));
    }
    fallers = []; tweens = []; effects = []; popups = []; rings = [];
    flying = null; shot = null; pendingGreen = false;
    gunX = (GUN_MIN + GUN_MAX) / 2;
    bullet = genBullet(); nextBullet = genBullet();
    coef = COEF_START; coefT = 0; descentT = 0; freezeT = 0;
    rampageOn = false; rampageCount = 0;
    phase = 'intro';
    textEffect('napisLevel', lvl + 1, function () {
      textEffect('napisStart', null, function () { phase = 'aim'; descentT = 0; });
    });
  }

  function takeLife() {
    life--;
    sfx('zvukBonusLifeLoss1');
    if (life <= 0) {
      life = 0;
      sfx('zvukBonusGameOver1');
      if (score > bestSession) bestSession = score;
      dialog = 'gameover';
      showName();
      return false;
    }
    return true;
  }

  function rampage() {
    if (rampageCount > 0) rampageCount--; else rampageOn = false;
    return rampageOn ? 2 : 1;
  }

  // ---------------------------------------------------------------- shooting
  function hitsGem(x, y) {
    var row = Math.floor((y - TY) / S);
    for (var r = Math.max(0, row - 1); r <= Math.min(ROWS - 1, row + 1); r++) {
      for (var c = 0; c < COLS; c++) {
        if (grid[r][c]) {
          var ex = cx(r, c) - x, ey = cy(r) - y;
          if (ex * ex + ey * ey < HIT * HIT) return true;
        }
      }
    }
    return false;
  }
  function nearestEmpty(x, y) {
    var row = Math.floor((y - TY) / S), best = null, bd = 1e9;
    for (var r = Math.max(0, row - 2); r <= Math.min(ROWS - 1, row + 2); r++) {
      for (var c = 0; c < COLS; c++) {
        if (grid[r][c]) continue;
        var ok = (r === 0);
        if (!ok) {
          var nb = neighbours(r, c);
          for (var i = 0; i < nb.length; i++) if (grid[nb[i].r][nb[i].c]) { ok = true; break; }
        }
        if (!ok) continue;
        var ex = cx(r, c) - x, ey = cy(r) - y, dd = ex * ex + ey * ey;
        if (dd < bd) { bd = dd; best = { r: r, c: c }; }
      }
    }
    return bd < (S * 1.6) * (S * 1.6) ? best : null;
  }
  function computeShot() {
    shot = null;
    if (mouse.y > GUN_Y - 8) return;
    var x = clamp(gunX + GUN_W / 2, LEFT, RIGHT), y = GUN_Y;
    var dx = mouse.x - x, dy = mouse.y - y, L = Math.sqrt(dx * dx + dy * dy);
    if (L < 1) return;
    dx /= L; dy /= L;
    if (dy > -0.15) { dy = -0.15; dx = (dx < 0 ? -1 : 1) * Math.sqrt(1 - dy * dy); }
    var pts = [{ x: x, y: y }], step = 3;
    for (var i = 0; i < 4000; i++) {
      x += dx * step; y += dy * step;
      if (x < LEFT) { x = 2 * LEFT - x; dx = -dx; pts.push({ x: LEFT, y: y }); }
      else if (x > RIGHT) { x = 2 * RIGHT - x; dx = -dx; pts.push({ x: RIGHT, y: y }); }
      if (y <= TY + R || hitsGem(x, y)) {
        var cell = nearestEmpty(x, y);
        if (!cell) return;
        pts.push({ x: cx(cell.r, cell.c), y: cy(cell.r) });
        shot = { pts: pts, r: cell.r, c: cell.c };
        return;
      }
    }
  }
  function fire() {
    if (screen !== 'play' || dialog || phase !== 'aim') return;
    computeShot();
    if (!shot) return;
    var s = shot, t = bullet, segs = [], total = 0, i;
    shot = null; phase = 'busy';
    for (i = 1; i < s.pts.length; i++) {
      var l = Math.sqrt(Math.pow(s.pts[i].x - s.pts[i - 1].x, 2) + Math.pow(s.pts[i].y - s.pts[i - 1].y, 2));
      segs.push(l); total += l;
    }
    flying = { t: t, x: s.pts[0].x, y: s.pts[0].y };
    sfx('zvukVystrelenieGulicky2');
    tween(Math.max(0.05, total / SHOT_SPEED), function (k) {
      var dd = k * total;
      for (var j = 0; j < segs.length; j++) {
        if (dd <= segs[j] || j === segs.length - 1) {
          var q = segs[j] > 0 ? Math.min(1, dd / segs[j]) : 1;
          flying.x = s.pts[j].x + (s.pts[j + 1].x - s.pts[j].x) * q;
          flying.y = s.pts[j].y + (s.pts[j + 1].y - s.pts[j].y) * q;
          break;
        }
        dd -= segs[j];
      }
    }, function () {
      flying = null;
      grid[s.r][s.c] = gem(t);
      bullet = nextBullet; nextBullet = genBullet();
      applyRules(t, s.r, s.c);
    });
  }

  // ---------------------------------------------------------------- rules
  function flood(r, c, t) {
    var seen = {}, out = [], stack = [{ r: r, c: c }];
    seen[r + ',' + c] = true;
    while (stack.length) {
      var p = stack.pop(); out.push(p);
      var nb = neighbours(p.r, p.c);
      for (var i = 0; i < nb.length; i++) {
        var k = nb[i].r + ',' + nb[i].c, gm = grid[nb[i].r][nb[i].c];
        if (!seen[k] && gm && gm.t === t) { seen[k] = true; stack.push(nb[i]); }
      }
    }
    return out;
  }
  function fadeOut(cells, done) {
    var gems = cells.map(function (p) { return grid[p.r][p.c]; });
    tween(0.3, function (k) { gems.forEach(function (gm) { if (gm) gm.a = 1 - k; }); }, function () {
      cells.forEach(function (p, i) { if (grid[p.r][p.c] === gems[i]) grid[p.r][p.c] = null; });
      done();
    });
  }

  function applyRules(t, r, c) {
    if (t === 'S') { explode(r, c); return; }
    if (t === 'W') { whiteTransform(r, c); endRules(); return; }
    var grp = flood(r, c, t), n = grp.length, pts = 0;
    if (n >= 6) pts = rampage() * n * coef * 2;
    else if (n >= 3) pts = rampage() * n * coef;
    score += pts;
    if (pts > 0) popups.push({ v: pts, t: 0 });
    if (n >= 3) {
      if (rnd(100) % n === 0) spawnSkill(t, cx(r, c), cy(r));
      sfx(rnd(2) ? 'zvukSpojenie1' : 'zvukSpojenie2');
      fadeOut(grp, dropFloating);
    } else endRules();
  }

  function whiteTransform(r, c) {
    var nb = neighbours(r, c), cand = [];
    for (var i = 0; i < nb.length; i++) {
      var gm = grid[nb[i].r][nb[i].c];
      if (gm && gm.t !== 'S' && gm.t !== 'Q' && gm.t !== 'W') cand.push(gm.t);
    }
    var colors = ['R', 'B', 'G', 'Y'];
    grid[r][c].t = cand.length ? cand[rnd(cand.length)] : colors[rnd(4)];
    rings.push({ x: cx(r, c), y: cy(r), t: 0, col: '255,255,255' });
  }

  function explode(r, c) {
    var seen = {}, waves = [];
    function ex(a, b) {
      seen[a + ',' + b] = true;
      var nb = neighbours(a, b), wave = [], skulls = [], i;
      for (i = 0; i < nb.length; i++) {
        var k = nb[i].r + ',' + nb[i].c, gm = grid[nb[i].r][nb[i].c];
        if (gm && !seen[k]) { seen[k] = true; wave.push(nb[i]); if (gm.t === 'S') skulls.push(nb[i]); }
      }
      if (!waves.length) wave.push({ r: a, c: b });
      waves.push({ cells: wave, x: cx(a, b), y: cy(a) });
      for (i = 0; i < skulls.length; i++) ex(skulls[i].r, skulls[i].c);
    }
    ex(r, c);
    var ix = 0;
    (function next() {
      if (ix >= waves.length) { dropFloating(); return; }
      var w = waves[ix++];
      sfx('zvukVybuchSmrtky1');
      rings.push({ x: w.x, y: w.y, t: 0, col: '255,180,80' });
      w.cells.forEach(function (p) {
        var gm = grid[p.r][p.c];
        if (gm && gm.t === 'Q') questionResult(cx(p.r, p.c), cy(p.r));
      });
      if (!w.cells.length) { next(); return; }
      fadeOut(w.cells, next);
    })();
  }

  function questionResult(x, y) {
    var q = rnd(100);
    if (q < 10 || q >= 90) {
      fallers.push({ kind: 'score', v: QUESTION_BONUS, x: x, y: y, vy: (H - 37 - y) / 4, endY: H - 20, t: 0 });
      sfx(rnd(2) ? 'zvukBonusCislo1' : 'zvukBonusCislo2');
    } else spawnSkill(q < 30 ? 'R' : q < 50 ? 'G' : q < 70 ? 'B' : 'Y', x, y);
  }
  function spawnSkill(t, x, y) {
    var endY = GUN_Y + GUN_H - 30;
    fallers.push({ kind: 'skill', type: t, x: x, y: y, vy: Math.max(60, (endY - y) / 3), endY: endY, t: 0 });
    sfx('zvukBonusGulicka' + (1 + rnd(4)));
  }

  // gems that are no longer connected to the top fall off
  function dropFloating() {
    var seen = {}, stack = [], r, c;
    for (r = 0; r < ROWS; r++) for (c = 0; c < COLS; c++) {
      var gm = grid[r][c];
      if (gm && (boss ? gm.anchor : r === 0)) { seen[r + ',' + c] = true; stack.push({ r: r, c: c }); }
    }
    while (stack.length) {
      var p = stack.pop(), nb = neighbours(p.r, p.c);
      for (var i = 0; i < nb.length; i++) {
        var k = nb[i].r + ',' + nb[i].c;
        if (!seen[k] && grid[nb[i].r][nb[i].c]) { seen[k] = true; stack.push(nb[i]); }
      }
    }
    var fade = [];
    eachGem(function (gm2, a, b) {
      if (seen[a + ',' + b]) return;
      if (!boss && gm2.t === 'S') {
        grid[a][b] = null;
        var endY = GUN_Y + GUN_H;
        fallers.push({ kind: 'skull', x: cx(a, b), y: cy(a), vy: Math.max(60, (endY - cy(a)) / 3), endY: endY, t: 0 });
      } else fade.push({ r: a, c: b });
    });
    if (fade.length) fadeOut(fade, endRules); else endRules();
  }

  function prune(src, keep) {
    var present = {};
    eachGem(function (gm) { present[gm.t] = true; });
    for (var i = src.length - 1; i >= 0; i--) if (!present[src[i]] && keep.indexOf(src[i]) < 0) src.splice(i, 1);
  }
  function levelDone() {
    var any = false, top = false;
    eachGem(function (gm, r) { any = true; if (r === 0) top = true; });
    return boss ? !any : !top;
  }
  function endRules() {
    if (pendingGreen) { pendingGreen = false; moveUp(); return; }
    prune(level.tableSrc, []);
    prune(level.gunSrc, ['S', 'W']);
    if (levelDone()) {
      lvl = (lvl + 1) % LEVELS.length;
      startLevel();
      return;
    }
    phase = 'aim'; descentT = 0;
  }

  // every 7 idle seconds the whole table moves one line down
  function moveDown() {
    var over = false, c;
    for (c = 0; c < COLS; c++) if (grid[ROWS - 1][c]) over = true;
    if (boss && bossSteps <= 0) over = true;
    phase = 'busy';
    if (over) { if (takeLife()) startLevel(); return; }
    var old = [];
    eachGem(function (gm) { old.push(gm); gm.dy = -S; });
    grid.pop();
    var row = emptyRow();
    if (boss) bossSteps--;
    else for (c = 0; c < COLS; c++) { row[c] = gem(level.gen.pick(level.tableSrc)); row[c].dx = -W; }
    grid.unshift(row);
    parity ^= 1;
    tween(0.25, function (k) { old.forEach(function (gm) { gm.dy = -S * (1 - k); }); }, function () {
      if (boss) { endRules(); return; }
      tween(0.25, function (k) { row.forEach(function (gm) { if (gm) gm.dx = -W * (1 - k); }); }, dropFloating);
    });
  }
  // "Timewarp": the top line disappears and everything moves one line up
  function moveUp() {
    phase = 'busy';
    var top = [];
    for (var c = 0; c < COLS; c++) if (grid[0][c]) top.push({ r: 0, c: c });
    fadeOut(top, function () {
      var rest = [];
      grid.shift(); grid.push(emptyRow());
      parity ^= 1;
      eachGem(function (gm) { rest.push(gm); gm.dy = S; });
      tween(0.25, function (k) { rest.forEach(function (gm) { gm.dy = S * (1 - k); }); }, dropFloating);
    });
  }

  function applySkill(t) {
    textEffect(SKILL_TEXT[t], null, null);
    if (t === 'R') { bullet = 'S'; nextBullet = 'S'; }
    else if (t === 'B') freezeT = DESCENT_TIME * 2;
    else if (t === 'Y') { rampageOn = true; rampageCount = 5; }
    else if (t === 'G') { if (phase === 'aim') moveUp(); else pendingGreen = true; }
  }

  // ---------------------------------------------------------------- falling things
  function stepFallers(dt) {
    var gx = gunX + 30, gy = GUN_Y, gw = GUN_W - 60, gh = GUN_H - 10;
    for (var i = fallers.length - 1; i >= 0; i--) {
      var f = fallers[i];
      f.t += dt; f.y += f.vy * dt;
      var hw = f.kind === 'score' ? 24 : 14;
      if (f.x + hw > gx && f.x - hw < gx + gw && f.y + 14 > gy && f.y - 14 < gy + gh) {
        fallers.splice(i, 1);
        if (f.kind === 'skull') bullet = 'S';
        else if (f.kind === 'skill') applySkill(f.type);
        else if (f.kind === 'score') score += f.v;
        else if (f.kind === 'danger') { score = Math.max(0, score - DANGER_PENALTY); rings.push({ x: f.x, y: f.y, t: 0, col: '255,60,60' }); takeLife(); }
        if (dialog) return;
        continue;
      }
      if (f.y >= f.endY) {
        fallers.splice(i, 1);
        if (f.kind === 'score') score = Math.max(0, score - f.v);
      }
    }
    var danger = false;
    for (i = 0; i < fallers.length; i++) if (fallers[i].kind === 'danger') danger = true;
    if (!danger && phase !== 'intro' && Math.random() < dt * 24 / 100) {
      spawnDanger(TX + 16 + rnd(361 + 100));
    }
  }

  function spawnDanger(x) {
    fallers.push({ kind: 'danger', x: x, y: -30, vy: 125, endY: H + 20, t: 0 });
  }

  // ---------------------------------------------------------------- effects
  function textEffect(name, number, done) { effects.push({ img: name, n: number, t: 0, done: done }); }
  function stepEffects(dt) {
    var i;
    for (i = effects.length - 1; i >= 0; i--) {
      var e = effects[i]; e.t += dt;
      if (e.t >= 1.3) { effects.splice(i, 1); if (e.done) e.done(); }
    }
    for (i = popups.length - 1; i >= 0; i--) { popups[i].t += dt; if (popups[i].t >= 1) popups.splice(i, 1); }
    for (i = rings.length - 1; i >= 0; i--) { rings[i].t += dt; if (rings[i].t >= 0.35) rings.splice(i, 1); }
  }

  // ---------------------------------------------------------------- update
  function update(dt) {
    clock += dt;
    if (screen !== 'play' || dialog) return;
    stepEffects(dt);
    stepTweens(dt);
    if (phase === 'intro') return;

    gunDir = keyL && !keyR ? -1 : keyR && !keyL ? 1 : 0;
    if (gunDir) gunX = clamp(gunX + gunDir * GUN_SPEED * dt, GUN_MIN, GUN_MAX);

    stepFallers(dt);
    if (dialog) return;

    if (coef > 0) { coefT += dt; if (coefT >= COEF_TIME) { coefT = 0; coef--; } }
    if (freezeT > 0) freezeT -= dt;
    if (phase === 'aim') {
      if (freezeT <= 0) descentT += dt;
      if (descentT >= DESCENT_TIME) { descentT = 0; moveDown(); }
    }
    if (phase === 'aim') computeShot(); else shot = null;
  }

  // ---------------------------------------------------------------- drawing
  function draw(name, x, y, w, h) {
    var i = img[name];
    if (!i || !i.complete || !i.naturalWidth) return;
    if (w) g.drawImage(i, x, y, w, h); else g.drawImage(i, x, y);
  }
  function drawGem(t, x, y, scale, alpha) {
    var s = S * (scale || 1);
    if (alpha !== undefined && alpha < 1) { g.save(); g.globalAlpha = Math.max(0, alpha); draw(GEM_IMG[t], x - s / 2, y - s / 2, s, s); g.restore(); }
    else draw(GEM_IMG[t], x - s / 2, y - s / 2, s, s);
  }
  function drawNumber(v, prefix, x, y, centre) {
    var str = String(v), w = prefix === 'nB' ? 42 : 33, step = w - 15, total = step * (str.length - 1) + w;
    if (centre) x -= total / 2;
    for (var i = 0; i < str.length; i++) draw(prefix + str[i], x + i * step, y);
    return total;
  }
  function text(str, x, y, size, color, align, bold) {
    g.font = (bold ? 'bold ' : '') + size + 'px Verdana, Geneva, sans-serif';
    g.fillStyle = color; g.textAlign = align || 'left'; g.textBaseline = 'middle';
    g.fillText(str, x, y);
  }

  function drawBackdrop() {
    g.fillStyle = '#05090f'; g.fillRect(0, 0, W, H);
    draw('lavobok', 0, 0);
    draw('pravobok', 633, 0);
    draw('backgroundImage', 103, 0);
    g.save();
    g.beginPath(); g.rect(122, 15, 511, 544); g.clip();
    g.globalAlpha = 0.45;
    var off = (clock * 24) % 885;
    draw('backgroundImageMask', 122, 15 + off - 885);
    draw('backgroundImageMask', 122, 15 + off);
    g.restore();
  }

  function drawPlay() {
    var i, r, c;
    drawBackdrop();

    // time left until the table moves down
    if (phase !== 'intro') {
      g.fillStyle = freezeT > 0 ? 'rgba(120,200,255,0.9)' : 'rgba(24,209,248,0.55)';
      var left = freezeT > 0 ? 1 : 1 - descentT / DESCENT_TIME;
      g.fillRect(TX, 9, (COLS * S + R) * clamp(left, 0, 1), 3);
    }

    g.save();
    g.beginPath(); g.rect(122, 0, 513, H); g.clip();
    for (r = 0; r < ROWS; r++) for (c = 0; c < COLS; c++) {
      var gm = grid[r][c];
      if (gm) drawGem(gm.t, cx(r, c) + gm.dx, cy(r) + gm.dy, 1, gm.a);
    }
    g.restore();

    // aiming line and target cell
    if (shot && !dialog) {
      g.save();
      g.strokeStyle = 'rgba(144,255,251,0.75)'; g.lineWidth = 2; g.setLineDash([3, 7]);
      g.beginPath(); g.moveTo(shot.pts[0].x, shot.pts[0].y);
      for (i = 1; i < shot.pts.length; i++) g.lineTo(shot.pts[i].x, shot.pts[i].y);
      g.stroke(); g.setLineDash([]);
      g.strokeStyle = 'rgba(255,255,255,0.9)'; g.lineWidth = 1.5;
      g.beginPath(); g.arc(cx(shot.r, shot.c), cy(shot.r), R - 1, 0, Math.PI * 2); g.stroke();
      g.restore();
      drawGem(bullet, cx(shot.r, shot.c), cy(shot.r), 1, 0.3);
    }

    for (i = 0; i < rings.length; i++) {
      var q = rings[i].t / 0.35;
      g.strokeStyle = 'rgba(' + rings[i].col + ',' + (1 - q) + ')'; g.lineWidth = 4 * (1 - q) + 1;
      g.beginPath(); g.arc(rings[i].x, rings[i].y, R + q * 45, 0, Math.PI * 2); g.stroke();
    }

    if (flying) drawGem(flying.t, flying.x, flying.y);

    // gun
    draw('imageGun', gunX, GUN_Y);
    if (gunDir < 0) draw('imageSipkaLeft', gunX + 36, GUN_Y + 3);
    if (gunDir > 0) draw('imageSipkaRight', gunX + 115, GUN_Y + 3);
    if (!flying) drawGem(bullet, gunX + GUN_W / 2, GUN_Y);
    drawGem(nextBullet, gunX + GUN_W / 2 - 0.5, GUN_Y + 46.5, 0.7);

    // falling skills, skulls, score and danger
    for (i = 0; i < fallers.length; i++) {
      var f = fallers[i];
      g.save();
      if (f.kind === 'score') drawNumber(f.v, 'nB', f.x, f.y - 18, true);
      else {
        var pulse = 0.5 + 0.5 * Math.sin(f.t * Math.PI * 2 * (f.kind === 'danger' ? 1.25 : 1));
        g.shadowColor = f.kind === 'danger' ? '#ffe08d' : f.kind === 'skull' ? '#ffffff' : '#90fffb';
        g.shadowBlur = 6 + pulse * 22;
        if (f.kind === 'danger') draw('dangerImage', f.x - R, f.y - R, S, S);
        else drawGem(f.kind === 'skull' ? 'S' : f.type, f.x, f.y);
      }
      g.restore();
    }

    drawHud();

    for (i = 0; i < popups.length; i++) {
      var p = popups[i];
      g.save();
      g.globalAlpha = p.t < 0.5 ? p.t * 2 : 2 - p.t * 2;
      drawNumber(p.v, 'nR', 350, 300 + Math.min(1, p.t * 2) * 18, false);
      g.restore();
    }
    for (i = 0; i < effects.length; i++) {
      var e = effects[i], im = img[e.img];
      if (!im || !im.naturalWidth) continue;
      var k = e.t / 0.65, a = k < 1 ? k : 2 - k, sc = 0.5 + a;
      g.save();
      g.globalAlpha = clamp(a, 0, 1);
      g.translate(TX + (COLS * S + R) / 2, H / 2 - 20); g.scale(sc, sc);
      var tw = im.naturalWidth + (e.n !== null ? 27 * String(e.n).length + 5 : 0);
      g.drawImage(im, -tw / 2, -im.naturalHeight / 2);
      if (e.n !== null) drawNumber(e.n, 'nB', -tw / 2 + im.naturalWidth - 10, -18, false);
      g.restore();
    }
  }

  function drawHud() {
    text(String(score), 719, 47, 13, '#18d1f8', 'center', true);
    text('\u00a9 directly2you ltd.', 55, 563, 8, '#8fd6e8', 'center');
    g.fillStyle = COEF_COLORS[coef]; g.fillRect(667, 60, 107, 7);
    for (var i = 0; i < life; i++) draw('pravaStranaLajf', 633 + [38, 64, 88][i], 533);
    draw(sfxOn || musicOn ? 'pravaStranaSoundON' : 'pravaStranaSoundOFF', 753, 549);
    text('LEVEL ' + (lvl + 1) + (boss ? ' · BOSS' : ''), 719, 110, 10, '#8fd6e8', 'center', true);
    text('points x' + coef, 719, 126, 9, '#5fa9bd', 'center');
    var y = 150;
    if (rampageOn) { text('RAMPAGE x2', 719, y, 10, '#ffe45c', 'center', true); y += 16; }
    if (freezeT > 0) { text('FREEZE ' + Math.ceil(freezeT) + 's', 719, y, 10, '#8fc8ff', 'center', true); y += 16; }
    if (boss) text('boss moves: ' + bossSteps, 719, y, 9, '#5fa9bd', 'center');
  }

  // these two dialog images have a white margin baked in, so it is clipped away
  function drawDialog(name, x, y) {
    g.save();
    g.beginPath();
    if (g.roundRect) g.roundRect(x + 10, y + 9, 343, 333, 9); else g.rect(x + 10, y + 9, 343, 333);
    g.clip();
    draw(name, x, y);
    g.restore();
  }
  function drawSoundMenu() {
    panel(SM.x, SM.y, SM.w, SM.h);
    var rows = [['Effects', sfxOn], ['Music', musicOn]];
    for (var i = 0; i < rows.length; i++) {
      var y = SM.y + 8 + i * SM.row, over = mouse.x >= SM.x && mouse.x <= SM.x + SM.w && mouse.y >= y && mouse.y < y + SM.row;
      if (over) { g.fillStyle = 'rgba(24,209,248,0.15)'; g.fillRect(SM.x + 4, y, SM.w - 8, SM.row); }
      text(rows[i][0], SM.x + 14, y + SM.row / 2, 12, '#e8fbff', 'left', true);
      text(rows[i][1] ? 'ON' : 'OFF', SM.x + SM.w - 14, y + SM.row / 2, 12, rows[i][1] ? '#7dff6b' : '#ff6b6b', 'right', true);
    }
  }
  function panel(x, y, w, h) {
    g.fillStyle = 'rgba(10,36,52,0.98)'; g.strokeStyle = '#3aa7c4'; g.lineWidth = 2;
    g.beginPath();
    if (g.roundRect) g.roundRect(x, y, w, h, 10); else g.rect(x, y, w, h);
    g.fill(); g.stroke();
  }

  function drawMenuBase() {
    g.fillStyle = '#05090f'; g.fillRect(0, 0, W, H);
    g.save(); g.globalAlpha = 0.35;
    var off = (clock * 24) % 885;
    draw('backgroundImageMask', 136, off - 885); draw('backgroundImageMask', 136, off);
    g.restore();
  }

  function render() {
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, W, H);
    if (screen === 'loading') {
      g.fillStyle = '#05090f'; g.fillRect(0, 0, W, H);
      var total = IMAGES.length;
      text('Loading BUBLIOTS…', W / 2, H / 2 - 20, 16, '#18d1f8', 'center', true);
      g.strokeStyle = '#18d1f8'; g.strokeRect(W / 2 - 150, H / 2 + 5, 300, 12);
      g.fillStyle = '#18d1f8'; g.fillRect(W / 2 - 148, H / 2 + 7, 296 * loaded / total, 8);
      if (loaded >= total) screen = 'menu';
      return;
    }
    if (screen === 'menu') { drawMenuBase(); draw('menuPodklad', 136, 14); }
    else if (screen === 'howto') {
      drawMenuBase(); draw('tutorial', 136, 14);
      text('Click anywhere to go back', W / 2, 530, 11, '#0e3b4d', 'center', true);
    }
    else if (screen === 'rank') {
      drawMenuBase(); draw('menuPodklad', 136, 14);
      panel(196, 62, 391, 400);
      text('RANKLIST', W / 2, 88, 18, '#ffe45c', 'center', true);
      var list = loadRank();
      if (!list.length) text('No scores yet – go and play!', W / 2, 250, 12, '#8fd6e8', 'center');
      for (var i = 0; i < list.length; i++) {
        var yy = 125 + i * 31, me = list[i].name === lastName && list[i].score === score;
        text((i + 1) + '.', 240, yy, 13, me ? '#ffe45c' : '#8fd6e8', 'right', true);
        text(list[i].name, 252, yy, 13, me ? '#ffe45c' : '#e8fbff', 'left');
        text(String(list[i].score), 560, yy, 13, me ? '#ffe45c' : '#18d1f8', 'right', true);
      }
      text('This ranklist is stored in this browser only.', W / 2, 444, 9, '#5fa9bd', 'center');
      text('Click anywhere to go back', W / 2, 530, 11, '#0e3b4d', 'center', true);
    }
    else if (screen === 'play') {
      drawPlay();
      if (soundMenu && !dialog) drawSoundMenu();
      if (dialog) {
        g.fillStyle = 'rgba(0,0,0,0.55)'; g.fillRect(0, 0, W, H);
        if (dialog === 'menu') drawDialog('inGameMenu', 210, 110);
        if (dialog === 'gameover') drawDialog('GameOver_podklad', 210, 110);
        if (dialog === 'score') {
          draw('ScoreDialog_podklad', 241, 157);
          text(String(score), 241 + 129, 157 + 55, 13, '#18d1f8', 'center', true);
          text(String(bestScore()), 241 + 129, 157 + 107, 13, '#18d1f8', 'center', true);
        }
      }
    }
    if (screen === 'menu' || screen === 'howto' || screen === 'rank') text(COPYRIGHT, W / 2, H - 9, 10, '#5fa9bd', 'center');
    var btns = buttons();
    for (var b = 0; b < btns.length; b++) {
      var bt = btns[b], st = pressed === bt.id ? 2 : hit(bt, mouse) ? 1 : 0;
      draw(bt.skin[st], bt.x, bt.y);
    }
  }

  // ---------------------------------------------------------------- buttons
  function B(id, x, y, w, h, base, over, act, pad) {
    return { id: id, x: x, y: y, w: w, h: h, pad: pad || 0, skin: [base + 'Off', base + over, base + 'Active'], act: act };
  }
  function hit(b, p) {
    return p.x >= b.x + b.pad && p.x <= b.x + b.w - b.pad && p.y >= b.y + b.pad && p.y <= b.y + b.h - b.pad;
  }
  function buttons() {
    if (screen === 'menu') return [
      B('play', 216, 94, 343, 102, 'menuPlay', 'Rollover', newGame, 14),
      B('howto', 216, 184, 346, 103, 'menuHowToPlay', 'Rollover', function () { screen = 'howto'; }, 14),
      B('rank', 216, 284, 348, 109, 'menuRanklist', 'Rollover', function () { screen = 'rank'; }, 14)];
    if (screen !== 'play') return [];
    if (dialog === 'menu') return [
      B('cont', 290, 265, 260, 56, 'inGameMenuContinue', 'Glow', function () { dialog = null; }, 6),
      B('new', 290, 310, 260, 55, 'inGameMenuNewGame', 'Glow', newGame, 6),
      B('exit', 290, 350, 266, 59, 'inGameMenuExit', 'Glow', function () { dialog = null; screen = 'menu'; }, 6)];
    if (dialog === 'gameover') return [
      B('submit', 290, 320, 114, 61, 'GameOver_submit', 'Rollover', submitScore, 4),
      B('cancel', 388, 320, 115, 60, 'GameOver_cancel', 'Rollover', function () { hideName(); dialog = null; screen = 'menu'; }, 4)];
    if (dialog === 'score') return [
      B('again', 261, 277, 132, 65, 'ScoreDialog_playAgain', 'Rollover', newGame, 4),
      B('publish', 376, 277, 132, 67, 'ScoreDialog_publish', 'Rollover', function () { dialog = null; screen = 'rank'; }, 4)];
    return [B('pause', 5, 5, 91, 55, 'lavaStranaMenuButton', 'Glow', function () { dialog = 'menu'; }, 4)];
  }
  // ---------------------------------------------------------------- ranklist (local)
  function loadRank() {
    try { var l = JSON.parse(localStorage.getItem('bubliots.ranklist') || '[]'); return Array.isArray(l) ? l : []; }
    catch (e) { return []; }
  }
  function bestScore() {
    var l = loadRank(), b = Math.max(bestSession, score);
    for (var i = 0; i < l.length; i++) if (l[i].score > b) b = l[i].score;
    return b;
  }
  function submitScore() {
    var n = nameInput ? nameInput.value.replace(/^\s+|\s+$/g, '') : 'Player';
    if (!n) { if (nameInput) { nameInput.placeholder = 'Please enter your nickname!'; nameInput.focus(); } return; }
    lastName = n.slice(0, 16);
    var l = loadRank();
    l.push({ name: lastName, score: score, date: new Date().toISOString().slice(0, 10) });
    l.sort(function (a, b) { return b.score - a.score; });
    l = l.slice(0, 10);
    try { localStorage.setItem('bubliots.ranklist', JSON.stringify(l)); } catch (e) { /* storage unavailable */ }
    hideName();
    dialog = 'score';
  }
  function showName() {
    if (!nameInput) return;
    nameInput.style.display = 'block'; nameInput.value = lastName;
    layoutName();
    setTimeout(function () { try { nameInput.focus(); } catch (e) { /* ignore */ } }, 50);
  }
  function hideName() { if (nameInput) nameInput.style.display = 'none'; }
  function layoutName() {
    if (!nameInput) return;
    var k = cv.clientWidth / W;
    nameInput.style.left = (cv.offsetLeft + 277 * k) + 'px';
    nameInput.style.top = (cv.offsetTop + 283 * k) + 'px';
    nameInput.style.width = (233 * k) + 'px';
    nameInput.style.height = (20 * k) + 'px';
    nameInput.style.fontSize = (12 * k) + 'px';
  }
  window.addEventListener('resize', layoutName);

  // ---------------------------------------------------------------- input
  function pos(e) {
    var b = cv.getBoundingClientRect();
    return { x: (e.clientX - b.left) * W / b.width, y: (e.clientY - b.top) * H / b.height };
  }
  cv.addEventListener('pointermove', function (e) {
    mouse = pos(e);
    if (touchGun) gunX = clamp(mouse.x - GUN_W / 2, GUN_MIN, GUN_MAX);
  });
  cv.addEventListener('pointerdown', function (e) {
    mouse = pos(e); pressed = null; touchGun = false;
    var btns = buttons();
    for (var i = 0; i < btns.length; i++) if (hit(btns[i], mouse)) pressed = btns[i].id;
    if (!pressed && screen === 'play' && !dialog && e.pointerType === 'touch' && mouse.y > GUN_Y - 15) touchGun = true;
    try { cv.setPointerCapture(e.pointerId); } catch (er) { /* ignore */ }
    e.preventDefault();
  });
  cv.addEventListener('pointerup', function (e) {
    mouse = pos(e);
    var was = pressed, wasGun = touchGun;
    pressed = null; touchGun = false;
    if (was) {
      var btns = buttons();
      for (var i = 0; i < btns.length; i++) if (btns[i].id === was && hit(btns[i], mouse)) { btns[i].act(); syncMusic(); return; }
      return;
    }
    if (screen === 'howto' || screen === 'rank') { screen = 'menu'; return; }
    if (screen !== 'play' || dialog || wasGun) return;
    if (mouse.x >= 748 && mouse.x <= 780 && mouse.y >= 543 && mouse.y <= 572) { soundMenu = !soundMenu; return; }
    if (soundMenu) {
      if (mouse.x >= SM.x && mouse.x <= SM.x + SM.w && mouse.y >= SM.y + 8 && mouse.y < SM.y + 8 + 2 * SM.row) {
        if (mouse.y < SM.y + 8 + SM.row) sfxOn = !sfxOn; else musicOn = !musicOn;
        saveSound(); syncMusic();
      } else soundMenu = false;
      return;
    }
    if (mouse.x >= 122 && mouse.x <= 634) fire();
  });
  cv.addEventListener('contextmenu', function (e) { e.preventDefault(); });

  function key(e, down) {
    if (e.target === nameInput) { if (down && e.key === 'Enter') submitScore(); return; }
    var k = e.key;
    if (k === 'ArrowLeft' || k === 'a' || k === 'A') keyL = down;
    else if (k === 'ArrowRight' || k === 'd' || k === 'D') keyR = down;
    else if (down && (k === ' ' || k === 'ArrowUp')) fire();
    else if (down && (k === 'Escape' || k === 'p' || k === 'P')) {
      if (screen === 'play' && !dialog) dialog = 'menu';
      else if (screen === 'play' && dialog === 'menu') dialog = null;
      else if (screen === 'howto' || screen === 'rank') screen = 'menu';
    } else return;
    if (screen === 'play') e.preventDefault();
  }
  window.addEventListener('keydown', function (e) { key(e, true); });
  window.addEventListener('keyup', function (e) { key(e, false); });
  window.addEventListener('blur', function () { keyL = keyR = false; });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && screen === 'play' && !dialog) dialog = 'menu';
  });

  // ---------------------------------------------------------------- main loop
  var last = 0;
  function frame(ts) {
    var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0;
    last = ts;
    try { update(dt); render(); syncMusic(); } catch (err) { if (window.console) console.error(err); }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /*DEV-START*/
  // small hook used for automated testing (removed from the minified build)
  window.BUBLIOTS = {
    state: function () {
      var n = 0; if (grid) eachGem(function () { n++; });
      return { music: music ? !music.paused : null, sfxOn: sfxOn, musicOn: musicOn, soundMenu: soundMenu, screen: screen, dialog: dialog, phase: phase, score: score, life: life, level: lvl, gems: n, bullet: bullet, loaded: loaded, total: IMAGES.length };
    },
    // developer helpers: BUBLIOTS.dev.level(4) jumps to a level, BUBLIOTS.dev.skill('G') triggers a skill
    dev: {
      level: function (n) { if (screen !== 'play') newGame(); lvl = (n - 1 + LEVELS.length) % LEVELS.length; startLevel(); },
      skill: function (t) { if (screen === 'play') applySkill(t); },
      bullet: function (t) { bullet = t; },
      lives: function (n) { life = n; },
      danger: function () { if (screen === 'play') spawnDanger(gunX + GUN_W / 2); },
      lose: function () { if (screen === 'play' && !dialog) takeLife(); },
      score: function (n) { score = n; }
    }
  };
/*DEV-END*/
})();
