# Hertil

*You fell in. Everybody is busy. Somebody asks why you came.*

A story game for learning Danish, played in the browser (phone first). The narrator speaks English, two or three short lines at a time; the creatures of Hertil speak Danish, and Danish is how you get them to notice you.

**Play:** https://brunorutyna.github.io/hertil/ (Android Chrome. Danish speech uses the phone's own voice: Settings → Text-to-speech → install Danish if it is missing.)

## The world

Hertil is what its creatures call "here". It is loud, bright and printed in three inks that never quite line up. Things keep falling into it: feathers, teeth, keys, a trombone, you. There are no humans. Everything in Hertil exists because of a reason, and the kind of reason matters: *på grund af* makes a thing that anchors you, *for at* makes a pull you have to follow, *fordi* makes a story you can stand inside. A misplaced *ikke* tears loose and starts eating sentences.

## How it plays

- **Contracts**, solved through dialogue and actions, with a d20. To say something you build the sentence from word tiles: perfect first try gives *advantage*, two or more mistakes *disadvantage*. Tap any Danish word for its meaning (press and hold inside buttons). Asking for English costs attention.
- **Vægt (weight)** replaces standing: how much you count in Hertil. It is never explained in the game; you see it in how the creatures behave.
- **Imprints (aftryk):** the Danish you catch sticks to you as marks. When you sleep in your nest, they settle (spaced repetition). The ones you miss stay faint.
- **Ephemeral places:** some things happen once, and are gone when you leave. They flicker on the map.
- **Strange dice:** sometimes the die melts, and only your sentence decides (perfect or not). Sometimes the numbers turn into glyphs for a while, and the result is said in Danish words.
- **Skills grow by use** (Sprog, Løgn, Snige, Handel, Indsigt). No tutorials.
- **Light instead of time:** Gult lys → Lyserødt lys → Blåt lys → Lilla nat. Art, sound and what is open follow it.
- **Art: Feberdrøm.** Everything looks like a risograph zine: fluorescent pink, cobalt, yellow, green and orange inks overprinted slightly off-register, halftone dots, and nothing ever still. All drawn in SVG; the interface is stamped buttons and stickers.
- **Sound** generated in the browser: bouncy synth-pop with a theme per place (drums, bass, arpeggios, a wobbly lead), playful foley, and effects for stamps, melting dice and scrambled numbers. ⚙ settings for music, ambience, effects and voice.

## Lessons (spoiler-free)

**Lektion 1 · Hvorfor kom du hertil?** About 1½ hours. You fall into Hertil and have to give a reason. Three contracts, several endings, five side games. Grammar: fordi / for at / på grund af, ikke and gerne in a fordi-clause, før-clause inversion, past tense, i / på.

**Lektion 2 · Hvor længe skal du være her?** About 1½ hours. Something has gone wrong with time. Continue with your character from Lektion 1 (your choices there change what you meet), or start fresh. Three contracts, several endings, six side games including a clock, a timeline, three doors and the weather. Grammar: for … siden / i / om, hvornår / da / når, inversion after a time clause, adverbs in subordinate clauses, savne, glad for.

**Lektion 3 · Hvor ligger den henne?** About 1½ hours, and the end of Kapitel 1. Hertil grew a neighbourhood overnight, and nothing in it stays where it is. Continue from Lektion 2 or start fresh. Three contracts, several endings, five side games, including a street you have to pin down with place words. Grammar: ved siden af / overfor / i nærheden af / tæt på / på hjørnet af, i / på with streets, en bager or bageren, den / det / de / der, short answers (det er jeg, det gør jeg, jo), mange / meget, glad for / træt af / kan godt lide.

**Kapitel 2 · Arbejde & uddannelse** comes next, in a new place with new creatures.

## Files

- `js/data.js`: skills, attention tiers, gifts, creatures, vocabulary, glossary.
- `js/k1l1.js`, `js/k1l2.js`, `js/k1l3.js`: one file per lesson (locations, quests, nodes, travel encounters, mini-game data, lesson-only actions). Copy it for the next lesson and add its `<script>` to `index.html`.
- `js/engine.js`: everything else, including reusable mini-games (`hunt`, `jobs`, `corr`, `boxes`, `fixEntry`, `clock`, `weather`, `guess`, `findPlace`) and the self-plate.
- `js/art.js`: creatures (`ART.creature(name, gaze)`), the player's plate (`ART.self`), scenes, icons.
- `js/audio.js`: ambience and music per place, effects.
- Built on the engine of *Det var ikke noget*.

## Checks before every push

`tools/bump.sh` (new cache stamp, so phones get the new files), `npm test` (lint + a full playtest), `node tools/scenes.js scenes.png` after art changes. See `tools/README.md`. Test locally with `python3 -m http.server`, open `/?fast` to skip animations.
