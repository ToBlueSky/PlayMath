import { useEffect, useState } from 'react'
import type { CuboidDimensions } from './CuboidScene'
import { Icon } from './Icons'
import { useTranslate } from '../i18n/i18n'

type CuboidDiagramProps = {
  dimensions: CuboidDimensions
}

export function CuboidDiagram({ dimensions }: CuboidDiagramProps) {
  const t = useTranslate()
  const { length, width, height } = dimensions
  const baseArea = length * width
  const volume = baseArea * height
  const [visibleLayers, setVisibleLayers] = useState(height)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    setVisibleLayers(height)
    setIsPlaying(false)
  }, [height, length, width])

  useEffect(() => {
    if (!isPlaying) return

    let layer = 0
    setVisibleLayers(layer)
    const timer = window.setInterval(() => {
      layer += 1
      setVisibleLayers(layer)
      if (layer >= height) {
        window.clearInterval(timer)
        setIsPlaying(false)
      }
    }, 480)

    return () => window.clearInterval(timer)
  }, [height, isPlaying])

  const displayedLayers = isPlaying ? visibleLayers : height
  const frontWidth = 120 + length * 24
  const frontHeight = 55 + height * 24
  const depthX = 12 + width * 10
  const depthY = 7 + width * 6
  const x = 220 - frontWidth / 2
  const y = 28 + depthY
  const cellsToShow = Math.min(baseArea, 36)

  return (
    <div className="diagram-view" aria-label={t('diagramAria', length, width, height)}>
      <div className="diagram-canvas-wrap">
        <svg className="diagram-svg" viewBox="0 0 440 245" role="img">
          <defs>
            <linearGradient id="frontFace" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#b8e8d5" />
              <stop offset="1" stopColor="#8bd8bb" />
            </linearGradient>
            <linearGradient id="sideFace" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#77c5e7" />
              <stop offset="1" stopColor="#5ca9d0" />
            </linearGradient>
            <linearGradient id="topFace" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#ffe39b" />
              <stop offset="1" stopColor="#ffd17b" />
            </linearGradient>
          </defs>
          <g stroke="#39708c" strokeWidth="2.5" strokeLinejoin="round">
            <path d={`M${x} ${y}h${frontWidth}v${frontHeight}H${x}Z`} fill="url(#frontFace)" />
            <path d={`M${x} ${y}l${depthX} -${depthY}h${frontWidth}l-${depthX} ${depthY}Z`} fill="url(#topFace)" />
            <path d={`M${x + frontWidth} ${y}l${depthX} -${depthY}v${frontHeight}l-${depthX} ${depthY}Z`} fill="url(#sideFace)" />
          </g>
          <g stroke="#fff" strokeWidth="1.1" opacity=".62">
            {Array.from({ length: Math.max(1, length - 1) }).map((_, index) => {
              const gridX = x + ((index + 1) * frontWidth) / length
              return <path key={`vertical-${index}`} d={`M${gridX} ${y}v${frontHeight}`} />
            })}
            {Array.from({ length: Math.max(1, height - 1) }).map((_, index) => {
              const gridY = y + ((index + 1) * frontHeight) / height
              return <path key={`horizontal-${index}`} d={`M${x} ${gridY}h${frontWidth}`} />
            })}
          </g>
          <g className="diagram-label diagram-label-length">
            <path d={`M${x} ${y + frontHeight + 17}h${frontWidth}`} />
            <path d={`m${x + 1} ${y + frontHeight + 13}-5 4 5 4m${frontWidth - 1 - 1} -8 5 4-5 4`} />
            <text x={x + frontWidth / 2} y={y + frontHeight + 34} textAnchor="middle">{t('legendLength')} {length} cm</text>
          </g>
          <g className="diagram-label diagram-label-height">
            <path d={`M${x - 17} ${y}v${frontHeight}`} />
            <path d={`m${x - 21} ${y + 1}4-5 4 5m-8 ${frontHeight - 1}4 5 4-5`} />
            <text x={x - 27} y={y + frontHeight / 2} textAnchor="middle" transform={`rotate(-90 ${x - 27} ${y + frontHeight / 2})`}>{t('legendHeight')} {height} cm</text>
          </g>
          <g className="diagram-label diagram-label-width">
            <path d={`M${x + frontWidth + 4} ${y - 4}l${depthX} -${depthY}`} />
            <text x={x + frontWidth + depthX / 2 + 12} y={y - depthY - 9} textAnchor="middle">{t('legendWidth')} {width} cm</text>
          </g>
        </svg>
      </div>
      <div className="diagram-explanation">
        <div className="layer-visual">
          <div className="layer-visual-title"><span className="layer-dot" />{t('oneLayer')}</div>
          <div className="mini-cubes" aria-hidden="true">
            {Array.from({ length: cellsToShow }).map((_, index) => <span key={index} />)}
            {baseArea > cellsToShow && <b>+{baseArea - cellsToShow}</b>}
          </div>
          <p>{length} × {width} = <strong>{baseArea}</strong> {t('unitCm')}</p>
        </div>
        <div className="diagram-math">
          <div className="diagram-math-heading"><span className="math-kicker">{t('stackHeading')}</span><button className="diagram-play-button" type="button" onClick={() => setIsPlaying(true)} disabled={isPlaying}><Icon name="play" size={12} />{isPlaying ? t('stacking') : t('playAnimation')}</button></div>
          <div className="layer-stack" aria-label={t('stackAria', displayedLayers, height)}>
            {Array.from({ length: height }).map((_, index) => <span className={index < visibleLayers ? 'layer-bar is-visible' : 'layer-bar'} key={index}>{t('layerN', index + 1)}</span>)}
          </div>
          <strong>{baseArea} × {displayedLayers} = {baseArea * displayedLayers}</strong>
          <small>{t('cubicCm')}</small>
        </div>
      </div>
    </div>
  )
}
