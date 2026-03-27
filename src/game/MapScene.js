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
    this.load.tilemapTiledJSON('map', 'assets/map/petaouchnok_map.json');

    // Tileset maître assemblé (128×512px — 4 tilesets empilés)
    this.load.image('tileset_master', 'assets/map/tileset_master.png');

    // Sprites bâtiments (top-down, générés par PixelLab)
    const buildings = [
      'boulangerie','mairie','bibliotheque','epicerie','garage',
      'fleuriste','medecin','hublot','leonie','bulletin','maurice',
    ];
    buildings.forEach(name => {
      this.load.image(`bat_${name}`, `assets/buildings/topdown/${name}_topdown.png`);
    });

    // Source thermale (sprite animé)
    this.load.image('source', 'assets/map/source.png');

    // UI overlays
    this.load.image('halo_gold', 'assets/fx/halo_gold.png');
  }

  // ─────────────────────────────────────────
  // CREATE
  // ─────────────────────────────────────────
  create() {
    const { width, height } = this.scale;

    // ── Tilemap ──
    this.map = this.make.tilemap({ key: 'map' });

    // Ajouter le tileset maître
    // Chaque tileset PixelLab = 128×128px dans le PNG maître
    const tileset = this.map.addTilesetImage(
      'tileset_master',
      'tileset_master',
      TILE_SIZE, TILE_SIZE,
      0, 0
    );

    // Layers terrain (ordre d'affichage : bas → haut)
    this.layerForet    = this.map.createLayer('Forêt',           tileset, 0, 0);
    this.layerChemins  = this.map.createLayer('Chemins',         tileset, 0, 0);
    this.layerPlace    = this.map.createLayer('Place centrale',  tileset, 0, 0);
    this.layerRiviere  = this.map.createLayer('Rivière',         tileset, 0, 0);

    // Pixel art : désactiver l'antialiasing
    [this.layerForet, this.layerChemins, this.layerPlace, this.layerRiviere].forEach(l => {
      l.setScale(1);
      if (l.tileset) l.tileset.forEach(ts => ts.image.setFilter(Phaser.Textures.NEAREST));
    });

    // ── Layer objets — bâtiments ──
    this.buildingGroup = this.add.group();
    this._placeBuildingsFromTiled();

    // ── Source thermale ──
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
  }

  // ─────────────────────────────────────────
  // BÂTIMENTS — Placement depuis objets Tiled
  // ─────────────────────────────────────────
  _placeBuildingsFromTiled() {
    const objectLayer = this.map.getObjectLayer('Bâtiments');
    if (!objectLayer) return;

    objectLayer.objects.forEach(obj => {
      if (obj.type !== 'building') return;

      const spriteProp = obj.properties?.find(p => p.name === 'sprite');
      const spriteKey  = spriteProp ? `bat_${spriteProp.value.replace('bat_','')}` : null;
      if (!spriteKey || !this.textures.exists(spriteKey)) return;

      const sprite = this.add.image(
        obj.x + obj.width / 2,
        obj.y + obj.height / 2,
        spriteKey
      ).setDepth(obj.y); // Depth = Y pour tri correct

      // Hitbox cliquable (légèrement réduite)
      sprite.setInteractive({
        hitArea: new Phaser.Geom.Rectangle(
          obj.width * 0.15,
          obj.height * 0.1,
          obj.width * 0.7,
          obj.height * 0.85
        ),
        hitAreaCallback: Phaser.Geom.Rectangle.Contains,
      });

      // Hover effect
      sprite.on('pointerover', () => {
        this.tweens.add({ targets: sprite, scaleX: 1.05, scaleY: 1.05, duration: 80 });
      });
      sprite.on('pointerout', () => {
        this.tweens.add({ targets: sprite, scaleX: 1, scaleY: 1, duration: 80 });
      });

      // Clic → ouvre l'écran du bâtiment
      sprite.on('pointerdown', () => {
        this._openBuilding(obj);
      });

      this.buildingGroup.add(sprite);
    });
  }

  // ─────────────────────────────────────────
  // SOURCE THERMALE
  // ─────────────────────────────────────────
  _placeSource() {
    const objectLayer = this.map.getObjectLayer('Bâtiments');
    if (!objectLayer) return;

    const sourceObj = objectLayer.objects.find(o => o.name === 'source');
    if (!sourceObj) return;

    const cx = sourceObj.x + sourceObj.width / 2;
    const cy = sourceObj.y + sourceObj.height / 2;

    // Halo doré pulsant
    if (this.textures.exists('halo_gold')) {
      const halo = this.add.image(cx, cy, 'halo_gold').setDepth(5).setAlpha(0.6);
      this.tweens.add({
        targets: halo,
        alpha: { from: 0.3, to: 0.7 },
        scale: { from: 0.95, to: 1.05 },
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    // Sprite source
    if (this.textures.exists('source')) {
      const src = this.add.image(cx, cy, 'source').setDepth(6);
      src.setInteractive();
      src.on('pointerdown', () => {
        this._openSource();
      });
    }
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
    // Émet un événement React pour ouvrir le bottom sheet
    const labelProp = obj.properties?.find(p => p.name === 'label');
    const event = new CustomEvent('petaouchnok:open-building', {
      detail: {
        id: obj.name,
        label: labelProp?.value || obj.name,
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
