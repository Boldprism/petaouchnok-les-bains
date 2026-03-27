"""
Pétaouchnok-les-Bains — Map Builder
====================================
Script à exécuter avec Claude Code sur ton Mac.
Il télécharge les tilesets PixelLab, assemble le tileset maître
et génère le JSON Tiled compatible Phaser.js.

Usage : python3 build_map.py
"""

import requests, json, os, sys
from PIL import Image

# ═══════════════════════════════════════════
# CONFIG
# ═══════════════════════════════════════════
API_TOKEN   = "2c4cee46-bf85-45b4-a4d5-f61ac44e48b9"
HEADERS     = {"Authorization": f"Bearer {API_TOKEN}"}
OUT_DIR     = "public/assets/map"
TILE_SIZE   = 32

# IDs PixelLab des 4 tilesets
TILESETS = {
    "grass_forest": {
        "id": "66a07593-c7cc-43cf-9c28-198061a764c3",
        "lower": "grass",
        "upper": "forest",
        "lower_idx": 0,   # index terrain dans notre système
        "upper_idx": 1,
    },
    "grass_path": {
        "id": "26b6e55d-ac64-475d-8dc3-70e3114fae25",
        "lower": "grass",
        "upper": "path",
        "lower_idx": 0,
        "upper_idx": 2,
    },
    "path_plaza": {
        "id": "fad1b295-2c00-4091-9a83-a58f18ee5e5e",
        "lower": "path",
        "upper": "plaza",
        "lower_idx": 2,
        "upper_idx": 3,
    },
    "grass_river": {
        "id": "cada328a-1e1b-4aca-a93e-d5aed89203e4",
        "lower": "grass",
        "upper": "river",
        "lower_idx": 0,
        "upper_idx": 4,
    },
}

# ═══════════════════════════════════════════
# DIMENSIONS MAP — Format vertical mobile
# ═══════════════════════════════════════════
MAP_W = 20   # tuiles
MAP_H = 36   # tuiles (scrollable verticalement)
# Résultat : 640×1152px — ratio portrait, scroll sur ~2,7 écrans mobile

# ═══════════════════════════════════════════
# LAYOUT TERRAIN — Pétaouchnok-les-Bains
# ═══════════════════════════════════════════
# Codes terrain :
# 0 = herbe (grass)
# 1 = forêt (forest)
# 2 = chemin (path)
# 3 = place centrale (plaza)
# 4 = rivière (river)

def build_terrain_grid():
    """
    Construit la grille terrain de Pétaouchnok.
    Retourne un tableau 2D [H][W] de codes terrain.
    """
    # Init tout en herbe
    grid = [[0]*MAP_W for _ in range(MAP_H)]

    # ── FORÊT — bordure (2 tuiles) ──
    for y in range(MAP_H):
        for x in range(MAP_W):
            if x < 2 or x >= MAP_W-2 or y < 2 or y >= MAP_H-2:
                grid[y][x] = 1

    # ── RIVIÈRE — côté droit, serpentine ──
    river_col = MAP_W - 4  # col 16
    for y in range(2, MAP_H-2):
        # Légère ondulation
        offset = 1 if (y % 6 < 3) else 0
        for rx in range(river_col + offset - 1, river_col + offset + 2):
            if 0 <= rx < MAP_W:
                grid[y][rx] = 4
        # Forêt à droite de la rivière
        for rx in range(river_col + offset + 2, MAP_W-2):
            if 0 <= rx < MAP_W:
                grid[y][rx] = 1

    # ── CHEMIN HORIZONTAL PRINCIPAL (milieu vertical) ──
    path_row = MAP_H // 2  # row 18
    for x in range(2, river_col - 1):
        grid[path_row][x] = 2
        grid[path_row+1][x] = 2

    # ── CHEMIN VERTICAL PRINCIPAL ──
    path_col = MAP_W // 2 - 1  # col 9
    for y in range(2, MAP_H-2):
        if grid[y][path_col] not in [4, 1]:
            grid[y][path_col] = 2
            grid[y][path_col+1] = 2

    # ── PLACE CENTRALE (Source thermale) ──
    plaza_x1, plaza_y1 = 7, path_row - 3
    plaza_x2, plaza_y2 = 13, path_row + 4
    for y in range(plaza_y1, plaza_y2):
        for x in range(plaza_x1, plaza_x2):
            grid[y][x] = 3

    # ── CHEMIN VERS BOULANGERIE (nord-ouest) ──
    for y in range(plaza_y1 - 3, plaza_y1):
        grid[y][path_col] = 2
        grid[y][path_col+1] = 2

    # ── CHEMIN VERS ÉPICERIE (sud-ouest) ──
    for y in range(plaza_y2, plaza_y2 + 4):
        grid[y][5] = 2
        grid[y][6] = 2

    # ── CHEMIN VERS BIBLIOTHÈQUE (est) ──
    for x in range(plaza_x2, plaza_x2 + 3):
        grid[path_row][x] = 2
        grid[path_row+1][x] = 2

    return grid


