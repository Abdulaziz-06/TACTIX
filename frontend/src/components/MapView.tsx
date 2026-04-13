import React, { useRef, useEffect, useCallback } from 'react'
import Map, { NavigationControl, Marker, Popup } from 'react-map-gl/maplibre'
import { useDashboardStore } from '../hooks/use-dashboard-store'
import 'maplibre-gl/dist/maplibre-gl.css'

// ─── Shared geo-intelligence data ────────────────────────────────────────────
export type PointType = 'high_alert' | 'elevated' | 'monitoring' | 'conflict' | 'base' | 'nuclear'

interface GeoPoint {
  id: string
  lat: number
  lng: number
  type: PointType
  label: string
  detail: string
  headline?: string
}

export const GEO_POINTS: GeoPoint[] = [
  // Conflicts
  { id: 'c1',  lat: 48.5,  lng: 31.2,  type: 'conflict',    label: 'Eastern Ukraine',       detail: 'Active conflict zone', headline: "Tactical shifts reported along the eastern front; energy grids at risk." },
  { id: 'c2',  lat: 15.5,  lng: 43.0,  type: 'conflict',    label: 'Yemen',                 detail: 'Ongoing SAF operations', headline: "Red Sea shipping routes disrupted amidst escalating maritime tensions." },
  { id: 'c3',  lat: 33.5,  lng: 43.5,  type: 'conflict',    label: 'Iraq',                  detail: 'Insurgency monitoring', headline: "Militia regrouping observed in northern territories." },
  { id: 'c4',  lat: 6.0,   lng: 21.0,  type: 'conflict',    label: 'CAR',                   detail: 'Civil conflict', headline: "Regional instability spreads due to resource control disputes." },
  { id: 'c5',  lat: 14.0,  lng: 0.0,   type: 'conflict',    label: 'Sahel',                 detail: 'Multi-state instability', headline: "Cross-border insurgencies trigger massive displacement." },
  // High alerts
  { id: 'h1',  lat: 32.0,  lng: 35.9,  type: 'high_alert',  label: 'Israel/Palestine',      detail: 'Elevated threat level', headline: "Ceasefire negotiations stall as regional defense systems activate." },
  { id: 'h2',  lat: 35.9,  lng: 14.5,  type: 'high_alert',  label: 'Mediterranean',         detail: 'Military buildup', headline: "Naval exercises intensify in contested continental shelf zones." },
  { id: 'h3',  lat: 23.7,  lng: 90.4,  type: 'high_alert',  label: 'Bangladesh',            detail: 'Political instability', headline: "Emerging supply chain chokepoints due to nationwide protests." },
  { id: 'h4',  lat: 37.5,  lng: 127.0, type: 'high_alert',  label: 'Korean Peninsula',      detail: 'DPRK ballistic activity', headline: "Unannounced missile tests prompt joint air-defense scrambles." },
  { id: 'h5',  lat: 24.0,  lng: 54.4,  type: 'high_alert',  label: 'Gulf States',           detail: 'Missile threat', headline: "Critical oil infrastructure raises alert level following drone incursions." },
  { id: 'h6',  lat: 11.0,  lng: 42.5,  type: 'high_alert',  label: 'Horn of Africa',        detail: 'Maritime threat', headline: "Piracy and anti-ship incidents throttle vital global trade artery." },
  // Elevated
  { id: 'e1',  lat: 55.7,  lng: 37.6,  type: 'elevated',    label: 'Moscow',                detail: 'Cyber + logistics monitoring', headline: "State-sponsored cyber units mobilizing against European telecom sectors." },
  { id: 'e2',  lat: -25.0, lng: 25.0,  type: 'elevated',    label: 'Southern Africa',       detail: 'Resource tension', headline: "Platinum and rare-earth supply chains face political gridlock." },
  { id: 'e3',  lat: 19.4,  lng: -99.1, type: 'elevated',    label: 'Mexico City',           detail: 'Cartel activity', headline: "Coordinated cartel blockades disrupt major industrial transport routes." },
  { id: 'e4',  lat: -33.9, lng: 18.4,  type: 'elevated',    label: 'Cape Town',             detail: 'Energy infrastructure alert', headline: "Rolling blackouts threaten the operational stability of key African ports." },
  { id: 'e5',  lat: 39.9,  lng: 32.9,  type: 'elevated',    label: 'Ankara',                detail: 'NATO-Russia signals', headline: "Diplomatic backchannels heat up amidst sudden military buildup at borders." },
  // Monitoring
  { id: 'm1',  lat: -15.7, lng: -47.9, type: 'monitoring',  label: 'Brasilia',              detail: 'Political monitoring', headline: "Agri-business sectors brace for massive climate-policy shifts." },
  { id: 'm2',  lat: 28.6,  lng: 77.2,  type: 'monitoring',  label: 'New Delhi',             detail: 'Border tension', headline: "Himalayan border skirmishes force military deployment restructuring." },
  { id: 'm3',  lat: -6.2,  lng: 106.8, type: 'monitoring',  label: 'Jakarta',               detail: 'Regional stability', headline: "ASEAN security pact discussions underway following rapid militarization." },
  { id: 'm4',  lat: 30.0,  lng: 31.2,  type: 'monitoring',  label: 'Cairo',                 detail: 'Economic monitor', headline: "Suez Canal transit fees surge amidst escalating regional war risks." },
  { id: 'm5',  lat: 51.5,  lng: -0.1,  type: 'monitoring',  label: 'London',                detail: 'Financial signals', headline: "Central bank interventions signal extreme caution in fiat stability." },
  { id: 'm6',  lat: 40.7,  lng: -74.0, type: 'monitoring',  label: 'New York',              detail: 'Market signals', headline: "Wall Street defensive rotation accelerates over macroeconomic fears." },
  { id: 'm7',  lat: 1.3,   lng: 103.8, type: 'monitoring',  label: 'Singapore',             detail: 'Trade route monitor', headline: "Malacca Strait patrols strengthened over unverified sabotage threats." },
  { id: 'm8',  lat: 35.6,  lng: 139.7, type: 'monitoring',  label: 'Tokyo',                 detail: 'Pacific stability watch', headline: "Defense budget surges as allied forces expand joint Pacific drills." },
  // Bases
  { id: 'b1',  lat: 36.8,  lng: 10.2,  type: 'base',        label: 'Tunis (NATO)',          detail: 'Mediterranean forward base', headline: "Forward operations expand in response to North African instability." },
  { id: 'b2',  lat: 11.5,  lng: 43.1,  type: 'base',        label: 'Djibouti',             detail: 'US/French combined base', headline: "Logistics hub hits max capacity due to Red Sea operational tempo." },
  { id: 'b3',  lat: 25.2,  lng: 55.3,  type: 'base',        label: 'Dubai',                 detail: 'US Naval FOB', headline: "Fifth Fleet readiness elevated; carrier strike groups reposition." },
  // Nuclear
  { id: 'n1',  lat: 45.0,  lng: 73.0,  type: 'nuclear',     label: 'Semey',                 detail: 'Former test site – monitored', headline: "Radiation anomalies detected; intelligence suspects unauthorized underground activity." },
  { id: 'n2',  lat: 38.9,  lng: 71.0,  type: 'nuclear',     label: 'Pakistan (PAEC)',       detail: 'Active stockpile monitoring', headline: "Strategic forces placed on elevated alert following regional clash." },
]

