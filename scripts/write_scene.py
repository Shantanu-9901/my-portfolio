#!/usr/bin/env python3
import os

content = r'''import { useEffect, useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { useLoading } from "../../context/LoadingProvider";
import { setProgress } from "../Loading";
import { setAllTimeline } from "../utils/GsapScroll";
import { initialFX } from "../utils/initialFX";

const FRAME_COUNT = 120;

const Scene = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentFrameRef = useRef(0);
  const { setLoading, setIsLoading } = useLoading();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const progress = setProgress((value) => setLoading(value));

    const loadImages = async () => {
      const pending: Promise<HTMLImageElement | null>[] = [];
      for (let i = 0; i < FRAME_COUNT; i++) {
        const promise = new Promise<HTMLImageElement | null>((resolve) => {
          const img = new Image();
          img.src = `/sequence/frame_${String(i).padStart(3, "0")}.png`;
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
        });
        pending.push(promise);
      }
      const results = await Promise.all(pending);
      const valid = results.filter((r): r is HTMLImageElement => r !== null);
      setImages(valid);
      setImagesLoaded(true);

      progress.loaded().then(() => {
        setTimeout(() => {
          setIsLoading(false);
          setTimeout(() => {
            initialFX();
            setAllTimeline();
          }, 100);
        }, 2500);
      });
    };

    loadImages();
  }, []);

  const drawImage = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !imagesLoaded || !images[index]) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = images[index];

    if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const cx = (canvas.width - img.width * ratio) / 2;
    const cy = (canvas.height - img.height * ratio) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);
  };

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (!imagesLoaded) return;
    const frameIndex = Math.min(images.length - 1, Math.floor(latest * images.length));
    currentFrameRef.current = frameIndex;
    requestAnimationFrame(() => drawImage(frameIndex));
  });

  useEffect(() => {
    if (imagesLoaded && images[0]) {
      drawImage(currentFrameRef.current);
    }
    const handleResize = () => {
      requestAnimationFrame(() => drawImage(currentFrameRef.current));
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [imagesLoaded, images]);

  return (
    <div ref={containerRef} className="scrolly-container">
      <div className="scrolly-sticky">
        <canvas ref={canvasRef} className="scrolly-canvas" />
      </div>
    </div>
  );
};

export default Scene;
'''

target = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'src', 'components', 'Character', 'Scene.tsx')
with open(target, 'w') as f:
    f.write(content)
print(f"Wrote {len(content)} bytes to {target}")
