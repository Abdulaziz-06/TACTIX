import React, { useLayoutEffect, useRef, useState, useMemo, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle,
  Activity,
  TrendingDown,
  Zap,
  Globe,
  ShieldCheck,
  Cpu,
  BarChart3,
  ExternalLink,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Filter,
  GitCommit,
  Flame,
  Scale,
  X,
  FileText,
  Focus,
  Move
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

/* ─── Defense Intel Color & Theme Tokens ─────────────────────────────────────── */
const THREAT: Record<string, { color: string; border: string; bg: string; glow: string; badgeBg: string; text: string }> = {
  CRITICAL: {
    color: '#ef4444',
    border: 'rgba(239, 68, 68, 0.4)',
    bg: 'rgba(239, 68, 68, 0.08)',
    glow: 'rgba(239, 68, 68, 0.25)',
    badgeBg: 'rgba(239, 68, 68, 0.15)',
    text: '#fca5a5'
  },
  ELEVATED: {
    color: '#f97316',
    border: 'rgba(249, 115, 22, 0.4)',
    bg: 'rgba(249, 115, 22, 0.08)',
    glow: 'rgba(249, 115, 22, 0.25)',
    badgeBg: 'rgba(249, 115, 22, 0.15)',
    text: '#fdba74'
  },
  MODERATE: {
    color: '#eab308',
    border: 'rgba(234, 179, 8, 0.35)',
    bg: 'rgba(234, 179, 8, 0.06)',
    glow: 'rgba(234, 179, 8, 0.2)',
    badgeBg: 'rgba(234, 179, 8, 0.15)',
    text: '#fde047'
  },
  LOW: {
    color: '#10b981',
    border: 'rgba(16, 185, 129, 0.35)',
    bg: 'rgba(16, 185, 129, 0.06)',
    glow: 'rgba(16, 185, 129, 0.2)',
    badgeBg: 'rgba(16, 185, 129, 0.15)',
    text: '#6ee7b7'
  }
}

const TYPE_CONFIG: Record<string, { color: string; label: string; icon: React.FC<{ className?: string }> }> = {
  SIGNAL:     { color: '#ef4444', label: 'Primary Trigger', icon: AlertTriangle },
  DEPENDENCY: { color: '#f97316', label: 'Vulnerability Vector', icon: Activity },
  IMPACT:     { color: '#eab308', label: 'Cascade Impact', icon: TrendingDown },
  PREDICTION: { color: '#818cf8', label: 'Future Projection', icon: Zap }
}

const LAYER_ORDER = ['SIGNAL', 'DEPENDENCY', 'IMPACT', 'PREDICTION'] as const

/* Layout dimensional constants */
const CARD_W = 290
const CARD_H = 160
const H_GAP = 60
const V_GAP = 210
const PAD_TOP = 80
const PAD_SIDE = 70

/* ─── Micro Badges ───────────────────────────────────────────────────────────── */

function ConsensusBadge({ status }: { status?: string }) {
  if (!status) return null
  if (status === 'QUORUM_VERIFIED') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-wide bg-emerald-500/10 text-emerald-300 border border-emerald-500/25">
        <ShieldCheck className="w-3 h-3 text-emerald-400" />
        Quorum
      </span>
    )
  }
  if (status === 'CONTESTED') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-wide bg-amber-500/10 text-amber-300 border border-amber-500/25">
        <AlertTriangle className="w-3 h-3 text-amber-400" />
        Contested
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium tracking-wide bg-sky-500/10 text-sky-300 border border-sky-500/25">
      <GitCommit className="w-3 h-3 text-sky-400" />
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
      className={`text-[9px] font-mono tracking-wider px-1.5 py-0.5 rounded border ${
        isFact
          ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/25'
          : isModel
          ? 'bg-purple-500/10 text-purple-300 border-purple-500/25'
          : isSynth
          ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25'
          : 'bg-white/5 text-slate-400 border-white/10'
      }`}
    >
      {type.replace(/_/g, ' ')}
    </span>
  )
}

