/* =========================================================================
   HERTIL — engine (built on the Det var ikke noget engine: contracts, skills by use,
   Danish-driven dice, vocabulary games), plus what this world adds:
   · attention instead of standing: it decides where the creatures' eyes go
   · imprints (aftryk): the Danish you catch sticks to you and fades unless used
   · ephemeral places: some things happen once and are gone when you leave
   · dice that melt (only your sentence decides) or whose numbers go strange (words only)
   ========================================================================= */
window.__dev = {};
const KEY = 'hertil_save', META_KEY = 'hertil_meta';
const $ = s => document.querySelector(s);
const FAST = /[?&]fast/.test(location.search);
const sleep = ms => new Promise(r => setTimeout(r, FAST ? 0 : ms));
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[Math.floor(Math.random() * a.length)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const NAMES = ['Hertil', 'Tælleren', 'Samleren', 'Grundvæversken', 'Ikket', 'Bagvendte', 'Husfolket', 'Spejlet', 'Sluget', 'Mølen', 'Ungen', 'Bunden', 'Trappen', 'Reden', 'Vævehallen', 'Støvsletten', 'Dammene', 'Markedet', 'I'];
const PHASES = ['Gult lys', 'Lyserødt lys', 'Blåt lys', 'Lilla nat'];
const MOD_CAP = 7; // skill + all bonuses never exceed +7: a natural roll always matters
const S = () => SESSIONS[(G && G.sess) || 'k1l1'];
const special = k => (S().special && S().special[k]) || SPECIAL[k]; // a lesson can add or override specials
const GLYPH = 'ᛟᚠᚢᚦᚨᚱᚲᚷᚹᚺ'; // what digits turn into when the numbers go strange
const glyph = n => String(n).replace(/\d/g, d => GLYPH[d]);

/* ---------------- Danish voice (on by default) ---------------- */
const TTS = {
  ok: 'speechSynthesis' in window, voice: null,
  get on() { return SETTINGS.voiceOn; },
  init() { if (!this.ok) return; const p = () => { this.voice = speechSynthesis.getVoices().find(v => /^da/i.test(v.lang)) || null; }; p(); speechSynthesis.onvoiceschanged = p; },
  // you: the player's own line. The next line (usually the answer) waits for it instead of cutting it off.
  say(t, force, you) {
    if (!this.ok || FAST || (!SETTINGS.voiceOn && !force)) return;
    try {
      const keep = !force && this.you && speechSynthesis.speaking;
      if (!keep) speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(t.replace(/[“”…]/g, '')); u.lang = 'da-DK'; if (this.voice) u.voice = this.voice; u.rate = SETTINGS.rate || .9; u.pitch = SETTINGS.pitch || .85; u.volume = Math.max(.05, SETTINGS.voice);
      this.you = !!you; if (you) { this.youDone = new Promise(r => { u.onend = u.onerror = r; setTimeout(r, 900 + t.length * 90); }); }
      speechSynthesis.speak(u);
    } catch (e) { }
  },
  waitYou() { return this.ok && !FAST && SETTINGS.voiceOn && this.you && this.youDone ? Promise.race([this.youDone, sleep(3500)]) : sleep(400); },
};

/* ---------------- state ---------------- */
let G = null;
let META = (() => { try { return Object.assign({ vocab: {}, words: {}, runs: 0 }, JSON.parse(localStorage.getItem(META_KEY) || '{}')); } catch (e) { return { vocab: {}, words: {}, runs: 0 }; } })();
const saveMeta = () => { try { localStorage.setItem(META_KEY, JSON.stringify(META)); } catch (e) { } };
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(G)); } catch (e) { } };
function newGame(sess = 'k1l1', from = null) {
  G = { sess, day: 1, phase: 0, sk: 5, resp: 0, insp: 1, glyph: 0, statXP: { SPROG: 0, LOEGN: 0, SNIGE: 0, HANDEL: 0, INDSIGT: 0 }, flags: {}, prev: {}, origin: {}, glimpses: [], boons: [], quests: [], used: {}, met: [],
    node: null, loc: SESSIONS[sess].home || 'rede', travelDone: [], today: [], log: { built: 0, perfect: 0, rolls: 0, wins: 0, eng: 0, words: 0, melted: 0 }, bg: null };
  const st = SESSIONS[sess].startState;
  if (from) {
    ['statXP', 'resp', 'sk', 'boons', 'origin', 'day', 'met'].forEach(k => G[k] = JSON.parse(JSON.stringify(from[k] || G[k])));
    G.insp = Math.max(1, from.insp); G.prev = Object.assign({}, from.prev, from.carried || {}); G.prevGlimpses = (from.prevGlimpses || 0) + (from.glimpses || []).length;
  } else if (st) Object.assign(G, JSON.parse(JSON.stringify(st)));
}
function carryOut() {
  const c = JSON.parse(JSON.stringify(G)); c.carried = {};
  (S().carryFlags || []).forEach(f => { if (G.flags[f]) c.carried[f] = true; });
  return c;
}
const tierName = (g = G) => { let t = TIERS[0][1]; for (const [m, n] of TIERS) if (g.resp >= m) t = n; return t; };
const lvl = st => STAT_STEPS.filter(t => G.statXP[st] >= t).length;
const hasBoon = b => G && G.boons.includes(b);
// where a creature's eyes go: away (0), sideways glance (1), head turned (2), looking at you (3)
function gazeOf(id) {
  if (!id) return 0;
  if (id === 'bagvendt') return G.flags.Clook ? 3 : 0; // it has never turned around
  if (G.lookAt === id) return 3;
  return Math.min(2, gazeFor(G.resp) + (hasBoon('blik') ? 1 : 0));
}
function statGain(st, n) {
  if (!st || !n) return;
  const before = lvl(st); G.statXP[st] += n;
  if (lvl(st) > before) { toast(`${STATS[st].name} ↑ ${lvl(st)}`, 'gold'); AUDIO.sting('level'); }
}
function addWord(key) {
  if (!VOCAB[key]) return;
  if (!G.today.includes(key)) G.today.push(key);
  const v = META.vocab[key] = META.vocab[key] || { box: 0, seen: 0 }; v.seen++; v.last = Date.now();
  if (v.seen === 1) { G.log.words++; toast(`Aftryk: ${VOCAB[key].da}`, 'mark'); AUDIO.sting('imprint'); }
  saveMeta();
}
const marksCount = () => Object.values(META.vocab).filter(v => v.box >= 1).length;
function fx(f) {
  if (!f) return;
  if (f.sk) { const n = f.sk; G.sk = Math.max(0, G.sk + n); toast(`${n > 0 ? '+' : ''}${n} skæl`, n > 0 ? 'gold' : 'bad'); if (n > 0) AUDIO.sting('coin'); }
  if (f.resp) { const g0 = G.npc ? gazeOf(G.npc) : 0; G.resp += f.resp; toast(`${f.resp > 0 ? '+' : ''}${f.resp} vægt`, f.resp > 0 ? 'good' : 'bad'); refreshGaze(g0); }
  if (f.insp) { G.insp = Math.max(0, G.insp + f.insp); toast(`${f.insp > 0 ? '+' : ''}${f.insp} gnist ✦`, 'gold'); }
  if (f.flag) G.flags[f.flag] = true;
  if (f.origin) Object.assign(G.origin, f.origin);
  if (f.boon && !hasBoon(f.boon)) { G.boons.push(f.boon); toast(`${BOONS[f.boon].name}: ${BOONS[f.boon].fx}`, 'gold'); AUDIO.sting('level'); }
  if (f.quest) { const nu = [].concat(f.quest).filter(q => !G.quests.includes(q)); nu.forEach(q => G.quests.push(q)); if (nu.length) toast(`${nu.length > 1 ? 'Nye kontrakter' : 'Ny kontrakt'}: ${nu.map(q => S().quests[q].title).join(' · ')}`, 'gold'); }
  hud();
}
// attention changed while someone is on stage: their eyes may move
function refreshGaze(before) {
  if (!G.npc || !$('#npc')) return;
  const now = gazeOf(G.npc);
  if (now === before) return;
  setNpc(G.npc, 'shift');
  if (now > before) AUDIO.sting('glance');
}

/* ---------------- chrome ---------------- */
function hud() {
  const h = $('#hud');
  if (!G) { h.innerHTML = ''; return; }
  h.innerHTML = `<div class="h-l"><b>${esc(tierName())}</b><small>Dag ${G.day} · ${PHASES[G.phase]}</small></div>
    <div class="h-r"><span>${G.sk} skæl</span><span class="insp">✦ ${G.insp}</span><button class="ib" id="bJ" aria-label="Dagbog">☰</button></div>`;
  $('#bJ').onclick = journal;
}
function toast(m, c = '') { const t = document.createElement('div'); t.className = 'toast ' + c; t.textContent = m; $('#toasts').appendChild(t); setTimeout(() => t.classList.add('out'), FAST ? 30 : 2600); setTimeout(() => t.remove(), FAST ? 60 : 3200); }

