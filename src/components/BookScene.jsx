import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Preload } from '@react-three/drei'
import { CanvasTexture, SRGBColorSpace, MathUtils } from 'three'

function makeCoverTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1440
  const ctx = canvas.getContext('2d')
  const bg = ctx.createLinearGradient(0, 0, 1024, 1440)
  bg.addColorStop(0, '#273d3b')
  bg.addColorStop(.55, '#142a29')
  bg.addColorStop(1, '#091a1b')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, 1024, 1440)
  ctx.strokeStyle = '#b99b65'
  ctx.lineWidth = 3
  ctx.strokeRect(57, 58, 910, 1324)
  ctx.lineWidth = 1
  ctx.strokeRect(78, 80, 868, 1280)
  ctx.fillStyle = '#d8bc82'
  ctx.textAlign = 'center'
  ctx.font = '500 22px Arial'
  ctx.letterSpacing = '9px'
  ctx.fillText('E D I C I O N E S   L U M E N', 512, 143)
  ctx.save()
  ctx.translate(512, 575)
  for (let i = 0; i < 8; i++) {
    ctx.beginPath()
    ctx.ellipse(0, 0, 190 + i * 22, 190 + i * 22, i * .32, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(210, 178, 111, ${.62 - i * .045})`
    ctx.lineWidth = 2
    ctx.stroke()
  }
  ctx.beginPath()
  ctx.arc(0, 0, 56, 0, Math.PI * 2)
  ctx.fillStyle = '#c5a873'
  ctx.fill()
  ctx.fillStyle = '#e9d3a5'
  ctx.font = '68px Georgia'
  ctx.fillText('✦', 0, 25)
  ctx.restore()
  ctx.fillStyle = '#f2e5cb'
  ctx.font = '500 82px Georgia'
  ctx.fillText('EL ATLAS', 512, 1010)
  ctx.fillText('DE LAS HORAS', 512, 1100)
  ctx.fillStyle = '#d2b47e'
  ctx.font = '400 27px Arial'
  ctx.fillText('C L A R A   V A L D É S', 512, 1288)
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

function Book({ progressRef }) {
  const book = useRef()
  const cover = useRef()
  const { size } = useThree()
  const texture = useMemo(() => makeCoverTexture(), [])
  const pointer = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const handlePointer = event => {
      pointer.current.x = (event.clientX / window.innerWidth - .5) * 2
      pointer.current.y = (event.clientY / window.innerHeight - .5) * 2
    }
    window.addEventListener('pointermove', handlePointer, { passive: true })
    return () => { window.removeEventListener('pointermove', handlePointer); texture.dispose() }
  }, [texture])
  useFrame(({ clock }, delta) => {
    if (!book.current || !cover.current) return
    const mobile = size.width < 700
    const progress = progressRef.current
    const ease = Math.min(1, delta * 3.5)
    const targetX = mobile ? 0 : 1.58 - progress * 1.5
    const targetY = (mobile ? -.15 : -.05) + Math.sin(clock.elapsedTime * .8) * .09 - progress * .06
    book.current.position.x = MathUtils.lerp(book.current.position.x, targetX, ease)
    book.current.position.y = MathUtils.lerp(book.current.position.y, targetY, ease)
    book.current.rotation.y = MathUtils.lerp(book.current.rotation.y, -.28 + progress * .66 + (mobile ? 0 : pointer.current.x * .085), ease)
    book.current.rotation.x = MathUtils.lerp(book.current.rotation.x, -.05 + (mobile ? 0 : -pointer.current.y * .065), ease)
    book.current.rotation.z = MathUtils.lerp(book.current.rotation.z, -.075 - progress * .055, ease)
    cover.current.rotation.y = MathUtils.lerp(cover.current.rotation.y, progress * 1.13, ease)
    const scale = mobile ? .72 : 1
    book.current.scale.setScalar(MathUtils.lerp(book.current.scale.x, scale - progress * .05, ease))
  })

  const dark = '#172c2b'
  const cream = '#e6d9bf'
  return <group ref={book} position={[1.58, 0, 0]} rotation={[-.05, -.28, -.075]}>
    <mesh position={[0, 0, -.16]} castShadow><boxGeometry args={[2.73, 3.82, .13]} /><meshStandardMaterial color={dark} roughness={.6} metalness={.08} /></mesh>
    <mesh position={[0, 0, .01]} castShadow><boxGeometry args={[2.52, 3.62, .29]} /><meshStandardMaterial color={cream} roughness={.85} /></mesh>
    <mesh position={[1.262, 0, .015]}><boxGeometry args={[.014, 3.53, .26]} /><meshStandardMaterial color="#cbbd9d" roughness={.9} /></mesh>
    <mesh position={[0, -1.815, .012]}><boxGeometry args={[2.45, .012, .26]} /><meshStandardMaterial color="#c8ba9e" roughness={.9} /></mesh>
    <mesh position={[-1.37, 0, .02]} castShadow><boxGeometry args={[.17, 3.78, .47]} /><meshStandardMaterial color="#0d2323" roughness={.58} /></mesh>
    <group ref={cover} position={[-1.35, 0, .23]}>
      <mesh position={[1.35, 0, 0]} castShadow>
        <boxGeometry args={[2.7, 3.8, .105]} />
        <meshStandardMaterial attach="material-0" color={dark} roughness={.55} />
        <meshStandardMaterial attach="material-1" color={dark} roughness={.55} />
        <meshStandardMaterial attach="material-2" color={dark} roughness={.55} />
        <meshStandardMaterial attach="material-3" color={dark} roughness={.55} />
        <meshStandardMaterial attach="material-4" map={texture} roughness={.55} metalness={.07} />
        <meshStandardMaterial attach="material-5" color="#cbbd9c" roughness={.85} />
      </mesh>
    </group>
  </group>
}

function VoxelLibrary() {
  const books = []
  const colors = ['#934c3e', '#b48645', '#376a5d', '#64537a', '#3e6374', '#b1a77f']
  for (let row = 0; row < 4; row += 1) {
    for (let column = -5; column < 6; column += 1) {
      const width = .18 + ((row * 5 + column + 10) % 3) * .08
      books.push(<mesh key={`${row}-${column}`} position={[column * .7 + (row % 2) * .08, -.98 + row * .73, -.92]} castShadow><boxGeometry args={[width, .48 + ((row + column + 10) % 2) * .1, .24]} /><meshStandardMaterial color={colors[(row * 2 + column + 10) % colors.length]} roughness={.92} /></mesh>)
    }
  }
  const shelves = []
  for (let row = 0; row < 5; row += 1) shelves.push(<mesh key={`shelf-${row}`} position={[0, -1.28 + row * .73, -.73]} castShadow><boxGeometry args={[8.25, .06, .5]} /><meshStandardMaterial color="#3d302a" roughness={1} /></mesh>)
  return <group position={[0, .12, 0]}><mesh position={[0, .52, -1.06]} receiveShadow><boxGeometry args={[8.9, 5.3, .24]} /><meshStandardMaterial color="#233c35" roughness={1} /></mesh>{shelves}{books}<mesh position={[-4.3, .48, -.72]} castShadow><boxGeometry args={[.28, 5.1, .62]} /><meshStandardMaterial color="#453229" roughness={1} /></mesh><mesh position={[4.3, .48, -.72]} castShadow><boxGeometry args={[.28, 5.1, .62]} /><meshStandardMaterial color="#453229" roughness={1} /></mesh><mesh position={[0, -1.78, -.62]} receiveShadow><boxGeometry args={[9.2, .16, 2.7]} /><meshStandardMaterial color="#49362b" roughness={1} /></mesh><EnchantedTable /></group>
}

function EnchantedTable() {
  return <group position={[0, -1.28, .35]}><mesh position={[0, .15, 0]} castShadow><boxGeometry args={[2.15, .34, 1.55]} /><meshStandardMaterial color="#183c3a" roughness={.65} metalness={.08} /></mesh><mesh position={[0, -.48, 0]} castShadow><boxGeometry args={[1.45, 1.05, 1.05]} /><meshStandardMaterial color="#202d38" roughness={.72} /></mesh><mesh position={[0, .34, 0]}><boxGeometry args={[1.66, .06, 1.1]} /><meshStandardMaterial color="#42b6a3" emissive="#1a746a" emissiveIntensity={.55} roughness={.35} /></mesh><mesh position={[-.58, .42, .22]} rotation={[0, 0, -.18]} castShadow><boxGeometry args={[.7, .06, .45]} /><meshStandardMaterial color="#f2e8c9" roughness={.8} /></mesh><mesh position={[.58, .42, -.22]} rotation={[0, 0, .18]} castShadow><boxGeometry args={[.7, .06, .45]} /><meshStandardMaterial color="#e4d6b3" roughness={.8} /></mesh></group>
}

export default function BookScene({ progressRef }) {
  return <Canvas className="book-canvas" dpr={[1, 1.6]} camera={{ position: [0, 0, 8.4], fov: 38 }} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
    <ambientLight intensity={1.25} color="#e6e0c6" />
    <hemisphereLight intensity={1.2} color="#dfead7" groundColor="#10251f" />
    <directionalLight position={[-3, 5, 6]} intensity={2.2} color="#ffe0a5" />
    <pointLight position={[0, 1, 3]} intensity={32} color="#52e3c7" distance={9} />
    <pointLight position={[-3, 2, 2]} intensity={7} color="#d88a58" distance={9} />
    <VoxelLibrary />
    <Book progressRef={progressRef} />
    <Preload all />
  </Canvas>
}
