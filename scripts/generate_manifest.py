#!/usr/bin/env python3
"""
Recorre la carpeta /comics y genera /comics/manifest.json con la lista de
tomos y sus páginas, en orden, para que el visor los pueda leer.

Uso:
    python3 scripts/generate_manifest.py

Se ejecuta automáticamente en cada push gracias al workflow de GitHub Actions
(.github/workflows/deploy.yml), así que normalmente no hace falta correrlo a
mano: alcanza con subir una carpeta nueva dentro de /comics con las imágenes
del tomo.
"""
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
COMICS_DIR = ROOT / "comics"
MANIFEST_PATH = COMICS_DIR / "manifest.json"
VALID_EXT = {".jpg", ".jpeg", ".png", ".webp", ".gif"}


def natural_key(text: str):
    """Ordena 'pagina2' antes que 'pagina10'."""
    return [int(chunk) if chunk.isdigit() else chunk.lower()
            for chunk in re.split(r"(\d+)", text)]


def slugify(text: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")
    return slug or "tomo"


def build_manifest():
    volumes = []
    if not COMICS_DIR.exists():
        print("No existe la carpeta comics/, no hay nada que escanear.")
        return {"generated": datetime.now(timezone.utc).isoformat(), "volumes": []}

    folders = sorted(
        (p for p in COMICS_DIR.iterdir() if p.is_dir() and not p.name.startswith(".")),
        key=lambda p: natural_key(p.name),
    )

    for folder in folders:
        pages = sorted(
            (p for p in folder.iterdir() if p.suffix.lower() in VALID_EXT),
            key=lambda p: natural_key(p.name),
        )
        if not pages:
            continue
        rel_pages = [f"comics/{folder.name}/{p.name}" for p in pages]
        volumes.append({
            "id": slugify(folder.name),
            "title": folder.name,
            "pageCount": len(rel_pages),
            "pages": rel_pages,
        })

    return {
        "generated": datetime.now(timezone.utc).isoformat(),
        "volumes": volumes,
    }


def main():
    manifest = build_manifest()
    MANIFEST_PATH.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    total_pages = sum(v["pageCount"] for v in manifest["volumes"])
    print(f"manifest.json actualizado: {len(manifest['volumes'])} tomo(s), "
          f"{total_pages} página(s) en total.")


if __name__ == "__main__":
    sys.exit(main())
