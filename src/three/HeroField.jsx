/* ============================================================
   HERO FIELD — champ de particules « vent » en WebGL (Three.js).
   Des milliers de grains d'air traversent l'écran en profondeur,
   accélèrent avec la vélocité du scroll, fuient le curseur, et
   la caméra suit la souris en parallaxe. Accents verts FPV.
   Repli automatique : champ de vecteurs 2D si WebGL échoue.
   ============================================================ */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { clamp, lerp, getVel, reduce, coarse } from '../lib/motion';
import { createFlowField } from '../lib/flow2d';

const VERT = /* glsl */ `
attribute vec4 aSeed;   // xyz : position d'origine · w : graine de vitesse
attribute float aType;  // 0 : encre · 1 : traceur bleu roi (accent)
uniform float uTime;
uniform float uVel;
uniform float uPx;
uniform vec2 uMouse;
varying float vAlpha;
varying float vType;

void main() {
  vec3 p;
  float sp = 0.10 + aSeed.w * 0.16;
  float boost = 1.0 + min(abs(uVel) * 0.045, 2.6);
  p.x = mod(aSeed.x + uTime * sp * boost, 4.4) - 2.2;     // le vent souffle vers la droite
  p.y = aSeed.y
      + sin(uTime * (0.35 + aSeed.w * 0.5) + aSeed.x * 7.0) * 0.085
      + cos(uTime * 0.22 + aSeed.z * 5.0) * 0.06
      - clamp(uVel, -60.0, 60.0) * 0.0035;                 // le scroll souffle verticalement
  p.z = aSeed.z;

  // répulsion autour du curseur (plan écran)
  vec2 d = p.xy - uMouse;
  float dist = length(d);
  p.xy += (d / max(dist, 0.0001)) * smoothstep(0.55, 0.0, dist) * 0.26;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float size = (1.5 + aSeed.w * 2.8) * (aType > 0.5 ? 1.7 : 1.0);
  gl_PointSize = size * uPx * (1.7 / -mv.z);

  // plein alpha sur tout l'écran (bord ~1.86 / ~1.19), fondu seulement au-delà
  vAlpha = (0.30 + aSeed.w * 0.45)
         * smoothstep(2.2, 1.86, abs(p.x))
         * smoothstep(1.4, 1.19, abs(p.y));
  vType = aType;
  gl_Position = projectionMatrix * mv;
}
`;

const FRAG = /* glsl */ `
uniform float uTheme;   // 0 : thème clair · 1 : thème sombre
varying float vAlpha;
varying float vType;

void main() {
  float m = smoothstep(0.5, 0.1, length(gl_PointCoord - 0.5));
  vec3 ink = mix(vec3(0.12, 0.13, 0.18), vec3(0.93, 0.93, 0.96), uTheme);
  vec3 grn = mix(vec3(0.16, 0.30, 0.78), vec3(0.42, 0.58, 0.98), uTheme); // accent bleu roi
  vec3 col = mix(ink, grn, vType);
  float a = vAlpha * m * mix(0.55, 0.9, vType);
  if (a < 0.003) discard;
  gl_FragColor = vec4(col, a);
}
`;

