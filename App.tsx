import React, { useEffect, useRef, useState, useMemo } from 'react';
import InfoPanel from './components/InfoPanel';
import HUD from './components/HUD';
import { INFOGRAPHIC_NODES } from './constants';
import { ContentNode } from './types';

// Constants for the 360 simulation
const DRAG_SENSITIVITY_X = 0.2; // Degrees per pixel
const DRAG_SENSITIVITY_Y = 0.1; // Vertical tilt
const FOV_DEGREES = 80; // Field of View
const STAR_COUNT = 300;

interface Star {
  id: number;
  azimuth: number; // 0-360 degrees
  elevation: number; // 0-100% vertical
  size: number;
  brightness: number;
  twinkleSpeed: number;
}

const App: React.FC = () => {
  const [activeNode, setActiveNode] = useState<ContentNode | null>(null);
  
  // Camera State
  // rotationX = Azimuth (Horizontal Angle, 0-360)
  // rotationY = Elevation (Vertical Tilt, constrained)
  const cameraRef = useRef({ 
    azimuth: 0, 
    elevation: 0, 
    targetAzimuth: 0, 
    targetElevation: 0,
    isDragging: false,
    startX: 0,
    startY: 0,
    lastAzimuth: 0,
    lastElevation: 0
  });

  const containerRef = useRef<HTMLDivElement>(null);

  // Generate stars distributed in 360 space
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: STAR_COUNT }).map((_, i) => ({
      id: i,
      azimuth: Math.random() * 360,
      elevation: Math.random() * 100,
      size: Math.random() * 2 + 1,
      brightness: Math.random() * 0.5 + 0.3,
      twinkleSpeed: Math.random() * 3 + 1
    }));
  }, []);

  // Animation Loop: Updates DOM positions based on Camera Angle
  useEffect(() => {
    let animationFrameId: number;

    const updateScene = () => {
      const cam = cameraRef.current;
      
      // 1. Smooth Camera Movement (Lerp)
      cam.azimuth += (cam.targetAzimuth - cam.azimuth) * 0.1;
      cam.elevation += (cam.targetElevation - cam.elevation) * 0.1;

      // 2. Update Info Points (Cylindrical Projection)
      const points = document.querySelectorAll('.info-point') as NodeListOf<HTMLElement>;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;
      const pixelsPerDegree = screenWidth / FOV_DEGREES;

      INFOGRAPHIC_NODES.forEach((node, index) => {
        const pointEl = document.getElementById(`node-${node.id}`);
        if (!pointEl) return;

        // Map Node X (0-100) to Degrees (0-360)
        const nodeAzimuth = (node.x / 100) * 360;
        
        // Calculate relative angle to camera
        // We use modulo arithmetic to find the shortest path and handle wrapping
        let deltaAzimuth = (nodeAzimuth - cam.azimuth) % 360;
        if (deltaAzimuth > 180) deltaAzimuth -= 360;
        if (deltaAzimuth < -180) deltaAzimuth += 360;

        // Visibility Check (Culling)
        // Only show if within FOV + padding
        if (Math.abs(deltaAzimuth) > (FOV_DEGREES / 2 + 20)) {
          pointEl.style.display = 'none';
          return;
        } else {
          pointEl.style.display = 'flex';
        }

        // Project to Screen Coordinates
        // X: 0 is center of screen
        const screenX = (screenWidth / 2) + (deltaAzimuth * pixelsPerDegree);
        
        // Y: Parallax based on elevation
        // Basic tilt offset + node position
        const nodeElevation = node.y - 50; // Center around 0
        const tiltOffset = cam.elevation * 5; // Sensitivity
        const screenY = (screenHeight / 2) + (nodeElevation * (screenHeight / 100)) + tiltOffset;

        // Scale based on "Z" (simulated depth)
        const zScale = node.z ? 1 + (node.z / 100) : 1;
        
        pointEl.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) scale(${zScale})`;
        pointEl.style.zIndex = Math.floor(zScale * 10).toString();
      });

      // 3. Update Stars (Parallax Background)
      const starElements = document.querySelectorAll('.star-element') as NodeListOf<HTMLElement>;
      starElements.forEach((starEl) => {
        const azimuth = parseFloat(starEl.dataset.azimuth || "0");
        const elevation = parseFloat(starEl.dataset.elevation || "0");
        
        let deltaAzimuth = (azimuth - cam.azimuth) % 360;
        if (deltaAzimuth > 180) deltaAzimuth -= 360;
        if (deltaAzimuth < -180) deltaAzimuth += 360;

        const screenX = (screenWidth / 2) + (deltaAzimuth * pixelsPerDegree * 0.5); // 0.5 factor = far away depth
        const screenY = (screenHeight / 2) + ((elevation - 50) * (screenHeight/80)) + (cam.elevation * 2);

        starEl.style.transform = `translate3d(${screenX}px, ${screenY}px, 0)`;
      });

      animationFrameId = requestAnimationFrame(updateScene);
    };

    updateScene();
    return () => cancelAnimationFrame(animationFrameId);
  }, [activeNode]);

  // Input Handling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleStart = (clientX: number, clientY: number) => {
      cameraRef.current.isDragging = true;
      cameraRef.current.startX = clientX;
      cameraRef.current.startY = clientY;
      cameraRef.current.lastAzimuth = cameraRef.current.targetAzimuth;
      cameraRef.current.lastElevation = cameraRef.current.targetElevation;
      container.style.cursor = 'grabbing';
    };

    const handleMove = (clientX: number, clientY: number) => {
      if (!cameraRef.current.isDragging) return;
      
      const deltaX = clientX - cameraRef.current.startX;
      const deltaY = clientY - cameraRef.current.startY;

      // Invert deltaX because dragging left moves camera right (looking left)
      cameraRef.current.targetAzimuth = cameraRef.current.lastAzimuth - (deltaX * DRAG_SENSITIVITY_X);
      
      // Tilt
      const newElevation = cameraRef.current.lastElevation - (deltaY * DRAG_SENSITIVITY_Y);
      // Clamp Tilt
      cameraRef.current.targetElevation = Math.max(-20, Math.min(20, newElevation));
    };

    const handleEnd = () => {
      cameraRef.current.isDragging = false;
      if (container) container.style.cursor = 'grab';
    };

    // Mouse
    const onMouseDown = (e: MouseEvent) => handleStart(e.clientX, e.clientY);
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onMouseUp = () => handleEnd();

    // Touch
    const onTouchStart = (e: TouchEvent) => handleStart(e.touches[0].clientX, e.touches[0].clientY);
    const onTouchMove = (e: TouchEvent) => {
      // Allow scroll on HUD, but not scene
      if (!(e.target as HTMLElement).closest('.info-panel')) {
        e.preventDefault();
      }
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };
    const onTouchEnd = () => handleEnd();

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    container.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden font-body select-none">
      
      <HUD />

      {/* Main 360 Scene Container */}
      <div 
        ref={containerRef}
        id="scene-container"
        className="absolute inset-0 cursor-grab active:cursor-grabbing z-0 touch-none"
      >
        {/* Background Layer: Stars */}
        {stars.map((star) => (
          <div
            key={star.id}
            className="star-element absolute rounded-full bg-white shadow-[0_0_2px_#fff]"
            data-azimuth={star.azimuth}
            data-elevation={star.elevation}
            style={{
              width: `${star.size}px`,
              height: `${star.size}px`,
              opacity: star.brightness,
              left: 0, 
              top: 0,
              willChange: 'transform',
              animation: `twinkle ${star.twinkleSpeed}s infinite ease-in-out`
            }}
          />
        ))}

        {/* Foreground Layer: Nodes */}
        {INFOGRAPHIC_NODES.map((node) => {
          // Helper to convert hex to rgba
          const hexToRgba = (hex: string, alpha: number) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            return `rgba(${r},${g},${b},${alpha})`;
          };
          
          return (
            <div
              key={node.id}
              id={`node-${node.id}`}
              onClick={(e) => {
                e.stopPropagation();
                setActiveNode(node);
              }}
              className={`info-point absolute w-[80px] h-[80px] rounded-full flex flex-col items-center justify-center 
                cursor-pointer transition-all duration-300 will-change-transform
                hover:z-50 group`}
              style={{
                left: 0,
                top: 0,
                // Dynamic styles based on node color
                background: activeNode?.id === node.id 
                  ? `radial-gradient(circle, ${hexToRgba(node.color, 0.6)}, rgba(0,0,0,0.9))` 
                  : `radial-gradient(circle, ${hexToRgba(node.color, 0.3)}, rgba(0,0,0,0.8))`,
                border: activeNode?.id === node.id 
                  ? `2px solid ${node.color}` 
                  : `1px solid ${hexToRgba(node.color, 0.5)}`,
                boxShadow: activeNode?.id === node.id
                  ? `0 0 30px ${node.color}`
                  : `0 0 15px ${node.color}`,
              }}
            >
              {/* Center Dot */}
              <div 
                className={`w-3 h-3 rounded-full mb-2 ${activeNode?.id === node.id ? '' : 'animate-pulse'}`} 
                style={{ backgroundColor: node.color }}
              />
              
              {/* Label */}
              <span className="font-display text-[10px] uppercase tracking-wider text-center text-white/90 drop-shadow-[0_2px_2px_rgba(0,0,0,1)] bg-black/50 px-2 py-1 rounded backdrop-blur-sm border border-white/10 group-hover:bg-black/80 transition-colors"
                    style={{ borderColor: `rgba(255,255,255,0.2)` }}>
                {node.title.split("(")[0]}
              </span>

              {/* Orbit Ring (Decoration) */}
              <div className="absolute inset-[-10px] rounded-full border border-dashed border-white/20 animate-spin-slow pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          );
        })}
      </div>

      {/* Info Panel Overlay */}
      <InfoPanel node={activeNode} onClose={() => setActiveNode(null)} />

    </div>
  );
};

export default App;