'use client'

import { motion } from 'framer-motion'

export function About() {
  const activities = [
    ['Python Programming'],
    ['Agentic AI Workflows'],
    ['Generative AI'],
    ['Full Stack Java'],
    ['Community Outreach'],
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

        <div className="space-y-4 text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-3xl">
          <p>
            Hello! I'm Shefali Patil.
          </p>

          <p>
            I am an Aspiring Data Scientist with a strong foundation in Python, Linux, AWS, SQL, and early exposure to LLMs, Agentic AI, and Generative AI. I have a proven track record of initiative through technical leadership, industry contributions, and a pre-first-year research internship.
          </p>

          <p>
            Currently, I am pursuing Full Stack Java development with a focus on real-world impact and inclusive technology access. I am passionate about building AI-driven workflows and creating digital platforms that bridge career exposure gaps for students in Tier 2 and Tier 3 towns.
          </p>

          <p>
            Beyond technical pursuits, I have been actively involved in rural outreach programs for over two years, supporting senior citizens in my community to improve their sense of inclusion and well-being.
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
      </motion.div>
    </section>
  )
}

