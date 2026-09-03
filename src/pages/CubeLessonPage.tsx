import { Suspense, lazy } from 'react'
import { DimensionControl } from '../components/DimensionControl'
import { Icon } from '../components/Icons'
import { Mascot } from '../components/Mascot'
import { useTranslate } from '../i18n/i18n'
import type { LessonTask } from '../types'

const CubeScene = lazy(() => import('../components/CubeScene').then(m => ({ default: m.CubeScene })))

type CubeLessonPageProps = {
  cubeEdge: number
  cubeShowUnits: boolean
  cubeResetToken: number
  cubeActiveTask: number
  cubeTasks: LessonTask[]
  cubeCurrentTask: LessonTask
  cubeCurrentTaskComplete: boolean
  cubeTaskCompleted: boolean[]
  cubeComplete: boolean
  cubeSurfaceArea: number
  cubeVolume: number
  onBack: () => void
  onToggleUnits: () => void
  onNudgeEdge: (delta: number) => void
  onReset: () => void
  onResetLesson: () => void
  onAdvanceTask: () => void
  onSelectTask: (task: number) => void
}

export function CubeLessonPage({
  cubeEdge, cubeShowUnits, cubeResetToken, cubeActiveTask, cubeTasks,
  cubeCurrentTask, cubeCurrentTaskComplete, cubeTaskCompleted, cubeComplete,
  cubeSurfaceArea, cubeVolume, onBack, onToggleUnits, onNudgeEdge,
  onReset, onResetLesson, onAdvanceTask, onSelectTask,
}: CubeLessonPageProps) {
  const t = useTranslate()

  return (
    <main className="lesson-page page-width">
      <div className="lesson-breadcrumb"><button className="back-button" type="button" onClick={onBack}><Icon name="back" size={17} />{t('backToExplore')}</button><span>/</span><span>{t('geometry')}</span><span>/</span><strong>{t('cubeTitle')}</strong></div>
      <div className="lesson-title-row"><div><span className="section-kicker">{t('cubeKicker')}</span><h1>{t('cubeTitle')}</h1></div><div className="lesson-progress"><div className="lesson-progress-copy"><span>{t('progressLabel')}</span><strong>{cubeComplete ? t('progressDone') : `${cubeTaskCompleted.filter(Boolean).length} / ${cubeTasks.length}`}</strong></div><span className="progress-track"><i style={{ width: `${cubeComplete ? 100 : Math.max(12, cubeTaskCompleted.filter(Boolean).length / cubeTasks.length * 100)}%` }} /></span></div></div>

      <div className="lesson-layout">
        <section className="workbench-card">
          <div className="workbench-toolbar"><div className="mode-switch" role="tablist" aria-label="视图模式"><button className="mode-button active" type="button" role="tab" aria-selected><Icon name="cube" size={16} />3D {t('cubeTitle')}</button></div><div className="toolbar-actions"><button className={cubeShowUnits ? 'tool-button active' : 'tool-button'} type="button" onClick={onToggleUnits}><Icon name="layers" size={16} />{cubeShowUnits ? t('hideUnits') : t('showUnits')}</button><button className="tool-button icon-only" type="button" onClick={onReset} aria-label={t('resetView')}><Icon name="rotate" size={17} /></button></div></div>
          <div className="workbench-stage">
            <Suspense fallback={<div className="stage-loading"><span className="loading-pulse" /></div>}>
              <CubeScene edgeLength={cubeEdge} showUnits={cubeShowUnits} resetToken={cubeResetToken} onChange={onNudgeEdge} />
            </Suspense>
            <div className="stage-tip"><span className="tip-hand"><Icon name="cursor" size={16} /></span><span>{t('cubeStageTip')}</span></div>
          </div>
          <div className="workbench-footer"><div className="selection-note"><span className="selected-dot" style={{ backgroundColor: '#9b8af5' }} /><span>{t('selectedLabel')}<strong>{t('cubeEdge')}</strong></span><small>{t('cubeEdgeHint')}</small></div></div>
        </section>

        <aside className="lesson-sidebar">
          <section className="mission-card"><div className="mission-header"><div><span className="section-kicker">{cubeCurrentTask.eyebrow}</span><h2>{cubeCurrentTask.title}</h2></div><span className="mission-number">{t('missionNumber', cubeActiveTask + 1)}</span></div><p>{cubeCurrentTask.description}</p><div className={cubeCurrentTaskComplete ? 'feedback-box success-feedback' : 'feedback-box'}><span className="feedback-icon"><Icon name={cubeCurrentTaskComplete ? 'check' : 'sparkle'} size={16} /></span><span>{cubeCurrentTaskComplete ? t('successFeedback') : cubeCurrentTask.hint}</span></div><button className={cubeCurrentTaskComplete ? 'primary-button task-button' : 'primary-button task-button disabled-button'} type="button" onClick={onAdvanceTask} disabled={!cubeCurrentTaskComplete}>{cubeActiveTask === cubeTasks.length - 1 && cubeCurrentTaskComplete ? t('completeExplore') : t('completeStation')}<Icon name="arrow" size={17} /></button></section>

          <section className="dimensions-card"><div className="sidebar-heading"><div><span className="section-kicker">{t('cubeEdgeLabel')}</span><h2>{t('adjustTitle')}</h2></div><button className="reset-link" type="button" onClick={onResetLesson}><Icon name="refresh" size={15} />{t('reset')}</button></div>
            <div className="dimension-list">
              <DimensionControl dimension="length" value={cubeEdge} onChange={(v) => onNudgeEdge(v - cubeEdge)} onSelect={() => {}} selected={true} />
            </div>
            <div className="formula-card">
              <div className="formula-label"><span className="formula-symbol">◆</span><span>{t('cubeSurfaceLabel')}</span></div>
              <strong>{t('cubeSurface', cubeEdge)}<small>{t('squareCm')}</small></strong>
              <div className="formula-divider" />
              <div className="formula-label"><span className="formula-symbol volume-symbol">◆</span><span>{t('cubeVolumeLabel')}</span></div>
              <strong className="volume-number">{t('cubeVolume', cubeEdge)}<small>{t('cubicCm')}</small></strong>
            </div>
          </section>

          <section className="route-card"><div className="route-header"><span className="section-kicker">{t('routeKicker')}</span><span>{t('routeDone', cubeTaskCompleted.filter(Boolean).length, cubeTasks.length)}</span></div><div className="route-list">{cubeTasks.map((task, index) => <button className={`route-item ${index === cubeActiveTask ? 'active' : ''} ${cubeTaskCompleted[index] ? 'complete' : ''}`} type="button" key={task.title} onClick={() => onSelectTask(index)} disabled={index > 0 && !cubeTaskCompleted[index - 1]}><span className="route-marker">{cubeTaskCompleted[index] ? <Icon name="check" size={13} /> : `0${index + 1}`}</span><span>{task.title}</span><Icon name="arrow" size={14} /></button>)}</div><div className="mascot-note"><Mascot small /><span>{t('mascotNote1')}<br /><strong>{t('mascotNote2')}</strong></span></div></section>
        </aside>
      </div>
    </main>
  )
}
