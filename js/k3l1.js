/* =========================================================================
   HERTIL · Kapitel 3 · Lektion 1 — "Har du set min jakke?"   (Deroppe)
   Book 3.1: things you can't find at home, borrowing and offering (Skal du bruge …? – Så bare tag min),
   asking someone to bring something (Vil du ikke tage … med?) and promising (Jo, det skal jeg nok),
   min / mit / mine, egen / eget / egne, de / dem, inde / ind, oppe / op, nede / ned, ude / ud, i / på + rooms.
   The grammar is the physics of Deroppe, a house that sits on top of a shop street like a hat:
   · a thing answers only to the right owner word (min hue, mit ur, mine nøgler). Said wrong, it stays lost.
   · a place word (inde, nede) keeps a thing where it is; a direction word (ind, ned) keeps it moving.
     Støvsugeren has been "på vej ind i stuen" for weeks, because nobody tells it it is INDE.
   · skal nok ties a knot of thread round your finger until the promise is kept.
   Chapter thread (spoilers, never tell Bruno): the coat from the parcel is the player's own old coat. It was left
   in Deroppe before Hertil. Skabet's key was in its pocket. It does not fit because the player has changed.
   ========================================================================= */

const D3 = { phases: ['Åbningstid', 'Udsalg', 'Lukketid', 'Natlager'], light: ['#7fd11b', '#ff8a1f', '#ff2e88', '#2b3bd6'],
  nightText: 'Natlager. The house is asleep. Only your bedroom and the kitchen are awake. Go to bed.', shutText: 'Natlager. That room has switched its light off.',
  bed: { bg: 'sove3', name: 'Soveværelset', en: 'back to your bed', texts: ['You get into bed. The coat on the door breathes slowly, in and out.', 'You lie down. Far below, a cash register rings once, and your marks settle.', 'The pillow is shaped for somebody slightly different. You fit into it anyway.'] },
  place: 'Deroppe', map: 'tower', mapScene: 'hus3', hub: { x: 50, y: 55 }, endBg: 'gang3', chap: 3, chapter: 'Kapitel 3 · Nyt og gammelt' };
const COAT0 = { k: 'frakke', c: 'graa', fit: 'stor' };

