#!/usr/bin/env node
/* Static checks for every lesson. Run: node tools/lint.js   (exit code 1 on errors)
   Each check exists because the bug it catches has happened at least once. */
const fs = require('fs'), path = require('path');
const { load, ROOT, read } = require('./load');
const C = load();
const errors = [], warns = [], dynamic = []; // dynamic: Danish built at run time (checked against the glossary too)
const err = (s, m) => errors.push(`[${s}] ${m}`), warn = (s, m) => warns.push(`[${s}] ${m}`);
const norm = w => w.toLowerCase().replace(/[.,?!]/g, '');

for (const [sid, S] of Object.entries(C.SESSIONS)) {
  const N = S.nodes;
  const node = (x, where) => { if (typeof x === 'string' && !['map', 'sleep', 'end'].includes(x) && !N[x]) err(sid, `missing node "${x}" (${where})`); };
  const special = (x, where) => { if (!x) return; const k = x.split(':')[0]; if (!(S.special && S.special[k]) && !C.SPECIAL_NAMES.includes(k)) err(sid, `missing special "${k}" (${where})`); };
  const steps = (list, w) => (list || []).forEach(s => {
    if (s.say && !C.NPCS[s.say]) err(sid, `unknown speaker "${s.say}" (${w})`);
    if (s.npc && !C.NPCS[s.npc]) err(sid, `unknown npc "${s.npc}" (${w})`);
    special(s.special, w);
    if (s.letter && !S.letters[s.letter]) err(sid, `missing letter "${s.letter}" (${w})`);
    if (s.glimpse && !S.glimpses[s.glimpse]) err(sid, `missing glimpse "${s.glimpse}" (${w})`);
    if (s.say && s.da === undefined && s.en === undefined) err(sid, `say without text (${w})`);
  });
  // a sentence can depend on the state (what you wear): check it for every sample wardrobe the lesson lists
  const sampleG = wear => ({ flags: {}, glimpses: [], prev: {}, origin: {}, used: {}, phase: 0, boons: [], wear: wear || {} });
  const build = (b, w) => {
    if (!b) return;
    if (typeof b === 'function') { (S.lintWear || [{}]).forEach((wear, k) => { let r; try { r = b(sampleG(wear)); } catch (e) { return err(sid, `sentence function fails for sample wardrobe ${k}: ${e.message} (${w})`); } build(r, w + ` [wardrobe ${k}]`); (r.answers || []).forEach(a => dynamic.push(a.join(' '))); (r.tiles || []).forEach(t => dynamic.push(t)); }); return; }
    const tiles = b.tiles || [...b.answers[0], ...(b.extra || [])];
    for (const a of [...b.answers, ...(b.best || [])]) { // every accepted answer must be buildable from the tiles
      const need = {}; a.forEach(x => need[norm(x)] = (need[norm(x)] || 0) + 1);
      for (const x in need) if (tiles.filter(t => norm(t) === x).length < need[x]) err(sid, `tiles cannot build "${a.join(' ')}" — missing "${x}" (${w})`);
    }
  };
  const opts = (list, w, isTravel) => (list || []).forEach((o, i) => {
    const where = `${w}:${i}`;
    if (!isTravel) { node(o.next, where); node(o.failNext, where); }
    special(o.special, where); special(o.pre, where);
    steps(o.ok, where); steps(o.fail, where); steps(o.post, where);
    if (o.kind === 'say' && !o.build) err(sid, `say-option without a sentence to build (${where})`);
    if (o.stat && !C.STATS[o.stat]) err(sid, `unknown skill ${o.stat} (${where})`);
    if (o.dc && !o.stat) err(sid, `difficulty without skill (${where})`);
    if (o.kind === 'reply' && !o.da) err(sid, `reply without Danish (${where})`);
    if (o.kind === 'reply' && typeof o.da === 'function') (S.lintWear || [{}]).forEach(wear => dynamic.push(o.da(sampleG(wear))));
    build(o.build, where);
    if (o.once && o.group) warn(sid, `option has both once and group (${where})`);
    if (!isTravel && o.kind === 'reply' && !o.once && !o.group && !o.next && N[w] && N[w].hub) err(sid, `reply in hub ${w} can be repeated forever (give it once or group) (${where})`);
  });
  for (const [id, n] of Object.entries(N)) {
    if (n.npc && typeof n.npc !== 'function' && !C.NPCS[n.npc]) err(sid, `unknown npc "${n.npc}" in ${id}`);
    if (!n.opts || !n.opts.length) err(sid, `node ${id} has no options (dead end)`);
    steps(n.steps, id); opts(n.opts, id);
    if (n.hub && !(n.opts || []).some(o => o.kind === 'go' && !o.req && !o.once && !o.group)) warn(sid, `hub ${id} has no always-available way out`);
  }
  for (const [k, l] of Object.entries(S.locations)) { const e = l.entry(sampleG()); node(e, 'location ' + k); }
  (S.travel || []).forEach(t => { steps(t.steps, 'travel ' + t.id); opts(t.opts, 'travel ' + t.id, true); });
  // unreachable nodes
  const reach = new Set([S.start]);
  const src = read(fs.readdirSync(path.join(ROOT, 'js')).map(f => 'js/' + f).find(f => read(f).includes(`id: '${sid}'`)));
  for (const id of Object.keys(N)) if (id !== S.start && !new RegExp(`['"]${id}['"]`).test(src.replace(new RegExp(`\\b${id}:`), ''))) warn(sid, `node ${id} is never referenced`);
}

