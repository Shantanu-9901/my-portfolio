from PIL import Image, ImageDraw
import math
import random

random.seed(42)

# ── 1. Diamond Polishing Robot ──
img = Image.new("RGB", (800, 400), "#0a0e17")
draw = ImageDraw.Draw(img)

# Grid background
for x in range(0, 800, 40):
    draw.line([(x, 0), (x, 400)], fill="#141a2a", width=1)
for y in range(0, 400, 40):
    draw.line([(0, y), (800, y)], fill="#141a2a", width=1)

# Diamond shape
cx, cy = 280, 200
pts = [(cx, cy - 90), (cx + 70, cy), (cx, cy + 90), (cx - 70, cy)]
draw.polygon(pts, fill="#1a1a30", outline="#e8956a", width=2)
pts2 = [(cx, cy - 55), (cx + 42, cy), (cx, cy + 55), (cx - 42, cy)]
draw.polygon(pts2, fill="#1a1a30", outline="#c67a52", width=1)

# Sparkle lines
for angle in range(0, 360, 45):
    rad = math.radians(angle)
    x1 = cx + int(100 * math.cos(rad))
    y1 = cy + int(100 * math.sin(rad))
    x2 = cx + int(120 * math.cos(rad))
    y2 = cy + int(120 * math.sin(rad))
    draw.line([(x1, y1), (x2, y2)], fill="#e8956a", width=1)

# Robot arm
draw.rectangle([520, 300, 600, 340], fill="#2a2a3a", outline="#e8956a", width=1)
draw.line([(560, 300), (560, 220), (620, 160), (680, 180)], fill="#e8956a", width=3)
for jx, jy in [(560, 220), (620, 160), (680, 180)]:
    draw.ellipse([jx - 6, jy - 6, jx + 6, jy + 6], fill="#0a0e17", outline="#e8956a", width=2)
draw.polygon([(680, 180), (700, 170), (710, 185), (700, 195)], fill="#e8956a")

# Scan lines from robot to diamond
for i in range(8):
    y_off = -30 + i * 8
    draw.line([(678, 180 + y_off), (350, 200 + y_off)], fill="#3a2520", width=1)

# Labels
draw.text((80, 30), "6-AXIS ROBOTIC", fill="#e8956a")
draw.text((80, 50), "DIAMOND POLISHING SYSTEM", fill="#ffffff")
draw.text((80, 70), "Industrial Automation — Armenia", fill="#666666")

specs = ["CV ANALYSIS", "ADAPTIVE MOTION", "PRECISION: 0.01mm", "AXES: 6-DOF"]
for i, s in enumerate(specs):
    draw.text((560, 40 + i * 20), s, fill="#555555")

# Data readout
draw.rectangle([50, 320, 220, 385], fill="#0d1220", outline="#1a2a3a", width=1)
draw.text((60, 330), "PRESSURE: 2.4N", fill="#4a6a5a")
draw.text((60, 348), "RPM: 12,400", fill="#4a6a5a")
draw.text((60, 366), "STATUS: ACTIVE", fill="#2aff6a")

img.save("public/images/diamond-robot.png")
print("diamond-robot.png saved (800x400)")


# ── 2. Genworth NLP Engine ──
img2 = Image.new("RGB", (800, 400), "#0a0e17")
draw2 = ImageDraw.Draw(img2)

# Neural network nodes
layers = [
    [(120, 80), (120, 160), (120, 240), (120, 320)],
    [(280, 50), (280, 130), (280, 210), (280, 290), (280, 370)],
    [(440, 100), (440, 200), (440, 300)],
    [(580, 120), (580, 200), (580, 280)],
    [(700, 160), (700, 240)],
]

# Connections
for li in range(len(layers) - 1):
    for n1 in layers[li]:
        for n2 in layers[li + 1]:
            brightness = random.randint(20, 50)
            color = (232, 149, 106) if brightness > 35 else (100, 70, 50)
            draw2.line([n1, n2], fill=color, width=1)

# Nodes
for layer in layers:
    for nx, ny in layer:
        r = random.randint(6, 12)
        draw2.ellipse([nx - r, ny - r, nx + r, ny + r], fill="#1a1a30", outline="#e8956a", width=2)