# ═══════════════════════════════════════════
# WANG TILING — Conversion grille → indices tuiles
# ═══════════════════════════════════════════

# Mapping coins Wang → index dans le tileset (0-15)
# Système : coin = (NW, NE, SW, SE) chacun lower(0) ou upper(1)
# L'index correspond à la position dans la grille 4×4 du PNG

WANG_CORNER_TO_INDEX = {
    # (NW, NE, SW, SE) → local tile index dans le tileset 4×4
    # lower=0, upper=1
    (0,0,0,0): 15,  # tout lower (herbe pleine)
    (1,1,1,1): 0,   # tout upper (forêt/chemin/plaza pleine)
    (0,0,0,1): 1,
    (0,0,1,0): 2,
    (0,1,0,0): 3,
    (1,0,0,0): 4,
    (1,1,0,0): 5,
    (0,0,1,1): 6,
    (1,0,1,0): 7,
    (0,1,0,1): 8,
    (1,1,1,0): 9,
    (1,1,0,1): 10,
    (1,0,1,1): 11,
    (0,1,1,1): 12,
    (0,1,1,0): 13,
    (1,0,0,1): 14,
}

def terrain_to_tile_index(grid, x, y, ts_name):
    """
    Donne l'index de tuile global pour la cellule (x,y)
    selon le tileset ts_name.
    """
    ts = TILESETS[ts_name]
    lo = ts["lower_idx"]
    up = ts["upper_idx"]

    def is_upper(gx, gy):
        if gx < 0 or gx >= MAP_W or gy < 0 or gy >= MAP_H:
            return 0
        return 1 if grid[gy][gx] == up else 0

    # Coins : NW=top-left, NE=top-right, SW=bottom-left, SE=bottom-right
    nw = is_upper(x,   y)
    ne = is_upper(x+1, y)
    sw = is_upper(x,   y+1)
    se = is_upper(x+1, y+1)

    local_idx = WANG_CORNER_TO_INDEX.get((nw, ne, sw, se), 15)
    
    # Index global = tileset_offset + local_idx
    ts_order = list(TILESETS.keys())
    ts_offset = ts_order.index(ts_name) * 16
    return ts_offset + local_idx + 1  # +1 car Tiled commence à 1 (0 = vide)


def build_tile_layers(grid):
    """
    Construit les couches de tuiles pour Tiled.
    Retourne 4 layers (un par tileset).
    """
    layers = {}
    for ts_name in TILESETS:
        layer_data = []
        ts = TILESETS[ts_name]
        lo = ts["lower_idx"]
        up = ts["upper_idx"]

        for y in range(MAP_H):
            for x in range(MAP_W):
                cell = grid[y][x]
                # Cette cellule est-elle concernée par ce tileset ?
                if cell == lo or cell == up:
                    idx = terrain_to_tile_index(grid, x, y, ts_name)
                    layer_data.append(idx)
                else:
                    layer_data.append(0)  # vide pour ce layer
        layers[ts_name] = layer_data

    return layers


# ═══════════════════════════════════════════
# TILESET MAÎTRE — Assemblage des 4 PNG
# ═══════════════════════════════════════════