export default function HeroField({ heroRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero || reduce) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
    } catch (e) {
      return createFlowField(canvas, hero); // repli 2D si WebGL indisponible
    }

    const root = document.documentElement;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 10);
    camera.position.z = 2.2;
    const group = new THREE.Group();
    scene.add(group);

    // champ : x ∈ [-2.2, 2.2] (bouclé en mod 4.4), y ∈ [-1.4, 1.4], z ∈ [-0.9, 0.5]
    const N = coarse ? 2000 : 4200;
    const seeds = new Float32Array(N * 4);
    const types = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      seeds[i * 4] = (Math.random() * 2 - 1) * 2.2;
      seeds[i * 4 + 1] = (Math.random() * 2 - 1) * 1.4;
      seeds[i * 4 + 2] = -Math.random() * 1.4 + 0.5;
      seeds[i * 4 + 3] = Math.random();
      types[i] = i % 11 === 0 ? 1 : 0;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(N * 3), 3)); // requis, recalculé en shader
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 4));
    geo.setAttribute('aType', new THREE.BufferAttribute(types, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 5);

    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: Math.random() * 60 },
        uVel: { value: 0 },
        uTheme: { value: root.getAttribute('data-theme') === 'dark' ? 1 : 0 },
        uMouse: { value: new THREE.Vector2(99, 99) },
        uPx: { value: 1 },
      },
    });
    group.add(new THREE.Points(geo, mat));

    // — dimensions / DPR — le champ est mis à l'échelle pour couvrir
    //   TOUT l'écran (au plan le plus éloigné des particules) + une marge.
    const COVER = 1.18;
    let fieldEdgeX = 1, fieldEdgeY = 1;
    function resize() {
      const w = canvas.clientWidth || hero.clientWidth;
      const h = canvas.clientHeight || hero.clientHeight;
      if (!w || !h) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(dpr);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const farDist = camera.position.z + 0.9;                  // plan le plus éloigné
      const visH = Math.tan((camera.fov * Math.PI) / 360) * farDist;
      const visW = visH * camera.aspect;
      group.scale.x = (visW * COVER) / 2.2;                     // remplit la largeur
      group.scale.y = (visH * COVER) / 1.4;                     // ... et la hauteur
      fieldEdgeX = 2.2 / COVER;                                 // bord d'écran en unités de champ
      fieldEdgeY = 1.4 / COVER;
      mat.uniforms.uPx.value = dpr;
    }
    resize();
    window.addEventListener('resize', resize);
    // suit toute variation de taille du canvas (layout, polices, 100svh…)
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(resize) : null;
    if (ro) ro.observe(canvas);

    // — souris (parallaxe caméra + répulsion) —
    let nx = 0, ny = 0, nxS = 0, nyS = 0, hasMouse = false;
    const onMove = e => {
      const r = hero.getBoundingClientRect();
      nx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ny = -(((e.clientY - r.top) / r.height) * 2 - 1);
      hasMouse = true;
    };
    const onLeave = () => { hasMouse = false; };
    if (!coarse) {
      hero.addEventListener('mousemove', onMove);
      hero.addEventListener('mouseleave', onLeave);
    }

    let run = true;
    const io = new IntersectionObserver(en => { run = en[0].isIntersecting; }, { rootMargin: '120px' });
    io.observe(hero);

    let alive = true, last = performance.now();
    (function frame(now) {
      if (!alive) return;
      requestAnimationFrame(frame);
      if (!run) { last = now; return; }
      const dt = Math.min((now - last) / 1000, 0.05); last = now;

      mat.uniforms.uTime.value += dt;
      mat.uniforms.uVel.value = lerp(mat.uniforms.uVel.value, getVel(), 0.1);
      const darkT = root.getAttribute('data-theme') === 'dark' ? 1 : 0;
      mat.uniforms.uTheme.value = lerp(mat.uniforms.uTheme.value, darkT, 0.05);

      nxS = lerp(nxS, hasMouse ? nx : 0, 0.06);
      nyS = lerp(nyS, hasMouse ? ny : 0, 0.06);
      mat.uniforms.uMouse.value.set(
        hasMouse ? nxS * fieldEdgeX : 99,
        hasMouse ? nyS * fieldEdgeY : 99
      );
      group.rotation.y = nxS * 0.10;
      group.rotation.x = -nyS * 0.06;
      camera.fov = 55 + clamp(Math.abs(getVel()) * 0.04, 0, 5); // léger punch de focale à grande vitesse
      camera.updateProjectionMatrix();

      renderer.render(scene, camera);
    })(last);

    return () => {
      alive = false;
      io.disconnect();
      if (ro) ro.disconnect();
      window.removeEventListener('resize', resize);
      if (!coarse) { hero.removeEventListener('mousemove', onMove); hero.removeEventListener('mouseleave', onLeave); }
      geo.dispose(); mat.dispose(); renderer.dispose();
    };
  }, [heroRef]);

  return <canvas ref={canvasRef} className="hero-fx" aria-hidden="true" />;
}
