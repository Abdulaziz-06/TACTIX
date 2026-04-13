import React, { useLayoutEffect, useRef, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Activity, TrendingDown, Zap, Globe, ShieldAlert, BarChart2 } from 'lucide-react'

/* ─── Types ─────────────────────────────────────────────────────────────────── */
export interface IntelNode {
  id: string
  label: string
  description: string
  type: 'SIGNAL' | 'DEPENDENCY' | 'IMPACT' | 'PREDICTION'
  category: 'CALAMITY' | 'STOCK' | 'GEOPOLITICAL' | 'GENERIC'
  threatLevel: 'CRITICAL' | 'ELEVATED' | 'MODERATE' | 'LOW'
  metrics?: { name: string; value: number }[]
}
export interface IntelEdge {
  from: string
  to: string
  relationship: string
  correlationScore: number
}
export interface IntelGraphData {
  nodes: IntelNode[]
  edges: IntelEdge[]
  headline: string
}

/* ─── Design tokens ─────────────────────────────────────────────────────────── */
const THREAT: Record<string, { color: string; bg: string; ring: string }> = {
  CRITICAL: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)',  ring: 'rgba(239,68,68,0.45)' },
  ELEVATED: { color: '#f97316', bg: 'rgba(249,115,22,0.15)', ring: 'rgba(249,115,22,0.45)' },
  MODERATE: { color: '#eab308', bg: 'rgba(234,179,8,0.15)',  ring: 'rgba(234,179,8,0.45)'  },
  LOW:      { color: '#22c55e', bg: 'rgba(34,197,94,0.15)',  ring: 'rgba(34,197,94,0.45)'  },
}
const TYPE_COLOR: Record<string, string> = {
  SIGNAL:     '#ef4444',
  DEPENDENCY: '#f97316',
  IMPACT:     '#eab308',
  PREDICTION: '#818cf8',
}
const LAYER_ORDER = ['SIGNAL', 'DEPENDENCY', 'IMPACT', 'PREDICTION']

/* Layout constants */
const SIZE     = 60    // circular node diameter
const H_GAP    = 220   // huge horizontal gap for massive tree expansion
const V_GAP    = 280   // massive vertical depth for hierarchy clarity
const PAD_T    = 100   // top padding
const PAD_X    = 120   // wide side padding


/* ─── Node icon ─────────────────────────────────────────────────────────────── */
function NodeIcon({ type }: { type: IntelNode['type'] }) {
  const p = { size: 24, strokeWidth: 2.5 }
  switch (type) {
    case 'SIGNAL':     return <AlertTriangle {...p} />
    case 'DEPENDENCY': return <Activity      {...p} />
    case 'IMPACT':     return <TrendingDown  {...p} />
    case 'PREDICTION': return <Zap           {...p} />
    default:           return <Globe         {...p} />
  }
}

/* ─── Tooltip ───────────────────────────────────────────────────────────────── */
interface TipData {
  node?: IntelNode
  edge?: IntelEdge & { fromLabel: string; toLabel: string }
  x: number
  y: number
}