// ─── Color mapping ────────────────────────────────────────────────────────────
const TYPE_COLOR: Record<PointType, string> = {
  high_alert: '#ff0000',
  elevated:   '#ff9900',
  monitoring: '#eab308',
  conflict:   '#ff0000',
  base:       '#00aaff',
  nuclear:    '#d900ff',
}

const TYPE_SIZE: Record<PointType, number> = {
  high_alert: 16,
  elevated:   12,
  monitoring: 10,
  conflict:   18,
  base:       14,
  nuclear:    16,
}

const LEGEND_ITEMS: { type: PointType; label: string }[] = [
  { type: 'high_alert', label: 'High Alert' },
  { type: 'elevated',   label: 'Elevated' },
  { type: 'monitoring', label: 'Monitoring' },
  { type: 'conflict',   label: 'Conflict Zone' },
  { type: 'base',       label: 'Base' },
  { type: 'nuclear',    label: 'Nuclear' },
]

// ─── MapMarker ────────────────────────────────────────────────────────────────
function MapMarker({ point, onSelect }: { point: GeoPoint; onSelect: (p: GeoPoint | null) => void }) {
  const color = TYPE_COLOR[point.type]
  const size  = TYPE_SIZE[point.type]
  const isPulsing = point.type === 'conflict' || point.type === 'high_alert' || point.type === 'nuclear'

  return (
    <Marker longitude={point.lng} latitude={point.lat} anchor="center">
      <div
        className="relative cursor-crosshair group flex items-center justify-center"
        style={{ width: size * 3, height: size * 3 }}
        onClick={() => onSelect(point)}
        title={point.label}
      >
        {isPulsing && (
           <>
            <span
              className="absolute rounded-full animate-[ping_2s_ease-out_infinite] opacity-40 border border-current"
              style={{ width: size * 3, height: size * 3, color: color, backgroundColor: `${color}1A` }}
            />
            {/* Tactical targeting cross lines */}
            <div className="absolute w-[180%] h-[1px] opacity-0 group-hover:opacity-50 transition-opacity" style={{ backgroundColor: color }} />
            <div className="absolute h-[180%] w-[1px] opacity-0 group-hover:opacity-50 transition-opacity" style={{ backgroundColor: color }} />
           </>
        )}
        <span
          className="absolute rounded-none border-[1.5px] shadow-[0_0_10px_currentColor] group-hover:scale-150 transition-all duration-300"
          style={{ 
             width: size, height: size, 
             borderColor: color, 
             color: color,
             backgroundColor: point.type === 'conflict' ? `${color}40` : `${color}20`,
             transform: 'rotate(45deg)'
          }}
        />
        <div 
          className="absolute w-1.5 h-1.5 bg-white shadow-[0_0_8px_white] rounded-full"
        />
      </div>
    </Marker>
  )
}

