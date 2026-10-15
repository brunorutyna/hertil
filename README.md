# Hertil

*You fell. Nobody looks at you. Everybody asks why you came.*

A story game for learning Danish, played in the browser (phone first). The narrator speaks English; the creatures of Hertil speak Danish, and Danish is how you get them to notice you.

**Play:** https://brunorutyna.github.io/hertil/ (Android Chrome. Danish speech uses the phone's own voice: Settings → Text-to-speech → install Danish if it is missing.)

## The world

Hertil is what its creatures call "here". Things keep falling into it: feathers, teeth, keys, you. There are no humans. Everything in Hertil exists because of a reason, and the kind of reason matters: *på grund af* makes a thing that anchors you, *for at* makes a pull you have to follow, *fordi* makes a story you can stand inside. A misplaced *ikke* tears loose and starts eating sentences.

## How it plays

- **Contracts**, solved through dialogue and actions, with a d20. To say something you build the sentence from word tiles: perfect first try gives *advantage*, two or more mistakes *disadvantage*. Tap any Danish word for its meaning (press and hold inside buttons). Asking for English costs attention.
- **Attention (opmærksomhed)** replaces standing. It decides where the creatures' eyes go: away, a sideways glance, the head half turned. A full look is never given by attention alone.
- **Imprints (aftryk):** the Danish you catch sticks to you as marks. When you sleep in your hollow, they settle (spaced repetition). The ones you miss stay faint.
- **Ephemeral places:** some things happen once, and are gone when you leave. They flicker on the map.
- **Strange dice:** sometimes the die melts, and only your sentence decides (perfect or not). Sometimes the numbers turn into glyphs for a while, and the result is said in Danish words.
- **Skills grow by use** (Sprog, Løgn, Snige, Handel, Indsigt). No tutorials.
- **Light instead of time:** Hvidt lys → Gult lys → Rødt lys → Mørke. Art, sound and what is open follow it.
- **Art** in three manners: Atlas (creatures as specimen plates), Tempera (interiors like faded frescoes), Støv (open places in amber dust). All drawn in SVG.
- **Sound** generated in the browser: drones, glass harmonica, bowed metal, a stair whose bell rises forever. ⚙ settings for music, ambience, effects and voice.

## Session 1 · Kapitel 1, Lektion 1 (“Hvorfor kom du hertil?”), about 1½ hours

Contracts: *Faldet* (you have no reason, so you sink; give one), *Ikket* (something is eating the word *ikke* out of sentences), *Den Bagvendte* (a monumental creature that has never turned around, because it does not know what it was before). Side jobs: Samleren's fallen things (hidden objects), Tælleren's list (guess the job), the ponds of the past (-ede / -te / irregular), Spejlet's corrections, Tælleren's archive (i or på). A market that is there only once.
Grammar: fordi / for at / på grund af, ikke and gerne in a fordi-clause, før-clause inversion, past tense, i / på.

## Files

- `js/data.js`: skills, attention tiers, gifts, creatures, vocabulary, glossary.
- `js/k1l1.js`: the lesson (locations, quests, nodes, travel encounters, mini-game data, lesson-only actions). Copy it for the next lesson and add its `<script>` to `index.html`.
- `js/engine.js`: everything else, including reusable mini-games (`hunt`, `jobs`, `corr`, `boxes`) and the self-plate.
- `js/art.js`: creatures (`ART.creature(name, gaze)`), the player's plate (`ART.self`), scenes, icons.
- `js/audio.js`: ambience and music per place, effects.
- Built on the engine of *Det var ikke noget*.

## Checks before every push

`npm test` (lint + a full playtest), `node tools/scenes.js scenes.png` after art changes. See `tools/README.md`. Test locally with `python3 -m http.server`, open `/?fast` to skip animations.
