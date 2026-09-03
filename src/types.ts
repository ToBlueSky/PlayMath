import type { CuboidDimensions } from './components/CuboidScene'
import type { DimensionKey } from './components/DimensionControl'

export type Page = 'home' | 'lesson' | 'cube' | 'playground'
export type DisplayMode = '3d' | '2d' | 'net'
export type LessonTask = { eyebrow: string; title: string; description: string; hint: string }

export type SavedState = {
  dimensions: CuboidDimensions
  activeTask: number
  displayMode: DisplayMode
  showUnits: boolean
  selectedDimension: DimensionKey
  taskCompleted: boolean[]
  hasExplored: boolean
}
