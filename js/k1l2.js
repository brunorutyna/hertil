/* =========================================================================
   HERTIL · Kapitel 1 · Lektion 2 — "Hvor længe skal du være her?"
   Book: for … siden / i / om, hvornår / da / når, inversion after a time clause,
   adverbs in subordinate clauses, skal / vil gerne, savne, glad for, træt af.
   The grammar is the physics: in Hertil, time is livestock. A time phrase said aloud
   is a leash: for … siden drags a thing into the past, om flings it into the future,
   i stretches it out. Say the wrong one and the creature lives in the wrong when.
   ========================================================================= */

const stayBuild = { en: 'I am going to be here for a year / I go home in an hour / I go home when I have found my name.', origin: 'stay',
  answers: [['Jeg', 'skal', 'være', 'her', 'i', 'et', 'år.'], ['Jeg', 'rejser', 'hjem', 'om', 'en', 'time.'], ['Jeg', 'rejser', 'hjem,', 'når', 'jeg', 'har', 'fundet', 'mit', 'navn.']],
  best: [['Om', 'en', 'time', 'rejser', 'jeg', 'hjem.'], ['Når', 'jeg', 'har', 'fundet', 'mit', 'navn,', 'rejser', 'jeg', 'hjem.']],
  tiles: ['Jeg', 'skal', 'være', 'her', 'i', 'et', 'år.', 'rejser', 'hjem', 'hjem,', 'om', 'en', 'time.', 'når', 'jeg', 'har', 'fundet', 'mit', 'navn.', 'for', 'da'] };
const cameBuild = { en: 'I came here a few days ago / I came here when I fell.', origin: 'came',
  answers: [['Jeg', 'kom', 'hertil', 'for', 'nogle', 'dage', 'siden.'], ['Jeg', 'kom', 'hertil,', 'da', 'jeg', 'faldt.']],
  best: [['For', 'nogle', 'dage', 'siden', 'kom', 'jeg', 'hertil.'], ['Da', 'jeg', 'faldt,', 'kom', 'jeg', 'hertil.']],
  tiles: ['Jeg', 'kom', 'hertil', 'hertil,', 'for', 'nogle', 'dage', 'siden.', 'da', 'jeg', 'faldt.', 'om', 'når'] };
const happyBuild = { en: 'Yes, but when I cannot find my name, I miss something. / No, not really. I would like to go home.', origin: 'happy',
  answers: [['Ja,', 'men', 'når', 'jeg', 'ikke', 'kan', 'finde', 'mit', 'navn,', 'savner', 'jeg', 'noget.'], ['Nej,', 'ikke', 'rigtigt.', 'Jeg', 'vil', 'gerne', 'hjem.']],
  tiles: ['Ja,', 'men', 'når', 'jeg', 'ikke', 'kan', 'finde', 'mit', 'navn,', 'savner', 'jeg', 'noget.', 'Nej,', 'ikke', 'rigtigt.', 'Jeg', 'vil', 'gerne', 'hjem.', 'min'] };
const fixed = G => ['fix_taeller', 'fix_moel', 'fix_unge'].filter(k => G.flags[k]).length;
const valves = G => ['v_samler', 'v_spejl', 'v_moel'].filter(k => G.flags[k]).length;