function daHTML(s) { return esc(s).replace(/([A-Za-zÆØÅæøåáéüöÉÁ]+)/g, w => `<span class="w" data-w="${w.toLowerCase()}">${w}</span>`); }
function wireWords(el, longpress) {
  el.querySelectorAll('.w').forEach(sp => {
    if (!longpress) { sp.onclick = e => { e.stopPropagation(); showGloss(sp); }; return; }
    let t = null, fired = false;
    sp.addEventListener('pointerdown', () => { fired = false; t = setTimeout(() => { fired = true; showGloss(sp); }, 420); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => sp.addEventListener(ev, () => clearTimeout(t)));
    sp.addEventListener('click', e => { if (fired) { e.stopPropagation(); e.preventDefault(); fired = false; } });
    sp.addEventListener('contextmenu', e => e.preventDefault());
  });
}
function showGloss(sp) {
  document.querySelectorAll('.gloss').forEach(g => g.remove());
  const w = sp.dataset.w, en = DICT[w] || (NAMES.includes(sp.textContent) ? '(a name)' : '—');
  META.words[w] = (META.words[w] || 0) + 1; saveMeta();
  const g = document.createElement('div'); g.className = 'gloss'; g.innerHTML = `<b>${esc(sp.textContent)}</b> ${esc(en)}`;
  document.body.appendChild(g);
  const r = sp.getBoundingClientRect();
  g.style.left = Math.max(8, Math.min(innerWidth - g.offsetWidth - 8, r.left + r.width / 2 - g.offsetWidth / 2)) + 'px';
  g.style.top = Math.max(8, r.top - g.offsetHeight - 6) + 'px';
  sp.classList.add('seen');
  TTS.say(sp.textContent);
  setTimeout(() => g.remove(), 2600);
}
document.addEventListener('click', () => { document.querySelectorAll('.gloss').forEach(g => g.remove()); AUDIO.resume(); });

/* ---------------- transitions ---------------- */
async function card(title, sub, steps = true) {
  if (FAST) return;
  if (!SETTINGS.motion) { if (steps) AUDIO.steps(2); return; }
  const ov = document.createElement('div'); ov.className = 'tcard';
  ov.innerHTML = `<div class="tc-fog"></div><div class="tc-in">${phaseDial || ''}<div class="tc-t">${esc(title)}</div>${sub ? `<div class="tc-s">${esc(sub)}</div>` : ''}</div>`;
  document.body.appendChild(ov);
  if (steps) AUDIO.steps(4);
  await sleep(phaseDial ? 1900 : 1500);
  holdOverlay(ov);
}
let heldOv = null, heldT = null;
function holdOverlay(ov) { releaseOverlay(); heldOv = ov; heldT = setTimeout(releaseOverlay, 2500); }
function releaseOverlay() {
  clearTimeout(heldT); const ov = heldOv; heldOv = null; if (!ov) return;
  requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(() => { ov.classList.add('out'); setTimeout(() => ov.remove(), 1000); }, 250)));
}
/* the light of Hertil changes colour instead of a sun crossing the sky: a small dial on the arrival card */
let phaseDial = '';
const LIGHT = ['#ffe800', '#ff48b0', '#0078bf', '#765ba7'];
function dialHTML(from, to) {
  return `<div class="dial"><svg viewBox="0 0 100 24">${PHASES.map((p, i) => `<circle cx="${14 + i * 24}" cy="12" r="${i === to ? 7 : 4}" fill="${LIGHT[i]}" stroke="#1d1a5e" stroke-width="${i === to ? 1.4 : .6}" class="${i === to ? 'd-now' : ''}"/>`).join('')}</svg>
    <div class="d-lab"><s>${PHASES[from]}</s> → <b>${PHASES[to]}</b></div></div>`;
}

/* time passing: the light changes, dims, returns, or several days go by */
const SKY = { night: ['#ff48b0', '#0078bf', '#765ba7', '#3a1a6a'], dusk: ['#ffe800', '#ff48b0', '#0078bf'], dawn: ['#3a1a6a', '#ff48b0', '#ffe800'], days: ['#ffe800', '#ff48b0', '#0078bf', '#00a95c', '#ffe800'] };
async function passTime(kind, title, sub) {
  if (FAST) return;
  AUDIO.sting(kind === 'dawn' ? 'dawn' : kind === 'days' ? 'bell' : 'night');
  if (!SETTINGS.motion) { if (title) toast(title + (sub ? ' · ' + sub : ''), 'gold'); return; }
  const dur = { night: 3600, dusk: 2600, dawn: 2600, days: 3800 }[kind] || 3000;
  const ov = document.createElement('div'); ov.className = `tpass k-${kind}`; ov.style.setProperty('--dur', dur + 'ms');
  const motes = Array.from({ length: 36 }, () => `<i style="left:${Math.random() * 100}%;top:${20 + Math.random() * 70}%;animation-delay:${Math.random() * 3}s;animation-duration:${4 + Math.random() * 5}s"></i>`).join('');
  const towers = 'M0 100 V82 L8 82 L10 60 L12 82 L22 82 L24 50 Q26 44 28 50 L30 82 L44 82 L46 70 L48 82 L60 82 L62 40 Q64 32 66 40 L68 82 L80 82 L82 64 L84 82 L100 82 V100 Z';
  ov.innerHTML = `<div class="tp-sky"></div><div class="tp-glow"></div><div class="tp-stars">${motes}</div>
    <svg class="tp-town" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="${towers}"/></svg><div class="tp-fog"></div>
    <div class="tp-in">${title ? `<div class="tc-t">${esc(title)}</div>` : ''}${sub ? `<div class="tc-s">${esc(sub)}</div>` : ''}</div>`;
  ov.querySelector('.tp-sky').style.background = SKY[kind][0];
  ov.querySelector('.tp-sky').animate(SKY[kind].map(c => ({ background: c })), { duration: dur, fill: 'forwards', easing: 'ease-in-out' });
  ov.querySelector('.tp-glow').animate([{ opacity: kind === 'dawn' ? 0 : .8 }, { opacity: kind === 'dawn' ? .8 : kind === 'days' ? .8 : 0 }], { duration: dur, fill: 'forwards' });
  document.body.appendChild(ov);
  await sleep(dur + 1100);
  holdOverlay(ov);
}
const passArgs = (p, from) => typeof p === 'function' ? p(G, from) : p;

/* ---------------- stage ---------------- */
function npcHTML(id, mode = '') {
  const npc = NPCS[id];
  return `<div class="npc ${npc.small ? 'small' : ''} ${npc.big ? 'big' : ''} ${mode}" id="npc">${ART.creature(npc.art, gazeOf(id))}</div>`;
}
function meet(id) { if (id && !G.met.includes(id)) G.met.push(id); }
function stage(bg, npcId, title) {
  G.bg = bg;
  $('#app').innerHTML = `
    <div class="stage" id="stage">${ART.scene(bg, G ? G.phase : 3)}<div class="dustA"></div><div class="dustB"></div>
      ${npcId ? npcHTML(npcId) : ''}
      <div class="loc">${esc(title || '')}</div></div>
    <div class="panel"><div class="log" id="log"></div><div class="opts" id="opts"></div></div>`;
  meet(npcId);
  AUDIO.play(bg, G ? G.phase : 3);
  hud(); releaseOverlay();
}
function setBg(bg) {
  const st = $('#stage'); if (!st) return;
  const old = st.querySelector('.scene-svg');
  const tmp = document.createElement('div'); tmp.innerHTML = ART.scene(bg, G.phase);
  const nu = tmp.firstChild; nu.classList.add('fadein');
  old.replaceWith(nu); G.bg = bg; AUDIO.play(bg, G.phase);
}
function setNpc(npcId, mode = 'fadein') {
  const st = $('#stage'); if (!st) return;
  const old = $('#npc'); if (old) old.remove();
  G.npc = npcId;
  if (!npcId) return;
  meet(npcId);
  const tmp = document.createElement('div'); tmp.innerHTML = npcHTML(npcId, mode);
  st.insertBefore(tmp.firstChild, st.querySelector('.loc'));
}
function logAdd(html, cls = '') {
  const d = document.createElement('div'); d.className = 'e ' + cls; d.innerHTML = html;
  $('#log').appendChild(d); wireWords(d);
  requestAnimationFrame(() => d.classList.add('in'));
  const L = $('#log'); setTimeout(() => L.scrollTop = L.scrollHeight, 30);
  return d;
}
function tapOn() {
  return new Promise(res => {
    const o = $('#opts'); o.innerHTML = `<button class="cont" id="cont">▸</button>`;
    $('#cont').onclick = () => { o.innerHTML = ''; res(); };
  });
}
function choices(list) {
  return new Promise(res => {
    const o = $('#opts');
    o.innerHTML = list.map((c, i) => `<button class="opt ${c.cls || ''}" data-i="${i}" ${c.dis ? 'disabled' : ''}><span class="n">${i + 1}.</span><span class="t">${c.html}</span></button>`).join('');
    o.querySelectorAll('.opt').forEach(b => b.onclick = () => { o.innerHTML = ''; res(+b.dataset.i); });
    wireWords(o, true);
    if (G && !G.flags.lpHint && o.querySelector('.w')) { G.flags.lpHint = true; toast('Press and hold a Danish word to see what it means', 'gold'); }
  });
}
function sayEntry(st) {
  const npc = NPCS[st.say];
  if (!st.da) return logAdd(`<div class="who">${esc(npc.name)} <i>in English</i></div><div class="en-line">“${esc(st.en)}”</div>`, 'say eng');
  const el = logAdd(`<div class="who">${esc(npc.name)}</div><div class="da">“${daHTML(st.da)}”</div>
    <div class="tools"><button class="tb speak">♪ igen</button><button class="tb english">På engelsk? <small>−1 vægt</small></button></div><div class="en hidden">“${esc(st.en)}”</div>`, 'say');
  el.querySelector('.speak').onclick = e => { e.stopPropagation(); TTS.say(st.da, true); };
  el.querySelector('.english').onclick = e => {
    e.stopPropagation(); e.target.closest('.english').remove();
    el.querySelector('.en').classList.remove('hidden');
    const g0 = G.npc ? gazeOf(G.npc) : 0; G.resp -= 1; G.log.eng++; toast('−1 vægt', 'bad'); refreshGaze(g0); hud();
  };
  TTS.say(st.da);
  const np = $('#npc'); if (np) { np.classList.remove('talk'); void np.offsetWidth; np.classList.add('talk'); }
  return el;
}
async function steps(list) {
  for (const st of list || []) {
    const tx = v => typeof v === 'function' ? v(G) : v;
    if (st.n) { logAdd(`<p>${esc(tx(st.n))}</p>`, 'narr'); await tapOn(); }
    else if (st.th) { logAdd(`<p>${esc(tx(st.th))}</p>`, 'thought'); await tapOn(); }
    else if (st.say) { sayEntry(st); await tapOn(); }
    else if (st.fx) fx(st.fx);
    else if (st.glimpse) await glimpse(st.glimpse);
    else if (st.letter) await letter(st.letter);
    else if (st.special) { const [k, arg] = st.special.split(':'); await special(k)(arg); }
    else if (st.bg) setBg(st.bg);
    else if (st.npc !== undefined) setNpc(st.npc);
  }
}
// a trace (spor) of what you were. Never precise.
async function glimpse(id) {
  const g = S().glimpses[id];
  if (!G.glimpses.includes(id)) { G.glimpses.push(id); fx({ insp: 1 }); }
  if (S().cluesFlag && G.glimpses.length >= (S().cluesNeed || 3)) G.flags[S().cluesFlag] = true;
  AUDIO.sting('glimpse');
  const st = $('#stage'); if (st) { st.classList.add('glow'); setTimeout(() => st.classList.remove('glow'), 2500); }
  logAdd(`<div class="gl"><span>Spor</span><b>${esc(g.name)}</b><i>${esc(g.en)}</i><p>${esc(g.text)}</p></div>`, 'glimpse');
  await tapOn();
}
async function letter(id) {
  const L = S().letters[id];
  AUDIO.sting('page');
  logAdd(`<div class="letter"><div class="lt">${esc(L.title)}</div>${L.lines.map(l => `<p>${daHTML(l)}</p>`).join('')}</div>`, 'paper');
  logAdd(`<p>Tap any word you don't know. It costs nothing.</p>`, 'thought');
  for (const q of L.qs) {
    logAdd(`<p class="q">${esc(q.q)}</p>`, 'thought');
    const order = shuffle(q.opts.map((_, i) => i));
    const i = await choices(order.map(k => ({ html: esc(q.opts[k]) })));
    const ok = order[i] === q.a;
    if (ok) { statGain('INDSIGT', 1); if (q.flag) G.flags[q.flag] = true; }
    logAdd(`<div class="res ${ok ? 'ok' : 'no'}">${ok ? 'Ja.' : 'Nej: ' + esc(q.opts[q.a]) + '.'}</div>`);
  }
}

