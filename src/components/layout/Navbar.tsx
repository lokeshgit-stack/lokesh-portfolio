import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface NavLink {
  name: string;
  href: string;
}

const navLinks: NavLink[] = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Education', href: '#education' },
  { name: 'Contact', href: '#contact' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hide navbar on scroll down, show on scroll up
    let lastScroll = 0;

    ScrollTrigger.create({
      start: 'top -80',
      end: 99999,
      onUpdate: (self) => {
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 80) {
          gsap.to(navRef.current, { y: 0, duration: 0.3 });
        } else if (currentScroll > lastScroll && self.direction === 1) {
          // Scrolling down - hide navbar
          gsap.to(navRef.current, { y: -100, duration: 0.3 });
        } else if (currentScroll < lastScroll && self.direction === -1) {
          // Scrolling up - show navbar
          gsap.to(navRef.current, { y: 0, duration: 0.3 });
        }

        lastScroll = currentScroll;
      },
    });

    // Logo pulse animation
    gsap.to(logoRef.current, {
      scale: 1.05,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Track active section
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const scrollToSection = (href: string) => {
    setIsOpen(false);
    const element = document.querySelector(href);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-primary/90 backdrop-blur-md 
               border-b border-accent/20 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            ref={logoRef}
            className="flex-shrink-0 cursor-pointer"
            onClick={() => scrollToSection('#home')}
          >
            <span className="text-2xl font-bold text-accent">
              {'<'}<span className="text-text-primary">LT</span>{' />'}
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all 
                           duration-300 relative group ${
                             activeSection === link.href.substring(1)
                               ? 'text-accent'
                               : 'text-text-secondary hover:text-accent'
                           }`}
                >
                  {link.name}
                  {/* Underline animation */}
                  <span
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-accent 
                             transform origin-left transition-transform duration-300
                             ${
                               activeSection === link.href.substring(1)
                                 ? 'scale-x-100'
                                 : 'scale-x-0 group-hover:scale-x-100'
                             }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Resume Button */}
          <div className="hidden md:block">
            <a
              href="/resume.pdf"
              download
              className="px-4 py-2 border-2 border-accent text-accent rounded-md 
                       hover:bg-accent hover:text-primary transition-all duration-300
                       font-semibold"
            >
              Resume
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md 
                       text-text-secondary hover:text-accent hover:bg-primary-light
                       focus:outline-none transition-colors"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger Icon */}
              <div className="w-6 h-5 flex flex-col justify-between">
                <span
                  className={`block h-0.5 w-full bg-current transform transition-all 
                           duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}
                />
                <span
                  className={`block h-0.5 w-full bg-current transition-all duration-300 
                           ${isOpen ? 'opacity-0' : 'opacity-100'}`}
                />
                <span
                  className={`block h-0.5 w-full bg-current transform transition-all 
                           duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out
                  ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-primary-light">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => scrollToSection(link.href)}
              className={`block w-full text-left px-3 py-2 rounded-md text-base 
                       font-medium transition-colors ${
                         activeSection === link.href.substring(1)
                           ? 'text-accent bg-primary'
                           : 'text-text-secondary hover:text-accent hover:bg-primary'
                       }`}
            >
              {link.name}
            </button>
          ))}
          <a
            href="/resume.pdf"
            download
            className="block w-full text-center px-3 py-2 mt-4 border-2 border-accent 
                     text-accent rounded-md hover:bg-accent hover:text-primary 
                     transition-all font-semibold"
          >
            Download Resume
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
