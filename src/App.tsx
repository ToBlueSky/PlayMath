import { useEffect, useMemo, useState } from 'react'
import { CuboidDiagram } from './components/CuboidDiagram'
import { CuboidScene, type CuboidDimensions } from './components/CuboidScene'
import { DimensionControl, type DimensionKey } from './components/DimensionControl'
import { Icon } from './components/Icons'
import { Mascot } from './components/Mascot'

type Page = 'home' | 'lesson'
type DisplayMode = '3d' | '2d'

const INITIAL_DIMENSIONS: CuboidDimensions = { length: 4, width: 3, height: 2 }
const DIMENSION_NAMES: Record<DimensionKey, string> = { length: '长', width: '宽', height: '高' }

const lessonTasks = [
  {
    eyebrow: '第一站 · 先玩一玩',
    title: '让盒子长高一点',
    description: '拖动绿色的小点，看看盒子里能多放进几层小方块。',
    hint: '试着把“高”从 2 变成 3。',
  },
  {
    eyebrow: '第二站 · 找到规律',
    title: '把体积调成 24 立方厘米',
    description: '改变长、宽、高，找到一个刚好装下 24 个小方块的盒子。',
    hint: '现在的盒子刚好是 4 × 3 × 2。',
  },
  {
    eyebrow: '第三站 · 小小设计师',
    title: '再找一个不同的盒子',
    description: '保持体积不变，试着设计一个和刚才不一样的长方体。',
    hint: '想想看，2 × 3 × 4 还可以怎样组合？',
  },
]

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
            <strong>小小数学家</strong>
            <small>让数学动起来</small>
          </span>
        </button>
        <nav className="main-nav" aria-label="主导航">
          <button className={page === 'home' ? 'nav-link active' : 'nav-link'} type="button" onClick={() => setPage('home')}>
            <Icon name="home" size={16} />首页
          </button>
          <button className={page === 'lesson' ? 'nav-link active' : 'nav-link'} type="button" onClick={openLesson}>
            <Icon name="cube" size={16} />我的探索
          </button>
        </nav>
        <div className="header-actions">
          <button className="sound-button" type="button" aria-label="打开声音设置"><Icon name="volume" size={18} /></button>
          <div className="mini-avatar" aria-label="小小数学家头像">小</div>
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
  return (
    <main className="home-page">
      <section className="home-hero page-width">
        <div className="hero-copy">
          <div className="eyebrow-pill"><span className="eyebrow-dot" />今天也来发现一个数学秘密</div>
          <h1>数学不是背出来的，<br /><em>是玩出来的。</em></h1>
          <p className="hero-description">旋转、拆开、拼一拼，亲手把每一个数学知识点变得看得见、摸得着。</p>
          <button className="primary-button hero-button" type="button" onClick={onOpenLesson}>
            <span>{lessonComplete ? '继续探索长方体' : '开始今天的探索'}</span>
            <Icon name="arrow" size={19} />
          </button>
          <div className="hero-trust"><span className="trust-stars">✦ ✦ ✦</span><span>适合小学 3—5 年级</span><span className="trust-divider" /><span>每次 5 分钟</span></div>
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
          <div className="speech-bubble"><span>今天要发现什么？</span><i /></div>
        </div>
      </section>

      <section className="home-content page-width">
        <div className="section-heading">
          <div>
            <span className="section-kicker">你的数学小宇宙</span>
            <h2>想从哪里开始？</h2>
          </div>
          <button className="text-button" type="button" onClick={onOpenLesson}>看看全部 <Icon name="arrow" size={15} /></button>
        </div>

        <div className="explore-grid">
          <button className="explore-card featured-card" type="button" onClick={onOpenLesson}>
            <div className="card-topline"><span className="status-chip"><span />正在学习</span><span className="card-arrow"><Icon name="arrow" size={17} /></span></div>
            <div className="featured-illustration"><div className="illustration-shadow" /><div className="illustration-box"><i /><b /><strong /></div><div className="illustration-ruler">↔</div></div>
            <div className="card-copy">
              <span className="card-kicker">空间与几何 · 第 1 课</span>
              <h3>长方体的秘密</h3>
              <p>转一转，拉一拉，看看一个盒子能装下多少小方块。</p>
              <div className="progress-row"><span className="progress-track"><i style={{ width: `${progress}%` }} /></span><strong>{progress ? `${progress}%` : '准备开始'}</strong></div>
            </div>
          </button>
          <button className="explore-card coming-card" type="button" onClick={onOpenLesson}>
            <div className="card-topline"><span className="status-chip muted-chip">即将到来</span><span className="card-arrow"><Icon name="arrow" size={17} /></span></div>
            <div className="coming-illustration"><div className="triangle-shape" /><div className="circle-shape" /><div className="square-shape" /><span>?</span></div>
            <div className="card-copy"><span className="card-kicker">空间与几何 · 第 2 课</span><h3>图形变变变</h3><p>把图形转一转、折一折，找找它们藏起来的规律。</p><span className="coming-link">很快就能玩啦 <span>·</span> 预计 3 个探索</span></div>
          </button>
          <button className="explore-card free-card" type="button" onClick={onOpenLesson}>
            <div className="card-topline"><span className="status-chip free-chip">自由探索</span><span className="card-arrow"><Icon name="arrow" size={17} /></span></div>
            <div className="free-illustration"><span className="free-block block-a" /><span className="free-block block-b" /><span className="free-block block-c" /><span className="free-block block-d" /><span className="free-sparkle">✦</span></div>
            <div className="card-copy"><span className="card-kicker">数学游乐场</span><h3>随便玩一玩</h3><p>没有任务，只有好奇心。试试你能搭出什么。</p><span className="coming-link dark-link">进入游乐场 <Icon name="arrow" size={14} /></span></div>
          </button>
        </div>

        <div className="home-bottom-grid">
          <div className="daily-card">
            <div className="daily-icon"><Icon name="sparkle" size={24} /></div>
            <div><span className="section-kicker">今日小发现</span><h3>同样的体积，可以有不同的形状</h3><p>试着找出两个不一样的长方体，它们都能装下 24 个小方块。</p></div>
            <button className="round-arrow" type="button" onClick={onOpenLesson} aria-label="打开今日小发现"><Icon name="arrow" size={18} /></button>
          </div>
          <div className="streak-card"><div className="streak-orbit"><span>3</span><i>天</i></div><div><span className="section-kicker">探索足迹</span><h3>连续探索 3 天</h3><p>再来一次，就能点亮下一颗星星。</p></div><span className="streak-star">✦</span></div>
        </div>
      </section>
    </main>
  )
}

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
  currentTask: (typeof lessonTasks)[number]
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
  return (
    <main className="lesson-page page-width">
      <div className="lesson-breadcrumb"><button className="back-button" type="button" onClick={onBack}><Icon name="back" size={17} />返回探索首页</button><span>/</span><span>空间与几何</span><span>/</span><strong>长方体的秘密</strong></div>
      <div className="lesson-title-row"><div><span className="section-kicker">空间与几何 · 探索 01</span><h1>长方体的秘密</h1></div><div className="lesson-progress"><div className="lesson-progress-copy"><span>探索进度</span><strong>{lessonComplete ? '已完成' : `${completedTasks.filter(Boolean).length} / 3`}</strong></div><span className="progress-track"><i style={{ width: `${lessonComplete ? 100 : Math.max(12, completedTasks.filter(Boolean).length / 3 * 100)}%` }} /></span></div></div>

      <div className="lesson-layout">
        <section className="workbench-card">
          <div className="workbench-toolbar"><div className="mode-switch" role="tablist" aria-label="视图模式"><button className={displayMode === '3d' ? 'mode-button active' : 'mode-button'} type="button" role="tab" aria-selected={displayMode === '3d'} onClick={() => onChangeDisplayMode('3d')}><Icon name="cube" size={16} />3D 立体</button><button className={displayMode === '2d' ? 'mode-button active' : 'mode-button'} type="button" role="tab" aria-selected={displayMode === '2d'} onClick={() => onChangeDisplayMode('2d')}><Icon name="layers" size={16} />2D 拆解</button></div><div className="toolbar-actions"><button className={showUnits ? 'tool-button active' : 'tool-button'} type="button" onClick={onToggleUnits}><Icon name="layers" size={16} />{showUnits ? '隐藏小方块' : '显示小方块'}</button><button className="tool-button icon-only" type="button" onClick={onReset} aria-label="重置视角"><Icon name="rotate" size={17} /></button></div></div>
          <div className="workbench-stage">
            {displayMode === '3d' ? <CuboidScene dimensions={dimensions} selectedDimension={selectedDimension} showUnits={showUnits} resetToken={resetToken} onSelectDimension={onSelectDimension} onChangeDimension={onNudgeDimension} /> : <CuboidDiagram dimensions={dimensions} />}
            {displayMode === '3d' && <div className="stage-tip"><span className="tip-hand"><Icon name="cursor" size={16} /></span><span>拖动小方块可以改变大小，拖动空白处可以旋转</span></div>}
          </div>
          <div className="workbench-footer"><div className="selection-note"><span className="selected-dot" style={{ backgroundColor: selectedDimension === 'length' ? '#f39a68' : selectedDimension === 'width' ? '#62bce4' : '#63c69f' }} /><span>当前选中：<strong>{DIMENSION_NAMES[selectedDimension]}</strong></span><small>试试点击另一个彩色小点</small></div><div className="scene-legend"><span><i className="legend-dot orange" />长</span><span><i className="legend-dot blue" />宽</span><span><i className="legend-dot green" />高</span></div></div>
        </section>

        <aside className="lesson-sidebar">
          <section className="mission-card"><div className="mission-header"><div><span className="section-kicker">{currentTask.eyebrow}</span><h2>{currentTask.title}</h2></div><span className="mission-number">0{activeTask + 1}</span></div><p>{currentTask.description}</p><div className={currentTaskComplete ? 'feedback-box success-feedback' : 'feedback-box'}><span className="feedback-icon"><Icon name={currentTaskComplete ? 'check' : 'sparkle'} size={16} /></span><span>{currentTaskComplete ? '做到了！可以继续下一站。' : currentTask.hint}</span></div><button className={currentTaskComplete ? 'primary-button task-button' : 'primary-button task-button disabled-button'} type="button" onClick={onAdvanceTask} disabled={!currentTaskComplete}>{activeTask === 2 && currentTaskComplete ? '完成探索' : '完成这一站'}<Icon name="arrow" size={17} /></button></section>
          <section className="dimensions-card"><div className="sidebar-heading"><div><span className="section-kicker">我的长方体</span><h2>调一调尺寸</h2></div><button className="reset-link" type="button" onClick={onResetLesson}><Icon name="refresh" size={15} />重置</button></div><div className="dimension-list"><DimensionControl dimension="length" value={dimensions.length} onChange={(value) => onChangeDimension('length', value)} onSelect={() => onSelectDimension('length')} selected={selectedDimension === 'length'} /><DimensionControl dimension="width" value={dimensions.width} onChange={(value) => onChangeDimension('width', value)} onSelect={() => onSelectDimension('width')} selected={selectedDimension === 'width'} /><DimensionControl dimension="height" value={dimensions.height} onChange={(value) => onChangeDimension('height', value)} onSelect={() => onSelectDimension('height')} selected={selectedDimension === 'height'} /></div><div className="formula-card"><div className="formula-label"><span className="formula-symbol">×</span><span>底面积</span></div><strong>{dimensions.length} × {dimensions.width} = {baseArea}<small>平方厘米</small></strong><div className="formula-divider" /><div className="formula-label"><span className="formula-symbol volume-symbol">◆</span><span>体积</span></div><strong className="volume-number">{baseArea} × {dimensions.height} = <b>{volume}</b><small>立方厘米</small></strong></div></section>
          <section className="route-card"><div className="route-header"><span className="section-kicker">探索路线</span><span>{completedTasks.filter(Boolean).length} / 3 已完成</span></div><div className="route-list">{lessonTasks.map((task, index) => <button className={`route-item ${index === activeTask ? 'active' : ''} ${completedTasks[index] ? 'complete' : ''}`} type="button" key={task.title} onClick={() => onSelectTask(index)} disabled={index > 0 && !completedTasks[index - 1]}><span className="route-marker">{completedTasks[index] ? <Icon name="check" size={13} /> : `0${index + 1}`}</span><span>{task.title}</span><Icon name="arrow" size={14} /></button>)}</div><div className="mascot-note"><Mascot small /><span>每一次尝试，<br /><strong>都是新发现！</strong></span></div></section>
        </aside>
      </div>
    </main>
  )
}

export default App