def download_and_assemble_tilesets():
    """
    Télécharge les 4 PNGs PixelLab et les assemble
    en un seul tileset maître vertical.
    Layout : 4 tilesets × 4×4 = 16 tuiles chacun
    PNG final : 128px large × 512px haut (4 tilesets empilés)
    """
    os.makedirs(OUT_DIR, exist_ok=True)
    
    strips = []
    meta_all = {}

    for ts_name, ts in TILESETS.items():
        print(f"  Téléchargement {ts_name}...")
        
        # Image
        r = requests.get(
            f"https://api.pixellab.ai/mcp/tilesets/{ts['id']}/image",
            headers=HEADERS
        )
        img_path = f"{OUT_DIR}/{ts_name}.png"
        with open(img_path, 'wb') as f:
            f.write(r.content)
        img = Image.open(img_path)
        strips.append(img)
        
        # Metadata
        r2 = requests.get(
            f"https://api.pixellab.ai/mcp/tilesets/{ts['id']}/metadata",
            headers=HEADERS
        )
        meta = r2.json()
        meta_all[ts_name] = meta
        print(f"    ✓ {img.size[0]}×{img.size[1]}px — {len(meta.get('tiles', []))} tuiles")

    # Assemblage vertical
    total_h = sum(img.size[1] for img in strips)
    master = Image.new('RGBA', (128, total_h), (0,0,0,0))
    y_offset = 0
    offsets = {}
    for i, (ts_name, img) in enumerate(zip(TILESETS.keys(), strips)):
        master.paste(img, (0, y_offset))
        offsets[ts_name] = y_offset
        y_offset += img.size[1]

    master_path = f"{OUT_DIR}/tileset_master.png"
    master.save(master_path)
    print(f"\n✅ Tileset maître : {master.size[0]}×{master.size[1]}px → {master_path}")
    
    return offsets, meta_all


# ═══════════════════════════════════════════
# TILED JSON — Format compatible Phaser.js
# ═══════════════════════════════════════════

