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
// On mobile, use every 3rd frame (40 frames) for less memory
const FRAME_STEP = IS_TOUCH ? 3 : 1;

const Scene = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentFrameRef = useRef(0);
  const { setLoading, setIsLoading } = useLoading();

  // Desktop: ImageBitmaps for canvas
  const [bitmaps, setBitmaps] = useState<ImageBitmap[]>([]);
  // Mobile: pre-loaded image URLs (frames are rendered as stacked <img> tags)
  const [frameURLs, setFrameURLs] = useState<string[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // ─── Image Loading ───
  useEffect(() => {
    const frameIndices: number[] = [];
    for (let i = 0; i < FRAME_COUNT; i += FRAME_STEP) {
      frameIndices.push(i);
    }

    const loadImages = async () => {
      let loaded = 0;
      const totalFrames = frameIndices.length;

      if (IS_TOUCH) {
        // MOBILE: Just collect URLs — the <img> tags will load them
        const urls: string[] = frameIndices.map(
          (i) => `/sequence/frame_${String(i).padStart(3, "0")}.webp`
        );
        setFrameURLs(urls);

        // Pre-decode all images so they're ready before scroll starts
        const decodePromises = urls.map((url) => {
          const img = new Image();
          img.src = url;
          return img
            .decode()
            .then(() => {
              loaded++;
              setLoading(Math.round((loaded / totalFrames) * 100));
            })
            .catch(() => {
              loaded++;
              setLoading(Math.round((loaded / totalFrames) * 100));
            });
        });
        await Promise.all(decodePromises);
      } else {
        // DESKTOP: Load as ImageBitmaps for canvas
        const allBitmaps: (ImageBitmap | null)[] = new Array(totalFrames).fill(null);
        const BATCH_SIZE = 10;
        for (let batch = 0; batch < totalFrames; batch += BATCH_SIZE) {
          const batchEnd = Math.min(batch + BATCH_SIZE, totalFrames);
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
                      setLoading(Math.round((loaded / totalFrames) * 100));
                      resolve();
                    });
                };
                img.onerror = () => {
                  loaded++;
                  setLoading(Math.round((loaded / totalFrames) * 100));
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

  // ─── Mobile: toggle visibility of pre-rendered <img> stack ───
  const showMobileFrame = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const prev = container.querySelector(".scrolly-frame.active") as HTMLElement;
    const next = container.querySelector(`[data-frame="${index}"]`) as HTMLElement;
    if (prev) prev.classList.remove("active");
    if (next) next.classList.add("active");
  };

  // ─── ScrollTrigger: pin + frame scrub ───
  useEffect(() => {
    const frameCount = IS_TOUCH ? frameURLs.length : bitmaps.length;
    if (!imagesLoaded || frameCount === 0) return;

    // Show first frame
    if (IS_TOUCH) showMobileFrame(0);
    else drawCanvas(0);

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: ".scrolly-pin",
      pinType: IS_TOUCH ? "fixed" : "transform",
      scrub: IS_TOUCH ? 0.3 : true,
      onUpdate: (self) => {
        const frameIndex = Math.min(frameCount - 1, Math.floor(self.progress * frameCount));
        if (frameIndex !== currentFrameRef.current) {
          currentFrameRef.current = frameIndex;
          if (IS_TOUCH) showMobileFrame(frameIndex);
          else drawCanvas(frameIndex);
        }
      },
    });

    return () => trigger.kill();
  }, [imagesLoaded, bitmaps, frameURLs]);

  // ─── Resize handler (desktop only) ───
  useEffect(() => {
    if (IS_TOUCH || !imagesLoaded) return;
    const handleResize = () => drawCanvas(currentFrameRef.current);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [imagesLoaded, bitmaps]);

  // ─── Overlay text panels ───
  useEffect(() => {
    const frameCount = IS_TOUCH ? frameURLs.length : bitmaps.length;
    if (!imagesLoaded || frameCount === 0) return;

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
  }, [imagesLoaded, bitmaps, frameURLs]);

  return (
    <div ref={containerRef} className="scrolly-container" id="about">
      <div className="scrolly-pin">
        {IS_TOUCH ? (
          // Mobile: stack of pre-decoded <img> tags, toggle .active class
          <div className="scrolly-frame-stack">
            {frameURLs.map((url, i) => (
              <img
                key={i}
                data-frame={i}
                className={`scrolly-frame${i === 0 ? " active" : ""}`}
                src={url}
                alt=""
                draggable={false}
              />
            ))}
          </div>
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