/* ─── Slide-out Intelligence Dossier Modal ───────────────────────────────────── */
function IntelligenceDossier({
  node,
  edge,
  onClose,
  allNodes: _allNodes,
  onSelectNode: _onSelectNode
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
      initial={{ opacity: 0, x: 60 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="absolute top-0 right-0 bottom-0 w-full sm:w-[480px] bg-[#07090e]/95 backdrop-blur-2xl border-l border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.9)] z-50 flex flex-col overflow-hidden text-slate-200"
    >
      {/* Dossier Header */}
      <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
            {node ? <FileText className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
          </div>
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
              {node ? 'Intelligence Dossier' : 'Causal Vector Correlation'}
            </span>
            <span className="text-xs font-mono font-medium text-white tracking-wide">
              {node ? node.id : 'TRANSMISSION LINK'}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          title="Close dossier (Esc)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Dossier Body */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar text-slate-200">
        {node && (
          <>
            {/* Status Strip */}
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold tracking-wider border"
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
              <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-white/5 uppercase">
                {node.category}
              </span>
            </div>

            {/* Title & Core Narrative */}
            <div>
              <h3 className="text-base font-semibold text-white leading-snug tracking-tight mb-2">
                {node.label}
              </h3>
              <p className="text-xs font-normal text-slate-300 leading-relaxed bg-white/[0.02] p-3.5 rounded-xl border border-white/5">
                {node.description}
              </p>
            </div>

            {/* AI Swarm Provenance & Reasoning */}
            {node.provenance && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-sky-400" />
                    <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-medium">
                      Swarm Intelligence Provenance
                    </span>
                  </div>
                </div>

                {node.provenance.contributingAgents && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {node.provenance.contributingAgents.map(ag => (
                      <span
                        key={ag}
                        className="px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-300 text-[10px] font-mono"
                      >
                        @{ag}
                      </span>
                    ))}
                  </div>
                )}

                {node.provenance.reasoningChain && (
                  <div className="mt-2 pt-2 border-t border-white/5">
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block mb-1">
                      Synthesized Reasoning
                    </span>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-normal bg-black/40 p-2.5 rounded-lg border border-white/5">
                      {node.provenance.reasoningChain}
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
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 font-medium">
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
                          className="text-xs font-medium text-slate-200 group-hover:text-sky-300 transition-colors flex items-center gap-1.5 leading-snug"
                        >
                          {src.title}
                          <ExternalLink className="w-3 h-3 shrink-0 opacity-60 group-hover:opacity-100" />
                        </a>
                      </div>

                      <div className="flex items-center gap-2 text-[9px] font-mono text-slate-400">
                        {src.publishedAt && <span>{src.publishedAt}</span>}
                        {src.relevance && (
                          <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-300">
                            {src.relevance}
                          </span>
                        )}
                      </div>

                      {src.quote && (
                        <blockquote className="text-[11px] font-normal text-slate-300 border-l-2 border-sky-500/50 pl-2.5 py-0.5 leading-relaxed bg-black/30 rounded-r">
                          "{src.quote}"
                        </blockquote>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empirical & Computed Metrics */}
            {node.metrics && node.metrics.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-medium">
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
                        <span className="text-xs font-mono text-slate-300 font-normal">
                          {m.name.replace(/_/g, ' ')}
                        </span>
                        <span className="text-sm font-mono font-semibold text-amber-300">
                          {typeof m.value === 'number' ? m.value.toLocaleString() : m.value}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-white/5 pt-1.5">
                        <span>{m.method || 'Statistical Pipeline'}</span>
                        {m.confidence !== undefined && (
                          <span className="text-emerald-400 font-medium">
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
                <span className="text-[10px] font-mono uppercase text-slate-400 tracking-widest">
                  Correlation Strength
                </span>
                <span className="text-xs font-mono font-semibold text-sky-400">
                  {(edge.correlationScore * 100).toFixed(0)}%
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <div className="flex-1 p-2.5 rounded bg-black/40 border border-white/5">
                  <span className="text-[9px] font-mono text-slate-400 block mb-1">Source Node</span>
                  <p className="text-xs font-medium text-white truncate">{edge.fromLabel}</p>
                </div>
                <div className="px-2 py-1 rounded bg-sky-500/10 border border-sky-500/25 text-sky-300 text-[10px] font-mono uppercase">
                  {edge.relationship}
                </div>
                <div className="flex-1 p-2.5 rounded bg-black/40 border border-white/5 text-right">
                  <span className="text-[9px] font-mono text-slate-400 block mb-1">Target Impact</span>
                  <p className="text-xs font-medium text-white truncate">{edge.toLabel}</p>
                </div>
              </div>
            </div>

            {edge.causalMechanism && (
              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
                  Identified Causal Mechanism
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
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

/* ─── SVG Cubic Bezier Edge with Interactive Label & Hover Highlights ───────── */
function SvgBezierEdge({
  edge,
  x1,
  y1,
  x2,
  y2,
  color,
  isSelected,
  isHighlighted,
  onClick
}: {
  edge: IntelEdge & { fromLabel: string; toLabel: string }
  x1: number
  y1: number
  x2: number
  y2: number
  color: string
  isSelected: boolean
  isHighlighted: boolean
  onClick: () => void
}) {
  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2

  const dy = y2 - y1
  const deltaFactor = Math.min(Math.abs(dy) * 0.5, 110)
  const cpx1 = x1
  const cpy1 = y1 + deltaFactor
  const cpx2 = x2
  const cpy2 = y2 - deltaFactor

  const pathData = `M ${x1} ${y1} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${x2} ${y2}`
  const strokeWidth = Math.max(2, Math.round(edge.correlationScore * 4))

  return (
    <g className="group cursor-pointer" onClick={onClick}>
      {/* Invisible wider hit-target for effortless clicking */}
      <path d={pathData} fill="none" stroke="transparent" strokeWidth={24} />

      {/* Subtle Glow */}
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth + 4}
        strokeOpacity={isSelected ? 0.35 : isHighlighted ? 0.25 : 0.04}
        className="transition-all duration-200 group-hover:stroke-opacity-30"
      />

      {/* Main Path */}
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeOpacity={isSelected ? 0.95 : isHighlighted ? 0.8 : 0.35}
        strokeDasharray={isSelected ? '6 4' : undefined}
        className="transition-all duration-200 group-hover:stroke-opacity-90"
      />

      {/* Relationship Label Badge */}
      <foreignObject
        x={midX - 70}
        y={midY - 13}
        width={140}
        height={26}
        className="overflow-visible pointer-events-none"
      >
        <div className="flex items-center justify-center w-full h-full">
          <div
            className={`px-2 py-0.5 rounded border text-[9px] font-mono tracking-wider transition-all duration-200 ${
              isSelected
                ? 'bg-sky-500 text-black border-sky-400 font-semibold shadow-lg shadow-sky-500/20'
                : isHighlighted
                ? 'bg-[#0e121e] border-sky-500/40 text-sky-200'
                : 'bg-[#090a12]/90 border-white/10 text-slate-400 group-hover:border-sky-500/40 group-hover:text-slate-200'
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
  const [viewportH, setViewportH] = useState(760)

  // Zoom and Pan
  const [zoom, setZoom] = useState(0.9)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Filters & Selection
  const [selectedThreatFilter, setSelectedThreatFilter] = useState<string>('ALL')
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('ALL')
  const [selectedNode, setSelectedNode] = useState<IntelNode | null>(null)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<(IntelEdge & { fromLabel: string; toLabel: string }) | null>(null)

  const { nodes = [], edges = [], headline = 'Intelligence Cascade Analysis', tensionPoints = [] } = data

  // Watch container dimensions
  useLayoutEffect(() => {
    const update = () => {
      if (containerRef.current) {
        setCw(containerRef.current.clientWidth)
        setViewportH(containerRef.current.clientHeight || (isFullscreen ? window.innerHeight : 760))
      }
    }
    update()
    const ro = new ResizeObserver(update)
    if (containerRef.current) ro.observe(containerRef.current)
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [isFullscreen])

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

    const computedH = PAD_TOP + layers.length * (CARD_H + V_GAP) + 120
    const computedW = Math.max(cw, maxRowWidth + PAD_SIDE * 2)

    return { posMap: map, totalHeight: computedH, totalWidth: computedW }
  }, [layers, cw])

  const labelMap = useMemo(() => Object.fromEntries(nodes.map(n => [n.id, n.label])), [nodes])

  // Fit to screen calculation
  const handleFitToScreen = useCallback(() => {
    if (!containerRef.current || totalWidth === 0 || totalHeight === 0) return
    const vW = containerRef.current.clientWidth
    const vH = containerRef.current.clientHeight || (isFullscreen ? window.innerHeight : 760)

    const scaleX = (vW - 40) / totalWidth
    const scaleY = (vH - 40) / totalHeight
    const targetZoom = Math.max(0.45, Math.min(1.15, Math.min(scaleX, scaleY)))

    const targetPanX = (vW - totalWidth * targetZoom) / 2
    const targetPanY = 20

    setZoom(targetZoom)
    setPan({ x: targetPanX, y: targetPanY })
  }, [totalWidth, totalHeight, isFullscreen])

  // Auto-fit on first load or when fullscreen toggles
  useEffect(() => {
    const t = setTimeout(() => {
      handleFitToScreen()
    }, 60)
    return () => clearTimeout(t)
  }, [isFullscreen, handleFitToScreen])

  // Escape key handler for fullscreen or dossier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (selectedNode || selectedEdge) {
          setSelectedNode(null)
          setSelectedEdge(null)
        } else if (isFullscreen) {
          setIsFullscreen(false)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedNode, selectedEdge, isFullscreen])

  // Wheel zoom / pan handling
  const handleWheel = (e: React.WheelEvent) => {
    // Zoom if Ctrl/Meta key or pinching, otherwise pan vertically/horizontally
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92
      setZoom(prev => Math.min(Math.max(prev * zoomFactor, 0.35), 2.0))
    } else {
      setPan(prev => ({
        x: prev.x - e.deltaX * 0.9,
        y: prev.y - e.deltaY * 0.9
      }))
    }
  }

  // Mouse pan drag handlers
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

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>()
    nodes.forEach(n => {
      if (n.category) set.add(n.category)
    })
    return Array.from(set)
  }, [nodes])

  // Connected edges for hover highlighting
  const activeNodeId = selectedNode?.id || hoveredNodeId
  const connectedNodeIds = useMemo(() => {
    if (!activeNodeId) return null
    const set = new Set<string>([activeNodeId])
    edges.forEach(e => {
      if (e.from === activeNodeId) set.add(e.to)
      if (e.to === activeNodeId) set.add(e.from)
    })
    return set
  }, [activeNodeId, edges])

  /* ── Canvas Content ── */
  const canvasContent = (
    <div
      className={`w-full flex flex-col gap-3 font-sans transition-all duration-200 select-none ${
        isFullscreen
          ? 'fixed inset-0 z-[9999] bg-[#05060b] p-6 text-slate-100 flex flex-col h-screen overflow-hidden'
          : 'relative'
      }`}
    >
      {/* ── TOP INTELLIGENCE BRIEFING BANNER ── */}
      <div className="rounded-xl border border-white/10 bg-[#090b14]/90 backdrop-blur-xl p-5 shadow-2xl relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-48 h-48 bg-sky-500/5 rounded-bl-full pointer-events-none blur-2xl" />
        <div className="absolute top-0 left-0 h-[1px] w-full bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5 max-w-4xl">
            <div className="flex items-center gap-2.5">
              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-[10px] font-mono font-medium uppercase tracking-wider">
                <Flame className="w-3 h-3 text-red-400 animate-pulse" />
                Tactical Briefing
              </span>
              <span className="text-white/20 text-xs">|</span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                {nodes.length} Threat Nodes · {edges.length} Causal Links
              </span>
              {isFullscreen && (
                <span className="px-2 py-0.5 rounded bg-white/10 text-slate-300 text-[9px] font-mono">
                  PRESS ESC TO EXIT FULLSCREEN
                </span>
              )}
            </div>

            {/* Restrained Headline Typography: Normal/Semi-bold, Clean Sentence/Title Case */}
            <h2 className="text-base md:text-lg font-semibold text-white leading-snug tracking-tight">
              {headline}
            </h2>
          </div>

          {/* Metrics Status Pill */}
          <div className="flex items-center gap-3 shrink-0 bg-white/[0.03] border border-white/5 rounded-lg p-2.5">
            <div className="text-center px-3 border-r border-white/10">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">
                Critical Density
              </span>
              <span className="text-base font-mono font-semibold text-red-400">
                {nodes.length > 0
                  ? `${Math.round((nodes.filter(n => n.threatLevel === 'CRITICAL').length / nodes.length) * 100)}%`
                  : '0%'}
              </span>
            </div>
            <div className="text-center px-3">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest block">
                Verified Facts
              </span>
              <span className="text-base font-mono font-semibold text-cyan-400">
                {nodes.filter(n => n.dataType === 'REAL_FACT').length}
              </span>
            </div>
          </div>
        </div>

        {/* Strategic Tension Points */}
        {tensionPoints && tensionPoints.length > 0 && (
          <div className="mt-4 pt-3.5 border-t border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Scale className="w-3.5 h-3.5 text-amber-400/80" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400/90 font-medium">
                Strategic Tension Conflicts & Paradoxes
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {tensionPoints.map((tp, idx) => (
                <div
                  key={idx}
                  className="px-3 py-2 rounded-lg bg-amber-500/[0.03] border border-amber-500/15 text-slate-300 text-[11px] font-normal leading-relaxed flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400/70 mt-1.5 shrink-0" />
                  <span>{tp}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── TOOLBAR & VIEWPORT CONTROLS ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1 shrink-0">
        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center gap-1 text-slate-400 text-[10px] font-mono mr-1">
            <Filter className="w-3 h-3" />
            <span>FILTER:</span>
          </div>

          {['ALL', 'CRITICAL', 'ELEVATED'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setSelectedThreatFilter(lvl)}
              className={`px-2.5 py-1 rounded text-[10px] font-mono font-medium transition-all ${
                selectedThreatFilter === lvl
                  ? 'bg-white/15 text-white border border-white/20'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 border border-transparent'
              }`}
            >
              {lvl}
            </button>
          ))}

          <span className="text-white/20 text-xs mx-1">|</span>

          <button
            onClick={() => setSelectedCategoryFilter('ALL')}
            className={`px-2.5 py-1 rounded text-[10px] font-mono font-medium transition-all ${
              selectedCategoryFilter === 'ALL'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 border border-transparent'
            }`}
          >
            ALL DOMAINS
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded text-[10px] font-mono font-medium transition-all ${
                selectedCategoryFilter === cat
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Zoom & Canvas Navigation Actions */}
        <div className="flex items-center gap-1 bg-[#090b14]/90 border border-white/10 rounded-lg p-1">
          <button
            onClick={() => setZoom(z => Math.min(z + 0.15, 2.0))}
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Zoom In (or Ctrl+Wheel)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(z - 0.15, 0.35))}
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Zoom Out (or Ctrl+Wheel)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleFitToScreen}
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Fit to Screen"
          >
            <Focus className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setZoom(1)
              setPan({ x: 0, y: 0 })
            }}
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Fullscreen View'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-sky-400" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* ── INTERACTIVE CANVAS VIEWPORT ── */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className={`relative w-full rounded-xl border border-white/10 overflow-hidden cursor-grab active:cursor-grabbing transition-colors ${
          isFullscreen ? 'flex-1 min-h-0' : 'min-h-[720px] h-[720px]'
        }`}
        style={{
          background: 'radial-gradient(ellipse at 50% 15%, #0a0d18 0%, #030408 85%)'
        }}
      >
        {/* Subtle Military Grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />

        {/* Phase / Progression Labels */}
        <div className="absolute top-5 left-5 flex flex-col gap-1 pointer-events-none z-10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-medium">
            Tactical Causal Hierarchy
          </span>
          <span className="text-[9px] font-mono text-slate-500">
            Signal &rarr; Dependency &rarr; Impact &rarr; Prediction
          </span>
        </div>

        {/* Pan / Zoom Helper Tip */}
        <div className="absolute bottom-4 left-5 hidden sm:flex items-center gap-2 pointer-events-none z-10 text-[9px] font-mono text-slate-500 bg-black/40 px-2.5 py-1 rounded border border-white/5">
          <Move className="w-3 h-3 opacity-60" />
          <span>Scroll to pan · Ctrl+Scroll to zoom · Drag canvas</span>
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
              const isHighlighted = activeNodeId === edge.from || activeNodeId === edge.to

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
                  isHighlighted={isHighlighted}
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

          {/* Interactive Node Cards */}
          {nodes.map(node => {
            const pos = posMap[node.id]
            if (!pos) return null

            const isFilteredOut = filteredNodes.length < nodes.length && !filteredNodes.some(fn => fn.id === node.id)
            const isDimmed = isFilteredOut || (connectedNodeIds !== null && !connectedNodeIds.has(node.id))
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
                onMouseEnter={() => setHoveredNodeId(node.id)}
                onMouseLeave={() => setHoveredNodeId(null)}
                className={`interactive-card absolute rounded-xl p-4 transition-all duration-200 cursor-pointer border ${
                  isDimmed
                    ? 'opacity-25 grayscale pointer-events-none'
                    : 'opacity-100 hover:scale-[1.015]'
                } ${
                  isSelected
                    ? 'ring-2 ring-sky-400 border-sky-400 shadow-[0_0_30px_rgba(56,189,248,0.25)] z-30'
                    : 'border-white/10 hover:border-white/20 z-20'
                }`}
                style={{
                  left: pos.x - CARD_W / 2,
                  top: pos.y - CARD_H / 2,
                  width: CARD_W,
                  minHeight: CARD_H,
                  background: 'linear-gradient(180deg, rgba(14, 17, 27, 0.95) 0%, rgba(7, 9, 16, 0.98) 100%)',
                  boxShadow: isSelected
                    ? `0 0 25px ${threatStyle.glow}`
                    : `0 4px 18px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.04)`
                }}
              >
                {/* Header Strip with Icon, Category & Threat */}
                <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2 truncate">
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center shrink-0 border"
                      style={{
                        background: threatStyle.bg,
                        borderColor: threatStyle.border,
                        color: threatStyle.color
                      }}
                    >
                      <IconComp className="w-3 h-3" />
                    </div>
                    <span className="text-[9px] font-mono font-medium uppercase tracking-wider text-slate-400 truncate">
                      {node.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: threatStyle.color }}
                    />
                    <span
                      className="text-[9px] font-mono font-medium tracking-wider uppercase"
                      style={{ color: threatStyle.text }}
                    >
                      {node.threatLevel}
                    </span>
                  </div>
                </div>

                {/* Node Title: Clean font-medium with legible leading */}
                <h4 className="text-xs font-medium text-slate-100 leading-snug tracking-normal mb-2 line-clamp-2">
                  {node.label}
                </h4>

                {/* Badges Bar (Consensus & DataType) */}
                <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                  <ConsensusBadge status={node.consensusStatus} />
                  <DataTypeBadge type={node.dataType} />
                </div>

                {/* Metrics Preview Pill */}
                {node.metrics && node.metrics.length > 0 && (
                  <div className="bg-white/[0.025] border border-white/5 rounded-lg px-2.5 py-1 flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400 truncate max-w-[140px] font-normal">
                      {node.metrics[0].name.replace(/_/g, ' ')}
                    </span>
                    <span className="font-semibold text-amber-300">
                      {typeof node.metrics[0].value === 'number'
                        ? node.metrics[0].value.toLocaleString()
                        : node.metrics[0].value}
                    </span>
                  </div>
                )}

                {/* Footer attribution */}
                <div className="mt-2 flex items-center justify-between text-[8px] font-mono text-slate-500">
                  <span>{node.type}</span>
                  {node.provenance?.sources?.length ? (
                    <span className="text-cyan-400 font-medium flex items-center gap-1">
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

  // In Fullscreen mode, render via Portal to document.body to break free of parent chat or overlay styles
  if (isFullscreen && typeof document !== 'undefined') {
    return createPortal(canvasContent, document.body)
  }

  return canvasContent
}
