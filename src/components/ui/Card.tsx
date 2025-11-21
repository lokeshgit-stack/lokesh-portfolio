import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'elevated' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card = ({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hoverable = false,
  onClick,
}: CardProps) => {
  const baseStyles = 'rounded-2xl transition-all duration-300';

  const variants = {
    default: 'bg-primary-light border border-accent/20',
    bordered: 'bg-primary border-2 border-accent/30',
    elevated:
      'bg-primary-light border border-accent/20 shadow-xl hover:shadow-2xl',
    glass: 'bg-primary/50 backdrop-blur-md border border-accent/30',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const hoverStyles = hoverable
    ? 'cursor-pointer hover:border-accent/50 hover:-translate-y-2 hover:shadow-accent/20'
    : '';

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${paddings[padding]} ${hoverStyles} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

// Card Header Component
interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export const CardHeader = ({ children, className = '' }: CardHeaderProps) => {
  return <div className={`mb-4 ${className}`}>{children}</div>;
};

// Card Title Component
interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export const CardTitle = ({ children, className = '' }: CardTitleProps) => {
  return (
    <h3 className={`text-2xl font-bold text-text-primary ${className}`}>
      {children}
    </h3>
  );
};

// Card Content Component
interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export const CardContent = ({ children, className = '' }: CardContentProps) => {
  return <div className={`text-text-secondary ${className}`}>{children}</div>;
};

// Card Footer Component
interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export const CardFooter = ({ children, className = '' }: CardFooterProps) => {
  return (
    <div className={`mt-6 pt-4 border-t border-accent/20 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
