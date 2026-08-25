#!/usr/bin/env python3
"""
Regenerate the full favicon set from public/avatar.png (already circular + transparent).

Outputs (all under public/):
  - icon-32.png            32x32
  - icon-192.png          192x192
  - apple-touch-icon.png  180x180
  - favicon.ico           multi-res 16/32/48

Uses LANCZOS for high-quality downscale. Preserves RGBA transparency.
"""
from pathlib import Path
from PIL import Image

HERE = Path(__file__).resolve().parent
SRC = HERE / "avatar.png"

TARGETS = [
    ("icon-32.png", (32, 32)),
    ("icon-192.png", (192, 192)),
    ("apple-touch-icon.png", (180, 180)),
]
ICO_SIZES = [(16, 16), (32, 32), (48, 48)]


def load_source() -> Image.Image:
    im = Image.open(SRC).convert("RGBA")
    print(f"[src] {SRC.name}  {im.size}  {im.mode}")
    return im


def resize(src: Image.Image, size: tuple[int, int]) -> Image.Image:
    return src.resize(size, Image.LANCZOS)


def main() -> None:
    src = load_source()

    for name, size in TARGETS:
        out = HERE / name
        resize(src, size).save(out, format="PNG", optimize=True)
        print(f"[png] {name:22s} -> {size}")

    ico_out = HERE / "favicon.ico"
    ico_frames = [resize(src, s) for s in ICO_SIZES]
    ico_frames[0].save(ico_out, format="ICO", sizes=ICO_SIZES, append_images=ico_frames[1:])
    print(f"[ico] {ico_out.name:22s} -> {ICO_SIZES}")


if __name__ == "__main__":
    main()
