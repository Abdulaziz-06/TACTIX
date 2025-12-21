import React, { useMemo, useState, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Maximize2, Info, X, Plus, Minus, RotateCcw } from 'lucide-react';

const CATEGORY_COLORS = {
    SIGNAL: '#00FFD1',     // Cyan
    DEPENDENCY: '#FACC15', // Yellow
    IMPACT: '#F87171',     // Red/Coral
    PREDICTION: '#A78BFA'  // Purple
};

// --------------------------------------------------------------------------
// MEMOIZED EDGE COMPONENT
// --------------------------------------------------------------------------
const Edge = memo(({ start, end, isFull }) => {
    return (
        <motion.path
            d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
            stroke="rgba(0, 255, 209, 0.3)"
            strokeWidth="2"
            fill="none"
            markerEnd={`url(#arrowhead-${isFull ? 'full' : 'compact'})`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8 }}
        />
    );
});

// --------------------------------------------------------------------------
// NODE COMPONENT WITH INTERNAL STATE
// --------------------------------------------------------------------------
const Node = memo(({ node, pos, isFull, isTopRow }) => {
    const [isHovered, setIsHovered] = useState(false);
    const nodeSize = isFull ? "w-28 h-28" : "w-20 h-20";
    const displayName = node.id.replace(/_/g, ' ');

    return (
        <div
            className="absolute"
            style={{
                left: pos.x,
                top: pos.y,
                transform: 'translate(-50%, -50%)',
                zIndex: isHovered ? 1000 : 10,
                willChange: 'transform' // Performance optimization
            }}
        >
            {/* Hover Tooltip */}
            <AnimatePresence>
                {isHovered && (
                    <motion.div
                        initial={{ opacity: 0, y: isTopRow ? -5 : 5 }}
                        animate={{ opacity: 1, y: isTopRow ? 15 : -15 }}
                        exit={{ opacity: 0 }}
                        className={`absolute left-1/2 -translate-x-1/2 w-[320px] p-5 bg-[#0A0A0A] border-2 border-white/10 rounded-sm shadow-[0_30px_60px_-12px_rgba(0,0,0,1)] z-[1001] pointer-events-none ${isTopRow ? 'top-full mt-4' : 'bottom-full mb-4'
                            }`}
                    >
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CATEGORY_COLORS[node.label] }} />
                                    <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">{node.label}</span>
                                </div>
                                <span className="text-[9px] text-white/20 font-mono italic">{displayName}</span>
                            </div>
                            <p className="text-[13px] text-white/80 leading-relaxed font-medium">
                                {node.description.replace(/_/g, ' ')}
                            </p>
                        </div>
                        <div className={`absolute left-1/2 -translate-x-1/2 border-[10px] border-transparent ${isTopRow ? 'bottom-full border-b-[#0A0A0A]' : 'top-full border-t-[#0A0A0A]'
                            }`} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Node Circle */}
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative flex flex-col items-center cursor-crosshair"
            >
                <div
                    className={`${nodeSize} rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isHovered ? 'shadow-[0_0_50px_rgba(255,255,255,0.1)] scale-110' : ''
                        }`}
                    style={{
                        backgroundColor: '#030303',
                        borderColor: CATEGORY_COLORS[node.label]
                    }}
                >
                    <span className={`font-bold text-white/70 text-center px-4 overflow-hidden break-words line-clamp-3 ${isFull ? 'text-[11px]' : 'text-[9px]'}`}>
                        {displayName}
                    </span>
                </div>
                {node.label === 'SIGNAL' && (
                    <span className="absolute inset-0 rounded-full border border-[#00FFD1] animate-ping opacity-10 pointer-events-none" />
                )}
            </div>
        </div>
    );
});

