'use client'

import { motion } from 'framer-motion'
import Image from '../assets/Shantanu_Pic.jpeg'

export function About() {
  const activities = [
    ['Coding'],
    ['Team Management'],
    ['Problem Solving'],
    ['Playing Guitar'],
    ['Painting'],
  ]

  return (
    <section id="about" className="py-16 sm:py-20 md:py-24 max-w-6xl mx-auto px-4 sm:px-8 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.15 }}
      >
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <span className="font-mono text-gray-600 dark:text-gray-400">01.</span>
            About Me
          </h2>
          <div className="h-px bg-gray-400 dark:bg-gray-600 flex-grow"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-12">
          <div className="md:col-span-2 space-y-4 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
            <p>
              Hello! I'm Shantanu Patil.
            </p>

            <p>
              I am an Agentic AI Engineer & Full Stack Developer with hands-on experience in Generative AI, Transformers, Robotics, and cloud-native applications. Currently at Muks Robotics, building cutting-edge systems such as conversational AI for ISRO, defense-grade robotics for DRDO & Indian Army, and industrial automation solutions.
            </p>

            <p>
              With a strong foundation in machine learning, computer vision, and autonomous systems, combined with proven skills in backend/frontend development, DevOps, and AWS cloud, I excel at bridging research with production. I am passionate about solving real-world challenges where AI, robotics, and software converge to deliver scalable, intelligent, and adaptive solutions across industries.
            </p>

            <p className="mb-4">Here are a few of the other activities that I love to do!</p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm sm:text-base">
              {activities.map((row, i) => (
                <div key={i} className="contents">
                  {row.map((activity, j) => activity && (
                    <li key={`${i}-${j}`} className="flex items-center gap-2">
                      <span className="inline-block w-1.5 h-1.5 bg-gray-900 dark:bg-white"></span>
                      {activity}
                    </li>
                  ))}
                </div>
              ))}
            </ul>
          </div>

          <div className="relative group mx-auto md:mx-0 w-full max-w-[280px] sm:max-w-[320px]">
            <div className="relative z-10">
              <img
                src={Image}
                alt="Profile picture"
                width={300}
                height={300}
                className="rounded transition-all duration-300 group-hover:grayscale-0 grayscale"
              />
              <div className="absolute inset-0 border-2 border-gray-900 dark:border-white rounded transition-transform group-hover:translate-x-2 group-hover:translate-y-2"></div>
            </div>
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 rounded translate-x-4 translate-y-4 -z-10"></div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

