/* =========================================================================
   HERTIL · Kapitel 1 · Lektion 3 — "Hvor ligger den henne?"  (ends Kapitel 1)
   Book 1.3: shops and places, place prepositions (ved siden af, overfor, i nærheden af,
   tæt på, på hjørnet af), i / på with streets, indefinite and definite form,
   den / det / de / der, short answers (det er jeg, det gør jeg, det er der),
   mange / meget, glad for / træt af / kan godt lide, compound nouns.
   The grammar is the physics: Hertil grew a neighbourhood overnight, and nothing in it
   stays put. A building only lies still once someone says WHERE it lies.
   "en bager" calls any new bakery into being; "bageren" calls the one we know.
   Count the uncountable ("mange larm") and noise comes apart into little pieces.
   Spoilers live here and in the project doc, never in messages to Bruno.
   ========================================================================= */

const addrBuild = { en: 'I live in Fjergade / on Tandvej, near the church / next to the launderette.', origin: 'addr',
  answers: [['Jeg', 'bor', 'i', 'Fjergade,', 'i', 'nærheden', 'af', 'kirken.'], ['Jeg', 'bor', 'i', 'Fjergade,', 'ved', 'siden', 'af', 'vaskeriet.'],
    ['Jeg', 'bor', 'på', 'Tandvej,', 'i', 'nærheden', 'af', 'kirken.'], ['Jeg', 'bor', 'på', 'Tandvej,', 'ved', 'siden', 'af', 'vaskeriet.']],
  tiles: ['Jeg', 'bor', 'i', 'på', 'Fjergade,', 'Tandvej,', 'i', 'nærheden', 'af', 'kirken.', 'ved', 'siden', 'vaskeriet.', 'til'] };
const likeBuild = { en: 'Yes, I am. There are many shops, and I like that.', origin: 'hood',
  answers: [['Ja,', 'det', 'er', 'jeg.', 'Der', 'er', 'mange', 'butikker,', 'og', 'det', 'kan', 'jeg', 'godt', 'lide.'], ['Ja,', 'det', 'er', 'jeg.', 'Der', 'er', 'mange', 'butikker,', 'og', 'jeg', 'kan', 'godt', 'lide', 'det.']],
  tiles: ['Ja,', 'det', 'er', 'jeg.', 'Der', 'er', 'mange', 'butikker,', 'og', 'det', 'kan', 'jeg', 'godt', 'lide.', 'meget', 'gør'] };
const tiredBuild = { en: 'No, I am not. There are far too many cars, and I am tired of that.', origin: 'hood',
  answers: [['Nej,', 'det', 'er', 'jeg', 'ikke.', 'Der', 'er', 'alt', 'for', 'mange', 'biler,', 'og', 'det', 'er', 'jeg', 'træt', 'af.'], ['Nej,', 'det', 'er', 'jeg', 'ikke.', 'Der', 'er', 'alt', 'for', 'mange', 'biler,', 'og', 'jeg', 'er', 'træt', 'af', 'det.']],
  tiles: ['Nej,', 'det', 'er', 'jeg', 'ikke.', 'Der', 'er', 'alt', 'for', 'mange', 'biler,', 'og', 'det', 'er', 'jeg', 'træt', 'af.', 'meget', 'gør'] };

