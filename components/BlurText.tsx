"use client";

import { useEffect, useState, useRef } from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

const styles = {
  wrapper: {
    display: 'inline-block',
    whiteSpace: 'pre-wrap'
  },
  srOnly: {
    position: 'absolute' as 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    border: 0
  }
};

interface BlurTextProps extends HTMLMotionProps<'span'> {
  text: string;
  duration?: number;
  delay?: number;
  initialBlur?: number;
  animateOn?: 'view' | 'hover' | 'both';
  revealDirection?: 'all' | 'sequential' | 'word';
  className?: string;
  parentClassName?: string;
  staggerDelay?: number;
}

export default function BlurText({
  text,
  duration = 1000,
  delay = 0,
  initialBlur = 10,
  animateOn = 'view',
  revealDirection = 'all',
  className = '',
  parentClassName = '',
  staggerDelay = 0.1,
  ...props
}: BlurTextProps) {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (animateOn !== 'view' && animateOn !== 'both') return;

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !hasAnimated) {
          setTimeout(() => {
            setIsActive(true);
            setHasAnimated(true);
          }, delay);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [animateOn, hasAnimated, delay]);

  const hoverProps =
    animateOn === 'hover' || animateOn === 'both'
      ? {
          onMouseEnter: () => {
            setTimeout(() => setIsActive(true), delay);
          },
          onMouseLeave: () => setIsActive(false)
        }
      : {};

  // All at once animation
  if (revealDirection === 'all') {
    return (
      <motion.span 
        className={`${parentClassName} ${className}`}
        ref={containerRef} 
        style={styles.wrapper} 
        {...hoverProps} 
        {...props}
      >
        <span style={styles.srOnly}>{text}</span>
        
        <motion.span
          aria-hidden="true"
          initial={{ filter: `blur(${initialBlur}px)`, opacity: 0 }}
          animate={
            isActive
              ? { filter: 'blur(0px)', opacity: 1 }
              : { filter: `blur(${initialBlur}px)`, opacity: 0 }
          }
          transition={{
            duration: duration / 1000,
            ease: 'easeOut'
          }}
        >
          {text}
        </motion.span>
      </motion.span>
    );
  }

  // Word-by-word animation
  if (revealDirection === 'word') {
    const words = text.split(' ');
    
    return (
      <motion.span 
        className={parentClassName}
        ref={containerRef} 
        style={styles.wrapper} 
        {...hoverProps} 
        {...props}
      >
        <span style={styles.srOnly}>{text}</span>
        
        <span aria-hidden="true">
          {words.map((word, index) => (
            <motion.span
              key={index}
              className={className}
              initial={{ filter: `blur(${initialBlur}px)`, opacity: 0 }}
              animate={
                isActive
                  ? { filter: 'blur(0px)', opacity: 1 }
                  : { filter: `blur(${initialBlur}px)`, opacity: 0 }
              }
              transition={{
                duration: duration / 1000,
                ease: 'easeOut',
                delay: isActive ? (index * staggerDelay) : 0
              }}
              style={{ display: 'inline-block', marginRight: '0.25em' }}
            >
              {word}
            </motion.span>
          ))}
        </span>
      </motion.span>
    );
  }

  // Sequential character-by-character animation
  return (
    <motion.span 
      className={parentClassName}
      ref={containerRef} 
      style={styles.wrapper} 
      {...hoverProps} 
      {...props}
    >
      <span style={styles.srOnly}>{text}</span>
      
      <span aria-hidden="true">
        {text.split('').map((char, index) => (
          <motion.span
            key={index}
            className={className}
            initial={{ filter: `blur(${initialBlur}px)`, opacity: 0 }}
            animate={
              isActive
                ? { filter: 'blur(0px)', opacity: 1 }
                : { filter: `blur(${initialBlur}px)`, opacity: 0 }
            }
            transition={{
              duration: duration / 1000,
              ease: 'easeOut',
              delay: isActive ? (index * 0.03) : 0
            }}
            style={{ display: 'inline-block' }}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        ))}
      </span>
    </motion.span>
  );
}
