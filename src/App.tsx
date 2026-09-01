import { useEffect, useMemo, useState } from 'react'
import { CuboidDiagram } from './components/CuboidDiagram'
import { CuboidScene, type CuboidDimensions } from './components/CuboidScene'
import { DimensionControl, type DimensionKey } from './components/DimensionControl'
import { Icon } from './components/Icons'
import { Mascot } from './components/Mascot'
import { useLanguage, useTranslate } from './i18n/i18n'

type Page = 'home' | 'lesson'
type DisplayMode = '3d' | '2d'

const INITIAL_DIMENSIONS: CuboidDimensions = { length: 4, width: 3, height: 2 }

function getSavedProgress() {
  try {
    return window.localStorage.getItem('little-math-progress') === 'cuboid-complete'
  } catch {
    return false
  }
}

function saveProgress() {
  try {
    window.localStorage.setItem('little-math-progress', 'cuboid-complete')
  } catch {
    // The lesson remains usable when storage is unavailable.
  }
}

function clampDimension(value: number) {
  if (!Number.isFinite(value)) return 1
  return Math.min(6, Math.max(1, Math.round(value)))
}

function App() {
  const t = useTranslate()
  const { lang, setLang } = useLanguage()
  const [page, setPage] = useState<Page>('home')
  const [dimensions, setDimensions] = useState<CuboidDimensions>(INITIAL_DIMENSIONS)
  const [selectedDimension, setSelectedDimension] = useState<DimensionKey>('height')
  const [displayMode, setDisplayMode] = useState<DisplayMode>('3d')
  const [showUnits, setShowUnits] = useState(false)
  const [resetToken, setResetToken] = useState(0)
  const [activeTask, setActiveTask] = useState(0)
  const [hasExplored, setHasExplored] = useState(false)
  const [taskCompleted, setTaskCompleted] = useState(() => getSavedProgress() ? [true, true, true] : [false, false, false])
  const [lessonComplete, setLessonComplete] = useState(getSavedProgress)

  const volume = dimensions.length * dimensions.width * dimensions.height
  const baseArea = dimensions.length * dimensions.width
  const isInitialSize = volume === 24 && dimensions.length === 4 && dimensions.width === 3 && dimensions.height === 2

  const taskCanBeCompleted = useMemo(() => [
    hasExplored && dimensions.height > INITIAL_DIMENSIONS.height,
    taskCompleted[0] && hasExplored && volume === 24,
    taskCompleted[1] && volume === 24 && !isInitialSize,
  ], [hasExplored, volume, isInitialSize, dimensions.height, taskCompleted])

  const lessonTasks = useMemo<LessonTask[]>(() => t('tasks') as unknown as LessonTask[], [t])
  const currentTask = lessonTasks[activeTask]
  const completedTasks = taskCompleted
  const currentTaskComplete = taskCompleted[activeTask] || taskCanBeCompleted[activeTask]
  const overallProgress = lessonComplete ? 100 : Math.round((completedTasks.filter(Boolean).length / lessonTasks.length) * 100)

  const updateDimension = (dimension: DimensionKey, value: number) => {
    setHasExplored(true)
    setDimensions((current) => ({ ...current, [dimension]: clampDimension(value) }))
  }

  const nudgeDimension = (dimension: DimensionKey, delta: number) => {
    setHasExplored(true)
    setDimensions((current) => ({
      ...current,
      [dimension]: clampDimension(current[dimension] + delta),
    }))
  }

  const resetLesson = () => {
    setDimensions(INITIAL_DIMENSIONS)
    setSelectedDimension('height')
    setShowUnits(false)
    setDisplayMode('3d')
    setActiveTask(0)
    setHasExplored(false)
    setTaskCompleted([false, false, false])
    setLessonComplete(false)
    setResetToken((token) => token + 1)
    try {
      window.localStorage.removeItem('little-math-progress')
    } catch {
      // Resetting the lesson does not depend on storage.
    }
  }

  const openLesson = () => {
    setPage('lesson')
    setDisplayMode('3d')
  }

  const advanceTask = () => {
    if (!currentTaskComplete) return
    const nextCompleted = taskCompleted.map((completed, index) => index === activeTask ? true : completed)
    setTaskCompleted(nextCompleted)
    if (activeTask < lessonTasks.length - 1) {
      setActiveTask((task) => task + 1)
    } else if (nextCompleted.every(Boolean)) {
      setLessonComplete(true)
      saveProgress()
    }
  }

  return (
    <div className="app-shell">
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
          <button className={page === 'lesson' ? 'nav-link active' : 'nav-link'} type="button" onClick={openLesson}>
            <Icon name="cube" size={16} />{t('navLesson')}
          </button>
        </nav>
        <div className="header-actions">
          <button className="lang-button" type="button" onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')} aria-label={lang === 'zh' ? 'Switch to English' : '切换到中文'}>{t('langSwitch')}</button>
          <button className="sound-button" type="button" aria-label="打开声音设置"><Icon name="volume" size={18} /></button>
          <div className="mini-avatar" aria-label="小小数学家头像">{lang === 'zh' ? '小' : 'M'}</div>
        </div>
      </header>

      {page === 'home' ? (
        <HomePage progress={overallProgress} lessonComplete={lessonComplete} onOpenLesson={openLesson} />
      ) : (
        <LessonPage
          dimensions={dimensions}
          volume={volume}
          baseArea={baseArea}
          displayMode={displayMode}
          showUnits={showUnits}
          selectedDimension={selectedDimension}
          resetToken={resetToken}
          activeTask={activeTask}
          completedTasks={completedTasks}
          currentTask={currentTask}
          lessonTasks={lessonTasks}
          currentTaskComplete={currentTaskComplete}
          lessonComplete={lessonComplete}
          onBack={() => setPage('home')}
          onChangeDisplayMode={setDisplayMode}
          onToggleUnits={() => setShowUnits((visible) => !visible)}
          onSelectDimension={setSelectedDimension}
          onChangeDimension={updateDimension}
          onNudgeDimension={nudgeDimension}
          onReset={() => setResetToken((token) => token + 1)}
          onResetLesson={resetLesson}
          onAdvanceTask={advanceTask}
          onSelectTask={setActiveTask}
        />
      )}
    </div>
  )
}

