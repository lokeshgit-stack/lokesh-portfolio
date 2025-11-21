/**
 * Application-wide constants for the 3D portfolio
 */

// Color palette
export const COLORS = {
  primary: {
    DEFAULT: '#0A192F',
    light: '#112240',
    dark: '#020c1b',
  },
  accent: {
    DEFAULT: '#64FFDA',
    hover: '#4DFFCC',
    light: '#80FFE5',
    dark: '#48CCB4',
  },
  text: {
    primary: '#CCD6F6',
    secondary: '#8892B0',
    muted: '#495670',
  },
  status: {
    success: '#10B981',
    error: '#EF4444',
    warning: '#F59E0B',
    info: '#3B82F6',
  },
} as const;

// Breakpoints (matches Tailwind defaults)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

// Animation durations (in seconds)
export const DURATIONS = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 1,
} as const;

// Z-index layers
export const Z_INDEX = {
  background: -10,
  base: 0,
  content: 10,
  navbar: 50,
  scrollProgress: 60,
  modal: 100,
  tooltip: 200,
} as const;

// Navigation links
export const NAV_LINKS = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Education', href: '#education' },
  { name: 'Contact', href: '#contact' },
] as const;

// Personal information
export const PERSONAL_INFO = {
  name: 'Lokesh Trivedi',
  title: 'Frontend Developer',
  subtitle: 'React.js Enthusiast | CSE Student',
  email: 'lokeshtrivedi2004@gmail.com',
  phone: '+91 9950099543',
  location: 'Sojat City, Pali, Rajasthan - 306104',
  linkedin: 'https://linkedin.com/in/lokesh-trivedi',
  github: 'https://github.com/lokeshtrivedi',
  resume: '/resume.pdf',
} as const;

// Skills data
export const SKILLS = {
  frontend: [
    'HTML5',
    'CSS3',
    'JavaScript (ES6+)',
    'React.js',
    'React Router',
    'TypeScript',
    'Tailwind CSS',
    'Bootstrap',
    'Responsive Design',
  ],
  backend: [
    'Node.js',
    'Express.js',
    'RESTful APIs',
    'JWT Authentication',
    'API Security',
  ],
  database: ['MongoDB', 'Mongoose ODM', 'Data Modeling'],
  cloud: ['AWS S3', 'Netlify', 'Vercel', 'Render'],
  tools: ['Git', 'GitHub', 'VS Code', 'Postman', 'npm'],
} as const;

// 3D Animation settings
export const ANIMATION_SETTINGS = {
  particleCount: 3000,
  particleSize: 0.015,
  particleSpeed: 1,
  cameraFov: 50,
  cameraPosition: [0, 0, 5] as [number, number, number],
} as const;

// Performance thresholds
export const PERFORMANCE = {
  minCores: 4,
  minMemory: 4,
  lowEndDeviceParticleCount: 1000,
  highEndDeviceParticleCount: 5000,
} as const;

// API endpoints
export const API_ENDPOINTS = {
  contact: '/api/email/contact',
  health: '/health',
} as const;

// Social media links
export const SOCIAL_LINKS = {
  linkedin: PERSONAL_INFO.linkedin,
  github: PERSONAL_INFO.github,
  email: `mailto:${PERSONAL_INFO.email}`,
  phone: `tel:${PERSONAL_INFO.phone}`,
} as const;

// Form validation rules
export const VALIDATION = {
  name: {
    minLength: 2,
    maxLength: 100,
  },
  email: {
    pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  },
  message: {
    minLength: 10,
    maxLength: 5000,
  },
} as const;

// Scroll settings
export const SCROLL = {
  lenisSettings: {
    duration: 1.2,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical' as const,
    gestureOrientation: 'vertical' as const,
    smoothWheel: true,
    wheelMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  },
} as const;

// Education data
export const EDUCATION = [
  {
    id: 1,
    degree: 'B.Tech in Computer Science Engineering',
    institution: 'Mahaveer Institute of Technology & Science',
    duration: 'August 2022 - May 2026',
    description:
      'Pursuing a comprehensive education in computer science with focus on web development, data structures, algorithms, and software engineering principles.',
  },
  {
    id: 2,
    degree: 'Class XII (Senior Secondary)',
    institution: 'Swami Vivekananda Govt. Model Sr. Sec. School',
    duration: 'January 2021 - May 2022',
    description:
      'Completed higher secondary education with focus on science stream, building foundational knowledge in mathematics and computer science.',
  },
  {
    id: 3,
    degree: 'Class X (Secondary)',
    institution: 'Swami Vivekananda Govt. Model Sr. Sec. School',
    duration: 'January 2019 - May 2020',
    description:
      'Completed secondary education with strong academic performance and developed early interest in technology and programming.',
  },
] as const;

// Export all constants
export default {
  COLORS,
  BREAKPOINTS,
  DURATIONS,
  Z_INDEX,
  NAV_LINKS,
  PERSONAL_INFO,
  SKILLS,
  ANIMATION_SETTINGS,
  PERFORMANCE,
  API_ENDPOINTS,
  SOCIAL_LINKS,
  VALIDATION,
  SCROLL,
  EDUCATION,
};
