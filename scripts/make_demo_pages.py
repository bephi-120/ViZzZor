#!/usr/bin/env python3
"""
Genera páginas de ejemplo (placeholders) para que el sitio tenga contenido
de muestra apenas se publica. Se puede borrar la carpeta comics/Tomo de ejemplo 1
y comics/Tomo de ejemplo 2 sin problema una vez que subas tus propios tomos.
"""
import random
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 1800
ROOT = Path(__file__).resolve().parent.parent / "comics"

INK = (17, 19, 23)
PAPER = (232, 228, 217)
RED = (214, 51, 66)

def font(size):
    for path in (
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ):
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()

def halftone(draw, w, h, color, step=26, max_r=6, seed=0):
    rnd = random.Random(seed)
    y = step // 2
    while y < h:
        x = step // 2
        row = 0
        while x < w:
            r = max_r * (0.35 + 0.65 * rnd.random())
            draw.ellipse([x - r, y - r, x + r, y + r], fill=color)
            x += step
            row += 1
        y += step

def make_page(volume_title, page_no, total, out_path):
    img = Image.new("RGB", (W, H), PAPER)
    d = ImageDraw.Draw(img, "RGBA")

    # fondo de trama (halftone) tenue
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    halftone(od, W, H, INK + (18,), step=30, max_r=5, seed=page_no)
    img.paste(Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB"))

    # borde tipo viñeta de cómic
    border = 22
    d.rectangle([border, border, W - border, H - border], outline=INK, width=10)

    # bloque de color con el número de página, estilo panel
    band_h = 420
    band_y = H // 2 - band_h // 2
    d.rectangle([border + 10, band_y, W - border - 10, band_y + band_h], fill=INK)
    d.rectangle([border + 10, band_y, W - border - 10, band_y + band_h], outline=RED, width=6)

    f_big = font(230)
    f_mid = font(58)
    f_small = font(40)

    num_text = f"{page_no:02d}"
    bbox = d.textbbox((0, 0), num_text, font=f_big)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    d.text((W / 2 - tw / 2, band_y + band_h / 2 - th / 2 - bbox[1] - 40), num_text,
           font=f_big, fill=PAPER)

    label = f"PÁGINA {page_no} / {total}"
    bbox2 = d.textbbox((0, 0), label, font=f_mid)
    tw2 = bbox2[2] - bbox2[0]
    d.text((W / 2 - tw2 / 2, band_y + band_h - 92), label, font=f_mid, fill=RED)

    # título del tomo arriba
    bbox3 = d.textbbox((0, 0), volume_title.upper(), font=f_small)
    tw3 = bbox3[2] - bbox3[0]
    d.text((W / 2 - tw3 / 2, border + 46), volume_title.upper(), font=f_small, fill=INK)

    # marca de agua abajo
    watermark = "ViZzZor · página de muestra, reemplazá esta carpeta con tu cómic"
    bbox4 = d.textbbox((0, 0), watermark, font=font(26))
    tw4 = bbox4[2] - bbox4[0]
    d.text((W / 2 - tw4 / 2, H - border - 70), watermark, font=font(26), fill=(90, 88, 82))

    img.save(out_path, quality=90)

def main():
    demo_volumes = {
        "Tomo de ejemplo 1": 6,
        "Tomo de ejemplo 2": 4,
    }
    for title, count in demo_volumes.items():
        folder = ROOT / title
        folder.mkdir(parents=True, exist_ok=True)
        for i in range(1, count + 1):
            make_page(title, i, count, folder / f"{i:03d}.jpg")
        print(f"Generado: {title} ({count} páginas)")

if __name__ == "__main__":
    main()