SESSIONS.k3l1 = Object.assign({}, D3, {
  id: 'k3l1', order: 7, short: 'K3 · Lektion 1', prevSession: 'k2l3', nextSession: 'k3l2', title: 'Lektion 1 · Har du set min jakke?', en: 'Have you seen my jacket?',
  blurb: 'The parcel came with a coat that does not fit. It leads up a staircase to a house where everything is lost.',
  start: 'p7_trappe', home: 'sove', travelAfter: 'p7seen', cluesFlag: 'clues7', cluesNeed: 3, dcMod: 2,
  startState: { resp: 0, sk: 10, insp: 1, boons: ['anker', 'hue'], statXP: { SPROG: 22, LOEGN: 7, SNIGE: 9, HANDEL: 8, INDSIGT: 17 },
    origin: { reason: 'Jeg kom hertil på grund af en lyd.', work: 'Jeg læser til arkitekt på universitetet.', appt: 'Ja, det kan vi godt. Det er en aftale.' }, met: [] },

  locations: {
    loftet:  { name: 'Loftet', en: 'oppe under taget', x: 26, y: 21, bg: 'loft3', icon: 'loft', entry: G => G.glimpses.includes('boejle') ? 'loft7b' : 'loft7' },
    sove:    { name: 'Soveværelset', en: '1. sal · your bed', x: 26, y: 37, bg: 'sove3', icon: 'seng', night: true, entry: G => 'sove_hub' },
    bad:     { name: 'Badeværelset', en: '1. sal · towels', x: 74, y: 37, bg: 'bad3', icon: 'badekar', entry: G => 'bad_hub' },
    stuen:   { name: 'Stuen', en: 'something is roaring', x: 26, y: 55, bg: 'stue3', icon: 'sofa', entry: G => !G.flags.Cstart ? 'c7_start' : 'stue_hub' },
    gangen:  { name: 'Gangen', en: 'Skabet and the stairs', x: 50, y: 55, bg: 'gang3', icon: 'knage', entry: G => !G.flags.p7seen ? 'p7_skab' : 'gang_hub' },
    koekken: { name: 'Køkkenet', en: 'Køleskabet hums', x: 74, y: 55, bg: 'koekken3', icon: 'gryde', night: true, entry: G => 'koek_hub' },
    kaelder: { name: 'Kælderen', en: 'Vaskemaskinen sings', x: 26, y: 72, bg: 'kaelder3', icon: 'kaelder', entry: G => !G.flags.Bstart ? 'b7_start' : 'kael_hub' },
    garage:  { name: 'Garagen', en: 'here only once', x: 74, y: 72, bg: 'garage3', icon: 'bil', eph: true, req: G => G.flags.minmitDone && !G.flags.garageGone, entry: G => 'garage7' },
  },

  ending: G => [G.flags.Aegen ? 'Dit eget' : G.flags.Alaan ? 'Lånt hue' : null,
    G.flags.Bvask ? 'Vasket' : G.flags.Bbehold ? 'Beholdt' : null,
    G.flags.Cro ? 'Ro i stuen' : G.flags.Cfind ? 'Hittegods' : null].filter(Boolean).join(' · ') || '—',
  carryFlags: ['Aegen', 'Alaan', 'Bvask', 'Bbehold', 'Cro', 'Cfind'],
  next: 'Lektion 2 · Hvor har du købt den henne? Below the house a street has opened, and everything in it is on sale, including the colours.',

  quests: {
    A: { title: 'Skabets nøgle', en: 'Skabet’s key', obj: [['Call Skabet’s hangers home (Gangen)', 'minmitDone'], ['Ask the house where everything is', 'husDone'], ['Open Skabet', 'Adone']] },
    B: { title: 'Et løfte', en: 'A promise', obj: [['Promise Vaskemaskinen something (Kælderen)', 'Bpromise'], ['Fetch the towels (Badeværelset)', 'gotTowels'], ['Keep your promise', 'Bdone']] },
    C: { title: 'Støvsugeren', en: 'The vacuum cleaner', obj: [['Make Støvsugeren arrive (Stuen)', 'Cstop'], ['Find what it swallowed', 'huntDone7'], ['Tell it what to do now', 'Cdone']] },
    F: { title: 'Hvad har du på?', en: 'What are you wearing?', obj: [['Answer Skabet, once it is open, the towels are washed and the living room is quiet', 'Fdone']] },
    S1: { title: 'Køleskabets regnskab', en: 'The fridge counts', side: true, obj: [['Help Køleskabet: den, det, de or dem? (Køkkenet)', 'dedemDone']] },
    S2: { title: 'Tasken', en: 'The bag', side: true, obj: [['Help Tasken pack (Garagen)', 'tagmedDone']] },
    S3: { title: 'Spor', en: 'Traces', side: true, obj: [['Find three traces of what you were', 'clues7']] },
  },

  glimpses: {
    lomme: { name: 'Lommen', en: 'The pocket', text: 'The coat has an inside pocket that your hand finds without looking for it, the way a hand finds a light switch in its own house.' },
    spejl: { name: 'Det duggede spejl', en: 'The fogged mirror', text: 'In the fogged mirror the coat fits you. Shoulders, sleeves, collar, all of it. You wipe the glass, and it is too big again.' },
    sok: { name: 'Den anden sok', en: 'The other sock', text: 'Under the bed: one sock. You realise you have been wearing a single sock since Hertil. This is the other one. It has been waiting here a long time.' },
    boejle: { name: 'Bøjlen', en: 'The hanger', text: 'On a nail by the attic door hangs a coat hanger, bent out of shape. It is bent into the shape of somebody’s shoulders. Yours, before.' },
    maerke: { name: 'Vaskemærket', en: 'The care label', text: 'A care label in the collar, written by hand: MÅ IKKE VASKES. Under it a word, crossed out three times. You cannot read it. Your hand knows the shape of it.' },
  },

  boxes: {
    minmit: { title: 'Skabets bøjler', q: 'min, mit eller mine?', boxes: ['min', 'mit', 'mine'],
      good: 'Every hanger comes home with its thing on it, clack, clack, clack, and hooks itself onto the rail inside Skabet’s door.', meh: 'Most hangers come home. Two keep circling the lamp, carrying a scarf between them like a hammock.',
      items: [
        { t: 'Har du set ___ hue? (en hue)', a: 0, why: 'en hue → min hue.' },
        { t: 'Jeg kan ikke finde ___ ur. (et ur)', a: 1, why: 'et ur → mit ur.' },
        { t: 'Hvor er ___ nøgler?', a: 2, why: 'Plural: mine nøgler.' },
        { t: 'Har du set ___ tørklæde? (et tørklæde)', a: 1, why: 'et tørklæde → mit tørklæde.' },
        { t: 'Jeg skal bruge ___ paraply i dag. (en paraply)', a: 0, why: 'en paraply → min paraply.' },
        { t: 'Har du set ___ høretelefoner?', a: 2, why: 'Plural: mine høretelefoner.' },
        { t: 'Kan du ikke bruge din ___? (en paraply)', opts: ['egen', 'eget', 'egne'], a: 0, why: 'egen agrees like an adjective: din egen (en-word).' },
        { t: 'Jeg kan ikke finde mine ___ handsker.', opts: ['egne', 'egen', 'eget'], a: 0, why: 'Plural: mine egne handsker.' },
      ] },
    retning: { title: 'Håndklæderne', q: 'Sted eller retning?', boxes: ['a', 'b'],
      good: 'The towels stop flapping round the ceiling and drop into your arms one by one, folded.', meh: 'Most towels drop into your arms. One stays up by the lamp, sulking, and you leave it there.',
      items: [
        { t: 'Håndklæderne ligger ___ på badeværelset.', opts: ['ude', 'ud'], a: 0, why: 'ligger: nothing moves, so the place form: ude.' },
        { t: 'Jeg går lige ___ på badeværelset og henter dem.', opts: ['ud', 'ude'], a: 0, why: 'går: movement, so the direction: ud.' },
        { t: 'Vaskemaskinen står ___ i kælderen.', opts: ['nede', 'ned'], a: 0, why: 'står: a place, nede.' },
        { t: 'Kan du komme ___ i kælderen med dem?', opts: ['ned', 'nede'], a: 0, why: 'komme ned: movement, a direction.' },
        { t: 'Paraplyen ligger ___ på loftet.', opts: ['oppe', 'op'], a: 0, why: 'ligger: a place, oppe.' },
        { t: 'Støvsugeren er gået ___ i stuen.', opts: ['ind', 'inde'], a: 0, why: 'er gået: it moved, so the direction: ind.' },
        { t: 'Skabet står ___ i gangen.', opts: ['ude', 'ud'], a: 0, why: 'står: a place. The hallway takes ude: ude i gangen.' },
        { t: 'Jeg løber lige ___ på loftet.', opts: ['op', 'oppe'], a: 0, why: 'løber: movement, so the direction: op.' },
      ] },
    dedem: { title: 'Køleskabets regnskab', q: 'den, det, de eller dem?', boxes: ['den', 'det', 'de', 'dem'],
      good: 'Køleskabet knows what it has again. Its light comes on all by itself, proudly.', meh: 'Køleskabet knows most of what it has. It is still unsure about an egg.',
      items: [
        { t: 'Har du set mine handsker? Jeg kan ikke finde ___.', a: 3, why: 'The object, plural: dem.' },
        { t: 'Mine handsker? Jeg tror, ___ ligger ude i gangen.', a: 2, why: 'The subject, plural: de.' },
        { t: 'Har du set mit ur? Jeg kan ikke finde ___.', a: 1, why: 'et ur → det.' },
        { t: 'Har du set min pung? Jeg tror, ___ ligger inde i stuen.', a: 0, why: 'en pung → den.' },
        { t: 'Mine briller? Jeg skal ikke bruge ___ i dag.', a: 3, why: 'The object, plural: dem.' },
        { t: 'Har du set mit kamera? Jeg tror, ___ ligger oppe på loftet.', a: 1, why: 'et kamera → det.' },
        { t: 'Dine støvler? Jeg tror, ___ står nede i kælderen.', a: 2, why: 'The subject, plural: de.' },
        { t: 'Mine nøgler? Jeg har glemt ___ i køkkenet.', a: 3, why: 'The object, plural: dem.' },
      ] },
    tagmed: { title: 'Tasken pakker', q: 'Hvad tager du med?', boxes: ['a', 'b', 'c'],
      good: 'Tasken zips itself shut, packed for six different days at once. It is very heavy and very pleased.', meh: 'Tasken is packed. It has a toothbrush in it for a birthday. Nobody will mind.',
      items: [
        { t: 'Du skal til fødselsdag.', opts: ['en flaske rødvin', 'en skraldepose', 'en tandbørste'], a: 0, why: 'To a birthday, a bottle of red wine. Or a present.' },
        { t: 'Du skal ud og svømme.', opts: ['svømmebriller', 'en paraply', 'handsker'], a: 0, why: 'Swimming goggles: svømmebriller.' },
        { t: 'Det regner.', opts: ['en paraply', 'solbriller', 'sandaler'], a: 0, why: 'Rain: a paraply.' },
        { t: 'Du skal ud og rejse.', opts: ['dit pas', 'din sofa', 'en skraldepose'], a: 0, why: 'Travelling abroad: dit pas.' },
        { t: 'Du skal cykle.', opts: ['en cykelhjelm', 'en badedragt', 'et slips'], a: 0, why: 'On a bike: a cykelhjelm.' },
        { t: 'Det er rigtig koldt.', opts: ['handsker', 'shorts', 'solbriller'], a: 0, why: 'Cold: handsker.' },
      ] },
  },

  rooms: {
    hus: { title: 'Hvor ligger det hele?', q: 'Hvor er det?', flag: 'husDone',
      good: 'The whole house reports in, room by room, and every lost thing in it clicks back into place.', meh: 'Most rooms report in. The kitchen insists the toothbrush is not its business.',
      rounds: [
        { k: 'paraply', clue: 'Paraplyen? Den ligger oppe på loftet, tror jeg.', room: 'loft', why: 'oppe på loftet: up in the attic, a place.' },
        { k: 'noegler', clue: 'Nøglerne ligger nede i kælderen, ved siden af vaskemaskinen.', room: 'kaelder', why: 'nede i kælderen: down in the basement.' },
        { k: 'pung', clue: 'Støvsugeren er lige gået ind i stuen med en pung i munden.', room: 'stue', why: 'gået ind i stuen: a direction, and it ends in the living room. So does the wallet.' },
        { k: 'haandkl', clue: 'Håndklæderne hænger ude på badeværelset.', room: 'bad', why: 'ude på badeværelset: the bathroom takes på.' },
        { k: 'ur3', clue: 'Uret? Det ligger inde i soveværelset, under puden.', room: 'sove', why: 'inde i soveværelset: in the bedroom.' },
        { k: 'hjelm', clue: 'Cykelhjelmen er ude i garagen.', room: 'garage', why: 'ude i garagen: out in the garage.' },
        { k: 'tandb', clue: 'Tandbørsten? Den er ude i køkkenet. Spørg ikke hvorfor.', room: 'koekken', why: 'ude i køkkenet: in the kitchen.' },
        { k: 'taske', clue: 'Jeg går lige ud i gangen og henter tasken.', room: 'gang', why: 'ud i gangen: a direction. The bag is in the hallway, so that is where you go.' },
      ] },
  },

  hunts: {
    stue: { title: 'Bunken', en: 'Find the lost things in the pile', find: ['noegler', 'pung', 'briller', 'hoeretlf', 'ur3', 'mobil'], decoys: ['tandb', 'haandkl', 'baelte', 'dankort', 'hjelm', 'pas'] },
  },

  travel: [
    { id: 'boejl7', bg: 'gang3', npc: 'boejler', steps: [{ n: 'A flock of coat hangers comes clacking down the stairwell in a V, heading south, which in this house means the basement.' }],
      opts: [{ kind: 'reply', group: 'b', da: 'Hvor skal I hen?', ok: [{ say: 'boejler', da: 'Ned i kælderen! Der er varmt!', en: 'Down to the basement! It is warm there!' }], next: 'map' }, { kind: 'go', group: 'b', label: 'Duck.', next: 'map' }] },
    { id: 'sok7', bg: 'gang3', steps: [{ n: 'A single sock is climbing the stairs one step at a time, stopping at every step to ask it something.' }],
      opts: [{ kind: 'act', stat: 'SNIGE', dc: 9, label: 'Catch it and look inside.', ok: [{ n: 'Inside the sock: a second, smaller sock. It does not help anybody.' }, { fx: { insp: 1 } }], fail: [{ n: 'It slips through the banister and keeps climbing, asking.' }], next: 'map' }, { kind: 'go', label: 'Let it climb.', next: 'map' }] },
    { id: 'regning7', bg: 'gang3', steps: [{ n: 'A receipt flutters up the stairwell from somewhere far below. It is ten metres long and lists one item: TØJ. Price: GRATIS I DAG.' }],
      opts: [{ kind: 'go', label: 'Pocket it. Walk on.', fx: { sk: 1 }, next: 'map' }] },
    { id: 'post7', bg: 'gang3', req: G => G.prev.Fchef || G.prev.Fmove || G.prev.Fcancel, steps: [{ n: G => G.prev.Fchef ? 'A postcard sails up the stairwell from Derhenne. On it: a drawing of a window, with a chair in front of it, and you in the chair.' : G.prev.Fmove ? 'A postcard sails up the stairwell from Derhenne. It is a calendar page with a date a year from now, circled twice.' : 'A postcard sails up the stairwell from Derhenne. On it: Holdet, with a new chair, and a new student in it.' }],
      opts: [{ kind: 'go', label: 'Pocket it. Walk on.', fx: { resp: 1 }, next: 'map' }] },
    { id: 'ikket7', bg: 'gang3', req: G => hasBoon('ikket'), steps: [{ n: 'Ikket wriggles in your mouth. This house is full of lost things, and an ikke is very good at getting lost. It is tempted.' }],
      opts: [{ kind: 'go', label: 'Keep your mouth shut. Walk on.', next: 'map' }] },
    { id: 'tal7', bg: 'gang3', req: G => !hasBoon('urnoegle'), steps: [{ n: 'Every price tag in the stairwell flips over at once. The numbers on the back are not numbers.' }, { special: 'glyphs' }], opts: [{ kind: 'go', label: 'Walk on anyway.', next: 'map' }] },
  ],

  special: {
    async arrive3() {
      logAdd(`<p>${esc(G.newPlace ? 'Your weight stayed behind somewhere on the staircase. Up here you will have to earn it again.' : 'Here you are new. Deroppe is like that: everything in it is new to somebody.')}</p>`, 'thought'); await tapOn();
    },
    async gangLine() {
      const f = G.flags;
      logAdd(`<p>${esc(f.Fdone ? 'Skabet is asleep on its feet. On the inside of its door, in pencil, there is a shape that is roughly yours.' : f.Adone && f.Bdone && f.Cdone ? 'Skabet has a pencil out, and a page on the inside of its door headed BEBOERE.' : f.Adone ? pick(['Skabet is folding socks into smaller socks.', 'Skabet hums with its doors open, airing out a hundred years.']) : f.minmitDone ? 'The hangers are home. Skabet keeps patting its doors for a key it does not have.' : 'Hangers flap round the hallway lamp like bats, clacking. Skabet rattles.')}</p>`, 'narr');
      const c = f.Adone && typeof wearComment === 'function' && Math.random() < .6 ? wearComment(G) : null;
      if (c) { sayEntry({ say: 'skab', da: c, en: 'It likes what you are wearing.' }); await tapOn(); }
    },
    async kaelLine() { logAdd(`<p>${esc(G.flags.Bdone ? 'Vaskemaskinen is washing one sock with enormous care.' : G.flags.Bpromise && !G.flags.gotTowels ? 'Vaskemaskinen points its drum at the stairs. Upstairs. Towels.' : G.flags.gotTowels ? 'Vaskemaskinen sees the towels in your arms and opens its mouth wide.' : 'The drum goes round. The song goes round.')}</p>`, 'narr'); },
    async stueLine() { logAdd(`<p>${esc(G.flags.Cro ? 'Støvsugeren dozes beside the coffee table. Now and then it dreams of carpet.' : G.flags.Cfind ? 'The living room is suspiciously tidy. Støvsugeren is out, finding things.' : G.flags.Cstop ? 'Støvsugeren waits, nozzle down, beside a heap of everything.' : 'Støvsugeren roars round and round the coffee table.')}</p>`, 'narr'); },
    async koekLine() { logAdd(`<p>${esc(G.phase >= 3 ? 'Natlager. Køleskabet hums in the dark, and its light is the only light in the house.' : G.flags.dedemDone ? 'Køleskabet counts its eggs. Three. It is sure now.' : 'Køleskabet opens, closes, opens. It keeps forgetting what it has, and whether to call it de or dem.')}</p>`, 'narr'); },
    async badLine() { logAdd(`<p>${esc(G.flags.gotTowels ? 'The bathroom is bare. Every towel has gone.' : G.flags.Bpromise ? 'Towels flap round the ceiling like big soft birds, landing nowhere.' : 'Steam, a mirror, and towels hanging very still, as if they were listening for their names.')}</p>`, 'narr'); },
    async soveLine() { logAdd(`<p>${esc(G.flags.Fdone ? 'The coat hangs on the bedpost. Its label has changed.' : pick(['The bed is wide and smells of washing powder.', 'Your bedroom, apparently. The coat hangs on the door and the door looks embarrassed.']))}</p>`, 'narr'); },
    async registerEcho() {
      const o = G.origin, lines = [o.wear3, o.promise3].filter(Boolean);
      if (!lines.length) return;
      logAdd(`<p>Skabet reads it back before it writes it down.</p>`, 'narr');
      for (const l of lines) { youSaid(l); TTS.say(l); await sleep(FAST ? 0 : 900); }
      await tapOn();
    },
    async glyphs() { G.glyph = 3; AUDIO.sting('glyph'); toast('ᚦᚨᛚ · the numbers have gone strange', 'gold'); },
  },

  nodes: {
    /* ===== PROLOGUE: up the staircase ===== */
    p7_trappe: { bg: 'gang3', title: 'Trappen', card: ['Kapitel 3 · Nyt og gammelt', 'Lektion 1 — Har du set min jakke?'],
      steps: [
        { n: 'The coat from the parcel goes down to your feet and then some. The sleeves have plans of their own.' },
        { fx: { wear: { frakke: COAT0 } } },
        { n: 'The cardboard of the parcel unfolds into a staircase, and the staircase goes up, past the clouds, to a front door with a price tag on the handle.' },
        { n: 'Deroppe. A house sitting on top of a shop street like a hat on a head. The door is open. Somewhere inside, a wardrobe is rattling.' },
      ],
      opts: [{ kind: 'go', label: 'Go in.', next: 'p7_skab' }] },
    p7_skab: { bg: 'gang3', npc: 'skab', title: 'Gangen',
      steps: [
        { n: 'The hallway. Coats hang on hooks, empty, swinging. A wardrobe on bow legs is shaking its own doors.' },
        { say: 'skab', da: 'Har du set min nøgle? Jeg kan ikke finde den.', en: 'Have you seen my key? I can’t find it.' },
        { th: 'It asks the doormat, then a hook, then the light switch. Same question, same order.' },
        { say: 'skab', da: 'Alting i det her hus er væk. Mine bøjler flyver rundt, og ingen kan finde noget.', en: 'Everything in this house is gone. My hangers are flying around, and nobody can find anything.' },
        { say: 'skab', da: 'Ting kommer kun, når man siger det rigtigt. Min hue. Mit ur. Mine nøgler.', en: 'Things only come when you say it right. My hat. My watch. My keys.' },
        { special: 'arrive3' },
        { th: 'Somewhere below, a washing machine is singing to a sock. In the living room, something is roaring round and round.' },
        { fx: { quest: ['A', 'B', 'C', 'F', 'S3'], flag: 'p7seen' } },
      ],
      opts: [
        { kind: 'reply', group: 'p', da: 'Jeg skal nok hjælpe dig.', ok: [{ say: 'skab', da: 'Godt. Start med mine bøjler.', en: 'Good. Start with my hangers.' }, { fx: { resp: 1 } }], next: 'gang_hub' },
        { kind: 'go', group: 'p', label: 'Look around the house first.', next: 'map' },
      ] },

    /* ===== GANGEN: Skabet, contract A, and the finale ===== */
    gang_hub: { bg: 'gang3', npc: 'skab', title: 'Gangen', hub: true,
      steps: [{ special: 'gangLine' }],
      opts: [
        { kind: 'act', special: 'boxes:minmit', label: 'Call Skabet’s hangers home: min, mit or mine.', req: G => !G.flags.minmitDone, next: 'a7_called', mark: true },
        { kind: 'act', special: 'rooms:hus', label: 'Ask the house where everything is.', req: G => G.flags.minmitDone && !G.flags.husDone, next: 'a7_rooms', mark: true },
        { kind: 'go', label: 'Look in your own coat pocket.', req: G => G.flags.husDone && !G.flags.Akey, next: 'a7_key', mark: true },
        { kind: 'go', label: 'Answer Skabet: what are you wearing?', req: G => G.flags.Adone && G.flags.Bdone && G.flags.Cdone && !G.flags.Fdone, next: 'f7_1', mark: true },
        { kind: 'reply', once: true, da: 'Har du set min jakke?', ok: [{ say: 'skab', da: 'Din jakke? Du har en frakke på. Og den er alt for stor.', en: 'Your jacket? You are wearing a coat. And it is far too big.' }] },
        { kind: 'go', special: 'wardrobe', label: 'Look at yourself in the hall mirror.' },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    a7_called: { bg: 'gang3', npc: 'skab', title: 'Gangen',
      steps: [
        { n: G => (G.flags.minmitScore || 0) >= 6 ? 'Hanger after hanger swoops down, hooks itself onto the rail and hangs there, panting, with its thing on it.' : 'Most of the hangers come home. Two circle the lamp a while longer, out of pride.' },
        { say: 'skab', da: 'Tak. Men min nøgle er stadig væk. Uden den kan jeg ikke åbne mig selv.', en: 'Thanks. But my key is still gone. Without it I can’t open myself.' },
        { say: 'skab', da: 'Spørg huset. Huset ved, hvor alting ligger.', en: 'Ask the house. The house knows where everything is.' },
        { fx: { resp: 1 } },
      ],
      opts: [{ kind: 'go', label: 'Back.', next: 'gang_hub' }] },
    a7_rooms: { bg: 'gang3', npc: 'skab', title: 'Gangen',
      steps: [
        { n: 'Every room has reported in. The umbrella is in the attic, the wallet is in a vacuum cleaner, the toothbrush is in the kitchen for reasons of its own.' },
        { th: 'Not one room has seen the key. The key is the only thing in Deroppe that nobody has seen.' },
        { say: 'skab', da: 'Har du kigget i din egen lomme?', en: 'Have you looked in your own pocket?' },
        { fx: { resp: 1 } },
      ],
      opts: [{ kind: 'go', label: 'Back.', next: 'gang_hub' }] },
    a7_key: { bg: 'gang3', npc: 'skab', title: 'Gangen',
      steps: [
        { n: 'The coat has an inside pocket you had not noticed. It is deep. Deeper than a pocket should be. At the very bottom, something small and cold.' },
        { glimpse: 'lomme' },
        { say: 'skab', da: 'Min nøgle! Hvor har du fået den fra?', en: 'My key! Where did you get it from?' },
        { fx: { flag: 'Akey' } },
      ],
      opts: [
        { kind: 'reply', group: 'k', da: 'Den lå i min frakke.', ok: [{ say: 'skab', da: 'I din frakke? Nå.', en: 'In your coat? Huh.' }, { th: 'Its keyhole narrows for a second, as if it were remembering something it had decided not to.' }], next: 'a7_open' },
        { kind: 'reply', group: 'k', da: 'Det ved jeg ikke.', ok: [{ say: 'skab', da: 'Nå. Det er lige meget.', en: 'Oh well. It doesn’t matter.' }], next: 'a7_open' },
      ] },
    a7_open: { bg: 'gang3', npc: 'skab', title: 'Gangen',
      steps: [
        { n: 'You turn the key. Skabet sighs from top to bottom, and its doors swing open.' },
        { n: 'Out tumbles everything the house ever lost: socks, scarves, a trumpet, six umbrellas, a smaller wardrobe that runs off down the hall.' },
        { say: 'skab', da: 'Endelig! Nu kan du låne noget, hvis du vil.', en: 'Finally! Now you can borrow something, if you like.' },
      ],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'end', label: 'Say you can’t find your own clothes.', build: { en: 'I can’t find my own clothes.', origin: 'egne', answers: [['Jeg', 'kan', 'ikke', 'finde', 'mit', 'eget', 'tøj.']], tiles: ['Jeg', 'kan', 'ikke', 'finde', 'mit', 'eget', 'tøj.', 'min', 'egen', 'mine'] },
          ok: [{ n: 'Skabet goes quiet, and digs.' }], fail: [{ n: 'A sleeve gets in your mouth halfway through. Skabet hears “eget” and starts digging anyway.' }], next: 'a7_egen' },
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'end', label: 'Ask if it needs its hat today.', build: { en: 'Do you need your hat today?', answers: [['Skal', 'du', 'bruge', 'din', 'hue', 'i', 'dag?']], tiles: ['Skal', 'du', 'bruge', 'din', 'hue', 'i', 'dag?', 'dit', 'bruger'] },
          ok: [{ say: 'skab', da: 'Nej, det tror jeg ikke. Så bare tag min.', en: 'No, I don’t think so. Then just take mine.' }], fail: [{ n: 'A loose umbrella opens between you mid-question. Skabet answers anyway.' }, { say: 'skab', da: 'Min hue? Nej. Så bare tag den.', en: 'My hat? No. Then just take it.' }], next: 'a7_laan' },
      ] },
    a7_egen: { bg: 'gang3', npc: 'skab', title: 'Gangen',
      steps: [
        { say: 'skab', da: 'Dit eget? Vent lige … den her. Den har din form.', en: 'Your own? Wait a moment … this one. It has your shape.' },
        { n: 'A striped jumper, blue and white. It goes on over your head and fits exactly, as if it had been waiting at the back of the wardrobe for this.' },
        { fx: { wear: { krop: { k: 'troeje', c: 'stribet', p: 'blaa' } } } },
        { th: 'Skabet is already folding the next sock. You wonder how it knew your shape.' },
        { fx: { boon: 'egen', flag: 'Aegen', resp: 2 } }, { fx: { flag: 'Adone' } },
      ],
      opts: [{ kind: 'go', label: 'Leave it to its socks.', next: 'map' }] },
    a7_laan: { bg: 'gang3', npc: 'skab', title: 'Gangen',
      steps: [
        { n: 'Skabet hands you a red woolly hat from its top shelf. It smells of wardrobe, and of somebody who left in a hurry.' },
        { fx: { wear: { hoved: { k: 'hue', c: 'roed' } } } },
        { th: 'It hangs the key inside its own keyhole, to be safe, and locks nothing.' },
        { fx: { boon: 'skabhue', flag: 'Alaan', resp: 2 } }, { fx: { flag: 'Adone' } },
      ],
      opts: [{ kind: 'go', label: 'Pull the hat down over your ears. Leave.', next: 'map' }] },

    /* ===== KÆLDEREN: contract B ===== */
    b7_start: { bg: 'kaelder3', npc: 'vask', title: 'Kælderen', card: ['Kælderen', 'Vaskemaskinen sings'],
      steps: [
        { n: 'The basement. A washing machine as tall as a door, its round window full of churning socks. It hums a song with no end.' },
        { say: 'vask', da: 'Hej! Vil du ikke tage mine håndklæder med ned til mig? De ligger ude på badeværelset.', en: 'Hi! Won’t you bring my towels down to me? They are out in the bathroom.' },
        { th: 'It asks the way you would ask a waiter. The drum does not stop for a second.' },
        { fx: { flag: 'Bstart' } },
      ],
      opts: [
        { kind: 'reply', group: 'p', da: 'Jo, det skal jeg nok.', ok: [{ n: 'A thread ties itself round your finger, all by itself, in a neat knot. In Deroppe, a promise is a knot.' }, { fx: { flag: 'Bpromise', resp: 1 } }], next: 'kael_hub' },
        { kind: 'reply', group: 'p', da: 'Det kan jeg desværre ikke.', ok: [{ say: 'vask', da: 'Nå. Så spørger jeg igen i morgen. Og i overmorgen.', en: 'Oh. Then I’ll ask again tomorrow. And the day after.' }], next: 'kael_hub' },
      ] },
    kael_hub: { bg: 'kaelder3', npc: 'vask', title: 'Kælderen', hub: true,
      steps: [{ special: 'kaelLine' }],
      opts: [
        { kind: 'reply', once: true, req: G => !G.flags.Bpromise, da: 'Jo, det skal jeg nok. Jeg henter dine håndklæder.', ok: [{ n: 'A thread ties itself round your finger in a neat knot.' }, { fx: { flag: 'Bpromise', resp: 1 } }] },
        { kind: 'go', label: 'Give her the towels.', req: G => G.flags.gotTowels && !G.flags.Bdone, next: 'b7_back', mark: true },
        { kind: 'reply', once: true, da: 'Hvad vasker du i dag?', ok: [{ say: 'vask', da: 'Alt. Sokker, tørklæder, en hue og et par gamle ord.', en: 'Everything. Socks, scarves, a hat and a couple of old words.' }] },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    b7_back: { bg: 'kaelder3', npc: 'vask', title: 'Kælderen',
      steps: [
        { n: 'You drop the towels into her open mouth. The knot on your finger unties itself and falls off, satisfied.' },
        { say: 'vask', da: 'Tak skal du have! Du holder, hvad du lover.', en: 'Thank you! You keep your promises.' },
        { n: 'Her drum slows and stops, which it never does, and turns its window toward you. She sniffs.' },
        { say: 'vask', da: 'Skal du bruge din frakke i aften? Den lugter af gammelt.', en: 'Do you need your coat tonight? It smells of old.' },
      ],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'v', label: 'Say no: she can just take it.', build: { en: 'No, you can just take it.', answers: [['Nej,', 'du', 'kan', 'bare', 'tage', 'den.']], tiles: ['Nej,', 'du', 'kan', 'bare', 'tage', 'den.', 'det', 'tag', 'dem'] },
          ok: [{ n: 'You take the coat off. It is the first time since the parcel.' }], fail: [{ n: 'The sentence comes out in pieces. She takes the coat anyway, gently, the way you take a blanket off somebody asleep.' }], next: 'b7_vask' },
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'v', label: 'Say yes, you need it. It is yours.', build: { en: 'Yes, I do. It is mine.', answers: [['Ja,', 'det', 'skal', 'jeg.', 'Den', 'er', 'min.']], tiles: ['Ja,', 'det', 'skal', 'jeg.', 'Den', 'er', 'min.', 'mit', 'gør'] },
          ok: [{ say: 'vask', da: 'Nå, men så behold den.', en: 'Well, then keep it.' }], fail: [{ say: 'vask', da: 'Din? Nå. Så behold den.', en: 'Yours? Huh. Then keep it.' }], next: 'b7_behold' },
      ] },
    b7_vask: { bg: 'kaelder3', npc: 'vask', title: 'Kælderen',
      steps: [
        { n: 'The coat goes round and round with the socks. It comes out warm, pink at the cuffs, and a little smaller.' },
        { fx: { wear: { frakke: { k: 'frakke', c: 'graa', fit: 'lidt' } } } },
        { n: 'Before you put it back on, you read the collar for the first time.' }, { glimpse: 'maerke' },
        { th: 'Still too big. Less too big.' },
        { fx: { boon: 'vasket', flag: 'Bvask', resp: 2 } }, { fx: { flag: 'Bdone' } },
      ],
      opts: [{ kind: 'go', label: 'Put the warm coat on. Leave.', next: 'map' }] },
    b7_behold: { bg: 'kaelder3', npc: 'vask', title: 'Kælderen',
      steps: [
        { n: 'She ties a new knot of thread round your finger, a small one, for keeping things.' },
        { n: 'When you pull the coat tighter, the collar turns out, and you read it for the first time.' }, { glimpse: 'maerke' },
        { fx: { boon: 'knude', flag: 'Bbehold', resp: 2 } }, { fx: { flag: 'Bdone' } },
      ],
      opts: [{ kind: 'go', label: 'Leave her to her song.', next: 'map' }] },

    /* ===== BADEVÆRELSET ===== */
    bad_hub: { bg: 'bad3', title: 'Badeværelset', hub: true,
      steps: [{ special: 'badLine' }],
      opts: [
        { kind: 'act', special: 'boxes:retning', label: 'Catch the towels: say where they are, and where you are going.', req: G => G.flags.Bpromise && !G.flags.gotTowels, next: 'b7_towels', mark: true },
        { kind: 'go', label: 'Look in the mirror.', req: G => !G.glimpses.includes('spejl'), next: 'bad_spejl' },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    b7_towels: { bg: 'bad3', title: 'Badeværelset',
      steps: [{ n: 'You stand there with an armful of towels, still warm from flying.' }, { th: 'Down to the basement, then. You promised.' }, { fx: { flag: 'gotTowels', resp: 1 } }],
      opts: [{ kind: 'go', label: 'Back.', next: 'bad_hub' }] },
    bad_spejl: { bg: 'bad3', title: 'Badeværelset',
      steps: [{ n: 'The mirror over the sink is fogged right to the edges.' }, { glimpse: 'spejl' }],
      opts: [{ kind: 'go', label: 'Step back.', next: 'bad_hub' }] },

    /* ===== STUEN: contract C ===== */
    c7_start: { bg: 'stue3', npc: 'stoev', title: 'Stuen', card: ['Stuen', 'something is roaring'],
      steps: [
        { n: 'The living room. A vacuum cleaner is racing round the coffee table with its nozzle in the air, roaring, eating everything on the floor.' },
        { say: 'stoev', da: 'Jeg er på vej ind i stuen! Jeg er på vej ind i stuen!', en: 'I am on my way into the living room! I am on my way into the living room!' },
        { th: 'It is in the living room. It has been in the living room for weeks. Everybody keeps telling it where it is going.' },
        { fx: { flag: 'Cstart' } },
      ],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 10, group: 's', label: 'Tell it where it is.', build: { en: 'You are in the living room.', answers: [['Du', 'er', 'inde', 'i', 'stuen.'], ['Du', 'er', 'i', 'stuen.']], tiles: ['Du', 'er', 'inde', 'i', 'stuen.', 'ind', 'på'] },
          ok: [{ n: 'It stops dead. The roar winds down like a record.' }], fail: [{ n: 'You trip over the hose in the middle of it. It hears “i stuen”, looks round, and brakes so hard its bag pops open.' }], next: 'c7_stop' },
        { kind: 'go', group: 's', label: 'Get out of its way.', next: 'map' },
      ] },
    stue_hub: { bg: 'stue3', npc: G => G.flags.Cfind ? null : 'stoev', title: 'Stuen', hub: true,
      steps: [{ special: 'stueLine' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 10, label: 'Tell it where it is.', req: G => !G.flags.Cstop, build: { en: 'You are in the living room.', answers: [['Du', 'er', 'inde', 'i', 'stuen.'], ['Du', 'er', 'i', 'stuen.']], tiles: ['Du', 'er', 'inde', 'i', 'stuen.', 'ind', 'på'] },
          ok: [{ n: 'It stops dead. The roar winds down like a record.' }], fail: [{ n: 'A cushion flies between you. It hears “stuen”, looks round, and brakes.' }], next: 'c7_stop', mark: true },
        { kind: 'act', special: 'hunt:stue', label: 'Find the house’s lost things in the pile.', req: G => G.flags.Cstop && !G.flags.huntDone7, next: 'c7_found', mark: true },
        { kind: 'reply', once: true, req: G => G.flags.Cro, da: 'Er du glad for at bo her?', ok: [{ say: 'stoev', da: 'Ja, det er jeg. Nu er jeg her jo.', en: 'Yes, I am. I am here now, after all.' }] },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    c7_stop: { bg: 'stue3', npc: 'stoev', title: 'Stuen',
      steps: [
        { n: 'Støvsugeren shudders, hiccups, and coughs up everything it has swallowed in weeks: a whole carpet of lost things.' },
        { say: 'stoev', da: 'Undskyld. Jeg var på vej. Jeg var altid på vej.', en: 'Sorry. I was on my way. I was always on my way.' },
        { fx: { flag: 'Cstop', resp: 1 } },
      ],
      opts: [{ kind: 'act', special: 'hunt:stue', label: 'Find the house’s lost things in the pile.', next: 'c7_found' }] },
    c7_found: { bg: 'stue3', npc: 'stoev', title: 'Stuen',
      steps: [
        { n: 'You sort the pile into little heaps: keys, a wallet, glasses, headphones, a watch, a phone. Each heap shivers when you name it.' },
        { fx: { flag: 'huntDone7', sk: 3 } },
        { say: 'stoev', da: 'Hvad skal jeg nu lave? Jeg er ikke på vej nogen steder.', en: 'What am I supposed to do now? I am not on my way anywhere.' },
      ],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'c', label: 'Tell it it can stay in the living room.', build: { en: 'You can stay in the living room.', answers: [['Du', 'kan', 'blive', 'inde', 'i', 'stuen.'], ['Du', 'kan', 'blive', 'i', 'stuen.']], tiles: ['Du', 'kan', 'blive', 'inde', 'i', 'stuen.', 'ind', 'bliver'] },
          ok: [{ n: 'It parks by the coffee table and folds its hose.' }], fail: [{ n: 'A loose sock flies into your mouth halfway. Støvsugeren hears “blive” and settles down anyway.' }], next: 'c7_ro' },
        { kind: 'say', stat: 'SPROG', dc: 11, group: 'c', label: 'Tell it it can help you find things.', build: { en: 'You can help me find things.', answers: [['Du', 'kan', 'hjælpe', 'mig', 'med', 'at', 'finde', 'ting.']], tiles: ['Du', 'kan', 'hjælpe', 'mig', 'med', 'at', 'finde', 'ting.', 'til', 'finder'] },
          ok: [{ n: 'Its nozzle swings up, sniffing.' }], fail: [{ n: 'The sentence gets tangled in the hose. Støvsugeren hears “finde” and that is all it needs.' }], next: 'c7_find' },
      ] },
    c7_ro: { bg: 'stue3', npc: 'stoev', title: 'Stuen',
      steps: [
        { n: 'Støvsugeren goes quiet. The house hears itself think for the first time in weeks.' },
        { th: 'Somewhere a clock ticks. It had been ticking all along.' },
        { fx: { boon: 'stoev', flag: 'Cro', resp: 2 } }, { fx: { flag: 'Cdone' } },
      ],
      opts: [{ kind: 'go', label: 'Tiptoe out.', next: 'map' }] },
    c7_find: { bg: 'stue3', title: 'Stuen',
      steps: [
        { n: 'Støvsugeren follows you out of the living room, at a respectful distance, pointing its nozzle at things under furniture.' },
        { th: 'A coin rolls out from under the rug and stops at your foot. Then another.' },
        { fx: { boon: 'fund', flag: 'Cfind', resp: 2 } }, { fx: { flag: 'Cdone' } },
      ],
      opts: [{ kind: 'go', label: 'Pick up the coins. Leave.', fx: { sk: 2 }, next: 'map' }] },

    /* ===== KØKKENET ===== */
    koek_hub: { bg: 'koekken3', npc: 'koel', title: 'Køkkenet', hub: true, quest: ['S1'],
      steps: [{ special: 'koekLine' }],
      opts: [
        { kind: 'act', special: 'boxes:dedem', label: 'Help Køleskabet count its things: den, det, de or dem?', req: G => !G.flags.dedemDone, next: 'koek_counted', mark: true },
        { kind: 'reply', once: true, da: 'Har du set min jakke?', ok: [{ say: 'koel', da: 'Din jakke? Nej. Jeg har kun set kolde ting.', en: 'Your jacket? No. I have only seen cold things.' }] },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    koek_counted: { bg: 'koekken3', npc: 'koel', title: 'Køkkenet',
      steps: [{ say: 'koel', da: 'Tre æg, en ost og en gammel citron. Og alle de andre ting. Nu kan jeg finde dem.', en: 'Three eggs, a cheese and an old lemon. And all the other things. Now I can find them.' }, { fx: { sk: 3, resp: 1 } }],
      opts: [{ kind: 'go', label: 'Back.', next: 'koek_hub' }] },

    /* ===== SOVEVÆRELSET: your bed ===== */
    sove_hub: { bg: 'sove3', title: 'Soveværelset', hub: true, idle: true, home: true,
      steps: [{ special: 'soveLine' }],
      opts: [
        { kind: 'go', label: 'Look under the bed.', req: G => !G.glimpses.includes('sok'), next: 'sove_sok' },
        { kind: 'go', special: 'selfPlate', label: 'Look at yourself.' },
        { kind: 'go', label: 'Sleep. Let the marks settle.', next: 'sleep' },
        { kind: 'go', label: 'Go out.', next: 'map' },
      ] },
    sove_sok: { bg: 'sove3', title: 'Soveværelset',
      steps: [{ n: 'Under the bed: dust, a button, and one sock.' }, { glimpse: 'sok' }],
      opts: [{ kind: 'go', label: 'Put it on.', next: 'sove_hub' }] },

    /* ===== LOFTET: not yet ===== */
    loft7: { bg: 'loft3', title: 'Loftet', card: ['Loftet', 'oppe under taget'],
      steps: [
        { n: 'The attic door opens a hand’s width and sticks. Behind it, furniture is piled to the roof, breathing dust.' },
        { n: 'Something red and full of drawers is leaning on the door from the inside. On purpose.' },
        { n: 'On a nail by the door, a coat hanger.' }, { glimpse: 'boejle' },
      ],
      opts: [{ kind: 'go', label: 'Close the door.', next: 'map' }] },
    loft7b: { bg: 'loft3', title: 'Loftet',
      steps: [{ n: 'The attic door is still stuck. On the other side, something is humming an opinion about a lamp.' }],
      opts: [{ kind: 'go', label: 'Leave it for now.', next: 'map' }] },

    /* ===== GARAGEN (here only once) ===== */
    garage7: { bg: 'garage3', npc: 'taske', title: 'Garagen', card: ['Garagen', 'here only once'], quest: ['S2'],
      steps: [
        { n: 'The garage. A bicycle with flat tyres, and a sports bag zipping and unzipping itself, in a panic.' },
        { say: 'taske', da: 'Jeg skal pakke, men jeg ved ikke hvorfor. Hvad tager man med?', en: 'I have to pack, but I don’t know what for. What do you take along?' },
      ],
      opts: [{ kind: 'act', special: 'boxes:tagmed', label: 'Help Tasken pack.', next: 'garage7b' }] },
    garage7b: { bg: 'garage3', npc: 'taske', title: 'Garagen',
      steps: [{ say: 'taske', da: 'Tak! Nu er jeg klar. Til alt.', en: 'Thanks! Now I am ready. For everything.' }, { n: 'It rolls out of the garage on its own and is not seen again. The garage door closes behind it.' }, { fx: { flag: 'garageGone', sk: 3 } }],
      opts: [{ kind: 'go', label: 'Leave.', next: 'map' }] },

    /* ===== FINALE: Skabet writes you into the house ===== */
    f7_1: { bg: 'gang3', npc: 'skab', title: 'Gangen', card: ['Gangen', 'Skabet counts the house'],
      steps: [
        { n: 'Skabet stands with its doors wide open. Every hanger is home. It has a pencil behind one hinge.' },
        { say: 'skab', da: 'Nu skriver jeg dig ind i huset. Hvad har du på?', en: 'Now I will write you into the house. What are you wearing?' },
      ],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'w', label: 'Say you are wearing a coat, but it isn’t yours.', build: { en: 'I am wearing a coat, but it isn’t mine.', origin: 'wear3', answers: [['Jeg', 'har', 'en', 'frakke', 'på,', 'men', 'den', 'er', 'ikke', 'min.']], tiles: ['Jeg', 'har', 'en', 'frakke', 'på,', 'men', 'den', 'er', 'ikke', 'min.', 'mit', 'det', 'mine'] },
          ok: [{ say: 'skab', da: 'Ikke din? Den passer heller ikke.', en: 'Not yours? It doesn’t fit either.' }], fail: [{ n: 'Skabet’s pencil squeaks over half your words. It writes the rest by itself.' }, { say: 'skab', da: 'En frakke. Ikke din.', en: 'A coat. Not yours.' }], next: 'f7_2' },
        { kind: 'reply', group: 'w', da: 'Det ved jeg ikke.', ok: [{ say: 'skab', da: 'Så skriver jeg: en grå frakke, alt for stor.', en: 'Then I will write: a grey coat, far too big.' }], next: 'f7_2' },
      ] },
    f7_2: { bg: 'gang3', npc: 'skab', title: 'Gangen',
      steps: [{ say: 'skab', da: 'Og hvor er dine egne ting?', en: 'And where are your own things?' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'e', label: 'Say your own things are gone.', build: { en: 'My own things are gone.', answers: [['Mine', 'egne', 'ting', 'er', 'væk.']], tiles: ['Mine', 'egne', 'ting', 'er', 'væk.', 'egen', 'eget', 'min'] },
          ok: [{ say: 'skab', da: 'Væk. Det skriver jeg. Alle de andre ting her var også væk engang.', en: 'Gone. I will write that. All the other things here were gone once too.' }], fail: [{ say: 'skab', da: 'Væk. Det kender jeg.', en: 'Gone. I know that feeling.' }], next: 'f7_3' },
        { kind: 'reply', group: 'e', da: 'Det ved jeg ikke.', ok: [{ say: 'skab', da: 'Det er der mange, der ikke ved.', en: 'Lots of people don’t know that.' }], next: 'f7_3' },
      ] },
    f7_3: { bg: 'gang3', npc: 'skab', title: 'Gangen',
      steps: [{ say: 'skab', da: 'Vil du ikke passe på huset i nat? Jeg skal sove.', en: 'Won’t you look after the house tonight? I need to sleep.' }],
      opts: [
        { kind: 'reply', group: 'l', da: 'Jo, det skal jeg nok.', ok: [{ fx: { origin: { promise3: 'Jo, det skal jeg nok.' } } }, { n: 'A knot ties itself round your finger. This one is for the whole house.' }, { fx: { resp: 1 } }], next: 'f7_end' },
        { kind: 'reply', group: 'l', da: 'Det kan jeg desværre ikke.', ok: [{ say: 'skab', da: 'Så passer huset på sig selv. Det er det ikke så god til.', en: 'Then the house looks after itself. It isn’t very good at that.' }], next: 'f7_end' },
      ] },
    f7_end: { bg: 'gang3', npc: 'skab', title: 'Gangen',
      steps: [
        { special: 'registerEcho' },
        { n: 'Skabet writes you on the inside of its door, in pencil, between a sock and an umbrella.' },
        { say: 'skab', da: 'Så. Nu bor du deroppe. Godnat.', en: 'There. Now you live up here. Good night.' },
        { fx: { flag: 'Fdone', resp: 1 } },
      ],
      opts: [{ kind: 'go', label: 'Go up to bed.', next: 'f7_night' }] },
    f7_night: { bg: 'sove3', title: 'Soveværelset', night: true, card: ['Natlager', 'the house sleeps'],
      steps: [
        { n: 'That night the coat hangs on the bedpost, still too big, breathing slowly.' },
        { n: 'Its label has changed. It does not say “Hvad har du på?” any more. It says: “Hvor har du købt den henne?”' },
        { n: 'Far below the window, a whole street switches its lights on at once. Every shop window in it says the same word: UDSALG.' },
      ],
      opts: [{ kind: 'go', label: 'End the lesson.', next: 'end' }] },
  },
});
