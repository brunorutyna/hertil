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
const VOCAB_SETS = { ting: 'Ting, der falder · Things that fall', job: 'Job · What creatures do', tid: 'Tid · Time', vejr: 'Vejret · Weather', sted: 'Steder · Places in Bydelen' };

/* ---------- Glossary: tap any Danish word ---------- */
const DICT = {
  // pronouns, small words
  'jeg': 'I', 'du': 'you', 'han': 'he', 'hun': 'she', 'den': 'it (en-word) / the', 'det': 'it / that / the', 'vi': 'we', 'i': 'in / you (plural) · i + length: for (time)', 'de': 'they / the',
  'mig': 'me', 'dig': 'you (object)', 'sig': 'oneself', 'os': 'us', 'jer': 'you (plural, object)', 'dem': 'them', 'ham': 'him', 'hende': 'her',
  'min': 'my', 'mit': 'my (et-word)', 'mine': 'my (plural)', 'din': 'your', 'dit': 'your (et-word)', 'dine': 'your (plural)', 'sin': 'his/her own', 'sit': 'his/her own (et-word)', 'sine': 'his/her own (plural)', 'vores': 'our', 'jeres': 'your (plural)', 'deres': 'their',
  'en': 'a / one', 'et': 'a / one (et-word)', 'og': 'and', 'men': 'but', 'eller': 'or', 'så': 'so / then · also: saw (past of se)', 'for': 'for / because (main clause)', 'at': 'to / that', 'som': 'as / like / who', 'der': 'there / who, which', 'her': 'here', 'hertil': 'to here (Hertil: what the creatures call this place)', 'derfra': 'from there',
  'ikke': 'not', 'gerne': 'gladly (vil gerne: would like to)', 'også': 'also', 'kun': 'only', 'altid': 'always', 'aldrig': 'never', 'lige': 'just', 'allerede': 'already', 'næsten': 'almost', 'sammen': 'together', 'før': 'before', 'nu': 'now · in Hvad er det nu …?: again, remind me', 'igen': 'again', 'mere': 'more', 'meget': 'very / much', 'lidt': 'a little', 'egentlig': 'actually', 'måske': 'maybe', 'faktisk': 'actually, in fact', 'bare': 'just, only',
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
  'alligevel': 'anyway', 'hænger': 'hangs', 'bløde': 'soft (bløde: the soft …)', 'vinduer': 'windows', 'linje': 'line', 'stormen': 'the storm', 'storm': 'storm', 'skrevet': 'written (skrevet ind: registered)', 'viser': 'shows', 'omvendt': 'the other way round, reversed', 'lige': 'just (lige nu: right now)', 'nu': 'now · in Hvad er det nu …?: again, remind me', 'træt': 'tired (træt af: tired of)', 'hm': 'hm (thinking)', 'hatte': 'hats', 'skete': 'happened', 'fysik': 'physics', 'fransk': 'French', 'passer': 'fits / looks after', 'lange': 'long', 'hænder': 'hands', 'stemme': 'voice', 'spor': 'trace(s)', 'helt': 'completely', 'pennen': 'the pen', 'pen': 'pen', 'gled': 'slipped', 'gammel': 'old', 'desværre': 'unfortunately', 'vildt': 'wild', 'samme': 'same', 'bøger': 'books', 'verbet': 'the verb', 'først': 'first', 'velkommen': 'welcome', 'al': 'all',
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


/* ================= Lektion 3 · Bydelen ================= */
Object.assign(BOONS, {
  gadekort: { name: 'Gadekortet', en: 'A street map that knows where it is', fx: '+1 on Indsigt. Streets tell you where they are.' },
  vandregade: { name: 'Vandregaden', en: 'A street that follows you around', fx: '+1 on Handel. The shops come to you.' },
  hjoerne: { name: 'Dit hjørne', en: 'A corner of Bydelen named after you', fx: '+1 on Sprog. Everybody knows where to find you.' },
  stilhed: { name: 'Stilheden', en: 'A pocket of quiet', fx: '+1 on Snige. You can hear the floor think.' },
  band: { name: 'Bandet', en: 'Larmen plays for you', fx: '+1 on Løgn. Everything sounds true over a good beat.' },
  glas: { name: 'Larm på glas', en: 'Noise in a jar', fx: '+1 on Handel. Noise sells.' },
  artikel: { name: 'En artikel', en: 'You came out of the wash with an en or an et', fx: '+1 on Sprog. You have a gender now. Words treat you as one of their own.' },
});
Object.assign(NPCS, {
  bydel: { name: 'Bydelen', role: 'a neighbourhood, asleep on its stomach', art: 'bydel', big: true },
  bager: { name: 'Bageren', role: 'a bakery that drifts', art: 'bager' },
  kirke: { name: 'Kirken', role: 'rings when it is pleased', art: 'kirke' },
  larm: { name: 'Larmen', role: 'the noise of Torvet', art: 'larm' },
  larme: { name: 'Larmene', role: 'little noises, counted wrong', art: 'larme', small: true },
  vaskeri: { name: 'Vaskeriet', role: 'washes anything, also words', art: 'vaskeri' },
  nabo: { name: 'Naboen', role: 'lives right across from you', art: 'nabo' },
});
Object.assign(VOCAB, {
  // steder · places that grew in Bydelen ("Et sted, hvor man …")
  bager: { da: 'en bager', en: 'a bakery / a baker', icon: 'kringle', set: 'sted', def: 'Et sted, hvor man kan købe brød og kager.' },
  slagter: { da: 'en slagter', en: 'a butcher', icon: 'poelse', set: 'sted', def: 'Et sted, hvor man kan købe kød.' },
  apotek: { da: 'et apotek', en: 'a pharmacy', icon: 'medicin', set: 'sted', def: 'Et sted, hvor man kan købe medicin.' },
  kirke: { da: 'en kirke', en: 'a church', icon: 'kirke', set: 'sted', def: 'Et sted, hvor man kan høre klokker og synge.' },
  park: { da: 'en park', en: 'a park', icon: 'trae', set: 'sted', def: 'Et sted, hvor man kan gå en tur mellem træer.' },
  bibliotek: { da: 'et bibliotek', en: 'a library', icon: 'bog', set: 'sted', def: 'Et sted, hvor man kan låne bøger.' },
  svoemmehal: { da: 'en svømmehal', en: 'a swimming pool', icon: 'boelge', set: 'sted', def: 'Et sted, hvor man kan svømme, også om vinteren.' },
  station: { da: 'en station', en: 'a station', icon: 'tog', set: 'sted', def: 'Et sted, hvor man kan tage toget.' },
  posthus: { da: 'et posthus', en: 'a post office', icon: 'brev', set: 'sted', def: 'Et sted, hvor man kan sende et brev.' },
  vaskeri: { da: 'et vaskeri', en: 'a launderette', icon: 'vaskemaskine', set: 'sted', def: 'Et sted, hvor man kan vaske sit tøj.' },
  cafe: { da: 'en café', en: 'a café', icon: 'kop', set: 'sted', def: 'Et sted, hvor man kan drikke en kop kaffe.' },
  blomsterhandler: { da: 'en blomsterhandler', en: 'a florist', icon: 'blomst', set: 'sted', def: 'Et sted, hvor man kan købe blomster.' },
  skobutik: { da: 'en skobutik', en: 'a shoe shop', icon: 'sko', set: 'sted', def: 'Et sted, hvor man kan købe sko.' },
  supermarked: { da: 'et supermarked', en: 'a supermarket', icon: 'kurv', set: 'sted', def: 'Et sted, hvor man kan købe næsten alt.' },
  raadhus: { da: 'et rådhus', en: 'a town hall', icon: 'raadhus', set: 'sted', def: 'Et sted, hvor borgmesteren arbejder.' },
});

Object.assign(DICT, {
  'ubestemt': 'indefinite (en bager)', 'bestemt': 'definite (bageren)', 'bager': 'baker, bakery', 'bageren': 'the bakery', 'nærheden': 'the vicinity (her i nærheden: around here)',
  'kirke': 'church', 'kirken': 'the church', 'hjørnet': 'the corner', 'apoteket': 'the pharmacy', 'posthus': 'post office', 'posthuset': 'the post office',
  'hotellet': 'the hotel', 'svømmehal': 'swimming pool (building)', 'svømmehallen': 'the swimming pool', 'biler': 'cars', 'larm': 'noise', 'trafik': 'traffic',
  'caféer': 'cafés', 'grønne': 'green (plural)', 'områder': 'areas', 'væsner': 'creatures', 'luft': 'air', 'vaskeriet': 'the launderette', 'slagter': 'butcher',
  'café': 'café', 'vaskeri': 'launderette', 'caféen': 'the café', 'tur': 'trip, walk (gå en tur: go for a walk)', 'kiosk': 'kiosk', 'nummer': 'number',
  'gør': 'does (det gør jeg: I do)', 'jo': 'yes (answering a negative question)', 'trompet': 'trumpet', 'stedet': 'the place', 'hoved': 'head', 'tæt': 'close (tæt på: close to)',
  'arme': 'arms', 'skilte': 'signs', 'overfor': 'opposite, across from', 'kardemomme': 'cardamom', 'ovn': 'oven', 'rundt': 'round (rundt og rundt: round and round)',
  'vindue': 'window', 'ringer': 'rings', 'rede': 'nest', 'høj': 'tall', 'tynd': 'thin', 'lyser': 'shines, gives light', 'vasker': 'washes', 'godmorgen': 'good morning',
  'bydel': 'neighbourhood, district', 'flyder': 'floats, drifts', 'dumt': 'stupid (hvor dumt: how annoying)', 'mm': 'mm', 'hør': 'listen', 'liggende': 'lying (bliver liggende: stays put)',
  'aftryk': 'marks, imprints', 'vaske': 'wash', 'hjælp': 'help', 'busk': 'bush', 'timerne': 'the hours', 'yndlingsbager': 'favourite bakery', 'butikker': 'shops',
  'kapitlet': 'the chapter', 'slut': 'over, finished', 'brød': 'bread', 'kager': 'cakes', 'kød': 'meat', 'klokker': 'bells', 'synge': 'sing', 'park': 'park',
  'mellem': 'between', 'træer': 'trees', 'svømme': 'swim', 'vinteren': 'the winter (om vinteren: in winter)', 'station': 'station', 'toget': 'the train', 'sende': 'send',
  'brev': 'letter', 'tøj': 'clothes', 'drikke': 'drink', 'kop': 'cup', 'kaffe': 'coffee', 'blomsterhandler': 'florist', 'blomster': 'flowers', 'skobutik': 'shoe shop',
  'yndlingscafé': 'favourite café', 'lager': 'storeroom', 'fætter': 'cousin', 'tit': 'often', 'egne': 'own (mine egne: my own)', 'ro': 'calm, quiet (når der er ro: when it is calm)',
  'adresse': 'address', 'øjeblik': 'moment (for et øjeblik siden: a moment ago)', 'sokker': 'socks', 'klager': 'complain(s)',
  'sko': 'shoes', 'supermarked': 'supermarket', 'rådhus': 'town hall', 'borgmesteren': 'the mayor',
});

/* ---------------- grammar notes: why a sentence is right ----------------
   Shown behind the small "Hvorfor?" button under every sentence the player says, and collected in
   the journal (Regler). Found from the sentence itself, so new lessons get them for free.
   t: test on the lower-case sentence (no punctuation, a leading ja/nej/men/og removed). */
const ruleText = t => t.toLowerCase().replace(/[.,!?“”"]/g, '').replace(/\s+/g, ' ').trim().replace(/^(ja|nej|men|og|okay|hm)( (men|og))? /, '')
  .replace(/æ/g, 'ae').replace(/ø/g, 'oe').replace(/å/g, 'aa'); // JS \b does not know æøå, so the tests are written in ae/oe/aa
const rulesFor = t => { const s = ruleText(t); return RULES.filter(r => { try { return r.t(s); } catch (e) { return false; } }); };
const RULES = [
  { id: 'v2', name: 'Verbet står på plads 2', t: s => /^(naar|da|foer|hvis|om \w+ \w+|for \w+ \w+ siden|i min fritid|i dag|i gaar|i morgen|nogle gange|lige nu|lige for tiden|nu|saa|ved siden af \w+|(lige )?overfor \w+|paa hjoernet af|det (kan|er|goer|ved) (jeg|du))\b/.test(s) && !/\?$/.test(s),
    en: 'A Danish main clause always has the verb in second place. If the sentence starts with something other than the subject (a time, or a whole når/da/før-clause), the verb comes right after it, and the subject after the verb.',
    ex: ['Om en time rejser jeg hjem.', 'Når jeg har fundet mit navn, rejser jeg hjem.'] },
  { id: 'bis', name: 'ikke · gerne · altid i en bisætning', t: s => /\b(fordi|naar|da|hvis|foer|at|selvom|som) (jeg|du|han|hun|den|det|vi|i|de|man|nogen) (ikke|gerne|altid|aldrig|ogsaa|tit|nogle gange)\b/.test(s),
    en: 'In a subordinate clause (after fordi, når, da, hvis, før, at…), words like ikke, gerne, altid, aldrig come BEFORE the verb. In a main clause they come after it.',
    ex: ['Jeg kommer ikke. → …fordi jeg ikke kommer.', 'Jeg vil gerne hjem. → …fordi jeg gerne vil hjem.'] },
  { id: 'hs_ikke', name: 'ikke i en hovedsætning', t: s => /^(jeg|du|han|hun|den|det|vi|de|man) \w+ (ikke|gerne|altid|aldrig)\b/.test(s),
    en: 'In a main clause, ikke / gerne / altid come right AFTER the verb.',
    ex: ['Jeg kan ikke finde det.', 'Jeg vil gerne hjem.'] },
  { id: 'fordi', name: 'fordi + en hel sætning', t: s => /\bfordi\b/.test(s),
    en: 'fordi (because) is followed by a whole clause with its own subject and verb, in normal order: fordi jeg savner…, not fordi savner jeg….',
    ex: ['Jeg kom hertil, fordi jeg faldt.'] },
  { id: 'forat', name: 'for at + infinitiv', t: s => /\bfor at\b/.test(s) && !/\b(glad|traet|bange|ked) for at\b/.test(s),
    en: 'for at means in order to. After it comes the verb in the infinitive (no -r): for at finde, for at være.',
    ex: ['Jeg kom hertil for at finde mit navn.'] },
  { id: 'pga', name: 'på grund af + et navneord', t: s => /\bpaa grund af\b/.test(s),
    en: 'på grund af (because of) is followed by a noun or a thing, not by a clause.',
    ex: ['Jeg kom hertil på grund af en lyd.'] },
  { id: 'siden', name: 'for … siden = ago', t: s => /\bfor \w+( \w+)? siden\b/.test(s),
    en: 'for … siden means ago. It points to a moment in the past, so the verb is in the past tense.',
    ex: ['Jeg kom hertil for tre dage siden.'] },
  { id: 'om', name: 'om + tid = in (the future)', t: s => /\bom (et|en|to|tre|fire|fem|nogle|lidt) ?(aar|time|uge|maaned|dag|minut|timer|uger|dage|maaneder|minutter)?\b/.test(s) && /\bom (et|en|to|tre|fire|fem|nogle)\b/.test(s),
    en: 'om + a time means in, counted from now into the future.',
    ex: ['Jeg rejser hjem om en time.'] },
  { id: 'i_tid', name: 'i + tid = for (how long)', t: s => /\bi (et|en|to|tre|fire|fem|mange|nogle) (aar|time|uge|maaned|dag|minut|timer|uger|dage|maaneder|minutter)\b/.test(s),
    en: 'i + a length of time says how long something lasts.',
    ex: ['Jeg har været her i en uge.', 'Jeg skal være her i et år.'] },
  { id: 'danar', name: 'da · når · hvornår', t: s => /\b(da|naar|hvornaar)\b/.test(s),
    en: 'da = when, about one time in the past. når = when, about the future or every time it happens. hvornår = when? only in questions, also indirect ones (Jeg ved ikke, hvornår …).',
    ex: ['Da jeg faldt, kom jeg hertil.', 'Når jeg har fundet mit navn, rejser jeg hjem.', 'Hvornår rejser du?'] },
  { id: 'gladfor', name: 'glad for · træt af', t: s => /\b(glad for|traet af)\b/.test(s),
    en: 'Some adjectives take a fixed preposition: glad for (happy about), træt af (tired of). After them comes a noun, or at + infinitive.',
    ex: ['Jeg er glad for at være her.', 'Jeg er træt af tirsdag.'] },
  { id: 'savne', name: 'savne', t: s => /\bsavne[rt]?\b/.test(s),
    en: 'savne = miss (someone or something). It takes its object directly, with no preposition.',
    ex: ['Jeg savner mit navn.'] },
  { id: 'som', name: 'som + job, uden en/et', t: s => /\b(arbejder|arbejdede|er|var) som \w+/.test(s),
    en: 'After som (as), a job has no en/et.',
    ex: ['Jeg arbejdede som musiker.'] },
  { id: 'sted', name: 'Hvor ligger den? Steder', t: s => /\b(overfor|ved siden af|i naerheden|taet paa|ikke saa langt fra|paa hjoernet af|paa en sidevej til)\b/.test(s),
    en: 'Place words: ved siden af (next to), overfor (opposite), i nærheden af (near), tæt på (close to), ikke så langt fra (not far from), på hjørnet af X og Y (on the corner of). After them usually comes the known landmark, in the definite form: overfor kirken. lige makes it exact: lige overfor.',
    ex: ['Bageren ligger lige overfor kirken.', 'Den ligger på hjørnet af Fjergade og Tandvej.'] },
  { id: 'gade', name: 'i eller på + gade, vej, torv', t: s => /\b(i|paa) \w*(gade|vej|straede|alle|plads|torvet|torv)\b/.test(s) || /\bpaa (torvet|tandvej)\b/.test(s),
    en: 'i + most streets in -gade and -stræde (i Fjergade). på + -vej, allé, plads, torv and boulevard (på Tandvej, på Torvet), and on a big, long gade. Districts and towns usually take i, some districts på.',
    ex: ['Jeg bor i Fjergade.', 'Bageren ligger på Tandvej.'] },
  { id: 'dendet', name: 'den · det · de · der', t: s => /\b(den|det|de|der)\b/.test(s) && /\b(ligger|er der|der er|der ligger|hvor ligger)\b/.test(s),
    en: 'den points back to an en-word (en kirke → den), det to an et-word (et apotek → det) or to a whole sentence (Ja, det er jeg), de to a plural. der is a place (there), and der er / der ligger says that something exists. If something else stands first, der comes after the verb: Ved siden af bageren ligger der en slagter.',
    ex: ['Hvor ligger den? (en kirke)', 'Der er meget larm.', 'Ja, det er der.'] },
  { id: 'kort', name: 'Korte svar', t: s => /^(ja|nej|jo|naa|nae) det (er|gor|goer|kan|vil|har|skal) (jeg|du|vi|der|den|det|de|han|hun)\b/.test(s) || /^det (er|goer|kan) (jeg|der)\b/.test(s),
    en: 'A short answer repeats det and the verb from the question: Er du glad? – Ja, det er jeg. With other verbs, use gør: Bor du her? – Ja, det gør jeg. After a negative question, yes is jo: Bor du ikke her? – Jo, det gør jeg.',
    ex: ['Ja, det er jeg.', 'Jo, det gør jeg.', 'Nej, det er der ikke.'] },
  { id: 'mange', name: 'mange · meget', t: s => /\b(mange|meget)\b/.test(s),
    en: 'mange is for things you can count (mange biler, mange caféer). meget is for things you cannot count (meget larm, meget trafik, meget lys). Grade them: rigtig, alt for, ikke så.',
    ex: ['Der er alt for mange biler.', 'Der er ikke så meget larm.'] },
  { id: 'datid', name: 'Datid (past tense)', t: s => /\b(\w{3,}ede|boede|arbejdede|laeste|spiste|koebte|hoerte|glemte|underviste|koerte|kom|faldt|var|havde|gik|fik|fandt|tog|loeb|blev|sang|sagde|skrev|hjalp|laa|sad)\b/.test(s.replace(/^\w+ /, m => /^(kom|gaa|tag|se|loeb) $/.test(m) ? '' : m)),
    en: 'Past tense: regular verbs take -ede (arbejdede, boede) or -te (læste, spiste). Many common verbs are irregular: kom, faldt, var, havde, gik, fandt.',
    ex: ['Før jeg kom hertil, boede jeg ved havet.'] },
  { id: 'modal', name: 'kan · vil · skal · må + infinitiv', t: s => /\b(kan|vil|skal|maa|kunne|ville|skulle)\b \w+/.test(s),
    en: 'After kan, vil, skal, må (and kunne, ville, skulle) the next verb is in the infinitive, without at.',
    ex: ['Jeg vil gerne hjem.', 'Du må løbe.'] },
  { id: 'ipaa', name: 'i eller på', t: s => /\b(bor|boede|laeste|studerede|studerer|arbejdede|arbejder)\b/.test(s) && /\b(i|paa) \w+/.test(s) && !/\b(i|paa) \w*(gade|vej|straede|alle|plads|torv|torvet)\b/.test(s),
    en: 'i is used for cities, countries and inside rooms (i København). på is used for many institutions and workplaces (på universitetet, på et hospital) and for islands (på Fyn).',
    ex: ['Jeg læste medicin på universitetet.'] },
];
