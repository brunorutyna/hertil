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
  blurb: 'You fall into Hertil with no name and no past. Everyone asks why you came. Whatever you answer becomes true.',
  start: 'p_fall', home: 'rede', travelAfter: 'Areason', cluesFlag: 'Aclues', cluesNeed: 3,

  /* ---------- the map of Hertil ---------- */
  locations: {
    rede:   { name: 'Reden', en: 'your hollow', x: 30, y: 62, bg: 'nest', night: true, entry: G => 'rede_hub' },
    bund:   { name: 'Bunden', en: 'where things land', x: 50, y: 50, bg: 'bottom', entry: G => G.flags.Btaeller && !G.flags.Bsamler ? 'b_samler' : 'bund_hub' },
    trappe: { name: 'Trappen', en: 'the stair that goes into itself', x: 68, y: 66, bg: 'stair', entry: G => 'trappe_hub' },
    hal:    { name: 'Vævehallen', en: 'the weaving hall', x: 22, y: 36, bg: 'hall', req: G => !G.flags.hallGone, entry: G => G.flags.Btaeller && G.flags.Bsamler && !G.flags.Bhall ? 'b_hall' : 'hal_hub' },
    slette: { name: 'Støvsletten', en: 'the dust plain', x: 74, y: 24, bg: 'plain', night: true, entry: G => !G.flags.Cmet ? 'c_meet' : G.flags.Cdone ? 'slette_after' : 'c_hub' },
    damme:  { name: 'Dammene', en: 'the three ponds', x: 44, y: 80, bg: 'ponds', entry: G => 'damme_hub' },
    marked: { name: 'Markedet', en: 'here only once', x: 84, y: 48, bg: 'market', eph: true, req: G => G.day >= 2 && !G.flags.marketGone, entry: G => 'm_market' },
  },

  ending: G => [G.flags.Bbound ? 'Bundet' : G.flags.Bsold ? 'Solgt' : G.flags.Bfree ? 'Fri' : null, G.flags.Clook ? 'Blikket' : G.flags.Cborrow ? 'Lånt fortid' : G.flags.Cgone ? 'Huset gik' : null].filter(Boolean).join(' · ') || '—',
  next: '<b>Lektion 2 · Hvor længe skal du være her?</b> Time in a place where time does not behave: for … siden, om …, i …, da / når.',
  carryFlags: ['Bbound', 'Bfree', 'Bsold', 'Cgone', 'Cborrow', 'Clook'],

  quests: {
    A: { title: 'Faldet', en: 'The fall', obj: [['Give Tælleren a reason', 'Areason'], ['Find three traces of what you were', 'Aclues'], ['Be registered at Trappen', 'Adone']] },
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
    fald: { name: 'Faldt op', en: 'Fell upwards', text: 'Samleren filed you under "Ting, der faldt op". Things that fell upwards. You did not know there was such a category, or that you were in it.' },
    haender: { name: 'Hænder', en: 'Hands', text: 'For a moment your reflection had hands. Long ones, used to holding something warm. Then the water remembered what you look like now.' },
    navn: { name: 'Et ord', en: 'A word', text: 'Ikket said a word. It was short, and it fitted in your mouth the way a key fits a lock it was not made for.' },
    koekken: { name: 'Køkken', en: 'Kitchen', text: 'The small ones said you smell of a kitchen. They do not know what a kitchen is. They only know the word, and that it is warm.' },
    ekko: { name: 'Ekkoet', en: 'The echo', text: 'An echo repeated a sentence you have never said, in a voice that was nearly yours. "Før jeg kom hertil …" Then nothing.' },
  },

  letters: {
    ledger: { title: 'TÆLLERENS BOG · side 1', lines: ['DEN BAGVENDTE.', 'Kom hertil for meget længe siden.', 'Grund: på grund af en storm.', 'Før: et hus. Mange boede i det.', 'Vender sig ikke om.'],
      qs: [{ q: 'What was it, before it came here?', opts: ['A house', 'A storm', 'A tower'], a: 0, flag: 'c_ledger' },
           { q: 'Why did it come here?', opts: ['Because of a storm', 'To find the ones who lived in it', 'Because it could not turn around'], a: 0 }] },
  },

  hunts: {
    bund: { title: 'Samlerens liste', en: 'Find what fell', bg: 'bottom',
      find: ['fjer', 'knogle', 'tand', 'oeje', 'skal', 'noegle'], decoys: ['traad', 'sten', 'klokke', 'spejlet', 'lygte', 'aeg', 'ring', 'hjerte', 'haand', 'timeglas'] },
  },
  jobs: { title: 'Tællerens liste', keys: ['kok', 'laerer', 'laege', 'arkitekt', 'ingenioer', 'journalist', 'musiker', 'forsker', 'designer', 'gartner', 'farmaceut', 'oekonom'], prefix: 'Den ', pay: 2,
    end: n => `Tælleren pays ${n * 2} scales, one at a time, without looking at you. It does not know what any of these jobs are. It files them anyway. That is what filing is.` },

  boxes: {
    dam: { title: 'Datidens damme', q: 'Hvilken dam?', boxes: ['-ede (blød d)', '-te (hård t)', 'uregelmæssig'],
      good: 'The ponds settle. In the soft one, every word ends in a sigh: -ede. In the hard one, a click: -te. The third pond does whatever it likes.', meh: 'Some verbs sink into the wrong pond and lie there, sulking. The ponds will give them back. Ponds are patient.',
      items: [
        { t: 'lave', a: 0, say: 'lavede', why: 'lave → lavede. The soft d.' }, { t: 'arbejde', a: 0, say: 'arbejdede', why: 'arbejde → arbejdede.' }, { t: 'bo', a: 0, say: 'boede', why: 'bo → boede.' },
        { t: 'flytte', a: 0, say: 'flyttede', why: 'flytte → flyttede.' }, { t: 'studere', a: 0, say: 'studerede', why: 'studere → studerede.' },
        { t: 'læse', a: 1, say: 'læste', why: 'læse → læste. The hard t.' }, { t: 'købe', a: 1, say: 'købte', why: 'købe → købte.' }, { t: 'spise', a: 1, say: 'spiste', why: 'spise → spiste.' },
        { t: 'søge', a: 1, say: 'søgte', why: 'søge → søgte.' }, { t: 'undervise', a: 1, say: 'underviste', why: 'undervise → underviste.' },
        { t: 'gå', a: 2, say: 'gik', why: 'gå → gik.' }, { t: 'have', a: 2, say: 'havde', why: 'have → havde.' }, { t: 'komme', a: 2, say: 'kom', why: 'komme → kom.' }, { t: 'få', a: 2, say: 'fik', why: 'få → fik.' }, { t: 'være', a: 2, say: 'var', why: 'være → var.' },
      ] },
    arkiv: { title: 'Tællerens arkiv', q: 'i eller på?', boxes: ['i', 'på'],
      good: 'Tælleren files every card where it belongs. It still has no idea what a bank is. It is happier for not knowing.', meh: 'A few cards are filed under the wrong word. Tælleren will notice in about a hundred years, and be quietly furious.',
      items: [
        { t: 'Den arbejdede ___ et firma.', a: 0, why: 'i et firma, i en bank: inside a company.' }, { t: 'Hun arbejdede ___ en bank.', a: 0, why: 'i en bank.' },
        { t: 'Han arbejdede ___ et hospital.', a: 1, why: 'på et hospital, på en skole: workplaces you go to.' }, { t: 'Den underviste ___ en skole.', a: 1, why: 'på en skole.' },
        { t: 'Hun skrev artikler ___ en avis.', a: 1, why: 'på en avis.' }, { t: 'De arbejdede ___ et apotek.', a: 1, why: 'på et apotek.' },
        { t: 'Vi studerede ___ universitetet.', a: 1, why: 'på universitetet.' }, { t: 'Den boede ___ en storby.', a: 0, why: 'i a town or a country.' },
        { t: 'Han boede ___ en ø.', a: 1, why: 'på an island: på en ø.' }, { t: 'De boede ___ landet.', a: 1, why: 'på landet: in the countryside.' },
      ] },
  },

  corr: { npc: 'spejl', title: 'Spejlet',
    intro: 'The upright pond tilts, and on its surface appear sentences. Yours, or ones that could have been yours, each wrong in a way you recognise.',
    good: 'Spejlet goes still. For a moment your reflection in it is exactly right. Then it ripples, the way a face does when it decides to like you.',
    meh: 'Spejlet ripples. It will show you these again. Mirrors have nothing but time.',
    items: [
      { bad: 'Før jeg kom hertil, jeg boede på en ø.', good: 'Før jeg kom hertil, boede jeg på en ø.', wrong: ['Før kom jeg hertil, jeg boede på en ø.', 'Før jeg kom hertil, jeg har boet på en ø.'], why: 'A før-clause first → the verb jumps ahead of the subject: boede jeg.' },
      { bad: 'Jeg kom hertil, fordi jeg ville gerne sove.', good: 'Jeg kom hertil, fordi jeg gerne ville sove.', wrong: ['Jeg kom hertil, fordi ville jeg gerne sove.', 'Jeg kom hertil, fordi jeg ville sove gerne.'], why: 'Inside a fordi-clause: subject – adverb – verb. jeg gerne ville.' },
      { bad: 'Den kom hertil fordi en storm.', good: 'Den kom hertil på grund af en storm.', wrong: ['Den kom hertil for at en storm.', 'Den kom hertil, fordi af en storm.'], why: 'A noun after the reason → på grund af: på grund af en storm.' },
      { bad: 'Hun kom hertil på grund af finde sin ven.', good: 'Hun kom hertil for at finde sin ven.', wrong: ['Hun kom hertil fordi finde sin ven.', 'Hun kom hertil for finde sin ven.'], why: 'A verb after the reason → for at + infinitive: for at finde.' },
      { bad: 'Jeg spisede meget støv.', good: 'Jeg spiste meget støv.', wrong: ['Jeg spist meget støv.', 'Jeg spiserede meget støv.'], why: 'spise belongs to the -te pond: spiste.' },
      { bad: 'Han arbejdede i et hospital.', good: 'Han arbejdede på et hospital.', wrong: ['Han arbejdede til et hospital.', 'Han arbejdede om et hospital.'], why: 'Workplaces like a hospital or a school take på.' },
      { bad: 'Også jeg samlede sten.', good: 'Jeg samlede også sten.', wrong: ['Jeg også samlede sten.', 'Samlede jeg også sten.'], why: 'Main clause: subject, verb, then the adverb: Jeg samlede også.' },
    ] },

  /* ---------- small encounters on the way ---------- */
  travel: [
    { id: 'unge', bg: 'road', npc: 'unge', steps: [{ n: 'Something small and eager falls into step beside you. It is mostly ears. It is looking at a point slightly to your left, where it seems to think you are.' }, { say: 'unge', da: 'Hej! Du er ny. Hvad lavede du, før du kom hertil?', en: 'Hi! You are new. What did you do before you came here?' }],
      opts: [{ kind: 'say', stat: 'SPROG', dc: 8, label: 'Answer it.', build: jobBuild, ok: [{ say: 'unge', da: 'Hvad er det? Det lyder spændende!', en: 'What is that? It sounds exciting!' }, { fx: { resp: 1 } }], fail: [{ say: 'unge', da: 'Hvad? Du taler mærkeligt.', en: 'What? You talk strangely.' }], next: 'map' },
             { kind: 'eng', label: '“Sorry, I don’t speak … this.”', ok: [{ say: 'unge', da: 'Det lyder som regn, der falder op.', en: 'That sounds like rain falling upwards.' }], next: 'map' }] },
    { id: 'moel', bg: 'road', npc: 'moel', steps: [{ n: 'A moth the size of a coat hangs in the air, wings shut, facing away from you. On its back, under the wings, something glows.' }, { say: 'moel', da: 'Gnister. Seks skæl.', en: 'Sparks. Six scales.' }, { th: 'A spark: a second try, for when the dice turn against you.' }],
      opts: [{ kind: 'act', special: 'buyInsp', label: 'Buy a spark (6 skæl).', next: 'map' }, { kind: 'go', label: 'Walk on.', next: 'map' }] },
    { id: 'ekko', bg: 'road', steps: [{ n: 'An echo is lying in the dust, the way a dropped glove lies. When you pass, it says something.' }, { glimpse: 'ekko' }], opts: [{ kind: 'go', label: 'Walk on, a little faster.', next: 'map' }] },
    { id: 'tal', bg: 'road', steps: [{ n: 'The numbers come loose. You notice first on your own skin: the marks that were words stay words, but the ones that were numbers have turned into scratches that mean nothing.' }, { special: 'glyphs' }, { th: 'For a while, numbers will mean nothing here. Words will have to do. Listen for them.' }], opts: [{ kind: 'go', label: 'Walk on.', next: 'map' }] },
    { id: 'smelt', bg: 'road', steps: [{ n: 'A puddle of something that was a die once. Twenty faces, all of them running.' }],
      opts: [{ kind: 'act', stat: 'INDSIGT', dc: 9, label: 'Read what is left of it.', ok: [{ n: 'The last legible face says 1. Hertil has a sense of humour, and it is not a kind one. Under the puddle, two scales.' }, { fx: { sk: 2 } }], fail: [{ n: 'You get it on your hands. For an hour, your fingers count wrong.' }], next: 'map' },
             { kind: 'go', label: 'Step around it.', next: 'map' }] },
    { id: 'regn', bg: 'road', night: true, steps: [{ n: 'It is raining upwards. The drops leave the ground in a hurry, as if they had somewhere to be.' }],
      opts: [{ kind: 'act', stat: 'INDSIGT', dc: 11, label: 'Stand in it.', ok: [{ n: 'You get wet from below. Somewhere in you something small and stuck comes loose and goes up with the rain. You feel lighter. You feel lucky.' }, { fx: { insp: 1 } }], fail: [{ n: 'You get wet in a direction you did not know you had.' }], next: 'map' },
             { kind: 'go', label: 'Walk on.', next: 'map' }] },
  ],

  /* ---------- lesson-only actions ---------- */
  special: {
    async nestLine() {
      const f = G.flags;
      const lines = f.Clook ? ['Reden feels smaller now. Out on the plain something is facing this way, and the hollow knows it.'] : f.Bfree ? ['Something in your mouth hums “ikke, ikke” to itself, like a lullaby that has forgotten the tune.'] : ['The hollow in the amber has not changed. It is the only thing in Hertil that seems to be waiting for you.', 'Your marks itch a little. The ones you have not used are fainter than this morning.'];
      logAdd(`<p>${esc(pick(lines))}</p>`, 'narr');
      if (f.Bdone && f.Cdone && !f.Adone) logAdd(`<p>The hall and the plain have both been settled, one way or another. Tælleren will be waiting at the Stair with its pen.</p>`, 'thought');
    },
    async bundLine() {
      if (!G.flags.bundSeen) { G.flags.bundSeen = true; logAdd(`<p>Bunden. Things keep landing: a feather, then nothing for a long time, then four keys at once. Samleren sorts them into piles that only it understands. It does not look up when you come. It did not look up when you fell.</p>`, 'narr'); return; }
      logAdd(`<p>${esc(pick(['Something lands behind you with a sound like a cough. Samleren files it without looking.', 'Samleren is holding a bone up to the light, the way one holds up a letter to see if there is money in it.', 'A shower of teeth. Samleren sighs, which it does with its whole spiral.']))}</p>`, 'narr');
    },
    async trappeLine() {
      if (!G.flags.trapSeen) { G.flags.trapSeen = true; logAdd(`<p>Tælleren stands at the foot of the stair, counting. It counts out loud, under its breath, in Danish. You are counted, every time you come, and every time you are a number it did not expect.</p>`, 'narr'); return; }
      const f = G.flags;
      if (f.Bdone && f.Cdone && !f.Adone) sayEntry({ say: 'taeller', da: 'Nu. Nu kan jeg skrive dig.', en: 'Now. Now I can write you.' });
      else sayEntry({ say: 'taeller', da: pick(['Fire hundrede og to. Fire hundrede og tre.', 'En fjer. En tand. Dig.', 'Kom tilbage, når du ved mere.']), en: pick(['Four hundred and two. Four hundred and three.', 'A feather. A tooth. You.', 'Come back when you know more.']) });
      await tapOn();
    },
    async halLine() {
      if (!G.flags.halSeen) {
        G.flags.halSeen = true;
        logAdd(`<p>Vævehallen: arches the colour of old teeth, and between them threads, thousands of them, running from the ceiling into the floor. Each one is a reason somebody gave. The floor you are standing on is woven out of them. It gives a little under your feet, like a held breath.</p>`, 'narr'); await tapOn();
        logAdd(`<p>Grundvæversken sits at a loom as tall as the hall. She is long, and veiled, and wears a robe so finely patterned that it hurts to follow it. Her face is a small pale mask, turned up toward a hanging lamp. She has the posture of someone who has been sitting for a portrait for three hundred years and has stopped expecting the painter.</p>`, 'narr');
        return;
      }
      logAdd(`<p>${esc(pick(['The shuttle goes back and forth. The lamp swings, very slightly, though there is no wind in Hertil.', 'Grundvæversken weaves. A new thread drops from the ceiling: somebody, somewhere, has just given a reason.']))}</p>`, 'narr');
    },
    async sletteLine() {
      const f = G.flags;
      if (f.Ctold) return;
      logAdd(`<p>${esc(G.phase >= 3 ? 'In the dark the plain is darker. Den Bagvendte is a darker shape against it, still facing the towers. Somewhere in its folds, small lights: the small ones are awake.' : pick(['Den Bagvendte has not moved. Dust has collected on its shoulders like snow on a roof.', 'The branches on its head creak. It might be thinking. It might be wind, except that there is no wind.']))}</p>`, 'narr');
      if (f.Cknown) logAdd(`<p>You know what it was. You could tell it.</p>`, 'thought');
    },
    async dammeLine() {
      if (!G.flags.damSeen) {
        G.flags.damSeen = true;
        logAdd(`<p>Three ponds, side by side, as still as plates. In the first the water is soft and full of sighs. In the second it is hard and clicks when it ripples. The third does whatever it wants.</p>`, 'narr'); await tapOn();
        logAdd(`<p>A fourth pond stands upright, like a door made of water. Spejlet. Its surface faces away from you, toward the third pond, and it shows something there you cannot see from here.</p>`, 'narr');
        return;
      }
      logAdd(`<p>${esc(pick(['A verb surfaces in the soft pond, sighs, and sinks again.', 'Spejlet shivers. Somewhere it has caught a mistake, and it is savouring it.']))}</p>`, 'narr');
    },
    async marketLine() {
      if (!G.flags.mSeen) {
        G.flags.mSeen = true;
        logAdd(`<p>A market, where yesterday there was only dust. Stalls of bone and stretched skin, things hanging from hooks that you decide are fruit. Nobody here looks at anybody. Everybody is very busy pretending not to want what they want.</p>`, 'narr'); await tapOn();
        logAdd(`<p>In the middle sits Sluget: a mouth on a long stalk, and very little else. It is turned toward the stall next door, chewing a word. It buys words. It sells reasons. You have the clear sense that this market will not be here again, and that it knows you know.</p>`, 'narr');
      }
    },
    /* the market: prices are said aloud, in Danish */
    market() {
      return new Promise(resolve => {
        const goods = [['gnist', 'en gnist', 'a spark (inspiration)', 5, 'fem'], ['ekko', 'et ekko', 'an echo', 3, 'tre'], ['tand', 'en tand', 'a tooth', 2, 'to']];
        const ov = vocabSheet('');
        let i = 0;
        const round = () => {
          if (i >= goods.length) { ov.querySelector('.voc').innerHTML = `<div class="v-h"><small>Markedet</small><h2>Færdig</h2><p>You have ${G.sk} scales left. Sluget has already forgotten you, which in Hertil is a kind of politeness.</p></div><button class="btn gold big" id="vDone">Færdig</button>`; $('#vDone').onclick = () => { ov.remove(); resolve(); }; return; }
          const [k, da, en, price, word] = goods[i];
          const line = `${da.replace(/^(en|et) /, '').replace(/^./, c => c.toUpperCase())}? Det koster ${word} skæl.`;
          const opts = shuffle([price, ...shuffle([2, 3, 4, 5, 6, 7, 8, 12, 13].filter(n => n !== price)).slice(0, 2)]);
          ov.querySelector('.voc').innerHTML = `<div class="v-h"><small>Sluget · ${G.sk} skæl</small><h2>${esc(da)}</h2><p><i>${esc(en)}</i></p><div class="v-say">“${daHTML(line)}” <button class="tb" id="sSay">♪</button></div><p>How many scales do you put down? Or walk past.</p></div>
            <div class="coins">${opts.map(n => `<button class="coin" data-n="${n}" ${G.sk < n ? 'disabled' : ''}>${n}</button>`).join('')}</div><button class="btn ghost" id="skip">Ikke i dag</button>`;
          wireWords(ov); TTS.say(line);
          $('#sSay').onclick = () => TTS.say(line, true);
          $('#skip').onclick = () => { i++; round(); };
          ov.querySelectorAll('.coin').forEach(b => b.onclick = async () => {
            if (+b.dataset.n === price) {
              G.sk -= price; AUDIO.sting('coin'); statGain('HANDEL', 1); b.classList.add('ok');
              if (k === 'gnist') fx({ insp: 1 }); if (k === 'ekko') { fx({ resp: 1 }); toast('The echo repeats your name to the market. It is wrong, but people turn their heads.', 'gold'); } if (k === 'tand') toast('A tooth. It bites you once, affectionately.', 'gold');
              hud(); await sleep(700); i++; round();
            } else { b.classList.add('no'); b.disabled = true; AUDIO.sting('lose'); const fix = `${word[0].toUpperCase() + word.slice(1)}. Ikke ${NUMS[+b.dataset.n]}.`; toast(fix, 'bad'); TTS.say(fix); }
          });
        };
        round();
      });
    },
    async loseIkket() { G.boons = G.boons.filter(b => b !== 'ikket'); toast('Ikket is gone from your mouth. It is very quiet in there now.', 'bad'); hud(); },
    async cCheck() {
      const n = ['c_ledger', 'c_folk', 'c_weaver'].filter(f => G.flags[f]).length;
      if (n >= 2 && !G.flags.Cknown) { G.flags.Cknown = true; toast('Two voices agree. You know what Den Bagvendte was.', 'gold'); AUDIO.sting('glimpse'); }
    },
    async turn() {
      G.flags.Clook = true;
      setNpc('bagvendt', 'turn');
      AUDIO.sting('gaze');
      await sleep(2600);
    },
    async glyphs() { G.glyph = 3; AUDIO.sting('glyph'); toast('ᚦᚨᛚ · the numbers are strange for a while', 'gold'); },
  },

  /* ---------- the nodes ---------- */
  nodes: {
    /* ===== PROLOGUE: the fall ===== */
    p_fall: { bg: 'void', title: '', card: ['Kapitel 1 · Baggrund', 'Lektion 1 — Hvorfor kom du hertil?'],
      steps: [
        { n: 'You fall for a long time. Long enough to get bored of falling, and then long enough to stop being bored.' },
        { n: 'Things fall with you. A feather. A tooth. Something that might be a bell, or the memory of one. None of you speak. It would be rude, mid-fall.' },
        { th: 'You try to remember where you are falling from. There is a place where that should be. The place is tidy, and completely empty.' },
        { n: 'Then the falling stops, and you discover that you have a bottom, because you land on it.' },
      ],
      opts: [{ kind: 'go', label: 'Get up.', next: 'p_bottom' }] },
    p_bottom: { bg: 'bottom', npc: 'samler', title: 'Bunden',
      steps: [
        { n: 'Amber dust, as far as there is far. Things lie where they landed: bones, shells, a key with no door anywhere near it.' },
        { n: 'A creature is sorting them: a spiral of shell with a great many thin arms, and every arm holds something. It is not looking at you. It is looking at a tooth, with enormous interest.' },
        { say: 'samler', da: 'En tand. En fjer. En … ting.', en: 'A tooth. A feather. A … thing.' },
        { th: 'The thing is you.' },
        { n: 'One of its arms writes in a long book. Then you notice that your feet have gone. Not gone: under. You are sinking into the dust, slowly, the way a thought sinks when nobody is having it.' },
        { say: 'samler', da: 'Ting uden grund synker. Gå til Tælleren. Til Trappen.', en: 'Things without a reason sink. Go to the Counter. To the Stair.' },
      ],
      opts: [
        { kind: 'act', stat: 'INDSIGT', dc: 7, group: 'a', label: 'Read what it wrote about you.', ok: [{ n: 'Upside down, in a tidy hand, the heading it has filed you under.' }, { glimpse: 'fald' }], fail: [{ n: 'An arm moves the book away. Not in a hurry. It simply prefers that you not read it.' }], next: 'p_stair' },
        { kind: 'reply', group: 'a', da: 'Tak.', ok: [{ n: 'It does not answer. Thanking it was like thanking the weather.' }], next: 'p_stair' },
      ] },
    p_stair: { bg: 'stair', npc: 'taeller', title: 'Trappen', hub: true, card: ['Trappen', 'the stair that goes into itself'],
      steps: [
        { n: 'The stair goes up, then up again, and then, without any fuss, into itself. At its foot stands something tall on four jointed stilts, with a long neck and a crest of quills. It is looking up at a hanging gold sphere, as if the sphere owed it money.' },
        { n: 'This is Tælleren. It counts what arrives. You know this the way you know you are sinking: from the inside.' },
        { say: 'taeller', da: 'Ny. Navn?', en: 'New. Name?' },
        { th: 'You open your mouth and find nothing in it.' },
        { say: 'taeller', da: 'Intet navn. Det sker. Hvorfor kom du hertil?', en: 'No name. It happens. Why did you come here?' },
        { n: 'It still has not looked at you. It has a pen. The pen is waiting.' },
        { th: 'You do not know why you came. But whatever you say will be written down, and here, what is written down is true. A thing, a purpose, or a story: choose what kind of reason you are.' },
      ],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 7, group: 'reason', label: 'A thing pulled you here (på grund af + a noun).', build: reasonPGA,
          ok: [{ n: 'The word lands in the book like a stone in a pond. Something heavy settles in your middle, and your feet stop sinking.' }, { fx: { boon: 'anker', flag: 'Areason', resp: 1 } }],
          fail: [{ say: 'taeller', da: 'Skævt. Men det holder.', en: 'Crooked. But it holds.' }, { n: 'Something heavy settles in your middle, a little to one side. You stop sinking, at a slight angle.' }, { fx: { boon: 'anker', flag: 'Areason' } }], next: 'p_stair2' },
        { kind: 'say', stat: 'SPROG', dc: 7, group: 'reason', label: 'A purpose pushed you (for at + a verb).', build: reasonFA,
          ok: [{ n: 'The pen draws a line. A thin thread grows out of your chest and pulls, very gently, toward somewhere you have not been yet. Your feet stop sinking.' }, { fx: { boon: 'traad', flag: 'Areason', resp: 1 } }],
          fail: [{ say: 'taeller', da: 'Skævt. Men det holder.', en: 'Crooked. But it holds.' }, { n: 'A thread grows out of your chest, tangled. It pulls in two directions, then makes up its mind.' }, { fx: { boon: 'traad', flag: 'Areason' } }], next: 'p_stair2' },
        { kind: 'say', stat: 'SPROG', dc: 8, group: 'reason', label: 'A story drove you (fordi + a whole clause).', build: reasonFORDI,
          ok: [{ n: 'The pen writes, and the writing does not stay on the page. It crawls up your arm in a fine pattern, a sentence you could read if you stood far enough away from yourself. Your feet stop sinking.' }, { fx: { boon: 'moenster', flag: 'Areason', resp: 1 } }],
          fail: [{ say: 'taeller', da: 'Skævt. Men det holder.', en: 'Crooked. But it holds.' }, { n: 'The sentence crawls up your arm with one word in the wrong place, like a stitch that has slipped.' }, { fx: { boon: 'moenster', flag: 'Areason' } }], next: 'p_stair2' },
        { kind: 'eng', once: true, label: '“I don’t know. I really don’t know.”', ok: [{ say: 'taeller', en: '“I don’t know” is not a reason. It is weather.' }, { n: 'You sink a little further while it waits. One of the others, then.' }] },
      ] },
    p_stair2: { bg: 'stair', npc: 'taeller', title: 'Trappen', quest: 'A',
      steps: [
        { say: 'taeller', da: 'Godt. Nu har du en grund. Nu synker du ikke.', en: 'Good. Now you have a reason. Now you do not sink.' },
        { say: 'taeller', da: 'Men en grund er ikke et navn. Kom tilbage, når du ved, hvad du lavede, før du kom hertil.', en: 'But a reason is not a name. Come back when you know what you did before you came here.' },
        { say: 'taeller', da: 'Spørg Den Bagvendte på sletten. Den har heller ikke en fortid.', en: 'Ask the one turned away, on the plain. It has no past either.' },
        { n: 'It returns to its counting. It counts something twice, then something not at all, and frowns at its own pen.' },
        { say: 'taeller', da: 'Jeg tæller, fordi jeg vil miste nogen.', en: 'I count because I want to lose someone.' },
        { th: 'That sentence is wrong. Not wrong like a lie. Wrong like a stair with a step missing. Something has been taken out of it.' },
      ],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 9, label: 'Give the sentence back its missing word.', build: { en: 'I count because I don’t want to lose anyone.', answers: [['Jeg', 'tæller,', 'fordi', 'jeg', 'ikke', 'vil', 'miste', 'nogen.']], tiles: ['Jeg', 'tæller,', 'fordi', 'jeg', 'ikke', 'vil', 'miste', 'nogen.', 'gerne'] },
          ok: [{ n: 'The sentence clicks shut like a box. Tælleren blinks, both sets of eyelids.' }, { say: 'taeller', da: '… fordi jeg ikke vil miste nogen. Ja. Sådan.', en: '… because I don’t want to lose anyone. Yes. Like that.' }, { fx: { flag: 'Btaeller', resp: 1 } }],
          fail: [{ n: 'The word goes in, but in the wrong place, and the sentence wobbles. Tælleren corrects it itself, irritably, as if you had trodden on its foot: in a fordi-clause, ikke comes before the verb.' }, { say: 'taeller', da: '… fordi jeg ikke vil miste nogen.', en: '… because I don’t want to lose anyone.' }, { fx: { flag: 'Btaeller' } }],
          post: [{ say: 'taeller', da: 'Noget spiser ordet ikke. Overalt. Find det.', en: 'Something is eating the word ikke. Everywhere. Find it.' }, { fx: { quest: 'B' } }], next: 'p_nest' },
      ] },
    p_nest: { bg: 'nest', title: 'Reden', card: ['Reden', 'a hollow that fits you'],
      steps: [
        { n: 'Your reason, whatever it has made of you, leads you to a hollow in a wall of amber. It fits you. It is not clear whether it was made for you or has simply given up arguing.' },
        { n: 'Your skin itches. The Danish you heard today has stuck to you: small marks, like the print a word leaves when it is pressed into wax.' },
        { th: 'When you sleep, they will settle. The ones you do not use will fade. You are not sure how you know this. You are not sure how you know anything.' },
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
      steps: [{ say: 'samler', da: 'Godt. Alt er sorteret. Her er fire skæl.', en: 'Good. Everything is sorted. Here are four scales.' }, { fx: { sk: 4, flag: 'huntDone', resp: 1 } }, { n: 'It pays you with scales from its own spiral. It does not seem to miss them.' }],
      opts: [{ kind: 'go', label: 'Back.', next: 'bund_hub' }] },
    b_samler: { bg: 'bottom', npc: 'samler', title: 'Bunden',
      steps: [
        { n: 'The piles have collapsed into each other: bones on feathers, keys in shells, and in the middle Samleren, holding a tooth and looking at it as if it had never seen one.' },
        { say: 'samler', da: 'Hvad er det? Jeg har glemt det. Jeg har glemt alt.', en: 'What is it? I have forgotten it. I have forgotten everything.' },
        { say: 'samler', da: 'Jeg samler ting, fordi jeg kan glemme dem.', en: 'I collect things because I can forget them.' },
        { th: 'The same hole. The same missing word.' },
        { n: 'Next to it, in the dust, a track. Small, round footprints, each one a perfect absence, as if something had stepped there by not being there.' },
      ],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 10, label: 'Put the ikke back where it belongs.', build: { en: 'I collect things because I cannot forget them.', answers: [['Jeg', 'samler', 'ting,', 'fordi', 'jeg', 'ikke', 'kan', 'glemme', 'dem.']], tiles: ['Jeg', 'samler', 'ting,', 'fordi', 'jeg', 'ikke', 'kan', 'glemme', 'dem.', 'gerne', 'det'] },
          ok: [{ n: 'Samleren goes still. Then all its arms move at once, and the piles rise back into piles.' }, { say: 'samler', da: 'En tand! Selvfølgelig. Tak.', en: 'A tooth! Of course. Thank you.' }, { fx: { flag: 'Bsamler', resp: 1, sk: 2 } }],
          fail: [{ n: 'The ikke goes in crooked. Samleren remembers about half of everything. It seems content with the half.' }, { fx: { flag: 'Bsamler' } }],
          post: [{ n: 'The tracks lead away from the piles, west, toward the arches of the weaving hall.' }, { th: 'Whatever eats the word, it is heading for the place with the most reasons in it.' }], next: 'map' },
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
      steps: [{ say: 'taeller', da: 'Den Bagvendte. Side et.', en: 'The one turned away. Page one.' }, { n: 'It opens the book with one foot and turns it toward you, still without looking.' }, { letter: 'ledger' }, { special: 'cCheck' }],
      opts: [{ kind: 'go', label: 'Back.', next: 'trappe_hub' }] },

    /* ===== B · IKKET ===== */
    hal_hub: { bg: 'hall', npc: 'vaever', title: 'Vævehallen', hub: true,
      steps: [{ special: 'halLine' }],
      opts: [
        { kind: 'reply', once: true, da: 'Hvad laver du?', ok: [{ say: 'vaever', da: 'Jeg væver gulvet. Af grunde. Hver grund er en tråd.', en: 'I weave the floor. Out of reasons. Every reason is a thread.' }, { n: 'She does not look away from the lamp to say it. You feel, though, that she has noticed you, in the way one notices a draught.' }, { fx: { resp: 1 } }] },
        { kind: 'act', stat: 'INDSIGT', dc: 10, once: true, label: 'Look at the floor.', req: G => G.flags.Btaeller && !G.flags.Bhall, ok: [{ n: 'There are holes in the weave. Small ones, round, each the exact size of a short word. Through one of them you see more amber, and below that something you decide not to look at.' }], fail: [{ n: 'A floor. Woven. You step on a soft place and pretend you did not.' }] },
        { kind: 'go', label: 'Ask about Den Bagvendte.', req: G => G.flags.Cmet && !G.flags.c_weaver && !G.flags.Cknown, next: 'c_weaver' },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    b_hall: { bg: 'hall_torn', npc: 'vaever', title: 'Vævehallen', card: ['Vævehallen', 'the weave is coming apart'],
      steps: [
        { n: 'The hall is coming apart. The holes in the floor are big now, and threads hang loose from the ceiling, swinging, reasons that nobody is holding.' },
        { n: 'Grundvæversken weaves faster than before. Her face is still turned up to the lamp. She is weaving the same sentence again and again, and it keeps coming undone.' },
        { say: 'vaever', da: 'Jeg bliver her, fordi jeg kan gå. Jeg bliver her, fordi jeg kan gå.', en: 'I stay here because I can leave. I stay here because I can leave.' },
        { th: 'And there, in the middle of her loom, small and round and black as a pupil: the thing that eats the word.' },
        { npc: 'ikket' },
        { say: 'ikket', da: 'Ikke. Ikke ikke. Ikke!', en: 'Not. Not not. Not!' },
      ],
      opts: [
        { kind: 'act', stat: 'SNIGE', dc: 11, group: 'catch', label: 'Creep up and catch it.', ok: [{ n: 'You close your hands. It is cold, and it is nothing, and it wriggles.' }], fail: [{ n: 'Your hands close on a hole the exact shape of your hands. Then it gets bored and lets you catch it anyway. It wanted to be caught. Negations always do.' }], next: 'b_choice' },
        { kind: 'say', stat: 'SPROG', dc: 11, group: 'catch', label: 'Name it for what it is.', build: { en: 'You are the word ikke.', answers: [['Du', 'er', 'ordet', 'ikke.']], tiles: ['Du', 'er', 'ordet', 'ikke.', 'et', 'ord'] },
          ok: [{ n: 'It stops. Words do, when they are named. It climbs into your hand like an animal that has been waiting for this.' }], fail: [{ n: 'It giggles at your grammar, and while it giggles you catch it.' }], next: 'b_choice' },
      ] },
    b_choice: { bg: 'hall_torn', npc: 'vaever', title: 'Vævehallen',
      steps: [
        { say: 'ikket', da: 'Ikke …', en: 'Not …' },
        { glimpse: 'navn' },
        { th: 'The ikke sits in your palm, purring. The weaver’s sentence hangs in the air, unfinished: Jeg bliver her, fordi jeg … kan gå.' },
        { th: 'You could weave it back in. Or you could notice that without it, her sentence says she can leave.' },
      ],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 11, group: 'end', label: 'Weave the ikke back into her sentence.', build: { en: 'You stay here because you cannot leave.', answers: [['Du', 'bliver', 'her,', 'fordi', 'du', 'ikke', 'kan', 'gå.']], tiles: ['Du', 'bliver', 'her,', 'fordi', 'du', 'ikke', 'kan', 'gå.', 'gerne', 'jeg'] },
          ok: [{ n: 'The word goes in smoothly, the way a key goes into the lock it was cut for.' }], fail: [{ n: 'The word goes in crooked. It holds anyway. Tight sentences hold even when they are wrong. That is what makes them dangerous.' }, { fx: { resp: -1 } }], next: 'b_bound' },
        { kind: 'go', group: 'end', label: 'Keep it. Close your hand.', next: 'b_free' },
      ] },
    b_bound: { bg: 'hall', npc: 'vaever', title: 'Vævehallen',
      steps: [
        { n: 'The threads draw tight. The holes close, one by one, like eyes. The floor is a floor again.' },
        { say: 'vaever', da: 'Ja. Fordi jeg ikke kan gå. Tak.', en: 'Yes. Because I cannot leave. Thank you.' },
        { n: 'She says thank you the way a door says thank you when it is shut. Then she weaves a thread of her own and lays it across your wrist. It is warm. It does not come off.' },
        { th: 'You have mended something. You are not sure what you have mended it into.' },
        { fx: { boon: 'vaev', flag: 'Bhall', resp: 2 } }, { fx: { flag: 'Bbound' } }, { fx: { flag: 'Bdone' } },
      ],
      opts: [{ kind: 'go', label: 'Leave the hall.', next: 'map' }] },
    b_free: { bg: 'hall_torn', npc: 'vaever', title: 'Vævehallen',
      steps: [
        { n: 'You close your hand. The weaver weaves her sentence once more: Jeg bliver her, fordi jeg kan gå. She stops. Reads it.' },
        { say: 'vaever', da: '… fordi jeg kan gå.', en: '… because I can leave.' },
        { n: 'She puts down the shuttle. For the first time in what is clearly a very long time, she stands up from the loom. The hall does not like this. Threads snap like small bones.' },
        { say: 'vaever', da: 'Jeg kan gå.', en: 'I can leave.' },
        { npc: null },
        { n: 'And she does. Past you, without looking at you, out through an arch. Behind her the hall unweaves itself, quietly, thread by thread, until you are standing on plain dust under nothing at all.' },
        { th: 'The ikke in your mouth is purring. You did not know negations could purr.' },
        { fx: { boon: 'ikket', flag: 'Bhall' } }, { fx: { flag: 'Bfree' } }, { fx: { flag: 'Bdone' } }, { fx: { flag: 'hallGone' } },
      ],
      opts: [{ kind: 'go', label: 'Walk away from where the hall was.', next: 'map' }] },

    /* ===== C · DEN BAGVENDTE ===== */
    c_meet: { bg: 'plain', npc: 'bagvendt', title: 'Støvsletten', card: ['Støvsletten', 'the dust plain'],
      steps: [
        { n: 'The plain goes on long after it has run out of things to show you. In the middle of it stands something enormous with its back to everything.' },
        { n: 'It is taller than the Stair, draped, or grown, or rotted, in long dark folds, and out of its head grow branches that hold nothing. It faces the far towers. It has, you are certain, always faced the far towers.' },
        { say: 'bagvendt', da: 'Der er nogen bag mig.', en: 'There is someone behind me.' },
        { say: 'bagvendt', da: 'Jeg vender mig ikke om. Jeg ved ikke, hvad jeg var, før jeg kom hertil. Man kan ikke vende sig om uden en fortid.', en: 'I do not turn around. I do not know what I was before I came here. One cannot turn around without a past.' },
        { fx: { flag: 'Cmet', quest: 'C' } },
      ],
      opts: [
        { kind: 'reply', group: 'm', da: 'Jeg ved det heller ikke. Om mig selv.', ok: [{ say: 'bagvendt', da: 'Så er vi to.', en: 'Then there are two of us.' }, { fx: { resp: 1 } }], next: 'c_hub' },
        { kind: 'act', stat: 'INDSIGT', dc: 9, group: 'm', label: 'Look at its feet.', ok: [{ n: 'Around its feet, half buried in dust, small things are moving. Lots of them. They have built little rooms in the folds of its hem.' }], fail: [{ n: 'Dust. Some of the dust moves. You decide it was the wind, of which there is none.' }], next: 'c_hub' },
      ] },
    c_hub: { bg: 'plain', npc: 'bagvendt', title: 'Støvsletten', hub: true,
      steps: [{ special: 'sletteLine' }],
      opts: [
        { kind: 'go', label: 'Tell it what it was.', req: G => G.flags.Cknown && !G.flags.Ctold, next: 'c_tell' },
        { kind: 'go', label: 'Kneel and talk to the small ones at its feet.', req: G => !G.flags.c_folk && !G.flags.Cknown, next: 'c_folk' },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    c_folk: { bg: 'plain', npc: 'husfolk', title: 'Støvsletten',
      steps: [{ n: 'They are the size of thumbs and the colour of old plaster, and they have doors in their bellies. When you kneel, they do not look up. They look at each other, which is worse.' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 9, label: 'Ask them what they did before they came here.', build: { en: 'What did you (all) do before you came here?', answers: [['Hvad', 'lavede', 'I,', 'før', 'I', 'kom', 'hertil?']], tiles: ['Hvad', 'lavede', 'I,', 'før', 'I', 'kom', 'hertil?', 'laver', 'du'] },
          ok: [{ say: 'husfolk', da: 'Vi boede i den. Den var vores hus. Vi spiste i køkkenet, og vi sov på loftet.', en: 'We lived in it. It was our house. We ate in the kitchen, and we slept in the attic.' }, { n: 'They say it all at once, every one of them, like a house creaking.' }, { say: 'husfolk', da: 'Du lugter af køkken.', en: 'You smell of kitchen.' }, { glimpse: 'koekken' }, { fx: { flag: 'c_folk', resp: 1 } }, { special: 'cCheck' }],
          fail: [{ say: 'husfolk', da: 'Hvad? Vi boede i den. Det er alt.', en: 'What? We lived in it. That is all.' }, { fx: { flag: 'c_folk' } }, { special: 'cCheck' }], next: 'c_hub' },
        { kind: 'eng', label: '“Excuse me. Hello?”', ok: [{ n: 'They shut the doors in their bellies, one after another. Click, click, click.' }], next: 'c_hub' },
      ] },
    c_weaver: { bg: 'hall', npc: 'vaever', title: 'Vævehallen',
      steps: [{ say: 'vaever', da: 'Den Bagvendte? Jeg vævede gulvet i den. Det var et hus. Et godt hus.', en: 'The one turned away? I wove the floor in it. It was a house. A good house.' }, { fx: { flag: 'c_weaver' } }, { special: 'cCheck' }],
      opts: [{ kind: 'go', label: 'Back.', next: 'hal_hub' }] },
    c_tell: { bg: 'plain', npc: 'bagvendt', title: 'Støvsletten',
      steps: [{ th: 'You know enough. Two voices that agree are, in Hertil, almost a fact.' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 11, label: 'Tell it what it was.', build: { en: 'Before you came here, you were a house.', answers: [['Du', 'var', 'et', 'hus,', 'før', 'du', 'kom', 'hertil.']], best: [['Før', 'du', 'kom', 'hertil,', 'var', 'du', 'et', 'hus.']], tiles: ['Før', 'du', 'kom', 'hertil,', 'var', 'du', 'et', 'hus.', 'en'] },
          ok: [{ say: 'bagvendt', da: 'Et hus.', en: 'A house.' }, { n: 'Something goes through it, top to bottom, like a draught through rooms that have stood shut for a long time.' }, { fx: { flag: 'Ctold', resp: 1 } }],
          fail: [{ n: 'The words come out in an odd order. It hears them anyway, the way a house hears footsteps on the wrong floor.' }, { say: 'bagvendt', da: '… et hus?', en: '… a house?' }, { fx: { flag: 'Ctold' } }], next: 'c_choice' },
      ] },
    c_choice: { bg: 'plain', npc: 'bagvendt', title: 'Støvsletten',
      steps: [
        { say: 'bagvendt', da: 'Jeg var et hus. Der boede nogen i mig. Nu ved jeg det.', en: 'I was a house. Someone lived in me. Now I know.' },
        { say: 'bagvendt', da: 'Hvad skal jeg gøre med det?', en: 'What shall I do with it?' },
        { th: G => G.resp >= 5 ? 'You have the feeling that if you asked, it might turn around. For you.' : 'You have the feeling it might turn around for someone it had noticed. You are not that someone. Not yet.' },
      ],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 13, once: true, die: 'melt', label: 'Ask it to turn around.', req: G => G.resp >= 5, build: { en: 'Will you turn around?', answers: [['Vil', 'du', 'vende', 'dig', 'om?']], tiles: ['Vil', 'du', 'vende', 'dig', 'om?', 'mig', 'ikke'] },
          ok: [], fail: [{ say: 'bagvendt', da: 'Ikke endnu.', en: 'Not yet.' }, { th: 'Not yet. But the branches on its head moved, all of them, toward you. Then back.' }], next: 'c_look', failNext: 'c_choice' },
        { kind: 'say', stat: 'HANDEL', dc: 12, once: true, label: 'Ask to borrow its past.', build: { en: 'May I borrow your past?', answers: [['Må', 'jeg', 'låne', 'din', 'fortid?']], tiles: ['Må', 'jeg', 'låne', 'din', 'fortid?', 'dit', 'mig'] },
          ok: [], fail: [{ say: 'bagvendt', da: 'Nej. Den er min. Jeg har lige fået den.', en: 'No. It is mine. I have only just got it.' }], next: 'c_borrow', failNext: 'c_choice' },
        { kind: 'go', group: 'end', label: '“Go back to being it.”', next: 'c_gone' },
      ] },
    c_gone: { bg: 'plain', npc: 'bagvendt', title: 'Støvsletten',
      steps: [
        { n: 'It does not answer. It begins, very slowly, to fold. Branches into roof beams. Folds into walls. For a moment there is a house on the plain: small, dark-windowed, leaning a little, the kind of house that has been lived in hard.' },
        { npc: null },
        { n: 'Then the house is somewhere you are not, because it has gone back to where it was a house. The small ones run after it, the doors in their bellies flapping.' },
        { th: 'It never turned around. It did not need to. It went backwards.' },
        { fx: { boon: 'doer', flag: 'Cgone', resp: 1 } }, { fx: { flag: 'Cdone' } },
      ],
      opts: [{ kind: 'go', label: 'Leave the empty plain.', next: 'map' }] },
    c_borrow: { bg: 'plain', npc: 'bagvendt', title: 'Støvsletten',
      steps: [
        { n: 'It considers this for the time it takes dust to fall from one fold to the next. Then it gives you its past, the way a house gives up its warmth: all at once, through every gap.' },
        { n: 'You feel it go in. Rooms, stairs, a kitchen, the weight of many small sleepers. It is not your past. It fits anyway, like a coat that belonged to someone bigger.' },
        { say: 'bagvendt', da: 'Tag den. Jeg vender mig alligevel ikke om.', en: 'Take it. I am not turning around anyway.' },
        { fx: { boon: 'laant', flag: 'Cborrow' } }, { fx: { flag: 'Cdone' } },
      ],
      opts: [{ kind: 'go', label: 'Walk away with a house inside you.', next: 'map' }] },
    c_look: { bg: 'plain', npc: 'bagvendt', title: 'Støvsletten',
      steps: [
        { n: 'For a moment nothing happens. Then everything happens, very slowly.' },
        { special: 'turn' },
        { n: 'It turns. Branches scrape the amber sky. Dust slides off its shoulders in sheets. It takes as long as a season.' },
        { n: 'And then it is looking at you.' },
        { th: 'Nothing in Hertil has looked at you. You did not know how much a look weighs. It is heavier than a reason.' },
        { say: 'bagvendt', da: 'Der er du.', en: 'There you are.' },
        { n: 'It says nothing else. It does not need to. Somewhere inside it, a door opens that is exactly your size.' },
        { fx: { boon: 'blik', flag: 'Clook', resp: 3 } }, { fx: { flag: 'Cdone' } },
      ],
      opts: [{ kind: 'go', label: 'Stay a while. Then go.', next: 'map' }] },
    slette_after: { bg: 'plain', npc: G => G.flags.Cgone ? null : 'bagvendt', title: 'Støvsletten', hub: true, idle: true,
      steps: [{ n: G => G.flags.Cgone ? 'The plain is empty. Where it stood there is a rectangle of dust slightly paler than the rest: the shape a house leaves.' : G.flags.Clook ? 'It is still facing this way. When you come close, the branches on its head lean toward you, the way plants lean toward a window.' : 'It stands as it always stood, facing the towers. It does not have a past any more. You do. It seems lighter for it.' }],
      opts: [{ kind: 'go', label: 'Leave.', next: 'map' }] },

    /* ===== DAMMENE ===== */
    damme_hub: { bg: 'ponds', npc: 'spejl', title: 'Dammene', hub: true, quest: ['S3', 'S4'],
      steps: [{ special: 'dammeLine' }],
      opts: [
        { kind: 'act', special: 'boxes:dam', label: 'Sort the verbs into the ponds.', req: G => !G.flags.damDone },
        { kind: 'act', special: 'corr', label: 'Let Spejlet correct you.', req: G => !G.flags.corrDone },
        { kind: 'act', stat: 'INDSIGT', dc: 10, once: true, label: 'Look at your reflection in the soft pond.', ok: [{ glimpse: 'haender' }], fail: [{ n: 'Your reflection is busy. It does not look up.' }] },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },

    /* ===== MARKEDET (here only once) ===== */
    m_market: { bg: 'market', npc: 'sluget', title: 'Markedet', hub: true, card: ['Markedet', 'it was not here yesterday'],
      steps: [{ special: 'marketLine' }],
      opts: [
        { kind: 'act', special: 'market', once: true, label: 'Look at what Sluget sells. Listen to the prices.' },
        { kind: 'go', label: 'Sell it Ikket.', req: G => hasBoon('ikket') && !G.flags.Bsold, next: 'm_sell' },
        { kind: 'say', stat: 'SPROG', dc: 10, once: true, label: 'Tell Sluget why you came here.', build: { en: 'I came here because I would like to find my name.', answers: [['Jeg', 'kom', 'hertil,', 'fordi', 'jeg', 'gerne', 'ville', 'finde', 'mit', 'navn.']], tiles: ['Jeg', 'kom', 'hertil,', 'fordi', 'jeg', 'gerne', 'ville', 'finde', 'mit', 'navn.', 'min', 'ikke'] },
          ok: [{ say: 'sluget', da: 'Et navn! Dem sælger jeg ikke. Desværre.', en: 'A name! Those I do not sell. Unfortunately.' }, { n: 'It chews on that for a while, and then, very slightly, its stalk bends in your direction.' }, { fx: { resp: 1, sk: 2 } }],
          fail: [{ n: 'Sluget swallows the sentence anyway. It does not care about grammar. It cares about weight.' }] },
        { kind: 'go', label: 'Leave. (It will not be here again.)', next: 'm_leave' },
      ] },
    m_sell: { bg: 'market', npc: 'sluget', title: 'Markedet',
      steps: [
        { say: 'sluget', da: 'Et ikke! Et vildt ikke. Tolv skæl.', en: 'An ikke! A wild ikke. Twelve scales.' },
        { n: 'You open your mouth, and Ikket goes, without a backward glance, into the stalk. Sluget swallows. Somewhere down the stalk, something says "ikke", muffled.' },
        { th: 'Someone in Hertil will buy that ikke and put it in a sentence. It will mean something there. You will never know what.' },
        { special: 'loseIkket' }, { fx: { sk: 12, flag: 'Bsold' } },
      ],
      opts: [{ kind: 'go', label: 'Back to the stalls.', next: 'm_market' }] },
    m_leave: { bg: 'road', title: 'Markedet',
      steps: [{ n: 'At the edge of the dust you turn around. There is no market. There is not even the place where a market was.' }, { fx: { flag: 'marketGone' } }],
      opts: [{ kind: 'go', label: 'Walk on.', next: 'map' }] },

    /* ===== FINALE: registration ===== */
    f_register: { bg: 'stair', npc: 'taeller', title: 'Trappen', card: ['Trappen', 'registration'],
      steps: [
        { n: 'Tælleren opens its book at a fresh page. For the first time, it turns its long neck a little in your direction. Not its eyes. Its neck.' },
        { say: 'taeller', da: 'Nu. Hvad lavede du, før du kom hertil?', en: 'Now. What did you do before you came here?' },
      ],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 9, label: 'Tell it what you did.', build: jobBuild, ok: [{ say: 'taeller', da: 'Godt. Det skriver jeg.', en: 'Good. I write that.' }], fail: [{ say: 'taeller', da: 'Skævt. Men jeg skriver det.', en: 'Crooked. But I write it.' }], next: 'f_register2' },
      ] },
    f_register2: { bg: 'stair', npc: 'taeller', title: 'Trappen',
      steps: [{ say: 'taeller', da: 'Hvor boede du?', en: 'Where did you live?' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 9, label: 'Tell it where you lived.', build: placeBuild, ok: [{ say: 'taeller', da: 'Godt.', en: 'Good.' }], fail: [{ say: 'taeller', da: 'I, på. På, i. Det er det samme for mig.', en: 'In, on. On, in. It is all the same to me.' }], next: 'f_register3' },
      ] },
    f_register3: { bg: 'stair', npc: 'taeller', title: 'Trappen',
      steps: [{ say: 'taeller', da: 'Og i din fritid?', en: 'And in your free time?' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 9, label: 'Tell it what you did in your free time.', build: fritidBuild, ok: [{ say: 'taeller', da: 'Godt. Færdig.', en: 'Good. Done.' }], fail: [{ say: 'taeller', da: 'Verbet først, efter "i min fritid". Men jeg skriver det.', en: 'The verb first, after "i min fritid". But I write it.' }], next: 'f_end' },
      ] },
    f_end: { bg: 'stair', npc: 'taeller', title: 'Trappen',
      steps: [
        { n: 'It writes. Then it stops, and looks at the page for a long time, and then at an older page, further back.' },
        { say: 'taeller', da: 'Mærkeligt. Her står der noget andet. Fra før.', en: 'Strange. Here it says something else. From before.' },
        { th: 'It does not show you the older page. You see only that the handwriting on it is its own, and very old, and that there is a word there that is the same shape as the one Ikket whispered.' },
        { say: 'taeller', da: 'Det var ikke noget. Velkommen til Hertil.', en: 'It was nothing. Welcome to Hertil.' },
        { fx: { flag: 'Adone', resp: 1 } },
      ],
      opts: [{ kind: 'go', label: 'End the lesson.', next: 'end' }] },
  },
};
