/* =========================================================================
   HERTIL — core data (skills, attention, creatures, vocabulary, glossary)
   Session content lives in its own file (js/k1l1.js, …).
   ========================================================================= */

const SESSIONS = {}; // each lesson file registers itself here

/* Skills grow by USE: every answer/action tagged with a skill gives it XP (+1, +1 more on success). */
const STATS = {
  SPROG:   { name: 'Sprog',   en: 'Saying things so they hold. In Hertil, a sentence is a structure.' },
  LOEGN:   { name: 'Løgn',    en: 'Saying things that are not so, and making them hold anyway.' },
  SNIGE:   { name: 'Snige',   en: 'Sneaking, catching, climbing, slipping through.' },
  HANDEL:  { name: 'Handel',  en: 'Trading scales, sparks and reasons. Numbers and nerve.' },
  INDSIGT: { name: 'Indsigt', en: 'Noticing. Things here rarely mean what they look like.' },
};
const STAT_STEPS = [3, 7, 12, 18, 25]; // xp needed for level 1..5

/* Vægt (weight) replaces standing: how much you count in Hertil. Never explained to the player;
   It decides where their eyes go: away (0), a sideways glance (1), the head half turned (2).
   A full look (3) is never given by attention alone. */
const TIERS = [[-99, 'Fnug'], [0, 'Støv'], [5, 'Ting'], [12, 'Nogen'], [24, 'Navn']]; // how much you weigh in Hertil
const gazeFor = att => att >= 12 ? 2 : att >= 5 ? 1 : 0;

/* Gifts (found, earned, given). Every one of them changes how you play. */
const BOONS = {
  anker:   { name: 'Ankeret', en: 'Your reason is a thing', fx: 'You no longer sink. +1 on Indsigt: heavy things understand heavy things.' },
  traad:   { name: 'Tråden', en: 'Your reason is a purpose', fx: 'A thread pulls you forward. +1 on Snige.' },
  moenster:{ name: 'Mønsteret', en: 'Your reason is a story', fx: 'A story is written across you. +1 on Sprog.' },
  spejl:   { name: 'Spejlets gunst', en: "The mirror's favour", fx: 'Your first mistake when building a sentence in each conversation does not count.' },
  vaev:    { name: 'Grundvæverskens tråd', en: "The weaver's thread", fx: 'Your dice no longer melt by chance. Some moments still melt them on purpose, and numbers can still go strange.' },
  ikket:   { name: 'Ikket', en: 'A loose ikke, living in your mouth', fx: 'Once a day, it turns a failed roll into “ikke fiasko”. It also slips an extra “ikke” into your word tiles.' },
  doer:    { name: 'En dør', en: 'A door that leads nowhere', fx: 'You wake every morning with at least two sparks (inspiration).' },
  laant:   { name: 'Lånt fortid', en: 'A borrowed past', fx: '+2 on Løgn. You have a past now. It is not yours, which makes it easier to lie about.' },
  // Lektion 2
  urnoegle:{ name: 'Urnøglen', en: 'The clock key', fx: 'Numbers never go strange for you again.' },
  vild:    { name: 'Vild tid', en: 'Feral time', fx: 'Time runs wild: walking somewhere sometimes takes no time at all.' },
  rytter:  { name: 'Urrytter', en: 'Clock rider', fx: 'You wake every morning with an extra spark.' },
  ballon:  { name: 'Lille Savn', en: 'A small balloon that follows you', fx: '+1 on Indsigt. It bobs toward things worth noticing.' },
  knald:   { name: 'Knaldet', en: 'The pop', fx: '+1 on Løgn. After a good cry, everyone believes everything.' },
  indeni:  { name: 'Indefra', en: 'From the inside', fx: '+1 on Sprog. You know what you miss now.' },
  blik:    { name: 'Blikket', en: 'You carry a look with you', fx: 'Everyone in Hertil finds you a little heavier.' },
};

