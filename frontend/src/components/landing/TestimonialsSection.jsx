import React from 'react';
import { Quote } from 'lucide-react';
import { testimonials } from '../../data/mock';

const TestimonialsSection = () => {
  return (
    <section className="bg-black py-24 lg:py-32 relative overflow-hidden">
      {/* Background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-[7.6923%] relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="text-[#00FFD1] text-lg mb-4 block tracking-wide">TESTIMONIALS</span>
          <h2 className="text-white text-4xl md:text-5xl font-semibold leading-tight">
            Trusted by forward thinkers
          </h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-[#121212] border border-white/10 p-8 lg:p-10 relative group hover:border-[#00FFD1]/30 transition-all duration-400"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6">
                <Quote size={40} className="text-[#00FFD1]/10 group-hover:text-[#00FFD1]/20 transition-colors" />
              </div>

              {/* Quote */}
              <p className="text-white/90 text-xl lg:text-2xl leading-relaxed mb-8">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#00FFD1]/20 flex items-center justify-center">
                  <span className="text-[#00FFD1] font-semibold">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold">{testimonial.author}</p>
                  <p className="text-white/50 text-sm">{testimonial.role}</p>
                </div>
              </div>

              {/* Accent line */}
              <div className="absolute bottom-0 left-0 w-0 h-[3px] bg-[#00FFD1] group-hover:w-full transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
