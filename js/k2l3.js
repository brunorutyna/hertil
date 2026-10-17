/* =========================================================================
   HERTIL · Kapitel 2 · Lektion 3 — "Kan vi flytte vores aftale?"   (Derhenne · ends Kapitel 2)
   Book 2.3: calling in sick, cancelling and moving appointments (Vil du ikke aflyse …? – Jo, det skal jeg nok),
   modal verbs in requests and short answers, på + weekday / om + weekday-en, dates (den tredje august),
   clock times (halv ti, kvart over, kvart i), ned / nede, op / oppe, ind / inde, hen / henne, hjem / hjemme,
   tror or synes.
   Physics: Kalenderen has eaten the week, so every appointment in Derhenne has come loose. A direction word
   (ned, op, hjem) keeps a creature moving until somebody says where it IS (nede, oppe, hjemme).
   Chapter reveal (spoilers, never tell Bruno): everyone has an appointment with Chefen, and Chefen is an empty
   chair on a floor not on the board. Its only appointment is with the player, made before Hertil.
   The letter "Hvad laver du?" was a reminder. Endings: keep it (sit), move it (om et år), or cancel it (move on).
   ========================================================================= */

SESSIONS.k2l3 = Object.assign({}, D2, {
  id: 'k2l3', order: 6, short: 'K2 · Lektion 3', prevSession: 'k2l2', nextSession: null, title: 'Lektion 3 · Kan vi flytte vores aftale?', en: 'Can we move our appointment?',
  blurb: 'Every appointment in Derhenne has come loose. Somebody important cannot be found. And you have a cold.',
  start: 'p6_wake', home: 'koeje', travelAfter: 'p6seen', cluesFlag: 'clues6', cluesNeed: 3, dcMod: 4,
  startState: { resp: 6, sk: 12, insp: 1, boons: ['anker', 'hue', 'kompas'], statXP: { SPROG: 20, LOEGN: 6, SNIGE: 8, HANDEL: 6, INDSIGT: 15 },
    origin: { reason: 'Jeg kom hertil på grund af en lyd.', work: 'Jeg læser til arkitekt på universitetet.', colleague: 'Jeg har en kollega, der altid kommer for sent.' }, met: ['stempel', 'elevator', 'kran', 'arkiv', 'kantine', 'blyant', 'vejleder', 'knage', 'holdet', 'rygtet'] },

  locations: {
    chef:      { name: 'Øverste etage', en: 'a floor not on the board', x: 26, y: 9, bg: 'chef', icon: 'stol', req: G => G.flags.topOpen, entry: G => 'f6_top' },
    taget:     { name: 'Taget', en: 'Kranen, waiting for a meeting', x: 74, y: 9, bg: 'tag', icon: 'kran', entry: G => 'tag6_hub' },
    kontoret:  { name: 'Kontoret', en: '4. sal · Kalenderen eats days', x: 26, y: 23, bg: 'kontor', icon: 'kalender2', entry: G => !G.flags.Astart ? 'a6_start' : 'kal_hub' },
    bar:       { name: 'Fredagsbaren', en: 'only once, only on a Friday', x: 26, y: 37, bg: 'kantine', icon: 'kop', eph: true, req: G => G.flags.modalDone && !G.flags.barGone, entry: G => 'bar6' },
    halve:     { name: 'Den halve sal', en: '3. sal', x: 74, y: 37, bg: 'halv', icon: 'mursten', entry: G => 'halv6_hub' },
    skolen:    { name: 'Skolen', en: '2. sal · Holdet makes plans', x: 26, y: 51, bg: 'skole', icon: 'tavle', entry: G => 'skole6_hub' },
    koeje:     { name: 'Køjerne', en: '1. sal · your bunk', x: 74, y: 65, bg: 'koeje', icon: 'seng', night: true, entry: G => 'koeje6_hub' },
    porten:    { name: 'Porten', en: 'stuen · Telefonen rings', x: 26, y: 79, bg: 'port', icon: 'telefon', entry: G => !G.flags.Bstart ? 'b6_start' : 'tel_hub' },
    kantinen:  { name: 'Kantinen', en: 'kælderen · always open', x: 74, y: 92, bg: 'kantine', icon: 'kantine', night: true, entry: G => 'kant6_hub' },
  },

  ending: G => [G.flags.Crest ? 'Sygedag' : G.flags.Chome ? 'Hjemmearbejde' : null,
    G.flags.Fchef ? 'Chefen' : G.flags.Fmove ? 'Om et år' : G.flags.Fcancel ? 'Aflyst' : null].filter(Boolean).join(' · ') || '—',
  carryFlags: ['Crest', 'Chome', 'Fchef', 'Fmove', 'Fcancel'],
  chapterEnd: ['Kapitel 2 · Arbejde & uddannelse', 'Kapitel 2 er slut', 'You have a job, colleagues, and an answer to an old appointment. Next: Kapitel 3, somewhere new.'],

  quests: {
    A: { title: 'Mødet', en: 'The meeting', obj: [['Find a time when everybody can (Kontoret)', 'moedeDone'], ['Put Kalenderen’s dates back', 'datoerDone'], ['Read the page Kalenderen could not eat', 'Adone']] },
    B: { title: 'Hvor er Chefen henne?', en: 'Where is the boss?', obj: [['Find out where everybody is (Porten)', 'hvorDone'], ['Help Telefonen tell tror from synes', 'trorsynesDone'], ['Find the way to Chefen (after Kalenderen’s last page, and your sick call)', 'Bdone']] },
    C: { title: 'Syg', en: 'Ill', obj: [['Call in sick from your bunk', 'Cdone']] },
    F: { title: 'Aftalen', en: 'The appointment', obj: [['Go to the floor that is not on the board', 'Fdone']] },
    S1: { title: 'Kantinens ur', en: 'The canteen clock', side: true, obj: [['Read the canteen clock', 'clockDone']] },
    S2: { title: 'Holdets planer', en: 'The class makes plans', side: true, obj: [['Answer the class the short way', 'modalDone']] },
    S3: { title: 'Spor', en: 'Traces', side: true, obj: [['Find three traces of what you were', 'clues6']] },
  },

  glimpses: {
    side: { name: 'Den ældste side', en: 'The oldest page', text: 'At the back of Kalenderen, a page it has never managed to eat. One appointment. No name: just a shape, drawn in pencil. Your shape.' },
    stemme: { name: 'Stemmen', en: 'The voice', text: 'On the line from the top floor there is nobody, only an old message on a loop. A voice says a name. It is not a name you know. You turn round anyway.' },
    stol: { name: 'Stolen', en: 'The chair', text: 'The seat of the empty chair is worn in exactly your shape. Somebody sat here every day, a long time ago, and looked out of that window, waiting for a meeting.' },
    droem: { name: 'Feberdrømmen', en: 'The fever dream', text: 'In the fever you dream of a desk, a window full of sky, and a cup with a brown ring. Somebody knocks. You do not answer. The knocking stops.' },
  },

  letters: {
    gammel: { title: 'En gammel aftale', lines: ['Møde på øverste etage.', 'Dato: (spist).', 'Klokken: halv ti.', 'Med: dig.', 'Husk det. Hvad laver du?'],
      qs: [{ q: 'Who is the meeting with?', opts: ['With you.', 'With Kranen.', 'With Kalenderen.'], a: 0 }, { q: 'At what time?', opts: ['9.30', '10.30', '8.45'], a: 0 }] },
  },

  calendars: {
    moede: { title: 'Mødet', q: 'Hvornår kan alle?', hint: 'Tap a time. Everybody answers. A “no” often rules out more than one time.', flag: 'moedeDone',
      days: ['mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag'], times: [['klokken ni', '9.00'], ['halv elleve', '10.30'], ['klokken et', '13.00'], ['kvart over tre', '15.15']],
      who: [
        { npc: 'kran', color: '#00838a', busy: [{ d: 0, why: 'Om mandagen bygger jeg på taget hele dagen.' }, { t: 0, why: 'Jeg kommer aldrig før klokken ti.' }, { d: 3, t: 2, why: 'Jeg skal til tandlæge på torsdag klokken et.' }] },
        { npc: 'kantine', color: '#ff3b30', busy: [{ t: 2, why: 'Klokken et laver jeg frokost. Hver dag.' }, { d: 4, why: 'Om fredagen gør jeg rent i køkkenet.' }, { d: 1, t: 1, why: 'På tirsdag, halv elleve, kommer der mælk.' }] },
        { npc: 'vejleder', color: '#ffb511', busy: [{ d: 2, why: 'Om onsdagen underviser jeg hele dagen.' }, { d: 1, t: 3, why: 'Jeg skal på kursus på tirsdag eftermiddag.' }, { d: 3, t: 1, why: 'På torsdag, halv elleve, har jeg møde med Holdet.' }] },
      ] },
  },

  whereis: {
    hvor: { title: 'Hvor er de henne?', flag: 'hvorDone',
      good: 'Telefonen rings everybody in the right place at once. Eight creatures pick up. It is very loud and very satisfying.', meh: 'Telefonen rings a few creatures in the wrong place. A sock answers in the canteen.',
      floors: [['tag', 'Taget'], ['k4', '4. sal'], ['k3', '3. sal'], ['k2', '2. sal'], ['kantine', 'Kantinen'], ['hjem', 'Hjemme']],
      rounds: [
        { npc: 'kran', clue: 'Kranen er på vej op på taget.', floor: 'tag', moving: true, why: 'på vej op: a direction. He is still on his way up.' },
        { npc: 'kantine', clue: 'Kantinen er nede i kantinen, som altid.', floor: 'kantine', moving: false, why: 'nede: a place. She is already there.' },
        { npc: 'vejleder', clue: 'Vejlederen er på vej ned i kantinen for at spise frokost.', floor: 'kantine', moving: true, why: 'på vej ned: still moving.' },
        { npc: 'arkiv', clue: 'Arkivet er inde hos Knagen på fjerde sal.', floor: 'k4', moving: false, why: 'inde hos: a place. hos goes with the place forms.' },
        { npc: 'knage', clue: 'Knagen var på fjerde sal for lidt siden. Nu er den på vej ud på altanen på tredje sal.', floor: 'k3', moving: true, why: 'på vej ud: a direction, still moving.' },
        { npc: 'blyant', clue: 'Blyanten arbejder hjemme i dag.', floor: 'hjem', moving: false, why: 'hjemme: at home, a place.' },
        { npc: 'holdet', clue: 'Holdet er på vej hjem.', floor: 'hjem', moving: true, why: 'på vej hjem: still on the way.' },
        { npc: 'stempel', clue: 'Stemplet er på vej ind til Holdet på anden sal.', floor: 'k2', moving: true, why: 'ind til: a direction. til goes with the direction forms.' },
      ] },
  },

  clockGame: { title: 'Kantinens ur', flag: 'clockDone', ask: 'Hvad er klokken?', good: 'Kantinen serves lunch exactly on time. Nobody has ever seen that before.', meh: 'Lunch is served at some point. It is soup, so it does not matter much.',
    rounds: [[9, 30, 'halv ti'], [7, 15, 'kvart over syv'], [8, 45, 'kvart i ni'], [12, 30, 'halv et'], [2, 15, 'kvart over to'], [10, 30, 'halv elleve'], [4, 45, 'kvart i fem'], [1, 0, 'klokken et']] },

  boxes: {
    datoer: { title: 'Kalenderens sider', q: 'Hvilken dato?', boxes: ['a', 'b', 'c'],
      good: 'Every page goes back on its nail in the right order. Kalenderen burps politely.', meh: 'Most pages go back. One week now has two Tuesdays. Nobody minds a spare Tuesday.',
      items: [
        { t: 'Eksamen er den ___ juni. (3.6.)', opts: ['tredje', 'tre', 'tredive'], a: 0, why: 'A date: den + ordinal. 3. = tredje.' },
        { t: 'Vi ses den ___ august. (16.8.)', opts: ['sekstende', 'seksten', 'sjette'], a: 0, why: '16. = sekstende.' },
        { t: 'Kurset starter den ___ maj. (1.5.)', opts: ['første', 'en', 'femte'], a: 0, why: '1. = første.' },
        { t: 'Deadlinen er den ___ oktober. (31.10.)', opts: ['enogtredivte', 'enogtredive', 'tredivte'], a: 0, why: '31. = enogtredivte.' },
        { t: 'Mødet er den ___ februar. (18.2.)', opts: ['attende', 'atten', 'ottende'], a: 0, why: '18. = attende.' },
        { t: 'Festen er den ___ december. (25.12.)', opts: ['femogtyvende', 'femogtyve', 'femte'], a: 0, why: '25. = femogtyvende.' },
        { t: 'Jeg har ferie fra den ___ juli. (7.7.)', opts: ['syvende', 'syv', 'sytten'], a: 0, why: '7. = syvende.' },
        { t: 'Kan vi sige den ___ i stedet for? (2.)', opts: ['anden', 'to', 'tyvende'], a: 0, why: '2. = anden.' },
      ] },
    trorsynes: { title: 'Telefonens linje', q: 'tror eller synes?', boxes: ['tror', 'synes'],
      good: 'The line is clear. Telefonen can tell a guess from an opinion now, which is more than most phones can.', meh: 'The line crackles. Telefonen still puts a few opinions through as facts.',
      items: [
        { t: 'Hvor er Chefen? Jeg ___, han er på taget. Men jeg er ikke sikker.', a: 0, why: 'Probably a fact, not sure: tror.' },
        { t: 'Vejlederen er virkelig inspirerende, ___ jeg.', a: 1, why: 'An opinion: synes.' },
        { t: 'Jeg ___, Kantinens suppe er den bedste i Derhenne.', a: 1, why: 'A judgement: synes.' },
        { t: 'Jeg ___ ikke, Kranen er her i dag. Jeg kan ikke se ham.', a: 0, why: 'A guess about a fact: tror.' },
        { t: 'Jeg ___, det er en god idé at flytte mødet.', a: 1, why: 'An opinion: synes.' },
        { t: 'Telefonen ringer. Jeg ___, det er Stemplet.', a: 0, why: 'A guess: tror.' },
        { t: 'Jeg ___ faktisk, Knagen er lidt arrogant.', a: 1, why: 'An opinion: synes.' },
        { t: 'Jeg ___, hun kommer i morgen. Det sagde hun i går.', a: 0, why: 'You expect it is true: tror.' },
      ] },
    modal: { title: 'Holdets planer', q: 'Hvad svarer man?', boxes: ['a', 'b', 'c'],
      good: 'The class makes every plan in record time. It has never had so many appointments.', meh: 'The class makes most of its plans. Two chairs are now meeting each other twice.',
      items: [
        { t: 'Kan vi flytte mødet? – Ja, det ___ vi godt.', opts: ['kan', 'gør', 'vil'], a: 0, why: 'Repeat the modal from the question: kan.' },
        { t: 'Vil du med i kantinen? – Det ___ jeg desværre ikke.', opts: ['kan', 'vil', 'gør'], a: 0, why: 'Saying no to an invitation: kan.' },
        { t: 'Vil du ikke aflyse mit møde? – Jo, det ___ jeg nok.', opts: ['skal', 'gør', 'er'], a: 0, why: 'A promise: skal nok.' },
        { t: 'Vil du med op på taget? – Ja, det ___ jeg gerne.', opts: ['vil', 'gør', 'er'], a: 0, why: 'Repeat vil: det vil jeg gerne.' },
        { t: 'Kan du på fredag? – Nej, det ___ jeg ikke.', opts: ['kan', 'gør', 'er'], a: 0, why: 'Repeat kan.' },
        { t: 'Skal du til møde? – Ja, det ___ jeg.', opts: ['skal', 'gør', 'er'], a: 0, why: 'Repeat skal.' },
        { t: 'Vil du ikke med? – ___, det vil jeg gerne.', opts: ['Jo', 'Ja', 'Nej'], a: 0, why: 'Yes to a question with ikke: jo.' },
        { t: 'Kan vi sige på torsdag i stedet for? – Ja, det ___ i orden.', opts: ['er', 'kan', 'gør'], a: 0, why: 'A fixed phrase: Det er i orden.' },
      ] },
  },

  travel: [
    { id: 'blad6', bg: 'gang', steps: [{ n: 'A loose calendar page is running down the corridor on its corners. It says ONSDAG. It is trying to get back to the week.' }],
      opts: [{ kind: 'act', stat: 'SNIGE', dc: 10, label: 'Catch it.', ok: [{ n: 'You catch Wednesday and fold it into your pocket. Later Kantinen pays you three scales for it. She has always wanted a spare Wednesday.' }, { fx: { sk: 3 } }], fail: [{ n: 'Wednesday escapes into the lift. Somewhere, a week is now missing its middle.' }], next: 'map' }, { kind: 'go', label: 'Let it go.', next: 'map' }] },
    { id: 'ring6', bg: 'gang', steps: [{ n: 'Every phone extension in the corridor rings at once. They are all ringing the same question: “Hvor er Chefen henne?”' }],
      opts: [{ kind: 'reply', group: 'r', da: 'Det ved jeg ikke.', ok: [{ n: 'All the phones hang up at once, satisfied with honesty.' }, { fx: { resp: 1 } }], next: 'map' }, { kind: 'go', group: 'r', label: 'Do not pick up.', next: 'map' }] },
    { id: 'vejl6', bg: 'gang', npc: 'vejleder', req: G => G.prev.Ainsp || G.prev.Aorg, steps: [{ n: G => G.prev.Aorg ? 'Vejlederen strides past, exactly on time for something, timetable under his arm.' : 'Vejlederen hurries past, late, talking to himself about bridges.' }, { say: 'vejleder', da: 'Kan vi flytte vores aftale? Jeg har et andet møde lige nu.', en: 'Can we move our appointment? I have another meeting right now.' }],
      opts: [{ kind: 'reply', da: 'Ja, det kan vi godt.', ok: [{ say: 'vejleder', da: 'Tak! Så siger vi om ti minutter. Eller tyve.', en: 'Thanks! Then we say in ten minutes. Or twenty.' }, { fx: { resp: 1 } }], next: 'map' }] },
    { id: 'hat6', bg: 'gang', npc: 'knage', req: G => G.prev.Bhat, steps: [{ n: 'Knagen stands in the corridor, bareheaded. It looks at your hat. It does not say “hans”. Neither do you.' }],
      opts: [{ kind: 'go', label: 'Tip the hat. Walk on.', next: 'map' }] },
    { id: 'tal6', bg: 'gang', req: G => !hasBoon('urnoegle'), steps: [{ n: 'The clock in the corridor loses its numbers. They roll down the stairs and come back as little shapes.' }, { special: 'glyphs' }], opts: [{ kind: 'go', label: 'Walk on.', next: 'map' }] },
  ],

  special: {
    async koeje6Line() { logAdd(`<p>${esc(G.flags.Crest ? 'The duvet still has the shape of your fever in it. You feel much better.' : G.flags.Chome ? 'Your bunk is an office now: a cup, a phone cord, a pile of paper on the pillow.' : 'You sneeze. Another word flies up and sticks next to the first one: MØDE.')}</p>`, 'narr'); },
    async kalLine() { logAdd(`<p>${esc(G.flags.Adone ? 'Kalenderen hangs on the wall again, digesting. Every page is back, except one.' : G.flags.moedeDone ? 'Kalenderen has spat out a pile of dates. They lie on the floor in no particular order.' : 'Kalenderen is on the floor, eating a week. You hear it crunch through Thursday.')}</p>`, 'narr'); },
    async telLine() { logAdd(`<p>${esc(G.flags.Bdone ? 'Telefonen sits quietly on the counter, for the first time ever. Its receiver is in your pocket.' : G.flags.hvorDone ? 'Telefonen knows where everybody is, except one.' : 'Telefonen rings itself, answers itself, and asks itself where everybody is.')}</p>`, 'narr'); },
    async kant6Line() { logAdd(`<p>${esc(G.flags.clockDone ? 'Lunch is on time today. Kantinen is unbearably proud.' : 'The canteen clock has no numbers, only hands. Kantinen serves lunch whenever it feels like halv et.')}</p>`, 'narr'); },
    async skole6Line() { logAdd(`<p>${esc(G.flags.modalDone ? 'The blackboard is a calendar now, full of the class’s appointments, most of them with each other.' : 'Holdet is trying to make plans. Every chair has invited every other chair to something.')}</p>`, 'narr'); },
    async tag6Line() { logAdd(`<p>${esc(G.flags.Fchef ? 'Kranen has put the last beam in place. It does not know what to do with its hook.' : G.flags.moedeDone ? 'Kranen is waiting for Thursday, quarter past three. It has written it on its cab.' : 'Kranen has a meeting with Chefen. It does not know when. It keeps looking at the sky.')}</p>`, 'narr'); },
    async halv6Line() { const p = G.prev; logAdd(`<p>${esc(p.Bwish ? 'The garden on the third floor has grown into the lift shaft. The bee is asleep in a flower.' : p.Bwhole ? 'The wall on the third floor is finished and has started reading a newspaper.' : p.Bgoing ? 'Halvdelen lays a brick, takes a break, lays another. It looks happy.' : 'The third floor is quiet. Something here was finished recently, and is still getting used to it.')}</p>`, 'narr'); },
    async look() { G.lookAt = 'stol'; setNpc('stol', 'turn'); AUDIO.sting('gaze'); await sleep(FAST ? 0 : 2600); },
    async chapterEcho2() {
      const o = G.origin, lines = [o.work, o.colleague, o.appt].filter(Boolean);
      if (!lines.length) return;
      logAdd(`<p>Stemplet reads the whole chapter back to you, from the bottom of the building. It takes ${['', 'one line', 'two lines', 'three lines'][lines.length]}.</p>`, 'narr');
      for (const l of lines) { youSaid(l); TTS.say(l); await sleep(FAST ? 0 : 900); }
      await tapOn();
    },
    async glyphs() { G.glyph = 3; AUDIO.sting('glyph'); toast('ᚦᚨᛚ · the numbers have gone strange', 'gold'); },
  },

  nodes: {
    /* ===== PROLOGUE: a cold, and loose appointments ===== */
    p6_wake: { bg: 'koeje', title: 'Køjerne', card: ['Kapitel 2 · Arbejde & uddannelse', 'Lektion 3 — Kan vi flytte vores aftale?'],
      steps: [
        { n: 'You wake up and sneeze. A word flies out of you and sticks to the ceiling: AFTALE.' },
        { th: 'Your head is full of cotton. Your nose is a tap. You are forkølet, in a building where words come out when you sneeze.' },
        { n: 'Something climbs the stairs, ringing. A phone, pulling itself up by its own curly cord.' },
        { npc: 'telefon' },
        { say: 'telefon', da: 'Kalenderen har spist ugen. Alle aftaler i Derhenne er løse. Og ingen kan finde Chefen.', en: 'Kalenderen has eaten the week. Every appointment in Derhenne has come loose. And nobody can find the boss.' },
        { say: 'telefon', da: 'Men du er syg. Så skal du melde dig syg. Det gør man her.', en: 'But you are ill. Then you have to call in sick. That is how it is done here.' },
        { fx: { quest: ['A', 'B', 'C', 'F', 'S3'], flag: 'p6seen' } },
      ],
      opts: [{ kind: 'go', label: 'Pick up the receiver.', next: 'c6_call' }, { kind: 'go', label: 'Later. Get up first.', next: 'koeje6_hub' }] },

    /* ===== KØJERNE: contract C, calling in sick ===== */
    koeje6_hub: { bg: 'koeje', title: 'Køjerne', hub: true, home: true,
      steps: [{ special: 'koeje6Line' }],
      opts: [
        { kind: 'go', label: 'Call in sick.', req: G => !G.flags.Cdone, next: 'c6_call', mark: true },
        { kind: 'go', special: 'selfPlate', label: 'Look at yourself.' },
        { kind: 'go', label: 'Sleep. Let the marks settle.', next: 'sleep' },
        { kind: 'go', label: 'Go out.', next: 'map' },
      ] },
    c6_call: { bg: 'koeje', npc: 'telefon', title: 'Køjerne', card: ['Telefonen', 'calling Porten'],
      steps: [{ n: 'Telefonen dials Porten by itself. Seven clicks, a crackle, a stamp somewhere far below.' }, { say: 'stempel', da: 'Hallo, det er Stemplet.', en: 'Hello, Stemplet speaking.' }],
      opts: [{ kind: 'say', stat: 'SPROG', dc: 10, label: 'Say you cannot come today. You are ill.',
        build: { en: 'Unfortunately I cannot come today. I am ill.', answers: [['Jeg', 'kan', 'desværre', 'ikke', 'komme', 'i', 'dag.', 'Jeg', 'er', 'syg.'], ['Jeg', 'er', 'syg.', 'Jeg', 'kan', 'desværre', 'ikke', 'komme', 'i', 'dag.']], best: [['I', 'dag', 'kan', 'jeg', 'desværre', 'ikke', 'komme.', 'Jeg', 'er', 'syg.'], ['Desværre', 'kan', 'jeg', 'ikke', 'komme', 'i', 'dag.', 'Jeg', 'er', 'syg.'], ['Jeg', 'er', 'syg.', 'I', 'dag', 'kan', 'jeg', 'desværre', 'ikke', 'komme.']], tiles: ['Jeg', 'kan', 'desværre', 'ikke', 'komme', 'i', 'dag.', 'Jeg', 'er', 'syg.', 'kommer', 'har'] },
        ok: [{ say: 'stempel', da: 'Nå, det var ikke så godt.', en: 'Oh, that is not so good.' }], fail: [{ n: 'You sneeze in the middle. A word goes down the line on its own.' }, { say: 'stempel', da: 'Nå. Det var ikke så godt.', en: 'Oh. That is not so good.' }], next: 'c6_call2' }] },
    c6_call2: { bg: 'koeje', npc: 'telefon', title: 'Køjerne',
      steps: [{ th: 'You were supposed to help Kranen lift a floor today. That will have to wait.' }],
      opts: [{ kind: 'say', stat: 'SPROG', dc: 10, label: 'Ask Stemplet to cancel your appointment with Kranen.',
        build: { en: 'Won’t you cancel my appointment with Kranen?', answers: [['Vil', 'du', 'ikke', 'aflyse', 'min', 'aftale', 'med', 'Kranen?']], tiles: ['Vil', 'du', 'ikke', 'aflyse', 'min', 'aftale', 'med', 'Kranen?', 'mit', 'aflyser'] },
        ok: [{ say: 'stempel', da: 'Jo, det skal jeg nok. God bedring!', en: 'Yes, of course I will. Get well soon!' }], fail: [{ n: 'The line crackles. Stemplet hears “aflyse” and “Kranen”. It stamps something.' }, { say: 'stempel', da: 'Jo, det skal jeg nok. God bedring.', en: 'Yes, I will. Get well.' }], next: 'c6_call3' }] },
    c6_call3: { bg: 'koeje', npc: 'telefon', title: 'Køjerne',
      steps: [{ th: 'Stemplet waits on the line. It is polite to say something now.' }],
      opts: [
        { kind: 'reply', group: 't', da: 'Tak skal du have.', ok: [{ say: 'stempel', da: 'Det var så lidt. Vi snakkes ved.', en: 'Don’t mention it. Talk soon.' }, { fx: { resp: 1 } }], next: 'c6_choice' },
        { kind: 'reply', group: 't', da: 'Hej hej.', ok: [{ say: 'stempel', da: 'Hej.', en: 'Bye.' }], next: 'c6_choice' },
      ] },
    c6_choice: { bg: 'koeje', title: 'Køjerne',
      steps: [{ n: 'Click. The cord goes slack. You are officially ill. Telefonen looks at you, waiting to see what an ill person does here.' }],
      opts: [
        { kind: 'go', group: 'c', label: 'Stay in bed all day.', next: 'c6_rest' },
        { kind: 'reply', group: 'c', da: 'Jeg arbejder hjemme i dag.', ok: [{ say: 'telefon', da: 'Hjemme? Det er her. Godt. Så ringer jeg rundt for dig.', en: 'At home? That is here. Good. Then I will ring round for you.' }], next: 'c6_home' },
      ] },
    c6_rest: { bg: 'koeje', title: 'Køjerne', pass: ['days', 'En sygedag', 'a whole shift in bed'],
      steps: [{ n: 'You pull the duvet over your head and sleep through a whole shift. The lift hums. The words you sneezed slowly peel off the ceiling.' }, { glimpse: 'droem' }, { n: 'When you wake up, the cold is gone, and the duvet refuses to be left behind.' }, { fx: { boon: 'dyne', flag: 'Crest', resp: 1, insp: 1 } }, { fx: { flag: 'Cdone' } }],
      opts: [{ kind: 'go', label: 'Get up.', next: 'map' }] },
    c6_home: { bg: 'koeje', npc: 'telefon', title: 'Køjerne',
      steps: [{ n: 'Your bunk becomes an office: a pillow full of papers, a cup, the phone cord across your knees. You work from bed, sneezing words into your notes.' }, { th: 'It is not restful. It is surprisingly useful. Everybody you call is somewhere you did not expect.' }, { fx: { flag: 'Chome', resp: 2, sk: 4 } }, { fx: { flag: 'Cdone' } }],
      opts: [{ kind: 'go', label: 'Blow your nose. Go out.', next: 'map' }] },

    /* ===== KONTORET: contract A, Kalenderen ===== */
    a6_start: { bg: 'kontor', npc: 'kalender', title: 'Kontoret', card: ['Kontoret', '4. sal · Kalenderen eats days'],
      steps: [
        { n: 'The calendar has climbed down off the wall. It is on the floor, eating its own pages. Mandag. Tirsdag. A whole week in a mouthful.' },
        { say: 'kalender', da: 'Alle har en aftale med Chefen. Ingen ved hvornår. Jeg har spist datoerne.', en: 'Everybody has an appointment with the boss. Nobody knows when. I have eaten the dates.' },
        { say: 'kalender', da: 'Kranen, Kantinen og Vejlederen skal holde møde først. Find en tid, hvor alle kan.', en: 'Kranen, Kantinen and Vejlederen have to meet first. Find a time when everybody can.' },
        { fx: { flag: 'Astart' } },
      ],
      opts: [{ kind: 'act', special: 'calendar:moede', label: 'Find a time when everybody can.', next: 'a6_set' }] },
    a6_set: { bg: 'kontor', npc: 'kalender', title: 'Kontoret',
      steps: [
        { n: G => (G.flags.moedeProps || 9) <= 4 ? 'Torsdag, kvart over tre. You found it in a few tries. Kalenderen looks at you with something like respect, and something like hunger.' : 'Torsdag, kvart over tre. It took a while. Kalenderen ate two of your suggestions while you were thinking.' },
        { say: 'kalender', da: 'Det skriver jeg. Men først skal datoerne tilbage. Jeg har spyttet dem ud.', en: 'I will write that. But first the dates have to go back. I have spat them out.' },
        { fx: { resp: 1 } },
      ],
      opts: [{ kind: 'go', label: 'Look at the pile of dates.', next: 'kal_hub' }] },
    kal_hub: { bg: 'kontor', npc: 'kalender', title: 'Kontoret', hub: true,
      steps: [{ special: 'kalLine' }],
      opts: [
        { kind: 'act', special: 'calendar:moede', label: 'Find a time when everybody can.', req: G => !G.flags.moedeDone, next: 'a6_set', mark: true },
        { kind: 'act', special: 'boxes:datoer', label: 'Put the dates back in order.', req: G => G.flags.moedeDone && !G.flags.datoerDone, next: 'a6_dates', mark: true },
        { kind: 'go', label: 'Ask about the page it could not eat.', req: G => G.flags.datoerDone && !G.flags.Adone, next: 'a6_page', mark: true },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    a6_dates: { bg: 'kontor', npc: 'kalender', title: 'Kontoret',
      steps: [{ n: 'The pages go back on the nail, one by one, rustling. The week is a week again.' }, { say: 'kalender', da: 'Der er kun én side tilbage. Den har jeg aldrig kunnet spise.', en: 'There is only one page left. I have never been able to eat that one.' }],
      opts: [{ kind: 'go', label: 'Ask to see it.', next: 'a6_page' }] },
    a6_page: { bg: 'kontor', npc: 'kalender', title: 'Kontoret',
      steps: [
        { n: 'Kalenderen opens itself at the very back.' }, { glimpse: 'side' },
        { say: 'kalender', da: 'Den er meget gammel. Den er fra før Hertil. Jeg tror, den er din.', en: 'It is very old. It is from before Hertil. I think it is yours.' },
        { th: 'It tears off a blank page from the front and gives it to you instead. A free hour, any time you need one.' },
        { fx: { boon: 'kalenderblad', flag: 'Adone', resp: 2 } },
      ],
      opts: [{ kind: 'go', label: 'Leave.', next: 'map' }] },

    /* ===== PORTEN: contract B, Telefonen ===== */
    b6_start: { bg: 'port', npc: 'telefon', title: 'Porten', card: ['Porten', 'Telefonen rings'],
      steps: [
        { n: 'Porten. Stemplet is upstairs. Telefonen has come back down and is sitting on the counter, ringing itself.' },
        { say: 'telefon', da: 'Hvor er Chefen henne? Ved du det? Ingen ved det.', en: 'Where is the boss? Do you know? Nobody knows.' },
        { say: 'telefon', da: 'Hjælp mig med de andre først. Alle er et andet sted, end de siger.', en: 'Help me with the others first. Everybody is somewhere other than they say.' },
        { fx: { flag: 'Bstart' } },
      ],
      opts: [{ kind: 'act', special: 'whereis:hvor', label: 'Find out where everybody is.', next: 'b6_found' }] },
    tel_hub: { bg: 'port', npc: 'telefon', title: 'Porten', hub: true,
      steps: [{ special: 'telLine' }],
      opts: [
        { kind: 'act', special: 'whereis:hvor', label: 'Find out where everybody is.', req: G => !G.flags.hvorDone, next: 'b6_found', mark: true },
        { kind: 'act', special: 'boxes:trorsynes', label: 'Clear the line: tror or synes?', req: G => G.flags.hvorDone && !G.flags.trorsynesDone, next: 'b6_line', mark: true },
        { kind: 'go', label: 'Ask Telefonen where Chefen is.', req: G => G.flags.trorsynesDone && !G.flags.Bdone && G.flags.Adone && G.flags.Cdone, next: 'b6_top', mark: true },
        { kind: 'reply', once: true, req: G => G.flags.trorsynesDone && !G.flags.Bdone && !G.flags.Adone, da: 'Hvor er Chefen henne?', ok: [{ say: 'telefon', da: 'Det ved jeg ikke endnu. Jeg tror, Kalenderen ved noget.', en: 'I do not know yet. I think Kalenderen knows something.' }] },
        { kind: 'reply', once: true, req: G => G.flags.trorsynesDone && !G.flags.Bdone && G.flags.Adone && !G.flags.Cdone, da: 'Hvor er Chefen henne?', ok: [{ say: 'telefon', da: 'Først skal du melde dig syg. Det gør man her.', en: 'First you have to call in sick. That is how it is done here.' }] },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    b6_found: { bg: 'port', npc: 'telefon', title: 'Porten',
      steps: [{ say: 'telefon', da: 'Alle er fundet. Undtagen Chefen.', en: 'Everybody is found. Except the boss.' }, { say: 'telefon', da: 'Men min linje er fuld af støj. Folk siger “tror”, når de mener “synes”.', en: 'But my line is full of noise. People say “tror” when they mean “synes”.' }, { fx: { resp: 1 } }],
      opts: [{ kind: 'go', label: 'Back.', next: 'tel_hub' }] },
    b6_line: { bg: 'port', npc: 'telefon', title: 'Porten',
      steps: [{ n: 'The crackle on the line clears. Somewhere very high up, very faintly, another phone is ringing.' }, { fx: { resp: 1 } }],
      opts: [{ kind: 'go', label: 'Listen.', next: 'tel_hub' }] },
    b6_top: { bg: 'port', npc: 'telefon', title: 'Porten',
      steps: [
        { say: 'telefon', da: 'Jeg tror, Chefen er helt oppe på øverste etage. Den står ikke på tavlen. Man kan kun komme derop med et kort.', en: 'I think the boss is right up on the top floor. It is not on the board. You can only get up there with a card.' },
        { n: 'Telefonen hands you its receiver. On the line from the top floor there is nobody, only an old message.' }, { glimpse: 'stemme' },
        { n: 'In your pocket there is a keycard: the one from under your bunk, or one just like it. It is warm.' },
        { fx: { boon: 'telefonroer', flag: 'topOpen', resp: 2 } }, { fx: { flag: 'Bdone' } },
      ],
      opts: [{ kind: 'go', label: 'Go to the lift.', next: 'map' }] },

    /* ===== side places ===== */
    kant6_hub: { bg: 'kantine', npc: 'kantine', title: 'Kantinen', hub: true, quest: ['S1'],
      steps: [{ special: 'kant6Line' }],
      opts: [
        { kind: 'act', special: 'clock', label: 'Read the canteen clock for Kantinen.', req: G => !G.flags.clockDone, next: 'kant6_ok' },
        { kind: 'reply', once: true, da: 'Hvad er klokken?', ok: [{ say: 'kantine', da: 'Halv et. Om en halv time er der frokost.', en: 'Half past twelve. Lunch is in half an hour.' }] },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    kant6_ok: { bg: 'kantine', npc: 'kantine', title: 'Kantinen',
      steps: [{ say: 'kantine', da: 'Så kom frokosten til tiden. Tak skal du have.', en: 'So lunch came on time. Thank you.' }, { fx: { sk: 3, resp: 1 } }],
      opts: [{ kind: 'go', label: 'Back.', next: 'kant6_hub' }] },
    skole6_hub: { bg: 'skole', npc: 'holdet', title: 'Skolen', hub: true, quest: ['S2'],
      steps: [{ special: 'skole6Line' }],
      opts: [
        { kind: 'act', special: 'boxes:modal', label: 'Answer the class the short way.', req: G => !G.flags.modalDone, next: 'skole6_ok' },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    skole6_ok: { bg: 'skole', npc: 'holdet', title: 'Skolen',
      steps: [{ say: 'holdet', da: 'Vi ses i fredagsbaren på tredje sal. Den er der kun én gang.', en: 'See you in the Friday bar on the third floor. It is only there once.' }, { fx: { sk: 3, resp: 1 } }],
      opts: [{ kind: 'go', label: 'Back.', next: 'skole6_hub' }] },
    halv6_hub: { bg: 'halv', npc: G => G.prev.Bwhole ? 'helt' : G.prev.Bwish ? 'have' : 'halv', title: 'Den halve sal', hub: true, idle: true,
      steps: [{ special: 'halv6Line' }],
      opts: [
        { kind: 'reply', once: true, req: G => !G.prev.Bwish, da: 'Hvordan går det?', ok: [{ say: 'halv', da: 'Det går fint, synes jeg. Jeg har ingen aftaler. Det er dejligt.', en: 'It is going fine, I think. I have no appointments. It is lovely.' }] },
        { kind: 'reply', once: true, req: G => G.prev.Bwish, da: 'Hvordan går det?', ok: [{ say: 'have', da: 'Det går fint, synes jeg. En have har ingen aftaler. Det er dejligt.', en: 'It is going fine, I think. A garden has no appointments. It is lovely.' }] },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    tag6_hub: { bg: 'tag', npc: 'kran', title: 'Taget', hub: true, idle: true,
      steps: [{ special: 'tag6Line' }],
      opts: [
        { kind: 'reply', once: true, req: G => G.flags.moedeDone, da: 'Hvornår er dit møde?', ok: [{ say: 'kran', da: 'På torsdag, kvart over tre. Det står på min kran.', en: 'On Thursday, quarter past three. It is written on my crane.' }] },
        { kind: 'reply', once: true, req: G => !G.flags.moedeDone, da: 'Hvornår er dit møde?', ok: [{ say: 'kran', da: 'Det ved jeg ikke. Kalenderen har spist det.', en: 'I do not know. Kalenderen has eaten it.' }] },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    bar6: { bg: 'kantine', npc: 'holdet', title: 'Fredagsbaren', card: ['Fredagsbaren', 'only once, only on a Friday'],
      steps: [{ n: 'Somebody has turned the third floor’s other side into a bar for one evening. It is Friday, apparently, whatever the calendar says.' }, { say: 'holdet', da: 'Vil du med op på taget bagefter?', en: 'Do you want to come up to the roof afterwards?' }],
      opts: [
        { kind: 'reply', group: 'b', da: 'Ja, det vil jeg gerne.', ok: [{ n: 'You all go up to the roof and watch Hertil glitter far below. Somebody brought the soup.' }, { fx: { insp: 1, resp: 1, flag: 'barGone' } }], next: 'map' },
        { kind: 'reply', group: 'b', da: 'Det kan jeg desværre ikke.', ok: [{ say: 'holdet', da: 'Det er i orden. En anden gang.', en: 'That is fine. Another time.' }, { fx: { insp: 1, flag: 'barGone' } }], next: 'map' },
      ] },

    /* ===== ØVERSTE ETAGE and the FINALE ===== */
    f6_top: { bg: 'chef', npc: 'stol', title: 'Øverste etage', card: ['Øverste etage', 'a floor not on the board'],
      steps: [
        { n: 'The keycard clicks. The lift goes past the roof, past Kranen’s hook, and stops at a floor that is not on any board.' },
        { n: 'One room. A big window full of sky. A desk with a cup on it. A chair.' },
        { n: 'The chair is empty. It is facing the window. It has been facing the window for a long time.' },
        { n: 'Kalenderen climbs out from under your arm, where it has been riding since the lift, and hangs itself on a nail by the window.' },
        { special: 'look' },
        { glimpse: 'stol' },
        { say: 'kalender', da: 'Alle har en aftale med Chefen. Men Chefen har kun én aftale. Her er den.', en: 'Everybody has an appointment with the boss. But the boss only has one appointment. Here it is.' },
        { letter: 'gammel' },
        { th: 'The letter that brought you to Derhenne was not an invitation. It was a reminder. You had a meeting here, before Hertil, before you fell. You never came.' },
        { say: 'kalender', da: 'Den har ventet. Passer det dig nu?', en: 'It has waited. Does it suit you now?' },
      ],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 11, group: 'end', label: 'Say it suits you fine. Sit down.', build: { en: 'That suits me fine. Let’s say that.', origin: 'appt', answers: [['Det', 'passer', 'mig', 'fint.', 'Lad', 'os', 'sige', 'det.'], ['Lad', 'os', 'sige', 'det.', 'Det', 'passer', 'mig', 'fint.']], tiles: ['Det', 'passer', 'mig', 'fint.', 'Lad', 'os', 'sige', 'det.', 'dig', 'siger'] },
          ok: [{ n: 'You sit down. The chair fits.' }], fail: [{ n: 'Your voice cracks on “fint”. The chair takes it as a yes, and so do you.' }], next: 'f6_sit' },
        { kind: 'say', stat: 'SPROG', dc: 11, group: 'end', label: 'Ask if you can move the appointment.', build: { en: 'Can we move our appointment?', origin: 'appt', answers: [['Kan', 'vi', 'flytte', 'vores', 'aftale?']], tiles: ['Kan', 'vi', 'flytte', 'vores', 'aftale?', 'vil', 'flytter'] },
          ok: [{ say: 'kalender', da: 'Hvad så med om et år?', en: 'What about in a year?' }], fail: [{ say: 'kalender', da: 'Flytte den? Hvad så med om et år?', en: 'Move it? What about in a year?' }], next: 'f6_move' },
        { kind: 'say', stat: 'SPROG', dc: 11, group: 'end', label: 'Say you cannot, unfortunately. You have to move on.', build: { en: 'Unfortunately I can’t. I have to move on.', origin: 'appt', answers: [['Det', 'kan', 'jeg', 'desværre', 'ikke.', 'Jeg', 'skal', 'videre.'], ['Jeg', 'kan', 'det', 'desværre', 'ikke.', 'Jeg', 'skal', 'videre.']], best: [['Desværre', 'kan', 'jeg', 'det', 'ikke.', 'Jeg', 'skal', 'videre.']], tiles: ['Det', 'kan', 'jeg', 'desværre', 'ikke.', 'Jeg', 'skal', 'videre.', 'vil', 'gør'] },
          ok: [{ say: 'kalender', da: 'Det er i orden.', en: 'That is all right.' }], fail: [{ say: 'kalender', da: 'Nå. Det er i orden.', en: 'Oh. That is all right.' }], next: 'f6_cancel' },
      ] },
    f6_sit: { bg: 'chef', npc: 'stol', title: 'Øverste etage',
      steps: [
        { n: 'Far below, every appointment in Derhenne clicks shut at once. Kranen lifts the last beam into place. For the first time, the building is not being built. It is just a building, with you at the top of it.' },
        { th: 'You look out of the window. It is the view from the roof, only higher, and you know it the way you know your own handwriting.' },
        { fx: { flag: 'Fchef', resp: 3 } }, { fx: { flag: 'Fdone' } },
      ],
      opts: [{ kind: 'go', label: 'Go down one last time.', next: 'f6_end' }] },
    f6_move: { bg: 'chef', npc: 'stol', title: 'Øverste etage',
      steps: [{ th: 'Kalenderen waits, pen ready, a year from today already half written.' }],
      opts: [{ kind: 'reply', da: 'Ja, det kan vi godt. Det er en aftale.', ok: [{ say: 'kalender', da: 'Det er en aftale.', en: 'It is a deal.' },
        { n: 'Kalenderen writes the appointment on its last page, a year from today, and the page lets itself be turned at last.' },
        { th: 'The chair turns back to the window, patiently. It is good at waiting. It has had practice.' },
        { fx: { flag: 'Fmove', resp: 2 } }, { fx: { flag: 'Fdone' } }], next: 'f6_end' }] },
    f6_cancel: { bg: 'chef', title: 'Øverste etage',
      steps: [
        { n: 'Kalenderen tears out the oldest page at last and eats it, slowly, with its eyes closed. The appointment is cancelled.' },
        { n: 'You push the empty chair into the lift and send it down to the second floor. Holdet has a new student coming, and no chair for her.' },
        { th: 'The window stays. The view stays. You do not need to sit in front of it.' },
        { fx: { flag: 'Fcancel', resp: 2 } }, { fx: { flag: 'Fdone' } },
      ],
      opts: [{ kind: 'go', label: 'Take the stairs down.', next: 'f6_end' }] },
    f6_end: { bg: 'port', npc: 'stempel', title: 'Porten', card: ['Porten', 'the end of the week'],
      steps: [
        { n: 'KA-CHUNK. Stemplet stamps the week shut.' },
        { special: 'chapterEcho2' },
        { say: 'stempel', da: 'Nu ved Derhenne, hvad du laver, hvem du kender, og hvad du har aftalt. Så er kapitlet slut.', en: 'Now Derhenne knows what you do, who you know, and what you have agreed. So the chapter is over.' },
        { n: 'The pipe in the wall coughs. A parcel drops onto the counter, addressed to you, from somewhere you have never heard of.' },
        { n: 'Inside is a coat that does not fit, and a label: “Hvad har du på?”' },
        { th: 'What are you wearing? You look down. You honestly do not know.' },
      ],
      opts: [{ kind: 'go', label: 'End the chapter.', next: 'end' }] },
  },
});
