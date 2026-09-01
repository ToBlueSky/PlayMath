import type { CSSProperties } from 'react'
import { Icon } from './Icons'
import { useTranslate } from '../i18n/i18n'

export type DimensionKey = 'length' | 'width' | 'height'

type DimensionControlProps = {
  dimension: DimensionKey
  value: number
  onChange: (value: number) => void
  onSelect: () => void
  selected: boolean
}

const meta: Record<DimensionKey, { name: string; color: string }> = {
  length: { name: 'dimensionLength', color: '#f39a68' },
  width: { name: 'dimensionWidth', color: '#6fc6ed' },
  height: { name: 'dimensionHeight', color: '#83d4b5' },
}

export function DimensionControl({ dimension, value, onChange, onSelect, selected }: DimensionControlProps) {
  const t = useTranslate()
  const item = meta[dimension]
  const hintKey = dimension === 'length' ? 'dimensionLengthHint' : 'dimensionRowHint'
  const letterKey = dimension === 'length' ? 'dimensionLengthLetter' : 'dimensionShortLetter'

  return (
    <div className={`dimension-control ${selected ? 'is-selected' : ''}`} style={{ '--dimension-color': item.color } as CSSProperties}>
      <button className="dimension-label" type="button" onClick={onSelect} aria-pressed={selected}>
        <span className="dimension-letter">{t(letterKey)}</span>
        <span>
          <strong>{t(item.name)}</strong>
          <small>{t(hintKey)}</small>
        </span>
      </button>
      <button className="step-button" type="button" onClick={() => onChange(value - 1)} aria-label={t('dimensionDecrement', t(item.name))}>
        −
      </button>
      <input
        className="dimension-range"
        type="range"
        min="1"
        max="6"
        step="1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={t('dimensionRange', t(item.name), value)}
      />
      <button className="step-button" type="button" onClick={() => onChange(value + 1)} aria-label={t('dimensionIncrement', t(item.name))}>
        +
      </button>
      <label className="dimension-value">
        <input
          type="number"
          min="1"
          max="6"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label={t('dimensionInput', t(item.name))}
        />
        <span>{t('unitCm')}</span>
      </label>
      <Icon name="cube" size={14} className="dimension-cube" />
    </div>
  )
}
