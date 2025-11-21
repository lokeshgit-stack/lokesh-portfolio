import { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useScrollAnimation, useBatchScrollAnimation } from '@/hooks/useScrollAnimation';
import { TextReveal, WaveText } from '@/components/animations/TextReveal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SkillCubes } from '@/components/3d/SkillCubes';
import { canHandleHeavyAnimations } from '@/utils/performance';
import { SKILLS } from '@/utils/constants';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Skill category interface
interface Skill {
  name: string;
  level: number;
}

interface SkillCategory {
  title: string;
  skills: Skill[];
  icon: string;
  color: string;
}

const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend',
    skills: [
      { name: 'HTML5', level: 95 },
      { name: 'CSS3', level: 90 },
      { name: 'JavaScript (ES6+)', level: 92 },
      { name: 'React.js', level: 93 },
      { name: 'React Router', level: 90 },
      { name: 'TypeScript', level: 88 },
      { name: 'Tailwind CSS', level: 90 },
      { name: 'Responsive Design', level: 95 },
    ],
    icon: '🎨',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Backend & APIs',
    skills: [
      { name: 'Node.js', level: 85 },
      { name: 'Express.js', level: 87 },
      { name: 'RESTful APIs', level: 90 },
      { name: 'JWT Authentication', level: 88 },
      { name: 'API Security', level: 85 },
    ],
    icon: '⚙️',
    color: 'from-green-500 to-emerald-500',
  },
  {
    title: 'Database',
    skills: [
      { name: 'MongoDB', level: 88 },
      { name: 'Mongoose ODM', level: 85 },
      { name: 'Data Modeling', level: 87 },
      { name: 'SQL Basics', level: 80 },
    ],
    icon: '💾',
    color: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Cloud & Tools',
    skills: [
      { name: 'AWS S3', level: 82 },
      { name: 'Netlify/Vercel', level: 90 },
      { name: 'Render', level: 85 },
      { name: 'Git/GitHub', level: 87 },
      { name: 'VS Code', level: 90 },
    ],
    icon: '☁️',
    color: 'from-orange-500 to-red-500',
  },
];

