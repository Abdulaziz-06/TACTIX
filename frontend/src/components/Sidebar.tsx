import React from 'react'
import { motion } from 'framer-motion'
import { LayoutDashboard, Map as MapIcon, Box, BarChart2, MessageSquare, Anchor, Shield, ChevronLeft, ChevronRight, Cpu, Activity, Zap, Globe } from 'lucide-react'
import { useDashboardStore, ActivePage } from '../hooks/use-dashboard-store'

const NAV_ITEMS: { id: ActivePage; icon: React.ElementType; label: string }[] = [
  { id: 'dashboard',    icon: LayoutDashboard, label: 'OVERVIEW' },
  { id: 'map',          icon: Globe,          label: 'GEO-INT MAP' },
  { id: 'commodities',  icon: Box,              label: 'NAT-CALAMITIES' },
  { id: 'indices',      icon: BarChart2,        label: 'MARKET MATRIX' },
  { id: 'nexus',        icon: Anchor,           label: 'NEXUS NODE' },
  { id: 'nexus-query',  icon: MessageSquare,    label: 'AI-QUERY' },
]

export default function Sidebar() {
  const { isSidebarOpen, toggleSidebar, activePage, setActivePage } = useDashboardStore()

  return (
    <motion.aside
      initial={false}
      animate={{ width: isSidebarOpen ? 260 : 80 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="h-screen bg-[#050508] border-r border-white/10 relative z-50 flex flex-col pt-8 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.5)] overflow-hidden"
    >
      {/* Brand Logo Section */}
      <div className="flex items-center px-5 mb-10 gap-4 overflow-hidden group cursor-pointer" onClick={() => setActivePage('dashboard')}>
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-sm bg-primary flex items-center justify-center relative overflow-hidden shadow-[0_0_15px_rgba(var(--primary),0.4)]">
            {/* Tactical Logo SVG */}
            <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-primary-foreground stroke-[2.5]" stroke="currentColor">
              <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" fill="currentColor" fillOpacity="0.2" />
              <path d="M12 22V12M12 12L21 7M12 12L3 7" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="3" fill="currentColor" />
            </svg>
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-white/10 pointer-events-none" />
          </div>
          <div className="absolute -inset-1 bg-primary/20 blur-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse" />
        </div>
        
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <span className="font-black text-xl tracking-[0.15em] text-white leading-none">TACTIX</span>
            <span className="text-[8px] font-black text-primary tracking-[0.4em] mt-1 opacity-80 uppercase">Strategic Intel</span>
          </motion.div>
        )}
      </div>

      {/* Navigation Section */}
      <nav className="flex-1 px-4 space-y-2 overflow-hidden">
        <div className="mb-4 px-2">
            <span className={`text-[9px] font-black text-muted-foreground/40 tracking-[0.2em] uppercase ${!isSidebarOpen && 'hidden'}`}>Strategic Commands</span>
        </div>
        
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id
          return (
            <motion.button
              key={item.id}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActivePage(item.id)}
              className={`w-full flex items-center gap-4 p-3.5 rounded-sm cursor-pointer transition-all duration-300 group text-left relative ${
                isActive
                  ? 'bg-primary/10 text-primary border-l-2 border-primary'
                  : 'hover:bg-white/5 text-muted-foreground hover:text-white border-l-2 border-transparent'
              }`}
            >
              <item.icon className={`w-5 h-5 shrink-0 transition-transform ${isActive ? 'scale-110 shadow-[0_0_10px_currentColor]' : 'group-hover:scale-110'}`} />
              
              {isSidebarOpen && (
                <span className={`text-[11px] font-black tracking-[0.1em] transition-all whitespace-nowrap ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>
                    {item.label}
                </span>
              )}

              {isActive && (
                <div className="absolute right-3 w-1 h-1 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.8)] animate-pulse" />
              )}
            </motion.button>
          )
        })}
      </nav>

      {/* System Status Section (Replacing User Info) */}
      <div className="p-4 mx-4 mb-8 bg-black/40 border border-white/5 rounded-sm overflow-hidden flex flex-col gap-3">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-2">
              <Zap className="w-3 h-3 text-amber-500" />
              <span className={`text-[9px] font-black text-white/60 tracking-widest uppercase ${!isSidebarOpen && 'hidden'}`}>System Status</span>
           </div>
           <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-pulse" />
        </div>
        
        {isSidebarOpen && (
            <div className="space-y-2">
                <div className="flex justify-between items-center text-[8px] font-mono opacity-40 uppercase tracking-tighter">
                    <span>Neural Load</span>
                    <span className="text-primary">42%</span>
                </div>
                <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '42%' }} className="h-full bg-primary" />
                </div>
                <div className="flex justify-between items-center text-[8px] font-mono opacity-40 uppercase tracking-tighter">
                    <span>Uptime</span>
                    <span>144:12:09</span>
                </div>
            </div>
        )}
        
        {!isSidebarOpen && (
            <div className="flex flex-col items-center gap-2 opacity-40">
                <Activity className="w-4 h-4" />
            </div>
        )}
      </div>

      {/* Collapse Trigger */}
      <button
        onClick={toggleSidebar}
        className="h-12 hover:bg-white/5 flex items-center justify-center transition-colors border-t border-white/5 group overflow-hidden shrink-0 mt-auto"
      >
        {isSidebarOpen
          ? <div className="flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity"><ChevronLeft className="w-4 h-4 text-primary" /><span className="text-[10px] font-black tracking-[0.2em] uppercase text-white/60">Minimize</span></div>
          : <ChevronRight className="w-5 h-5 text-primary opacity-40 group-hover:opacity-100 transition-all group-hover:scale-110" />}
      </button>
    </motion.aside>
  )
}
