from PIL import Image, ImageDraw, ImageFont
import math

# Create 256x256 favicon
size = 256
img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# Background circle with subtle gradient feel
cx, cy = size // 2, size // 2
r = 120

# Dark circle background
draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill="#0a0e17", outline="#e8956a", width=3)

# Draw calligraphic "SP" using bezier-like strokes
# S - calligraphic style
s_points = [
    # Top curve of S
    (75, 95), (110, 80), (135, 85), (140, 100),
    (138, 112), (115, 118), (95, 125),
    # Bottom curve of S
    (85, 132), (80, 148), (88, 160),
    (105, 168), (130, 162), (135, 150),
]

# Draw S with thick-thin variation (calligraphic)
for i in range(len(s_points) - 1):
    x1, y1 = s_points[i]
    x2, y2 = s_points[i + 1]
    # Vary width for calligraphic effect
    if i < 4:
        w = 4 if i % 2 == 0 else 2
    elif i < 8:
        w = 3
    else:
        w = 4 if i % 2 == 0 else 2
    draw.line([(x1, y1), (x2, y2)], fill="#e8956a", width=w)

# P - calligraphic style
p_points_stem = [(150, 80), (150, 170)]  # Vertical stem
draw.line(p_points_stem, fill="#e8956a", width=3)

# P bowl
p_bowl = [
    (150, 82), (160, 78), (175, 80), (183, 90),
    (183, 105), (175, 115), (160, 118), (150, 115),
]
for i in range(len(p_bowl) - 1):
    x1, y1 = p_bowl[i]
    x2, y2 = p_bowl[i + 1]
    w = 3 if i in [0, 1, 5, 6] else 2
    draw.line([(x1, y1), (x2, y2)], fill="#e8956a", width=w)

# Add a subtle calligraphic flourish under SP
flourish = [(70, 175), (100, 180), (140, 178), (180, 182), (190, 176)]
for i in range(len(flourish) - 1):
    draw.line([flourish[i], flourish[i + 1]], fill="#e8956a", width=1)

# Save as multiple sizes
img.save("public/favicon.png")

# Also save 32x32 ICO-compatible
img_32 = img.resize((32, 32), Image.LANCZOS)
img_32.save("public/favicon-32.png")

# Save SVG version for better quality
svg = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
  <circle cx="128" cy="128" r="120" fill="#0a0e17" stroke="#e8956a" stroke-width="3"/>
  <text x="128" y="145" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-weight="400" font-size="90" fill="#e8956a" letter-spacing="-2">SP</text>
  <line x1="68" y1="170" x2="188" y2="170" stroke="#e8956a" stroke-width="1.5" opacity="0.6"/>
</svg>'''

with open("public/favicon.svg", "w") as f:
    f.write(svg)

print("Favicons generated: favicon.png, favicon-32.png, favicon.svg")
