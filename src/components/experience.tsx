'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

interface Experience {
  company: string
  shortName: string
  position: string
  duration: string
  description: string[]
  offerLetter?: string
}

const experiences: Experience[] = [
  {
    company: 'Muks Robotics AI Pvt. Ltd.',
    shortName: 'Muks Robotics',
    position: 'GenAI & Physical Agentic AI',
    duration: 'Jun 2025 - Present',
    description: [
      'Led Spaceo: interruptible voice AI enabling real-time human–machine conversations for ISRO.',
      'Built Guardio: quadruped defense robot for DRDO/Indian Army with autonomous tracking & perimeter surveillance.',
      'Engineered a 6-axis diamond-polishing robot (Armenia) using CV + adaptive motion planning; improved precision and cycle consistency.',
      'Integrated GenAI/Agentic pipelines with robotics hardware; contributed across perception, planning, and control.'
    ]
  },
  {
    company: 'Excellarate Infotech',
    shortName: 'Excellarate',
    position: 'Data Science Intern',
    duration: 'Jan 2023 - May 2023',
    description: [
      'Developed and deployed full stack features (Python, Java, SQL, HTML/CSS) for internal applications on AWS.',
      'Improved backend workflows and frontend components, enhancing performance and usability for engineering teams.',
      'Applied mathematical concepts (linear algebra, calculus, statistics) to support data-driven development.',
      'Collaborated under the mentorship of the Associate Director of Engineering, contributing to real-world software engineering tasks.'
    ]
  },
  {
    company: 'Genpact India Pvt. Ltd.',
    shortName: 'Genpact',
    position: 'Genworth Long Term Care Insurance',
    duration: 'Jul 2022 - Dec 2022',
    description: [
      'Implemented and tested NLP algorithms (FuzzyWuzzy, Levenshtein Distance, BLEU) to compare PPO network datasets against external providers across the US region.',
      'Built a recommendation engine to personalize user experience and improve provider matching in Genworth’s Green Model Marketplace.',
      'Enhanced data quality validation workflows, increasing accuracy of network integration.'
    ]
  },
  {
    company: 'Altorum Leren Pvt. Ltd.',
    shortName: 'Altorum Leren',
    position: 'Afinity Platform',
    duration: 'Mar 2021 - May 2021',
    description: [
      'Built and maintained Dockerized full stack applications, ensuring seamless cross-environment performance.',
      'Implemented CI/CD pipelines (Travis CI, CircleCI), reducing deployment errors by 20%.',
      'Conducted infrastructure audits and introduced automation tools, identifying cost optimization opportunities and improving efficiency.'
    ]
  },
]

export function Experience() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <section id="experience" className="py-16 sm:py-20 md:py-24 max-w-6xl mx-auto px-4 sm:px-8 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.15 }}
      >
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <span className="font-mono text-gray-600 dark:text-gray-400">03.</span>
            Experience
          </h2>
          <div className="h-px bg-gray-400 dark:bg-gray-600 flex-grow"></div>
        </div>

        <div className="grid md:grid-cols-[200px_1fr] gap-4 sm:gap-8 mt-8">
          {/* Company Tabs */}
          <div className="flex md:flex-col overflow-x-auto md:overflow-x-visible scrollbar-hide">
            {experiences.map((experience, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-4 py-3 text-sm font-mono text-left border-b-2 md:border-b-0 md:border-l-2 whitespace-nowrap
                  ${activeTab === index 
                    ? 'text-gray-900 dark:text-white border-gray-900 dark:border-white' 
                    : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
              >
                {experience.shortName}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="min-h-[350px]">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {experiences[activeTab].position}{' '}
                <span className="text-gray-600 dark:text-gray-400">@</span>{' '}
                <span className="text-emerald-500">{experiences[activeTab].company}</span>
              </h3>
              <p className="font-mono text-sm text-gray-600 dark:text-gray-400 mt-1">
                {experiences[activeTab].duration}
              </p>
              <ul className="mt-4 space-y-4">
                {experiences[activeTab].description.map((point, index) => (
                  <li key={index} className="flex gap-2 text-gray-600 dark:text-gray-300">
                    <span className="text-emerald-500 mt-1.5">▹</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
              {experiences[activeTab].offerLetter && (
                <a
                  href={experiences[activeTab].offerLetter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-6 text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
                >
                  View COMPLETION LETTER
                  <ExternalLink size={16} />
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

