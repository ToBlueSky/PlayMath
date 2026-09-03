import { Suspense, lazy } from 'react'
import { CuboidDiagram } from '../components/CuboidDiagram'
import { CuboidNet } from '../components/CuboidNet'
import { DimensionControl, type DimensionKey } from '../components/DimensionControl'
import { Icon } from '../components/Icons'
import { Mascot } from '../components/Mascot'
import type { CuboidDimensions } from '../components/CuboidScene'
import { useTranslate } from '../i18n/i18n'
import type { DisplayMode, LessonTask } from '../types'

const CuboidScene = lazy(() => import('../components/CuboidScene').then(m => ({ default: m.CuboidScene })))

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

export function LessonPage({
  dimensions, volume, baseArea, displayMode, showUnits, selectedDimension,
  resetToken, activeTask, completedTasks, currentTask, lessonTasks,
  currentTaskComplete, lessonComplete, onBack, onChangeDisplayMode,
  onToggleUnits, onSelectDimension, onChangeDimension, onNudgeDimension,
  onReset, onResetLesson, onAdvanceTask, onSelectTask,
}: LessonPageProps) {
  const t = useTranslate()
  const dimensionNames: Record<DimensionKey, string> = { length: t('legendLength'), width: t('legendWidth'), height: t('legendHeight') }

  return (
    <main className="lesson-page page-width">
      <div className="lesson-breadcrumb"><button className="back-button" type="button" onClick={onBack}><Icon name="back" size={17} />{t('backToExplore')}</button><span>/</span><span>{t('geometry')}</span><span>/</span><strong>{t('cuboidTitle')}</strong></div>
      <div className="lesson-title-row"><div><span className="section-kicker">{t('lessonKicker')}</span><h1>{t('cuboidTitle')}</h1></div><div className="lesson-progress"><div className="lesson-progress-copy"><span>{t('progressLabel')}</span><strong>{lessonComplete ? t('progressDone') : `${completedTasks.filter(Boolean).length} / ${lessonTasks.length}`}</strong></div><span className="progress-track"><i style={{ width: `${lessonComplete ? 100 : Math.max(12, completedTasks.filter(Boolean).length / lessonTasks.length * 100)}%` }} /></span></div></div>

      <div className="lesson-layout">
        <section className="workbench-card">
          <div className="workbench-toolbar"><div className="mode-switch" role="tablist" aria-label="视图模式"><button className={displayMode === '3d' ? 'mode-button active' : 'mode-button'} type="button" role="tab" aria-selected={displayMode === '3d'} onClick={() => onChangeDisplayMode('3d')}><Icon name="cube" size={16} />{t('mode3d')}</button><button className={displayMode === '2d' ? 'mode-button active' : 'mode-button'} type="button" role="tab" aria-selected={displayMode === '2d'} onClick={() => onChangeDisplayMode('2d')}><Icon name="layers" size={16} />{t('mode2d')}</button><button className={displayMode === 'net' ? 'mode-button active' : 'mode-button'} type="button" role="tab" aria-selected={displayMode === 'net'} onClick={() => onChangeDisplayMode('net')}><Icon name="target" size={16} />{t('modeNet')}</button></div><div className="toolbar-actions"><button className={showUnits ? 'tool-button active' : 'tool-button'} type="button" onClick={onToggleUnits}><Icon name="layers" size={16} />{showUnits ? t('hideUnits') : t('showUnits')}</button><button className="tool-button icon-only" type="button" onClick={onReset} aria-label={t('resetView')}><Icon name="rotate" size={17} /></button></div></div>
          <div className="workbench-stage">
            {displayMode === '3d' ? (
              <Suspense fallback={<div className="stage-loading"><span className="loading-pulse" /></div>}>
                <CuboidScene dimensions={dimensions} selectedDimension={selectedDimension} showUnits={showUnits} resetToken={resetToken} onSelectDimension={onSelectDimension} onChangeDimension={onNudgeDimension} />
              </Suspense>
            ) : displayMode === '2d' ? <CuboidDiagram dimensions={dimensions} /> : <CuboidNet dimensions={dimensions} />}
            {displayMode === '3d' && <div className="stage-tip"><span className="tip-hand"><Icon name="cursor" size={16} /></span><span>{t('stageTip')}</span></div>}
          </div>
          <div className="workbench-footer"><div className="selection-note"><span className="selected-dot" style={{ backgroundColor: selectedDimension === 'length' ? '#f39a68' : selectedDimension === 'width' ? '#62bce4' : '#63c69f' }} /><span>{t('selectedLabel')}<strong>{dimensionNames[selectedDimension]}</strong></span><small>{t('tryAnother')}</small></div><div className="scene-legend"><span><i className="legend-dot orange" />{t('legendLength')}</span><span><i className="legend-dot blue" />{t('legendWidth')}</span><span><i className="legend-dot green" />{t('legendHeight')}</span></div></div>
        </section>

        <aside className="lesson-sidebar">
          <section className="mission-card"><div className="mission-header"><div><span className="section-kicker">{currentTask.eyebrow}</span><h2>{currentTask.title}</h2></div><span className="mission-number">{t('missionNumber', activeTask + 1)}</span></div><p>{currentTask.description}</p><div className={currentTaskComplete ? 'feedback-box success-feedback' : 'feedback-box'}><span className="feedback-icon"><Icon name={currentTaskComplete ? 'check' : 'sparkle'} size={16} /></span><span>{currentTaskComplete ? t('successFeedback') : currentTask.hint}</span></div><button className={currentTaskComplete ? 'primary-button task-button' : 'primary-button task-button disabled-button'} type="button" onClick={onAdvanceTask} disabled={!currentTaskComplete}>{activeTask === lessonTasks.length - 1 && currentTaskComplete ? t('completeExplore') : t('completeStation')}<Icon name="arrow" size={17} /></button></section>
          <section className="dimensions-card"><div className="sidebar-heading"><div><span className="section-kicker">{t('myCuboid')}</span><h2>{t('adjustTitle')}</h2></div><button className="reset-link" type="button" onClick={onResetLesson}><Icon name="refresh" size={15} />{t('reset')}</button></div><div className="dimension-list"><DimensionControl dimension="length" value={dimensions.length} onChange={(value) => onChangeDimension('length', value)} onSelect={() => onSelectDimension('length')} selected={selectedDimension === 'length'} /><DimensionControl dimension="width" value={dimensions.width} onChange={(value) => onChangeDimension('width', value)} onSelect={() => onSelectDimension('width')} selected={selectedDimension === 'width'} /><DimensionControl dimension="height" value={dimensions.height} onChange={(value) => onChangeDimension('height', value)} onSelect={() => onSelectDimension('height')} selected={selectedDimension === 'height'} /></div><div className="formula-card"><div className="formula-label"><span className="formula-symbol">×</span><span>{t('baseAreaLabel')}</span></div><strong>{dimensions.length} × {dimensions.width} = {baseArea}<small>{t('squareCm')}</small></strong><div className="formula-divider" /><div className="formula-label"><span className="formula-symbol volume-symbol">◆</span><span>{t('volumeLabel')}</span></div><strong className="volume-number">{baseArea} × {dimensions.height} = <b>{volume}</b><small>{t('cubicCm')}</small></strong></div></section>
          <section className="route-card"><div className="route-header"><span className="section-kicker">{t('routeKicker')}</span><span>{t('routeDone', completedTasks.filter(Boolean).length, lessonTasks.length)}</span></div><div className="route-list">{lessonTasks.map((task, index) => <button className={`route-item ${index === activeTask ? 'active' : ''} ${completedTasks[index] ? 'complete' : ''}`} type="button" key={task.title} onClick={() => onSelectTask(index)} disabled={index > 0 && !completedTasks[index - 1]}><span className="route-marker">{completedTasks[index] ? <Icon name="check" size={13} /> : `0${index + 1}`}</span><span>{task.title}</span><Icon name="arrow" size={14} /></button>)}</div><div className="mascot-note"><Mascot small /><span>{t('mascotNote1')}<br /><strong>{t('mascotNote2')}</strong></span></div></section>
        </aside>
      </div>
    </main>
  )
}
