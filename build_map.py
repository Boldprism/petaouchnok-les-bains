"""
Pétaouchnok-les-Bains — Map Builder v2.0
=========================================
4 tilesets chaînés PixelLab : grass_forest, grass_path, path_plaza, river_bank
Positions bâtiments validées le 2026-04-02
"""

import json, os

OUT_DIR     = "public/assets/map"
TILE_SIZE   = 32

TILESETS = {
    "grass_forest": {
        "id": "67024bed-066a-4298-8714-eb61d789ecd4",
        "lower": "grass", "upper": "forest",
        "lower_idx": 0,   "upper_idx": 1,
    },
    "grass_path": {
        "id": "1bbd148d-1654-4b0d-a594-a55f50ab52d4",
        "lower": "grass", "upper": "path",
        "lower_idx": 0,   "upper_idx": 2,
    },
    "path_plaza": {
        "id": "719d024d-c698-4bce-87e6-27f56a83541b",
        "lower": "path",  "upper": "plaza",
        "lower_idx": 2,   "upper_idx": 3,
    },
    "river_bank": {
        "id": "780aebdb-386c-457b-89f3-f61ee416754f",
        "lower": "river",  "upper": "grass",
        "lower_idx": 4,    "upper_idx": 0,
    },
}

MAP_W = 20
MAP_H = 36

# ─────────────────────────────────────
# TERRAIN GRID
# 0=herbe  1=forêt  2=chemin  3=place  4=rivière
# ─────────────────────────────────────
def build_terrain_grid():
    grid = [[0]*MAP_W for _ in range(MAP_H)]

    # Bordure forêt (2 tuiles)
    for y in range(MAP_H):
        for x in range(MAP_W):
            if x < 2 or x >= MAP_W-2 or y < 2 or y >= MAP_H-2:
                grid[y][x] = 1

    # Rivière (col ~16 avec oscillation sinueuse)
    river_col = MAP_W - 4  # = 16
    for y in range(2, MAP_H-2):
        offset = 1 if (y % 6 < 3) else 0
        for rx in range(river_col + offset - 1, river_col + offset + 2):
            if 0 <= rx < MAP_W:
                grid[y][rx] = 4
        # Forêt à l'est de la rivière
        for rx in range(river_col + offset + 2, MAP_W-2):
            if 0 <= rx < MAP_W:
                grid[y][rx] = 1

    path_row = MAP_H // 2  # = 18

    # Chemin horizontal principal (rows 13 et 20 = entrées plaza)
    for x in range(2, river_col - 1):
        grid[path_row][x] = 2
        grid[path_row+1][x] = 2

    # Chemin vertical principal (cols 8-9)
    path_col = MAP_W // 2 - 2  # = 8
    for y in range(2, MAP_H-2):
        if grid[y][path_col] not in [4, 1]:
            grid[y][path_col] = 2
            grid[y][path_col+1] = 2

    # Place centrale (x: 7-12, y: path_row-3 à path_row+4)
    plaza_x1, plaza_y1 = 7, path_row - 3   # (7, 15)
    plaza_x2, plaza_y2 = 13, path_row + 4  # (13, 22)
    for y in range(plaza_y1, plaza_y2):
        for x in range(plaza_x1, plaza_x2):
            grid[y][x] = 3

    # Chemin nord vers plaza (cols 8-9, au-dessus de la plaza)
    for y in range(plaza_y1 - 3, plaza_y1):
        grid[y][path_col] = 2
        grid[y][path_col+1] = 2

    # Chemin sud depuis plaza (cols 8-9, en dessous)
    for y in range(plaza_y2, plaza_y2 + 10):
        if y < MAP_H - 2:
            grid[y][path_col] = 2
            grid[y][path_col+1] = 2

    # Chemin est depuis plaza vers rivière
    for x in range(plaza_x2, plaza_x2 + 3):
        grid[path_row][x] = 2
        grid[path_row+1][x] = 2

    return grid


# ─────────────────────────────────────
# WANG TILING
# ─────────────────────────────────────
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
        return 1 if grid[gy][gx] == up else 0

    nw = is_upper(x,   y)
    ne = is_upper(x+1, y)
    sw = is_upper(x,   y+1)
    se = is_upper(x+1, y+1)

    local_idx = WANG_CORNER_TO_INDEX.get((nw, ne, sw, se), 15)
    ts_order  = list(TILESETS.keys())
    ts_offset = ts_order.index(ts_name) * 16
    return ts_offset + local_idx + 1


