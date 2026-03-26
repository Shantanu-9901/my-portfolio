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
const MAX_DPR = IS_TOUCH ? 1.5 : 2;

const getStableHeight = () =>
  window.visualViewport?.height ?? window.innerHeight;

const Scene = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const currentFrameRef = useRef(0);
  const lastCanvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const rafIdRef = useRef(0);
  const { setLoading, setIsLoading } = useLoading();

  const [bitmaps, setBitmaps] = useState<ImageBitmap[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const loadImage = (i: number): Promise<ImageBitmap | null> =>
      new Promise((resolve) => {
        const img = new Image();
        img.src = `/sequence/frame_${String(i).padStart(3, "0")}.webp`;
        img.onload = () => createImageBitmap(img).then(resolve).catch(() => resolve(null));
        img.onerror = () => resolve(null);
      });

    const loadImages = async () => {
      const allBitmaps: (ImageBitmap | null)[] = new Array(FRAME_COUNT).fill(null);
      let loaded = 0;

      // Load in batches of 10 for faster perceived progress
      const BATCH_SIZE = 10;
      for (let batch = 0; batch < FRAME_COUNT; batch += BATCH_SIZE) {
        const batchEnd = Math.min(batch + BATCH_SIZE, FRAME_COUNT);
        const promises = [];
        for (let i = batch; i < batchEnd; i++) {
          promises.push(
            loadImage(i).then((bmp) => {
              allBitmaps[i] = bmp;
              loaded++;
              setLoading(Math.round((loaded / FRAME_COUNT) * 100));
            })
          );
        }
        await Promise.all(promises);
      }

      const valid = allBitmaps.filter((r): r is ImageBitmap => r !== null);
      setBitmaps(valid);
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
  }, []);

  const ensureCtx = () => {
    if (ctxRef.current) return ctxRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return null;
    ctxRef.current = canvas.getContext("2d", { alpha: false });
    return ctxRef.current;
  };

  const drawImage = (index: number, imgs?: ImageBitmap[]) => {
    const canvas = canvasRef.current;
    const imageList = imgs || bitmaps;
    if (!canvas || !imageList[index]) return;
    const ctx = ensureCtx();
    if (!ctx) return;
    const img = imageList[index];

    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    const w = window.innerWidth;
    const h = getStableHeight();

    // Only resize the canvas when dimensions actually changed
    if (lastCanvasSize.current.w !== w || lastCanvasSize.current.h !== h) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      // Reset context ref after resize (canvas resize clears state)
      ctxRef.current = canvas.getContext("2d", { alpha: false });
      ctxRef.current?.scale(dpr, dpr);
      lastCanvasSize.current = { w, h };
    }

    const hRatio = w / img.width;
    const vRatio = h / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const cx = (w - img.width * ratio) / 2;
    const cy = (h - img.height * ratio) / 2;

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, img.width, img.height, cx, cy, img.width * ratio, img.height * ratio);
  };

  // rAF-batched draw — only one draw per animation frame
  const scheduleDraw = (index: number, imgs?: ImageBitmap[]) => {
    cancelAnimationFrame(rafIdRef.current);
    rafIdRef.current = requestAnimationFrame(() => drawImage(index, imgs));
  };

  // Set up ScrollTrigger to pin canvas and animate frames
  useEffect(() => {
    if (!imagesLoaded || bitmaps.length === 0) return;

    // Draw first frame immediately (no rAF)
    drawImage(0, bitmaps);

    const isTouch = ScrollTrigger.isTouch;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: ".scrolly-pin",
      pinType: isTouch ? "fixed" : "transform",
      scrub: isTouch ? 0.5 : true,
      onUpdate: (self) => {
        const frameIndex = Math.min(bitmaps.length - 1, Math.floor(self.progress * bitmaps.length));
        if (frameIndex !== currentFrameRef.current) {
          currentFrameRef.current = frameIndex;
          scheduleDraw(frameIndex, bitmaps);
        }
      },
    });

    return () => {
      cancelAnimationFrame(rafIdRef.current);
      trigger.kill();
    };
  }, [imagesLoaded, bitmaps]);

  // Handle resize (debounced to avoid mobile URL-bar jank)
  useEffect(() => {
    if (!imagesLoaded) return;
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        lastCanvasSize.current = { w: 0, h: 0 };
        drawImage(currentFrameRef.current, bitmaps);
      }, 150);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [imagesLoaded, bitmaps]);

  // Animate overlay text panels on scroll
  useEffect(() => {
    if (!imagesLoaded || bitmaps.length === 0) return;

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
  }, [imagesLoaded, bitmaps]);

  return (
    <div ref={containerRef} className="scrolly-container" id="about">
      <div className="scrolly-pin">
        <canvas ref={canvasRef} className="scrolly-canvas" />

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
