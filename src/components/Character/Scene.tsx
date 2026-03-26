import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLoading } from "../../context/LoadingProvider";
import { setAllTimeline } from "../utils/GsapScroll";
import { initialFX } from "../utils/initialFX";
import "../styles/Landing.css";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const FRAME_COUNT = 120;
const IS_TOUCH = "ontouchstart" in window || navigator.maxTouchPoints > 0;
// On mobile, use every 2nd frame (60 frames) for less memory + faster swaps
const FRAME_STEP = IS_TOUCH ? 2 : 1;
const EFFECTIVE_FRAMES = Math.ceil(FRAME_COUNT / FRAME_STEP);

const Scene = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const currentFrameRef = useRef(0);
  const { setLoading, setIsLoading } = useLoading();

  // Desktop: ImageBitmaps for canvas | Mobile: object URLs for <img>
  const [bitmaps, setBitmaps] = useState<ImageBitmap[]>([]);
  const [objectURLs, setObjectURLs] = useState<string[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // ─── Image Loading ───
  useEffect(() => {
    const loadImages = async () => {
      const frameIndices: number[] = [];
      for (let i = 0; i < FRAME_COUNT; i += FRAME_STEP) {
        frameIndices.push(i);
      }

      let loaded = 0;

      if (IS_TOUCH) {
        // MOBILE: Load as blobs → object URLs (native <img> rendering)
        const urls: (string | null)[] = new Array(frameIndices.length).fill(null);
        const BATCH_SIZE = 10;
        for (let batch = 0; batch < frameIndices.length; batch += BATCH_SIZE) {
          const batchEnd = Math.min(batch + BATCH_SIZE, frameIndices.length);
          const promises = [];
          for (let idx = batch; idx < batchEnd; idx++) {
            const frameNum = frameIndices[idx];
            promises.push(
              fetch(`/sequence/frame_${String(frameNum).padStart(3, "0")}.webp`)
                .then((r) => r.blob())
                .then((blob) => {
                  urls[idx] = URL.createObjectURL(blob);
                  loaded++;
                  setLoading(Math.round((loaded / frameIndices.length) * 100));
                })
                .catch(() => {
                  loaded++;
                  setLoading(Math.round((loaded / frameIndices.length) * 100));
                })
            );
          }
          await Promise.all(promises);
        }
        setObjectURLs(urls.filter((u): u is string => u !== null));
      } else {
        // DESKTOP: Load as ImageBitmaps for canvas
        const allBitmaps: (ImageBitmap | null)[] = new Array(frameIndices.length).fill(null);
        const BATCH_SIZE = 10;
        for (let batch = 0; batch < frameIndices.length; batch += BATCH_SIZE) {
          const batchEnd = Math.min(batch + BATCH_SIZE, frameIndices.length);
          const promises = [];
          for (let idx = batch; idx < batchEnd; idx++) {
            const frameNum = frameIndices[idx];
            promises.push(
              new Promise<void>((resolve) => {
                const img = new Image();
                img.src = `/sequence/frame_${String(frameNum).padStart(3, "0")}.webp`;
                img.onload = () => {
                  createImageBitmap(img)
                    .then((bmp) => { allBitmaps[idx] = bmp; })
                    .catch(() => {})
                    .finally(() => {
                      loaded++;
                      setLoading(Math.round((loaded / frameIndices.length) * 100));
                      resolve();
                    });
                };
                img.onerror = () => {
                  loaded++;
                  setLoading(Math.round((loaded / frameIndices.length) * 100));
                  resolve();
                };
              })
            );
          }
          await Promise.all(promises);
        }
        setBitmaps(allBitmaps.filter((r): r is ImageBitmap => r !== null));
      }

      setImagesLoaded(true);
      setTimeout(() => {
        setIsLoading(false);
        setTimeout(() => {
          initialFX();
          setAllTimeline();
        }, 100);
      }, 1500);
    };

    loadImages();

    return () => {
      // Revoke object URLs on unmount
      objectURLs.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // ─── Desktop: Canvas drawing ───
  const drawCanvas = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas || !bitmaps[index]) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;
    const img = bitmaps[index];

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;

    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
    }

    const hRatio = (w * dpr) / img.width;
    const vRatio = (h * dpr) / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const cx = (w * dpr - img.width * ratio) / 2;
    const cy = (h * dpr - img.height * ratio) / 2;

    ctx.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);
  };

  // ─── Mobile: img src swap (runs on compositor thread, no main-thread paint) ───
  const showFrame = (index: number) => {
    const imgEl = imgRef.current;
    if (!imgEl || !objectURLs[index]) return;
    imgEl.src = objectURLs[index];
  };

  // ─── ScrollTrigger: pin + frame scrub ───
  useEffect(() => {
    const frames = IS_TOUCH ? objectURLs : bitmaps;
    if (!imagesLoaded || frames.length === 0) return;

    // Show first frame
    if (IS_TOUCH) showFrame(0);
    else drawCanvas(0);

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: ".scrolly-pin",
      pinType: IS_TOUCH ? "fixed" : "transform",
      scrub: IS_TOUCH ? 0.3 : true,
      onUpdate: (self) => {
        const frameIndex = Math.min(frames.length - 1, Math.floor(self.progress * frames.length));
        if (frameIndex !== currentFrameRef.current) {
          currentFrameRef.current = frameIndex;
          if (IS_TOUCH) showFrame(frameIndex);
          else drawCanvas(frameIndex);
        }
      },
    });

    return () => trigger.kill();
  }, [imagesLoaded, bitmaps, objectURLs]);

  // ─── Resize handler (desktop only) ───
  useEffect(() => {
    if (IS_TOUCH || !imagesLoaded) return;
    const handleResize = () => drawCanvas(currentFrameRef.current);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [imagesLoaded, bitmaps]);

  // ─── Overlay text panels ───
  useEffect(() => {
    const frames = IS_TOUCH ? objectURLs : bitmaps;
    if (!imagesLoaded || frames.length === 0) return;

    const overlayTimelines: gsap.core.Timeline[] = [];

    // Panel 1: "Hello I'm Shantanu Patil" — visible from 0% to 30%
    const tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "30% top",
        scrub: true,
      },
    });
    tl1
      .fromTo(".scrolly-overlay-1", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4 }, 0)
      .to(".scrolly-overlay-1", { opacity: 0, y: -30, duration: 0.3 }, 0.7);
    overlayTimelines.push(tl1);

    // Panel 2: "An Agentic AI Engineer Developer" — visible from 25% to 60%
    const tl2 = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "25% top",
        end: "60% top",
        scrub: true,
      },
    });
    tl2
      .fromTo(".scrolly-overlay-2", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4 }, 0)
      .to(".scrolly-overlay-2", { opacity: 0, y: -30, duration: 0.3 }, 0.7);
    overlayTimelines.push(tl2);

    // Panel 3: "About Me" — visible from 55% to 90%
    const tl3 = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "55% top",
        end: "90% top",
        scrub: true,
      },
    });
    tl3
      .fromTo(".scrolly-overlay-3", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4 }, 0)
      .to(".scrolly-overlay-3", { opacity: 0, y: -30, duration: 0.3 }, 0.7);
    overlayTimelines.push(tl3);

    return () => {
      overlayTimelines.forEach((tl) => {
        tl.scrollTrigger?.kill();
        tl.kill();
      });
    };
  }, [imagesLoaded, bitmaps, objectURLs]);

  return (
    <div ref={containerRef} className="scrolly-container" id="about">
      <div className="scrolly-pin">
        {IS_TOUCH ? (
          <img
            ref={imgRef}
            className="scrolly-canvas scrolly-img"
            alt=""
            draggable={false}
          />
        ) : (
          <canvas ref={canvasRef} className="scrolly-canvas" />
        )}

        {/* Overlay text panels */}
        <div className="scrolly-overlay scrolly-overlay-1">
          <h2 className="scrolly-overlay-greeting">Hello I'm</h2>
          <h1 className="scrolly-overlay-name">
            SHANTANU<br /><span>PATIL</span>
          </h1>
        </div>

        <div className="scrolly-overlay scrolly-overlay-2">
          <h3 className="scrolly-overlay-subtitle">An Agentic AI</h3>
          <h1 className="scrolly-overlay-role">
            Engineer<br /><span>Developer</span>
          </h1>
        </div>

        <div className="scrolly-overlay scrolly-overlay-3">
          <h3 className="scrolly-overlay-label">About Me</h3>
          <p className="scrolly-overlay-bio">
            I build multi-agent AI systems that turn text prompts into working
            software. Currently engineering agent orchestration at Sav.com's Vibe
            Platform. Previously built speech-to-intent systems and LLM-driven
            robotics for ISRO-aligned space missions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Scene;
