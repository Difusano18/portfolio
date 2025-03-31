import { useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function AnimeCharacter() {
  // Завантажуємо модель
  const { scene, animations } = useGLTF('https://models.readyplayer.me/64d3a6df9ce3b01ba50c89c9.glb')
  const { actions, names } = useAnimations(animations, scene)

  useEffect(() => {
    // Запускаємо анімацію idle, якщо вона є
    if (names.includes('idle')) {
      actions['idle']?.reset().fadeIn(0.5).play()
    }
  }, [actions, names])

  useFrame((state) => {
    // Плавне погойдування моделі
    if (scene) {
      scene.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1
    }
  })

  return <primitive object={scene} scale={[1.5, 1.5, 1.5]} position={[0, -1.5, 0]} />
}

useGLTF.preload('https://models.readyplayer.me/64d3a6df9ce3b01ba50c89c9.glb') 