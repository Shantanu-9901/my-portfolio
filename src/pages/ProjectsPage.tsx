import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import awsLogo from '../assets/cloud/amazon.svg';
import dockerLogo from '../assets/cloud/docker.svg';
import linuxLogo from '../assets/Linux.svg';
import terraformLogo from '../assets/cloud/terraform.png';

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
    title: 'AWS 3-Tier Web Architecture',
    description: 'A robust deployment of a 3-tier web application on AWS, featuring VPC isolation, RDS Aurora database, and Nginx/Tomcat servers. Implemented network security with public/private subnets and NAT gateway for a scalable and secure infrastructure.',
    context: 'Cloud Infrastructure Project',
    technologies: ['AWS', 'VPC', 'EC2', 'RDS', 'Nginx', 'Tomcat'],
    github: 'https://github.com/Shantanu-9901/AWS-3-Tier-Application-Deployment',
    image: awsLogo
  },
  {
    title: 'Docker Containerization Hub',
    description: 'Comprehensive collection of Docker configurations and containerization strategies for various applications. Focuses on creating efficient, scalable, and portable environments using Docker Compose and microservices architecture.',
    context: 'DevOps & Containerization',
    technologies: ['Docker', 'Docker Compose', 'Microservices', 'YAML'],
    github: 'https://github.com/Shantanu-9901/Docker',
    image: dockerLogo
  },
  {
    title: 'Linux Infrastructure & Essentials',
    description: 'A foundational resource and collection of scripts for mastering Linux system administration. Covers file system hierarchy, user management, networking, process monitoring, and automation for DevOps engineering.',
    context: 'System Administration Project',
    technologies: ['Linux', 'Bash', 'Networking', 'Security'],
    github: 'https://github.com/Shantanu-9901/Linux-Essentials',
    image: linuxLogo
  },
  {
    title: 'AWS Cloud Services Explorer',
    description: 'In-depth exploration and implementation of various Amazon Web Services. Includes hands-on projects with S3, Lambda, IAM, and CloudWatch to build cloud-native solutions and automate infrastructure.',
    context: 'Cloud Engineering Study',
    technologies: ['AWS', 'S3', 'Lambda', 'IAM'],
    github: 'https://github.com/Shantanu-9901/AWS',
    image: terraformLogo
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

