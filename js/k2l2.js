/* =========================================================================
   HERTIL · Kapitel 2 · Lektion 2 — "Hvordan går det med dit studie?"   (Derhenne)
   Book 2.2: relative clauses with der (Det er ham, der altid …), hans / hendes / sin / sit / sine / deres,
   ham / hende as objects, synes + adverb (Jeg synes faktisk, …), adjectives for people, jo to negative
   questions, Hvordan går det med dit studie? (possessive + indefinite noun).
   Physics of the second floor (Skolen): names slide off like wet labels, so you can only point at someone
   by what they always do ("den, der …"). Everyone here is a han or a hun. "sin" keeps a thing with its owner,
   "hans/hendes" hands it to somebody else (Knagen, the coat stand, profits). What you synes about someone sticks to them.
   Chapter thread (spoilers): traces point at an old appointment at the top of Derhenne (notes, a lanyard, a name tag).
   ========================================================================= */

const nyBuild = (en, a, extra) => ({ en, answers: a, tiles: [...a[0], ...extra] });

SESSIONS.k2l2 = Object.assign({}, D2, {
  id: 'k2l2', order: 5, short: 'K2 · Lektion 2', prevSession: 'k2l1', nextSession: 'k2l3', title: 'Lektion 2 · Hvordan går det med dit studie?', en: 'How are your studies going?',
  blurb: 'The second floor became a school overnight. Names slide off everyone there, like wet labels.',
  start: 'p5_wake', home: 'koeje', travelAfter: 'p5seen', cluesFlag: 'clues5', cluesNeed: 3, dcMod: 3,
  startState: { resp: 3, sk: 10, insp: 1, boons: ['anker', 'hue'], statXP: { SPROG: 17, LOEGN: 5, SNIGE: 7, HANDEL: 5, INDSIGT: 13 },
    origin: { reason: 'Jeg kom hertil på grund af en lyd.', addr: 'Jeg bor i Fjergade, i nærheden af kirken.', work: 'Jeg læser til arkitekt på universitetet.' }, met: ['stempel', 'elevator', 'kran', 'arkiv', 'kantine', 'blyant'] },

  locations: {
    taget:     { name: 'Taget', en: 'Kranen builds, at its own speed', x: 74, y: 9, bg: 'tag', icon: 'kran', entry: G => 'tag5_hub' },
    kontoret:  { name: 'Kontoret', en: '4. sal · a new coat stand', x: 26, y: 23, bg: 'kontor', icon: 'knage', entry: G => !G.flags.Bstart ? 'b5_start' : 'knage_hub' },
    halve:     { name: 'Den halve sal', en: '3. sal · somebody is talking', x: 74, y: 37, bg: 'halv', icon: 'mursten', entry: G => !G.flags.Cstart ? 'c5_start' : 'rygt_hub' },
    aud:       { name: 'Auditoriet', en: 'a guest lecture, only once', x: 26, y: 37, bg: 'skole', icon: 'kurs', eph: true, req: G => G.flags.navneDone && !G.flags.gaestGone, entry: G => 'gaest5' },
    skolen:    { name: 'Skolen', en: '2. sal · names do not stick', x: 26, y: 51, bg: 'skole', icon: 'tavle', entry: G => 'skole_hub' },
    koeje:     { name: 'Køjerne', en: '1. sal · your bunk', x: 74, y: 65, bg: 'koeje', icon: 'seng', night: true, entry: G => 'koeje5_hub' },
    porten:    { name: 'Porten', en: 'stuen · rørpost', x: 26, y: 79, bg: 'port', icon: 'stempel', entry: G => 'port5_hub' },
    kantinen:  { name: 'Kantinen', en: 'kælderen · always open', x: 74, y: 92, bg: 'kantine', icon: 'kantine', night: true, entry: G => 'kant5_hub' },
  },

  ending: G => [G.flags.Ainsp ? 'Inspirerende' : G.flags.Aorg ? 'Til tiden' : null,
    G.flags.Breturn ? 'Frakken' : G.flags.Bhat ? 'Hans hat' : null,
    G.flags.Csweet ? 'Sød' : G.flags.Cno ? 'Stille rygte' : null].filter(Boolean).join(' · ') || '—',
  carryFlags: ['Ainsp', 'Aorg', 'Breturn', 'Bhat', 'Csweet', 'Cno'],
  next: 'Lektion 3 · Kan vi flytte vores aftale? Every appointment in Derhenne has come loose, and somebody important cannot be found.',

  quests: {
    A: { title: 'Ham, der altid kommer for sent', en: 'The one who is always late', obj: [['Point out who is who on the second floor', 'navneDone'], ['Ask the class about the one who is always late', 'Aasked'], ['Tell Vejlederen what you think of him', 'Adone']] },
    B: { title: 'Sin eller hans', en: 'His own, or someone else’s', obj: [['Send everybody’s things home (Kontoret)', 'sinhansDone'], ['Deal with Knagen', 'Bdone']] },
    C: { title: 'Rygtet', en: 'The rumour', obj: [['Find the right word for every kind of creature (3. sal)', 'adjDone'], ['Answer Rygtet', 'Cdone']] },
    F: { title: 'Brev til Hertil', en: 'A letter to Hertil', obj: [['Write to Naboen from Porten', 'Fdone']] },
    S1: { title: 'Ham eller hende', en: 'Him or her', side: true, obj: [['Help the class with ham and hende', 'hamhendeDone']] },
    S2: { title: 'Hvordan går det med …?', en: 'How is … going?', side: true, obj: [['Chat with Kantinen the right way', 'gaarDone']] },
    S3: { title: 'Spor', en: 'Traces', side: true, obj: [['Find three traces of what you were', 'clues5']] },
  },

  glimpses: {
    navneskilt: { name: 'Navneskiltet', en: 'The name tag', text: 'One chair at the back has a name tag that does not slide off. It is blank. The chair is exactly your shape, and the seat is still warm.' },
    noter: { name: 'Noterne', en: 'The notes', text: 'Among Vejlederen’s notes, one page in different handwriting. Yours. A date that has been crossed out and moved, again and again. At the bottom: øverste etage.' },
    snor: { name: 'Snoren', en: 'The lanyard', text: 'At the bottom of Knagen’s pile: a lanyard with an empty card holder. It fits round your neck the way a key fits a lock.' },
    karakter: { name: 'Karakteren', en: 'The grade', text: 'The guest hands back an exam paper from years ago. A good grade, in red. The name has rubbed off. The handwriting has not.' },
  },

  lineups: {
    navne: { title: 'Hvem er det?', h2: 'Den, der …', flag: 'navneDone',
      pool: ['kran', 'kantine', 'arkiv', 'blyant', 'stempel', 'knage'],
      end: r => r >= 5 ? 'For a moment, every name sticks. Holdet gasps. Then the names slide off again, but now the class knows it can be done.' : 'Some names stick to the wrong creature. Kranen is briefly called Kantinen and lifts a floor of soup.',
      rounds: [
        { npc: 'kran', clue: 'Det er ham, der bygger nye etager oppe på taget.', why: 'der bygger: der is the subject of the little clause.' },
        { npc: 'kantine', clue: 'Det er hende, der laver suppe nede i kælderen.', why: 'Det er hende, der …' },
        { npc: 'arkiv', clue: 'Det er hende, der har alt for mange skuffer.', why: 'der har: the one who has.' },
        { npc: 'blyant', clue: 'Det er hende, der altid tegner nye etager.', why: 'der altid tegner: altid comes BEFORE the verb in a der-clause.' },
        { npc: 'stempel', clue: 'Det er ham, der stempler alt, der kommer.', why: 'Two der-clauses: der stempler, der kommer.' },
        { npc: 'knage', clue: 'Det er ham, der ikke vil give andres ting tilbage.', why: 'der ikke vil: ikke before the verb in a der-clause.' },
      ] },
  },

  boxes: {
    sinhans: { title: 'Knagens tøj', q: 'Hvis er det?', boxes: ['a', 'b', 'c'],
      good: 'Every “sin” sends a thing home. A hat flies up the shaft, a tray clatters down to the basement, a pencil case runs back to the class.', meh: 'Most things go home. A sock ends up on the wrong creature, and it is not complaining.',
      items: [
        { t: 'Kranen leder efter ___ hat. (hans egen)', opts: ['sin', 'hans'], a: 0, why: 'Kranen is the subject and owns the helmet: sin.' },
        { t: 'Kantinen elsker ___ suppe. (hendes egen)', opts: ['sin', 'hendes'], a: 0, why: 'The owner is the subject of the clause: sin.' },
        { t: '___ chef er altid sur. (Arkivets chef)', opts: ['Hendes', 'Sin'], a: 0, why: 'The possessive is part of the subject itself: hendes, never sin.' },
        { t: 'Eleverne kommer aldrig for sent til ___ timer.', opts: ['deres', 'sine'], a: 0, why: 'A plural owner (eleverne): deres. There is no plural sin.' },
        { t: 'Blyanten har glemt ___ viskelæder. (hendes eget)', opts: ['sit', 'sin', 'sine'], a: 0, why: 'et viskelæder: sit.' },
        { t: 'Vejlederen leder efter ___ noter. (hans egne)', opts: ['sine', 'sin', 'hans'], a: 0, why: 'noter is plural: sine.' },
        { t: 'Knagen har taget Kranens hat. Nu har Knagen ___ hat.', opts: ['hans', 'sin'], a: 0, why: 'The hat is Kranen’s, not the subject Knagen’s: hans.' },
        { t: 'Rygtet synes, ___ stemme er smuk.', opts: ['hendes', 'sin'], a: 0, why: 'In the clause after synes, stemme is part of the subject: hendes stemme.' },
      ] },
    adj: { title: 'Rygtets ord', q: 'Hvilket ord passer?', boxes: ['a', 'b', 'c'],
      good: 'Rygtet runs out of wrong words. It prints the right ones, a little sulkily.', meh: 'Some words land on the wrong creatures. Kranen is nervous all afternoon and does not know why.',
      items: [
        { t: 'En lærer, der er i dårligt humør, er …', opts: ['sur', 'sød', 'tjekket'], a: 0, why: 'i dårligt humør: sur.' },
        { t: 'En kollega, der er flink og altid hjælper, er …', opts: ['sød', 'arrogant', 'kedelig'], a: 0, why: 'flink and helpful: sød.' },
        { t: 'En vejleder, der ved meget og er godt forberedt, er …', opts: ['tjekket', 'forvirret', 'nervøs'], a: 0, why: 'well prepared: tjekket.' },
        { t: 'En chef, der taler ned til andre, er …', opts: ['arrogant', 'afslappet', 'sød'], a: 0, why: 'talks down to people: arrogant.' },
        { t: 'En kollega, der tager det roligt, er …', opts: ['afslappet', 'stresset', 'sur'], a: 0, why: 'tager det roligt: afslappet.' },
        { t: 'En studerende, der er meget interesseret i alle detaljer, er …', opts: ['nørdet', 'kedelig', 'arrogant'], a: 0, why: 'every detail: nørdet.' },
        { t: 'En underviser, der aldrig siger noget sjovt, er …', opts: ['kedelig', 'dygtig', 'tjekket'], a: 0, why: 'never funny: kedelig.' },
        { t: 'En lærer, der ikke kan huske, hvor han har lagt sine ting, er …', opts: ['forvirret', 'tjekket', 'sur'], a: 0, why: 'cannot remember: forvirret.' },
      ] },
    hamhende: { title: 'Ham eller hende', q: 'Hvilket ord?', boxes: ['a', 'b', 'c'],
      good: 'The class repeats every sentence back to you, perfectly, in chorus. It is slightly frightening.', meh: 'The class gets most of them. One chair keeps saying “hun” about everyone.',
      items: [
        { t: 'Kender du Vejlederen (en han)? Ja, jeg kender ___ godt.', opts: ['ham', 'han', 'hende'], a: 0, why: 'An object: ham.' },
        { t: 'Rygtet (en hun)? ___ kan jeg ikke lide.', opts: ['Hende', 'Hun', 'Ham'], a: 0, why: 'The object stands first: Hende kan jeg … (and the verb comes second).' },
        { t: 'Hvad synes du om Kantinen (en hun)? Jeg synes, ___ er sød.', opts: ['hun', 'hende', 'ham'], a: 0, why: 'In the clause after synes she is the subject: hun er sød.' },
        { t: 'Har du set Knagen (en han)? Nej, ___ har jeg ikke set.', opts: ['ham', 'han', 'hende'], a: 0, why: 'Object first: Ham har jeg ikke set.' },
        { t: 'Det er ___, der bygger det hele. (Kranen, en han)', opts: ['ham', 'han', 'hende'], a: 0, why: 'Det er ham, der …: after det er, the object form.' },
        { t: 'Holdet venter på ___. (Vejlederen, en han)', opts: ['ham', 'han', 'hende'], a: 0, why: 'After a preposition (på): ham.' },
        { t: 'Blyanten (en hun)? Ja, ___ tegner hele dagen.', opts: ['hun', 'hende', 'han'], a: 0, why: 'The subject of tegner: hun.' },
        { t: 'Jeg ringer til ___ i morgen. (Arkivet, en hun)', opts: ['hende', 'hun', 'ham'], a: 0, why: 'After til: hende.' },
      ] },
    gaar: { title: 'Kantinens snak', q: 'Hvilket ord?', boxes: ['a', 'b'],
      good: 'Kantinen tells you everything about everybody’s week. It takes a whole pot of soup.', meh: 'Kantinen answers anyway. It is used to being asked strangely.',
      items: [
        { t: 'Hvordan går det med dit ___?', opts: ['studie', 'studiet'], a: 0, why: 'After a possessive (dit), the noun stays indefinite: dit studie.' },
        { t: 'Hvordan går det med din ___?', opts: ['suppe', 'suppen'], a: 0, why: 'After din: din suppe, not din suppen.' },
        { t: 'Hvordan går det med ___ arbejde?', opts: ['dit', 'din'], a: 0, why: 'et arbejde: dit.' },
        { t: 'Det går rigtig godt med mit ___.', opts: ['projekt', 'projektet'], a: 0, why: 'After mit: mit projekt, not mit projektet.' },
        { t: 'Hvordan går det med ___ kolleger?', opts: ['dine', 'din'], a: 0, why: 'Plural: dine.' },
        { t: 'Hvordan går det med ___ kollega?', opts: ['din', 'dit'], a: 0, why: 'en kollega: din.' },
      ] },
  },

  travel: [
    { id: 'lift5', bg: 'gang', npc: 'elevator', steps: [{ say: 'elevator', da: 'Er det ikke dig, der altid skal til første sal?', en: 'Aren’t you the one who always goes to the first floor?' }],
      opts: [{ kind: 'reply', group: 'e', da: 'Jo, det er mig.', ok: [{ n: 'It hums, pleased with its memory, and takes you to the fourth floor.' }, { fx: { resp: 1 } }], next: 'map' }, { kind: 'reply', group: 'e', da: 'Nej, det er ikke mig.', ok: [{ n: 'Its dial droops. It takes you to the first floor out of spite.' }], next: 'map' }] },
    { id: 'tape5', bg: 'gang', req: G => G.flags.Cstart && !G.flags.Cdone, steps: [{ n: 'A loop of Rygtet’s tape hangs out of an air vent, printing to nobody: “HAN ER SUR. HUN ER SUR. DE ER SURE.”' }],
      opts: [{ kind: 'act', stat: 'SNIGE', dc: 10, label: 'Tear the last word off.', ok: [{ n: 'You tear off “SURE”. The tape now says “DE ER”, which is true and harmless. You sell the scrap to Kantinen as a recipe.' }, { fx: { sk: 3 } }], fail: [{ n: 'The tape wraps round your wrist and prints “NY” on your sleeve. It is not wrong.' }], next: 'map' }, { kind: 'go', label: 'Leave it.', next: 'map' }] },
    { id: 'stol5', bg: 'gang', npc: 'holdet', steps: [{ n: 'A school chair has lost the rest of the class and is walking up and down the corridor.' }, { say: 'holdet', da: 'Kender du os? Vi er dem, der venter.', en: 'Do you know us? We are the ones who wait.' }],
      opts: [{ kind: 'reply', group: 's', da: 'Ja, I er på anden sal.', ok: [{ n: 'It trots off toward the lift, delighted to be somewhere.' }, { fx: { resp: 1 } }], next: 'map' }, { kind: 'go', group: 's', label: 'Walk on.', next: 'map' }] },
    { id: 'arkivny', bg: 'gang', req: G => G.prev.Cnew, steps: [{ n: 'Arkivet comes past in a paper hat, carrying a tray of coffee. It is trying out being a waiter this week.' }],
      opts: [{ kind: 'reply', da: 'Hvordan går det med dit nye job?', ok: [{ n: 'It spills nothing, says nothing and gives you a coffee. Then it remembers, with visible joy, that it does not have to remember.' }, { fx: { resp: 1, insp: 1 } }], next: 'map' }, { kind: 'go', label: 'Walk on.', next: 'map' }] },
    { id: 'bi5', bg: 'gang', req: G => G.prev.Bwish, steps: [{ n: 'A bee from the third-floor garden is bumping against the lift buttons. It is partly brick, which makes it slow.' }],
      opts: [{ kind: 'go', label: 'Press 3 for it.', fx: { resp: 1 }, next: 'map' }] },
    { id: 'tal5', bg: 'gang', req: G => !hasBoon('urnoegle'), steps: [{ n: 'Every number on the lift panel turns to a little shape that is not a number.' }, { special: 'glyphs' }], opts: [{ kind: 'go', label: 'Ride it anyway.', next: 'map' }] },
  ],

  special: {
    async arrive5() {
      const p = G.prev;
      logAdd(`<p>${esc(p.Astud ? 'You are a student. Of course you have school.' : p.Aprog ? 'Stemplet has sent every programmer in Derhenne on a course. Even you.' : p.Atjener ? 'Stemplet has sent every waiter in Derhenne on a course. Even you. Your tray comes too.' : 'This week, everybody in Derhenne goes on a course. Even the lift.')}</p>`, 'narr'); await tapOn();
    },
    async skoleLine() { logAdd(`<p>${esc(G.flags.Ainsp ? 'Vejlederen is late, talking about bridges, and the class is leaning forward in its chairs.' : G.flags.Aorg ? 'Vejlederen is exactly on time and keeps looking at the clock as if it were a wild animal.' : G.flags.navneDone ? 'The class waits. A name slides down the blackboard and drips onto the floor.' : 'The class waits for its supervisor. The labels on the chairs slide off as you look at them.')}</p>`, 'narr'); },
    async kontorLine5() { logAdd(`<p>${esc(G.flags.Breturn ? 'Knagen holds your coat with great dignity, as if it were a medal.' : G.flags.Bhat ? 'Knagen stands bareheaded, holding very still, so nobody says “hans” near it again.' : G.flags.sinhansDone ? 'Knagen wears its own red hat and grey scarf and nothing else, and looks a little lost.' : 'Knagen wears three hats, two scarves, a tray, a bell and a pencil case. It wants more.')}</p>`, 'narr'); },
    async rygtLine() { logAdd(`<p>${esc(G.flags.Csweet ? 'Rygtet prints nice things about everyone, very fast. Some of them are even true.' : G.flags.Cno ? 'Rygtet lies coiled on the floor, quiet, printing only the date.' : 'Rygtet loops round the third floor, printing what everybody thinks of everybody else.')}</p>`, 'narr'); },
    async portLine5() { logAdd(`<p>${esc(G.flags.Fdone ? 'The pipe to Hertil is quiet. Your letter is on its way.' : G.flags.Adone && G.flags.Bdone && G.flags.Cdone ? 'Stemplet has a pipe open marked HERTIL. It is waiting for something to send.' : 'Rørpost comes and goes. One pipe is marked HERTIL, and it has a little cobweb in it.')}</p>`, 'narr'); },
    async koejeLine5() { logAdd(`<p>${esc(pick(['Your timetable is pinned to the bunk. It has grown a third page.', 'From the second floor comes the sound of chairs waiting.', 'The bunk above yours is empty, and the mattress has your shape.']))}</p>`, 'narr'); },
    async tagLine5() { logAdd(`<p>${esc(G.flags.Csweet || G.flags.Cno ? 'Kranen swings floors around at a normal speed again. It seems to have forgotten that it was ever called boring.' : G.flags.Cstart ? 'Kranen is lifting a floor so slowly that a bird has built a nest in it. Somebody on the third floor called it kedelig.' : 'Kranen builds, at its own speed. Its hook goes up and down like a slow heartbeat.')}</p>`, 'narr'); },
    async kantLine5() { logAdd(`<p>${esc(G.flags.Csweet ? 'The soup is sweet today. Very sweet. Kantinen is humming.' : G.flags.Cstart && !G.flags.Cdone ? 'The soup is sour. Kantinen is grumpy, and does not know why: somebody on the third floor said she was.' : 'Kantinen stirs. Somebody has to cook while everyone else is on a course.')}</p>`, 'narr'); },
    async mailEcho() {
      const o = G.origin, lines = [o.mail1, o.mail2, o.colleague, o.opinion].filter(Boolean);
      logAdd(`<p>Stemplet reads your letter back before it folds it.</p>`, 'narr');
      for (const l of lines) { youSaid(l); TTS.say(l); await sleep(FAST ? 0 : 900); }
      await tapOn();
    },
    async glyphs() { G.glyph = 3; AUDIO.sting('glyph'); toast('ᚦᚨᛚ · the numbers have gone strange', 'gold'); },
  },

  nodes: {
    /* ===== PROLOGUE ===== */
    p5_wake: { bg: 'koeje', title: 'Køjerne', card: ['Kapitel 2 · Arbejde & uddannelse', 'Lektion 2 — Hvordan går det med dit studie?'],
      steps: [
        { n: 'The timetable on your pillow has grown a second page overnight. It says the same thing, louder: SKOLEN. 2. SAL.' },
        { special: 'arrive5' },
        { fx: { flag: 'p5seen' } },
      ],
      opts: [{ kind: 'go', label: 'Go up to the second floor.', next: 'p5_skole' }] },
    p5_skole: { bg: 'skole', npc: 'holdet', title: 'Skolen', card: ['Skolen', '2. sal · names do not stick'],
      steps: [
        { n: 'The drawing studio is gone. In its place: a blackboard, a clock, and a row of school chairs on legs. The chairs are the class.' },
        { say: 'holdet', da: 'Vi venter på vores vejleder.', en: 'We are waiting for our supervisor.' },
        { n: 'Over the door, a sign: HER ER ALLE EN HAN ELLER EN HUN.' },
        { th: 'You try to read the names on the chairs. They slide off as you look, like wet labels. On this floor nobody keeps a name. You can only say what they do.' },
        { say: 'holdet', da: 'Kender du ham? Det er ham, der altid kommer for sent.', en: 'Do you know him? He is the one who is always late.' },
        { fx: { quest: ['A', 'B', 'C', 'F', 'S1', 'S3'] } },
      ],
      opts: [{ kind: 'go', label: 'Look around.', next: 'skole_hub' }] },

    /* ===== SKOLEN: contract A ===== */
    skole_hub: { bg: 'skole', npc: G => G.flags.Adone ? 'vejleder' : 'holdet', title: 'Skolen', hub: true,
      steps: [{ special: 'skoleLine' }],
      opts: [
        { kind: 'act', special: 'lineup:navne', label: 'Point out who is who: the one who …', req: G => !G.flags.navneDone, next: 'a5_named', mark: true },
        { kind: 'say', stat: 'SPROG', dc: 10, label: 'Ask the class: isn’t he the one who is always late?', req: G => G.flags.navneDone && !G.flags.Aasked,
          build: { en: 'Isn’t he the one who is always late?', answers: [['Er', 'det', 'ikke', 'ham,', 'der', 'altid', 'kommer', 'for', 'sent?']], tiles: ['Er', 'det', 'ikke', 'ham,', 'der', 'altid', 'kommer', 'for', 'sent?', 'han', 'hende'] },
          ok: [{ say: 'holdet', da: 'Jo, præcis! Han er på trappen, tror vi. Han er altid på vej.', en: 'Yes, exactly! He is on the stairs, we think. He is always on his way.' }, { fx: { flag: 'Aasked', resp: 1 } }],
          fail: [{ n: 'Two chairs start answering before you finish. They have been dying to say it.' }, { say: 'holdet', da: 'Jo! Han er på trappen.', en: 'Yes! He is on the stairs.' }, { fx: { flag: 'Aasked' } }], next: 'a5_lift' },
        { kind: 'act', special: 'boxes:hamhende', label: 'Help the class with ham and hende.', req: G => !G.flags.hamhendeDone, next: 'skole_hh' },
        { kind: 'reply', once: true, da: 'Hvordan går det med undervisningen?', ok: [{ say: 'holdet', da: 'Ikke så godt. Vi har ingen vejleder. Og ingen navne.', en: 'Not so well. We have no supervisor. And no names.' }] },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    a5_named: { bg: 'skole', npc: 'holdet', title: 'Skolen',
      steps: [
        { n: 'Every time you say “den, der …”, a name sticks for a moment, like a magnet. Then it slides off again. But the class has seen it work.' },
        { n: 'At the back of the room, one chair keeps its label. You go closer.' }, { glimpse: 'navneskilt' },
        { fx: { resp: 1 } },
      ],
      opts: [{ kind: 'go', label: 'Back.', next: 'skole_hub' }] },
    skole_hh: { bg: 'skole', npc: 'holdet', title: 'Skolen',
      steps: [{ n: 'Holdet scrapes its legs in applause.' }, { fx: { flag: 'hamhendeDone', sk: 3, resp: 1 } }],
      opts: [{ kind: 'go', label: 'Back.', next: 'skole_hub' }] },
    a5_lift: { bg: 'gang', npc: 'vejleder', title: 'Trappen', card: ['Trappen', 'between two floors'],
      steps: [
        { n: 'On the stairs between the second and the third floor, a compass in a long coat is checking a pocket watch, shaking it, checking it again. He has not moved for some time.' },
        { say: 'vejleder', da: 'Jeg kommer! Jeg er på vej! Hvad er klokken?', en: 'I am coming! I am on my way! What time is it?' },
        { n: 'He has been on his way for three days. His pockets are full of notes, a theory about bridges and a sandwich from last week.' },
        { n: 'A page slips out of the notes. You pick it up.' }, { glimpse: 'noter' },
        { say: 'vejleder', da: 'Er det ikke dig, der er ny?', en: 'Aren’t you the new one?' },
      ],
      opts: [
        { kind: 'reply', group: 'j', da: 'Jo, det er mig.', ok: [{ say: 'vejleder', da: 'Godt. Så har jeg et spørgsmål.', en: 'Good. Then I have a question.' }], next: 'a5_talk' },
        { kind: 'reply', group: 'j', da: 'Ja, det er mig.', ok: [{ th: 'His needle twitches. After a question with ikke in it, yes is jo here. He lets it go; he is late anyway.' }], next: 'a5_talk' },
      ] },
    a5_talk: { bg: 'gang', npc: 'vejleder', title: 'Trappen',
      steps: [{ say: 'vejleder', da: 'Hvad synes du om mig? På den her etage bliver det sandt.', en: 'What do you think of me? On this floor it comes true.' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 11, group: 'end', label: 'Say you actually find him rather inspiring.',
          build: { en: 'I actually think you are rather inspiring.', origin: 'opinion', answers: [['Jeg', 'synes', 'faktisk,', 'du', 'er', 'ret', 'inspirerende.'], ['Jeg', 'synes,', 'du', 'faktisk', 'er', 'ret', 'inspirerende.']], tiles: ['Jeg', 'synes', 'faktisk,', 'du', 'er', 'ret', 'inspirerende.', 'tror', 'han'] },
          ok: [{ n: 'The compass needle swings round and points straight at you for a whole second.' }], fail: [{ n: 'His pocket watch goes off in the middle of your sentence. When it stops, “inspirerende” is still hanging in the air, and he grabs it.' }], next: 'a5_insp' },
        { kind: 'say', stat: 'SPROG', dc: 11, group: 'end', label: 'Say you actually think he is very organised. Here, saying it makes it so.',
          build: { en: 'I actually think you are very organised.', origin: 'opinion', answers: [['Jeg', 'synes', 'faktisk,', 'du', 'er', 'meget', 'tjekket.'], ['Jeg', 'synes,', 'du', 'faktisk', 'er', 'meget', 'tjekket.']], tiles: ['Jeg', 'synes', 'faktisk,', 'du', 'er', 'meget', 'tjekket.', 'tror', 'han'] },
          ok: [{ n: 'The needle stops spinning and points north, firmly, for the first time in its life.' }], fail: [{ n: 'A door bangs somewhere above. But “tjekket” has already landed on him, and on this floor what lands on you sticks.' }], next: 'a5_conf' },
      ] },
    a5_insp: { bg: 'skole', npc: 'vejleder', title: 'Skolen',
      steps: [
        { say: 'vejleder', da: 'Inspirerende! Det har ingen sagt før. Kom! Vi kommer for sent!', en: 'Inspiring! Nobody has said that before. Come on! We are late!' },
        { n: 'He is late for his own class, and the class does not mind at all. He talks about bridges for an hour. Nobody wants him to stop. A chair cries a little.' },
        { fx: { boon: 'kompas', flag: 'Ainsp', resp: 2 } }, { fx: { flag: 'Adone' } },
      ],
      opts: [{ kind: 'go', label: 'Slip out the back.', next: 'map' }] },
    a5_conf: { bg: 'skole', npc: 'vejleder', title: 'Skolen',
      steps: [
        { say: 'vejleder', da: 'Tjekket? Mig? Ja … det er jeg vist.', en: 'Organised? Me? Yes … I suppose I am.' },
        { n: 'He finds a timetable in his coat that he never knew he had, and smooths it flat with both hands. Ten minutes later he walks into the classroom exactly on time, for the first time in his life.' },
        { th: 'Holdet applauds, shocked. He gives you a copy of the timetable. It keeps itself.' },
        { fx: { boon: 'skema', flag: 'Aorg', resp: 2 } }, { fx: { flag: 'Adone' } },
      ],
      opts: [{ kind: 'go', label: 'Leave them to it.', next: 'map' }] },

    /* ===== KONTORET: contract B, Knagen ===== */
    b5_start: { bg: 'kontor', npc: 'knage', title: 'Kontoret', card: ['Kontoret', '4. sal · a new coat stand'],
      steps: [
        { n: G => G.prev.Cnew ? 'Where Arkivet used to stand, there is a new coat stand. It is wearing everything.' : 'Next to Arkivet stands a new coat stand. It is wearing everything.' },
        { n: 'Three hats, two scarves, a tray, a bell, a sock and the class’s pencil case.' },
        { say: 'knage', da: 'Hans hat er min. Hendes tørklæde er mit. Det sagde de selv.', en: 'His hat is mine. Her scarf is mine. They said so themselves.' },
        { th: 'On these floors, “hans” hands a thing to somebody else. Somebody said “Kranen elsker hans hat”. Now Knagen has the hat.' },
        { fx: { flag: 'Bstart' } },
      ],
      opts: [{ kind: 'go', label: 'Look at the pile.', next: 'knage_hub' }] },
    knage_hub: { bg: 'kontor', npc: 'knage', title: 'Kontoret', hub: true,
      steps: [{ special: 'kontorLine5' }],
      opts: [
        { kind: 'act', special: 'boxes:sinhans', label: 'Say whose things they are, the right way.', req: G => !G.flags.sinhansDone, next: 'b5_sorted', mark: true },
        { kind: 'go', label: 'Talk to Knagen.', req: G => G.flags.sinhansDone && !G.flags.Bdone, next: 'b5_talk', mark: true },
        { kind: 'reply', once: true, da: 'Hvad laver du her?', ok: [{ say: 'knage', da: 'Jeg holder. Det er mit job. Jeg holder på alles ting.', en: 'I hold. That is my job. I hold on to everybody’s things.' }] },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    b5_sorted: { bg: 'kontor', npc: 'knage', title: 'Kontoret',
      steps: [
        { n: G => (G.flags.sinhansScore || 0) >= 6 ? 'Every “sin” sends a thing home. The hat flies up to the roof, the tray clatters down to the basement, the pencil case scuttles back to the class.' : 'Most things find their way home. The bell rings twice and goes to the wrong floor.' },
        { n: 'At the bottom of the pile there is one thing nobody claims.' }, { glimpse: 'snor' },
        { say: 'knage', da: 'Det her er mit eget. Jeg elsker mit tørklæde og min hat.', en: 'These are my own. I love my scarf and my hat.' },
        { fx: { flag: 'sinhansDone', resp: 1 } },
      ],
      opts: [{ kind: 'go', label: 'Back.', next: 'knage_hub' }] },
    b5_talk: { bg: 'kontor', npc: 'knage', title: 'Kontoret',
      steps: [{ say: 'knage', da: 'Men nu har jeg næsten ingenting at holde. Kun min egen hat og mit tørklæde.', en: 'But now I have almost nothing to hold. Only my own hat and my scarf.' }, { th: 'A coat stand with nothing to hold looks very lonely. And its red hat is very fine.' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'end', label: 'Offer it your own things to hold.',
          build: { en: 'You may hold my things.', answers: [['Du', 'må', 'holde', 'mine', 'ting.']], tiles: ['Du', 'må', 'holde', 'mine', 'ting.', 'sine', 'holder'] },
          ok: [{ n: 'Knagen’s buttonhole eye goes wide.' }], fail: [{ n: 'Your coat is already on its hook before you finish. Knagen was ready.' }], next: 'b5_return' },
        { kind: 'lie', stat: 'LOEGN', dc: 10, group: 'end', label: 'Say “hans” about its own hat on purpose, so the hat changes hands.',
          build: { en: 'Knagen loves his hat. (said the wrong way, on purpose)', answers: [['Knagen', 'elsker', 'hans', 'hat.']], tiles: ['Knagen', 'elsker', 'hans', 'hat.', 'sin', 'min'] },
          ok: [{ n: 'You say “hans hat”, and the floor obeys: a “hans” hands the thing to someone else. The red hat lifts off Knagen’s head and settles on yours.' }], fail: [{ n: 'The hat wobbles, unsure which way the grammar went, then lands on you. Knagen was not holding on very hard.' }], next: 'b5_hat' },
      ] },
    b5_return: { bg: 'kontor', npc: 'knage', title: 'Kontoret',
      steps: [{ n: 'You hang your coat on Knagen. It holds it the way other creatures hold a baby: carefully, proudly, at arm’s length.' }, { th: 'As thanks, it pulls a button off its scarf and gives it to you. A button that stays on whatever you sew it to.' }, { fx: { boon: 'knap', flag: 'Breturn', resp: 2 } }, { fx: { flag: 'Bdone' } }],
      opts: [{ kind: 'go', label: 'Leave.', next: 'map' }] },
    b5_hat: { bg: 'kontor', npc: 'knage', title: 'Kontoret',
      steps: [{ n: 'Knagen opens its beak. Then closes it. Fair is fair, on this floor. It goes very still, so that nobody says “hans” near it again.' }, { th: 'The hat fits. Anything you say under it sounds slightly official.' }, { fx: { boon: 'hat', flag: 'Bhat', resp: 1 } }, { fx: { flag: 'Bdone' } }],
      opts: [{ kind: 'go', label: 'Tip your hat. Leave.', next: 'map' }] },

    /* ===== DEN HALVE SAL: contract C, Rygtet ===== */
    c5_start: { bg: 'halv', npc: 'rygtet', title: 'Den halve sal', card: ['Den halve sal', '3. sal · somebody is talking'],
      steps: [
        { n: G => G.prev.Bwish ? 'The garden on the third floor is full of tape. A ribbon is looping through the flowers, printing as it goes.' : G.prev.Bwhole ? 'The finished wall on the third floor is covered in tape. A ribbon loops round it, printing as it goes.' : 'A ribbon of ticker tape loops through the third floor, printing as it goes.' },
        { n: 'It has mouths along it and no eyes at all.' },
        { say: 'rygtet', da: 'Kantinen er sur. Kranen er kedelig. Det synes alle. Jeg siger det bare.', en: 'Kantinen is grumpy. Kranen is boring. Everybody thinks so. I am just saying.' },
        { th: 'On this floor, what somebody synes about you sticks. Down in the basement the soup has gone sour. On the roof, Kranen is lifting a floor very, very slowly.' },
        { fx: { flag: 'Cstart' } },
      ],
      opts: [{ kind: 'go', label: 'Read the tape.', next: 'rygt_hub' }] },
    rygt_hub: { bg: 'halv', npc: 'rygtet', title: 'Den halve sal', hub: true,
      steps: [{ special: 'rygtLine' }],
      opts: [
        { kind: 'act', special: 'boxes:adj', label: 'Give every kind of creature its right word.', req: G => !G.flags.adjDone, next: 'c5_words', mark: true },
        { kind: 'say', stat: 'SPROG', dc: 11, group: 'end', label: 'Tell Rygtet what you think of Kantinen.', req: G => G.flags.adjDone && !G.flags.Cdone,
          build: { en: 'I actually think she is rather sweet.', origin: 'opinion2', answers: [['Jeg', 'synes', 'faktisk,', 'hun', 'er', 'ret', 'sød.'], ['Jeg', 'synes,', 'hun', 'faktisk', 'er', 'ret', 'sød.']], tiles: ['Jeg', 'synes', 'faktisk,', 'hun', 'er', 'ret', 'sød.', 'hende', 'tror'] },
          ok: [{ n: 'Rygtet prints it at once, in capitals.' }], fail: [{ n: 'The tape jams for a second. When it runs again, it has printed the important word, in capitals: SØD.' }], next: 'c5_sweet' },
        { kind: 'reply', group: 'end', req: G => G.flags.adjDone && !G.flags.Cdone, da: 'Synes du det? Det synes jeg ikke.', ok: [{ n: 'Rygtet stops printing.' }], next: 'c5_no' },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    c5_words: { bg: 'halv', npc: 'rygtet', title: 'Den halve sal',
      steps: [{ n: 'Rygtet runs your words through itself. It prints them more neatly than its own.' }, { say: 'rygtet', da: 'Fint. Men hvad synes DU så om Kantinen?', en: 'Fine. But what do YOU think of Kantinen, then?' }, { fx: { flag: 'adjDone', resp: 1 } }],
      opts: [{ kind: 'go', label: 'Think about it.', next: 'rygt_hub' }] },
    c5_sweet: { bg: 'kantine', npc: 'kantine', title: 'Kantinen',
      steps: [
        { n: 'The tape runs down the lift shaft all the way to the basement: KANTINEN ER SØD. Down there, the soup turns sweet as jam, and Kantinen starts to hum.' }, { n: 'As an afterthought, Rygtet prints KRANEN ER HURTIG. On the roof, the hook speeds up.' },
        { th: 'What you say about people here sticks to them. You decide to be careful with that.' },
        { fx: { boon: 'soed', flag: 'Csweet', resp: 2 } }, { fx: { flag: 'Cdone' } },
      ],
      opts: [{ kind: 'go', label: 'Taste the soup. Leave.', next: 'map' }] },
    c5_no: { bg: 'halv', npc: 'rygtet', title: 'Den halve sal',
      steps: [
        { n: 'Nobody has ever contradicted it before. Its mouths open and close. The tape goes slack and the floor is very quiet.' },
        { say: 'rygtet', da: 'Det synes du ikke? Nå.', en: 'You don’t think so? Oh.' },
        { n: 'All over Derhenne the words come unstuck. Kantinen is just Kantinen again. On the roof, Kranen speeds up.' },
        { fx: { boon: 'tavshed', flag: 'Cno', resp: 2 } }, { fx: { flag: 'Cdone' } },
      ],
      opts: [{ kind: 'go', label: 'Leave it coiled up.', next: 'map' }] },

    /* ===== KANTINEN · TAGET · KØJERNE ===== */
    kant5_hub: { bg: 'kantine', npc: 'kantine', title: 'Kantinen', hub: true, quest: ['S2'],
      steps: [{ special: 'kantLine5' }],
      opts: [
        { kind: 'act', special: 'boxes:gaar', label: 'Chat with Kantinen: Hvordan går det med …?', req: G => !G.flags.gaarDone, next: 'kant5_chat' },
        { kind: 'reply', group: 'hv', req: G => !(G.flags.Cstart && !G.flags.Cdone), da: 'Hvordan går det?', ok: [{ say: 'kantine', da: 'Det går fint, synes jeg. Der er bare alt for mange, der er på kursus.', en: 'It is going fine, I think. There are just far too many people on courses.' }] },
        { kind: 'reply', group: 'hv', req: G => G.flags.Cstart && !G.flags.Cdone, da: 'Hvordan går det?', ok: [{ say: 'kantine', da: 'Dårligt. Alle synes, jeg er sur. Så bliver man det.', en: 'Badly. Everybody thinks I am grumpy. Then you become it.' }] },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    kant5_chat: { bg: 'kantine', npc: 'kantine', title: 'Kantinen',
      steps: [{ say: 'kantine', da: 'Det var hyggeligt. Her, tag en skål.', en: 'That was nice. Here, have a bowl.' }, { fx: { flag: 'gaarDone', sk: 3, resp: 1 } }],
      opts: [{ kind: 'go', label: 'Back.', next: 'kant5_hub' }] },
    tag5_hub: { bg: 'tag', npc: 'kran', title: 'Taget', hub: true, idle: true,
      steps: [{ special: 'tagLine5' }],
      opts: [
        { kind: 'reply', group: 'hv', req: G => G.flags.Cstart && !G.flags.Cdone, da: 'Hvordan går det med byggeriet?', ok: [{ say: 'kran', da: 'Langsomt. Nogen synes, jeg er kedelig. Så bliver man det.', en: 'Slowly. Somebody thinks I am boring. Then you become it.' }] },
        { kind: 'reply', group: 'hv', req: G => !(G.flags.Cstart && !G.flags.Cdone), da: 'Hvordan går det med byggeriet?', ok: [{ say: 'kran', da: 'Det går fint. En etage om dagen.', en: 'It is going fine. One floor a day.' }] },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    koeje5_hub: { bg: 'koeje', title: 'Køjerne', hub: true, idle: true, home: true,
      steps: [{ special: 'koejeLine5' }],
      opts: [
        { kind: 'go', special: 'selfPlate', label: 'Look at yourself.' },
        { kind: 'go', label: 'Sleep. Let the marks settle.', next: 'sleep' },
        { kind: 'go', label: 'Go out.', next: 'map' },
      ] },

    /* ===== AUDITORIET (here only once): the guest ===== */
    gaest5: { bg: 'skole', npc: 'blyant', title: 'Auditoriet', card: ['Auditoriet', 'a guest lecture, only once'],
      steps: [{ n: 'A guest lecture, on the third floor’s other side. The guest is a pencil, very short now, in a borrowed jacket.' }, { say: 'blyant', da: 'Kan du huske mig?', en: 'Can you remember me?' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 9, group: 'g', label: 'Say you think so. Isn’t it you who draws floors?',
          build: { en: 'Yes, I think so. Isn’t it you who draws floors?', answers: [['Ja,', 'det', 'tror', 'jeg.', 'Er', 'det', 'ikke', 'dig,', 'der', 'tegner', 'etager?']], tiles: ['Ja,', 'det', 'tror', 'jeg.', 'Er', 'det', 'ikke', 'dig,', 'der', 'tegner', 'etager?', 'du', 'synes'] },
          ok: [{ say: 'blyant', da: 'Jo, præcis! Her, det her er vist dit.', en: 'Yes, exactly! Here, I think this is yours.' }, { glimpse: 'karakter' }, { fx: { flag: 'gaestGone', resp: 1 } }],
          fail: [{ say: 'blyant', da: 'Jo, præcis. Det her er vist dit.', en: 'Yes, exactly. I think this is yours.' }, { glimpse: 'karakter' }, { fx: { flag: 'gaestGone' } }], next: 'map' },
        { kind: 'reply', group: 'g', da: 'Ja. Dig kan jeg godt huske.', ok: [{ say: 'blyant', da: 'Og dig kan jeg også huske. Her, det her er vist dit.', en: 'And I remember you too. Here, I think this is yours.' }, { glimpse: 'karakter' }, { fx: { flag: 'gaestGone', resp: 1 } }], next: 'map' },
        { kind: 'reply', group: 'g', da: 'Nej, det kan jeg ikke.', ok: [{ say: 'blyant', da: 'Nej. Det kan ingen her.', en: 'No. Nobody here can.' }, { n: 'It hands you an old exam paper anyway, on its way out.' }, { glimpse: 'karakter' }, { fx: { flag: 'gaestGone' } }], next: 'map' },
      ] },

    /* ===== PORTEN and the FINALE: a letter to Hertil ===== */
    port5_hub: { bg: 'port', npc: 'stempel', title: 'Porten', hub: true,
      steps: [{ special: 'portLine5' }],
      opts: [
        { kind: 'go', label: 'Write a letter to Hertil.', req: G => G.flags.Adone && G.flags.Bdone && G.flags.Cdone && !G.flags.Fdone, next: 'f5_1', mark: true },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    f5_1: { bg: 'port', npc: 'stempel', title: 'Porten', card: ['Porten', 'post til Hertil'],
      steps: [{ say: 'stempel', da: 'Post til Hertil? Til hvem?', en: 'Post to Hertil? To whom?' }, { th: 'Naboen. The lamppost across from your nest. It reads anything.' }, { n: 'You start with a question.' }],
      opts: [{ kind: 'say', stat: 'SPROG', dc: 10, label: 'Ask how its newspaper is going.', build: { en: 'How is your newspaper going?', origin: 'mail1', answers: [['Hvordan', 'går', 'det', 'med', 'din', 'avis?']], tiles: ['Hvordan', 'går', 'det', 'med', 'din', 'avis?', 'avisen', 'dit'] },
        ok: [{ th: 'Good. After din, the noun stays plain: din avis.' }], fail: [{ th: 'The pen blots. You fix it: din avis.' }], next: 'f5_2' }] },
    f5_2: { bg: 'port', npc: 'stempel', title: 'Porten',
      steps: [{ n: 'Then how it is going for you.' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'w', label: 'Write that your studies are going really well.', req: G => G.prev.Astud || (!G.prev.Aprog && !G.prev.Atjener), build: { en: 'My studies are going really well.', origin: 'mail2', answers: [['Det', 'går', 'rigtig', 'godt', 'med', 'mit', 'studie.']], tiles: ['Det', 'går', 'rigtig', 'godt', 'med', 'mit', 'studie.', 'studiet', 'min'] }, ok: [], fail: [{ th: 'A blot. You write it again, neatly.' }], next: 'f5_3' },
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'w', label: 'Write that your work is going really well.', req: G => G.prev.Aprog || G.prev.Atjener, build: { en: 'My work is going really well.', origin: 'mail2', answers: [['Det', 'går', 'rigtig', 'godt', 'med', 'mit', 'arbejde.']], tiles: ['Det', 'går', 'rigtig', 'godt', 'med', 'mit', 'arbejde.', 'arbejdet', 'min'] }, ok: [], fail: [{ th: 'A blot. You write it again, neatly.' }], next: 'f5_3' },
      ] },
    f5_3: { bg: 'port', npc: 'stempel', title: 'Porten',
      steps: [{ n: 'Then somebody you know here.' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 11, group: 'c', label: 'Write about a colleague who is always late.', build: { en: 'I have a colleague who is always late.', origin: 'colleague', answers: [['Jeg', 'har', 'en', 'kollega,', 'der', 'altid', 'kommer', 'for', 'sent.']], tiles: ['Jeg', 'har', 'en', 'kollega,', 'der', 'altid', 'kommer', 'for', 'sent.', 'ham', 'han'] }, ok: [], fail: [{ th: 'The ink runs. You trace over it.' }], next: 'f5_4' },
        { kind: 'say', stat: 'SPROG', dc: 11, group: 'c', label: 'Write about a colleague who never remembers your name.', build: { en: 'I have a colleague who never remembers my name.', origin: 'colleague', answers: [['Jeg', 'har', 'en', 'kollega,', 'der', 'aldrig', 'kan', 'huske', 'mit', 'navn.']], tiles: ['Jeg', 'har', 'en', 'kollega,', 'der', 'aldrig', 'kan', 'huske', 'mit', 'navn.', 'ham', 'sit'] }, ok: [], fail: [{ th: 'The ink runs. You trace over it.' }], next: 'f5_4' },
      ] },
    f5_4: { bg: 'port', npc: 'stempel', title: 'Porten',
      steps: [{ n: 'And what you think of him.' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 11, group: 'o', label: 'Write that you actually think he is really skilled.', build: { en: 'I actually think he is really skilled.', origin: 'opinion', answers: [['Jeg', 'synes', 'faktisk,', 'han', 'er', 'virkelig', 'dygtig.'], ['Jeg', 'synes,', 'han', 'faktisk', 'er', 'virkelig', 'dygtig.']], tiles: ['Jeg', 'synes', 'faktisk,', 'han', 'er', 'virkelig', 'dygtig.', 'ham', 'tror'] }, ok: [], fail: [{ th: 'You cross out a word and write it again above.' }], next: 'f5_send' },
        { kind: 'say', stat: 'SPROG', dc: 11, group: 'o', label: 'Write that you sometimes think he is a bit strange.', build: { en: 'I sometimes think he is a bit strange.', origin: 'opinion', answers: [['Jeg', 'synes', 'nogle', 'gange,', 'han', 'er', 'lidt', 'mærkelig.'], ['Jeg', 'synes,', 'han', 'nogle', 'gange', 'er', 'lidt', 'mærkelig.']], tiles: ['Jeg', 'synes', 'nogle', 'gange,', 'han', 'er', 'lidt', 'mærkelig.', 'ham', 'tror'] }, ok: [], fail: [{ th: 'You cross out a word and write it again above.' }], next: 'f5_send' },
      ] },
    f5_send: { bg: 'port', npc: 'stempel', title: 'Porten',
      steps: [
        { special: 'mailEcho' },
        { n: 'Stemplet stamps the envelope HERTIL and feeds it into the pipe. Pop. Gone, downward, a long way.' },
        { say: 'stempel', da: 'Det kommer frem. Det gør det altid.', en: 'It will get there. It always does.' },
        { fx: { flag: 'Fdone', resp: 1 } },
      ],
      opts: [{ kind: 'go', label: 'Go to bed.', next: 'f5_reply' }] },
    f5_reply: { bg: 'koeje', title: 'Køjerne', night: true, card: ['Natskift', 'post from below'],
      steps: [
        { n: 'Before morning, an answer comes back up the pipe. The handwriting is lamplight on paper.' },
        { say: 'nabo', da: 'Det går fint. Jeg læser stadig avis.', en: 'It is going fine. I am still reading the newspaper.' },
        { say: 'nabo', da: 'P.S. Din kalender ringede. Den vil gerne flytte jeres aftale.', en: 'P.S. Your calendar rang. It would like to move your appointment.' },
        { th: 'You do not have a calendar. You do not have an appointment. Do you?' },
      ],
      opts: [{ kind: 'go', label: 'End the lesson.', next: 'end' }] },
  },
});
