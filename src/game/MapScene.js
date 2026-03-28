/**
 * Pétaouchnok-les-Bains — MapScene.js
 * =====================================
 * Scène Phaser.js principale — map du village
 * Format : portrait mobile (480×854)
 * Tilesets : PixelLab Wang tilesets 32×32px
 */

const TILE_SIZE = 32;
const MAP_W = 20;
const MAP_H = 36;

// Heure → palette de teinte (jour/nuit)
const TIME_PALETTES = {
  morning: { tint: 0xffe8b0, alpha: 0.15 },   // 6h–9h : doré
  day:     { tint: 0xffffff, alpha: 0.0  },    // 9h–17h : neutre
  evening: { tint: 0xff9040, alpha: 0.22 },    // 17h–20h : orangé
  night:   { tint: 0x1a2045, alpha: 0.55 },    // 20h–6h : nuit
};

function getCurrentTimePalette() {
  const h = new Date().getHours();
  if (h >= 6  && h < 9)  return TIME_PALETTES.morning;
  if (h >= 9  && h < 17) return TIME_PALETTES.day;
  if (h >= 17 && h < 20) return TIME_PALETTES.evening;
  return TIME_PALETTES.night;
}

export default class MapScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MapScene' });
  }

  // ─────────────────────────────────────────
  // PRELOAD
  // ─────────────────────────────────────────
  preload() {
    // Tilemap JSON (généré par build_map.py)
    this.load.tilemapTiledJSON('map', '/assets/map/petaouchnok_map.json');

    // 4 tilesets individuels (chacun 128×128px)
    this.load.image('ts_grass_forest', '/assets/map/grass_forest.png');
    this.load.image('ts_grass_path',   '/assets/map/grass_path.png');
    this.load.image('ts_path_plaza',   '/assets/map/path_plaza.png');
    this.load.image('ts_grass_river',  '/assets/map/grass_river.png');

    // Sprites bâtiments (top-down, générés par PixelLab)
    const buildings = [
      'boulangerie','mairie','bibliotheque','epicerie','garage',
      'fleuriste','medecin','hublot','leonie','bulletin','maurice',
    ];
    buildings.forEach(name => {
      this.load.image(`bat_${name}`, `/assets/buildings/topdown/${name}_topdown.png`);
    });

    // Note: source.png et halo_gold.png ne sont pas chargés
    // car ils n'existent pas encore — on les dessine en code

    // Error handler pour éviter le crash silencieux
    this.load.on('loaderror', (file) => {
      console.warn('[MapScene] Échec chargement:', file.key, file.url);
    });
  }

  // ─────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────
  create() {
    console.log('[MapScene] create() — début');

    const { width, height } = this.scale;

    // ── Tilemap ──
    this.map = this.make.tilemap({ key: 'map' });

    // 4 tilesets individuels — chacun mappé sur son propre PNG
    const tsForet   = this.map.addTilesetImage('grass_forest', 'ts_grass_forest', TILE_SIZE, TILE_SIZE, 0, 0);
    const tsChemins = this.map.addTilesetImage('grass_path',   'ts_grass_path',   TILE_SIZE, TILE_SIZE, 0, 0);
    const tsPlace   = this.map.addTilesetImage('path_plaza',   'ts_path_plaza',   TILE_SIZE, TILE_SIZE, 0, 0);
    const tsRiviere = this.map.addTilesetImage('grass_river',  'ts_grass_river',  TILE_SIZE, TILE_SIZE, 0, 0);

    const allTilesets = [tsForet, tsChemins, tsPlace, tsRiviere].filter(Boolean);

    console.log('[MapScene] Tilesets chargés:', allTilesets.length);

    // Layers terrain (ordre d'affichage : bas → haut)
    // Chaque layer doit recevoir tous les tilesets pour pouvoir résoudre tous les GIDs
    this.layerForet    = this.map.createLayer('Forêt',           allTilesets, 0, 0);
    this.layerChemins  = this.map.createLayer('Chemins',         allTilesets, 0, 0);
    this.layerPlace    = this.map.createLayer('Place centrale',  allTilesets, 0, 0);
    this.layerRiviere  = this.map.createLayer('Rivière',         allTilesets, 0, 0);

    const layers = [this.layerForet, this.layerChemins, this.layerPlace, this.layerRiviere];
    console.log('[MapScene] Layers créés:', layers.filter(Boolean).length, '/ 4');

    // ── Layer objets — bâtiments ──
    this.buildingGroup = this.add.group();
    this._placeBuildingsFromTiled();

    // ── Source thermale (dessinée en code, pas de sprite) ──
    this._placeSource();

    // ── Overlay lumière (jour/nuit) ──
    this.lightOverlay = this.add.rectangle(
      MAP_W * TILE_SIZE / 2,
      MAP_H * TILE_SIZE / 2,
      MAP_W * TILE_SIZE,
      MAP_H * TILE_SIZE,
      0xffffff, 0
    ).setDepth(100);
    this._applyTimePalette();

    // ── Caméra ──
    const mapPixelW = MAP_W * TILE_SIZE;
    const mapPixelH = MAP_H * TILE_SIZE;
    this.cameras.main.setBounds(0, 0, mapPixelW, mapPixelH);

    // Centrer sur la place centrale au démarrage
    const plazaCX = 10 * TILE_SIZE;
    const plazaCY = (MAP_H / 2) * TILE_SIZE;
    this.cameras.main.centerOn(plazaCX, plazaCY);

// ── Scroll tactile ──
    this.input.on('pointermove', (pointer) => {
      if (!pointer.isDown) return;
      this.cameras.main.scrollX -= pointer.velocity.x / 8;
      this.cameras.main.scrollY -= pointer.velocity.y / 8;
    });

    // ── Mise à jour heure toutes les minutes ──
    this.time.addEvent({
      delay: 60000,
      callback: this._applyTimePalette,
      callbackScope: this,
      loop: true,
    });

    console.log('[MapScene] create() — terminé');
  }

  // ─────────────────────────────────────────
  // BÂTIMENTS — Placement depuis objets Tiled
  // ─────────────────────────────────────────
  _placeBuildingsFromTiled() {
    const objectLayer = this.map.getObjectLayer('Bâtiments');
    if (!objectLayer) {
      console.warn('[MapScene] Layer "Bâtiments" introuvable');
      return;
    }

    console.log('[MapScene] Objets Tiled:', objectLayer.objects.length);

    objectLayer.objects.forEach(obj => {
      if (obj.type !== 'building') return;

      const spriteProp = obj.properties?.find(p => p.name === 'sprite');
      const spriteKey  = spriteProp ? spriteProp.value : null;
      if (!spriteKey || !this.textures.exists(spriteKey)) {
        console.warn('[MapScene] Sprite manquant pour', obj.name, spriteKey);
        return;
      }

      const sprite = this.add.image(
        obj.x + obj.width / 2,
        obj.y + obj.height / 2,
        spriteKey
      ).setDepth(obj.y); // Depth = Y pour tri correct

      // Adapter la taille du sprite à la zone Tiled
      const tex = this.textures.get(spriteKey).getSourceImage();
      const scaleX = obj.width / tex.width;
      const scaleY = obj.height / tex.height;
      const scale = Math.min(scaleX, scaleY);
      sprite.setScale(scale);

      // Hitbox cliquable
      sprite.setInteractive();

      // Hover effect
      sprite.on('pointerover', () => {
        this.tweens.add({ targets: sprite, scaleX: scale * 1.08, scaleY: scale * 1.08, duration: 80 });
      });
      sprite.on('pointerout', () => {
        this.tweens.add({ targets: sprite, scaleX: scale, scaleY: scale, duration: 80 });
      });

      // Clic → ouvre l'écran du bâtiment
      sprite.on('pointerdown', () => {
        this._openBuilding(obj);
      });

      this.buildingGroup.add(sprite);
    });

    console.log('[MapScene] Bâtiments placés:', this.buildingGroup.getLength());
  }

  // ─────────────────────────────────────────
  // SOURCE THERMALE (dessinée en code)
  // ─────────────────────────────────────────
  _placeSource() {
    const objectLayer = this.map.getObjectLayer('Bâtiments');
    if (!objectLayer) return;

    const sourceObj = objectLayer.objects.find(o => o.name === 'source');
    if (!sourceObj) {
      console.warn('[MapScene] Objet "source" introuvable');
      return;
    }

    const cx = sourceObj.x + sourceObj.width / 2;
    const cy = sourceObj.y + sourceObj.height / 2;

    // Halo doré pulsant (dessiné via Graphics)
    const haloGraphics = this.add.graphics();
    haloGraphics.setDepth(5);
    haloGraphics.fillStyle(0xf5c842, 0.3);
    haloGraphics.fillCircle(cx, cy, 28);
    haloGraphics.fillStyle(0xffd700, 0.15);
    haloGraphics.fillCircle(cx, cy, 40);

    // Tween sur alpha pour le pulse
    this.tweens.add({
      targets: haloGraphics,
      alpha: { from: 0.5, to: 1 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Zone cliquable pour la source
    const hitZone = this.add.zone(cx, cy, sourceObj.width, sourceObj.height)
      .setInteractive()
      .setDepth(6);
    hitZone.on('pointerdown', () => {
      this._openSource();
    });

    console.log('[MapScene] Source placée à', cx, cy);
  }

  // ─────────────────────────────────────────
  // OVERLAY JOUR/NUIT
  // ─────────────────────────────────────────
  _applyTimePalette() {
    const palette = getCurrentTimePalette();
    this.lightOverlay.setFillStyle(palette.tint, palette.alpha);

    // Fenêtres allumées la nuit
    const isNight = palette === TIME_PALETTES.night;
    this.buildingGroup.getChildren().forEach(sprite => {
      sprite.setTint(isNight ? 0xaabbdd : 0xffffff);
    });
  }

  // ─────────────────────────────────────────
  // NAVIGATION — Ouverture bâtiment
  // ─────────────────────────────────────────
  _openBuilding(obj) {
    const labelProp    = obj.properties?.find(p => p.name === 'label');
    const residentProp = obj.properties?.find(p => p.name === 'resident');
    const event = new CustomEvent('petaouchnok:open-building', {
      detail: {
        id: obj.name,
        label: labelProp?.value || obj.name,
        resident: residentProp?.value || null,
        x: obj.x, y: obj.y,
      }
    });
    window.dispatchEvent(event);

    // Animation caméra — zoom vers le bâtiment
    this.cameras.main.pan(
      obj.x + obj.width / 2,
      obj.y + obj.height / 2,
      300, 'Power2'
    );
  }

  _openSource() {
    window.dispatchEvent(new CustomEvent('petaouchnok:open-source'));
  }

  // ─────────────────────────────────────────
  // UPDATE
  // ─────────────────────────────────────────
  update() {
    // Tri par profondeur Y pour les bâtiments
    this.buildingGroup.getChildren().forEach(child => {
      child.setDepth(child.y);
    });
  }
}
