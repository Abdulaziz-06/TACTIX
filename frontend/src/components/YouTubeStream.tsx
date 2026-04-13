import React, { useState } from 'react'
import ReactPlayer from 'react-player'
import { Maximize2, Volume2, VolumeX } from 'lucide-react'

interface StreamConfig {
  url: string
  label: string
  channel: string
}

const STREAMS: StreamConfig[] = [
  {
    url: 'https://www.youtube.com/watch?v=-zGuR1qVKrU',
    label: 'Live Feed Alpha',
    channel: 'CH-01',
  },
  {
    url: 'https://www.youtube.com/watch?v=gmtlJ_m2r5A',
    label: 'Live Feed Bravo',
    channel: 'CH-02',
  },
  {
    url: 'https://www.youtube.com/watch?v=fIurYTprwzg',
    label: 'Live Feed Charlie',
    channel: 'CH-03',
  },
  {
    url: 'https://www.youtube.com/watch?v=FGUKbzulB_Y',
    label: 'Live Feed Delta',
    channel: 'CH-04',
  },
]

interface FeedCellProps {
  stream: StreamConfig
  index: number
  onExpand: (i: number) => void
  expanded: boolean
}

function FeedCell({ stream, index, onExpand, expanded }: FeedCellProps) {
  const [error, setError]   = useState(false)
  const [ready, setReady]   = useState(false)
  const [muted, setMuted]   = useState(true)

  return (
    <div className="relative group overflow-hidden rounded-xl bg-black border border-white/5 hover:border-white/20 transition-all duration-300">
      {/* Loading shimmer */}
      {!ready && !error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 gap-1.5">
          <div className="w-4 h-4 border-2 border-white/15 border-t-white/60 rounded-full animate-spin" />
          <span className="text-[9px] text-white/30 font-mono uppercase tracking-widest">{stream.channel}</span>
        </div>
      )}

      {/* Error fallback */}
      {error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/95 gap-1">
          <span className="text-[18px]">📡</span>
          <span className="text-[9px] text-white/30 font-mono">{stream.channel} OFFLINE</span>
          <button
            onClick={() => setError(false)}
            className="mt-1 text-[9px] px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white/60 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!error && (
        <ReactPlayer
          url={stream.url}
          width="100%"
          height="100%"
          playing={true}
          muted={muted}
          onReady={() => setReady(true)}
          onError={() => setError(true)}
          config={{
            youtube: {
              playerVars: {
                autoplay: 1,
                mute: 1,
                modestbranding: 1,
                rel: 0,
                controls: 0,
              },
            },
          }}
          style={{ position: 'absolute', inset: 0 }}
        />
      )}

      {/* HUD overlay */}
      <div className="absolute inset-0 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent px-2 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[9px] font-black text-white/80 tracking-widest uppercase">{stream.channel}</span>
          </div>
          <span className="text-[9px] text-white/40 font-mono">LIVE</span>
        </div>
        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-2 py-1.5">
          <span className="text-[9px] text-white/60 font-medium truncate block">{stream.label}</span>
        </div>
      </div>

      {/* Action buttons (always-clickable) */}
      <div className="absolute top-1.5 right-1.5 z-30 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto">
        <button
          onClick={(e) => { e.stopPropagation(); setMuted(m => !m) }}
          className="w-5 h-5 rounded-md bg-black/60 backdrop-blur flex items-center justify-center hover:bg-black/80 transition-colors border border-white/10"
        >
          {muted
            ? <VolumeX className="w-2.5 h-2.5 text-white/70" />
            : <Volume2 className="w-2.5 h-2.5 text-white/70" />}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onExpand(index) }}
          className="w-5 h-5 rounded-md bg-black/60 backdrop-blur flex items-center justify-center hover:bg-black/80 transition-colors border border-white/10"
        >
          <Maximize2 className="w-2.5 h-2.5 text-white/70" />
        </button>
      </div>

      {/* Active/expanded ring */}
      {expanded && (
        <div className="absolute inset-0 z-10 border-2 border-primary rounded-xl pointer-events-none" />
      )}
    </div>
  )
}

export default function YouTubeStream() {
  const [focused, setFocused] = useState<number | null>(null)

  const handleExpand = (i: number) => {
    setFocused(prev => prev === i ? null : i)
  }

  return (
    <div className="w-full h-full flex flex-col gap-1.5">
      {focused !== null ? (
        /* Expanded single view */
        <div className="flex flex-col gap-1.5 h-full">
          <div className="relative flex-1 min-h-0">
            <FeedCell
              stream={STREAMS[focused]}
              index={focused}
              onExpand={handleExpand}
              expanded={true}
            />
          </div>
          {/* Thumbnail strip */}
          <div className="grid grid-cols-4 gap-1 shrink-0 h-10">
            {STREAMS.map((s, i) => (
              <button
                key={i}
                onClick={() => setFocused(i)}
                className={`relative rounded-lg overflow-hidden border transition-all ${
                  i === focused ? 'border-primary' : 'border-white/10 hover:border-white/30'
                } bg-black`}
              >
                <span className="text-[8px] font-black text-white/50 absolute inset-0 flex items-center justify-center">
                  {s.channel}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* 2×2 collage grid */
        <div className="grid grid-cols-2 gap-1.5 w-full" style={{ aspectRatio: '16/9' }}>
          {STREAMS.map((stream, i) => (
            <FeedCell
              key={i}
              stream={stream}
              index={i}
              onExpand={handleExpand}
              expanded={false}
            />
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between px-1 shrink-0">
        <div className="flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
            {focused !== null ? `${STREAMS[focused].channel} — Expanded` : '4 Live Feeds'}
          </span>
        </div>
        {focused !== null && (
          <button
            onClick={() => setFocused(null)}
            className="text-[9px] text-primary/70 hover:text-primary font-bold uppercase tracking-widest transition-colors"
          >
            ← Grid
          </button>
        )}
      </div>
    </div>
  )
}