/* ---------------- sentence builder ---------------- */
let spejlUsed = false;
function builder(b) {
  return new Promise(resolve => {
    __dev.cur = b;
    const norm = w => w.toLowerCase().replace(/[.,?!]/g, '');
    const low = a => a.map(norm).join(' ');
    const all = [...b.answers, ...(b.best || [])].map(low);
    let src = b.tiles || [...b.answers[0], ...(b.extra || [])];
    if (hasBoon('ikket')) src = [...src, 'ikke']; // Ikket slips an extra ikke into your sentences
    const tiles = shuffle(src.map((t, i) => ({ t: /^[A-ZÆØÅ]/.test(t) && !NAMES.includes(t.replace(/[.,?!]/g, '')) ? t.toLowerCase() : t, i })));
    let line = [], mistakes = 0, first = true;
    const ov = document.createElement('div'); ov.className = 'sheet-ov'; document.body.appendChild(ov);
    const render = (msg, bad) => {
      ov.innerHTML = `<div class="sheet ${first ? 'enter' : ''}">
        <div class="intent"><small>Sig det på dansk</small>${esc(b.en)}</div>
        <div class="line ${bad ? 'shake' : ''}">${line.map((x, k) => `<button class="tile in ${bad && k === bad.at ? 'wrong' : ''}" data-k="${k}">${esc(x.t)}</button>`).join('') || '<span class="ph">tap the words in order</span>'}</div>
        ${msg ? `<div class="msg">${msg}</div>` : ''}
        <div class="pool">${tiles.map(x => `<button class="tile" data-i="${x.i}" ${line.includes(x) ? 'disabled' : ''}>${esc(x.t)}</button>`).join('')}</div>
        <div class="brow"><button class="btn ghost" id="bClr">Ryd</button>${mistakes >= 2 ? '<button class="btn ghost" id="bShow">Vis svaret</button>' : ''}<button class="btn gold" id="bOk" ${line.length ? '' : 'disabled'}>Sig det</button></div></div>`;
      first = false;
      ov.querySelectorAll('.pool .tile').forEach(t => t.onclick = () => { line.push(tiles.find(x => x.i === +t.dataset.i)); AUDIO.sting('tile'); render(); });
      ov.querySelectorAll('.line .tile').forEach(t => t.onclick = () => { line.splice(+t.dataset.k, 1); render(); });
      $('#bClr').onclick = () => { line = []; render(); };
      const sh = $('#bShow'); if (sh) sh.onclick = () => finish(b.answers[0], 'shown');
      $('#bOk').onclick = check;
    };
    const finish = (words, how) => {
      ov.remove();
      let sentence = words.join(' '); sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
      TTS.say(sentence, false, true);
      resolve({ sentence, mistakes, how, best: (b.best || []).some(a => low(a) === low(words)) });
    };
    const check = () => {
      const s = line.map(x => norm(x.t)).join(' ');
      if (all.includes(s)) return finish(line.map(x => x.t), mistakes === 0 ? 'perfect' : 'ok');
      if (hasBoon('spejl') && !spejlUsed) { spejlUsed = true; toast('Spejlets gunst: this one does not count', 'gold'); }
      else mistakes++;
      let at = 0, bestLen = -1;
      for (const a of [...b.answers, ...(b.best || [])]) { let k = 0; while (k < line.length && a[k] && norm(line[k].t) === norm(a[k])) k++; if (k > bestLen) { bestLen = k; at = k; } }
      AUDIO.sting('lose');
      render(mistakes <= 1 ? `Not quite. The first problem is word ${at + 1}.` : 'Still not right. Look at the highlighted word, or show the answer.', { at });
    };
    render();
  });
}

/* ---------------- d20: sometimes it melts, sometimes its numbers go strange ---------------- */
function roll(stat, dc, mods, mode, opt = {}) {
  return new Promise(resolve => {
    const ov = document.createElement('div'); ov.className = 'roll-ov'; document.body.appendChild(ov);
    const base = lvl(stat);
    const raw = base + mods.reduce((s, m) => s + m.v, 0);
    const total = Math.min(MOD_CAP, raw);
    dc = dc + (S().dcMod || 0);
    // the die melts: only what you bring decides. A sentence: perfect or not. An action: your skill against the difficulty, no luck.
    const melt = opt.die === 'melt' || (!hasBoon('vaev') && opt.die !== 'solid' && G.flags[S().travelAfter || 'x'] && G.log.rolls > 3 && Math.random() < .07);
    const strange = !melt && (opt.die === 'glyph' || (G.glyph > 0 && !hasBoon('urnoegle')));
    if (strange && G.glyph > 0) G.glyph--;
    const N = n => strange ? glyph(n) : n;
    const pOne = Math.min(.95, Math.max(.05, (21 - (dc - total)) / 20));
    const pAll = mode === 'adv' ? 1 - (1 - pOne) ** 2 : mode === 'dis' ? pOne ** 2 : pOne;
    let rerolled = false, ikketUsed = false;
    const modsHTML = () => `<div class="r-mods"><span>${esc(STATS[stat].name)} niv. ${N(base)} +${N(base)}</span>${mods.map(m => `<span class="${m.v < 0 ? 'neg' : ''}">${esc(m.t)} ${m.v >= 0 ? '+' : '−'}${N(Math.abs(m.v))}</span>`).join('')}${raw > total ? `<span class="neg">max +${N(MOD_CAP)}</span>` : ''}${melt ? '' : mode === 'adv' ? '<span class="adv">Fordel: perfect Danish, roll twice, keep the best</span>' : mode === 'dis' ? '<span class="neg">Ulempe: roll twice, keep the worst</span>' : ''}</div>`;
    if (melt) {
      G.log.melted++;
      const built = opt.built;
      const ok = built ? mode === 'adv' : total >= dc - 10;
      ov.innerHTML = `<div class="roll melt"><div class="r-k">${esc(STATS[stat].name)}</div><div class="r-en">Terningen smelter. The die melts.</div>
        <div class="r-die melting">${ART.d20('')}</div>
        <div class="r-note">${built ? 'No luck here. Only your sentence decides: perfect, or not.' : `No luck here. Only what you bring: +${total} against ${dc - 10}.`}</div>${modsHTML()}
        <div class="r-btns"></div></div>`;
      AUDIO.sting('melt');
      G.log.rolls++; if (ok) G.log.wins++;
      setTimeout(() => {
        ov.querySelector('.r-btns').insertAdjacentHTML('beforebegin', `<div class="r-res ${ok ? 'ok' : 'no'}">${ok ? 'SUCCES' : 'FIASKO'}<small>${built ? (ok ? 'perfect Danish' : 'not perfect') : (ok ? 'enough' : 'not enough')}</small></div>`);
        ov.querySelector('.r-btns').innerHTML = '<button class="btn gold" id="rOk">Fortsæt</button>';
        AUDIO.sting(ok ? 'win' : 'lose');
        $('#rOk').onclick = () => { ov.remove(); resolve(ok); };
      }, FAST ? 0 : 1700);
      return;
    }
    const draw = res => {
      const ok = res && (res.ok || ikketUsed);
      ov.innerHTML = `<div class="roll ${strange ? 'strange' : ''}">
        <div class="r-k">${esc(STATS[stat].name)}</div><div class="r-en">${strange ? 'Tallene er mærkelige. The numbers are strange: listen to the words.' : esc(STATS[stat].en)}</div>
        <div class="r-dc">Sværhed <b>${N(dc)}</b> <span class="r-ch">· chance ${strange ? '?' : Math.round(pAll * 100)}%</span></div>
        <div class="r-die ${res ? (ok ? 'win' : 'lose') : ''}">${ART.d20(res ? N(res.nat) : '?')}${res && res.r2 ? `<div class="r2">${N(res.r1)} / ${N(res.r2)}</div>` : ''}</div>
        ${modsHTML()}
        ${res ? `<div class="r-res ${ok ? 'ok' : 'no'}">${ikketUsed ? 'IKKE FIASKO' : res.nat === 20 ? 'KRITISK SUCCES' : res.nat === 1 ? 'KRITISK FIASKO' : res.ok ? 'SUCCES' : 'FIASKO'}<small>${strange ? `${daHTML(NUMS[res.nat])} plus ${daHTML(NUMS[total])} er ${daHTML(NUMS[res.nat + total])}. Sværhed: ${daHTML(NUMS[dc] || String(dc))}.` : `${res.nat} + ${total} = ${res.nat + total}`}</small></div>` : ''}
        <div class="r-btns">${!res ? '<button class="btn gold" id="rGo">Slå terningen</button>' : (!ok && hasBoon('ikket') && !G.flags.ikketDay ? '<button class="btn ghost" id="rIk">Ikket: ikke fiasko</button>' : '') + (!ok && G.insp > 0 && !rerolled ? '<button class="btn ghost" id="rRe">✦ Gnist: slå igen</button>' : '') + '<button class="btn gold" id="rOk">Fortsæt</button>'}</div></div>`;
      wireWords(ov);
      if (res && strange) TTS.say(`${NUMS[res.nat]} plus ${NUMS[total]} er ${NUMS[res.nat + total]}.`, true);
      const go = $('#rGo'); if (go) go.onclick = spin;
      const re = $('#rRe'); if (re) re.onclick = () => { G.insp--; rerolled = true; hud(); spin(); };
      const ik = $('#rIk'); if (ik) ik.onclick = () => { G.flags.ikketDay = true; ikketUsed = true; AUDIO.sting('glyph'); toast('Ikket eats the fiasko. Ikke fiasko.', 'gold'); draw(res); };
      const okb = $('#rOk'); if (okb) okb.onclick = () => { ov.remove(); resolve(ok); };
    };
    const spin = async () => {
      const r1 = 1 + Math.floor(Math.random() * 20), r2 = 1 + Math.floor(Math.random() * 20);
      ov.querySelector('.r-btns').innerHTML = '';
      const die = ov.querySelector('.r-die'); die.classList.add('rolling'); AUDIO.sting('dice');
      for (let k = 0; k < (FAST ? 1 : 12); k++) { die.querySelector('text').textContent = N(1 + Math.floor(Math.random() * 20)); await sleep(55 + k * 10); }
      const nat = mode === 'adv' ? Math.max(r1, r2) : mode === 'dis' ? Math.min(r1, r2) : r1;
      const ok = nat === 20 || (nat !== 1 && nat + total >= dc);
      G.log.rolls++; if (ok) G.log.wins++;
      AUDIO.sting(ok ? 'win' : 'lose');
      draw({ ok, nat, r1: mode ? r1 : null, r2: mode ? r2 : null });
    };
    draw(null);
  });
}
function modsFor(o) {
  const mods = [];
  if (o.stat === 'INDSIGT' && hasBoon('anker')) mods.push({ t: 'Ankeret', v: 1 });
  if (o.stat === 'SNIGE' && hasBoon('traad')) mods.push({ t: 'Tråden', v: 1 });
  if (o.stat === 'SPROG' && hasBoon('moenster')) mods.push({ t: 'Mønsteret', v: 1 });
  if (o.stat === 'LOEGN' && hasBoon('laant')) mods.push({ t: 'Lånt fortid', v: 2 });
  if (o.stat === 'INDSIGT' && hasBoon('ballon')) mods.push({ t: 'Lille Savn', v: 1 });
  if (o.stat === 'LOEGN' && hasBoon('knald')) mods.push({ t: 'Knaldet', v: 1 });
  if (o.stat === 'SPROG' && hasBoon('indeni')) mods.push({ t: 'Indefra', v: 1 });
  if (o.bonus) { const b = o.bonus(G); if (b) mods.push({ t: o.bonusWhy || 'Bonus', v: b }); }
  if ((o.kind === 'say' || o.kind === 'lie') && G.resp >= 5) mods.push({ t: 'Vægt', v: 1 });
  return mods;
}

