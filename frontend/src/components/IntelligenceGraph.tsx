import React, { useLayoutEffect, useRef, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle,
  Activity,
  TrendingDown,
  Zap,
  Globe,
  ShieldAlert,
  ShieldCheck,
  Shield,
  Layers,
  Cpu,
  BarChart3,
  ExternalLink,
  Info,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Search,
  Filter,
  ArrowRight,
  GitCommit,
  Flame,
  Scale,
  X,
  FileText
} from 'lucide-react'

/* ─── Types ─────────────────────────────────────────────────────────────────── */
export interface IntelSource {
  title: string
  url: string
  publishedAt?: string
  relevance?: 'DIRECT' | 'SUPPORTING' | 'CONTEXTUAL' | string
  quote?: string
}

export interface IntelProvenance {
  contributingAgents?: string[]
  reasoningChain?: string
  sources?: IntelSource[]
}

export interface IntelMetric {
  name: string
  value: number | string
  dataType?: 'REAL_FACT' | 'COMPUTED' | 'MODEL_PREDICTION' | 'LLM_SYNTHESIS' | string
  confidence?: number
  method?: string
}

export interface IntelNode {
  id: string
  label: string
  description: string
  type: 'SIGNAL' | 'DEPENDENCY' | 'IMPACT' | 'PREDICTION'
  category: 'CALAMITY' | 'STOCK' | 'GEOPOLITICAL' | 'GENERIC' | string
  threatLevel: 'CRITICAL' | 'ELEVATED' | 'MODERATE' | 'LOW'
  dataType?: 'REAL_FACT' | 'COMPUTED' | 'MODEL_PREDICTION' | 'LLM_SYNTHESIS' | string
  consensusStatus?: 'QUORUM_VERIFIED' | 'SINGLE_SOURCE' | 'CONTESTED' | string
  provenance?: IntelProvenance
  metrics?: IntelMetric[]
}

export interface IntelEdge {
  from: string
  to: string
  relationship: string
  correlationScore: number
  causalMechanism?: string
}

export interface IntelGraphData {
  nodes: IntelNode[]
  edges: IntelEdge[]
  headline: string
  tensionPoints?: string[]
}

/* ─── Design tokens & Theme Utilities ────────────────────────────────────────── */
const THREAT: Record<string, { color: string; border: string; bg: string; glow: string; badgeBg: string }> = {
  CRITICAL: {
    color: '#ef4444',
    border: 'rgba(239,68,68,0.45)',
    bg: 'rgba(239,68,68,0.06)',
    glow: 'rgba(239,68,68,0.25)',
    badgeBg: 'rgba(239,68,68,0.18)'
  },
  ELEVATED: {
    color: '#f97316',
    border: 'rgba(249,115,22,0.45)',
    bg: 'rgba(249,115,22,0.06)',
    glow: 'rgba(249,115,22,0.25)',
    badgeBg: 'rgba(249,115,22,0.18)'
  },
  MODERATE: {
    color: '#eab308',
    border: 'rgba(234,179,8,0.45)',
    bg: 'rgba(234,179,8,0.06)',
    glow: 'rgba(234,179,8,0.25)',
    badgeBg: 'rgba(234,179,8,0.18)'
  },
  LOW: {
    color: '#10b981',
    border: 'rgba(16,185,129,0.45)',
    bg: 'rgba(16,185,129,0.06)',
    glow: 'rgba(16,185,129,0.25)',
    badgeBg: 'rgba(16,185,129,0.18)'
  }
}

const TYPE_CONFIG: Record<string, { color: string; label: string; icon: React.FC<any> }> = {
  SIGNAL:     { color: '#ef4444', label: 'Primary Trigger', icon: AlertTriangle },
  DEPENDENCY: { color: '#f97316', label: 'Vulnerability Vector', icon: Activity },
  IMPACT:     { color: '#eab308', label: 'Cascade Impact', icon: TrendingDown },
  PREDICTION: { color: '#818cf8', label: 'Future Projection', icon: Zap }
}

