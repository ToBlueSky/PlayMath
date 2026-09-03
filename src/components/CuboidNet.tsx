import { useState } from 'react'
import type { CuboidDimensions } from './CuboidScene'
import { Icon } from './Icons'
import { useTranslate } from '../i18n/i18n'

type CuboidNetProps = {
  dimensions: CuboidDimensions
}

type FaceKey = 'top' | 'bottom' | 'front' | 'back' | 'left' | 'right'

export function CuboidNet({ dimensions }: CuboidNetProps) {
  const t = useTranslate()
  const { length, width, height } = dimensions
  const [activeFace, setActiveFace] = useState<FaceKey | null>(null)

  const maxDim = Math.max(length, width, height)
  const scale = Math.min(36, 160 / maxDim)

  const faces: Record<FaceKey, { w: number; h: number; label: string; area: number; color: string; edge: string }> = {
    top: { w: length * scale, h: width * scale, label: t('netTop'), area: length * width, color: '#e8f8f0', edge: '#63c69f' },
    bottom: { w: length * scale, h: width * scale, label: t('netBottom'), area: length * width, color: '#e8f8f0', edge: '#63c69f' },
    front: { w: length * scale, h: height * scale, label: t('netFront'), area: length * height, color: '#fff3e8', edge: '#f39a68' },
    back: { w: length * scale, h: height * scale, label: t('netBack'), area: length * height, color: '#fff3e8', edge: '#f39a68' },
    left: { w: width * scale, h: height * scale, label: t('netLeft'), area: width * height, color: '#e8f4fd', edge: '#62bce4' },
    right: { w: width * scale, h: height * scale, label: t('netRight'), area: width * height, color: '#e8f4fd', edge: '#62bce4' },
  }

  const surfaceArea = 2 * (length * width + length * height + width * height)
  const active = activeFace ? faces[activeFace] : null

  const renderFace = (key: FaceKey) => {
    const face = faces[key]
    const isActive = activeFace === key
    return (
      <button
        type="button"
        key={key}
        className={`net-face ${isActive ? 'net-face-active' : ''}`}
        style={{
          width: face.w,
          height: face.h,
          backgroundColor: face.color,
          borderColor: face.edge,
        }}
        onClick={() => setActiveFace(isActive ? null : key)}
        aria-label={`${face.label}: ${face.area}`}
      >
        <span className="net-face-label">{face.label}</span>
        <span className="net-face-dims">{key === 'top' || key === 'bottom' ? `${length}×${width}` : key === 'front' || key === 'back' ? `${length}×${height}` : `${width}×${height}`}</span>
        <span className="net-face-area">{face.area}</span>
      </button>
    )
  }

  return (
    <div className="net-view" role="region" aria-label={t('netTitle')}>
      <div className="net-net-shape">
        <div className="net-row net-row-top">{renderFace('top')}</div>
        <div className="net-row net-row-middle">
          {renderFace('left')}
          {renderFace('front')}
          {renderFace('right')}
          {renderFace('back')}
        </div>
        <div className="net-row net-row-bottom">{renderFace('bottom')}</div>
      </div>

      <div className="net-summary">
        <div className="net-formula">
          <div className="net-formula-row">
            <span className="net-formula-label">{t('netFormula1')}</span>
            <strong>({length}×{width} + {length}×{height} + {width}×{height}) × 2</strong>
          </div>
          <div className="net-formula-row">
            <span className="net-formula-label">{t('netFormula2')}</span>
            <strong className="net-total">{surfaceArea}<small>{t('squareCm')}</small></strong>
          </div>
        </div>
        {active && (
          <div className="net-face-detail">
            <Icon name="sparkle" size={14} />
            <span>{active.label}：{active.area} {t('squareCm')}</span>
          </div>
        )}
        <p className="net-hint">{t('netHint')}</p>
      </div>
    </div>
  )
}
