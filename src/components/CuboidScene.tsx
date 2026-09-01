import { Edges, Html, Line, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import type { DimensionKey } from './DimensionControl'

export type CuboidDimensions = {
  length: number
  width: number
  height: number
}

type CuboidSceneProps = {
  dimensions: CuboidDimensions
  selectedDimension: DimensionKey
  showUnits: boolean
  resetToken: number
  onSelectDimension: (dimension: DimensionKey) => void
  onChangeDimension: (dimension: DimensionKey, delta: number) => void
}

const colors: Record<DimensionKey, string> = {
  length: '#f39a68',
  width: '#62bce4',
  height: '#63c69f',
}

function ResizeHandle({
  dimension,
  position,
  selected,
  onSelect,
  onChange,
}: {
  dimension: DimensionKey
  position: [number, number, number]
  selected: boolean
  onSelect: () => void
  onChange: (delta: number) => void
}) {
  const dragRef = useRef(false)
  const accumulatorRef = useRef(0)
  const lastPointRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      if (!dragRef.current) return
      const movementX = event.clientX - lastPointRef.current.x
      const movementY = event.clientY - lastPointRef.current.y
      lastPointRef.current = { x: event.clientX, y: event.clientY }
      const movement = dimension === 'length' ? movementX : -movementY
      accumulatorRef.current += movement

      while (Math.abs(accumulatorRef.current) >= 24) {
        const direction = accumulatorRef.current > 0 ? 1 : -1
        onChange(direction)
        accumulatorRef.current -= direction * 24
      }
    }

    const handleUp = () => {
      dragRef.current = false
      accumulatorRef.current = 0
      lastPointRef.current = { x: 0, y: 0 }
      document.body.classList.remove('is-dragging')
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    window.addEventListener('pointercancel', handleUp)
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointercancel', handleUp)
    }
  }, [dimension, onChange])

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    dragRef.current = true
    lastPointRef.current = { x: event.clientX, y: event.clientY }
    onSelect()
    document.body.classList.add('is-dragging')
  }

  return (
    <mesh position={position} onPointerDown={handlePointerDown} onClick={(event) => event.stopPropagation()}>
      <sphereGeometry args={[selected ? 0.18 : 0.14, 18, 18]} />
      <meshStandardMaterial color={colors[dimension]} emissive={colors[dimension]} emissiveIntensity={selected ? 0.55 : 0.18} roughness={0.35} />
    </mesh>
  )
}

function UnitCubes({ dimensions }: { dimensions: CuboidDimensions }) {
  const cubes = []
  for (let x = 0; x < dimensions.length; x += 1) {
    for (let z = 0; z < dimensions.width; z += 1) {
      for (let y = 0; y < dimensions.height; y += 1) {
        const tint = (x + z + y) % 3 === 0 ? '#ffd983' : (x + z) % 2 === 0 ? '#9adfca' : '#9dd8f0'
        cubes.push(
          <mesh key={`${x}-${z}-${y}`} position={[-dimensions.length / 2 + x + 0.5, -dimensions.height / 2 + y + 0.5, -dimensions.width / 2 + z + 0.5]}>
            <boxGeometry args={[0.88, 0.88, 0.88]} />
            <meshStandardMaterial color={tint} roughness={0.6} />
          </mesh>,
        )
      }
    }
  }
  return <>{cubes}</>
}

