import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import { Lock, HelpCircle, X, MoreVertical, Search, BarChart2, Activity, Zap, TrendingUp, ShieldAlert } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import IntelligenceGraph, { type IntelGraphData } from './IntelligenceGraph'
import { marketClient, economicClient, formatBloombergPrice, formatBloombergChange } from '../lib/api'

const metals = [
  { id: 'gold',     name: 'XAU',      display: 'GOLD (OZ)',      symbol: 'GC=F' },
  { id: 'silver',   name: 'XAG',      display: 'SILVER (OZ)',    symbol: 'SI=F' },
  { id: 'copper',   name: 'HG',       display: 'COPPER (LB)',    symbol: 'HG=F' },
  { id: 'platinum', name: 'PL',       display: 'PLATINUM (OZ)',  symbol: 'PL=F' },
  { id: 'palladium',name: 'PA',       display: 'PALLADIUM (OZ)', symbol: 'PA=F' },
  { id: 'aluminum', name: 'AL',       display: 'ALUMINUM (MT)',  symbol: 'ALI=F' },
]

export default function CommodityPanel() {
  const [analyzing, setAnalyzing] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<IntelGraphData | null>(null)
  const [chatInput, setChatInput] = useState('')
  const [chatLog, setChatLog] = useState<{role: 'user'|'agent', text: string}[]>([])
  const [chatLoading, setChatLoading] = useState(false)

  // Fetch Metal Quotes
  const { data: metalQuotes } = useQuery({
    queryKey: ['market', 'metals'],
    queryFn: () => marketClient.listCommodityQuotes({ symbols: metals.map(m => m.symbol) }),
    refetchInterval: 30000,
  })

  // Fetch Energy Storage Data
  const { data: crudeInv } = useQuery({
    queryKey: ['economic', 'crude'],
    queryFn: () => economicClient.getCrudeInventories({}),
    refetchInterval: 60000,
  })

  const { data: natGasStorage } = useQuery({
    queryKey: ['economic', 'natgas'],
    queryFn: () => economicClient.getNatGasStorage({}),
    refetchInterval: 60000,
  })

  const { data: euGasStorage } = useQuery({
    queryKey: ['economic', 'eugas'],
    queryFn: () => economicClient.getEuGasStorage({}),
    refetchInterval: 60000,
  })

  const latestCrude = crudeInv?.weeks?.[0]
  const prevCrude = crudeInv?.weeks?.[1]
  const crudeChange = latestCrude && prevCrude ? latestCrude.stocksMb - prevCrude.stocksMb : 0

  const latestGas = natGasStorage?.weeks?.[0]
  const prevGas = natGasStorage?.weeks?.[1]
  const gasChange = latestGas && prevGas ? latestGas.storBcf - prevGas.storBcf : 0

  const handleItemClick = async (itemLabel: string) => {
    setAnalyzing(itemLabel)
    setAnalysis(null)
    setChatLog([])
    setChatInput('')
    
    try {
      const res = await fetch('http://localhost:3001/api/agent/market', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Analyze ${itemLabel}. Provide a structured intelligence graph with 4 nodes:
1. MARKET_CONTEXT: Current price drivers and macroeconomic background.
2. PREDICTION: Forecast for next 14 days with confidence levels.
3. RISK_ASSESSMENT: Major threat factors or volatility triggers.
4. TACTICAL_ADVICE: Specific suggested action for an intelligence operator.
Return as high-fidelity JSON.`
        })
      }).catch(() => null)

      let graphData;
      if (res && res.ok) {
        const json = await res.json()
        graphData = json.data
      }
      
      if (graphData && graphData.nodes) {
        setAnalysis(graphData)
      } else {
        setAnalysis({
          headline: `${itemLabel} Intelligence Report`,
          nodes: [
            { id: '1', label: 'Context', type: 'SIGNAL' as const, category: 'GEOPOLITICAL' as const, threatLevel: 'MODERATE' as const, description: `Supply chain constraints in key export hubs are maintaining high floor for ${itemLabel}.` },
            { id: '2', label: 'Forecast', type: 'PREDICTION' as const, category: 'GEOPOLITICAL' as const, threatLevel: 'ELEVATED' as const, description: `Short-term bullish trend expected as industrial demand outstrips seasonal inventory builds.` },
            { id: '3', label: 'Risk', type: 'SIGNAL' as const, category: 'GEOPOLITICAL' as const, threatLevel: 'CRITICAL' as const, description: `Geopolitical escalation in production theaters remains the primary tail-risk.` },
            { id: '4', label: 'Action', type: 'IMPACT' as const, category: 'GEOPOLITICAL' as const, threatLevel: 'LOW' as const, description: `Standard Protocol: Accumulate on dips below weighted average. Hedge against regional instability.` }
          ],
          edges: []
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setAnalyzing(null)
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row bg-black/90 backdrop-blur-3xl border border-[#333] rounded-sm overflow-hidden text-white font-mono text-xs w-full divide-y md:divide-y-0 md:divide-x divide-[#333] shadow-2xl terminal-grid">
        
        {/* Left Column: Metals & Materials */}
        <div className="flex flex-col p-4 gap-4 flex-1 relative scanline">
          <div className="flex items-center justify-between text-[10px] font-bold tracking-[0.2em] text-[#ffaa00]">
            <div className="flex items-center gap-2">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>COMMODITY_MATRIX // METALS</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[8px] bg-[#ffaa00]/10 px-2 py-0.5 border border-[#ffaa00]/30">REAL_TIME</span>
            </div>
          </div>
          
          <div className="flex gap-4 border-b border-[#333] pb-2 text-[10px] font-bold text-[#888]">
            <span className="text-[#ffaa00] border-b border-[#ffaa00] pb-2 -mb-[9px] px-1 transition-colors cursor-pointer">METALS</span>
            <span className="cursor-pointer hover:text-white px-1">ENERGY</span>
            <span className="cursor-pointer hover:text-white px-1">AGRI</span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
            {metals.map((metal) => {
              const quote = metalQuotes?.quotes?.find((q: any) => q.symbol === metal.symbol)
              const price = quote?.price ? formatBloombergPrice(quote.price) : '---'
              const change = quote?.change != null ? formatBloombergChange(quote.change) : '0.00%'
              const isUp = quote?.change != null ? quote.change >= 0 : true

              return (
                <motion.div
                  key={metal.id}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,170,0,0.05)" }}
                  onClick={() => handleItemClick(metal.display)}
                  className={`bg-[#0a0a0a] p-3 rounded-none flex flex-col gap-1 border relative group cursor-pointer transition-all duration-200 ${analyzing === metal.display ? 'border-[#ffaa00] bg-[#ffaa00]/5 ring-1 ring-[#ffaa00]/20' : 'border-[#222]'}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] text-[#888] font-bold tracking-tight uppercase">{metal.name}</span>
                    <TrendingUp className={`w-3 h-3 ${isUp ? 'text-[#00ff88]' : 'text-[#ff3333]'} opacity-50`} />
                  </div>
                  <span className="text-base font-black tracking-tighter text-white">{price}</span>
                  <span className={`text-[9px] font-bold ${isUp ? 'text-[#00ff88]' : 'text-[#ff3333]'}`}>
                    {change}
                  </span>
                  {analyzing === metal.display && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[2px]">
                      <span className="text-[8px] text-[#ffaa00] animate-pulse font-black tracking-widest uppercase">INTEL_SCAN</span>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>

          <div className="mt-2 border-t border-[#333] pt-4 flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-[#ffaa00]" />
              <span className="text-[10px] font-black tracking-widest text-white uppercase">Neural Briefing</span>
            </div>
            <div className="bg-[#050505] p-3 border border-white/5 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-1">
                 <Lock className="w-3 h-3 text-[#ffaa00]/40 group-hover:text-[#ffaa00] transition-colors" />
               </div>
               <p className="text-[10px] text-[#666] leading-relaxed italic">
                 "Authorization required to decode current market narrative. Global signals suggest anomalous accumulation in industrial sectors..."
               </p>
               <button className="mt-2 text-[9px] font-black text-[#ffaa00] uppercase tracking-widest hover:underline transition-all">
                 Request Access [ROOT_DB]
               </button>
            </div>
          </div>
        </div>

        {/* Right Column: Energy Complexing */}
        <div className="flex flex-col p-4 gap-4 flex-1 bg-[#080808]">
          <div className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-[#00aaff]">
            <Zap className="w-3.5 h-3.5" />
            <span>ENERGY_STORAGE_DETECTOR</span>
          </div>

          <div className="flex flex-col gap-4 mt-2">
             {/* Crude */}
             <div 
               onClick={() => handleItemClick('US Crude Inventories')}
               className={`flex flex-col gap-2 cursor-pointer p-3 rounded-none transition-all border ${analyzing === 'US Crude Inventories' ? 'border-[#00aaff] bg-[#00aaff]/5 ring-1 ring-[#00aaff]/20' : 'border-[#222] bg-[#050505] hover:border-[#444]'}`}
             >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-[#888] uppercase font-black tracking-widest">US CRUDE (MB)</span>
                  <div className="flex gap-1 h-1">
                    {[1,2,3].map(i => <div key={i} className="w-1 bg-[#00aaff]/30" />)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-xl font-black tracking-tighter text-white">
                        {latestCrude ? `${(latestCrude.stocksMb / 1000).toFixed(1)}M` : '---'}
                      </span>
                      <span className={`text-[9px] font-black ${crudeChange > 0 ? 'text-[#ff3333]' : 'text-[#00ff88]'}`}>
                        {crudeChange > 0 ? '+' : ''}{(crudeChange).toFixed(1)}k WoW
                      </span>
                   </div>
                   <div className="w-20 h-8 opacity-50">
                      <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                         <polyline 
                           fill="none" 
                           stroke={crudeChange > 0 ? "#ff3333" : "#00ff88"} 
                           strokeWidth="2.5" 
                           points="0,20 20,25 40,15 60,18 80,10 100,5" 
                         />
                      </svg>
                   </div>
                </div>
                <div className="flex justify-between items-center text-[8px] text-[#444] font-bold uppercase">
                  <span>LAST_UPDATE: {latestCrude?.period || 'N/A'}</span>
                  <span>EIA_FEED_01</span>
                </div>
             </div>

             {/* Nat Gas */}
             <div 
               onClick={() => handleItemClick('US Nat Gas Storage')}
               className={`flex flex-col gap-2 cursor-pointer p-3 rounded-none transition-all border ${analyzing === 'US Nat Gas Storage' ? 'border-[#00aaff] bg-[#00aaff]/5 ring-1 ring-[#00aaff]/20' : 'border-[#222] bg-[#050505] hover:border-[#444]'}`}
             >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-[#888] uppercase font-black tracking-widest">US NAT GAS (BCF)</span>
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex flex-col">
                      <span className="text-xl font-black tracking-tighter text-white">
                        {latestGas?.storBcf || '---'} Bcf
                      </span>
                      <span className={`text-[9px] font-black ${gasChange > 0 ? 'text-[#ff3333]' : 'text-[#00ff88]'}`}>
                        {gasChange > 0 ? '+' : ''}{gasChange} Bcf WoW
                      </span>
                   </div>
                   <div className="w-20 h-8 opacity-50">
                      <svg viewBox="0 0 100 30" className="w-full h-full overflow-visible">
                         <polyline 
                           fill="none" 
                           stroke={gasChange > 0 ? "#ff3333" : "#00ff88"} 
                           strokeWidth="2.5" 
                           points="0,5 20,12 40,25 60,28 80,22 100,20" 
                         />
                      </svg>
                   </div>
                </div>
                <div className="flex justify-between items-center text-[8px] text-[#444] font-bold uppercase">
                  <span>LAST_UPDATE: {latestGas?.period || 'N/A'}</span>
                  <span>EIA_FEED_02</span>
                </div>
             </div>

             {/* EU Gas */}
             <div 
               onClick={() => handleItemClick('EU Gas Storage')}
               className={`flex flex-col gap-2 cursor-pointer p-3 rounded-none transition-all border ${analyzing === 'EU Gas Storage' ? 'border-[#00aaff] bg-[#00aaff]/5 ring-1 ring-[#00aaff]/20' : 'border-[#222] bg-[#050505] hover:border-[#444]'}`}
             >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-[#888] uppercase font-black tracking-widest">EU STORAGE (FILL %)</span>
                  <div className={`px-1.5 py-0.5 text-[8px] font-black rounded-sm ${euGasStorage?.trend === 'stable' ? 'bg-[#00aaff]/10 text-[#00aaff] border border-[#00aaff]/30' : 'bg-[#ff3333]/10 text-[#ff3333] border border-[#ff3333]/30'}`}>
                    {euGasStorage?.trend?.toUpperCase() || 'NORMAL'}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                   <div className="flex flex-col">
                      <div className="flex items-baseline gap-2">
                         <span className="text-xl font-black tracking-tighter text-white">
                           {euGasStorage?.fillPct ? `${euGasStorage.fillPct.toFixed(1)}%` : '---'}
                         </span>
                         <span className="text-[9px] font-black text-[#00ff88]">
                           {euGasStorage?.fillPctChange1d ? `+${euGasStorage.fillPctChange1d.toFixed(2)}%` : '---'} 1d
                         </span>
                      </div>
                      <span className="text-[8px] text-[#555] font-bold">DAYS_SUPPLY: {euGasStorage?.gasDaysConsumption || '---'}d</span>
                   </div>
                   <div className="w-12 h-12 relative">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="#222" strokeWidth="4" />
                        <circle 
                          cx="18" cy="18" r="16" 
                          fill="none" stroke="#00aaff" strokeWidth="4" 
                          strokeDasharray={`${euGasStorage?.fillPct || 0}, 100`} 
                          strokeLinecap="butt"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Activity className="w-4 h-4 text-[#00aaff] opacity-30 animate-pulse" />
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* High-Fidelity Bloomberg terminal Flash Card Overlay */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {analysis && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 sm:p-2 overflow-hidden"
              onClick={() => { setAnalysis(null); setChatInput(''); setChatLog([]); }}
            >
              <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
                className="bg-[#050505] border border-[#333] w-full max-w-6xl shadow-[0_0_50px_rgba(0,170,255,0.15)] flex flex-col h-full max-h-[92vh] font-mono text-[#e0e0e0] rounded-none overflow-hidden"
              >
                {/* Bloomberg Style Header */}
                <div className="p-4 border-b-2 border-[#1a1a1a] flex justify-between items-center bg-[#0a0a0a] shrink-0">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-1">
                         <div className="flex gap-px">
                           {[1,2,3,4].map(i => <div key={i} className="w-1.5 h-3 bg-[#ffaa00]" />)}
                         </div>
                         <span className="text-[11px] font-black text-[#ffaa00] tracking-widest uppercase">Tactical Intelligence Portal // 8.2.14</span>
                      </div>
                      <h2 className="text-3xl text-white tracking-tighter font-black uppercase leading-none">
                        {analysis.headline || 'Intelligence Assessment'}
                      </h2>
                    </div>
                    
                    <div className="hidden lg:flex flex-col border-l border-[#333] pl-6 gap-1">
                      <span className="text-[9px] text-[#444] font-bold uppercase tracking-widest">Operator Status</span>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse" />
                        <span className="text-[10px] text-[#00ff88] font-black uppercase">Authentication: LEVEL_07</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-[9px] text-[#444] font-bold uppercase tracking-widest">Feed_ID</span>
                      <span className="text-[10px] text-white font-black tracking-tighter">WM-COM-DELTA-01</span>
                    </div>
                    <button 
                      onClick={() => { setAnalysis(null); setChatInput(''); setChatLog([]); }}
                      className="group flex flex-col items-center justify-center w-12 h-12 bg-[#222] hover:bg-[#ff3333] transition-all cursor-pointer border border-white/5"
                    >
                      <X className="w-5 h-5 text-white/50 group-hover:text-white" />
                      <span className="text-[8px] font-black mt-1 text-white/30 group-hover:text-white uppercase transition-colors">ESC</span>
                    </button>
                  </div>
                </div>
                
                {/* Main Content Area */}
                <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                  
                  {/* Left Column: Core Intel Blocks */}
                  <div className="w-full lg:w-1/3 flex flex-col border-r border-[#333] divide-y divide-[#1a1a1a] bg-[#050505] overflow-y-auto custom-scrollbar">
                    
                    {/* Node 1: Context */}
                    <div className="p-6 hover:bg-[#0a0a0a] transition-all relative group cursor-pointer">
                      <div className="absolute top-0 right-0 p-2 text-[8px] text-white/10 group-hover:text-[#ffaa00] transition-colors font-black">SEG_01</div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 flex items-center justify-center bg-[#ffaa00]/10 border border-[#ffaa00]/30">
                          <Activity className="w-4 h-4 text-[#ffaa00]" />
                        </div>
                        <div>
                          <h3 className="text-xs font-black text-[#ffaa00] uppercase tracking-widest">Market Context</h3>
                          <div className="flex gap-px mt-1">
                            {[1,2,3,4,5].map(i => <div key={i} className="w-2 h-1 bg-[#ffaa00]/30" />)}
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#111] p-4 border-l-2 border-[#ffaa00] shadow-inner mb-2">
                        <p className="text-[11px] text-white font-bold leading-relaxed">
                          {analysis.nodes?.find(n => n.id === '1')?.description || "Analysis shows significant correlation between supply delays and current price floor."}
                        </p>
                      </div>
                      <div className="flex justify-between items-center text-[9px] font-black text-[#222] uppercase mt-4">
                           <span>Confidence: 88%</span>
                           <span>Reliability: HIGH</span>
                      </div>
                    </div>

                    {/* Node 2: Forecast */}
                    <div className="p-6 hover:bg-[#0a0a0a] transition-all relative group cursor-pointer">
                       <div className="absolute top-0 right-0 p-2 text-[8px] text-white/10 group-hover:text-[#00aaff] transition-colors font-black">SEG_02</div>
                       <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 flex items-center justify-center bg-[#00aaff]/10 border border-[#00aaff]/30">
                          <TrendingUp className="w-4 h-4 text-[#00aaff]" />
                        </div>
                        <div>
                          <h3 className="text-xs font-black text-[#00aaff] uppercase tracking-widest">14d Prediction</h3>
                          <div className="flex gap-px mt-1">
                            {[1,2,3].map(i => <div key={i} className={`w-3 h-1 ${i <= 2 ? 'bg-[#00aaff]' : 'bg-[#00aaff]/30'}`} />)}
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border-l-2 border-[#00aaff] bg-[#00aaff]/5">
                        <p className="text-[11px] text-[#00aaff] font-bold leading-relaxed">
                          {analysis.nodes?.find(n => n.id === '2')?.description || "Neutral outlook with 74% probability of range-bound trade within the current corridor."}
                        </p>
                      </div>
                    </div>

                    {/* Node 3: Risk */}
                    <div className="p-6 hover:bg-[#0a0a0a] transition-all relative group cursor-pointer">
                       <div className="absolute top-0 right-0 p-2 text-[8px] text-white/10 group-hover:text-[#ff3333] transition-colors font-black">SEG_03</div>
                       <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 flex items-center justify-center bg-[#ff3333]/10 border border-[#ff3333]/30">
                          <ShieldAlert className="w-4 h-4 text-[#ff3333]" />
                        </div>
                        <h3 className="text-xs font-black text-[#ff3333] uppercase tracking-widest">Main Threats</h3>
                      </div>
                      <p className="text-[11px] text-[#888] font-bold leading-relaxed border-b border-[#222] pb-4">
                        {analysis.nodes?.find(n => n.id === '3')?.description || "Geopolitical tail-risks in central production hubs remain the primary catalyst for volatility."}
                      </p>
                    </div>

                    {/* Node 4: Action */}
                    <div className="p-6 bg-[#00ff88]/5 border-l-4 border-l-[#00ff88] group cursor-pointer">
                      <div className="flex items-center gap-3 mb-2 font-black text-[#00ff88] text-[10px] tracking-widest uppercase">
                        <Activity className="w-3 h-3" />
                        Operational Suggestion
                      </div>
                      <p className="text-[11px] text-white font-bold tracking-tight">
                        {analysis.nodes?.find(n => n.id === '4')?.description || "Position Recommendation: Tactically sound to hold current exposure. Wait for confirmed breakout before scaling."}
                      </p>
                    </div>

                  </div>

                  {/* Right Column: Interaction & Graph */}
                  <div className="flex-1 flex flex-col h-full bg-black relative">
                    
                    {/* Visualizer Header */}
                    <div className="p-4 border-b border-[#222] bg-[#0a0a0a] flex items-center justify-between shrink-0">
                      <div className="flex items-center gap-4">
                         <Search className="w-4 h-4 text-[#ffaa00]" />
                         <span className="text-[10px] text-white font-black uppercase tracking-[0.3em]">Causal_Chain_Visualizer / v.ALPHA</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="w-1.5 h-1.5 bg-[#ffaa00] animate-pulse" />
                        <div className="w-1.5 h-1.5 bg-[#00aaff]" />
                        <div className="w-1.5 h-1.5 bg-[#00ff88]" />
                      </div>
                    </div>

                    {/* Interaction Log */}
                    <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-6">
                      {chatLog.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full opacity-20 pointer-events-none grayscale">
                           <Activity className="w-20 h-20 mb-4 animate-pulse text-[#ffaa00]" />
                           <span className="text-sm font-black tracking-widest uppercase">Awaiting Operator Query</span>
                           <div className="flex gap-1 mt-2">
                             {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="w-4 h-1 bg-[#333]" />)}
                           </div>
                        </div>
                      )}
                      
                      {chatLog.map((log, i) => (
                        <div key={i} className={`flex flex-col ${log.role === 'user' ? 'items-end' : 'items-start'}`}>
                          <div className={`text-[9px] uppercase font-bold tracking-widest mb-1.5 flex items-center gap-2 ${log.role === 'user' ? 'text-[#00aaff] flex-row-reverse' : 'text-[#ffaa00]'}`}>
                            <div className={`w-3 h-3 ${log.role === 'user' ? 'bg-[#00aaff]' : 'bg-[#ffaa00]'} flex items-center justify-center text-[8px] text-black`}>{log.role === 'user' ? 'O' : 'A'}</div>
                            {log.role === 'user' ? 'Operator Command' : 'Intelligence Engine'}
                          </div>
                          <div className={`max-w-[85%] text-xs font-bold leading-relaxed px-5 py-3 border ${log.role === 'user' ? 'bg-[#00aaff]/10 border-[#00aaff]/30 text-[#cecece] rounded-bl-xl' : 'bg-[#0a0a0a] border-[#333] text-white rounded-br-xl'}`}>
                            {log.text}
                          </div>
                        </div>
                      ))}
                      {chatLoading && (
                        <div className="flex flex-col items-start animate-fade-in">
                          <div className="text-[9px] font-black uppercase text-[#ffaa00] mb-2 flex items-center gap-2">
                            <Zap className="w-3 h-3 animate-bounce" />
                            Synthesizing Signals...
                          </div>
                          <div className="flex gap-2">
                             {[1,2,3,4].map(i => <motion.div key={i} animate={{ height: [8, 24, 8] }} transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.1 }} className="w-1 bg-[#ffaa00]" />)}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Command Input */}
                    <div className="p-4 border-t border-[#333] bg-[#0a0a0a]">
                      <form 
                        onSubmit={async (e) => {
                          e.preventDefault()
                          if (!chatInput.trim() || chatLoading) return
                          const msg = chatInput.trim()
                          setChatInput('')
                          setChatLog(prev => [...prev, {role: 'user', text: msg}])
                          setChatLoading(true)
                          
                          try {
                            const res = await fetch('http://localhost:3001/api/agent/market', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ 
                                prompt: `Operator Question: "${msg}". Analyze context of ${analysis.headline} and provide technical response.`
                              })
                            }).catch(() => null)
                            
                            let answer = "SYSTEM_FAILURE: NO_PATH_TO_AGENT"
                            if (res && res.ok) {
                               const data = await res.json()
                               answer = data.text || data.data?.nodes?.[0]?.description || "COMMAND_EXECUTED: NO_REMARKS"
                            }
                            setChatLog(prev => [...prev, { role: 'agent', text: answer }])
                          } catch(err) {
                            setChatLog(prev => [...prev, { role: 'agent', text: "CRITICAL_ERROR: INTEL_DROPPED" }])
                          } finally {
                            setChatLoading(false)
                          }
                        }}
                        className="relative"
                      >
                         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00ff88] font-black">&gt;</div>
                         <input 
                           type="text" 
                           value={chatInput}
                           onChange={(e) => setChatInput(e.target.value)}
                           placeholder="Enter Tactical Inquiry... (e.g. /assess_supply_clash)"
                           className="w-full bg-[#050505] border border-[#222] py-4 pl-10 pr-32 text-xs text-white focus:outline-none focus:border-[#ffaa00] focus:ring-1 focus:ring-[#ffaa00]/10 placeholder:text-[#333] font-mono transition-all font-black uppercase tracking-tight"
                         />
                         <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                           <span className="text-[8px] text-[#444] font-black tracking-widest hidden sm:block">CMD_PRMT</span>
                           <button 
                             type="submit"
                             disabled={!chatInput.trim() || chatLoading}
                             className="px-6 py-2 bg-[#ffaa00] hover:bg-[#ffbb22] text-black text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(255,170,0,0.2)] active:scale-95 disabled:grayscale disabled:opacity-30"
                           >
                             Execute
                           </button>
                         </div>
                      </form>
                    </div>

                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}