// vocabulary icons and glossary coverage
for (const [k, v] of Object.entries(C.VOCAB)) if (!v.icon.startsWith('face:') && !C.ART.ICONS[v.icon]) err('vocab', `icon "${v.icon}" missing for ${k}`);
const danish = [];
const walk = o => { if (!o || typeof o !== 'object') return; if (Array.isArray(o)) return o.forEach(walk);
  for (const [k, v] of Object.entries(o)) {
    if (k === 'qs' || k === 'en' || k === 'label' || ((k === 'good' || k === 'meh') && (o.items || o.rounds))) continue; // English: quiz questions about letters, translations, button labels
    if (typeof v === 'string' && ['da', 'bad', 'good', 't', 'def', 'clue'].includes(k)) danish.push(v);
    else if ((k === 'lines' || k === 'wrong' || k === 'boxes' || (k === 'opts' && typeof (v || [])[0] === 'string')) && Array.isArray(v)) v.forEach(x => typeof x === 'string' && danish.push(x));
    else if (k === 'tiles' && Array.isArray(v)) v.forEach(x => danish.push(x));
    else if (k === 'answers' && Array.isArray(v)) v.forEach(a => danish.push(a.join(' ')));
    else walk(v);
  } };
for (const S of Object.values(C.SESSIONS)) { walk(S); (S.clockRounds || []).forEach(r => danish.push(r[2])); ((S.clockGame || {}).rounds || []).forEach(r => danish.push(r[2]));
  // calendars: the days, the spoken times and every creature's reason are Danish
  Object.values(S.calendars || {}).forEach(K => { K.days.forEach(d => danish.push(d)); K.times.forEach(t => danish.push(t[0])); K.who.forEach(w => w.busy.forEach(b => danish.push(b.why))); });
  Object.values(S.letters || {}).forEach(L => (L.lines || []).forEach(l => danish.push(l))); }
// every calendar must have exactly one slot that suits everybody, or the puzzle has no single answer
for (const [sid, S] of Object.entries(C.SESSIONS)) Object.entries(S.calendars || {}).forEach(([id, K]) => {
  let free = 0; for (let d = 0; d < K.days.length; d++) for (let t = 0; t < K.times.length; t++) if (K.who.every(w => !w.busy.some(b => (b.d === undefined || b.d === d) && (b.t === undefined || b.t === t)))) free++;
  if (free !== 1) err(sid, `calendar ${id} has ${free} free slots (needs exactly 1)`);
});
Object.values(C.VOCAB).forEach(v => { danish.push(v.da); if (v.def) danish.push(v.def); });
dynamic.forEach(t => danish.push(t));
// the wardrobe's words (every colour form and every piece of clothing) must all have a meaning
if (C.COLOURS) Object.values(C.COLOURS).forEach(c => c.slice(0, 3).forEach(f => danish.push(f)));
if (C.CLOTHES) Object.values(C.CLOTHES).forEach(c => danish.push(c.n));
const missing = {};
danish.forEach(t => (t.match(/[A-Za-zÆØÅæøåáéüöÉÁ]+/g) || []).forEach(w => { if (!C.DICT[w.toLowerCase()] && !C.NAMES.includes(w)) missing[w.toLowerCase()] = (missing[w.toLowerCase()] || 0) + 1; }));
const miss = Object.keys(missing).filter(w => w.length > 1);
if (miss.length) err('glossary', `${miss.length} Danish words without a meaning in DICT: ${miss.join(', ')}`);

// no real people: names listed in tools/blocklist.txt must never appear in the game
const block = fs.existsSync(path.join(__dirname, 'blocklist.txt')) ? read('tools/blocklist.txt').split('\n').map(s => s.trim()).filter(s => s && !s.startsWith('#')) : [];
const files = ['index.html', ...fs.readdirSync(path.join(ROOT, 'js')).map(f => 'js/' + f)];
for (const f of files) { const t = read(f); for (const b of block) if (new RegExp(`\\b${b}\\b`, 'i').test(t)) err('people', `"${b}" appears in ${f} (real person, see tools/blocklist.txt)`); }

warns.forEach(w => console.log('warn ', w));
errors.forEach(e => console.log('ERROR', e));
console.log(`${Object.keys(C.SESSIONS).map(s => `${s}: ${Object.keys(C.SESSIONS[s].nodes).length} nodes`).join(', ')} · ${errors.length} errors, ${warns.length} warnings`);
process.exit(errors.length ? 1 : 0);
