import { Edges, Html, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { useTranslate } from '../i18n/i18n'

type CubeSceneProps = {
  edgeLength: number
  showUnits: boolean
  resetToken: number
  onChange: (delta: number) => void
}

const CUBE_COLOR = '#9b8af5'
const CUBE_EMISSIVE = '#b7a4f5'

function CubeHandle({ edgeLength, onChange }: { edgeLength: number; onChange: (delta: number) => void }) {
  const dragRef = useRef(false)
  const accumulatorRef = useRef(0)
  const lastPointRef = useRef({ x: 0, y: 0 })
  const [grabbed, setGrabbed] = useState(false)
  const topY = edgeLength / 2 + 0.1

  useEffect(() => {
    const handleMove = (event: PointerEvent) => {
      if (!dragRef.current) return
      const movementY = event.clientY - lastPointRef.current.y
      lastPointRef.current = { x: event.clientX, y: event.clientY }
      accumulatorRef.current += -movementY
      const threshold = event.pointerType === 'touch' ? 18 : 22
      while (Math.abs(accumulatorRef.current) >= threshold) {
        const direction = accumulatorRef.current > 0 ? 1 : -1
        onChange(direction)
        accumulatorRef.current -= direction * threshold
      }
    }

    const handleUp = () => {
      if (!dragRef.current) return
      dragRef.current = false
      accumulatorRef.current = 0
      lastPointRef.current = { x: 0, y: 0 }
      setGrabbed(false)
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
  }, [onChange])

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
    dragRef.current = true
    lastPointRef.current = { x: event.clientX, y: event.clientY }
    setGrabbed(true)
    document.body.classList.add('is-dragging')
  }

  return (
    <group position={[0, topY, edgeLength / 2 + 0.1]}>
      <mesh onPointerDown={handlePointerDown} onClick={(e) => e.stopPropagation()}>
        <sphereGeometry args={[0.18, 18, 18]} />
        <meshStandardMaterial color={CUBE_COLOR} emissive={CUBE_EMISSIVE} emissiveIntensity={grabbed ? 0.75 : 0.35} roughness={0.35} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.32, 8, 8]} />
        <meshBasicMaterial visible={false} />
      </mesh>
      {grabbed && (
        <mesh>
          <ringGeometry args={[0.28, 0.34, 24]} />
          <meshBasicMaterial color={CUBE_EMISSIVE} transparent opacity={0.5} side={2} />
        </mesh>
      )}
    </group>
  )
}

function UnitCubes({ edgeLength }: { edgeLength: number }) {
  const cubes = []
  for (let x = 0; x < edgeLength; x += 1) {
    for (let y = 0; y < edgeLength; y += 1) {
      for (let z = 0; z < edgeLength; z += 1) {
        const tint = (x + y + z) % 3 === 0 ? '#d4c5f9' : (x + z) % 2 === 0 ? '#e8e0fc' : '#c9b8f7'
        cubes.push(
          <mesh key={`${x}-${y}-${z}`} position={[-edgeLength / 2 + x + 0.5, -edgeLength / 2 + y + 0.5, -edgeLength / 2 + z + 0.5]}>
            <boxGeometry args={[0.88, 0.88, 0.88]} />
            <meshStandardMaterial color={tint} roughness={0.6} />
          </mesh>,
        )
      }
    }
  }
  return <>{cubes}</>
}

function SceneContent({ edgeLength, showUnits, resetToken, onChange }: CubeSceneProps) {
  const controlsRef = useRef<any>(null)
  const t = useTranslate()

  useEffect(() => {
    controlsRef.current?.reset()
  }, [resetToken])

  return (
    <>
      <color attach="background" args={['#f5f0ff']} />
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 8, 4]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
      <directionalLight position={[-4, 3, -5]} intensity={0.5} color="#d4c5f9" />
      <group rotation={[-0.1, 0.3, 0.02]} position={[0, 0.08, 0]}>
        <mesh castShadow receiveShadow onClick={(e) => e.stopPropagation()}>
          <boxGeometry args={[edgeLength, edgeLength, edgeLength]} />
          <meshStandardMaterial color={CUBE_COLOR} transparent opacity={showUnits ? 0.12 : 0.8} roughness={0.3} metalness={0.02} />
        </mesh>
        <Edges color="#6b5ce7" linewidth={1.5} threshold={15} transparent opacity={showUnits ? 0.4 : 0.86} />
        {showUnits && <UnitCubes edgeLength={edgeLength} />}
        <CubeHandle edgeLength={edgeLength} onChange={onChange} />
        <Html position={[0, edgeLength / 2 + 0.35, 0]} center distanceFactor={8}>
          <span className={`scene-dimension-tag is-active`}>{t('cubeEdge')} {edgeLength}</span>
        </Html>
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -edgeLength / 2 - 0.22, 0]} receiveShadow>
        <planeGeometry args={[18, 18]} />
        <shadowMaterial opacity={0.17} />
      </mesh>
      <gridHelper args={[16, 16, '#ddd4f7', '#eee9fc']} position={[0, -edgeLength / 2 - 0.2, 0]} />
      <OrbitControls ref={controlsRef} enablePan={false} minDistance={5} maxDistance={14} minPolarAngle={0.45} maxPolarAngle={Math.PI / 2.05} target={[0, 0, 0]} />
    </>
  )
}

export function CubeScene({ edgeLength, showUnits, resetToken, onChange }: CubeSceneProps) {
  return (
    <Canvas
      className="cuboid-canvas"
      shadows
      dpr={[1, 1.7]}
      camera={{ position: [7, 5, 7], fov: 38 }}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: 'none' }}
    >
      <SceneContent edgeLength={edgeLength} showUnits={showUnits} resetToken={resetToken} onChange={onChange} />
    </Canvas>
  )
}
