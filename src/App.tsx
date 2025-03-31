import styled from 'styled-components'
import { motion, AnimatePresence } from 'framer-motion'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { useMemo, useState, useRef, useEffect } from 'react'
import React from 'react'
import { projects, Project } from './data/projects'

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`

const ContactCard = styled(motion.div)`
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  width: 300px;
  z-index: 10;
  backdrop-filter: blur(10px);
  
  h2 {
    color: white;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    text-align: center;
  }
  
  p {
    color: #888;
    font-size: 0.9rem;
    margin-bottom: 1rem;
    text-align: center;
  }
`

const SocialButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  
  &.github {
    background: #24292e;
  }
  
  &.discord {
    background: #7289da;
  }
  
  &.telegram {
    background: #0088cc;
  }
  
  &.steam {
    background: #171a21;
  }
`

const Header = styled(motion.header)`
  padding: 2rem;
  text-align: center;
  position: relative;
  z-index: 1;

  h1 {
    font-size: 3.5rem;
    font-weight: 700;
    color: var(--neon-pink);
    text-shadow: 0 0 10px var(--neon-pink);
    margin-bottom: 1rem;
    background: linear-gradient(45deg, var(--neon-pink), var(--neon-purple));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: 1.2rem;
    color: var(--neon-blue);
    text-shadow: 0 0 5px var(--neon-blue);
  }
`

const BackgroundCanvas = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`

const ProjectsCard = styled(motion.div)`
  position: fixed;
  top: 25rem;
  right: 2rem;
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  width: 300px;
  z-index: 10;
  backdrop-filter: blur(10px);
  
  h3 {
    color: var(--neon-pink);
    font-size: 1.1rem;
    margin-bottom: 1rem;
    text-align: center;
    text-shadow: 0 0 5px var(--neon-pink);
  }
`

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #ff4444;
  padding: 0.2rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: 1.2rem;
  line-height: 1;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);

  &:hover {
    opacity: 1;
    background: rgba(255, 68, 68, 0.2);
  }
`

const ProjectItem = styled(motion.div)<{ $status: 'active' | 'paused', $progress: number }>`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
  }
  
  &:last-child {
    margin-bottom: 0;
  }

  .project-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }

  .project-title {
    color: #fff;
    font-size: 0.9rem;
    font-weight: 500;
  }

  .project-status {
    font-size: 0.8rem;
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    background: ${props => {
      switch (props.$status) {
        case 'active': return 'rgba(0, 255, 0, 0.2)';
        case 'paused': return 'rgba(255, 165, 0, 0.2)';
        default: return 'rgba(255, 255, 255, 0.1)';
      }
    }};
    color: ${props => {
      switch (props.$status) {
        case 'active': return '#00ff00';
        case 'paused': return '#ffa500';
        default: return '#fff';
      }
    }};
  }

  .project-description {
    color: #888;
    font-size: 0.8rem;
    margin-bottom: 0.5rem;
  }

  .project-technologies {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    
    span {
      font-size: 0.7rem;
      padding: 0.2rem 0.4rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      color: #aaa;
    }
  }

  .project-progress {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
    
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--neon-blue), var(--neon-pink));
      width: ${props => props.$progress}%;
      transition: width 0.3s ease;
    }
  }
`

const ConfirmDialog = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 1.5rem;
  width: 90%;
  max-width: 400px;
  z-index: 101;
  backdrop-filter: blur(10px);
  text-align: center;
  margin: 0 auto;

  h4 {
    color: #ff4444;
    font-size: 1.1rem;
    margin-bottom: 1rem;
  }

  p {
    color: #888;
    margin-bottom: 1.5rem;
  }

  .buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;

    button {
      padding: 0.8rem 1.5rem;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-weight: 500;
      transition: opacity 0.2s ease;
      min-width: 120px;

      &:hover {
        opacity: 0.9;
      }
    }

    .confirm {
      background: #ff4444;
      color: white;
    }

    .cancel {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }
  }
