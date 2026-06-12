import { useEffect, useRef, useState } from 'react';
import { bell, clamp, easeOutCubic, getVel, lerp, onFrame, reduce, smooth } from '../../lib/motion';
import { createFlight } from '../../lib/flight';

const VIDEO_SRC = '/media/immersive.mp4';
const FPS = 30, VIRT_DUR = 16;

/* ============================================================
   VIDÉO IMMERSIVE — la scène est épinglée (sticky), le scroll
   joue la dramaturgie :
   0.00–0.05  l'indication s'efface
   0.05–0.285 APPROCHE   — l'écran incliné (3D) se redresse
   0.07–0.30  VERROUILLAGE — crochets, réticule, compte à rebours
   0.30–0.355 PERCÉE     — plein écran : flash, signal brouillé,
                           barres cinéma, surrégime
   0.355–0.82 CROISIÈRE  — séquence image par image, HUD actif
   0.86–1.00  SORTIE     — éclair bref, le cadre se referme
   ============================================================ */
export default function Immersive() {
  const [hasVideo, setHasVideo] = useState(false);
  const secRef = useRef(null);
  const trackRef = useRef(null);
  const frameRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const statRef = useRef(null);
  const barTRef = useRef(null);
  const barBRef = useRef(null);
  const bracketsRef = useRef(null);
  const countDRef = useRef(null);
  const countSRef = useRef(null);
  const flashRef = useRef(null);
  const reticleRef = useRef(null);
  const hudRefs = useRef([]);
  const captionRef = useRef(null);
  const hintRef = useRef(null);
  const noteRef = useRef(null);
  const railRef = useRef(null);
  const railFillRef = useRef(null);
  const tcRef = useRef(null);
  const frameLblRef = useRef(null);
  const altRef = useRef(null);
  const spdRef = useRef(null);

  /* — vidéo réelle si le fichier existe (sinon : vol procédural) — */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let on = true;
    fetch(VIDEO_SRC, { method: 'HEAD' })
      .then(r => { if (on && r.ok) video.src = VIDEO_SRC; })
      .catch(() => {});
    const onMeta = () => {
      if (video.duration && isFinite(video.duration)) {
        if (on) setHasVideo(true);
        try { video.pause(); video.currentTime = 0; } catch (e) {}
      }
    };
    const onCanPlay = () => {
      const pr = video.play();
      if (pr && pr.then) pr.then(() => video.pause()).catch(() => {});
    };
    const onErr = () => { if (on) setHasVideo(false); };
    video.addEventListener('loadedmetadata', onMeta);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('error', onErr);
    return () => {
      on = false;
      video.removeEventListener('loadedmetadata', onMeta);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('error', onErr);
    };
  }, []);

  /* — moteur scrollé — */
  useEffect(() => {
    const track = trackRef.current, frame = frameRef.current;
    const video = videoRef.current, canvas = canvasRef.current;
    const flight = canvas ? createFlight(canvas) : null;
    const onResize = () => { if (flight) flight.resize(); };
    window.addEventListener('resize', onResize);

    if (reduce || !track || !frame) {
      return () => window.removeEventListener('resize', onResize); // le CSS statique prend le relais
    }

    const ready = () => hasVideo && video && video.duration && isFinite(video.duration);
    const p2s = n => String(n).padStart(2, '0');
    const p3s = n => String(Math.max(0, Math.round(n))).padStart(3, '0');
    const fmt = t => p2s(Math.floor(t / 60)) + ':' + p2s(Math.floor(t % 60)) + ':' + p2s(Math.floor((t % 1) * FPS));

    let sp = 0, lastDrawn = -1, jitOn = false, idleT = 0, curT = 0;

    function apply(p) {
      const velS = getVel();
      const stat = statRef.current, barT = barTRef.current, barB = barBRef.current;
      const brackets = bracketsRef.current, countD = countDRef.current, countS = countSRef.current;
      const flash = flashRef.current, reticle = reticleRef.current;
      const caption = captionRef.current, hint = hintRef.current, note = noteRef.current;
      const rail = railRef.current, railFill = railFillRef.current;
      const hud = hudRefs.current.filter(Boolean);

      const eA = easeOutCubic(smooth(p, 0.05, 0.285)); // approche
      const eB = easeOutCubic(smooth(p, 0.30, 0.355)); // percée
      const open = eA * 0.72 + eB * 0.28;
      const x = easeOutCubic(smooth(p, 0.86, 1));      // sortie
      const s = smooth(p, 0.355, 0.82);                // position dans la séquence
      const punch = bell(p, 0.36, 0.02);               // surrégime à la percée
      const vh = window.innerHeight;

      // — cadre : écran incliné → plein cadre (overshoot) → sortie —
      const insX = (1 - open) * 24 + x * 18;
      const insY = (1 - open) * 16 + x * 12;
      const rad = (1 - open) * 26 + x * 22;
      const scale = (0.56 + 0.44 * open) * (1 - x * 0.30) * (1 + 0.04 * punch);
      const rotX = (1 - eA) * 9 - x * 5;
      const ty = (1 - eA) * vh * 0.035 - x * vh * 0.06;
      frame.style.clipPath = 'inset(' + insY.toFixed(2) + '% ' + insX.toFixed(2) + '% round ' + rad.toFixed(1) + 'px)';
      frame.style.transform = 'translateY(' + ty.toFixed(1) + 'px) rotateX(' + rotX.toFixed(2) + 'deg) scale(' + scale.toFixed(4) + ')';
      frame.style.filter = 'brightness(' + (0.78 + 0.22 * open - x * 0.25).toFixed(3) + ')';

      // — dolly interne du média —
      const ms = 1.16 - 0.16 * open + s * 0.05 + 0.1 * punch;
      const media = ready() ? video : canvas;
      if (media) media.style.transform = 'scale(' + ms.toFixed(4) + ')';

      // — crochets de visée —
      if (brackets) {
        const bo = smooth(p, 0.07, 0.13) * (1 - smooth(p, 0.315, 0.355));
        const padc = 2.4 - 1.7 * smooth(p, 0.1, 0.27);
        const blast = 7 * smooth(p, 0.315, 0.36);
        const bx = 50 - (50 - insX) * scale - padc - blast;
        const by = 50 - (50 - insY) * scale - padc * 0.8 - blast;
        brackets.style.inset = by.toFixed(2) + '% ' + bx.toFixed(2) + '%';
        brackets.style.transform = 'translateY(' + ty.toFixed(1) + 'px)';
        brackets.style.opacity = bo.toFixed(3);
      }

      // — compte à rebours 3 · 2 · 1 —
      if (countD) {
        const c0 = 0.185, c1 = 0.30;
        if (p > c0 - 0.01 && p < c1 + 0.01) {
          const u = clamp((p - c0) / (c1 - c0), 0, 0.999);
          const n = 3 - Math.floor(u * 3);
          const f = (u * 3) % 1;
          const a = Math.sin(Math.min(f / 0.22, 1) * Math.PI * 0.5) * (1 - smooth(f, 0.74, 1));
          if (countD.textContent !== String(n)) countD.textContent = String(n);
          countD.style.opacity = a.toFixed(3);
          countD.style.transform = 'scale(' + (1.18 - 0.18 * f).toFixed(3) + ')';
          if (countS) countS.style.opacity = (smooth(p, c0, c0 + 0.02) * (1 - smooth(p, c1 - 0.012, c1))).toFixed(3);
        } else {
          countD.style.opacity = '0';
          if (countS) countS.style.opacity = '0';
        }
      }

      // — flash de percée (et écho à la sortie) —
      if (flash) flash.style.opacity = (0.9 * bell(p, 0.338, 0.014) + 0.35 * bell(p, 0.875, 0.014)).toFixed(3);

      // — barres cinéma —
      const barP = smooth(p, 0.315, 0.36) * (1 - smooth(p, 0.84, 0.92));
      if (barT) barT.style.transform = 'scaleY(' + barP.toFixed(3) + ')';
      if (barB) barB.style.transform = 'scaleY(' + barP.toFixed(3) + ')';

      // — bruit de signal —
      const stP = 1.1 * bell(p, 0.333, 0.024) + 0.55 * bell(p, 0.86, 0.02);
      if (stat) {
        stat.style.opacity = Math.min(stP, 0.95).toFixed(3);
        const on = stP > 0.04;
        if (on !== jitOn) { jitOn = on; stat.classList.toggle('jit', on); }
      }

      // — HUD coin par coin —
      const hudOut = 1 - smooth(p, 0.85, 0.9);
      for (let i = 0; i < hud.length; i++) {
        const hp = smooth(p, 0.35 + i * 0.018, 0.405 + i * 0.018) * hudOut;
        hud[i].style.opacity = (hp * 0.9).toFixed(3);
        hud[i].style.transform = 'translateY(' + ((1 - hp) * 14).toFixed(1) + 'px)';
      }

      // — réticule —
      const rp = smooth(p, 0.16, 0.22) * (1 - smooth(p, 0.8, 0.86));
      if (reticle) {
        const pulse = 1 + Math.min(Math.abs(velS) * 0.0016, 0.12) + 0.1 * bell(p, 0.285, 0.03);
        reticle.style.opacity = (rp * 0.95).toFixed(3);
        reticle.style.transform = 'scale(' + (pulse * (0.86 + 0.14 * rp)).toFixed(3) + ')';
      }

      // — légende —
      const cp = smooth(p, 0.42, 0.48) * (1 - smooth(p, 0.78, 0.84));
      if (caption) {
        caption.style.opacity = cp.toFixed(3);
        caption.style.transform = 'translateY(' + ((1 - cp) * 18).toFixed(1) + 'px)';
      }

      // — indication, note, rail —
      const hintP = 1 - smooth(p, 0.015, 0.06);
      if (hint) {
        hint.style.opacity = hintP.toFixed(3);
        hint.style.transform = 'translateX(-50%) translateY(' + ((1 - hintP) * 18).toFixed(0) + 'px)';
      }
      if (note) note.style.opacity = (smooth(p, 0.40, 0.46) * (1 - smooth(p, 0.74, 0.80)) * 0.95).toFixed(3);
      if (rail) rail.style.opacity = (smooth(p, 0.34, 0.4) * (1 - smooth(p, 0.86, 0.92))).toFixed(3);
      if (railFill) railFill.style.width = (s * 100).toFixed(2) + '%';

      // — scrub : vidéo réelle ou vol procédural —
      if (ready()) {
        const dur = video.duration;
        const targetT = s * Math.max(dur - 0.05, 0);
        curT = lerp(curT, targetT, 0.22);
        if (!video.seeking && Math.abs(curT - video.currentTime) > 0.012) {
          try { video.currentTime = curT; } catch (e2) {}
        }
        if (tcRef.current) tcRef.current.textContent = fmt(targetT);
        if (frameLblRef.current) {
          const tot = Math.round(dur * FPS);
          frameLblRef.current.textContent = 'FRAME ' + p3s(s * tot) + ' / ' + p3s(tot);
        }
      } else if (flight) {
        if (Math.abs(s - lastDrawn) > 0.0006 || p < 0.42 || Math.abs(velS) > 1.5) {
          flight.draw(s, velS + 150 * bell(p, 0.35, 0.022), idleT);
          lastDrawn = s;
        }
        if (tcRef.current) tcRef.current.textContent = fmt(s * VIRT_DUR);
        if (frameLblRef.current) frameLblRef.current.textContent = 'FRAME ' + p3s(s * VIRT_DUR * FPS) + ' / ' + p3s(VIRT_DUR * FPS);
      }
      if (altRef.current) altRef.current.textContent = 'ALT ' + p3s(58 + s * 88 + Math.sin(s * 9) * 9) + 'M';
      if (spdRef.current) spdRef.current.textContent = 'SPD ' + p3s(clamp(86 + Math.abs(velS) * 1.3 + Math.sin(s * 13) * 5 + punch * 52, 62, 199)) + 'KM/H';
    }

    const off = onFrame(() => {
      const r = track.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -100 || r.top > vh + 100) {
        if (sp > 0.001 && r.top > 0) { sp = 0; apply(0); }
        return;
      }
      const total = Math.max(r.height - vh, 1);
      const p = clamp(-r.top / total, 0, 1);
      sp = lerp(sp, p, 0.16);
      if (Math.abs(sp - p) < 0.0004) sp = p;
      // moteur au ralenti tant qu'on n'a pas percé l'écran
      if (!ready() && sp < 0.42) idleT += 0.0006 * (1 + Math.min(Math.abs(getVel()) * 0.012, 1.6));
      apply(sp);
    });

    apply(0);
    if (flight) { flight.resize(); flight.draw(0, 0, 0); }

    return () => { off(); window.removeEventListener('resize', onResize); };
  }, [hasVideo]);

  return (
    <section className={'immersive' + (hasVideo ? ' has-video' : '')} id="immersive" data-navdark ref={secRef}>
      <div className="wrap imv-intro">
        <span className="eyebrow">(01) — Séquence FPV · immersion</span>
        <h2 className="line-mask"><span>On ne regarde pas l'image.<br />On <em>entre</em> dedans.</span></h2>
        <p className="reveal" data-d="1">Continuez de défiler&nbsp;: le cadre s'ouvre, la séquence prend tout l'écran et se joue <em>image par image</em> sous votre doigt. Le vol vous appartient — puis vous en ressortez, et le portfolio reprend.</p>
        <div className="imv-specs reveal" data-d="2">
          <div><span>Captation</span><b>CFMoto 450SR · FPV</b></div>
          <div><span>Format</span><b>4K · 30 fps</b></div>
          <div><span>Décor</span><b>Genève · Salève</b></div>
          <div><span>Pilotage</span><b>au scroll, 1:1</b></div>
        </div>
      </div>

      <div className="imv-track" ref={trackRef}>
        <div className="imv-sticky">
          <div className="imv-stage">
            <div className="imv-frame" ref={frameRef}>
              <video className="imv-video" ref={videoRef} muted playsInline preload="auto" disablePictureInPicture />
              <canvas className="imv-canvas" ref={canvasRef} aria-hidden="true" />
              <div className="imv-vignette" aria-hidden="true" />
              <div className="imv-static" ref={statRef} aria-hidden="true" />
              <div className="imv-bar top" ref={barTRef} aria-hidden="true" />
              <div className="imv-bar bot" ref={barBRef} aria-hidden="true" />
              <div className="imv-reticle" ref={reticleRef} aria-hidden="true"><i /></div>
              <div className="imv-hud" aria-hidden="true">
                <div className="lbl tl" ref={el => { hudRefs.current[0] = el; }}><span className="rec">REC</span> <span ref={tcRef}>00:00:00</span></div>
                <div className="lbl tr" ref={el => { hudRefs.current[1] = el; }}><span ref={altRef}>ALT 058M</span><br /><span ref={spdRef}>SPD 086KM/H</span></div>
                <div className="lbl bl" ref={el => { hudRefs.current[2] = el; }}>CFMOTO 450SR · TRACKING</div>
                <div className="lbl br" ref={el => { hudRefs.current[3] = el; }}><span ref={frameLblRef}>FRAME 000 / 480</span></div>
              </div>
              <div className="imv-caption" ref={captionRef}>
                <span className="cap-eye">Genève · Salève</span>
                <h3>On y <em>entre</em>,<br />image par image.</h3>
              </div>
              {!hasVideo && (
                <div className="imv-note" ref={noteRef} aria-hidden="true">
                  Vol procédural — déposez votre séquence&nbsp;→<br /><b>public/media/immersive.mp4</b> · 10–20&nbsp;s · paysage
                </div>
              )}
            </div>
            <div className="imv-brackets" ref={bracketsRef} aria-hidden="true">
              <span /><span /><span /><span />
              <div className="imv-launch-label">Séq. 01 — vol FPV <b>· verrouillage</b></div>
              <div className="imv-count">
                <span className="digit" ref={countDRef}>3</span>
                <span className="sub" ref={countSRef}>Amorçage</span>
              </div>
            </div>
            <div className="imv-flash" ref={flashRef} aria-hidden="true" />
            <div className="imv-hint" ref={hintRef}><span className="hint-dot" />Défilez pour entrer dans la séquence</div>
            <div className="imv-rail" ref={railRef} aria-hidden="true"><span ref={railFillRef} /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
