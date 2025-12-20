import React from 'react';
import { motion } from 'framer-motion';

const CausalGraph = ({ labels }) => {
    // Hardcoded coordinates to match the Y-shape "Mercedes" style layout from the user's image
    // Center is roughly 400, 300 in an 800x600 viewBox
    const nodes = [
        { id: 'root', x: 400, y: 350, label: labels?.root || 'Social Impact', type: 'root' },

        // Top Left Branch
        { id: 'tl-mid', x: 250, y: 250, label: labels?.tl_mid || 'Tech Impact', type: 'mid' },
        { id: 'tl-leaf-1', x: 180, y: 180, label: labels?.tl_leaf_1 || 'Services', type: 'leaf' },
        { id: 'tl-leaf-2', x: 320, y: 150, label: labels?.tl_leaf_2 || 'Infrastructure', type: 'leaf' },

        // Top Right Branch
        { id: 'tr-mid', x: 550, y: 250, label: labels?.tr_mid || 'Market Effect', type: 'mid' },
        { id: 'tr-leaf-1', x: 620, y: 180, label: labels?.tr_leaf_1 || 'Commodities', type: 'leaf' },
        { id: 'tr-leaf-2', x: 480, y: 150, label: labels?.tr_leaf_2 || 'Stocks', type: 'leaf' },

        // Bottom Branch
        { id: 'b-leaf-1', x: 320, y: 480, label: labels?.b_leaf_1 || 'Employment', type: 'leaf' },
        { id: 'b-leaf-2', x: 480, y: 480, label: labels?.b_leaf_2 || 'Sentiment', type: 'leaf' },
    ];

    const links = [
        // Center connections (The Y shape is implied by connecting to the mids but let's connect explicit layout)
        { source: 'root', target: 'tl-mid' },
        { source: 'root', target: 'tr-mid' },

        // Top Left Branch
        { source: 'tl-mid', target: 'tl-leaf-1' },
        { source: 'tl-mid', target: 'tl-leaf-2' },

        // Top Right Branch
        { source: 'tr-mid', target: 'tr-leaf-1' },
        { source: 'tr-mid', target: 'tr-leaf-2' },

        // Bottom Branch (connected directly to root for the Y shape bottom legs?)
        // Looking at the image, there's a central hub.
        // Actually, looking closely at the image:
        // There is a central point, then 3 arms.
        // Arm 1 (Left-Up): Tech Impact -> Services / Infrastructure
        // Arm 2 (Right-Up): Market Effect -> Stocks / Commods
        // Arm 3 (Down): Social Impact -> Employment / Sentiment
        // Wait, the image has a CENTER node that is just a junction, then it goes to the labelled nodes?
        // Let's refine based on the "Social Impact" label in the image which is at the BOTTOM junction.
        // Actually the image has a central 3-way split. 
        // Let's model a central invisible hub or just connect them.
        // I'll stick to a visual hierarchy that looks good.

        { source: 'root', target: 'b-leaf-1' },
        { source: 'root', target: 'b-leaf-2' }
    ];

    return (
        <div className="w-full h-[400px] bg-black/50 rounded-lg border border-[#00FFD1]/20 relative overflow-hidden my-4 backdrop-blur-sm">
            <svg className="w-full h-full" viewBox="0 0 800 600">
                <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Lines */}
                {links.map((link, i) => {
                    const s = nodes.find(n => n.id === link.source);
                    const t = nodes.find(n => n.id === link.target);
                    return (
                        <motion.line
                            key={i}
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ pathLength: 1, opacity: 1 }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            x1={s.x}
                            y1={s.y}
                            x2={t.x}
                            y2={t.y}
                            stroke="#00FFD1"
                            strokeWidth="2"
                            strokeOpacity="0.5"
                        />
                    );
                })}

                {/* Nodes */}
                {nodes.map((node, i) => (
                    <g key={node.id}>
                        <motion.circle
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 + (i * 0.1) }}
                            cx={node.x}
                            cy={node.y}
                            r={node.type === 'root' ? 20 : 15}
                            fill="#000"
                            stroke="#00FFD1"
                            strokeWidth="3"
                            filter="url(#glow)"
                            className="cursor-pointer hover:fill-[#00FFD1]/20 transition-colors"
                        />
                        {/* Inner dot */}
                        {/* Connecting dots on lines */}

                        <motion.text
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 + (i * 0.1) }}
                            x={node.x}
                            y={node.y + 40}
                            textAnchor="middle"
                            fill="white"
                            fontSize="14"
                            className="font-sans font-medium tracking-wide"
                            style={{ textShadow: '0 0 10px rgba(0,255,209,0.5)' }}
                        >
                            {node.label}
                        </motion.text>
                    </g>
                ))}
            </svg>

            <div className="absolute top-4 right-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#00FFD1] animate-pulse" />
                <span className="text-[#00FFD1] text-xs font-mono uppercase">Interconnected Data Map</span>
            </div>
        </div>
    );
};

export default CausalGraph;