# Floating tokens
tokens = ["NLP", "BLEU", "FUZZY", "MATCH", "REC", "RANK", "TEXT", "PIPE"]
positions = [(30, 60), (30, 160), (30, 260), (30, 350),
             (740, 80), (740, 180), (740, 280), (740, 350)]
for tok, (tx, ty) in zip(tokens, positions):
    draw2.rectangle([tx, ty, tx + 48, ty + 18], fill="#1a1020", outline="#5a3a2a", width=1)
    draw2.text((tx + 4, ty + 3), tok, fill="#e8956a")

# Pipeline arrows
for x in range(100, 720, 25):
    draw2.text((x, 385), ">", fill="#2a3a4a")

# Labels
draw2.text((30, 10), "NLP ENGINE", fill="#e8956a")
draw2.text((120, 10), "// Recommendation Pipeline", fill="#444444")

# Score display
draw2.rectangle([640, 20, 790, 68], fill="#0d1220", outline="#1a2a3a", width=1)
draw2.text((650, 26), "BLEU: 0.847", fill="#e8956a")
draw2.text((650, 44), "FUZZY: 92.3%  F1: 0.913", fill="#4a8a6a")

img2.save("public/images/genworth-nlp.png")
print("genworth-nlp.png saved (800x400)")


# ── 3. Afinity Platform ──
img3 = Image.new("RGB", (800, 400), "#0a0e17")
draw3 = ImageDraw.Draw(img3)

# Docker containers
containers = [
    (80, 80, 220, 160, "API Server", "#e8956a"),
    (260, 80, 400, 160, "Worker", "#c67a52"),
    (440, 80, 580, 160, "Redis", "#a86040"),
    (80, 200, 220, 280, "Postgres", "#c67a52"),
    (260, 200, 400, 280, "Nginx", "#e8956a"),
    (440, 200, 580, 280, "Monitor", "#a86040"),
]

for x1, y1, x2, y2, name, color in containers:
    draw3.rectangle([x1, y1, x2, y2], fill="#111825", outline=color, width=2)
    draw3.rectangle([x1, y1, x2, y1 + 20], fill=color)
    draw3.text((x1 + 8, y1 + 4), name, fill="#0a0e17")
    draw3.ellipse([x2 - 16, y1 + 5, x2 - 6, y1 + 15], fill="#2aff6a")
    for ly in range(y1 + 30, y2 - 10, 12):
        w = random.randint(40, x2 - x1 - 30)
        draw3.line([(x1 + 10, ly), (x1 + 10 + w, ly)], fill="#2a3040", width=1)

# Connections between containers
draw3.line([(220, 120), (260, 120)], fill="#3a4a5a", width=2)
draw3.line([(400, 120), (440, 120)], fill="#3a4a5a", width=2)
draw3.line([(150, 160), (150, 200)], fill="#3a4a5a", width=2)
draw3.line([(330, 160), (330, 200)], fill="#3a4a5a", width=2)
draw3.line([(510, 160), (510, 200)], fill="#3a4a5a", width=2)

# CI/CD Pipeline
draw3.text((625, 55), "CI/CD PIPELINE", fill="#e8956a")
stages = ["BUILD", "TEST", "STAGE", "DEPLOY"]
for i, stage in enumerate(stages):
    y = 80 + i * 52
    draw3.rounded_rectangle([630, y, 770, y + 35], radius=4, fill="#111825", outline="#3a4a5a", width=1)
    draw3.text((650, y + 10), stage, fill="#888888")
    draw3.text((745, y + 10), "OK", fill="#2aff6a")
    if i < len(stages) - 1:
        draw3.line([(700, y + 35), (700, y + 52)], fill="#3a4a5a", width=1)

# AWS cloud box
draw3.rounded_rectangle([50, 50, 610, 310], radius=12, outline="#1a2a3a", width=1)
draw3.text((55, 290), "AWS ECS CLUSTER", fill="#2a3a4a")

# Bottom metrics
draw3.rectangle([50, 340, 770, 385], fill="#0d1220", outline="#1a2a3a", width=1)
draw3.text((70, 355), "UPTIME: 99.97%", fill="#4a8a6a")
draw3.text((250, 355), "BUILDS: 1,247", fill="#4a8a6a")
draw3.text((430, 355), "DEPLOYS: 892", fill="#4a8a6a")
draw3.text((610, 355), "LATENCY: 42ms", fill="#4a8a6a")

img3.save("public/images/afinity.png")
print("afinity.png saved (800x400)")
