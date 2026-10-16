/* =========================================================================
   AUDIO — Feberdrøm: bouncy, slightly broken synth-pop, all generated in the browser.
   · music: a 16-step sequencer per place (drums, bass, arpeggio, lead, pad) with tape wobble
   · ambience: playful foley per place (things landing, the loom zipping, ponds bubbling…)
   · effects: dice, stamps, a melting die, scrambled numbers, marks, glances
   Each has its own volume + on/off, saved in SETTINGS. Starts after the first tap.
   ========================================================================= */
const SETTINGS = (() => {
  const d = { music: .55, amb: .6, sfx: .8, voice: 1, musicOn: true, ambOn: true, sfxOn: true, voiceOn: true, motion: true };
  let s = d;
  try { s = Object.assign({}, d, JSON.parse(localStorage.getItem('hertil_settings') || '{}')); } catch (e) { }
  s.save = () => { try { const c = Object.assign({}, s); delete c.save; localStorage.setItem('hertil_settings', JSON.stringify(c)); } catch (e) { } };
  return s;
})();

const AUDIO = (() => {
  const FAST = /[?&]fast/.test(location.search);
  let ctx = null, master, bus = {}, curAmb = null, ambName = null, theme = null, timer = null, wob = null;

  function init() {
    if (ctx || FAST) return;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain(); master.gain.value = .85;
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 4; comp.attack.value = .005; comp.release.value = .15;
      master.connect(comp); comp.connect(ctx.destination);
      ['music', 'amb', 'sfx'].forEach(k => { bus[k] = ctx.createGain(); bus[k].connect(master); });
      const dl = echo(); bus.music.connect(dl.in); bus.sfx.connect(dl.in); dl.out.connect(master);
      wob = ctx.createOscillator(); wob.frequency.value = .35; wob.start(); // a shared tape wobble
      applyVolumes();
    } catch (e) { ctx = null; }
  }
  // a short ping-pong-ish echo instead of a big dark reverb
  function echo() {
    const inp = ctx.createGain(), out = ctx.createGain(); out.gain.value = .22;
    [.18, .27].forEach((t, i) => { const d = ctx.createDelay(1); d.delayTime.value = t; const fb = ctx.createGain(); fb.gain.value = .32; const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 500 + i * 300; inp.connect(d); d.connect(hp); hp.connect(fb); fb.connect(d); hp.connect(out); });
    return { in: inp, out };
  }
  function applyVolumes() {
    if (!ctx) return;
    const t = ctx.currentTime;
    bus.music.gain.setTargetAtTime(SETTINGS.musicOn ? SETTINGS.music * .7 : 0, t, .2);
    bus.amb.gain.setTargetAtTime(SETTINGS.ambOn ? SETTINGS.amb * .6 : 0, t, .2);
    bus.sfx.gain.setTargetAtTime(SETTINGS.sfxOn ? SETTINGS.sfx : 0, t, .1);
  }

  /* ---------- building blocks ---------- */
  const bufCache = {};
  function noiseBuf(type = 'white', secs = 1) {
    const key = type + secs; if (bufCache[key]) return bufCache[key];
    const len = ctx.sampleRate * secs, b = ctx.createBuffer(1, len, ctx.sampleRate), d = b.getChannelData(0);
    let last = 0; for (let i = 0; i < len; i++) { const w = Math.random() * 2 - 1; if (type === 'brown') { last = (last + .02 * w) / 1.02; d[i] = last * 3.5; } else d[i] = w * .5; }
    return bufCache[key] = b;
  }
  function tone(out, f, t, d, type = 'sine', v = .1, o = {}) {
    const osc = ctx.createOscillator(); osc.type = type; osc.frequency.setValueAtTime(f, t);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.to), t + (o.toT || d));
    if (o.det) osc.detune.value = o.det;
    if (o.wob && wob) { const g = ctx.createGain(); g.gain.value = f * .006 * o.wob; wob.connect(g); g.connect(osc.frequency); }
    if (o.vib) { const l = ctx.createOscillator(); l.frequency.value = o.vib; const lg = ctx.createGain(); lg.gain.value = f * .012; l.connect(lg); lg.connect(osc.frequency); l.start(t); l.stop(t + d + .1); }
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + (o.a || .004)); g.gain.exponentialRampToValueAtTime(.0001, t + d);
    let n = osc;
    if (o.lp) { const fl = ctx.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.setValueAtTime(o.lp, t); if (o.lpTo) fl.frequency.exponentialRampToValueAtTime(o.lpTo, t + d); fl.Q.value = o.q || 1; osc.connect(fl); n = fl; }
    n.connect(g); g.connect(out); osc.start(t); osc.stop(t + d + .05);
  }
  function hit(out, t, f, d, v, q = 1, type = 'bandpass') {
    const s = ctx.createBufferSource(); s.buffer = noiseBuf(); const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q;
    const g = ctx.createGain(); g.gain.setValueAtTime(v, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); s.connect(fl); fl.connect(g); g.connect(out); s.start(t); s.stop(t + d + .05);
  }
  const now = () => ctx.currentTime;
  function every(min, max, fn, bag) {
    let alive = true;
    const tick = () => { if (!alive) return; try { fn(); } catch (e) { } bag.t = setTimeout(tick, (min + Math.random() * (max - min)) * 1000); };
    bag.t = setTimeout(tick, (min + Math.random() * (max - min)) * 500);
    bag.stops.push(() => { alive = false; clearTimeout(bag.t); });
  }
  const boing = (o, t, f = 180, v = .06) => tone(o, f, t, .35, 'sine', v, { to: f * 2.6, toT: .12, vib: 18 });
  const squeak = (o, t, v = .03) => { const f = 1400 + Math.random() * 900; tone(o, f, t, .12, 'square', v, { to: f * 1.4, lp: 3000 }); };

  /* ---------- ambience: playful foley per place ---------- */
  const SCAPES = {
    title(o, b) { every(1.5, 3, () => squeak(o, now(), .015), b); },
    void(o, b) { every(.4, 1.1, () => { const f = 600 + Math.random() * 900; tone(o, f, now(), .9, 'sine', .02, { to: f * .3 }); }, b); },
    bottom(o, b) { every(2, 5, () => { boing(o, now(), 120 + Math.random() * 120, .05); hit(o, now() + .05, 900, .08, .06, 3); }, b); every(5, 9, () => { tone(o, 233, now(), .6, 'sawtooth', .02, { lp: 900, to: 180 }); }, b); },
    road(o, b) { every(1.2, 3, () => squeak(o, now(), .012), b); every(6, 12, () => boing(o, now(), 200, .03), b); },
    plain(o, b) { const w = ctx.createBufferSource(); w.buffer = noiseBuf('brown', 2); w.loop = true; const g = ctx.createGain(); g.gain.value = .06; w.connect(g); g.connect(o); w.start(); b.stops.push(() => w.stop());
      every(3, 7, () => { for (let i = 0; i < 4; i++) tone(o, 2600 + Math.random() * 1400, now() + i * .07, .1, 'sine', .015); }, b); },
    stair(o, b) { let n = 0; every(.9, .9, () => { tone(o, 330 * Math.pow(2, (n++ % 12) / 6), now(), .25, 'triangle', .025); }, b); every(4, 8, () => tone(o, 523, now(), .4, 'square', .02, { vib: 9, lp: 1500 }), b); },
    nest(o, b) { every(.55, .55, () => tone(o, 70, now(), .22, 'sine', .05, { to: 55 }), b); },
    hall(o, b) { every(.45, .45, () => { hit(o, now(), 3200, .06, .05, 6); tone(o, 900, now() + .02, .06, 'square', .01, { to: 1300, lp: 2500 }); }, b); },
    hall_torn(o, b) { SCAPES.hall(o, b); every(.3, 1.2, () => { tone(o, 2400, now(), .25, 'triangle', .03, { to: 300 }); hit(o, now(), 4000, .05, .06, 10); }, b); },
    ponds(o, b) { every(.3, 1.2, () => { const f = 500 + Math.random() * 700; tone(o, f, now(), .1, 'sine', .04, { to: f * 2.4, toT: .08 }); }, b); },
    market(o, b) { every(.12, .4, () => { const t = now(), f = 300 + Math.random() * 500; tone(o, f, t, .14, 'sawtooth', .012, { to: f * (Math.random() < .5 ? 1.4 : .7), lp: 1400, q: 6 }); }, b); every(3, 6, () => tone(o, 1568, now(), .5, 'sine', .02), b); },
    enge(o, b) { every(.5, 1.6, () => { const t = now(); tone(o, 2000, t, .03, 'square', .015); tone(o, 1500, t + .25, .03, 'square', .012); }, b); every(3, 7, () => { const f = 300 + Math.random() * 120; tone(o, f, now(), .4, 'sawtooth', .02, { lp: 1200, vib: 11 }); }, b); },
    himmel(o, b) { const w = ctx.createBufferSource(); w.buffer = noiseBuf('brown', 2); w.loop = true; const g = ctx.createGain(); g.gain.value = .08; w.connect(g); g.connect(o); w.start(); b.stops.push(() => w.stop()); every(2, 5, () => tone(o, 600 + Math.random() * 300, now(), .8, 'sine', .015, { to: 300 }), b); },
    doere(o, b) { every(2.5, 6, () => { tone(o, 140, now(), .6, 'sawtooth', .02, { to: 90, lp: 700 }); }, b); },
    forgaars(o, b) { every(.4, 1.4, () => { const f = 300 + Math.random() * 900; tone(o, f * .3, now(), .5, 'sine', .02, { to: f }); }, b); },
    map(o, b) { every(2, 5, () => squeak(o, now(), .01), b); },
  };
  const INDOOR = ['nest', 'hall', 'hall_torn', 'stair', 'doere'];
  function playAmb(name, ph = 0) {
    const key = name + ':' + ph;
    if (key === ambName) return; ambName = key;
    if (curAmb) { const old = curAmb; old.g.gain.setTargetAtTime(0, ctx.currentTime, .3); setTimeout(() => { old.stops.forEach(f => f()); try { old.g.disconnect(); } catch (e) { } }, 1500); }
    const g = ctx.createGain(); g.gain.value = 0; g.connect(bus.amb);
    const bag = { stops: [], g };
    try { (SCAPES[name] || SCAPES.map)(g, bag); if (ph >= 3 && !INDOOR.includes(name)) every(3, 6, () => { tone(g, 1760, now(), .3, 'sine', .015); tone(g, 2349, now() + .12, .3, 'sine', .012); }, bag); } catch (e) { }
    g.gain.setTargetAtTime(1, ctx.currentTime, .4);
    curAmb = bag;
  }

  /* ---------- music ---------- */
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
  const ION = [0, 2, 4, 5, 7, 9, 11], MIX = [0, 2, 4, 5, 7, 9, 10], DOR = [0, 2, 3, 5, 7, 9, 10], LYD = [0, 2, 4, 6, 7, 9, 11], WHOLE = [0, 2, 4, 6, 8, 10], PEN = [0, 2, 4, 7, 9], AEO = [0, 2, 3, 5, 7, 8, 10];
  // drums as 16-step strings: x = hit, o = soft hit, . = rest
  const D = {
    four: { k: 'x...x...x...x...', s: '....x.......x...', h: '..x...x...x...x.' },
    bounce: { k: 'x..x..x...x..x..', s: '....x.......x..o', h: 'x.xxx.xxx.xxx.xx' },
    half: { k: 'x.........x.....', s: '........x.......', h: 'x...x...x...x...' },
    soft: { k: 'x.......x.......', s: '................', h: '....x.......x...' },
    run: { k: 'x...x...x...x...', s: '....x..o....x.o.', h: 'xxxxxxxxxxxxxxxx' },
    none: { k: '................', s: '................', h: '................' },
  };
  const THEMES = {
    // the title screen has a real song: a fixed melody (scale degree, length in 16ths), 8 bars, verse then chorus
    title:  { bpm: 118, root: 50, mode: MIX, prog: [0, 0, 3, 4, 5, 3, 6, 4], drums: 'bounce', bass: 'x..x..x.x..x..x.', arp: 'square', lead: null, dens: 0, pad: true,
      song: [[4, 2], [4, 2], [5, 2], [4, 2], [2, 4], [0, 4], [1, 2], [2, 2], [4, 2], [5, 2], [4, 8], [7, 2], [6, 2], [4, 2], [2, 2], [4, 4], [5, 4], [4, 4], [2, 4], [1, 4], [0, 4],
        [0, 2], [2, 2], [4, 2], [7, 2], [9, 4], [7, 4], [8, 2], [7, 2], [5, 2], [4, 2], [5, 8], [4, 2], [5, 2], [7, 2], [9, 2], [11, 4], [9, 4], [7, 4], [4, 2], [2, 2], [0, 8]] },
    void:   { bpm: 96, root: 52, mode: WHOLE, prog: [0, 1, 2, 3], drums: 'none', bass: null, arp: 'tri', lead: null, dens: 0, pad: true, fall: true },
    bottom: { bpm: 120, root: 53, mode: ION, prog: [0, 4, 5, 3], drums: 'four', bass: 'x.x.x.x.x.x.x.x.', arp: 'square', lead: 'saw', dens: .45, oct: true },
    road:   { bpm: 126, root: 55, mode: MIX, prog: [0, 6, 3, 0], drums: 'run', bass: 'x..xx..xx..xx..x', arp: 'tri', lead: 'square', dens: .4 },
    plain:  { bpm: 104, root: 48, mode: LYD, prog: [0, 1, 4, 0], drums: 'half', bass: 'x.......x...x...', arp: 'tri', lead: 'saw', dens: .3, pad: true },
    stair:  { bpm: 112, root: 50, mode: WHOLE, prog: [0, 1, 2, 3], drums: 'bounce', bass: 'x...x...x...x...', arp: 'square', lead: 'square', dens: .3, rise: true },
    nest:   { bpm: 90, root: 57, mode: PEN, prog: [0, 3, 2, 1], drums: 'soft', bass: 'x.......x.......', arp: 'box', lead: null, dens: 0, pad: true },
    hall:   { bpm: 118, root: 49, mode: DOR, prog: [0, 3, 6, 4], drums: 'bounce', bass: 'x..x..x...x..x..', arp: 'square', lead: 'saw', dens: .35 },
    hall_torn: { bpm: 140, root: 49, mode: DOR, prog: [0, 1, 0, 6], drums: 'run', bass: 'xxxxxxxxxxxxxxxx', arp: 'square', lead: 'saw', dens: .6 },
    ponds:  { bpm: 98, root: 55, mode: LYD, prog: [0, 4, 1, 5], drums: 'soft', bass: 'x.....x...x.....', arp: 'box', lead: 'tri', dens: .3 },
    market: { bpm: 128, root: 52, mode: AEO, prog: [0, 0, 5, 4], drums: 'run', bass: 'x.xx.x.xx.x.xx.x', arp: 'square', lead: 'reed', dens: .55 },
    enge:   { bpm: 124, root: 52, mode: MIX, prog: [0, 3, 0, 4], drums: 'bounce', bass: 'x..x..x.x..x..x.', arp: 'square', lead: 'reed', dens: .45, oct: true },
    himmel: { bpm: 100, root: 57, mode: LYD, prog: [0, 1, 3, 4], drums: 'half', bass: 'x.......x.......', arp: 'box', lead: 'tri', dens: .35, pad: true },
    doere:  { bpm: 112, root: 50, mode: DOR, prog: [0, 6, 5, 6], drums: 'four', bass: 'x...x.x.x...x.x.', arp: 'tri', lead: 'square', dens: .3 },
    forgaars: { bpm: 96, root: 53, mode: WHOLE, prog: [3, 2, 1, 0], drums: 'half', bass: 'x.......x.......', arp: 'square', lead: 'saw', dens: .3, fall: true },
    map:    { bpm: 108, root: 55, mode: ION, prog: [0, 4, 3, 4], drums: 'soft', bass: 'x...x.x.x...x.x.', arp: 'tri', lead: null, dens: 0 },
  };
  function deg(T, d, oct = 0) { const n = T.mode.length, o = Math.floor(d / n), i = ((d % n) + n) % n; return T.root + T.mode[i] + 12 * (o + oct); }
  const kick = (o, t, v = .55) => tone(o, 140, t, .26, 'sine', v, { to: 42, toT: .12 });
  const clap = (o, t, v = .3) => { hit(o, t, 1300, .14, v, .9); hit(o, t + .012, 1700, .1, v * .7, 1.2); };
  const hat = (o, t, v = .08) => hit(o, t, 8500, .035, v, .8, 'highpass');
  const LEAD = {
    saw: (o, f, t, d) => { tone(o, f, t, d, 'sawtooth', .045, { lp: 2600, wob: 1, vib: 5.5, a: .02 }); tone(o, f, t, d, 'sawtooth', .03, { det: 12, lp: 2200 }); },
    square: (o, f, t, d) => tone(o, f, t, d, 'square', .04, { lp: 2400, wob: 1, a: .01 }),
    tri: (o, f, t, d) => tone(o, f, t, d, 'triangle', .07, { wob: 1, a: .01 }),
    reed: (o, f, t, d) => tone(o, f, t, d, 'sawtooth', .05, { lp: 1600, q: 6, vib: 7, wob: 2 }),
  };
  const ARP = {
    square: (o, f, t, d) => tone(o, f, t, d, 'square', .035, { lp: 3000, lpTo: 800 }),
    tri: (o, f, t, d) => tone(o, f, t, d, 'triangle', .06),
    box: (o, f, t, d) => { tone(o, f * 2, t, .9, 'sine', .05); tone(o, f * 5.4, t, .3, 'sine', .01); },
  };
  // at night outdoors the same tune goes half-speed and dreamy
  const nightCache = {};
  function themeFor(name, ph) { const T = THEMES[name] || THEMES.map; if (ph < 3 || INDOOR.includes(name) || name === 'title') return T; return nightCache[name] = nightCache[name] || Object.assign({}, T, { drums: 'half', dens: T.dens * .5, bass: 'x.......x.......' }); }
  function startTheme(name, ph) {
    const T = themeFor(name, ph);
    if (theme === T) return; theme = T;
    if (timer) clearInterval(timer);
    const out = ctx.createGain(); out.gain.value = 0; out.connect(bus.music); out.gain.setTargetAtTime(1, ctx.currentTime, .4);
    const prev = startTheme.out; if (prev) { prev.gain.setTargetAtTime(0, ctx.currentTime, .25); setTimeout(() => { try { prev.disconnect(); } catch (e) { } }, 2000); }
    startTheme.out = out;
    const x = 60 / T.bpm / 4, DR = D[T.drums];
    let next = ctx.currentTime + .1, n = 0, mel = 4, si = 0, sleft = 0;
    timer = setInterval(() => {
      if (!ctx || ctx.state !== 'running') return;
      while (next < ctx.currentTime + .2) {
        const s = n % 16, bar = Math.floor(n / 16), ch = T.prog[bar % T.prog.length] + (T.rise ? Math.floor(bar / 4) % 3 : 0);
        const swing = s % 2 ? x * .12 : 0, t = next + swing;
        if (DR.k[s] === 'x') kick(out, t);
        if (DR.s[s] === 'x') clap(out, t); else if (DR.s[s] === 'o') clap(out, t, .12);
        if (DR.h[s] === 'x') hat(out, t, s % 4 === 2 ? .1 : .05);
        if (T.bass && T.bass[s] === 'x') tone(out, mtof(deg(T, ch, -2) + (T.oct && s % 4 === 2 ? 12 : 0)), t, x * 1.6, 'sawtooth', .13, { lp: 500, lpTo: 140, q: 4 });
        if (T.arp && s % 2 === 0) ARP[T.arp](out, mtof(deg(T, ch + [0, 2, 4, 7, 4, 2, 0, 4][(s / 2) % 8], 1) + (T.fall ? 12 - (s % 8) : 0)), t, x * 1.8);
        if (T.pad && s === 0) [0, 2, 4].forEach(k => tone(out, mtof(deg(T, ch + k)), t, x * 15, 'sawtooth', .018, { lp: 900, a: x * 3, det: k * 4 }));
        if (T.song) { // the composed tune: a saw lead doubled an octave up by a square
          if (sleft <= 0) { const [d, len] = T.song[si % T.song.length]; si++; sleft = len; const f = mtof(deg(T, d, 1)); LEAD.saw(out, f, t, x * len * .92); tone(out, f * 2, t, x * len * .7, 'square', .015, { lp: 3000 }); }
          sleft--;
        }
        if (T.lead && bar % 4 !== 3 && Math.random() < T.dens * (s % 4 === 0 ? 1.4 : s % 2 ? .4 : .8)) {
          mel += pick([-2, -1, 1, 1, 2, 3, -3]); if (s === 0) mel = [ch, ch + 2, ch + 4][Math.floor(Math.random() * 3)];
          mel = Math.max(0, Math.min(10, mel));
          LEAD[T.lead](out, mtof(deg(T, mel, 1)), t, x * (Math.random() < .4 ? 3 : 1.6));
        }
        next += x; n++;
      }
    }, 25);
  }
  const pick = a => a[Math.floor(Math.random() * a.length)];

  /* ---------- public ---------- */
  function play(name, ph = 0) { init(); if (!ctx) return; playAmb(name, ph); startTheme(name, ph); }
  function steps(n = 4) { init(); if (!ctx) return; for (let i = 0; i < n; i++) { const t = ctx.currentTime + i * .2; tone(bus.sfx, 180 + (i % 2) * 60, t, .1, 'sine', .08, { to: 320 }); hit(bus.sfx, t, 2400, .03, .04, 3); } }
  function sting(kind) {
    init(); if (!ctx) return; const o = bus.sfx, t = ctx.currentTime;
    const up = (fs, gap, ty = 'square', v = .06, d = .18) => fs.forEach((f, i) => tone(o, f, t + i * gap, d, ty, v, { lp: 4000 }));
    if (kind === 'win') { up([523, 659, 784, 1047], .06); hit(o, t + .24, 6000, .15, .1, .8, 'highpass'); }
    if (kind === 'lose') { tone(o, 330, t, .5, 'sawtooth', .06, { to: 110, lp: 1600, vib: 8 }); }
    if (kind === 'dice') for (let i = 0; i < 7; i++) { tone(o, 300 + Math.random() * 900, t + i * .05, .05, 'square', .04, { lp: 2500 }); hit(o, t + i * .05, 3000, .03, .06, 4); }
    if (kind === 'glimpse') { up([784, 988, 1175, 1568, 1976], .07, 'triangle', .07, .5); }
    if (kind === 'level') { up([392, 523, 659, 784, 1047], .05, 'square', .05, .25); boing(o, t + .3, 260, .06); }
    if (kind === 'page') hit(o, t, 2200, .12, .1, 1.5);
    if (kind === 'tile') { tone(o, 700 + Math.random() * 300, t, .06, 'square', .05, { to: 1400, lp: 3000 }); }
    if (kind === 'coin') { tone(o, 1976, t, .1, 'square', .05, { lp: 5000 }); tone(o, 2637, t + .07, .25, 'square', .05, { lp: 5000 }); }
    if (kind === 'tick') hit(o, t, 4000, .03, .06, 6);
    if (kind === 'night') { up([784, 659, 523, 392], .1, 'triangle', .07, .5); }
    if (kind === 'dawn') { up([392, 523, 659, 784, 1047], .08, 'triangle', .07, .5); boing(o, t + .45, 300, .05); }
    if (kind === 'bell') { up([523, 784, 523, 784], .12, 'square', .04, .2); }
    if (kind === 'imprint') { kick(o, t, .25); tone(o, 1046, t, .2, 'square', .04, { lp: 3000 }); hit(o, t, 1800, .08, .1, 2); } // a stamp
    if (kind === 'glance') { tone(o, 880, t, .3, 'sine', .07, { to: 1320, toT: .15, vib: 14 }); }
    if (kind === 'gaze') { kick(o, t, .5); up([294, 370, 440, 587, 740, 880], .14, 'sawtooth', .04, .8); hit(o, t + .9, 7000, .6, .1, .6, 'highpass'); }
    if (kind === 'melt') { tone(o, 880, t, 1.6, 'square', .05, { to: 55, lp: 2000, vib: 9 }); tone(o, 440, t + .1, 1.4, 'sawtooth', .04, { to: 40, lp: 1200 }); }
    if (kind === 'glyph') for (let i = 0; i < 12; i++) tone(o, 300 + Math.random() * 2600, t + i * .035, .04, 'square', .04, { to: 200 + Math.random() * 2600 });
    if (kind === 'soft') { tone(o, 392, t, .4, 'sine', .1, { to: 330 }); }
    if (kind === 'hard') { hit(o, t, 3500, .04, .2, 6); tone(o, 1318, t, .12, 'square', .05, { lp: 4000 }); }
  }
  function resume() { init(); if (ctx && ctx.state === 'suspended') ctx.resume(); }
  function set(k, v) { SETTINGS[k] = v; SETTINGS.save(); applyVolumes(); }
  return { play, steps, sting, resume, set, applyVolumes };
})();
