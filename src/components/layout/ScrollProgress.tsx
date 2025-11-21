import { useState, useEffect } from 'react';

export const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const calculateScrollProgress = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      const scrollPercentage = (scrollTop / (documentHeight - windowHeight)) * 100;
      
      setScrollProgress(scrollPercentage);
      setIsVisible(scrollTop > 100);
    };

    calculateScrollProgress();
    window.addEventListener('scroll', calculateScrollProgress);
    window.addEventListener('resize', calculateScrollProgress);

    return () => {
      window.removeEventListener('scroll', calculateScrollProgress);
      window.removeEventListener('resize', calculateScrollProgress);
    };
  }, []);

  return (
    <>
      {/* Top Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-primary-light">
        <div
          className="h-full bg-gradient-to-r from-accent to-accent-hover 
                   shadow-lg shadow-accent/50 transition-all duration-100"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Circular Progress Indicator with Scroll to Top */}
      {isVisible && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 flex items-center 
                   justify-center rounded-full bg-primary-light border-2 
                   border-accent/30 hover:border-accent shadow-lg 
                   hover:shadow-accent/50 transition-all duration-300 
                   transform hover:scale-110 group"
          aria-label="Scroll to top"
        >
          {/* Circular Progress */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="text-primary-light"
            />
            <circle
              cx="28"
              cy="28"
              r="24"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 24}`}
              strokeDashoffset={`${2 * Math.PI * 24 * (1 - scrollProgress / 100)}`}
              className="text-accent transition-all duration-100"
              strokeLinecap="round"
            />
          </svg>

          {/* Arrow Icon */}
          <span className="text-accent text-xl transform group-hover:-translate-y-1 
                       transition-transform duration-300">
            ↑
          </span>
        </button>
      )}

      {/* Side Progress Indicator (Optional) */}
      <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
        <div className="flex flex-col items-center space-y-4">
          {['home', 'about', 'skills', 'projects', 'education', 'contact'].map(
            (section, index) => {
              const sectionProgress = (index / 5) * 100;
              const isActive = scrollProgress >= sectionProgress;

              return (
                <button
                  key={section}
                  onClick={() => {
                    document
                      .getElementById(section)
                      ?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="group relative"
                  aria-label={`Go to ${section}`}
                >
                  <div
                    className={`w-3 h-3 rounded-full border-2 transition-all 
                             duration-300 ${
                               isActive
                                 ? 'bg-accent border-accent scale-125'
                                 : 'bg-transparent border-accent/30 hover:border-accent'
                             }`}
                  />
                  
                  {/* Tooltip */}
                  <span
                    className="absolute left-6 top-1/2 -translate-y-1/2 px-2 py-1 
                             bg-primary-light border border-accent/30 rounded text-xs 
                             text-accent whitespace-nowrap opacity-0 group-hover:opacity-100 
                             transition-opacity duration-300 pointer-events-none capitalize"
                  >
                    {section}
                  </span>
                </button>
              );
            }
          )}
        </div>
      </div>
    </>
  );
};

export default ScrollProgress;