/* ---------------- options ---------------- */
async function runOption(node, o, idx) {
  if (o.once) G.used[G.node + ':' + idx] = true;
  if (o.group) G.used[G.node + '#' + o.group] = true;
  G.usedCount = (G.usedCount || 0) + 1;
  if (o.kind === 'go') {
    if (o.fx) fx(o.fx);
    if (o.special) { const [k, a] = o.special.split(':'); await special(k)(a); }
    return o.next;
  }
  if (o.kind === 'eng') {
    const g0 = G.npc ? gazeOf(G.npc) : 0; G.resp -= 1; G.log.eng++; toast('−1 vægt', 'bad'); refreshGaze(g0); hud();
    logAdd(`<p class="you">${esc(o.label)}</p>`, 'you');
    await steps(o.ok); return o.next;
  }
  if (o.kind === 'reply') {
    logAdd(`<div class="you-da">“${daHTML(o.da)}”</div>`, 'you'); TTS.say(o.da, false, true);
    statGain(o.stat, 1); await TTS.waitYou();
    await steps(o.ok); return o.next;
  }
  if (o.special) { statGain(o.stat, 1); const [k, a] = o.special.split(':'); await special(k)(a); return o.next; }
  if (o.pre) await special(o.pre)();
  let mode = null; const mods = modsFor(o); let built = false;
  if ((o.kind === 'say' || o.kind === 'lie') && o.build) {
    const r = await builder(o.build);
    built = true; G.log.built++;
    logAdd(`<div class="you-da">“${daHTML(r.sentence)}”</div>`, 'you');
    if (r.how === 'perfect') { mode = 'adv'; G.log.perfect++; }
    else if (r.how === 'shown' || r.mistakes >= 2) mode = 'dis';
    if (r.best) mods.push({ t: 'Før-inversion', v: 1 });
    if (o.build.origin) { G.origin[o.build.origin] = r.sentence; if (o.build.origin === 'job') { const m = r.sentence.match(/som ([^\s.]+)/); if (m) G.origin.jobWord = m[1]; } }
  }
  statGain(o.stat, 1);
  let ok;
  if (o.autoFail) { toast(o.autoFail, 'bad'); ok = false; await sleep(500); }
  else ok = await roll(o.stat, o.dc, mods, mode, { die: o.die, built });
  if (ok) statGain(o.stat, 1);
  await steps(ok ? o.ok : o.fail);
  if (o.post) await steps(o.post);
  return ok ? o.next : (o.failNext || o.next);
}

async function goNode(id) {
  if (typeof id === 'function') id = id(G);
  if (id === 'map') return showMap();
  if (id === 'sleep') return goSleep();
  if (id === 'end') return endScreen();
  const node = S().nodes[id];
  const from = G.node; G.node = id; save();
  spejlUsed = false;
  const ps = node.pass && passArgs(node.pass, from);
  if (ps) await passTime(...ps);
  else if (node.card) await card(node.card[0], node.card[1]);
  if (node.dusk && G.phase < 2) G.phase = 2;
  if (node.night) G.phase = 3;
  const npcId = typeof node.npc === 'function' ? node.npc(G) : node.npc;
  stage(node.bg, npcId, node.title);
  G.npc = npcId;
  if (node.quest) fx({ quest: node.quest });
  const startCount = G.usedCount || 0;
  await steps(node.steps);
  while (true) {
    const avail = node.opts.map((o, i) => [o, i]).filter(([o, i]) => !(o.once && G.used[id + ':' + i]) && !(o.group && G.used[id + '#' + o.group]) && !(o.after && (G.usedCount || 0) - startCount < o.after) && !(o.req && !o.req(G)));
    const list = avail.map(([o]) => {
      const tag = o.stat ? `<span class="tag t-${o.kind}">[${STATS[o.stat].name.toUpperCase()}${o.dc ? ' ' + (G.glyph > 0 ? glyph(o.dc) : o.dc) : ''}]</span> ` : o.kind === 'eng' ? '<span class="tag t-eng">[ENGELSK]</span> ' : '';
      const text = o.kind === 'reply' ? `“${daHTML(o.da)}”` : esc(o.label);
      return { html: tag + text, cls: 'k-' + o.kind };
    });
    const i = await choices(list);
    const [o, oi] = avail[i];
    let next = await runOption(node, o, oi);
    if (typeof next === 'function') next = next(G);
    save();
    if (o.newDay) { G.day++; G.phase = 0; save(); }
    const ops = o.pass ? passArgs(o.pass, id) : o.newDay ? ['night', `Dag ${G.day}`, PHASES[0]] : null;
    if (ops) await passTime(...ops);
    if (next) return goNode(next);
    if (!node.hub) return showMap();
  }
}

/* ---------------- map & travel ---------------- */
function nodeHasWork(id) {
  const n = S().nodes[id]; if (!n) return false;
  if (n.idle || id.endsWith('_idle')) return false;
  if (!n.hub) return true;
  return n.opts.some((o, i) => {
    if (o.req && !o.req(G)) return false;
    if (o.once && G.used[id + ':' + i]) return false;
    if (o.group && G.used[id + '#' + o.group]) return false;
    if (o.mark) return true;
    if (o.kind === 'go') return !!o.special || (typeof o.next === 'function') || (o.next && !['map', 'sleep', id].includes(o.next));
    return !!(o.stat || o.special || (o.next && o.next !== 'map' && o.next !== id));
  });
}
function locMarked(k) {
  const l = S().locations[k];
  if (nodeHasWork(l.entry(G))) return openAt(k, l) ? 'now' : '';
  if (G.phase < 3 && l.night) { const ph = G.phase; G.phase = 3; const w = nodeHasWork(l.entry(G)); G.phase = ph; if (w) return 'later'; }
  return '';
}
const openAt = (k, l) => G.phase < 3 || l.night;
const HUB = { x: 50, y: 50 }; // Bunden: every path in Hertil passes through where things land
const PIN_ICON = { nest: 'aeg', bottom: 'fjer', stair: 'trappe', hall: 'traad', plain: 'gren', ponds: 'spejl', market: 'skael' };
function roadPath(a, b) {
  const d = Math.hypot(a.x - b.x, a.y - b.y);
  const via = (Math.hypot(a.x - HUB.x, a.y - HUB.y) < 4 || Math.hypot(b.x - HUB.x, b.y - HUB.y) < 4 || d < 16) ? { x: (a.x + b.x) / 2 + (b.y - a.y) * .22, y: (a.y + b.y) / 2 - (b.x - a.x) * .22 } : { x: (HUB.x * 2 + a.x + b.x) / 4, y: (HUB.y * 2 + a.y + b.y) / 4 };
  return `M${a.x} ${a.y} Q${via.x} ${via.y} ${b.x} ${b.y}`;
}
function showMap() {
  G.node = 'map'; G.npc = null; save();
  const L = S().locations;
  const night = G.phase >= 3;
  const vis = Object.entries(L).filter(([k, l]) => !l.req || l.req(G));
  const hubKey = Object.keys(L).find(k => Math.hypot(L[k].x - HUB.x, L[k].y - HUB.y) < 4);
  const roads = vis.filter(([k]) => k !== hubKey).map(([k, l]) => `<path d="${roadPath(l, HUB)}" class="road ${l.eph ? 'eph' : ''}"/>`).join('');
  const here = L[G.loc] || L[S().home];
  const marks = vis.map(([k]) => locMarked(k));
  $('#app').innerHTML = `<div class="mapview ph${G.phase}"><div class="mapbox">${ART.scene('map', G.phase).replace('xMidYMin slice', 'xMidYMid meet')}
      <svg class="roads" viewBox="0 0 100 100" preserveAspectRatio="none">${roads}</svg>
      <div class="mapsky"></div><div class="mapdust"></div>
      ${vis.map(([k, l], n) => { const m = marks[n]; return `<button class="pin ${m === 'now' ? 'mark' : m === 'later' ? 'later' : ''} ${G.loc === k ? 'here' : ''} ${!openAt(k, l) ? 'shut' : ''} ${l.eph ? 'eph' : ''}" data-k="${k}" style="left:${l.x}%;top:${l.y}%;animation-delay:${.15 + n * .05}s">
        <i>${ART.icon(PIN_ICON[l.bg] || 'sten')}</i>${m ? `<em>${m === 'later' ? '☾' : '!'}</em>` : ''}<span>${esc(l.name)}</span></button>`; }).join('')}
      <svg class="route" id="route" viewBox="0 0 100 100" preserveAspectRatio="none"></svg>
      <div class="walker" id="walker" style="left:${here.x}%;top:${here.y}%"><b></b></div></div>
    <div class="mapinfo"><div class="mi-t">${night ? 'Lilla nat. Only your nest and the plain are awake. Go to sleep.' : PHASES[G.phase] + ' · hvor vil du hen?'}</div>
      <div class="mi-k"><span><em>!</em> noget at gøre</span>${marks.includes('later') ? '<span><em class="l">☾</em> om natten</span>' : ''}${vis.some(([, l]) => l.eph) ? '<span class="ek">◌ only once</span>' : ''}</div>
      <div class="mi-q">${questSummary()}</div></div></div>`;
  AUDIO.play('map', G.phase); hud(); releaseOverlay();
  document.querySelectorAll('.pin').forEach(b => b.onclick = () => travel(b.dataset.k));
}
function questSummary() {
  return G.quests.filter(q => !questDone(q)).map(q => { const Q = S().quests[q]; const nx = Q.obj.find(o => !G.flags[o[1]]); return `<div class="qs ${Q.side ? 'side' : ''}"><b>${esc(Q.title)}</b> ${nx ? esc(nx[0]) : ''}</div>`; }).join('') || '<div class="qs">Nothing open. That never lasts here.</div>';
}
const questDone = q => S().quests[q].obj.every(o => G.flags[o[1]]);
function walk(from, to, upto = 1) {
  return new Promise(res => {
    const r = $('#route'), w = $('#walker');
    if (!r || !w || FAST) return res();
    r.innerHTML = `<path d="${roadPath(from, to)}" class="rt" id="rtp"/>`;
    const p = $('#rtp'), len = p.getTotalLength();
    p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
    const dur = Math.min(2000, 900 + len * 14) * upto, t0 = performance.now();
    w.classList.add('moving'); AUDIO.steps(Math.max(2, Math.round(dur / 380)));
    const tick = now => {
      const t = Math.min(1, (now - t0) / dur), e = t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2, d = len * upto * e;
      const pt = p.getPointAtLength(d); w.style.left = pt.x + '%'; w.style.top = pt.y + '%';
      p.style.strokeDashoffset = len - d;
      if (t < 1) requestAnimationFrame(tick); else { w.classList.remove('moving'); setTimeout(res, 220); }
    };
    requestAnimationFrame(tick);
  });
}
async function travel(k) {
  if (travel.busy) return;
  const L = S().locations[k];
  if (!openAt(k, L)) { toast('Lilla nat. That place has folded itself up for the night.', 'bad'); const b = document.querySelector(`.pin[data-k="${k}"]`); if (b) { b.classList.remove('nope'); void b.offsetWidth; b.classList.add('nope'); } return; }
  travel.busy = true;
  document.querySelectorAll('.pin').forEach(b => b.classList.toggle('dest', b.dataset.k === k));
  if (k === G.loc) {
    const w = $('#walker'); if (w) w.classList.add('turn');
    await sleep(450); travel.busy = false;
    const entry = L.entry(G);
    if (!S().nodes[entry].pass) await card(L.name, 'tilbage igen', false);
    return goNode(entry);
  }
  const from = S().locations[G.loc] || L;
  const ph0 = G.phase;
  if (k !== S().home && !(hasBoon('vild') && Math.random() < .5)) G.phase = Math.min(3, G.phase + 1);
  const pool = S().travel.filter(t => !G.travelDone.includes(t.id) && (!t.req || t.req(G)) && (!t.night || G.phase >= 2));
  const ev = pool.length && Math.random() < (FAST ? 0.6 : 0.45) && G.flags[S().travelAfter] ? pick(pool) : null;
  await walk(from, L, ev ? .55 : 1);
  G.loc = k; travel.busy = false;
  if (ev) {
    G.travelDone.push(ev.id);
    const w = $('#walker'); if (w) { w.classList.add('alert'); AUDIO.sting('tick'); await sleep(650); }
    await card('Undervejs', 'on the way');
    await runInline(ev);
  }
  const entry = L.entry(G), en = S().nodes[entry];
  if (en && (en.pass || en.card)) return goNode(entry);
  if (G.phase !== ph0) { phaseDial = dialHTML(ph0, G.phase); if (G.phase === 3) AUDIO.sting('night'); }
  await card(L.name, `${PHASES[G.phase]} · ${L.en}`);
  phaseDial = '';
  goNode(entry);
}
async function runInline(ev) {
  stage(ev.bg, ev.npc, 'Undervejs'); G.npc = ev.npc;
  await steps(ev.steps);
  const avail = ev.opts.filter(o => !(o.req && !o.req(G)));
  const i = await choices(avail.map(o => ({ html: (o.stat ? `<span class="tag t-${o.kind}">[${STATS[o.stat].name.toUpperCase()}${o.dc ? ' ' + o.dc : ''}]</span> ` : o.kind === 'eng' ? '<span class="tag t-eng">[ENGELSK]</span> ' : '') + esc(o.label) })));
  await runOption(ev, avail[i], i);
  save();
}