// ─── Legend ───────────────────────────────────────────────────────────────────
function MapLegend() {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 px-4 py-2 bg-black/80 rounded-sm border border-[#333333] shadow-2xl font-mono">
      <span className="text-[10px] font-bold text-[#ff9900] mr-2">LEGEND_</span>
      {LEGEND_ITEMS.map(({ type, label }) => (
        <div key={type} className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 opacity-80"
            style={{ backgroundColor: TYPE_COLOR[type], boxShadow: `0 0 5px ${TYPE_COLOR[type]}` }}
          />
          <span className="text-[9px] text-white uppercase tracking-wider">{label}</span>
        </div>
      ))}
    </div>
  )
}

// ─── 2D Map ───────────────────────────────────────────────────────────────────
function FlatMap() {
  const [selected, setSelected] = React.useState<GeoPoint | null>(null)
  const [viewState, setViewState] = React.useState({
    longitude: 20.0,
    latitude: 20.0,
    zoom: 1.8,
    pitch: 0,
    bearing: 0,
  })

  // Highly realistic ESRI Satellite layer wrapper
  const satelliteStyle = {
    version: 8,
    sources: {
      'esri-satellite': {
        type: 'raster',
        tiles: [
          'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}?blankTile=false'
        ],
        tileSize: 256
      }
    },
    layers: [
      {
        id: 'satellite-layer',
        type: 'raster',
        source: 'esri-satellite',
        paint: {
            'raster-brightness-min': 0.1, // darken the satellite slightly for tactical overlay
            'raster-brightness-max': 0.7,
            'raster-saturation': -0.2
        }
      }
    ]
  }

  return (
    <div className="w-full h-full relative bg-black">
      <Map
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        mapStyle={satelliteStyle as any}
        style={{ width: '100%', height: '100%' }}
        attributionControl={false}
      >
        {GEO_POINTS.map(p => (
          <MapMarker key={p.id} point={p} onSelect={setSelected} />
        ))}

        {selected && (
          <Popup
            longitude={selected.lng}
            latitude={selected.lat}
            anchor="bottom"
            onClose={() => setSelected(null)}
            closeButton={false}
            className="z-50"
          >
            <div className="bg-black border border-primary/40 shadow-[0_0_30px_rgba(var(--primary),0.2)] min-w-[300px] max-w-[350px] font-mono text-white p-0 flex flex-col overflow-hidden">
              <div className="flex justify-between items-center bg-primary/10 p-3 border-b border-primary/20">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full animate-pulse"
                      style={{ backgroundColor: TYPE_COLOR[selected.type], boxShadow: `0 0 12px ${TYPE_COLOR[selected.type]}` }}
                    />
                    <span className="text-[11px] font-black text-white uppercase tracking-[0.2em]">{selected.type.replace('_', ' ')}</span>
                  </div>
                  <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-white px-2 py-0.5 text-xs font-black transition-colors hover:scale-110">CLOSE_</button>
              </div>
              <div className="p-4 bg-black/90 backdrop-blur-md">
                  <h3 className="text-lg font-black uppercase tracking-tight text-primary mb-1 glow-primary">{selected.label}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[9px] text-muted-foreground uppercase font-black px-2 py-0.5 bg-white/5 rounded-sm">Coordinates: {selected.lat.toFixed(4)}°N / {selected.lng.toFixed(4)}°E</span>
                  </div>
                  
                  <div className="flex flex-col gap-2 p-3 bg-white/5 border-l-2 border-primary/40">
                      <span className="text-[9px] text-primary font-black uppercase tracking-[0.2em] flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-primary animate-pulse" />
                        type: "SIGNAL" as const,
                        category: "GEOPOLITICAL" as const,
                        threatLevel: "CRITICAL" as const,
                      </span>
                      <p className="text-xs text-white/90 leading-relaxed font-medium italic underline decoration-primary/20 underline-offset-4">
                          "{selected.headline || "No recent high-impact signals detected from this sector."}"
                      </p>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-[8px] text-muted-foreground font-mono uppercase">Status: <span className="text-green-500">NOMINAL</span></span>
                    <button className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline">Full Report →</button>
                  </div>
              </div>
            </div>
          </Popup>
        )}

        <NavigationControl position="bottom-right" />
      </Map>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_150px_rgba(0,0,0,0.9)] bg-gradient-to-t from-black/40 to-transparent" />
      <MapLegend />
    </div>
  )
}