const LAYER_ORDER = ['SIGNAL', 'DEPENDENCY', 'IMPACT', 'PREDICTION'] as const

/* Layout dimensional constants */
const CARD_W = 280
const CARD_H = 150
const H_GAP = 55
const V_GAP = 220
const PAD_TOP = 80
const PAD_SIDE = 60

/* ─── Sub-Components ─────────────────────────────────────────────────────────── */

function ConsensusBadge({ status }: { status?: string }) {
  if (!status) return null
  if (status === 'QUORUM_VERIFIED') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
        <ShieldCheck className="w-2.5 h-2.5" />
        Quorum
      </span>
    )
  }
  if (status === 'CONTESTED') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
        <AlertTriangle className="w-2.5 h-2.5" />
        Contested
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider uppercase bg-blue-500/10 text-blue-400 border border-blue-500/30">
      <GitCommit className="w-2.5 h-2.5" />
      Single-Source
    </span>
  )
}

function DataTypeBadge({ type }: { type?: string }) {
  if (!type) return null
  const isFact = type === 'REAL_FACT'
  const isModel = type === 'MODEL_PREDICTION'
  const isSynth = type === 'LLM_SYNTHESIS'

  return (
    <span
      className={`text-[8px] font-mono uppercase tracking-widest px-1.5 py-0.5 rounded border ${
        isFact
          ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
          : isModel
          ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
          : isSynth
          ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
          : 'bg-white/5 text-white/50 border-white/10'
      }`}
    >
      {type.replace('_', ' ')}
    </span>
  )
}

