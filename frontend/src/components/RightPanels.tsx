import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Video, Box, Shield, ChevronRight, ChevronLeft, Layout, Activity } from 'lucide-react'
import YouTubeStream from './YouTubeStream'
import CommodityPanel from './CommodityPanel'
import InsightsPanel from './InsightsPanel'

export default function RightPanels() {
  const [isOpen, setIsOpen] = React.useState(true)

  return (
    <div className="relative h-full flex shrink-0 z-40">
      {/* Pane Toggle Button - Positioned absolutely outside the motion div */}
      <div 
        className="absolute -left-6 top-1/2 -translate-y-1/2 z-[60] pointer-events-auto"
      >
        <motion.button 
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1, x: -2 }}
          whileTap={{ scale: 0.9 }}
          className={`w-8 h-16 flex flex-col items-center justify-center rounded-l-xl border border-r-0 border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-300 ${
            isOpen 
              ? 'bg-black/80 hover:bg-black text-muted-foreground hover:text-primary' 
              : 'bg-primary hover:bg-primary/80 text-primary-foreground translate-x-6 rounded-r-xl border-l-0'
          }`}
          title={isOpen ? "Close Panels" : "Open Intelligence Panels"}
        >
          {isOpen ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          <div className="mt-1 h-4 w-[2px] bg-current opacity-20 rounded-full" />
        </motion.button>
      </div>

      <motion.div 
        initial={false}
        animate={{ 
          width: isOpen ? 600 : 0,
          opacity: isOpen ? 1 : 0,
          x: isOpen ? 0 : 20
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`relative h-full bg-[#08080c] border-l border-white/10 flex flex-col shadow-2xl overflow-hidden ${!isOpen ? 'pointer-events-none' : 'pointer-events-auto'}`}
      >
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 flex flex-col scrollbar-thin scrollbar-thumb-white/10 scroll-smooth max-h-screen custom-scrollbar">
          {/* Header Section */}
          <div className="mb-2 shrink-0 border-b border-white/5 pb-4">
             <div className="flex items-center gap-2 mb-1">
               <Activity className="w-4 h-4 text-primary" />
               <span className="text-[11px] font-black uppercase text-white tracking-[0.2em]">Live Tactical Intelligence</span>
             </div>
             <p className="text-[9px] text-muted-foreground uppercase font-mono tracking-widest">Sector: Global Commodity & Social Monitoring</p>
          </div>

           {/* Youtube Stream Panel */}
           <div className="space-y-4 shrink-0">
              <div className="flex items-center justify-between px-1">
                 <div className="flex items-center gap-2">
                   <div className="relative">
                    <Video className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                    <div className="absolute inset-0 bg-red-500 blur-sm opacity-50 animate-pulse" />
                   </div>
                   <span className="text-[10px] font-black uppercase text-white tracking-widest">Global OSINT Stream</span>
                 </div>
                 <div className="flex items-center gap-1.5">
                   <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                   <span className="text-[9px] font-bold text-red-500 border border-red-500/30 px-2 py-0.5 rounded-sm bg-red-500/10 tracking-tighter">SIGINT LIVE</span>
                 </div>
              </div>
              <div className="bg-black/40 rounded-xl overflow-hidden border border-white/10 relative group shadow-2xl" style={{ minHeight: '230px' }}>
                 <YouTubeStream />
                 <div className="absolute inset-0 border border-white/5 pointer-events-none group-hover:border-primary/20 transition-colors" />
              </div>
           </div>

           {/* Metals & Materials Panel */}
           <div className="shrink-0 space-y-4">
              <div className="flex items-center justify-between px-1">
                 <div className="flex items-center gap-2">
                   <Box className="w-3.5 h-3.5 text-amber-500" />
                   <span className="text-[10px] font-black uppercase text-white tracking-widest">Hard Assets Matrix (INR)</span>
                 </div>
                 <span className="text-[9px] font-mono text-muted-foreground">REAL-TIME FEED</span>
              </div>
              <div className="bg-[#0c0c14] shadow-2xl rounded-xl border border-white/10 p-5 group hover:border-primary/30 transition-all duration-500">
                 <CommodityPanel />
              </div>
           </div>

           {/* AI Agents Insights Panel */}
           <div className="shrink-0 pb-16 space-y-4">
              <div className="flex items-center justify-between px-1">
                 <div className="flex items-center gap-2">
                   <Shield className="w-3.5 h-3.5 text-blue-500" />
                   <span className="text-[10px] font-black uppercase text-white tracking-widest">Neural Analysis Stream</span>
                 </div>
                 <div className="px-2 py-0.5 bg-blue-500/10 rounded border border-blue-500/20">
                   <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">Agent Active</span>
                 </div>
              </div>
              <div className="bg-black/50 rounded-xl border border-white/10 p-5 min-h-[400px] shadow-2xl group hover:border-primary/30 transition-all duration-500 backdrop-blur-md">
                 <InsightsPanel />
              </div>
           </div>
        </div>
      </motion.div>
    </div>
  )
}