/* ---------------- sleep: the marks settle ---------------- */
async function goSleep() {
  const late = G.phase >= 3;
  const here = S().nodes[G.node];
  if (!(here && here.home)) await card('Reden', `${PHASES[G.phase]} · back to your nest`);
  stage('nest', null, 'Reden');
  logAdd(`<p>${esc(G.flags.Clook ? 'You curl up. Far away, something on the plain is facing this way. You sleep like a stone.' : pick(['You flop into the nest. It purrs.', 'You lie down. Your marks fizz, then settle.']))}</p>`, 'narr');
  await tapOn();
  if (G.today.length >= 3) await review();
  G.day++; G.phase = 0; G.today = []; G.loc = S().home; G.flags.ikketDay = false;
  G.insp = Math.max(G.insp, hasBoon('doer') ? 2 : 1) + (hasBoon('rytter') ? 1 : 0);
  save();
  await passTime(late ? 'dawn' : 'night', `Dag ${G.day}`, PHASES[0]);
  showMap();
}
function review() {
  return new Promise(resolve => {
    const words = G.today.slice().sort((a, b) => (META.vocab[a]?.box || 0) - (META.vocab[b]?.box || 0)).slice(0, 8);
    let i = 0, right = 0;
    const ov = document.createElement('div'); ov.className = 'prep-ov'; document.body.appendChild(ov);
    const next = () => {
      if (i >= words.length) {
        ov.innerHTML = `<div class="prep rv"><div class="p-head"><small>Aftrykkene sætter sig</small><h2>${right} / ${words.length}</h2><p>The marks of the day settle into you. The ones you know well go deep, and come back less often. The ones you missed stay near the surface.</p></div>
          <div class="rv-sum">${words.map(k => `<div class="rv-w">${ART.icon(VOCAB[k].icon)}<b>${esc(VOCAB[k].da)}</b><i>${esc(VOCAB[k].en)}</i><span class="dots">${[0, 1, 2, 3].map(n => `<i class="${n < (META.vocab[k]?.box || 0) ? 'on' : ''}"></i>`).join('')}</span></div>`).join('')}</div>
          <button class="btn gold big" id="rvDone">Sov</button></div>`;
        $('#rvDone').onclick = () => { ov.remove(); resolve(); };
        return;
      }
      const k = words[i], V = VOCAB[k];
      const others = shuffle(Object.keys(VOCAB).filter(x => x !== k && VOCAB[x].set === V.set)).slice(0, 2);
      const opts = shuffle([k, ...others]);
      const mode = V.def && (V.set === 'job' || Math.random() < .5) ? 'def' : pick(['icon2da', 'da2icon']); // job icons are only loose symbols, so jobs are asked by definition
      const prompt = mode === 'def' ? `<div class="rv-def">${daHTML(V.def)}</div>` : mode === 'icon2da' ? `<div class="rv-ico">${ART.icon(V.icon)}</div>` : `<div class="rv-da">${esc(V.da)}</div>`;
      ov.innerHTML = `<div class="prep rv"><div class="p-head"><small>Aftrykkene sætter sig · ${i + 1}/${words.length}</small><h2>${mode === 'da2icon' ? 'Which mark is it?' : 'What is it in Danish?'}</h2></div>
        ${prompt}<div class="rv-opts ${mode === 'da2icon' ? 'icons' : ''}">${opts.map(x => `<button class="rv-o" data-k="${x}">${mode === 'da2icon' ? ART.icon(VOCAB[x].icon) : esc(VOCAB[x].da)}</button>`).join('')}</div></div>`;
      wireWords(ov);
      if (mode === 'da2icon') TTS.say(V.da);
      ov.querySelectorAll('.rv-o').forEach(b => b.onclick = async () => {
        const ok = b.dataset.k === k;
        const v = META.vocab[k] = META.vocab[k] || { box: 0, seen: 1 };
        if (ok) { right++; v.box = Math.min(4, v.box + 1); b.classList.add('ok'); AUDIO.sting('imprint'); }
        else { v.box = 0; b.classList.add('no'); ov.querySelector(`.rv-o[data-k="${k}"]`).classList.add('ok'); AUDIO.sting('lose'); }
        saveMeta(); TTS.say(V.da);
        ov.querySelectorAll('.rv-o').forEach(x => x.disabled = true);
        const cap = document.createElement('div'); cap.className = 'rv-cap'; cap.innerHTML = `<b>${esc(V.da)}</b> = ${esc(V.en)}`; ov.querySelector('.prep').appendChild(cap);
        await sleep(ok ? 900 : 1700); i++; next();
      });
    };
    next();
  });
}

