from PIL import Image, ImageDraw
import random

random.seed(99)

img = Image.new("RGB", (800, 400), "#0a0e17")
draw = ImageDraw.Draw(img)

# Grid background
for x in range(0, 800, 50):
    draw.line([(x, 0), (x, 400)], fill="#141a2a", width=1)
for y in range(0, 400, 50):
    draw.line([(0, y), (800, y)], fill="#141a2a", width=1)

# Radar circle (left side)
rcx, rcy = 250, 200
for r in range(40, 180, 35):
    draw.ellipse([rcx - r, rcy - r, rcx + r, rcy + r], outline="#1a2a3a", width=1)
# Radar cross
draw.line([(rcx - 170, rcy), (rcx + 170, rcy)], fill="#1a2a3a", width=1)
draw.line([(rcx, rcy - 170), (rcx, rcy + 170)], fill="#1a2a3a", width=1)
# Radar sweep
import math
for a in range(0, 60, 2):
    rad = math.radians(a + 200)
    x1 = rcx + int(170 * math.cos(rad))
    y1 = rcy + int(170 * math.sin(rad))
    alpha = max(20, 60 - a)
    color = (232, 149, 106)
    draw.line([(rcx, rcy), (x1, y1)], fill=color, width=1)

# Blips on radar
blips = [(rcx + 50, rcy - 30), (rcx - 80, rcy + 60), (rcx + 100, rcy + 20), (rcx - 40, rcy - 90)]
for bx, by in blips:
    draw.ellipse([bx - 4, by - 4, bx + 4, by + 4], fill="#e8956a")
    draw.ellipse([bx - 10, by - 10, bx + 10, by + 10], outline="#e8956a", width=1)

# Center dot
draw.ellipse([rcx - 5, rcy - 5, rcx + 5, rcy + 5], fill="#e8956a")

# Robot/vehicle outline (right side)
# Tank body
draw.rounded_rectangle([520, 180, 720, 280], radius=8, fill="#111825", outline="#e8956a", width=2)
# Turret
draw.rounded_rectangle([580, 150, 680, 195], radius=5, fill="#111825", outline="#c67a52", width=2)
# Gun barrel
draw.rectangle([680, 165, 750, 175], fill="#e8956a")
# Tracks
draw.rounded_rectangle([510, 275, 730, 300], radius=5, fill="#111825", outline="#3a4a5a", width=1)
# Track details
for tx in range(520, 720, 15):
    draw.line([(tx, 276), (tx, 299)], fill="#2a3a4a", width=1)
# Camera/sensor eye
draw.ellipse([595, 210, 625, 240], fill="#0a0e17", outline="#e8956a", width=2)
draw.ellipse([605, 218, 617, 230], fill="#e8956a")
# Antenna
draw.line([(560, 150), (550, 110)], fill="#e8956a", width=2)
draw.ellipse([545, 105, 555, 115], fill="#e8956a")

# Autonomous tracking lines from robot to targets
targets = [(rcx + 50, rcy - 30), (rcx + 100, rcy + 20)]
for tx, ty in targets:
    draw.line([(595, 225), (tx, ty)], fill="#3a2520", width=1)
    draw.rectangle([tx - 12, ty - 12, tx + 12, ty + 12], outline="#e8956a", width=1)

# HUD elements
draw.text((50, 20), "GUARDIO", fill="#e8956a")
draw.text((50, 40), "DEFENSE ROBOTICS SYSTEM", fill="#ffffff")
draw.text((50, 60), "DRDO & Indian Army", fill="#666666")

# Status panel (bottom left)
draw.rectangle([50, 330, 230, 385], fill="#0d1220", outline="#1a2a3a", width=1)
draw.text((60, 338), "TRACKING: 4 TARGETS", fill="#e8956a")
draw.text((60, 356), "MODE: AUTONOMOUS", fill="#4a8a6a")
draw.text((60, 370), "STATUS: OPERATIONAL", fill="#2aff6a")

# Right side specs
specs = ["AGENTIC AI", "COMPUTER VISION", "TRACKING: REAL-TIME", "AUTONOMY: LVL 4"]
for i, s in enumerate(specs):
    draw.text((540, 320 + i * 18), s, fill="#555555")

# Crosshair markers
for cx2, cy2 in [(rcx + 50, rcy - 30), (rcx - 80, rcy + 60)]:
    size = 15
    draw.line([(cx2 - size, cy2), (cx2 - 5, cy2)], fill="#e8956a", width=1)
    draw.line([(cx2 + 5, cy2), (cx2 + size, cy2)], fill="#e8956a", width=1)
    draw.line([(cx2, cy2 - size), (cx2, cy2 - 5)], fill="#e8956a", width=1)
    draw.line([(cx2, cy2 + 5), (cx2, cy2 + size)], fill="#e8956a", width=1)

img.save("public/images/guardio.png")
print("guardio.png saved (800x400)")