def build_tiled_json(tile_layers, offsets):
    """
    Génère le JSON de map au format Tiled,
    directement lisible par Phaser.js via this.make.tilemap()
    """
    ts_order = list(TILESETS.keys())
    
    # Tilesets dans le JSON Tiled
    tiled_tilesets = []
    first_gid = 1
    for ts_name in ts_order:
        ts = TILESETS[ts_name]
        tiled_tilesets.append({
            "firstgid": first_gid,
            "name": ts_name,
            "tilewidth": TILE_SIZE,
            "tileheight": TILE_SIZE,
            "spacing": 0,
            "margin": 0,
            "columns": 4,
            "tilecount": 16,
            "imagewidth": 128,
            "imageheight": 128,
            "image": f"tileset_master.png",
            "tileoffset": {"x": 0, "y": offsets.get(ts_name, 0)},
            "source": f"{ts_name}",
        })
        first_gid += 16

    # Layers terrain
    tiled_layers = []
    layer_names = {
        "grass_forest": "Forêt",
        "grass_path":   "Chemins",
        "path_plaza":   "Place centrale",
        "grass_river":  "Rivière",
    }
    
    for ts_name in ts_order:
        tiled_layers.append({
            "id": ts_order.index(ts_name) + 1,
            "name": layer_names[ts_name],
            "type": "tilelayer",
            "x": 0, "y": 0,
            "width": MAP_W,
            "height": MAP_H,
            "visible": True,
            "opacity": 1,
            "data": tile_layers[ts_name],
            "encoding": "csv",
        })

    # Layer objets — bâtiments et points d'intérêt
    path_row = MAP_H // 2
    plaza_cx = (7 + 13) // 2 * TILE_SIZE
    plaza_cy = path_row * TILE_SIZE

    objects_layer = {
        "id": 10,
        "name": "Bâtiments",
        "type": "objectgroup",
        "x": 0, "y": 0,
        "visible": True,
        "opacity": 1,
        "objects": [
            # Source thermale (centre de la place)
            {
                "id": 1, "name": "source", "type": "source",
                "x": plaza_cx, "y": plaza_cy,
                "width": 64, "height": 64,
                "properties": [
                    {"name": "label", "value": "✦ Source thermale"},
                    {"name": "interactive", "value": True},
                    {"name": "glow", "value": True},
                ]
            },
            # Boulangerie — nord-ouest de la place
            {
                "id": 2, "name": "boulangerie", "type": "building",
                "x": 4*TILE_SIZE, "y": (path_row-6)*TILE_SIZE,
                "width": 96, "height": 96,
                "properties": [
                    {"name": "label", "value": "🥐 Boulangerie Mielleux"},
                    {"name": "resident", "value": "Gaston Mielleux"},
                    {"name": "sprite", "value": "bat_boulangerie"},
                ]
            },
            # Mairie — nord de la place
            {
                "id": 3, "name": "mairie", "type": "building",
                "x": 8*TILE_SIZE, "y": (path_row-7)*TILE_SIZE,
                "width": 96, "height": 96,
                "properties": [
                    {"name": "label", "value": "🏛 Mairie"},
                    {"name": "resident", "value": "Fernand Plongeot"},
                    {"name": "sprite", "value": "bat_mairie"},
                ]
            },
            # Bibliothèque — nord-est de la place
            {
                "id": 4, "name": "bibliotheque", "type": "building",
                "x": 14*TILE_SIZE, "y": (path_row-5)*TILE_SIZE,
                "width": 96, "height": 96,
                "properties": [
                    {"name": "label", "value": "📚 Bibliothèque"},
                    {"name": "resident", "value": "Madeleine Épinette"},
                    {"name": "sprite", "value": "bat_bibliotheque"},
                ]
            },
            # Épicerie — sud-ouest
            {
                "id": 5, "name": "epicerie", "type": "building",
                "x": 3*TILE_SIZE, "y": (path_row+5)*TILE_SIZE,
                "width": 96, "height": 96,
                "properties": [
                    {"name": "label", "value": "🛒 Épicerie Grignotier"},
                    {"name": "resident", "value": "Noisette Grignotier"},
                    {"name": "sprite", "value": "bat_epicerie"},
                ]
            },
            # Garage — sud-est
            {
                "id": 6, "name": "garage", "type": "building",
                "x": 13*TILE_SIZE, "y": (path_row+5)*TILE_SIZE,
                "width": 96, "height": 96,
                "properties": [
                    {"name": "label", "value": "🔧 Garage Mâchefer"},
                    {"name": "resident", "value": "Théodore Mâchefer"},
                    {"name": "sprite", "value": "bat_garage"},
                ]
            },
            # Fleuriste — sud
            {
                "id": 7, "name": "fleuriste", "type": "building",
                "x": 5*TILE_SIZE, "y": (path_row+8)*TILE_SIZE,
                "width": 96, "height": 96,
                "properties": [
                    {"name": "label", "value": "🌸 Fleuriste Duduche"},
                    {"name": "resident", "value": "Rosalie Duduche"},
                    {"name": "sprite", "value": "bat_fleuriste"},
                ]
            },
            # Cabinet médecin — nord-est
            {
                "id": 8, "name": "medecin", "type": "building",
                "x": 13*TILE_SIZE, "y": (path_row-8)*TILE_SIZE,
                "width": 96, "height": 96,
                "properties": [
                    {"name": "label", "value": "🏥 Cabinet Carapasse"},
                    {"name": "resident", "value": "Dr Octave Carapasse"},
                    {"name": "sprite", "value": "bat_medecin"},
                ]
            },
            # Tour Hublot — nord-ouest forêt (zone cachée proche)
            {
                "id": 9, "name": "hublot", "type": "building",
                "x": 4*TILE_SIZE, "y": (path_row-9)*TILE_SIZE,
                "width": 80, "height": 112,
                "properties": [
                    {"name": "label", "value": "🔭 Tour de guet"},
                    {"name": "resident", "value": "Professeur Hublot"},
                    {"name": "sprite", "value": "bat_hublot"},
                ]
            },
            # Maison Léonie
            {
                "id": 10, "name": "leonie", "type": "building",
                "x": 7*TILE_SIZE, "y": (path_row-8)*TILE_SIZE,
                "width": 96, "height": 96,
                "properties": [
                    {"name": "label", "value": "🏠 Maison de Léonie"},
                    {"name": "resident", "value": "Léonie Bontemps"},
                    {"name": "sprite", "value": "bat_leonie"},
                ]
            },
            # Bulletin — est de la place
            {
                "id": 11, "name": "bulletin", "type": "building",
                "x": 13*TILE_SIZE, "y": (path_row-3)*TILE_SIZE,
                "width": 96, "height": 96,
                "properties": [
                    {"name": "label", "value": "📰 Le Bulletin"},
                    {"name": "resident", "value": "Gustave Grenouillard"},
                    {"name": "sprite", "value": "bat_bulletin"},
                ]
            },
            # Maison Maurice — bord rivière
            {
                "id": 12, "name": "maurice", "type": "building",
                "x": 13*TILE_SIZE, "y": (path_row+1)*TILE_SIZE,
                "width": 96, "height": 96,
                "properties": [
                    {"name": "label", "value": "🎣 Maison de Maurice"},
                    {"name": "resident", "value": "Maurice Plongeur"},
                    {"name": "sprite", "value": "bat_maurice"},
                ]
            },
            # Zones cachées
            {
                "id": 20, "name": "clairiere_echo", "type": "hidden_zone",
                "x": 3*TILE_SIZE, "y": 3*TILE_SIZE,
                "width": 64, "height": 64,
                "properties": [
                    {"name": "label", "value": "✨ Clairière de l'Écho"},
                    {"name": "fragment", "value": "F041"},
                    {"name": "hidden", "value": True},
                ]
            },
            {
                "id": 21, "name": "quai_oublie", "type": "hidden_zone",
                "x": 15*TILE_SIZE, "y": 4*TILE_SIZE,
                "width": 64, "height": 64,
                "properties": [
                    {"name": "label", "value": "⚓ Quai Oublié"},
                    {"name": "fragment", "value": "F042"},
                    {"name": "hidden", "value": True},
                ]
            },
            # Panneau d'entrée
            {
                "id": 22, "name": "panneau_entree", "type": "sign",
                "x": 9*TILE_SIZE, "y": (MAP_H-4)*TILE_SIZE,
                "width": 32, "height": 32,
                "properties": [
                    {"name": "label", "value": "🪧 Pétaouchnok-les-Bains"},
                    {"name": "text", "value": "Pétaouchnok-les-Bains existe depuis toujours et existera toujours. Probablement."},
                ]
            },
        ]
    }

    tiled_map = {
        "version": "1.10",
        "tiledversion": "1.10.0",
        "type": "map",
        "orientation": "orthogonal",
        "renderorder": "right-down",
        "width": MAP_W,
        "height": MAP_H,
        "tilewidth": TILE_SIZE,
        "tileheight": TILE_SIZE,
        "infinite": False,
        "nextlayerid": 20,
        "nextobjectid": 100,
        "properties": [
            {"name": "village", "value": "Pétaouchnok-les-Bains"},
            {"name": "version", "value": "1.0"},
            {"name": "mobileFormat", "value": "portrait"},
            {"name": "tileSize", "value": TILE_SIZE},
        ],
        "tilesets": tiled_tilesets,
        "layers": tiled_layers + [objects_layer],
    }

    return tiled_map