export const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cubesRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<'grid' | '3d'>('grid');
  const enableHeavy = canHandleHeavyAnimations();

  // Animate section entrance
  useScrollAnimation({
    trigger: sectionRef,
    animation: 'fade',
    start: 'top center+=100',
  });

  // Batch animate skill cards
  useBatchScrollAnimation('.skill-card', 'slideUp', {
    stagger: 0.1,
    duration: 0.8,
    start: 'top bottom-=100',
  });

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="min-h-screen py-20 px-4 bg-primary-light relative overflow-hidden"
    >
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <TextReveal
            splitBy="word"
            trigger="scroll"
            className="text-5xl md:text-6xl font-bold text-text-primary mb-6"
          >
            <span className="text-accent">Skills &</span> Expertise
          </TextReveal>

          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
            Proficient in modern web technologies with hands-on experience building
            full-stack applications
          </p>

          {/* View Toggle */}
          {enableHeavy && (
            <div className="flex gap-4 justify-center items-center">
              <Button
                variant={view === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setView('grid')}
                icon="📊"
              >
                Grid View
              </Button>
              {/* <Button
                variant={view === '3d' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setView('3d')}
                icon="🎮"
              >
                3D View
              </Button> */}
            </div>
          )}
        </div>

        {/* 3D Skills Cubes View */}
        {view === '3d' && enableHeavy && (
          <div
            ref={cubesRef}
            className="w-full h-[600px] mb-16 rounded-2xl overflow-hidden border-2 border-accent/20"
          >
            <Canvas shadows>
              <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={50} />
              
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} castShadow />
              <pointLight position={[-10, -10, -10]} intensity={0.5} color="#64FFDA" />

              <SkillCubes layout="grid" spacing={1.8} />

              <OrbitControls
                enableZoom={true}
                enablePan={false}
                minDistance={5}
                maxDistance={15}
              />
            </Canvas>
          </div>
        )}

        {/* Grid Skills View */}
        {view === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {skillCategories.map((category, index) => (
              <div key={category.title} className="skill-card">
                <Card
                  variant="elevated"
                  hoverable
                  className="h-full transform transition-all duration-500"
                >
                  <CardHeader>
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`text-4xl w-16 h-16 flex items-center justify-center 
                                 rounded-xl bg-gradient-to-br ${category.color} shadow-lg`}
                      >
                        {category.icon}
                      </div>
                      <CardTitle className="text-2xl">{category.title}</CardTitle>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-5">
                      {category.skills.map((skill) => (
                        <div key={skill.name} className="group">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-text-secondary group-hover:text-accent transition-colors font-medium">
                              {skill.name}
                            </span>
                            <span className="text-accent font-mono font-bold text-sm">
                              {skill.level}%
                            </span>
                          </div>

                          {/* Progress Bar */}
                          <div className="relative h-3 bg-primary-dark rounded-full overflow-hidden">
                            <div
                              className={`progress-bar h-full bg-gradient-to-r ${category.color} 
                                       rounded-full transition-all duration-1000 relative overflow-hidden`}
                              style={{ width: `${skill.level}%` }}
                            >
                              {/* Shimmer Effect */}
                              <div
                                className="absolute inset-0 bg-gradient-to-r from-transparent 
                                         via-white/30 to-transparent animate-shimmer"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}

        {/* Additional Skills Section */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-center text-text-primary mb-8">
            Additional <span className="text-accent">Tools & Technologies</span>
          </h3>

          <div className="flex flex-wrap gap-3 justify-center max-w-4xl mx-auto">
            {[
              'Git',
              'GitHub',
              'VS Code',
              'Postman',
              'npm',
              'Webpack',
              'Vite',
              'Jest',
              'ESLint',
              'Prettier',
              'Figma',
              'Three.js',
              'GSAP',
              'WebSocket',
              'REST APIs',
            ].map((tool) => (
              <span
                key={tool}
                className="px-4 py-2 bg-primary border border-accent/30 rounded-full 
                         text-sm font-mono text-text-secondary hover:text-accent 
                         hover:border-accent hover:bg-accent/10 transition-all duration-300 
                         transform hover:scale-110 cursor-default"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        {/* Certifications & Learning */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'TryHackMe Labs',
              value: '25+',
              description: 'Completed cybersecurity challenges',
              icon: '🛡️',
              color: 'from-purple-500 to-pink-500',
            },
            {
              title: 'Projects Built',
              value: '10+',
              description: 'Full-stack applications deployed',
              icon: '🚀',
              color: 'from-blue-500 to-cyan-500',
            },
            {
              title: 'GitHub Repos',
              value: '15+',
              description: 'Open-source contributions',
              icon: '🐙',
              color: 'from-green-500 to-emerald-500',
            },
          ].map((stat, index) => (
            <Card
              key={index}
              variant="glass"
              hoverable
              className="text-center transform transition-all duration-300 hover:scale-105"
            >
              <div
                className={`text-5xl w-20 h-20 flex items-center justify-center 
                         rounded-full bg-gradient-to-br ${stat.color} mx-auto mb-4 shadow-lg`}
              >
                {stat.icon}
              </div>
              <h4 className="text-4xl font-bold text-accent mb-2">{stat.value}</h4>
              <p className="text-lg font-semibold text-text-primary mb-2">{stat.title}</p>
              <p className="text-sm text-text-secondary">{stat.description}</p>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card variant="bordered" className="inline-block max-w-2xl">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                Want to see these skills in action?
              </h3>
              <p className="text-text-secondary mb-6">
                Check out my projects or get in touch to discuss how I can help with your next
                project
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="primary"
                  size="lg"
                  icon="📁"
                  onClick={() =>
                    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
                  }
                >
                  View Projects
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  icon="📧"
                  onClick={() =>
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                  }
                >
                  Contact Me
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Skills;
