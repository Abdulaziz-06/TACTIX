import React, { useState, useEffect, useRef } from 'react';

const NodeAnimation = () => {
  const canvasRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Node structure
    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2;
    
    const nodeData = [
      { id: 'center', x: centerX, y: centerY, label: 'Breaking News', size: 30, color: '#00FFD1', children: [1, 2, 3] },
      { id: 1, x: centerX - 180, y: centerY - 80, label: 'Tech Impact', size: 20, color: '#00FFD1', parent: 'center', children: [4, 5] },
      { id: 2, x: centerX + 180, y: centerY - 80, label: 'Market Effect', size: 20, color: '#00FFD1', parent: 'center', children: [6, 7] },
      { id: 3, x: centerX, y: centerY + 120, label: 'Social Impact', size: 20, color: '#00FFD1', parent: 'center', children: [8, 9] },
      { id: 4, x: centerX - 250, y: centerY - 160, label: 'Services', size: 14, color: '#6FD2C0', parent: 1 },
      { id: 5, x: centerX - 120, y: centerY - 180, label: 'Infrastructure', size: 14, color: '#6FD2C0', parent: 1 },
      { id: 6, x: centerX + 120, y: centerY - 180, label: 'Stocks', size: 14, color: '#6FD2C0', parent: 2 },
      { id: 7, x: centerX + 260, y: centerY - 160, label: 'Commodities', size: 14, color: '#6FD2C0', parent: 2 },
      { id: 8, x: centerX - 80, y: centerY + 200, label: 'Employment', size: 14, color: '#6FD2C0', parent: 3 },
      { id: 9, x: centerX + 80, y: centerY + 200, label: 'Sentiment', size: 14, color: '#6FD2C0', parent: 3 },
    ];

    setNodes(nodeData);

    let pulsePhase = 0;
    let connectionProgress = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      pulsePhase += 0.02;
      connectionProgress = Math.min(connectionProgress + 0.005, 1);

      // Draw connections with animation
      nodeData.forEach(node => {
        if (node.parent !== undefined) {
          const parent = nodeData.find(n => n.id === node.parent);
          if (parent) {
            const progress = Math.min(connectionProgress * 2, 1);
            const endX = parent.x + (node.x - parent.x) * progress;
            const endY = parent.y + (node.y - parent.y) * progress;

            // Glow effect
            ctx.shadowColor = '#00FFD1';
            ctx.shadowBlur = 10;
            
            // Draw line
            ctx.beginPath();
            ctx.moveTo(parent.x, parent.y);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = `rgba(0, 255, 209, ${0.3 + Math.sin(pulsePhase) * 0.2})`;
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Animated particle along line
            if (connectionProgress > 0.5) {
              const particlePos = (Math.sin(pulsePhase * 2) + 1) / 2;
              const px = parent.x + (node.x - parent.x) * particlePos;
              const py = parent.y + (node.y - parent.y) * particlePos;
              
              ctx.beginPath();
              ctx.arc(px, py, 3, 0, Math.PI * 2);
              ctx.fillStyle = '#00FFD1';
              ctx.fill();
            }
          }
        }
      });

      // Draw nodes
      nodeData.forEach(node => {
        const pulse = 1 + Math.sin(pulsePhase + node.id) * 0.1;
        const size = node.size * pulse;

        // Outer glow
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 20;
        
        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
        ctx.fillStyle = node.id === 'center' ? node.color : '#121212';
        ctx.fill();
        ctx.strokeStyle = node.color;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Label
        ctx.font = `${node.id === 'center' ? '14px' : '11px'} Inter, system-ui`;
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + size + 18);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ background: 'transparent' }}
      />
    </div>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'News Ingestion',
      description: 'Our AI monitors thousands of sources in real-time, identifying events with cascading potential.'
    },
    {
      number: '02',
      title: 'Factor Analysis',
      description: 'Every piece of news is broken down into atomic factors—companies, sectors, geographies, dependencies.'
    },
    {
      number: '03',
      title: 'Graph Construction',
      description: 'We build a dynamic knowledge graph connecting all relevant entities and their relationships.'
    },
    {
      number: '04',
      title: 'Impact Prediction',
      description: 'Advanced ML models traverse the graph to predict ripple effects across all connected nodes.'
    }
  ];

  return (
    <section id="how-it-works" className="bg-black py-24 lg:py-32 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00FFD1]/3 blur-[200px] rounded-full" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-[7.6923%] relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#00FFD1] text-lg mb-4 block tracking-wide">THE PROCESS</span>
          <h2 className="text-white text-4xl md:text-5xl font-semibold leading-tight mb-6">
            How we connect the dots
          </h2>
          <p className="text-white/70 text-xl max-w-2xl mx-auto">
            Like a detective building a case, our AI constructs a web of causality from every breaking story.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Node Animation */}
          <div className="order-2 lg:order-1 h-[400px] lg:h-[500px] bg-[#121212]/50 border border-white/10">
            <NodeAnimation />
          </div>

          {/* Steps */}
          <div className="order-1 lg:order-2 space-y-6">
            {steps.map((step, index) => (
              <div
                key={index}
                className="group flex gap-6 p-6 bg-white/5 border border-white/10 hover:bg-[#00FFD1]/5 hover:border-[#00FFD1]/30 transition-all duration-400"
              >
                <div className="flex-shrink-0">
                  <span className="text-[#00FFD1]/30 group-hover:text-[#00FFD1] text-4xl font-bold transition-colors">
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="text-white text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-white/60 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
