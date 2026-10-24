/* =========================================================================
   HERTIL — data for Kapitel 3 · Nyt og gammelt (Deroppe)
   Gifts, creatures, the wardrobe (what you wear, and the Danish to say it),
   vocabulary, glossary and grammar notes for k3l1–k3l3.
   ========================================================================= */

Object.assign(BOONS, {
  // Lektion 1 · things answer to the right owner word
  egen:     { name: 'Dit eget tøj', en: 'A jumper with your shape in it', fx: '+1 on Sprog. You sound like you belong somewhere.' },
  skabhue:  { name: 'Skabets hue', en: 'Skabet lent you its hat', fx: '+1 on Løgn. In a borrowed hat, everybody thinks you live here.' },
  vasket:   { name: 'Den vaskede frakke', en: 'The coat came out a little smaller', fx: '+1 on Indsigt. You smell new.' },
  knude:    { name: 'Knuden', en: 'A knot of thread round your finger', fx: '+1 on Indsigt. You never forget a promise.' },
  stoev:    { name: 'Støvsugerens ro', en: 'The vacuum cleaner is resting', fx: '+1 on Snige. The house is quiet around you.' },
  fund:     { name: 'Hittegodset', en: 'Lost things find you now', fx: '+1 on Handel. Things roll toward your feet.' },
  // Lektion 2 · colours stick only with the right ending
  roedfrakke: { name: 'Den røde frakke', en: 'Your coat is red now', fx: '+1 on Løgn. Red is loud. Loud sounds sure.' },
  blaafrakke: { name: 'Den blå frakke', en: 'Your coat is blue now', fx: '+1 on Indsigt. Blue sees far.' },
  stribfrakke:{ name: 'Den stribede frakke', en: 'Your coat is striped now', fx: '+1 on Snige. Stripes are hard to follow.' },
  kvittering: { name: 'Kvitteringen', en: 'A receipt that never runs out', fx: '+1 on Handel. You always know what things cost.' },
  maerke:   { name: 'Prismærket', en: 'A price tag that says IKKE TIL SALG', fx: '+1 on Løgn. Nobody tries to buy you.' },
  hjemvej:  { name: 'Vejen hjem', en: 'The price tag found its coat', fx: '+1 on Sprog. You know where things belong.' },
  // Lektion 3 · the definite form chooses one thing
  lys:      { name: 'Lampens lys', en: 'The white lamp shines for you', fx: '+1 on Indsigt. You see things in good light.' },
  sommer:   { name: 'Sommerhusnøglen', en: 'A key to a summer house nobody has seen', fx: '+1 on Handel. There is always room for one more thing.' },
  stolen:   { name: 'Lænestolens gunst', en: 'The green armchair is on your side', fx: '+1 on Sprog. Agreeing is a kind of strength.' },
  gammel:   { name: 'Den gamle frakke', en: 'Your old coat fits again', fx: 'You wake every morning with at least two sparks.' },
  ny:       { name: 'Noget nyt', en: 'You chose new things', fx: '+1 on Snige. Nobody recognises you in new clothes.' },
  genbrug:  { name: 'Genbrugsmærket', en: 'Your coat went on to somebody else', fx: '+1 on Handel. What you give away comes back as something else.' },
});
// each gift gives a skill bonus (MOD_CAP keeps the roll risky)
const K3_BOON_STATS = [['egen', 'SPROG', 'Dit eget tøj'], ['skabhue', 'LOEGN', 'Skabets hue'], ['vasket', 'INDSIGT', 'Den vaskede frakke'], ['knude', 'INDSIGT', 'Knuden'], ['stoev', 'SNIGE', 'Støvsugerens ro'],
  ['fund', 'HANDEL', 'Hittegodset'], ['roedfrakke', 'LOEGN', 'Den røde frakke'], ['blaafrakke', 'INDSIGT', 'Den blå frakke'], ['stribfrakke', 'SNIGE', 'Den stribede frakke'], ['kvittering', 'HANDEL', 'Kvitteringen'],
  ['maerke', 'LOEGN', 'Prismærket'], ['hjemvej', 'SPROG', 'Vejen hjem'], ['lys', 'INDSIGT', 'Lampens lys'], ['sommer', 'HANDEL', 'Sommerhusnøglen'], ['stolen', 'SPROG', 'Lænestolens gunst'],
  ['ny', 'SNIGE', 'Noget nyt'], ['genbrug', 'HANDEL', 'Genbrugsmærket']];

Object.assign(NPCS, {
  // Lektion 1 · the house
  skab:     { name: 'Skabet', role: 'keeps everything, finds nothing', art: 'skab', big: true },
  boejler:  { name: 'Bøjlerne', role: 'coat hangers, flying in a flock', art: 'boejler', small: true },
  vask:     { name: 'Vaskemaskinen', role: 'washes the whole house, round and round', art: 'vask' },
  stoev:    { name: 'Støvsugeren', role: 'always on its way into the living room', art: 'stoev' },
  koel:     { name: 'Køleskabet', role: 'keeps things cold, and counts them', art: 'koel' },
  taske:    { name: 'Tasken', role: 'packs itself', art: 'taske' },
  // Lektion 2 · the sale street
  kasse:    { name: 'Kassen', role: 'rings up everything, also you', art: 'kasse' },
  boette:   { name: 'Farvebøtten', role: 'spilled all the colours', art: 'boette' },
  dukke:    { name: 'Dukken', role: 'wears what it is told', art: 'dukke' },
  dukke1:   { name: 'Den første dukke', role: 'in Retro’s window, on the left', art: 'dukke1' },
  dukke2:   { name: 'Den anden dukke', role: 'in Retro’s window, second', art: 'dukke2' },
  dukke3:   { name: 'Den tredje dukke', role: 'in Retro’s window, third', art: 'dukke3' },
  dukke4:   { name: 'Den fjerde dukke', role: 'in Retro’s window, on the right', art: 'dukke4' },
  maerke:   { name: 'Prismærket', role: 'fell off something', art: 'maerke', small: true },
  // Lektion 3 · the attic
  lampe:    { name: 'Lampen', role: 'the white one', art: 'lampe' },
  kommode:  { name: 'Kommoden', role: 'red, full of drawers and opinions', art: 'kommode' },
  laenestol:{ name: 'Lænestolen', role: 'green, and very sure about green', art: 'laenestol' },
  sofa:     { name: 'Sofaen', role: 'agrees with whoever sat on it last', art: 'sofa3' },
  frakke:   { name: 'Frakken', role: 'the coat that does not fit', art: 'frakke' },
  genbrugsk:{ name: 'Genbrugskassen', role: 'turns old things into somebody else’s', art: 'genbrugsk' },
});

