import { useRef, useState, useEffect } from 'react';
import { useScrollAnimation, useBatchScrollAnimation } from '@/hooks/useScrollAnimation';
import { TextReveal, TypingText } from '@/components/animations/TextReveal';
import { ProjectCard } from '@/components/ui/ProjectCard';
import { Button } from '@/components/ui/Button';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Project data with proper TypeScript interface
interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  features: string[];
  github?: string;
  THM?: string;
  demo?: string;
  icon: string;
  color: string;
  image?: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Secure File Sharing Platform',
    description:
      'Developed a secure platform for uploading, protecting, and sharing files. Integrated password protection, file expiration logic, and QR-based access with real-time tracking.',
    technologies: ['React.js', 'Node.js', 'MongoDB', 'AWS S3', 'JWT'],
    features: [
      'Encrypted file storage using AWS S3',
      'Password protection and file expiration',
      'QR code-based access system',
      'Email-based sharing with download tracking',
      'Real-time file metadata management',
    ],
    github: 'https://github.com/lokeshgit-stack/File-sharing.git',
    demo: 'https://file-sharing-service.vercel.app/',
    icon: '📁',
    color: 'from-blue-500 to-purple-500',
  },
  {
    id: 2,
    title: 'Real-Time Chat Application',
    description:
      'Built a real-time chat system with JWT-based authentication. Secured chat history using MongoDB with emphasis on secure data transmission and WebSocket connections.',
    technologies: ['React.js', 'Node.js', 'MongoDB', 'JWT', 'WebSocket'],
    features: [
      'Real-time messaging with WebSocket',
      'JWT-based authentication',
      'Secure message encryption',
      'User session control',
      'Message history persistence',
    ],
    github: 'https://github.com/lokeshgit-stack/File-sharing.git',
    demo: '#',
    icon: '💬',
    color: 'from-green-500 to-teal-500',
  },
  {
    id: 3,
    title: 'Authentication System',
    description:
      'Developed a comprehensive login/signup system with client-side validation and server-side authentication using secure password hashing and session management.',
    technologies: ['PHP', 'MySQL', 'JavaScript', 'HTML/CSS', 'Bcrypt'],
    features: [
      'Client-side form validation',
      'Server-side authentication',
      'Bcrypt password hashing',
      'Session management',
      'SQL injection prevention',
    ],
    github: 'https://github.com/lokeshgit-stack/File-sharing.git',
    demo: '#',
    icon: '🔐',
    color: 'from-orange-500 to-red-500',
  },
  {
    id: 4,
    title: 'Cybersecurity Labs & Ethical Hacking',
    description:
      'Completed 25+ cybersecurity labs covering network enumeration, OSINT, and basic web exploitation with hands-on attack vector analysis using industry-standard tools.',
    technologies: ['Python', 'Kali Linux', 'Metasploit', 'Burp Suite', 'Nmap'],
    features: [
      'Network enumeration and scanning',
      'OSINT investigations',
      'Web exploitation techniques',
      'Brute force attack analysis',
      'Directory traversal and vulnerability assessment',
    ],
    THM: 'https://tryhackme.com/p/lokeshtrivedi200',
    demo: 'https://tryhackme.com/p/lokeshtrivedi200',
    icon: '🛡️',
    color: 'from-purple-500 to-pink-500',
  },
];

export const Projects = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<string>('all');
  const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);

  // Animate section entrance
  useScrollAnimation({
    trigger: sectionRef,
    animation: 'fade',
    start: 'top center+=100',
  });

  // Batch animate project cards with stagger
  useBatchScrollAnimation('.project-card-wrapper', 'scale', {
    stagger: 0.15,
    duration: 0.8,
    start: 'top bottom-=100',
  });

  // Filter projects by technology
  useEffect(() => {
    if (filter === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(
        projects.filter((project) =>
          project.technologies.some((tech) =>
            tech.toLowerCase().includes(filter.toLowerCase())
          )
        )
      );
    }
  }, [filter]);

  const filterOptions = [
    { label: 'All Projects', value: 'all' },
    { label: 'React.js', value: 'react' },
    { label: 'Node.js', value: 'node' },
    { label: 'MongoDB', value: 'mongo' },
    { label: 'Security', value: 'security' },
  ];

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="min-h-screen py-20 px-4 bg-primary relative overflow-hidden"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div ref={headerRef} className="text-center mb-16">
          <TextReveal
            splitBy="word"
            trigger="scroll"
            className="text-5xl md:text-6xl font-bold text-text-primary mb-6"
          >
            Featured <span className="text-accent">Projects</span>
          </TextReveal>

          <div className="max-w-2xl mx-auto mb-8">
            <TypingText
              text="Building secure, scalable applications with modern technologies"
              speed={0.03}
              className="text-lg md:text-xl text-text-secondary"
            />
          </div>

          {/* Filter Buttons */}
          {/* <div className="flex flex-wrap gap-3 justify-center items-center mt-8">
            {filterOptions.map((option) => (
              <Button
                key={option.value}
                variant={filter === option.value ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setFilter(option.value)}
                className="min-w-[120px]"
              >
                {option.label}
              </Button>
            ))}
          </div> */}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <div key={project.id} className="project-card-wrapper">
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-text-secondary mb-4">
              No projects found for this filter
            </p>
            <Button variant="outline" onClick={() => setFilter('all')}>
              Show All Projects
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="inline-block bg-primary-light p-8 rounded-2xl border-2 border-accent/20">
            <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
              Interested in working together?
            </h3>
            <p className="text-text-secondary mb-6 max-w-xl">
              I'm always open to discussing new projects, creative ideas, or opportunities
              to be part of your visions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                icon="💼"
                onClick={() =>
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }
              >
                Get In Touch
              </Button>
              <Button
                variant="outline"
                size="lg"
                icon="🐙"
                onClick={() => window.open('https://github.com/lokeshgit-stack', '_blank')}
              >
                View GitHub
              </Button>
            </div>
          </div>
        </div>

        {/* Project Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Projects Completed', value: '4+', icon: '🚀' },
            { label: 'Technologies Used', value: '15+', icon: '⚡' },
            { label: 'Lines of Code', value: '10K+', icon: '💻' },
            { label: 'TryHackMe Labs', value: '25+', icon: '🛡️' },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-primary-light p-6 rounded-xl border border-accent/20 
                       hover:border-accent/50 transition-all duration-300 text-center
                       transform hover:scale-105"
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-accent mb-1">{stat.value}</div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