`

interface ProjectItemProps {
  project: Project;
  onDelete: (id: number) => void;
}

const ProjectItemComponent = ({ project, onDelete }: ProjectItemProps) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (project.link && !e.defaultPrevented) {
      window.open(project.link, '_blank');
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    onDelete(project.id);
    setShowConfirm(false);
  };

  return (
    <>
      <ProjectItem
        $status={project.status}
        $progress={project.progress}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleClick}
        style={{ cursor: project.link ? 'pointer' : 'default' }}
      >
        <DeleteButton onClick={handleDelete}>×</DeleteButton>
        <div className="project-header">
          <span className="project-title">{project.title}</span>
          <span className="project-status">
            {project.status === 'active' ? 'Активний' : 'Призупинено'}
          </span>
        </div>
        <div className="project-description">{project.description}</div>
        {project.technologies && (
          <div className="project-technologies">
            {project.technologies.map((tech, index) => (
              <span key={index}>{tech}</span>
            ))}
          </div>
        )}
        <div className="project-progress">
          <div className="progress-bar" />
        </div>
      </ProjectItem>

      {showConfirm && (
        <div style={{ position: 'relative', zIndex: 1000 }}>
          <Overlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConfirm(false)}
          />
          <ConfirmDialog
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <h4>Видалити проект?</h4>
            <p>Ви впевнені, що хочете видалити проект "{project.title}"?</p>
            <div className="buttons">
              <button className="cancel" onClick={() => setShowConfirm(false)}>
                Скасувати
              </button>
              <button className="confirm" onClick={confirmDelete}>
                Видалити
              </button>
            </div>
          </ConfirmDialog>
        </div>
      )}
    </>
  );
};

const AddProjectButton = styled(motion.button)`
  background: linear-gradient(45deg, var(--neon-blue), var(--neon-pink));
  border: none;
  border-radius: 8px;
  color: white;
  padding: 0.8rem;
  width: 100%;
  margin-top: 1rem;
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`

const Modal = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  width: 90%;
  max-width: 500px;
  z-index: 100;
  backdrop-filter: blur(10px);

  h3 {
    color: var(--neon-pink);
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }
`

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  z-index: 99;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    color: #fff;
    font-size: 0.9rem;
  }

  input, textarea {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    padding: 0.8rem;
    color: white;
    font-size: 0.9rem;

    &:focus {
      outline: none;
      border-color: var(--neon-blue);
    }
  }

  textarea {
    resize: vertical;
    min-height: 100px;
  }
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;

  button {
    flex: 1;
    padding: 0.8rem;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-weight: 500;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.9;
    }
  }

  .save {
    background: linear-gradient(45deg, var(--neon-blue), var(--neon-pink));
    color: white;
  }

  .cancel {
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }
`

const TechnologiesInput = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;

  .tag {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    padding: 0.4rem 0.8rem;
    color: white;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    button {
      background: none;
      border: none;
      color: #ff4444;
      cursor: pointer;
      padding: 0;
      font-size: 1.2rem;
      line-height: 1;
    }
  }

  input {
    background: none;
    border: none;
    color: white;
    padding: 0.4rem;
    font-size: 0.8rem;
    flex: 1;
    min-width: 100px;

    &:focus {
      outline: none;
    }
  }
`

function ProjectForm({ onClose, onSave }: { onClose: () => void, onSave: (project: Omit<Project, 'id'>) => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'active' | 'paused'>('active')
  const [progress, setProgress] = useState(0)
  const [link, setLink] = useState('')
  const [technologies, setTechnologies] = useState<string[]>([])
  const [techInput, setTechInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      title,
      description,
      status,
      progress,
      link: link || undefined,
      technologies: technologies.length > 0 ? technologies : undefined
    })
    onClose()
  }

  const handleTechKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault()
      setTechnologies([...technologies, techInput.trim()])
      setTechInput('')
    }
  }

  const removeTechnology = (index: number) => {
    setTechnologies(technologies.filter((_, i) => i !== index))
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <label>Назва проекту</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </FormGroup>

      <FormGroup>
        <label>Опис</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </FormGroup>

      <FormGroup>
        <label>Статус</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as 'active' | 'paused')}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            padding: '0.8rem',
            color: 'white',
            fontSize: '0.9rem'
          }}
        >
          <option value="active">Активний</option>
          <option value="paused">Призупинено</option>
        </select>
      </FormGroup>

      <FormGroup>
        <label>Прогрес ({progress}%)</label>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => setProgress(Number(e.target.value))}
        />
      </FormGroup>

      <FormGroup>
        <label>Посилання на проект (необов'язково)</label>
        <input
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://github.com/..."
        />
      </FormGroup>

      <FormGroup>
        <label>Технології</label>
        <TechnologiesInput>
          {technologies.map((tech, index) => (
            <span key={index} className="tag">
              {tech}
              <button type="button" onClick={() => removeTechnology(index)}>×</button>
            </span>
          ))}
          <input
            type="text"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            onKeyDown={handleTechKeyDown}
            placeholder="Введіть технологію та натисніть Enter"
          />
        </TechnologiesInput>
      </FormGroup>

      <ButtonGroup>
        <button type="button" className="cancel" onClick={onClose}>
          Скасувати
        </button>
        <button type="submit" className="save">
          Зберегти
        </button>
      </ButtonGroup>
    </Form>
  )
}

