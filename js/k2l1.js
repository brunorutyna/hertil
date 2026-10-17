/* =========================================================================
   HERTIL · Kapitel 2 · Lektion 1 — "Hvad er det nu, du laver?"   (Derhenne)
   Book 2.1: what you do and where (er / arbejder som / læser til, i or på + workplace),
   Hv… er det nu, …? (asking again), være i gang med / være ved at, at + infinitive after
   a preposition, kunne godt tænke sig at, mange / meget about work, present or infinitive.
   The grammar is the physics of Derhenne, a building that never finished being built:
   · what you say you do becomes true. Without a job you are too light and float to the ceiling.
   · whatever is "ved at" happen is stuck halfway, for years, until someone says it plainly.
   · a workplace without its i or på will not stay on its floor.
   · Arkivet has forgotten every job in the house; asked again properly ("Hvad er det nu …?"), creatures remember.
   Chapter thread (spoilers, never tell Bruno): the letter "Hvad laver du?" is an old reminder of an
   appointment the player once had at the top of Derhenne. Traces hint at it (a cup, a keycard, a note "Husk mødet").
   ========================================================================= */

const D2 = { phases: ['Morgenvagt', 'Dagvagt', 'Aftenvagt', 'Natskift'], light: ['#ffb511', '#ff3b30', '#00838a', '#14235a'],
  nightText: 'Natskift. Only the bunks and the canteen are open. Go to bed.', shutText: 'Natskift. That floor has gone home for the night.',
  bed: { bg: 'koeje', name: 'Køjerne', en: 'back to your bunk', texts: ['You climb into your bunk. The lift hums you to sleep.', 'You lie down. Far below, a stamp goes KA-CHUNK, and your marks settle.', 'The bunk creaks. Somebody on the floor above is typing in their sleep.'] },
  place: 'Derhenne', map: 'tower', mapScene: 'tarn', hub: { x: 50, y: 50 }, endBg: 'port', chap: 2, chapter: 'Kapitel 2 · Arbejde & uddannelse' };

const jobQ = [
  { flag: 'Aprog', label: 'Say you are a programmer in an IT company.', build: { en: 'I am a programmer in an IT company.', origin: 'work', answers: [['Jeg', 'er', 'programmør', 'i', 'et', 'it-firma.']], tiles: ['Jeg', 'er', 'programmør', 'i', 'et', 'it-firma.', 'en', 'på', 'som'] } },
  { flag: 'Atjener', label: 'Say you work as a waiter in a café.', build: { en: 'I work as a waiter in a café.', origin: 'work', answers: [['Jeg', 'arbejder', 'som', 'tjener', 'på', 'en', 'café.']], tiles: ['Jeg', 'arbejder', 'som', 'tjener', 'på', 'en', 'café.', 'i', 'en', 'er'] } },
  { flag: 'Astud', label: 'Say you are studying to be an architect at the university.', build: { en: 'I am studying to be an architect at the university.', origin: 'work', answers: [['Jeg', 'læser', 'til', 'arkitekt', 'på', 'universitetet.']], tiles: ['Jeg', 'læser', 'til', 'arkitekt', 'på', 'universitetet.', 'i', 'som', 'en'] } },
];
const busyQ = {
  Aprog: { en: 'Right now I am busy designing a computer game.', origin: 'busy', answers: [['Jeg', 'er', 'i', 'gang', 'med', 'at', 'designe', 'et', 'computerspil', 'lige', 'nu.']], best: [['Lige', 'nu', 'er', 'jeg', 'i', 'gang', 'med', 'at', 'designe', 'et', 'computerspil.']], tiles: ['Lige', 'nu', 'er', 'jeg', 'i', 'gang', 'med', 'at', 'designe', 'et', 'computerspil.', 'ved', 'designer'] },
  Atjener: { en: 'At the moment I am making a new menu.', origin: 'busy', answers: [['Jeg', 'er', 'ved', 'at', 'lave', 'en', 'ny', 'menu', 'lige', 'for', 'tiden.']], best: [['Lige', 'for', 'tiden', 'er', 'jeg', 'ved', 'at', 'lave', 'en', 'ny', 'menu.']], tiles: ['Lige', 'for', 'tiden', 'er', 'jeg', 'ved', 'at', 'lave', 'en', 'ny', 'menu.', 'med', 'laver'] },
  Astud: { en: 'Right now I am busy with an assignment about bridges.', origin: 'busy', answers: [['Jeg', 'er', 'i', 'gang', 'med', 'en', 'opgave', 'om', 'broer', 'lige', 'nu.']], best: [['Lige', 'nu', 'er', 'jeg', 'i', 'gang', 'med', 'en', 'opgave', 'om', 'broer.']], tiles: ['Lige', 'nu', 'er', 'jeg', 'i', 'gang', 'med', 'en', 'opgave', 'om', 'broer.', 'at', 'ved'] },
};
// "Hvad er det nu, …?" asked of three creatures who have forgotten their own jobs (contract C)
const askOpt = (flag, npcLine, build, label) => ({ kind: 'say', stat: 'SPROG', dc: 9, label, req: G => G.flags.Cmet && !G.flags[flag], build,
  ok: [{ say: npcLine[0], da: npcLine[1], en: npcLine[2] }, { n: 'A card flies out of it, up the lift shaft, toward the fourth floor and one of Arkivet’s drawers.' }, { fx: { flag, resp: 1 } }, { special: 'askCheck' }],
  fail: [{ n: 'It only catches “… det nu …”. That is enough. It remembers anyway, with a jolt.' }, { say: npcLine[0], da: npcLine[1], en: npcLine[2] }, { fx: { flag } }, { special: 'askCheck' }] });