type HomePageProps = {
  progress: number
  lessonComplete: boolean
  onOpenLesson: () => void
}

function HomePage({ progress, lessonComplete, onOpenLesson }: HomePageProps) {
  const t = useTranslate()
  return (
    <main className="home-page">
      <section className="home-hero page-width">
        <div className="hero-copy">
          <div className="eyebrow-pill"><span className="eyebrow-dot" />{t('heroEyebrow')}</div>
          <h1>{t('heroTitle1')}<br /><em>{t('heroTitle2')}</em></h1>
          <p className="hero-description">{t('heroDescription')}</p>
          <button className="primary-button hero-button" type="button" onClick={onOpenLesson}>
            <span>{lessonComplete ? t('heroContinue') : t('heroStart')}</span>
            <Icon name="arrow" size={19} />
          </button>
          <div className="hero-trust"><span className="trust-stars">✦ ✦ ✦</span><span>{t('trustGrade')}</span><span className="trust-divider" /><span>{t('trustTime')}</span></div>
        </div>
        <div className="hero-art" aria-label="数学小方块正在探索长方体">
          <div className="sun-disc" />
          <div className="doodle doodle-cross">+</div>
          <div className="doodle doodle-circle">○</div>
          <div className="doodle doodle-star">✦</div>
          <div className="art-ground" />
          <div className="floating-cube cube-one"><span /></div>
          <div className="floating-cube cube-two"><span /></div>
          <Mascot />
          <div className="speech-bubble"><span>{t('speech')}</span><i /></div>
        </div>
      </section>

      <section className="home-content page-width">
        <div className="section-heading">
          <div>
            <span className="section-kicker">{t('sectionKicker')}</span>
            <h2>{t('homeHeading')}</h2>
          </div>
          <button className="text-button" type="button" onClick={onOpenLesson}>{t('seeAll')} <Icon name="arrow" size={15} /></button>
        </div>

        <div className="explore-grid">
          <button className="explore-card featured-card" type="button" onClick={onOpenLesson}>
            <div className="card-topline"><span className="status-chip"><span />{t('learningChip')}</span><span className="card-arrow"><Icon name="arrow" size={17} /></span></div>
            <div className="featured-illustration"><div className="illustration-shadow" /><div className="illustration-box"><i /><b /><strong /></div><div className="illustration-ruler">↔</div></div>
            <div className="card-copy">
              <span className="card-kicker">{t('card1Kicker')}</span>
              <h3>{t('card1Title')}</h3>
              <p>{t('card1Desc')}</p>
              <div className="progress-row"><span className="progress-track"><i style={{ width: `${progress}%` }} /></span><strong>{progress ? `${progress}%` : t('progressReady')}</strong></div>
            </div>
          </button>
          <button className="explore-card coming-card" type="button" onClick={onOpenLesson}>
            <div className="card-topline"><span className="status-chip muted-chip">{t('comingChip')}</span><span className="card-arrow"><Icon name="arrow" size={17} /></span></div>
            <div className="coming-illustration"><div className="triangle-shape" /><div className="circle-shape" /><div className="square-shape" /><span>?</span></div>
            <div className="card-copy"><span className="card-kicker">{t('card2Kicker')}</span><h3>{t('card2Title')}</h3><p>{t('card2Desc')}</p><span className="coming-link">{t('comingSoon')} <span>·</span> {t('expected')}</span></div>
          </button>
          <button className="explore-card free-card" type="button" onClick={onOpenLesson}>
            <div className="card-topline"><span className="status-chip free-chip">{t('freeChip')}</span><span className="card-arrow"><Icon name="arrow" size={17} /></span></div>
            <div className="free-illustration"><span className="free-block block-a" /><span className="free-block block-b" /><span className="free-block block-c" /><span className="free-block block-d" /><span className="free-sparkle">✦</span></div>
            <div className="card-copy"><span className="card-kicker">{t('freeKicker')}</span><h3>{t('freeTitle')}</h3><p>{t('freeDesc')}</p><span className="coming-link dark-link">{t('enterPlayground')} <Icon name="arrow" size={14} /></span></div>
          </button>
        </div>

        <div className="home-bottom-grid">
          <div className="daily-card">
            <div className="daily-icon"><Icon name="sparkle" size={24} /></div>
            <div><span className="section-kicker">{t('dailyKicker')}</span><h3>{t('dailyTitle')}</h3><p>{t('dailyDesc')}</p></div>
            <button className="round-arrow" type="button" onClick={onOpenLesson} aria-label={t('dailyKicker')}><Icon name="arrow" size={18} /></button>
          </div>
          <div className="streak-card"><div className="streak-orbit"><span>3</span><i>{t('streakDays')}</i></div><div><span className="section-kicker">{t('streakKicker')}</span><h3>{t('streakTitle')}</h3><p>{t('streakDesc')}</p></div><span className="streak-star">✦</span></div>
        </div>
      </section>
    </main>
  )
}

