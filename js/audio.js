/* =========================================================================
   AUDIO — all generated in the browser (no files).
   Hertil sounds like a place slightly out of tune with ours:
   · music: slow drones, glass harmonica, bowed metal, a detuned music box; odd modes
   · ambience per place: dry wind and things landing, the loom, water dripping in ponds,
     a stair whose bell rises forever, breathing in your hollow
   · effects: a die that melts, numbers that scramble, marks settling, a gaze arriving
   Each has its own volume + on/off, saved in SETTINGS. Starts after the first tap.
   ========================================================================= */
const SETTINGS = (() => {
  const d = { music: .55, amb: .7, sfx: .8, voice: 1, musicOn: true, ambOn: true, sfxOn: true, voiceOn: true, motion: true };
  let s = d;
  try { s = Object.assign({}, d, JSON.parse(localStorage.getItem('hertil_settings') || '{}')); } catch (e) { }
  s.save = () => { try { const c = Object.assign({}, s); delete c.save; localStorage.setItem('hertil_settings', JSON.stringify(c)); } catch (e) { } };
  return s;
})();

const AUDIO = (() => {
  const FAST = /[?&]fast/.test(location.search);
  let ctx = null, master, bus = {}, curAmb = null, ambName = null, theme = null, timer = null;

  function init() {
    if (ctx || FAST) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.gain.value = .9;
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3;
      master.connect(comp); comp.connect(ctx.destination);
      ['music', 'amb', 'sfx'].forEach(k => { bus[k] = ctx.createGain(); bus[k].connect(master); });
      const rv = reverb(); bus.music.connect(rv.in); bus.sfx.connect(rv.in); rv.out.connect(master);
      applyVolumes();
    } catch (e) { ctx = null; }
  }
  // a long, dark reverb: Hertil is a big room
  function reverb() {
    const inp = ctx.createGain(), out = ctx.createGain(); out.gain.value = .42;
    [.097, .143, .211, .293, .377].forEach((t, i) => {
      const d = ctx.createDelay(1); d.delayTime.value = t;
      const fb = ctx.createGain(); fb.gain.value = .62 - i * .04;
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1800 - i * 200;
      inp.connect(d); d.connect(lp); lp.connect(fb); fb.connect(d); lp.connect(out);
    });
    return { in: inp, out };
  }
  function applyVolumes() {
    if (!ctx) return;
    const t = ctx.currentTime;
    bus.music.gain.setTargetAtTime(SETTINGS.musicOn ? SETTINGS.music * .6 : 0, t, .3);
    bus.amb.gain.setTargetAtTime(SETTINGS.ambOn ? SETTINGS.amb : 0, t, .3);
    bus.sfx.gain.setTargetAtTime(SETTINGS.sfxOn ? SETTINGS.sfx : 0, t, .1);
  }

  /* ---------- building blocks ---------- */
  const bufCache = {};
  function noiseBuf(type = 'brown', secs = 4) {
    const key = type + secs; if (bufCache[key]) return bufCache[key];
    const len = ctx.sampleRate * secs, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
    let last = 0, b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      if (type === 'brown') { last = (last + .02 * w) / 1.02; d[i] = last * 3.5; }
      else if (type === 'pink') { b0 = .997 * b0 + w * .029; b1 = .985 * b1 + w * .032; b2 = .95 * b2 + w * .048; d[i] = (b0 + b1 + b2 + w * .02) * .5; }
      else d[i] = w * .4;
    }
    return bufCache[key] = b;
  }
  function noise(type, freq, q, vol, out, ftype = 'lowpass') {
    const s = ctx.createBufferSource(); s.buffer = noiseBuf(type); s.loop = true;
    const f = ctx.createBiquadFilter(); f.type = ftype; f.frequency.value = freq; f.Q.value = q || .7;
    const g = ctx.createGain(); g.gain.value = vol;
    s.connect(f); f.connect(g); g.connect(out); s.start();
    return { s, f, g };
  }
  function lfo(param, rate, depth) { const o = ctx.createOscillator(); o.frequency.value = rate; const g = ctx.createGain(); g.gain.value = depth; o.connect(g); g.connect(param); o.start(); return o; }
  function hum(freqs, vol, out, type = 'sine') {
    return freqs.map((f, i) => { const o = ctx.createOscillator(); o.type = type; o.frequency.value = f; const g = ctx.createGain(); g.gain.value = vol / freqs.length; lfo(o.frequency, .05 + i * .03, f * .006); lfo(g.gain, .03 + i * .02, vol / freqs.length * .6); o.connect(g); g.connect(out); o.start(); return o; });
  }
  function every(min, max, fn, bag) {
    let alive = true;
    const tick = () => { if (!alive) return; try { fn(); } catch (e) { } bag.t = setTimeout(tick, (min + Math.random() * (max - min)) * 1000); };
    bag.t = setTimeout(tick, (min + Math.random() * (max - min)) * 500);
    bag.stops.push(() => { alive = false; clearTimeout(bag.t); });
  }
  function blip(out, f0, f1, dur, type = 'sine', vol = .1, delay = 0, atk = .02) {
    const t = ctx.currentTime + delay;
    const o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + atk); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + .05);
  }
  function burst(out, freq, dur, vol, q = 1, delay = 0) {
    const t = ctx.currentTime + delay;
    const s = ctx.createBufferSource(); s.buffer = noiseBuf('white', .3);
    const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = freq; f.Q.value = q;
    const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    s.connect(f); f.connect(g); g.connect(out); s.start(t); s.stop(t + dur + .05);
  }
  // glass harmonica: pure partials with a slow swell
  function glass(out, f, vol = .04, dur = 3, delay = 0) { [[1, 1], [2.01, .25], [3.02, .08]].forEach(([m, a]) => blip(out, f * m, f * m * .998, dur, 'sine', vol * a, delay, dur * .3)); }
  // a voice that is not quite a voice: noise through two formants
  function murmur(out, vol = .05, delay = 0) {
    const t = ctx.currentTime + delay, dur = .2 + Math.random() * .4;
    const s = ctx.createBufferSource(); s.buffer = noiseBuf('pink', 1);
    const f1 = ctx.createBiquadFilter(); f1.type = 'bandpass'; f1.frequency.value = 300 + Math.random() * 500; f1.Q.value = 8;
    const f2 = ctx.createBiquadFilter(); f2.type = 'bandpass'; f2.frequency.value = 900 + Math.random() * 1400; f2.Q.value = 10;
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .05); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    s.connect(f1); s.connect(f2); f1.connect(g); f2.connect(g); g.connect(out); s.start(t); s.stop(t + dur + .05);
  }

  /* ---------- ambience ---------- */
  const SCAPES = {
    title(out, bag) { const w = noise('brown', 260, .7, .35, out); lfo(w.g.gain, .05, .2); hum([55, 82.6], .03, out); },
    void(out, bag) { const w = noise('pink', 900, 2, .35, out, 'bandpass'); lfo(w.f.frequency, .15, 500); every(1.5, 4, () => { const f = 900 + Math.random() * 700; blip(out, f, f * .4, 2.2, 'sine', .02); }, bag); },
    bottom(out, bag) { const w = noise('brown', 320, .7, .45, out); lfo(w.g.gain, .07, .25); noise('pink', 3000, .6, .02, out, 'highpass');
      every(4, 11, () => { blip(out, 90, 50, .5, 'sine', .09); burst(out, 600, .18, .05, 1.5, .02); }, bag); // something lands
      every(9, 20, () => { const f = 1200 + Math.random() * 600; blip(out, f, f * .5, 1.6, 'sine', .015); }, bag); },
    road(out, bag) { const w = noise('brown', 380, .7, .35, out); lfo(w.f.frequency, .06, 120); every(7, 16, () => blip(out, 70, 50, .6, 'sine', .06), bag); },
    plain(out, bag) { const w = noise('brown', 200, .7, .5, out); lfo(w.g.gain, .04, .3); hum([41.2, 61.7], .05, out);
      every(5, 12, () => burst(out, 1800 + Math.random() * 900, .25, .03, 9), bag); // branches creak
      every(14, 26, () => { blip(out, 110, 104, 4.5, 'sawtooth', .012, 0, 1.5); }, bag); }, // a horn, very far
    stair(out, bag) { noise('brown', 180, .7, .18, out); let n = 0;
      every(3, 3.5, () => { const f = 330 * Math.pow(2, (n++ % 12) / 12); glass(out, f, .03, 2.4); }, bag); // the bell that rises forever
      every(6, 13, () => burst(out, 400, .35, .04, 6), bag); },
    nest(out, bag) { const b = noise('pink', 500, .6, .12, out); lfo(b.g.gain, .18, .1); // breathing
      every(1.6, 1.6, () => blip(out, 55, 45, .25, 'sine', .05), bag); },
    hall(out, bag) { noise('brown', 240, .7, .2, out); hum([880, 1318, 1760], .006, out);
      every(1.15, 1.15, () => { burst(out, 900, .06, .07, 4); burst(out, 500, .08, .05, 3, .14); }, bag); }, // the loom
    hall_torn(out, bag) { SCAPES.hall(out, bag); every(.8, 3, () => { burst(out, 3500, .04, .08, 12); blip(out, 2600, 300, .25, 'triangle', .02); }, bag); }, // threads snap
    ponds(out, bag) { noise('brown', 260, .7, .2, out); every(.8, 2.6, () => { const f = 900 + Math.random() * 900; blip(out, f, f * 1.6, .12, 'sine', .04); }, bag); every(8, 15, () => glass(out, 660 + Math.random() * 200, .02, 3.5), bag); },
    market(out, bag) { noise('pink', 700, .8, .12, out, 'bandpass'); every(.15, .6, () => murmur(out, .04 + Math.random() * .04), bag); every(3, 7, () => { blip(out, 2400, 2380, .5, 'sine', .02); blip(out, 3100, 3090, .4, 'sine', .012, .1); }, bag); },
    map(out, bag) { noise('brown', 260, .7, .1, out); },
  };
  const INDOOR = ['nest', 'hall', 'hall_torn', 'stair'];
  // the light adds its own layer outdoors: insects in white light, a far voice in red, something large breathing in the dark
  function lightLayer(name, ph, out, bag) {
    if (INDOOR.includes(name) || ['map', 'title', 'void'].includes(name)) return;
    if (ph === 0) every(5, 12, () => { for (let i = 0; i < 4; i++) blip(out, 5200 + Math.random() * 600, 4800, .05, 'sine', .006, i * .09); }, bag);
    if (ph === 2) every(10, 20, () => { murmur(out, .025); murmur(out, .02, .4); }, bag);
    if (ph >= 3) every(6, 12, () => { const b = ctx.createGain(); b.connect(out); burst(b, 160, 1.6, .06, .8); }, bag);
  }
  function playAmb(name, ph = 3) {
    const key = name + ':' + (INDOOR.includes(name) ? '' : ph);
    if (key === ambName) return; ambName = key;
    if (curAmb) { const old = curAmb; old.g.gain.setTargetAtTime(0, ctx.currentTime, .6); setTimeout(() => { old.stops.forEach(f => f()); try { old.g.disconnect(); } catch (e) { } }, 2500); }
    const g = ctx.createGain(); g.gain.value = 0; g.connect(bus.amb);
    const bag = { stops: [], g };
    try { (SCAPES[name] || SCAPES.map)(g, bag); lightLayer(name, ph, g, bag); } catch (e) { }
    g.gain.setTargetAtTime(1, ctx.currentTime, .8);
    curAmb = bag;
  }

  /* ---------- music: instruments ---------- */
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  function env(g, t, a, peak, dur, rel) { g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(peak, t + a); g.gain.setTargetAtTime(0, t + dur, rel); }
  const INST = {
    glass(out, f, t, d, v = .05) { [[1, 1], [2.01, .3], [3.03, .1]].forEach(([m, a]) => { const o = ctx.createOscillator(); o.frequency.value = f * m; const g = ctx.createGain(); env(g, t, Math.min(1.2, d * .45), v * a, d, .9); o.connect(g); g.connect(out); o.start(t); o.stop(t + d + 4); }); },
    bowed(out, f, t, d, v = .05, detune = 0) { // bowed metal: a saw through a narrow, wandering band
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f * (1 + detune);
      const vib = ctx.createOscillator(); vib.frequency.value = 3.8; const vg = ctx.createGain(); vg.gain.value = f * .005; vib.connect(vg); vg.connect(o.frequency);
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.setValueAtTime(f * 2, t); bp.frequency.linearRampToValueAtTime(f * 3.5, t + d); bp.Q.value = 6;
      const g = ctx.createGain(); env(g, t, Math.min(.8, d * .4), v * 1.6, d, .5);
      o.connect(bp); bp.connect(g); g.connect(out); o.start(t); vib.start(t); o.stop(t + d + 3); vib.stop(t + d + 3);
    },
    drone(out, f, t, d, v = .04) { [-.007, 0, .007].forEach(dt => { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f * (1 + dt); const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 420; const g = ctx.createGain(); env(g, t, Math.min(2, d * .5), v, d, 1.4); o.connect(lp); lp.connect(g); g.connect(out); o.start(t); o.stop(t + d + 6); }); },
    horn(out, f, t, d, v = .05) { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(200, t); lp.frequency.linearRampToValueAtTime(600, t + d * .5); lp.frequency.linearRampToValueAtTime(240, t + d); const g = ctx.createGain(); env(g, t, d * .35, v, d, .8); o.connect(lp); lp.connect(g); g.connect(out); o.start(t); o.stop(t + d + 4); },
    box(out, f, t, d, v = .07, detune = 0) { [[1, .9], [2.76, .25], [5.4, .08]].forEach(([m, a]) => { const o = ctx.createOscillator(); o.frequency.value = f * m * (1 + detune + (Math.random() - .5) * .006); const g = ctx.createGain(); g.gain.setValueAtTime(v * a, t); g.gain.exponentialRampToValueAtTime(.0001, t + 1.8); o.connect(g); g.connect(out); o.start(t); o.stop(t + 1.9); }); },
    pluckD(out, f, t, d, v = .12) { [[1, 'triangle', 1], [2.02, 'sine', .3]].forEach(([m, ty, a]) => { const o = ctx.createOscillator(); o.type = ty; o.frequency.value = f * m; const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v * a, t + .004); g.gain.exponentialRampToValueAtTime(.0001, t + Math.max(.8, d * 2)); o.connect(g); g.connect(out); o.start(t); o.stop(t + d * 2 + .9); }); },
    reed(out, f, t, d, v = .04) { [0, .006].forEach(dt => { const o = ctx.createOscillator(); o.type = 'square'; o.frequency.value = f * (1 + dt); const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1100; const g = ctx.createGain(); env(g, t, .06, v, d, .12); o.connect(lp); lp.connect(g); g.connect(out); o.start(t); o.stop(t + d + .8); }); },
    choir(out, f, t, d, v = .045) {
      [0, -.005, .005].forEach(dt => { const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f * (1 + dt);
        const f1 = ctx.createBiquadFilter(); f1.type = 'bandpass'; f1.frequency.value = 500; f1.Q.value = 6; const f2 = ctx.createBiquadFilter(); f2.type = 'bandpass'; f2.frequency.value = 950; f2.Q.value = 7;
        const g = ctx.createGain(); env(g, t, Math.min(1.4, d * .4), v * 2.2, d, 1.2); o.connect(f1); o.connect(f2); f1.connect(g); f2.connect(g); g.connect(out); o.start(t); o.stop(t + d + 4); });
    },
  };

  /* ---------- music: themes ----------
     root (MIDI), mode, bpm, beats per bar, prog (scale degrees per bar), chord/bass/mel instruments,
     density (chance of a melody note per step), sub (steps per beat), oct (melody octave shift) */
  const PHR = [0, 1, 3, 5, 7, 8, 10], LOC = [0, 1, 3, 5, 6, 8, 10], AEO = [0, 2, 3, 5, 7, 8, 10], DOR = [0, 2, 3, 5, 7, 9, 10], LYD = [0, 2, 4, 6, 7, 9, 11], WHOLE = [0, 2, 4, 6, 8, 10], HARM = [0, 2, 3, 5, 7, 8, 11];
  const THEMES = {
    title:  { root: 45, mode: PHR, bpm: 40, beats: 4, prog: [0, 1, 0, 5, 3, 1, 6, 0], chord: 'glass', bass: 'horn', mel: 'bowed', density: .2, sub: 1, oct: 12, chordVol: .03 },
    void:   { root: 38, mode: LOC, bpm: 36, beats: 4, prog: [0, 1, 4, 0], chord: 'drone', bass: null, mel: 'glass', density: .12, sub: 1, oct: 24, detune: true },
    bottom: { root: 43, mode: PHR, bpm: 46, beats: 4, prog: [0, 1, 0, 6, 0, 3, 1, 0], chord: 'drone', bass: 'horn', mel: 'pluckD', density: .22, sub: 2, oct: 24, detune: true, chordVol: .025 },
    road:   { root: 43, mode: PHR, bpm: 52, beats: 4, prog: [0, 6, 0, 1], chord: null, bass: 'horn', mel: 'pluckD', density: .2, sub: 2, oct: 24, detune: true },
    plain:  { root: 36, mode: AEO, bpm: 32, beats: 4, prog: [0, 5, 3, 0, 6, 5, 4, 0], chord: 'drone', bass: 'horn', mel: 'bowed', density: .14, sub: 1, oct: 24, chordVol: .035 },
    stair:  { root: 50, mode: WHOLE, bpm: 58, beats: 3, prog: [0, 1, 2, 3, 4, 5], chord: 'box', bass: null, mel: 'box', density: .35, sub: 1, oct: 12, arp: true, detune: true },
    nest:   { root: 48, mode: LYD, bpm: 42, beats: 3, prog: [0, 4, 5, 3], chord: 'glass', bass: null, mel: 'box', density: .25, sub: 1, oct: 12, detune: true, chordVol: .025 },
    hall:   { root: 45, mode: DOR, bpm: 52, beats: 4, prog: [0, 5, 3, 4, 0, 6, 5, 4], chord: 'choir', bass: 'pluckD', mel: 'bowed', density: .25, sub: 1, oct: 12, chordVol: .03 },
    hall_torn: { root: 44, mode: LOC, bpm: 66, beats: 4, prog: [0, 1, 0, 4], chord: 'choir', bass: 'pluckD', mel: 'bowed', density: .45, sub: 2, oct: 12, detune: true, chordVol: .03 },
    ponds:  { root: 52, mode: LYD, bpm: 46, beats: 4, prog: [0, 1, 4, 0, 5, 1, 4, 0], chord: 'glass', bass: null, mel: 'glass', density: .25, sub: 1, oct: 24, chordVol: .02 },
    market: { root: 50, mode: HARM, bpm: 88, beats: 5, prog: [0, 0, 3, 4, 0, 5, 4, 0], chord: null, bass: 'pluckD', mel: 'reed', density: .55, sub: 1, oct: 12, detune: true },
    map:    { root: 43, mode: PHR, bpm: 40, beats: 4, prog: [0, 1, 6, 0], chord: 'drone', bass: null, mel: 'glass', density: .14, sub: 1, oct: 24, chordVol: .02 },
  };

  function deg(T, d, octave = 0) { const n = T.mode.length; const o = Math.floor(d / n); const i = ((d % n) + n) % n; return T.root + T.mode[i] + 12 * (o + octave); }
  // in the dark the music thins out outdoors
  const nightCache = {};
  function themeFor(name, ph) {
    const T = THEMES[name] || THEMES.map;
    if (ph < 3 || INDOOR.includes(name) || name === 'title') return T;
    return nightCache[name] = nightCache[name] || Object.assign({}, T, { bpm: Math.round(T.bpm * .8), density: T.density * .5, chord: 'drone', chordVol: .02 });
  }
  function startTheme(name, ph = 3) {
    const T = themeFor(name, ph);
    if (theme === T) return; theme = T;
    if (timer) clearInterval(timer);
    const out = ctx.createGain(); out.gain.value = 0; out.connect(bus.music); out.gain.setTargetAtTime(1, ctx.currentTime, 1.8);
    const prev = startTheme.out; if (prev) { prev.gain.setTargetAtTime(0, ctx.currentTime, 1); setTimeout(() => { try { prev.disconnect(); } catch (e) { } }, 5000); }
    startTheme.out = out;
    const spb = 60 / T.bpm, step = spb / (T.sub || 1);
    let next = ctx.currentTime + .3, n = 0, mel = 4;
    const stepsPerBar = T.beats * (T.sub || 1);
    timer = setInterval(() => {
      if (!ctx || ctx.state !== 'running') return;
      while (next < ctx.currentTime + .25) {
        const bar = Math.floor(n / stepsPerBar), inBar = n % stepsPerBar, beat = inBar / (T.sub || 1);
        const ch = T.prog[bar % T.prog.length];
        const det = T.detune ? (Math.random() - .5) * .016 : 0;
        if (T.chord && inBar === 0 && !T.arp) [0, 2, 4].forEach(k => INST[T.chord](out, mtof(deg(T, ch + k)), next, spb * T.beats * .98, T.chordVol));
        if (T.arp && T.chord && Number.isInteger(beat)) INST[T.chord](out, mtof(deg(T, ch + [0, 2, 4, 6][beat % 4])), next, spb, .05, det);
        if (T.bass && inBar === 0) INST[T.bass](out, mtof(deg(T, ch, -1)), next, spb * T.beats * .9, .06);
        if (T.mel && !(bar % 4 === 3 && inBar > stepsPerBar / 2)) {
          const strong = inBar === 0;
          if (Math.random() < T.density * (strong ? 1.3 : .8)) {
            mel += pick([-2, -1, -1, 0, 1, 1, 2, strong ? 0 : 3]);
            if (strong && Math.random() < .5) { const ct = [ch, ch + 2, ch + 4, ch + 7]; mel = ct.reduce((a, b) => Math.abs(b - mel) < Math.abs(a - mel) ? b : a); }
            mel = Math.max(-1, Math.min(11, mel));
            const len = step * (Math.random() < .5 ? 2 : 1);
            INST[T.mel](out, mtof(deg(T, mel) + T.oct), next, len * .95, undefined, det);
          }
        }
        next += step; n++;
      }
    }, 40);
  }
  const pick = a => a[Math.floor(Math.random() * a.length)];

  /* ---------- public ---------- */
  function play(name, ph = 3) { init(); if (!ctx) return; playAmb(name, ph); startTheme(name, ph); }
  function steps(n = 4) { init(); if (!ctx) return; for (let i = 0; i < n; i++) { burst(bus.sfx, 220 + Math.random() * 60, .16, .16, 1.2, i * .42); burst(bus.sfx, 4000, .05, .02, 2, i * .42 + .03); } }
  function sting(kind) {
    init(); if (!ctx) return; const o = bus.sfx;
    if (kind === 'win') { glass(o, 523, .05, 1.4); glass(o, 784, .04, 1.6, .12); }
    if (kind === 'lose') blip(o, 196, 130, 1.1, 'sawtooth', .03);
    if (kind === 'dice') for (let i = 0; i < 6; i++) burst(o, 1800, .05, .07, 5, i * .08);
    if (kind === 'glimpse') [440, 554, 659, 830].forEach((f, i) => glass(o, f, .03, 2.4, i * .2));
    if (kind === 'level') [392, 523, 659].forEach((f, i) => glass(o, f, .045, 1.4, i * .12));
    if (kind === 'page') burst(o, 1400, .25, .07, 1);
    if (kind === 'tile') burst(o, 2600, .03, .04, 4);
    if (kind === 'coin') { blip(o, 2600, 2400, .2, 'sine', .04); blip(o, 3300, 3100, .25, 'sine', .03, .07); }
    if (kind === 'tick') burst(o, 3000, .03, .05, 6);
    if (kind === 'night') [392, 311, 233].forEach((f, i) => glass(o, f, .03, 2, i * .4));
    if (kind === 'dawn') [233, 311, 392, 466].forEach((f, i) => glass(o, f, .028, 1.8, i * .25));
    if (kind === 'bell') { glass(o, 196, .05, 3); glass(o, 196, .04, 3, 1.1); }
    if (kind === 'imprint') { blip(o, 880, 870, .5, 'triangle', .035); glass(o, 1760, .015, 1.4, .05); }
    if (kind === 'glance') { glass(o, 587, .03, 1.6); glass(o, 880, .02, 1.8, .3); }
    if (kind === 'gaze') { INST.drone(o, 98, ctx.currentTime, 4, .05); [294, 370, 440, 587].forEach((f, i) => glass(o, f, .04, 4, .6 + i * .5)); }
    if (kind === 'melt') { blip(o, 520, 60, 1.8, 'sawtooth', .03); const l = ctx.createGain(); l.connect(o); lfo(l.gain, 9, .5); blip(l, 300, 40, 1.8, 'sine', .05); }
    if (kind === 'glyph') for (let i = 0; i < 9; i++) blip(o, 400 + Math.random() * 2400, 300 + Math.random() * 2400, .06, 'square', .015, i * .05);
    if (kind === 'soft') { blip(o, 330, 300, .6, 'sine', .05); burst(o, 500, .3, .03, 1); }
    if (kind === 'hard') { burst(o, 3200, .04, .09, 8); blip(o, 660, 650, .3, 'triangle', .04); }
  }
  function resume() { init(); if (ctx && ctx.state === 'suspended') ctx.resume(); }
  function set(k, v) { SETTINGS[k] = v; SETTINGS.save(); applyVolumes(); }
  return { play, steps, sting, resume, set, applyVolumes };
})();
