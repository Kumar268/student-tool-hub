import { useRef, useEffect, useState } from 'react';

/**
 * use3DTilt — Premium 3D mouse rotation hook.
 * Throttled using requestAnimationFrame and Lerp smoothing.
 */
export default function use3DTilt(settings = { max: 2, speed: 400 }) {
  const ref = useRef(null);
  const [isLowEnd, setIsLowEnd] = useState(false);
  const requestRef = useRef();
  
  // Target rotation
  const rotateX = useRef(0);
  const rotateY = useRef(0);
  // Current (smoothed) rotation
  const currentX = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    // 1. Performance Check
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const lowPerf = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) || 
                   (navigator.deviceMemory && navigator.deviceMemory <= 1) ||
                   window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (isMobile || lowPerf) {
      setIsLowEnd(true);
      if (lowPerf) document.documentElement.classList.add('reduce-motion');
      return;
    }

    const node = ref.current;
    if (!node) return;

    const handleMouseMove = (e) => {
      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      // Calculate target rotation (max ±2deg)
      rotateY.current = (mouseX / (rect.width / 2)) * settings.max;
      rotateX.current = -(mouseY / (rect.height / 2)) * settings.max;
    };

    const handleMouseLeave = () => {
      rotateX.current = 0;
      rotateY.current = 0;
      // Start cleanup of will-change
      setTimeout(() => {
        if (node && !rotateX.current && !rotateY.current) {
          node.style.willChange = 'auto';
        }
      }, 500);
    };

    const handleMouseEnter = () => {
      if (node) node.style.willChange = 'transform';
    };

    const animate = () => {
      // Lerp smoothing (linear interpolation)
      // current = current + (target - current) * factor
      const lerpFactor = 0.1;
      currentX.current += (rotateX.current - currentX.current) * lerpFactor;
      currentY.current += (rotateY.current - currentY.current) * lerpFactor;

      if (node) {
        node.style.transform = `rotateX(${currentX.current.toFixed(3)}deg) rotateY(${currentY.current.toFixed(3)}deg)`;
      }
      
      requestRef.current = requestAnimationFrame(animate);
    };

    node.addEventListener('mousemove', handleMouseMove);
    node.addEventListener('mouseleave', handleMouseLeave);
    node.addEventListener('mouseenter', handleMouseEnter);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      node.removeEventListener('mousemove', handleMouseMove);
      node.removeEventListener('mouseleave', handleMouseLeave);
      node.removeEventListener('mouseenter', handleMouseEnter);
      cancelAnimationFrame(requestRef.current);
    };
  }, [settings.max]);

  return { ref, isLowEnd };
}
