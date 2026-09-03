import type { CuboidDimensions } from './components/CuboidScene'
import type { SavedState } from './types'

export const INITIAL_DIMENSIONS: CuboidDimensions = { length: 4, width: 3, height: 2 }
const STATE_KEY = 'little-math-state'
const PROGRESS_KEY = 'little-math-progress'
const CUBE_PROGRESS_KEY = 'little-math-cube-progress'

export function loadSavedState(): SavedState | null {
  try {
    const raw = window.localStorage.getItem(STATE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SavedState
    if (!parsed.dimensions || !Number.isFinite(parsed.dimensions.length)) return null
    return parsed
  } catch {
    return null
  }
}

export function saveState(state: SavedState) {
  try {
    window.localStorage.setItem(STATE_KEY, JSON.stringify(state))
  } catch { /* ignore */ }
}

export function clearSavedState() {
  try {
    window.localStorage.removeItem(STATE_KEY)
  } catch { /* ignore */ }
}

export function getSavedProgress(): boolean {
  try {
    return window.localStorage.getItem(PROGRESS_KEY) === 'cuboid-complete'
  } catch {
    return false
  }
}

export function saveProgress() {
  try {
    window.localStorage.setItem(PROGRESS_KEY, 'cuboid-complete')
  } catch { /* ignore */ }
}

export function clearProgress() {
  try {
    window.localStorage.removeItem(PROGRESS_KEY)
  } catch { /* ignore */ }
}

export function getCubeProgress(): boolean {
  try {
    return window.localStorage.getItem(CUBE_PROGRESS_KEY) === 'cube-complete'
  } catch {
    return false
  }
}

export function saveCubeProgress() {
  try {
    window.localStorage.setItem(CUBE_PROGRESS_KEY, 'cube-complete')
  } catch { /* ignore */ }
}

export function clearCubeProgress() {
  try {
    window.localStorage.removeItem(CUBE_PROGRESS_KEY)
  } catch { /* ignore */ }
}

export function clampDimension(value: number): number {
  if (!Number.isFinite(value)) return 1
  return Math.min(6, Math.max(1, Math.round(value)))
}

export function clampEdge(value: number): number {
  if (!Number.isFinite(value)) return 1
  return Math.min(6, Math.max(1, Math.round(value)))
}