/* ---------------- the wardrobe: what you wear, and how to say it ----------------
   G.wear = { slot: { k: clothes key, c: colour key, p: pattern colour, fit } }. Every phrase is built here,
   so the Danish always agrees: en rød hue, et rødt tørklæde, et par røde sko, min røde hue, den røde hue. */
const CLOTHES = {
  frakke:  { n: 'frakke', g: 'en', slot: 'frakke', en: 'coat' },
  hue:     { n: 'hue', g: 'en', slot: 'hoved', en: 'woolly hat' },
  kasket:  { n: 'kasket', g: 'en', slot: 'hoved', en: 'cap' },
  toerkl:  { n: 'tørklæde', g: 'et', slot: 'hals', en: 'scarf' },
  slips:   { n: 'slips', g: 'et', slot: 'hals', en: 'tie' },
  troeje:  { n: 'trøje', g: 'en', slot: 'krop', en: 'jumper' },
  skjorte: { n: 'skjorte', g: 'en', slot: 'krop', en: 'shirt' },
  kjole:   { n: 'kjole', g: 'en', slot: 'krop', en: 'dress' },
  sko:     { n: 'sko', g: 'pl', slot: 'fod', en: 'shoes' },
  stoevler:{ n: 'støvler', g: 'pl', slot: 'fod', en: 'boots' },
  solbriller: { n: 'solbriller', g: 'pl', slot: 'ansigt', en: 'sunglasses' },
};
// en-form, et-form, plural (= definite) form, ink
const COLOURS = {
  roed: ['rød', 'rødt', 'røde', '#e8322f'], hvid: ['hvid', 'hvidt', 'hvide', '#ffffff'], sort: ['sort', 'sort', 'sorte', '#1d1a5e'], groen: ['grøn', 'grønt', 'grønne', '#2fae4f'],
  gul: ['gul', 'gult', 'gule', '#ffd400'], blaa: ['blå', 'blåt', 'blå', '#2b3bd6'], graa: ['grå', 'gråt', 'grå', '#a9a6b8'], brun: ['brun', 'brunt', 'brune', '#9a5b2e'],
  orange: ['orange', 'orange', 'orange', '#ff8a1f'], lyseroed: ['lyserød', 'lyserødt', 'lyserøde', '#ff9ccd'], lilla: ['lilla', 'lilla', 'lilla', '#9b6fd0'],
  stribet: ['stribet', 'stribet', 'stribede', '#ffffff'], prikket: ['prikket', 'prikket', 'prikkede', '#ffffff'], ternet: ['ternet', 'ternet', 'ternede', '#ffffff'],
};
const PATTERNS = ['stribet', 'prikket', 'ternet'];
const W = {
  adj: (c, g, def) => COLOURS[c][def || g === 'pl' ? 2 : g === 'et' ? 1 : 0],
  art: g => g === 'en' ? 'en' : g === 'et' ? 'et' : 'et par',
  poss: (g, p = 'min') => ({ min: ['min', 'mit', 'mine'], din: ['din', 'dit', 'dine'] })[p][g === 'en' ? 0 : g === 'et' ? 1 : 2],
  pron: g => g === 'en' ? 'den' : g === 'et' ? 'det' : 'de',
  obj: g => g === 'en' ? 'den' : g === 'et' ? 'det' : 'dem',
  indef: it => { const C = CLOTHES[it.k]; return `${W.art(C.g)} ${W.adj(it.c, C.g)} ${C.n}`; },
  mine: (it, p) => { const C = CLOTHES[it.k]; return `${W.poss(C.g, p)} ${W.adj(it.c, C.g, true)} ${C.n}`; },
  the: it => { const C = CLOTHES[it.k]; return `${W.pron(C.g)} ${W.adj(it.c, C.g, true)} ${C.n}`; },
  sikke: it => { const C = CLOTHES[it.k], fl = C.g === 'pl' ? 'flotte' : 'flot'; return `Sikke ${C.g === 'en' ? 'en' : C.g === 'et' ? 'et' : 'nogle'} ${fl} ${W.adj(it.c, C.g)} ${C.n}!`; },
};
const FIT = { stor: 'Den er alt for stor.', lidt: 'Den er lidt for stor.', passer: 'Den passer.' };
const wearToast = it => `Du har ${W.indef(it)} på`;
const wearList = G => ['frakke', 'hoved', 'hals', 'krop', 'fod', 'ansigt'].map(s => (G.wear || {})[s]).filter(Boolean);
const wearLines = G => wearList(G).map(it => `Jeg har ${W.indef(it)} på.` + (it.k === 'frakke' && it.fit ? ' ' + FIT[it.fit] : ''));
// a creature notices what you are wearing (only something you chose: the coat from the parcel is not a compliment yet)
const wearComment = G => { const l = wearList(G).filter(it => it.k !== 'frakke' || it.c !== 'graa'); return l.length ? W.sikke(pick(l)) : null; };
// "Hvad har du på?" answered with two things you wear, in either order; traps are the wrong endings
function outfitBuild(G, origin) {
  const l = wearList(G), a = l.find(it => it.k === 'frakke') || l[0], b = l.find(it => it !== a);
  const words = it => W.indef(it).split(' ');
  const enOf = it => `${CLOTHES[it.k].g === 'pl' ? 'a pair of' : 'a'} ${COLOUR_EN[it.c]} ${CLOTHES[it.k].en}`;
  const extra = (base, ...its) => [...new Set(its.flatMap(trapsFor))].filter(t => !base.includes(t));
  if (!b) { const one = ['Jeg', 'har', ...words(a), 'på.']; return { en: `I am wearing ${enOf(a)}.`, origin, answers: [one], tiles: [...one, ...extra(one, a)] }; }
  const both = (x, y) => ['Jeg', 'har', ...words(x), 'og', ...words(y), 'på.'];
  return { en: `I am wearing ${enOf(a)} and ${enOf(b)}.`, origin, answers: [both(a, b), both(b, a)], tiles: [...both(a, b), ...extra(both(a, b), a, b)] };
}
const COLOUR_EN = { roed: 'red', hvid: 'white', sort: 'black', groen: 'green', gul: 'yellow', blaa: 'blue', graa: 'grey', brun: 'brown', orange: 'orange', lyseroed: 'pink', lilla: 'purple', stribet: 'striped', prikket: 'dotted', ternet: 'checked' };
// one wrong form of the adjective, if there is one (blå and orange have fewer forms)
const trapsFor = it => { const C = CLOTHES[it.k], ok = W.adj(it.c, C.g), forms = [...new Set(COLOURS[it.c].slice(0, 3))].filter(f => f !== ok); return forms.slice(0, 1); };