type LessonTask = { eyebrow: string; title: string; description: string; hint: string }

type LessonPageProps = {
  dimensions: CuboidDimensions
  volume: number
  baseArea: number
  displayMode: DisplayMode
  showUnits: boolean
  selectedDimension: DimensionKey
  resetToken: number
  activeTask: number
  completedTasks: boolean[]
  currentTask: LessonTask
  lessonTasks: LessonTask[]
  currentTaskComplete: boolean
  lessonComplete: boolean
  onBack: () => void
  onChangeDisplayMode: (mode: DisplayMode) => void
  onToggleUnits: () => void
  onSelectDimension: (dimension: DimensionKey) => void
  onChangeDimension: (dimension: DimensionKey, value: number) => void
  onNudgeDimension: (dimension: DimensionKey, delta: number) => void
  onReset: () => void
  onResetLesson: () => void
  onAdvanceTask: () => void
  onSelectTask: (task: number) => void
}

function LessonPage({
  dimensions,
  volume,
  baseArea,
  displayMode,
  showUnits,
  selectedDimension,
  resetToken,
  activeTask,
  completedTasks,
  currentTask,
  lessonTasks,
  currentTaskComplete,
  lessonComplete,
  onBack,
  onChangeDisplayMode,
  onToggleUnits,
  onSelectDimension,
  onChangeDimension,
  onNudgeDimension,
  onReset,
  onResetLesson,
  onAdvanceTask,
  onSelectTask,
}: LessonPageProps) {
  const t = useTranslate()
  const dimensionNames: Record<DimensionKey, string> = { length: t('legendLength'), width: t('legendWidth'), height: t('legendHeight') }

  return (
    <main className="lesson-page page-width">
      <div className="lesson-breadcrumb"><button className="back-button" type="button" onClick={onBack}><Icon name="back" size={17} />{t('backToExplore')}</button><span>/</span><span>{t('geometry')}</span><span>/</span><strong>{t('cuboidTitle')}</strong></div>
      <div className="lesson-title-row"><div><span className="section-kicker">{t('lessonKicker')}</span><h1>{t('cuboidTitle')}</h1></div><div className="lesson-progress"><div className="lesson-progress-copy"><span>{t('progressLabel')}</span><strong>{lessonComplete ? t('progressDone') : `${completedTasks.filter(Boolean).length} / 3`}</strong></div><span className="progress-track"><i style={{ width: `${lessonComplete ? 100 : Math.max(12, completedTasks.filter(Boolean).length / 3 * 100)}%` }} /></span></div></div>

      <div className="lesson-layout">
        <section className="workbench-card">
          <div className="workbench-toolbar"><div className="mode-switch" role="tablist" aria-label="视图模式"><button className={displayMode === '3d' ? 'mode-button active' : 'mode-button'} type="button" role="tab" aria-selected={displayMode === '3d'} onClick={() => onChangeDisplayMode('3d')}><Icon name="cube" size={16} />{t('mode3d')}</button><button className={displayMode === '2d' ? 'mode-button active' : 'mode-button'} type="button" role="tab" aria-selected={displayMode === '2d'} onClick={() => onChangeDisplayMode('2d')}><Icon name="layers" size={16} />{t('mode2d')}</button></div><div className="toolbar-actions"><button className={showUnits ? 'tool-button active' : 'tool-button'} type="button" onClick={onToggleUnits}><Icon name="layers" size={16} />{showUnits ? t('hideUnits') : t('showUnits')}</button><button className="tool-button icon-only" type="button" onClick={onReset} aria-label={t('resetView')}><Icon name="rotate" size={17} /></button></div></div>
          <div className="workbench-stage">
            {displayMode === '3d' ? <CuboidScene dimensions={dimensions} selectedDimension={selectedDimension} showUnits={showUnits} resetToken={resetToken} onSelectDimension={onSelectDimension} onChangeDimension={onNudgeDimension} /> : <CuboidDiagram dimensions={dimensions} />}
            {displayMode === '3d' && <div className="stage-tip"><span className="tip-hand"><Icon name="cursor" size={16} /></span><span>{t('stageTip')}</span></div>}
          </div>
          <div className="workbench-footer"><div className="selection-note"><span className="selected-dot" style={{ backgroundColor: selectedDimension === 'length' ? '#f39a68' : selectedDimension === 'width' ? '#62bce4' : '#63c69f' }} /><span>{t('selectedLabel')}<strong>{dimensionNames[selectedDimension]}</strong></span><small>{t('tryAnother')}</small></div><div className="scene-legend"><span><i className="legend-dot orange" />{t('legendLength')}</span><span><i className="legend-dot blue" />{t('legendWidth')}</span><span><i className="legend-dot green" />{t('legendHeight')}</span></div></div>
        </section>

        <aside className="lesson-sidebar">
          <section className="mission-card"><div className="mission-header"><div><span className="section-kicker">{currentTask.eyebrow}</span><h2>{currentTask.title}</h2></div><span className="mission-number">{t('missionNumber', activeTask + 1)}</span></div><p>{currentTask.description}</p><div className={currentTaskComplete ? 'feedback-box success-feedback' : 'feedback-box'}><span className="feedback-icon"><Icon name={currentTaskComplete ? 'check' : 'sparkle'} size={16} /></span><span>{currentTaskComplete ? t('successFeedback') : currentTask.hint}</span></div><button className={currentTaskComplete ? 'primary-button task-button' : 'primary-button task-button disabled-button'} type="button" onClick={onAdvanceTask} disabled={!currentTaskComplete}>{activeTask === 2 && currentTaskComplete ? t('completeExplore') : t('completeStation')}<Icon name="arrow" size={17} /></button></section>
          <section className="dimensions-card"><div className="sidebar-heading"><div><span className="section-kicker">{t('myCuboid')}</span><h2>{t('adjustTitle')}</h2></div><button className="reset-link" type="button" onClick={onResetLesson}><Icon name="refresh" size={15} />{t('reset')}</button></div><div className="dimension-list"><DimensionControl dimension="length" value={dimensions.length} onChange={(value) => onChangeDimension('length', value)} onSelect={() => onSelectDimension('length')} selected={selectedDimension === 'length'} /><DimensionControl dimension="width" value={dimensions.width} onChange={(value) => onChangeDimension('width', value)} onSelect={() => onSelectDimension('width')} selected={selectedDimension === 'width'} /><DimensionControl dimension="height" value={dimensions.height} onChange={(value) => onChangeDimension('height', value)} onSelect={() => onSelectDimension('height')} selected={selectedDimension === 'height'} /></div><div className="formula-card"><div className="formula-label"><span className="formula-symbol">×</span><span>{t('baseAreaLabel')}</span></div><strong>{dimensions.length} × {dimensions.width} = {baseArea}<small>{t('squareCm')}</small></strong><div className="formula-divider" /><div className="formula-label"><span className="formula-symbol volume-symbol">◆</span><span>{t('volumeLabel')}</span></div><strong className="volume-number">{baseArea} × {dimensions.height} = <b>{volume}</b><small>{t('cubicCm')}</small></strong></div></section>
          <section className="route-card"><div className="route-header"><span className="section-kicker">{t('routeKicker')}</span><span>{t('routeDone', completedTasks.filter(Boolean).length)}</span></div><div className="route-list">{lessonTasks.map((task, index) => <button className={`route-item ${index === activeTask ? 'active' : ''} ${completedTasks[index] ? 'complete' : ''}`} type="button" key={task.title} onClick={() => onSelectTask(index)} disabled={index > 0 && !completedTasks[index - 1]}><span className="route-marker">{completedTasks[index] ? <Icon name="check" size={13} /> : `0${index + 1}`}</span><span>{task.title}</span><Icon name="arrow" size={14} /></button>)}</div><div className="mascot-note"><Mascot small /><span>{t('mascotNote1')}<br /><strong>{t('mascotNote2')}</strong></span></div></section>
        </aside>
      </div>
    </main>
  )
}

export default App