/* ---------------- vocabulary games (reusable; lessons give the data) ---------------- */
function vocabSheet(html) { const ov = document.createElement('div'); ov.className = 'voc-ov'; ov.innerHTML = `<div class="voc">${html}</div>`; document.body.appendChild(ov); wireWords(ov); return ov; }
const SPECIAL = {
  /* hidden-object search in the scene */
  hunt(id) {
    return new Promise(resolve => {
      const H = S().hunts[id];
      const st = $('#stage');
      const items = shuffle([...H.find, ...H.decoys]);
      const layer = document.createElement('div'); layer.className = 'hunt';
      const cols = 4, rows = Math.ceil(items.length / cols);
      layer.innerHTML = items.map((k, n) => { const c = n % cols, r = Math.floor(n / cols); const x = 8 + c * 23 + Math.random() * 8, y = 26 + r * (62 / rows) + Math.random() * 6; const rot = Math.round(Math.random() * 50 - 25); return `<button class="hobj" data-k="${k}" style="left:${x}%;top:${y}%;transform:rotate(${rot}deg)">${ART.icon(VOCAB[k].icon)}</button>`; }).join('');
      st.appendChild(layer); st.classList.add('hunting');
      const todo = shuffle(H.find); let wrong = 0;
      const o = $('#opts');
      const prompt = () => {
        if (!todo.length) { layer.remove(); st.classList.remove('hunting'); o.innerHTML = ''; logAdd(`<div class="res ok">Alt fundet. Everything found.</div>`); resolve(); return; }
        const k = todo[0];
        o.innerHTML = `<div class="huntbar"><small>${esc(H.title)} · ${H.find.length - todo.length + 1}/${H.find.length}</small><div>Find: <b>${daHTML(VOCAB[k].da)}</b> <button class="tb" id="hSay">♪</button></div>${wrong >= 2 ? '<button class="tb" id="hHelp">Hjælp</button>' : ''}</div>`;
        wireWords(o);
        $('#hSay').onclick = () => TTS.say(VOCAB[k].da, true);
        const hh = $('#hHelp'); if (hh) hh.onclick = () => layer.querySelector(`[data-k="${k}"]`).classList.add('hint');
        TTS.say(VOCAB[k].da);
      };
      layer.querySelectorAll('.hobj').forEach(b => b.onclick = () => {
        const k = b.dataset.k; addWord(k);
        if (k === todo[0]) {
          b.classList.add('found'); b.disabled = true; todo.shift(); wrong = 0; AUDIO.sting('win');
          toast(`${VOCAB[k].da} ✓`, 'good'); statGain('INDSIGT', 1);
          setTimeout(prompt, FAST ? 0 : 500);
        } else {
          wrong++; AUDIO.sting('lose');
          b.classList.add('nope'); setTimeout(() => b.classList.remove('nope'), 600);
          toast(`Det er ${VOCAB[k].da} (${VOCAB[k].en})`, 'bad'); TTS.say(VOCAB[k].da);
          prompt();
        }
      });
      __dev.hunt = () => todo[0];
      prompt();
    });
  },
  /* Gæt jobbet: a definition, three jobs */
  jobs() {
    return new Promise(resolve => {
      const J = S().jobs, keys = shuffle(J.keys).slice(0, 6); let i = 0, right = 0;
      const ov = vocabSheet('');
      const round = () => {
        if (i >= keys.length) {
          G.flags.jobsDone = true; G.sk += right * (J.pay || 2); hud();
          ov.querySelector('.voc').innerHTML = `<div class="v-h"><small>${esc(J.title)}</small><h2>${right} / ${keys.length}</h2><p>${esc(J.end(right))}</p></div><button class="btn gold big" id="vDone">Færdig</button>`;
          $('#vDone').onclick = () => { ov.remove(); resolve(); }; return;
        }
        const k = keys[i]; const opts = shuffle([k, ...shuffle(J.keys.filter(x => x !== k)).slice(0, 2)]);
        ov.querySelector('.voc').innerHTML = `<div class="v-h"><small>${esc(J.title)} · ${i + 1}/${keys.length}</small><h2>Gæt jobbet</h2><div class="notice">${daHTML(J.prefix + VOCAB[k].def.charAt(0).toLowerCase() + VOCAB[k].def.slice(1))}</div><p>Hvad var den?</p></div>
          <div class="rv-opts">${opts.map(x => `<button class="rv-o" data-k="${x}">${esc(VOCAB[x].da)}</button>`).join('')}</div>`;
        wireWords(ov);
        ov.querySelectorAll('.rv-o').forEach(b => b.onclick = async () => {
          const ok = b.dataset.k === k; addWord(k); ov.querySelectorAll('.rv-o').forEach(x => x.disabled = true);
          if (ok) { right++; b.classList.add('ok'); AUDIO.sting('coin'); statGain('INDSIGT', 1); } else { b.classList.add('no'); ov.querySelector(`.rv-o[data-k="${k}"]`).classList.add('ok'); AUDIO.sting('lose'); }
          TTS.say(VOCAB[k].da); await sleep(ok ? 800 : 1600); i++; round();
        });
      };
      round();
    });
  },
  /* corrections: a wrong sentence, three fixes */
  async corr() {
    const C = S().corr; let right = 0;
    logAdd(`<p>${esc(C.intro)}</p>`, 'narr');
    for (const it of C.items) {
      logAdd(`<div class="corr"><span class="corr-k">${esc(C.title)} viser</span><s>${daHTML(it.bad)}</s></div>`, 'quiz');
      const opts = shuffle([it.good, ...it.wrong]);
      const i = await choices(opts.map(o => ({ html: daHTML(o) })));
      const ok = opts[i] === it.good; if (ok) { right++; statGain('SPROG', 1); }
      logAdd(`<div class="res ${ok ? 'ok' : 'no'}">${ok ? 'Rigtigt. ' : 'Nej: <b>' + esc(it.good) + '</b> '}<br><i>${esc(it.why)}</i></div>`);
      TTS.say(it.good);
    }
    G.flags.corrDone = true;
    logAdd(`<p>${right} / ${C.items.length}. ${esc(right >= C.items.length - 2 ? C.good : C.meh)}</p>`, 'narr');
    if (right >= C.items.length - 2) fx({ boon: 'spejl', resp: 1 });
    await tapOn();
  },
  /* sorting into boxes (ponds), or filling a gap */
  boxes(id) {
    return new Promise(resolve => {
      const Q = S().boxes[id]; let i = 0, right = 0;
      const ov = vocabSheet('');
      const round = () => {
        if (i >= Q.items.length) {
          G.flags[id + 'Done'] = true; G.flags[id + 'Score'] = right;
          ov.querySelector('.voc').innerHTML = `<div class="v-h"><small>${esc(Q.title)}</small><h2>${right} / ${Q.items.length}</h2><p>${esc(right >= Q.items.length - 2 ? Q.good : Q.meh)}</p></div><button class="btn gold big" id="vDone">Færdig</button>`;
          $('#vDone').onclick = () => { ov.remove(); resolve(right); }; return;
        }
        const it = Q.items[i];
        const raw = it.opts || Q.boxes, order = it.opts ? shuffle(raw.map((_, k) => k)) : raw.map((_, k) => k);
        const opts = order.map(k => raw[k]), A = order.indexOf(it.a);
        ov.querySelector('.voc').innerHTML = `<div class="v-h"><small>${esc(Q.title)} · ${i + 1}/${Q.items.length}</small><h2>${esc(it.q || Q.q)}</h2><div class="v-def">${daHTML(it.t)}</div></div>
          <div class="rv-opts ${Q.boxes.length === 3 ? 'ponds' : ''}">${opts.map((o, k) => `<button class="rv-o" data-k="${k}"><span class="lab">${daHTML(o)}</span></button>`).join('')}</div>`;
        wireWords(ov, true);
        ov.querySelectorAll('.rv-o').forEach(b => b.onclick = async () => {
          const ok = +b.dataset.k === A;
          ov.querySelectorAll('.rv-o').forEach(x => x.disabled = true);
          b.classList.add(ok ? 'ok' : 'no'); if (!ok) ov.querySelectorAll('.rv-o')[A].classList.add('ok');
          if (ok) { right++; AUDIO.sting(id === 'dam' ? (it.a === 0 ? 'soft' : it.a === 1 ? 'hard' : 'win') : 'win'); statGain('SPROG', 1); } else AUDIO.sting('lose');
          const full = it.say || it.t.replace('___', raw[it.a]); TTS.say(full.charAt(0).toUpperCase() + full.slice(1));
          const cap = document.createElement('div'); cap.className = 'rv-cap'; cap.innerHTML = `${it.say ? `<b>${esc(it.t)} → ${esc(it.say)}</b><br>` : ''}<i>${esc(it.why)}</i>`; ov.querySelector('.voc').appendChild(cap);
          await sleep(ok ? 1300 : 2600); i++; round();
        });
      };
      round();
    });
  },
  /* a line in a ledger is wrong; the timeline shows the truth; pick the right sentence */
  fixEntry(id) {
    return new Promise(resolve => {
      const E = S().entries[id];
      const opts = shuffle([E.good, ...E.wrong]);
      const ov = vocabSheet('');
      ov.querySelector('.voc').innerHTML = `<div class="v-h"><small>${esc(E.book || 'Tællerens bog')} · ${esc(E.who)}</small><h2>Ret linjen</h2>
        <div class="book"><s>${daHTML(E.bad)}</s></div><p>${esc(E.hint)}</p>${ART.timeline(E.kind, E.lab)}</div>
        <div class="rv-opts">${opts.map((o, i) => `<button class="rv-o" data-i="${i}">${daHTML(o)}</button>`).join('')}</div>`;
      wireWords(ov, true);
      ov.querySelectorAll('.rv-o').forEach(b => b.onclick = async () => {
        const ok = opts[+b.dataset.i] === E.good;
        ov.querySelectorAll('.rv-o').forEach(x => x.disabled = true);
        b.classList.add(ok ? 'ok' : 'no'); if (!ok) ov.querySelectorAll('.rv-o')[opts.indexOf(E.good)].classList.add('ok');
        AUDIO.sting(ok ? 'win' : 'lose'); TTS.say(E.good);
        if (ok) statGain('SPROG', 1);
        G.flags['fix_' + id] = ok ? 'ok' : 'late';
        const why = document.createElement('div'); why.className = 'rv-cap'; why.innerHTML = `${ok ? 'Rigtigt.' : 'Nej.'} <i>${esc(E.why)}</i><button class="btn gold big" id="vDone">${esc(E.done || 'Skriv det i bogen')}</button>`;
        ov.querySelector('.voc').appendChild(why);
        $('#vDone').onclick = () => { ov.remove(); AUDIO.sting('page'); resolve(ok); };
      });
    });
  },
  /* the clock game: a time is said or shown; match it */
  clock() {
    return new Promise(resolve => {
      const C = S().clockGame, R = C.rounds; let i = 0, right = 0;
      const ov = vocabSheet('');
      const round = () => {
        if (i >= R.length) {
          G.flags[C.flag || 'clockDone'] = true;
          ov.querySelector('.voc').innerHTML = `<div class="v-h"><small>${esc(C.title)}</small><h2>${right} / ${R.length}</h2><p>${esc(right >= R.length - 1 ? C.good : C.meh)}</p></div><button class="btn gold big" id="vDone">Færdig</button>`;
          $('#vDone').onclick = () => { ov.remove(); resolve(right); }; return;
        }
        const [h, m, say] = R[i];
        const mode = i % 2 ? 'read' : 'hear';
        const wrongs = shuffle(R.filter(r => r[2] !== say)).slice(0, 2);
        const opts = shuffle([R[i], ...wrongs]);
        ov.querySelector('.voc').innerHTML = `<div class="v-h"><small>${esc(C.title)} · ${i + 1}/${R.length}</small><h2>${mode === 'hear' ? 'Hvilket ur?' : esc(C.ask || 'Hvad er klokken?')}</h2>
          ${mode === 'hear' ? `<div class="v-say">“${daHTML(say)}” <button class="tb" id="cSay">♪</button></div>` : `<div class="v-clock">${ART.clock(h, m)}</div>`}</div>
          <div class="rv-opts ${mode === 'hear' ? 'icons clocks' : ''}">${opts.map((o, k) => `<button class="rv-o" data-k="${k}">${mode === 'hear' ? ART.clock(o[0], o[1]) : daHTML(o[2])}</button>`).join('')}</div>`;
        wireWords(ov, true);
        if (mode === 'hear') { TTS.say(say); $('#cSay').onclick = () => TTS.say(say, true); }
        ov.querySelectorAll('.rv-o').forEach(b => b.onclick = async () => {
          const ok = opts[+b.dataset.k] === R[i];
          ov.querySelectorAll('.rv-o').forEach(x => x.disabled = true);
          b.classList.add(ok ? 'ok' : 'no'); if (!ok) ov.querySelectorAll('.rv-o')[opts.indexOf(R[i])].classList.add('ok');
          if (ok) { right++; AUDIO.sting('win'); statGain('INDSIGT', 1); } else { AUDIO.sting('lose'); toast(say, 'bad'); }
          TTS.say(say); await sleep(ok ? 900 : 2000); i++; round();
        });
      };
      round();
    });
  },
  /* the weather: when was it (i går / i dag / i morgen, from the verb), and what was it */
  weather(id) {
    return new Promise(resolve => {
      const W = S().weather[id]; let i = 0, right = 0, step = 0;
      const days = ['I går', 'I dag', 'I morgen'];
      const board = W.rounds.map(() => null);
      const ov = vocabSheet('');
      const boardHTML = () => `<div class="wboard">${days.map((d, k) => { const j = W.rounds.findIndex((r, n) => r.when === k && board[n]); return `<div class="wday"><small>${d}</small>${j >= 0 ? ART.icon(VOCAB[W.rounds[j].w].icon) : '<span>?</span>'}</div>`; }).join('')}</div>`;
      const round = () => {
        if (i >= W.rounds.length) {
          G.flags[id + 'Done'] = true;
          ov.querySelector('.voc').innerHTML = `<div class="v-h"><small>${esc(W.title)}</small><h2>${right} / ${W.rounds.length * 2}</h2>${boardHTML()}<p>${esc(W.end)}</p></div><button class="btn gold big" id="vDone">Færdig</button>`;
          $('#vDone').onclick = () => { ov.remove(); resolve(right); }; return;
        }
        const r = W.rounds[i];
        if (step === 0) {
          ov.querySelector('.voc').innerHTML = `<div class="v-h"><small>${esc(W.title)} · ${i + 1}/${W.rounds.length}</small>${boardHTML()}<h2>Hvornår?</h2><div class="v-def">“${daHTML('___ ' + r.t)}”</div><p>Look at the verb.</p></div>
            <div class="rv-opts">${days.map((d, k) => `<button class="rv-o" data-k="${k}">${d}</button>`).join('')}</div>`;
        } else {
          const opts = shuffle([r.w, ...shuffle(Object.keys(VOCAB).filter(k => VOCAB[k].set === 'vejr' && k !== r.w)).slice(0, 3)]);
          ov.querySelector('.voc').innerHTML = `<div class="v-h"><small>${esc(W.title)} · ${i + 1}/${W.rounds.length}</small>${boardHTML()}<h2>Hvordan er vejret?</h2><div class="v-def">“${daHTML(days[r.when] + ' ' + r.t)}”</div></div>
            <div class="rv-opts icons">${opts.map(k => `<button class="rv-o" data-w="${k}">${ART.icon(VOCAB[k].icon)}</button>`).join('')}</div>`;
        }
        wireWords(ov, true);
        ov.querySelectorAll('.rv-o').forEach(b => b.onclick = async () => {
          const ok = step === 0 ? +b.dataset.k === r.when : b.dataset.w === r.w;
          ov.querySelectorAll('.rv-o').forEach(x => x.disabled = true);
          b.classList.add(ok ? 'ok' : 'no');
          if (ok) { right++; AUDIO.sting('win'); } else AUDIO.sting('lose');
          if (step === 0) { if (!ok) toast(`${days[r.when]}: ${r.why}`, 'bad'); TTS.say(days[r.when] + ' ' + r.t); await sleep(ok ? 700 : 1800); step = 1; }
          else { addWord(r.w); if (!ok) { ov.querySelector(`.rv-o[data-w="${r.w}"]`).classList.add('ok'); toast(`${VOCAB[r.w].da} · ${VOCAB[r.w].en}`, 'bad'); } TTS.say(VOCAB[r.w].da); board[i] = true; await sleep(ok ? 800 : 1700); step = 0; i++; }
          round();
        });
      };
      round();
    });
  },
  /* Hvem er det? A description in the third person; pick the face */
  guess(id) {
    return new Promise(resolve => {
      const Q = S().guess[id]; let i = 0, right = 0;
      const ov = vocabSheet('');
      const round = () => {
        if (i >= Q.rounds.length) {
          G.flags[id + 'Done'] = true;
          ov.querySelector('.voc').innerHTML = `<div class="v-h"><small>${esc(Q.title)}</small><h2>${right} / ${Q.rounds.length}</h2><p>${esc(Q.end(right))}</p></div><button class="btn gold big" id="vDone">Færdig</button>`;
          $('#vDone').onclick = () => { ov.remove(); resolve(right); }; return;
        }
        const r0 = Q.rounds[i], r = r0.alt && r0.alt.req(G) ? { ...r0, ...r0.alt } : r0; // a round can follow the story (e.g. a creature still in its cocoon)
        const opts = shuffle([r.npc, ...shuffle(Q.pool.filter(n => n !== r.npc && !(r.not || []).includes(n))).slice(0, 2)]);
        (r.words || []).forEach(addWord);
        ov.querySelector('.voc').innerHTML = `<div class="v-h"><small>${esc(Q.title)} · ${i + 1}/${Q.rounds.length}</small><h2>Hvem er det?</h2><div class="notice">${r.lines.map(l => daHTML(l)).join(' ')}</div></div>
          <div class="faces">${opts.map(n => `<button class="rv-o face" data-n="${n}">${ART.creature(NPCS[n].art, 0, true)}</button>`).join('')}</div>`;
        wireWords(ov);
        ov.querySelectorAll('.rv-o').forEach(b => b.onclick = async () => {
          const ok = b.dataset.n === r.npc;
          ov.querySelectorAll('.rv-o').forEach(x => x.disabled = true);
          b.classList.add(ok ? 'ok' : 'no'); if (!ok) ov.querySelector(`.rv-o[data-n="${r.npc}"]`).classList.add('ok');
          if (ok) { right++; AUDIO.sting('coin'); statGain('INDSIGT', 1); } else AUDIO.sting('lose');
          const cap = document.createElement('div'); cap.className = 'rv-cap'; cap.innerHTML = `<b>${esc(NPCS[r.npc].name)}</b> · ${esc(NPCS[r.npc].role)}`; ov.querySelector('.voc').appendChild(cap);
          await sleep(ok ? 1100 : 2000); i++; round();
        });
      };
      round();
    });
  },
  async buyInsp() { if (G.sk >= 6) { G.sk -= 6; fx({ insp: 1 }); AUDIO.sting('coin'); } else toast('You cannot afford it. The moth is busy counting its own sparks.', 'bad'); },
  /* look at yourself: a plate in the atlas of Hertil, drawn from what you have said and caught */
  async selfPlate() {
    const ov = document.createElement('div'); ov.className = 'prep-ov'; document.body.appendChild(ov);
    ov.innerHTML = `<div class="prep plate-v"><div class="p-head"><small>Atlas over Hertil</small><h2>Dig</h2></div>${ART.self(G, marksCount())}
      <div class="paper-s">${selfLines().map(l => `<p>${daHTML(l)}</p>`).join('') || '<p>(nothing said properly yet)</p>'}</div>
      <p class="dim">${marksCount()} marks have settled into you. ${G.glimpses.length} traces of what you were.</p><button class="btn gold big" id="close">Luk</button></div>`;
    wireWords(ov);
    await new Promise(r => ov.querySelector('#close').onclick = () => { ov.remove(); r(); });
  },
};
const selfLines = () => [G.origin.reason, G.origin.job, G.origin.place, G.origin.fritid, G.origin.came, G.origin.stay, G.origin.happy].filter(Boolean);