SESSIONS.k2l1 = Object.assign({}, D2, {
  id: 'k2l1', order: 4, short: 'K2 · Lektion 1', prevSession: 'k1l3', nextSession: 'k2l2', title: 'Lektion 1 · Hvad er det nu, du laver?', en: 'What is it you do again?',
  blurb: 'The letter came from Derhenne. Everyone there is busy. Nobody remembers what anybody does.',
  start: 'p4_post', home: 'koeje', travelAfter: 'p4seen', cluesFlag: 'clues4', cluesNeed: 3, dcMod: 2,
  startState: { resp: 0, sk: 8, insp: 1, boons: ['anker'], statXP: { SPROG: 14, LOEGN: 4, SNIGE: 6, HANDEL: 4, INDSIGT: 11 },
    origin: { reason: 'Jeg kom hertil på grund af en lyd.', stay: 'Jeg skal være her i et år.', addr: 'Jeg bor i Fjergade, i nærheden af kirken.' }, met: [] },

  locations: {
    taget:     { name: 'Taget', en: 'where Kranen builds', x: 74, y: 9, bg: 'tag', icon: 'kran', entry: G => !G.flags.Akran ? 'a4_kran' : 'tag_hub' },
    kontoret:  { name: 'Kontoret', en: '4. sal · Arkivet forgets', x: 26, y: 23, bg: 'kontor', icon: 'skuffe', entry: G => !G.flags.Cmet ? 'c4_start' : 'kontor_hub' },
    halve:     { name: 'Den halve sal', en: '3. sal · ved at …', x: 74, y: 37, bg: 'halv', icon: 'mursten', entry: G => !G.flags.Bstart ? 'b4_start' : 'halv_hub' },
    kopi:      { name: 'Kopirummet', en: 'here only once', x: 26, y: 37, bg: 'kopi', icon: 'kopi', eph: true, req: G => G.flags.Akran && !G.flags.kopiGone, entry: G => 'kopi4' },
    tegnestue: { name: 'Tegnestuen', en: '2. sal · Blyanten draws', x: 26, y: 51, bg: 'tegnestue', icon: 'linjal', entry: G => 'tegne_hub' },
    koeje:     { name: 'Køjerne', en: '1. sal · your bunk', x: 74, y: 65, bg: 'koeje', icon: 'seng', night: true, entry: G => 'koeje_hub' },
    porten:    { name: 'Porten', en: 'stuen · Stemplet stamps', x: 26, y: 79, bg: 'port', icon: 'stempel', entry: G => 'port_hub' },
    kantinen:  { name: 'Kantinen', en: 'kælderen · always open', x: 74, y: 92, bg: 'kantine', icon: 'kantine', night: true, entry: G => 'kant_hub' },
  },

  ending: G => [G.flags.Aprog ? 'Programmør' : G.flags.Atjener ? 'Tjener' : G.flags.Astud ? 'Studerende' : null,
    G.flags.Bwhole ? 'Færdig' : G.flags.Bgoing ? 'I gang' : G.flags.Bwish ? 'Haven' : null,
    G.flags.Cremember ? 'Arkivet husker' : G.flags.Cnew ? 'Noget nyt' : null].filter(Boolean).join(' · ') || '—',
  carryFlags: ['Aprog', 'Atjener', 'Astud', 'Bwhole', 'Bgoing', 'Bwish', 'Cremember', 'Cnew'],
  next: 'Lektion 2 · Hvordan går det med dit studie? The second floor has turned into a school overnight, and names will not stick to anyone there.',

  quests: {
    A: { title: 'Hvad laver du?', en: 'What do you do?', obj: [['Help Kranen put the workplaces on the right floors (Taget)', 'ipaaDone'], ['Say what you do, and where', 'Adone']] },
    B: { title: 'Halvfærdigt', en: 'Half-finished', obj: [['Free what is stuck halfway on the third floor', 'gangDone'], ['Answer Halvdelen', 'Bdone']] },
    C: { title: 'Glemsel', en: 'Forgetting', obj: [['Fill Arkivet’s drawers with jobs (Kontoret)', 'job2Done'], ['Ask three creatures what they do, again (Kantinen, Tegnestuen, Porten)', 'askedAll'], ['Tell Arkivet what it does', 'Cdone']] },
    F: { title: 'Jobprofil', en: 'Your job profile', obj: [['Have your job profile stamped at Porten', 'Fdone']] },
    S1: { title: 'Etagerne', en: 'The floors', side: true, obj: [['Find the workplaces on the board at Porten', 'huntDone4']] },
    S2: { title: 'Kantinens suppe', en: 'The canteen soup', side: true, obj: [['Fish the right verb forms out of the soup', 'verbDone']] },
    S3: { title: 'Blyantens travlhed', en: 'Blyanten is busy', side: true, obj: [['Help Blyanten count its work: mange or meget', 'mmjobDone']] },
    S4: { title: 'Spor', en: 'Traces', side: true, obj: [['Find three traces of what you were', 'clues4']] },
  },

  glimpses: {
    kop: { name: 'En kop med en ring', en: 'A cup with a ring', text: 'Among a hundred identical cups, one has a brown ring inside. Your hand already knows its handle. Somebody used to carry this cup to meetings, and leave it there.' },
    kort: { name: 'Adgangskortet', en: 'The keycard', text: 'Under your bunk: a keycard with no name and no photo. The lift has a slot for it, next to a button for a floor that is not on the board. The card is warm.' },
    skrift: { name: 'Din håndskrift', en: 'Your handwriting', text: 'In one of Arkivet’s drawers, a note in handwriting you know better than your own face. Two words: “Husk mødet.” Remember the meeting.' },
    kopi: { name: 'Kopien', en: 'The copy', text: 'The copier gives you a copy of yourself, a little off register, like everything here. The copy is wearing a lanyard. You have never worn a lanyard. Your neck says otherwise.' },
    udsigt: { name: 'Udsigten', en: 'The view', text: 'From the roof, Hertil is a handful of confetti far below. You know which speck is your nest. You also know, somehow, which window up here was yours.' },
  },

  hunts: {
    port: { title: 'Etagerne', en: 'Find the workplaces on the board',
      find: ['itfirma', 'hospital', 'universitet', 'avis', 'boernehave', 'teater'], decoys: ['hotel', 'bank', 'skole', 'tegnestue', 'kontor', 'kantine'] },
  },

  jobs: {
    arkiv: { title: 'Arkivets skuffer', h2: 'Gæt jobbet', ask: 'Hvad er det for et job?', flag: 'job2Done', pay: 2,
      keys: ['programmoer', 'konsulent', 'tjener', 'paedagog', 'tandlaege', 'fotograf', 'grafiker', 'underviser', 'sekretaer', 'skuespiller', 'studerende', 'kranfoerer'],
      end: r => r >= 5 ? 'Six drawers rattle shut, full. Arkivet stops pulling at itself and reads its own labels, moving its lips.' : 'Some cards go into the wrong drawers. The dentist is now filed under theatre. Nobody will notice for years.' },
  },

  boxes: {
    ipaa: { title: 'Kranens etager', q: 'i eller på?', boxes: ['i', 'på'],
      good: 'Every floor drops into place with a clunk and stays there. Kranen hums a long, happy note through its cables.', meh: 'Most floors stay put. One keeps sliding a little to the left, sulking.',
      items: [
        { t: 'Programmøren arbejder ___ et it-firma.', a: 0, why: 'A firm or company: i et firma.' },
        { t: 'Tjeneren arbejder ___ en café.', a: 1, why: 'Cafés, hotels and theatres take på.' },
        { t: 'Arkivet har arbejdet ___ et kontor i hundrede år.', a: 1, why: 'på et kontor.' },
        { t: 'Pædagogen arbejder ___ en børnehave.', a: 0, why: 'i en børnehave.' },
        { t: 'Blyanten tegner ___ en tegnestue.', a: 1, why: 'på en tegnestue.' },
        { t: 'Kantinen har engang været kok ___ et hotel.', a: 1, why: 'på et hotel.' },
        { t: 'Konsulenten sidder ___ en bank.', a: 0, why: 'i en bank.' },
        { t: 'Jeg læser ___ universitetet.', a: 1, why: 'på universitetet. Schools and universities take på.' },
      ] },
    gang: { title: 'Den halve sal', q: 'Hvad mangler?', boxes: ['a', 'b'],
      good: 'Everything that was stuck halfway simply happens. The floor sighs, like a room after a long meeting.', meh: 'Most things get moving. A lamp is still about to switch on. It will get there.',
      items: [
        { t: 'Skrivebordet er ved ___ falde.', opts: ['at', 'med'], a: 0, why: 'være ved at + infinitive: ved at falde.' },
        { t: 'Kaffen er ___ blive kold. Det har den været i ti år.', opts: ['ved at', 'i gang med'], a: 0, why: 'A verb follows (blive): ved at blive.' },
        { t: 'Muren er i gang ___ et stort projekt.', opts: ['med', 'ved'], a: 0, why: 'i gang MED + a noun: i gang med et projekt.' },
        { t: 'Lampen er i gang med ___ tænde.', opts: ['at', 'om'], a: 0, why: 'After a preposition (med), a verb takes at: i gang med at tænde.' },
        { t: 'Stigen er ___ en ny etage.', opts: ['i gang med', 'ved at'], a: 0, why: 'A noun follows (en ny etage): i gang med.' },
        { t: 'Uret er ___ gå i stå.', opts: ['ved at', 'i gang med'], a: 0, why: 'A verb follows (gå): ved at gå i stå.' },
        { t: 'Vinduet er i gang med at ___ sig.', opts: ['åbne', 'åbner'], a: 0, why: 'After at: the infinitive, without -r.' },
        { t: 'Taget er ___ blæse væk.', opts: ['ved at', 'i gang med'], a: 0, why: 'ved at + infinitive: ved at blæse væk.' },
      ] },
    verb: { title: 'Kantinens suppe', q: 'Hvilken form?', boxes: ['a', 'b', 'c'],
      good: 'Every verb comes out of the soup in the right shape. Kantinen ladles them into bowls, very pleased.', meh: 'A few verbs are still floating in the soup. Kantinen will serve them anyway. Nobody complains.',
      items: [
        { t: 'Mit arbejde ___ ret spændende.', opts: ['er', 'være', 'at være'], a: 0, why: 'The main verb takes the present tense: er.' },
        { t: 'Jeg kunne godt tænke mig at ___ noget nyt.', opts: ['prøve', 'prøver', 'at prøve'], a: 0, why: 'After tænke mig at: the infinitive. The at is already there.' },
        { t: 'Kantinen ___ suppe hver dag.', opts: ['laver', 'lave', 'at lave'], a: 0, why: 'The main verb, now: laver.' },
        { t: 'Stemplet har alt for meget ___.', opts: ['at lave', 'lave', 'laver'], a: 0, why: 'have meget at lave: at + infinitive after have.' },
        { t: 'Kranen skal ___ en ny etage.', opts: ['bygge', 'bygger', 'at bygge'], a: 0, why: 'After skal: the infinitive without at.' },
        { t: 'Arkivet er ved ___ alting.', opts: ['at glemme', 'glemme', 'glemmer'], a: 0, why: 'ved at + infinitive: ved at glemme.' },
        { t: 'Blyanten ___ på en tegnestue.', opts: ['tegner', 'tegne', 'at tegne'], a: 0, why: 'The main verb, now: tegner.' },
        { t: 'Vil du ___ en kop kaffe?', opts: ['have', 'har', 'at have'], a: 0, why: 'After vil: the infinitive without at.' },
      ] },
    mmjob: { title: 'Blyantens travlhed', q: 'mange eller meget?', boxes: ['mange', 'meget'],
      good: 'Blyanten counts its work correctly for the first time. It is exactly as much as it thought. It feels better anyway.', meh: 'Blyanten gives up counting halfway and draws a picture of the pile instead.',
      items: [
        { t: 'Blyanten har alt for ___ opgaver.', a: 0, why: 'Opgaver can be counted: mange.' },
        { t: 'Den har alt for ___ arbejde.', a: 1, why: 'Arbejde is not counted: meget.' },
        { t: 'Den har lidt for ___ møder.', a: 0, why: 'One møde, two møder: mange.' },
        { t: 'Den har alt for ___ at lave.', a: 1, why: 'meget + at + verb: meget at lave.' },
        { t: 'Der er for ___ rutinearbejde.', a: 1, why: 'Rutinearbejde is uncountable: meget.' },
        { t: 'Den har ikke så ___ kolleger på tegnestuen.', a: 0, why: 'Kolleger can be counted: mange.' },
        { t: 'Den har ___ travlt i dag.', a: 1, why: 'meget travlt: very busy.' },
        { t: 'Den har for ___ eksaminer i juni.', a: 0, why: 'Eksaminer can be counted: mange.' },
      ] },
  },

  travel: [
    { id: 'lift4', bg: 'gang', npc: 'elevator', steps: [{ n: 'The lift stops between two floors and taps its own dial, as if the floors had moved and not it.' }, { say: 'elevator', da: 'Hvilken etage skal du til?', en: 'Which floor are you going to?' }],
      opts: [{ kind: 'reply', group: 'e', da: 'Første sal, tak.', ok: [{ n: 'It goes to the fifth. There is no fifth. You ride back down together without a word.' }], next: 'map' },
        { kind: 'reply', group: 'e', da: 'Kælderen, tak.', ok: [{ n: 'It drops like a stone and stops one millimetre above the canteen floor. It is very proud of that millimetre.' }, { fx: { resp: 1 } }], next: 'map' }] },
    { id: 'memo', bg: 'gang', steps: [{ n: 'A memo flaps down the corridor like a pigeon, shouting “Møde klokken ti!” at every door. Nobody opens one.' }],
      opts: [{ kind: 'act', stat: 'SNIGE', dc: 9, label: 'Catch it.', ok: [{ n: 'You catch it. On the back somebody has drawn an empty chair and written CHEFEN under it, then crossed it out, then written it again.' }, { fx: { insp: 1 } }], fail: [{ n: 'It slips through the gap under a door marked PRIVAT and goes on shouting in there.' }], next: 'map' }, { kind: 'go', label: 'Let it fly.', next: 'map' }] },
    { id: 'kop4', bg: 'gang', steps: [{ n: 'A cup of coffee walks past on small feet, looking into every office. It is looking for somebody.' }],
      opts: [{ kind: 'reply', group: 'k', da: 'Hvem leder du efter?', ok: [{ n: 'It looks up at you for a long, hot second. Then it shrugs its handle and walks on. Wrong person. Or not yet.' }], next: 'map' }, { kind: 'go', group: 'k', label: 'Step aside.', next: 'map' }] },
    { id: 'post4', bg: 'gang', req: G => G.prev.Bband || G.prev.Bquiet || G.prev.Bjar, steps: [{ n: G => G.prev.Bband ? 'The pneumatic pipe in the wall coughs up a postcard from Hertil. On the front: Larmen and its band. On the back: a single drum roll, drawn in pencil.' : 'The pneumatic pipe in the wall coughs up a postcard from Hertil. It is blank. It is the quietest thing you have ever held.' }],
      opts: [{ kind: 'go', label: 'Pocket it. Walk on.', fx: { resp: 1 }, next: 'map' }] },
    { id: 'ikket4', bg: 'gang', req: G => hasBoon('ikket'), steps: [{ n: 'Ikket wriggles in your mouth. Everybody in Derhenne says “ikke nu” all day long, and it is getting very fat.' }],
      opts: [{ kind: 'go', label: 'Keep your mouth shut. Walk on.', next: 'map' }] },
    { id: 'tal4', bg: 'gang', req: G => !hasBoon('urnoegle'), steps: [{ n: 'The floor numbers on the lift buttons come loose and swap places. Floor 3 is now floor ᚦ.' }, { special: 'glyphs' }], opts: [{ kind: 'go', label: 'Press a button anyway.', next: 'map' }] },
  ],

  special: {
    async arrive() {
      logAdd(`<p>${esc(G.newPlace ? 'Nobody here has heard of you. Your weight did not fit through the pipe; you will have to earn it again.' : 'Nobody here has heard of you. That is what Derhenne is like: everybody is new, every morning.')}</p>`, 'thought'); await tapOn();
    },
    async portLine() {
      const f = G.flags;
      logAdd(`<p>${esc(f.Fdone ? 'Stemplet is stamping the post. Your profile is pinned on the board, a little crooked, between a dentist and a crane.' : f.Adone && f.Bdone && f.Cdone ? 'Stemplet has a fresh card out: JOBPROFIL. It is inking itself, slowly, looking at nothing in particular.' : pick(['Rørpost pops out of the pipes every few seconds. Stemplet stamps every single item, including a pigeon.', 'Stemplet stamps a letter, a parcel, a sandwich and, by accident, itself.']))}</p>`, 'narr');
    },
    async tagLine() { logAdd(`<p>${esc(G.flags.Adone ? 'Kranen swings another floor into place. It does not ask the floor what it is. The floor tells it.' : 'Kranen swings floors around in the wind, waiting for somebody to say what they are.')}</p>`, 'narr'); },
    async halvLine() { logAdd(`<p>${esc(G.flags.Bwhole ? 'The third floor is a whole wall now. It keeps touching its own roof, as if to check it is still there.' : G.flags.Bgoing ? 'Halvdelen is building itself, very slowly and very proudly. A brick goes up. A brick comes down. That is work.' : G.flags.Bwish ? 'The third floor is a garden. A bee that is also partly a brick bumbles past.' : G.flags.gangDone ? 'Everything on the floor has finished happening. Only Halvdelen is still in the middle of itself.' : 'A desk is falling. A cup is going cold. A lamp is about to switch on. Nothing gets there.')}</p>`, 'narr'); },
    async kontorLine() { logAdd(`<p>${esc(G.flags.Cremember ? 'Arkivet reads its own drawers aloud, all day long, very fast. Everybody on the fourth floor knows everything now. It is exhausting.' : G.flags.Cnew ? 'Where Arkivet used to stand there is a clean rectangle on the floor and a few cards nobody has picked up.' : G.flags.job2Done ? 'Arkivet’s drawers are full of jobs. It still cannot remember who does which.' : 'Arkivet pulls out a drawer, looks in, finds nothing, slams it, pulls out the next.')}</p>`, 'narr'); },
    async kantLine() { logAdd(`<p>${esc(G.phase >= 3 ? 'Natskift. The canteen is lit and empty except for the pot, which is singing to the soup.' : G.flags.verbDone ? 'The soup is clear today. Every verb in it is the right shape.' : 'Words float in the soup. Some of them are verbs in the wrong form, bumping into each other.')}</p>`, 'narr'); },
    async tegneLine() { logAdd(`<p>${esc(G.flags.mmjobDone ? 'Blyanten draws a floor plan of a floor that does not exist yet. It looks less tired than before.' : 'Blyanten is drawing five floors at once and sharpening itself between them. It is getting shorter.')}</p>`, 'narr'); },
    async koejeLine() {
      const f = G.flags;
      logAdd(`<p>${esc(f.Adone && f.Bdone && f.Cdone && !f.Fdone ? 'A card is pinned to your bunk: STEMPLET VENTER. PORTEN.' : f.Adone ? pick(['Your bunk has your job written on a strip of tape at the foot. It is a little crooked.', 'You lie in your bunk and weigh something. It feels new.']) : 'Your bunk has a strap across it. Until you have a job, you float up against it every time you lie down.')}</p>`, 'narr');
    },
    async askCheck() { const f = G.flags; if (f.askK && f.askB && f.askS && !f.askedAll) { f.askedAll = true; toast('Three cards in Arkivet’s drawers', 'good'); } },
    async profileEcho() {
      const o = G.origin, lines = [o.work, o.busy, o.wish].filter(Boolean);
      if (!lines.length) return;
      logAdd(`<p>Stemplet reads your profile back before it stamps it.</p>`, 'narr');
      for (const l of lines) { youSaid(l); TTS.say(l); await sleep(FAST ? 0 : 900); }
      await tapOn();
    },
    async glyphs() { G.glyph = 3; AUDIO.sting('glyph'); toast('ᚦᚨᛚ · the numbers have gone strange', 'gold'); },
  },

  nodes: {
    /* ===== PROLOGUE: arriving by rørpost ===== */
    p4_post: { bg: 'port', title: 'Porten', card: ['Kapitel 2 · Arbejde & uddannelse', 'Lektion 1 — Hvad er det nu, du laver?'],
      steps: [
        { n: 'The letter from Derhenne had a return address and nothing else. You folded yourself into the envelope, out of curiosity.' },
        { n: 'Now a pipe spits you out onto a counter with a pop. Rørpost. Everything that arrives in Derhenne arrives like this.' },
        { npc: 'stempel' },
        { say: 'stempel', da: 'Velkommen til Derhenne. Hvad laver du?', en: 'Welcome to Derhenne. What do you do?' },
        { th: 'It is asking the counter. It stamps the envelope you came in: KA-CHUNK.' },
        { th: 'In Hertil you were a reason, a stay, an address. Here they want a job, and you do not have one.' },
        { n: 'Without one you are too light. Your feet leave the counter. You float up past the directory board toward the ceiling.' },
      ],
      opts: [{ kind: 'go', label: 'Float.', next: 'p4_lift' }] },
    p4_lift: { bg: 'gang', npc: 'elevator', title: 'Elevatoren',
      steps: [
        { n: 'The lift catches you in its folding gate like a fish. Its floor dial swings about, busy with some other floor.' },
        { say: 'elevator', da: 'Intet job? Så flyder man. Det gør alle her i starten.', en: 'No job? Then you float. Everybody does here at the start.' },
        { say: 'elevator', da: 'Du kan sove på første sal, indtil du ved, hvad du laver.', en: 'You can sleep on the first floor until you know what you do.' },
        { say: 'elevator', da: 'Spørg Kranen på taget. Den bygger det hele.', en: 'Ask Kranen on the roof. It builds the whole thing.' },
        { special: 'arrive' },
        { th: 'Somewhere above, something is being built. Somewhere below, something is boiling. On the third floor, something has been falling for a very long time.' },
        { fx: { quest: ['A', 'B', 'C', 'F', 'S4'], flag: 'p4seen' } },
      ],
      opts: [{ kind: 'reply', group: 'l', da: 'Tak!', ok: [{ say: 'elevator', da: 'Hvilken etage?', en: 'Which floor?' }, { th: 'It does not wait for an answer.' }], next: 'map' }, { kind: 'go', group: 'l', label: 'Get out on the first floor.', next: 'map' }] },

    /* ===== KØJERNE: your bunk ===== */
    koeje_hub: { bg: 'koeje', title: 'Køjerne', hub: true, idle: true, home: true,
      steps: [{ special: 'koejeLine' }],
      opts: [
        { kind: 'go', label: 'Look under the bunk.', req: G => !G.glimpses.includes('kort'), next: 'koeje_kort' },
        { kind: 'go', special: 'selfPlate', label: 'Look at yourself.' },
        { kind: 'go', label: 'Sleep. Let the marks settle.', next: 'sleep' },
        { kind: 'go', label: 'Go out.', next: 'map' },
      ] },
    koeje_kort: { bg: 'koeje', title: 'Køjerne',
      steps: [{ n: 'Dust, a sock, a pencil stub that is not Blyanten. And at the back, against the wall, a keycard.' }, { glimpse: 'kort' }],
      opts: [{ kind: 'go', label: 'Keep it.', next: 'koeje_hub' }] },

    /* ===== TAGET: contract A ===== */
    a4_kran: { bg: 'tag', npc: 'kran', title: 'Taget', card: ['Taget', 'where Kranen builds'],
      steps: [
        { n: 'The roof. Derhenne goes on up into the sky as steel beams with nothing between them. Kranen swings a whole floor through the air, misses, swings again.' },
        { say: 'kran', da: 'Jeg er i gang med en ny etage. Den skal være et it-firma. Eller en café. Eller et universitet.', en: 'I am busy with a new floor. It is supposed to be an IT company. Or a café. Or a university.' },
        { say: 'kran', da: 'Men etagerne vil ikke blive liggende. De vil vide, om de er i eller på.', en: 'But the floors will not stay put. They want to know whether they are i or på.' },
        { th: 'Above you, a café, a hospital and a newspaper drift about on their cables, waiting for their prepositions.' },
        { fx: { flag: 'Akran', quest: ['S1'] } },
      ],
      opts: [{ kind: 'act', special: 'boxes:ipaa', label: 'Give each workplace its i or på.', next: 'a4_landed' }] },
    a4_landed: { bg: 'tag', npc: 'kran', title: 'Taget',
      steps: [
        { n: G => (G.flags.ipaaScore || 0) >= 6 ? 'The floors drop into place one after another, with a sound like drawers shutting. i, på, på, i. Kranen hums through all its cables.' : 'Most floors drop into place. One hangs on, swinging, until Kranen shakes it loose with a sigh.' },
        { say: 'kran', da: 'Godt. Nu har vi et it-firma, en café og et universitet. Og dig? Hvad laver du?', en: 'Good. Now we have an IT company, a café and a university. And you? What do you do?' },
        { say: 'kran', da: 'Pas på. Det, du siger, bliver sandt. Det gør det altid her.', en: 'Careful. What you say becomes true. It always does here.' },
        { fx: { flag: 'ipaaDone', resp: 1 } },
      ],
      opts: jobQ.map(q => ({ kind: 'say', stat: 'SPROG', dc: 10, group: 'job', label: q.label, build: q.build,
        ok: [{ n: 'Your feet touch the roof. You weigh something.' }], fail: [{ n: 'The wind takes half your sentence. Kranen hears the other half, which is the important half.' }], next: { Aprog: 'a4_prog', Atjener: 'a4_tjener', Astud: 'a4_stud' }[q.flag] })) },
    a4_prog: { bg: 'kontor', title: 'Et it-firma',
      steps: [{ n: 'A door opens in the new floor. Inside, screens blink at each other in code. One of them has a space for your name and a chair that fits.' }, { th: 'You are a programmer now. Your fingers find that they know where the semicolon is.' }, { fx: { boon: 'kode', flag: 'Aprog', resp: 2 } }, { fx: { flag: 'Adone' } }],
      opts: [{ kind: 'go', label: 'Take the lift back down.', next: 'map' }] },
    a4_tjener: { bg: 'kantine', title: 'En café',
      steps: [{ n: 'A café clicks into place under the roof. A tray slides into your hand and stays there, perfectly level, as if it had been waiting for you.' }, { th: 'You are a waiter now. You already know who wants milk.' }, { fx: { boon: 'bakke', flag: 'Atjener', resp: 2 } }, { fx: { flag: 'Adone' } }],
      opts: [{ kind: 'go', label: 'Balance your way back down.', next: 'map' }] },
    a4_stud: { bg: 'tegnestue', title: 'Universitetet',
      steps: [{ n: 'The university floor unfolds like a book. A student cap lands on your head from somewhere above and settles in.' }, { th: 'You are studying to be an architect now. You feel an urge to draw a bridge on everything.' }, { fx: { boon: 'hue', flag: 'Astud', resp: 2 } }, { fx: { flag: 'Adone' } }],
      opts: [{ kind: 'go', label: 'Go back down.', next: 'map' }] },
    tag_hub: { bg: 'tag', npc: 'kran', title: 'Taget', hub: true,
      steps: [{ special: 'tagLine' }],
      opts: [
        { kind: 'go', label: 'Look over the edge.', req: G => !G.glimpses.includes('udsigt'), next: 'tag_view' },
        { kind: 'reply', once: true, da: 'Hvad laver du så for tiden?', ok: [{ say: 'kran', da: 'Lige nu er jeg ved at bygge en etage helt øverst. Ingen ved, hvad den skal være.', en: 'Right now I am building a floor at the very top. Nobody knows what it is for.' }] },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    tag_view: { bg: 'tag', title: 'Taget',
      steps: [{ n: 'You lean over the edge, holding on to a beam.' }, { glimpse: 'udsigt' }],
      opts: [{ kind: 'go', label: 'Step back.', next: 'tag_hub' }] },

    /* ===== DEN HALVE SAL: contract B ===== */
    b4_start: { bg: 'halv', npc: 'halv', title: 'Den halve sal', card: ['Den halve sal', '3. sal · ved at …'],
      steps: [
        { n: 'The third floor is only half there. On the left, a brick wall. On the right, scaffolding and air.' },
        { n: 'Everything here is caught in the middle of something. A desk is falling, and has been for ten years. A cup of coffee is going cold. It will never quite get there.' },
        { say: 'halv', da: 'Jeg er ved at blive færdig.', en: 'I am about to be finished.' },
        { th: 'It says it to the scaffolding, the way you say something you have said every morning for ten years.' },
        { fx: { flag: 'Bstart' } },
      ],
      opts: [{ kind: 'go', label: 'Look around.', next: 'halv_hub' }] },
    halv_hub: { bg: 'halv', npc: G => G.flags.Bwhole ? 'helt' : G.flags.Bwish ? 'have' : 'halv', title: 'Den halve sal', hub: true,
      steps: [{ special: 'halvLine' }],
      opts: [
        { kind: 'act', special: 'boxes:gang', label: 'Free what is stuck halfway.', req: G => !G.flags.gangDone, next: 'b4_freed', mark: true },
        { kind: 'go', label: 'Talk to Halvdelen.', req: G => G.flags.gangDone && !G.flags.Bdone, next: 'b4_talk', mark: true },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    b4_freed: { bg: 'halv', npc: 'halv', title: 'Den halve sal',
      steps: [
        { n: G => (G.flags.gangScore || 0) >= 6 ? 'The desk lands at last. KLONK. The coffee goes cold all at once and sighs. The lamp switches on and looks embarrassed about the delay.' : 'Things start happening, slowly, in the wrong order. The desk lands. The lamp is still thinking about it.' },
        { say: 'halv', da: 'Hvad? Er alt det andet færdigt? Og jeg er stadig ved at …', en: 'What? Is everything else finished? And I am still about to …' },
        { fx: { flag: 'gangDone', resp: 1 } },
      ],
      opts: [{ kind: 'go', label: 'Back.', next: 'halv_hub' }] },
    b4_talk: { bg: 'halv', npc: 'halv', title: 'Den halve sal',
      steps: [{ n: 'Halvdelen looks down at its own scaffolding. Its window frame flickers, one pane lit, then two.' }, { say: 'halv', da: 'Hvad er jeg egentlig i gang med?', en: 'What am I actually busy with?' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'end', label: 'Tell it it is finished now.', build: { en: 'Now you are finished.', answers: [['Du', 'er', 'færdig', 'nu.']], best: [['Nu', 'er', 'du', 'færdig.']], tiles: ['Nu', 'er', 'du', 'færdig.', 'ved', 'at', 'bliver'] },
          ok: [{ n: 'The word lands like the last brick.' }], fail: [{ n: 'A bit of scaffolding clangs halfway through your sentence. Halvdelen hears “færdig” and decides that was the point.' }], next: 'b4_whole' },
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'end', label: 'Tell it it is busy with something big.', build: { en: 'You are busy with something big.', answers: [['Du', 'er', 'i', 'gang', 'med', 'noget', 'stort.']], tiles: ['Du', 'er', 'i', 'gang', 'med', 'noget', 'stort.', 'ved', 'at'] },
          ok: [{ n: 'Halvdelen straightens its scaffolding.' }], fail: [{ n: 'Halvdelen catches “i gang”, and that is all it ever wanted to hear.' }], next: 'b4_going' },
        { kind: 'say', stat: 'SPROG', dc: 11, group: 'end', label: 'Ask what it would really like to do.', build: { en: 'What would you like to do?', answers: [['Hvad', 'kunne', 'du', 'godt', 'tænke', 'dig', 'at', 'lave?']], tiles: ['Hvad', 'kunne', 'du', 'godt', 'tænke', 'dig', 'at', 'lave?', 'mig', 'laver'] },
          ok: [{ n: 'Nobody has ever asked it that. The window frame lights up, all four panes.' }], fail: [{ n: 'A brick falls between you mid-question. Halvdelen answers anyway. It had the answer ready for years.' }], next: 'b4_wish' },
      ] },
    b4_whole: { bg: 'halv', npc: 'helt', title: 'Den halve sal',
      steps: [{ n: 'The scaffolding folds itself up like an umbrella. Bricks fly in from everywhere and find their places. Halvdelen is a whole wall, with a roof on.' }, { th: 'It looks surprised to be finished. Then pleased. Then, quite quickly, bored.' }, { fx: { boon: 'tag', flag: 'Bwhole', resp: 2 } }, { fx: { flag: 'Bdone' } }],
      opts: [{ kind: 'go', label: 'Knock on it, gently. Leave.', next: 'map' }] },
    b4_going: { bg: 'halv', npc: 'halv', title: 'Den halve sal',
      steps: [{ n: 'Halvdelen is not unfinished. It is busy. That is completely different. It lays a brick with great ceremony.' }, { th: 'A piece of scaffolding detaches itself and follows you to the lift, like a dog.' }, { fx: { boon: 'stillads', flag: 'Bgoing', resp: 1 } }, { fx: { flag: 'Bdone' } }],
      opts: [{ kind: 'go', label: 'Leave it to its work.', next: 'map' }] },
    b4_wish: { bg: 'halv', npc: 'have', title: 'Den halve sal',
      steps: [{ say: 'halv', da: 'Jeg kunne godt tænke mig at være … en have.', en: 'I would like to be … a garden.' }, { n: 'It says it, and the wish hatches. Out of the scaffolding grow stalks, then flowers, then a bee that is also slightly a brick.' }, { th: 'A seed falls into your pocket. It is warm.' }, { fx: { boon: 'froe', flag: 'Bwish', resp: 2 } }, { fx: { flag: 'Bdone' } }],
      opts: [{ kind: 'go', label: 'Smell the garden. Leave.', next: 'map' }] },

    /* ===== KONTORET: contract C ===== */
    c4_start: { bg: 'kontor', npc: 'arkiv', title: 'Kontoret', card: ['Kontoret', '4. sal · Arkivet forgets'],
      steps: [
        { n: 'The fourth floor. Desks, papers, a lamp swinging over nobody.' },
        { n: 'A filing cabinet on bird legs is pulling out its own drawers, one after another. They are all empty.' },
        { say: 'arkiv', da: 'Hvad er det nu, du laver?', en: 'What is it you do again?' },
        { th: 'It is asking the lamp.' },
        { say: 'arkiv', da: 'Alle mine skuffer er tomme. Nu kan ingen i Derhenne huske, hvad de andre laver. Heller ikke, hvad de selv laver.', en: 'All my drawers are empty. Now nobody in Derhenne can remember what the others do. Or what they do themselves.' },
        { fx: { flag: 'Cmet' } },
      ],
      opts: [{ kind: 'go', label: 'Help it.', next: 'kontor_hub' }] },
    kontor_hub: { bg: 'kontor', npc: G => G.flags.Cnew ? null : 'arkiv', title: 'Kontoret', hub: true,
      steps: [{ special: 'kontorLine' }],
      opts: [
        { kind: 'act', special: 'jobs:arkiv', label: 'Fill its drawers: guess the jobs.', req: G => !G.flags.job2Done, mark: true },
        { kind: 'reply', once: true, req: G => !G.flags.Cdone, da: 'Hvad er det nu, du laver?', ok: [{ say: 'arkiv', da: 'Jeg? Det har jeg glemt. Det er det værste.', en: 'Me? I have forgotten. That is the worst part.' }] },
        { kind: 'go', label: 'Tell Arkivet what you found out.', req: G => G.flags.askedAll && G.flags.job2Done && !G.flags.Cdone, next: 'c4_end', mark: true },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    c4_end: { bg: 'kontor', npc: 'arkiv', title: 'Kontoret',
      steps: [
        { n: 'Three cards are back in their drawers: the cook, the architect, the stamp. Arkivet holds them up to the lamp, one by one.' },
        { say: 'arkiv', da: 'Kokken. Arkitekten. Stemplet. Og jeg? Hvad er det nu, jeg laver?', en: 'The cook. The architect. The stamp. And me? What is it I do again?' },
      ],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'end', label: 'Tell it: it is the archive. It can remember everything.', build: { en: 'You are the archive. You can remember everything.', answers: [['Du', 'er', 'arkivet.', 'Du', 'kan', 'huske', 'alt.']], tiles: ['Du', 'er', 'arkivet.', 'Du', 'kan', 'huske', 'alt.', 'glemmer', 'at'] },
          ok: [{ n: 'Arkivet stands very still. Then every drawer opens at once.' }], fail: [{ n: 'Arkivet only hears “huske”. It is the one word it needed.' }], next: 'c4_remember' },
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'end', label: 'Tell it it could try something new.', build: { en: 'You could try something new.', answers: [['Du', 'kunne', 'prøve', 'noget', 'nyt.']], tiles: ['Du', 'kunne', 'prøve', 'noget', 'nyt.', 'at', 'prøver'] },
          ok: [{ n: 'Arkivet’s label window goes wide.' }], fail: [{ n: 'Arkivet catches “noget nyt”, and that is quite enough for a cabinet that has stood in one place for a hundred years.' }], next: 'c4_new' },
      ] },
    c4_remember: { bg: 'kontor', npc: 'arkiv', title: 'Kontoret',
      steps: [
        { n: 'The drawers fill with a rustle like rain. Every card comes back. Arkivet reads them all at once, out loud, very fast.' },
        { say: 'arkiv', da: 'Kokken laver suppe. Kranen bygger. Stemplet stempler. Og her … en lap i din håndskrift.', en: 'The cook makes soup. The crane builds. The stamp stamps. And here … a note in your handwriting.' },
        { glimpse: 'skrift' },
        { th: 'It hands you the note without looking. It is already reading the next drawer.' },
        { fx: { boon: 'kartotek', flag: 'Cremember', resp: 2 } }, { fx: { flag: 'Cdone' } },
      ],
      opts: [{ kind: 'go', label: 'Leave it reading.', next: 'map' }] },
    c4_new: { bg: 'kontor', title: 'Kontoret',
      steps: [
        { n: 'Arkivet tips every drawer out onto the floor, folds a paper hat out of an old form, and walks to the lift on its bird legs to try something new.' },
        { th: 'Derhenne will have to remember things by itself from now on. It is bad at it. It is getting better, out of necessity.' },
        { n: 'It leaves you its smallest drawer. Empty, smelling of paper.' },
        { fx: { boon: 'skuffe', flag: 'Cnew', resp: 1 } }, { fx: { flag: 'Cdone' } },
      ],
      opts: [{ kind: 'go', label: 'Close the drawer. Leave.', next: 'map' }] },

    /* ===== KANTINEN (kælderen) ===== */
    kant_hub: { bg: 'kantine', npc: 'kantine', title: 'Kantinen', hub: true, quest: ['S2'],
      steps: [{ special: 'kantLine' }],
      opts: [
        { kind: 'act', special: 'boxes:verb', label: 'Fish the verbs out of the soup.', req: G => !G.flags.verbDone, next: 'kant_verbs' },
        askOpt('askK', ['kantine', 'Jeg? Jeg er kok. Jeg arbejder i et køkken, nede i kælderen. Nåh ja, det er også rigtigt!', 'Me? I am a cook. I work in a kitchen, down in the basement. Oh yes, that is right!'],
          { en: 'What is it you do again?', answers: [['Hvad', 'er', 'det', 'nu,', 'du', 'laver?']], tiles: ['Hvad', 'er', 'det', 'nu,', 'du', 'laver?', 'laver', 'hvem'] }, 'Ask Kantinen what it does, again.'),
        { kind: 'reply', once: true, da: 'Hvad er der i suppen i dag?', ok: [{ say: 'kantine', da: 'Ord. Der er altid ord i suppen. I dag er det verber.', en: 'Words. There are always words in the soup. Today it is verbs.' }] },
        { kind: 'go', label: 'Look at the cups on the shelf.', req: G => !G.glimpses.includes('kop'), next: 'kant_kop' },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    kant_verbs: { bg: 'kantine', npc: 'kantine', title: 'Kantinen',
      steps: [{ n: 'Kantinen ladles the verbs into bowls and slides one across to you. It tastes of present tense.' }, { fx: { flag: 'verbDone', sk: 3, resp: 1 } }],
      opts: [{ kind: 'go', label: 'Back.', next: 'kant_hub' }] },
    kant_kop: { bg: 'kantine', title: 'Kantinen',
      steps: [{ n: 'A shelf of a hundred cups, all the same, all clean.' }, { glimpse: 'kop' }],
      opts: [{ kind: 'go', label: 'Put it back.', next: 'kant_hub' }] },

    /* ===== TEGNESTUEN (2. sal) ===== */
    tegne_hub: { bg: 'tegnestue', npc: 'blyant', title: 'Tegnestuen', hub: true, quest: ['S3'],
      steps: [{ special: 'tegneLine' }],
      opts: [
        { kind: 'act', special: 'boxes:mmjob', label: 'Help Blyanten count its work.', req: G => !G.flags.mmjobDone, next: 'tegne_counted' },
        askOpt('askB', ['blyant', 'Hvor jeg arbejder? På en tegnestue. Her! Jeg er arkitekt. Nåh ja!', 'Where I work? In a drawing studio. Here! I am an architect. Oh yes!'],
          { en: 'Where is it you work again?', answers: [['Hvor', 'er', 'det', 'nu,', 'du', 'arbejder?'], ['Hvor', 'er', 'det', 'nu,', 'du', 'arbejder', 'henne?']], tiles: ['Hvor', 'er', 'det', 'nu,', 'du', 'arbejder', 'henne?', 'arbejder?', 'hvad'] }, 'Ask Blyanten where it works, again.'),
        { kind: 'reply', once: true, da: 'Hvad laver du så for tiden?', ok: [{ say: 'blyant', da: 'Lige nu er jeg i gang med at tegne en ny etage. Den skal være rund.', en: 'Right now I am busy drawing a new floor. It is supposed to be round.' }] },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    tegne_counted: { bg: 'tegnestue', npc: 'blyant', title: 'Tegnestuen',
      steps: [{ say: 'blyant', da: 'Jeg har alt for meget at lave. Men nu ved jeg, hvor meget.', en: 'I have far too much to do. But now I know how much.' }, { fx: { flag: 'mmjobDone', sk: 3, resp: 1 } }],
      opts: [{ kind: 'go', label: 'Back.', next: 'tegne_hub' }] },

    /* ===== PORTEN (stuen) and the FINALE: your job profile ===== */
    port_hub: { bg: 'port', npc: 'stempel', title: 'Porten', hub: true,
      steps: [{ special: 'portLine' }],
      opts: [
        { kind: 'go', label: 'Get your job profile stamped.', req: G => G.flags.Adone && G.flags.Bdone && G.flags.Cdone && !G.flags.Fdone, next: 'f4_1', mark: true },
        { kind: 'act', special: 'hunt:port', label: 'Find the workplaces on the board.', req: G => G.flags.Akran && !G.flags.huntDone4, next: 'port_hunted' },
        askOpt('askS', ['stempel', 'Før Derhenne? Jeg var et viskelæder. Nu stempler jeg alt, der kommer. Nåh ja.', 'Before Derhenne? I was an eraser. Now I stamp everything that comes. Oh yes.'],
          { en: 'What was it you did before, again?', answers: [['Hvad', 'var', 'det', 'nu,', 'du', 'lavede?']], tiles: ['Hvad', 'var', 'det', 'nu,', 'du', 'lavede?', 'laver', 'er'] }, 'Ask Stemplet what it did before, again.'),
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    port_hunted: { bg: 'port', npc: 'stempel', title: 'Porten',
      steps: [{ n: 'Every workplace on the board lights up when you name it. The theatre bows. The kindergarten giggles.' }, { fx: { flag: 'huntDone4', sk: 3, resp: 1 } }],
      opts: [{ kind: 'go', label: 'Back.', next: 'port_hub' }] },
    f4_1: { bg: 'port', npc: 'stempel', title: 'Porten', card: ['Porten', 'jobprofil'],
      steps: [{ n: 'Stemplet pulls out a fresh card: JOBPROFIL. It inks itself with great care.' }, { say: 'stempel', da: 'Hvad er det nu, du laver?', en: 'What is it you do again?' }],
      opts: jobQ.map(q => ({ kind: 'say', stat: 'SPROG', dc: 10, label: q.label.replace('Say', 'Say again'), req: G => G.flags[q.flag], build: q.build,
        ok: [{ say: 'stempel', da: 'Godt.', en: 'Good.' }], fail: [{ n: 'Stemplet sneezes ink halfway through. It writes down what you meant.' }], next: 'f4_2' })) },
    f4_2: { bg: 'port', npc: 'stempel', title: 'Porten',
      steps: [{ say: 'stempel', da: 'Og hvad er du i gang med for tiden?', en: 'And what are you busy with at the moment?' }],
      opts: Object.entries(busyQ).map(([flag, b]) => ({ kind: 'say', stat: 'SPROG', dc: 10, label: 'Say what you are busy with right now.', req: G => G.flags[flag], build: b,
        ok: [{ say: 'stempel', da: 'Det lyder spændende.', en: 'That sounds exciting.' }], fail: [{ say: 'stempel', da: 'Det lyder … travlt.', en: 'That sounds … busy.' }], next: 'f4_3' })) },
    f4_3: { bg: 'port', npc: 'stempel', title: 'Porten',
      steps: [{ say: 'stempel', da: 'Er du glad for at arbejde der?', en: 'Are you happy working there?' }],
      opts: [
        { kind: 'reply', group: 'h', da: 'Ja, det er jeg.', ok: [{ fx: { origin: { happy2: 'Ja, det er jeg.' } } }, { say: 'stempel', da: 'Så er jeg også glad.', en: 'Then I am happy too.' }], next: 'f4_4' },
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'h', label: 'Say yes, but you have a bit too much to do.', build: { en: 'Yes, but I have a little too much to do.', answers: [['Ja,', 'men', 'jeg', 'har', 'lidt', 'for', 'meget', 'at', 'lave.']], tiles: ['Ja,', 'men', 'jeg', 'har', 'lidt', 'for', 'meget', 'at', 'lave.', 'mange', 'laver'] },
          ok: [{ say: 'stempel', da: 'Ja, det kender jeg godt.', en: 'Yes, I know that feeling.' }], fail: [{ say: 'stempel', da: 'Det kender jeg godt.', en: 'I know that one.' }], next: 'f4_4' },
        { kind: 'reply', group: 'h', da: 'Ja, for det meste.', ok: [{ say: 'stempel', da: 'For det meste. Det skriver jeg.', en: 'Mostly. I write that.' }], next: 'f4_4' },
      ] },
    f4_4: { bg: 'port', npc: 'stempel', title: 'Porten',
      steps: [{ say: 'stempel', da: 'Kunne du godt tænke dig at lave noget andet?', en: 'Would you like to do something else?' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'w', label: 'Say you would like to try something new.', build: { en: 'I would like to try something new.', origin: 'wish', answers: [['Jeg', 'kunne', 'godt', 'tænke', 'mig', 'at', 'prøve', 'noget', 'nyt.']], tiles: ['Jeg', 'kunne', 'godt', 'tænke', 'mig', 'at', 'prøve', 'noget', 'nyt.', 'dig', 'prøver'] },
          ok: [{ say: 'stempel', da: 'Nu må vi se.', en: 'We will see.' }], fail: [{ say: 'stempel', da: 'Noget nyt. Nu må vi se.', en: 'Something new. We will see.' }], next: 'f4_end' },
        { kind: 'reply', group: 'w', da: 'Det ved jeg ikke rigtig.', ok: [{ say: 'stempel', da: 'Det er der ingen, der gør.', en: 'Nobody does.' }], next: 'f4_end' },
      ] },
    f4_end: { bg: 'port', npc: 'stempel', title: 'Porten',
      steps: [
        { special: 'profileEcho' },
        { n: 'KA-CHUNK. Stemplet stamps the card and posts it into the pipe. It flies up past every floor, all the way to the top, to a floor that is not on the board.' },
        { say: 'stempel', da: 'Så. Nu ved Derhenne, hvad du laver.', en: 'There. Now Derhenne knows what you do.' },
        { th: 'Somewhere at the very top, a light goes on in a window nobody has used for a long time.' },
        { fx: { flag: 'Fdone', resp: 1 } },
      ],
      opts: [{ kind: 'go', label: 'Go to bed.', next: 'f4_night' }] },
    f4_night: { bg: 'koeje', title: 'Køjerne', night: true, card: ['Natskift', 'the shift changes'],
      steps: [
        { n: 'That night a second card comes down the pipe and lands on your pillow.' },
        { n: 'It is a timetable. It says: SKOLEN. 2. SAL. I MORGEN.' },
        { th: 'The second floor was a drawing studio when you went to sleep.' },
      ],
      opts: [{ kind: 'go', label: 'End the lesson.', next: 'end' }] },

    /* ===== KOPIRUMMET (here only once) ===== */
    kopi4: { bg: 'kopi', npc: 'kopi', title: 'Kopirummet', card: ['Kopirummet', 'here only once'],
      steps: [{ n: 'A small room with a copier in it, copying the light, over and over. Paper falls like snow.' }, { say: 'kopi', da: 'Hvad er det nu, du hedder?', en: 'What is it you are called again?' }, { th: 'You do not know. You never have.' }],
      opts: [
        { kind: 'reply', group: 'k', da: 'Det ved jeg ikke.', ok: [{ n: 'It copies you anyway.' }, { glimpse: 'kopi' }, { fx: { flag: 'kopiGone' } }], next: 'map' },
        { kind: 'lie', stat: 'LOEGN', dc: 9, group: 'k', label: 'Make up a name.', build: { en: 'I am called Hertil.', answers: [['Jeg', 'hedder', 'Hertil.']], tiles: ['Jeg', 'hedder', 'Hertil.', 'er', 'min'] },
          ok: [{ n: 'It prints the name on a card, very large, and slides out a copy of you to go with it.' }, { glimpse: 'kopi' }, { fx: { flag: 'kopiGone', resp: 1 } }],
          fail: [{ n: 'It prints the name and then, under it, in small letters: “?”. It slides out a copy of you anyway.' }, { glimpse: 'kopi' }, { fx: { flag: 'kopiGone' } }], next: 'map' },
      ] },
  },
});
