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

# IDs PixelLab des tilesets
# Si "id" est None ou le fichier existe déjà dans OUT_DIR → skip download
TILESETS = {
    "grass_forest": {
        "id": "66a07593-c7cc-43cf-9c28-198061a764c3",
        "lower": "grass",   "upper": "forest",
        "lower_idx": 0,     "upper_idx": 1,
    },
    "grass_path": {
        "id": "26b6e55d-ac64-475d-8dc3-70e3114fae25",
        "lower": "grass",   "upper": "path",
        "lower_idx": 0,     "upper_idx": 2,
    },
    "path_plaza": {
        "id": "fad1b295-2c00-4091-9a83-a58f18ee5e5e",
        "lower": "path",    "upper": "plaza",
        "lower_idx": 2,     "upper_idx": 3,
    },
    "grass_river": {
        "id": "cada328a-1e1b-4aca-a93e-d5aed89203e4",
        "lower": "grass",   "upper": "river",
        "lower_idx": 0,     "upper_idx": 4,
    },
    # ── Nouveaux tilesets de transition ──
    # river_bank : berge entre rivière et herbe
    # PNG déjà présent dans OUT_DIR → id=None pour skipper le download
    "river_bank": {
        "id": None,          # fichier déjà dans public/assets/map/river_bank.png
        "lower": "river",   "upper": "grass",
        "lower_idx": 4,     "upper_idx": 0,
    },
    # stone_grass : transition herbe ↔ place centrale
    "stone_grass": {
        "id": None,          # fichier déjà dans public/assets/map/stone_grass.png
        "lower": "grass",   "upper": "plaza",
        "lower_idx": 0,     "upper_idx": 3,
    },
}

# ═══════════════════════════════════════════
# DIMENSIONS MAP
# ═══════════════════════════════════════════
MAP_W = 20
MAP_H = 36

# ═══════════════════════════════════════════
# LAYOUT TERRAIN
# ═══════════════════════════════════════════
# 0=herbe  1=forêt  2=chemin  3=place  4=rivière

def build_terrain_grid():
    grid = [[0]*MAP_W for _ in range(MAP_H)]

    # Forêt — bordure
    for y in range(MAP_H):
        for x in range(MAP_W):
            if x < 2 or x >= MAP_W-2 or y < 2 or y >= MAP_H-2:
                grid[y][x] = 1

    # Rivière — côté droit, serpentine
    river_col = MAP_W - 4  # col 16
    for y in range(2, MAP_H-2):
        offset = 1 if (y % 6 < 3) else 0
        for rx in range(river_col + offset - 1, river_col + offset + 2):
            if 0 <= rx < MAP_W:
                grid[y][rx] = 4
        for rx in range(river_col + offset + 2, MAP_W-2):
            if 0 <= rx < MAP_W:
                grid[y][rx] = 1

    # Chemin horizontal principal
    path_row = MAP_H // 2
    for x in range(2, river_col - 1):
        grid[path_row][x] = 2
        grid[path_row+1][x] = 2

    # Chemin vertical principal
    path_col = MAP_W // 2 - 1  # col 9
    for y in range(2, MAP_H-2):
        if grid[y][path_col] not in [4, 1]:
            grid[y][path_col] = 2
            grid[y][path_col+1] = 2

    # Place centrale
    plaza_x1, plaza_y1 = 7, path_row - 3
    plaza_x2, plaza_y2 = 13, path_row + 4
    for y in range(plaza_y1, plaza_y2):
        for x in range(plaza_x1, plaza_x2):
            grid[y][x] = 3

    # Chemins secondaires
    for y in range(plaza_y1 - 3, plaza_y1):
        grid[y][path_col] = 2
        grid[y][path_col+1] = 2

    for y in range(plaza_y2, plaza_y2 + 4):
        grid[y][5] = 2
        grid[y][6] = 2

    for x in range(plaza_x2, plaza_x2 + 3):
        grid[path_row][x] = 2
        grid[path_row+1][x] = 2

    return grid


# ═══════════════════════════════════════════
# WANG TILING
# ═══════════════════════════════════════════
WANG_CORNER_TO_INDEX = {
    (0,0,0,0): 6,  (0,0,0,1): 7,  (0,0,1,0): 10, (0,0,1,1): 9,
    (0,1,0,0): 2,  (0,1,0,1): 11, (0,1,1,0): 4,  (0,1,1,1): 15,
    (1,0,0,0): 5,  (1,0,0,1): 14, (1,0,1,0): 1,  (1,0,1,1): 8,
    (1,1,0,0): 3,  (1,1,0,1): 0,  (1,1,1,0): 13, (1,1,1,1): 12,
}

