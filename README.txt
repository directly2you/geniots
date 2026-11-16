GENIOTS / BUBLIOTS / ENTROPIARTS - web prerobený do HTML5 (november 2026)
==========================================================================

Spustenie
---------
Stačí otvoriť index.html v prehliadači (dvojklik). Netreba Flash ani server.
Hra Bubliots je na stránke bubliots.html.

Štruktúra
---------
index.html, geniots.html, entropiarts.html      stránky webu
geniots_gallery.html, survivors_gallery.html    galérie
bubliots.html                                   stránka s hrou
css/style.css                                   jeden štýl, 3 farebné témy (theme-g / theme-b / theme-e)
js/site.js                                      lightbox pre galérie (bez jQuery)
img/                                            obrázky webu a galérií (z pôvodného webu)
bubliots/game.js                                hra Bubliots prepísaná do JavaScriptu (canvas)
bubliots/assets/                                pôvodná grafika a zvuky vytiahnuté z Bubliots.swf

Ovládanie hry
-------------
myš                 mierenie a streľba
šípky alebo A / D   pohyb dela
Esc alebo P         menu / pauza
ikona reproduktora  menu zvuku: zvlášť efekty a zvlášť hudba (zapamätá sa v prehliadači)
na dotykovej obrazovke: ťuknutie = výstrel, ťahanie v spodnej časti = pohyb dela

Čo je inak než v pôvodnej Flash verzii
--------------------------------------
- Rebríček (Ranklist) sa ukladá len lokálne v prehliadači (pôvodný server už neexistuje).
- Reklamný panel (eTarget) je vynechaný.
- Hudba (bubliots/assets/music.mp3) je doplnená zo zložky Zvuky/final; v pôvodnom SWF na webe nebola.
- Pravidlá sú zrekonštruované zo skompilovaného SWF; drobné rozdiely v správaní sú možné.
- Pre vývoj: v konzole prehliadača BUBLIOTS.dev.level(4) skočí na daný level (4 = prvý boss).
