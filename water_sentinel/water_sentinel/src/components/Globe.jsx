import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function Globe({ stations = [] }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const width = mount.clientWidth
    const height = mount.clientHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
    camera.position.z = 3

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    mount.appendChild(renderer.domElement)

    const earthGroup = new THREE.Group()
    scene.add(earthGroup)

    const textureLoader = new THREE.TextureLoader()
    textureLoader.setCrossOrigin('anonymous')

    const earthTexture = textureLoader.load(
      'https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg'
    )
    const bumpTexture = textureLoader.load(
      'https://threejs.org/examples/textures/planets/earth_normal_2048.jpg'
    )
    const specTexture = textureLoader.load(
      'https://threejs.org/examples/textures/planets/earth_specular_2048.jpg'
    )
    const cloudTexture = textureLoader.load(
      'https://threejs.org/examples/textures/planets/earth_clouds_1024.png'
    )

    const earthGeo = new THREE.SphereGeometry(1, 64, 64)
    const earthMat = new THREE.MeshPhongMaterial({
      map: earthTexture,
      normalMap: bumpTexture,
      specularMap: specTexture,
      specular: new THREE.Color(0x335577),
      shininess: 22,
    })
    const earth = new THREE.Mesh(earthGeo, earthMat)
    earthGroup.add(earth)

    // Volumetric cloud layers (real spheres, no points)
    const cloudLayers = [
      { radius: 1.013, opacity: 0.85, spinMul: 1.3, tilt: 0.0 },
      { radius: 1.025, opacity: 0.6, spinMul: 1.9, tilt: 0.3 },
      { radius: 1.05, opacity: 0.4, spinMul: 2.6, tilt: -0.5 },
      { radius: 1.09, opacity: 0.22, spinMul: 3.4, tilt: 0.7 },
    ]

    const clouds = cloudLayers.map(({ radius, opacity, tilt }) => {
      const geo = new THREE.SphereGeometry(radius, 64, 64)
      const mat = new THREE.MeshPhongMaterial({
        map: cloudTexture,
        transparent: true,
        opacity,
        depthWrite: false,
      })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.rotation.z = tilt
      earthGroup.add(mesh)
      return mesh
    })

    // Atmosphere
    const atmosphereGeo = new THREE.SphereGeometry(1.28, 64, 64)
    const atmosphereMat = new THREE.ShaderMaterial({
      uniforms: { glowColor: { value: new THREE.Color(0x00d4ff) } },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 2.6);
          gl_FragColor = vec4(glowColor, 1.0) * intensity;
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    })
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat)
    scene.add(atmosphere)

    const rimGeo = new THREE.SphereGeometry(1.005, 64, 64)
    const rimMat = new THREE.ShaderMaterial({
      uniforms: { glowColor: { value: new THREE.Color(0x4dd0ff) } },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.88 - dot(vNormal, vec3(0, 0, 1.0)), 4.5);
          gl_FragColor = vec4(glowColor, 1.0) * intensity * 0.6;
        }
      `,
      side: THREE.FrontSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    })
    const rim = new THREE.Mesh(rimGeo, rimMat)
    earthGroup.add(rim)

    // Lat/Lon helper
    const latLonToVec3 = (lat, lon, radius = 1.01) => {
      const phi = (90 - lat) * (Math.PI / 180)
      const theta = (lon + 180) * (Math.PI / 180)
      return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
      )
    }

    // Station markers
    const markersGroup = new THREE.Group()
    earthGroup.add(markersGroup)

    let pMax = 1
    if (stations.length > 0) {
      pMax = Math.max(...stations.map((s) => s['Dissolved Reactive Phosphorus'] || 0))
    }

    stations.forEach((station) => {
      const pos = latLonToVec3(station.Latitude, station.Longitude, 1.015)
      const phosNorm = (station['Dissolved Reactive Phosphorus'] || 0) / pMax
      const color = new THREE.Color().setHSL(0.55 - phosNorm * 0.55, 0.9, 0.55)
      const dotGeo = new THREE.SphereGeometry(0.006 + phosNorm * 0.006, 8, 8)
      const dotMat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 })
      const dot = new THREE.Mesh(dotGeo, dotMat)
      dot.position.copy(pos)
      markersGroup.add(dot)
    })

    // South Africa subtle glow
    const saPos = latLonToVec3(-28.5, 26.5, 1.025)
    const saTexture = (() => {
      const canvas = document.createElement('canvas')
      canvas.width = 128
      canvas.height = 128
      const ctx = canvas.getContext('2d')
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
      grad.addColorStop(0, 'rgba(120, 230, 255, 0.55)')
      grad.addColorStop(0.4, 'rgba(0, 200, 255, 0.25)')
      grad.addColorStop(1, 'rgba(0, 180, 255, 0)')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 128, 128)
      return new THREE.CanvasTexture(canvas)
    })()
    const glowSprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: saTexture,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    )
    glowSprite.position.copy(saPos)
    glowSprite.scale.set(0.18, 0.18, 1)
    earthGroup.add(glowSprite)

    // Lights
    scene.add(new THREE.AmbientLight(0x445588, 0.55))
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.7)
    sunLight.position.set(3, 1, 4)
    scene.add(sunLight)
    const fillLight = new THREE.PointLight(0x00d4ff, 1.4, 5)
    fillLight.position.set(0.6, 0.4, 1.8)
    scene.add(fillLight)

    // Stars
    const starsGeo = new THREE.BufferGeometry()
    const starPositions = []
    const starColors = []
    for (let i = 0; i < 5000; i++) {
      const r = 50 + Math.random() * 60
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      starPositions.push(
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta),
        r * Math.cos(phi)
      )
      const b = 0.5 + Math.random() * 0.5
      starColors.push(b, b, b * 1.05)
    }
    starsGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3))
    starsGeo.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3))
    const stars = new THREE.Points(
      starsGeo,
      new THREE.PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.9 })
    )
    scene.add(stars)

    // ============ AUTOPLAY ANIMATION ============
    // Phase 1 (0-3s): rotate 360° fast, land facing Africa
    // Phase 2 (3s+): planet frozen showing Africa; only clouds + stars keep moving.
    // NO zoom — looks better seen from far.
    const FINAL_ROT_Y = -Math.PI * 0.6
    const FINAL_ROT_X = -0.15   // tiny south-up tilt, kept gentle
    const INITIAL_ROT_Y = FINAL_ROT_Y - Math.PI * 2

    earthGroup.rotation.y = INITIAL_ROT_Y
    earthGroup.rotation.x = FINAL_ROT_X
    camera.position.z = 3

    const startTime = performance.now()
    const PHASE1_END = 3000

    let frameId
    let pulseTime = 0
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

    const animate = () => {
      const elapsed = performance.now() - startTime
      pulseTime += 0.035

      if (elapsed < PHASE1_END) {
        const t = elapsed / PHASE1_END
        const eased = easeOutCubic(t)
        earthGroup.rotation.y =
          INITIAL_ROT_Y + (FINAL_ROT_Y - INITIAL_ROT_Y) * eased
      } else {
        // Phase 2: locked on Africa, only clouds move
        earthGroup.rotation.y = FINAL_ROT_Y
      }

      // Clouds always rotate (faster during intro, slower after)
      const cloudBaseSpin = elapsed < PHASE1_END ? 0.0014 : 0.0008
      clouds.forEach((c, i) => {
        c.rotation.y += cloudBaseSpin * cloudLayers[i].spinMul
        if (i >= 2) c.rotation.x += cloudBaseSpin * 0.2 * (i - 1)
      })

      // Stars subtle parallax
      stars.rotation.y += 0.00005

      // South Africa subtle glow pulse (no zoom dependence anymore)
      glowSprite.scale.setScalar(0.18 + Math.sin(pulseTime) * 0.025)
      glowSprite.material.opacity = 0.35 + Math.sin(pulseTime) * 0.1

      renderer.render(scene, camera)
      frameId = requestAnimationFrame(animate)
    }
    animate()

    const handleResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(frameId)
      if (mount && renderer.domElement && renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement)
      }
      earthGeo.dispose()
      earthMat.dispose()
      clouds.forEach((c) => {
        c.geometry.dispose()
        c.material.dispose()
      })
      atmosphereGeo.dispose()
      atmosphereMat.dispose()
      rimGeo.dispose()
      rimMat.dispose()
      starsGeo.dispose()
      renderer.dispose()
    }
  }, [stations])

  return <div ref={mountRef} className="globe-canvas" />
}