/* ---------- Creatures (each is drawn by ART.creature(art, gaze)) ---------- */
const NPCS = {
  taeller: { name: 'Tælleren', role: 'counts what arrives', art: 'taeller' },
  samler:  { name: 'Samleren', role: 'sorts what falls', art: 'samler' },
  vaever:  { name: 'Grundvæversken', role: 'weaves the ground', art: 'vaever' },
  ikket:   { name: 'Ikket', role: 'a loose ikke', art: 'ikket', small: true },
  bagvendt:{ name: 'Den Bagvendte', role: 'has never turned around', art: 'bagvendt', big: true },
  husfolk: { name: 'Husfolket', role: 'small ones in the dust', art: 'husfolk', small: true },
  spejl:   { name: 'Spejlet', role: 'a pond that corrects', art: 'spejl' },
  sluget:  { name: 'Sluget', role: 'buys words, sells reasons', art: 'sluget' },
  moel:    { name: 'Mølen', role: 'sells sparks', art: 'moel', small: true },
  unge:    { name: 'Ungen', role: 'a small one with questions', art: 'unge', small: true },
  // Lektion 2
  uret:    { name: 'Uret', role: 'the clock of Hertil, on the run', art: 'uret' },
  savnet:  { name: 'Savnet', role: 'swells with what everyone misses', art: 'savnet' },
  timerne: { name: 'Timerne', role: 'the hours, grazing', art: 'timerne' },
  kokon:   { name: 'Mølen', role: 'not arrived yet', art: 'kokon' },
  ungerne: { name: 'Ungen ×400', role: 'the same Tuesday, many times', art: 'ungerne' },
  huset:   { name: 'Huset', role: 'lives in i forgårs', art: 'huset' },
  hvornaar:{ name: 'HVORNÅR', role: 'a door that asks', art: 'hvornaar' },
};

