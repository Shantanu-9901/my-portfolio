import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import robotIcon from '../assets/frameworks/react.svg'; // Placeholder
import dataIcon from '../assets/cloud/amazon.svg';
import aiIcon from '../assets/Linux.svg';
import workflowIcon from '../assets/cloud/docker.svg';

interface Project {
  title: string;
  description: string;
  context: string;
  technologies: string[];
  github: string;
  external?: string;
  image: string;
}

const projects: Project[] = [
  {
    title: 'Drishti AI',
    description: 'An Agentic AI-based Cognitive Safety System for real-time crowd monitoring and proactive risk detection. Worked on solution conceptualization involving crowd density analysis, contextual risk assessment, multilingual alerts and event-driven agent orchestration.',
    context: 'Agentic AI & Cognitive Safety',
    technologies: ['Agentic AI', 'Perception Agents', 'Crowd Analysis', 'Real-time Alerts'],
    github: 'https://github.com/shefali2007',
    image: robotIcon
  },
  {
    title: 'Enterprising AI',
    description: 'Took ownership of building a digital platform to bridge career exposure and guidance gaps for students from Tier 2 and Tier 3 towns. Coordinating with mentors and industry professionals to define structured learning pathways aligned with real-world skills.',
    context: 'Digital Platform & Social Impact',
    technologies: ['Full Stack Java', 'Platform Architecture', 'Mentorship Logic'],
    github: 'https://github.com/shefali2007',
    image: workflowIcon
  },
  {
    title: 'AI-ready Data Explainer',
    description: 'Created an animated explainer on AI-ready data, highlighting how data should be structured, trained and governed in the age of AI. Shared original perspectives on data quality, data management discipline and responsible data practices for effective AI systems.',
    context: 'Data Engineering & Strategy',
    technologies: ['Data Governance', 'AI Training Data', 'Visual Strategy'],
    github: 'https://github.com/shefali2007',
    image: dataIcon
  },
  {
    title: 'Automated AI-driven Workflows',
    description: 'Automated AI-driven workflows by creating bots and agent-based processes to execute tasks end to end. Integrated and worked with multiple APIs to enable data flow, task execution and system coordination.',
    context: 'Automation & Orchestration',
    technologies: ['Python', 'API Integration', 'Agent Orchestration', 'LLMs'],
    github: 'https://github.com/shefali2007',
    image: aiIcon
  }
];

const ProjectsPage: React.FC = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
      }, []);
  return (
    <main className="container mx-auto py-16 sm:py-20 md:py-24 px-4 sm:px-8 md:px-12">
      <Link to="/" className="inline-block mb-8 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
        ← Back to Home
      </Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-center">
          My Projects
        </h1>
        <div className="space-y-16">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: index * 0.1 }}
              className="bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg"
            >
              <div className="md:flex">
                <div className="md:flex-shrink-0">
                  <img className="h-48 w-full object-cover md:h-64 md:w-96" src={project.image} alt={project.title} />
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{project.title}</h2>
                    <div className="flex gap-4">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                      >
                        <Github className="w-6 h-6" />
                      </a>
                      {project.external && (
                        <a
                          href={project.external}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-6 h-6" />
                        </a>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{project.context}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded text-xs font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
};

export default ProjectsPage;

