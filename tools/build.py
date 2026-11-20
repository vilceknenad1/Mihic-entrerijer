"""Build helpers for the Enterijer Mihić site.

  python3 tools/build.py images  <render_dir>   -> assets/img/*.webp + og-image.jpg
  python3 tools/build.py artifact <out.html>    -> single self-contained preview page

The production site is index.html + assets/ as-is; the artifact build only exists
to preview everything as one file (images inlined as data URIs).
"""
import base64, re, sys, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
IMG = ROOT / "assets" / "img"

def images(render_dir):
    from PIL import Image, ImageEnhance, ImageFilter
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    wanted = set(re.findall(r"assets/img/([a-z_]+)-(\d+)\.webp", html))
    IMG.mkdir(parents=True, exist_ok=True)
    cache = {}
    for name, label in sorted(wanted):
        if name not in cache:
            im = Image.open(pathlib.Path(render_dir) / f"{name}.png").convert("RGB")
            im = ImageEnhance.Contrast(im).enhance(1.04)
            cache[name] = im
        im = cache[name]
        w = min(int(label), im.width)
        h = round(im.height * w / im.width)
        out = im.resize((w, h), Image.LANCZOS)
        if w < im.width:
            out = out.filter(ImageFilter.UnsharpMask(radius=1.2, percent=40, threshold=2))
        q = 90 if w <= 800 else 88
        out.save(IMG / f"{name}-{label}.webp", "WEBP", quality=q, method=6)
        print(f"{name}-{label}.webp", w, h)
    hero = cache.get("kitchen_hero") or Image.open(pathlib.Path(render_dir) / "kitchen_hero.png").convert("RGB")
    W, H = hero.size; th = round(W * 630 / 1200)
    hero.crop((0, (H - th) // 2, W, (H - th) // 2 + th)).resize((1200, 630), Image.LANCZOS).save(IMG / "og-image.jpg", quality=84)

def data_uri(path):
    return "data:image/webp;base64," + base64.b64encode(path.read_bytes()).decode()

def artifact(out):
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    css = (ROOT / "assets/css/main.css").read_text(encoding="utf-8")
    cfg = (ROOT / "assets/js/config.js").read_text(encoding="utf-8")
    js = (ROOT / "assets/js/main.js").read_text(encoding="utf-8")
    head = re.search(r"<head>(.*?)</head>", html, re.S).group(1)
    body = re.search(r"<body>(.*?)</body>", html, re.S).group(1)
    # head: drop charset/viewport (skeleton supplies them), preload, og:image (relative), local css link
    head = re.sub(r'<meta charset[^>]*>\s*|<meta name="viewport"[^>]*>\s*', "", head)
    head = re.sub(r'<link rel="preload"[^>]*>\s*', "", head)
    head = re.sub(r'<meta property="og:image[^>]*>\s*', "", head)
    head = head.replace('<link rel="stylesheet" href="assets/css/main.css">', f"<style>\n{css}\n</style>")
    # body: images → data URIs, no srcset
    body = re.sub(r'\s(srcset|sizes)="[^"]*"', "", body)
    body = re.sub(r'\sdata-full="[^"]*"', "", body)
    body = re.sub(r'src="assets/img/([a-z_]+-\d+\.webp)"', lambda m: f'src="{data_uri(IMG / m.group(1))}"', body)
    fx = (ROOT / "assets/js/fx.js").read_text(encoding="utf-8")
    for tag, code in [('<script src="assets/js/config.js"></script>', cfg),
                      ('<script src="assets/js/fx.js"></script>', fx),
                      ('<script src="assets/js/main.js"></script>', "document.documentElement.lang='sr-Latn';\n" + js)]:
        assert tag in body, tag
        body = body.replace(tag, f"<script>\n{code}\n</script>")
    pathlib.Path(out).write_text(head.strip() + "\n" + body, encoding="utf-8")
    print("artifact", out, round(pathlib.Path(out).stat().st_size / 1e6, 2), "MB")

if __name__ == "__main__":
    {"images": images, "artifact": artifact}[sys.argv[1]](sys.argv[2])