/* ---------------- end of lesson ---------------- */
function endScreen() {
  localStorage.removeItem(KEY); META.runs++;
  META.carry = META.carry || {}; META.carry[G.sess] = carryOut(); saveMeta();
  stage(S().endBg || 'stair', null, '');
  const L = G.log, nx = S().nextSession && SESSIONS[S().nextSession];
  const ending = S().ending ? S().ending(G) : '—';
  const known = Object.keys(META.vocab).length;
  const ov = document.createElement('div'); ov.className = 'prep-ov'; document.body.appendChild(ov);
  ov.innerHTML = `<div class="prep debrief"><div class="p-head"><small>${esc(S().chapter)}</small><h2>${esc(S().title)}</h2><p>Afslutning: ${esc(ending)}</p></div>
    ${ART.self(G, marksCount())}
    <h3>Registreret · as you said it</h3><div class="paper-s">${selfLines().map(l => `<p>${daHTML(l)}</p>`).join('') || '<p>(nothing said properly yet)</p>'}</div>
    <div class="grid">
      <div><span>Vægt</span><b>${esc(tierName())}</b><small>${G.resp}</small></div>
      <div><span>Dage</span><b>${G.day}</b><small>in Hertil</small></div>
      <div><span>Sætninger</span><b>${L.built}</b><small>${L.perfect} perfect first try</small></div>
      <div><span>Terninger</span><b>${L.wins}/${L.rolls}</b><small>${L.melted ? `${L.melted} melted` : 'successful rolls'}</small></div>
      <div><span>Aftryk</span><b>${known}</b><small>words caught</small></div>
      <div><span>Spor</span><b>${G.glimpses.length}/${Object.keys(S().glimpses).length}</b><small>traces of what you were</small></div>
    </div>
    <h3>Færdigheder</h3><div class="stats">${Object.keys(STATS).map(k => `<div class="st"><b>${STATS[k].name}</b><span class="sv">${lvl(k)}</span></div>`).join('')}</div>
    ${S().next ? `<p class="next">Next: ${S().next}</p>` : ''}
    ${nx ? `<button class="btn gold big" id="onward">Fortsæt: ${esc(nx.short)} · ${esc(nx.en)}</button>` : ''}
    <button class="btn ${nx ? 'ghost' : 'gold'} big" id="again">Play the lesson again</button></div>`;
  wireWords(ov);
  $('#again').onclick = () => { ov.remove(); newGame(G.sess); goNode(S().start); };
  const on = $('#onward'); if (on) on.onclick = () => { const from = META.carry[G.sess]; ov.remove(); newGame(S().nextSession, from); goNode(S().start); };
}