def terrain_to_tile_index(grid, x, y, ts_name):
    ts = TILESETS[ts_name]
    up = ts["upper_idx"]

    def is_upper(gx, gy):
        if gx < 0 or gx >= MAP_W or gy < 0 or gy >= MAP_H:
            return 0
        v = grid[gy][gx]
        # river_bank : tout ce qui n'est PAS rivière = upper (terre)
        if ts_name == "river_bank":
            return 1 if v != 4 else 0
        # stone_grass : seulement la place = upper
        if ts_name == "stone_grass":
            return 1 if v == 3 else 0
        # Cas général
        return 1 if v == up else 0

    nw = is_upper(x,   y)
    ne = is_upper(x+1, y)
    sw = is_upper(x,   y+1)
    se = is_upper(x+1, y+1)

    local_idx = WANG_CORNER_TO_INDEX.get((nw, ne, sw, se), 15)
    ts_order  = list(TILESETS.keys())
    ts_offset = ts_order.index(ts_name) * 16
    return ts_offset + local_idx + 1


def build_tile_layers(grid):
    layers = {}
    for ts_name in TILESETS:
        ts = TILESETS[ts_name]
        lo = ts["lower_idx"]
        up = ts["upper_idx"]
        layer_data = []

        for y in range(MAP_H):
            for x in range(MAP_W):
                cell = grid[y][x]
                if ts_name == "river_bank":
                    # Rendre partout où il y a rivière OU herbe (la frontière)
                    active = (cell == 4 or cell == 0)
                elif ts_name == "stone_grass":
                    # Rendre partout où il y a herbe OU place
                    active = (cell == 0 or cell == 3)
                else:
                    active = (cell == lo or cell == up)

                if active:
                    layer_data.append(terrain_to_tile_index(grid, x, y, ts_name))
                else:
                    layer_data.append(0)

        layers[ts_name] = layer_data
    return layers


# ═══════════════════════════════════════════
# DOWNLOAD TILESETS (skip si fichier présent)
# ═══════════════════════════════════════════
def download_and_assemble_tilesets():
    os.makedirs(OUT_DIR, exist_ok=True)
    strips = []
    meta_all = {}

    for ts_name, ts in TILESETS.items():
        img_path = f"{OUT_DIR}/{ts_name}.png"

        # Skip download si fichier déjà présent OU id=None
        if os.path.exists(img_path):
            print(f"  {ts_name} — fichier existant, skip download ✓")
            img = Image.open(img_path)
        elif ts["id"] is None:
            print(f"  ERREUR : {ts_name}.png introuvable dans {OUT_DIR} !")
            sys.exit(1)
        else:
            print(f"  Téléchargement {ts_name}...")
            r = requests.get(
                f"https://api.pixellab.ai/mcp/tilesets/{ts['id']}/image",
                headers=HEADERS
            )
            with open(img_path, 'wb') as f:
                f.write(r.content)
            img = Image.open(img_path)

        strips.append(img)

        # Metadata (optionnelle si id=None)
        if ts["id"]:
            r2 = requests.get(
                f"https://api.pixellab.ai/mcp/tilesets/{ts['id']}/metadata",
                headers=HEADERS
            )
            meta_all[ts_name] = r2.json()
        else:
            meta_all[ts_name] = {}

        print(f"    ✓ {img.size[0]}×{img.size[1]}px")

    # Assemblage vertical
    total_h = sum(img.size[1] for img in strips)
    master = Image.new('RGBA', (128, total_h), (0,0,0,0))
    y_offset = 0
    offsets = {}
    for ts_name, img in zip(TILESETS.keys(), strips):
        master.paste(img, (0, y_offset))
        offsets[ts_name] = y_offset
        y_offset += img.size[1]

    master_path = f"{OUT_DIR}/tileset_master.png"
    master.save(master_path)
    print(f"\n✅ Tileset maître : {master.size[0]}×{master.size[1]}px")

    return offsets, meta_all


