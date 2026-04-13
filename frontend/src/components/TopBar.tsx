import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Clock, Globe, Shield, Radio, Activity } from 'lucide-react'

export default function TopBar() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="h-16 px-6 glass border-b border-white/5 flex items-center justify-between z-40 shrink-0">
      <div className="flex items-center gap-8">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-primary tracking-wider uppercase">TACTIX INTEL</span>
          <span className="text-[10px] text-muted-foreground flex items-center gap-1">
            <Radio className="w-2.5 h-2.5 text-green-500 animate-pulse" />
            REAL-TIME DATA FEED | V0.1
          </span>
        </div>
        
        {/* Cluster Stats */}
        <div className="flex items-center gap-6 border-l border-white/10 pl-6 h-8">
          <div className="flex flex-col">
             <span className="text-[10px] uppercase text-muted-foreground tracking-tighter">Conflict</span>
             <span className="text-xs font-mono font-bold text-red-500">24 ACTIVE</span>
          </div>
          <div className="flex flex-col">
             <span className="text-[10px] uppercase text-muted-foreground tracking-tighter">Economic</span>
             <span className="text-xs font-mono font-bold text-green-500">STABLE</span>
          </div>
          <div className="flex flex-col">
             <span className="text-[10px] uppercase text-muted-foreground tracking-tighter">Signals</span>
             <span className="text-xs font-mono font-bold text-blue-500">1400/h</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 h-full">
         {/* Live Time/Date Display */}
         <div className="flex flex-col items-end gap-0.5 border-r border-white/10 pr-6 mr-2">
            <span className="text-sm font-mono font-bold tabular-nums">
               {format(time, 'HH:mm:ss')}
            </span>
            <span className="text-[10px] uppercase text-muted-foreground font-mono tracking-widest leading-none">
               {format(time, 'EEE, MMM dd yyyy')} | UTC+5.5
            </span>
         </div>
         
         <div className="flex items-center gap-3">
             <div className="w-9 h-9 rounded-xl glass hover:bg-white/5 flex items-center justify-center transition-all cursor-pointer">
                <Shield className="w-4 h-4 text-primary" />
             </div>
             <div className="w-9 h-9 rounded-xl glass hover:bg-white/5 flex items-center justify-center transition-all cursor-pointer">
                <Globe className="w-4 h-4 text-primary" />
             </div>
         </div>
      </div>
    </div>
  )
}
