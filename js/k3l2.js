/* =========================================================================
   HERTIL · Kapitel 3 · Lektion 2 — "Hvor har du købt den henne?"   (Deroppe · Udsalget)
   Book 3.2: new clothes, praising them (Sikke en flot …! / Hvor er det …!), colours, adjective agreement
   (en rød hue, et rødt tørklæde, nogle røde sokker; blå/grå/orange/lilla), prices (Hvad kostede den?),
   et par, Er den ny? – Nej, den har jeg haft længe, and where you bought it (place words from Kapitel 1).
   Physics: below the house lies Udsalgsgade, a street on permanent sale. Farvebøtten has spilled, so every colour
   slides off its thing unless it has the right ending. A compliment holds things up. Kassen has lost its numbers.
   The shops have been shuffling since the sale started; place words pin them.
   Chapter thread (spoilers, never tell Bruno): the price tag that fell off something belongs to the player's coat.
   The coat was bought second-hand at Retro, long ago, before Hertil.
   ========================================================================= */

const BUY = { Bhue: ['hoved', 'femoghalvfjerds'], Btoerkl: ['hals', 'femogtredive'], Bstoevler: ['fod', 'tre hundrede'] };
// the thing you bought today (or, failing that, what you are most obviously wearing)
const bought8 = G => { const w = G.wear || {}; const f = Object.keys(BUY).find(k => G.flags[k]); return (f && w[BUY[f][0]]) || w.fod || w.hals || w.hoved || w.frakke || COAT0; };
const cap1 = s => s.charAt(0).toUpperCase() + s.slice(1);

