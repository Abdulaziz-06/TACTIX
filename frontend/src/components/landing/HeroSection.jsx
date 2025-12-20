import React, { Suspense, lazy } from 'react';
import { ArrowRight, Play } from 'lucide-react';
import { stats } from '../../data/mock';

// Lazy load Spline to avoid blocking
const Spline = lazy(() => import('@splinetool/react-spline'));

const HeroSection = () => {
  return (
    <section className="min-h-screen bg-black relative overflow-hidden pt-20">
      {/* Background Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 1px, transparent 1px, transparent 7.6923%),
            repeating-linear-gradient(-90deg, #fff, #fff 1px, transparent 1px, transparent 7.6923%)
          `,
          backgroundSize: '100% 100%'
        }}
      />

      {/* Gradient Accent */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00FFD1]/5 blur-[150px] rounded-full" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-[7.6923%] relative z-10">
        <div className="flex flex-col lg:flex-row items-center min-h-[calc(100vh-80px)] gap-12 lg:gap-0">
          {/* Left Content */}
          <div className="flex-1 pt-16 lg:pt-0">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#00FFD1]/30 bg-[#00FFD1]/5 mb-8">
              <div className="w-2 h-2 bg-[#00FFD1] animate-pulse" />
              <span className="text-[#00FFD1] text-sm font-medium tracking-wide">AI-POWERED NEWS INTELLIGENCE</span>
            </div>

            {/* Headline */}
            <h1 className="text-white text-5xl md:text-[66px] font-semibold leading-[1.1] tracking-[-0.62px] mb-6">
              Know the news
              <br />
              <span className="text-[#00FFD1]">before</span> it breaks
            </h1>

            {/* Subheadline */}
            <p className="text-white/85 text-xl md:text-2xl font-normal leading-relaxed max-w-xl mb-10">
              We don't just report what happened. We predict what's next—connecting every factor like a detective maps a case.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <button className="group flex items-center justify-between gap-3 px-8 py-4 bg-[#00FFD1] text-black text-lg font-medium hover:bg-[rgba(0,255,209,0.1)] hover:text-[#00FFD1] transition-all duration-400 min-w-[220px]">
                Start Predicting
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group flex items-center justify-center gap-3 px-8 py-4 bg-white/10 text-white text-lg font-medium hover:bg-white hover:text-black transition-all duration-400">
                <Play size={18} fill="currentColor" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/10 pt-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center md:text-left">
                  <div className="text-[#00FFD1] text-3xl md:text-4xl font-semibold mb-1">{stat.value}</div>
                  <div className="text-white/50 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Spline 3D */}
          <div className="flex-1 relative w-full h-[500px] lg:h-[700px]">
            <div className="absolute inset-0 overflow-visible">
              <Suspense fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-16 h-16 border-2 border-[#00FFD1]/30 border-t-[#00FFD1] rounded-full animate-spin" />
                </div>
              }>
                <Spline scene="https://prod.spline.design/NbVmy6DPLhY-5Lvg/scene.splinecode" />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-white/40 text-sm">Scroll to explore</span>
        <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-[#00FFD1] rounded-full" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
