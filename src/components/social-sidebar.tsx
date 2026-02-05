import { Github, Linkedin, Codesandbox, Instagram} from 'lucide-react'

export function SocialSidebar() {
  const socialLinks = [
    { icon: Github, href: 'https://github.com/Shantanu-9901' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/shantanupatil/' },
    { icon: Codesandbox, href: '#' },
    { icon: Instagram, href: 'https://www.instagram.com/_shantanu_9901/' },

  ]

  return (
    <>
      {/* Desktop sidebar */}
      <div className="fixed left-10 bottom-0 hidden lg:block">
        <div className="flex flex-col items-center space-y-6">
          {socialLinks.map((social, index) => {
            const Icon = social.icon
            return (
              <a
                key={index}
                href={social.href}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors hover:-translate-y-1 transform"
              >
                <Icon size={24} />
              </a>
            )
          })}
          <div className="w-px h-24 bg-gray-400 dark:bg-gray-600 mt-6"></div>
        </div>
      </div>
    </>
  )
}

