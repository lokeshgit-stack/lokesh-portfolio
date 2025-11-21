import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './Card';
import { Button } from './Button';

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  features: string[];
  github?: string;
  demo?: string;
  icon: string;
  color: string;
  image?: string;
}

interface ProjectCardProps {
  project: Project;
  className?: string;
}

export const ProjectCard = ({ project, className = '' }: ProjectCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Card
      variant="elevated"
      padding="none"
      hoverable
      className={`overflow-hidden group ${className}`}
    >
      {/* Project Header with Icon/Image */}
      <div
        className={`h-48 bg-gradient-to-br ${project.color} flex items-center 
                   justify-center relative overflow-hidden`}
      >
        {project.image ? (
          <>
            <img
              src={project.image}
              alt={project.title}
              className={`w-full h-full object-cover transition-all duration-500 
                       group-hover:scale-110 ${
                         imageLoaded ? 'opacity-100' : 'opacity-0'
                       }`}
              onLoad={() => setImageLoaded(true)}
            />
            {!imageLoaded && (
              <div className="absolute inset-0 bg-primary-light animate-pulse" />
            )}
          </>
        ) : (
          <div className="text-8xl transform group-hover:scale-110 transition-transform duration-500">
            {project.icon}
          </div>
        )}

        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />

        {/* Project ID Badge */}
        <div
          className="absolute top-4 right-4 w-10 h-10 bg-primary/80 backdrop-blur-sm 
                   rounded-full flex items-center justify-center border-2 border-accent/30"
        >
          <span className="text-accent font-bold">#{project.id}</span>
        </div>
      </div>

      {/* Project Content */}
      <div className="p-6">
        <CardHeader>
          <CardTitle className="group-hover:text-accent transition-colors">
            {project.title}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-text-secondary mb-4 line-clamp-3">
            {project.description}
          </p>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 text-xs font-mono bg-primary rounded-full 
                         text-accent border border-accent/30 hover:border-accent 
                         transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Key Features - Expandable */}
          <div className="mb-4">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-sm font-semibold text-text-primary mb-2 flex 
                       items-center gap-2 hover:text-accent transition-colors"
            >
              <span>Key Features</span>
              <span
                className={`transform transition-transform duration-300 ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              >
                ▼
              </span>
            </button>

            <div
              className={`overflow-hidden transition-all duration-300 ${
                isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <ul className="space-y-2 text-sm text-text-secondary">
                {project.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-accent mt-1 flex-shrink-0">▹</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex gap-4">
          {project.github && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(project.github, '_blank')}
              icon="🔗"
              className="flex-1"
            >
              GitHub
            </Button>
          )}
          {project.demo && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => window.open(project.demo, '_blank')}
              icon="🚀"
              iconPosition="right"
              className="flex-1"
            >
              Live Demo
            </Button>
          )}
        </CardFooter>
      </div>
    </Card>
  );
};

export default ProjectCard;