def build_tile_layers(grid):
    """Pour chaque layer, ne rendre que les tuiles proches du terrain 'cible'.
    grass_forest est le layer de base (couvre tout herbe+forêt).
    Les autres layers ne montrent que les transitions vers leur terrain cible."""

    # Terrain cible de chaque layer (celui qui n'est PAS déjà couvert par le base)
    TARGET = {
        "grass_forest": None,  # base — couvre tout
        "grass_path":   2,     # chemin
        "path_plaza":   3,     # place
        "river_bank":   4,     # rivière
    }

    layers = {}
    for ts_name in TILESETS:
        ts = TILESETS[ts_name]
        lo = ts["lower_idx"]
        up = ts["upper_idx"]
        target = TARGET[ts_name]

        layer_data = []
        for y in range(MAP_H):
            for x in range(MAP_W):
                cell = grid[y][x]

                # Skip si la cellule n'est ni lower ni upper de ce tileset
                if cell != lo and cell != up:
                    layer_data.append(0)
                    continue

                # Base layer : toujours inclure
                if target is None:
                    layer_data.append(terrain_to_tile_index(grid, x, y, ts_name))
                    continue

                # Non-base : inclure seulement si la cellule ou un coin Wang
                # touche le terrain cible
                near_target = (cell == target)
                if not near_target:
                    for dy in range(2):
                        for dx in range(2):
                            nx, ny = x + dx, y + dy
                            if 0 <= nx < MAP_W and 0 <= ny < MAP_H:
                                if grid[ny][nx] == target:
                                    near_target = True
                                    break
                        if near_target:
                            break

                if near_target:
                    layer_data.append(terrain_to_tile_index(grid, x, y, ts_name))
                else:
                    layer_data.append(0)

        layers[ts_name] = layer_data
    return layers


