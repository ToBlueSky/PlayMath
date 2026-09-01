import type { CSSProperties } from 'react'
import { Icon } from './Icons'

export type DimensionKey = 'length' | 'width' | 'height'

type DimensionControlProps = {
  dimension: DimensionKey
  value: number
  onChange: (value: number) => void
  onSelect: () => void
  selected: boolean
}

const meta: Record<DimensionKey, { label: string; name: string; color: string; hint: string }> = {
  length: { label: '长', name: '长度', color: '#f39a68', hint: '左右拖动' },
  width: { label: '宽', name: '宽度', color: '#6fc6ed', hint: '上下拖动' },
  height: { label: '高', name: '高度', color: '#83d4b5', hint: '上下拖动' },
}

export function DimensionControl({ dimension, value, onChange, onSelect, selected }: DimensionControlProps) {
  const item = meta[dimension]

  return (
    <div className={`dimension-control ${selected ? 'is-selected' : ''}`} style={{ '--dimension-color': item.color } as CSSProperties}>
      <button className="dimension-label" type="button" onClick={onSelect} aria-pressed={selected}>
        <span className="dimension-letter">{item.label}</span>
        <span>
          <strong>{item.name}</strong>
          <small>{item.hint}</small>
        </span>
      </button>
      <button className="step-button" type="button" onClick={() => onChange(value - 1)} aria-label={`${item.name}减一`}>
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
        aria-label={`${item.name}，当前 ${value} 厘米`}
      />
      <button className="step-button" type="button" onClick={() => onChange(value + 1)} aria-label={`${item.name}加一`}>
        +
      </button>
      <label className="dimension-value">
        <input
          type="number"
          min="1"
          max="6"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          aria-label={`输入${item.name}`}
        />
        <span>厘米</span>
      </label>
      <Icon name="cube" size={14} className="dimension-cube" />
    </div>
  )
}