function CuboidModel({ dimensions, selectedDimension, showUnits, onSelectDimension, onChangeDimension }: Omit<CuboidSceneProps, 'resetToken'>) {
  const { length, width, height } = dimensions
  const frontZ = width / 2 + 0.1
  const rightX = length / 2 + 0.1
  const topY = height / 2 + 0.1

  const lengthLine: [[number, number, number], [number, number, number]] = [[-length / 2, topY, frontZ], [length / 2, topY, frontZ]]
  const widthLine: [[number, number, number], [number, number, number]] = [[rightX, topY, -width / 2], [rightX, topY, width / 2]]
  const heightLine: [[number, number, number], [number, number, number]] = [[rightX, -height / 2, frontZ], [rightX, height / 2, frontZ]]

  return (
    <group>
      <mesh
        onClick={(event) => {
          event.stopPropagation()
          onSelectDimension(selectedDimension)
        }}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[length, height, width]} />
        <meshStandardMaterial color="#78c9eb" transparent opacity={showUnits ? 0.13 : 0.82} roughness={0.3} metalness={0.02} />
      </mesh>
      <Edges color="#2f6689" linewidth={showUnits ? 1 : 1.5} threshold={15} transparent opacity={showUnits ? 0.4 : 0.86} />
      {showUnits && <UnitCubes dimensions={dimensions} />}
      <Line points={lengthLine} color={colors.length} lineWidth={selectedDimension === 'length' ? 4 : 2.2} transparent opacity={selectedDimension === 'length' ? 1 : 0.65} />
      <Line points={widthLine} color={colors.width} lineWidth={selectedDimension === 'width' ? 4 : 2.2} transparent opacity={selectedDimension === 'width' ? 1 : 0.65} />
      <Line points={heightLine} color={colors.height} lineWidth={selectedDimension === 'height' ? 4 : 2.2} transparent opacity={selectedDimension === 'height' ? 1 : 0.65} />
      <ResizeHandle dimension="length" position={[0, topY, frontZ]} selected={selectedDimension === 'length'} onSelect={() => onSelectDimension('length')} onChange={(delta) => onChangeDimension('length', delta)} />
      <ResizeHandle dimension="width" position={[rightX, topY, 0]} selected={selectedDimension === 'width'} onSelect={() => onSelectDimension('width')} onChange={(delta) => onChangeDimension('width', delta)} />
      <ResizeHandle dimension="height" position={[rightX, 0, frontZ]} selected={selectedDimension === 'height'} onSelect={() => onSelectDimension('height')} onChange={(delta) => onChangeDimension('height', delta)} />
      <Html position={[0, topY + 0.2, frontZ]} center distanceFactor={8}>
        <span className={`scene-dimension-tag ${selectedDimension === 'length' ? 'is-active' : ''}`}>长 {length}</span>
      </Html>
      <Html position={[rightX + 0.05, topY + 0.2, 0]} center distanceFactor={8}>
        <span className={`scene-dimension-tag ${selectedDimension === 'width' ? 'is-active' : ''}`}>宽 {width}</span>
      </Html>
      <Html position={[rightX + 0.25, 0, frontZ]} center distanceFactor={8}>
        <span className={`scene-dimension-tag ${selectedDimension === 'height' ? 'is-active' : ''}`}>高 {height}</span>
      </Html>
    </group>
  )
}

function SceneContent(props: Omit<CuboidSceneProps, 'resetToken'> & { resetToken: number }) {
  const controlsRef = useRef<any>(null)

  useEffect(() => {
    controlsRef.current?.reset()
  }, [props.resetToken])

  return (
    <>
      <color attach="background" args={['#edf9f5']} />
      <ambientLight intensity={1.55} />
      <directionalLight position={[5, 8, 4]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 3, -5]} intensity={0.55} color="#b9dffc" />
      <group rotation={[-0.08, 0.18, 0.02]} position={[0, 0.08, 0]}>
        <CuboidModel {...props} />
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -props.dimensions.height / 2 - 0.22, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <shadowMaterial opacity={0.17} />
      </mesh>
      <gridHelper args={[16, 16, '#c9e6d8', '#d9eee6']} position={[0, -props.dimensions.height / 2 - 0.2, 0]} rotation={[0, 0, 0]} />
      <OrbitControls ref={controlsRef} enablePan={false} minDistance={5} maxDistance={14} minPolarAngle={0.45} maxPolarAngle={Math.PI / 2.05} target={[0, 0, 0]} />
    </>
  )
}

export function CuboidScene({ dimensions, selectedDimension, showUnits, resetToken, onSelectDimension, onChangeDimension }: CuboidSceneProps) {
  return (
    <Canvas
      className="cuboid-canvas"
      shadows
      dpr={[1, 1.7]}
      camera={{ position: [7.5, 5.6, 7.5], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
    >
      <SceneContent
        dimensions={dimensions}
        selectedDimension={selectedDimension}
        showUnits={showUnits}
        resetToken={resetToken}
        onSelectDimension={onSelectDimension}
        onChangeDimension={onChangeDimension}
      />
    </Canvas>
  )
}