# ═══════════════════════════════════════════
# TILED JSON
# ═══════════════════════════════════════════
def build_tiled_json(tile_layers, offsets):
    ts_order = list(TILESETS.keys())

    # Tilesets
    tiled_tilesets = []
    first_gid = 1
    for ts_name in ts_order:
        tiled_tilesets.append({
            "firstgid": first_gid,
            "name": ts_name,
            "tilewidth": TILE_SIZE, "tileheight": TILE_SIZE,
            "spacing": 0, "margin": 0,
            "columns": 4, "tilecount": 16,
            "imagewidth": 128, "imageheight": 128,
            "image": f"{ts_name}.png",
        })
        first_gid += 16

    # Layers terrain
    layer_names = {
        "grass_forest": "Forêt",
        "grass_path":   "Chemins",
        "path_plaza":   "Place centrale",
        "grass_river":  "Rivière",
        "river_bank":   "Berge",
        "stone_grass":  "Pierre/Herbe",
    }

    tiled_layers = []
    for i, ts_name in enumerate(ts_order):
        tiled_layers.append({
            "id": i + 1,
            "name": layer_names[ts_name],
            "type": "tilelayer",
            "x": 0, "y": 0,
            "width": MAP_W, "height": MAP_H,
            "visible": True, "opacity": 1,
            "data": tile_layers[ts_name],
            "encoding": "csv",
        })

    # Layer objets
    path_row = MAP_H // 2
    plaza_cx = (7 + 13) // 2 * TILE_SIZE
    plaza_cy = path_row * TILE_SIZE

    objects_layer = {
        "id": 10,
        "name": "Bâtiments",
        "type": "objectgroup",
        "x": 0, "y": 0,
        "visible": True, "opacity": 1,
        "objects": [
            {
                "id": 1, "name": "source", "type": "source",
                "x": plaza_cx, "y": plaza_cy,
                "width": 64, "height": 64,
                "properties": [
                    {"name": "label",       "value": "✦ Source thermale"},
                    {"name": "interactive", "value": True},
                    {"name": "glow",        "value": True},
                ]
            },
            {
                "id": 2, "name": "boulangerie", "type": "building",
                "x": 4*TILE_SIZE, "y": (path_row-6)*TILE_SIZE,
                "width": 96, "height": 96,
                "properties": [
                    {"name": "label",    "value": "🥐 Boulangerie Mielleux"},
                    {"name": "resident", "value": "Gaston Mielleux"},
                    {"name": "sprite",   "value": "bat_boulangerie"},
                ]
            },
            {
                "id": 3, "name": "mairie", "type": "building",
                "x": 8*TILE_SIZE, "y": (path_row-7)*TILE_SIZE,
                "width": 96, "height": 96,
                "properties": [
                    {"name": "label",    "value": "🏛 Mairie"},
                    {"name": "resident", "value": "Fernand Plongeot"},
                    {"name": "sprite",   "value": "bat_mairie"},
                ]
            },
            {
                "id": 4, "name": "bibliotheque", "type": "building",
                "x": 10*TILE_SIZE, "y": (path_row-8)*TILE_SIZE,
                "width": 80, "height": 96,
                "properties": [
                    {"name": "label",    "value": "📚 Bibliothèque"},
                    {"name": "resident", "value": "Madeleine Épinette"},
                    {"name": "sprite",   "value": "bat_bibliotheque"},
                ]
            },
            {
                "id": 5, "name": "epicerie", "type": "building",
                "x": 3*TILE_SIZE, "y": (path_row+5)*TILE_SIZE,
                "width": 96, "height": 96,
                "properties": [
                    {"name": "label",    "value": "🛒 Épicerie Grignotier"},
                    {"name": "resident", "value": "Noisette Grignotier"},
                    {"name": "sprite",   "value": "bat_epicerie"},
                ]
            },
            {
                "id": 6, "name": "garage", "type": "building",
                "x": 10*TILE_SIZE, "y": (path_row+5)*TILE_SIZE,
                "width": 80, "height": 96,
                "properties": [
                    {"name": "label",    "value": "🔧 Garage Mâchefer"},
                    {"name": "resident", "value": "Théodore Mâchefer"},
                    {"name": "sprite",   "value": "bat_garage"},
                ]
            },
            {
                "id": 7, "name": "fleuriste", "type": "building",
                "x": 5*TILE_SIZE, "y": (path_row+8)*TILE_SIZE,
                "width": 96, "height": 96,
                "properties": [
                    {"name": "label",    "value": "🌸 Fleuriste Duduche"},
                    {"name": "resident", "value": "Rosalie Duduche"},
                    {"name": "sprite",   "value": "bat_fleuriste"},
                ]
            },
            {
                "id": 8, "name": "medecin", "type": "building",
                "x": 10*TILE_SIZE, "y": (path_row-11)*TILE_SIZE,
                "width": 80, "height": 96,
                "properties": [
                    {"name": "label",    "value": "🏥 Cabinet Carapasse"},
                    {"name": "resident", "value": "Dr Octave Carapasse"},
                    {"name": "sprite",   "value": "bat_medecin"},
                ]
            },
            {
                "id": 9, "name": "hublot", "type": "building",
                "x": 4*TILE_SIZE, "y": (path_row-9)*TILE_SIZE,
                "width": 80, "height": 112,
                "properties": [
                    {"name": "label",    "value": "🔭 Tour de guet"},
                    {"name": "resident", "value": "Professeur Hublot"},
                    {"name": "sprite",   "value": "bat_hublot"},
                ]
            },
            {
                "id": 10, "name": "leonie", "type": "building",
                "x": 7*TILE_SIZE, "y": (path_row-8)*TILE_SIZE,
                "width": 96, "height": 96,
                "properties": [
                    {"name": "label",    "value": "🏠 Maison de Léonie"},
                    {"name": "resident", "value": "Léonie Bontemps"},
                    {"name": "sprite",   "value": "bat_leonie"},
                ]
            },
            {
                "id": 11, "name": "bulletin", "type": "building",
                "x": 10*TILE_SIZE, "y": (path_row-3)*TILE_SIZE,
                "width": 80, "height": 96,
                "properties": [
                    {"name": "label",    "value": "📰 Le Bulletin"},
                    {"name": "resident", "value": "Gustave Grenouillard"},
                    {"name": "sprite",   "value": "bat_bulletin"},
                ]
            },
            {
                "id": 12, "name": "maurice", "type": "building",
                "x": 10*TILE_SIZE, "y": (path_row+2)*TILE_SIZE,
                "width": 80, "height": 96,
                "properties": [
                    {"name": "label",    "value": "🎣 Maison de Maurice"},
                    {"name": "resident", "value": "Maurice Plongeur"},
                    {"name": "sprite",   "value": "bat_maurice"},
                ]
            },
            {
                "id": 20, "name": "clairiere_echo", "type": "hidden_zone",
                "x": 3*TILE_SIZE, "y": 3*TILE_SIZE,
                "width": 64, "height": 64,
                "properties": [
                    {"name": "label",    "value": "✨ Clairière de l'Écho"},
                    {"name": "fragment", "value": "F041"},
                    {"name": "hidden",   "value": True},
                ]
            },
            {
                "id": 21, "name": "quai_oublie", "type": "hidden_zone",
                "x": 15*TILE_SIZE, "y": 4*TILE_SIZE,
                "width": 64, "height": 64,
                "properties": [
                    {"name": "label",    "value": "⚓ Quai Oublié"},
                    {"name": "fragment", "value": "F042"},
                    {"name": "hidden",   "value": True},
                ]
            },
            {
                "id": 22, "name": "panneau_entree", "type": "sign",
                "x": 9*TILE_SIZE, "y": (MAP_H-4)*TILE_SIZE,
                "width": 32, "height": 32,
                "properties": [
                    {"name": "label", "value": "🪧 Pétaouchnok-les-Bains"},
                    {"name": "text",  "value": "Pétaouchnok-les-Bains existe depuis toujours et existera toujours. Probablement."},
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
        "width": MAP_W, "height": MAP_H,
        "tilewidth": TILE_SIZE, "tileheight": TILE_SIZE,
        "infinite": False,
        "nextlayerid": 20, "nextobjectid": 100,
        "properties": [
            {"name": "village",       "value": "Pétaouchnok-les-Bains"},
            {"name": "version",       "value": "1.1"},
            {"name": "mobileFormat",  "value": "portrait"},
            {"name": "tileSize",      "value": TILE_SIZE},
        ],
        "tilesets": tiled_tilesets,
        "layers": tiled_layers + [objects_layer],
    }
    return tiled_map


# ═══════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════
if __name__ == "__main__":
    print("🏘️  Pétaouchnok-les-Bains — Map Builder v1.1")
    print("=" * 45)

    print("\n1️⃣  Construction de la grille terrain...")
    grid = build_terrain_grid()
    print(f"   Grille {MAP_W}×{MAP_H} générée")

    print("\n2️⃣  Calcul des couches de tuiles Wang...")
    tile_layers = build_tile_layers(grid)
    print(f"   {len(tile_layers)} layers générés ({', '.join(tile_layers.keys())})")

    print("\n3️⃣  Téléchargement/vérification des tilesets...")
    offsets, meta = download_and_assemble_tilesets()

    print("\n4️⃣  Génération du JSON Tiled...")
    tiled_json = build_tiled_json(tile_layers, offsets)

    map_path = f"{OUT_DIR}/petaouchnok_map.json"
    with open(map_path, 'w', encoding='utf-8') as f:
        json.dump(tiled_json, f, ensure_ascii=False)
    print(f"   ✅ {map_path}")

    meta_path = f"{OUT_DIR}/tilesets_meta.json"
    with open(meta_path, 'w', encoding='utf-8') as f:
        json.dump(meta, f, ensure_ascii=False)
    print(f"   ✅ {meta_path}")

    print(f"""
✅ Map générée avec succès !
   Dimensions : {MAP_W*TILE_SIZE}×{MAP_H*TILE_SIZE}px ({MAP_W}×{MAP_H} tuiles)
   Tilesets   : 6 (4 originaux + river_bank + stone_grass)
   Layers     : 6 terrain + 1 objets
""")
