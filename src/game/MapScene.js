/**
 * Pétaouchnok-les-Bains — MapScene.js
 * =====================================
 * NOTE: utilise load.json + injection cache manuelle
 * pour contourner le bug de tilemapTiledJSON sur Safari WebKit mobile.
 */

const TILE_SIZE = 32;
const MAP_W = 20;
const MAP_H = 36;

// Phaser.Tilemaps.Formats.TILED_JSON = 1 (hardcodé pour compatibilité Safari)
const TILED_JSON_FORMAT = 1;

const TIME_PALETTES = {
  morning: { tint: 0xffe8b0, alpha: 0.15 },
  day: { tint: 0xffffff, alpha: 0.0 },
  evening: { tint: 0xff9040, alpha: 0.22 },
  night: { tint: 0x1a2045, alpha: 0.55 },
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

  preload() {
    // load.json au lieu de tilemapTiledJSON — plus fiable sur Safari WebKit
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
      console.warn('[MapScene] Echec chargement:', file.key, file.url);
    });
  }

  create() {
    console.log('[MapScene] create() - debut');

    try {
      // Etape 1 : JSON depuis cache
      const mapJSON = this.cache.json.get('mapData');
      console.log('[MapScene] mapJSON:', mapJSON
        ? 'OK - layers: ' + mapJSON.layers?.map(l => l.name).join(', ')
        : 'NULL');

      if (!mapJSON) {
        console.error('[MapScene] STOP: pas de mapJSON');
        return;
      }

      // Etape 2 : injection dans cache tilemap
      console.log('[MapScene] Phaser.Tilemaps.Parsers:', typeof Phaser.Tilemaps?.Parsers?.Parse);
      const parsedData = Phaser.Tilemaps.Parsers.Parse('map', 1, mapJSON, 32, 32, false);
      console.log('[MapScene] parsedData:', parsedData ? 'OK' : 'NULL');
      this.map = new Phaser.Tilemaps.Tilemap(this, parsedData);
      console.log('[MapScene] map:', this.map ? 'OK - ' + this.map.width + 'x' + this.map.height : 'NULL');

      if (!cached) {
        console.error('[MapScene] STOP: cache.tilemap.add a echoue');
        return;
      }

      // Etape 3 : tilemap
      this.map = this.make.tilemap({ key: 'map' });
      console.log('[MapScene] map:', this.map
        ? 'OK ' + this.map.width + 'x' + this.map.height
        : 'NULL');

      if (!this.map) {
        console.error('[MapScene] STOP: make.tilemap null');
        return;
      }

      // Etape 4 : tilesets
      const tsForet = this.map.addTilesetImage('grass_forest', 'ts_grass_forest', 32, 32, 0, 0);
      const tsChemins = this.map.addTilesetImage('grass_path', 'ts_grass_path', 32, 32, 0, 0);
      const tsPlace = this.map.addTilesetImage('path_plaza', 'ts_path_plaza', 32, 32, 0, 0);
      const tsRiviere = this.map.addTilesetImage('grass_river', 'ts_grass_river', 32, 32, 0, 0);
      console.log('[MapScene] tilesets:', [
        tsForet ? 'grass_forest:OK' : 'grass_forest:NULL',
        tsChemins ? 'grass_path:OK' : 'grass_path:NULL',
        tsPlace ? 'path_plaza:OK' : 'path_plaza:NULL',
        tsRiviere ? 'grass_river:OK' : 'grass_river:NULL',
      ].join(' '));

      const allTilesets = [tsForet, tsChemins, tsPlace, tsRiviere].filter(Boolean);
      console.log('[MapScene] allTilesets:', allTilesets.length, '/ 4');

      // Etape 5 : layers
      this.layerForet = this.map.createLayer('For\u00eat', allTilesets, 0, 0);
      this.layerChemins = this.map.createLayer('Chemins', allTilesets, 0, 0);
      this.layerPlace = this.map.createLayer('Place centrale', allTilesets, 0, 0);
      this.layerRiviere = this.map.createLayer('Rivi\u00e8re', allTilesets, 0, 0);
      console.log('[MapScene] layers:', [
        this.layerForet ? 'Foret:OK' : 'Foret:NULL',
        this.layerChemins ? 'Chemins:OK' : 'Chemins:NULL',
        this.layerPlace ? 'Place:OK' : 'Place:NULL',
        this.layerRiviere ? 'Riviere:OK' : 'Riviere:NULL',
      ].join(' '));

      // Batiments
      this.buildingGroup = this.add.group();
      this._placeBuildingsFromTiled();

      // Source thermale
      this._placeSource();

      // Overlay nuit
      this.lightOverlay = this.add.rectangle(
        MAP_W * TILE_SIZE / 2,
        MAP_H * TILE_SIZE / 2,
        MAP_W * TILE_SIZE,
        MAP_H * TILE_SIZE,
        0xffffff, 0
      ).setDepth(100);
      this._applyTimePalette();

      // Camera
      this.cameras.main.setBounds(0, 0, MAP_W * TILE_SIZE, MAP_H * TILE_SIZE);
      this.cameras.main.centerOn(10 * TILE_SIZE, (MAP_H / 2) * TILE_SIZE);

      // Scroll tactile
      this.input.on('pointermove', (pointer) => {
        if (!pointer.isDown) return;
        this.cameras.main.scrollX -= pointer.velocity.x / 8;
        this.cameras.main.scrollY -= pointer.velocity.y / 8;
      });

      this.time.addEvent({
        delay: 60000,
        callback: this._applyTimePalette,
        callbackScope: this,
        loop: true,
      });

      console.log('[MapScene] create() - termine OK');

    } catch (e) {
      console.error('[MapScene] CRASH:', e && e.message ? e.message : String(e));
      try { console.error('[MapScene] Stack:', e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : 'no stack'); } catch (_) { }
    }
  }

  _placeBuildingsFromTiled() {
    const objectLayer = this.map.getObjectLayer('B\u00e2timents');
    if (!objectLayer) {
      console.warn('[MapScene] Layer Batiments introuvable');
      return;
    }
    console.log('[MapScene] Objets Tiled:', objectLayer.objects.length);
    objectLayer.objects.forEach(obj => {
      if (obj.type !== 'building') return;
      const spriteProp = obj.properties?.find(p => p.name === 'sprite');
      const spriteKey = spriteProp ? spriteProp.value : null;
      if (!spriteKey || !this.textures.exists(spriteKey)) {
        console.warn('[MapScene] Sprite manquant:', obj.name, spriteKey);
        return;
      }
      const sprite = this.add.image(
        obj.x + obj.width / 2,
        obj.y + obj.height / 2,
        spriteKey
      ).setDepth(obj.y);
      const tex = this.textures.get(spriteKey).getSourceImage();
      const scale = Math.min(obj.width / tex.width, obj.height / tex.height);
      sprite.setScale(scale);
      sprite.setInteractive();
      sprite.on('pointerover', () => {
        this.tweens.add({ targets: sprite, scaleX: scale * 1.08, scaleY: scale * 1.08, duration: 80 });
      });
      sprite.on('pointerout', () => {
        this.tweens.add({ targets: sprite, scaleX: scale, scaleY: scale, duration: 80 });
      });
      sprite.on('pointerdown', () => this._openBuilding(obj));
      this.buildingGroup.add(sprite);
    });
    console.log('[MapScene] Batiments places:', this.buildingGroup.getLength());
  }

  _placeSource() {
    const objectLayer = this.map.getObjectLayer('B\u00e2timents');
    if (!objectLayer) return;
    const sourceObj = objectLayer.objects.find(o => o.name === 'source');
    if (!sourceObj) {
      console.warn('[MapScene] Objet source introuvable');
      return;
    }
    const cx = sourceObj.x + sourceObj.width / 2;
    const cy = sourceObj.y + sourceObj.height / 2;
    const halo = this.add.graphics().setDepth(5);
    halo.fillStyle(0xf5c842, 0.3);
    halo.fillCircle(cx, cy, 28);
    halo.fillStyle(0xffd700, 0.15);
    halo.fillCircle(cx, cy, 40);
    this.tweens.add({
      targets: halo,
      alpha: { from: 0.5, to: 1 },
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    this.add.zone(cx, cy, sourceObj.width, sourceObj.height)
      .setInteractive()
      .setDepth(6)
      .on('pointerdown', () => this._openSource());
    console.log('[MapScene] Source placee a', cx, cy);
  }

  _applyTimePalette() {
    const palette = getCurrentTimePalette();
    this.lightOverlay.setFillStyle(palette.tint, palette.alpha);
    const isNight = palette === TIME_PALETTES.night;
    this.buildingGroup.getChildren().forEach(sprite => {
      sprite.setTint(isNight ? 0xaabbdd : 0xffffff);
    });
  }

  _openBuilding(obj) {
    const labelProp = obj.properties?.find(p => p.name === 'label');
    const residentProp = obj.properties?.find(p => p.name === 'resident');
    window.dispatchEvent(new CustomEvent('petaouchnok:open-building', {
      detail: {
        id: obj.name,
        label: labelProp?.value || obj.name,
        resident: residentProp?.value || null,
        x: obj.x, y: obj.y,
      }
    }));
    this.cameras.main.pan(
      obj.x + obj.width / 2,
      obj.y + obj.height / 2,
      300, 'Power2'
    );
  }

  _openSource() {
    window.dispatchEvent(new CustomEvent('petaouchnok:open-source'));
  }

  update() {
    this.buildingGroup.getChildren().forEach(child => {
      child.setDepth(child.y);
    });
  }
}