# ═══════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════

if __name__ == "__main__":
    print("🏘️  Pétaouchnok-les-Bains — Map Builder")
    print("=" * 45)

    print("\n1️⃣  Construction de la grille terrain...")
    grid = build_terrain_grid()
    print(f"   Grille {MAP_W}×{MAP_H} générée")

    print("\n2️⃣  Calcul des couches de tuiles Wang...")
    tile_layers = build_tile_layers(grid)
    print(f"   {len(tile_layers)} layers générés")

    print("\n3️⃣  Téléchargement et assemblage des tilesets...")
    offsets, meta = download_and_assemble_tilesets()

    print("\n4️⃣  Génération du JSON Tiled...")
    tiled_json = build_tiled_json(tile_layers, offsets)
    
    map_path = f"{OUT_DIR}/petaouchnok_map.json"
    with open(map_path, 'w', encoding='utf-8') as f:
        json.dump(tiled_json, f, ensure_ascii=False, indent=2)
    print(f"   ✅ {map_path}")

    # Sauvegarder aussi les métadonnées tilesets pour Phaser
    meta_path = f"{OUT_DIR}/tilesets_meta.json"
    with open(meta_path, 'w', encoding='utf-8') as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)
    print(f"   ✅ {meta_path}")

    print(f"""
✅ Map générée avec succès !
   Dimensions : {MAP_W*TILE_SIZE}×{MAP_H*TILE_SIZE}px ({MAP_W}×{MAP_H} tuiles de {TILE_SIZE}px)
   Format     : Portrait mobile vertical
   Fichiers   :
     → {OUT_DIR}/tileset_master.png
     → {OUT_DIR}/petaouchnok_map.json
     → {OUT_DIR}/tilesets_meta.json

Intégration Phaser :
   this.load.tilemapTiledJSON('map', 'assets/map/petaouchnok_map.json')
   this.load.image('tileset_master', 'assets/map/tileset_master.png')
""")
