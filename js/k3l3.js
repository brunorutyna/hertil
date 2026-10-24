/* =========================================================================
   HERTIL · Kapitel 3 · Lektion 3 — "Kan du ikke lide den hvide lampe?"   (Deroppe · ends Kapitel 3)
   Book 3.3: furniture and things at home, what you like, love or are tired of (kan godt lide, er vild med,
   kan ikke så godt lide, er træt af), adjectives in the definite form (den hvide lampe, mit gamle skab),
   irregulars (blå, grå, orange, lilla; -et → -ede; gammel → gamle, lækker → lækre; lille → små),
   reactions with short answers (Kan du det?! Er du ikke?!), også / heller ikke, for + adjective.
   Physics: the house is too full now (everything lost was found, everything bought came home) and it is sinking
   onto the shop street. Something has to go. The definite form CHOOSES a thing: "den hvide lampe" with its -e
   makes that one lamp known and it lifts; a thing only ever called "en lampe" stays anonymous and drifts toward
   Genbrugskassen. Opinions weigh: what nobody likes gets heavier.
   Chapter reveal (spoilers, never tell Bruno): the coat is the player's own old coat, left on purpose before Hertil,
   with a note in Kommoden: "Pas på min frakke." It never fitted because the player has become someone else.
   Endings: keep it (it fits again), choose something new, or give it on (genbrug).
   ========================================================================= */

Object.assign(BOONS, {
  gemt:     { name: 'Kommodens skuffe', en: 'Kommoden keeps one drawer for you', fx: '+1 on Snige. There is always somewhere to hide a thing.' },
  arbejdslampe: { name: 'Arbejdslampen', en: 'The white lamp lights your desk', fx: '+1 on Sprog. You read better in good light.' },
  udsigt:   { name: 'Udsigten', en: 'An armchair by the roof window, yours', fx: '+1 on Indsigt. You see the whole street from up there.' },
});
K3_BOON_STATS.push(['gemt', 'SNIGE', 'Kommodens skuffe'], ['arbejdslampe', 'SPROG', 'Arbejdslampen'], ['udsigt', 'INDSIGT', 'Udsigten']);