/* ---------- Vocabulary (non-dialogue learning) ---------- */
const VOCAB = {
  // ting, der falder · things that fall into Hertil
  fjer: { da: 'en fjer', en: 'a feather', icon: 'fjer', set: 'ting' }, knogle: { da: 'en knogle', en: 'a bone', icon: 'knogle', set: 'ting' },
  tand: { da: 'en tand', en: 'a tooth', icon: 'tand', set: 'ting' }, oeje: { da: 'et øje', en: 'an eye', icon: 'oeje', set: 'ting' },
  skal: { da: 'en skal', en: 'a shell', icon: 'skal', set: 'ting' }, traad: { da: 'en tråd', en: 'a thread', icon: 'traad', set: 'ting' },
  sten: { da: 'en sten', en: 'a stone', icon: 'sten', set: 'ting' }, klokke: { da: 'en klokke', en: 'a bell', icon: 'klokke', set: 'ting' },
  noegle: { da: 'en nøgle', en: 'a key', icon: 'noegle', set: 'ting' }, spejlet: { da: 'et spejl', en: 'a mirror', icon: 'spejl', set: 'ting' },
  lygte: { da: 'en lygte', en: 'a lantern', icon: 'lygte', set: 'ting' }, aeg: { da: 'et æg', en: 'an egg', icon: 'aeg', set: 'ting' },
  ring: { da: 'en ring', en: 'a ring', icon: 'ring', set: 'ting' }, hjerte: { da: 'et hjerte', en: 'a heart', icon: 'hjerte', set: 'ting' },
  haand: { da: 'en hånd', en: 'a hand', icon: 'haand', set: 'ting' }, timeglas: { da: 'et timeglas', en: 'an hourglass', icon: 'timeglas', set: 'ting' },
  // job · what the creatures of Hertil do (Gæt jobbet)
  kok: { da: 'en kok', en: 'a cook', icon: 'grod', set: 'job', def: 'Lavede mad til andre.' },
  laerer: { da: 'en lærer', en: 'a teacher', icon: 'bog', set: 'job', def: 'Underviste andre.' },
  laege: { da: 'en læge', en: 'a doctor', icon: 'medicin', set: 'job', def: 'Hjalp, når nogen var syg.' },
  arkitekt: { da: 'en arkitekt', en: 'an architect', icon: 'hus', set: 'job', def: 'Tegnede huse og rum.' },
  ingenioer: { da: 'en ingeniør', en: 'an engineer', icon: 'tandhjul', set: 'job', def: 'Byggede broer og maskiner.' },
  journalist: { da: 'en journalist', en: 'a journalist', icon: 'pen', set: 'job', def: 'Skrev artikler om det, der skete.' },
  musiker: { da: 'en musiker', en: 'a musician', icon: 'klokke', set: 'job', def: 'Spillede musik for andre.' },
  forsker: { da: 'en forsker', en: 'a researcher', icon: 'oeje', set: 'job', def: 'Fandt ny viden.' },
  designer: { da: 'en designer', en: 'a designer', icon: 'traad', set: 'job', def: 'Tegnede ting, som andre lavede.' },
  gartner: { da: 'en gartner', en: 'a gardener', icon: 'blad', set: 'job', def: 'Passede planter.' },
  farmaceut: { da: 'en farmaceut', en: 'a pharmacist', icon: 'medicin', set: 'job', def: 'Arbejdede på et apotek og kendte al medicin.' },
  oekonom: { da: 'en økonom', en: 'an economist', icon: 'skael', set: 'job', def: 'Arbejdede med penge og tal.' },
};
Object.assign(VOCAB, {
  // tid · time (Lektion 2)
  minut: { da: 'et minut', en: 'a minute', icon: 'ur', set: 'tid', def: 'Tres sekunder.' }, time: { da: 'en time', en: 'an hour', icon: 'timeglas', set: 'tid', def: 'Tres minutter.' },
  dag: { da: 'en dag', en: 'a day', icon: 'kalender', set: 'tid', def: 'Fra morgen til aften.' }, uge: { da: 'en uge', en: 'a week', icon: 'uge', set: 'tid', def: 'Syv dage.' },
  maaned: { da: 'en måned', en: 'a month', icon: 'maaned', set: 'tid', def: 'Cirka tredive dage.' }, aar: { da: 'et år', en: 'a year', icon: 'aar', set: 'tid', def: 'Tolv måneder.' },
  morgen: { da: 'en morgen', en: 'a morning', icon: 'morgen', set: 'tid', def: 'Når lyset bliver gult.' }, aften: { da: 'en aften', en: 'an evening', icon: 'aften', set: 'tid', def: 'Når lyset bliver blåt.' },
  nat: { da: 'en nat', en: 'a night', icon: 'maane', set: 'tid', def: 'Når alt er lilla, og man sover.' },
  // vejret i Hertil · weather
  solskin: { da: 'solskin', en: 'sunshine', icon: 'sol', set: 'vejr' }, regn: { da: 'regn', en: 'rain', icon: 'regn', set: 'vejr' },
  sne: { da: 'sne', en: 'snow', icon: 'sne', set: 'vejr' }, blaest: { da: 'blæst', en: 'wind', icon: 'blaest', set: 'vejr' },
  taage: { da: 'tåge', en: 'fog', icon: 'taage', set: 'vejr' }, sky: { da: 'en sky', en: 'a cloud', icon: 'sky', set: 'vejr' },
  torden: { da: 'torden', en: 'thunder', icon: 'torden', set: 'vejr' }, regnbue: { da: 'en regnbue', en: 'a rainbow', icon: 'regnbue', set: 'vejr' },
});
const VOCAB_SETS = { ting: 'Ting, der falder · Things that fall', job: 'Job · What creatures do', tid: 'Tid · Time', vejr: 'Vejret · Weather' };