// the house in cross-section (rooms game, map)
const HOUSE_ROOMS = [['loft', 'Loftet'], ['sove', 'Soveværelset'], ['bad', 'Badeværelset'], ['stue', 'Stuen'], ['koekken', 'Køkkenet'], ['gang', 'Gangen'], ['garage', 'Garagen'], ['kaelder', 'Kælderen']];

Object.assign(VOCAB, {
  // ting derhjemme · things at home (Lektion 1)
  noegler:  { da: 'nøgler', en: 'keys', icon: 'noegle', set: 'hjem3', def: 'Dem bruger man, når man skal låse døren op.' },
  pung:     { da: 'en pung', en: 'a wallet', icon: 'pung', set: 'hjem3', def: 'Den har man penge og kort i.' },
  briller:  { da: 'briller', en: 'glasses', icon: 'briller', set: 'hjem3', def: 'Dem har man på, når man skal læse.' },
  hoeretlf: { da: 'høretelefoner', en: 'headphones', icon: 'hoeretlf', set: 'hjem3', def: 'Dem bruger man, når man hører musik.' },
  paraply:  { da: 'en paraply', en: 'an umbrella', icon: 'paraply', set: 'hjem3', def: 'Den tager man med, når det regner.' },
  ur3:      { da: 'et ur', en: 'a watch', icon: 'armbaandsur', set: 'hjem3', def: 'Det har man på armen. Det viser, hvad klokken er.' },
  mobil:    { da: 'en mobil', en: 'a mobile phone', icon: 'mobil', set: 'hjem3', def: 'Den ringer, og man kan skrive en sms på den.' },
  haandkl:  { da: 'et håndklæde', en: 'a towel', icon: 'haandkl', set: 'hjem3', def: 'Det bruger man, når man har været i bad.' },
  tandb:    { da: 'en tandbørste', en: 'a toothbrush', icon: 'tandb', set: 'hjem3', def: 'Den bruger man morgen og aften i badeværelset.' },
  taske:    { da: 'en taske', en: 'a bag', icon: 'taske', set: 'hjem3', def: 'Den kan man have ting i, når man går ud.' },
  baelte:   { da: 'et bælte', en: 'a belt', icon: 'baelte', set: 'hjem3', def: 'Det har man om maven, så bukserne bliver oppe.' },
  dankort:  { da: 'et dankort', en: 'a bank card', icon: 'dankort', set: 'hjem3', def: 'Det bruger man, når man betaler i en butik.' },
  hjelm:    { da: 'en cykelhjelm', en: 'a bike helmet', icon: 'hjelm', set: 'hjem3', def: 'Den har man på hovedet, når man cykler.' },
  pas:      { da: 'et pas', en: 'a passport', icon: 'pas', set: 'hjem3', def: 'Det skal man have med, når man rejser til et andet land.' },
  handsker: { da: 'handsker', en: 'gloves', icon: 'handske', set: 'hjem3', def: 'Dem har man på hænderne, når det er koldt.' },
  kamera:   { da: 'et kamera', en: 'a camera', icon: 'kamera', set: 'hjem3', def: 'Det tager billeder.' },
  // rum · rooms (Lektion 1)
  stue:     { da: 'en stue', en: 'a living room', icon: 'sofa', set: 'rum', def: 'Et rum, hvor man sidder i sofaen om aftenen.' },
  koekken:  { da: 'et køkken', en: 'a kitchen', icon: 'gryde', set: 'rum', def: 'Et rum, hvor man laver mad.' },
  sovevaer: { da: 'et soveværelse', en: 'a bedroom', icon: 'seng', set: 'rum', def: 'Et rum, hvor man sover.' },
  badevaer: { da: 'et badeværelse', en: 'a bathroom', icon: 'badekar', set: 'rum', def: 'Et rum, hvor man går i bad.' },
  kaelder:  { da: 'en kælder', en: 'a basement', icon: 'kaelder', set: 'rum', def: 'Et rum under huset, hvor vaskemaskinen står.' },
  loft:     { da: 'et loft', en: 'an attic', icon: 'loft', set: 'rum', def: 'Et rum oppe under taget, hvor man har gamle ting.' },
  gang:     { da: 'en gang', en: 'a hallway', icon: 'knage', set: 'rum', def: 'Et rum ved døren, hvor man hænger sin jakke.' },
  garage:   { da: 'en garage', en: 'a garage', icon: 'bil', set: 'rum', def: 'Et rum, hvor bilen og cyklerne står.' },
  // tøj · clothes (Lektion 2)
  frakke:   { da: 'en frakke', en: 'a coat', icon: 'frakke', set: 'toej' },
  jakke:    { da: 'en jakke', en: 'a jacket', icon: 'jakke', set: 'toej' },
  hue3:     { da: 'en hue', en: 'a woolly hat', icon: 'strik', set: 'toej' },
  kasket:   { da: 'en kasket', en: 'a cap', icon: 'kasket', set: 'toej' },
  toerkl:   { da: 'et tørklæde', en: 'a scarf', icon: 'toerkl', set: 'toej' },
  slips:    { da: 'et slips', en: 'a tie', icon: 'slips', set: 'toej' },
  troeje:   { da: 'en trøje', en: 'a jumper', icon: 'troeje', set: 'toej' },
  skjorte:  { da: 'en skjorte', en: 'a shirt', icon: 'skjorte', set: 'toej' },
  kjole:    { da: 'en kjole', en: 'a dress', icon: 'kjole', set: 'toej' },
  bukser:   { da: 'et par bukser', en: 'a pair of trousers', icon: 'bukser', set: 'toej' },
  nederdel: { da: 'en nederdel', en: 'a skirt', icon: 'nederdel', set: 'toej' },
  sko3:     { da: 'et par sko', en: 'a pair of shoes', icon: 'sko', set: 'toej' },
  stoevler: { da: 'et par støvler', en: 'a pair of boots', icon: 'stoevle', set: 'toej' },
  solbril:  { da: 'et par solbriller', en: 'a pair of sunglasses', icon: 'solbriller', set: 'toej' },
  sokker3:  { da: 'et par sokker', en: 'a pair of socks', icon: 'sokker', set: 'toej' },
  // farver · colours (Lektion 2), the swatch is the mark
  f_roed: { da: 'rød', en: 'red', icon: 'f_roed', set: 'farve' }, f_hvid: { da: 'hvid', en: 'white', icon: 'f_hvid', set: 'farve' }, f_sort: { da: 'sort', en: 'black', icon: 'f_sort', set: 'farve' },
  f_groen: { da: 'grøn', en: 'green', icon: 'f_groen', set: 'farve' }, f_gul: { da: 'gul', en: 'yellow', icon: 'f_gul', set: 'farve' }, f_blaa: { da: 'blå', en: 'blue', icon: 'f_blaa', set: 'farve' },
  f_graa: { da: 'grå', en: 'grey', icon: 'f_graa', set: 'farve' }, f_brun: { da: 'brun', en: 'brown', icon: 'f_brun', set: 'farve' }, f_orange: { da: 'orange', en: 'orange', icon: 'f_orange', set: 'farve' },
  f_lyseroed: { da: 'lyserød', en: 'pink', icon: 'f_lyseroed', set: 'farve' }, f_lilla: { da: 'lilla', en: 'purple', icon: 'f_lilla', set: 'farve' },
  f_stribet: { da: 'stribet', en: 'striped', icon: 'f_stribet', set: 'farve' }, f_prikket: { da: 'prikket', en: 'dotted', icon: 'f_prikket', set: 'farve' }, f_ternet: { da: 'ternet', en: 'checked', icon: 'f_ternet', set: 'farve' },
  // møbler · furniture (Lektion 3)
  sofa:     { da: 'en sofa', en: 'a sofa', icon: 'sofa', set: 'moebel' },
  lampe:    { da: 'en lampe', en: 'a lamp', icon: 'lampe', set: 'moebel' },
  laenestol:{ da: 'en lænestol', en: 'an armchair', icon: 'laenestol', set: 'moebel' },
  stol3:    { da: 'en stol', en: 'a chair', icon: 'stol3', set: 'moebel' },
  bord:     { da: 'et bord', en: 'a table', icon: 'bord', set: 'moebel' },
  kommode:  { da: 'en kommode', en: 'a chest of drawers', icon: 'kommode', set: 'moebel' },
  reol:     { da: 'en reol', en: 'a bookcase', icon: 'reol', set: 'moebel' },
  hylde:    { da: 'en hylde', en: 'a shelf', icon: 'hylde', set: 'moebel' },
  gardin:   { da: 'et gardin', en: 'a curtain', icon: 'gardin', set: 'moebel' },
  pude:     { da: 'en pude', en: 'a cushion', icon: 'pude', set: 'moebel' },
  taeppe:   { da: 'et tæppe', en: 'a rug, a blanket', icon: 'taeppe', set: 'moebel' },
  skab3:    { da: 'et skab', en: 'a cupboard, a wardrobe', icon: 'skab', set: 'moebel' },
});
Object.assign(VOCAB_SETS, { hjem3: 'Ting derhjemme · Things at home', rum: 'Rum · Rooms', toej: 'Tøj · Clothes', farve: 'Farver · Colours', moebel: 'Møbler · Furniture' });