SESSIONS.k1l2 = {
  id: 'k1l2', order: 2, short: 'Lektion 2', prevSession: 'k1l1', chapter: 'Kapitel 1 · Baggrund', title: 'Lektion 2 · Hvor længe skal du være her?', en: 'How long are you staying here?',
  blurb: 'Somebody let the hours out. Now everything in Hertil happens at the wrong time.',
  start: 'p2_wake', home: 'rede', travelAfter: 'p2seen', cluesFlag: 'clues2', cluesNeed: 3, dcMod: 2,
  // a ready-made character for those who start here
  startState: { resp: 5, sk: 8, insp: 1, boons: ['anker'], statXP: { SPROG: 8, LOEGN: 2, SNIGE: 3, HANDEL: 2, INDSIGT: 6 }, origin: { reason: 'Jeg kom hertil på grund af en lyd.' }, met: ['taeller', 'samler', 'spejl', 'bagvendt'] },

  locations: {
    rede:   { name: 'Reden', en: 'your nest', x: 30, y: 62, bg: 'nest', night: true, entry: G => 'rede2_hub' },
    bund:   { name: 'Bunden', en: 'where things land (and now rise)', x: 50, y: 50, bg: 'bottom', entry: G => !G.flags.Bstart ? 'b2_start' : 'bund2_hub' },
    trappe: { name: 'Trappen', en: 'the stair, now with doors', x: 68, y: 66, bg: 'stair', entry: G => 'trappe2_hub' },
    enge:   { name: 'Engen', en: 'where the hours graze', x: 16, y: 40, bg: 'enge', entry: G => fixed(G) >= 3 && !G.flags.Adone ? 'a_uret' : 'enge_hub' },
    damme:  { name: 'Dammene', en: 'the three ponds', x: 44, y: 80, bg: 'ponds', entry: G => 'damme2_hub' },
    himmel: { name: 'Himlen', en: 'up where Savnet floats', x: 52, y: 14, bg: 'himmel', req: G => G.flags.Bstart, entry: G => valves(G) >= 3 && !G.flags.Bdone ? 'b2_sky' : 'himmel_hub' },
    slette: { name: 'Støvsletten', en: 'the plain of pink dust', x: 78, y: 26, bg: 'plain', req: G => !G.prev.Cgone, night: true, entry: G => 'slette2_hub' },
    forgaars: { name: 'I forgårs', en: 'the day before yesterday', x: 86, y: 30, bg: 'forgaars', req: G => G.prev.Cgone, entry: G => 'forgaars_hub' },
    imorgen:  { name: 'I morgen', en: 'here only once', x: 84, y: 54, bg: 'void', eph: true, req: G => G.day >= 2 && !G.flags.imorgenGone, entry: G => 'imorgen' },
  },

  ending: G => [G.flags.Abound ? 'Stillet' : G.flags.Afree ? 'Vild tid' : G.flags.Aride ? 'Urrytter' : null, G.flags.Bsoft ? 'Lille Savn' : G.flags.Bpop ? 'Knaldet' : G.flags.Binside ? 'Indefra' : null].filter(Boolean).join(' · ') || '—',
  next: '<b>Lektion 3 · Bydel</b> Where you live, what is near, what you like and what you are tired of. Hertil gets neighbourhoods.',
  carryFlags: ['Abound', 'Afree', 'Aride', 'Bsoft', 'Bpop', 'Binside'],

  quests: {
    A: { title: 'Uret er løbet væk', en: 'The Clock has run away', obj: [['Fix three lines in Tælleren’s book (Trappen, Engen, Dammene)', 'fixAll'], ['Catch Uret at Engen', 'clockDone'], ['Decide what to do with it', 'Adone']] },
    B: { title: 'Savnet', en: 'The Missing', obj: [['Open three valves: help three creatures say what they miss', 'Bvalves'], ['Go up to Savnet', 'Bdone']] },
    C: { title: 'Tre døre', en: 'Three doors', obj: [['Answer the door that asks', 'Cq'], ['Sort time so the doors open', 'doereDone'], ['Go through DA', 'Cda']] },
    F: { title: 'Opholdstid', en: 'Your stay', obj: [['Have your stay stamped at Trappen', 'Fdone']] },
    S1: { title: 'Vejrtavlen', en: 'The weather board', side: true, obj: [['Read the weather with Spejlet', 'spejlDone']] },
    S2: { title: 'Samlerens sladder', en: "Samleren's gossip", side: true, obj: [['Guess who Samleren is talking about', 'samlerDone']] },
    S3: { title: 'Timernes navne', en: 'The names of the hours', side: true, obj: [['Find the hours at Engen', 'huntDone2']] },
    S4: { title: 'Snorene', en: 'The leashes', side: true, obj: [['Put the right leash on each sentence', 'snorDone']] },
    S5: { title: 'Spor', en: 'Traces', side: true, obj: [['Find three more traces of what you were', 'clues2']] },
  },

  glimpses: {
    tirsdag: { name: 'Tirsdag', en: 'Tuesday', text: 'A Tuesday walked past you on its own legs. It nodded as if it knew you. It was the Tuesday you arrived.' },
    kop: { name: 'Koppen', en: 'The cup', text: 'Inside Savnet, among a million missed things, one warm cup with a chip in it. You know that chip. Your thumb knows it.' },
    da: { name: 'Bag DA', en: 'Behind DA', text: 'One moment, once: you, before. Busy hands, someone laughing in the next room. Then the door shut.' },
    naar: { name: 'Bag NÅR', en: 'Behind NÅR', text: 'You fall into Hertil again and again, a different shape every time. Every one of you waves.' },
    forgaars: { name: 'I forgårs', en: 'The day before yesterday', text: 'In i forgårs your footprints are already there, waiting for you to arrive.' },
  },

  entries: {
    taeller: { book: 'Tællerens bog', who: 'Tælleren', bad: 'Tælleren rejser hjem for en time siden.', hint: 'The truth: it is leaving an hour from now. Not an hour ago.', kind: 'in', lab: '1 time',
      good: 'Tælleren rejser hjem om en time.', wrong: ['Tælleren rejser hjem i en time.', 'Tælleren rejser hjem siden en time.'],
      why: 'A point in the future, counted from now: om en time. “For … siden” is the past: it would leave yesterday, every hour, forever.' },
    moel: { book: 'Tællerens bog', who: 'Mølen', bad: 'Mølen kom hertil om tre dage.', hint: 'The truth: it arrived three days ago.', kind: 'ago', lab: '3 dage',
      good: 'Mølen kom hertil for tre dage siden.', wrong: ['Mølen kom hertil for tre dage.', 'Mølen kom hertil siden tre dage.'],
      why: 'A point in the past: for tre dage siden. “Om” is the future: the moth has not arrived yet, so it is still a cocoon.' },
    unge: { book: 'Tællerens bog', who: 'Ungen', bad: 'Ungen har været her for en uge siden.', hint: 'The truth: it came a week ago and has been here every day since, up to now.', kind: 'len', lab: '1 uge',
      good: 'Ungen har været her i en uge.', wrong: ['Ungen har været her om en uge.', 'Ungen har været her siden en uge.'],
      why: 'A length of time up to now: har været her i en uge. “For … siden” is one point, so Ungen keeps living that one Tuesday.' },
  },

  clockGame: { title: 'Fodr Uret', ask: 'Hvad er klokken?', flag: 'clockDone',
    good: 'Every time you read a face right, Uret takes one step closer. Now it is close enough to touch.',
    meh: 'Uret comes, slowly, sulking. A clock does not like being read wrong.',
    rounds: [[2, 0, 'Klokken er to.'], [2, 30, 'Klokken er halv tre.'], [3, 15, 'Klokken er kvart over tre.'], [3, 45, 'Klokken er kvart i fire.'],
      [4, 10, 'Klokken er ti minutter over fire.'], [4, 50, 'Klokken er ti minutter i fem.'], [7, 30, 'Klokken er halv otte.'], [12, 0, 'Klokken er tolv.']] },

  hunts: {
    enge: { title: 'Timernes navne', en: 'Find the hours', bg: 'enge',
      find: ['minut', 'time', 'dag', 'uge', 'maaned', 'aar'], decoys: ['morgen', 'aften', 'nat', 'solskin', 'regn', 'sne', 'sky', 'taage'] },
  },

  boxes: {
    doere: { title: 'Tre døre', q: 'Hvilken dør?', boxes: ['da', 'når', 'hvornår'],
      good: 'The three doors creak open, all at once, like a yawn.', meh: 'Two doors open. The third sulks, then opens anyway.',
      items: [
        { t: '___ kom du hertil?', a: 2, why: 'A question about when: hvornår.' },
        { t: 'Jeg var glad, ___ jeg landede.', a: 0, why: 'One time in the past: da.' },
        { t: '___ det regner op, savner jeg havet.', a: 1, why: 'Every time it happens: når.' },
        { t: 'Jeg rejser hjem, ___ Uret kommer tilbage.', a: 1, why: 'In the future: når.' },
        { t: '___ skal du hjem?', a: 2, why: 'A question: hvornår.' },
        { t: '___ jeg var et æg, sov jeg meget.', a: 0, why: 'One period in the past: da. (And the verb jumps forward: sov jeg.)' },
        { t: 'Tælleren tæller altid, ___ solen drejer.', a: 1, why: 'Again and again: når.' },
        { t: '___ jeg kom hertil, faldt jeg i en uge.', a: 0, why: 'One time in the past: da.' },
      ] },
    snor: { title: 'Snorene', q: 'Hvilken snor?', boxes: ['for … siden', 'i', 'om'],
      good: 'Every sentence on the right leash. The hours stop tugging and start grazing.', meh: 'A few sentences are on the wrong leash and are dragging their owners into next week.',
      items: [
        { t: 'Mølen kom hertil ___ tre dage siden.', a: 0, why: 'A point in the past: for … siden.' },
        { t: 'Ungen har været her ___ en uge.', a: 1, why: 'A length of time: i.' },
        { t: 'Tælleren rejser hjem ___ en time.', a: 2, why: 'A point in the future: om.' },
        { t: 'Jeg har været her ___ et år.', a: 1, why: 'How long, up to now: i.' },
        { t: 'Huset løb væk ___ to dage siden.', a: 0, why: 'For … siden.' },
        { t: 'Vi ses ___ to dage.', a: 2, why: 'In two days: om.' },
        { t: 'Hun boede der ___ ti år.', a: 1, why: 'A length: i.' },
        { t: '___ en time kommer Uret tilbage.', a: 2, why: 'Om en time, and then the verb jumps forward: kommer Uret.' },
      ] },
  },

  weather: {
    spejl: { title: 'Vejrtavlen', end: 'Spejlet ripples, pleased. The board has a reader. It immediately forgets which one.',
      rounds: [{ t: 'regnede det op.', when: 0, w: 'regn', why: '“regnede” is past tense.' }, { t: 'sner det tænder lige nu.', when: 1, w: 'sne', why: '“lige nu”: right now.' }, { t: 'skal der komme torden, der synger.', when: 2, w: 'torden', why: '“skal” + verb: what is going to happen.' }] },
  },

  guess: {
    samler: { title: 'Samlerens sladder', pool: ['taeller', 'uret', 'savnet', 'moel', 'spejl', 'unge', 'samler', 'sluget', 'husfolk'],
      end: r => r >= 5 ? 'Samleren files you under “Ting, der lytter”. Things that listen. A small file. A good one.' : 'Samleren shrugs with all its arms. Gossip is not for everyone.',
      rounds: [
        { npc: 'taeller', lines: ['Den kom hertil for meget lang tid siden.', 'Den tæller hele dagen.', 'Den rejser hjem om en time. Siger den.'], words: ['time', 'dag'] },
        { npc: 'uret', lines: ['Det løb væk i går.', 'Det har ben som en høne.', 'Når det løber, går tiden forkert.'] },
        { npc: 'savnet', lines: ['Det kom hertil for en måned siden.', 'Det har ingen øjne. Kun en mund.', 'Det savner alt, som I savner.'], words: ['maaned'] },
        { npc: 'moel', lines: ['Den kom hertil for tre dage siden.', 'Den sælger gnister om natten.', 'Den savner at være en larve.'], words: ['nat'], not: ['kokon'],
          alt: { req: G => !G.flags.fix_moel, npc: 'kokon', not: ['moel'], lines: ['Den hænger over den bløde dam.', 'Den har mange små vinduer. Alle er mørke.', 'Den venter på en linje i en bog.'] } },
        { npc: 'spejl', lines: ['Det står hele livet.', 'Det viser alt omvendt.', 'Det kan godt lide fejl.'] },
        { npc: 'unge', lines: ['Den har været her i en uge.', 'Den har store ører.', 'Den spørger altid: “Hvad lavede du?”'], words: ['uge'] },
      ] },
  },

  travel: [
    { id: 'tirsdag', bg: 'road', steps: [{ n: 'A Tuesday walks past on two thin legs, carrying a briefcase. It tips its hat.' }, { glimpse: 'tirsdag' }], opts: [{ kind: 'reply', group: 't', da: 'God tirsdag!', ok: [{ n: 'It looks pleased, and a little lost. It is not its day yet.' }], next: 'map' }, { kind: 'reply', group: 't', da: 'Jeg er træt af tirsdag.', ok: [{ say: 'unge', da: 'Jeg er også træt af tirsdag!', en: 'I am tired of Tuesday too!' }, { n: 'A small voice from a bush. The Tuesday walks off, offended.' }, { fx: { resp: 1 } }], next: 'map' }, { kind: 'go', label: 'Let it pass.', next: 'map' }] },
    { id: 'folger', bg: 'road', npc: 'bagvendt', req: G => G.prev.Clook, steps: [{ n: 'Den Bagvendte is right behind you. Ever since it turned, it walks wherever you walk, at the speed of a polite glacier.' }, { say: 'bagvendt', da: 'Hvor skal du hen? Jeg kommer med.', en: 'Where are you going? I am coming along.' }], opts: [{ kind: 'reply', da: 'Kom bare.', ok: [{ fx: { resp: 1 } }], next: 'map' }, { kind: 'go', label: 'Walk faster.', next: 'map' }] },
    { id: 'ikket2', bg: 'road', npc: 'ikket', req: G => hasBoon('ikket'), steps: [{ n: 'Ikket hops out of your mouth, eats the “not” off a sign that said NOT HERE, and hops back in.' }, { th: 'The sign now says HERE. Something is here. You decide not to find out what.' }], opts: [{ kind: 'go', label: 'Walk on.', next: 'map' }] },
    { id: 'moel2', bg: 'road', npc: 'moel', req: G => G.flags.fix_moel, steps: [{ n: 'Mølen, newly arrived and very proud of its wings, is selling sparks again.' }, { say: 'moel', da: 'Gnister. Seks skæl. I går var de billigere.', en: 'Sparks. Six scales. Yesterday they were cheaper.' }],
      opts: [{ kind: 'act', special: 'buyInsp', label: 'Buy a spark (6 skæl).', next: 'map' }, { kind: 'go', label: 'Walk on.', next: 'map' }] },
    { id: 'minut', bg: 'road', steps: [{ n: 'A minute has escaped from the herd and is lying in the road, ticking, belly up.' }],
      opts: [{ kind: 'act', stat: 'SNIGE', dc: 10, label: 'Catch it.', ok: [{ n: 'You pocket the minute. Later, when you need it, you will have one more.' }, { fx: { insp: 1 } }], fail: [{ n: 'It bites you and runs off. You lose a minute. Literally: you blink, and it is later.' }], next: 'map' },
             { kind: 'go', label: 'Step around it.', next: 'map' }] },
    { id: 'tal2', bg: 'road', req: G => !hasBoon('urnoegle'), steps: [{ n: 'POP. The numbers come loose again. Somewhere, a sum is weeping.' }, { special: 'glyphs' }], opts: [{ kind: 'go', label: 'Walk on.', next: 'map' }] },
  ],

  special: {
    async nest2Line() {
      const f = G.flags;
      logAdd(`<p>${esc(f.Adone && f.Bdone && f.Cda && !f.Fdone ? 'Your nest ticks. Tælleren is waiting at the Stair with a stamp.' : pick(['The nest has grown a cuckoo. It says “kuk” every time you forget a word.', 'Your marks fizz. Some of them are from yesterday. Some, somehow, are from tomorrow.']))}</p>`, 'narr');
    },
    async bund2Line() { logAdd(`<p>${esc(pick(['Things are falling UP now, toward the balloon. Samleren chases them with a net.', 'A key floats past at head height. Samleren files it mid-air.']))}</p>`, 'narr'); },
    async trappe2Line() {
      logAdd(`<p>${esc(pick(['Tælleren counts suitcases. It has packed for later, and that seems to calm it.', 'The three doors hum in three different keys.', 'One of the doors is clearing its throat.']))}</p>`, 'narr');
    },
    async engeLine() {
      if (!G.flags.e2seen) { G.flags.e2seen = true; logAdd(`<p>Engen: the hours graze here, woolly and ticking. One of them is three o’clock and keeps trying to be four.</p>`, 'narr'); return; }
      logAdd(`<p>${esc(G.flags.Adone ? (G.flags.Afree ? 'Uret gallops across the meadow. The hours scatter, delighted.' : 'Uret grazes with the hours, ticking quietly.') : pick(['The hours bleat in minutes.', 'A small hour is chewing on a Wednesday.']))}</p>`, 'narr');
    },
    async damme2Line() { logAdd(`<p>${esc(G.flags.fix_moel ? 'Mølen dries its new wings over the soft pond, showing off.' : 'Over the soft pond hangs a cocoon, upside down. It has a lot of tiny windows. All dark.')}</p>`, 'narr'); },
    async himmelLine() {
      const v = valves(G);
      logAdd(`<p>${esc(G.flags.Bdone ? (G.flags.Bpop ? 'The sky is full of streamers and the smell of a party that just ended.' : 'The sky is quiet. A few clouds are missing something, but they will live.') : v >= 3 ? 'Savnet sags low enough to reach.' : `Savnet is too high. Too full. ${3 - v} more creatures need to let go of something.`)}</p>`, 'narr');
    },
    async regReact2() {
      const s = G.origin.stay || '';
      const [da, en] = /om en time/.test(s) ? ['Om en time! Godt. Jeg sætter et ur på dig.', 'In an hour! Good. I am putting a clock on you.']
        : /når/.test(s) ? ['Når du har fundet dit navn. Det kan tage tid. Vi har tid. Vi har en hel eng.', 'When you have found your name. That may take time. We have time. We have a whole meadow.']
        : /i et år/.test(s) ? ['Et år. Jeg skriver et år. Det er mange tirsdage.', 'A year. I write a year. That is a lot of Tuesdays.']
        : ['Det ved du ikke endnu. Godt. Så skriver jeg “endnu”.', 'You do not know yet. Good. Then I write “yet”.'];
      sayEntry({ say: 'taeller', da, en }); await tapOn();
    },
    async fixCheck() { if (fixed(G) >= 3 && !G.flags.fixAll) { G.flags.fixAll = true; toast('All three lines fixed! Uret can smell its own time. Go to Engen.', 'gold'); AUDIO.sting('glimpse'); } },
    async valveCheck() { if (valves(G) >= 3 && !G.flags.Bvalves) { G.flags.Bvalves = true; toast('Three valves open! Savnet sags. You can reach it from Himlen.', 'gold'); AUDIO.sting('glimpse'); } },
    async glyphs() { G.glyph = 3; AUDIO.sting('glyph'); toast('ᚦᚨᛚ · the numbers have gone strange', 'gold'); },
    async drop(what) { AUDIO.sting('imprint'); toast(`Plop! ${what} falls out of Savnet.`, 'mark'); },
  },

  nodes: {
    /* ===== PROLOGUE ===== */
    p2_wake: { bg: 'nest', title: 'Reden', card: ['Kapitel 1 · Baggrund', 'Lektion 2 — Hvor længe skal du være her?'],
      steps: [
        { n: 'You wake up. It is Tuesday. It was Tuesday yesterday too.' },
        { n: 'A note is pinned to your nest: “I morgen er det også tirsdag.” The light is yellow, pink, blue and violet, all at once.' },
        { fx: { flag: 'p2seen' } },
      ],
      opts: [{ kind: 'go', label: 'Go to the Stair.', next: 'p2_stair' }] },
    p2_stair: { bg: 'stair', npc: 'taeller', title: 'Trappen', card: ['Trappen', 'something is very wrong with the time'],
      steps: [
        { n: 'Tælleren is packing a suitcase. The suitcase is already gone. It keeps packing anyway.' },
        { say: 'taeller', da: 'Uret er løbet væk! Nu går alt forkert.', en: 'The Clock has run away! Now everything goes wrong.' },
        { say: 'taeller', da: 'Se min bog. Linjerne er forkerte. Ret dem, så kommer Uret hjem.', en: 'Look at my book. The lines are wrong. Fix them, and the Clock comes home.' },
        { n: 'Behind it, three new doors have grown in the stair, like teeth.' },
        { fx: { quest: ['A', 'C', 'F', 'S5'] } },
      ],
      opts: [{ kind: 'act', special: 'fixEntry:taeller', label: 'Look at Tælleren’s own line.', next: G => G.flags.fix_taeller === 'ok' ? 'a_taeller_ok' : 'a_taeller_late' }] },
    a_taeller_ok: { bg: 'stair', npc: 'taeller', title: 'Trappen',
      steps: [{ n: 'The suitcase reappears, packed, with a label: OM EN TIME.' }, { say: 'taeller', da: 'Om en time. Ja. Så har jeg tid til at tælle først.', en: 'In an hour. Yes. Then I have time to count first.' }, { fx: { resp: 1 } }, { special: 'fixCheck' }],
      opts: [{ kind: 'go', label: 'Go out into Hertil.', next: 'map' }] },
    a_taeller_late: { bg: 'stair', npc: 'taeller', title: 'Trappen',
      steps: [{ n: 'The line is fixed, but slowly. For a while there are two Tællers, one leaving and one arriving. Then they agree.' }, { say: 'taeller', da: 'Om en time. Godt.', en: 'In an hour. Good.' }, { special: 'fixCheck' }],
      opts: [{ kind: 'go', label: 'Go out into Hertil.', next: 'map' }] },

    /* ===== REDEN ===== */
    rede2_hub: { bg: 'nest', title: 'Reden', hub: true, idle: true, home: true,
      steps: [{ special: 'nest2Line' }],
      opts: [
        { kind: 'go', special: 'selfPlate', label: 'Look at yourself.' },
        { kind: 'go', label: 'Sleep. Let the marks settle.', next: 'sleep' },
        { kind: 'go', label: 'Go out.', next: 'map' },
      ] },

    /* ===== TRAPPEN: the doors, the finale ===== */
    trappe2_hub: { bg: 'stair', npc: 'taeller', title: 'Trappen', hub: true,
      steps: [{ special: 'trappe2Line' }],
      opts: [
        { kind: 'go', label: 'Get your stay stamped.', req: G => G.flags.Adone && G.flags.Bdone && G.flags.Cda && !G.flags.Fdone, next: 'f2_stamp', mark: true },
        { kind: 'go', label: 'Go to the three doors.', req: G => !G.flags.Cda || !G.flags.Cnaar, next: 'c2_doors' },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    c2_doors: { bg: 'doere', npc: 'hvornaar', title: 'Dørene', hub: true,
      steps: [{ n: G => G.flags.Cda ? 'DA is shut for good. NÅR swings open and closed, open and closed. HVORNÅR hums to itself.' : 'Three doors: DA, NÅR, HVORNÅR. The last one has an eye where the keyhole should be.' }],
      opts: [
        { kind: 'go', label: 'Knock on HVORNÅR.', req: G => !G.flags.Cq, next: 'c2_hvornaar' },
        { kind: 'act', special: 'boxes:doere', label: 'Sort time so the doors open.', req: G => G.flags.Cq && !G.flags.doereDone },
        { kind: 'go', label: 'Go through DA.', req: G => G.flags.doereDone && !G.flags.Cda, next: 'c2_da' },
        { kind: 'go', label: 'Go through NÅR.', req: G => G.flags.doereDone && !G.flags.Cnaar, next: 'c2_naar' },
        { kind: 'go', label: 'Back to the stair.', next: 'trappe2_hub' },
      ] },
    c2_hvornaar: { bg: 'doere', npc: 'hvornaar', title: 'Dørene',
      steps: [{ n: 'You knock. The door knocks back, from your side.' }, { say: 'hvornaar', da: 'Hvornår kom du hertil?', en: 'When did you come here?' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 9, label: 'Tell it when you came.', build: cameBuild,
          ok: [{ say: 'hvornaar', da: 'Godt svar. Sortér nu tiden, så åbner vi.', en: 'Good answer. Now sort time, and we open.' }, { fx: { flag: 'Cq', resp: 1 } }],
          fail: [{ n: 'The door was yawning and missed half of it. It nods anyway; doors are easygoing.' }, { say: 'hvornaar', da: 'Fint. Sortér tiden, så åbner vi.', en: 'Fine. Sort time, and we open.' }, { fx: { flag: 'Cq' } }], next: 'c2_doors' },
        { kind: 'lie', stat: 'LOEGN', dc: 12, label: 'Answer with the house’s past.', req: G => hasBoon('laant'), build: { en: 'I came here when the storm came.', answers: [['Jeg', 'kom', 'hertil,', 'da', 'stormen', 'kom.']], best: [['Da', 'stormen', 'kom,', 'kom', 'jeg', 'hertil.']], tiles: ['Jeg', 'kom', 'hertil,', 'da', 'stormen', 'kom.', 'når', 'fordi'] },
          ok: [{ say: 'hvornaar', da: 'Ah. En storm. Det kender jeg. Kom ind.', en: 'Ah. A storm. I know that one. Come in.' }, { fx: { flag: 'Cq', resp: 1 } }],
          fail: [{ say: 'hvornaar', da: 'Det er ikke din storm. Men okay.', en: 'That is not your storm. But okay.' }, { fx: { flag: 'Cq' } }], next: 'c2_doors' },
      ] },
    c2_da: { bg: 'void', title: 'DA',
      steps: [{ n: 'Behind DA there is one moment, and only one. You get to stand in it.' }, { glimpse: 'da' }, { th: G => hasBoon('laant') ? 'Or was that the house’s moment? It is hard to tell with a borrowed past.' : 'It was yours. You are almost sure.' }, { fx: { flag: 'Cda' } }],
      opts: [{ kind: 'go', label: 'Step back out.', next: 'c2_doors' }] },
    c2_naar: { bg: 'void', title: 'NÅR',
      steps: [{ n: 'Behind NÅR, everything that happens again and again. Mostly: you, falling in.' }, { glimpse: 'naar' }, { fx: { flag: 'Cnaar', resp: 1 } }],
      opts: [{ kind: 'go', label: 'Wave back. Step out.', next: 'c2_doors' }] },

    /* ===== BUNDEN: Savnet begins ===== */
    b2_start: { bg: 'bottom', npc: 'samler', title: 'Bunden',
      steps: [
        { n: 'Things are falling UP. Keys, teeth, a trombone, all rising toward a striped balloon the size of a cloud.' },
        { say: 'samler', da: 'Savnet sluger alt, som vi savner. Når det bliver for stort, springer det.', en: 'The Missing swallows everything we miss. When it gets too big, it bursts.' },
        { say: 'samler', da: 'Og så regner det med længsel. I en uge.', en: 'And then it rains longing. For a week.' },
        { fx: { flag: 'Bstart', quest: ['B', 'S2'] } },
      ],
      opts: [{ kind: 'go', label: 'Look around Bunden.', next: 'bund2_hub' }] },
    bund2_hub: { bg: 'bottom', npc: 'samler', title: 'Bunden', hub: true,
      steps: [{ special: 'bund2Line' }],
      opts: [
        { kind: 'reply', req: G => !G.flags.v_samler, once: true, da: 'Hvad savner du?', ok: [{ fx: { flag: 'askSamler' } }, { say: 'samler', da: 'Når det regner op, savner jeg … savner jeg …', en: 'When it rains upwards, I miss … I miss …' }, { th: 'Savnet has swallowed the end of its sentence.' }] },
        { kind: 'say', stat: 'SPROG', dc: 10, label: 'Finish Samleren’s sentence for it.', req: G => G.flags.askSamler && !G.flags.v_samler, build: { en: 'Its sentence: When it rains upwards, I miss the sea.', answers: [['Når', 'det', 'regner', 'op,', 'savner', 'jeg', 'havet.']], tiles: ['Når', 'det', 'regner', 'op,', 'savner', 'jeg', 'havet.', 'jeg', 'savner', 'da'] },
          ok: [{ say: 'samler', da: 'Havet! Ja. Jeg har aldrig set det. Men jeg savner det.', en: 'The sea! Yes. I have never seen it. But I miss it.' }, { special: 'drop:A bucket of sea' }, { fx: { flag: 'v_samler', resp: 1 } }, { special: 'valveCheck' }],
          fail: [{ n: 'Right words; Samleren was busy netting a flying fork. It catches the end of the sentence anyway.' }, { special: 'drop:A bucket of sea' }, { fx: { flag: 'v_samler' } }, { special: 'valveCheck' }] },
        { kind: 'act', special: 'guess:samler', label: 'Listen to Samleren gossip.', req: G => !G.flags.samlerDone },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },

    /* ===== ENGEN: the hours, Ungen, Uret ===== */
    enge_hub: { bg: 'enge', npc: G => G.flags.fix_unge ? 'timerne' : 'ungerne', title: 'Engen', hub: true, quest: ['S3', 'S4'],
      steps: [{ special: 'engeLine' }],
      opts: [
        { kind: 'go', label: 'Talk to Ungen. All of them.', req: G => !G.flags.fix_unge, next: 'a_unge' },
        { kind: 'act', special: 'hunt:enge', label: 'Find the hours by name.', req: G => !G.flags.huntDone2, next: 'enge_hunted' },
        { kind: 'act', special: 'boxes:snor', label: 'Put the right leash on each sentence.', req: G => !G.flags.snorDone },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    enge_hunted: { bg: 'enge', npc: 'timerne', title: 'Engen',
      steps: [{ n: 'Every hour answers to its name. One of them follows you a few steps, then remembers it has a job.' }, { fx: { flag: 'huntDone2', sk: 3, resp: 1 } }],
      opts: [{ kind: 'go', label: 'Back.', next: 'enge_hub' }] },
    a_unge: { bg: 'enge', npc: 'ungerne', title: 'Engen',
      steps: [{ n: 'Four hundred Ungen. Same ears, same Tuesday, same question, all at once.' }, { say: 'unge', da: 'Hej! Du er ny. Hvad lavede du, før du kom hertil?', en: 'Hi! You are new. What did you do before you came here?' }, { th: 'Its line in the book must be the problem.' }],
      opts: [{ kind: 'act', special: 'fixEntry:unge', label: 'Fix Ungen’s line.', next: G => G.flags.fix_unge === 'ok' ? 'a_unge_ok' : 'a_unge_late' }] },
    a_unge_ok: { bg: 'enge', npc: 'unge', title: 'Engen',
      steps: [{ n: 'The four hundred fold into one, with a sound like a deck of cards.' }, { say: 'unge', da: 'Jeg har været her i en uge! Det er længe!', en: 'I have been here for a week! That is long!' }, { fx: { resp: 1 } }, { special: 'fixCheck' }],
      opts: [{ kind: 'go', label: 'Back to the meadow.', next: 'enge_hub' }] },
    a_unge_late: { bg: 'enge', npc: 'unge', title: 'Engen',
      steps: [{ n: 'The copies fold up slowly. A few stragglers wander off into Wednesday.' }, { special: 'fixCheck' }],
      opts: [{ kind: 'go', label: 'Back to the meadow.', next: 'enge_hub' }] },
    a_uret: { bg: 'enge', npc: 'uret', title: 'Engen', card: ['Engen', 'it smells its own time'],
      steps: [{ n: 'Uret gallops out of the long grass: a wardrobe on chicken legs, face spinning, pendulum swinging like a tail.' }, { say: 'uret', da: 'Tik. Tak. Hvad er klokken? Ved du det?', en: 'Tick. Tock. What time is it? Do you know?' }],
      opts: [{ kind: 'act', special: 'clock', label: 'Read its faces, one by one.', next: 'a_uret_choice' }] },
    a_uret_choice: { bg: 'enge', npc: 'uret', title: 'Engen',
      steps: [{ th: 'It stands still at last, ticking so hard the grass shakes.' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 11, group: 'end', label: 'Wind it back to normal.', build: { en: 'In an hour you must be home.', answers: [['Om', 'en', 'time', 'skal', 'du', 'være', 'hjemme.'], ['Du', 'skal', 'være', 'hjemme', 'om', 'en', 'time.']], tiles: ['Om', 'en', 'time', 'skal', 'du', 'være', 'hjemme.', 'for', 'siden'] },
          ok: [{ n: 'Tick. Tock. Correct. Uret trots off toward the Stair, ticking in time.' }], fail: [{ n: 'Uret was mid-gallop and heard you late. It goes home anyway, one minute slow.' }], next: 'a_wound' },
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'end', label: 'Let it run free.', build: { en: 'You may run whenever you feel like it.', answers: [['Du', 'må', 'løbe,', 'når', 'du', 'har', 'lyst.']], best: [['Når', 'du', 'har', 'lyst,', 'må', 'du', 'løbe.']], tiles: ['Du', 'må', 'løbe,', 'når', 'du', 'har', 'lyst.', 'da', 'hvornår'] },
          ok: [{ n: 'Uret kicks its legs in the air and bolts. The hours follow it, bleating.' }], fail: [{ n: 'It does not wait for the end of the sentence. It bolts anyway. That was the idea.' }], next: 'a_free' },
        { kind: 'act', stat: 'SNIGE', dc: 12, group: 'end', label: 'Jump on its back.', ok: [{ n: 'You land on top of the wardrobe. It bucks, once, then accepts you.' }], fail: [{ n: 'You land on the pendulum. It swings you up onto the top. Close enough.' }], next: 'a_ride' },
      ] },
    a_wound: { bg: 'stair', npc: 'uret', title: 'Trappen',
      steps: [{ n: 'Uret settles at the foot of the Stair. The light goes back to one colour at a time. Tælleren cries a little, with relief, through its trumpet.' }, { n: 'Uret drops a small key at your feet.' }, { fx: { boon: 'urnoegle', flag: 'Abound', resp: 2 } }, { fx: { flag: 'Adone' } }],
      opts: [{ kind: 'go', label: 'Pocket the key.', next: 'map' }] },
    a_free: { bg: 'enge', title: 'Engen',
      steps: [{ n: 'From now on, time in Hertil runs wild. Some walks take an afternoon. Some take no time at all.' }, { th: 'Tælleren is going to hate this. You love it.' }, { fx: { boon: 'vild', flag: 'Afree', resp: 1 } }, { fx: { flag: 'Adone' } }],
      opts: [{ kind: 'go', label: 'Run after it for a bit.', next: 'map' }] },
    a_ride: { bg: 'enge', npc: 'uret', title: 'Engen',
      steps: [{ n: 'You ride the clock across Engen. Tuesday blurs into Wednesday and back.' }, { say: 'uret', da: 'Når du vil, kommer jeg.', en: 'Whenever you want, I come.' }, { fx: { boon: 'rytter', flag: 'Aride', resp: 1 } }, { fx: { flag: 'Adone' } }],
      opts: [{ kind: 'go', label: 'Slide off.', next: 'map' }] },

    /* ===== DAMMENE: the cocoon, Spejlet ===== */
    damme2_hub: { bg: 'ponds', npc: G => G.flags.fix_moel ? 'spejl' : 'kokon', title: 'Dammene', hub: true, quest: 'S1',
      steps: [{ special: 'damme2Line' }],
      opts: [
        { kind: 'act', special: 'fixEntry:moel', label: 'Fix the cocoon’s line in the book.', req: G => !G.flags.fix_moel, next: G => G.flags.fix_moel === 'ok' ? 'a_moel_ok' : 'a_moel_late' },
        { kind: 'go', label: 'Ask Mølen what it misses.', req: G => G.flags.fix_moel && !G.flags.v_moel && G.flags.Bstart, next: 'b2_moel' },
        { kind: 'go', label: 'Ask Spejlet what it misses.', req: G => !G.flags.v_spejl && G.flags.Bstart, next: 'b2_spejl' },
        { kind: 'act', special: 'weather:spejl', label: 'Read the weather board with Spejlet.', req: G => !G.flags.spejlDone },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    a_moel_ok: { bg: 'ponds', npc: 'moel', title: 'Dammene',
      steps: [{ n: 'Every window in the cocoon lights up. RIP. Mølen arrives, three days late and right on time.' }, { say: 'moel', da: 'Jeg kom hertil for tre dage siden! Hvor har jeg været?', en: 'I came here three days ago! Where have I been?' }, { fx: { resp: 1 } }, { special: 'fixCheck' }],
      opts: [{ kind: 'go', label: 'Back.', next: 'damme2_hub' }] },
    a_moel_late: { bg: 'ponds', npc: 'moel', title: 'Dammene',
      steps: [{ n: 'The cocoon hatches, but one wing arrives first and the other a minute later.' }, { special: 'fixCheck' }],
      opts: [{ kind: 'go', label: 'Back.', next: 'damme2_hub' }] },
    b2_moel: { bg: 'ponds', npc: 'moel', title: 'Dammene',
      steps: [{ say: 'moel', da: 'Hvad jeg savner? Da jeg var en larve … var jeg …', en: 'What I miss? When I was a caterpillar … I was …' }, { th: 'The end of the sentence is up in Savnet.' }],
      opts: [{ kind: 'say', stat: 'SPROG', dc: 10, label: 'Finish its sentence.', build: { en: 'Its sentence: When I was a caterpillar, I was happy.', answers: [['Da', 'jeg', 'var', 'en', 'larve,', 'var', 'jeg', 'glad.']], tiles: ['Da', 'jeg', 'var', 'en', 'larve,', 'var', 'jeg', 'glad.', 'Når', 'jeg', 'var'] },
        ok: [{ say: 'moel', da: 'Glad! Ja. Jeg savner at være glad og grøn og langsom.', en: 'Happy! Yes. I miss being happy and green and slow.' }, { special: 'drop:A very small green sock' }, { fx: { flag: 'v_moel', resp: 1 } }, { special: 'valveCheck' }],
        fail: [{ n: 'Right words, but a gust takes them. Mølen catches them with its antennae.' }, { special: 'drop:A very small green sock' }, { fx: { flag: 'v_moel' } }, { special: 'valveCheck' }], next: 'damme2_hub' }] },
    b2_spejl: { bg: 'ponds', npc: 'spejl', title: 'Dammene',
      steps: [{ n: 'Spejlet ripples toward the sky, sulking.' }, { say: 'spejl', da: 'Når ingen kigger, savner jeg …', en: 'When nobody is looking, I miss …' }],
      opts: [{ kind: 'say', stat: 'SPROG', dc: 10, label: 'Finish its sentence.', build: { en: 'Its sentence: When nobody is looking, I miss my face.', answers: [['Når', 'ingen', 'kigger,', 'savner', 'jeg', 'mit', 'ansigt.']], tiles: ['Når', 'ingen', 'kigger,', 'savner', 'jeg', 'mit', 'ansigt.', 'jeg', 'savner', 'min'] },
        ok: [{ n: 'A face drops out of the sky and lands in the pond. Spejlet tries it on. It fits.' }, { special: 'drop:A face' }, { fx: { flag: 'v_spejl', resp: 1 } }, { special: 'valveCheck' }],
        fail: [{ n: 'Right words. Spejlet only hears its own echo, but the face drops anyway.' }, { special: 'drop:A face' }, { fx: { flag: 'v_spejl' } }, { special: 'valveCheck' }], next: 'damme2_hub' }] },

    /* ===== HIMLEN: Savnet ===== */
    himmel_hub: { bg: 'himmel', npc: G => G.flags.Bdone && !G.flags.Bsoft ? null : 'savnet', title: 'Himlen', hub: true, idle: true,
      steps: [{ special: 'himmelLine' }],
      opts: [{ kind: 'go', label: 'Climb back down.', next: 'map' }] },
    b2_sky: { bg: 'himmel', npc: 'savnet', title: 'Himlen', card: ['Himlen', 'you climb a rope of missed things'],
      steps: [
        { n: 'You climb up a rope made of missed things: socks, Sundays, a cat that left.' },
        { say: 'savnet', da: 'Jeg savner alt. Alt, som I savner. Jeg er så fuld.', en: 'I miss everything. Everything you all miss. I am so full.' },
        { th: 'Up close it is warm, and humming, and very, very tight.' },
      ],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 11, group: 'end', label: 'Talk it down gently.', build: { en: 'I am happy to be here, but I sometimes miss something.', answers: [['Jeg', 'er', 'glad', 'for', 'at', 'være', 'her,', 'men', 'jeg', 'savner', 'nogle', 'gange', 'noget.'], ['Jeg', 'er', 'glad', 'for', 'at', 'være', 'her,', 'men', 'nogle', 'gange', 'savner', 'jeg', 'noget.']], tiles: ['Jeg', 'er', 'glad', 'for', 'at', 'være', 'her,', 'men', 'jeg', 'savner', 'nogle', 'gange', 'noget.', 'af', 'ikke'] },
          ok: [{ n: 'Savnet sighs out a long, long breath. It shrinks to the size of a melon and bumps against your shoulder.' }], fail: [{ n: 'It only half hears you over its own humming, but it gets the idea. It shrinks anyway.' }], next: 'b2_soft' },
        { kind: 'act', stat: 'SNIGE', dc: 12, group: 'end', label: 'Pop it with a sharp feather.', ok: [{ n: 'POP.' }], fail: [{ n: 'You miss. You trip. You fall on it. POP.' }], next: 'b2_pop' },
        { kind: 'go', group: 'end', label: 'Climb inside.', next: 'b2_inside' },
      ] },
    b2_soft: { bg: 'himmel', npc: 'savnet', title: 'Himlen',
      steps: [{ say: 'savnet', da: 'Må jeg blive hos dig? Jeg savner nogen.', en: 'May I stay with you? I miss someone.' }, { fx: { boon: 'ballon', flag: 'Bsoft', resp: 2 } }, { fx: { flag: 'Bdone' } }],
      opts: [{ kind: 'go', label: 'Tie it to your wrist. Climb down.', next: 'map' }] },
    b2_pop: { bg: 'himmel', title: 'Himlen',
      steps: [{ n: 'Everything everyone missed rains down on Hertil. For one hour, every creature cries. Then somebody starts a band.' }, { th: 'The party goes on until Lilla nat. Somebody hands you a drink without stopping their dance.' }, { fx: { boon: 'knald', flag: 'Bpop', resp: 1 } }, { fx: { flag: 'Bdone' } }],
      opts: [{ kind: 'go', label: 'Join the party.', next: 'map' }] },
    b2_inside: { bg: 'void', title: 'Indeni',
      steps: [{ n: 'Inside, it is soft and loud with everything anyone ever missed. You swim through it.' }, { glimpse: 'kop' }, { th: 'You climb out holding nothing. But you know now what you miss.' }, { fx: { boon: 'indeni', flag: 'Binside', resp: 1 } }, { fx: { flag: 'Bdone' } }],
      opts: [{ kind: 'go', label: 'Climb out and down.', next: 'map' }] },

    /* ===== STØVSLETTEN and I FORGÅRS (what Lektion 1 left behind) ===== */
    slette2_hub: { bg: 'plain', npc: 'bagvendt', title: 'Støvsletten', hub: true, idle: true,
      steps: [{ n: G => G.prev.Clook ? 'Den Bagvendte faces you now, always, like a sunflower with a grudge.' : 'Den Bagvendte faces the towers, as ever. It hums something old.' }],
      opts: [
        { kind: 'reply', once: true, da: 'Hvor længe skal du være her?', ok: [{ say: 'bagvendt', da: 'Jeg har været her i tusind år. Jeg skal være her i tusind år mere. Måske.', en: 'I have been here for a thousand years. I shall be here for a thousand more. Maybe.' }, { fx: { resp: 1 } }] },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    forgaars_hub: { bg: 'forgaars', npc: 'huset', title: 'I forgårs', hub: true,
      steps: [{ n: 'Everything here is upside down and two days old. The little house that ran away lives here now.' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 9, once: true, label: 'Ask when it ran away.', build: { en: 'When did you run away?', answers: [['Hvornår', 'løb', 'du', 'væk?']], tiles: ['Hvornår', 'løb', 'du', 'væk?', 'Når', 'Da'] },
          ok: [{ say: 'huset', da: 'For to dage siden. Nej, i forgårs. Nej, jeg ER i forgårs!', en: 'Two days ago. No, the day before yesterday. No, I AM the day before yesterday!' }, { glimpse: 'forgaars' }, { fx: { resp: 1 } }],
          fail: [{ say: 'huset', da: 'I forgårs. Altid i forgårs.', en: 'The day before yesterday. Always the day before yesterday.' }, { glimpse: 'forgaars' }] },
        { kind: 'go', label: 'Go back to today.', next: 'map' },
      ] },

    /* ===== I MORGEN (here only once) ===== */
    imorgen: { bg: 'void', title: 'I morgen', card: ['I morgen', 'a hole in time, open once'],
      steps: [{ n: 'Through a hole in time: tomorrow. In it stands you, slightly taller, waving with the wrong hand.' }, { say: 'unge', da: 'I morgen skal du sove længe. Du har fortjent det.', en: 'Tomorrow you will sleep in. You have earned it.' }, { th: 'Tomorrow-you sounds a lot like Ungen. Suspicious.' }],
      opts: [
        { kind: 'reply', group: 'i', da: 'Tak. Vi ses i morgen.', ok: [{ n: 'Tomorrow-you tosses you a spark and closes the hole.' }, { fx: { insp: 1, flag: 'imorgenGone' } }], next: 'map' },
        { kind: 'act', stat: 'INDSIGT', dc: 11, group: 'i', label: 'Look past tomorrow-you.', ok: [{ n: 'Behind tomorrow there is a street, with houses and neighbours. Hertil is growing a neighbourhood.' }, { fx: { resp: 1, flag: 'imorgenGone' } }], fail: [{ n: 'The hole snaps shut on your nose. Ow. Tomorrow will have a bruise.' }, { fx: { flag: 'imorgenGone' } }], next: 'map' },
      ] },

    /* ===== FINALE: your stay ===== */
    f2_stamp: { bg: 'stair', npc: 'uret', title: 'Trappen', card: ['Trappen', 'opholdstid'],
      steps: [{ n: G => G.flags.Afree ? 'Uret gallops past just long enough for Tælleren to borrow its face as a stamp.' : 'Uret ticks beside the stair. Tælleren holds a stamp shaped like a clock.' }, { npc: 'taeller' }, { say: 'taeller', da: 'Hvor længe skal du være her?', en: 'How long are you going to be here?' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'stay', label: 'Tell it how long.', build: stayBuild, ok: [{ say: 'taeller', da: 'Godt. Det stempler jeg.', en: 'Good. I stamp that.' }], fail: [{ say: 'taeller', da: 'Stemplet gled. Men det holder.', en: 'The stamp slipped. But it holds.' }], next: 'f2_happy' },
        { kind: 'reply', group: 'stay', da: 'Det ved jeg ikke endnu.', ok: [{ fx: { origin: { stay: 'Det ved jeg ikke endnu.' } } }], next: 'f2_happy' },
      ] },
    f2_happy: { bg: 'stair', npc: 'taeller', title: 'Trappen',
      steps: [{ special: 'regReact2' }, { say: 'taeller', da: 'Og er du glad for at være her?', en: 'And are you happy to be here?' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'h', label: 'Answer honestly.', build: happyBuild, ok: [{ say: 'taeller', da: 'Det kan jeg godt forstå.', en: 'I can understand that.' }], fail: [{ say: 'taeller', da: 'Hm. Godt.', en: 'Hm. Good.' }], next: 'f2_end' },
        { kind: 'reply', group: 'h', da: 'Ja, meget!', ok: [{ fx: { origin: { happy: 'Ja, meget!' } } }, { say: 'taeller', da: 'Så er jeg også glad.', en: 'Then I am happy too.' }], next: 'f2_end' },
      ] },
    f2_end: { bg: 'stair', npc: 'taeller', title: 'Trappen',
      steps: [
        { n: 'KA-CHUNK. The stamp lands on your forehead. It tickles. It says how long you are here, in Danish, backwards.' },
        { th: G => /om en time/.test(G.origin.stay || '') ? 'A small clock grows on your wrist. It says 59:59. It is counting.' : 'Somewhere in Hertil, a door you have not seen yet unlocks itself.' },
        { say: 'taeller', da: 'Så er du skrevet ind. Vi ses i morgen. Det er nok tirsdag.', en: 'Now you are written in. See you tomorrow. It will probably be Tuesday.' },
        { fx: { flag: 'Fdone', resp: 1 } },
      ],
      opts: [{ kind: 'go', label: 'End the lesson.', next: 'end' }] },
  },
};
