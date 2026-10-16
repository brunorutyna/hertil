/* =========================================================================
   HERTIL · Kapitel 1 · Lektion 1 — "Hvorfor kom du hertil?"
   Book: background & reasons — før-clauses (inversion), fordi / for at / på grund af,
   ikke & gerne inside a fordi-clause, past tense (-ede / -te / irregular), i / på.
   The grammar is the physics: in Hertil a thing without a reason sinks, and a misplaced
   "ikke" tears loose and starts eating sentences.
   ========================================================================= */

// what you did before (any of five jobs), with or without a før-clause first
const JOBS5 = ['kok.', 'lærer.', 'læge.', 'arkitekt.', 'musiker.'];
const jobBuild = { en: 'Before I came here, I worked as a … (cook / teacher / doctor / architect / musician)',
  answers: JOBS5.map(j => ['Jeg', 'arbejdede', 'som', j]), best: JOBS5.map(j => ['Før', 'jeg', 'kom', 'hertil,', 'arbejdede', 'jeg', 'som', j]),
  tiles: ['Før', 'jeg', 'kom', 'hertil,', 'jeg', 'arbejdede', 'som', ...JOBS5, 'på'], origin: 'job' };
const studyBuild = { en: 'Before I came here, I studied medicine / physics / French at the university.', origin: 'job',
  answers: ['medicin', 'fysik', 'fransk'].map(f => ['Jeg', 'læste', f, 'på', 'universitetet.']), best: ['medicin', 'fysik', 'fransk'].map(f => ['Før', 'jeg', 'kom', 'hertil,', 'læste', 'jeg', f, 'på', 'universitetet.']),
  tiles: ['Før', 'jeg', 'kom', 'hertil,', 'jeg', 'læste', 'medicin', 'fysik', 'fransk', 'på', 'universitetet.', 'i'] };
const placeBuild = { en: 'Before I came here, I lived in a big city / on an island / in the countryside.',
  answers: [['Før', 'jeg', 'kom', 'hertil,', 'boede', 'jeg', 'i', 'en', 'storby.'], ['Før', 'jeg', 'kom', 'hertil,', 'boede', 'jeg', 'på', 'en', 'ø.'], ['Før', 'jeg', 'kom', 'hertil,', 'boede', 'jeg', 'på', 'landet.']],
  tiles: ['Før', 'jeg', 'kom', 'hertil,', 'boede', 'jeg', 'i', 'på', 'en', 'storby.', 'ø.', 'landet.', 'jeg'], origin: 'place' };
const fritidBuild = { en: 'In my free time I played music / read books / cycled.',
  answers: [['I', 'min', 'fritid', 'spillede', 'jeg', 'musik.'], ['I', 'min', 'fritid', 'læste', 'jeg', 'bøger.'], ['I', 'min', 'fritid', 'cyklede', 'jeg.']],
  tiles: ['I', 'min', 'fritid', 'jeg', 'spillede', 'læste', 'cyklede', 'musik.', 'bøger.', 'jeg', 'mit'], origin: 'fritid' };

// the three kinds of reason (the prologue): a thing, a purpose, a story
const reasonPGA = { en: 'I came here because of a sound / a light / a dream.', origin: 'reason',
  answers: [['Jeg', 'kom', 'hertil', 'på', 'grund', 'af', 'en', 'lyd.'], ['Jeg', 'kom', 'hertil', 'på', 'grund', 'af', 'et', 'lys.'], ['Jeg', 'kom', 'hertil', 'på', 'grund', 'af', 'en', 'drøm.']],
  tiles: ['Jeg', 'kom', 'hertil', 'på', 'grund', 'af', 'en', 'et', 'lyd.', 'lys.', 'drøm.', 'fordi', 'at'] };
const reasonFA = { en: 'I came here to find someone / to forget something / to sleep.', origin: 'reason',
  answers: [['Jeg', 'kom', 'hertil', 'for', 'at', 'finde', 'nogen.'], ['Jeg', 'kom', 'hertil', 'for', 'at', 'glemme', 'noget.'], ['Jeg', 'kom', 'hertil', 'for', 'at', 'sove.']],
  tiles: ['Jeg', 'kom', 'hertil', 'for', 'at', 'finde', 'glemme', 'sove.', 'nogen.', 'noget.', 'fordi', 'jeg'] };
const reasonFORDI = { en: 'I came here because I could not / would not stay there.', origin: 'reason',
  answers: [['Jeg', 'kom', 'hertil,', 'fordi', 'jeg', 'ikke', 'kunne', 'blive', 'der.'], ['Jeg', 'kom', 'hertil,', 'fordi', 'jeg', 'ikke', 'ville', 'blive', 'der.']],
  tiles: ['Jeg', 'kom', 'hertil,', 'fordi', 'jeg', 'ikke', 'kunne', 'ville', 'blive', 'der.', 'på', 'at'] };

