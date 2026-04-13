import { create } from 'zustand'

export type MapMode = '2D' | '3D'
export type ActivePage = 'dashboard' | 'map' | 'commodities' | 'indices' | 'nexus' | 'nexus-query'

interface DashboardState {
  isSidebarOpen: boolean
  mapMode: MapMode
  selectedPanel: string | null
  activeLayers: string[]
  activePage: ActivePage
  pendingQuery: string | null

  toggleSidebar: () => void
  setMapMode: (mode: MapMode) => void
  setSelectedPanel: (id: string | null) => void
  toggleLayer: (id: string) => void
  setActivePage: (page: ActivePage) => void
  setPendingQuery: (query: string | null) => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  isSidebarOpen: true,
  mapMode: '3D',
  selectedPanel: null,
  activeLayers: ['natural_events', 'conflict_zones'],
  activePage: 'dashboard',
  pendingQuery: null,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setMapMode: (mode) => set({ mapMode: mode }),
  setSelectedPanel: (id) => set({ selectedPanel: id }),
  toggleLayer: (id) => set((state) => ({
    activeLayers: state.activeLayers.includes(id)
      ? state.activeLayers.filter((l) => l !== id)
      : [...state.activeLayers, id],
  })),
  setActivePage: (page) => set({ activePage: page }),
  setPendingQuery: (query) => set({ pendingQuery: query }),
}))
