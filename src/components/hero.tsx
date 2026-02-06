'use client';

import Spline from '@splinetool/react-spline';

import '../style/hero-style.css'; // Include the CSS for animation
import { useTheme } from '../contexts/theme-context';

export function Hero() {
  const { theme } = useTheme(); // Get the current theme
    
  return (
    <>
      <div className='hero-container h-screen'>
      {/* 3D Spline */}
      <div className="stack-containers flex flex-col justify-center items-center h-screen relative">
        {/* Horizontal Text Loop */}
        <div id="loop" className={theme === 'dark' ? 'dark-mode' : 'light-mode'}>
          <h1>
            <b> Agentic AI</b> Engineer <span>Web</span> Developer <span>Full Stack</span> Developer <span>Machine Learning</span> Engineer 
          </h1>
          <h1>
            <b> Agentic AI</b> Engineer <span>Web</span> Developer <span>Full Stack</span> Developer <span>Machine Learning</span> Engineer 
          </h1>
          <h1>
            <b> Agentic AI</b> Engineer <span>Web</span> Developer <span>Full Stack</span> Developer <span>Machine Learning</span> Engineer 
          </h1>
        </div>

        <div className="spline-container w-full max-w-screen-lg h-[90vh] md:h-[90vh] lg:h-[100vh] z-10">
          <Spline scene="https://prod.spline.design/UNQKHO4GWwaMcZkY/scene.splinecode"/>
        </div>

        <div className="absolute inset-x-0 top-[15%] md:top-[18%] flex flex-col justify-center items-center md:items-start md:pl-[8%] lg:pl-[10%] z-0 pointer-events-none px-4">
          {/* Hello Text */}
          <h3 className="text-lg sm:text-xl font-mono text-gray-600 dark:text-gray-400 mb-2 md:-translate-x-20 lg:-translate-x-24">
            Hello, my name is
          </h3>
          
          {/* Names Container */}
          <div className="flex flex-col md:flex-row justify-center items-center md:gap-20 lg:gap-24 leading-none">
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-gray-900 dark:text-white font-robotic md:-translate-x-20 lg:-translate-x-24">
              Shantanu
            </h1>
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-gray-900 dark:text-white font-robotic">
              Patil
            </h1>
          </div>
        </div>

        
      </div>
      </div>
    </>
  );
}
