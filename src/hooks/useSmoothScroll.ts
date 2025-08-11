'use client';

import { useEffect } from 'react';

export const useSmoothScroll = () => {
  useEffect(() => {
    const handleInternalLinkClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="#"]');
      
      if (link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        
        if (href && href.startsWith('#')) {
          const targetElement = document.querySelector(href);
          
          if (targetElement) {
            const headerHeight = 80; // Altura aproximada del header
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        }
      }
    };

    document.addEventListener('click', handleInternalLinkClick);
    
    return () => {
      document.removeEventListener('click', handleInternalLinkClick);
    };
  }, []);
};
