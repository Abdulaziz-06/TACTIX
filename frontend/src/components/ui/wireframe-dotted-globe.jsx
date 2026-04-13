import React, { useEffect, useRef, useState } from 'react';
import createGlobe from 'cobe';
import { useSpring } from 'framer-motion';

export const WireframeDottedGlobe = ({ className, size = 800 }) => {
  const canvasRef = useRef();
  const pointerReacting = useRef(null);
  const pointerInteractionMovement = useRef(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const r = useSpring(0, {
    stiffness: 280,
    damping: 40,
    mass: 1,
  });

  useEffect(() => {
    let phi = 0;

    // adjust size for mobile
    let finalSize = size;
    if (windowWidth < 768) {
      finalSize = size * 0.7;
    }

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: finalSize * 2,
      height: finalSize * 2,
      phi: 0,
      theta: 0.15,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 24000,
      mapBrightness: 3.5,
      baseColor: [0.05, 0.05, 0.05],
      markerColor: [0, 1, 0.82], // #00FFD1 matching cyan
      glowColor: [0.0, 0.5, 0.4],
      markers: [
        { location: [37.7595, -122.4367], size: 0.08 }, // SF
        { location: [40.7128, -74.0060], size: 0.1 },   // NY
        { location: [51.5072, -0.1276], size: 0.08 },   // London
        { location: [35.6762, 139.6503], size: 0.12 },  // Tokyo
        { location: [22.3193, 114.1694], size: 0.08 },  // Hong Kong
        { location: [25.2048, 55.2708], size: 0.09 },   // Dubai
      ],
      onRender: (state) => {
        if (!pointerReacting.current) {
          phi += 0.003;
        }
        state.phi = phi + r.get();
        state.width = finalSize * 2;
        state.height = finalSize * 2;
      },
    });

    return () => {
      globe.destroy();
    };
  }, [r, size, windowWidth]);

  return (
    <div
      style={{
        width: '100%',
        maxWidth: size,
        aspectRatio: 1,
        margin: 'auto',
        position: 'relative',
      }}
      className={className}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerReacting.current = e.clientX - pointerInteractionMovement.current;
          canvasRef.current.style.cursor = 'grabbing';
        }}
        onPointerUp={() => {
          pointerReacting.current = null;
          canvasRef.current.style.cursor = 'grab';
        }}
        onPointerOut={() => {
          pointerReacting.current = null;
          canvasRef.current.style.cursor = 'grab';
        }}
        onMouseMove={(e) => {
          if (pointerReacting.current !== null) {
            const delta = e.clientX - pointerReacting.current;
            pointerInteractionMovement.current = delta;
            r.set(delta / 200);
          }
        }}
        onTouchMove={(e) => {
          if (pointerReacting.current !== null && e.touches[0]) {
            const delta = e.touches[0].clientX - pointerReacting.current;
            pointerInteractionMovement.current = delta;
            r.set(delta / 100);
          }
        }}
        style={{
          width: '100%',
          height: '100%',
          cursor: 'grab',
          contain: 'layout paint size',
          opacity: 0,
          animation: 'fadeIn 1.5s ease-in-out forwards',
        }}
      />
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); filter: blur(5px); }
          to { opacity: 1; transform: scale(1); filter: blur(0px); }
        }
      `}</style>
    </div>
  );
};

export default WireframeDottedGlobe;