// --------------------------------------------------------------------------
// MAIN GRAPH COMPONENT
// --------------------------------------------------------------------------
const CausalGraph = ({ data, gist, headline }) => {
    const { nodes, edges } = data || { nodes: [], edges: [] };
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [zoom, setZoom] = useState(1);

    // Group nodes by category
    const columns = useMemo(() => {
        const cols = { SIGNAL: [], DEPENDENCY: [], IMPACT: [], PREDICTION: [] };
        nodes.forEach(node => {
            if (cols[node.label]) cols[node.label].push(node);
        });
        return cols;
    }, [nodes]);

    const columnOrder = ['SIGNAL', 'DEPENDENCY', 'IMPACT', 'PREDICTION'];

    const nodePositions = useMemo(() => {
        const positions = {};
        const colWidth = 400;
        const rowHeight = 240;
        const paddingX = 120;
        const paddingY = 120;

        columnOrder.forEach((label, colIdx) => {
            const colNodes = columns[label] || [];
            colNodes.forEach((node, rowIdx) => {
                positions[node.id] = {
                    x: paddingX + colIdx * colWidth,
                    y: paddingY + rowIdx * rowHeight
                };
            });
        });
        return positions;
    }, [columns]);

    const graphWidth = 1600;
    const maxHeight = useMemo(() => {
        const counts = columnOrder.map(label => (columns[label] || []).length);
        const maxNodes = Math.max(...counts, 1);
        return maxNodes * 240 + 250;
    }, [columns]);

    const handleZoomIn = useCallback(() => setZoom(prev => Math.min(prev + 0.2, 2)), []);
    const handleZoomOut = useCallback(() => setZoom(prev => Math.max(prev - 0.2, 0.4)), []);
    const handleResetZoom = useCallback(() => setZoom(1), []);

    if (!nodes.length) return null;

    const GraphContent = ({ isFull }) => (
        <div
            className="transition-transform duration-300 ease-out origin-top-left"
            style={{
                width: `${graphWidth}px`,
                height: `${maxHeight}px`,
                transform: `scale(${isFull ? zoom : 0.8})`
            }}
        >
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                    <marker id={`arrowhead-${isFull ? 'full' : 'compact'}`} markerWidth="10" markerHeight="7" refX={isFull ? "52" : "45"} refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="rgba(0, 255, 209, 0.4)" />
                    </marker>
                </defs>
                {edges.map((edge) => (
                    <Edge key={`${edge.from}-${edge.to}`} start={nodePositions[edge.from]} end={nodePositions[edge.to]} isFull={isFull} />
                ))}
            </svg>

            {columnOrder.map((label, colIdx) => (
                <div key={label} className="absolute border-b border-white/5 pb-2" style={{ left: colIdx * 400 + 40, width: '250px', top: 40 }}>
                    <span className="text-[12px] font-black tracking-[0.6em] text-white/30 uppercase">{label}</span>
                </div>
            ))}

            {nodes.map((node) => {
                const labelNodes = columns[node.label] || [];
                const rowIdx = labelNodes.findIndex(n => n.id === node.id);
                return (
                    <Node
                        key={node.id}
                        node={node}
                        pos={nodePositions[node.id]}
                        isFull={isFull}
                        isTopRow={rowIdx === 0}
                    />
                );
            })}
        </div>
    );

    return (
        <div className="mt-8 relative group">
            {!isFullscreen && gist && (
                <div className="mb-6 bg-white/[0.02] border-l-4 border-[#00FFD1] p-6 rounded-r-md">
                    <p className="text-[15px] text-white/80 leading-relaxed font-medium italic">"{gist}"</p>
                </div>
            )}

            <div className="absolute top-2 right-2 z-40">
                <button onClick={() => setIsFullscreen(true)} className="p-2.5 bg-black/50 border border-white/10 hover:border-[#00FFD1]/50 text-white/40 hover:text-[#00FFD1] transition-all rounded-sm backdrop-blur-md">
                    <Maximize2 size={18} />
                </button>
            </div>

            <div className="p-10 bg-[#020202] border border-white/5 rounded-sm overflow-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent h-[500px]">
                <GraphContent isFull={false} />
            </div>

            {/* Eye-catching Headline */}
            {headline && (
                <div className="mt-6 p-4 border-t border-red-500/20 bg-red-500/5 rounded-sm flex flex-col items-center gap-1.5">
                    <span className="text-[11px] font-black text-white/70 uppercase tracking-[0.5em] drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">Probable Headline</span>
                    <p className="text-red-500 text-lg font-bold italic tracking-wide text-center drop-shadow-[0_0_10px_rgba(239,68,68,0.3)] animate-pulse">
                        {headline}
                    </p>
                </div>
            )}

            <div className="mt-4 flex items-center gap-2 text-white/20 text-[10px] uppercase font-bold tracking-[0.2em]">
                <Info size={12} />
                Interactive Map • Scroll to explore depths
            </div>

            <AnimatePresence>
                {isFullscreen && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black flex flex-col">
                        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/90 backdrop-blur-3xl">
                            <div className="flex items-center gap-5">
                                <h3 className="text-white font-bold uppercase tracking-[0.4em] text-sm">Causal Impact Analysis</h3>
                                <div className="h-4 w-px bg-white/10" />
                                <div className="flex items-center gap-1">
                                    <button onClick={handleZoomOut} className="p-2 text-white/40 hover:text-white transition-colors" title="Zoom Out"><Minus size={18} /></button>
                                    <span className="text-[11px] font-mono text-white/60 min-w-[3em] text-center">{Math.round(zoom * 100)}%</span>
                                    <button onClick={handleZoomIn} className="p-2 text-white/40 hover:text-white transition-colors" title="Zoom In"><Plus size={18} /></button>
                                    <button onClick={handleResetZoom} className="p-2 text-white/40 hover:text-white transition-colors ml-2" title="Reset Zoom"><RotateCcw size={16} /></button>
                                </div>
                            </div>
                            <button onClick={() => setIsFullscreen(false)} className="p-2 text-white/40 hover:text-red-500 transition-all">
                                <X size={32} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-20 bg-[#010101] scrollbar-hide">
                            <GraphContent isFull={true} />
                        </div>
                        <div className="p-5 border-t border-white/5 bg-black text-[10px] text-white/20 flex justify-between uppercase tracking-widest px-8 font-black">
                            <span>Analysis Engine Active</span>
                            <span>Scale {zoom.toFixed(1)}x • Nodes {nodes.length}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CausalGraph;
