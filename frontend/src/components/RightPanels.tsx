import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Video, Box, Shield, ChevronRight, ChevronLeft, Layout, Activity } from 'lucide-react'
import YouTubeStream from './YouTubeStream'
import CommodityPanel from './CommodityPanel'
import InsightsPanel from './InsightsPanel'

export default function RightPanels() {
  const [isOpen, setIsOpen] = React.useState(true)
  const [activeTab, setActiveTab] = React.useState<'OSINT' | 'EQUITIES'>('EQUITIES')

  return (
    <div className="relative h-full flex shrink-0 z-40">
      {/* Pane Toggle Button */}
      <div className="absolute -left-6 top-1/2 -translate-y-1/2 z-[60] pointer-events-auto">
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
          width: isOpen ? 620 : 0,
          opacity: isOpen ? 1 : 0,
          x: isOpen ? 0 : 20
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={`relative h-full bg-[#08080c] border-l border-white/10 flex flex-col shadow-2xl overflow-hidden ${!isOpen ? 'pointer-events-none' : 'pointer-events-auto'}`}
      >
        {/* Top Segmented Header & Tab Bar */}
        <div className="shrink-0 p-4 border-b border-white/10 bg-black/60 backdrop-blur-md flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-[11px] font-black uppercase text-white tracking-[0.2em]">Live Tactical Intelligence</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded border border-emerald-500/20 bg-emerald-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[8px] font-black text-emerald-400 tracking-widest uppercase">FEEDS_ONLINE</span>
            </div>
          </div>

          {/* Clean Switchable Tab Buttons (2 Categories) */}
          <div className="grid grid-cols-2 gap-2 bg-[#0a0a12] p-1 rounded-lg border border-white/5 font-mono text-[10px]">
            <button
              onClick={() => setActiveTab('OSINT')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md font-black tracking-widest uppercase transition-all ${
                activeTab === 'OSINT'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-lg'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>OSINT Live Feeds</span>
            </button>

            <button
              onClick={() => setActiveTab('EQUITIES')}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-md font-black tracking-widest uppercase transition-all ${
                activeTab === 'EQUITIES'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-lg'
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>India Equities (NSE / BSE)</span>
            </button>
          </div>
        </div>

        {/* Tab Body */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeTab === 'OSINT' && (
              <motion.div
                key="osint-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-black uppercase text-white tracking-widest">Global OSINT Reconnaissance Feeds</span>
                  <span className="text-[9px] font-bold text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded">4 CHANNELS LIVE</span>
                </div>
                <div className="bg-black/60 rounded-xl overflow-hidden border border-white/10 p-2 shadow-2xl">
                  <YouTubeStream />
                </div>
              </motion.div>
            )}

            {activeTab === 'EQUITIES' && (
              <motion.div
                key="equities-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between px-1">
                  <span className="text-[10px] font-black uppercase text-white tracking-widest">Indian Equities Matrix & Indices (INR)</span>
                  <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">REAL-TIME TICKER</span>
                </div>
                <div className="bg-[#0c0c14] shadow-2xl rounded-xl border border-white/10 p-3">
                  <CommodityPanel />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
