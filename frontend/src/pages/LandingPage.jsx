import React from 'react';
import { Toaster } from 'sonner';
import Header from '../components/landing/Header';
import HeroSection from '../components/landing/HeroSection';
import ProblemSection from '../components/landing/ProblemSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
// import TestimonialsSection from '../components/landing/TestimonialsSection';

import Footer from '../components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-black">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#121212',
            color: '#fff',
            border: '1px solid rgba(0, 255, 209, 0.3)'
          }
        }}
      />
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <HowItWorksSection />
        {/* <TestimonialsSection /> */}
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