/* ---------- Glossary: tap any Danish word ---------- */
const DICT = {
  // pronouns, small words
  'jeg': 'I', 'du': 'you', 'han': 'he', 'hun': 'she', 'den': 'it (en-word) / the', 'det': 'it / that / the', 'vi': 'we', 'i': 'in / you (plural) · i + length: for (time)', 'de': 'they / the',
  'mig': 'me', 'dig': 'you (object)', 'sig': 'oneself', 'os': 'us', 'jer': 'you (plural, object)', 'dem': 'them', 'ham': 'him', 'hende': 'her',
  'min': 'my', 'mit': 'my (et-word)', 'mine': 'my (plural)', 'din': 'your', 'dit': 'your (et-word)', 'dine': 'your (plural)', 'sin': 'his/her own', 'sit': 'his/her own (et-word)', 'sine': 'his/her own (plural)', 'vores': 'our', 'jeres': 'your (plural)', 'deres': 'their',
  'en': 'a / one', 'et': 'a / one (et-word)', 'og': 'and', 'men': 'but', 'eller': 'or', 'så': 'so / then · also: saw (past of se)', 'for': 'for / because (main clause)', 'at': 'to / that', 'som': 'as / like / who', 'der': 'there / who, which', 'her': 'here', 'hertil': 'to here (Hertil: what the creatures call this place)', 'derfra': 'from there',
  'ikke': 'not', 'gerne': 'gladly (vil gerne: would like to)', 'også': 'also', 'kun': 'only', 'altid': 'always', 'aldrig': 'never', 'lige': 'just', 'allerede': 'already', 'næsten': 'almost', 'sammen': 'together', 'før': 'before', 'nu': 'now', 'igen': 'again', 'mere': 'more', 'meget': 'very / much', 'lidt': 'a little', 'egentlig': 'actually', 'måske': 'maybe', 'faktisk': 'actually, in fact', 'bare': 'just, only',
  'ja': 'yes', 'nej': 'no', 'nå': 'oh, I see', 'nåh': 'oh, I see', 'tak': 'thank you', 'hej': 'hi', 'farvel': 'goodbye', 'godt': 'good / well', 'god': 'good', 'nogen': 'someone / anyone', 'noget': 'something / anything', 'ingen': 'no one / no', 'intet': 'nothing', 'alle': 'everyone / all', 'alt': 'everything', 'andre': 'others', 'anden': 'other', 'andet': 'other (et-word)', 'hver': 'every', 'hvad': 'what', 'hvem': 'who', 'hvor': 'where / how', 'hvorfor': 'why', 'hvordan': 'how', 'hvornår': 'when (question)', 'hvilken': 'which',
  'på': 'on / at · på grund af: because of', 'grund': 'reason / ground', 'af': 'of / by / from', 'til': 'to', 'fra': 'from', 'med': 'with', 'om': 'about / in (time)', 'ud': 'out', 'ind': 'in', 'op': 'up', 'ned': 'down', 'under': 'under', 'over': 'over', 'efter': 'after', 'uden': 'without', 'mod': 'towards / against', 'bag': 'behind', 'fordi': 'because (+ clause)', 'hvis': 'if', 'når': 'when (future / repeated)', 'da': 'when (one time in the past) / then',
  'er': 'is / are', 'var': 'was / were', 'være': 'be', 'har': 'has / have', 'havde': 'had', 'have': 'have', 'kan': 'can', 'kunne': 'could / can (infinitive)', 'vil': 'want / will', 'ville': 'wanted / would', 'skal': 'shall / must / is going to', 'skulle': 'should / was going to', 'må': 'may / must', 'tør': 'dare',
  // verbs (present, past, infinitive)
  'kom': 'came', 'komme': 'come', 'kommer': 'come(s)', 'flyttede': 'moved', 'flytte': 'move', 'boede': 'lived', 'bo': 'live', 'bor': 'live(s)', 'arbejdede': 'worked', 'arbejde': 'work / to work', 'arbejder': 'work(s)', 'lavede': 'did / made', 'lave': 'do / make', 'laver': 'does / makes',
  'studerede': 'studied', 'studere': 'study', 'læste': 'read / studied (a subject)', 'læse': 'read / study', 'købte': 'bought', 'købe': 'buy', 'spiste': 'ate', 'spise': 'eat', 'søgte': 'looked for, applied for', 'søge': 'look for', 'underviste': 'taught', 'undervise': 'teach', 'underviser': 'teaches',
  'gik': 'went / walked', 'gå': 'go / walk / leave', 'går': 'go(es)', 'fik': 'got', 'få': 'get', 'tog': 'took', 'tage': 'take', 'sagde': 'said', 'sige': 'say', 'siger': 'say(s)', 'skrev': 'wrote', 'skrive': 'write', 'skriver': 'write(s)', 'gjorde': 'did', 'gøre': 'do',
  'blive': 'stay / become', 'bliver': 'stay(s) / become(s)', 'blev': 'stayed / became', 'finde': 'find', 'finder': 'find(s)', 'fandt': 'found', 'glemme': 'forget', 'glemmer': 'forget(s)', 'glemte': 'forgot', 'miste': 'lose', 'mister': 'lose(s)', 'mistede': 'lost', 'tælle': 'count', 'tæller': 'count(s) / counter', 'talte': 'counted / spoke',
  'samle': 'collect', 'samler': 'collect(s) / collector', 'samlede': 'collected', 'sortere': 'sort', 'sorterer': 'sort(s)', 'væve': 'weave', 'væver': 'weave(s)', 'vævede': 'wove', 'falde': 'fall', 'falder': 'fall(s)', 'faldt': 'fell', 'synke': 'sink', 'synker': 'sink(s)', 'sank': 'sank',
  'vende': 'turn', 'vender': 'turn(s)', 'vendte': 'turned', 'se': 'see / look', 'ser': 'see(s)', 'kigge': 'look', 'kigger': 'look(s)', 'kiggede': 'looked', 'høre': 'hear', 'hører': 'hear(s)', 'hørte': 'heard', 'spørge': 'ask', 'spørger': 'ask(s)', 'spurgte': 'asked', 'svare': 'answer', 'svarer': 'answer(s)',
  'sove': 'sleep', 'sover': 'sleep(s)', 'sov': 'slept', 'drømme': 'dream', 'drømte': 'dreamt', 'spille': 'play', 'spillede': 'played', 'åbne': 'open', 'åbnede': 'opened', 'begynde': 'begin', 'begyndte': 'began', 'starte': 'start', 'startede': 'started', 'besøge': 'visit', 'besøgte': 'visited', 'møde': 'meet / meeting', 'mødte': 'met', 'cykle': 'cycle', 'cyklede': 'cycled', 'passe': 'look after / fit', 'passede': 'looked after', 'ringe': 'ring / call', 'ringede': 'rang', 'forske': 'do research', 'forskede': 'did research', 'forsker': 'researcher / does research',
  'hjælpe': 'help', 'hjælper': 'help(s)', 'hjalp': 'helped', 'tegne': 'draw', 'tegner': 'draw(s)', 'tegnede': 'drew', 'bygge': 'build', 'bygger': 'build(s)', 'byggede': 'built', 'spiller': 'play(s)', 'passer': 'look(s) after', 'kende': 'know (a person, a thing)', 'kender': 'know(s)', 'kendte': 'knew', 'vide': 'know (a fact)', 'ved': 'know(s) / by, at', 'vidste': 'knew', 'tro': 'believe / think', 'tror': 'think(s)', 'troede': 'thought',
  'betale': 'pay', 'betaler': 'pay(s)', 'koste': 'cost', 'koster': 'cost(s)', 'sælge': 'sell', 'sælger': 'sell(s)', 'solgte': 'sold', 'give': 'give', 'giver': 'give(s)', 'gav': 'gave', 'holde': 'hold / keep', 'holder': 'hold(s)', 'lyde': 'sound', 'lyder': 'sound(s)', 'savne': 'miss', 'savner': 'miss(es)', 'leve': 'live', 'lever': 'live(s)', 'levede': 'lived',
  'prøve': 'try', 'prøvede': 'tried', 'stoppe': 'stop', 'vente': 'wait', 'venter': 'wait(s)', 'ventede': 'waited', 'tale': 'speak', 'taler': 'speak(s)', 'græde': 'cry', 'grine': 'laugh', 'griner': 'laugh(s)', 'sidde': 'sit', 'sidder': 'sit(s)', 'stå': 'stand', 'står': 'stand(s)', 'stod': 'stood', 'ligge': 'lie', 'ligger': 'lie(s)', 'lå': 'lay',
  'hedder': 'is called', 'hed': 'was called', 'hedde': 'be called', 'bruge': 'use', 'bruger': 'use(s)', 'behøver': 'need(s)', 'mangler': 'is missing / lacks', 'manglede': 'was missing', 'spiser': 'eat(s)', 'smager': 'taste(s)', 'lugter': 'smell(s)', 'kalder': 'call(s)', 'tilbage': 'back',
  // nouns
  'lyd': 'sound', 'lys': 'light', 'drøm': 'dream', 'storm': 'storm', 'sted': 'place', 'hus': 'house', 'huset': 'the house', 'by': 'town, city', 'storby': 'big city', 'land': 'country', 'landet': 'the country / the countryside', 'ø': 'island', 'udlandet': 'abroad',
  'job': 'job', 'arbejdet': 'the work', 'firma': 'company', 'kontor': 'office', 'bank': 'bank', 'hospital': 'hospital', 'skole': 'school', 'universitet': 'university', 'universitetet': 'the university', 'restaurant': 'restaurant', 'avis': 'newspaper', 'apotek': 'pharmacy', 'butik': 'shop', 'hotel': 'hotel', 'bibliotek': 'library', 'køkken': 'kitchen', 'køkkenet': 'the kitchen', 'loft': 'attic', 'loftet': 'the attic', 'gulv': 'floor', 'gulvet': 'the floor', 'dør': 'door', 'døren': 'the door', 'trappe': 'stair', 'trappen': 'the stair',
  'ting': 'thing(s)', 'tingene': 'the things', 'navn': 'name', 'navnet': 'the name', 'fortid': 'past', 'fortiden': 'the past', 'liv': 'life', 'livet': 'the life', 'tid': 'time', 'dag': 'day', 'nat': 'night', 'mørke': 'darkness', 'mørket': 'the darkness', 'støv': 'dust', 'støvet': 'the dust', 'vand': 'water', 'vandet': 'the water', 'dam': 'pond', 'dammen': 'the pond', 'damme': 'ponds',
  'bog': 'book', 'bogen': 'the book', 'liste': 'list', 'listen': 'the list', 'sætning': 'sentence', 'sætningen': 'the sentence', 'ord': 'word(s)', 'ordet': 'the word', 'ordene': 'the words', 'tal': 'number(s)', 'tallene': 'the numbers', 'svar': 'answer', 'svaret': 'the answer', 'spørgsmål': 'question',
  'skæl': 'scale(s) — the money of Hertil', 'gnist': 'spark', 'gnister': 'sparks', 'mad': 'food', 'planter': 'plants', 'musik': 'music', 'viden': 'knowledge', 'maskiner': 'machines', 'broer': 'bridges', 'artikler': 'articles', 'penge': 'money', 'medicin': 'medicine', 'syg': 'ill',
  'kæreste': 'partner, sweetheart', 'familie': 'family', 'ven': 'friend', 'venner': 'friends', 'nabo': 'neighbour', 'kollega': 'colleague', 'rum': 'room(s)', 'huse': 'houses', 'fritid': 'free time',
  'terning': 'die', 'terningen': 'the die', 'hul': 'hole', 'huller': 'holes', 'hullet': 'the hole', 'fjer': 'feather', 'knogle': 'bone', 'tand': 'tooth', 'øje': 'eye', 'skal': 'shell / shall', 'tråd': 'thread', 'tråden': 'the thread', 'sten': 'stone', 'klokke': 'bell', 'nøgle': 'key', 'spejl': 'mirror', 'spejlet': 'the mirror', 'lygte': 'lantern', 'æg': 'egg', 'ring': 'ring', 'hjerte': 'heart', 'hånd': 'hand', 'timeglas': 'hourglass', 'hånden': 'the hand',
  'kok': 'cook', 'lærer': 'teacher', 'læge': 'doctor', 'arkitekt': 'architect', 'ingeniør': 'engineer', 'journalist': 'journalist', 'musiker': 'musician', 'designer': 'designer', 'gartner': 'gardener', 'farmaceut': 'pharmacist', 'økonom': 'economist',
  // adjectives
  'stor': 'big', 'store': 'big (plural / definite)', 'lille': 'small', 'små': 'small (plural)', 'gammel': 'old', 'gamle': 'old (plural / definite)', 'ny': 'new', 'nyt': 'new (et-word)', 'nye': 'new (plural)', 'mange': 'many', 'tung': 'heavy', 'let': 'light, easy', 'tom': 'empty', 'fuld': 'full', 'varm': 'warm', 'kold': 'cold', 'stille': 'quiet', 'forkert': 'wrong', 'rigtigt': 'right, correct', 'rigtig': 'right, real', 'sjov': 'funny', 'mærkelig': 'strange', 'mærkeligt': 'strange', 'smuk': 'beautiful', 'træt': 'tired', 'glad': 'glad, happy', 'ked': 'sad (ked af det)', 'færdig': 'finished', 'færdige': 'finished', 'spændende': 'exciting', 'længe': 'long (time)', 'hvidt': 'white', 'gult': 'yellow', 'rødt': 'red', 'hvide': 'white', 'gule': 'yellow',
  'sidste': 'last', 'første': 'first', 'næste': 'next', 'hele': 'whole', 'selv': 'self', 'sådan': 'like that', 'nede': 'down (there)', 'oppe': 'up (there)', 'ude': 'out', 'inde': 'inside', 'hjem': 'home (direction)', 'hjemme': 'at home', 'derhjemme': 'at home', 'væk': 'away', 'langt': 'far',
  'ét': 'one', 'to': 'two', 'tre': 'three', 'fire': 'four', 'fem': 'five', 'seks': 'six', 'syv': 'seven', 'otte': 'eight', 'ni': 'nine', 'ti': 'ten', 'elleve': 'eleven', 'tolv': 'twelve', 'tretten': 'thirteen', 'fjorten': 'fourteen', 'femten': 'fifteen', 'seksten': 'sixteen', 'sytten': 'seventeen', 'atten': 'eighteen', 'nitten': 'nineteen', 'tyve': 'twenty', 'enogtyve': 'twenty-one', 'toogtyve': 'twenty-two', 'treogtyve': 'twenty-three', 'fireogtyve': 'twenty-four', 'femogtyve': 'twenty-five', 'seksogtyve': 'twenty-six', 'syvogtyve': 'twenty-seven', 'nul': 'zero',
  // more
  'bagvendte': 'turned backwards (Den Bagvendte: the one turned away)', 'siden': 'since · for … siden: … ago', 'ede': '(the ending -ede: lavede, boede)', 'te': '(the ending -te: læste, købte)', 'blød': 'soft', 'hård': 'hard', 'uregelmæssig': 'irregular',
  'boet': 'lived (har boet: has lived)', 'spisede': '(wrong form of spise; correct: spiste)', 'spist': 'eaten (har spist)', 'spiserede': '(not a word)', 'regn': 'rain', 'sker': 'happen(s)', 'skævt': 'crooked', 'spørg': 'ask! (imperative)', 'sletten': 'the plain', 'heller': 'either (heller ikke: not … either)',
  'overalt': 'everywhere', 'find': 'find! (imperative)', 'sorteret': 'sorted', 'glemt': 'forgotten', 'selvfølgelig': 'of course', 'side': 'page / side', 'grunde': 'reasons', 'man': 'one, you (in general)', 'endnu': 'yet', 'låne': 'borrow', 'fået': 'got (har fået: have got)', 'tag': 'take! (imperative)',
  'alligevel': 'anyway', 'stormen': 'the storm', 'storm': 'storm', 'skrevet': 'written (skrevet ind: registered)', 'viser': 'shows', 'omvendt': 'the other way round, reversed', 'lige': 'just (lige nu: right now)', 'nu': 'now', 'træt': 'tired (træt af: tired of)', 'hm': 'hm (thinking)', 'hatte': 'hats', 'skete': 'happened', 'fysik': 'physics', 'fransk': 'French', 'passer': 'fits / looks after', 'lange': 'long', 'hænder': 'hands', 'stemme': 'voice', 'spor': 'trace(s)', 'helt': 'completely', 'pennen': 'the pen', 'pen': 'pen', 'gled': 'slipped', 'gammel': 'old', 'desværre': 'unfortunately', 'vildt': 'wild', 'samme': 'same', 'bøger': 'books', 'verbet': 'the verb', 'først': 'first', 'velkommen': 'welcome', 'al': 'all',
  // Lektion 2
  'rejser': 'travel(s), leave(s)', 'rejse': 'travel, leave', 'time': 'hour', 'timer': 'hours', 'dage': 'days', 'været': 'been (har været: has been)', 'uge': 'week', 'landede': 'landed', 'regner': 'rains', 'regnede': 'rained', 'havet': 'the sea',
  'uret': 'the clock (Uret: the Clock)', 'solen': 'the sun', 'drejer': 'turns, spins', 'år': 'year(s)', 'løb': 'ran', 'løber': 'run(s)', 'løbe': 'run', 'løbet': 'run (er løbet væk: has run away)', 'ses': 'see each other (vi ses: see you)',
  'sner': 'snows', 'tænder': 'teeth', 'torden': 'thunder', 'synger': 'sings', 'lang': 'long', 'dagen': 'the day', 'ben': 'leg(s)', 'høne': 'hen', 'tiden': 'the time', 'måned': 'month', 'måneder': 'months', 'øjne': 'eyes', 'mund': 'mouth',
  'natten': 'the night (om natten: at night)', 'larve': 'caterpillar', 'ansigt': 'face', 'lide': 'like (kan godt lide: likes)', 'fejl': 'mistake(s)', 'ører': 'ears', 'tirsdag': 'Tuesday', 'hen': 'to (hvor skal du hen: where are you going)', 'billigere': 'cheaper',
  'forkerte': 'wrong', 'linjerne': 'the lines', 'ret': 'fix! (imperative) / right', 'nogle': 'some (nogle gange: sometimes)', 'gange': 'times (nogle gange: sometimes)', 'sortér': 'sort! (imperative)', 'åbner': 'open(s)', 'fint': 'fine', 'ah': 'ah', 'okay': 'okay',
  'savnet': 'missed / the Missing', 'sluger': 'swallows', 'stort': 'big (et-word)', 'springer': 'bursts, jumps', 'længsel': 'longing', 'set': 'seen', 'tik': 'tick', 'klokken': 'the clock (klokken er …: it is … o’clock)', 'lyst': 'desire (har lyst: feel like it)',
  'grøn': 'green', 'langsom': 'slow', 'hos': 'with, at (bliv hos mig: stay with me)', 'tusind': 'thousand', 'forgårs': 'the day before yesterday (i forgårs)', 'morgen': 'morning (i morgen: tomorrow)', 'fortjent': 'deserved, earned', 'fundet': 'found (har fundet)',
  'stempler': 'stamp(s)', 'stemplet': 'the stamp', 'forstå': 'understand', 'nok': 'probably / enough', 'minut': 'minute', 'minutter': 'minutes', 'tres': 'sixty', 'sekunder': 'seconds', 'aften': 'evening', 'cirka': 'about, roughly', 'tredive': 'thirty',
  'lyset': 'the light', 'blåt': 'blue', 'lilla': 'purple', 'solskin': 'sunshine', 'sne': 'snow', 'blæst': 'wind', 'tåge': 'fog', 'sky': 'cloud', 'regnbue': 'rainbow', 'halv': 'half (halv tre: half past two)', 'kvart': 'quarter', 'midnat': 'midnight',
};

/* numbers as words (for the glyph dice and prices said aloud) */
const NUMS = ['nul', 'en', 'to', 'tre', 'fire', 'fem', 'seks', 'syv', 'otte', 'ni', 'ti', 'elleve', 'tolv', 'tretten', 'fjorten', 'femten', 'seksten', 'sytten', 'atten', 'nitten', 'tyve', 'enogtyve', 'toogtyve', 'treogtyve', 'fireogtyve', 'femogtyve', 'seksogtyve', 'syvogtyve'];