// ─── 3D Globe ─────────────────────────────────────────────────────────────────
function GlobeView() {
  const containerRef = useRef<HTMLDivElement>(null)
  const instanceRef  = useRef<any>(null)
  const rafRef       = useRef<number>(0)

  const buildGlobe = useCallback(async () => {
    const el = containerRef.current
    if (!el) return

    // Cleanup previous
    if (instanceRef.current) {
      el.innerHTML = ''
      instanceRef.current = null
    }

    try {
      const mod = await import('globe.gl')
      const GlobeFactory = mod.default as any
      if (typeof GlobeFactory !== 'function') return

      const g = GlobeFactory()
      g(el)

      const w = el.clientWidth  || window.innerWidth
      const h = el.clientHeight || window.innerHeight
      g.width(w)
      g.height(h)

      const arcsData: any[] = [];
      for (let i = 0; i < GEO_POINTS.length; i++) {
         for (let j = i + 1; j < GEO_POINTS.length; j++) {
            if (Math.random() > 0.8) {
               arcsData.push({
                  startLat: GEO_POINTS[i].lat,
                  startLng: GEO_POINTS[i].lng,
                  endLat: GEO_POINTS[j].lat,
                  endLng: GEO_POINTS[j].lng,
                  color: ['rgba(0, 255, 136, 0.9)', 'rgba(255, 153, 0, 0.9)', 'rgba(0, 170, 255, 0.9)'][Math.floor(Math.random() * 3)]
               });
            }
         }
      }

      /* Glow Effects */
      const glowStyles = `
        .glow-amber { text-shadow: 0 0 10px rgba(255, 170, 0, 0.5); }
        .glow-blue { text-shadow: 0 0 10px rgba(0, 136, 255, 0.5); }
        .glow-green { text-shadow: 0 0 10px rgba(0, 255, 136, 0.5); }
        .glow-primary { text-shadow: 0 0 15px rgba(var(--primary), 0.6); }

        /* Custom Animations */
        @keyframes ping-primary {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-ping-primary {
          animation: ping-primary 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }

        /* Map Overlays */
        .mapboxgl-popup-content {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }

        .mapboxgl-popup-tip {
          border-top-color: rgba(var(--primary), 0.4) !important;
        }
      `;

      // High-resolution realistic daytime/satellite textures
      g.globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
       .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
       .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
       .showGraticules(true)
       .showAtmosphere(true)
       .atmosphereColor("lightskyblue")
       .atmosphereAltitude(0.15)
       .htmlElementsData(GEO_POINTS)
       .htmlElement((d: GeoPoint) => {
          const el = document.createElement('div');
          const color = TYPE_COLOR[d.type];
          const isPulsing = d.type === 'conflict' || d.type === 'high_alert' || d.type === 'nuclear';
          
          el.innerHTML = `
            <div style="position:relative; width:24px; height:24px; display:flex; align-items:center; justify-content:center; cursor: crosshair;" title="${d.label}">
              ${isPulsing ? `
                <span style="position:absolute; width:100%; height:100%; border-radius:50%; animation:ping 2s ease-out infinite; opacity:0.4; border:1px solid ${color}; background-color:${color}1A;"></span>
                <div style="position:absolute; width:180%; height:1px; background-color:${color}; opacity:0.5;"></div>
                <div style="position:absolute; height:180%; width:1px; background-color:${color}; opacity:0.5;"></div>
              ` : ''}
              <span style="position:absolute; width:12px; height:12px; border:1.5px solid ${color}; box-shadow:0 0 10px ${color}; background-color:${d.type === 'conflict' ? color+'40' : color+'20'}; transform:rotate(45deg);"></span>
              <div style="position:absolute; width:4px; height:4px; background:white; box-shadow:0 0 8px white; border-radius:50%;"></div>
            </div>
          `;
          el.style.pointerEvents = 'auto';
          el.onclick = () => {
             // Optional: Handle popup or emit event
          };
          return el;
       })
       .arcsData(arcsData)
       .arcStartLat((d: any) => d.startLat)
       .arcStartLng((d: any) => d.startLng)
       .arcEndLat((d: any) => d.endLat)
       .arcEndLng((d: any) => d.endLng)
       .arcColor((d: any) => d.color)
       .arcDashLength(0.6)
       .arcDashGap(2)
       .arcDashInitialGap(() => Math.random() * 2)
       .arcDashAnimateTime(() => 1000 + Math.random() * 1500)
       .arcStroke(0.6)

      // Auto-rotate
      const controls = g.controls()
      if (controls) {
        controls.autoRotate      = true
        controls.autoRotateSpeed = 0.35
        controls.enableZoom      = true
      }

      // Keep canvas size in sync
      const ro = new ResizeObserver(() => {
        if (el) {
          g.width(el.clientWidth)
          g.height(el.clientHeight)
        }
      })
      ro.observe(el)

      instanceRef.current = { g, ro }
    } catch (err) {
      console.error('[GlobeView]', err)
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(buildGlobe, 80)
    return () => {
      clearTimeout(t)
      cancelAnimationFrame(rafRef.current)
      if (instanceRef.current) {
        instanceRef.current.ro?.disconnect()
        if (containerRef.current) containerRef.current.innerHTML = ''
        instanceRef.current = null
      }
    }
  }, [buildGlobe])

  return (
    <div ref={containerRef} className="w-full h-full bg-[#020209]" />
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function MapView() {
  const { mapMode } = useDashboardStore()

  return (
    <div className="w-full h-full relative">
      {mapMode === '2D' ? <FlatMap /> : <GlobeView />}
    </div>
  )
}
