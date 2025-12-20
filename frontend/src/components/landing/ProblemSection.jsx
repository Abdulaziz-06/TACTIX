import React from 'react';
import { X, Check } from 'lucide-react';
import { comparisons } from '../../data/mock';

const ProblemSection = () => {
  return (
    <section className="bg-black py-24 lg:py-32 relative overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-500/5 blur-[120px] rounded-full" />
      <div className="absolute right-0 top-1/4 w-[300px] h-[300px] bg-[#00FFD1]/5 blur-[100px] rounded-full" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-[7.6923%] relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#4D4D4D] text-lg mb-4 block">THE PROBLEM</span>
          <h2 className="text-white text-4xl md:text-5xl font-semibold leading-tight mb-6">
            Traditional news is
            <span className="text-red-400"> broken</span>
          </h2>
          <p className="text-white/70 text-xl max-w-2xl mx-auto">
            By the time you read it, the smart money has already moved. We're changing that.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          {/* Traditional Column */}
          <div className="bg-white/5 border border-white/10 p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-red-500/20 flex items-center justify-center">
                <X size={20} className="text-red-400" />
              </div>
              <span className="text-white/60 text-xl font-medium">Traditional News</span>
            </div>
            <ul className="space-y-5">
              {comparisons.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <X size={18} className="text-red-400/60 mt-1 flex-shrink-0" />
                  <span className="text-white/50 text-lg">{item.traditional}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tactix Column */}
          <div className="bg-[#00FFD1]/5 border border-[#00FFD1]/20 p-8 relative">
            <div className="absolute top-0 right-0 px-3 py-1 bg-[#00FFD1] text-black text-xs font-semibold">
              TACTIX
            </div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[#00FFD1]/20 flex items-center justify-center">
                <Check size={20} className="text-[#00FFD1]" />
              </div>
              <span className="text-white text-xl font-medium">Tactix Intelligence</span>
            </div>
            <ul className="space-y-5">
              {comparisons.map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check size={18} className="text-[#00FFD1] mt-1 flex-shrink-0" />
                  <span className="text-white/90 text-lg">{item.tactix}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Crushed Paper Visual Accent */}
        <div className="mt-20 relative">
          <div className="w-full h-[2px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black px-6">
            <span className="text-[#4D4D4D] text-sm tracking-widest">THE OLD WAY IS DEAD</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