SESSIONS.k1l1 = {
  id: 'k1l1', order: 1, short: 'Lektion 1', chapter: 'Kapitel 1 · Baggrund', title: 'Lektion 1 · Hvorfor kom du hertil?', en: 'Why did you come here?',
  blurb: 'You fall into Hertil, a world printed in three loud inks. Everyone asks why you came. Whatever you answer becomes true.',
  start: 'p_fall', home: 'rede', travelAfter: 'Areason', cluesFlag: 'Aclues', cluesNeed: 3,

  /* ---------- the map of Hertil ---------- */
  locations: {
    rede:   { name: 'Reden', en: 'your nest', x: 30, y: 62, bg: 'nest', night: true, entry: G => 'rede_hub' },
    bund:   { name: 'Bunden', en: 'where things land', x: 50, y: 50, bg: 'bottom', entry: G => G.flags.Btaeller && !G.flags.Bsamler ? 'b_samler' : 'bund_hub' },
    trappe: { name: 'Trappen', en: 'the stair that goes into itself', x: 68, y: 66, bg: 'stair', entry: G => 'trappe_hub' },
    hal:    { name: 'Vævehallen', en: 'the weaving hall', x: 22, y: 36, bg: 'hall', req: G => !G.flags.hallGone, entry: G => G.flags.Btaeller && G.flags.Bsamler && !G.flags.Bhall ? 'b_hall' : 'hal_hub' },
    slette: { name: 'Støvsletten', en: 'the plain of pink dust', x: 74, y: 24, bg: 'plain', night: true, entry: G => !G.flags.Cmet ? 'c_meet' : G.flags.Cdone ? 'slette_after' : 'c_hub' },
    damme:  { name: 'Dammene', en: 'the three ponds', x: 44, y: 80, bg: 'ponds', entry: G => 'damme_hub' },
    marked: { name: 'Markedet', en: 'here only once', x: 84, y: 48, bg: 'market', eph: true, req: G => G.day >= 2 && !G.flags.marketGone, entry: G => 'm_market' },
  },

  ending: G => [G.flags.Bbound ? 'Bundet' : G.flags.Bsold ? 'Solgt' : G.flags.Bfree ? 'Fri' : null, G.flags.Clook ? 'Blikket' : G.flags.Cborrow ? 'Lånt fortid' : G.flags.Cgone ? 'Huset løb' : null].filter(Boolean).join(' · ') || '—',
  next: '<b>Lektion 2 · Hvor længe skal du være her?</b> Time in a place where clocks are pets: for … siden, om …, i …, da / når.',
  carryFlags: ['Bbound', 'Bfree', 'Bsold', 'Cgone', 'Cborrow', 'Clook'],

  quests: {
    A: { title: 'Faldet', en: 'The fall', obj: [['Give Tælleren a reason', 'Areason'], ['Settle the hall and the plain, then register at Trappen', 'Adone']] },
    S6: { title: 'Spor', en: 'Traces', side: true, obj: [['Find three traces of what you were (Tælleren will want to know)', 'Aclues']] },
    B: { title: 'Ikket', en: 'The loose ikke', obj: [['Mend Tælleren’s sentence', 'Btaeller'], ['Mend Samleren’s sentence, at Bunden', 'Bsamler'], ['Find what eats the word ikke', 'Bhall'], ['Decide what to do with it', 'Bdone']] },
    C: { title: 'Den Bagvendte', en: 'The one turned away', obj: [['Find out what it was before (two voices that agree)', 'Cknown'], ['Tell it', 'Ctold'], ['Let it decide', 'Cdone']] },
    S1: { title: 'Nedfaldet', en: 'What fell', side: true, obj: [['Help Samleren find what fell', 'huntDone']] },
    S2: { title: 'Tællerens liste', en: "The Counter's list", side: true, obj: [['Match creatures to their work', 'jobsDone']] },
    S3: { title: 'Datidens damme', en: 'The ponds of the past', side: true, obj: [['Sort the verbs into the ponds', 'damDone']] },
    S4: { title: 'Spejlet', en: 'The mirror', side: true, obj: [['Let the mirror correct you', 'corrDone']] },
    S5: { title: 'Tællerens arkiv', en: "The Counter's archive", side: true, obj: [['File where things were: i or på', 'arkivDone']] },
  },

  /* traces (spor) of what you were: never precise */
  glimpses: {
    fald: { name: 'Faldt op', en: 'Fell upwards', text: 'Samleren filed you under "Ting, der faldt op". Things that fell upwards. The only other thing in that file is a sneeze.' },
    haender: { name: 'Hænder', en: 'Hands', text: 'For one blink your reflection had hands. Long, warm, used to holding something. Then they waved and were gone.' },
    navn: { name: 'Et ord', en: 'A word', text: 'Ikket hiccupped a word. Short. It fitted your mouth like a key fits a lock it was not cut for.' },
    koekken: { name: 'Køkken', en: 'Kitchen', text: 'The small ones say you smell of kitchen. Of THEIR kitchen. You have never been in a house. Probably.' },
    ekko: { name: 'Ekkoet', en: 'The echo', text: 'An echo said "Før jeg kom hertil …" in almost your voice. From before you could have said it.' },
  },

  letters: {
    ledger: { title: 'TÆLLERENS BOG · side 1', lines: ['DEN BAGVENDTE.', 'Kom hertil. Meget gammel.', 'Grund: på grund af en storm.', 'Før: et hus. Mange boede i det.', 'Vender sig ikke om.'],
      qs: [{ q: 'What was it, before it came here?', opts: ['A house', 'A storm', 'A tower'], a: 0, flag: 'c_ledger' },
           { q: 'Why did it come here?', opts: ['Because of a storm', 'To find the ones who lived in it', 'Because it could not turn around'], a: 0 }] },
  },

  hunts: {
    bund: { title: 'Samlerens liste', en: 'Find what fell', bg: 'bottom',
      find: ['fjer', 'knogle', 'tand', 'oeje', 'skal', 'noegle'], decoys: ['traad', 'sten', 'klokke', 'spejlet', 'lygte', 'aeg', 'ring', 'hjerte', 'haand', 'timeglas'] },
  },
  jobs: { title: 'Tællerens liste', keys: ['kok', 'laerer', 'laege', 'arkitekt', 'ingenioer', 'journalist', 'musiker', 'forsker', 'designer', 'gartner', 'farmaceut', 'oekonom'], prefix: 'Den ', pay: 2,
    end: n => `Tælleren pays ${n * 2} scales. It thinks a bank is a kind of soup, but it files beautifully.` },

  boxes: {
    dam: { title: 'Datidens damme', q: 'Hvilken dam?', boxes: ['-ede (blød d)', '-te (hård t)', 'uregelmæssig'],
      good: 'Soft pond: -ede, a sigh. Hard pond: -te, a click. The odd pond gulps the rest.', meh: 'Some verbs landed in the wrong pond and are swimming in circles. They will come back. Verbs always do.',
      items: [
        { t: 'lave', a: 0, say: 'lavede', why: 'lave → lavede. The soft d.' }, { t: 'arbejde', a: 0, say: 'arbejdede', why: 'arbejde → arbejdede.' }, { t: 'bo', a: 0, say: 'boede', why: 'bo → boede.' },
        { t: 'flytte', a: 0, say: 'flyttede', why: 'flytte → flyttede.' }, { t: 'studere', a: 0, say: 'studerede', why: 'studere → studerede.' },
        { t: 'læse', a: 1, say: 'læste', why: 'læse → læste. The hard t.' }, { t: 'købe', a: 1, say: 'købte', why: 'købe → købte.' }, { t: 'spise', a: 1, say: 'spiste', why: 'spise → spiste.' },
        { t: 'søge', a: 1, say: 'søgte', why: 'søge → søgte.' }, { t: 'undervise', a: 1, say: 'underviste', why: 'undervise → underviste.' },
        { t: 'gå', a: 2, say: 'gik', why: 'gå → gik.' }, { t: 'have', a: 2, say: 'havde', why: 'have → havde.' }, { t: 'komme', a: 2, say: 'kom', why: 'komme → kom.' }, { t: 'få', a: 2, say: 'fik', why: 'få → fik.' }, { t: 'være', a: 2, say: 'var', why: 'være → var.' },
      ] },
    arkiv: { title: 'Tællerens arkiv', q: 'i eller på?', boxes: ['i', 'på'],
      good: 'Every card in its drawer. Tælleren honks once, satisfied.', meh: 'A few cards are in the wrong drawer. Tælleren will notice in a hundred years and honk about it.',
      items: [
        { t: 'Den arbejdede ___ et firma.', a: 0, why: 'i et firma, i en bank: inside a company.' }, { t: 'Hun arbejdede ___ en bank.', a: 0, why: 'i en bank.' },
        { t: 'Han arbejdede ___ et hospital.', a: 1, why: 'på et hospital, på en skole: workplaces you go to.' }, { t: 'Den underviste ___ en skole.', a: 1, why: 'på en skole.' },
        { t: 'Hun skrev artikler ___ en avis.', a: 1, why: 'på en avis.' }, { t: 'De arbejdede ___ et apotek.', a: 1, why: 'på et apotek.' },
        { t: 'Vi studerede ___ universitetet.', a: 1, why: 'på universitetet.' }, { t: 'Den boede ___ en storby.', a: 0, why: 'i en by, i et land.' },
        { t: 'Han boede ___ en ø.', a: 1, why: 'on an island: på en ø.' }, { t: 'De boede ___ landet.', a: 1, why: 'på landet: in the countryside.' },
      ] },
  },

  corr: { npc: 'spejl', title: 'Spejlet',
    intro: 'The standing pond wobbles and shows sentences. Yours, maybe. Each one wrong in a way you recognise.',
    good: 'Spejlet flashes pink. Your reflection winks, then remembers it should not.',
    meh: 'Spejlet blows a raspberry. It will show you these again. Mirrors love reruns.',
    items: [
      { bad: 'Før jeg kom hertil, jeg boede på en ø.', good: 'Før jeg kom hertil, boede jeg på en ø.', wrong: ['Før kom jeg hertil, jeg boede på en ø.', 'Før jeg kom hertil, jeg har boet på en ø.'], why: 'A før-clause first → the verb jumps ahead of the subject: boede jeg.' },
      { bad: 'Jeg kom hertil, fordi jeg ville gerne sove.', good: 'Jeg kom hertil, fordi jeg gerne ville sove.', wrong: ['Jeg kom hertil, fordi ville jeg gerne sove.', 'Jeg kom hertil, fordi jeg ville sove gerne.'], why: 'Inside a fordi-clause: subject – adverb – verb. jeg gerne ville.' },
      { bad: 'Den kom hertil fordi en storm.', good: 'Den kom hertil på grund af en storm.', wrong: ['Den kom hertil for at en storm.', 'Den kom hertil, fordi af en storm.'], why: 'A noun after the reason → på grund af: på grund af en storm.' },
      { bad: 'Hun kom hertil på grund af finde sin ven.', good: 'Hun kom hertil for at finde sin ven.', wrong: ['Hun kom hertil fordi finde sin ven.', 'Hun kom hertil for finde sin ven.'], why: 'A verb after the reason → for at + infinitive: for at finde.' },
      { bad: 'Jeg spisede meget støv.', good: 'Jeg spiste meget støv.', wrong: ['Jeg spist meget støv.', 'Jeg spiserede meget støv.'], why: 'spise belongs to the -te pond: spiste.' },
      { bad: 'Han arbejdede i et hospital.', good: 'Han arbejdede på et hospital.', wrong: ['Han arbejdede til et hospital.', 'Han arbejdede om et hospital.'], why: 'Workplaces like a hospital or a school take på.' },
      { bad: 'Jeg kom hertil på grund af et drøm.', good: 'Jeg kom hertil på grund af en drøm.', wrong: ['Jeg kom hertil på grund af drøm.', 'Jeg kom hertil på grund af en drømme.'], why: 'drøm is an en-word: en drøm. (But et lys.)' },
    ] },

  /* ---------- small encounters on the way ---------- */
  travel: [
    { id: 'unge', bg: 'road', npc: 'unge', steps: [{ n: 'A small thing with ears like umbrellas skips beside you. It talks to a spot just left of you.' }, { say: 'unge', da: 'Hej! Du er ny. Hvad lavede du, før du kom hertil?', en: 'Hi! You are new. What did you do before you came here?' }],
      opts: [{ kind: 'say', stat: 'SPROG', dc: 8, label: 'Answer it.', build: jobBuild, ok: [{ say: 'unge', da: 'Hvad er det? Det lyder spændende!', en: 'What is that? It sounds exciting!' }, { fx: { resp: 1 } }], fail: [{ say: 'unge', da: 'Hvad? Du taler mærkeligt.', en: 'What? You talk strangely.' }], next: 'map' },
             { kind: 'eng', label: '“Sorry, I don’t speak … this.”', ok: [{ say: 'unge', da: 'Det lyder som regn, der falder op.', en: 'That sounds like rain falling upwards.' }], next: 'map' }] },
    { id: 'moel', bg: 'road', npc: 'moel', steps: [{ n: 'A moth the size of a coat flutters by, selling sparks from under its wings.' }, { say: 'moel', da: 'Gnister. Seks skæl.', en: 'Sparks. Six scales.' }, { th: 'A spark: a second try when the dice turn on you.' }],
      opts: [{ kind: 'act', special: 'buyInsp', label: 'Buy a spark (6 skæl).', next: 'map' }, { kind: 'go', label: 'Walk on.', next: 'map' }] },
    { id: 'ekko', bg: 'road', steps: [{ n: 'An echo is lying in the road like a dropped glove. As you pass, it speaks.' }, { glimpse: 'ekko' }], opts: [{ kind: 'go', label: 'Walk on, a little faster.', next: 'map' }] },
    { id: 'tal', bg: 'road', steps: [{ n: 'POP. The numbers on everything come loose and turn into squiggles.' }, { special: 'glyphs' }, { th: 'For a while numbers mean nothing. Listen for the words.' }], opts: [{ kind: 'go', label: 'Walk on.', next: 'map' }] },
    { id: 'smelt', bg: 'road', steps: [{ n: 'A puddle that used to be a die. Twenty faces, all running, all giggling.' }],
      opts: [{ kind: 'act', stat: 'INDSIGT', dc: 9, label: 'Read what is left of it.', ok: [{ n: 'The last face says 1. Under the puddle: two scales.' }, { fx: { sk: 2 } }], fail: [{ n: 'You touch it. For an hour your fingers count wrong.' }], next: 'map' },
             { kind: 'go', label: 'Step around it.', next: 'map' }] },
    { id: 'regn', bg: 'road', night: true, steps: [{ n: 'It is raining upwards. The drops are in a hurry. Somebody up there is having a party.' }],
      opts: [{ kind: 'act', stat: 'INDSIGT', dc: 11, label: 'Stand in it.', ok: [{ n: 'You get wet from below. Something stuck in you comes loose and goes up with the rain. You feel lucky.' }, { fx: { insp: 1 } }], fail: [{ n: 'You get wet in a direction you did not know you had.' }], next: 'map' },
             { kind: 'go', label: 'Walk on.', next: 'map' }] },
    { id: 'parade', bg: 'road', steps: [{ n: 'A parade of hats marches past. No heads. The hats are very proud.' }],
      opts: [{ kind: 'reply', da: 'Hej, hatte!', ok: [{ n: 'Every hat lifts itself an inch. Then they march on, humming.' }, { fx: { resp: 1 } }], next: 'map' },
             { kind: 'go', label: 'Wait for them to pass.', next: 'map' }] },
  ],

  /* ---------- lesson-only actions ---------- */
  special: {
    async nestLine() {
      const f = G.flags;
      const lines = f.Clook ? ['Your nest hums. Out on the plain, something is facing this way.'] : hasBoon('ikket') ? ['Something in your mouth hums “ikke, ikke, ikke” to a beat.'] : ['Your nest is warm and slightly ticklish.', 'Your marks itch. The ones you have not used are fading at the edges.'];
      logAdd(`<p>${esc(pick(lines))}</p>`, 'narr');
      if (f.Bdone && f.Cdone && !f.Adone) logAdd(`<p>Hall settled. Plain settled. Tælleren is waiting at the Stair with its pen.</p>`, 'thought');
    },
    async bundLine() {
      if (!G.flags.bundSeen) { G.flags.bundSeen = true; logAdd(`<p>Bunden: where things land. Four keys at once. A wet umbrella. A clock with no hands. Samleren files them all.</p>`, 'narr'); return; }
      logAdd(`<p>${esc(pick(['Something lands behind you with a BOING. Samleren files it without looking.', 'Samleren holds a bone up to the light, checking it for jokes.', 'A shower of teeth. Samleren claps all its hands.']))}</p>`, 'narr');
    },
    async trappeLine() {
      if (!G.flags.trapSeen) { G.flags.trapSeen = true; logAdd(`<p>Tælleren honks numbers at the sky. Every time you come, you are a different number. Today you are 7½.</p>`, 'narr'); return; }
      const f = G.flags;
      if (f.Bdone && f.Cdone && !f.Adone) sayEntry({ say: 'taeller', da: 'Nu. Nu kan jeg skrive dig ind.', en: 'Now. Now I can write you in.' });
      else sayEntry({ say: 'taeller', da: pick(['Fire hundrede og to. Fire hundrede og tre.', 'En fjer. En tand. Dig.', 'Kom tilbage, når du ved mere.']), en: pick(['Four hundred and two. Four hundred and three.', 'A feather. A tooth. You.', 'Come back when you know more.']) });
      await tapOn();
    },
    async halLine() {
      if (!G.flags.halSeen) {
        G.flags.halSeen = true;
        logAdd(`<p>Thousands of threads, one per reason anyone ever gave. The floor is woven from them and bounces. At the loom, Grundvæversken poses for a portrait nobody is painting.</p>`, 'narr');
        return;
      }
      logAdd(`<p>${esc(pick(['The shuttle zips back and forth: zip, zip, zip.', 'A new thread drops from the ceiling. Somebody, somewhere, just gave a reason.']))}</p>`, 'narr');
    },
    async sletteLine() {
      const f = G.flags;
      if (f.Ctold) return;
      logAdd(`<p>${esc(G.phase >= 3 ? 'In the violet night the plain glows. Den Bagvendte still faces the towers. In its hem, tiny windows light up.' : pick(['Den Bagvendte has not turned. Pink dust is piling up on its shoulders like snow on a roof.', 'The branches on its head creak. It might be thinking. It has had a long time to practise.']))}</p>`, 'narr');
      if (f.Cknown) logAdd(`<p>You know what it was. Tell it.</p>`, 'thought');
      else logAdd(`<p>${esc(pick(['Tælleren writes down everything that arrives. It must have written this down too.', 'Somebody wove the floors of every house in Hertil. Somebody would remember this one.']))}</p>`, 'thought');
    },
    async dammeLine() {
      if (!G.flags.damSeen) {
        G.flags.damSeen = true;
        logAdd(`<p>Three ponds. The first is soft and sighs. The second is hard and clicks. The third does whatever it wants.</p>`, 'narr'); await tapOn();
        logAdd(`<p>A fourth pond stands upright like a door made of water: Spejlet. It is busy admiring something behind you.</p>`, 'narr');
        return;
      }
      logAdd(`<p>${esc(pick(['A verb jumps out of the soft pond, sighs, and dives back in.', 'Spejlet shivers. It has caught a mistake somewhere and is delighted.']))}</p>`, 'narr');
    },
    async marketLine() {
      if (!G.flags.mSeen) {
        G.flags.mSeen = true;
        logAdd(`<p>A market where yesterday there was nothing, stalls hanging upside down. In the middle, Sluget: a mouth on a stalk, chewing a word. It buys words, sells reasons, and will be gone tomorrow.</p>`, 'narr');
      }
    },
    /* the market: prices are said aloud, in Danish */
    market() {
      return new Promise(resolve => {
        const goods = [['gnist', 'en gnist', 'a spark (inspiration)', 5, 'fem'], ['ekko', 'et ekko', 'an echo', 3, 'tre'], ['tand', 'en tand', 'a tooth', 2, 'to']];
        const ov = vocabSheet('');
        let i = 0;
        const round = () => {
          if (i >= goods.length) { ov.querySelector('.voc').innerHTML = `<div class="v-h"><small>Markedet</small><h2>Færdig</h2><p>${G.sk} scales left. Sluget has already forgotten you. Here that is good manners.</p></div><button class="btn gold big" id="vDone">Færdig</button>`; $('#vDone').onclick = () => { ov.remove(); resolve(); }; return; }
          const [k, da, en, price, word] = goods[i];
          const line = `${da.replace(/^(en|et) /, '').replace(/^./, c => c.toUpperCase())}? Det koster ${word} skæl.`;
          const opts = shuffle([price, ...shuffle([2, 3, 4, 5, 6, 7, 8, 12, 13].filter(n => n !== price)).slice(0, 2)]);
          if (!ov.isConnected) return;
          ov.querySelector('.voc').innerHTML = `<div class="v-h"><small>Sluget · ${G.sk} skæl</small><h2>${esc(da)}</h2><p><i>${esc(en)}</i></p><div class="v-say">“${daHTML(line)}” <button class="tb" id="sSay">♪</button></div><p>How many scales do you put down? Or walk past.</p></div>
            <div class="coins">${opts.map(n => `<button class="coin" data-n="${n}" ${G.sk < n ? 'disabled' : ''}>${n}</button>`).join('')}</div><button class="btn ghost" id="skip">Ikke i dag</button>`;
          wireWords(ov); TTS.say(line);
          $('#sSay').onclick = () => TTS.say(line, true);
          $('#skip').onclick = () => { ov.querySelectorAll('.coin, #skip').forEach(x => x.disabled = true); i++; round(); };
          ov.querySelectorAll('.coin').forEach(b => b.onclick = async () => {
            if (+b.dataset.n === price) {
              ov.querySelectorAll('.coin, #skip').forEach(x => x.disabled = true);
              G.sk -= price; AUDIO.sting('coin'); statGain('HANDEL', 1); b.classList.add('ok');
              if (k === 'gnist') fx({ insp: 1 }); if (k === 'ekko') { fx({ resp: 1 }); toast('The echo shouts a name across the market. Not yours. Nobody turns. Close, though.', 'gold'); } if (k === 'tand') toast('A tooth. It bites you once, to seal the deal.', 'gold');
              hud(); await sleep(700); i++; round();
            } else { b.classList.add('no'); b.disabled = true; AUDIO.sting('lose'); const fix = `${word[0].toUpperCase() + word.slice(1)}. Ikke ${NUMS[+b.dataset.n]}.`; toast(fix, 'bad'); TTS.say(fix); }
          });
        };
        round();
      });
    },
    async loseIkket() { G.boons = G.boons.filter(b => b !== 'ikket'); toast('Ikket is sold. Your mouth echoes a bit.', 'bad'); hud(); },
    async regReact() {
      const j = G.origin.jobWord, has = k => G.glimpses.includes(k);
      const [da, en] = j === 'kok' && has('koekken') ? ['Kok. Og du lugter af køkken. Det passer.', 'Cook. And you smell of kitchen. That fits.']
        : (j === 'læge' || j === 'arkitekt') && has('haender') ? ['Hænder. Lange hænder. Det passer.', 'Hands. Long hands. That fits.']
        : j === 'musiker' && has('ekko') ? ['Et ekko kender din stemme. Det passer.', 'An echo knows your voice. That fits.']
        : G.glimpses.length >= 3 ? ['Du har fundet mange spor. Mange spor! Godt.', 'You have found many traces. Many traces! Good.']
        : ['Det passer ikke helt. Men jeg skriver det.', 'It does not quite fit. But I write it.'];
      sayEntry({ say: 'taeller', da, en }); await tapOn();
      if (G.glimpses.length >= 3) fx({ resp: 1 });
    },
    async ledgerHint() { if (!G.flags.c_ledger) { sayEntry({ say: 'taeller', da: 'Læs det igen, hvis du vil.', en: 'Read it again, if you like.' }); await tapOn(); } },
    async cCheck() {
      const n = ['c_ledger', 'c_folk', 'c_weaver'].filter(f => G.flags[f]).length;
      if (n >= 2 && !G.flags.Cknown) { G.flags.Cknown = true; toast('Two voices agree! You know what Den Bagvendte was.', 'gold'); AUDIO.sting('glimpse'); }
    },
    async turn() {
      G.flags.Clook = true;
      setNpc('bagvendt', 'turn');
      AUDIO.sting('gaze');
      await sleep(2600);
    },
    async glyphs() { G.glyph = 3; AUDIO.sting('glyph'); toast('ᚦᚨᛚ · the numbers have gone strange', 'gold'); },
  },

  /* ---------- the nodes ---------- */
  nodes: {
    /* ===== PROLOGUE: the fall ===== */
    p_fall: { bg: 'void', title: '', card: ['Kapitel 1 · Baggrund', 'Lektion 1 — Hvorfor kom du hertil?'],
      steps: [
        { n: 'You fall. A feather falls with you, then a tooth, then a trombone. Nobody says anything. It would be rude, mid-fall.' },
        { th: 'Where are you falling from? There is a tidy, empty space where that answer should be.' },
        { n: 'BOING. You land, and discover you have a bottom.' },
      ],
      opts: [{ kind: 'go', label: 'Get up.', next: 'p_bottom' }] },
    p_bottom: { bg: 'bottom', npc: 'samler', title: 'Bunden',
      steps: [
        { n: 'Pink dust, keys, shells. A shell creature with a hundred arms is sorting it all, thrilled, and does not look at you.' },
        { say: 'samler', da: 'En tand. En fjer. En … ting.', en: 'A tooth. A feather. A … thing.' },
        { n: 'The thing is you. And you are sinking. It tickles.' },
        { say: 'samler', da: 'Ting uden grund synker. Gå til Tælleren. Til Trappen.', en: 'Things without a reason sink. Go to the Counter. To the Stair.' },
      ],
      opts: [
        { kind: 'act', stat: 'INDSIGT', dc: 7, group: 'a', label: 'Read what it wrote about you.', ok: [{ glimpse: 'fald' }], fail: [{ n: 'An arm pulls the book away. Politely. Firmly.' }], next: 'p_stair' },
        { kind: 'reply', group: 'a', da: 'Tak.', ok: [{ n: 'It waves three arms without looking up.' }], next: 'p_stair' },
      ] },
    p_stair: { bg: 'stair', npc: 'taeller', title: 'Trappen', hub: true, card: ['Trappen', 'the stair that goes into itself'],
      steps: [
        { n: 'A stair goes up, up, and into itself. At its foot, a trumpet on stilts honks numbers at a spinning sun.' },
        { say: 'taeller', da: 'Ny. Navn?', en: 'New. Name?' },
        { th: 'You open your mouth. Nothing in there.' },
        { say: 'taeller', da: 'Intet navn. Det sker. Hvorfor kom du hertil?', en: 'No name. It happens. Why did you come here?' },
        { th: 'No idea. Invent one. Here, what is written down becomes true: a thing, a purpose, or a story.' },
      ],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 7, group: 'reason', label: 'A thing pulled you here (på grund af + a noun).', build: reasonPGA,
          ok: [{ n: 'The word lands in the book with a THUNK. Something heavy settles in your middle. No more sinking.' }, { fx: { boon: 'anker', flag: 'Areason', resp: 1 } }],
          fail: [{ say: 'taeller', da: 'Pennen gled. Men det holder.', en: 'The pen slipped. But it holds.' }, { n: 'Something heavy settles in your middle, a bit to the left. You stop sinking, at an angle.' }, { fx: { boon: 'anker', flag: 'Areason' } }], next: 'p_stair2' },
        { kind: 'say', stat: 'SPROG', dc: 7, group: 'reason', label: 'A purpose pushed you (for at + a verb).', build: reasonFA,
          ok: [{ n: 'A bright thread shoots out of your chest and tugs you somewhere new. No more sinking.' }, { fx: { boon: 'traad', flag: 'Areason', resp: 1 } }],
          fail: [{ say: 'taeller', da: 'Pennen gled. Men det holder.', en: 'The pen slipped. But it holds.' }, { n: 'A thread shoots out of your chest, tangled. It tugs left, then right, then makes up its mind.' }, { fx: { boon: 'traad', flag: 'Areason' } }], next: 'p_stair2' },
        { kind: 'say', stat: 'SPROG', dc: 8, group: 'reason', label: 'A story drove you (fordi + a whole clause).', build: reasonFORDI,
          ok: [{ n: 'The words jump off the page and run up your arm in neon letters. No more sinking.' }, { fx: { boon: 'moenster', flag: 'Areason', resp: 1 } }],
          fail: [{ say: 'taeller', da: 'Pennen gled. Men det holder.', en: 'The pen slipped. But it holds.' }, { n: 'The words run up your arm, one of them upside down.' }, { fx: { boon: 'moenster', flag: 'Areason' } }], next: 'p_stair2' },
        { kind: 'eng', once: true, label: '“I don’t know. I really don’t know.”', ok: [{ say: 'taeller', en: '“I don’t know” is not a reason. It is weather.' }, { n: 'You sink to the knees. Pick one of the others.' }] },
      ] },
    p_stair2: { bg: 'stair', npc: 'taeller', title: 'Trappen', quest: 'A',
      steps: [
        { say: 'taeller', da: 'Godt. Nu har du en grund. Nu synker du ikke.', en: 'Good. Now you have a reason. Now you do not sink.' },
        { say: 'taeller', da: 'Men en grund er ikke et navn. Kom tilbage, når du ved, hvad du lavede, før du kom hertil.', en: 'But a reason is not a name. Come back when you know what you did before you came here.' },
        { fx: { quest: 'S6' } }, { say: 'taeller', da: 'Spørg Den Bagvendte på sletten. Den ved heller ikke, hvad den var.', en: 'Ask the one turned away, on the plain. It does not know what it was either.' }, { th: 'Tælleren writes everything down. It never reads back.' },
        { say: 'taeller', da: 'Jeg tæller, fordi jeg vil miste nogen.', en: 'I count because I want to lose someone.' },
        { th: 'That sentence has a hole in it. A small word is missing.' },
      ],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 9, label: 'Give the sentence back its missing word.', build: { en: 'I count because I don’t want to lose anyone.', answers: [['Jeg', 'tæller,', 'fordi', 'jeg', 'ikke', 'vil', 'miste', 'nogen.']], tiles: ['Jeg', 'tæller,', 'fordi', 'jeg', 'ikke', 'vil', 'miste', 'nogen.', 'gerne'] },
          ok: [{ n: 'Click. The sentence snaps shut. Tælleren blasts three notes at the sun.' }, { say: 'taeller', da: '… fordi jeg ikke vil miste nogen. Ja. Sådan.', en: '… because I don’t want to lose anyone. Yes. Like that.' }, { fx: { flag: 'Btaeller', resp: 1 } }],
          fail: [{ n: 'Right words, bad timing: it was mid-honk. It repeats them as its own idea.' }, { say: 'taeller', da: '… fordi jeg ikke vil miste nogen.', en: '… because I don’t want to lose anyone.' }, { fx: { flag: 'Btaeller' } }],
          post: [{ say: 'taeller', da: 'Noget spiser ordet ikke. Overalt. Find det.', en: 'Something is eating the word ikke. Everywhere. Find it.' }, { fx: { quest: 'B' } }], next: 'p_nest' },
      ] },
    p_nest: { bg: 'nest', title: 'Reden', card: ['Reden', 'a nest that fits you'],
      steps: [
        { n: 'Your reason drags you to a nest in a wall of yellow. It fits you exactly. Suspicious.' },
        { n: 'Your skin itches. The Danish you heard today has stuck to you as little stamped marks.' },
        { th: 'Sleep, and they settle. Ignore them, and they fade.' },
      ],
      opts: [{ kind: 'go', label: 'Go out into Hertil.', next: 'map' }] },

    /* ===== REDEN (home) ===== */
    rede_hub: { bg: 'nest', title: 'Reden', hub: true, idle: true, home: true,
      steps: [{ special: 'nestLine' }],
      opts: [
        { kind: 'go', special: 'selfPlate', label: 'Look at yourself.' },
        { kind: 'go', label: 'Sleep. Let the marks settle.', next: 'sleep' },
        { kind: 'go', label: 'Go out.', next: 'map' },
      ] },

    /* ===== BUNDEN ===== */
    bund_hub: { bg: 'bottom', npc: 'samler', title: 'Bunden', hub: true, quest: 'S1',
      steps: [{ special: 'bundLine' }],
      opts: [
        { kind: 'act', special: 'hunt:bund', label: 'Help Samleren find what fell.', req: G => !G.flags.huntDone, next: 'bund_hunted' },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    bund_hunted: { bg: 'bottom', npc: 'samler', title: 'Bunden',
      steps: [{ say: 'samler', da: 'Godt. Alt er sorteret. Her er fire skæl.', en: 'Good. Everything is sorted. Here are four scales.' }, { fx: { sk: 4, flag: 'huntDone', resp: 1 } }, { n: 'It plucks four scales off its own spiral and flicks them at you.' }],
      opts: [{ kind: 'go', label: 'Back.', next: 'bund_hub' }] },
    b_samler: { bg: 'bottom', npc: 'samler', title: 'Bunden',
      steps: [
        { n: 'Chaos. The piles have collapsed. Samleren holds a tooth as if it has never seen one.' },
        { say: 'samler', da: 'Hvad er det? Jeg har glemt det. Jeg har glemt alt.', en: 'What is it? I have forgotten it. I have forgotten everything.' },
        { say: 'samler', da: 'Jeg samler ting, fordi jeg kan glemme dem.', en: 'I collect things because I can forget them.' },
        { th: 'Same hole. Same missing word. And in the dust: tiny round footprints made of nothing.' },
      ],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 10, label: 'Put the ikke back where it belongs.', build: { en: 'I collect things because I cannot forget them.', answers: [['Jeg', 'samler', 'ting,', 'fordi', 'jeg', 'ikke', 'kan', 'glemme', 'dem.']], tiles: ['Jeg', 'samler', 'ting,', 'fordi', 'jeg', 'ikke', 'kan', 'glemme', 'dem.', 'gerne', 'det'] },
          ok: [{ n: 'Every arm moves at once. The piles leap back into piles.' }, { say: 'samler', da: 'En tand! Selvfølgelig. Tak.', en: 'A tooth! Of course. Thank you.' }, { fx: { flag: 'Bsamler', resp: 1, sk: 2 } }],
          fail: [{ n: 'Right words, but a trombone lands mid-sentence. Samleren remembers half of everything. Half will do.' }, { fx: { flag: 'Bsamler' } }],
          post: [{ th: 'The footprints of nothing run west, toward the weaving hall. Where all the reasons are.' }], next: 'map' },
      ] },

    /* ===== TRAPPEN ===== */
    trappe_hub: { bg: 'stair', npc: 'taeller', title: 'Trappen', hub: true, quest: ['S2', 'S5'],
      steps: [{ special: 'trappeLine' }],
      opts: [
        { kind: 'go', label: 'Register. Tell it what you were.', req: G => G.flags.Bdone && G.flags.Cdone && !G.flags.Adone, next: 'f_register', mark: true },
        { kind: 'act', special: 'jobs', label: 'Help Tælleren match creatures to their work.', req: G => !G.flags.jobsDone },
        { kind: 'act', special: 'boxes:arkiv', label: 'Help with the archive: i or på?', req: G => !G.flags.arkivDone },
        { kind: 'go', label: 'Ask to see the entry about Den Bagvendte.', req: G => G.flags.Cmet && !G.flags.c_ledger && !G.flags.Cknown, next: 'c_ledger' },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    c_ledger: { bg: 'stair', npc: 'taeller', title: 'Trappen',
      steps: [{ say: 'taeller', da: 'Den Bagvendte. Side et.', en: 'The one turned away. Page one.' }, { n: 'It kicks the book open toward you, still honking at the sun.' }, { letter: 'ledger' }, { special: 'cCheck' }, { special: 'ledgerHint' }],
      opts: [{ kind: 'go', label: 'Back.', next: 'trappe_hub' }] },

    /* ===== B · IKKET ===== */
    hal_hub: { bg: 'hall', npc: 'vaever', title: 'Vævehallen', hub: true,
      steps: [{ special: 'halLine' }],
      opts: [
        { kind: 'reply', once: true, da: 'Hvad laver du?', ok: [{ say: 'vaever', da: 'Jeg væver gulvet. Af grunde. Hver grund er en tråd.', en: 'I weave the floor. Out of reasons. Every reason is a thread.' }, { n: 'She keeps her mask on the lamp. But one stripe of her robe changes colour, just for you.' }, { fx: { resp: 1 } }] },
        { kind: 'act', stat: 'INDSIGT', dc: 10, once: true, label: 'Look at the floor.', req: G => G.flags.Btaeller && !G.flags.Bhall, ok: [{ n: 'Holes in the weave. Small, round, each exactly the size of a short word.' }], fail: [{ n: 'A floor. It bounces. You bounce with it, a bit embarrassed.' }] },
        { kind: 'go', label: 'Ask about Den Bagvendte.', req: G => G.flags.Cmet && !G.flags.c_weaver && !G.flags.Cknown, next: 'c_weaver' },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    b_hall: { bg: 'hall_torn', npc: 'vaever', title: 'Vævehallen', card: ['Vævehallen', 'the weave is coming apart'],
      steps: [
        { special: 'halLine' },
        { n: 'Holes everywhere. Loose threads whip around like streamers. The weaver keeps reweaving one sentence.' },
        { say: 'vaever', da: 'Jeg bliver her, fordi jeg kan gå. Jeg bliver her, fordi jeg kan gå.', en: 'I stay here because I can leave. I stay here because I can leave.' },
        { th: 'And in the middle of the loom, round and black as a pupil: the thing that eats the word.' },
        { npc: 'ikket' },
        { say: 'ikket', da: 'Ikke. Ikke ikke. Ikke!', en: 'Not. Not not. Not!' },
      ],
      opts: [
        { kind: 'act', stat: 'SNIGE', dc: 11, group: 'catch', label: 'Creep up and catch it.', ok: [{ n: 'Got it! It is cold, it is nothing, and it wriggles like a fish.' }], fail: [{ n: 'You grab a hole shaped like your hands. Then it gets bored and jumps into them anyway.' }], next: 'b_choice' },
        { kind: 'say', stat: 'SPROG', dc: 11, group: 'catch', label: 'Name it for what it is.', build: { en: 'You are the word ikke.', answers: [['Du', 'er', 'ordet', 'ikke.']], tiles: ['Du', 'er', 'ordet', 'ikke.', 'et', 'ord'] },
          ok: [{ n: 'It freezes. Words do, when they are named. Then it hops into your hand.' }], fail: [{ n: 'It giggles at its own name, and while it giggles you catch it.' }], next: 'b_choice' },
      ] },
    b_choice: { bg: 'hall_torn', npc: 'vaever', title: 'Vævehallen',
      steps: [
        { say: 'ikket', da: 'Ikke …', en: 'Not …' },
        { glimpse: 'navn' },
        { th: 'It purrs in your palm. The weaver’s sentence hangs in the air: Jeg bliver her, fordi jeg … kan gå.' },
        { th: 'Weave it back in? Or notice that without it, her sentence says she can leave.' },
      ],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 11, group: 'end', label: 'Weave the ikke back into her sentence.', build: { en: 'Her sentence, mended: I stay here because I cannot leave.', answers: [['Jeg', 'bliver', 'her,', 'fordi', 'jeg', 'ikke', 'kan', 'gå.']], tiles: ['Jeg', 'bliver', 'her,', 'fordi', 'jeg', 'ikke', 'kan', 'gå.', 'gerne', 'du'] },
          ok: [{ n: 'The word slides in like a key into its own lock.' }], fail: [{ n: 'Her hands shake as she weaves it in. It holds, a bit loose.' }], next: 'b_bound' },
        { kind: 'go', group: 'end', label: 'Keep it. Close your hand.', next: 'b_free' },
      ] },
    b_bound: { bg: 'hall', npc: 'vaever', title: 'Vævehallen',
      steps: [
        { n: 'The threads snap tight. The holes close like eyes. The floor bounces again.' },
        { say: 'vaever', da: 'Ja. Fordi jeg ikke kan gå. Tak.', en: 'Yes. Because I cannot leave. Thank you.' },
        { n: 'She ties a bright thread round your wrist. It is warm. It will not come off.' },
        { fx: { boon: 'vaev', flag: 'Bhall', resp: 2 } }, { fx: { flag: 'Bbound' } }, { fx: { flag: 'Bdone' } },
      ],
      opts: [{ kind: 'go', label: 'Leave the hall.', next: 'map' }] },
    b_free: { bg: 'hall_torn', npc: 'vaever', title: 'Vævehallen',
      steps: [
        { n: 'You close your hand. Ikket hops behind your teeth. The weaver reads her own sentence again.' },
        { say: 'vaever', da: 'Jeg kan gå.', en: 'I can leave.' },
        { npc: null },
        { n: 'She stands up for the first time in three hundred years and dances out. The hall unravels into confetti behind her.' },
        { th: 'Ikket buzzes in your mouth like a wasp in a jar.' },
        { fx: { boon: 'ikket', flag: 'Bhall' } }, { fx: { flag: 'Bfree' } }, { fx: { flag: 'Bdone' } }, { fx: { flag: 'hallGone' } },
      ],
      opts: [{ kind: 'go', label: 'Walk away through the confetti.', next: 'map' }] },

    /* ===== C · DEN BAGVENDTE ===== */
    c_meet: { bg: 'plain', npc: 'bagvendt', title: 'Støvsletten', card: ['Støvsletten', 'the plain of pink dust'],
      steps: [
        { n: 'Something huge stands on the pink plain: branches for hair, back to everything. It faces the far towers. Always has.' },
        { say: 'bagvendt', da: 'Der er nogen bag mig.', en: 'There is someone behind me.' },
        { say: 'bagvendt', da: 'Jeg vender mig ikke om. Jeg ved ikke, hvad jeg var, før jeg kom hertil. Man kan ikke vende sig om uden en fortid.', en: 'I do not turn around. I do not know what I was before I came here. One cannot turn around without a past.' },
        { fx: { flag: 'Cmet', quest: 'C' } },
      ],
      opts: [
        { kind: 'reply', group: 'm', da: 'Det ved jeg heller ikke. Om mig selv.', ok: [{ say: 'bagvendt', da: 'Så er vi to.', en: 'Then there are two of us.' }, { fx: { resp: 1 } }], next: 'c_hub' },
        { kind: 'act', stat: 'INDSIGT', dc: 9, group: 'm', label: 'Look at its feet.', ok: [{ n: 'Around its feet, tiny creatures bustle in and out of little rooms in its hem.' }], fail: [{ n: 'Dust. Some of the dust waves at you.' }], next: 'c_hub' },
      ] },
    c_hub: { bg: 'plain', npc: 'bagvendt', title: 'Støvsletten', hub: true,
      steps: [{ special: 'sletteLine' }],
      opts: [
        { kind: 'go', label: 'Tell it what it was.', req: G => G.flags.Cknown && !G.flags.Ctold, next: 'c_tell' },
        { kind: 'go', label: 'Kneel and talk to the small ones at its feet.', req: G => !G.flags.c_folk && !G.flags.Cknown, next: 'c_folk' },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    c_folk: { bg: 'plain', npc: 'husfolk', title: 'Støvsletten',
      steps: [{ n: 'Thumb-sized, chalk-coloured, with little doors in their bellies. They look at each other, never at you, and gossip.' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 9, label: 'Ask them what they did before they came here.', build: { en: 'What did you (all) do before you came here?', answers: [['Hvad', 'lavede', 'I,', 'før', 'I', 'kom', 'hertil?']], tiles: ['Hvad', 'lavede', 'I,', 'før', 'I', 'kom', 'hertil?', 'laver', 'du'] },
          ok: [{ say: 'husfolk', da: 'Vi boede i den. Den var vores hus. Vi spiste i køkkenet, og vi sov på loftet.', en: 'We lived in it. It was our house. We ate in the kitchen, and we slept in the attic.' }, { say: 'husfolk', da: 'Du lugter af køkken.', en: 'You smell of kitchen.' }, { glimpse: 'koekken' }, { fx: { flag: 'c_folk', resp: 1 } }, { special: 'cCheck' }],
          fail: [{ say: 'husfolk', da: 'Hvad? Vi boede i den. Den var vores hus. Det er alt.', en: 'What? We lived in it. It was our house. That is all.' }, { n: 'One sniffs you, mutters “køkken”, and slams the door in its belly.' }, { glimpse: 'koekken' }, { fx: { flag: 'c_folk' } }, { special: 'cCheck' }], next: 'c_hub' },
        { kind: 'eng', label: '“Excuse me. Hello?”', ok: [{ n: 'Click, click, click: every belly door shuts.' }], next: 'c_hub' },
      ] },
    c_weaver: { bg: 'hall', npc: 'vaever', title: 'Vævehallen',
      steps: [{ say: 'vaever', da: 'Den Bagvendte? Jeg vævede gulvet i den. Det var et hus. Et godt hus.', en: 'The one turned away? I wove the floor in it. It was a house. A good house.' }, { fx: { flag: 'c_weaver' } }, { special: 'cCheck' }],
      opts: [{ kind: 'go', label: 'Back.', next: 'hal_hub' }] },
    c_tell: { bg: 'plain', npc: 'bagvendt', title: 'Støvsletten',
      steps: [{ th: 'Two voices agree. In Hertil, that is almost a fact.' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 11, label: 'Tell it what it was.', build: { en: 'Before you came here, you were a house.', answers: [['Du', 'var', 'et', 'hus,', 'før', 'du', 'kom', 'hertil.']], best: [['Før', 'du', 'kom', 'hertil,', 'var', 'du', 'et', 'hus.']], tiles: ['Før', 'du', 'kom', 'hertil,', 'var', 'du', 'et', 'hus.', 'en'] },
          ok: [{ say: 'bagvendt', da: 'Et hus.', en: 'A house.' }, { n: 'Every window in its body flicks on at once.' }, { fx: { flag: 'Ctold', resp: 1 } }],
          fail: [{ n: 'It hears you slowly, like a house hears footsteps upstairs.' }, { say: 'bagvendt', da: '… et hus?', en: '… a house?' }, { fx: { flag: 'Ctold' } }], next: 'c_choice' },
      ] },
    c_choice: { bg: 'plain', npc: 'bagvendt', title: 'Støvsletten',
      steps: [
        { say: 'bagvendt', da: 'Jeg var et hus. Der boede nogen i mig. Nu ved jeg det.', en: 'I was a house. Someone lived in me. Now I know.' },
        { say: 'bagvendt', da: 'Hvad skal jeg gøre med det?', en: 'What shall I do with it?' },
        { th: G => G.resp >= 5 ? 'Ask, and it might turn around. For you.' : 'It only turns for someone it has noticed. Get noticed first.' },
      ],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 13, die: 'melt', label: 'Ask it to turn around.', req: G => G.resp >= 5, build: { en: 'Will you turn around?', answers: [['Vil', 'du', 'vende', 'dig', 'om?']], tiles: ['Vil', 'du', 'vende', 'dig', 'om?', 'mig', 'ikke'] },
          ok: [], fail: [{ say: 'bagvendt', da: 'Ikke endnu.', en: 'Not yet.' }, { th: 'But all its branches leaned toward you. Then back.' }], next: 'c_look', failNext: 'c_choice' },
        { kind: 'say', stat: 'SPROG', dc: 11, once: true, label: 'Ask to borrow its past.', build: { en: 'May I borrow your past?', answers: [['Må', 'jeg', 'låne', 'din', 'fortid?']], tiles: ['Må', 'jeg', 'låne', 'din', 'fortid?', 'dit', 'mig'] },
          ok: [], fail: [{ say: 'bagvendt', da: 'Nej. Den er min. Jeg har lige fået den.', en: 'No. It is mine. I have only just got it.' }], next: 'c_borrow', failNext: 'c_choice' },
        { kind: 'go', group: 'end', label: '“Go back to being it.”', next: 'c_gone' },
      ] },
    c_gone: { bg: 'plain', npc: 'bagvendt', title: 'Støvsletten',
      steps: [
        { n: 'It folds. Branches into beams, folds into walls. Suddenly there is a crooked little house on the plain, windows blazing.' },
        { npc: null },
        { n: 'The house sprints off backwards toward wherever it used to stand. The small ones chase it, belly doors flapping.' },
        { th: 'It never turned around. It did not need to.' },
        { fx: { boon: 'doer', flag: 'Cgone', resp: 1 } }, { fx: { flag: 'Cdone' } },
      ],
      opts: [{ kind: 'go', label: 'Wave goodbye.', next: 'map' }] },
    c_borrow: { bg: 'plain', npc: 'bagvendt', title: 'Støvsletten',
      steps: [
        { n: 'WHOOSH. Its past pours into you: rooms, stairs, a kitchen, a lot of snoring.' },
        { say: 'bagvendt', da: 'Tag den. Jeg vender mig alligevel ikke om.', en: 'Take it. I am not turning around anyway.' },
        { th: 'Not your past. It fits anyway, like a coat three sizes too big.' },
        { fx: { boon: 'laant', flag: 'Cborrow' } }, { fx: { flag: 'Cdone' } },
      ],
      opts: [{ kind: 'go', label: 'Walk off with a house inside you.', next: 'map' }] },
    c_look: { bg: 'plain', npc: 'bagvendt', title: 'Støvsletten',
      steps: [
        { special: 'turn' },
        { n: 'It turns. Dust flies off in pink sheets, branches scrape the sky, the ground rumbles like a drum.' },
        { n: 'And then it is looking at you. Nothing in Hertil has looked at you before.' },
        { say: 'bagvendt', da: 'Der er du.', en: 'There you are.' },
        { th: 'A look weighs more than a reason. Somewhere inside it, a door your size opens.' },
        { fx: { boon: 'blik', flag: 'Clook', resp: 3 } }, { fx: { flag: 'Cdone' } },
      ],
      opts: [{ kind: 'go', label: 'Stay a while. Then go.', next: 'map' }] },
    slette_after: { bg: 'plain', npc: G => G.flags.Cgone ? null : 'bagvendt', title: 'Støvsletten', hub: true, idle: true,
      steps: [{ n: G => G.flags.Cgone ? 'Empty plain. A pale rectangle in the dust: the shape a house leaves.' : G.flags.Clook ? 'It is still facing this way. Its branches lean toward you like plants toward a window.' : 'It faces the towers, as always. But it hums now. It has a past.' }],
      opts: [{ kind: 'go', label: 'Leave.', next: 'map' }] },

    /* ===== DAMMENE ===== */
    damme_hub: { bg: 'ponds', npc: 'spejl', title: 'Dammene', hub: true, quest: ['S3', 'S4'],
      steps: [{ special: 'dammeLine' }],
      opts: [
        { kind: 'act', special: 'boxes:dam', label: 'Sort the verbs into the ponds.', req: G => !G.flags.damDone },
        { kind: 'act', special: 'corr', label: 'Let Spejlet correct you.', req: G => !G.flags.corrDone },
        { kind: 'act', stat: 'INDSIGT', dc: 10, label: 'Look at your reflection in the soft pond.', req: G => !G.glimpses.includes('haender'), ok: [{ glimpse: 'haender' }], fail: [{ n: 'Your reflection is busy. It waves you off.' }] },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },

    /* ===== MARKEDET (here only once) ===== */
    m_market: { bg: 'market', npc: 'sluget', title: 'Markedet', hub: true, card: ['Markedet', 'it was not here yesterday'],
      steps: [{ special: 'marketLine' }],
      opts: [
        { kind: 'act', special: 'market', once: true, label: 'Look at what Sluget sells. Listen to the prices.' },
        { kind: 'go', label: 'Sell it Ikket.', req: G => hasBoon('ikket') && !G.flags.Bsold, next: 'm_sell' },
        { kind: 'say', stat: 'SPROG', dc: 10, once: true, label: 'Tell Sluget why you came here.', build: { en: 'I came here because I would like to find my name.', answers: [['Jeg', 'kom', 'hertil,', 'fordi', 'jeg', 'gerne', 'ville', 'finde', 'mit', 'navn.']], tiles: ['Jeg', 'kom', 'hertil,', 'fordi', 'jeg', 'gerne', 'ville', 'finde', 'mit', 'navn.', 'min', 'ikke'] },
          ok: [{ say: 'sluget', da: 'Et navn! Dem sælger jeg ikke. Desværre.', en: 'A name! Those I do not sell. Unfortunately.' }, { n: 'Its stalk bends, just slightly, your way.' }, { fx: { resp: 1, sk: 2 } }],
          fail: [{ n: 'Sluget swallows the sentence without tasting it. It is busy with the next stall.' }] },
        { kind: 'go', label: 'Leave. (It will not be here again.)', next: 'm_leave' },
      ] },
    m_sell: { bg: 'market', npc: 'sluget', title: 'Markedet',
      steps: [
        { say: 'sluget', da: 'Et ikke! Et vildt ikke. Tolv skæl.', en: 'An ikke! A wild ikke. Twelve scales.' },
        { n: 'Ikket jumps from your mouth into the stalk. Gulp. Somewhere inside, a muffled "ikke".' },
        { th: 'Someone will buy it and put it in a sentence. You will never know which.' },
        { special: 'loseIkket' }, { fx: { sk: 12, flag: 'Bsold' } },
      ],
      opts: [{ kind: 'go', label: 'Back to the stalls.', next: 'm_market' }] },
    m_leave: { bg: 'road', title: 'Markedet',
      steps: [{ n: 'You look back. No market. Just a smell of popcorn and one upside-down hat.' }, { fx: { flag: 'marketGone' } }],
      opts: [{ kind: 'go', label: 'Walk on.', next: 'map' }] },

    /* ===== FINALE: registration ===== */
    f_register: { bg: 'stair', npc: 'taeller', title: 'Trappen', card: ['Trappen', 'registration'],
      steps: [
        { n: 'Tælleren opens a fresh page and, for once, bends its long neck your way. Not its eyes. Its neck.' },
        { say: 'taeller', da: 'Nu. Hvad lavede du, før du kom hertil?', en: 'Now. What did you do before you came here?' },
      ],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 9, group: 'job', label: 'Tell it what you studied.', build: studyBuild, ok: [{ say: 'taeller', da: 'Godt. Det skriver jeg.', en: 'Good. I write that.' }], fail: [{ say: 'taeller', da: 'Pennen gled. Men jeg skriver det.', en: 'The pen slipped. But I write it.' }], next: 'f_register2' },
        { kind: 'say', stat: 'SPROG', dc: 9, group: 'job', label: 'Tell it what you did.', build: jobBuild, ok: [{ say: 'taeller', da: 'Godt. Det skriver jeg.', en: 'Good. I write that.' }], fail: [{ say: 'taeller', da: 'Pennen gled. Men jeg skriver det.', en: 'The pen slipped. But I write it.' }], next: 'f_register2' },
      ] },
    f_register2: { bg: 'stair', npc: 'taeller', title: 'Trappen',
      steps: [{ say: 'taeller', da: 'Hvor boede du?', en: 'Where did you live?' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 9, label: 'Tell it where you lived.', build: placeBuild, ok: [{ say: 'taeller', da: 'Godt.', en: 'Good.' }], fail: [{ say: 'taeller', da: 'Hm. Min pen er træt. Men jeg skriver det.', en: 'Hm. My pen is tired. But I write it.' }], next: 'f_register3' },
      ] },
    f_register3: { bg: 'stair', npc: 'taeller', title: 'Trappen',
      steps: [{ say: 'taeller', da: 'Og i din fritid?', en: 'And in your free time?' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 9, label: 'Tell it what you did in your free time.', build: fritidBuild, ok: [{ say: 'taeller', da: 'Godt. Færdig.', en: 'Good. Done.' }], fail: [{ say: 'taeller', da: 'Pennen gled. Men jeg skriver det.', en: 'The pen slipped. But I write it.' }], next: 'f_end' },
      ] },
    f_end: { bg: 'stair', npc: 'taeller', title: 'Trappen',
      steps: [
        { n: 'It writes, honks twice, then flips back to a much older page.' },
        { special: 'regReact' },
        { say: 'taeller', da: 'Mærkeligt. Her står der noget andet. Fra før.', en: 'Strange. Here it says something else. From before.' },
        { th: 'Old handwriting. Its own. And one word the same shape as the one Ikket hiccupped.' },
        { say: 'taeller', da: 'Det var ikke noget. Velkommen til Hertil.', en: 'It was nothing. Welcome to Hertil.' },
        { fx: { flag: 'Adone', resp: 1 } },
      ],
      opts: [{ kind: 'go', label: 'End the lesson.', next: 'end' }] },
  },
};
