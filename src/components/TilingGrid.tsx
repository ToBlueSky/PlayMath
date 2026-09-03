import { useState } from 'react'
import { Icon } from './Icons'
import { useTranslate } from '../i18n/i18n'

type TileType = '1x1' | '2x1' | '1x2'

type Cell = {
  filled: boolean
  tileId: number | null
}

const ROWS = 4
const COLS = 6
const TOTAL_CELLS = ROWS * COLS

const TILE_COLORS: Record<TileType, string> = {
  '1x1': '#9b8af5',
  '2x1': '#62bce4',
  '1x2': '#63c69f',
}

export function TilingGrid() {
  const t = useTranslate()
  const [grid, setGrid] = useState<Cell[]>(() => Array(TOTAL_CELLS).fill(null).map(() => ({ filled: false, tileId: null })))
  const [selectedTile, setSelectedTile] = useState<TileType>('1x1')
  const [tileCount, setTileCount] = useState(0)
  const [nextTileId, setNextTileId] = useState(1)

  const filledCount = grid.filter((c) => c.filled).length
  const isComplete = filledCount === TOTAL_CELLS

  const getTileCells = (row: number, col: number): number[] => {
    if (selectedTile === '1x1') return [row * COLS + col]
    if (selectedTile === '2x1') {
      if (col + 1 >= COLS) return []
      return [row * COLS + col, row * COLS + col + 1]
    }
    if (row + 1 >= ROWS) return []
    return [row * COLS + col, (row + 1) * COLS + col]
  }

  const handleCellClick = (index: number) => {
    const row = Math.floor(index / COLS)
    const col = index % COLS
    const cell = grid[index]

    if (cell.filled) {
      const tileId = cell.tileId
      if (tileId === null) return
      const newGrid = grid.map((c) => c.tileId === tileId ? { filled: false, tileId: null } : c)
      setGrid(newGrid)
      setTileCount((count) => count - 1)
      return
    }

    const cells = getTileCells(row, col)
    if (cells.length === 0) return
    const allEmpty = cells.every((i) => !grid[i].filled)
    if (!allEmpty) return

    const tileId = nextTileId
    const newGrid = grid.map((c, i) => cells.includes(i) ? { filled: true, tileId } : c)
    setGrid(newGrid)
    setTileCount((count) => count + 1)
    setNextTileId((id) => id + 1)
  }

  const handleReset = () => {
    setGrid(Array(TOTAL_CELLS).fill(null).map(() => ({ filled: false, tileId: null })))
    setTileCount(0)
    setNextTileId(1)
  }

  const getTileColor = (cell: Cell) => {
    if (!cell.filled || cell.tileId === null) return 'transparent'
    const tileIndices = grid.reduce<number[]>((acc, c, i) => {
      if (c.tileId === cell.tileId) acc.push(i)
      return acc
    }, [])
    if (tileIndices.length === 1) return TILE_COLORS['1x1']
    const rows = new Set(tileIndices.map((i) => Math.floor(i / COLS)))
    return rows.size > 1 ? TILE_COLORS['1x2'] : TILE_COLORS['2x1']
  }

  return (
    <div className="tiling-view">
      <div className="tiling-header">
        <div className="tiling-info">
          <span className="tiling-label">{t('tilingFloor')}</span>
          <strong>{COLS} × {ROWS} = {TOTAL_CELLS}<small>{t('squareCm')}</small></strong>
        </div>
        <div className="tiling-tiles">
          <span className="tiling-label">{t('tilingTiles')}</span>
          <div className="tile-options">
            <button className={`tile-option ${selectedTile === '1x1' ? 'active' : ''}`} type="button" onClick={() => setSelectedTile('1x1')} style={{ backgroundColor: selectedTile === '1x1' ? TILE_COLORS['1x1'] : 'var(--paper)' }} aria-label="1×1">
              <span className="tile-preview tile-preview-1x1" />
            </button>
            <button className={`tile-option ${selectedTile === '2x1' ? 'active' : ''}`} type="button" onClick={() => setSelectedTile('2x1')} style={{ backgroundColor: selectedTile === '2x1' ? TILE_COLORS['2x1'] : 'var(--paper)' }} aria-label="2×1">
              <span className="tile-preview tile-preview-2x1" />
            </button>
            <button className={`tile-option ${selectedTile === '1x2' ? 'active' : ''}`} type="button" onClick={() => setSelectedTile('1x2')} style={{ backgroundColor: selectedTile === '1x2' ? TILE_COLORS['1x2'] : 'var(--paper)' }} aria-label="1×2">
              <span className="tile-preview tile-preview-1x2" />
            </button>
          </div>
        </div>
        <button className="tile-reset" type="button" onClick={handleReset}><Icon name="refresh" size={14} />{t('reset')}</button>
      </div>

      <div className="tiling-grid" role="grid" aria-label={t('tilingAria', COLS, ROWS)}>
        {grid.map((cell, index) => (
          <button
            type="button"
            key={index}
            className={`tiling-cell ${cell.filled ? 'filled' : ''}`}
            style={cell.filled ? { backgroundColor: getTileColor(cell) } : undefined}
            onClick={() => handleCellClick(index)}
            aria-label={`${Math.floor(index / COLS) + 1}-${index % COLS + 1} ${cell.filled ? t('tilingFilled') : t('tilingEmpty')}`}
          />
        ))}
      </div>

      <div className="tiling-footer">
        <span>{t('tilingUsed')} {tileCount}</span>
        <span>{t('tilingCovered')} {filledCount}/{TOTAL_CELLS}</span>
        {isComplete && (
          <span className="tiling-success"><Icon name="check" size={14} />{t('tilingComplete')}</span>
        )}
      </div>
    </div>
  )
}
