import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const EARTH_RADIUS = 5.2;

// Shared global cache so the 3D model is downloaded and parsed once, and reused across route navigation
let cachedGLTFScene = null;
let gltfPromise = null;
let lastGlobalRotation = 1.95; // Preserve rotation angle across page transitions

function getEarthModel() {
  if (cachedGLTFScene) {
    return Promise.resolve(cachedGLTFScene);
  }
  if (!gltfPromise) {
    gltfPromise = new Promise((resolve, reject) => {
      const gltfLoader = new GLTFLoader();
      gltfLoader.load(
        '/earth.glb',
        (gltf) => {
          const model = gltf.scene;

          // Normalize scale and center to match EARTH_RADIUS
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          const maxDim = Math.max(size.x, size.y, size.z) || 1;

          const scaleFactor = (EARTH_RADIUS * 2) / maxDim;
          model.scale.setScalar(scaleFactor);
          model.position.sub(center.clone().multiplyScalar(scaleFactor));

          // Enhance realistic PBR material properties
          model.traverse((child) => {
            if (child.isMesh && child.material) {
              child.material.roughness = 0.55;
              child.material.metalness = 0.08;
              if (child.material.map) {
                child.material.map.colorSpace = THREE.SRGBColorSpace;
              }
            }
          });

          cachedGLTFScene = model;
          resolve(model);
        },
        undefined,
        (err) => {
          gltfPromise = null; // allow retry
          reject(err);
        }
      );
    });
  }
  return gltfPromise;
}

// Start preloading immediately at module load time
if (typeof window !== 'undefined') {
  getEarthModel().catch(() => {});
}

