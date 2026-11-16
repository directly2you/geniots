GENIOTS / BUBLIOTS / ENTROPIARTS - web prerobený do HTML5 (november 2026)
==========================================================================
Copyright (c) directly2you ltd. All rights reserved. Pozri LICENSE.

Spustenie
---------
Otvor site/index.html v prehliadači (dvojklik). Netreba Flash ani server.
Hra Bubliots je na stránke site/bubliots.html.

Štruktúra
---------
site/                       všetko, čo sa nahráva na hosting (publish directory)
  index.html, geniots.html, entropiarts.html      stránky webu
  geniots_gallery.html, survivors_gallery.html    galérie
  bubliots.html                                   stránka s hrou
  css/style.css                                   jeden štýl, 3 farebné témy
  js/site.js                                      lightbox pre galérie
  img/                                            obrázky webu a galérií
  bubliots/game.min.js                            hra - minifikovaná, so zámkom na doménu
  bubliots/assets/                                grafika, zvuky a hudba hry
src/game.js                 čitateľný zdrojový kód hry (NEnahrávať na hosting)
tools/build.js              zostaví site/bubliots/game.min.js zo src/game.js
LICENSE                     copyright directly2you ltd.

Úprava hry
----------
1. uprav src/game.js
2. npm install        (len prvýkrát, nainštaluje terser)
3. npm run build      (vytvorí site/bubliots/game.min.js)

Zámok na doménu
---------------
Hra sa spustí len na doménach zo zoznamu ALLOWED v src/game.js (a ich subdoménach)
a lokálne (file://, localhost). Teraz: directly2you.github.io, d2u.sk, geniots.com,
entropiarts.com. Po zmene zoznamu spusti npm run build.

Ovládanie hry
-------------
myš                 mierenie a streľba
šípky alebo A / D   pohyb dela
Esc alebo P         menu / pauza
ikona reproduktora  menu zvuku: zvlášť efekty a zvlášť hudba
na dotykovej obrazovke: ťuknutie = výstrel, ťahanie v spodnej časti = pohyb dela

Čo je inak než v pôvodnej Flash verzii
--------------------------------------
- Rebríček (Ranklist) sa ukladá len lokálne v prehliadači (pôvodný server už neexistuje).
- Reklamný panel (eTarget) je vynechaný.
- Hudba (assets/music.mp3) je doplnená zo zložky Zvuky/final; v pôvodnom SWF na webe nebola.
- Pravidlá sú zrekonštruované zo skompilovaného SWF; drobné rozdiely v správaní sú možné.
- Vývojárske pomôcky (BUBLIOTS.dev...) fungujú len pri načítaní src/game.js, v minifikovanej verzii nie sú.
