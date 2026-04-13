import React, { Component, ErrorInfo, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDashboardStore } from './hooks/use-dashboard-store'
import Sidebar from './components/Sidebar'
import MapView from './components/MapView'
import ControlPanel from './components/ControlPanel'
import RightPanels from './components/RightPanels'
import TopBar from './components/TopBar'
import NodeExplorer from './components/NodeExplorer'
import CommodityPanel from './components/CommodityPanel'
import InsightsPanel from './components/InsightsPanel'
import { Search, BarChart2, TrendingUp, Activity, Anchor, MessageSquare, Send, Zap, AlertCircle, Shield, Box } from 'lucide-react'
import IntelligenceGraph, { type IntelGraphData } from './components/IntelligenceGraph'

// ─── Error Boundary ─────────────────────────────────────────────────────────
class MapErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: string }> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[MapErrorBoundary]', error, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#050508] text-muted-foreground gap-3">
          <div className="text-4xl">🌐</div>
          <p className="text-sm font-semibold">Map failed to load</p>
          <p className="text-xs opacity-50 max-w-xs text-center">{this.state.error}</p>
          <button
            className="mt-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs transition-colors"
            onClick={() => this.setState({ hasError: false, error: '' })}
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// ─── Page: Dashboard (default) ───────────────────────────────────────────────
function DashboardPage() {
  const { setActivePage, setPendingQuery } = useDashboardStore()
  const [searchVal, setSearchVal] = React.useState('')

  const handleAIClick = () => {
    const topic = searchVal.trim()
    if (topic) {
      setPendingQuery(topic)
      setActivePage('nexus-query')
    } else {
      // Navigate with no pre-filled query
      setActivePage('nexus-query')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAIClick()
  }

  return (
    <div className="relative flex-1 flex">
      {/* Main Map */}
      <div className="flex-1 relative overflow-hidden bg-[#050508]">
        <MapErrorBoundary>
          <MapView />
        </MapErrorBoundary>

        {/* Search Bar Overlay */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[min(90%,580px)] z-40">
          <div className="glass-darker p-2 rounded-3xl flex items-center gap-4 backdrop-blur-3xl border border-white/10 shadow-2xl group transition-all hover:scale-[1.01] duration-300">
            <div className="pl-4">
              <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            </div>
            <input
              id="dashboard-search-input"
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a topic or ask intelligence agent…"
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground py-2 font-medium tracking-tight h-10"
              onFocus={(e) => (e.target.placeholder = '')}
              onBlur={(e) => (e.target.placeholder = 'Type a topic or ask intelligence agent…')}
            />
            <div className="flex items-center gap-2 pr-2">
              <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded bg-white/10 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                <span className="text-xs">⌘</span>K
              </kbd>
              <motion.button
                id="dashboard-ai-btn"
                onClick={handleAIClick}
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(var(--primary), 0.5)' }}
                className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-black shadow-lg transition-all cursor-pointer select-none"
                title="Analyse with AI"
              >
                <span className="text-[10px]">AI</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-24 left-8 z-30">
          <div className="glass p-3 rounded-2xl border border-white/5 flex flex-col gap-2 scale-90 origin-top-left group">
            <div className="flex items-center gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Conflict Warning</span>
            </div>
            <div className="flex items-center gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Resource Alert</span>
            </div>
            <div className="flex items-center gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Stable Zone</span>
            </div>
          </div>
        </div>

        {/* Control panel + node explorer anchored inside the map panel */}
        <ControlPanel />
        <NodeExplorer />
      </div>

      {/* Right Side Panels */}
      <RightPanels />
    </div>
  )
}

// ─── Page: Real-time Map (fullscreen map + controls) ────────────────────────
function MapPage() {
  return (
    <div className="flex-1 relative overflow-hidden bg-[#050508]">
      <MapErrorBoundary>
        <MapView />
      </MapErrorBoundary>
      <ControlPanel />

      {/* Search */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 w-[min(90%,540px)] z-40">
        <div className="glass-darker p-2 rounded-3xl flex items-center gap-4 backdrop-blur-3xl border border-white/10 shadow-2xl">
          <div className="pl-4"><Search className="w-5 h-5 text-muted-foreground" /></div>
          <input
            placeholder="Search location or event..."
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground py-2 font-medium h-10"
          />
        </div>
      </div>
    </div>
  )
}

// ─── Page: Natural Calamities ──────────────────────────────────────────────────
const NATURE_PROMPTS = [
  'Analyze the impact of recent wildfires in California',
  'Global effects of the Pacific Tsunami',
  'Impact of Hurricane season on global supply chains',
  'Monitor drought conditions in European agricultural zones'
]

function CommoditiesPage() {
  const [analyzing, setAnalyzing] = React.useState(false)
  const [analysis, setAnalysis]   = React.useState<IntelGraphData | null>(null)

  const handlePromptClick = async (promptText: string) => {
    setAnalyzing(true)
    setAnalysis(null)
    
    try {
      const res = await fetch('http://localhost:3001/api/agent/nature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      })

      if (!res.ok) throw new Error('Nature agent offline')
      const json = await res.json()
      
      const graphData = json.data
      if (graphData && graphData.nodes) {
        setAnalysis(graphData)
      } else {
        throw new Error('No intelligence generated')
      }
    } catch (err: any) {
      console.error(err)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col p-8 bg-background relative overflow-y-auto">
      <div className="max-w-4xl mx-auto space-y-6 w-full">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
            <Box className="w-6 h-6 text-primary" />
            Natural Calamities
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Monitor global natural events and weather anomalies</p>
        </div>
        
        <div className="grid gap-4">
          {NATURE_PROMPTS.map((promptText, idx) => (
             <motion.button
               key={idx}
               whileHover={{ scale: 1.02 }}
               whileTap={{ scale: 0.98 }}
               disabled={analyzing}
               onClick={() => handlePromptClick(promptText)}
               className="glass rounded-2xl p-4 border border-white/5 hover:border-primary/20 text-left flex justify-between items-center group transition-all"
             >
               <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground">{promptText}</span>
               <Zap className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
             </motion.button>
          ))}
        </div>

        {analyzing && (
           <div className="glass rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center gap-4 animate-pulse">
             <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
             <span className="text-xs uppercase tracking-widest text-muted-foreground font-black">Analyzing Nature Intelligence...</span>
           </div>
        )}
      </div>

      {/* Nature Agent Overlay */}
      <AnimatePresence>
        {analysis && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setAnalysis(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#0c0c14] border border-primary/20 w-full max-w-6xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[90vh]"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-start bg-gradient-to-br from-primary/10 to-transparent shrink-0">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Box className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Nature Intelligence Report</span>
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">{analysis.headline || 'Natural Calamity Analysis'}</h2>
                </div>
                <button 
                  onClick={() => setAnalysis(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Search className="w-5 h-5 rotate-45 text-muted-foreground" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                <IntelligenceGraph data={analysis} />
              </div>
              
              <div className="p-6 bg-black/40 border-t border-white/5 flex justify-between items-center shrink-0">
                <button 
                  onClick={() => setAnalysis(null)}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg ml-auto"
                >
                  Acknowledge Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Page: Market Indices ────────────────────────────────────────────────────
const INDEX_DATA = [
  { name: 'S&P 500',   value: '5,233.40', change: '+0.74%', up: true },
  { name: 'NASDAQ',    value: '16,428.82', change: '+1.12%', up: true },
  { name: 'Dow Jones', value: '38,996.39', change: '+0.31%', up: true },
  { name: 'FTSE 100',  value: '7,952.62', change: '-0.18%', up: false },
  { name: 'DAX',       value: '17,932.76', change: '+0.55%', up: true },
  { name: 'Nikkei 225',value: '38,487.90', change: '-0.29%', up: false },
  { name: 'Shanghai',  value: '3,077.11', change: '+0.44%', up: true },
  { name: 'Hang Seng', value: '17,201.27', change: '-0.62%', up: false },
]

function IndicesPage() {
  const [analyzing, setAnalyzing] = React.useState(false)
  const [analysis, setAnalysis]   = React.useState<IntelGraphData | null>(null)

  const handleMarketClick = async (context?: string) => {
    setAnalyzing(true)
    setAnalysis(null)
    
    try {
      const res = await fetch('http://localhost:3001/api/agent/market', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: context 
            ? `Analyze global market volatility trends focusing on ${context}. Evaluate correlation between indices and current macro threats.`
            : "Analyze the current global market volatility and risk correlation across major indices."
        })
      })

      if (!res.ok) throw new Error('Market agent offline')
      const json = await res.json()
      if (json.data && json.data.nodes) {
        setAnalysis(json.data)
      } else {
        throw new Error('No intelligence generated')
      }
    } catch (err: any) {
      console.error(err)
    } finally {
      setAnalyzing(false)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background relative">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
              <BarChart2 className="w-6 h-6 text-primary" />
              Market Indices
            </h1>
            <p className="text-muted-foreground text-sm mt-1">Live global market performance</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleMarketClick()}
            disabled={analyzing}
            className={`px-5 py-2 rounded-2xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
              analyzing 
                ? 'bg-primary/20 text-primary border border-primary/30' 
                : 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
            }`}
          >
            <Activity className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
            {analyzing ? 'Synthesizing...' : 'Perform Market Synthesis'}
          </motion.button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {INDEX_DATA.map(idx => (
            <motion.div
              key={idx.name}
              whileHover={{ scale: 1.03, y: -2 }}
              onClick={() => handleMarketClick(idx.name)}
              className="glass rounded-2xl p-4 border border-white/5 shadow-xl flex flex-col gap-2 cursor-pointer transition-all hover:border-primary/20"
            >
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{idx.name}</span>
                <TrendingUp className="w-3 h-3 text-white/10 group-hover:text-primary transition-colors" />
              </div>
              <span className="text-lg font-mono font-black tabular-nums">{idx.value}</span>
              <span className={`text-sm font-bold ${idx.up ? 'text-green-500' : 'text-red-500'} flex items-center gap-1`}>
                {idx.up ? <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> : <div className="w-1.5 h-1.5 rounded-full bg-red-500" />}
                {idx.change}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Volatility chart placeholder */}
        <div className="glass rounded-3xl p-6 border border-white/5 shadow-2xl">
          <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-4">Volatility Index (VIX)</h2>
          <div className="h-32 flex items-end gap-1">
            {Array.from({ length: 60 }).map((_, i) => {
              const h = Math.abs(Math.sin(i * 0.4 + 1) * 40 + Math.random() * 30 + 20)
              return (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm transition-all hover:opacity-100 opacity-60"
                  style={{ height: `${h}%`, backgroundColor: h > 60 ? '#ef4444' : h > 40 ? '#f97316' : '#3b82f6' }}
                />
              )
            })}
          </div>
        </div>
      </div>

      {/* Market Agent Overlay */}
      <AnimatePresence>
        {analysis && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setAnalysis(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#0c0c14] border border-primary/20 w-full max-w-6xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[90vh]"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-start bg-gradient-to-br from-primary/10 to-transparent shrink-0">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart2 className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Market Intelligence Report</span>
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">{analysis.headline || 'Market Volatility Analysis'}</h2>
                </div>
                <button 
                  onClick={() => setAnalysis(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Search className="w-5 h-5 rotate-45 text-muted-foreground" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                <IntelligenceGraph data={analysis} />
              </div>
              
              <div className="p-6 bg-black/40 border-t border-white/5 flex justify-between items-center shrink-0">
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Model Precision</span>
                    <span className="text-xs font-bold text-blue-500">MARKET-SENTINEL V1.2</span>
                  </div>
                </div>
                <button 
                  onClick={() => setAnalysis(null)}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                >
                  Acknowledge Report
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


// ─── Page: Nexus ─────────────────────────────────────────────────────────────
const NEXUS_NODES = [
  { id: 'n1', label: 'Eurasian Gas Pipeline', type: 'Infrastructure', status: 'warning', lat: 50.0, lng: 40.0, detail: 'Pressure drop in Sector 7G' },
  { id: 'n2', label: 'Pacific Logistics Hub', type: 'Supply Chain', status: 'active', lat: 35.0, lng: 135.0, detail: 'Normal operations' },
  { id: 'n3', label: 'Copper Smelter Alpha', type: 'Production', status: 'critical', lat: -20.0, lng: 30.0, detail: 'Shutdown: energy surge' },
  { id: 'n4', label: 'North Sea Oil Field', type: 'Energy', status: 'active', lat: 57.0, lng: 2.0, detail: 'Output +4.2% WoW' },
  { id: 'n5', label: 'Suez Canal Gateway', type: 'Maritime', status: 'warning', lat: 30.5, lng: 32.3, detail: 'Disruption risk elevated' },
  { id: 'n6', label: 'Taiwan Semiconductor', type: 'Tech', status: 'active', lat: 24.0, lng: 121.0, detail: 'Full capacity production' },
]

const STATUS_COLOR = { active: 'bg-green-500', warning: 'bg-amber-500', critical: 'bg-red-500' }

function NexusPage() {
  const [analyzing, setAnalyzing] = React.useState<string | null>(null)
  const [analysis, setAnalysis]   = React.useState<IntelGraphData | null>(null)
  const [selectedNodeName, setSelectedNodeName] = React.useState('')

  const handleNodeClick = async (node: (typeof NEXUS_NODES)[0]) => {
    setAnalyzing(node.id)
    setAnalysis(null)
    setSelectedNodeName(node.label)
    
    try {
      const res = await fetch('http://localhost:3001/api/agent/shadow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Analyze the immediate volatility of ${node.label} following ${node.detail}. Evaluate global market implications and shadow risks.`
        })
      })

      if (!res.ok) throw new Error('Agent offline')
      const json = await res.json()
      
      // The user provided the structure: { data: { nodes, edges, headline } }
      const graphData = json.data
      
      if (graphData && graphData.nodes) {
        setAnalysis(graphData)
      } else {
        throw new Error('No graph data returned')
      }
    } catch (err: any) {
      console.error(err)
      // Fallback or error state?
    } finally {
      setAnalyzing(null)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-background relative">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
            <Anchor className="w-6 h-6 text-primary" />
            Nexus Node Matrix
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Global infrastructure and supply-chain intelligence</p>
        </div>

        <div className="grid gap-4">
          {NEXUS_NODES.map(node => (
            <motion.div
              key={node.id}
              whileHover={{ scale: 1.01, x: 4 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleNodeClick(node)}
              className={`glass rounded-2xl p-4 border transition-all duration-300 shadow-xl flex items-center gap-5 cursor-pointer group ${
                analyzing === node.id ? 'border-primary shadow-[0_0_20px_rgba(var(--primary),0.3)] ring-1 ring-primary/50' : 'border-white/5'
              }`}
            >
              <div className={`w-3 h-3 rounded-full shrink-0 ${STATUS_COLOR[node.status as keyof typeof STATUS_COLOR]} shadow-lg ${analyzing === node.id ? 'animate-ping' : ''}`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-bold text-sm tracking-tight">{node.label}</span>
                  <span className="text-[9px] font-black uppercase text-muted-foreground bg-white/10 px-2 py-0.5 rounded-full tracking-wider">{node.type}</span>
                  {analyzing === node.id && (
                    <motion.span 
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      className="text-[9px] font-bold text-primary animate-pulse ml-auto"
                    >
                      SHADOW LINK ACTIVE...
                    </motion.span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{node.detail}</p>
              </div>
              <div className="text-right shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">
                <Shield className={`w-4 h-4 ${analyzing === node.id ? 'text-primary' : 'text-muted-foreground'}`} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="glass rounded-2xl p-4 border border-white/5 flex justify-between items-center bg-white/[0.02]">
          <span className="text-xs text-muted-foreground font-mono uppercase tracking-widest">Total Mapped Nodes</span>
          <span className="text-xl font-black text-primary tabular-nums tracking-tighter">4,821</span>
        </div>
      </div>

      {/* Shadow Analysis Overlay */}
      <AnimatePresence>
        {analysis && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setAnalysis(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="bg-[#0c0c14] border border-primary/20 w-full max-w-6xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[90vh]"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-start bg-gradient-to-br from-primary/10 to-transparent shrink-0">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Shield className="w-5 h-5 text-primary" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Shadow Intelligence Graph</span>
                  </div>
                  <h2 className="text-2xl font-black tracking-tight">{analysis.headline || selectedNodeName}</h2>
                </div>
                <button 
                  onClick={() => setAnalysis(null)}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <Search className="w-5 h-5 rotate-45 text-muted-foreground" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                <IntelligenceGraph data={analysis} />
              </div>
              
              <div className="p-6 bg-black/40 border-t border-white/5 flex justify-between items-center shrink-0">
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Confidence</span>
                    <span className="text-xs font-bold text-green-500">OPTIMAL (94.2%)</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] text-muted-foreground uppercase font-black tracking-widest">Latency</span>
                    <span className="text-xs font-bold transition-all">0.14s</span>
                  </div>
                </div>
                <button 
                  onClick={() => setAnalysis(null)}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
                >
                  Acknowledge
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Page: Nexus Query ───────────────────────────────────────────────────────
const QUICK_PROMPTS = [
  'Impact of 7.2 earthquake on semiconductor supply chains',
  'Global oil price shock from Strait of Hormuz blockade',
  'NATO cyber-attack on Russian energy grid escalation',
  'Rare earth mineral shortage effect on EV markets',
]

type ChatMsg =
  | { role: 'user'; text: string }
  | { role: 'agent'; text: string; graph?: IntelGraphData }
  | { role: 'error'; text: string }

function NexusQueryPage() {
  const { pendingQuery, setPendingQuery } = useDashboardStore()
  const [query, setQuery]     = React.useState('')
  const [messages, setMessages] = React.useState<ChatMsg[]>([
    { role: 'agent', text: 'Nexus Intelligence Interface online. I synthesise threats across Market, Nature, Shadow, and Geopolitical domains. Type a topic and I will generate an interactive intelligence graph.' }
  ])
  const [loading, setLoading] = React.useState(false)
  const bottomRef             = React.useRef<HTMLDivElement>(null)

  // Auto-fire if the dashboard AI button sent a query
  React.useEffect(() => {
    if (pendingQuery) {
      const topic = pendingQuery
      setPendingQuery(null)
      handleSend(topic)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async (topic?: string) => {
    const userMsg = (topic ?? query).trim()
    if (!userMsg) return
    setQuery('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)

    try {
      const res = await fetch('http://localhost:3001/api/workflow/intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: userMsg }),
      })

      if (!res.ok) throw new Error(`Server responded with ${res.status}`)

      const json = await res.json()
      // API wraps graph inside { status, message, data: { nodes, edges, headline } }
      const data: IntelGraphData = json?.data ?? json

      if (!data?.nodes || !data?.edges) {
        throw new Error('Unexpected response shape from intelligence API')
      }

      setMessages(prev => [
        ...prev,
        { role: 'agent', text: data.headline ?? 'Intelligence graph generated.', graph: data },
      ])

    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        { role: 'error', text: err?.message ?? 'Failed to reach the intelligence endpoint.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col px-6 py-4 bg-background max-h-full overflow-hidden">
      <div className="w-full flex flex-col flex-1 min-h-0 gap-4">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-primary" />
            Nexus Intelligence
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Multi-agent synthesis · real-time threat graph generation</p>
        </div>

        {/* Quick prompts */}
        <div className="flex flex-wrap gap-2">
          {QUICK_PROMPTS.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSend(p)}
              disabled={loading}
              className="text-[10px] px-3 py-1.5 glass rounded-full border border-white/10 hover:bg-white/10 transition-colors text-muted-foreground hover:text-foreground font-medium disabled:opacity-30"
            >
              {p.slice(0, 45)}…
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-5 min-h-0 pr-1">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {msg.role === 'user' && (
                  <div className="max-w-[70%] rounded-2xl px-4 py-3 text-sm bg-primary text-primary-foreground font-medium">
                    {msg.text}
                  </div>
                )}

                {msg.role === 'error' && (
                  <div className="glass border border-red-500/30 rounded-2xl px-4 py-3 flex items-start gap-3 max-w-[80%]">
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-red-400 mb-1">Error</p>
                      <p className="text-xs text-muted-foreground">{msg.text}</p>
                    </div>
                  </div>
                )}

                {msg.role === 'agent' && (
                  <div className="w-full">
                    <div className="glass border border-white/10 rounded-2xl px-4 py-3 mb-3">
                      <div className="flex items-center gap-2 mb-1.5 opacity-60">
                        <Zap className="w-3 h-3" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Nexus Agent</span>
                      </div>
                      <p className="text-xs text-foreground/80 leading-relaxed">{msg.text}</p>
                    </div>
                    {msg.graph && <IntelligenceGraph data={msg.graph} />}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="glass border border-white/10 rounded-2xl px-5 py-4 flex items-center gap-3">
                <div className="flex gap-1">
                  {[0,1,2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/70 animate-bounce" style={{ animationDelay: `${i*0.15}s` }} />
                  ))}
                </div>
                <span className="text-[11px] text-muted-foreground font-mono uppercase tracking-widest">Synthesising intelligence graph…</span>
              </div>
            </motion.div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="glass-darker rounded-2xl border border-white/10 flex items-center gap-3 px-4 py-3 shadow-2xl">
          <input
            id="nexus-query-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && handleSend()}
            placeholder="Enter a topic to analyse (e.g. Taiwan earthquake impact on chips)…"
            className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground font-medium"
            disabled={loading}
          />
          <button
            id="nexus-send-btn"
            onClick={() => handleSend()}
            disabled={!query.trim() || loading}
            className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground hover:opacity-90 disabled:opacity-30 transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  )
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
  const { activePage } = useDashboardStore()

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':   return <DashboardPage />
      case 'map':         return <MapPage />
      case 'commodities': return <CommoditiesPage />
      case 'indices':     return <IndicesPage />
      case 'nexus':       return <NexusPage />
      case 'nexus-query': return <NexusQueryPage />
      default:            return <DashboardPage />
    }
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background text-foreground select-none font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col relative h-full min-w-0">
        <TopBar />

        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.18 }}
            className="flex-1 flex flex-col min-h-0"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global border vignette */}
      <div className="fixed inset-0 pointer-events-none border border-white/5 z-[9999]" />
    </div>
  )
}