function Tooltip({ d, cref }: { d: TipData; cref: React.RefObject<HTMLDivElement> }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ left: d.x + 14, top: d.y - 10 })

  useLayoutEffect(() => {
    const el = ref.current
    const ct = cref.current
    if (!el || !ct) return
    const { width: tw, height: th } = el.getBoundingClientRect()
    const { width: cw, height: ch } = ct.getBoundingClientRect()
    let left = d.x + 14
    let top  = d.y - 10
    if (left + tw > cw - 8) left = d.x - tw - 14
    if (top + th > ch - 8)  top  = ch - th - 8
    if (top < 8)             top  = 8
    setPos({ left, top })
  }, [d, cref])

  const n = d.node
  const e = d.edge

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute z-[100] pointer-events-none"
      style={{ left: pos.left, top: pos.top, maxWidth: 300 }}
    >
      <div className="rounded-3xl border border-white/10 shadow-2xl overflow-hidden bg-[#0a0a0f/95] backdrop-blur-3xl"
           style={{ borderColor: n ? THREAT[n.threatLevel].ring : 'rgba(255,255,255,0.1)' }}>
        {n && (() => {
          const t = THREAT[n.threatLevel]
          return (
            <>
              <div className="px-5 py-4 flex items-center gap-4 bg-white/5 border-b border-white/5">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: t.bg, color: t.color, border: `1px solid ${t.ring}` }}>
                  <NodeIcon type={n.type} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40" style={{ color: TYPE_COLOR[n.type] }}>
                      {n.type}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                      {n.category}
                    </span>
                  </div>
                  <p className="text-[15px] font-black leading-tight text-white">{n.label}</p>
                </div>
              </div>
              
              <div className="p-5 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                    style={{ background: t.bg, borderColor: t.ring, color: t.color }}>
                    <ShieldAlert size={12} />
                    {n.threatLevel}
                  </div>
                </div>
                
                <p className="text-[13px] leading-relaxed text-white/50">{n.description}</p>
                
                {n.metrics && n.metrics.length > 0 && (
                  <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                    <p className="text-[9px] uppercase tracking-widest font-black opacity-30 flex items-center gap-2">
                      <BarChart2 size={12} /> Intelligence Data
                    </p>
                    {n.metrics.map(m => (
                      <div key={m.name} className="flex items-center justify-between">
                        <span className="text-[11px] text-white/40 uppercase font-bold">{m.name}</span>
                        <span className="text-[16px] font-black tabular-nums" style={{ color: t.color }}>
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )
        })()}

        {e && (
          <div className="p-5 flex flex-col gap-4">
            <p className="text-[9px] uppercase tracking-widest font-black opacity-30">Correlation link</p>
            <div className="flex flex-col gap-2">
              <span className="font-bold text-white/90 text-[13px]">{e.fromLabel}</span>
              <div className="flex items-center gap-3">
                <div className="h-[2px] bg-white/5 flex-1" />
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border"
                  style={{ background: 'rgba(129,140,248,0.1)', borderColor: 'rgba(129,140,248,0.3)', color: '#818cf8' }}>
                  {e.relationship}
                </span>
                <div className="h-[2px] bg-white/5 flex-1" />
              </div>
              <span className="font-bold text-white/90 text-[13px] text-right">{e.toLabel}</span>
            </div>
            
            <div className="flex items-center justify-between mt-2">
               <div className="flex flex-col gap-1">
                  <span className="text-[11px] font-bold text-white/80">Confidence Score</span>
                  <span className="text-[10px] text-white/40 font-mono">Statistical Relevance Index</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-24 h-2 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${e.correlationScore * 100}%`,
                        background: e.correlationScore >= 0.8 ? '#ef4444' : e.correlationScore >= 0.6 ? '#f97316' : '#eab308',
                      }} />
                  </div>
                  <span className="text-lg font-black tabular-nums"
                    style={{ color: e.correlationScore >= 0.8 ? '#ef4444' : e.correlationScore >= 0.6 ? '#f97316' : '#eab308' }}>
                    {Math.round(e.correlationScore * 100)}%
                  </span>
               </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ─── CSS Edge ─── */
interface CSSEdgeProps {
  edge: IntelEdge
  x1: number; y1: number
  x2: number; y2: number
  color: string
  onEnter: (e: React.MouseEvent) => void
  onLeave: () => void
}

function CSSEdge({ edge, x1, y1, x2, y2, color, onEnter, onLeave }: CSSEdgeProps) {
  const dx     = x2 - x1
  const dy     = y2 - y1
  const length = Math.sqrt(dx * dx + dy * dy)
  const angle  = Math.atan2(dy, dx) * (180 / Math.PI)
  const mx     = (x1 + x2) / 2
  const my     = (y1 + y2) / 2
  const opacity = 0.2 + edge.correlationScore * 0.5
  const thickness = Math.round(2 + edge.correlationScore * 4)

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 5 }}>
      {/* Glow path */}
      <div style={{
          position: 'absolute', left: x1, top: y1, width: length, height: thickness + 10,
          marginTop: -(thickness + 10) / 2, background: color, opacity: opacity * 0.15,
          filter: 'blur(8px)', transformOrigin: '0 50%', transform: `rotate(${angle}deg)`, borderRadius: 999 }} />
      
      {/* Main line - interaction area is larger than visible line */}
      <div style={{
          position: 'absolute', left: x1, top: y1, width: length, height: thickness,
          marginTop: -thickness / 2, background: `linear-gradient(90deg, ${color}dd, ${color}33)`,
          opacity, transformOrigin: '0 50%', transform: `rotate(${angle}deg)`, borderRadius: 999,
          pointerEvents: 'auto', cursor: 'pointer', zIndex: 10 }}
        onMouseEnter={onEnter} onMouseLeave={onLeave} />

      {/* Relationship text */}
      <div style={{
          position: 'absolute', left: mx, top: my,
          transform: `translate(-50%, -50%) rotate(${Math.abs(angle) > 90 ? angle + 180 : angle}deg) translateY(-14px)`,
          fontSize: 9, fontWeight: 900, color, opacity: 0.6, fontFamily: 'monospace',
          letterSpacing: '0.2em', textTransform: 'uppercase', textShadow: `0 0 10px ${color}88` }}>
        {edge.relationship}
      </div>
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────────────────────────── */
export default function IntelligenceGraph({ data }: { data: IntelGraphData }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [cw, setCw]   = useState(1200)
  const [tip, setTip] = useState<TipData | null>(null)

  useLayoutEffect(() => {
    const update = () => {
       if(containerRef.current) setCw(containerRef.current.clientWidth)
    }
    update()
    const ro = new ResizeObserver(update)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const { nodes, edges, headline } = data

  const layers = useMemo(() => {
    return LAYER_ORDER.map(type => nodes.filter(n => n.type === type)).filter(l => l.length > 0)
  }, [nodes])

  const posMap = useMemo(() => {
    const map: Record<string, { x: number; y: number }> = {}
    layers.forEach((layerNodes, li) => {
      const count = layerNodes.length
      const totalW = count * SIZE + (count - 1) * H_GAP
      const startX = Math.max(PAD_X, (cw - totalW) / 2)
      const y = PAD_T + li * V_GAP
      layerNodes.forEach((node, ni) => {
        map[node.id] = { x: startX + ni * (SIZE + H_GAP) + SIZE / 2, y: y + SIZE / 2 }
      })
    })
    return map
  }, [layers, cw])

  const totalH = PAD_T + (layers.length - 1) * V_GAP + SIZE + PAD_T
  const labelMap = useMemo(() => Object.fromEntries(nodes.map(n => [n.id, n.label])), [nodes])

  return (
    <div className="w-full h-full flex flex-col gap-6 animate-in fade-in duration-700">
      
      {/* ── Headline Banner ── */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        className="rounded-[2.5rem] border border-white/5 p-8 flex items-center gap-8 bg-black/20 backdrop-blur-xl relative overflow-hidden group">
        
        {/* Animated background accent */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-transparent -translate-x-full group-hover:translate-x-full ease-in-out pointer-events-none" 
          style={{ transitionDuration: '3000ms', transitionProperty: 'transform' }}
        />
        
        <div className="w-14 h-14 rounded-3xl bg-red-500/10 flex items-center justify-center border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
          <AlertTriangle className="w-7 h-7 text-red-500 animate-pulse" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500/70">Intelligence Directive</span>
            <div className="h-px bg-red-500/20 flex-1" />
          </div>
          <h2 className="text-lg md:text-xl font-black text-white leading-tight tracking-tight max-w-4xl">
            {headline}
          </h2>
        </div>

        {/* Dynamic score dials */}
        <div className="hidden lg:flex gap-8 pl-8 border-l border-white/10">
          <div className="text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-2">Threat Vector</p>
            <p className="text-3xl font-black text-red-500 tabular-nums">
              {Math.round(nodes.filter(n => n.threatLevel === 'CRITICAL').length / nodes.length * 100)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-2">Node count</p>
            <p className="text-3xl font-black text-white/90 tabular-nums">{nodes.length}</p>
          </div>
        </div>
      </motion.div>

      {/* ── Graph Viewport ── */}
      <div ref={containerRef}
        className="relative w-full flex-1 min-h-[1000px] rounded-[3rem] border border-white/5 overflow-hidden transition-all duration-500 hover:border-white/10"
        style={{
          height: Math.max(totalH + 200, 1200),
          background: 'radial-gradient(circle at 50% 0%, #1a1a2e 0%, #05050f 70%)',
        }}
        onMouseLeave={() => setTip(null)}>
        
        {/* Subtle noise and texture */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay" 
             style={{ backgroundImage: `url('https://grainy-gradients.vercel.app/noise.svg')` }} />
        
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
             style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '100px 100px' }} />

        {/* ── Connectivity Layer (Edges) ── */}
        {edges.map((edge, i) => {
          const s = posMap[edge.from]; const t = posMap[edge.to]
          if (!s || !t) return null
          const src = nodes.find(n => n.id === edge.from)
          return <CSSEdge key={i} edge={edge} x1={s.x} y1={s.y} x2={t.x} y2={t.y}
            color={src ? THREAT[src.threatLevel].color : '#fff'}
            onEnter={ev => {
              const r = containerRef.current?.getBoundingClientRect()
              if (!r) return
              setTip({ edge: { ...edge, fromLabel: labelMap[edge.from]??'', toLabel: labelMap[edge.to]??'' }, x: ev.clientX - r.left, y: ev.clientY - r.top })
            }}
            onLeave={() => setTip(null)} />
        })}

        {/* ── Intelligence Nodes ── */}
        {nodes.map((node, idx) => {
          const pos = posMap[node.id]; if (!pos) return null
          const t = THREAT[node.threatLevel]
          
          return (
            <motion.div key={node.id} 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.04, type: 'spring', damping: 12, stiffness: 100 }}
              className="absolute group z-20"
              style={{ left: pos.x - SIZE / 2, top: pos.y - SIZE / 2, width: SIZE, height: SIZE }}
              onMouseEnter={ev => {
                const r = containerRef.current?.getBoundingClientRect()
                if (!r) return
                setTip({ node, x: ev.clientX - r.left, y: ev.clientY - r.top })
              }}
              onMouseLeave={() => setTip(null)}>
              
              {/* Outer Pulse for Critical */}
              {node.threatLevel === 'CRITICAL' && (
                <div className="absolute inset-[-10px] border-2 border-red-500/20 rounded-full animate-ping opacity-30" />
              )}
              
              {/* Node Main Circle */}
              <div className="relative w-full h-full rounded-full flex items-center justify-center cursor-pointer border-2 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
                style={{ 
                  background: `radial-gradient(circle at 30% 30%, ${t.color}33 0%, #0c0c14 100%)`, 
                  borderColor: t.ring,
                  boxShadow: `0 0 20px ${t.color}${tip?.node?.id === node.id ? '44' : '15'}` }}>
                
                <div style={{ color: t.color }} className="drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]">
                  <NodeIcon type={node.type} />
                </div>

                {/* Threat Badge */}
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full border-2 border-[#050510] flex items-center justify-center shadow-xl"
                  style={{ background: t.color }}>
                  <ShieldAlert size={10} color="white" strokeWidth={3} />
                </div>
              </div>

              {/* Node Label (Clean Tree Look) */}
              <div className="absolute top-[calc(100%+14px)] left-1/2 -translate-x-1/2 w-[160px] text-center pointer-events-none transition-all duration-300 group-hover:translate-y-1">
                <p className="text-[11px] font-black text-white tracking-tight drop-shadow-xl leading-tight mb-1">
                  {node.label}
                </p>
                <div className="flex items-center justify-center gap-1.5 opacity-40">
                  <span className="w-1 h-1 rounded-full" style={{ background: TYPE_COLOR[node.type] }} />
                  <span className="text-[8px] font-black uppercase tracking-[0.2em]" style={{ color: TYPE_COLOR[node.type] }}>
                    {node.category}
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}

        {/* ── Floating Legend ── */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-8 px-10 py-5 rounded-[2rem] border border-white/5 bg-black/40 backdrop-blur-2xl shadow-2xl">
           {LAYER_ORDER.map(t => (
            <div key={t} className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full shadow-[0_0_8px]" style={{ background: TYPE_COLOR[t], boxShadow: `0 0 10px ${TYPE_COLOR[t]}` }} />
              <span className="text-[9px] font-black uppercase tracking-[0.25em] text-white/40">{t}</span>
            </div>
          ))}
        </div>

        {/* ── Phase Labels ── */}
        <div className="absolute inset-y-0 left-12 flex flex-col justify-around pointer-events-none">
           {LAYER_ORDER.map(t => (
             <span key={t} className="text-[10px] font-black uppercase tracking-[0.6em] text-white/5 vertical-text" style={{ writingMode: 'vertical-rl' }}>
               PHASE_{t}
             </span>
           ))}
        </div>

        {/* Tooltip Render */}
        <AnimatePresence>
          {tip && <Tooltip key="tip" d={tip} cref={containerRef} />}
        </AnimatePresence>
      </div>
    </div>
  )
}
