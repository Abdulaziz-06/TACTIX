import React from 'react';
import { ArrowUpRight, Mail, MapPin } from 'lucide-react';
import { navLinks } from '../../data/mock';

const Footer = () => {
  const socialLinks = [
    { name: 'Twitter', href: '#' },
    { name: 'LinkedIn', href: '#' },
    { name: 'GitHub', href: '#' }
  ];

  return (
    <footer className="bg-black border-t border-white/10 py-16 lg:py-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-[7.6923%]">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-[#00FFD1] flex items-center justify-center">
                <span className="text-black font-bold text-xl">T</span>
              </div>
              <span className="text-white text-2xl font-semibold tracking-tight">tactix</span>
            </a>
            <p className="text-white/60 text-lg max-w-md mb-6 leading-relaxed">
              The future of news intelligence. Predict market movements, tech disruptions, and global events before they unfold.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="group w-10 h-10 border border-white/20 flex items-center justify-center hover:border-[#00FFD1] hover:bg-[#00FFD1]/10 transition-all duration-300"
                >
                  <span className="text-white/60 group-hover:text-[#00FFD1] text-sm font-medium">
                    {link.name[0]}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-semibold mb-6">Navigation</h4>
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/50 hover:text-white transition-colors flex items-center gap-2 group"
                  >
                    {link.name}
                    <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:hello@tactix.ai"
                  className="text-white/50 hover:text-white transition-colors flex items-center gap-3"
                >
                  <Mail size={18} />
                  gdg320@gmail.com
                </a>
              </li>
              <li>
                <span className="text-white/50 flex items-center gap-3">
                  <MapPin size={18} />
                  Hyderabad, Telangana
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © 2025 Tactix. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
