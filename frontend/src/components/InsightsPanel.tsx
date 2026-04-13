import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Sparkles, Brain, Zap, Terminal, Activity, Ghost } from 'lucide-react'

const findings = [
  { id: 1, type: 'critical', agent: 'Market-Nexus', msg: 'Anomalous volatility detected in Nickel futures (3.2σ)', time: '2m ago' },
  { id: 2, type: 'info', agent: 'Nature-Sentinel', msg: 'Ongoing low-pressure front destabilizing supply chains in S. China', time: '12m ago' },
  { id: 3, type: 'warning', agent: 'Shadow-Nexus', msg: 'Large-scale network congestion identified in Central Africa', time: '1h ago' },
]

export default function InsightsPanel() {
  const [activeAgent, setActiveAgent] = useState('Nexus')
  
  const agents = [
    { id: 'Nexus', icon: Brain, color: 'text-primary' },
    { id: 'Shadow', icon: Ghost, color: 'text-purple-500' },
    { id: 'Nature', icon: Sparkles, color: 'text-green-500' },
    { id: 'Market', icon: Zap, color: 'text-blue-500' },
  ]

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center gap-1.5 p-1 rounded-2xl glass-darker border border-white/5 shadow-2xl relative shrink-0">
        <div className="absolute inset-x-0 bottom-0 h-[1.5px] bg-primary/20 blur shadow-lg translate-y-[2px]" />
        {agents.map((agent) => (
          <button 
            key={agent.id}
            onClick={() => setActiveAgent(agent.id)}
            className={`flex-1 flex items-center justify-center p-3 rounded-xl transition-all relative z-10 group overflow-hidden ${
              activeAgent === agent.id ? 'bg-white/10 shadow-inner' : 'hover:bg-white/5 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all'
            }`}
          >
             <agent.icon className={`w-4 h-4 ${agent.color}`} />
             {activeAgent === agent.id && (
               <motion.div layoutId="agent-bg" className="absolute inset-0 bg-primary/5 -z-10" />
             )}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col min-h-0 bg-black/20 rounded-2xl p-4 border border-white/5 overflow-hidden">
         <div className="flex items-center justify-between mb-4 px-1 shrink-0">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest leading-none text-muted-foreground">{activeAgent} INTEL FEED</span>
              <span className="text-[11px] font-bold text-white tracking-wide">Live Stream Analysis</span>
            </div>
            <div className="w-5 h-5 rounded hover:bg-white/5 transition-colors flex items-center justify-center cursor-pointer">
               <Terminal className="w-3 h-3 text-muted-foreground" />
            </div>
         </div>
         
         <div className="flex-1 overflow-y-auto space-y-4 pr-1 scroll-smooth">
            <AnimatePresence mode="popLayout">
               {findings.map((f) => (
                 <motion.div 
                   key={f.id}
                   initial={{ opacity: 0, x: 20 }}
                   animate={{ opacity: 1, x: 0 }}
                   exit={{ opacity: 0, x: -20 }}
                   className="p-4 rounded-2xl glass relative overflow-hidden group border border-white/5 shadow-xl hover:shadow-2xl transition-all"
                 >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      f.type === 'critical' ? 'bg-red-500' : f.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    
                    <div className="flex items-center justify-between mb-2">
                       <div className="flex items-center gap-2">
                          <Activity className="w-3 h-3 text-muted-foreground opacity-50" />
                          <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">{f.agent}</span>
                       </div>
                       <span className="text-[9px] font-mono text-muted-foreground opacity-50 uppercase tracking-tighter">{f.time}</span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed tracking-tight text-foreground/90 group-hover:text-foreground transition-colors pr-2">
                       {f.msg}
                    </p>
                    
                    <div className="mt-3 pt-3 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between">
                       <span className="text-[10px] text-primary/50 font-bold hover:text-primary cursor-pointer transition-colors uppercase tracking-widest">DRILL-DOWN</span>
                       <div className="flex gap-1.5 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                          <div className="w-4 h-4 rounded border border-white/10 flex items-center justify-center text-[10px] font-black leading-none bg-white/5">Q</div>
                          <div className="w-4 h-4 rounded border border-white/10 flex items-center justify-center text-[10px] font-black leading-none bg-white/5">I</div>
                       </div>
                    </div>
                 </motion.div>
               ))}
            </AnimatePresence>
         </div>
      </div>
      
      <div className="h-10 glass-darker rounded-2xl flex items-center justify-between px-4 shrink-0 border border-white/5">
         <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,1)] animate-ping" />
            Active Synthesis
         </span>
         <span className="text-[10px] font-bold text-primary tracking-tighter">THREAD COUNT: 14</span>
      </div>
    </div>
  )
}