function Sun() {
  // Створюємо основну сферу сонця
  const sunGeometry = useMemo(() => new THREE.SphereGeometry(5, 64, 64), [])
  const sunMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      
      float noise(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }
      
      void main() {
        vec3 baseColor = vec3(1.0, 0.85, 0.1);
        
        float pulse1 = sin(time * 1.5) * 0.05;
        float pulse2 = sin(time * 2.5 + 1.0) * 0.03;
        float pulse = pulse1 + pulse2 + 0.95;
        
        float surfaceNoise = noise(vUv * 10.0 + time * 0.1) * 0.15;
        surfaceNoise += noise(vUv * 20.0 - time * 0.2) * 0.1;
        
        vec3 viewDir = normalize(vViewPosition);
        float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 1.5);
        
        vec3 color = mix(baseColor, baseColor * 0.7, fresnel);
        color = color * pulse + surfaceNoise;
        color = mix(color, vec3(1.0, 0.9, 0.5), surfaceNoise * 0.5);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `
  }), [])

  // Створюємо внутрішню корону
  const innerCoronaGeometry = useMemo(() => new THREE.SphereGeometry(5.5, 64, 64), [])
  const innerCoronaMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      
      void main() {
        vec3 viewDir = normalize(vViewPosition);
        float intensity = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);
        vec3 color = mix(vec3(1.0, 0.8, 0.4), vec3(1.0, 0.6, 0.1), intensity);
        gl_FragColor = vec4(color, intensity * 0.7);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  }), [])

  // Створюємо зовнішню корону
  const outerCoronaGeometry = useMemo(() => new THREE.SphereGeometry(8, 64, 64), [])
  const outerCoronaMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      uniform float time;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      
      void main() {
        vec3 viewDir = normalize(vViewPosition);
        float intensity = pow(1.0 - abs(dot(vNormal, viewDir)), 4.0);
        vec3 color = mix(vec3(1.0, 0.6, 0.1), vec3(1.0, 0.4, 0.0), intensity);
        gl_FragColor = vec4(color, intensity * 0.3);
      }
    `,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  }), [])

  useFrame((state) => {
    sunMaterial.uniforms.time.value = state.clock.getElapsedTime()
    innerCoronaMaterial.uniforms.time.value = state.clock.getElapsedTime()
    outerCoronaMaterial.uniforms.time.value = state.clock.getElapsedTime()
  })

  return (
    <group position={[0, 0, -20]}>
      <mesh geometry={sunGeometry} material={sunMaterial} />
      <mesh geometry={innerCoronaGeometry} material={innerCoronaMaterial} />
      <mesh geometry={outerCoronaGeometry} material={outerCoronaMaterial} />
      
      {/* Світло від сонця */}
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffdd99" distance={100} decay={1} />
      <pointLight position={[0, 0, 0]} intensity={1} color="#ff9933" distance={150} decay={1.5} />
      
      {/* Загальне освітлення сцени */}
      <hemisphereLight
        intensity={0.3}
        color="#ffebcc"
        groundColor="#331100"
      />
    </group>
  )
}

function CameraAnimation() {
  const { camera } = useThree()
  
  useFrame(() => {
    // Повільний рух вперед
    camera.position.z -= 0.05
    
    // Якщо камера зайшла надто далеко, повертаємо її назад
    if (camera.position.z < -50) {
      camera.position.z = 15
    }
  })
  
  return null
}

function App() {
  const [localProjects] = useState(() => {
    return projects
  })

  return (
    <AppContainer>
      <ContactCard
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Yasu (Dev)</h2>
        <p>Obscure Developer from Ukraine</p>
        <SocialButton href="https://github.com/Difusano18" target="_blank" className="github">
          GitHub
        </SocialButton>
        <SocialButton href="https://discord.com/users/balabol0868" target="_blank" className="discord">
          Discord
        </SocialButton>
        <SocialButton href="https://t.me/Dyrach_y_o" target="_blank" className="telegram">
          Telegram
        </SocialButton>
        <SocialButton href="https://steamcommunity.com/profiles/76561198320032775" target="_blank" className="steam">
          Steam
        </SocialButton>
      </ContactCard>

      <ProjectsCard
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h3>Проекти</h3>
        {localProjects.map((project) => (
          <ProjectItem
            key={project.id}
            $status={project.status}
            $progress={project.progress}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => project.link && window.open(project.link, '_blank')}
            style={{ cursor: project.link ? 'pointer' : 'default' }}
          >
            <div className="project-header">
              <span className="project-title">{project.title}</span>
              <span className="project-status">
                {project.status === 'active' ? 'Активний' : 'Призупинено'}
              </span>
            </div>
            <div className="project-description">{project.description}</div>
            {project.technologies && (
              <div className="project-technologies">
                {project.technologies.map((tech, index) => (
                  <span key={index}>{tech}</span>
                ))}
              </div>
            )}
            <div className="project-progress">
              <div className="progress-bar" />
            </div>
          </ProjectItem>
        ))}
      </ProjectsCard>

      <BackgroundCanvas>
        <Canvas 
          camera={{ position: [0, 0, 15], fov: 75 }}
          style={{ background: '#000' }}
        >
          <OrbitControls 
            enableZoom={true}
            enablePan={false}
            maxPolarAngle={Math.PI}
            minPolarAngle={0}
            autoRotate
            autoRotateSpeed={0.1}
            maxDistance={100}
            minDistance={10}
          />
          <CameraAnimation />
          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={5}
            saturation={0.8}
            fade
            speed={2}
          />
          <Sun />
          <fog attach="fog" args={['#000000', 30, 90]} />
        </Canvas>
      </BackgroundCanvas>
      
      <Header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1>Портфоліо</h1>
        <p>Розробник з України</p>
      </Header>
    </AppContainer>
  )
}

export default App 