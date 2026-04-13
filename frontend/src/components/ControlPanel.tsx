import React from 'react'
import { motion } from 'framer-motion'
import { Layers, Map as MapIcon, Globe, Wind, Zap, Activity } from 'lucide-react'
import { useDashboardStore } from '../hooks/use-dashboard-store'

export default function ControlPanel() {
  const { mapMode, setMapMode, activeLayers, toggleLayer } = useDashboardStore()

  const layerItems = [
    { id: 'natural_events', icon: Wind, label: 'Natural Events', color: 'text-amber-500' },
    { id: 'conflict_zones', icon: Activity, label: 'Conflict Zones', color: 'text-red-500' },
    { id: 'outages', icon: Zap, label: 'Infrastructure', color: 'text-blue-500' },
  ]

  return (
    <div className="absolute bottom-8 left-8 flex flex-col gap-4 z-30">
      {/* Mode Toggle */}
      <div className="glass p-1.5 rounded-2xl flex items-center gap-1.5 backdrop-blur-3xl shadow-2xl border border-white/5">
        <button 
          onClick={() => setMapMode('3D')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            mapMode === '3D' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-white/5 text-muted-foreground hover:text-foreground'
          }`}
        >
          <Globe className="w-3 h-3" />
          GLOBE 3D
        </button>
        <button 
          onClick={() => setMapMode('2D')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            mapMode === '2D' ? 'bg-primary text-primary-foreground shadow-lg' : 'hover:bg-white/5 text-muted-foreground hover:text-foreground'
          }`}
        >
          <MapIcon className="w-3 h-3" />
          FLAT 2D
        </button>
      </div>

      {/* Layer Toggle */}
      <div className="glass p-3 rounded-3xl flex flex-col gap-2 backdrop-blur-3xl shadow-2xl min-w-[200px] border border-white/5">
         <div className="flex items-center justify-between mb-1 px-1">
            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Active Layers</span>
            <Layers className="w-3 h-3 text-muted-foreground" />
         </div>
         {layerItems.map((layer) => (
           <div 
             key={layer.id}
             onClick={() => toggleLayer(layer.id)}
             className={`flex items-center justify-between p-2 rounded-xl cursor-pointer hover:bg-white/5 transition-all border border-transparent ${
               activeLayers.includes(layer.id) ? 'border-white/5' : ''
             }`}
           >
              <div className="flex items-center gap-3">
                 <div className={`p-1.5 rounded-lg bg-white/5 ${layer.color}`}>
                    <layer.icon className="w-3.5 h-3.5" />
                 </div>
                 <span className="text-xs font-medium">{layer.label}</span>
              </div>
              <div className={`w-2 h-2 rounded-full ${activeLayers.includes(layer.id) ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-white/10'}`} />
           </div>
         ))}
      </div>
    </div>
  )
}
