// Define proper TypeScript interfaces
interface FooterLink {
  name: string;
  href: string;
  external?: boolean; // Make optional
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterLinks {
  sections: FooterSection[];
}

const footerLinks: FooterLinks = {
  sections: [
    {
      title: 'Quick Links',
      links: [
        { name: 'Home', href: '#home', external: false },
        { name: 'About', href: '#about', external: false },
        { name: 'Projects', href: '#projects', external: false },
        { name: 'Contact', href: '#contact', external: false },
      ],
    },
    {
      title: 'Projects',
      links: [
        { name: 'File Sharing Platform', href: '#projects', external: false },
        { name: 'Chat Application', href: '#projects', external: false },
        { name: 'Authentication System', href: '#projects', external: false },
        { name: 'TryHackMe Labs', href: '#projects', external: false },
      ],
    },
    {
      title: 'Connect',
      links: [
        { name: 'LinkedIn', href: 'https://linkedin.com/in/lokesh-trivedi', external: true },
        { name: 'GitHub', href: 'https://github.com/lokeshtrivedi', external: true },
        { name: 'Email', href: 'mailto:lokeshtrivedi2004@gmail.com', external: true },
        { name: 'Resume', href: '/resume.pdf', external: true },
      ],
    },
  ],
};

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-primary-dark border-t border-accent/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <span className="text-3xl font-bold text-accent">
                {'<'}<span className="text-text-primary">LT</span>{' />'}
              </span>
            </div>
            <p className="text-text-secondary mb-6 leading-relaxed">
              Frontend Developer specializing in React.js and modern web technologies.
              Building secure, responsive, and interactive applications.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="https://linkedin.com/in/lokesh-trivedi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg 
                         bg-primary-light text-text-secondary hover:text-accent 
                         hover:bg-accent/10 transition-all duration-300 transform 
                         hover:scale-110"
                aria-label="LinkedIn"
              >
                <span className="text-xl">💼</span>
              </a>
              <a
                href="https://github.com/lokeshtrivedi"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg 
                         bg-primary-light text-text-secondary hover:text-accent 
                         hover:bg-accent/10 transition-all duration-300 transform 
                         hover:scale-110"
                aria-label="GitHub"
              >
                <span className="text-xl">🐙</span>
              </a>
              <a
                href="mailto:lokeshtrivedi2004@gmail.com"
                className="w-10 h-10 flex items-center justify-center rounded-lg 
                         bg-primary-light text-text-secondary hover:text-accent 
                         hover:bg-accent/10 transition-all duration-300 transform 
                         hover:scale-110"
                aria-label="Email"
              >
                <span className="text-xl">📧</span>
              </a>
            </div>
          </div>

          {/* Footer Links Sections */}
          {footerLinks.sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-text-primary font-semibold text-lg mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link: FooterLink) => (
                  <li key={link.name}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-text-secondary hover:text-accent transition-colors 
                                 duration-300 inline-flex items-center group"
                      >
                        {link.name}
                        {link.href.startsWith('http') && (
                          <span className="ml-1 transform group-hover:translate-x-1 
                                       transition-transform duration-300">
                            →
                          </span>
                        )}
                      </a>
                    ) : (
                      <button
                        onClick={() => scrollToSection(link.href)}
                        className="text-text-secondary hover:text-accent transition-colors 
                                 duration-300 text-left"
                      >
                        {link.name}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-accent/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <p className="text-text-secondary text-sm">
              © {currentYear} Lokesh Trivedi. All rights reserved.
            </p>

            {/* Tech Stack Badge */}
            <p className="text-text-secondary text-sm">
              Built with{' '}
              <span className="text-accent font-semibold">React</span>,{' '}
              <span className="text-accent font-semibold">Three.js</span> &{' '}
              <span className="text-accent font-semibold">GSAP</span>
            </p>

            {/* Location */}
            <p className="text-text-secondary text-sm flex items-center">
              <span className="mr-2">📍</span>
              Sojat City, Rajasthan, India
            </p>
          </div>
        </div>

        {/* Back to Top Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light 
                     text-accent rounded-lg hover:bg-accent/10 transition-all 
                     duration-300 transform hover:-translate-y-1"
          >
            <span>↑</span>
            <span>Back to Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
