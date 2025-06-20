
import React, { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

type FadeInProps = {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
};

const FadeIn: React.FC<FadeInProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 500,
  className = '',
  threshold = 0.1,
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once && domRef.current) {
              observer.unobserve(domRef.current);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { threshold }
    );

    const { current } = domRef;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [once, threshold]);

  const directionClasses = {
    up: 'translate-y-8',
    down: 'translate-y-[-8px]',
    left: 'translate-x-8',
    right: 'translate-x-[-8px]',
    none: ''
  };

  const animationStyle = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translate(0, 0)' : undefined,
    transition: `opacity ${duration}ms, transform ${duration}ms`,
    transitionDelay: `${delay}ms`,
    willChange: 'opacity, transform'
  };

  return (
    <div
      ref={domRef}
      className={cn(
        !isVisible && directionClasses[direction],
        className
      )}
      style={animationStyle}
    >
      {children}
    </div>
  );
};

export default FadeIn;
