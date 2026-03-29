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
  day: { tint: 0xffffff, alpha: 0.0 },    // 9h–17h : neutre
  evening: { tint: 0xff9040, alpha: 0.22 },    // 17h–20h : orangé
  night: { tint: 0x1a2045, alpha: 0.55 },    // 20h–6h : nuit
};

function getCurrentTimePalette() {
  const h = new Date().getHours();
  if (h >= 6 && h < 9) return TIME_PALETTES.morning;
  if (h >= 9 && h < 17) return TIME_PALETTES.day;
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
    // Charger le JSON via load.json au lieu de tilemapTiledJSON
    // (plus fiable sur Safari WebKit)
    this.load.json('mapData', '/assets/map/petaouchnok_map.json');

    this.load.image('ts_grass_forest', '/assets/map/grass_forest.png');
    this.load.image('ts_grass_path', '/assets/map/grass_path.png');
    this.load.image('ts_path_plaza', '/assets/map/path_plaza.png');
    this.load.image('ts_grass_river', '/assets/map/grass_river.png');

    const buildings = [
      'boulangerie', 'mairie', 'bibliotheque', 'epicerie', 'garage',
      'fleuriste', 'medecin', 'hublot', 'leonie', 'bulletin', 'maurice',
    ];
    buildings.forEach(name => {
      this.load.image(`bat_${name}`, `/assets/buildings/topdown/${name}_topdown.png`);
    });

    this.load.on('loaderror', (file) => {
      console.warn('[MapScene] Échec chargement:', file.key, file.url);
    });
  }

  create() {
    console.log('[MapScene] create() — début');

    // Injecter manuellement le JSON dans le cache tilemap de Phaser
    const mapData = this.cache.json.get('mapData');
    console.log('[MapScene] mapData depuis cache:', mapData ? 'OK' : 'NULL ⚠️');

    this.cache.tilemap.add('map', {
      data: mapData,
      format: Phaser.Tilemaps.Formats.TILED_JSON
    });

    this.map = this.make.tilemap({ key: 'map' });
    console.log('[MapScene] tilemap:', this.map ? 'OK' : 'NULL ⚠️');

    // ... reste identique


    // ── Tilesets ──
    const tsForet = this.map.addTilesetImage('grass_forest', 'ts_grass_forest', 32, 32, 0, 0);
    const tsChemins = this.map.addTilesetImage('grass_path', 'ts_grass_path', 32, 32, 0, 0);
    const tsPlace = this.map.addTilesetImage('path_plaza', 'ts_path_plaza', 32, 32, 0, 0);
    const tsRiviere = this.map.addTilesetImage('grass_river', 'ts_grass_river', 32, 32, 0, 0);
    console.log('[MapScene] tilesets:', {
      tsForet: tsForet ? 'OK' : 'NULL ⚠️',
      tsChemins: tsChemins ? 'OK' : 'NULL ⚠️',
      tsPlace: tsPlace ? 'OK' : 'NULL ⚠️',
      tsRiviere: tsRiviere ? 'OK' : 'NULL ⚠️',
    });

    const allTilesets = [tsForet, tsChemins, tsPlace, tsRiviere].filter(Boolean);
    console.log('[MapScene] allTilesets count:', allTilesets.length, '/ 4');

    // ── Layers terrain ──
    this.layerForet = this.map.createLayer('Forêt', allTilesets, 0, 0);
    this.layerChemins = this.map.createLayer('Chemins', allTilesets, 0, 0);
    this.layerPlace = this.map.createLayer('Place centrale', allTilesets, 0, 0);
    this.layerRiviere = this.map.createLayer('Rivière', allTilesets, 0, 0);
    console.log('[MapScene] layers:', {
      Forêt: this.layerForet ? 'OK' : 'NULL ⚠️',
      Chemins: this.layerChemins ? 'OK' : 'NULL ⚠️',
      'Place centrale': this.layerPlace ? 'OK' : 'NULL ⚠️',
      Rivière: this.layerRiviere ? 'OK' : 'NULL ⚠️',
    });

    const layerCount = [this.layerForet, this.layerChemins, this.layerPlace, this.layerRiviere]
      .filter(Boolean).length;
    console.log('[MapScene] Layers créés:', layerCount, '/ 4');

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

    console.log('[MapScene] create() — terminé ✅');
  } // ← fin create()

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
      const spriteKey = spriteProp ? spriteProp.value : null;
      if (!spriteKey || !this.textures.exists(spriteKey)) {
        console.warn('[MapScene] Sprite manquant pour', obj.name, spriteKey);
        return;
      }

      const sprite = this.add.image(
        obj.x + obj.width / 2,
        obj.y + obj.height / 2,
        spriteKey
      ).setDepth(obj.y);

      const tex = this.textures.get(spriteKey).getSourceImage();
      const scaleX = obj.width / tex.width;
      const scaleY = obj.height / tex.height;
      const scale = Math.min(scaleX, scaleY);
      sprite.setScale(scale);

      sprite.setInteractive();

      sprite.on('pointerover', () => {
        this.tweens.add({ targets: sprite, scaleX: scale * 1.08, scaleY: scale * 1.08, duration: 80 });
      });
      sprite.on('pointerout', () => {
        this.tweens.add({ targets: sprite, scaleX: scale, scaleY: scale, duration: 80 });
      });

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

    const haloGraphics = this.add.graphics();
    haloGraphics.setDepth(5);
    haloGraphics.fillStyle(0xf5c842, 0.3);
    haloGraphics.fillCircle(cx, cy, 28);
    haloGraphics.fillStyle(0xffd700, 0.15);
    haloGraphics.fillCircle(cx, cy, 40);

    this.tweens.add({
      targets: haloGraphics,
      alpha: { from: 0.5, to: 1 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

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

    const isNight = palette === TIME_PALETTES.night;
    this.buildingGroup.getChildren().forEach(sprite => {
      sprite.setTint(isNight ? 0xaabbdd : 0xffffff);
    });
  }

  // ─────────────────────────────────────────
  // NAVIGATION — Ouverture bâtiment
  // ─────────────────────────────────────────
  _openBuilding(obj) {
    const labelProp = obj.properties?.find(p => p.name === 'label');
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
    this.buildingGroup.getChildren().forEach(child => {
      child.setDepth(child.y);
    });
  }
}