/* grammar notes for Kapitel 3, shown behind "Hvorfor?" (tests on lower-case text, æøå written ae/oe/aa) */
const K3ADJ = 'roed|roedt|roede|hvid|hvidt|hvide|groen|groent|groenne|gul|gult|gule|blaa|blaat|graa|graat|sort|sorte|brun|brunt|brune|orange|lyseroed|lyseroedt|lyseroede|lilla|stribet|stribede|prikket|prikkede|ternet|ternede|paen|paent|paene|smuk|smukt|smukke|flot|flotte|smart|smarte|laekker|laekkert|laekre|stor|stort|store|lille|smaa|ny|nyt|nye|gammel|gammelt|gamle|dyr|dyrt|dyre|billig|billigt|billige|grim|grimt|grimme|kedelig|kedeligt|kedelige|slidt|slidte|hyggelig|hyggeligt|hyggelige';
RULES.push(
  { id: 'minmit', name: 'min · mit · mine', t: s => /\b(min|mit|mine|din|dit|dine)\b/.test(s),
    en: 'The possessive agrees with the THING owned, not with the owner: min hue (en hue), mit ur (et ur), mine nøgler (plural). The same with din / dit / dine. vores, jeres, hans, hendes never change.',
    ex: ['Har du set min pung?', 'Jeg kan ikke finde mit ur.', 'Hvor er mine nøgler?'] },
  { id: 'egen', name: 'egen · eget · egne', t: s => /\b(egen|eget|egne)\b/.test(s),
    en: 'egen (own) agrees like an adjective: min egen hue, mit eget tørklæde, mine egne nøgler. The noun can be left out: Kan du ikke bruge din egen?',
    ex: ['Kan du ikke bruge din egen?', 'Jeg kan ikke finde mit eget tøj.'] },
  { id: 'dedem', name: 'de eller dem', t: s => /\bdem\b/.test(s) || /^de (ligger|er|staar|haenger)\b/.test(s),
    en: 'de is the subject (De ligger i stuen). dem is the object, after a verb or a preposition (Jeg kan ikke finde dem. Jeg går ind og henter dem). The same pair: jeg/mig, han/ham, hun/hende, vi/os.',
    ex: ['Har du set mine nøgler? Jeg kan ikke finde dem.', 'De ligger ude i gangen.'] },
  { id: 'rum', name: 'i eller på + rum', t: s => /\b(i|paa) (stuen|koekkenet|kaelderen|gangen|sovevaerelset|garagen|loftet|badevaerelset|toilettet|vaerelset|kaelder)\b/.test(s),
    en: 'Most rooms take i: i stuen, i køkkenet, i kælderen, i gangen, i soveværelset, i garagen. Some take på: på loftet, på badeværelset, på toilettet. With a place word: inde i stuen, ude i køkkenet, oppe på loftet, nede i kælderen.',
    ex: ['Den ligger inde i stuen.', 'Paraplyen er oppe på loftet.'] },
  { id: 'skalnok', name: 'skal nok (et løfte)', t: s => /\bskal nok\b/.test(s),
    en: 'skal nok makes a promise: Jeg skal nok tage den med. As a short answer to Vil du ikke …?: Jo, det skal jeg nok.',
    ex: ['Vil du ikke tage mine briller med til mig? – Jo, det skal jeg nok.', 'Jeg skal nok komme tilbage.'] },
  { id: 'bruge', name: 'Skal du bruge …? · Så bare tag min', t: s => /\bskal (du|jeg) (ikke )?bruge\b|\bbare tag\b/.test(s),
    en: 'Skal du bruge din rygsæk i dag? asks if someone needs their thing. If not: Nej, så bare tag min (just take mine). The short answer repeats skal: Ja, det skal jeg.',
    ex: ['Skal du bruge dine handsker i dag?', 'Nå, men så bare tag mine.'] },
  { id: 'adj3', name: 'Adjektiver: pæn · pænt · pæne', t: s => new RegExp(`\\b(en|et|nogle|par|er) (\\w+ )?(${K3ADJ})\\b`).test(s) && !/\b(den|det|de|min|mit|mine|din|dit|dine|vores|jeres|deres|hans|hendes|sin|sit|sine|\w+s) (\w+ )?(\w+e|blaa|graa|orange|lilla|smaa) \w+/.test(s.replace(/\b(det|den|de) (er|var)\b/g, 'X')),
    en: 'An adjective agrees with its noun: en pæn kjole, et pænt slips, nogle pæne bukser. Also after er: Den er pæn. Det er pænt. De er pæne. blå and grå get -t but no -e (et blåt slips, blå sko); orange and lilla never change; stribet, prikket, ternet become stribede … in the plural.',
    ex: ['Sikke et flot tørklæde!', 'Jeg har en rød frakke på.', 'De er virkelig lækre.'] },
  { id: 'sikke', name: 'Sikke …! · Hvor er det …!', t: s => /^(sikke|hvor er det) (en|et|nogle) /.test(s),
    en: 'To praise something: Sikke + en / et / nogle + adjective + noun (Sikke en flot hue!), or Hvor er det + en / et / nogle … (Hvor er det et flot tørklæde!). The adjective agrees with the noun.',
    ex: ['Sikke nogle flotte sko!', 'Hvor er det en flot skjorte!'] },
  { id: 'harpaa', name: 'have noget på', t: s => /\bhar (\w+ )+paa\b/.test(s) && !/\bpaa (loftet|badevaerelset|toilettet|hjoernet|vej|tilbud)\b/.test(s),
    en: 'have … på = wear: Jeg har en rød frakke på. The på goes at the end, after the clothes. tage … på = put on.',
    ex: ['Hvad har du på?', 'Jeg har en gul hue og en grå frakke på.'] },
  { id: 'etpar', name: 'et par', t: s => /\bet par\b/.test(s),
    en: 'Things that come in twos are counted with et par: et par sko, et par bukser, et par handsker. The adjective takes the plural form: et par røde sko.',
    ex: ['Jeg har lige købt et par sorte sko.'] },
  { id: 'koebt', name: 'Hvor har du købt den henne?', t: s => /\bkoebt\b|\bkostede\b|\bkoster\b/.test(s),
    en: 'Past events that matter now: har + købt (I have bought). The price: Hvad kostede den? – Den kostede 99 kroner. Den / det / dem points back at the thing: en frakke → den, et slips → det, sko → dem (object) / de (subject).',
    ex: ['Hvor har du købt den henne?', 'Den kostede kun halvfems kroner.'] },
  { id: 'bestemt', name: 'Bestemt form: den hvide lampe', t: s => /\b(den|det|de|min|mit|mine|din|dit|dine|vores|jeres|deres|hans|hendes|sin|sit|sine) (\w+ )?(?!egne\b)(\w+e|blaa|graa|orange|lilla|smaa) (lampe|kommode|laenestol|sofa|stol|bord|reol|hylde|hylder|gardin|gardiner|pude|puder|taeppe|skab|frakke|hue|troeje|tid|ting|seng)\b/.test(s),
    en: 'After den / det / de, a possessive (min, dit …) or a name with -s, the adjective takes -e, whatever the gender: den hvide lampe, mit hvide skab, Peters hvide sofa. blå, grå, orange and lilla stay as they are; gammel → gamle, lækker → lækre, lille → små in the plural.',
    ex: ['Kan du ikke lide den hvide lampe?', 'Jeg er rigtig glad for min gamle frakke.'] },
  { id: 'reakt', name: 'Reaktioner: Kan du det?!', t: s => /^(kan|er|synes|goer|tror) du (det|ikke)$/.test(s),
    en: 'To react with surprise or interest, repeat the verb in a short answer: Jeg kan godt lide den. – Kan du det?! After a negative: Kan du ikke?! After synes, both synes and gør work: Synes du det?! / Gør du det?!',
    ex: ['Kan du det?!', 'Er du ikke?!', 'Synes du det?!'] },
  { id: 'ogsaa3', name: 'også · heller ikke', t: s => /\bdet \w+ jeg (ogsaa|heller ikke)\b/.test(s),
    en: 'Agree with something positive: Det kan jeg også. Agree with something negative: Det kan jeg heller ikke. The verb follows the short-answer rules: repeat er, kan, synes, or use gør.',
    ex: ['Jeg kan godt lide den sorte seng. – Det kan jeg også.', 'Jeg er ikke så vild med den grå kommode. – Det er jeg heller ikke.'] },
  { id: 'forstor', name: 'for + adjektiv (too)', t: s => /\b(lidt|alt) for (stor|stort|store|lille|smaa|lang|dyr|dyrt|dyre|gammel|grim)\b/.test(s),
    en: 'for + adjective = too: lidt for stor (a bit too big), alt for lille (far too small). The adjective still agrees: Den er for stor. De er for store.',
    ex: ['Den er bare lidt for stor.', 'De er alt for små.'] },
  { id: 'vild', name: 'kan godt lide · er vild med', t: s => /\b(vild med|kan (godt |bedst |ikke |ikke saa godt )?lide|kan \w+ (godt |bedst )?lide|er (rigtig )?glad for|er traet af)\b/.test(s),
    en: 'From most to least: kan bedst lide, er vild med, kan godt lide, kan ikke så godt lide, kan ikke lide. A known thing follows: Jeg er vild med den grønne farve.',
    ex: ['Jeg er vild med de blå stole.', 'Jeg kan ikke så godt lide den prikkede sofa.'] },
);

