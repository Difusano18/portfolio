import { useGLTF } from '@react-three/drei'
import { useAnimations } from '@react-three/drei'
import { useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function AnimeGirl() {
  const { scene, animations } = useGLTF('https://models.readyplayer.me/64d3a6df9ce3b01ba50c89c9.glb', true)
  const { actions } = useAnimations(animations, scene)

  useEffect(() => {
    if (actions['idle']) {
      actions['idle'].play()
    }
  }, [actions])

  useFrame((state) => {
    // Плавне коливання
    scene.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1
  })

  return (
    <primitive 
      object={scene} 
      scale={[0.8, 0.8, 0.8]}
      position={[0, -1, 0]}
      rotation={[0, Math.PI / 4, 0]}
    />
  )
} 