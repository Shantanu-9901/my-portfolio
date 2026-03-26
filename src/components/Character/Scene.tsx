import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLoading } from "../../context/LoadingProvider";
import { setAllTimeline } from "../utils/GsapScroll";
import { initialFX } from "../utils/initialFX";
import "../styles/Landing.css";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 120;
const MAX_DPR = 2;

const getStableHeight = () =>
  window.visualViewport?.height ?? window.innerHeight;

const Scene = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentFrameRef = useRef(0);
  const lastCanvasSize = useRef<{ w: number; h: number }>({ w: 0, h: 0 });
  const { setLoading, setIsLoading } = useLoading();

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const loadImage = (i: number): Promise<HTMLImageElement | null> =>
      new Promise((resolve) => {
        const img = new Image();
        img.src = `/sequence/frame_${String(i).padStart(3, "0")}.webp`;
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
      });

    const loadImages = async () => {
      const allImages: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null);
      let loaded = 0;

      // Load in batches of 10 for faster perceived progress
      const BATCH_SIZE = 10;
      for (let batch = 0; batch < FRAME_COUNT; batch += BATCH_SIZE) {
        const batchEnd = Math.min(batch + BATCH_SIZE, FRAME_COUNT);
        const promises = [];
        for (let i = batch; i < batchEnd; i++) {
          promises.push(
            loadImage(i).then((img) => {
              allImages[i] = img;
              loaded++;
              setLoading(Math.round((loaded / FRAME_COUNT) * 100));
            })
          );
        }
        await Promise.all(promises);
      }

      const valid = allImages.filter((r): r is HTMLImageElement => r !== null);
      setImages(valid);
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

  const drawImage = (index: number, imgs?: HTMLImageElement[]) => {
    const canvas = canvasRef.current;
    const imageList = imgs || images;
    if (!canvas || !imageList[index]) return;
    const ctx = canvas.getContext("2d");
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
      ctx.scale(dpr, dpr);
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

  // Set up ScrollTrigger to pin canvas and animate frames
  useEffect(() => {
    if (!imagesLoaded || images.length === 0) return;

    // Draw first frame
    drawImage(0, images);

    const isTouch = ScrollTrigger.isTouch;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: ".scrolly-pin",
      pinType: isTouch ? "fixed" : "transform",
      scrub: isTouch ? 0.5 : true,
      ignoreMobileResize: true,
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

  // Handle resize (debounced to avoid mobile URL-bar jank)
  useEffect(() => {
    if (!imagesLoaded) return;
    let resizeTimer: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        lastCanvasSize.current = { w: 0, h: 0 };
        drawImage(currentFrameRef.current, images);
      }, 150);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
    };
  }, [imagesLoaded, images]);

  // Animate overlay text panels on scroll
  useEffect(() => {
    if (!imagesLoaded || images.length === 0) return;

    const overlayTimelines: gsap.core.Timeline[] = [];

    // Panel 1: "Hello I'm Shantanu Patil" — visible from 0% to 30%
    const tl1 = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "30% top",
        scrub: true,
        ignoreMobileResize: true,
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
        ignoreMobileResize: true,
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
        ignoreMobileResize: true,
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
  }, [imagesLoaded, images]);

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