SESSIONS.k3l3 = Object.assign({}, D3, {
  id: 'k3l3', order: 9, short: 'K3 · Lektion 3', prevSession: 'k3l2', nextSession: null, title: 'Lektion 3 · Kan du ikke lide den hvide lampe?', en: 'Don’t you like the white lamp?',
  blurb: 'The house is too full and it is sinking. The attic door has opened, and everything in the attic has an opinion.',
  start: 'p9_tung', home: 'sove', travelAfter: 'p9seen', cluesFlag: 'clues9', cluesNeed: 3, dcMod: 4,
  startState: { resp: 14, sk: 16, insp: 1, boons: ['anker', 'hue', 'egen', 'roedfrakke'], statXP: { SPROG: 28, LOEGN: 9, SNIGE: 11, HANDEL: 11, INDSIGT: 21 },
    origin: { reason: 'Jeg kom hertil på grund af en lyd.', wear3: 'Jeg har en frakke på, men den er ikke min.', shop: 'Jeg har købt den i en butik, der hedder Retro.' },
    wear: { frakke: { k: 'frakke', c: 'roed', fit: 'lidt' }, krop: { k: 'troeje', c: 'stribet', p: 'blaa' }, hoved: { k: 'hue', c: 'gul' } }, met: ['skab', 'vask', 'stoev', 'koel', 'kasse', 'boette', 'dukke', 'maerke'] },

  locations: {
    taget:   { name: 'Taget', en: 'here only once', x: 50, y: 9, bg: 'gade3', icon: 'loft', eph: true, req: G => G.flags.Astart && !G.flags.tagGone, entry: G => 'tag9' },
    loftet:  { name: 'Loftet', en: 'Kommoden and the old things', x: 26, y: 21, bg: 'loft3', icon: 'kommode', entry: G => !G.flags.Astart ? 'a9_start' : 'loft_hub' },
    vindue:  { name: 'Tagvinduet', en: 'a white lamp', x: 74, y: 21, bg: 'loft3', icon: 'lampe', entry: G => !G.flags.Bstart ? 'b9_start' : 'lampe_hub' },
    sove:    { name: 'Soveværelset', en: '1. sal · your bed', x: 26, y: 37, bg: 'sove3', icon: 'seng', night: true, entry: G => 'sove9_hub' },
    stuen:   { name: 'Stuen', en: 'Sofaen has views', x: 26, y: 55, bg: 'stue3', icon: 'sofa', entry: G => 'stue9_hub' },
    gangen:  { name: 'Gangen', en: 'Genbrugskassen waits', x: 50, y: 55, bg: 'gang3', icon: 'knage', entry: G => 'gang9_hub' },
    koekken: { name: 'Køkkenet', en: 'Køleskabet measures', x: 74, y: 55, bg: 'koekken3', icon: 'gryde', night: true, entry: G => 'koek9_hub' },
  },

  ending: G => [G.flags.Abehold ? 'Kommoden bliver' : G.flags.Asommer ? 'Sommerhuset' : null,
    G.flags.Blys ? 'Lyset' : G.flags.Blille ? 'Arbejdslampen' : null,
    G.flags.Csaet ? 'Et sæt' : G.flags.Cudsigt ? 'Udsigten' : null,
    G.flags.Fgammel ? 'Den gamle frakke' : G.flags.Fny ? 'Noget nyt' : G.flags.Fgenbrug ? 'Genbrug' : null].filter(Boolean).join(' · ') || '—',
  carryFlags: ['Abehold', 'Asommer', 'Blys', 'Blille', 'Csaet', 'Cudsigt', 'Fgammel', 'Fny', 'Fgenbrug'],
  chapterEnd: ['Kapitel 3 · Nyt og gammelt', 'Kapitel 3 er slut', 'You have a house, clothes you chose, and an answer about an old coat. Next: Kapitel 4, somewhere new.'],

  quests: {
    A: { title: 'Kommoden', en: 'The chest of drawers', obj: [['Find the things on the attic floor (Loftet)', 'huntDone9'], ['Call them by their definite names', 'bestemtDone'], ['Decide about Kommoden', 'Adone']] },
    B: { title: 'Den hvide lampe', en: 'The white lamp', obj: [['Answer the attic, the short way (Tagvinduet)', 'reaktDone'], ['Tell Lampen what you think of it', 'Bdone']] },
    C: { title: 'Den samme grønne?', en: 'The same green?', obj: [['Hear Lænestolen out (Loftet)', 'Cstart'], ['Find out who in the house likes what (Stuen)', 'smagDone'], ['Settle it', 'Cdone']] },
    F: { title: 'Frakken', en: 'The coat', obj: [['Go up to the attic when everything else is sorted', 'Fdone']] },
    S1: { title: 'Køleskabet måler', en: 'The fridge measures', side: true, obj: [['Help Køleskabet: too big, too small (Køkkenet)', 'forstorDone']] },
    S2: { title: 'Spor', en: 'Traces', side: true, obj: [['Find three traces of what you were', 'clues9']] },
  },

  glimpses: {
    seddel: { name: 'Sedlen i skuffen', en: 'The note in the drawer', text: 'In Kommoden’s top drawer: a note, folded twice, in your handwriting. Three words. “Pas på min frakke.” Take care of my coat. Kommoden has been doing exactly that.' },
    skygge: { name: 'Skyggen', en: 'The shadow', text: 'Lampen’s light throws your shadow on the attic wall. The shadow is wearing the coat, and in the shadow the coat fits. The shadow is a little bigger than you are now.' },
    fjer: { name: 'Fjeren', en: 'The feather', text: 'Under the cushion: a feather, pink, unmistakably from Hertil. It fell up here, the wrong way, after somebody. A long time ago.' },
    tag: { name: 'Udsigten fra taget', en: 'The view from the roof', text: 'From the roof you can see Hertil far below, Derhenne off to one side, and the sale street under your feet. All three touch at one point: a staircase, folded like cardboard.' },
  },

  hunts: {
    loft: { title: 'Loftet', en: 'Find the things on the attic floor', find: ['lampe', 'laenestol', 'reol', 'hylde', 'gardin', 'pude', 'taeppe', 'bord'], decoys: ['sofa', 'stol3', 'kommode', 'skab3'] },
  },

  boxes: {
    bestemt: { title: 'Loftets ting', q: 'Hvilken form?', boxes: ['a', 'b', 'c'],
      good: 'Each thing you name rises an inch off the floor and turns round to look at you, chosen.', meh: 'Most things rise when you name them. A cushion stays on the floor, anonymous, and does not seem to mind.',
      items: [
        { t: 'Jeg kan godt lide den ___ lampe. (hvid)', opts: ['hvide', 'hvid', 'hvidt'], a: 0, why: 'After den: always -e. Den hvide lampe.' },
        { t: 'Hvad synes du om det ___ skab? (gammel)', opts: ['gamle', 'gammel', 'gammelt'], a: 0, why: 'gammel loses an m and an e: det gamle skab.' },
        { t: 'Mine ___ puder er væk. (blå)', opts: ['blå', 'blåt'], a: 0, why: 'blå never takes -e: mine blå puder.' },
        { t: 'Kommodens ___ skuffer er fulde. (lille)', opts: ['små', 'lille'], a: 0, why: 'lille becomes små in the plural: de små skuffer.' },
        { t: 'Den ___ lænestol vil ned i stuen. (grøn)', opts: ['grønne', 'grøn', 'grønt'], a: 0, why: 'After den: -e. Den grønne lænestol.' },
        { t: 'Jeg er træt af det ___ tæppe. (ternet)', opts: ['ternede', 'ternet'], a: 0, why: '-et becomes -ede in the definite form: det ternede tæppe.' },
        { t: 'Kan du ikke lide de ___ gardiner? (orange)', opts: ['orange', 'orangt'], a: 0, why: 'orange never changes: de orange gardiner.' },
        { t: 'Jeg elsker mit ___ bord. (lækker)', opts: ['lækre', 'lækker', 'lækkert'], a: 0, why: 'After a possessive: -e, and lækker loses its last e: mit lækre bord.' },
      ] },
    reakt: { title: 'Loftet svarer', q: 'Hvad svarer du?', boxes: ['a', 'b', 'c'],
      good: 'The attic goes quiet, satisfied. Every opinion got an answer the right size.', meh: 'The attic mostly agrees with you. A rug is still muttering.',
      items: [
        { t: 'Jeg kan godt lide den hvide lampe. (Du er overrasket.)', opts: ['Kan du det?!', 'Er du det?!', 'Gør du ikke?!'], a: 0, why: 'Repeat the verb: kan → Kan du det?!' },
        { t: 'Jeg er ikke så vild med de blå puder. (Du er overrasket.)', opts: ['Er du ikke?!', 'Kan du ikke?!', 'Er du det?!'], a: 0, why: 'A negative statement with er: Er du ikke?!' },
        { t: 'Jeg synes, lampen er ret grim. (Du er overrasket.)', opts: ['Synes du det?!', 'Er du det?!', 'Kan du det?!'], a: 0, why: 'After synes: Synes du det?! (or Gør du det?!)' },
        { t: 'Jeg kan ikke lide den gule reol. (Du er enig.)', opts: ['Det kan jeg heller ikke.', 'Det kan jeg også.', 'Det er jeg heller ikke.'], a: 0, why: 'Agreeing with something negative: heller ikke, with the same verb.' },
        { t: 'Jeg er vild med den grønne lænestol. (Du er enig.)', opts: ['Det er jeg også.', 'Det kan jeg også.', 'Det er jeg heller ikke.'], a: 0, why: 'Agreeing with something positive: også. er → Det er jeg også.' },
        { t: 'Jeg synes ikke, sofaen er så pæn. (Du er enig.)', opts: ['Det synes jeg heller ikke.', 'Det synes jeg også.', 'Det kan jeg heller ikke.'], a: 0, why: 'Negative, with synes: Det synes jeg heller ikke.' },
        { t: 'Jeg kan godt lide de stribede gardiner. (Du er enig.)', opts: ['Det kan jeg også.', 'Det kan jeg heller ikke.', 'Det er jeg også.'], a: 0, why: 'Positive, with kan: Det kan jeg også.' },
        { t: 'Jeg kan ikke så godt lide den prikkede sofa. (Du er overrasket.)', opts: ['Kan du ikke?!', 'Er du ikke?!', 'Kan du det?!'], a: 0, why: 'A negative statement with kan: Kan du ikke?!' },
      ] },
    forstor: { title: 'Køleskabet måler', q: 'Hvilken form?', boxes: ['a', 'b', 'c'],
      good: 'Køleskabet measures everything in the house and writes it on its door with a magnet. Too big, too small, just right.', meh: 'Køleskabet measures most things. It is still unsure about itself.',
      items: [
        { t: 'Kommoden er lidt for ___. (stor)', opts: ['stor', 'stort', 'store'], a: 0, why: 'After er, the adjective agrees with the noun: en kommode → stor.' },
        { t: 'Skabet er alt for ___. (stor)', opts: ['stort', 'stor', 'store'], a: 0, why: 'et skab → stort.' },
        { t: 'Puderne er lidt for ___. (lille)', opts: ['små', 'lille'], a: 0, why: 'Plural: små.' },
        { t: 'Tæppet er alt for ___. (gammel)', opts: ['gammelt', 'gammel', 'gamle'], a: 0, why: 'et tæppe → gammelt.' },
        { t: 'Hylderne er alt for ___. (gammel)', opts: ['gamle', 'gammel', 'gammelt'], a: 0, why: 'Plural: gamle.' },
        { t: 'Frakken er lidt for ___. (lang)', opts: ['lang', 'langt', 'lange'], a: 0, why: 'en frakke → lang.' },
        { t: 'Gardinerne er lidt for ___. (kort)', opts: ['korte', 'kort'], a: 0, why: 'Plural: korte.' },
        { t: 'Bordet er alt for ___. (lille)', opts: ['lille', 'små'], a: 0, why: 'lille does not change in the singular: et lille bord, bordet er lille.' },
      ] },
  },

  guess: {
    smag: { title: 'Hvem kan lide hvad?', pool: ['lampe', 'kommode', 'laenestol', 'sofa', 'skab'],
      end: r => r >= 4 ? 'You know the whole house’s taste now. It is mostly arguments.' : 'You mix up a few tastes. The furniture is delighted: being misunderstood is nearly as good as being liked.',
      rounds: [
        { npc: 'laenestol', lines: ['Den er vild med grøn.', 'Den synes, den passer til sofaen.', 'Den kan ikke så godt lide lamper.'], words: ['laenestol', 'f_groen'] },
        { npc: 'lampe', lines: ['Den er hvid.', 'Den kan bedst lide lys.', 'Den er træt af, at ingen kan lide den.'], words: ['lampe', 'f_hvid'] },
        { npc: 'kommode', lines: ['Den er rød og har tre skuffer.', 'Den er ikke så vild med den hvide lampe.', 'Den kan godt lide at passe på ting.'], words: ['kommode', 'f_roed'] },
        { npc: 'sofa', lines: ['Den står nede i stuen.', 'Den synes altid det samme som den sidste, der sad i den.', 'Den er lysegrøn.'], words: ['sofa', 'pude'] },
        { npc: 'skab', lines: ['Det står ude i gangen.', 'Det kan godt lide sokker.', 'Det har en nøgle i nøglehullet.'], words: ['skab3'] },
      ] },
  },

  travel: [
    { id: 'knirk9', bg: 'gang3', steps: [{ n: 'The whole stairwell creaks and sinks an inch, like a lift with too many people in it. Below, Udsalgsgade looks up nervously.' }],
      opts: [{ kind: 'go', label: 'Walk lightly.', next: 'map' }] },
    { id: 'reol9', bg: 'gang3', steps: [{ n: 'A bookcase is coming down the stairs on its own, one step at a time, with its shelves held tight like a skirt.' }],
      opts: [{ kind: 'act', stat: 'SNIGE', dc: 9, label: 'Squeeze past.', ok: [{ n: 'You slip past. A book falls out of it into your pocket, by way of apology.' }, { fx: { insp: 1 } }], fail: [{ n: 'You wait. It takes eleven minutes. It apologises at every step.' }], next: 'map' }, { kind: 'go', label: 'Go another way.', next: 'map' }] },
    { id: 'boejl9', bg: 'gang3', npc: 'boejler', steps: [{ n: 'The hangers come clacking up the stairwell, carrying a lampshade between them like a stretcher.' }],
      opts: [{ kind: 'reply', group: 'b', da: 'Hvor skal I hen med den?', ok: [{ say: 'boejler', da: 'Op på loftet! Vi skal sortere den!', en: 'Up to the attic! We have to sort it!' }], next: 'map' }, { kind: 'go', group: 'b', label: 'Hold the door.', next: 'map' }] },
    { id: 'post9', bg: 'gang3', req: G => G.prev.Chjem || G.prev.Cfri, steps: [{ n: G => G.prev.Cfri ? 'Your coat’s price tag flips over in a draught. IKKE TIL SALG, it says, to the whole stairwell.' : 'A paper bag comes up from Retro with nothing in it but a thank-you, written on a price tag.' }],
      opts: [{ kind: 'go', label: 'Walk on.', fx: { resp: 1 }, next: 'map' }] },
    { id: 'ikket9', bg: 'gang3', req: G => hasBoon('ikket'), steps: [{ n: 'Ikket wriggles in your mouth. The attic is full of opinions, and an ikke can turn any of them upside down. It is tempted.' }],
      opts: [{ kind: 'go', label: 'Keep your mouth shut. Walk on.', next: 'map' }] },
    { id: 'tal9', bg: 'gang3', req: G => !hasBoon('urnoegle'), steps: [{ n: 'The step numbers painted on the stairs come loose and roll down into the street.' }, { special: 'glyphs' }], opts: [{ kind: 'go', label: 'Walk on anyway.', next: 'map' }] },
  ],

  special: {
    async arrive9() { logAdd(`<p>${esc(G.newPlace ? 'Your weight stayed behind on the staircase. Up here you will have to earn it again.' : 'The floor dips under you as you walk. The house is heavy today. So, a little, are you.')}</p>`, 'thought'); await tapOn(); },
    async loftLine() {
      const f = G.flags;
      logAdd(`<p>${esc(f.Fdone ? 'The attic is light and tidy. Dust hangs in the window light, doing nothing in particular.' : f.Adone && f.Bdone && f.Cdone ? 'In the corner, on its own, a coat is standing up.' : f.Asommer ? 'Where Kommoden stood there is a clean red rectangle on the floor.' : f.Abehold ? 'Kommoden stands in the middle of the attic, every drawer shut, very pleased.' : f.bestemtDone ? 'The things you named hover an inch above the floor. Kommoden is waiting for its turn.' : 'Furniture piled to the roof, breathing dust. Kommoden stands in front of it all, arms folded.')}</p>`, 'narr');
      const c = Math.random() < .5 ? wearComment(G) : null; if (c && G.flags.Adone) { sayEntry({ say: 'kommode', da: c, en: 'It approves of what you are wearing.' }); await tapOn(); }
    },
    async lampeLine() { logAdd(`<p>${esc(G.flags.Blys ? 'Lampen stands by the roof window, shining at full strength, though it is daytime.' : G.flags.Blille ? 'The space by the roof window is empty. Lampen has gone down to your desk.' : G.flags.reaktDone ? 'Lampen flickers, waiting to hear what you think.' : 'The white lamp switches on and off, on and off. Every time it comes on, somebody in the attic says something about it.')}</p>`, 'narr'); },
    async stueLine9() { logAdd(`<p>${esc(G.flags.Csaet ? 'Lænestolen and Sofaen sit side by side, arguing happily about which of them is greener.' : G.flags.Cudsigt ? 'Sofaen has the living room to itself again. It agrees with the cushion it is sitting on.' : 'Sofaen sits in the middle of the living room, light green, agreeing with whoever sat on it last.')}</p>`, 'narr'); },
    async gangLine9() {
      logAdd(`<p>${esc(G.flags.Fdone ? 'The front door is shut. Genbrugskassen has gone back down to the street.' : pick(['A recycling crate stands at the front door, arrows going round on its front. Genbrugskassen. It is waiting for something.', 'Genbrugskassen hums by the door. Skabet keeps its doors shut around it, just in case.']))}</p>`, 'narr');
      const c = wearComment(G); if (c && Math.random() < .5) { sayEntry({ say: 'skab', da: c, en: 'It likes what you are wearing.' }); await tapOn(); }
    },
    async glyphs() { G.glyph = 3; AUDIO.sting('glyph'); toast('ᚦᚨᛚ · the numbers have gone strange', 'gold'); },
    async coatFits() { const f = (G.wear || {}).frakke || COAT0; fx({ wear: { frakke: Object.assign({}, f, { fit: 'passer' }) } }); },
    async chapterEcho3() {
      const lines = wearLines(G).concat([G.origin.like, G.origin.coat].filter(Boolean));
      if (!lines.length) return;
      logAdd(`<p>Skabet writes the last lines on the inside of its door.</p>`, 'narr');
      for (const l of lines.slice(0, 4)) { youSaid(l); TTS.say(l); await sleep(FAST ? 0 : 900); }
      await tapOn();
    },
  },

  nodes: {
    /* ===== PROLOGUE: the house is too heavy ===== */
    p9_tung: { bg: 'gang3', npc: 'skab', title: 'Gangen', card: ['Kapitel 3 · Nyt og gammelt', 'Lektion 3 — Kan du ikke lide den hvide lampe?'],
      steps: [
        { n: 'Morning. The whole house tilts a little when you get out of bed. In the hallway, Skabet is holding on to the wall.' },
        { say: 'skab', da: 'Huset er for tungt! Alle tingene er kommet tilbage, og nu synker vi ned i gaden.', en: 'The house is too heavy! All the things have come back, and now we are sinking into the street.' },
        { th: 'Through the floor you hear Udsalgsgade complaining.' },
        { say: 'skab', da: 'Vi skal rydde op på loftet. Der står alt det gamle. Kommoden har åbnet døren.', en: 'We have to tidy the attic. That is where all the old things are. Kommoden has opened the door.' },
        { n: 'At the front door, a recycling crate has arrived from the street. Arrows go round on its front. It is waiting.' },
        { special: 'arrive9' },
        { fx: { quest: ['A', 'B', 'C', 'F', 'S2'], flag: 'p9seen' } },
      ],
      opts: [{ kind: 'go', label: 'Go up to the attic.', next: 'map' }] },

    /* ===== LOFTET: contract A (Kommoden), the start of C, and the finale ===== */
    a9_start: { bg: 'loft3', npc: 'kommode', title: 'Loftet', card: ['Loftet', 'Kommoden and the old things'],
      steps: [
        { n: 'The attic. Furniture piled to the roof, breathing dust. In front of it all stands a red chest of drawers, its top drawer open a crack, like an eye.' },
        { say: 'kommode', da: 'Ingen skal smide noget ud. Ikke før jeg ved, hvad der er her.', en: 'Nobody is throwing anything out. Not before I know what is here.' },
        { th: 'Behind it, a green armchair clears its throat. By the roof window, a white lamp switches on and off.' },
        { fx: { flag: 'Astart', quest: ['S1'] } },
      ],
      opts: [{ kind: 'act', special: 'hunt:loft', label: 'Find out what is up here.', next: 'a9_found' }] },
    loft_hub: { bg: 'loft3', npc: G => G.flags.Adone && G.flags.Bdone && G.flags.Cdone && !G.flags.Fdone ? 'frakke' : G.flags.Asommer ? (G.flags.Cudsigt ? 'laenestol' : null) : 'kommode', title: 'Loftet', hub: true,
      steps: [{ special: 'loftLine' }],
      opts: [
        { kind: 'act', special: 'hunt:loft', label: 'Find out what is up here.', req: G => !G.flags.huntDone9, next: 'a9_found', mark: true },
        { kind: 'act', special: 'boxes:bestemt', label: 'Name the things properly, so they know they are meant.', req: G => G.flags.huntDone9 && !G.flags.bestemtDone, next: 'a9_named', mark: true },
        { kind: 'go', label: 'Talk to Kommoden.', req: G => G.flags.bestemtDone && !G.flags.Adone, next: 'a9_kommode', mark: true },
        { kind: 'go', label: 'Listen to the green armchair.', req: G => !G.flags.Cstart, next: 'c9_start', mark: true },
        { kind: 'go', label: 'Go to the coat standing in the corner.', req: G => G.flags.Adone && G.flags.Bdone && G.flags.Cdone && !G.flags.Fdone, next: 'f9_1', mark: true },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    a9_found: { bg: 'loft3', npc: 'kommode', title: 'Loftet',
      steps: [
        { n: 'A lamp, an armchair, a bookcase, shelves, curtains, a cushion, a rug, a table. Each thing you find shuffles forward and stands in a row.' },
        { fx: { flag: 'huntDone9', resp: 1 } },
        { say: 'kommode', da: 'Godt. Men de er bare “en lampe” og “et bord”. De ved ikke, at du mener dem.', en: 'Good. But they are just “a lamp” and “a table”. They don’t know that you mean them.' },
        { th: 'A thing only ever called en lampe could be any lamp. In this attic, that is how things drift away.' },
      ],
      opts: [{ kind: 'go', label: 'Back.', next: 'loft_hub' }] },
    a9_named: { bg: 'loft3', npc: 'kommode', title: 'Loftet',
      steps: [
        { n: 'The things you named float up and turn toward you. The house groans and lifts a little out of the street.' },
        { say: 'kommode', da: 'Og mig? Jeg er ikke “en kommode”. Jeg er den røde kommode.', en: 'And me? I am not “a chest of drawers”. I am THE red chest of drawers.' },
        { fx: { resp: 1 } },
      ],
      opts: [{ kind: 'go', label: 'Talk to Kommoden.', next: 'a9_kommode' }] },
    a9_kommode: { bg: 'loft3', npc: 'kommode', title: 'Loftet',
      steps: [
        { n: 'Kommoden opens its top drawer for you, slowly. Inside, folded twice, a piece of paper.' },
        { glimpse: 'seddel' },
        { say: 'kommode', da: 'Jeg passede på den frakke i lang tid. Til sidst sendte vi den til dig.', en: 'I looked after that coat for a long time. In the end we sent it to you.' }, { say: 'kommode', da: 'Men huset er for tungt. Hvad skal der ske med mig?', en: 'But the house is too heavy. What should happen to me?' },
      ],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'k', label: 'Say you like the red chest of drawers. It stays.', build: { en: 'I like the red chest of drawers.', origin: 'like', answers: [['Jeg', 'kan', 'godt', 'lide', 'den', 'røde', 'kommode.']], best: [['Den', 'røde', 'kommode', 'kan', 'jeg', 'godt', 'lide.']], tiles: ['Jeg', 'kan', 'godt', 'lide', 'den', 'røde', 'kommode.', 'rød', 'det'] },
          ok: [{ n: 'Every drawer in Kommoden shuts at once, a sound like applause.' }], fail: [{ n: 'The floor creaks over half of it. Kommoden does not need the rest. It has wanted to stay for a hundred years.' }], next: 'a9_behold' },
        { kind: 'say', stat: 'SPROG', dc: 11, group: 'k', label: 'Say the red chest of drawers is going to the summer house.', build: { en: 'The red chest of drawers is going to the summer house.', answers: [['Den', 'røde', 'kommode', 'skal', 'i', 'sommerhuset.']], tiles: ['Den', 'røde', 'kommode', 'skal', 'i', 'sommerhuset.', 'rød', 'på'] },
          ok: [{ n: 'Kommoden thinks about it, drawer by drawer, and nods with all three.' }], fail: [{ n: 'You stumble on it. Kommoden finishes the sentence for you, in a voice like a drawer sliding shut.' }], next: 'a9_sommer' },
      ] },
    a9_behold: { bg: 'loft3', npc: 'kommode', title: 'Loftet',
      steps: [
        { n: 'Kommoden stays. Instead, the attic rearranges itself round it: the pile shrinks and the floor stops sloping.' },
        { say: 'kommode', da: 'Den nederste skuffe er din. Til det, du ikke vil smide ud.', en: 'The bottom drawer is yours. For what you don’t want to throw out.' },
        { fx: { boon: 'gemt', flag: 'Abehold', resp: 2 } }, { fx: { flag: 'Adone' } },
      ],
      opts: [{ kind: 'go', label: 'Back.', next: 'loft_hub' }] },
    a9_sommer: { bg: 'loft3', title: 'Loftet',
      steps: [
        { n: 'The hangers carry Kommoden down the stairs, slowly, all three drawers waving. Nobody has ever seen the summer house. Kommoden seems sure it exists.' },
        { n: 'On the floor where it stood, a small key, left behind on purpose.' },
        { fx: { boon: 'sommer', flag: 'Asommer', resp: 2 } }, { fx: { flag: 'Adone' } },
      ],
      opts: [{ kind: 'go', label: 'Pocket the key.', next: 'loft_hub' }] },

    /* ===== TAGVINDUET: contract B (Lampen) ===== */
    b9_start: { bg: 'loft3', npc: 'lampe', title: 'Tagvinduet', card: ['Tagvinduet', 'a white lamp'],
      steps: [
        { n: 'By the roof window stands a tall white lamp. It switches on. The attic says things about it. It switches off.' },
        { say: 'lampe', da: 'Kan du ikke lide den hvide lampe? Det kan ingen. De siger, jeg er grim.', en: 'Don’t you like the white lamp? Nobody does. They say I am ugly.' },
        { th: 'Every time somebody says “grim”, the lamp gets heavier. You can hear the floor under it bend.' },
        { fx: { flag: 'Bstart' } },
      ],
      opts: [{ kind: 'go', label: 'Look round the attic.', next: 'lampe_hub' }] },
    lampe_hub: { bg: 'loft3', npc: G => G.flags.Blille ? null : 'lampe', title: 'Tagvinduet', hub: true,
      steps: [{ special: 'lampeLine' }],
      opts: [
        { kind: 'act', special: 'boxes:reakt', label: 'Answer the attic’s opinions, the short way.', req: G => !G.flags.reaktDone, next: 'b9_quiet', mark: true },
        { kind: 'go', label: 'Tell Lampen what you think of it.', req: G => G.flags.reaktDone && !G.flags.Bdone, next: 'b9_lampe', mark: true },
        { kind: 'reply', once: true, req: G => G.flags.Blys, da: 'Er du glad nu?', ok: [{ say: 'lampe', da: 'Ja, det er jeg. Kan du se det?', en: 'Yes, I am. Can you see?' }] },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    b9_quiet: { bg: 'loft3', npc: 'lampe', title: 'Tagvinduet',
      steps: [
        { n: 'The attic runs out of opinions. For a moment nobody says anything about the lamp at all, and the floor under it straightens.' },
        { say: 'lampe', da: 'Og du? Hvad synes du om mig?', en: 'And you? What do you think of me?' },
        { fx: { resp: 1 } },
      ],
      opts: [{ kind: 'go', label: 'Answer.', next: 'b9_lampe' }] },
    b9_lampe: { bg: 'loft3', npc: 'lampe', title: 'Tagvinduet',
      steps: [{ th: 'Its light points at you and waits.' }, { n: 'On the wall behind you, your shadow comes up, big and dark.' }, { glimpse: 'skygge' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'l', label: 'Say you are crazy about the white lamp.', build: { en: 'I am crazy about the white lamp.', answers: [['Jeg', 'er', 'vild', 'med', 'den', 'hvide', 'lampe.']], best: [['Den', 'hvide', 'lampe', 'er', 'jeg', 'vild', 'med.']], tiles: ['Jeg', 'er', 'vild', 'med', 'den', 'hvide', 'lampe.', 'hvid', 'kan'] },
          ok: [{ n: 'Lampen switches on so hard the dust in the air lights up like confetti.' }], fail: [{ n: 'Your voice cracks on “vild”. Lampen does not mind. It heard the rest.' }], next: 'b9_lys' },
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'l', label: 'Say honestly: it is just a bit too big.', build: { en: 'It is just a bit too big.', answers: [['Den', 'er', 'bare', 'lidt', 'for', 'stor.']], tiles: ['Den', 'er', 'bare', 'lidt', 'for', 'stor.', 'stort', 'meget'] },
          ok: [{ n: 'Lampen flickers. Then, slowly, it starts to fold itself.' }], fail: [{ n: 'It comes out blunter than you meant. Lampen takes it well. Lamps can see.' }], next: 'b9_lille' },
      ] },
    b9_lys: { bg: 'loft3', npc: 'lampe', title: 'Tagvinduet',
      steps: [
        { n: 'Lampen stays by the roof window, lighter than air, shining. The whole attic looks better in its light. Even the rug.' },
        { say: 'lampe', da: 'Tak. Det er jeg også.', en: 'Thank you. So am I.' },
        { fx: { boon: 'lys', flag: 'Blys', resp: 2 } }, { fx: { flag: 'Bdone' } },
      ],
      opts: [{ kind: 'go', label: 'Back.', next: 'lampe_hub' }] },
    b9_lille: { bg: 'sove3', title: 'Soveværelset',
      steps: [
        { n: 'Lampen folds itself in half, then in half again, into a small white desk lamp. It walks downstairs on its cable and climbs onto the table in your bedroom.' },
        { th: 'It is exactly the right size now. It seems relieved.' },
        { fx: { boon: 'arbejdslampe', flag: 'Blille', resp: 2 } }, { fx: { flag: 'Bdone' } },
      ],
      opts: [{ kind: 'go', label: 'Switch it on. Go out.', next: 'map' }] },

    /* ===== contract C: Lænestolen (Loftet) and Sofaen (Stuen) ===== */
    c9_start: { bg: 'loft3', npc: 'laenestol', title: 'Loftet',
      steps: [
        { n: 'A green armchair pushes its way to the front, buttons gleaming.' },
        { say: 'laenestol', da: 'Jeg skal ned i stuen. Jeg passer perfekt til den grønne sofa!', en: 'I am going down to the living room. I go perfectly with the green sofa!' },
        { say: 'kommode', da: 'Den er slet ikke den samme grønne farve.', en: 'It is not the same green at all.' },
        { say: 'laenestol', da: 'Synes du det?!', en: 'You think so?!' },
        { th: 'Somebody is going to have to ask the sofa.' },
        { fx: { flag: 'Cstart' } },
      ],
      opts: [{ kind: 'go', label: 'Back.', next: 'loft_hub' }] },
    stue9_hub: { bg: 'stue3', npc: G => G.flags.Csaet && G.flags.smagDone ? 'laenestol' : 'sofa', title: 'Stuen', hub: true,
      steps: [{ special: 'stueLine9' }],
      opts: [
        { kind: 'reply', once: true, req: G => G.flags.Cstart, da: 'Kan du lide den grønne lænestol?', ok: [{ say: 'sofa', da: 'Den grønne? Det ved jeg ikke. Hvad synes du?', en: 'The green one? I don’t know. What do you think?' }, { th: 'It agrees with whoever sat on it last. Nobody has sat on it for weeks.' }] },
        { kind: 'act', special: 'guess:smag', label: 'Find out who in the house likes what.', req: G => G.flags.Cstart && !G.flags.smagDone, next: 'c9_smag', mark: true },
        { kind: 'go', label: 'Settle it.', req: G => G.flags.smagDone && !G.flags.Cdone, next: 'c9_verdict', mark: true },
        { kind: 'go', label: 'Lift the cushions.', req: G => !G.glimpses.includes('fjer'), next: 'stue9_pude' },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    stue9_pude: { bg: 'stue3', npc: 'sofa', title: 'Stuen',
      steps: [{ n: 'Sofaen lets you lift its cushions. It agrees that you should.' }, { glimpse: 'fjer' }],
      opts: [{ kind: 'go', label: 'Put the cushion back.', next: 'stue9_hub' }] },
    c9_smag: { bg: 'stue3', npc: 'sofa', title: 'Stuen',
      steps: [
        { n: 'The whole house has told you what it likes. The armchair likes green. The lamp likes light. The sofa likes whatever you like.' },
        { n: 'There is a creak on the stairs. Lænestolen has come down by itself to hear the verdict, and stands in the doorway, all buttons.' },
        { fx: { resp: 1 } },
      ],
      opts: [{ kind: 'go', label: 'Settle it.', next: 'c9_verdict' }] },
    c9_verdict: { bg: 'stue3', npc: 'laenestol', title: 'Stuen',
      steps: [{ say: 'laenestol', da: 'Nå? Passer jeg til sofaen, eller hvad?', en: 'Well? Do I go with the sofa, or what?' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 11, group: 'v', label: 'Say yes: the green armchair goes with the green sofa.', build: { en: 'The green armchair goes with the green sofa.', answers: [['Den', 'grønne', 'lænestol', 'passer', 'til', 'den', 'grønne', 'sofa.']], tiles: ['Den', 'grønne', 'lænestol', 'passer', 'til', 'den', 'grønne', 'sofa.', 'grøn', 'med'] },
          ok: [{ say: 'sofa', da: 'Det synes jeg også!', en: 'I think so too!' }], fail: [{ n: 'You get tangled in all the greens. Sofaen agrees anyway. It always does.' }, { say: 'sofa', da: 'Det synes jeg også.', en: 'I think so too.' }], next: 'c9_saet' },
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'v', label: 'Disagree: it is not the same green.', build: { en: 'I don’t think so. It isn’t the same green colour.', answers: [['Det', 'synes', 'jeg', 'ikke.', 'Det', 'er', 'ikke', 'den', 'samme', 'grønne', 'farve.']], tiles: ['Det', 'synes', 'jeg', 'ikke.', 'Det', 'er', 'ikke', 'den', 'samme', 'grønne', 'farve.', 'grøn', 'kan'] },
          ok: [{ say: 'laenestol', da: 'Synes du ikke?! Nå. Så går jeg op igen.', en: 'You don’t?! Fine. Then I am going back up.' }], fail: [{ n: 'It comes out in a muddle. Lænestolen hears “ikke den samme” and goes very still.' }, { say: 'laenestol', da: 'Nå. Så går jeg op igen.', en: 'Fine. Then I am going back up.' }], next: 'c9_udsigt' },
      ] },
    c9_saet: { bg: 'stue3', npc: 'laenestol', title: 'Stuen',
      steps: [
        { n: 'Lænestolen settles next to the sofa. They are not the same green. They argue about it happily for the rest of the day, and every day after.' },
        { fx: { boon: 'stolen', flag: 'Csaet', resp: 2 } }, { fx: { flag: 'Cdone' } },
      ],
      opts: [{ kind: 'go', label: 'Leave them to it.', next: 'map' }] },
    c9_udsigt: { bg: 'loft3', npc: 'laenestol', title: 'Tagvinduet',
      steps: [
        { n: 'Lænestolen stomps back up to the attic and parks itself in front of the roof window, sulking. After a while it stops sulking. The view is very good.' },
        { say: 'laenestol', da: 'Du må gerne sidde her. Men kun dig.', en: 'You may sit here. But only you.' },
        { fx: { boon: 'udsigt', flag: 'Cudsigt', resp: 2 } }, { fx: { flag: 'Cdone' } },
      ],
      opts: [{ kind: 'go', label: 'Sit for a moment. Then go.', next: 'map' }] },

    /* ===== GANGEN, KØKKENET, SOVEVÆRELSET ===== */
    gang9_hub: { bg: 'gang3', npc: 'genbrugsk', title: 'Gangen', hub: true,
      steps: [{ special: 'gangLine9' }],
      opts: [
        { kind: 'reply', once: true, da: 'Hvad venter du på?', ok: [{ say: 'genbrugsk', da: 'På det, ingen kan lide mere. Det kommer altid til sidst.', en: 'For what nobody likes any more. It always comes last.' }] },
        { kind: 'go', special: 'wardrobe', label: 'Look at yourself in the hall mirror.' },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    koek9_hub: { bg: 'koekken3', npc: 'koel', title: 'Køkkenet', hub: true,
      steps: [{ n: G => G.flags.forstorDone ? 'Køleskabet’s door is covered in measurements, held up by magnets.' : 'Køleskabet has a tape measure in its mouth and is measuring the kitchen table. Again.' }],
      opts: [
        { kind: 'act', special: 'boxes:forstor', label: 'Help Køleskabet measure: too big, too small.', req: G => !G.flags.forstorDone, next: 'koek9_done', mark: true },
        { kind: 'reply', once: true, da: 'Er du for stor?', ok: [{ say: 'koel', da: 'Nej. Jeg er perfekt. Det er køkkenet, der er for lille.', en: 'No. I am perfect. It is the kitchen that is too small.' }] },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    koek9_done: { bg: 'koekken3', npc: 'koel', title: 'Køkkenet',
      steps: [{ say: 'koel', da: 'Alt for stort, lidt for lille, lige tilpas. Nu ved jeg, hvad der kan blive.', en: 'Far too big, a bit too small, just right. Now I know what can stay.' }, { fx: { sk: 3, resp: 1 } }],
      opts: [{ kind: 'go', label: 'Back.', next: 'koek9_hub' }] },
    sove9_hub: { bg: 'sove3', title: 'Soveværelset', hub: true, idle: true, home: true,
      steps: [{ n: G => G.flags.Blille ? 'Your bedroom. A small white lamp on the table, very content.' : G.flags.Fdone ? 'Your bedroom. The bed is level again.' : 'Your bedroom. The bed has slid an inch toward the window: the whole house is tilting.' }],
      opts: [
        { kind: 'go', special: 'selfPlate', label: 'Look at yourself.' },
        { kind: 'go', label: 'Sleep. Let the marks settle.', next: 'sleep' },
        { kind: 'go', label: 'Go out.', next: 'map' },
      ] },

    /* ===== TAGET (here only once) ===== */
    tag9: { bg: 'gade3', title: 'Taget', card: ['Taget', 'here only once'],
      steps: [{ n: 'You climb out through the roof window and sit on the ridge of the house. The wind smells of new price tags and old wardrobes.' }, { glimpse: 'tag' }, { fx: { flag: 'tagGone' } }],
      opts: [{ kind: 'go', label: 'Climb back in before the roof notices.', next: 'map' }] },

    /* ===== FINALE: the coat ===== */
    f9_1: { bg: 'loft3', npc: 'frakke', title: 'Loftet', card: ['Loftet', 'the last old thing'],
      steps: [
        { n: 'Genbrugskassen has climbed the stairs behind you, arrows going round. You take the coat off, and it does not fall. It stands there on its own, empty, sleeves hanging, its label turned toward you like a face.' },
        { say: 'frakke', da: 'Hej. Kan du huske mig?', en: 'Hi. Do you remember me?' },
        { say: 'genbrugsk', da: 'Huset er stadig for tungt. Én ting mere skal væk.', en: 'The house is still too heavy. One more thing has to go.' },
        { say: 'frakke', da: 'Kan du ikke lide den gamle frakke mere?', en: 'Don’t you like the old coat any more?' },
      ],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 11, group: 'f', label: 'Say yes: you are really fond of your old coat.', build: { en: 'Yes, I am really fond of my old coat.', origin: 'coat', answers: [['Jo,', 'jeg', 'er', 'rigtig', 'glad', 'for', 'min', 'gamle', 'frakke.']], best: [['Jo,', 'min', 'gamle', 'frakke', 'er', 'jeg', 'rigtig', 'glad', 'for.']], tiles: ['Jo,', 'jeg', 'er', 'rigtig', 'glad', 'for', 'min', 'gamle', 'frakke.', 'Ja,', 'gammel', 'mit'] },
          ok: [{ n: 'The coat holds out its sleeves.' }], fail: [{ n: 'The words come out crooked, but “min gamle frakke” is enough. The coat holds out its sleeves.' }], next: 'f9_gammel' },
        { kind: 'say', stat: 'SPROG', dc: 11, group: 'f', label: 'Say it is far too big. You would rather have something new.', build: { en: 'It is far too big. I would rather have something new.', origin: 'coat', answers: [['Den', 'er', 'alt', 'for', 'stor.', 'Jeg', 'vil', 'hellere', 'have', 'noget', 'nyt.']], tiles: ['Den', 'er', 'alt', 'for', 'stor.', 'Jeg', 'vil', 'hellere', 'have', 'noget', 'nyt.', 'stort', 'ny'] },
          ok: [{ n: 'The coat nods its collar, slowly.' }], fail: [{ n: 'You fumble it. The coat understands anyway. It has known for a while.' }], next: 'f9_ny' },
        { kind: 'say', stat: 'SPROG', dc: 11, group: 'f', label: 'Say it should go to recycling, so somebody else can use it.', build: { en: 'It should go to recycling. Then somebody else can use it.', origin: 'coat', answers: [['Den', 'skal', 'til', 'genbrug.', 'Så', 'kan', 'en', 'anden', 'bruge', 'den.']], tiles: ['Den', 'skal', 'til', 'genbrug.', 'Så', 'kan', 'en', 'anden', 'bruge', 'den.', 'andet', 'det'] },
          ok: [{ n: 'Genbrugskassen’s arrows speed up, pleased.' }], fail: [{ n: 'Half of it gets lost in the dust. The coat understands anyway. It has been second-hand before.' }], next: 'f9_genbrug' },
      ] },
    f9_gammel: { bg: 'loft3', npc: 'frakke', title: 'Loftet',
      steps: [
        { n: 'You put it on again. This time it fits. Shoulders, sleeves, collar, all of it.' },
        { special: 'coatFits' },
        { th: 'It was never the coat that was the wrong size. You had to grow back into somebody who wears it.' },
        { n: 'Genbrugskassen takes a broken chair instead, without complaint. The house rises another inch.' },
        { fx: { boon: 'gammel', flag: 'Fgammel', resp: 3 } }, { fx: { flag: 'Fdone' } },
      ],
      opts: [{ kind: 'go', label: 'Go down to the hallway.', next: 'f9_end' }] },
    f9_ny: { bg: 'loft3', title: 'Loftet',
      steps: [
        { n: 'You fold the coat over your arm and carry it down to Skabet, who hangs it at the very back, behind everything, the way you keep a thing you are not going to wear.' },
        { fx: { wear: { frakke: null } } },
        { th: 'Without it you feel lighter, and somebody you have not met yet.' },
        { fx: { boon: 'ny', flag: 'Fny', resp: 3 } }, { fx: { flag: 'Fdone' } },
      ],
      opts: [{ kind: 'go', label: 'Go down to the hallway.', next: 'f9_end' }] },
    f9_genbrug: { bg: 'loft3', npc: 'genbrugsk', title: 'Loftet',
      steps: [
        { n: 'You lay the coat in Genbrugskassen. The arrows go round, once. The crate trundles down the stairs, out of the door, down to Udsalgsgade.' },
        { fx: { wear: { frakke: null } } },
        { n: 'The next morning the coat is standing in Retro’s window on a dummy. It fits the dummy perfectly. Somebody is already looking at it.' },
        { fx: { boon: 'genbrug', flag: 'Fgenbrug', resp: 3 } }, { fx: { flag: 'Fdone' } },
      ],
      opts: [{ kind: 'go', label: 'Go down to the hallway.', next: 'f9_end' }] },
    f9_end: { bg: 'gang3', npc: 'skab', title: 'Gangen', card: ['Gangen', 'the house is light again'],
      steps: [
        { n: 'With a long creak the house rises out of the street and settles on its stilts again, level. Udsalgsgade cheers from underneath.' },
        { special: 'chapterEcho3' },
        { say: 'skab', da: 'Nu ved Deroppe, hvad du har på, hvad du kan lide, og hvad du vil beholde. Så er kapitlet slut.', en: 'Now Deroppe knows what you wear, what you like, and what you want to keep. So the chapter is over.' },
        { n: 'A paper boat comes sailing down the stairwell and runs aground at your feet. Folded inside, very small: a ticket with no destination on it.' },
        { th: 'Somewhere new, then. You look down at what you are wearing. This time you know.' },
      ],
      opts: [{ kind: 'go', label: 'End the chapter.', next: 'end' }] },
  },
});