SESSIONS.k1l3 = {
  id: 'k1l3', order: 3, short: 'Lektion 3', prevSession: 'k1l2', nextSession: null, chapter: 'Kapitel 1 · Baggrund & bydel', title: 'Lektion 3 · Hvor ligger den henne?', en: 'Where is it?',
  blurb: 'Hertil grew a neighbourhood overnight. Nothing in it stays where it is.',
  start: 'p3_wake', home: 'rede', travelAfter: 'p3seen', cluesFlag: 'clues3', cluesNeed: 3, dcMod: 3,
  startState: { resp: 8, sk: 10, insp: 1, boons: ['anker', 'urnoegle'], statXP: { SPROG: 12, LOEGN: 3, SNIGE: 5, HANDEL: 3, INDSIGT: 9 },
    origin: { reason: 'Jeg kom hertil på grund af en lyd.', stay: 'Jeg skal være her i et år.' }, met: ['taeller', 'samler', 'spejl', 'bagvendt', 'uret', 'unge'] },

  locations: {
    rede:    { name: 'Reden', en: 'your nest, now with a house number', x: 30, y: 62, bg: 'nest', night: true, entry: G => 'rede3_hub' },
    trappe:  { name: 'Trappen', en: 'where Tælleren keeps the book', x: 68, y: 68, bg: 'stair', entry: G => 'trappe3_hub' },
    gaden:   { name: 'Fjergade', en: 'the street that grew overnight', x: 44, y: 38, bg: 'gade', entry: G => !G.flags.A0 ? 'a3_start' : 'gade_hub' },
    torvet:  { name: 'Torvet', en: 'the square, very loud', x: 76, y: 30, bg: 'torv', entry: G => !G.flags.Bstart ? 'b3_start' : G.flags.mmDone && !G.flags.Bdone ? 'b3_larm' : 'torv_hub' },
    vaskeri: { name: 'Vaskeriet', en: 'right next to your nest, of course', x: 16, y: 74, bg: 'vaskeri', req: G => G.flags.Cfound, entry: G => !G.flags.Cin ? 'c3_in' : 'vask_hub' },
    bund:    { name: 'Bunden', en: 'Samleren makes signs', x: 56, y: 54, bg: 'bottom', entry: G => 'bund3_hub' },
    damme:   { name: 'Dammene', en: 'Spejlet answers short', x: 44, y: 84, bg: 'ponds', entry: G => 'damme3_hub' },
    enge:    { name: 'Engen', en: 'where Ungen lives (in a bush)', x: 12, y: 40, bg: 'enge', entry: G => 'enge3_hub' },
    bageriet:{ name: 'Yndlingsbageren', en: 'here only once', x: 60, y: 20, bg: 'bageri', eph: true, req: G => G.flags.mapDone && !G.flags.bagerGone, entry: G => 'bageriet' },
  },

  ending: G => [G.flags.Abind ? 'Fast gade' : G.flags.Awalk ? 'Vandregade' : G.flags.Ahome ? 'Dit hjørne' : null,
    G.flags.Bquiet ? 'Stille' : G.flags.Bband ? 'Bandet' : G.flags.Bjar ? 'Larm på glas' : null,
    G.flags.Cwash ? 'Vasket' : G.flags.Cno ? 'Uvasket' : null].filter(Boolean).join(' · ') || '—',
  chapterEnd: ['Kapitel 1 · Baggrund & bydel', 'Kapitel 1 er slut', 'You have a reason, a stay and an address. Next: Kapitel 2 · Arbejde & uddannelse, somewhere new, with new creatures. Coming soon.'],
  carryFlags: ['Abind', 'Awalk', 'Ahome', 'Bquiet', 'Bband', 'Bjar', 'Cwash', 'Cno'],

  quests: {
    A: { title: 'Bydelen flytter sig', en: 'The neighbourhood keeps moving', obj: [['Ask Kirken about Bageren (Fjergade)', 'formDone'], ['Pin the drifting buildings of Fjergade', 'mapDone'], ['Tell Bydelen where it lies', 'Adone']] },
    B: { title: 'Larmen', en: 'The Noise', obj: [['Count what can be counted on Torvet', 'mmDone'], ['Deal with Larmen', 'Bdone']] },
    C: { title: 'Vaskeriet', en: 'The launderette', obj: [['Find a launderette (ask your neighbour)', 'Cfound'], ['Give the words their den and det back', 'dendetDone'], ['Answer Vaskeriet', 'Cdone']] },
    F: { title: 'Adresse', en: 'Your address', obj: [['Have your address written in at Trappen', 'Fdone']] },
    S1: { title: 'Skiltene', en: 'The signs', side: true, obj: [['Find the shops of Fjergade by name', 'huntDone3']] },
    S2: { title: 'Samlerens skilte', en: "Samleren's signs", side: true, obj: [['Help Samleren put the right sign on each place', 'stederDone']] },
    S3: { title: 'Gaderne skændes', en: 'The streets argue', side: true, obj: [['Settle i or på for every street', 'gaderDone']] },
    S4: { title: 'Korte svar', en: 'Short answers', side: true, obj: [['Answer Spejlet the short way', 'korteDone']] },
    S5: { title: 'Hvem bor hvor?', en: 'Who lives where?', side: true, obj: [['Guess who Ungen is talking about', 'ungeDone']] },
    S6: { title: 'Spor', en: 'Traces', side: true, obj: [['Find three more traces of what you were', 'clues3']] },
  },

  glimpses: {
    nummer: { name: 'Nummer 7', en: 'Number 7', text: 'Number 7. You did not have to read it. Your hand already knew which way the 7 turns. You have lived at a number 7 before.' },
    kort: { name: 'Gaden fra oven', en: 'The street from above', text: 'From up in the church tower the pinned street has a shape. Two rows, a corner, a bakery across the way. You have walked a street exactly like it, carrying something warm.' },
    kringle: { name: 'Kardemomme', en: 'Cardamom', text: 'The smell hits you before the taste does. Mornings. A paper bag going soft at the bottom. Somebody saying “Den skal du prøve.”' },
    stoej: { name: 'I larmen', en: 'In the noise', text: 'For one bar, somewhere in the noise, a voice calls a name. Not yours, here. But it was yours, somewhere.' },
    vask: { name: 'En sok', en: 'A sock', text: 'Out of the wash comes a sock you have never seen. You know exactly which drawer it lived in.' },
  },

  places: {
    fjergade: { title: 'Fjergade', q: 'Hvor ligger den?', street: 'FJERGADE', cross: 'TANDVEJ', flag: 'mapDone',
      good: 'Every house lands with a soft thump and stays there. One spot on the corner stays empty, waiting for something that has not arrived yet.', meh: 'Most houses land. One keeps hovering a little, just to make a point.',
      start: { 1: 'kirke' },
      names: { kirke: 'kirken', park: 'parken', bager: 'bageren', apotek: 'apoteket', cafe: 'caféen', slagter: 'slagteren', posthus: 'posthuset' },
      rounds: [
        { k: 'bager', at: 5, clue: 'Bageren ligger lige overfor kirken.', why: 'overfor: across the street. lige makes it exact.' },
        { k: 'posthus', at: 0, clue: 'Posthuset ligger ved siden af kirken, men ikke tæt på Tandvej.', why: 'ved siden af: next to. tæt på: close to. Of the two spots next to the church, this is the one far from Tandvej.' },
        { k: 'slagter', at: 4, clue: 'Slagteren ligger lige overfor posthuset.', why: 'lige overfor: straight across the street.' },
        { k: 'apotek', at: 2, clue: 'Apoteket ligger ved siden af kirken, tæt på Tandvej.', why: 'ved siden af kirken, on the Tandvej side.' },
        { k: 'cafe', at: 3, clue: 'Caféen ligger på hjørnet af Fjergade og Tandvej, ved siden af apoteket.', why: 'på hjørnet af Fjergade og Tandvej: where the two streets meet.' },
        { k: 'park', at: 6, clue: 'Parken ligger i nærheden af bageren, men ikke på hjørnet.', why: 'i nærheden af: near. The corner spot stays free.' },
      ] },
  },

  hunts: {
    gade: { title: 'Skiltene', en: 'Find the shops by name', bg: 'gade',
      find: ['bager', 'kirke', 'apotek', 'cafe', 'posthus', 'slagter'], decoys: ['blomsterhandler', 'bibliotek', 'svoemmehal', 'station', 'vaskeri', 'skobutik', 'supermarked', 'raadhus'] },
  },

  jobs: {
    steder: { title: 'Samlerens skilte', h2: 'Hvilket sted?', ask: 'Hvad hedder stedet?', prefix: '', flag: 'stederDone', pay: 2,
      keys: ['bager', 'slagter', 'apotek', 'kirke', 'park', 'bibliotek', 'svoemmehal', 'station', 'posthus', 'vaskeri', 'cafe', 'blomsterhandler', 'skobutik', 'raadhus'], // no supermarked: it sells everything, so it would fit every shop's sign
      end: r => r >= 5 ? 'Samleren hangs every sign the right way up. It has never done that before, and is not sure it likes it.' : 'Some signs end up on the wrong places. The bakery now sells shoes. Nobody minds.' },
  },

  boxes: {
    form: { title: 'Kirkens regel', q: 'Ny eller kendt?', boxes: ['ubestemt', 'bestemt'],
      good: 'One bakery. The right one. Kirken rings, pleased.', meh: 'Two extra bakeries pop into being, look around, and drift off to find somewhere to lie.',
      items: [
        { t: 'Er der ___ bager her i nærheden?', opts: ['en', 'bageren'], a: 0, why: 'Something new, not known yet: en bager.' },
        { t: 'Jeg kan ikke finde ___. Hvor ligger den?', opts: ['en kirke', 'kirken'], a: 1, why: 'We both know which one: kirken.' },
        { t: 'Der ligger ___ apotek på hjørnet.', opts: ['et', 'apoteket'], a: 0, why: 'Introduced for the first time: et apotek.' },
        { t: 'Du kender posthuset, ikke? Hvor ligger ___?', opts: ['et posthus', 'posthuset'], a: 1, why: 'You both know it: posthuset.' },
        { t: 'Er der ___ hotel i Fjergade?', opts: ['et', 'hotellet'], a: 0, why: 'New: et hotel. (Known: hotellet, with a double l.)' },
        { t: 'Kan du se svømmehallen? Jeg bor ved siden af ___.', opts: ['en svømmehal', 'svømmehallen'], a: 1, why: 'You both see it, so it is known: ved siden af svømmehallen.' },
      ] },
    mangemeget: { title: 'Torvets tælling', q: 'mange eller meget?', boxes: ['mange', 'meget'],
      good: 'Everything on Torvet is counted the right way. The noise pulls itself together.', meh: 'Most of it is counted right. A few loose noises keep running around the edges.',
      items: [
        { t: 'Der er ___ biler på Torvet.', a: 0, why: 'You can count cars: mange biler.' },
        { t: 'Der er alt for ___ larm.', a: 1, why: 'You cannot count noise: meget larm.' },
        { t: 'Der er ___ trafik i Fjergade.', a: 1, why: 'Traffic is not counted: meget trafik.' },
        { t: 'Der er rigtig ___ caféer.', a: 0, why: 'One café, two caféer: mange.' },
        { t: 'Der er ikke så ___ lys om natten.', a: 1, why: 'Light is uncountable: meget lys.' },
        { t: 'Der er ___ grønne områder.', a: 0, why: 'Områder can be counted: mange.' },
        { t: 'Der er ___ væsner på Torvet i dag.', a: 0, why: 'Creatures can be counted: mange væsner.' },
        { t: 'Der er ikke så ___ luft i vaskeriet.', a: 1, why: 'Air is uncountable: meget luft.' },
      ] },
    dendet: { title: 'Ord uden køn', q: 'den, det, de eller der?', boxes: ['den', 'det', 'de', 'der'],
      good: 'Every word gets its den or det back. The washing machines hum in agreement.', meh: 'Most words get their gender back. One sock is still not sure what it is.',
      items: [
        { t: '(en kirke) Hvor ligger ___?', a: 0, why: 'An en-word: den.' },
        { t: '(et apotek) ___ ligger på hjørnet.', a: 1, why: 'An et-word: det.' },
        { t: '(to caféer) ___ ligger ved Torvet.', a: 2, why: 'Plural: de.' },
        { t: '___ er meget larm her.', a: 3, why: 'der er: says that something exists.' },
        { t: 'Er du glad for at bo her? Ja, ___ er jeg.', a: 1, why: 'det stands for the whole sentence: Ja, det er jeg.' },
        { t: 'Ved siden af bageren ligger ___ en slagter.', a: 3, why: 'Something else is first, so der comes after the verb: ligger der.' },
        { t: '___ er min yndlingscafé.', a: 1, why: 'det er + noun: saying what something is.' },
        { t: '(et vaskeri) Jeg kan ikke finde ___.', a: 1, why: 'An et-word: det.' },
      ] },
    gader: { title: 'Gaderne skændes', q: 'i eller på?', boxes: ['i', 'på'],
      good: 'The streets stop arguing. Fjergade and Tandvej shake hands at the corner.', meh: 'Most streets are satisfied. Tandvej is still muttering.',
      items: [
        { t: 'Kirken bor ___ Fjergade.', a: 0, why: 'Most -gade streets: i.' },
        { t: 'Der ligger en kiosk ___ Tandvej.', a: 1, why: '-vej: på.' },
        { t: 'Vi ses ___ Torvet.', a: 1, why: 'A torv: på.' },
        { t: 'Samleren har et lager ___ Støvstræde.', a: 0, why: '-stræde: i.' },
        { t: 'Mølen sælger gnister ___ Ekko Allé.', a: 1, why: 'An allé: på.' },
        { t: 'Spejlet har en fætter ___ Lilla Plads.', a: 1, why: 'A plads: på.' },
        { t: 'Uret løber tit ___ Klokkegade.', a: 0, why: '-gade: i.' },
        { t: 'Bydelen sover ___ Tandvej nummer 3.', a: 1, why: '-vej: på.' },
      ] },
    korte: { title: 'Korte svar', q: 'Hvad svarer man?', boxes: ['a', 'b', 'c'],
      good: 'Spejlet ripples, pleased. Short answers are its favourite kind: they fit in a pond.', meh: 'Spejlet gives some of your answers back slightly bent.',
      items: [
        { t: 'Er du glad for at bo her?', opts: ['Ja, det er jeg.', 'Ja, det gør jeg.', 'Ja, jeg er.'], a: 0, why: 'With være, repeat det + the same verb: det er jeg.' },
        { t: 'Bor du i Fjergade?', opts: ['Ja, det gør jeg.', 'Ja, det bor jeg.', 'Ja, jeg gør.'], a: 0, why: 'With other verbs, use gør: det gør jeg.' },
        { t: 'Er der en bager her?', opts: ['Ja, det er der.', 'Ja, der er det.', 'Ja, det gør der.'], a: 0, why: 'Er der …? – Ja, det er der.' },
        { t: 'Kender du Naboen?', opts: ['Nej, det gør jeg ikke.', 'Nej, jeg kender ikke.', 'Nej, det er jeg ikke.'], a: 0, why: 'kende is not være: Nej, det gør jeg ikke.' },
        { t: 'Bor du ikke på Tandvej?', opts: ['Jo, det gør jeg.', 'Ja, det gør jeg.', 'Nej, det gør jeg.'], a: 0, why: 'Yes to a negative question is jo.' },
        { t: 'Kan du lide larm?', opts: ['Nej, det kan jeg ikke.', 'Nej, det gør jeg ikke.', 'Nej, jeg kan ikke det.'], a: 0, why: 'Repeat the modal: Nej, det kan jeg ikke.' },
        { t: 'Er der mange biler i Fjergade?', opts: ['Nej, det er der ikke.', 'Nej, der er det ikke.', 'Nej, det gør der ikke.'], a: 0, why: 'Nej, det er der ikke.' },
      ] },
  },

  guess: {
    unge: { title: 'Hvem bor hvor?', pool: ['taeller', 'samler', 'bager', 'kirke', 'nabo', 'vaskeri', 'spejl', 'larm', 'unge'],
      end: r => r >= 5 ? 'Ungen gives you its whole address book. It is one page. It is all your address.' : 'Ungen gets bored and starts asking you where YOU live, again and again.',
      rounds: [
        { npc: 'taeller', lines: ['Den bor på Trappen.', 'Den tæller hele dagen.', 'Den har en trompet i stedet for et hoved.'] },
        { npc: 'samler', lines: ['Den bor på Bunden, tæt på alt, der falder.', 'Den har mange arme.', 'Den laver skilte for tiden.'] },
        { npc: 'bager', lines: ['Den bor i Fjergade, lige overfor kirken.', 'Den lugter af kardemomme.', 'Den har en mund som en ovn.'], words: ['bager'] },
        { npc: 'kirke', lines: ['Den bor i Fjergade.', 'Den har et rundt vindue i stedet for et øje.', 'Den ringer, når den er glad.'], words: ['kirke'] },
        { npc: 'nabo', lines: ['Den bor lige overfor din rede.', 'Den er høj og tynd.', 'Den lyser om natten.'] },
        { npc: 'vaskeri', lines: ['Det bor lige ved siden af din rede.', 'Det drejer rundt og rundt.', 'Det vasker alt, også ord.'], words: ['vaskeri'] },
      ] },
  },

  travel: [
    { id: 'drift', bg: 'road', steps: [{ n: 'A small house drifts past at knee height, asking everyone the same thing. Nobody stops.' }],
      opts: [{ kind: 'reply', group: 'd', da: 'Du ligger her.', ok: [{ n: 'It settles, pleased, right in the middle of the road. Everyone walks around it without a word.' }, { fx: { resp: 1 } }], next: 'map' }, { kind: 'go', group: 'd', label: 'Let it drift.', next: 'map' }] },
    { id: 'derer', bg: 'road', steps: [{ n: 'Somebody across the road says “Der er en kat!”, and there is one. Nobody looks surprised. The cat least of all.' }],
      opts: [{ kind: 'reply', group: 'k', da: 'Der er en bager!', ok: [{ n: 'A small extra bakery pops into being beside you, sniffs the air, and wanders off looking for a corner of its own.' }, { fx: { insp: 1 } }], next: 'map' }, { kind: 'go', group: 'k', label: 'Say nothing. Walk on.', next: 'map' }] },
    { id: 'smaalarm', bg: 'road', req: G => G.flags.Bstart && !G.flags.Bdone, steps: [{ n: 'A little noise has escaped from Torvet. It is sitting in the road, going “bip”, very pleased with itself.' }],
      opts: [{ kind: 'act', stat: 'SNIGE', dc: 9, label: 'Catch it.', ok: [{ n: 'You pocket the bip. Later you sell it to Samleren for three scales.' }, { fx: { sk: 3 } }], fail: [{ n: 'It bips once, loudly, right in your ear, and is gone.' }], next: 'map' }, { kind: 'go', label: 'Leave it bipping.', next: 'map' }] },
    { id: 'uret3', bg: 'road', npc: 'uret', req: G => G.prev.Aride, steps: [{ n: 'Uret trots past with its saddle on, admiring its own face in a puddle.' }],
      opts: [{ kind: 'reply', da: 'Hej, Uret!', ok: [{ n: 'It neighs the time without looking up. It is a quarter past something.' }, { fx: { resp: 1 } }], next: 'map' }, { kind: 'go', label: 'Walk on.', next: 'map' }] },
    { id: 'savnet3', bg: 'road', npc: 'savnet', req: G => G.prev.Bsoft, steps: [{ n: 'Lille Savn bumps against your shoulder. It misses the street it saw yesterday, which has moved.' }],
      opts: [{ kind: 'reply', da: 'Jeg savner den også.', ok: [{ n: 'It bobs, comforted, and goes back to missing things quietly.' }, { fx: { resp: 1 } }], next: 'map' }, { kind: 'go', label: 'Pat it. Walk on.', next: 'map' }] },
    { id: 'tal3', bg: 'road', req: G => !hasBoon('urnoegle'), steps: [{ n: 'The house numbers along the road come loose and swap places. Number 7 is now number ᚦ.' }, { special: 'glyphs' }], opts: [{ kind: 'go', label: 'Walk on.', next: 'map' }] },
  ],

  special: {
    async nest3Line() {
      const f = G.flags;
      const lines = f.Adone && f.Bdone && f.Cdone && !f.Fdone ? ['Your nest has a house number and nowhere to write it. Tælleren is waiting at the Stair with the book.']
        : [G.prev.Bsoft ? 'Lille Savn is tied to your doorknob. You have a doorknob now.' : 'Your nest has a doorknob now. Nobody knows who put it there.', 'Across the street, Naboen turns a page of its newspaper by its own light.', f.Ahome ? 'Bydelen snores around your nest like a cat made of streets.' : f.Adone ? 'The street outside lies still. It looks proud of itself.' : 'The street outside creaks as it drifts a little to the left.'];
      logAdd(`<p>${esc(pick(lines))}</p>`, 'narr');
    },
    async gadeLine() {
      const f = G.flags;
      logAdd(`<p>${esc(f.Adone ? (f.Awalk ? 'Fjergade has wandered a little way down the hill since yesterday. The shops trot after it, and the bakery comes over to sniff you.' : 'Fjergade lies still. The houses look a little bored, which is how houses should look.') : f.mapDone ? 'The houses are pinned. Under the street something enormous breathes in its sleep.' : pick(['The houses drift a hand’s width above the ground, slowly, like jellyfish.', 'Bageren floats past, oven door open, smelling of cardamom. Nobody follows it.']))}</p>`, 'narr');
    },
    async torvLine() { logAdd(`<p>${esc(G.flags.Bquiet ? 'Torvet is quiet. The floor tiles are thinking.' : G.flags.Bband ? 'Larmen is practising in a corner. It has learned a second chord.' : G.flags.Bjar ? 'Torvet is silent. Somewhere a jar is humming.' : 'Torvet roars.')}</p>`, 'narr'); },
    async vaskLine() { logAdd(`<p>${esc(G.flags.dendetDone ? 'The machines hum. A sock that knows it is an en sits proudly on a radiator.' : 'Everything that comes out of the machines has no gender. A sock that is neither en nor et weeps on the floor.')}</p>`, 'narr'); },
    async trappe3Line() {
      const f = G.flags, left = [!f.Adone && 'the street is still drifting', !f.Bdone && 'Torvet is too loud', !f.Cdone && 'your marks are grey with dust'].filter(Boolean);
      logAdd(`<p>${esc(left.length ? `Tælleren holds the book open and waits. It cannot write your address yet: ${left.join(', ')}.` : 'Tælleren has the book open at the last page. It is waiting for one more line.')}</p>`, 'narr');
    },
    async chapterEcho() {
      const o = G.origin, lines = [o.reason, o.stay || o.came, o.addr].filter(Boolean);
      if (!lines.length) return;
      logAdd(`<p>Tælleren reads the whole chapter back to you. It takes ${['', 'one line', 'two lines', 'three lines'][lines.length]}.</p>`, 'narr');
      for (const l of lines) { youSaid(l); TTS.say(l); await sleep(FAST ? 0 : 900); }
      await tapOn();
    },
    async regReact3() {
      const a = G.origin.addr || '';
      const [da, en] = /kirken/.test(a) ? ['I nærheden af kirken. Så kan du høre klokkerne. Hver time.', 'Near the church. Then you can hear the bells. Every hour.']
        : /vaskeriet/.test(a) ? ['Ved siden af vaskeriet. Så bliver du aldrig beskidt.', 'Next to the launderette. Then you will never be dirty.']
        : ['Godt. Det skriver jeg.', 'Good. I will write that.'];
      sayEntry({ say: 'taeller', da, en }); await tapOn();
    },
    async glyphs() { G.glyph = 3; AUDIO.sting('glyph'); toast('ᚦᚨᛚ · the numbers have gone strange', 'gold'); },
  },

  nodes: {
    /* ===== PROLOGUE ===== */
    p3_wake: { bg: 'nest', npc: 'nabo', title: 'Reden', card: ['Kapitel 1 · Baggrund & bydel', 'Lektion 3 — Hvor ligger den henne?'],
      steps: [
        { n: 'You wake up on a street. Your nest has a house number now: 7. Yesterday it did not have a street.' }, { glimpse: 'nummer' },
        { n: 'Across the street, a lamppost is reading a newspaper by its own light. It turns a page.' },
        { say: 'nabo', da: 'Godmorgen. Du bor her nu.', en: 'Good morning. You live here now.' },
        { th: 'It says this to the newspaper.' },
        { fx: { flag: 'p3seen' } },
      ],
      opts: [{ kind: 'go', label: 'Go to the Stair.', next: 'p3_stair' }] },
    p3_stair: { bg: 'stair', npc: 'taeller', title: 'Trappen', card: ['Trappen', 'Hertil has a neighbourhood now'],
      steps: [
        { say: 'taeller', da: 'Hertil har fået en bydel! Den kom i nat.', en: 'Hertil has got a neighbourhood! It came last night.' },
        { say: 'taeller', da: 'Men ingen ved, hvor noget ligger. Bageren flyder rundt. Kirken går tur.', en: 'But nobody knows where anything is. The bakery is floating around. The church is out for a walk.' },
        { say: 'taeller', da: 'Og på Torvet er der alt for meget larm. Jeg kan ikke høre mine egne tal.', en: 'And on the square there is far too much noise. I cannot hear my own numbers.' },
        { say: 'taeller', da: 'Når der er ro, skriver jeg din adresse i bogen.', en: 'When things are calm, I will write your address in the book.' },
        { th: 'Your marks are grey with street dust. You need a launderette. Maybe the neighbour knows one.' },
        { fx: { quest: ['A', 'B', 'C', 'F', 'S6'] } },
      ],
      opts: [{ kind: 'go', label: 'Go out into Bydelen.', next: 'map' }] },

    /* ===== REDEN: Naboen, the launderette ===== */
    rede3_hub: { bg: 'nest', npc: 'nabo', title: 'Reden', hub: true, idle: true, home: true,
      steps: [{ special: 'nest3Line' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 9, mark: true, label: 'Ask Naboen about a launderette.', req: G => !G.flags.Cfound, build: { en: 'Is there a launderette around here?', answers: [['Er', 'der', 'et', 'vaskeri', 'her', 'i', 'nærheden?']], tiles: ['Er', 'der', 'et', 'vaskeri', 'her', 'i', 'nærheden?', 'en', 'det'] },
          ok: [{ say: 'nabo', da: 'Et vaskeri? Ja, det ligger lige ved siden af din rede.', en: 'A launderette? Yes, it is right next to your nest.' }], fail: [{ n: 'Naboen was turning a page and caught only “vaskeri”. That was enough.' }, { say: 'nabo', da: 'Det ligger lige ved siden af din rede.', en: 'It is right next to your nest.' }], next: 'c3_found' },
        { kind: 'go', special: 'selfPlate', label: 'Look at yourself.' },
        { kind: 'go', label: 'Sleep. Let the marks settle.', next: 'sleep' },
        { kind: 'go', label: 'Go out.', next: 'map' },
      ] },
    c3_found: { bg: 'nest', npc: 'nabo', title: 'Reden',
      steps: [{ n: 'You look to your left. There it is: a launderette, spinning quietly, so close you could have touched it from bed.' }, { fx: { flag: 'Cfound' } }],
      opts: [
        { kind: 'reply', group: 'd', da: 'Nej, hvor dumt!', ok: [{ say: 'nabo', da: 'Mm.', en: 'Mm.' }, { th: 'Naboen turns a page. Somewhere, a launderette is laughing.' }], next: 'rede3_hub' },
        { kind: 'go', group: 'd', label: 'Pretend you knew.', next: 'rede3_hub' },
      ] },

    /* ===== FJERGADE: contract A ===== */
    a3_start: { bg: 'gade', npc: 'kirke', title: 'Fjergade', card: ['Fjergade', 'the street that grew overnight'],
      steps: [
        { n: 'Fjergade. The houses drift a hand’s width above the ground, slowly, like jellyfish.' },
        { n: 'A church walks down the middle of the street on a hundred small feet, ringing to itself.' },
        { say: 'kirke', da: 'Hvor er bageren? Den var her for et øjeblik siden.', en: 'Where is the bakery? It was here a moment ago.' },
        { fx: { flag: 'A0', quest: ['S1', 'S3'] } },
      ],
      opts: [{ kind: 'go', label: 'Talk to Kirken.', next: 'a3_kirke' }] },
    gade_hub: { bg: 'gade', npc: G => G.flags.Adone ? 'bager' : G.flags.mapDone ? 'bydel' : 'kirke', title: 'Fjergade', hub: true, quest: ['S1', 'S3'],
      steps: [{ special: 'gadeLine' }],
      opts: [
        { kind: 'go', label: 'Talk to Kirken.', req: G => !G.flags.formDone, next: 'a3_kirke' },
        { kind: 'act', special: 'findPlace:fjergade', label: 'Pin the drifting buildings.', req: G => G.flags.formDone && !G.flags.mapDone, next: 'a3_pinned', mark: true },
        { kind: 'go', label: 'Wake what is under the street.', req: G => G.flags.mapDone && !G.flags.Adone, next: 'a3_bydel', mark: true },
        { kind: 'act', special: 'hunt:gade', label: 'Find the shops by their names.', req: G => !G.flags.huntDone3, next: 'gade_hunted' },
        { kind: 'act', special: 'boxes:gader', label: 'Settle the streets’ argument.', req: G => !G.flags.gaderDone },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    a3_kirke: { bg: 'gade', npc: 'kirke', title: 'Fjergade',
      steps: [
        { say: 'kirke', da: 'Hør. Hvis du siger “en bager”, kommer der en ny bager. Hvis du siger “bageren”, kommer den, vi kender.', en: 'Listen. If you say “a bakery”, a new bakery comes. If you say “the bakery”, the one we know comes.' },
        { th: 'Behind the church, three bakeries are already floating that nobody has ever seen before.' },
      ],
      opts: [{ kind: 'act', special: 'boxes:form', label: 'Call the right bakery back.', next: 'a3_kirke2' }] },
    a3_kirke2: { bg: 'gade', npc: 'bager', title: 'Fjergade',
      steps: [
        { n: G => (G.flags.formScore || 0) >= 4 ? 'The strange bakeries fade like soap bubbles. One bakery drifts back down the street: the right one. It smells of cardamom and is humming to itself.' : 'The extra bakeries drift off sulking. The right one comes back too, eventually, after visiting all the others.' },
        { say: 'kirke', da: 'Nu ved vi, hvilken den er. Men ikke, hvor den ligger. Sig, hvor den ligger, så bliver den der.', en: 'Now we know which one it is. But not where it lies. Say where it lies, and it will stay there.' },
        { fx: { flag: 'formDone', resp: 1 } },
      ],
      opts: [{ kind: 'go', label: 'Look at the street.', next: 'gade_hub' }] },
    a3_pinned: { bg: 'gade', npc: 'kirke', title: 'Fjergade',
      steps: [
        { n: 'Kirken lifts you up into its tower by the collar to look at your work. From up here the street has a shape.' },
        { glimpse: 'kort' },
        { n: 'Then, under your feet, under the whole street, something enormous turns over in its sleep.' },
        { fx: { resp: 1 } },
      ],
      opts: [{ kind: 'go', label: 'Climb down.', next: 'gade_hub' }] },
    a3_bydel: { bg: 'gade', npc: 'bydel', title: 'Fjergade', card: ['Fjergade', 'what the street is lying on'],
      steps: [
        { n: 'The street lifts like a blanket. Under it lies Bydelen: a whole neighbourhood, asleep on its stomach, rooftops along its spine.' },
        { n: 'One window at the front opens. It is an eye. It looks at the sky first, then at a pigeon, then, for a moment, near you.' },
        { say: 'bydel', da: 'Hvor ligger jeg?', en: 'Where do I lie?' },
      ],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'end', label: 'Tell it to lie next to the Stair.', build: { en: 'You lie next to the Stair.', answers: [['Du', 'ligger', 'ved', 'siden', 'af', 'Trappen.']], best: [['Ved', 'siden', 'af', 'Trappen', 'ligger', 'du.']], tiles: ['Du', 'ligger', 'ved', 'siden', 'af', 'Trappen.', 'overfor', 'i'] },
          ok: [{ n: 'Bydelen shuffles over to the Stair and lies down with a sigh that takes a whole minute.' }], fail: [{ n: 'Bydelen rolls over halfway through your sentence and ends up next to the Stair anyway, by accident.' }], next: 'a3_bind' },
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'end', label: 'Tell it it may lie wherever it likes.', build: { en: 'You may lie where you want.', answers: [['Du', 'må', 'ligge,', 'hvor', 'du', 'vil.']], tiles: ['Du', 'må', 'ligge,', 'hvor', 'du', 'vil.', 'ligger', 'når'] },
          ok: [{ n: 'Bydelen gets up. Every house on its back sways. It has never been allowed before.' }], fail: [{ n: 'A pigeon the size of a bus lands on its roof in the middle of your sentence. Bydelen takes that as a yes.' }], next: 'a3_walk' },
        { kind: 'say', stat: 'SPROG', dc: 11, group: 'end', label: 'Tell it to lie close to your nest.', build: { en: 'You lie close to my nest.', answers: [['Du', 'ligger', 'tæt', 'på', 'min', 'rede.']], best: [['Tæt', 'på', 'min', 'rede', 'ligger', 'du.']], tiles: ['Du', 'ligger', 'tæt', 'på', 'min', 'rede.', 'ved', 'mit'] },
          ok: [{ n: 'Bydelen crawls across Hertil, very slowly, and curls up around your nest.' }], fail: [{ n: 'It misses a word, but it has already smelled your nest. It crawls there anyway.' }], next: 'a3_home' },
      ] },
    a3_bind: { bg: 'stair', npc: 'bydel', title: 'Trappen',
      steps: [{ n: 'Tælleren immediately starts counting its windows. It will be busy for a year. It has never looked happier.' }, { fx: { boon: 'gadekort', flag: 'Abind', resp: 2 } }, { fx: { flag: 'Adone' } }],
      opts: [{ kind: 'go', label: 'Leave them to it.', next: 'map' }] },
    a3_walk: { bg: 'gade', title: 'Fjergade',
      steps: [{ n: 'Bydelen wanders off, houses swaying. From now on it is somewhere else every morning, and so is the bakery.' }, { th: 'You will never find anything again. Things will find you instead.' }, { fx: { boon: 'vandregade', flag: 'Awalk', resp: 1 } }, { fx: { flag: 'Adone' } }],
      opts: [{ kind: 'go', label: 'Wave it off.', next: 'map' }] },
    a3_home: { bg: 'nest', npc: 'bydel', title: 'Reden',
      steps: [{ n: 'A street sign grows on the corner by your nest. There is a name on it. Nobody can read it, but everybody agrees it is yours.' }, { th: 'Naboen does not look up from its newspaper. But it moves its chair a little, to make room.' }, { fx: { boon: 'hjoerne', flag: 'Ahome', resp: 2 } }, { fx: { flag: 'Adone' } }],
      opts: [{ kind: 'go', label: 'Go out.', next: 'map' }] },
    gade_hunted: { bg: 'gade', title: 'Fjergade',
      steps: [{ n: 'Every shop answers to its name. The florist blushes. The pharmacy pretends it did not hear.' }, { fx: { flag: 'huntDone3', sk: 3, resp: 1 } }],
      opts: [{ kind: 'go', label: 'Back.', next: 'gade_hub' }] },

    /* ===== TORVET: contract B ===== */
    b3_start: { bg: 'torv', npc: 'larme', title: 'Torvet', card: ['Torvet', 'very, very loud'],
      steps: [
        { n: 'Torvet. It is so loud that the air is lumpy.' },
        { n: 'Somebody said “mange larm” here, and “meget biler”. Now the noise comes in hundreds of small countable pieces, and the cars have melted into one big puddle of car.' },
        { say: 'larme', da: 'Vi er mange! Vi er mange! Vi er MANGE!', en: 'We are many! We are many! We are MANY!' },
        { fx: { flag: 'Bstart' } },
      ],
      opts: [{ kind: 'act', special: 'boxes:mangemeget', label: 'Count everything the right way.', next: 'b3_counted' }] },
    b3_counted: { bg: 'torv', npc: 'larm', title: 'Torvet',
      steps: [{ n: 'The little noises run into each other and become one big Larmen again. The puddle sets into cars, which drive off, honking, embarrassed.' }, { fx: { flag: 'mmDone', resp: 1 } }],
      opts: [{ kind: 'go', label: 'Face Larmen.', next: 'b3_larm' }] },
    b3_larm: { bg: 'torv', npc: 'larm', title: 'Torvet',
      steps: [{ n: 'Larmen fills the square to the edges. It is busy being loud at a pigeon.' }, { say: 'larm', da: 'HVAD? HVAD SIGER DU?', en: 'WHAT? WHAT ARE YOU SAYING?' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'end', label: 'Tell it what you think of the noise.', build: { en: 'There is far too much noise, and I am tired of it.', answers: [['Der', 'er', 'alt', 'for', 'meget', 'larm,', 'og', 'det', 'er', 'jeg', 'træt', 'af.'], ['Der', 'er', 'alt', 'for', 'meget', 'larm,', 'og', 'jeg', 'er', 'træt', 'af', 'det.']], tiles: ['Der', 'er', 'alt', 'for', 'meget', 'larm,', 'og', 'det', 'er', 'jeg', 'træt', 'af.', 'mange'] },
          ok: [{ n: 'Larmen stops. It has never been told. It goes very, very quiet.' }], fail: [{ n: 'A tram of noise drowns the middle of your sentence. Larmen catches the end, and goes quiet anyway.' }], next: 'b3_quiet' },
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'end', label: 'Tell it you like the life it brings.', build: { en: 'There is a lot of life here, and I like that.', answers: [['Der', 'er', 'meget', 'liv', 'her,', 'og', 'det', 'kan', 'jeg', 'godt', 'lide.'], ['Der', 'er', 'meget', 'liv', 'her,', 'og', 'jeg', 'kan', 'godt', 'lide', 'det.']], tiles: ['Der', 'er', 'meget', 'liv', 'her,', 'og', 'det', 'kan', 'jeg', 'godt', 'lide.', 'mange'] },
          ok: [{ n: 'Larmen swells with pride and becomes, briefly, a brass band.' }], fail: [{ n: 'Your sentence gets lost in a drum solo. Larmen decides it was a compliment and turns into a band.' }], next: 'b3_band' },
        { kind: 'act', stat: 'SNIGE', dc: 11, group: 'end', label: 'Catch it in a jar.', ok: [{ n: 'You get the lid on. The jar shakes in your hands.' }], fail: [{ n: 'You get half of it. The other half follows the first half in, out of loyalty.' }], next: 'b3_jar' },
      ] },
    b3_quiet: { bg: 'torv', npc: 'larm', title: 'Torvet',
      steps: [{ n: 'Larmen shrinks to a polite hum and goes to sit in a corner. For the first time you can hear Torvet’s floor tiles thinking.' }, { fx: { boon: 'stilhed', flag: 'Bquiet', resp: 2 } }, { fx: { flag: 'Bdone' } }],
      opts: [{ kind: 'go', label: 'Tiptoe out.', next: 'map' }] },
    b3_band: { bg: 'torv', npc: 'larm', title: 'Torvet',
      steps: [{ n: 'From now on Larmen plays at your door every evening, slightly out of tune. Every creature on Torvet dances: in pairs, in threes, with lampposts.' }, { glimpse: 'stoej' }, { fx: { boon: 'band', flag: 'Bband', resp: 1 } }, { fx: { flag: 'Bdone' } }],
      opts: [{ kind: 'go', label: 'Dance out.', next: 'map' }] },
    b3_jar: { bg: 'torv', title: 'Torvet',
      steps: [{ n: 'Torvet is silent. Then everybody claps, very quietly. Inside the jar, something hums your name. Or a name.' }, { glimpse: 'stoej' }, { fx: { boon: 'glas', flag: 'Bjar', resp: 1 } }, { fx: { flag: 'Bdone' } }],
      opts: [{ kind: 'go', label: 'Pocket the jar.', next: 'map' }] },
    torv_hub: { bg: 'torv', npc: G => G.flags.Bjar ? null : 'larm', title: 'Torvet', hub: true, idle: true,
      steps: [{ special: 'torvLine' }],
      opts: [{ kind: 'go', label: 'Leave.', next: 'map' }] },

    /* ===== VASKERIET: contract C ===== */
    c3_in: { bg: 'vaskeri', npc: 'vaskeri', title: 'Vaskeriet', card: ['Vaskeriet', 'right next to your nest'],
      steps: [
        { n: 'Vaskeriet spins in the middle of the room, and so do the machines along the walls. They are its children. It is very busy with them.' },
        { say: 'vaskeri', da: 'Jeg vasker alt. Også ord. Nu ved ingen, om det hedder den eller det.', en: 'I wash everything. Words too. Now nobody knows whether it is den or det.' },
        { th: 'On the floor, a sock that is neither en nor et is crying.' },
        { fx: { flag: 'Cin' } },
      ],
      opts: [{ kind: 'go', label: 'Look around.', next: 'vask_hub' }] },
    vask_hub: { bg: 'vaskeri', npc: 'vaskeri', title: 'Vaskeriet', hub: true,
      steps: [{ special: 'vaskLine' }],
      opts: [
        { kind: 'act', special: 'boxes:dendet', label: 'Give the words their den and det back.', req: G => !G.flags.dendetDone, next: 'c3_sorted' },
        { kind: 'go', label: 'Ask Vaskeriet to wash your marks.', req: G => G.flags.dendetDone && !G.flags.Cdone, next: 'c3_wash', mark: true },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    c3_sorted: { bg: 'vaskeri', npc: 'vaskeri', title: 'Vaskeriet',
      steps: [{ n: 'The sock stops crying. It is an en. It is so relieved it hangs itself up to dry.' }, { fx: { flag: 'dendetDone', resp: 1 } }],
      opts: [{ kind: 'go', label: 'Back.', next: 'vask_hub' }] },
    c3_wash: { bg: 'vaskeri', npc: 'vaskeri', title: 'Vaskeriet',
      steps: [{ say: 'vaskeri', da: 'Dine aftryk? Dem kan jeg godt vaske. Men så vasker jeg dig også. Skal jeg det?', en: 'Your marks? I can wash those. But then I wash you too. Shall I?' }],
      opts: [
        { kind: 'go', group: 'end', label: 'Climb in.', next: 'c3_washed' },
        { kind: 'reply', group: 'end', da: 'Nej tak, det vil jeg ikke.', ok: [{ say: 'vaskeri', da: 'Fint. Så vasker jeg sokker i stedet. De klager aldrig.', en: 'Fine. Then I wash socks instead. They never complain.' }], next: 'c3_no' },
      ] },
    c3_washed: { bg: 'vaskeri', title: 'Vaskeriet',
      steps: [{ n: 'Round and round. Your marks come clean, every one. Something else comes off you in the wash.' }, { glimpse: 'vask' }, { th: 'You come out with an article. You are an en now. Or an et. It is hard to tell from the inside.' }, { fx: { boon: 'artikel', flag: 'Cwash', resp: 1 } }, { fx: { flag: 'Cdone' } }],
      opts: [{ kind: 'go', label: 'Drip out.', next: 'map' }] },
    c3_no: { bg: 'vaskeri', title: 'Vaskeriet',
      steps: [{ n: 'You wash your marks by hand in the sink. In the lint filter you find ten scales that fell out of somebody’s pocket.' }, { fx: { sk: 10, flag: 'Cno', resp: 2 } }, { fx: { flag: 'Cdone' } }],
      opts: [{ kind: 'go', label: 'Leave, clean enough.', next: 'map' }] },

    /* ===== side places ===== */
    bund3_hub: { bg: 'bottom', npc: 'samler', title: 'Bunden', hub: true, quest: ['S2'],
      steps: [{ n: 'Samleren is making signs for all the new places. It has more signs than places, which it considers a good problem.' }],
      opts: [
        { kind: 'reply', once: true, da: 'Hvad laver du?', ok: [{ say: 'samler', da: 'Skilte! “Et sted, hvor man kan …” Hjælp mig. Jeg betaler i skæl.', en: 'Signs! “A place where you can …” Help me. I pay in scales.' }] },
        { kind: 'act', special: 'jobs:steder', label: 'Put the right sign on each place.', req: G => !G.flags.stederDone },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    damme3_hub: { bg: 'ponds', npc: 'spejl', title: 'Dammene', hub: true, quest: ['S4'],
      steps: [{ n: 'Spejlet has decided to only accept short answers today. Long ones sink.' }],
      opts: [
        { kind: 'act', special: 'boxes:korte', label: 'Answer Spejlet the short way.', req: G => !G.flags.korteDone },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    enge3_hub: { bg: 'enge', npc: 'unge', title: 'Engen', hub: true, quest: ['S5'],
      steps: [{ n: 'Ungen has made an address book. It has one page.' }],
      opts: [
        { kind: 'reply', once: true, da: 'Hvor bor du?', ok: [{ say: 'unge', da: 'I en busk på Engen, ikke så langt fra Timerne. Hvor bor du? Hvor bor du? Hvor bor du?', en: 'In a bush on the meadow, not far from the Hours. Where do you live? Where do you live? Where do you live?' }] },
        { kind: 'act', special: 'guess:unge', label: 'Guess who Ungen is talking about.', req: G => !G.flags.ungeDone },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },

    /* ===== YNDLINGSBAGEREN (here only once) ===== */
    bageriet: { bg: 'bageri', npc: 'nabo', title: 'Yndlingsbageren', card: ['Yndlingsbageren', 'here only once'],
      steps: [
        { n: 'Inside the bakery, now that it lies still, it is warm. Naboen is here, reading by its own light, a coffee steaming beside it.' },
        { say: 'nabo', da: 'Kender du den ikke? Det er min yndlingsbager.', en: 'Don’t you know it? It is my favourite bakery.' },
      ],
      opts: [
        { kind: 'reply', group: 'b', da: 'Nej, det gør jeg ikke.', ok: [{ say: 'nabo', da: 'Nå. Den skal du prøve.', en: 'Well. You have to try it.' }, { n: 'It pushes a warm kringle across the table without looking up.' }, { glimpse: 'kringle' }, { fx: { insp: 1, resp: 1, flag: 'bagerGone' } }], next: 'map' },
        { kind: 'reply', group: 'b', da: 'Jo, det gør jeg.', ok: [{ say: 'nabo', da: 'Nå. Så ved du det.', en: 'Well. Then you know.' }, { n: 'It turns a page. Later you find a kringle in your pocket. Nobody saw it happen.' }, { glimpse: 'kringle' }, { fx: { insp: 1, flag: 'bagerGone' } }], next: 'map' },
      ] },

    /* ===== TRAPPEN and the FINALE: your address ===== */
    trappe3_hub: { bg: 'stair', npc: 'taeller', title: 'Trappen', hub: true,
      steps: [{ special: 'trappe3Line' }],
      opts: [
        { kind: 'go', label: 'Have your address written in.', req: G => G.flags.Adone && G.flags.Bdone && G.flags.Cdone && !G.flags.Fdone, next: 'f3_addr', mark: true },
        { kind: 'go', label: 'Leave.', next: 'map' },
      ] },
    f3_addr: { bg: 'stair', npc: 'taeller', title: 'Trappen', card: ['Trappen', 'adresse'],
      steps: [{ n: 'Tælleren opens the book at the last page. It is the only empty line left in it.' }, { say: 'taeller', da: 'Hvor bor du?', en: 'Where do you live?' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 10, label: 'Tell it where you live.', build: addrBuild, ok: [{ say: 'taeller', da: 'Godt. Det skriver jeg.', en: 'Good. I am writing that.' }], fail: [{ n: 'The pen slips once. Tælleren writes it anyway, in its best handwriting.' }], next: 'f3_hood' },
      ] },
    f3_hood: { bg: 'stair', npc: 'taeller', title: 'Trappen',
      steps: [{ special: 'regReact3' }, { say: 'taeller', da: 'Er du glad for at bo der?', en: 'Are you happy living there?' }],
      opts: [
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'h', label: 'Say what you like about it.', build: likeBuild, ok: [{ say: 'taeller', da: 'Så er jeg også glad.', en: 'Then I am happy too.' }], fail: [{ say: 'taeller', da: 'Godt. Det skriver jeg også.', en: 'Good. I write that too.' }], next: 'f3_end' },
        { kind: 'say', stat: 'SPROG', dc: 10, group: 'h', label: 'Say what you are tired of.', build: tiredBuild, ok: [{ say: 'taeller', da: 'Ja, det kan jeg godt forstå.', en: 'Yes, I can understand that.' }], fail: [{ say: 'taeller', da: 'Hm. Det skriver jeg også.', en: 'Hm. I write that too.' }], next: 'f3_end' },
        { kind: 'reply', group: 'h', da: 'Ja, meget!', ok: [{ fx: { origin: { hood: 'Ja, meget!' } } }, { say: 'taeller', da: 'Så er jeg også glad.', en: 'Then I am happy too.' }], next: 'f3_end' },
      ] },
    f3_end: { bg: 'stair', npc: 'taeller', title: 'Trappen',
      steps: [
        { n: 'KA-CHUNK. Tælleren stamps the last line. The book closes by itself, with a sound like a door.' },
        { special: 'chapterEcho' },
        { say: 'taeller', da: 'Nu ved jeg, hvorfor du kom, hvor længe du bliver, og hvor du bor. Så er kapitlet slut.', en: 'Now I know why you came, how long you are staying, and where you live. So the chapter is over.' },
        { th: 'It honks once, softly, and starts a new book. The first page is blank.' },
        { fx: { flag: 'Fdone', resp: 1 } },
      ],
      opts: [{ kind: 'go', label: 'Go home.', next: 'f3_letter' }] },
    f3_letter: { bg: 'nest', title: 'Reden', card: ['Kapitel 1', 'slut'],
      steps: [
        { n: 'That night a letter falls into your nest. It has your address on it: your street, your number. It is the first thing that has ever found you.' },
        { n: 'It comes from somewhere called Derhenne. Over there. Inside is one line:' },
        { say: 'nabo', da: 'Hvad laver du?', en: 'What do you do?' },
        { th: 'Naboen reads it out loud, from across the street, without looking up. You do not know the answer yet.' },
      ],
      opts: [{ kind: 'go', label: 'End the chapter.', next: 'end' }] },
  },
};
