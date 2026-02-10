'use client'
import { motion } from 'framer-motion'
import { Folder, Github, ExternalLink } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Project {
  title: string
  description: string
  context: string
  technologies: string[]
  github: string
  external?: string
}

const projects: Project[] = [
  {
    title: 'Drishti AI',
    description: 'An Agentic AI-based Cognitive Safety System for real-time crowd monitoring and proactive risk detection. Features crowd density analysis and multilingual alerts.',
    context: 'Agentic AI & Safety',
    technologies: ['Agentic AI', 'Cloud Native', 'Perception Agents', 'Multilingual Alerts'],
    github: 'https://github.com/shefali2007'
  },
  {
    title: 'Enterprising AI',
    description: 'A digital platform bridging career exposure and guidance gaps for students from Tier 2 and Tier 3 towns. Coordinating structured learning pathways.',
    context: 'Social Impact & Tech',
    technologies: ['Platform Design', 'Mentorship Logic', 'Community Building'],
    github: 'https://github.com/shefali2007'
  },
  {
    title: 'AI-Ready Data Explainer',
    description: 'Created an animated explainer on AI-ready data, highlighting how data should be structured, trained, and governed in the age of AI.',
    context: 'Data Engineering & AI Strategy',
    technologies: ['Data Governance', 'AI Training', 'Visual Storytelling'],
    github: 'https://github.com/shefali2007'
  },
  {
    title: 'Automated AI-Driven Workflows',
    description: 'Automated end-to-end tasks by creating bots and agent-based processes. Integrated multiple APIs for system coordination.',
    context: 'Automation & Orchestration',
    technologies: ['API Integration', 'Agent Orchestration', 'Workflow Automation'],
    github: 'https://github.com/shefali2007'
  }
]

export function Projects({projectsLink}: {projectsLink: string}) {
  return (
    <section id="projects" className="py-16 sm:py-20 md:py-24 max-w-6xl mx-auto px-4 sm:px-8 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.15 }}
      >
        <div className="flex items-center gap-4 mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
            <span className="font-mono text-gray-600 dark:text-gray-400">04.</span>
            Projects
          </h2>
          <div className="h-px bg-gray-400 dark:bg-gray-600 flex-grow"></div>
        </div>

        <div className="grid lg:grid-cols-[1fr,1.5fr] gap-8 lg:gap-12">
          {/* Left Side - Project Info */}
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
              I love building innovative solutions that push the boundaries of technology. Throughout my journey as a developer, I've created numerous projects that showcase my growth and expertise across diverse fields like AI, machine learning, computer vision, web development, and app development.
              </p>
              <p className="text-gray-600 dark:text-gray-300">
              From developing simple static websites to deploying AI-driven models and crafting full-fledged applications, each project has been a stepping stone in my learning process. I strive to write clean, efficient code while ensuring high performance, scalability, and a seamless user experience.              </p>
            </div>
            <Link 
              to={projectsLink}
              className="inline-block border-2 border-gray-900 dark:border-white px-6 py-3 rounded text-gray-900 dark:text-white hover:bg-gray-900 dark:hover:bg-white hover:text-white dark:hover:text-black transition-colors duration-300"
            >
              View More Projects
            </Link>
          </div>

          {/* Right Side - Project Cards */}
          <div className="space-y-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="group relative bg-gray-100 dark:bg-gray-900 p-6 rounded-lg hover:translate-y-[-4px] transition-transform duration-300"
              >
                <div className="flex justify-between items-start mb-6">
                  <Folder className="w-10 h-10 text-emerald-500" />
                  <div className="flex gap-4">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      <Github className="w-5 h-5" />
                    </a>
                    {project.external && (
                      <a
                        href={project.external}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-emerald-500 dark:group-hover:text-emerald-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {project.context}
                </p>

                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs font-mono text-emerald-600 dark:text-emerald-400"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}

