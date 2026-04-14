import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Box, Activity, Share2, CornerRightDown } from 'lucide-react'

export interface Node {
   id: string
   label: string
   type: string
   status: 'active' | 'warning' | 'critical'
   details: string
}

const mockNodes: Node[] = [
   { id: '1', label: 'Eurasian Gas Pipeline', type: 'Infrastructure', status: 'warning', details: 'Pressure drop detected in Sector 7G' },
   { id: '2', label: 'Pacific Logistics Hub', type: 'Supply Chain', status: 'active', details: 'Normal operations sustained' },
   { id: '3', label: 'Copper Smelter Alpha', type: 'Production', status: 'critical', details: 'Shutdown initiated due to energy surge' },
]

export default function NodeExplorer() {
   return (
      <div className="absolute bottom-8 right-4 w-72 glass-darker p-4 rounded-3xl border border-white/5 z-30 shadow-2xl backdrop-blur-3xl">
         <div className="flex items-center justify-between mb-4 scale-95 opacity-80">
            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2">
               <Share2 className="w-3 h-3" />
               Nexus Node Matrix
            </span>
            <span className="text-[10px] font-bold text-primary group hover:opacity-100 transition-opacity cursor-pointer">FULL VIEW</span>
         </div>

         <div className="space-y-3">
            {mockNodes.map((node) => (
               <div
                  key={node.id}
                  className="group relative p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-white/5 cursor-pointer"
               >
                  <div className="flex items-center justify-between mb-1">
                     <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${node.status === 'active' ? 'bg-green-500' : node.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'
                           }`} />
                        <span className="text-xs font-bold leading-none">{node.label}</span>
                     </div>
                     <span className="text-[8px] font-black uppercase text-muted-foreground bg-white/10 px-1.5 py-0.5 rounded tracking-tighter">
                        {node.type}
                     </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground line-clamp-1 group-hover:line-clamp-none transition-all pr-4">
                     {node.details}
                  </p>

                  <div className="absolute right-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity">
                     <CornerRightDown className="w-3 h-3 text-primary animate-bounce" />
                  </div>
               </div>
            ))}
         </div>

         <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between opacity-50">
            <span className="text-[9px] font-mono tracking-tighter text-muted-foreground uppercase leading-none">TOTAL MAPPED NODES</span>
            <span className="text-[10px] font-black text-primary tabular-nums">4,821</span>
         </div>
      </div>
   )
}
