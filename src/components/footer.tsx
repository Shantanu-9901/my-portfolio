import { Github, Linkedin, Heart, Instagram} from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-12 px-4 sm:px-8 md:px-12 bg-gray-300 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Connect</h3>
            <div className="flex space-x-4">
              <a href="https://github.com/Shantanu-9901" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400">
                <Github size={24} />
              </a>
              <a href="https://www.linkedin.com/in/shantanupatil/" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400">
                <Linkedin size={24} />
              </a>
              <a href="https://www.instagram.com/_shantanu_9901/" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400">
                <Instagram size={24} />
              </a>

            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center">
            <span>Designed & Built with </span>
            <Heart size={16} color='red' />
            <span> by Shantanu Patil</span>
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            © {currentYear} Copyright. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

