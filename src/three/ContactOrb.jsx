/* ============================================================
   CONTACT ORB — orbe d'énergie bleu roi (Three.js).
   Une sphère déformée par du bruit simplex, rim-light fresnel,
   en rotation lente, qui respire et suit doucement le curseur.
   « Toujours en mouvement », même à l'arrêt.
   ============================================================ */
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { lerp, getVel, reduce, coarse, clamp } from '../lib/motion';

const NOISE = /* glsl */ `
// Simplex 3D (Ashima / Ian McEwan, domaine public)
vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

const VERT = NOISE + /* glsl */ `
uniform float uTime;
uniform float uAmp;
varying float vNoise;
varying vec3 vNormal;
varying vec3 vView;

void main() {
  float n = snoise(normal * 1.7 + vec3(uTime * 0.22, uTime * 0.16, 0.0));
  float n2 = snoise(normal * 4.2 - vec3(0.0, uTime * 0.3, uTime * 0.18)) * 0.35;
  vNoise = n + n2;
  vec3 p = position * (1.0 + vNoise * uAmp);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

const FRAG = /* glsl */ `
uniform float uTime;
varying float vNoise;
varying vec3 vNormal;
varying vec3 vView;

void main() {
  float fres = pow(1.0 - abs(dot(vNormal, vView)), 2.2);
  vec3 blue = vec3(0.34, 0.49, 0.95);  // accent bleu roi
  vec3 deep = vec3(0.07, 0.13, 0.42);
  vec3 col = mix(deep, blue, fres + vNoise * 0.18);
  // fines bandes d'énergie qui circulent
  float bands = smoothstep(0.42, 0.5, abs(sin(vNoise * 7.0 + uTime * 0.7))) * 0.10;
  float a = fres * 0.46 + bands + max(vNoise, 0.0) * 0.04;
  gl_FragColor = vec4(col, a);
}
`;

export default function ContactOrb() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduce) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch (e) {
      return; // pas de WebGL : le fond sombre reste sobre, rien à casser
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 10);
    camera.position.z = 3.1;

    const geo = new THREE.IcosahedronGeometry(1, 24);
    const mat = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: Math.random() * 40 },
        uAmp: { value: 0.13 },
      },
    });
    const orb = new THREE.Mesh(geo, mat);
    scene.add(orb);

    function resize() {
      const w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    resize();
    window.addEventListener('resize', resize);

    let nx = 0, ny = 0, nxS = 0, nyS = 0;
    const onMove = e => {
      nx = (e.clientX / window.innerWidth) * 2 - 1;
      ny = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    if (!coarse) window.addEventListener('mousemove', onMove, { passive: true });

    let run = true;
    const io = new IntersectionObserver(en => { run = en[0].isIntersecting; }, { rootMargin: '160px' });
    io.observe(canvas);

    let alive = true, last = performance.now();
    (function frame(now) {
      if (!alive) return;
      requestAnimationFrame(frame);
      if (!run) { last = now; return; }
      const dt = Math.min((now - last) / 1000, 0.05); last = now;

      mat.uniforms.uTime.value += dt;
      // la vélocité du scroll « excite » l'orbe
      const k = clamp(Math.abs(getVel()) * 0.004, 0, 0.12);
      mat.uniforms.uAmp.value = lerp(mat.uniforms.uAmp.value, 0.13 + k, 0.06);

      nxS = lerp(nxS, nx, 0.04);
      nyS = lerp(nyS, ny, 0.04);
      orb.rotation.y += dt * 0.16;
      orb.rotation.x = nyS * 0.35;
      orb.rotation.z = nxS * 0.2;
      const b = 1 + Math.sin(mat.uniforms.uTime.value * 0.6) * 0.035; // respiration
      orb.scale.setScalar(b);

      renderer.render(scene, camera);
    })(last);

    return () => {
      alive = false;
      io.disconnect();
      window.removeEventListener('resize', resize);
      if (!coarse) window.removeEventListener('mousemove', onMove);
      geo.dispose(); mat.dispose(); renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="contact-orb" aria-hidden="true" />;
}
