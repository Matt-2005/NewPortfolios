/* ============================================================
   LIVRE 3D — moteur Three.js
   Bureau dans la pénombre, lampe chaude (ombre de plante projetée),
   tasse, crayon ; un livre relié dont les pages se courbent en tournant.

   Repère : le livre est posé sur le bureau (plan XZ, Y vers le haut).
   Le dos est l'axe Z en x = 0 ; une page à droite occupe x ∈ [0, W].
   Une page « p » va de 0 (à plat à droite) à 1 (à plat à gauche).
   ============================================================ */
import * as THREE from 'three';
import { PW, PH } from './pages';

const W = 1.36, H = W * PH / PW;   // taille d'une page (unités 3D)
const SEG = 48;                     // découpe de la page pour la courbure
const GAP = 0.0065;                 // épaisseur d'un feuillet
const BASE = 0.03;                  // dessus du 4e de couverture
const ease = x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, n) => a + (b - a) * n;

/* ---------- textures procédurales ---------- */
function woodTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 1024;
  const g = c.getContext('2d');
  g.fillStyle = '#1d1511'; g.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 520; i++) {
    const y = Math.random() * 1024, a = 0.04 + Math.random() * 0.1, amp = 2 + Math.random() * 8, f = 0.002 + Math.random() * 0.006;
    g.strokeStyle = Math.random() < 0.5 ? `rgba(70,48,34,${a})` : `rgba(8,5,4,${a * 1.4})`;
    g.lineWidth = 0.6 + Math.random() * 2.2;
    g.beginPath();
    for (let x = 0; x <= 1024; x += 16) g.lineTo(x, y + Math.sin(x * f + i) * amp);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2.4, 2.4);
  return t;
}
/* « cookie » de la lampe : feuillage flou qui projette son ombre sur le bureau */
function leafCookie() {
  const c = document.createElement('canvas'); c.width = c.height = 512;
  const g = c.getContext('2d');
  g.fillStyle = '#fff'; g.fillRect(0, 0, 512, 512);
  g.filter = 'blur(6px)';
  g.fillStyle = 'rgba(0,0,0,0.78)';
  const leaf = (x, y, r, a) => { g.save(); g.translate(x, y); g.rotate(a); g.beginPath(); g.ellipse(0, 0, r, r * 0.34, 0, 0, Math.PI * 2); g.fill(); g.restore(); };
  for (let i = 0; i < 16; i++) leaf(20 + Math.random() * 150, 10 + Math.random() * 200, 34 + Math.random() * 30, Math.random() * Math.PI);
  for (let i = 0; i < 9; i++) leaf(380 + Math.random() * 130, Math.random() * 140, 30 + Math.random() * 26, Math.random() * Math.PI);
  g.filter = 'none';
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function latteTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 256;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(128, 128, 10, 128, 128, 128);
  r.addColorStop(0, '#9a6a45'); r.addColorStop(1, '#4a2c1a');
  g.fillStyle = r; g.fillRect(0, 0, 256, 256);
  g.fillStyle = '#f1e2cc'; g.filter = 'blur(2px)';
  g.beginPath(); g.moveTo(128, 178); g.bezierCurveTo(60, 130, 80, 70, 128, 104); g.bezierCurveTo(176, 70, 196, 130, 128, 178); g.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ---------- une face de page = un canvas + sa texture ---------- */
function makeFaceTex(face, renderer, mirrored) {
  const canvas = document.createElement('canvas'); canvas.width = PW; canvas.height = PH;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  if (mirrored) { tex.wrapS = THREE.RepeatWrapping; tex.repeat.x = -1; tex.offset.x = 1; }
  return { face, canvas, ctx: canvas.getContext('2d'), tex };
}

export function createBook(host, { faces, reduce = false, onState, onHover, onAction }) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const el = renderer.domElement;
  el.style.width = '100%'; el.style.height = '100%'; el.style.display = 'block';
  host.appendChild(el);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#060709');
  scene.fog = new THREE.Fog('#060709', 6, 13);
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 40);

  /* — lumières — */
  scene.add(new THREE.HemisphereLight('#a7a39a', '#1a130e', 0.42)); // ambiance neutre : ombres sans dominante bleue
  const lamp = new THREE.SpotLight('#ffe6c4', 68, 0, 0.62, 0.85, 2);
  lamp.position.set(-1.1, 4.6, 1.2);
  lamp.target.position.set(0.1, 0, -0.1);
  lamp.map = leafCookie();
  lamp.castShadow = true;
  lamp.shadow.mapSize.set(2048, 2048);
  lamp.shadow.bias = -0.0002; lamp.shadow.normalBias = 0.02;
  lamp.shadow.camera.near = 1; lamp.shadow.camera.far = 9;
  scene.add(lamp, lamp.target);
  const rim = new THREE.DirectionalLight('#8f9cff', 0.18);
  rim.position.set(3, 2, -3); scene.add(rim);

  /* — bureau et objets — */
  const desk = new THREE.Mesh(new THREE.PlaneGeometry(16, 11), new THREE.MeshStandardMaterial({ map: woodTexture(), roughness: 0.78, metalness: 0 }));
  desk.rotation.x = -Math.PI / 2; desk.receiveShadow = true; scene.add(desk);

  const ceramic = new THREE.MeshStandardMaterial({ color: '#efece6', roughness: 0.35 });
  const cup = new THREE.Group();
  const prof = [[0, 0], [0.12, 0], [0.14, 0.02], [0.17, 0.2], [0.175, 0.215], [0.16, 0.215], [0.155, 0.2]].map(([x, y]) => new THREE.Vector2(x, y));
  const shell = new THREE.Mesh(new THREE.LatheGeometry(prof, 48), ceramic); shell.castShadow = true;
  const coffee = new THREE.Mesh(new THREE.CircleGeometry(0.158, 40), new THREE.MeshStandardMaterial({ map: latteTexture(), roughness: 0.4 }));
  coffee.rotation.x = -Math.PI / 2; coffee.position.y = 0.19;
  const handle = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.016, 12, 24, Math.PI * 1.2), ceramic);
  handle.position.set(0.19, 0.11, 0); handle.rotation.z = -Math.PI * 0.6; handle.castShadow = true;
  const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.26, 0.025, 48), ceramic);
  saucer.position.y = 0.012; saucer.castShadow = saucer.receiveShadow = true;
  shell.position.y = coffee.position.y - 0.19 + 0.025; coffee.position.y += 0.025; handle.position.y += 0.025;
  cup.add(saucer, shell, coffee, handle);
  cup.position.set(2.05, 0, -0.55); cup.rotation.y = 0.6;
  scene.add(cup);

  const pen = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.9, 16), new THREE.MeshStandardMaterial({ color: '#16171b', roughness: 0.3, metalness: 0.6 }));
  body.rotation.z = Math.PI / 2; body.castShadow = true;
  const tip = new THREE.Mesh(new THREE.ConeGeometry(0.018, 0.08, 16), new THREE.MeshStandardMaterial({ color: '#b9b4a8', metalness: 0.9, roughness: 0.25 }));
  tip.rotation.z = -Math.PI / 2; tip.position.x = 0.49;
  pen.add(body, tip); pen.position.set(-1.95, 0.018, 0.55); pen.rotation.y = 0.7;
  scene.add(pen);

  const tin = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.06, 40), new THREE.MeshStandardMaterial({ color: '#5a6170', metalness: 0.85, roughness: 0.35 }));
  tin.position.set(-1.9, 0.03, -0.75); tin.castShadow = true; scene.add(tin);

  /* — le livre — */
  const book = new THREE.Group(); scene.add(book);
  const coverMat = new THREE.MeshStandardMaterial({ color: '#121419', roughness: 0.6 });
  const board = new THREE.Mesh(new THREE.BoxGeometry(W + 0.03, BASE, H + 0.04), coverMat);
  board.position.set(W / 2, BASE / 2, 0); board.castShadow = board.receiveShadow = true; book.add(board);
  const paperEdge = new THREE.MeshStandardMaterial({ color: '#e7e1d3', roughness: 0.95 });
  const blockR = new THREE.Mesh(new THREE.BoxGeometry(W - 0.01, 1, H - 0.01), paperEdge);
  const blockL = new THREE.Mesh(new THREE.BoxGeometry(W - 0.01, 1, H - 0.01), paperEdge);
  blockR.castShadow = blockL.castShadow = blockR.receiveShadow = blockL.receiveShadow = true;
  book.add(blockR, blockL);

  const L = Math.floor(faces.length / 2);   // nombre de feuillets (la couverture compte)
  const backTex = makeFaceTex(faces[faces.length - 1], renderer, false);
  const backPage = new THREE.Mesh(new THREE.PlaneGeometry(W - 0.01, H - 0.01), new THREE.MeshStandardMaterial({ map: backTex.tex, roughness: 0.9 }));
  backPage.rotation.x = -Math.PI / 2; backPage.position.set(W / 2, BASE + 0.0005, 0); backPage.receiveShadow = true;
  backPage.userData = { face: faces.length - 1, mirrored: false };
  book.add(backPage);

  const faceTex = [];        // index de face → { canvas, ctx, tex, face }
  faceTex[faces.length - 1] = backTex;
  const leaves = [];
  for (let i = 0; i < L; i++) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array((SEG + 1) * 2 * 3), uv = new Float32Array((SEG + 1) * 2 * 2), idx = [];
    for (let s = 0; s <= SEG; s++) {
      uv.set([s / SEG, 1, s / SEG, 0], s * 4); // rangée haut (loin) / bas (près)
      if (s < SEG) { const a = s * 2, b = a + 1, c = a + 2, d = a + 3; idx.push(a, b, c, b, d, c); }
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    geo.setIndex(idx);
    const front = makeFaceTex(faces[2 * i], renderer, false);
    const back = makeFaceTex(faces[2 * i + 1], renderer, true);
    faceTex[2 * i] = front; faceTex[2 * i + 1] = back;
    const isCover = i === 0;
    const mf = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: front.tex, roughness: isCover ? 0.55 : 0.92, side: THREE.FrontSide }));
    const mb = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: back.tex, roughness: 0.92, side: THREE.BackSide }));
    mf.castShadow = mb.castShadow = true; mf.receiveShadow = mb.receiveShadow = true;
    mf.userData = { face: 2 * i, mirrored: false, leaf: i };
    mb.userData = { face: 2 * i + 1, mirrored: true, leaf: i };
    book.add(mf, mb);
    leaves.push({ i, geo, p: 0, from: 0, to: 0, t0: 0, dur: 0, dirty: true, stiff: isCover ? 0.06 : 0.75 });
  }
  const pickables = [...leaves.flatMap((_, i) => book.children.filter(m => m.userData && m.userData.leaf === i)), backPage];

  /* hauteur de repos d'un feuillet, à droite (pile) ou à gauche */
  const restR = i => BASE + GAP * (L - i);
  const restL = i => BASE + GAP * (i + 1);

  /* courbure : la page tourne autour du dos, le bord libre mène */
  function bend(leaf) {
    const { p, i, stiff } = leaf;
    const pos = leaf.geo.attributes.position.array;
    const a = Math.PI * p, curl = stiff * Math.sin(Math.PI * p);
    let x = 0, y = lerp(restR(i), restL(i), p) + Math.sin(Math.PI * p) * 0.03;
    const dx = W / SEG;
    for (let s = 0; s <= SEG; s++) {
      if (s > 0) {
        const ang = a + curl * Math.pow(s / SEG, 1.6);
        x += Math.cos(ang) * dx; y += Math.sin(ang) * dx;
      }
      const yy = Math.max(y, Math.min(restR(i), restL(i)) - 0.001);
      pos.set([x, yy, -H / 2, x, yy, H / 2], s * 6);
    }
    leaf.geo.attributes.position.needsUpdate = true;
    leaf.geo.computeVertexNormals();
    leaf.geo.computeBoundingSphere();
  }
  leaves.forEach(bend);

  /* — état — */
  let spread = 0;            // nombre de feuillets tournés
  let openP = 0, openTo = 0; // ouverture (caméra + glissement du livre)
  const queue = [];          // feuillets à tourner (aller à une page du sommaire)
  let mouse = { x: 0, y: 0 }, cam = { x: 0, y: 0 };
  let intro = reduce ? 1 : 0;
  const DUR = reduce ? 0.001 : 1.05;

  function flip(i, to, delay = 0) {
    const leaf = leaves[i];
    leaf.from = leaf.p; leaf.to = to; leaf.t0 = performance.now() / 1000 + delay;
    leaf.dur = DUR * Math.max(0.35, Math.abs(to - leaf.p));
  }
  function emit() {
    if (onState) onState({ spread, total: L, open: spread > 0 });
  }
  function setSpread(n) {
    n = clamp(n, 0, L);
    if (n === spread) return;
    const dir = n > spread ? 1 : -1;
    let k = 0;
    for (let s = spread; s !== n; s += dir) {
      const i = dir > 0 ? s : s - 1;
      flip(i, dir > 0 ? 1 : 0, (k++) * 0.16);
    }
    spread = n;
    openTo = n > 0 ? 1 : 0;
    emit();
  }

  /* — peinture des faces — */
  const facesState = { list: faces };
  function paintFace(fi, time) {
    const ft = faceTex[fi]; if (!ft) return;
    ft.face.paint(ft.ctx, time);
    ft.tex.needsUpdate = true;
  }
  function paintAll() { for (let fi = 0; fi < facesState.list.length; fi++) paintFace(fi, 6.5); }
  // images (logos) des faces : on repeint quand elles arrivent
  function loadImages() {
    facesState.list.forEach((f, fi) => {
      if (f.logoSrc && !f.logoImg) {
        const img = new Image(); img.onload = () => { f.logoImg = img; paintFace(fi, 6.5); }; img.src = f.logoSrc;
      }
      (f.extraImages || []).forEach(e => {
        if (e.src && !e.img) { const img = new Image(); img.onload = () => { e.img = img; paintFace(fi, 6.5); }; img.src = e.src; }
      });
    });
  }
  paintAll(); loadImages();

  function setFaces(next) {
    facesState.list = next;
    next.forEach((f, fi) => { if (faceTex[fi]) faceTex[fi].face = f; });
    paintAll(); loadImages();
  }

  /* faces visibles (pour n'animer que celles-là) */
  function visibleFaces() {
    const v = new Set();
    if (spread === 0) v.add(0);
    else { v.add(2 * spread - 1); v.add(spread < L ? 2 * spread : facesState.list.length - 1); }
    leaves.forEach(l => { if (l.p > 0.001 && l.p < 0.999) { v.add(2 * l.i); v.add(2 * l.i + 1); } });
    return v;
  }

  /* — taille, caméra — */
  let vw = 1, vh = 1;
  function resize() {
    vw = host.clientWidth || 1; vh = host.clientHeight || 1;
    renderer.setSize(vw, vh, false);
    camera.aspect = vw / vh; camera.updateProjectionMatrix();
  }
  resize();
  const ro = new ResizeObserver(resize); ro.observe(host);

  /* distance pour cadrer une largeur donnée, quel que soit le ratio d'écran */
  function fitDistance(width) {
    const hf = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect);
    return (width / 2) / Math.tan(hf / 2);
  }
  const look = new THREE.Vector3();
  function placeCamera() {
    const o = ease(openP);
    const dClosed = Math.max(fitDistance(W * 3.1), 4.2), dOpen = Math.max(fitDistance(W * 2 * 1.16), 2.6);
    const d = lerp(dClosed, dOpen, o) * lerp(1.18, 1, ease(intro));
    const elev = lerp(1.05, 1.12, o); // angle depuis l'horizontale (rad)
    // parallaxe à la souris : simple glissement (pas de rotation, le livre ne penche pas)
    const px = cam.x * 0.09, pz = cam.y * 0.06;
    camera.position.set(px, Math.sin(elev) * d, Math.cos(elev) * d + pz);
    look.set(px, 0, lerp(-0.42, 0.04, o) + pz);
    camera.lookAt(look);
    book.position.x = lerp(-W / 2, 0, o);
  }

  /* — interactions (clic, survol, glisser) — */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  function hit(e) {
    const r = el.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    const h = ray.intersectObjects(pickables, false)[0];
    if (!h) return null;
    const { face, mirrored } = h.object.userData;
    const u = mirrored ? 1 - h.uv.x : h.uv.x;
    const px = u * PW, py = (1 - h.uv.y) * PH;
    const f = facesState.list[face];
    const spot = f && f.hotspots.find(s => px >= s.x && px <= s.x + s.w && py >= s.y && py <= s.y + s.h);
    // côté de la double page : gauche si la face visible est à gauche du dos
    const side = h.point.x - book.position.x < 0 ? 'left' : 'right';
    return { face, spot, side };
  }

  let drag = null, hoverKind = null, lastPointer = null;
  function setHover(kind) { if (kind !== hoverKind) { hoverKind = kind; if (onHover) onHover(kind); } }

  function onMove(e) {
    lastPointer = { clientX: e.clientX, clientY: e.clientY };
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (e.clientY / window.innerHeight) * 2 - 1;
    if (drag) {
      const dx = e.clientX - drag.x;
      if (!drag.active && drag.leaf >= 0 && Math.abs(dx) > 6) drag.active = true;
      if (drag.active) {
        const pagePx = Math.max(200, vw * 0.4);
        const leaf = leaves[drag.leaf];
        leaf.to = leaf.p = drag.side === 'right' ? clamp(-dx / (pagePx * 1.1), 0, 1) : clamp(1 - dx / (pagePx * 1.1), 0, 1);
        leaf.t0 = 0; leaf.dur = 0; leaf.dirty = true;
      }
      return;
    }
    const h = hit(e);
    if (!h) setHover(null);
    else if (spread === 0) setHover('open');
    else if (h.spot) setHover('link');
    else setHover(h.side === 'right' ? (spread < L ? 'next' : null) : 'prev');
  }

  function onDown(e) {
    if (e.button !== 0) return;
    const h = hit(e); if (!h) return;
    if (spread === 0 || h.spot) { drag = { x: e.clientX, click: h, active: false, leaf: -1 }; return; }
    const leaf = h.side === 'right' ? spread : spread - 1;
    if (leaf < 0 || leaf >= L) { drag = { x: e.clientX, click: h, active: false, leaf: -1 }; return; }
    drag = { x: e.clientX, click: h, active: false, leaf, side: h.side };
    el.setPointerCapture && el.setPointerCapture(e.pointerId);
  }

  function onUp() {
    if (!drag) return;
    const d = drag; drag = null;
    if (d.active && d.leaf >= 0) {
      const leaf = leaves[d.leaf];
      const done = d.side === 'right' ? leaf.p > 0.32 : leaf.p < 0.68;
      if (done) { setSpread(d.side === 'right' ? spread + 1 : spread - 1); }
      else flip(d.leaf, d.side === 'right' ? 0 : 1);
      return;
    }
    const h = d.click;
    if (spread === 0) { setSpread(1); return; }
    if (h.spot) { act(h.spot.action); return; }
    if (h.side === 'right') setSpread(spread + 1); else setSpread(spread - 1);
  }

  function act(a) {
    if (a.type === 'goto') setSpread(a.spread);
    else if (a.type === 'close') setSpread(0);
    else if (onAction) onAction(a);
  }

  el.addEventListener('pointermove', onMove);
  el.addEventListener('pointerdown', onDown);
  window.addEventListener('pointerup', onUp);
  el.addEventListener('pointerleave', () => { lastPointer = null; if (!drag) setHover(null); });

  /* — boucle — */
  let raf = 0, running = false, lastPaint = 0;
  const clock = performance.now();
  let tick = 0;
  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (lastPointer && !drag && (tick++ % 8 === 0)) onMove(lastPointer);
    const t = now / 1000, time = (now - clock) / 1000;
    intro = Math.min(1, intro + 0.012);
    openP += (openTo - openP) * (reduce ? 1 : 0.045);
    cam.x += ((reduce ? 0 : mouse.x) - cam.x) * 0.04; cam.y += ((reduce ? 0 : mouse.y) - cam.y) * 0.04;
    for (const leaf of leaves) {
      if (leaf.dur > 0) {
        const k = clamp((t - leaf.t0) / leaf.dur, 0, 1);
        if (t >= leaf.t0) leaf.p = lerp(leaf.from, leaf.to, ease(k));
        if (k >= 1) { leaf.p = leaf.to; leaf.dur = 0; }
        leaf.dirty = true;
      }
      if (leaf.dirty) { bend(leaf); if (!drag || drag.leaf !== leaf.i) leaf.dirty = leaf.dur > 0; }
    }
    // épaisseur des piles de papier
    const flipped = leaves.filter(l => l.p > 0.5).length;
    const hr = GAP * Math.max(0.2, L - flipped - 1), hl = GAP * Math.max(0.2, flipped - 1);
    blockR.scale.y = hr; blockR.position.set(W / 2, BASE + hr / 2, 0); blockR.visible = L - flipped > 1;
    blockL.scale.y = hl; blockL.position.set(-W / 2, BASE + hl / 2, 0); blockL.visible = flipped > 1;
    // pages animées visibles : ~30 images/s
    if (!reduce && now - lastPaint > 33) {
      lastPaint = now;
      visibleFaces().forEach(fi => { const f = facesState.list[fi]; if (f && f.animated) paintFace(fi, time); });
    }
    placeCamera();
    renderer.render(scene, camera);
  }
  function start() { if (!running) { running = true; raf = requestAnimationFrame(frame); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  emit();
  return {
    start, stop, setFaces,
    next: () => setSpread(spread + 1),
    prev: () => setSpread(spread - 1),
    close: () => setSpread(0),
    open: () => setSpread(Math.max(1, spread)),
    dispose() {
      stop(); ro.disconnect();
      el.removeEventListener('pointermove', onMove); el.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      scene.traverse(o => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) { (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { if (m.map) m.map.dispose(); m.dispose(); }); }
      });
      if (lamp.map) lamp.map.dispose();
      renderer.dispose();
      if (el.parentNode) el.parentNode.removeChild(el);
    },
  };
}