# ─────────────────────────────────────
# TILED JSON
# ─────────────────────────────────────
def build_tiled_json(tile_layers):
    ts_order = list(TILESETS.keys())

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

    layer_names = {
        "grass_forest": "Forêt",
        "grass_path":   "Chemins",
        "path_plaza":   "Place centrale",
        "river_bank":   "Rivière",
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
        })

    path_row = MAP_H // 2  # = 18

    # Positions bâtiments validées (2026-04-02)
    # Maurice (13,17) proche rivière, Bulletin (13,12) bordure NE,
    # Mairie (6,14) proche plaza
    objects_layer = {
        "id": 10, "name": "Bâtiments", "type": "objectgroup",
        "x": 0, "y": 0, "visible": True, "opacity": 1,
        "objects": [
            # Source thermale — centre plaza
            {"id": 1, "name": "source", "type": "source",
             "x": 9*TILE_SIZE, "y": 16*TILE_SIZE, "width": 64, "height": 64,
             "properties": [
                 {"name": "label", "value": "Source thermale"},
                 {"name": "interactive", "value": True},
                 {"name": "glow", "value": True}]},

            # --- Nord du village ---
            # Cabinet Médical — (4, 6)
            {"id": 8, "name": "medecin", "type": "building",
             "x": 4*TILE_SIZE, "y": 6*TILE_SIZE, "width": 96, "height": 96,
             "properties": [
                 {"name": "label", "value": "Cabinet Carapasse"},
                 {"name": "resident", "value": "Dr Octave Carapasse"},
                 {"name": "sprite", "value": "bat_medecin"}]},
            # Tour de guet — (7, 7)
            {"id": 9, "name": "hublot", "type": "building",
             "x": 7*TILE_SIZE, "y": 7*TILE_SIZE, "width": 96, "height": 112,
             "properties": [
                 {"name": "label", "value": "Tour de guet"},
                 {"name": "resident", "value": "Professeur Hublot"},
                 {"name": "sprite", "value": "bat_hublot"}]},
            # Maison Léonie — (10, 8)
            {"id": 10, "name": "leonie", "type": "building",
             "x": 10*TILE_SIZE, "y": 8*TILE_SIZE, "width": 96, "height": 96,
             "properties": [
                 {"name": "label", "value": "Maison de Léonie"},
                 {"name": "resident", "value": "Léonie Bontemps"},
                 {"name": "sprite", "value": "bat_leonie"}]},
            # Boulangerie — (3, 10)
            {"id": 2, "name": "boulangerie", "type": "building",
             "x": 3*TILE_SIZE, "y": 10*TILE_SIZE, "width": 96, "height": 96,
             "properties": [
                 {"name": "label", "value": "Boulangerie Mielleux"},
                 {"name": "resident", "value": "Gaston Mielleux"},
                 {"name": "sprite", "value": "bat_boulangerie"}]},
            # Le Bulletin — (13, 12) bordure nord-est
            {"id": 11, "name": "bulletin", "type": "building",
             "x": 13*TILE_SIZE, "y": 12*TILE_SIZE, "width": 80, "height": 96,
             "properties": [
                 {"name": "label", "value": "Le Bulletin"},
                 {"name": "resident", "value": "Gustave Grenouillard"},
                 {"name": "sprite", "value": "bat_bulletin"}]},

            # --- Autour de la plaza ---
            # Mairie — (6, 14) proche plaza ouest
            {"id": 3, "name": "mairie", "type": "building",
             "x": 6*TILE_SIZE, "y": 14*TILE_SIZE, "width": 96, "height": 96,
             "properties": [
                 {"name": "label", "value": "Mairie"},
                 {"name": "resident", "value": "Fernand Plongeot"},
                 {"name": "sprite", "value": "bat_mairie"}]},
            # Maison Maurice — (13, 17) proche rivière
            {"id": 12, "name": "maurice", "type": "building",
             "x": 13*TILE_SIZE, "y": 17*TILE_SIZE, "width": 80, "height": 96,
             "properties": [
                 {"name": "label", "value": "Maison de Maurice"},
                 {"name": "resident", "value": "Maurice Plongeur"},
                 {"name": "sprite", "value": "bat_maurice"}]},

            # --- Sud du village ---
            # Épicerie — (3, 23)
            {"id": 5, "name": "epicerie", "type": "building",
             "x": 3*TILE_SIZE, "y": 23*TILE_SIZE, "width": 96, "height": 96,
             "properties": [
                 {"name": "label", "value": "Épicerie Grignotier"},
                 {"name": "resident", "value": "Noisette Grignotier"},
                 {"name": "sprite", "value": "bat_epicerie"}]},
            # Garage — (10, 23)
            {"id": 6, "name": "garage", "type": "building",
             "x": 10*TILE_SIZE, "y": 23*TILE_SIZE, "width": 96, "height": 96,
             "properties": [
                 {"name": "label", "value": "Garage Mâchefer"},
                 {"name": "resident", "value": "Théodore Mâchefer"},
                 {"name": "sprite", "value": "bat_garage"}]},
            # Fleuriste — (4, 26)
            {"id": 7, "name": "fleuriste", "type": "building",
             "x": 4*TILE_SIZE, "y": 26*TILE_SIZE, "width": 96, "height": 96,
             "properties": [
                 {"name": "label", "value": "Fleuriste Duduche"},
                 {"name": "resident", "value": "Rosalie Duduche"},
                 {"name": "sprite", "value": "bat_fleuriste"}]},
            # Bibliothèque — (10, 27)
            {"id": 4, "name": "bibliotheque", "type": "building",
             "x": 10*TILE_SIZE, "y": 27*TILE_SIZE, "width": 96, "height": 96,
             "properties": [
                 {"name": "label", "value": "Bibliothèque"},
                 {"name": "resident", "value": "Madeleine Épinette"},
                 {"name": "sprite", "value": "bat_bibliotheque"}]},

            # --- Zones cachées ---
            {"id": 20, "name": "clairiere_echo", "type": "hidden_zone",
             "x": 3*TILE_SIZE, "y": 3*TILE_SIZE, "width": 64, "height": 64,
             "properties": [
                 {"name": "label", "value": "Clairière de l'Écho"},
                 {"name": "fragment", "value": "F041"},
                 {"name": "hidden", "value": True}]},
            {"id": 21, "name": "quai_oublie", "type": "hidden_zone",
             "x": 14*TILE_SIZE, "y": 4*TILE_SIZE, "width": 64, "height": 64,
             "properties": [
                 {"name": "label", "value": "Quai Oublié"},
                 {"name": "fragment", "value": "F042"},
                 {"name": "hidden", "value": True}]},
            # Panneau d'entrée sud
            {"id": 22, "name": "panneau_entree", "type": "sign",
             "x": 8*TILE_SIZE, "y": 31*TILE_SIZE, "width": 64, "height": 32,
             "properties": [
                 {"name": "label", "value": "Pétaouchnok-les-Bains"},
                 {"name": "text", "value": "Pétaouchnok-les-Bains existe depuis toujours et existera toujours. Probablement."}]},
        ]
    }

    return {
        "version": "1.10", "tiledversion": "1.10.0", "type": "map",
        "orientation": "orthogonal", "renderorder": "right-down",
        "width": MAP_W, "height": MAP_H,
        "tilewidth": TILE_SIZE, "tileheight": TILE_SIZE,
        "infinite": False, "nextlayerid": 20, "nextobjectid": 100,
        "properties": [
            {"name": "village", "value": "Pétaouchnok-les-Bains"},
            {"name": "version", "value": "2.0"},
        ],
        "tilesets": tiled_tilesets,
        "layers": tiled_layers + [objects_layer],
    }


# ─────────────────────────────────────
# MAIN
# ─────────────────────────────────────
if __name__ == "__main__":
    print("Pétaouchnok-les-Bains — Map Builder v2.0")
    print("=" * 45)

    print("\n1. Grille terrain...")
    grid = build_terrain_grid()

    print("\n2. Layers Wang...")
    tile_layers = build_tile_layers(grid)
    for name, layer in tile_layers.items():
        non_zero = sum(1 for t in layer if t != 0)
        print(f"   {name}: {non_zero} tuiles")

    print("\n3. JSON Tiled...")
    tiled_json = build_tiled_json(tile_layers)

    map_path = f"{OUT_DIR}/petaouchnok_map.json"
    os.makedirs(OUT_DIR, exist_ok=True)
    with open(map_path, 'w', encoding='utf-8') as f:
        json.dump(tiled_json, f, ensure_ascii=False)
    print(f"   {map_path}")

    print("\nDone!")