const EarthBackground = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isMounted = true;
    let activeModel = null;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch (e) {
      console.warn('WebGL not supported:', e);
      return;
    }

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.72;

    // Clear any previous canvas element before attaching
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);

    // 2. Cinematic Space Lighting
    const sunLight = new THREE.DirectionalLight(0xfff8ee, 1.6);
    sunLight.position.set(3.5, 5.5, 3.2);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x060e1d, 0.2);
    scene.add(ambientLight);

    const horizonRimLight = new THREE.DirectionalLight(0xfff5ea, 0.5);
    horizonRimLight.position.set(0.0, 6.5, -2.5);
    scene.add(horizonRimLight);

    const secondaryFill = new THREE.DirectionalLight(0x1e3a8a, 0.25);
    secondaryFill.position.set(0, -6, 2);
    scene.add(secondaryFill);

    // 3. Earth Hierarchy
    const earthRoot = new THREE.Group();
    scene.add(earthRoot);

    const earthTiltGroup = new THREE.Group();
    earthTiltGroup.rotation.z = -23.4 * (Math.PI / 180);
    earthTiltGroup.rotation.x = 22.0 * (Math.PI / 180);
    earthRoot.add(earthTiltGroup);

    const earthPivot = new THREE.Group();
    earthTiltGroup.add(earthPivot);

    // 4. Physically Accurate Atmosphere
    const SUN_DIR = new THREE.Vector3(3.5, 5.5, 3.2).normalize();

    const atmosVertex = `
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying vec3 vWorldNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    // Layer 1 — Outer corona
    const outerAtmosMaterial = new THREE.ShaderMaterial({
      uniforms: {
        sunDir: { value: SUN_DIR }
      },
      vertexShader: atmosVertex,
      fragmentShader: `
        uniform vec3 sunDir;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldNormal;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float limb = dot(viewDir, vNormal) + 1.0;
          float intensity = pow(limb, 5.0);

          float sun = max(0.0, dot(vWorldNormal, sunDir));
          float sunBoost = 0.4 + sun * 0.9;

          vec3 color = mix(
            vec3(0.12, 0.38, 0.95),
            vec3(0.50, 0.80, 1.00),
            pow(limb, 2.0)
          );

          float alpha = intensity * sunBoost * 0.88;
          gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false
    });

    const outerAtmosMesh = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS * 1.025, 128, 128),
      outerAtmosMaterial
    );
    earthTiltGroup.add(outerAtmosMesh);

    // Layer 2 — Main limb haze
    const innerAtmosMaterial = new THREE.ShaderMaterial({
      uniforms: {
        sunDir: { value: SUN_DIR }
      },
      vertexShader: atmosVertex,
      fragmentShader: `
        uniform vec3 sunDir;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldNormal;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
          rim = smoothstep(0.55, 1.0, rim);
          float haze = pow(rim, 3.5);

          float sun = max(0.0, dot(vWorldNormal, sunDir));
          float sunBoost = 0.2 + sun * 1.2;

          vec3 color = mix(
            vec3(0.18, 0.50, 0.96),
            vec3(0.70, 0.90, 1.00),
            pow(rim, 2.5)
          );

          float alpha = haze * sunBoost * 0.70;
          gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: false
    });

    const innerAtmosMesh = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS * 1.006, 128, 128),
      innerAtmosMaterial
    );
    earthTiltGroup.add(innerAtmosMesh);

    // Layer 3 — Thin highlight at terminator limb
    const glintAtmosMaterial = new THREE.ShaderMaterial({
      uniforms: {
        sunDir: { value: SUN_DIR }
      },
      vertexShader: atmosVertex,
      fragmentShader: `
        uniform vec3 sunDir;
        varying vec3 vNormal;
        varying vec3 vPosition;
        varying vec3 vWorldNormal;
        void main() {
          vec3 viewDir = normalize(-vPosition);
          float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
          float edge = pow(rim, 9.0);

          float sun = max(0.0, dot(vWorldNormal, sunDir));
          vec3 color = vec3(0.65, 0.88, 1.0);
          float alpha = edge * sun * 0.85;
          gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0));
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: false
    });

    const glintAtmosMesh = new THREE.Mesh(
      new THREE.SphereGeometry(EARTH_RADIUS * 1.002, 128, 128),
      glintAtmosMaterial
    );
    earthTiltGroup.add(glintAtmosMesh);

    // 5. Seamless 3D Model Attachment (Zero Glitch / Zero Swapping)
    const applyAnisotropy = (m) => {
      m.traverse((child) => {
        if (child.isMesh && child.material && child.material.map) {
          child.material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
        }
      });
    };

    if (cachedGLTFScene) {
      // Model is already cached — attach immediately on frame 1 with 0ms delay!
      activeModel = cachedGLTFScene.clone(true);
      applyAnisotropy(activeModel);
      earthPivot.add(activeModel);
    } else {
      // First cold load: attach and smoothly fade in to avoid any popping
      getEarthModel().then((model) => {
        if (!isMounted) return;
        activeModel = model.clone(true);
        applyAnisotropy(activeModel);

        activeModel.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.transparent = true;
            child.material.opacity = 0;
          }
        });
        earthPivot.add(activeModel);

        let opacity = 0;
        const fadeIn = () => {
          if (!isMounted || !activeModel) return;
          opacity += 0.08;
          activeModel.traverse((child) => {
            if (child.isMesh && child.material) {
              child.material.opacity = Math.min(1, opacity);
              if (opacity >= 1) child.material.transparent = false;
            }
          });
          if (opacity < 1) requestAnimationFrame(fadeIn);
        };
        requestAnimationFrame(fadeIn);
      }).catch((err) => {
        console.warn('Could not load Earth 3D model:', err);
      });
    }

    // 6. Responsive Horizon Framing
    const updateFraming = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      if (width < 768) {
        camera.position.set(0, 0.45, 8.8);
        camera.lookAt(0, -0.7, 0);
        earthRoot.position.set(0, -6.6, 0);
      } else if (width < 1200) {
        camera.position.set(0, 0.45, 7.8);
        camera.lookAt(0, -0.65, 0);
        earthRoot.position.set(0, -5.9, 0);
      } else {
        camera.position.set(0, 0.45, 7.2);
        camera.lookAt(0, -0.65, 0);
        earthRoot.position.set(0, -5.6, 0);
      }
    };

    window.addEventListener('resize', updateFraming);
    updateFraming();

    // 7. Scroll Tracking & Visibly Smooth Rotation
    // Synchronize initial scroll values immediately so reload or navigation never has catch-up spinning
    const currentScrollY = window.scrollY || 0;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const initialScroll = Math.min(1, Math.max(0, currentScrollY / maxScroll));
    let targetScroll = initialScroll;
    let smoothScroll = initialScroll;

    // Preserve continuous rotation angle from previous visit
    let baseRotation = lastGlobalRotation;
    const BASE_ROTATION_SPEED = 0.075;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const currentMax = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      targetScroll = Math.min(1, Math.max(0, scrollY / currentMax));
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Mouse parallax & interactive drag handling
    let targetMouseX = 0;
    let targetMouseY = 0;
    let smoothMouseX = 0;
    let smoothMouseY = 0;

    let isDragging = false;
    let lastPointerX = 0;
    let dragVelocity = 0;

    const onPointerDown = (e) => {
      if (e.target && e.target.closest && e.target.closest('a, button, input, textarea, select, [role="button"]')) {
        return;
      }
      isDragging = true;
      lastPointerX = e.clientX;
    };

    const onPointerMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;

      if (isDragging) {
        const deltaX = e.clientX - lastPointerX;
        dragVelocity = deltaX * 0.0035;
        baseRotation += dragVelocity;
        lastPointerX = e.clientX;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerup', onPointerUp, { passive: true });

    // 8. Animation Loop
    let animationFrameId;
    let lastTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const currentTime = performance.now();
      const delta = Math.min((currentTime - lastTime) * 0.001, 0.1);
      lastTime = currentTime;

      const scrollDamp = 0.045;
      smoothScroll += (targetScroll - smoothScroll) * scrollDamp;

      smoothMouseX += (targetMouseX - smoothMouseX) * 0.035;
      smoothMouseY += (targetMouseY - smoothMouseY) * 0.035;

      dragVelocity *= 0.92;
      baseRotation += dragVelocity;

      if (!prefersReducedMotion && !isDragging) {
        baseRotation += BASE_ROTATION_SPEED * delta;
      }
      lastGlobalRotation = baseRotation;

      earthPivot.rotation.y = baseRotation + smoothScroll * (Math.PI * 2.2);

      earthTiltGroup.rotation.y = smoothMouseX * 0.14;
      earthTiltGroup.rotation.x = (22.0 * (Math.PI / 180)) + smoothMouseY * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup
    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateFraming);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && container && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }

      outerAtmosMesh.geometry.dispose();
      outerAtmosMaterial.dispose();
      innerAtmosMesh.geometry.dispose();
      innerAtmosMaterial.dispose();
      glintAtmosMesh.geometry.dispose();
      glintAtmosMaterial.dispose();

      if (activeModel) {
        earthPivot.remove(activeModel);
        // Do NOT dispose activeModel's geometries or textures as they are shared with cachedGLTFScene
      }
    };
  }, []);

  return (
    <>
      {/* 3D canvas container */}
      <div
        ref={containerRef}
        className="earth-background-container"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse at 50% 28%, #03081a 0%, #01040f 50%, #000206 100%)'
        }}
        aria-hidden="true"
      />
      {/* Dark overlay mask — darkens the Earth & space without touching page content */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
          background: 'rgba(0, 0, 0, 0.45)'
        }}
        aria-hidden="true"
      />
    </>
  );
};

export default EarthBackground;