/* ─── Fullscreen Drawer / Dossier Modal for Selected Intelligence ────────────── */
function IntelligenceDossier({
  node,
  edge,
  onClose,
  allNodes,
  onSelectNode
}: {
  node?: IntelNode | null
  edge?: (IntelEdge & { fromLabel: string; toLabel: string }) | null
  onClose: () => void
  allNodes: IntelNode[]
  onSelectNode: (n: IntelNode) => void
}) {
  if (!node && !edge) return null

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ duration: 0.2 }}
      className="absolute top-0 right-0 bottom-0 w-full sm:w-[480px] bg-[#090a12]/95 backdrop-blur-2xl border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-50 flex flex-col overflow-hidden"
    >
      {/* Dossier Header */}
      <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
            {node ? <FileText className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
          </div>
          <div>
            <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-white/40 block">
              {node ? 'Intelligence Dossier' : 'Causal Correlation Vector'}
            </span>
            <span className="text-xs font-mono font-bold text-white tracking-wide">
              {node ? node.id.toUpperCase() : 'TRANSMISSION LINK'}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Dossier Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar text-white">
        {node && (
          <>
            {/* Status Strip */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="px-2.5 py-1 rounded text-[10px] font-mono font-black uppercase tracking-wider border"
                style={{
                  color: THREAT[node.threatLevel]?.color ?? '#fff',
                  borderColor: THREAT[node.threatLevel]?.border ?? 'rgba(255,255,255,0.2)',
                  background: THREAT[node.threatLevel]?.badgeBg ?? 'rgba(255,255,255,0.05)'
                }}
              >
                {node.threatLevel} THREAT
              </span>
              <ConsensusBadge status={node.consensusStatus} />
              <DataTypeBadge type={node.dataType} />
              <span className="text-[10px] font-mono text-white/40 px-2 py-0.5 rounded bg-white/5 uppercase">
                {node.category}
              </span>
            </div>

            {/* Title & Core Narrative */}
            <div>
              <h3 className="text-base font-bold text-white leading-snug tracking-tight mb-2">
                {node.label}
              </h3>
              <p className="text-xs text-white/70 leading-relaxed font-sans bg-white/[0.02] p-3.5 rounded-xl border border-white/5">
                {node.description}
              </p>
            </div>

            {/* AI Swarm Provenance & Multi-Agent Reasoning */}
            {node.provenance && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-primary font-bold">
                      Swarm Intelligence Provenance
                    </span>
                  </div>
                </div>

                {node.provenance.contributingAgents && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {node.provenance.contributingAgents.map(ag => (
                      <span
                        key={ag}
                        className="px-2 py-0.5 rounded bg-primary/10 border border-primary/25 text-primary text-[10px] font-mono font-medium"
                      >
                        @{ag}
                      </span>
                    ))}
                  </div>
                )}

                {node.provenance.reasoningChain && (
                  <div className="mt-2 pt-2 border-t border-white/5">
                    <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block mb-1">
                      Synthesized Reasoning
                    </span>
                    <p className="text-[11px] text-white/80 leading-relaxed italic bg-black/30 p-2.5 rounded-lg border border-white/5">
                      "{node.provenance.reasoningChain}"
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Ground Truth Sources & Citations */}
            {node.provenance?.sources && node.provenance.sources.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-bold">
                    Ground Truth Sources & Quotes ({node.provenance.sources.length})
                  </span>
                </div>

                <div className="space-y-2.5">
                  {node.provenance.sources.map((src, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all space-y-2 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-semibold text-white group-hover:text-primary transition-colors flex items-center gap-1.5 leading-snug"
                        >
                          {src.title}
                          <ExternalLink className="w-3 h-3 shrink-0 opacity-60 group-hover:opacity-100" />
                        </a>
                      </div>

                      <div className="flex items-center gap-2 text-[9px] font-mono text-white/40">
                        {src.publishedAt && <span>{src.publishedAt}</span>}
                        {src.relevance && (
                          <span className="px-1.5 py-0.2 rounded bg-white/5 text-white/60 uppercase">
                            {src.relevance}
                          </span>
                        )}
                      </div>

                      {src.quote && (
                        <blockquote className="text-[11px] text-white/60 border-l-2 border-primary/50 pl-2.5 py-0.5 leading-relaxed bg-black/20 rounded-r">
                          "{src.quote}"
                        </blockquote>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Intelligence Metrics Matrix */}
            {node.metrics && node.metrics.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">
                    Empirical & Computed Metrics
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {node.metrics.map((m, mi) => (
                    <div
                      key={mi}
                      className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-white/70 font-semibold uppercase">
                          {m.name.replace(/_/g, ' ')}
                        </span>
                        <span className="text-sm font-mono font-black text-amber-400">
                          {typeof m.value === 'number' ? m.value.toLocaleString() : m.value}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[9px] font-mono text-white/40 border-t border-white/5 pt-1.5">
                        <span>{m.method || 'Intelligence Model'}</span>
                        {m.confidence !== undefined && (
                          <span className="text-emerald-400 font-bold">
                            {(m.confidence * 100).toFixed(0)}% confidence
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {edge && (
          <div className="space-y-5">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-white/40 tracking-widest">
                  Correlation Vector
                </span>
                <span className="text-xs font-mono font-bold text-primary">
                  {(edge.correlationScore * 100).toFixed(0)}% STRENGTH
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <div className="flex-1 p-2.5 rounded bg-black/40 border border-white/5">
                  <span className="text-[9px] font-mono text-white/40 block mb-1">Source Node</span>
                  <p className="text-xs font-bold text-white truncate">{edge.fromLabel}</p>
                </div>
                <div className="px-2 py-1 rounded bg-primary/10 border border-primary/30 text-primary text-[10px] font-mono font-bold uppercase">
                  {edge.relationship}
                </div>
                <div className="flex-1 p-2.5 rounded bg-black/40 border border-white/5 text-right">
                  <span className="text-[9px] font-mono text-white/40 block mb-1">Target Impact</span>
                  <p className="text-xs font-bold text-white truncate">{edge.toLabel}</p>
                </div>
              </div>
            </div>

            {edge.causalMechanism && (
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
                  Identified Causal Mechanism
                </span>
                <p className="text-xs text-white/80 leading-relaxed font-sans">
                  {edge.causalMechanism}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ─── SVG Cubic Bezier Edge with Interactive Badge & Flow Particles ─────────── */
function SvgBezierEdge({
  edge,
  x1,
  y1,
  x2,
  y2,
  color,
  isSelected,
  onClick
}: {
  edge: IntelEdge & { fromLabel: string; toLabel: string }
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
  isSelected: boolean
  onClick: () => void
}) {
  const dx = x2 - x1
  const dy = y2 - y1
  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2

  // Smooth vertical cubic Bezier curve control points
  const deltaFactor = Math.min(Math.abs(dy) * 0.5, 120)
  const cpx1 = x1
  const cpy1 = y1 + deltaFactor
  const cpx2 = x2
  const cpy2 = y2 - deltaFactor

  const pathData = `M ${x1} ${y1} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${x2} ${y2}`
  const strokeWidth = Math.max(2, Math.round(edge.correlationScore * 4.5))

  return (
    <g className="group cursor-pointer" onClick={onClick}>
      {/* Invisible wider stroke for easy clicking */}
      <path d={pathData} fill="none" stroke="transparent" strokeWidth={24} />

      {/* Outer Glow */}
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth + 4}
        strokeOpacity={isSelected ? 0.35 : 0.08}
        className="transition-all duration-300 group-hover:stroke-opacity-40"
      />

      {/* Main Visible Path */}
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeOpacity={isSelected ? 0.95 : 0.45}
        strokeDasharray={isSelected ? '6 4' : undefined}
        className="transition-all duration-300 group-hover:stroke-opacity-100"
      />

      {/* Relationship Label Badge */}
      <foreignObject
        x={midX - 70}
        y={midY - 14}
        width={140}
        height={28}
        className="overflow-visible pointer-events-none"
      >
        <div className="flex items-center justify-center w-full h-full">
          <div
            className={`px-2.5 py-0.5 rounded-full border text-[9px] font-mono font-black uppercase tracking-wider backdrop-blur-md shadow-lg transition-all duration-300 ${
              isSelected
                ? 'bg-primary text-black border-primary scale-105'
                : 'bg-[#090a12]/90 border-white/10 text-white/70 group-hover:border-primary/50 group-hover:text-white'
            }`}
          >
            {edge.relationship}
          </div>
        </div>
      </foreignObject>
    </g>
  )
}

/* ─── Main Intelligence Graph Component ─────────────────────────────────────── */
export default function IntelligenceGraph({ data }: { data: IntelGraphData }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [cw, setCw] = useState(1200)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Filters & Selection
  const [selectedThreatFilter, setSelectedThreatFilter] = useState<string>('ALL')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL')
  const [selectedNode, setSelectedNode] = useState<IntelNode | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<(IntelEdge & { fromLabel: string; toLabel: string }) | null>(null)

  const { nodes = [], edges = [], headline = 'Intelligence Cascade Analysis', tensionPoints = [] } = data

  // Watch dimensions
  useLayoutEffect(() => {
    const update = () => {
      if (containerRef.current) setCw(containerRef.current.clientWidth)
    }
    update()
    const ro = new ResizeObserver(update)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  // Filtered Nodes
  const filteredNodes = useMemo(() => {
    return nodes.filter(n => {
      if (selectedThreatFilter !== 'ALL' && n.threatLevel !== selectedThreatFilter) return false
      if (selectedCategoryFilter !== 'ALL' && n.category !== selectedCategoryFilter) return false
      return true
    })
  }, [nodes, selectedThreatFilter, selectedCategoryFilter])

  // Group into hierarchical layers
  const layers = useMemo(() => {
    return LAYER_ORDER.map(type => nodes.filter(n => n.type === type)).filter(l => l.length > 0)
  }, [nodes])

  // Compute Layout coordinates for nodes
  const { posMap, totalHeight, totalWidth } = useMemo(() => {
    const map: Record<string, { x: number; y: number }> = {}
    let maxRowWidth = 0

    layers.forEach((layerNodes, li) => {
      const count = layerNodes.length
      const rowWidth = count * CARD_W + (count - 1) * H_GAP
      if (rowWidth > maxRowWidth) maxRowWidth = rowWidth

      const startX = Math.max(PAD_SIDE, (cw - rowWidth) / 2)
      const y = PAD_TOP + li * (CARD_H + V_GAP)

      layerNodes.forEach((node, ni) => {
        const x = startX + ni * (CARD_W + H_GAP)
        map[node.id] = { x: x + CARD_W / 2, y: y + CARD_H / 2 }
      })
    })

    const computedH = PAD_TOP + layers.length * (CARD_H + V_GAP) + 100
    const computedW = Math.max(cw, maxRowWidth + PAD_SIDE * 2)

    return { posMap: map, totalHeight: computedH, totalWidth: computedW }
  }, [layers, cw])

  const labelMap = useMemo(() => Object.fromEntries(nodes.map(n => [n.id, n.label])), [nodes])

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.interactive-card') || (e.target as HTMLElement).closest('button')) {
      return
    }
    setIsPanning(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    })
  }

  const handleMouseUp = () => setIsPanning(false)

  // Categories list for filter chips
  const categories = useMemo(() => {
    const set = new Set<string>()
    nodes.forEach(n => {
      if (n.category) set.add(n.category)
    })
    return Array.from(set)
  }, [nodes])

  return (
    <div
      className={`w-full flex flex-col gap-4 font-sans transition-all duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 bg-[#05060b] p-6' : 'relative'
      }`}
    >
      {/* ── TOP INTELLIGENCE BRIEFING BANNER ── */}
      <div className="rounded-2xl border border-white/10 bg-[#090b14]/80 backdrop-blur-xl p-6 shadow-2xl relative overflow-hidden">
        {/* Tactical Accent Corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none blur-xl" />
        <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-4xl">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-mono font-black uppercase tracking-[0.2em]">
                <Flame className="w-3 h-3 text-red-400 animate-pulse" />
                Executive Tactical Briefing
              </span>
              <span className="text-white/20 text-xs">|</span>
              <span className="text-[10px] font-mono text-white/50 uppercase tracking-widest">
                {nodes.length} Verified Threat Nodes · {edges.length} Causal Links
              </span>
            </div>

            <h2 className="text-lg md:text-xl font-black text-white leading-tight tracking-tight uppercase">
              {headline}
            </h2>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-4 shrink-0 bg-white/[0.02] border border-white/5 rounded-xl p-3">
            <div className="text-center px-3 border-r border-white/10">
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block">
                Critical Density
              </span>
              <span className="text-lg font-mono font-black text-red-400">
                {nodes.length > 0
                  ? `${Math.round((nodes.filter(n => n.threatLevel === 'CRITICAL').length / nodes.length) * 100)}%`
                  : '0%'}
              </span>
            </div>
            <div className="text-center px-3">
              <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest block">
                Verified Facts
              </span>
              <span className="text-lg font-mono font-black text-cyan-400">
                {nodes.filter(n => n.dataType === 'REAL_FACT').length}
              </span>
            </div>
          </div>
        </div>

        {/* Strategic Tension Points Accordion / Alert Strip */}
        {tensionPoints && tensionPoints.length > 0 && (
          <div className="mt-5 pt-4 border-t border-white/10">
            <div className="flex items-center gap-2 mb-2.5">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 font-bold">
                Strategic Tension Conflicts & Doctrine Paradoxes
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {tensionPoints.map((tp, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 rounded-lg bg-amber-500/[0.04] border border-amber-500/20 text-white/80 text-[11px] leading-relaxed flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <span>{tp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── TOOLBAR & VIEWPORT CONTROLS ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-2">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-white/40 text-[10px] font-mono mr-1">
            <Filter className="w-3 h-3" />
            <span>FILTER:</span>
          </div>

          {/* Threat level filters */}
          {['ALL', 'CRITICAL', 'ELEVATED'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedThreatFilter(lvl)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase transition-all ${
                selectedThreatFilter === lvl
                  ? 'bg-white/20 text-white border border-white/30 shadow-sm'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 border border-transparent'
              }`}
            >
              {lvl}
            </button>
          ))}

          <span className="text-white/20 text-xs mx-1">|</span>

          {/* Category filters */}
          <button
            onClick={() => setSelectedCategoryFilter('ALL')}
            className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase transition-all ${
              selectedCategoryFilter === 'ALL'
                ? 'bg-primary/20 text-primary border border-primary/40'
                : 'bg-white/5 text-white/50 hover:bg-white/10 border border-transparent'
            }`}
          >
            ALL DOMAINS
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase transition-all ${
                selectedCategoryFilter === cat
                  ? 'bg-primary/20 text-primary border border-primary/40'
                  : 'bg-white/5 text-white/50 hover:bg-white/10 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Zoom & Pan Tools */}
        <div className="flex items-center gap-1.5 bg-[#090b14]/80 border border-white/10 rounded-lg p-1">
          <button
            onClick={() => setZoom(z => Math.min(z + 0.15, 1.8))}
            className="p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(z - 0.15, 0.5))}
            className="p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setZoom(1)
              setPan({ x: 0, y: 0 })
            }}
            className="p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ── INTERACTIVE CANVAS VIEWPORT ── */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={`relative w-full rounded-2xl border border-white/10 overflow-hidden select-none cursor-grab active:cursor-grabbing transition-colors ${
          isFullscreen ? 'flex-1' : 'min-h-[820px]'
        }`}
        style={{
          background: 'radial-gradient(circle at 50% 10%, #0d0f1f 0%, #04050a 85%)'
        }}
      >
        {/* Tactical Grid Background Pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {/* Phase / Progression Labels */}
        <div className="absolute top-6 left-6 flex flex-col gap-1 pointer-events-none z-10">
          <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-white/30 font-bold">
            Tactical Causal Hierarchy
          </span>
          <span className="text-[9px] font-mono text-white/20">
            Phase Signal &rarr; Dependency &rarr; Impact &rarr; Prediction
          </span>
        </div>

        {/* Transform Container (Zoom + Pan) */}
        <div
          className="absolute inset-0 transition-transform duration-75 origin-top-left"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            width: totalWidth,
            height: totalHeight
          }}
        >
          {/* SVG Edges Layer */}
          <svg
            className="absolute inset-0 pointer-events-auto"
            style={{ width: totalWidth, height: totalHeight, overflow: 'visible' }}
          >
            {edges.map((edge, i) => {
              const srcPos = posMap[edge.from]
              const tgtPos = posMap[edge.to]
              if (!srcPos || !tgtPos) return null

              const srcNode = nodes.find(n => n.id === edge.from)
              const edgeColor = srcNode ? THREAT[srcNode.threatLevel]?.color ?? '#818cf8' : '#818cf8'
              const isSelected = selectedEdge?.from === edge.from && selectedEdge?.to === edge.to

              return (
                <SvgBezierEdge
                  key={i}
                  edge={{
                    ...edge,
                    fromLabel: labelMap[edge.from] ?? edge.from,
                    toLabel: labelMap[edge.to] ?? edge.to
                  }}
                  x1={srcPos.x}
                  y1={srcPos.y + CARD_H / 2}
                  x2={tgtPos.x}
                  y2={tgtPos.y - CARD_H / 2}
                  color={edgeColor}
                  isSelected={isSelected}
                  onClick={() => {
                    setSelectedEdge({
                      ...edge,
                      fromLabel: labelMap[edge.from] ?? edge.from,
                      toLabel: labelMap[edge.to] ?? edge.to
                    })
                    setSelectedNode(null)
                  }}
                />
              )
            })}
          </svg>

          {/* Interactive HUD Node Cards */}
          {nodes.map(node => {
            const pos = posMap[node.id]
            if (!pos) return null

            const isDimmed = filteredNodes.length < nodes.length && !filteredNodes.some(fn => fn.id === node.id)
            const isSelected = selectedNode?.id === node.id
            const threatStyle = THREAT[node.threatLevel] || THREAT.MODERATE
            const typeInfo = TYPE_CONFIG[node.type] || TYPE_CONFIG.SIGNAL
            const IconComp = typeInfo.icon

            return (
              <div
                key={node.id}
                onClick={() => {
                  setSelectedNode(node)
                  setSelectedEdge(null)
                }}
                className={`interactive-card absolute rounded-xl p-4 transition-all duration-200 cursor-pointer border ${
                  isDimmed ? 'opacity-25 grayscale pointer-events-none' : 'opacity-100 hover:scale-[1.02]'
                } ${
                  isSelected
                    ? 'ring-2 ring-primary border-primary shadow-[0_0_30px_rgba(0,180,255,0.3)] z-30'
                    : 'border-white/10 hover:border-white/25 z-20'
                }`}
                style={{
                  left: pos.x - CARD_W / 2,
                  top: pos.y - CARD_H / 2,
                  width: CARD_W,
                  minHeight: CARD_H,
                  background: 'linear-gradient(180deg, rgba(16, 18, 30, 0.95) 0%, rgba(8, 10, 18, 0.98) 100%)',
                  boxShadow: isSelected
                    ? `0 0 25px ${threatStyle.glow}`
                    : `0 4px 20px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)`
                }}
              >
                {/* Header Strip with Icon, Category & Threat */}
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2 truncate">
                    <div
                      className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 border"
                      style={{
                        background: threatStyle.bg,
                        borderColor: threatStyle.border,
                        color: threatStyle.color
                      }}
                    >
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[9px] font-mono font-black uppercase tracking-wider text-white/50 truncate">
                      {node.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ background: threatStyle.color }}
                    />
                    <span
                      className="text-[9px] font-mono font-bold tracking-wider uppercase"
                      style={{ color: threatStyle.color }}
                    >
                      {node.threatLevel}
                    </span>
                  </div>
                </div>

                {/* Node Main Title */}
                <h4 className="text-xs font-bold text-white leading-snug tracking-tight mb-2 line-clamp-2">
                  {node.label}
                </h4>

                {/* Badges Bar (Consensus & DataType) */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                  <ConsensusBadge status={node.consensusStatus} />
                  <DataTypeBadge type={node.dataType} />
                </div>

                {/* Metrics Preview Pill */}
                {node.metrics && node.metrics.length > 0 && (
                  <div className="bg-white/[0.03] border border-white/5 rounded-lg px-2.5 py-1.5 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-white/40 truncate max-w-[130px]">
                      {node.metrics[0].name.replace(/_/g, ' ')}
                    </span>
                    <span className="font-black text-amber-400">
                      {typeof node.metrics[0].value === 'number'
                        ? node.metrics[0].value.toLocaleString()
                        : node.metrics[0].value}
                    </span>
                  </div>
                )}

                {/* Footer attribution */}
                <div className="mt-2 flex items-center justify-between text-[8px] font-mono text-white/30">
                  <span>{node.type}</span>
                  {node.provenance?.sources?.length ? (
                    <span className="text-cyan-400 font-semibold flex items-center gap-1">
                      <Globe className="w-2.5 h-2.5" />
                      {node.provenance.sources.length} sources
                    </span>
                  ) : (
                    <span>ID: {node.id}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── SLIDE-OUT INTELLIGENCE DOSSIER ── */}
        <AnimatePresence>
          {(selectedNode || selectedEdge) && (
            <IntelligenceDossier
              node={selectedNode}
              edge={selectedEdge}
              onClose={() => {
                setSelectedNode(null)
                setSelectedEdge(null)
              }}
              allNodes={nodes}
              onSelectNode={n => setSelectedNode(n)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
