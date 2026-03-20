import { lazy, PropsWithChildren, Suspense, useEffect, useState } from "react";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import Work from "./Work";
import Blog from "./Blog";
import Footer from "./Footer";
import setSplitText from "./utils/splitText";

const TechStack = lazy(() => import("./TechStack"));

const MainContainer = ({ children }: PropsWithChildren) => {
  const [isDesktopView, setIsDesktopView] = useState<boolean>(
    window.innerWidth > 1024
  );

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
      setIsDesktopView(window.innerWidth > 1024);
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, [isDesktopView]);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <div className="container-main">
            {children}
            <Career />
            <Work />
            <Blog />
            {isDesktopView && (
              <Suspense fallback={<div>Loading....</div>}>
                <TechStack />
              </Suspense>
            )}
            <Contact />
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContainer;
