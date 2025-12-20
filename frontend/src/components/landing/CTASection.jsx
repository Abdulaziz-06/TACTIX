import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';

const CTASection = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('Welcome to Tactix! Check your email for early access.');
    setEmail('');
    setIsSubmitting(false);
  };

  const benefits = [
    'Zero advertisements forever',
    'Real-time prediction alerts',
    'API access for developers',
    'Priority support'
  ];

  return (
    <section id="pricing" className="bg-black py-24 lg:py-32 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00FFD1]/5 to-transparent" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00FFD1]/10 blur-[150px] rounded-full" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-[7.6923%] relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main CTA Card */}
          <div className="bg-[#121212] border border-[#00FFD1]/20 p-10 lg:p-16 text-center relative">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#00FFD1]" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#00FFD1]" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#00FFD1]" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#00FFD1]" />

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#00FFD1]/30 bg-[#00FFD1]/5 mb-8">
              <span className="text-[#00FFD1] text-sm font-medium">EARLY ACCESS</span>
            </div>

            <h2 className="text-white text-4xl md:text-5xl font-semibold leading-tight mb-6">
              Be the first to know
              <br />
              <span className="text-[#00FFD1]">what's next</span>
            </h2>

            <p className="text-white/70 text-xl max-w-xl mx-auto mb-10">
              Join our exclusive early access program. Limited spots available for our beta launch.
            </p>

            {/* Email Form */}
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-10">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-black border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#00FFD1] transition-colors text-lg"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-[#00FFD1] text-black text-lg font-medium hover:bg-[rgba(0,255,209,0.1)] hover:text-[#00FFD1] transition-all duration-400 disabled:opacity-50"
              >
                {isSubmitting ? 'Joining...' : 'Get Access'}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>

            {/* Benefits */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center justify-center gap-2 text-white/60 text-sm">
                  <Check size={16} className="text-[#00FFD1]" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-12 text-center">
            <p className="text-white/40 text-sm mb-4">TRUSTED BY TEAMS AT</p>
            <div className="flex items-center justify-center gap-8 flex-wrap">
              {['Sequoia', 'Goldman Sachs', 'Bloomberg', 'Reuters'].map((company, index) => (
                <span key={index} className="text-white/20 text-xl font-semibold tracking-wide">
                  {company}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
