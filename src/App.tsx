import { useEffect, useMemo, useState } from 'react'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Icon } from './components/Icons'
import { OnboardingOverlay, shouldShowOnboarding } from './components/OnboardingOverlay'
import type { CuboidDimensions } from './components/CuboidScene'
import type { DimensionKey } from './components/DimensionControl'
import { useLanguage, useTranslate } from './i18n/i18n'
import { CubeLessonPage } from './pages/CubeLessonPage'
import { HomePage } from './pages/HomePage'
import { LessonPage } from './pages/LessonPage'
import { PlaygroundPage } from './pages/PlaygroundPage'
import {
  INITIAL_DIMENSIONS, loadSavedState, saveState, clearSavedState,
  getSavedProgress, saveProgress, clearProgress,
  getCubeProgress, saveCubeProgress, clearCubeProgress,
  clampDimension, clampEdge,
} from './storage'
import type { Page, DisplayMode, LessonTask } from './types'

function App() {
  const t = useTranslate()
  const { lang, setLang } = useLanguage()
  const saved = useMemo(() => loadSavedState(), [])
  const [page, setPage] = useState<Page>('home')

  // Cuboid lesson state
  const [dimensions, setDimensions] = useState<CuboidDimensions>(saved?.dimensions ?? INITIAL_DIMENSIONS)
  const [selectedDimension, setSelectedDimension] = useState<DimensionKey>(saved?.selectedDimension ?? 'height')
  const [displayMode, setDisplayMode] = useState<DisplayMode>(saved?.displayMode ?? '3d')
  const [showUnits, setShowUnits] = useState(saved?.showUnits ?? false)
  const [resetToken, setResetToken] = useState(0)
  const [activeTask, setActiveTask] = useState(saved?.activeTask ?? 0)
  const [hasExplored, setHasExplored] = useState(saved?.hasExplored ?? false)
  const [taskCompleted, setTaskCompleted] = useState(() => getSavedProgress() ? [true, true, true, true] : (saved?.taskCompleted ?? [false, false, false, false]))
  const [lessonComplete, setLessonComplete] = useState(getSavedProgress)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [celebration, setCelebration] = useState(false)

  // Cube lesson state
  const [cubeEdge, setCubeEdge] = useState(2)
  const [cubeShowUnits, setCubeShowUnits] = useState(false)
  const [cubeResetToken, setCubeResetToken] = useState(0)
  const [cubeActiveTask, setCubeActiveTask] = useState(0)
  const [cubeHasExplored, setCubeHasExplored] = useState(false)
  const [cubeTaskCompleted, setCubeTaskCompleted] = useState([false, false, false])
  const [cubeComplete, setCubeComplete] = useState(getCubeProgress)

  // Derived
  const volume = dimensions.length * dimensions.width * dimensions.height
  const baseArea = dimensions.length * dimensions.width
  const surfaceArea = 2 * (dimensions.length * dimensions.width + dimensions.length * dimensions.height + dimensions.width * dimensions.height)
  const isInitialSize = volume === 24 && dimensions.length === 4 && dimensions.width === 3 && dimensions.height === 2

  const taskCanBeCompleted = useMemo(() => [
    hasExplored && dimensions.height > INITIAL_DIMENSIONS.height,
    taskCompleted[0] && hasExplored && volume === 24,
    taskCompleted[1] && volume === 24 && !isInitialSize,
    taskCompleted[2] && hasExplored && surfaceArea <= 50,
  ], [hasExplored, volume, isInitialSize, surfaceArea, dimensions.height, taskCompleted])

  const lessonTasks = useMemo<LessonTask[]>(() => t('tasks') as unknown as LessonTask[], [t])
  const currentTask = lessonTasks[activeTask]
  const currentTaskComplete = taskCompleted[activeTask] || taskCanBeCompleted[activeTask]
  const overallProgress = lessonComplete ? 100 : Math.round((taskCompleted.filter(Boolean).length / lessonTasks.length) * 100)

  // Cube derived
  const cubeTasks = useMemo<LessonTask[]>(() => t('cubeTasks') as unknown as LessonTask[], [t])
  const cubeSurfaceArea = 6 * cubeEdge * cubeEdge
  const cubeVolume = cubeEdge * cubeEdge * cubeEdge
  const cubeTaskCanBeCompleted = useMemo(() => [
    cubeHasExplored,
    cubeTaskCompleted[0] && cubeHasExplored && cubeEdge === 3,
    cubeTaskCompleted[1] && cubeHasExplored && cubeSurfaceArea === 54,
  ], [cubeHasExplored, cubeEdge, cubeSurfaceArea, cubeTaskCompleted])
  const cubeCurrentTask = cubeTasks[cubeActiveTask]
  const cubeCurrentTaskComplete = cubeTaskCompleted[cubeActiveTask] || cubeTaskCanBeCompleted[cubeActiveTask]

  // Actions
  const openLesson = () => {
    setPage('lesson')
    setDisplayMode('3d')
    if (shouldShowOnboarding() && !getSavedProgress()) setShowOnboarding(true)
  }

  const updateDimension = (dimension: DimensionKey, value: number) => {
    setHasExplored(true)
    setDimensions((current) => ({ ...current, [dimension]: clampDimension(value) }))
  }

  const nudgeDimension = (dimension: DimensionKey, delta: number) => {
    setHasExplored(true)
    setDimensions((current) => ({ ...current, [dimension]: clampDimension(current[dimension] + delta) }))
  }

  const resetLesson = () => {
    setDimensions(INITIAL_DIMENSIONS)
    setSelectedDimension('height')
    setShowUnits(false)
    setDisplayMode('3d')
    setActiveTask(0)
    setHasExplored(false)
    setTaskCompleted([false, false, false, false])
    setLessonComplete(false)
    setResetToken((token) => token + 1)
    clearSavedState()
    clearProgress()
  }

  const advanceTask = () => {
    if (!currentTaskComplete) return
    const nextCompleted = taskCompleted.map((c, i) => i === activeTask ? true : c)
    setTaskCompleted(nextCompleted)
    setCelebration(true)
    window.setTimeout(() => setCelebration(false), 2000)
    if (activeTask < lessonTasks.length - 1) {
      setActiveTask((task) => task + 1)
    } else if (nextCompleted.every(Boolean)) {
      setLessonComplete(true)
      saveProgress()
    }
  }

  const nudgeCubeEdge = (delta: number) => {
    setCubeHasExplored(true)
    setCubeEdge((current) => clampEdge(current + delta))
  }

  const resetCube = () => {
    setCubeEdge(2)
    setCubeShowUnits(false)
    setCubeActiveTask(0)
    setCubeHasExplored(false)
    setCubeTaskCompleted([false, false, false])
    setCubeComplete(false)
    setCubeResetToken((token) => token + 1)
    clearCubeProgress()
  }

  const advanceCubeTask = () => {
    if (!cubeCurrentTaskComplete) return
    const nextCompleted = cubeTaskCompleted.map((c, i) => i === cubeActiveTask ? true : c)
    setCubeTaskCompleted(nextCompleted)
    setCelebration(true)
    window.setTimeout(() => setCelebration(false), 2000)
    if (cubeActiveTask < cubeTasks.length - 1) {
      setCubeActiveTask((task) => task + 1)
    } else if (nextCompleted.every(Boolean)) {
      setCubeComplete(true)
      saveCubeProgress()
    }
  }

  // Persist
  useEffect(() => {
    if (page === 'lesson') {
      saveState({ dimensions, activeTask, displayMode, showUnits, selectedDimension, taskCompleted, hasExplored })
    }
  }, [page, dimensions, activeTask, displayMode, showUnits, selectedDimension, taskCompleted, hasExplored])

  const closeOnboarding = () => setShowOnboarding(false)

  return (
    <div className="app-shell">
      {showOnboarding && <OnboardingOverlay onComplete={closeOnboarding} />}
      {celebration && (
        <div className="celebration-overlay" aria-live="polite">
          <div className="celebration-card">
            <span className="celebration-sparkle">✦</span>
            <span className="celebration-sparkle right">✦</span>
            <p>{t('celebrationText')}</p>
          </div>
        </div>
      )}
      <header className="site-header">
        <button className="brand" type="button" onClick={() => setPage('home')} aria-label="返回小小数学家首页">
          <span className="brand-mark"><span /><span /><span /></span>
          <span className="brand-copy">
            <strong>{t('brandTitle')}</strong>
            <small>{t('brandSubtitle')}</small>
          </span>
        </button>
        <nav className="main-nav" aria-label="主导航">
          <button className={page === 'home' ? 'nav-link active' : 'nav-link'} type="button" onClick={() => setPage('home')}>
            <Icon name="home" size={16} />{t('navHome')}
          </button>
          <button className={page === 'lesson' || page === 'cube' || page === 'playground' ? 'nav-link active' : 'nav-link'} type="button" onClick={openLesson}>
            <Icon name="cube" size={16} />{t('navLesson')}
          </button>
        </nav>
        <div className="header-actions">
          <button className="lang-button" type="button" onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} aria-label={lang === 'zh' ? 'Switch to English' : '切换到中文'}>{t('langSwitch')}</button>
          <button className="sound-button" type="button" aria-label="打开声音设置"><Icon name="volume" size={18} /></button>
          <div className="mini-avatar" aria-label="小小数学家头像">{lang === 'zh' ? '小' : 'M'}</div>
        </div>
      </header>

      {page === 'home' && (
        <HomePage progress={overallProgress} lessonComplete={lessonComplete} cubeComplete={cubeComplete} onOpenLesson={openLesson} onOpenCube={() => setPage('cube')} onOpenPlayground={() => setPage('playground')} />
      )}
      {page === 'lesson' && (
        <ErrorBoundary fallback={<div className="error-fallback"><span className="error-icon">🔧</span><p>3D 场景加载失败，请切换到 2D 视图或刷新页面。</p></div>}>
        <LessonPage
          dimensions={dimensions} volume={volume} baseArea={baseArea}
          displayMode={displayMode} showUnits={showUnits} selectedDimension={selectedDimension}
          resetToken={resetToken} activeTask={activeTask} completedTasks={taskCompleted}
          currentTask={currentTask} lessonTasks={lessonTasks}
          currentTaskComplete={currentTaskComplete} lessonComplete={lessonComplete}
          onBack={() => setPage('home')}
          onChangeDisplayMode={setDisplayMode}
          onToggleUnits={() => setShowUnits((v) => !v)}
          onSelectDimension={setSelectedDimension}
          onChangeDimension={updateDimension}
          onNudgeDimension={nudgeDimension}
          onReset={() => setResetToken((token) => token + 1)}
          onResetLesson={resetLesson}
          onAdvanceTask={advanceTask}
          onSelectTask={setActiveTask}
        />
        </ErrorBoundary>
      )}
      {page === 'cube' && (
        <ErrorBoundary fallback={<div className="error-fallback"><span className="error-icon">🔧</span><p>3D 场景加载失败，请刷新页面。</p></div>}>
        <CubeLessonPage
          cubeEdge={cubeEdge} cubeShowUnits={cubeShowUnits} cubeResetToken={cubeResetToken}
          cubeActiveTask={cubeActiveTask} cubeTasks={cubeTasks}
          cubeCurrentTask={cubeCurrentTask} cubeCurrentTaskComplete={cubeCurrentTaskComplete}
          cubeTaskCompleted={cubeTaskCompleted} cubeComplete={cubeComplete}
          cubeSurfaceArea={cubeSurfaceArea} cubeVolume={cubeVolume}
          onBack={() => setPage('home')}
          onToggleUnits={() => setCubeShowUnits((v) => !v)}
          onNudgeEdge={nudgeCubeEdge}
          onReset={() => setCubeResetToken((token) => token + 1)}
          onResetLesson={resetCube}
          onAdvanceTask={advanceCubeTask}
          onSelectTask={setCubeActiveTask}
        />
        </ErrorBoundary>
      )}
      {page === 'playground' && <PlaygroundPage onBack={() => setPage('home')} />}
    </div>
  )
}

export default App
