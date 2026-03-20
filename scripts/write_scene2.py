#!/usr/bin/env python3
import os

content = '''import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLoading } from "../../context/LoadingProvider";
import { setProgress } from "../Loading";
import { setAllTimeline } from "../utils/GsapScroll";
import { initialFX } from "../utils/initialFX";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 120;

const Scene = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentFrameRef = useRef(0);
  const { setLoading, setIsLoading } = useLoading();

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

  const drawImage = (index: number, imgs?: HTMLImageElement[]) => {
    const canvas = canvasRef.current;
    const imageList = imgs || images;
    if (!canvas || !imageList[index]) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = imageList[index];

    const dpr = window.devicePixelRatio || 1;
    const w = window.innerWidth;
    const h = window.innerHeight;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.scale(dpr, dpr);
    }

    const hRatio = w / img.width;
    const vRatio = h / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const cx = (w - img.width * ratio) / 2;
    const cy = (h - img.height * ratio) / 2;

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);
  };

  // Set up ScrollTrigger to pin canvas and animate frames
  useEffect(() => {
    if (!imagesLoaded || images.length === 0) return;

    // Draw first frame
    drawImage(0, images);

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: ".scrolly-pin",
      scrub: true,
      onUpdate: (self) => {
        const frameIndex = Math.min(images.length - 1, Math.floor(self.progress * images.length));
        if (frameIndex !== currentFrameRef.current) {
          currentFrameRef.current = frameIndex;
          drawImage(frameIndex, images);
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, [imagesLoaded, images]);

  // Handle resize
  useEffect(() => {
    if (!imagesLoaded) return;
    const handleResize = () => {
      // Reset canvas dimensions on resize
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = 0;
        canvas.height = 0;
      }
      drawImage(currentFrameRef.current, images);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [imagesLoaded, images]);

  return (
    <div ref={containerRef} className="scrolly-container">
      <div className="scrolly-pin">
        <canvas ref={canvasRef} className="scrolly-canvas" />
      </div>
    </div>
  );
};

export default Scene;
'''

target = '/Users/shantanu/Downloads/rajesh-portfolio-main/src/components/Character/Scene.tsx'
with open(target, 'w') as f:
    f.write(content)
print(f"Wrote {len(content)} bytes to {target}")