SESSIONS.k3l2 = Object.assign({}, D3, {
  id: 'k3l2', order: 8, short: 'K3 · Lektion 2', prevSession: 'k3l1', nextSession: 'k3l3', title: 'Lektion 2 · Hvor har du købt den henne?', en: 'Where did you buy it?',
  blurb: 'Below the house a street has opened. Everything in it is on sale, and the colours are running away.',
  start: 'p8_ned', home: 'sove', travelAfter: 'p8seen', cluesFlag: 'clues8', cluesNeed: 3, dcMod: 3,
  startState: { resp: 8, sk: 14, insp: 1, boons: ['anker', 'hue', 'egen'], statXP: { SPROG: 25, LOEGN: 8, SNIGE: 10, HANDEL: 9, INDSIGT: 19 },
    origin: { reason: 'Jeg kom hertil på grund af en lyd.', work: 'Jeg læser til arkitekt på universitetet.', wear3: 'Jeg har en frakke på, men den er ikke min.' },
    wear: { frakke: COAT0, krop: { k: 'troeje', c: 'stribet', p: 'blaa' } }, met: ['skab', 'vask', 'stoev', 'koel'] },
  lintWear: [{ frakke: COAT0 }, { frakke: { k: 'frakke', c: 'roed', fit: 'lidt' }, hoved: { k: 'hue', c: 'gul' } }, { frakke: { k: 'frakke', c: 'blaa', fit: 'stor' }, hals: { k: 'toerkl', c: 'groen' }, krop: { k: 'troeje', c: 'stribet', p: 'blaa' } },
    { frakke: { k: 'frakke', c: 'stribet', p: 'roed', fit: 'lidt' }, fod: { k: 'stoevler', c: 'sort' }, hoved: { k: 'hue', c: 'roed' } }],

  locations: {
    sove:   { name: 'Soveværelset', en: '1. sal · your bed', x: 26, y: 37, bg: 'sove3', icon: 'seng', night: true, entry: G => 'sove8_hub' },
    gangen: { name: 'Gangen', en: 'Skabet and the stairs', x: 50, y: 55, bg: 'gang3', icon: 'knage', entry: G => 'gang8_hub' },
    loppe:  { name: 'Loppemarkedet', en: 'in the garage, only once', x: 74, y: 72, bg: 'loppe3', icon: 'kurv', eph: true, req: G => G.flags.Astart && !G.flags.loppeGone, entry: G => 'loppe8' },
    butik:  { name: 'Top Tøj', en: 'Kassen rings', x: 18, y: 87, bg: 'butik3', icon: 'jakke', entry: G => !G.flags.Bstart ? 'b8_start' : 'butik_hub' },
    retro:  { name: 'Retro', en: 'a window with four dummies', x: 50, y: 92, bg: 'vindue3', icon: 'genbrug', entry: G => !G.flags.Cstart ? 'c8_start' : 'retro_hub' },
    maler:  { name: 'Malerbutikken', en: 'the colours are running', x: 82, y: 87, bg: 'maler3', icon: 'pensel', entry: G => !G.flags.Astart ? 'a8_start' : 'maler_hub' },
  },

  ending: G => [G.flags.Aroed ? 'Rød frakke' : G.flags.Ablaa ? 'Blå frakke' : G.flags.Astrib ? 'Stribet frakke' : null,
    G.flags.Bhue ? 'Gul hue' : G.flags.Btoerkl ? 'Grønt tørklæde' : G.flags.Bstoevler ? 'Sorte støvler' : null,
    G.flags.Chjem ? 'Mærket kom hjem' : G.flags.Cfri ? 'Ikke til salg' : null].filter(Boolean).join(' · ') || '—',
  carryFlags: ['Aroed', 'Ablaa', 'Astrib', 'Bhue', 'Btoerkl', 'Bstoevler', 'Chjem', 'Cfri'],
  next: 'Lektion 3 · Kan du ikke lide den hvide lampe? The house is too full now. Somebody in the attic has opinions, and the attic door has opened.',

  quests: {
    A: { title: 'Farverne', en: 'The colours', obj: [['Give the colours back their endings (Malerbutikken)', 'endelseDone'], ['Help Farvebøtten up', 'Astand'], ['Choose a colour for your coat', 'Adone']] },
    B: { title: 'Kassen', en: 'The till', obj: [['Find what the customers want (Top Tøj)', 'huntDone8'], ['Give Kassen its numbers back', 'priserDone'], ['Buy something to wear', 'Bdone']] },
    C: { title: 'Prismærket', en: 'The price tag', obj: [['Find out which dummy in Retro’s window lost a tag', 'dukkerDone'], ['Put the shops on Udsalgsgade back where they belong', 'gadeDone'], ['Answer the label in your coat', 'Cdone']] },
    F: { title: 'Vinduet', en: 'The window', obj: [['Stand in Retro’s window for a night (after the colours, Kassen and the tag)', 'Fdone']] },
    S1: { title: 'Loppemarkedet', en: 'The flea market', side: true, obj: [['Haggle with compliments (Loppemarkedet)', 'sikkeDone']] },
    S2: { title: 'Spor', en: 'Traces', side: true, obj: [['Find three traces of what you were', 'clues8']] },
  },

  glimpses: {
    farve: { name: 'Foret', en: 'The lining', text: 'The paint takes everywhere except the lining. The lining stays the colour it always was: a colour that is on none of the tins in the shop. The colour of somewhere else.' },
    kvittering: { name: 'Kvitteringen', en: 'The receipt', text: 'On the back of the tag, in pencil: RETRO · 1 FRAKKE · BETALT. Under it, a date, rubbed out by a thumb, many times, as if somebody had wanted to forget when.' },
    vindue: { name: 'Spejlbilledet', en: 'The reflection', text: 'In Retro’s window, for a second, your reflection is standing on the other side of the glass, outside, looking in at the coat, deciding.' },
    skilt: { name: 'Gadeskiltet', en: 'The street sign', text: 'Under the sign KNAPGADE someone has scratched a small arrow pointing up at the house. The scratch is old. Your fingernail fits it.' },
    kasse: { name: 'Kassen med ting', en: 'A box of things', text: 'Under the last table: a cardboard box of odds and ends. One glove, a button, a map of Hertil drawn from above. Somebody’s things. On the side, a shape instead of a name.' },
  },

  boxes: {
    endelse: { title: 'Farverne', q: 'Hvilken form?', boxes: ['a', 'b', 'c'],
      good: 'Every colour climbs back up onto its thing and stays there, glossy and pleased with itself.', meh: 'Most colours climb back. A blue is still sitting in the gutter, thinking about it.',
      items: [
        { t: 'Sikke en ___ hue! (rød)', opts: ['rød', 'rødt', 'røde'], a: 0, why: 'en hue: no ending. En rød hue.' },
        { t: 'Sikke et ___ tørklæde! (rød)', opts: ['rødt', 'rød', 'røde'], a: 0, why: 'et tørklæde: + t. Et rødt tørklæde.' },
        { t: 'Sikke nogle ___ sokker! (rød)', opts: ['røde', 'rød', 'rødt'], a: 0, why: 'Plural: + e. Nogle røde sokker.' },
        { t: 'Jeg har et ___ slips. (blå)', opts: ['blåt', 'blå'], a: 0, why: 'blå takes -t with et-words: et blåt slips.' },
        { t: 'Mine sko er ___. (blå)', opts: ['blå', 'blåt'], a: 0, why: 'blå gets no -e in the plural: de er blå.' },
        { t: 'Hun har en ___ kjole på. (orange)', opts: ['orange', 'orangt'], a: 0, why: 'orange never changes.' },
        { t: 'Det er et ___ tæppe. (stribet)', opts: ['stribet', 'stribede'], a: 0, why: 'An et-word gets no extra -t after -et: et stribet tæppe.' },
        { t: 'Sikke nogle ___ bukser! (prikket)', opts: ['prikkede', 'prikket'], a: 0, why: 'Plural: -et becomes -ede. Prikkede bukser.' },
      ] },
    priser: { title: 'Kassens tal', q: 'Hvad koster det?', boxes: ['a', 'b', 'c'],
      good: 'Kassen’s display lights up with real numbers. It rings itself, twice, just to hear it.', meh: 'Kassen has most of its numbers back. It still thinks seventeen is a colour.',
      items: [
        { t: 'Hvad koster huen? – Den koster femoghalvfjerds kroner.', opts: ['75 kr.', '57 kr.', '95 kr.'], a: 0, why: 'femoghalvfjerds = 5 and 70 (halvfjerds).' },
        { t: 'Hvad kostede slipset? – Det kostede niogtres kroner.', opts: ['69 kr.', '96 kr.', '39 kr.'], a: 0, why: 'niogtres = 9 and 60 (tres).' },
        { t: 'Hvad koster tørklædet? – Det koster femogtredive kroner.', opts: ['35 kr.', '53 kr.', '25 kr.'], a: 0, why: 'femogtredive = 5 and 30.' },
        { t: 'Kjolen kostede halvfems kroner.', opts: ['90 kr.', '50 kr.', '70 kr.'], a: 0, why: 'halvfems = 90. (halvtreds = 50, halvfjerds = 70)' },
        { t: 'Hvad koster frakken? (99 kr.)', opts: ['nioghalvfems kroner', 'nioghalvfjerds kroner', 'niogtres kroner'], a: 0, why: '99 = 9 and 90: nioghalvfems.' },
        { t: 'Hvad koster bæltet? (60 kr.)', opts: ['tres kroner', 'seksten kroner', 'halvfjerds kroner'], a: 0, why: '60 = tres.' },
        { t: 'Støvlerne koster tre hundrede kroner.', opts: ['300 kr.', '30 kr.', '3000 kr.'], a: 0, why: 'tre hundrede = 300.' },
        { t: 'Hvad kostede solbrillerne? (240 kr.)', opts: ['to hundrede og fyrre kroner', 'fire hundrede og tyve kroner', 'to hundrede og fire kroner'], a: 0, why: '240 = to hundrede og fyrre.' },
      ] },
    sikke: { title: 'Loppemarkedet', q: 'Ros det rigtigt', boxes: ['a', 'b', 'c'],
      good: 'Every seller blushes and halves the price. One gives you something for free, just for the grammar.', meh: 'Most sellers blush. One is offended by an ending and puts its prices up.',
      items: [
        { t: 'Sikke ___ flot lampe!', opts: ['en', 'et', 'nogle'], a: 0, why: 'en lampe: Sikke en …' },
        { t: 'Sikke ___ flot ur!', opts: ['et', 'en', 'nogle'], a: 0, why: 'et ur: Sikke et …' },
        { t: 'Sikke ___ flotte sko!', opts: ['nogle', 'en', 'et'], a: 0, why: 'Plural: Sikke nogle …' },
        { t: 'Hvor er det ___ smukt tørklæde!', opts: ['et', 'en', 'nogle'], a: 0, why: 'et tørklæde: Hvor er det et …' },
        { t: 'Sikke en ___ hat! (smuk)', opts: ['smuk', 'smukt', 'smukke'], a: 0, why: 'en hat: no ending.' },
        { t: 'Sikke et ___ bord! (pæn)', opts: ['pænt', 'pæn', 'pæne'], a: 0, why: 'et bord: + t. Et pænt bord.' },
        { t: 'Sikke nogle ___ handsker! (lækker)', opts: ['lækre', 'lækker', 'lækkert'], a: 0, why: 'lækker loses its last e before the ending: lækre.' },
        { t: 'Hvor er det et ___ kamera! (lille)', opts: ['lille', 'små'], a: 0, why: 'lille never changes in the singular. små is the plural.' },
      ] },
  },

  hunts: {
    butik: { title: 'Kundernes ønsker', en: 'Find what the customers want', find: ['frakke', 'kasket', 'slips', 'skjorte', 'kjole', 'nederdel'], decoys: ['jakke', 'bukser', 'sko3', 'stoevler', 'solbril', 'sokker3'] },
  },

  guess: {
    dukker: { title: 'Dukkerne i vinduet', pool: ['dukke1', 'dukke2', 'dukke3', 'dukke4'],
      end: r => r >= 3 ? 'Every dummy in the window still has its own tag. The lost one belongs to something else.' : 'You get a few of them mixed up. The dummies do not mind. They are used to being mistaken for each other.',
      rounds: [
        { npc: 'dukke1', lines: ['Den har en lyserød hue og et grønt tørklæde på.', 'Kjolen er blå.', 'Skoene er sorte.'], words: ['f_lyseroed', 'f_groen'] },
        { npc: 'dukke2', lines: ['Den har ikke nogen hue på.', 'Den har en orange kjole med hvide prikker.', 'Skoene er lyserøde.'], words: ['f_orange', 'f_prikket'] },
        { npc: 'dukke3', lines: ['Den har en blå hue på.', 'Kjolen er stribet.', 'Den har et par grønne sko på.'], words: ['f_blaa', 'f_stribet'] },
        { npc: 'dukke4', lines: ['Den har solbriller og et lyserødt tørklæde på.', 'Kjolen er grøn.', 'Skoene er orange.'], words: ['solbril', 'f_groen'] },
      ] },
  },

  places: {
    gade: { title: 'Udsalgsgade', q: 'Hvor ligger den?', street: 'UDSALGSGADE', cross: 'KNAPGADE', flag: 'gadeDone',
      names: { cafe: 'Caféen', toejbutik: 'Top Tøj', skobutik: 'Seje Sko', genbrugsbutik: 'Retro', malerbutik: 'Malerbutikken', blomsterhandler: 'Blomster', supermarked: 'Supermarkedet' },
      start: { 0: 'cafe' },
      good: 'The shops stop sliding about and settle on their foundations with a bump. Udsalgsgade looks like a street again.', meh: 'Most shops settle. One keeps edging toward the corner, hoping nobody notices.',
      rounds: [
        { k: 'toejbutik', at: 3, clue: 'Top Tøj ligger på hjørnet af Udsalgsgade og Knapgade, på samme side som caféen.', why: 'på hjørnet af: on the corner where the two streets meet.' },
        { k: 'skobutik', at: 7, clue: 'Seje Sko ligger lige overfor Top Tøj.', why: 'lige overfor: right across the street.' },
        { k: 'genbrugsbutik', at: 1, clue: 'Retro ligger ved siden af caféen.', why: 'ved siden af: next to it, on the same side.' },
        { k: 'malerbutik', at: 5, clue: 'Malerbutikken ligger lige overfor Retro.', why: 'lige overfor Retro: across the street from it.' },
        { k: 'blomsterhandler', at: 6, clue: 'Blomsterhandleren ligger ved siden af Seje Sko.', why: 'ved siden af Seje Sko: next to it.' },
        { k: 'supermarked', at: 4, clue: 'Supermarkedet ligger lige overfor caféen.', why: 'lige overfor caféen: across from the café.' },
      ] },
  },

  travel: [
    { id: 'maerker8', bg: 'gade3', steps: [{ n: 'A flock of price tags flutters down Udsalgsgade, each one shouting a different number. A few land on you and peel off again, disappointed.' }],
      opts: [{ kind: 'act', stat: 'SNIGE', dc: 9, label: 'Catch one.', ok: [{ n: 'It says 0 KR. You pocket it. It feels like a small fortune.' }, { fx: { sk: 2 } }], fail: [{ n: 'They scatter like pigeons and regroup on a lamp post, sulking.' }], next: 'map' }, { kind: 'go', label: 'Walk through them.', next: 'map' }] },
    { id: 'vogn8', bg: 'gade3', steps: [{ n: 'An empty shopping trolley rolls past at speed, steering itself, with one wonky wheel that sings.' }],
      opts: [{ kind: 'go', group: 'v', label: 'Jump in.', fx: { insp: 1 }, next: 'map' }, { kind: 'go', group: 'v', label: 'Let it pass.', next: 'map' }] },
    { id: 'skab8', bg: 'gade3', npc: 'skab', req: G => G.flags.p8seen, steps: [{ n: 'High above the street, Skabet is leaning out of the front door of the house, waving a sock like a flag.' }, { say: 'skab', da: 'Husk at købe mælk!', en: 'Remember to buy milk!' }],
      opts: [{ kind: 'reply', group: 's', da: 'Det skal jeg nok!', ok: [{ n: 'A tiny knot ties itself round your finger. Milk, then.' }], next: 'map' }, { kind: 'go', group: 's', label: 'Wave back.', next: 'map' }] },
    { id: 'skilt8', bg: 'gade3', steps: [{ n: 'A sandwich board on the pavement is arguing with itself. One side says ALT SKAL VÆK. The other side says NEJ.' }],
      opts: [{ kind: 'go', label: 'Walk on before it asks you to decide.', next: 'map' }] },
    { id: 'post8', bg: 'gade3', req: G => G.prev.Cro || G.prev.Cfind, steps: [{ n: G => G.prev.Cfind ? 'Støvsugeren comes trundling down the stairs from the house, nose to the pavement, and drops a coin at your feet. Then it goes back up.' : 'From an open window above the street comes the sound of nothing: Støvsugeren, resting. The whole street seems quieter for it.' }],
      opts: [{ kind: 'go', label: 'Walk on.', fx: { sk: 1 }, next: 'map' }] },
    { id: 'tal8', bg: 'gade3', req: G => !hasBoon('urnoegle'), steps: [{ n: 'Every price on Udsalgsgade turns over at once. The other side is not numbers.' }, { special: 'glyphs' }], opts: [{ kind: 'go', label: 'Walk on anyway.', next: 'map' }] },
  ],

  special: {
    async arrive8() { logAdd(`<p>${esc(G.newPlace ? 'Your weight stayed behind on the staircase. Down here you will have to earn it again.' : 'The house knows you now. The street below does not, yet.')}</p>`, 'thought'); await tapOn(); },
    async gang8Line() {
      logAdd(`<p>${esc(G.flags.Fdone ? 'Skabet is asleep. Your coat hook is empty: the coat is out, being looked at.' : pick(['Skabet holds the front door open with one leg, so the house can hear the sale.', 'Skabet is ironing a sock with its door.']))}</p>`, 'narr');
      const c = wearComment(G); if (c && Math.random() < .7) { sayEntry({ say: 'skab', da: c, en: 'It likes what you are wearing.' }); await tapOn(); }
    },
    async maler8Line() { logAdd(`<p>${esc(G.flags.Adone ? 'Farvebøtten is painting the pavement outside in stripes, for fun.' : G.flags.Astand ? 'Farvebøtten stands upright, brush in hand, eyeing your coat.' : G.flags.endelseDone ? 'The colours are back on their things. Farvebøtten is still lying on its side, sighing.' : 'Colours pour out of the tipped tin and run off down the street.')}</p>`, 'narr'); },
    async butik8Line() { logAdd(`<p>${esc(G.flags.Bdone ? 'Kassen rings up a customer who is mostly a hat. Ka-ching. It sounds happy.' : G.flags.priserDone ? 'Kassen’s display shows real numbers now. It is very proud of a 7.' : 'Kassen’s display says ? KR. Customers stand in line with clothes and no prices.')}</p>`, 'narr'); },
    async retro8Line() { logAdd(`<p>${esc(G.flags.Fdone ? 'Retro’s window has four dummies in it again. One of them looks a bit like you.' : G.flags.Cdone ? 'Behind Retro’s window the dummies are swapping scarves, as they do every hour.' : 'Four dummies pose in Retro’s window. A price tag spins on the pavement in front, lost.')}</p>`, 'narr'); },
    async recolor(c) {
      const f = (G.wear || {}).frakke || COAT0;
      fx({ wear: { frakke: Object.assign({}, f, { c, p: c === 'stribet' ? 'roed' : undefined }) } });
      AUDIO.sting('win');
    },
    async praise() {
      const it = bought8(G), g = CLOTHES[it.k].g, ny = { en: 'ny', et: 'nyt', pl: 'nye' }[g];
      sayEntry({ say: 'dukke', da: `${W.sikke(it)} Er ${W.pron(g)} ${ny}?`, en: 'What a lovely thing! Is it new?' }); await tapOn();
    },
    async askPrice() { const g = CLOTHES[bought8(G).k].g; sayEntry({ say: 'dukke', da: `Hvad kostede ${W.pron(g)}?`, en: 'What did it cost?' }); await tapOn(); },
    async askWhere() { const g = CLOTHES[bought8(G).k].g; sayEntry({ say: 'dukke', da: `Og hvor har du købt ${W.obj(g)} henne?`, en: 'And where did you buy it?' }); await tapOn(); },
    async kaching() { AUDIO.sting('kaching'); },
    async glyphs() { G.glyph = 3; AUDIO.sting('glyph'); toast('ᚦᚨᛚ · the numbers have gone strange', 'gold'); },
  },

  nodes: {
    /* ===== PROLOGUE: down to the street ===== */
    p8_ned: { bg: 'gang3', npc: 'skab', title: 'Gangen', card: ['Kapitel 3 · Nyt og gammelt', 'Lektion 2 — Hvor har du købt den henne?'],
      steps: [
        { n: 'Morning. Skabet holds the front door open with one leg. Below the house, the street is already shouting.' },
        { say: 'skab', da: 'God morgen! Der er udsalg nede på gaden. Skal du ikke ned og se?', en: 'Good morning! There is a sale down on the street. Aren’t you going down to look?' },
        { th: 'The label in your coat rustles. “Hvor har du købt den henne?” Nobody in the house knows.' },
        { special: 'arrive8' },
      ],
      opts: [{ kind: 'go', label: 'Go down the stairs.', next: 'p8_gade' }] },
    p8_gade: { bg: 'gade3', title: 'Udsalgsgade', card: ['Udsalgsgade', 'everything must go'],
      steps: [
        { n: 'The stairs down to the street are made of price tags, and every one of them crackles underfoot.' },
        { n: 'Udsalgsgade. Every shop open, every sign shouting. And the colours are coming loose: a red runs down a wall into the gutter, a coat on a rack goes grey while you watch.' },
        { th: 'Somewhere down the street a till is ringing up the air. A price tag spins on the pavement, lost.' },
        { fx: { quest: ['A', 'B', 'C', 'F', 'S2'], flag: 'p8seen' } },
      ],
      opts: [{ kind: 'go', label: 'Go.', next: 'map' }] },

    /* ===== GANGEN and the bedroom ===== */
    gang8_hub: { bg: 'gang3', npc: 'skab', title: 'Gangen', hub: true,
      steps: [{ special: 'gang8Line' }],
      opts: [
        { kind: 'reply', once: true, da: 'Hvor har jeg købt min frakke?', ok: [{ say: 'skab', da: 'Din frakke? Den har jeg haft længe. Hvor du har købt den, ved jeg ikke.', en: 'Your coat? I have had it a long time. Where you bought it, I don’t know.' }, { th: 'It said “I have had it”. Not “you”.' }] },
        { kind: 'go', special: 'wardrobe', label: 'Look at yourself in the hall mirror.' },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    sove8_hub: { bg: 'sove3', title: 'Soveværelset', hub: true, idle: true, home: true,
      steps: [{ n: G => G.flags.Fdone ? 'Your bed. Empty all night: you were standing in a shop window.' : pick(['Your bed. The street’s noise comes up through the floor like warm air.', 'Your bedroom. Somebody has left a price tag on the pillow: 0 KR.']) }],
      opts: [
        { kind: 'go', special: 'selfPlate', label: 'Look at yourself.' },
        { kind: 'go', label: 'Sleep. Let the marks settle.', next: 'sleep' },
        { kind: 'go', label: 'Go out.', next: 'map' },
      ] },

    /* ===== MALERBUTIKKEN: contract A ===== */
    a8_start: { bg: 'maler3', npc: 'boette', title: 'Malerbutikken', card: ['Malerbutikken', 'the colours are running'],
      steps: [
        { n: 'A paint shop. Tins on every shelf, and on the floor a big tin lying on its side, pouring. The colours run out of the door in rivers.' },
        { say: 'boette', da: 'Hjælp! Farverne løber væk! De vil ikke blive på tingene!', en: 'Help! The colours are running away! They won’t stay on things!' },
        { th: 'A red slides off a scarf like water off a duck. It does not know whether it is rød, rødt or røde.' },
        { fx: { flag: 'Astart', quest: ['S1'] } },
      ],
      opts: [{ kind: 'act', special: 'boxes:endelse', label: 'Give each colour its ending.', next: 'a8_fixed' }] },
    maler_hub: { bg: 'maler3', npc: 'boette', title: 'Malerbutikken', hub: true,
      steps: [{ special: 'maler8Line' }],
      opts: [
        { kind: 'act', special: 'boxes:endelse', label: 'Give each colour its ending.', req: G => !G.flags.endelseDone, next: 'a8_fixed', mark: true },
        { kind: 'go', label: 'Help Farvebøtten up.', req: G => G.flags.endelseDone && !G.flags.Astand, next: 'a8_fixed', mark: true },
        { kind: 'go', label: 'Ask for your coat to be painted.', req: G => G.flags.Astand && !G.flags.Adone, next: 'a8_up', mark: true },
        { kind: 'reply', once: true, req: G => G.flags.Adone, da: 'Hvad er din yndlingsfarve?', ok: [{ say: 'boette', da: 'Den næste. Altid den næste.', en: 'The next one. Always the next one.' }] },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    a8_fixed: { bg: 'maler3', npc: 'boette', title: 'Malerbutikken',
      steps: [
        { n: G => (G.flags.endelseScore || 0) >= 6 ? 'Each colour flows back up onto its thing and stays there, glossy.' : 'Most colours flow back up onto their things. A blue sits in the gutter, thinking about it.' },
        { say: 'boette', da: 'Tak! Men jeg kan ikke rejse mig. Jeg har ligget her i tre dage.', en: 'Thanks! But I can’t get up. I have been lying here for three days.' },
        { th: 'In Deroppe, a compliment works like a hand under the arm.' },
      ],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 10, group: 's', label: 'Praise its colour.', build: { en: 'What a lovely colour!', answers: [['Sikke', 'en', 'flot', 'farve!']], tiles: ['Sikke', 'en', 'flot', 'farve!', 'et', 'nogle', 'flotte'] },
          ok: [{ n: 'Farvebøtten rights itself with a slosh.' }], fail: [{ n: 'You mumble it, but “flot” gets through. That is enough: the tin wobbles upright.' }], next: 'a8_up' },
        { kind: 'go', group: 's', label: 'Leave it lying for now.', next: 'map' },
      ] },
    a8_up: { bg: 'maler3', npc: 'boette', title: 'Malerbutikken',
      steps: [
        { n: 'Farvebøtten stands up straight and blushes a deeper magenta.' },
        { fx: { flag: 'Astand', resp: 1 } },
        { say: 'boette', da: 'Nu kan jeg male igen. Din frakke er så grå. Hvad for en farve vil du have?', en: 'Now I can paint again. Your coat is so grey. What colour would you like?' },
      ],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'c', label: 'Ask for a red coat.', build: { en: 'I would like a red coat.', answers: [['Jeg', 'vil', 'gerne', 'have', 'en', 'rød', 'frakke.']], tiles: ['Jeg', 'vil', 'gerne', 'have', 'en', 'rød', 'frakke.', 'rødt', 'røde'] },
          ok: [{ n: 'The brush goes up.' }], fail: [{ n: 'A drip lands on the word “frakke”, but Farvebøtten heard “rød”.' }], next: 'a8_roed' },
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'c', label: 'Ask for a blue coat.', build: { en: 'I would like a blue coat.', answers: [['Jeg', 'vil', 'gerne', 'have', 'en', 'blå', 'frakke.']], tiles: ['Jeg', 'vil', 'gerne', 'have', 'en', 'blå', 'frakke.', 'blåt', 'et'] },
          ok: [{ n: 'The brush goes up.' }], fail: [{ n: 'You stumble, but “blå” is a word paint understands.' }], next: 'a8_blaa' },
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'c', label: 'Ask for a striped coat.', build: { en: 'I would like a striped coat.', answers: [['Jeg', 'vil', 'gerne', 'have', 'en', 'stribet', 'frakke.']], tiles: ['Jeg', 'vil', 'gerne', 'have', 'en', 'stribet', 'frakke.', 'stribede', 'et'] },
          ok: [{ n: 'Two brushes go up.' }], fail: [{ n: 'The sentence comes out crooked. So do the first stripes. The rest are perfect.' }], next: 'a8_strib' },
      ] },
    a8_roed: { bg: 'maler3', npc: 'boette', title: 'Malerbutikken',
      steps: [{ special: 'recolor:roed' }, { n: 'Three strokes, and your coat is red as a postbox. It holds the colour like it was always meant to.' }, { glimpse: 'farve' }, { fx: { boon: 'roedfrakke', flag: 'Aroed', resp: 2 } }, { fx: { flag: 'Adone' } }],
      opts: [{ kind: 'go', label: 'Walk out red.', next: 'map' }] },
    a8_blaa: { bg: 'maler3', npc: 'boette', title: 'Malerbutikken',
      steps: [{ special: 'recolor:blaa' }, { n: 'Your coat turns the deep blue of the sky above Deroppe at Natlager. It holds the colour like it was always meant to.' }, { glimpse: 'farve' }, { fx: { boon: 'blaafrakke', flag: 'Ablaa', resp: 2 } }, { fx: { flag: 'Adone' } }],
      opts: [{ kind: 'go', label: 'Walk out blue.', next: 'map' }] },
    a8_strib: { bg: 'maler3', npc: 'boette', title: 'Malerbutikken',
      steps: [{ special: 'recolor:stribet' }, { n: 'Red and white stripes run round your coat like a lighthouse. It holds them like it was always meant to.' }, { glimpse: 'farve' }, { fx: { boon: 'stribfrakke', flag: 'Astrib', resp: 2 } }, { fx: { flag: 'Adone' } }],
      opts: [{ kind: 'go', label: 'Walk out striped.', next: 'map' }] },

    /* ===== TOP TØJ: contract B ===== */
    b8_start: { bg: 'butik3', npc: 'kasse', title: 'Top Tøj', card: ['Top Tøj', 'Kassen rings'],
      steps: [
        { n: 'A clothes shop. Racks swing on their own. Behind the counter, a cash register is ringing up the air.' },
        { say: 'kasse', da: 'Velkommen! Alt er på udsalg! Men jeg kan ikke finde mine tal.', en: 'Welcome! Everything is on sale! But I can’t find my numbers.' },
        { th: 'Its display says ? KR. A queue of customers who are mostly coats waits with their arms full.' },
        { fx: { flag: 'Bstart' } },
      ],
      opts: [{ kind: 'go', label: 'Look around.', next: 'butik_hub' }] },
    butik_hub: { bg: 'butik3', npc: 'kasse', title: 'Top Tøj', hub: true,
      steps: [{ special: 'butik8Line' }],
      opts: [
        { kind: 'act', special: 'hunt:butik', label: 'Find what the customers are asking for.', req: G => !G.flags.huntDone8, next: 'b8_found', mark: true },
        { kind: 'act', special: 'boxes:priser', label: 'Give Kassen its numbers back.', req: G => G.flags.huntDone8 && !G.flags.priserDone, next: 'b8_priced', mark: true },
        { kind: 'go', label: 'Buy something to wear.', req: G => G.flags.priserDone && !G.flags.Bdone, next: 'b8_buy', mark: true },
        { kind: 'reply', once: true, da: 'Har I noget til mig?', ok: [{ say: 'kasse', da: 'Til dig? Vi har alt. I alle størrelser. Næsten.', en: 'For you? We have everything. In every size. Almost.' }] },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    b8_found: { bg: 'butik3', npc: 'kasse', title: 'Top Tøj',
      steps: [{ n: 'The customers leave with what they wanted, mostly wearing each other.' }, { fx: { flag: 'huntDone8', sk: 3, resp: 1 } }],
      opts: [{ kind: 'go', label: 'Back.', next: 'butik_hub' }] },
    b8_priced: { bg: 'butik3', npc: 'kasse', title: 'Top Tøj',
      steps: [{ say: 'kasse', da: 'Femoghalvfjerds kroner! Femogtredive! Tre hundrede! Jeg kan tælle igen!', en: 'Seventy-five! Thirty-five! Three hundred! I can count again!' }, { special: 'kaching' }, { fx: { resp: 1 } }],
      opts: [{ kind: 'go', label: 'Back.', next: 'butik_hub' }] },
    b8_buy: { bg: 'butik3', npc: 'kasse', title: 'Top Tøj',
      steps: [{ say: 'kasse', da: 'Og du? Hvad vil du gerne købe?', en: 'And you? What would you like to buy?' }],
      opts: [
        { kind: 'say', stat: 'HANDEL', dc: 10, group: 'b', label: 'Buy a yellow woolly hat.', build: { en: 'I would like to buy a yellow woolly hat.', answers: [['Jeg', 'vil', 'gerne', 'købe', 'en', 'gul', 'hue.']], tiles: ['Jeg', 'vil', 'gerne', 'købe', 'en', 'gul', 'hue.', 'gult', 'gule'] },
          ok: [{ say: 'kasse', da: 'Den koster femoghalvfjerds kroner. Men for dig: tre skæl.', en: 'It costs seventy-five kroner. But for you: three scales.' }], fail: [{ say: 'kasse', da: 'En hue? Gul? Det bliver tre skæl.', en: 'A hat? Yellow? That will be three scales.' }], next: 'b8_hue' },
        { kind: 'say', stat: 'HANDEL', dc: 10, group: 'b', label: 'Buy a green scarf.', build: { en: 'I would like to buy a green scarf.', answers: [['Jeg', 'vil', 'gerne', 'købe', 'et', 'grønt', 'tørklæde.']], tiles: ['Jeg', 'vil', 'gerne', 'købe', 'et', 'grønt', 'tørklæde.', 'grøn', 'grønne'] },
          ok: [{ say: 'kasse', da: 'Det koster femogtredive kroner. Men for dig: tre skæl.', en: 'It costs thirty-five kroner. But for you: three scales.' }], fail: [{ say: 'kasse', da: 'Et tørklæde? Grønt? Det bliver tre skæl.', en: 'A scarf? Green? That will be three scales.' }], next: 'b8_toerkl' },
        { kind: 'say', stat: 'HANDEL', dc: 10, group: 'b', label: 'Buy a pair of black boots.', build: { en: 'I would like to buy a pair of black boots.', answers: [['Jeg', 'vil', 'gerne', 'købe', 'et', 'par', 'sorte', 'støvler.']], tiles: ['Jeg', 'vil', 'gerne', 'købe', 'et', 'par', 'sorte', 'støvler.', 'sort', 'en'] },
          ok: [{ say: 'kasse', da: 'De koster tre hundrede kroner. Men for dig: tre skæl.', en: 'They cost three hundred kroner. But for you: three scales.' }], fail: [{ say: 'kasse', da: 'Støvler? Sorte? Det bliver tre skæl.', en: 'Boots? Black? That will be three scales.' }], next: 'b8_stoevler' },
      ] },
    b8_hue: { bg: 'butik3', npc: 'kasse', title: 'Top Tøj',
      steps: [{ special: 'kaching' }, { fx: { sk: -3, wear: { hoved: { k: 'hue', c: 'gul' } } } }, { n: 'Kassen wraps nothing, because you put the hat straight on. It is the yellow of a lemon that has been told a joke.' }, { fx: { boon: 'kvittering', flag: 'Bhue', resp: 2 } }, { fx: { flag: 'Bdone' } }],
      opts: [{ kind: 'go', label: 'Leave, warm-eared.', next: 'map' }] },
    b8_toerkl: { bg: 'butik3', npc: 'kasse', title: 'Top Tøj',
      steps: [{ special: 'kaching' }, { fx: { sk: -3, wear: { hals: { k: 'toerkl', c: 'groen' } } } }, { n: 'The scarf winds itself round your neck twice and leaves a tail hanging, for style.' }, { fx: { boon: 'kvittering', flag: 'Btoerkl', resp: 2 } }, { fx: { flag: 'Bdone' } }],
      opts: [{ kind: 'go', label: 'Leave, wrapped up.', next: 'map' }] },
    b8_stoevler: { bg: 'butik3', npc: 'kasse', title: 'Top Tøj',
      steps: [{ special: 'kaching' }, { fx: { sk: -3, wear: { fod: { k: 'stoevler', c: 'sort' } } } }, { n: 'The boots are heavy and shiny. Every step on the pavement sounds like a decision.' }, { fx: { boon: 'kvittering', flag: 'Bstoevler', resp: 2 } }, { fx: { flag: 'Bdone' } }],
      opts: [{ kind: 'go', label: 'Stomp out.', next: 'map' }] },

    /* ===== RETRO: contract C, and the finale ===== */
    c8_start: { bg: 'vindue3', npc: 'maerke', title: 'Retro', card: ['Retro', 'a window with four dummies'],
      steps: [
        { n: 'A shop for old things, with a big window. Four shop dummies pose in it. On the pavement in front, a price tag is spinning on its string.' },
        { say: 'maerke', da: 'Hvor kommer jeg fra? Jeg er faldet af noget. Men af hvad?', en: 'Where do I come from? I have fallen off something. But off what?' },
        { th: 'The label in your coat rustles. It wants to know the same thing about the coat.' },
        { fx: { flag: 'Cstart' } },
      ],
      opts: [{ kind: 'go', label: 'Look at the window.', next: 'retro_hub' }] },
    retro_hub: { bg: 'vindue3', npc: G => G.flags.Cdone ? 'dukke' : 'maerke', title: 'Retro', hub: true,
      steps: [{ special: 'retro8Line' }],
      opts: [
        { kind: 'act', special: 'guess:dukker', label: 'Find out which dummy in the window lost a tag.', req: G => !G.flags.dukkerDone, next: 'c8_dukker', mark: true },
        { kind: 'act', special: 'findPlace:gade', label: 'Put the shops of Udsalgsgade back where they belong.', req: G => G.flags.dukkerDone && !G.flags.gadeDone, next: 'c8_gade', mark: true },
        { kind: 'go', label: 'Answer the label in your coat.', req: G => G.flags.gadeDone && !G.flags.Cdone, next: 'c8_label', mark: true },
        { kind: 'go', label: 'Stand in the window.', req: G => G.flags.Adone && G.flags.Bdone && G.flags.Cdone && !G.flags.Fdone, next: 'f8_1', mark: true },
        { kind: 'go', label: 'Look at your reflection in the glass.', req: G => !G.glimpses.includes('vindue'), next: 'retro_vindue' },
        { kind: 'go', label: 'Read the street sign on the corner.', req: G => G.flags.gadeDone && !G.glimpses.includes('skilt'), next: 'retro_skilt' },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    retro_vindue: { bg: 'vindue3', title: 'Retro',
      steps: [{ n: 'The glass is old and a little wavy.' }, { glimpse: 'vindue' }],
      opts: [{ kind: 'go', label: 'Step back.', next: 'retro_hub' }] },
    retro_skilt: { bg: 'gade3', title: 'Udsalgsgade',
      steps: [{ n: 'Top Tøj stands on the corner now, where Udsalgsgade meets Knapgade. Above it, a street sign.' }, { glimpse: 'skilt' }],
      opts: [{ kind: 'go', label: 'Back.', next: 'retro_hub' }] },
    c8_dukker: { bg: 'vindue3', npc: 'maerke', title: 'Retro',
      steps: [
        { n: 'Every dummy in the window still has its own tag, dangling from a wrist.' },
        { say: 'maerke', da: 'Så er jeg ikke fra vinduet. Jeg er fra en butik her på gaden. Men hvilken? Butikkerne flytter sig hele tiden.', en: 'Then I am not from the window. I am from a shop on this street. But which? The shops keep moving.' },
        { th: 'Udsalgsgade has been shuffling its shops like cards since the sale began.' },
        { fx: { resp: 1 } },
      ],
      opts: [{ kind: 'go', label: 'Back.', next: 'retro_hub' }] },
    c8_gade: { bg: 'vindue3', npc: 'maerke', title: 'Retro',
      steps: [
        { say: 'maerke', da: 'Retro! Ved siden af caféen! Det er der, jeg kommer fra.', en: 'Retro! Next to the café! That is where I come from.' },
        { n: 'It spins toward Retro’s door. Then it stops, and spins toward you instead. Toward the coat.' },
        { n: 'On the back of the tag, in pencil, there is writing.' }, { glimpse: 'kvittering' },
        { say: 'maerke', da: 'Jeg sad på din frakke. Hvor har du købt den henne?', en: 'I was on your coat. Where did you buy it?' },
      ],
      opts: [{ kind: 'go', label: 'Answer.', next: 'c8_label' }] },
    c8_label: { bg: 'vindue3', npc: 'maerke', title: 'Retro',
      steps: [{ th: 'You know the answer now. The tag knew it all along.' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 10, label: 'Say you bought it in a shop called Retro.', build: { en: 'I bought it in a shop called Retro.', origin: 'shop', answers: [['Jeg', 'har', 'købt', 'den', 'i', 'en', 'butik,', 'der', 'hedder', 'Retro.']], best: [['Den', 'har', 'jeg', 'købt', 'i', 'en', 'butik,', 'der', 'hedder', 'Retro.']], tiles: ['Jeg', 'har', 'købt', 'den', 'i', 'en', 'butik,', 'der', 'hedder', 'Retro.', 'dem', 'hedde'] },
          ok: [{ n: 'The label in your coat stops rustling. It has its answer.' }], fail: [{ n: 'A trolley clatters past in the middle of it, but “Retro” is all the label wanted to hear.' }], next: 'c8_choice' },
      ] },
    c8_choice: { bg: 'vindue3', npc: 'maerke', title: 'Retro',
      steps: [{ say: 'maerke', da: 'Skal jeg sidde på din frakke igen? Eller skal jeg hjem?', en: 'Shall I sit on your coat again? Or shall I go home?' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'm', label: 'Tell it it can go home to Retro.', build: { en: 'You can go home to Retro.', answers: [['Du', 'kan', 'gå', 'hjem', 'til', 'Retro.']], tiles: ['Du', 'kan', 'gå', 'hjem', 'til', 'Retro.', 'hjemme', 'går'] },
          ok: [{ n: 'The tag spins once, gratefully.' }], fail: [{ n: 'Your words trip over each other, but “hjem” lands. The tag is already on its way.' }], next: 'c8_hjem' },
        { kind: 'say', stat: 'LOEGN', dc: 10, group: 'm', label: 'Say your coat is not for sale.', build: { en: 'My coat is not for sale.', answers: [['Min', 'frakke', 'er', 'ikke', 'til', 'salg.']], tiles: ['Min', 'frakke', 'er', 'ikke', 'til', 'salg.', 'mit', 'på'] },
          ok: [{ n: 'The tag flips itself over and writes on its own back: IKKE TIL SALG.' }], fail: [{ n: 'You say it badly, but the tag likes the idea and writes it down anyway.' }], next: 'c8_fri' },
      ] },
    c8_hjem: { bg: 'vindue3', title: 'Retro',
      steps: [{ n: 'Prismærket flutters in through Retro’s door and hangs itself on an empty hook behind the counter, where a coat-shaped space is waiting. It fits.' }, { fx: { boon: 'hjemvej', flag: 'Chjem', resp: 2 } }, { fx: { flag: 'Cdone' } }],
      opts: [{ kind: 'go', label: 'Leave.', next: 'map' }] },
    c8_fri: { bg: 'vindue3', title: 'Retro',
      steps: [{ n: 'Prismærket ties itself back onto your coat’s top button. IKKE TIL SALG, it says, to anybody who looks.' }, { fx: { boon: 'maerke', flag: 'Cfri', resp: 2 } }, { fx: { flag: 'Cdone' } }],
      opts: [{ kind: 'go', label: 'Leave, not for sale.', next: 'map' }] },

    /* ===== FINALE: the window ===== */
    f8_1: { bg: 'vindue3', npc: 'dukke', title: 'Retro', card: ['Retro', 'the window'],
      steps: [
        { n: 'A fifth dummy steps down out of Retro’s window to make room, stretches, and looks you up and down.' },
        { say: 'dukke', da: 'Du skal stå i vinduet i nat. Men først: hvad har du på?', en: 'You are standing in the window tonight. But first: what are you wearing?' },
      ],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'o', label: 'Say what you are wearing.', build: G => outfitBuild(G, 'outfit'),
          ok: [{ say: 'dukke', da: 'Perfekt.', en: 'Perfect.' }], fail: [{ n: 'A gust of sale signs blows half of it away. Dukken looks you up and down and fills in the rest itself.' }], next: 'f8_2' },
        { kind: 'reply', group: 'o', da: 'Det ved jeg ikke. Se selv.', ok: [{ say: 'dukke', da: 'Hm. Det gør jeg.', en: 'Hm. I will.' }], next: 'f8_2' },
      ] },
    f8_2: { bg: 'vindue3', npc: 'dukke', title: 'Retro',
      steps: [{ special: 'praise' }],
      opts: [{ kind: 'reply', da: G => G.flags.Bdone ? `Ja, jeg har lige købt ${W.obj(CLOTHES[bought8(G).k].g)}.` : `Nej, ${W.obj(CLOTHES[bought8(G).k].g)} har jeg haft længe.`, next: 'f8_3' }] },
    f8_3: { bg: 'vindue3', npc: 'dukke', title: 'Retro',
      steps: [{ special: 'askPrice' }],
      opts: [{ kind: 'reply', da: G => { const f = Object.keys(BUY).find(k => G.flags[k]); return f ? `${cap1(W.pron(CLOTHES[bought8(G).k].g))} kostede ${BUY[f][1]} kroner.` : 'Det kan jeg ikke huske.'; }, next: 'f8_4' }] },
    f8_4: { bg: 'vindue3', npc: 'dukke', title: 'Retro',
      steps: [{ special: 'askWhere' }],
      opts: [{ kind: 'reply', da: 'I Top Tøj. Den ligger på hjørnet af Udsalgsgade og Knapgade.', ok: [{ say: 'dukke', da: 'Den butik kender jeg godt. Nåh ja.', en: 'I know that shop. Oh yes.' }], next: 'f8_end' }] },
    f8_end: { bg: 'vindue3', title: 'Retro', night: true, card: ['Lukketid', 'the shops close'],
      steps: [
        { n: 'You step up into Retro’s window between the four dummies. The glass is cold. The street switches off its signs one by one.' },
        { n: 'All night, things passing on Udsalgsgade slow down outside the window. A trolley stops for a long time.' },
        { fx: { flag: 'Fdone', resp: 2 } },
        { n: 'At midnight, high above the street, the attic window of the house lights up. A white lamp, switching on and off, on and off, like a question.' },
      ],
      opts: [{ kind: 'go', label: 'End the lesson.', next: 'end' }] },

    /* ===== LOPPEMARKEDET (here only once) ===== */
    loppe8: { bg: 'loppe3', title: 'Loppemarkedet', card: ['Loppemarkedet', 'only once, only this morning'],
      steps: [
        { n: 'The garage has turned into a flea market for one morning. Tables, boxes, a gramophone, and sellers who are mostly their own wares.' },
        { th: 'Every seller lowers the price for a compliment. A correct one.' },
      ],
      opts: [{ kind: 'act', special: 'boxes:sikke', label: 'Haggle with compliments.', next: 'loppe8b' }] },
    loppe8b: { bg: 'loppe3', title: 'Loppemarkedet',
      steps: [{ n: 'You leave with your pockets fuller than you came. Under the last table you notice a cardboard box.' }, { glimpse: 'kasse' }, { fx: { flag: 'loppeGone', sk: 4, resp: 1 } }],
      opts: [{ kind: 'go', label: 'Leave before the market folds itself away.', next: 'map' }] },
  },
});
