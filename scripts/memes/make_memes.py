"""Render "Robots, unimpressed." memes: real-font captions over illustrated robot scenes (b1-b4.jpg here). Usage: python3 scripts/gary/make_memes.py scripts/gary <out_dir>"""
import sys
from PIL import Image, ImageDraw, ImageFont
G = "/usr/share/fonts/truetype/sand-box/google/"
def font(path, size, wght):
    f = ImageFont.truetype(G + path, size)
    try:
        axes = f.get_variation_axes(); vals = []
        for a in axes:
            n = a.get("name", b"")
            n = n.decode() if isinstance(n, bytes) else n
            vals.append(wght if "eight" in n or n == "wght" else (30 if "Soft" in n or n == "SOFT" else a["default"]))
        f.set_variation_by_axes(vals)
    except Exception: pass
    return f
INK, CREAM, CORAL, MUTED = (43, 36, 32), (251, 247, 240), (237, 115, 71), (120, 110, 102)
W, PAD = 1080, 72
def wrap(d, text, f, maxw):
    words, lines, cur = text.split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if d.textlength(t, font=f) <= maxw: cur = t
        else: lines.append(cur); cur = w
    lines.append(cur); return lines
def meme(img_path, setup, punch, out, crop=None):
    setup_f = font("Figtree/Figtree-VariableFont_wght.ttf", 50, 500)
    punch_f = font("Fraunces/Fraunces-VariableFont_SOFT,WONK,opsz,wght.ttf", 66, 650)
    tag_f = font("Figtree/Figtree-VariableFont_wght.ttf", 28, 600)
    tmp = ImageDraw.Draw(Image.new("RGB", (10, 10)))
    sl = wrap(tmp, setup, setup_f, W - 2 * PAD); pl = wrap(tmp, punch, punch_f, W - 2 * PAD)
    th = PAD + len(sl) * 66 + 26 + len(pl) * 80 + 40
    art = Image.open(img_path).convert("RGB")
    if crop: art = art.crop((0, int(art.height * crop[0]), art.width, int(art.height * crop[1])))
    art = art.resize((W, int(art.height * W / art.width)), Image.LANCZOS)
    foot = 96
    im = Image.new("RGB", (W, th + art.height + foot), CREAM); d = ImageDraw.Draw(im)
    y = PAD
    for l in sl: d.text((PAD, y), l, font=setup_f, fill=MUTED); y += 66
    y += 26
    for l in pl: d.text((PAD, y), l, font=punch_f, fill=INK); y += 80
    im.paste(art, (0, th))
    fy = th + art.height + foot // 2
    d.ellipse((PAD, fy - 9, PAD + 18, fy + 9), fill=CORAL)
    d.text((PAD + 32, fy), "Robots, unimpressed.", font=tag_f, fill=INK, anchor="lm")
    d.text((W - PAD, fy), "smbagentsai.com", font=tag_f, fill=MUTED, anchor="rm")
    im.save(out, optimize=True); print(out, im.size)
if __name__ == "__main__":
    src, dst = sys.argv[1], sys.argv[2]
    M = [
      ("b1.jpg", "The vendor demo called it a \u201cmulti-agent swarm.\u201d", "It\u2019s me. I\u2019m the swarm."),
      ("b2.jpg", "You asked me to automate your operations.", "You don\u2019t have operations. You have a shoebox and a guy named Dave."),
      ("b3.jpg", "I analyzed 10,000 jobs exactly like yours.", "It\u2019s not two weeks. It has never once been two weeks."),
      ("b4.jpg", "Raised $40M to be \u201cfully autonomous.\u201d", "Still emails you to ask if it should email you."),
    ]
    CROPS = {2: (0.2, 0.9)}
    for i, (img, s, p) in enumerate(M, 1): meme(f"{src}/{img}", s, p, f"{dst}/gary-memes-v2-{i}.png", CROPS.get(i))
