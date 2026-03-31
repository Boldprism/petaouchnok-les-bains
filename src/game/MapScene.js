/**
 * Pétaouchnok-les-Bains — MapScene.js
 * 4 tilesets : grass_forest, grass_path, path_plaza, river_bank
 */

const TILE_SIZE = 32;
const MAP_W = 20;
const MAP_H = 36;

const TIME_PALETTES = {
  morning: { tint: 0xffe8b0, alpha: 0.15 },
  day:     { tint: 0xffffff, alpha: 0.0  },
  evening: { tint: 0xff9040, alpha: 0.22 },
  night:   { tint: 0x1a2045, alpha: 0.55 },
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

  preload() {
    this.load.tilemapTiledJSON('map', '/assets/map/petaouchnok_map.json');

    this.load.image('ts_grass_forest', '/assets/map/grass_forest.png');
    this.load.image('ts_grass_path',   '/assets/map/grass_path.png');
    this.load.image('ts_path_plaza',   '/assets/map/path_plaza.png');
    this.load.image('ts_river_bank',   '/assets/map/river_bank.png');

    const buildings = [
      'boulangerie','mairie','bibliotheque','epicerie','garage',
      'fleuriste','medecin','hublot','leonie','bulletin','maurice',
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

    this.map = this.make.tilemap({ key: 'map' });

    const tsForet     = this.map.addTilesetImage('grass_forest', 'ts_grass_forest', 32, 32, 0, 0);
    const tsChemins   = this.map.addTilesetImage('grass_path',   'ts_grass_path',   32, 32, 0, 0);
    const tsPlace     = this.map.addTilesetImage('path_plaza',   'ts_path_plaza',   32, 32, 0, 0);
    const tsRiverBank = this.map.addTilesetImage('river_bank',   'ts_river_bank',   32, 32, 0, 0);

    const allTilesets = [tsForet, tsChemins, tsPlace, tsRiverBank].filter(Boolean);
    console.log('[MapScene] tilesets:', allTilesets.length, '/ 4');

    this.map.createLayer('For\u00eat',          allTilesets, 0, 0);
    this.map.createLayer('Chemins',        allTilesets, 0, 0);
    this.map.createLayer('Place centrale', allTilesets, 0, 0);
    this.map.createLayer('Rivi\u00e8re',   allTilesets, 0, 0);

    this.buildingGroup = this.add.group();
    this._placeBuildingsFromTiled();
    this._placeSource();

    this.lightOverlay = this.add.rectangle(
      MAP_W * TILE_SIZE / 2,
      MAP_H * TILE_SIZE / 2,
      MAP_W * TILE_SIZE,
      MAP_H * TILE_SIZE,
      0xffffff, 0
    ).setDepth(100);
    this._applyTimePalette();

    const mapPixelW = MAP_W * TILE_SIZE;
    const mapPixelH = MAP_H * TILE_SIZE;
    const screenW   = this.scale.width;
    const screenH   = this.scale.height;
    const isMobile  = screenW < 768;

    const zoom = isMobile
      ? screenW / mapPixelW
      : Math.max(screenW / mapPixelW, screenH / mapPixelH);

    this.cameras.main.setZoom(zoom);
    this.cameras.main.setBounds(0, 0, mapPixelW, mapPixelH);

    if (isMobile) {
      this.cameras.main.scrollX = 0;
      this.cameras.main.scrollY = 0;
    } else {
      this.cameras.main.centerOn(mapPixelW / 2, mapPixelH / 2);
    }

    this.input.on('pointermove', (pointer) => {
      if (!pointer.isDown) return;
      this.cameras.main.scrollX -= pointer.velocity.x / (8 * zoom);
      this.cameras.main.scrollY -= pointer.velocity.y / (8 * zoom);
    });

    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY) => {
      this.cameras.main.scrollY += deltaY * 0.5;
      this.cameras.main.scrollX += deltaX * 0.5;
    });

    this.time.addEvent({
      delay: 60000,
      callback: this._applyTimePalette,
      callbackScope: this,
      loop: true,
    });

    console.log('[MapScene] create() - termine OK');
  }

  _placeBuildingsFromTiled() {
    const objectLayer = this.map.getObjectLayer('B\u00e2timents');
    if (!objectLayer) return;

    objectLayer.objects.forEach(obj => {
      if (obj.type !== 'building') return;

      const spriteProp = obj.properties?.find(p => p.name === 'sprite');
      const spriteKey  = spriteProp ? spriteProp.value : null;
      if (!spriteKey || !this.textures.exists(spriteKey)) return;

      const sprite = this.add.image(
        obj.x + obj.width / 2,
        obj.y + obj.height / 2,
        spriteKey
      ).setDepth(obj.y);

      const tex   = this.textures.get(spriteKey).getSourceImage();
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
    if (!sourceObj) return;

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
    const labelProp    = obj.properties?.find(p => p.name === 'label');
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
