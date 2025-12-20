import React, { useState } from 'react';
import { Server, TrendingUp, Zap, ArrowRight, ChevronRight } from 'lucide-react';
import { features } from '../../data/mock';
import { Link } from 'react-router-dom';

const iconMap = {
  Server: Server,
  TrendingUp: TrendingUp,
  Zap: Zap
};

const FeaturesSection = () => {
  const [activeFeature, setActiveFeature] = useState(0);

  return (
    <section id="features" className="bg-black py-24 lg:py-32 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-[#00FFD1]/3 blur-[150px] rounded-full" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-[7.6923%] relative z-10">
        {/* Section Header */}
        <div className="mb-16">
          <span className="text-[#00FFD1] text-lg mb-4 block tracking-wide">THREE PILLARS</span>
          <h2 className="text-white text-4xl md:text-5xl font-semibold leading-tight mb-6">
            Deep analysis across<br />critical domains
          </h2>
          <p className="text-white/70 text-xl max-w-2xl">
            Our AI doesn't just skim headlines—it dives deep into causal chains across technology, markets, and natural events.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Feature Cards */}
          <div className="space-y-4">
            {features.map((feature, index) => {
              const IconComponent = iconMap[feature.icon];
              const isActive = activeFeature === index;

              return (
                <div
                  key={feature.id}
                  className={`p-6 cursor-pointer transition-all duration-400 border ${isActive
                    ? 'bg-[#00FFD1]/5 border-[#00FFD1]/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-[#00FFD1]/20' : 'bg-white/10'
                      }`}>
                      <IconComponent size={24} className={isActive ? 'text-[#00FFD1]' : 'text-white/60'} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className={`text-sm ${isActive ? 'text-[#00FFD1]' : 'text-white/40'
                            }`}>{feature.subtitle}</span>
                          <h3 className="text-white text-xl font-semibold">{feature.title}</h3>
                        </div>
                        <ChevronRight
                          size={20}
                          className={`transition-transform duration-300 ${isActive ? 'rotate-90 text-[#00FFD1]' : 'text-white/30'
                            }`}
                        />
                      </div>
                      {isActive && (
                        <div className="mt-4">
                          <Link
                            to={`/pillers/${feature.slug}`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-[#00FFD1] text-black text-sm font-semibold hover:bg-[#00FFD1]/90 transition-all group"
                          >
                            View Analysis
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Feature Demo */}
          <div className="bg-[#121212] border border-white/10 p-8 lg:p-10">
            <div className="mb-6">
              <span className="text-[#00FFD1] text-sm tracking-wider">LIVE PREDICTION</span>
              <h4 className="text-white text-2xl font-semibold mt-2">Cascade Analysis</h4>
            </div>

            {/* Trigger Event */}
            <div className="bg-black/50 border border-[#00FFD1]/30 p-4 mb-6">
              <span className="text-white/50 text-xs block mb-1">TRIGGER EVENT</span>
              <span className="text-[#00FFD1] text-lg font-medium">
                {features[activeFeature].example.trigger}
              </span>
            </div>

            {/* Predictions */}
            <div className="space-y-3">
              <span className="text-white/50 text-xs block">PREDICTED IMPACTS</span>
              {features[activeFeature].example.predictions.map((prediction, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 bg-white/5 border-l-2 border-[#00FFD1]"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <ArrowRight size={14} className="text-[#00FFD1]" />
                  <span className="text-white/90">{prediction}</span>
                </div>
              ))}
            </div>

            {/* Connection Lines Visual */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/40">Confidence Score</span>
                <span className="text-[#00FFD1] font-medium">94.2%</span>
              </div>
              <div className="w-full h-2 bg-white/10 mt-2">
                <div className="h-full bg-[#00FFD1] transition-all duration-700" style={{ width: '94.2%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