/* ---------------- journal ---------------- */
function journal() {
  const ov = document.createElement('div'); ov.className = 'prep-ov'; document.body.appendChild(ov);
  const tabs = {
    k: () => G.quests.map(q => { const Q = S().quests[q]; return `<div class="qj ${questDone(q) ? 'done' : ''}"><b>${esc(Q.title)}</b> <i>${esc(Q.en)}</i>${Q.obj.map(o => `<div class="qo ${G.flags[o[1]] ? 'ok' : ''}">${G.flags[o[1]] ? '✓' : '○'} ${esc(o[0])}</div>`).join('')}</div>`; }).join('') || '<p class="dim">No contracts yet.</p>',
    f: () => `<div class="stats">${Object.entries(STATS).map(([k, s]) => { const l = lvl(k), x = G.statXP[k], nxt = STAT_STEPS[l] || x, prv = STAT_STEPS[l - 1] || 0; return `<div class="st"><div><b>${esc(s.name)}</b> <span class="sv">${l}</span><p>${esc(s.en)}</p><span class="xpb"><i style="width:${l >= 5 ? 100 : Math.round((x - prv) / Math.max(1, nxt - prv) * 100)}%"></i></span></div></div>`; }).join('')}</div>
      <p class="dim">Skills grow when you choose answers and actions of that kind, a little more when they succeed. Vægt: ${esc(tierName())} (${G.resp}). How much you weigh in Hertil.</p>
      ${G.boons.length ? '<h3>Gaver</h3>' + G.boons.map(b => `<div class="gl small"><b>${esc(BOONS[b].name)}</b><p>${esc(BOONS[b].fx)}</p></div>`).join('') : ''}`,
    o: () => Object.entries(VOCAB_SETS).map(([set, name]) => { const ks = Object.keys(VOCAB).filter(k => VOCAB[k].set === set && META.vocab[k]); return `<h3>${esc(name)} <small>${ks.length}/${Object.keys(VOCAB).filter(k => VOCAB[k].set === set).length}</small></h3><div class="ordbog">${ks.map(k => `<button class="ob ${META.vocab[k].box ? '' : 'faint'}" data-say="${esc(VOCAB[k].da)}">${ART.icon(VOCAB[k].icon)}<b>${esc(VOCAB[k].da)}</b><i>${esc(VOCAB[k].en)}</i><span class="dots">${[0, 1, 2, 3].map(n => `<i class="${n < META.vocab[k].box ? 'on' : ''}"></i>`).join('')}</span></button>`).join('') || '<p class="dim">None yet.</p>'}</div>`; }).join('') + '<p class="dim">Faint marks have not settled yet. Sleep on them.</p>',
    g: () => G.glimpses.length ? G.glimpses.map(g => `<div class="gl small"><b>${esc(S().glimpses[g].name)}</b><p>${esc(S().glimpses[g].text)}</p></div>`).join('') : '<p class="dim">Nothing yet. Hertil gives nothing away on purpose.</p>',
    a: () => `<div class="atlas"><button class="plate me" id="me">${ART.self(G, marksCount(), true)}<b>Dig</b><i>?</i></button>${G.met.map(id => `<div class="plate">${ART.creature(NPCS[id].art, gazeOf(id), true)}<b>${esc(NPCS[id].name)}</b><i>${esc(NPCS[id].role)}</i></div>`).join('')}</div>`,
    s: () => settingsHTML() + `<button class="btn ghost big" id="restart">Start forfra (new game)</button>`,
  };
  const names = { k: 'Kontrakter', f: 'Færdigheder', o: 'Aftryk', g: 'Spor', a: 'Atlas', s: 'Indstillinger' };
  ov.innerHTML = `<div class="prep"><div class="p-head"><small>Dagbog</small><h2>Dag ${G.day} · ${PHASES[G.phase]}</h2></div>
    <div class="jt">${Object.keys(tabs).map((k, i) => `<button data-t="${k}" class="${i ? '' : 'on'}">${names[k]}</button>`).join('')}</div><div class="jb"></div>
    <button class="btn gold big" id="close">Luk</button></div>`;
  const show = k => {
    ov.querySelector('.jb').innerHTML = tabs[k]();
    ov.querySelectorAll('.jt button').forEach(b => b.classList.toggle('on', b.dataset.t === k));
    ov.querySelectorAll('[data-say]').forEach(b => b.onclick = () => TTS.say(b.dataset.say, true));
    const me = $('#me'); if (me) me.onclick = () => SPECIAL.selfPlate();
    wireSettings(ov);
    const r = $('#restart'); if (r) r.onclick = () => { ov.remove(); localStorage.removeItem(KEY); title(); };
  };
  ov.querySelectorAll('.jt button').forEach(b => b.onclick = () => show(b.dataset.t));
  show('k');
  ov.querySelector('#close').onclick = () => ov.remove();
}
function settingsHTML() {
  const row = (k, on, name, en) => `<div class="set"><div class="set-h"><b>${name}</b><i>${en}</i><button class="tog ${SETTINGS[on] ? 'on' : ''}" data-on="${on}" aria-label="${en}"><span></span></button></div>
    <input type="range" min="0" max="100" value="${Math.round(SETTINGS[k] * 100)}" data-k="${k}" ${SETTINGS[on] ? '' : 'disabled'}></div>`;
  return `<div class="sets">${row('music', 'musicOn', 'Musik', 'music')}${row('amb', 'ambOn', 'Omgivelser', 'ambience: boings, bubbles, the loom')}${row('sfx', 'sfxOn', 'Effekter', 'dice, marks, steps')}${row('voice', 'voiceOn', 'Dansk stemme', 'Danish voice for dialogue')}
    <div class="set"><div class="set-h"><b>Taletempo</b><i>voice speed</i></div><input type="range" min="60" max="110" value="${Math.round((SETTINGS.rate || .9) * 100)}" data-k="rate"></div>
    <div class="set"><div class="set-h"><b>Animationer</b><i>transition cards & motion</i><button class="tog ${SETTINGS.motion ? 'on' : ''}" data-on="motion"><span></span></button></div></div>
    <button class="btn ghost" id="testv">♪ Test: “Hvorfor kom du hertil?”</button></div>
    <p class="dim">No Danish voice on Android? Settings → Text-to-speech output → Google → Install voice data → Dansk.</p>`;
}
function wireSettings(root) {
  root.querySelectorAll('.tog').forEach(b => b.onclick = () => { const k = b.dataset.on; AUDIO.set(k, !SETTINGS[k]); b.classList.toggle('on', SETTINGS[k]); const r = b.closest('.set').querySelector('input'); if (r && k !== 'motion') r.disabled = !SETTINGS[k]; document.body.classList.toggle('still', !SETTINGS.motion); AUDIO.sting('tick'); });
  root.querySelectorAll('input[type=range]').forEach(r => r.oninput = () => { AUDIO.set(r.dataset.k, +r.value / 100); if (r.dataset.k === 'sfx') AUDIO.sting('tick'); });
  const tv = root.querySelector('#testv'); if (tv) tv.onclick = e => { e.stopPropagation(); TTS.say('Hvorfor kom du hertil?', true); };
}
function settingsSheet() {
  const ov = document.createElement('div'); ov.className = 'prep-ov'; document.body.appendChild(ov);
  ov.innerHTML = `<div class="prep"><div class="p-head"><small>Indstillinger</small><h2>Lyd og visning</h2></div>${settingsHTML()}<button class="btn gold big" id="close">Luk</button></div>`;
  wireSettings(ov); ov.querySelector('#close').onclick = () => ov.remove();
}

/* ---------------- title ---------------- */
function title() {
  G = null; hud();
  let sv = null; try { sv = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { }
  if (sv && !SESSIONS[sv.sess || 'k1l1']) sv = null;
  const svS = sv && SESSIONS[sv.sess || 'k1l1'];
  $('#app').innerHTML = `<div class="stage title-st">${ART.scene('title', 0)}<div class="dustA"></div><div class="dustB"></div></div>
    <div class="title"><p class="k">en feberdrøm på dansk</p><h1>Hertil</h1>
    <p class="tag">You fell in. Everybody is busy. Somebody asks why you came.</p>
    ${sv ? `<button class="btn gold big" id="cont">Fortsæt <small>· ${esc(svS.short)}, dag ${sv.day}</small></button>` : ''}
    <button class="btn ${sv ? 'ghost' : 'gold'} big" id="new">${sv ? 'Fald igen' : 'Fald'}</button>
    <button class="btn ghost big" id="sets">⚙ Indstillinger · lyd</button>
    <button class="tapsound" id="tapsound">♪ tryk for lyd</button>
    <p class="sound">Sound and the Danish voice are on. Headphones recommended.</p></div>`;
  const ts = $('#tapsound'); if (ts) ts.onclick = e => { e.stopPropagation(); AUDIO.resume(); AUDIO.play('title'); ts.remove(); };
  $('#sets').onclick = () => { AUDIO.resume(); AUDIO.play('title'); settingsSheet(); };
  document.addEventListener('pointerdown', function first() { document.removeEventListener('pointerdown', first); AUDIO.resume(); if (!G) { AUDIO.play('title'); const t = $('#tapsound'); if (t) t.remove(); } });
  if (sv) $('#cont').onclick = () => { AUDIO.resume(); G = sv; G.sess = G.sess || 'k1l1'; G.prev = G.prev || {}; G.met = G.met || []; G.node && G.node !== 'map' && S().nodes[G.node] ? goNode(G.node) : showMap(); };
  $('#new').onclick = () => { AUDIO.resume(); lessonSheet(); };
  const q = (location.search.match(/[?&]lesson=(\w+)/) || [])[1];
  if (q && SESSIONS[q]) { newGame(q, (META.carry || {})[SESSIONS[q].prevSession] || null); goNode(S().start); }
}
function lessonSheet() {
  const list = Object.values(SESSIONS).sort((a, b) => a.order - b.order);
  if (list.length === 1) { newGame(list[0].id); goNode(S().start); return; }
  const carry = META.carry || {};
  const ov = document.createElement('div'); ov.className = 'prep-ov'; document.body.appendChild(ov);
  ov.innerHTML = `<div class="prep"><div class="p-head"><small>Kapitel 1</small><h2>Vælg lektion</h2><p>Each lesson follows one session of the book and takes about an hour and a half.</p></div>
    <div class="lessons">${list.map(L => { const from = L.prevSession && carry[L.prevSession];
      return `<div class="lesson"><b>${esc(L.short)} · ${esc(L.title.replace(/^Lektion \d+ · /, ''))}</b><i>${esc(L.en)}</i><p>${esc(L.blurb || '')}</p>
        ${from ? `<button class="btn gold" data-s="${L.id}" data-carry="1">Fortsæt med dig selv <small>(${esc(tierName(from))}, dag ${from.day})</small></button>` : ''}
        <button class="btn ${from || L.order === 1 ? 'ghost' : 'gold'}" data-s="${L.id}">Begynd</button></div>`; }).join('')}</div>
    <button class="btn ghost big" id="close">Tilbage</button></div>`;
  ov.querySelectorAll('[data-s]').forEach(b => b.onclick = () => { ov.remove(); const L = SESSIONS[b.dataset.s]; newGame(L.id, b.dataset.carry ? carry[L.prevSession] : null); goNode(S().start); });
  ov.querySelector('#close').onclick = () => ov.remove();
}

TTS.init();
document.body.classList.toggle('still', !SETTINGS.motion);
title();