Object.assign(DICT, {
  // Kapitel 3 · the house, the wardrobe
  'deroppe': 'up there', 'skabet': 'the wardrobe, the cupboard', 'skab': 'cupboard, wardrobe', 'skabets': 'the wardrobe’s', 'nøgle': 'key', 'nøglen': 'the key', 'nøgler': 'keys', 'nøglerne': 'the keys',
  'set': 'seen (har du set …?)', 'finde': 'find', 'væk': 'gone, away', 'huset': 'the house', 'hus': 'house', 'ingen': 'nobody, no', 'noget': 'something, anything', 'bøjler': 'coat hangers',
  'bøjlerne': 'the coat hangers', 'flyver': 'fly, flies', 'rundt': 'round, around', 'siger': 'say(s)', 'rigtigt': 'right, correctly', 'min': 'my (en-word)', 'mit': 'my (et-word)', 'mine': 'my (plural)',
  'din': 'your (en-word)', 'dit': 'your (et-word)', 'dine': 'your (plural)', 'egen': 'own (en-word)', 'eget': 'own (et-word)', 'hue': 'woolly hat', 'huen': 'the hat', 'ur': 'watch, clock', 'uret': 'the watch',
  'paraply': 'umbrella', 'paraplyen': 'the umbrella', 'høretelefoner': 'headphones', 'høretelefonerne': 'the headphones', 'bælte': 'belt', 'bæltet': 'the belt', 'briller': 'glasses', 'brillerne': 'the glasses',
  'tørklæde': 'scarf', 'tørklædet': 'the scarf', 'pung': 'wallet', 'pungen': 'the wallet', 'mobil': 'mobile phone', 'mobilen': 'the mobile', 'håndklæde': 'towel', 'håndklæder': 'towels', 'håndklæderne': 'the towels',
  'tandbørste': 'toothbrush', 'tandbørsten': 'the toothbrush', 'taske': 'bag', 'tasken': 'the bag', 'dankort': 'bank card', 'dankortet': 'the bank card', 'cykelhjelm': 'bike helmet', 'cykelhjelmen': 'the bike helmet',
  'pas': 'passport', 'passet': 'the passport', 'handsker': 'gloves', 'handskerne': 'the gloves', 'kamera': 'camera', 'kameraet': 'the camera', 'frakke': 'coat', 'frakken': 'the coat', 'jakke': 'jacket', 'jakken': 'the jacket',
  'kasket': 'cap', 'slips': 'tie', 'slipset': 'the tie', 'trøje': 'jumper', 'trøjen': 'the jumper', 'skjorte': 'shirt', 'skjorten': 'the shirt', 'kjole': 'dress', 'kjolen': 'the dress', 'bukser': 'trousers',
  'bukserne': 'the trousers', 'nederdel': 'skirt', 'nederdelen': 'the skirt', 'støvler': 'boots', 'støvlerne': 'the boots', 'solbriller': 'sunglasses', 'solbrillerne': 'the sunglasses', 'sokker': 'socks',
  'par': 'pair (et par: a pair)', 'stue': 'living room', 'stuen': 'the living room · the ground floor', 'køkken': 'kitchen', 'køkkenet': 'the kitchen', 'soveværelse': 'bedroom', 'soveværelset': 'the bedroom',
  'badeværelse': 'bathroom', 'badeværelset': 'the bathroom', 'kælder': 'basement, cellar', 'loft': 'attic · ceiling', 'loftet': 'the attic', 'gangen': 'the hallway', 'garage': 'garage', 'garagen': 'the garage',
  'toilettet': 'the toilet', 'inde': 'in, inside (a place)', 'ind': 'in (a direction)', 'ude': 'out (a place)', 'ud': 'out (a direction)', 'oppe': 'up (a place)', 'op': 'up (a direction)', 'nede': 'down (a place)', 'ned': 'down (a direction)',
  'henter': 'fetch(es)', 'hente': 'fetch', 'lige': 'just, right', 'bruge': 'use, need', 'bare': 'just', 'tag': 'take! (imperative)', 'egne': 'own (plural)', 'løfte': 'promise', 'nok': 'probably · enough (skal nok: will, promise)',
  'vaskemaskinen': 'the washing machine', 'vaskemaskine': 'washing machine', 'vasker': 'washes', 'vaske': 'wash', 'vasket': 'washed', 'støvsugeren': 'the vacuum cleaner', 'støvsuger': 'vacuum cleaner', 'køleskabet': 'the fridge',
  'køleskab': 'fridge', 'lugter': 'smell(s)', 'gammelt': 'old (et-word)', 'værsgo': 'here you are', 'passer': 'fits · suits (det passer mig) · looks after', 'kigget': 'looked (har kigget)', 'lomme': 'pocket', 'lommen': 'the pocket',
  'tøj': 'clothes', 'tøjet': 'the clothes', 'åbne': 'open', 'selv': 'self (mig selv: myself)', 'stille': 'quiet, still', 'hjælpe': 'help', 'ting': 'thing, things', 'tingene': 'the things', 'våd': 'wet', 'våde': 'wet (plural)',
  'ligger': 'lie(s), is (lying)', 'står': 'stand(s), is (standing)', 'hænger': 'hang(s)', 'sover': 'sleep(s)', 'nat': 'night (i nat: tonight)', 'mor': 'mother', 'huske': 'remember', 'tage': 'take', 'med': 'with (tage med: bring along)',
  'fødselsdag': 'birthday', 'rødvin': 'red wine', 'flaske': 'bottle', 'rejse': 'travel', 'regner': 'rains', 'cykle': 'cycle', 'svømme': 'swim', 'svømmebriller': 'swimming goggles', 'badedragt': 'swimsuit',
  'sandaler': 'sandals', 'løbe': 'run', 'løbesko': 'running shoes', 'shorts': 'shorts', 'skraldepose': 'rubbish bag', 'koldt': 'cold (et-word)', 'kold': 'cold', 'land': 'country', 'andet': 'other (et-word)',
  'betaler': 'pay(s)', 'butik': 'shop', 'butikken': 'the shop', 'butikker': 'shops', 'låse': 'lock (låse op: unlock)', 'døren': 'the door', 'penge': 'money', 'kort': 'card · short · map', 'læse': 'read', 'hører': 'hear(s), listen(s) to',
  'musik': 'music', 'armen': 'the arm', 'viser': 'show(s)', 'klokken': 'the time, the clock', 'ringer': 'ring(s)', 'skrive': 'write', 'sms': 'text message', 'været': 'been', 'bad': 'bath, shower', 'morgen': 'morning',
  'aften': 'evening', 'maven': 'the stomach, the belly', 'oppe': 'up (a place)', 'betale': 'pay', 'hovedet': 'the head', 'cykler': 'cycle(s) · bikes', 'rejser': 'travel(s)', 'hænderne': 'the hands', 'billeder': 'pictures',
  'rum': 'room', 'sidder': 'sit(s)', 'sofaen': 'the sofa', 'aftenen': 'the evening (om aftenen: in the evening)', 'mad': 'food', 'under': 'under', 'står': 'stand(s)', 'taget': 'the roof', 'gamle': 'old (plural, definite)',
  'hvor': 'where · how (hvor er det …!)', 'bilen': 'the car', 'cyklerne': 'the bikes', 'vil': 'want(s), will', 'have': 'have', 'mig': 'me', 'kan': 'can', 'tror': 'think(s), believe(s)',
});
Object.assign(DICT, {
  // colours: every form
  'rød': 'red', 'rødt': 'red (et-word)', 'røde': 'red (plural, definite)', 'hvid': 'white', 'hvidt': 'white (et-word)', 'hvide': 'white (plural, definite)', 'sort': 'black', 'sorte': 'black (plural, definite)',
  'grøn': 'green', 'grønt': 'green (et-word)', 'gul': 'yellow', 'gult': 'yellow (et-word)', 'gule': 'yellow (plural, definite)', 'blå': 'blue (blå in the plural too)', 'blåt': 'blue (et-word)',
  'grå': 'grey (grå in the plural too)', 'gråt': 'grey (et-word)', 'brun': 'brown', 'brunt': 'brown (et-word)', 'brune': 'brown (plural, definite)', 'orange': 'orange (never changes)',
  'lyserød': 'pink', 'lyserødt': 'pink (et-word)', 'lyserøde': 'pink (plural, definite)', 'lilla': 'purple (never changes)', 'stribet': 'striped', 'stribede': 'striped (plural, definite)',
  'prikket': 'dotted', 'prikkede': 'dotted (plural, definite)', 'ternet': 'checked', 'ternede': 'checked (plural, definite)', 'farve': 'colour', 'farven': 'the colour', 'farver': 'colours', 'farverne': 'the colours',
  // furniture
  'sofa': 'sofa', 'lampe': 'lamp', 'lampen': 'the lamp', 'lænestol': 'armchair', 'lænestolen': 'the armchair', 'stol': 'chair', 'stolen': 'the chair', 'stole': 'chairs', 'bord': 'table', 'bordet': 'the table',
  'kommode': 'chest of drawers', 'kommoden': 'the chest of drawers', 'reol': 'bookcase', 'reolen': 'the bookcase', 'hylde': 'shelf', 'hylder': 'shelves', 'hylderne': 'the shelves', 'gardin': 'curtain',
  'gardiner': 'curtains', 'gardinerne': 'the curtains', 'pude': 'cushion, pillow', 'puder': 'cushions', 'puderne': 'the cushions', 'puden': 'the pillow, the cushion', 'tæppe': 'rug, blanket', 'tæppet': 'the rug',
  // Lektion 1 lines
  'munden': 'the mouth', 'varmt': 'warm (et-word)', 'start': 'start!', 'endelig': 'finally', 'vent': 'wait!', 'form': 'shape', 'overmorgen': 'the day after tomorrow (i overmorgen)', 'tørklæder': 'scarves',
  'lover': 'promise(s)', 'behold': 'keep! (imperative)', 'undskyld': 'sorry', 'steder': 'places (nogen steder: anywhere)', 'kolde': 'cold (plural)', 'ost': 'cheese', 'citron': 'lemon', 'pakke': 'pack · parcel',
  'klar': 'ready', 'godnat': 'good night',
});
Object.assign(VOCAB, {
  // butikker på Udsalgsgade (Lektion 2: placed with place words, like the buildings of Bydelen)
  toejbutik:     { da: 'en tøjbutik', en: 'a clothes shop', icon: 'jakke', set: 'sted', def: 'Et sted, hvor man kan købe tøj.' },
  genbrugsbutik: { da: 'en genbrugsbutik', en: 'a second-hand shop', icon: 'genbrug', set: 'sted', def: 'Et sted, hvor man kan købe brugt tøj og gamle ting.' },
  malerbutik:    { da: 'en malerbutik', en: 'a paint shop', icon: 'pensel', set: 'sted', def: 'Et sted, hvor man kan købe maling.' },
});
Object.assign(ART.ICONS, {
  genbrug: '<path d="M24 6 L32 18 H16Z"/><path d="M24 18 V12"/><path d="M8 36 L14 22 L20 32Z"/><path d="M40 36 L34 22 L28 32"/><path d="M14 40 H34"/><path d="M20 32 Q24 40 28 32" fill="none"/>',
  pensel: '<path d="M30 4 L44 18 L26 30 L18 22Z"/><path d="M18 22 L8 32 Q4 40 10 42 Q16 44 20 36 L26 30"/><path d="M34 10 L38 14"/>',
});
Object.assign(DICT, {
  // Lektion 2 · the sale street
  'sikke': 'what a … ! (Sikke en flot hue!)', 'orangt': '(not a word: orange never changes)', 'femoghalvfjerds': 'seventy-five', 'kroner': 'kroner (Danish money)', 'kr': 'kr. (kroner)', 'kostede': 'cost (past)',
  'niogtres': 'sixty-nine', 'femogtredive': 'thirty-five', 'halvfems': 'ninety', 'nioghalvfems': 'ninety-nine', 'nioghalvfjerds': 'seventy-nine', 'halvfjerds': 'seventy', 'fyrre': 'forty', 'tres': 'sixty',
  'halvtreds': 'fifty', 'hundrede': 'hundred', 'flot': 'lovely, good-looking', 'flotte': 'lovely (plural, definite)', 'smukt': 'beautiful (et-word)', 'smukke': 'beautiful (plural, definite)', 'pæn': 'nice, pretty',
  'pænt': 'nice (et-word)', 'pæne': 'nice (plural, definite)', 'lækker': 'lovely, delicious', 'lækre': 'lovely (plural, definite)', 'lækkert': 'lovely (et-word)', 'skoene': 'the shoes', 'prikker': 'dots',
  'malerbutikken': 'the paint shop', 'blomsterhandleren': 'the florist', 'supermarkedet': 'the supermarket', 'udsalg': 'sale', 'gaden': 'the street', 'købt': 'bought (har købt)', 'haft': 'had (har haft)',
  'yndlingsfarve': 'favourite colour', 'ligget': 'lain (har ligget)', 'male': 'paint', 'størrelser': 'sizes', 'faldet': 'fallen (er faldet)', 'butikkerne': 'the shops', 'sad': 'sat (past of sidde)', 'salg': 'sale (til salg: for sale)',
  'perfekt': 'perfect', 'tøjbutik': 'clothes shop', 'genbrugsbutik': 'second-hand shop', 'brugt': 'used, second-hand', 'malerbutik': 'paint shop', 'maling': 'paint',
});
Object.assign(DICT, {
  // Lektion 3 · the attic
  'kommodens': 'the chest of drawers’', 'fulde': 'full (plural)', 'overrasket': 'surprised', 'vild': 'wild (vild med: crazy about)', 'grim': 'ugly', 'enig': 'agreed (være enig: agree)', 'korte': 'short (plural, definite)',
  'lamper': 'lamps', 'bedst': 'best (kan bedst lide: like best)', 'lysegrøn': 'light green', 'nøglehul': 'keyhole', 'sorteres': 'be sorted', 'tungt': 'heavy (et-word)', 'kommet': 'come (er kommet)',
  'rydde': 'tidy (rydde op: tidy up)', 'åbnet': 'opened (har åbnet)', 'smide': 'throw (smide ud: throw out)', 'ske': 'happen', 'sommerhuset': 'the summer house', 'nederste': 'bottom (den nederste skuffe)',
  'skuffe': 'drawer', 'slet': 'at all (slet ikke: not at all)', 'sidst': 'last (til sidst: in the end)', 'tilpas': 'just right (lige tilpas)', 'hellere': 'rather (vil hellere)', 'genbrug': 'recycling, second-hand use',
  'beholde': 'keep', 'heroppe': 'up here', 'sortere': 'sort', 'nøglehullet': 'the keyhole', 'passede': 'looked after (past)', 'sendte': 'sent (past)', 'synker': 'sink(s)', 'samme': 'same', 'grønne': 'green (plural, definite)', 'stort': 'big (et-word)', 'store': 'big (plural, definite)', 'små': 'small (plural)', 'lille': 'small, little',
  'gammel': 'old', 'lang': 'long', 'langt': 'long (et-word)', 'lange': 'long (plural, definite)', 'kort': 'short · card · map', 'anden': 'other, another (en anden: somebody else)', 'perfekt': 'perfect',
});
