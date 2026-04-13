import axios from 'axios'

export interface Signal {
  id: string
  source: string
  intensity: number
  location: [number, number]
  timestamp: string
  metadata: any
}

export const fetchIntelligenceSignals = async (): Promise<Signal[]> => {
  // In a real app, this would call the Mastra agent endpoints
  // For now, we simulate dynamic signal generation
  return [
    {
      id: 'sig-1',
      source: 'Market-Nexus',
      intensity: 0.85,
      location: [34.5, 31.5],
      timestamp: new Date().toISOString(),
      metadata: { type: 'economic', detail: 'Nickel Volatility Spike' }
    },
    {
       id: 'sig-2',
       source: 'Nature-Sentinel',
       intensity: 0.92,
       location: [114.1, 22.3],
       timestamp: new Date().toISOString(),
       metadata: { type: 'environmental', detail: 'Pressure Drop - Logistics Impact' }
    }
  ]
}
