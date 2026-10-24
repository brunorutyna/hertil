/* =========================================================================
   ART · Kapitel 3 — Deroppe, in Udsalg: the same risograph zine, sale inks
   (magenta, lime, tangerine, ultramarine on cream), off-register, halftone, jittering.
   Deroppe is a house on top of a shop street; its creatures are things that got lost.
   Eyes are never plain: a keyhole, a washing drum, a nozzle, a fridge light, a zip, a price display,
   a paint swirl, a price sticker, a punched hole, lamplight, a drawer slit, tufted buttons, a label window.
   Gaze g: 0 busy elsewhere · 1 a glance · 2 half turned · 3 looking at you (rare).
   ========================================================================= */
(() => {
  const { C, SCENES, INDOOR, GRADES, slit, M } = ART;
  const INK = '#1d1a5e', PAPER = '#fff4dc', MAG = '#ff2e88', LIME = '#7fd11b', TAN = '#ff8a1f', ULT = '#2b3bd6', PINKL = '#ffc2df', MINT = '#c9f27a', SKY = '#cfd6ff';
  const D3 = `<pattern id="u3M" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="1.7" fill="${MAG}"/></pattern>
    <pattern id="u3L" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="3.5" cy="3.5" r="1.7" fill="${LIME}"/></pattern>
    <pattern id="u3T" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="${TAN}" stroke-width="2.6"/></pattern>
    <pattern id="u3U" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M14 0H0V14" fill="none" stroke="${ULT}" stroke-width="1.2" opacity=".5"/></pattern>
    <pattern id="u3S" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)"><rect width="10" height="20" fill="${MAG}"/><rect x="10" width="10" height="20" fill="${TAN}"/></pattern>
    <pattern id="u3W" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="16" height="16" fill="${PAPER}"/><path d="M0 8 Q4 4 8 8 T16 8" fill="none" stroke="${ULT}" stroke-width="1.6"/></pattern>
    <pattern id="u3C" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="${MINT}"/><rect x="8" y="8" width="8" height="8" fill="${MINT}"/></pattern>
    <pattern id="wStr" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="5" fill="currentColor"/></pattern>`;
  const defs = s => `<defs>${D3}</defs>${s}`;
  const sh = (cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx * .12}" fill="${ULT}" opacity=".3" ${M}/>`;
  const tag = (x, y, r, txt, c = MAG) => `<g transform="rotate(${r} ${x} ${y})"><path d="M${x} ${y} l14 -10 h30 v20 h-30z" fill="#fff" stroke="${INK}" stroke-width="2"/><circle cx="${x + 10}" cy="${y}" r="2.4" fill="${INK}"/><text x="${x + 29}" y="${y + 4}" text-anchor="middle" font-family="Rubik Mono One, monospace" font-size="9" fill="${c}">${txt}</text></g>`;
  // a keyhole for an eye: dark and tilted while busy, lit from inside when it looks at you
  const keyhole = (x, y, s, g) => `<g transform="rotate(${[-30, -16, -5, 0][g]} ${x} ${y})"><circle cx="${x}" cy="${y}" r="${9 * s}" fill="${g >= 2 ? '#fff6a8' : INK}" stroke="${INK}" stroke-width="2.5"/><path d="M${x - 6 * s} ${y + 4 * s} L${x - 9 * s} ${y + 26 * s} H${x + 9 * s} L${x + 6 * s} ${y + 4 * s}Z" fill="${g >= 2 ? '#fff6a8' : INK}" stroke="${INK}" stroke-width="2.5"/>${g >= 1 ? `<circle cx="${x + (g >= 3 ? 0 : 3)}" cy="${y + 2}" r="${(g >= 3 ? 5 : 3) * s}" fill="${INK}"/>` : ''}${g >= 3 ? `<circle cx="${x - 2}" cy="${y}" r="1.6" fill="#fff"/>` : ''}</g>`;

  Object.assign(C, {
    /* Skabet: a tall wardrobe on bow legs. Its eye is the keyhole between the doors */
    skab(g) {
      return defs(`${sh(150, 352, 100)}
      <g class="wob">
        <path d="M88 330 q-10 12 -6 22 M212 330 q10 12 6 22" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <g class="mis"><rect x="74" y="40" width="160" height="292" rx="6" fill="${TAN}" ${M}/></g>
        <rect x="70" y="36" width="160" height="292" rx="6" fill="url(#u3M)" stroke="${INK}" stroke-width="4"/>
        <path d="M70 36 L80 14 H220 L230 36" fill="${ULT}" stroke="${INK}" stroke-width="4"/>
        <rect x="82" y="50" width="62" height="264" fill="${PAPER}" stroke="${INK}" stroke-width="3" opacity=".9"/><rect x="156" y="50" width="62" height="264" fill="${PAPER}" stroke="${INK}" stroke-width="3" opacity=".9"/>
        <path d="M92 64 h42 v50 h-42z M166 64 h42 v50 h-42z" fill="none" stroke="${MAG}" stroke-width="2.5"/>
        ${keyhole(150, 170, 1, g)}
        <g class="sway"><path d="M218 120 q30 -4 34 26 l-24 0" fill="none" stroke="${INK}" stroke-width="3.5"/><path d="M246 146 l-26 24 h54z" fill="none" stroke="${INK}" stroke-width="3"/></g>
        <g class="sway2"><path d="M82 220 q-28 6 -30 34" fill="none" stroke="${INK}" stroke-width="3.5"/><rect x="34" y="250" width="34" height="46" rx="4" fill="${LIME}" stroke="${INK}" stroke-width="3" transform="rotate(-8 51 273)"/></g>
        <g class="flt">${tag(234, 60, 18, '−50%')}</g>
      </g>`);
    },
    /* Bøjlerne: a flock of coat hangers flying in formation. Hooks for heads, no eyes */
    boejler(g) {
      const h = (x, y, s, r, i) => `<g class="${i % 2 ? 'flap' : 'hop'}" style="animation-delay:-${i * .3}s;transform-origin:${x}px ${y}px"><g transform="translate(${x} ${y}) rotate(${r}) scale(${s})">
        <path d="M0 -26 q0 -14 10 -14 q10 0 8 10" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
        <path d="M0 -20 L-46 12 H46 Z" fill="none" stroke="${[MAG, ULT, TAN, LIME, MAG][i]}" stroke-width="7" stroke-linejoin="round" ${M}/><path d="M0 -20 L-46 12 H46 Z" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/></g></g>`;
      const turn = [24, 14, 6, 0][g];
      return defs(`${sh(150, 352, 90)}${[[90, 120, 1, -turn], [200, 90, .9, turn], [150, 200, 1.1, -turn / 2], [70, 260, .8, turn], [230, 250, .85, -turn]].map(([x, y, s, r], i) => h(x, y, s, r, i)).join('')}`);
    },
    /* Vaskemaskinen: a washing machine. The drum window is its eye: clothes swirl in it, and a sock is the pupil */
    vask(g) {
      const a = [140, 90, 40, 0][g];
      return defs(`${sh(150, 352, 100)}
      <g class="hop">
        <g class="mis"><rect x="58" y="76" width="190" height="270" rx="12" fill="${ULT}" ${M}/></g>
        <rect x="54" y="72" width="190" height="270" rx="12" fill="#fff" stroke="${INK}" stroke-width="4"/><rect x="54" y="72" width="190" height="56" rx="12" fill="url(#u3L)" stroke="${INK}" stroke-width="4"/>
        <circle cx="200" cy="100" r="12" fill="${MAG}" stroke="${INK}" stroke-width="3"/><path d="M70 92 h70 M70 108 h44" stroke="${INK}" stroke-width="3"/>
        <circle cx="149" cy="230" r="74" fill="${INK}"/><circle cx="149" cy="230" r="62" fill="${SKY}" stroke="${INK}" stroke-width="3"/>
        <g class="${g >= 3 ? '' : 'spin'}" style="transform-origin:149px 230px"><g transform="rotate(${a} 149 230)">
          <path d="M120 200 q20 -14 40 4 q16 14 -6 26 q-24 10 -30 -6z" fill="${MAG}" opacity=".85" stroke="${INK}" stroke-width="2"/>
          <path d="M150 238 q22 6 26 24 q-8 12 -24 4 q-10 -8 -2 -28z" fill="${LIME}" opacity=".85" stroke="${INK}" stroke-width="2"/>
          <path d="M149 230 L149 186 q14 -4 16 8 l-6 30z" fill="${TAN}" stroke="${INK}" stroke-width="2.4"/></g></g>
        ${g >= 3 ? `<circle cx="149" cy="230" r="7" fill="${INK}"/><circle cx="147" cy="228" r="2" fill="#fff"/>` : ''}
        <g class="flt" fill="#fff" stroke="${INK}" stroke-width="2"><circle cx="250" cy="70" r="10"/><circle cx="266" cy="44" r="6"/><circle cx="44" cy="60" r="8"/></g>
      </g>`);
    },
    /* Støvsugeren: a canister vacuum cleaner with a long hose neck. Only a nozzle for a face */
    stoev(g) {
      const turn = [60, 34, 14, 0][g];
      return defs(`${sh(150, 352, 110)}
      <g class="hop">
        <circle cx="96" cy="334" r="16" fill="${INK}"/><circle cx="210" cy="334" r="16" fill="${INK}"/><circle cx="96" cy="334" r="6" fill="${LIME}"/><circle cx="210" cy="334" r="6" fill="${LIME}"/>
        <g class="mis"><path d="M60 330 Q60 230 154 226 Q246 230 246 330Z" fill="${MAG}" ${M}/></g>
        <path d="M56 326 Q56 226 150 222 Q242 226 242 326Z" fill="url(#u3T)" stroke="${INK}" stroke-width="4"/>
        <path d="M80 300 h140" stroke="${INK}" stroke-width="3" stroke-dasharray="6 6"/>
        <g class="sway" style="transform-origin:200px 240px"><path d="M200 240 C260 200 250 120 190 100 C150 88 120 110 120 140" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M200 240 C260 200 250 120 190 100 C150 88 120 110 120 140" fill="none" stroke="${ULT}" stroke-width="9" stroke-linecap="round" stroke-dasharray="3 5"/>
          <g transform="rotate(${turn} 120 150)"><path d="M100 140 h40 l14 34 h-68z" fill="${TAN}" stroke="${INK}" stroke-width="4"/><path d="M90 170 h60" stroke="${INK}" stroke-width="5"/>${g >= 2 ? `<path d="M96 178 h48" stroke="${INK}" stroke-width="2.4" stroke-dasharray="3 3"/>` : ''}</g></g>
        <g class="chew" style="transform-origin:150px 250px"><path d="M120 250 q30 -14 60 0" fill="none" stroke="${INK}" stroke-width="3"/></g>
      </g>`);
    },
    /* Køleskabet: a fridge with magnets. Its mouth is the door seal; the light inside shows when it pays attention */
    koel(g) {
      const open = [0, 6, 14, 24][g];
      return defs(`${sh(150, 352, 90)}
      <g class="wob">
        <g class="mis"><rect x="86" y="30" width="140" height="310" rx="18" fill="${LIME}" ${M}/></g>
        <rect x="80" y="26" width="140" height="310" rx="18" fill="${PAPER}" stroke="${INK}" stroke-width="4"/><path d="M80 130 H220" stroke="${INK}" stroke-width="3"/>
        ${open ? `<path d="M220 140 L${220 + open} 146 V330 L220 334Z" fill="#fff6a8" stroke="${INK}" stroke-width="3"/>` : ''}
        <path d="M200 60 V100 M200 160 V220" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
        <g class="chew" style="transform-origin:150px 130px"><path d="M100 126 q50 ${8 + g * 3} 100 0" fill="none" stroke="${MAG}" stroke-width="4"/></g>
        <rect x="104" y="56" width="26" height="22" fill="${MAG}" stroke="${INK}" stroke-width="2" transform="rotate(-8 117 67)"/><circle cx="140" cy="200" r="11" fill="${TAN}" stroke="${INK}" stroke-width="2"/>
        <rect x="100" y="230" width="44" height="30" fill="#fff" stroke="${INK}" stroke-width="2" transform="rotate(6 122 245)"/><path d="M106 240 h30 M106 248 h22" stroke="${ULT}" stroke-width="2" transform="rotate(6 122 245)"/>
        <g class="flt" opacity=".7" fill="none" stroke="${ULT}" stroke-width="2.5"><path d="M50 80 l10 10 m0 -10 l-10 10 M44 150 l12 12 m0 -12 l-12 12 M256 60 l10 10 m0 -10 l-10 10"/></g>
      </g>`);
    },
    /* Tasken: a sports bag that packs itself. Its zip is its mouth and its eye at once */
    taske(g) {
      const z = [40, 70, 110, 150][g];
      return defs(`${sh(150, 352, 110)}
      <g class="hop">
        <path d="M100 200 Q150 120 200 200" fill="none" stroke="${INK}" stroke-width="10"/><path d="M100 200 Q150 120 200 200" fill="none" stroke="${MAG}" stroke-width="5"/>
        <g class="mis"><path d="M44 210 Q44 196 60 196 H244 Q260 196 260 210 V320 Q260 336 244 336 H60 Q44 336 44 320Z" fill="${ULT}" ${M}/></g>
        <path d="M40 206 Q40 192 56 192 H240 Q256 192 256 206 V316 Q256 332 240 332 H56 Q40 332 40 316Z" fill="url(#u3S)" stroke="${INK}" stroke-width="4" opacity=".9"/>
        <path d="M60 204 H${60 + z}" stroke="${INK}" stroke-width="10"/><path d="M${60 + z} 204 H236" stroke="${INK}" stroke-width="3" stroke-dasharray="3 3"/>
        <rect x="${54 + z}" y="196" width="14" height="22" rx="3" fill="${LIME}" stroke="${INK}" stroke-width="2.5"/>
        <g class="flt"><path d="M120 170 q-20 -40 10 -60" fill="none" stroke="${INK}" stroke-width="2" opacity=".6"/><path d="M180 170 q20 -40 -10 -60" fill="none" stroke="${INK}" stroke-width="2" opacity=".6"/></g>
      </g>`);
    },
    /* Kassen: a cash register. The price display is its eye: it shows what it thinks you are worth */
    kasse(g) {
      const disp = ['- - -', '0 KR', '?? KR', '♥ KR'][g];
      return defs(`${sh(150, 352, 110)}
      <g class="hop">
        <g class="mis"><path d="M50 200 L80 120 H230 L256 200 V320 H50Z" fill="${TAN}" ${M}/></g>
        <path d="M46 196 L76 116 H226 L252 196 V316 H46Z" fill="url(#u3U)" stroke="${INK}" stroke-width="4"/>
        <rect x="46" y="250" width="206" height="66" fill="${MAG}" stroke="${INK}" stroke-width="4" ${M}/><path d="M120 284 h60" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
        ${Array.from({ length: 12 }, (_, i) => `<rect x="${86 + (i % 4) * 34}" y="${140 + Math.floor(i / 4) * 18}" width="24" height="12" rx="3" fill="${i === 11 ? LIME : '#fff'}" stroke="${INK}" stroke-width="2"/>`).join('')}
        <rect x="96" y="44" width="110" height="52" fill="${INK}"/><rect x="104" y="52" width="94" height="36" fill="${MINT}"/>
        <text x="151" y="78" text-anchor="middle" font-family="Chivo Mono, monospace" font-weight="700" font-size="20" fill="${INK}">${disp}</text><path d="M151 96 V116" stroke="${INK}" stroke-width="6"/>
        <g class="swing" style="transform-origin:252px 220px"><path d="M252 220 l26 -40" stroke="${INK}" stroke-width="5"/><circle cx="280" cy="176" r="9" fill="${LIME}" stroke="${INK}" stroke-width="3"/></g>
        <g class="flt">${tag(16, 120, -14, 'KR')}</g>
      </g>`);
    },
    /* Farvebøtten: a paint tin tipped over, colours pouring. Its eye is a swirl in the paint */
    boette(g) {
      const sw = [6, 10, 14, 18][g];
      return defs(`${sh(150, 352, 120)}
      <g class="wob">
        <g class="mis"><path d="M40 352 Q60 300 120 320 Q180 290 230 330 Q270 340 268 352Z" fill="${LIME}" ${M}/></g>
        <path d="M44 352 Q70 310 120 326 Q170 300 222 334" fill="none" stroke="${INK}" stroke-width="3"/>
        <g transform="rotate(-24 150 220)">
          <g class="mis2"><rect x="90" y="120" width="130" height="160" rx="10" fill="${ULT}" ${M}/></g>
          <rect x="86" y="116" width="130" height="160" rx="10" fill="url(#u3M)" stroke="${INK}" stroke-width="4"/><ellipse cx="151" cy="116" rx="65" ry="16" fill="${INK}"/><ellipse cx="151" cy="118" rx="56" ry="11" fill="${TAN}"/>
          <path d="M100 130 Q151 60 202 130" fill="none" stroke="${INK}" stroke-width="5"/>
        </g>
        <path d="M200 140 Q250 180 238 252 Q232 300 258 340" fill="none" stroke="${MAG}" stroke-width="22" ${M} stroke-linecap="round"/><path d="M208 150 Q246 190 244 250" fill="none" stroke="${TAN}" stroke-width="10" ${M} stroke-linecap="round"/>
        <g class="${g >= 3 ? '' : 'spin2'}" style="transform-origin:150px 220px"><path d="M150 220 m-${sw} 0 a${sw} ${sw} 0 1 1 ${sw * 2} 0 a${sw * .6} ${sw * .6} 0 1 1 -${sw * 1.2} 0" fill="none" stroke="#fff" stroke-width="4"/></g>
        ${g >= 3 ? `<circle cx="150" cy="220" r="5" fill="${INK}"/>` : ''}
      </g>`);
    },
    /* Dukken: a shop mannequin with no face; a price sticker on its head is where it looks from.
       The variants wear different things (the guessing game on the sale street). */
    dukke(g) { return C.dukkeBase(g, {}); },
    dukke1(g) { return C.dukkeBase(g, { hat: MAG, scarf: LIME, body: ULT, shoes: INK }); },
    dukke2(g) { return C.dukkeBase(g, { body: TAN, dots: true, shoes: MAG }); },
    dukke3(g) { return C.dukkeBase(g, { hat: ULT, body: '#fff', stripes: true, shoes: LIME }); },
    dukke4(g) { return C.dukkeBase(g, { scarf: MAG, body: LIME, shoes: TAN, glasses: true }); },
    dukkeBase(g, o) {
      const r = [-60, -36, -14, 0][g];
      return defs(`${sh(150, 352, 70)}
      <g class="sway" style="transform-origin:150px 350px">
        <path d="M150 300 V346 M116 348 H184" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
        <g class="mis"><path d="M110 120 Q150 100 190 120 L200 300 H100Z" fill="${o.body || PINKL}" ${M}/></g>
        <path d="M106 116 Q150 96 194 116 L198 296 H102Z" fill="${o.body || PINKL}" stroke="${INK}" stroke-width="4"/>
        ${o.stripes ? `<g stroke="${MAG}" stroke-width="7">${[150, 180, 210, 240, 270].map(y => `<path d="M104 ${y} H198"/>`).join('')}</g>` : ''}
        ${o.dots ? `<g fill="#fff">${[[124, 150], [170, 160], [140, 200], [182, 220], [120, 250], [160, 270]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" stroke="${INK}" stroke-width="1.5"/>`).join('')}</g>` : ''}
        <path d="M106 130 q-30 40 -20 110 M194 130 q30 40 20 110" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
        <ellipse cx="150" cy="70" rx="34" ry="40" fill="#f3e3cf" stroke="${INK}" stroke-width="4"/>
        ${o.hat ? `<path d="M114 60 Q150 18 186 60Z" fill="${o.hat}" stroke="${INK}" stroke-width="3"/><circle cx="150" cy="24" r="7" fill="${o.hat}" stroke="${INK}" stroke-width="2.5"/>` : ''}
        ${o.scarf ? `<path d="M118 108 Q150 124 182 108 L184 122 Q150 136 116 122Z" fill="${o.scarf}" stroke="${INK}" stroke-width="2.5"/><path d="M168 122 l8 40 l12 -4 l-6 -38" fill="${o.scarf}" stroke="${INK}" stroke-width="2.5"/>` : ''}
        ${o.glasses ? `<g fill="${INK}"><rect x="124" y="66" width="22" height="12" rx="4"/><rect x="154" y="66" width="22" height="12" rx="4"/></g><path d="M146 70 h8" stroke="${INK}" stroke-width="2.5"/>` : ''}
        <g transform="rotate(${r} 150 70)"><g transform="translate(130 ${o.glasses ? 44 : 60})">${`<path d="M0 0 l12 -9 h26 v18 h-26z" fill="#fff" stroke="${INK}" stroke-width="2"/><circle cx="9" cy="0" r="${g >= 3 ? 4 : 2.4}" fill="${INK}"/>`}</g></g>
        ${o.shoes ? `<path d="M118 344 q-12 0 -12 -8 h24z M182 344 q12 0 12 -8 h-24z" fill="${o.shoes}" stroke="${INK}" stroke-width="2.5"/>` : ''}
      </g>`);
    },
    /* Prismærket: a price tag on a string. The punched hole is its eye */
    maerke(g) {
      return defs(`${sh(150, 352, 50)}
      <g class="flt">
        <path d="M150 20 C130 60 180 80 150 120" fill="none" stroke="${INK}" stroke-width="3"/>
        <g class="swing" style="transform-origin:150px 120px">
          <g class="mis"><path d="M150 112 L210 160 V300 H90 V160Z" fill="${MAG}" ${M}/></g>
          <path d="M150 108 L206 156 V296 H94 V156Z" fill="#fff" stroke="${INK}" stroke-width="4"/>
          <circle cx="150" cy="148" r="${[6, 8, 10, 12][g]}" fill="${g >= 2 ? '#fff6a8' : INK}" stroke="${INK}" stroke-width="3"/>${g >= 3 ? `<circle cx="150" cy="148" r="4" fill="${INK}"/>` : ''}
          <text x="150" y="214" text-anchor="middle" font-family="Rubik Mono One, monospace" font-size="26" fill="${MAG}">99,-</text>
          <path d="M108 240 h84 M108 258 h60" stroke="${ULT}" stroke-width="4"/><path d="M106 196 l90 -24" stroke="${INK}" stroke-width="3" opacity=".5"/>
        </g>
      </g>`);
    },
    /* Lampen: the white floor lamp. The light in the shade is its eye: a cone that swings round to you */
    lampe(g) {
      const tilt = [40, 24, 10, 0][g];
      return defs(`${sh(150, 352, 70)}
      <g class="sway" style="transform-origin:150px 350px">
        <path d="M110 350 Q150 330 190 350" fill="${INK}"/><path d="M150 340 V140" stroke="${INK}" stroke-width="8"/><path d="M150 340 V140" stroke="#fff" stroke-width="3"/>
        <g transform="rotate(${tilt} 150 130)">
          <path d="M${150 - 40} ${150} L${150 - 80} ${330} H${150 + 80} L${150 + 40} ${150}Z" fill="#fff6a8" opacity="${[.15, .25, .4, .55][g]}" ${M}/>
          <g class="mis"><path d="M98 66 L202 66 L226 154 H74Z" fill="${LIME}" ${M}/></g>
          <path d="M94 62 L198 62 L222 150 H70Z" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M84 110 H212" stroke="${MAG}" stroke-width="3" stroke-dasharray="4 6"/>
          <ellipse cx="146" cy="150" rx="${18 + g * 4}" ry="7" fill="#fff6a8" stroke="${INK}" stroke-width="2.5" class="glow"/>
        </g>
        <g class="flt">${tag(220, 230, 14, 'GRATIS', ULT)}</g>
      </g>`);
    },
    /* Kommoden: a red chest of drawers. The top drawer is open a crack: that dark slit is its eye */
    kommode(g) {
      return defs(`${sh(150, 352, 110)}
      <g class="wob">
        <path d="M70 330 l-6 22 M230 330 l6 22" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
        <g class="mis"><rect x="60" y="96" width="186" height="236" rx="6" fill="${MAG}" ${M}/></g>
        <rect x="56" y="92" width="186" height="236" rx="6" fill="#e8322f" stroke="${INK}" stroke-width="4"/><rect x="56" y="92" width="186" height="236" rx="6" fill="url(#u3T)" opacity=".5"/>
        <rect x="70" y="106" width="158" height="52" fill="${INK}"/>${slit(149, 132, 40, g, -6)}
        ${[176, 236].map((y, i) => `<g><rect x="70" y="${y}" width="158" height="50" fill="#ff7a6e" stroke="${INK}" stroke-width="3"/><circle cx="149" cy="${y + 25}" r="7" fill="${LIME}" stroke="${INK}" stroke-width="2.5"/></g>`).join('')}
        <g class="flt"><rect x="226" y="40" width="40" height="30" fill="#fff" stroke="${INK}" stroke-width="2.5" transform="rotate(14 246 55)"/><path d="M232 52 h24 M232 60 h16" stroke="${ULT}" stroke-width="2" transform="rotate(14 246 55)"/></g>
        <g class="sway2"><path d="M60 196 q-30 10 -34 40" fill="none" stroke="${INK}" stroke-width="4"/><path d="M14 236 l14 -6 l10 14 l-14 6z" fill="${LIME}" stroke="${INK}" stroke-width="2.5"/></g>
      </g>`);
    },
    /* Lænestolen: a green armchair. The tufted buttons on its back are a compound eye: the lit ones look at you */
    laenestol(g) {
      const lit = [1, 3, 6, 9][g];
      const btn = [[118, 110], [150, 104], [182, 110], [112, 146], [150, 140], [188, 146], [118, 182], [150, 176], [182, 182]];
      return defs(`${sh(150, 352, 120)}
      <g class="wob">
        <path d="M76 320 l-8 30 M224 320 l8 30" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
        <g class="mis"><path d="M84 80 Q150 50 216 80 L222 240 H78Z" fill="${LIME}" ${M}/></g>
        <path d="M80 76 Q150 46 220 76 L224 236 H76Z" fill="#2fae4f" stroke="${INK}" stroke-width="4"/>
        ${btn.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="7" fill="${i < lit ? '#fff6a8' : INK}" stroke="${INK}" stroke-width="2"/>`).join('')}
        <path d="M44 200 Q40 160 76 170 L80 320 H52Z M256 200 Q260 160 224 170 L220 320 H248Z" fill="#2fae4f" stroke="${INK}" stroke-width="4"/>
        <rect x="76" y="236" width="148" height="44" rx="12" fill="${MINT}" stroke="${INK}" stroke-width="4"/><path d="M76 290 H224 V320 H76Z" fill="#2fae4f" stroke="${INK}" stroke-width="4"/>
        <g class="flt">${tag(214, 40, 12, 'GRØN!', MAG)}</g>
      </g>`);
    },
    /* Sofaen: a light-green sofa that agrees with whoever sat on it last. Its seat cushions are eyelids */
    sofa3(g) {
      return defs(`${sh(150, 352, 130)}
      <g class="hop">
        <path d="M40 330 v20 M260 330 v20" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
        <g class="mis"><rect x="34" y="150" width="236" height="100" rx="20" fill="${TAN}" ${M}/></g>
        <rect x="30" y="146" width="236" height="100" rx="20" fill="${MINT}" stroke="${INK}" stroke-width="4"/><rect x="30" y="146" width="236" height="100" rx="20" fill="url(#u3L)" opacity=".6"/>
        <rect x="16" y="210" width="40" height="120" rx="14" fill="${LIME}" stroke="${INK}" stroke-width="4"/><rect x="240" y="210" width="40" height="120" rx="14" fill="${LIME}" stroke="${INK}" stroke-width="4"/>
        <rect x="56" y="240" width="184" height="90" fill="#e4fbb8" stroke="${INK}" stroke-width="4"/><path d="M148 240 V330" stroke="${INK}" stroke-width="3"/>
        ${slit(102, 278, 30, g, 4)}${slit(194, 278, 30, g, -4)}
        <g class="flt"><rect x="70" y="170" width="44" height="40" rx="10" fill="${TAN}" stroke="${INK}" stroke-width="3" transform="rotate(-12 92 190)"/><rect x="184" y="166" width="44" height="40" rx="10" fill="${MAG}" stroke="${INK}" stroke-width="3" transform="rotate(10 206 186)"/></g>
      </g>`);
    },
    /* Frakken: the coat that does not fit, standing on its own. Its eye is the label in its collar */
    frakke(g) {
      return defs(`${sh(150, 352, 80)}
      <g class="sway" style="transform-origin:150px 340px">
        <g class="mis"><path d="M104 70 L196 70 L232 330 H68Z" fill="${ULT}" ${M}/></g>
        <path d="M100 66 L200 66 L236 326 H64Z" fill="#a9a6b8" stroke="${INK}" stroke-width="4"/><path d="M100 66 L200 66 L236 326 H64Z" fill="url(#u3U)"/>
        <path d="M150 90 V326" stroke="${INK}" stroke-width="3"/>${[150, 200, 250].map(y => `<circle cx="162" cy="${y}" r="6" fill="${TAN}" stroke="${INK}" stroke-width="2"/>`).join('')}
        <path d="M100 66 L150 110 L200 66" fill="${PAPER}" stroke="${INK}" stroke-width="4"/>
        <rect x="128" y="70" width="44" height="${[8, 14, 20, 26][g]}" fill="#fff" stroke="${INK}" stroke-width="2.5"/>${g >= 2 ? `<text x="150" y="${76 + [8, 14, 20, 26][g] / 2}" text-anchor="middle" font-family="Rubik Mono One, monospace" font-size="7" fill="${MAG}">${g >= 3 ? 'DIG?' : '?'}</text>` : ''}
        <g class="swing" style="transform-origin:96px 80px"><path d="M100 76 Q40 140 46 300" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M100 76 Q40 140 46 300" fill="none" stroke="#a9a6b8" stroke-width="15" stroke-linecap="round"/></g>
        <g class="swing" style="transform-origin:204px 80px;animation-delay:-.6s"><path d="M200 76 Q260 140 254 300" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M200 76 Q260 140 254 300" fill="none" stroke="#a9a6b8" stroke-width="15" stroke-linecap="round"/></g>
      </g>`);
    },
    /* Genbrugskassen: a recycling crate. The arrows going round on its front are its eye */
    genbrugsk(g) {
      return defs(`${sh(150, 352, 110)}
      <g class="hop">
        <g class="mis"><path d="M52 150 H252 L236 336 H68Z" fill="${LIME}" ${M}/></g>
        <path d="M48 146 H248 L232 332 H64Z" fill="url(#u3L)" stroke="${INK}" stroke-width="4"/><path d="M60 180 H236 M66 240 H230 M70 300 H226" stroke="${INK}" stroke-width="2.5" opacity=".6"/>
        <g class="${g >= 3 ? '' : 'spin'}" style="transform-origin:148px 238px">${[0, 120, 240].map(a => `<g transform="rotate(${a} 148 238)"><path d="M148 196 A42 42 0 0 1 184 216" fill="none" stroke="${ULT}" stroke-width="8"/><path d="M178 204 l14 14 l-18 4z" fill="${ULT}"/></g>`).join('')}</g>
        <circle cx="148" cy="238" r="${[6, 9, 12, 16][g]}" fill="${g >= 2 ? '#fff6a8' : INK}" stroke="${INK}" stroke-width="3"/>${g >= 3 ? `<circle cx="148" cy="238" r="5" fill="${INK}"/>` : ''}
        <g class="flt"><path d="M90 146 l-10 -40 l30 10z" fill="${MAG}" stroke="${INK}" stroke-width="2.5"/><path d="M200 146 q10 -50 40 -40 q-10 30 -30 40z" fill="${TAN}" stroke="${INK}" stroke-width="2.5"/><rect x="128" y="96" width="30" height="50" fill="#fff" stroke="${INK}" stroke-width="2.5" transform="rotate(-10 143 121)"/></g>
      </g>`);
    },
  });

  /* ---------------- scenes (393 × 560) ---------------- */
  const paper = (c = PAPER) => `<rect width="393" height="560" fill="${c}"/>`;
  const conf = (n, y0, y1, seedN) => { let s = '', seed = seedN * 431; const r = () => (seed = (seed * 9301 + 49297) % 233280) / 233280; const cs = [MAG, LIME, TAN, ULT]; for (let i = 0; i < n; i++) { const x = r() * 393, y = y0 + r() * (y1 - y0); s += `<g class="conf" style="animation-delay:-${(r() * 6).toFixed(1)}s"><path d="M${x.toFixed(0)} ${y.toFixed(0)} l7 -5 h12 v10 h-12z" fill="#fff" stroke="${cs[i % 4]}" stroke-width="1.6" transform="rotate(${(r() * 90).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})"/></g>`; } return `<g>${s}</g>`; }; // falling price tags
  const floor = (y, c = 'url(#u3C)') => `<path d="M0 ${y} H393 V560 H0Z" fill="${c}" ${M}/><path d="M0 ${y} H393" stroke="${INK}" stroke-width="4"/>`;
  const wall = (c = 'url(#u3W)', o = .35) => `<g class="mis2"><rect width="393" height="560" fill="${c}" opacity="${o}" ${M}/></g>`;
  const win = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${SKY}" stroke="${INK}" stroke-width="4"/><path d="M${x + w / 2} ${y} V${y + h} M${x} ${y + h / 2} H${x + w}" stroke="${INK}" stroke-width="3"/>`;
  const sale = (x, y, r, t = 'UDSALG') => `<g transform="rotate(${r} ${x} ${y})"><rect x="${x - 60}" y="${y - 18}" width="120" height="36" fill="${MAG}" stroke="${INK}" stroke-width="3"/><text x="${x}" y="${y + 7}" text-anchor="middle" font-family="Rubik Mono One, monospace" font-size="16" fill="#fff">${t}</text></g>`;
  const S3 = {
    gang3() {
      return `${paper()}${wall()}
        <rect x="150" y="70" width="96" height="290" fill="${TAN}" stroke="${INK}" stroke-width="4" ${M}/><rect x="164" y="86" width="68" height="120" fill="${SKY}" stroke="${INK}" stroke-width="3"/><circle cx="226" cy="230" r="6" fill="${INK}"/>
        ${[40, 80, 316, 350].map((x, i) => `<path d="M${x} 110 q0 -10 8 -10" fill="none" stroke="${INK}" stroke-width="4"/><g class="sway2" style="transform-origin:${x}px 112px;animation-delay:-${i * .4}s"><path d="M${x - 20} 112 L${x} 108 L${x + 20} 112 L${x + 24} 220 H${x - 24}Z" fill="${[MAG, LIME, ULT, '#a9a6b8'][i]}" stroke="${INK}" stroke-width="3" ${M}/></g>`).join('')}
        <path d="M110 360 H286 L300 400 H96Z" fill="${MAG}" stroke="${INK}" stroke-width="3" ${M}/><text x="198" y="388" text-anchor="middle" font-family="Rubik Mono One, monospace" font-size="11" fill="#fff">VELKOMMEN</text>
        ${floor(400)}${conf(10, 40, 380, 41)}`;
    },
    sove3() {
      return `${paper()}${wall('url(#u3M)', .25)}${win(150, 60, 100, 100)}
        <rect x="40" y="250" width="300" height="70" rx="10" fill="${PINKL}" stroke="${INK}" stroke-width="4"/><rect x="40" y="226" width="80" height="40" rx="14" fill="#fff" stroke="${INK}" stroke-width="3"/>
        <path d="M110 250 Q220 226 340 250 V320 H110Z" fill="url(#u3S)" stroke="${INK}" stroke-width="3" opacity=".85"/><path d="M40 200 V360 M340 230 V360" stroke="${INK}" stroke-width="7"/>
        <g class="flt"><path d="M290 150 l18 -18 m-6 0 h6 v6" stroke="${ULT}" stroke-width="3" fill="none"/><text x="280" y="140" font-family="Rubik Mono One, monospace" font-size="14" fill="${ULT}">z</text></g>
        ${floor(380)}${conf(6, 40, 360, 42)}`;
    },
    bad3() {
      return `${paper('#e9f4ff')}<g class="mis2"><rect width="393" height="400" fill="url(#u3U)" opacity=".6" ${M}/></g>
        <rect x="150" y="60" width="100" height="130" rx="50" fill="${SKY}" stroke="${INK}" stroke-width="4"/><path d="M170 90 l20 -14 M180 110 l30 -22" stroke="#fff" stroke-width="4"/>
        <path d="M30 280 H250 Q250 360 170 360 H90 Q30 360 30 300Z" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M40 288 H240" stroke="${ULT}" stroke-width="6" ${M}/>
        <g class="flt">${[[60, 250], [90, 230], [130, 246]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="10" fill="#fff" stroke="${ULT}" stroke-width="2.5"/>`).join('')}</g>
        <path d="M300 110 V340" stroke="${INK}" stroke-width="4"/><g class="sway2" style="transform-origin:300px 120px"><rect x="300" y="120" width="54" height="90" fill="${MAG}" stroke="${INK}" stroke-width="3" ${M}/><path d="M300 140 h54 M300 190 h54" stroke="#fff" stroke-width="4"/></g>
        ${floor(380, 'url(#u3W)')}`;
    },
    stue3() {
      return `${paper()}${wall('url(#u3L)', .28)}${win(40, 60, 110, 120)}
        <rect x="200" y="60" width="140" height="100" fill="#fff" stroke="${INK}" stroke-width="4"/><path d="M220 140 l30 -40 l20 26 l14 -14 l40 28" fill="none" stroke="${MAG}" stroke-width="4"/><circle cx="310" cy="88" r="10" fill="${TAN}"/>
        <ellipse cx="150" cy="300" rx="90" ry="18" fill="${ULT}" stroke="${INK}" stroke-width="4" ${M}/><path d="M80 304 v40 M220 304 v40 M150 318 v30" stroke="${INK}" stroke-width="5"/><rect x="120" y="270" width="26" height="18" fill="${TAN}" stroke="${INK}" stroke-width="2.5"/><path d="M170 286 q8 -24 18 0" fill="${MAG}" stroke="${INK}" stroke-width="2.5"/>
        <ellipse cx="300" cy="380" rx="70" ry="16" fill="${LIME}" stroke="${INK}" stroke-width="3" ${M}/>${floor(360)}
        <g class="flt">${[[70, 420], [180, 450], [300, 470]].map(([x, y], i) => `<path d="M${x} ${y} q8 -16 16 0" fill="none" stroke="${INK}" stroke-width="2.5" opacity=".6"/>`).join('')}</g>${conf(12, 40, 340, 43)}`;
    },
    koekken3() {
      return `${paper('#fff8e8')}<g class="mis2"><rect width="393" height="560" fill="url(#u3C)" opacity=".35" ${M}/></g>
        <rect x="20" y="220" width="353" height="20" fill="${TAN}" stroke="${INK}" stroke-width="4"/><rect x="20" y="240" width="353" height="140" fill="#fff" stroke="${INK}" stroke-width="4"/>${[110, 200, 290].map(x => `<path d="M${x} 240 V380" stroke="${INK}" stroke-width="3"/><circle cx="${x - 14}" cy="300" r="5" fill="${INK}"/>`).join('')}
        <rect x="40" y="60" width="140" height="90" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M40 105 H180 M110 60 V150" stroke="${INK}" stroke-width="3"/>
        <ellipse cx="290" cy="216" rx="40" ry="10" fill="${INK}"/><path d="M252 216 L258 170 H322 L328 216" fill="${MAG}" stroke="${INK}" stroke-width="3"/>
        <g class="flt" fill="none" stroke="${INK}" stroke-width="3" opacity=".6"><path d="M276 160 q-8 -16 0 -30 q8 -12 0 -26"/><path d="M304 160 q8 -16 0 -30"/></g>${floor(380)}`;
    },
    kaelder3() {
      return `${paper('#e7e3f4')}<g class="mis2"><rect width="393" height="560" fill="url(#u3U)" ${M}/></g>
        <path d="M0 40 H393" stroke="${INK}" stroke-width="3"/>${[60, 160, 260, 340].map(x => `<path d="M${x} 40 V80" stroke="${INK}" stroke-width="2"/><g class="sway2" style="transform-origin:${x}px 80px"><path d="M${x - 14} 80 h28 l-4 40 h-20z" fill="${[MAG, LIME, TAN, ULT][x % 4] || MAG}" stroke="${INK}" stroke-width="2.5" ${M}/></g>`).join('')}
        <path d="M0 70 Q200 90 393 66" fill="none" stroke="${INK}" stroke-width="2"/>${[40, 110, 200, 280, 350].map((x, i) => `<path d="M${x} ${74 + i % 2 * 6} v24 h${14 + i * 2} v-24" fill="${[TAN, MAG, LIME, '#fff', ULT][i]}" stroke="${INK}" stroke-width="2"/>`).join('')}
        <rect x="20" y="200" width="90" height="160" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="65" cy="290" r="30" fill="${SKY}" stroke="${INK}" stroke-width="3"/>
        <path d="M300 380 L330 300 H370 V380" fill="none" stroke="${INK}" stroke-width="3"/>${[0, 1, 2, 3].map(i => `<path d="M${308 + i * 7} ${360 - i * 20} h40" stroke="${INK}" stroke-width="3"/>`).join('')}
        ${floor(380, 'url(#u3U)')}`;
    },
    garage3() {
      return `${paper()}${wall('url(#u3T)', .25)}
        <rect x="30" y="40" width="333" height="190" fill="#fff" stroke="${INK}" stroke-width="4"/>${[70, 110, 150, 190].map(y => `<path d="M30 ${y} H363" stroke="${INK}" stroke-width="2.5"/>`).join('')}
        <g transform="translate(60 260)"><circle cx="40" cy="70" r="36" fill="none" stroke="${INK}" stroke-width="5"/><circle cx="150" cy="70" r="36" fill="none" stroke="${INK}" stroke-width="5"/><path d="M40 70 L80 20 L130 20 L150 70 M80 20 L100 70 L130 20 M70 10 h24" fill="none" stroke="${MAG}" stroke-width="5"/></g>
        <rect x="270" y="300" width="80" height="60" rx="8" fill="${LIME}" stroke="${INK}" stroke-width="3" ${M}/>${floor(380, 'url(#u3U)')}${conf(6, 260, 380, 44)}`;
    },
    loft3() {
      return `${paper('#fff0dd')}<path d="M0 0 L196 -40 L393 0 V560 H0Z" fill="url(#u3M)" opacity=".18" ${M}/>
        <path d="M0 160 L196 20 L393 160" fill="none" stroke="${INK}" stroke-width="6"/><path d="M60 118 L60 400 M330 118 L330 400" stroke="${INK}" stroke-width="5"/>
        <path d="M176 60 h40 v40 h-40z" fill="${SKY}" stroke="${INK}" stroke-width="3"/><g class="glow"><path d="M176 100 L120 380 H290 L216 100Z" fill="#fff6a8" opacity=".35" ${M}/></g>
        ${[[80, 260, 70, 120, MAG], [250, 230, 90, 150, LIME], [150, 300, 60, 80, TAN]].map(([x, y, w, h, c]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" stroke="${INK}" stroke-width="3" ${M} transform="rotate(${(x % 7) - 3} ${x + w / 2} ${y + h / 2})"/>`).join('')}
        <g class="flt">${[[100, 200], [300, 180], [200, 160]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" fill="${INK}" opacity=".5"/>`).join('')}</g>
        ${floor(400, 'url(#u3W)')}${conf(14, 160, 390, 45)}`;
    },
    gade3() {
      const shop = (x, w, c, sign) => `<rect x="${x}" y="150" width="${w}" height="250" fill="#fff" stroke="${INK}" stroke-width="4"/>${Array.from({ length: Math.floor(w / 20) }, (_, i) => `<path d="M${x + i * 20} 150 h20 l-4 30 h-12z" fill="${i % 2 ? c : '#fff'}" stroke="${INK}" stroke-width="2"/>`).join('')}
        <rect x="${x + 14}" y="210" width="${w - 28}" height="110" fill="${SKY}" stroke="${INK}" stroke-width="3"/><text x="${x + w / 2}" y="140" text-anchor="middle" font-family="Rubik Mono One, monospace" font-size="11" fill="${INK}">${sign}</text>`;
      return `${paper(MINT)}<g class="mis2"><rect width="393" height="560" fill="url(#u3S)" opacity=".18" ${M}/></g>
        <path d="M60 0 V60 Q196 120 333 60 V0" fill="#fff" stroke="${INK}" stroke-width="4"/><text x="196" y="44" text-anchor="middle" font-family="Rubik Mono One, monospace" font-size="10" fill="${INK}" opacity=".7">DEROPPE ↑</text>
        ${shop(10, 120, MAG, 'TØJ')}${shop(140, 110, TAN, 'SKO')}${shop(260, 124, ULT, 'FARVER')}
        ${sale(196, 430, -6)}${floor(470, 'url(#u3U)')}${conf(26, 0, 460, 46)}`;
    },
    butik3() {
      const rail = (y) => `<path d="M20 ${y} H373" stroke="${INK}" stroke-width="5"/>${Array.from({ length: 9 }, (_, i) => `<g class="sway2" style="transform-origin:${40 + i * 38}px ${y}px;animation-delay:-${i * .21}s"><path d="M${40 + i * 38} ${y} q-4 -10 4 -12"  fill="none" stroke="${INK}" stroke-width="2"/><path d="M${24 + i * 38} ${y + 6} L${40 + i * 38} ${y + 2} L${56 + i * 38} ${y + 6} L${58 + i * 38} ${y + 80} H${22 + i * 38}Z" fill="${[MAG, LIME, TAN, ULT, '#fff', MAG, TAN, LIME, ULT][i]}" stroke="${INK}" stroke-width="2.5" ${M}/></g>`).join('')}`;
      return `${paper()}${wall('url(#u3M)', .22)}${rail(70)}${rail(200)}
        <rect x="200" y="320" width="173" height="70" fill="${ULT}" stroke="${INK}" stroke-width="4" ${M}/>${sale(110, 340, 8, '−50%')}${floor(400)}${conf(10, 40, 380, 47)}`;
    },
    maler3() {
      return `${paper()}<g class="mis2"><rect width="393" height="560" fill="url(#u3T)" opacity=".25" ${M}/></g>
        ${[MAG, LIME, TAN, ULT, '#e8322f', '#ffd400', '#2fae4f'].map((c, i) => `<path d="M${20 + i * 54} 0 V${120 + (i * 37) % 160} q0 20 12 20 q12 0 12 -20 V0" fill="${c}" opacity=".85" ${M}/>`).join('')}
        ${[60, 150, 240, 320].map((x, i) => `<g transform="translate(${x} 330)"><rect x="-26" y="0" width="52" height="56" rx="6" fill="#fff" stroke="${INK}" stroke-width="3"/><ellipse cx="0" cy="0" rx="26" ry="8" fill="${[MAG, LIME, TAN, ULT][i]}" stroke="${INK}" stroke-width="3"/></g>`).join('')}
        ${floor(400, 'url(#u3S)')}`;
    },
    vindue3() {
      return `${paper()}<rect x="16" y="60" width="361" height="320" fill="${SKY}" stroke="${INK}" stroke-width="6"/><rect x="16" y="60" width="361" height="320" fill="url(#u3U)"/>
        <path d="M60 80 l40 -10 M300 90 l40 -16" stroke="#fff" stroke-width="5"/>${sale(196, 40, 0, 'NYT · GAMMELT')}
        <rect x="16" y="350" width="361" height="30" fill="${MAG}" stroke="${INK}" stroke-width="4" ${M}/>${floor(400)}${conf(14, 80, 360, 48)}`;
    },
    loppe3() {
      return `${paper(PINKL)}<g class="mis2"><rect width="393" height="560" fill="url(#u3L)" opacity=".3" ${M}/></g>
        ${[[20, 260, 160], [210, 280, 170]].map(([x, y, w]) => `<rect x="${x}" y="${y}" width="${w}" height="16" fill="${TAN}" stroke="${INK}" stroke-width="3"/><path d="M${x + 10} ${y + 16} v90 M${x + w - 10} ${y + 16} v90" stroke="${INK}" stroke-width="4"/>`).join('')}
        ${[[40, 230, 'lampe'], [100, 236, 'sko'], [240, 250, 'ur'], [300, 246, 'bog']].map(([x, y], i) => `<rect x="${x}" y="${y}" width="40" height="30" fill="${[ULT, MAG, LIME, '#fff'][i]}" stroke="${INK}" stroke-width="2.5" ${M}/>`).join('')}
        <path d="M0 120 Q100 80 196 120 T393 120" fill="none" stroke="${INK}" stroke-width="2"/>${[30, 90, 150, 210, 270, 330].map((x, i) => `<path d="M${x} ${110 + Math.sin(i) * 10} l12 24 l12 -24z" fill="${[MAG, LIME, TAN, ULT][i % 4]}" stroke="${INK}" stroke-width="1.5"/>`).join('')}
        ${floor(400)}${conf(10, 140, 380, 49)}`;
    },
    /* the map: the house in cross-section, on top of the sale street */
    hus3() {
      const band = (y, h, t, c) => `<rect x="34" y="${y}" width="325" height="${h}" fill="${c}" opacity=".45" ${M}/><path d="M34 ${y + h} H359" stroke="${INK}" stroke-width="2.5"/><text x="40" y="${y + 13}" font-family="Rubik Mono One, monospace" font-size="8" fill="${INK}" opacity=".6">${t}</text>`;
      return `${paper()}<rect width="393" height="560" fill="url(#u3M)" opacity=".18"/>
        <path d="M34 82 L196 4 L359 82Z" fill="${TAN}" opacity=".5" stroke="${INK}" stroke-width="3" ${M}/>
        ${band(82, 70, 'LOFTET', PAPER)}${band(152, 108, '1. SAL', PAPER)}${band(260, 106, 'STUEN', PAPER)}${band(366, 82, 'KÆLDER', '#d9d4ef')}
        <path d="M34 82 V448 M359 82 V448" stroke="${INK}" stroke-width="3"/>
        <g class="mis"><rect x="180" y="82" width="33" height="366" fill="${LIME}" opacity=".4" ${M}/></g><path d="M180 82 V448 M213 82 V448" stroke="${INK}" stroke-width="2" stroke-dasharray="4 4"/>
        <rect x="0" y="452" width="393" height="108" fill="url(#u3S)" opacity=".35" ${M}/><path d="M0 452 H393" stroke="${INK}" stroke-width="4"/>
        <text x="16" y="552" font-family="Rubik Mono One, monospace" font-size="10" fill="${INK}" opacity=".7">UDSALGET ↓ · DEROPPE ↑</text>`;
    },
  };
  Object.keys(S3).forEach(k => { const f = S3[k]; S3[k] = () => `<defs>${D3}</defs>` + f(); });
  Object.assign(SCENES, S3);
  INDOOR.push('gang3', 'sove3', 'bad3', 'stue3', 'koekken3', 'kaelder3', 'garage3', 'loft3', 'butik3', 'maler3', 'vindue3');
  // the times of Deroppe: Åbningstid (as printed), Udsalg (tangerine heat), Lukketid (magenta), Natlager (ultramarine, the lime glows)
  const G3 = ['', `<rect width="393" height="560" fill="${TAN}" opacity=".15" ${M}/>`, `<rect width="393" height="560" fill="${MAG}" opacity=".18" ${M}/>`,
    `<rect width="393" height="560" fill="#141a5c" opacity=".58" ${M}/><rect width="393" height="560" fill="${LIME}" opacity=".07" style="mix-blend-mode:screen"/>`];
  Object.keys(S3).forEach(k => GRADES[k] = G3);
  GRADES.hus3 = ['', G3[1], G3[2], `<rect width="393" height="560" fill="#141a5c" opacity=".35" ${M}/>`];

  /* ---------------- you, dressed: Deroppe prints what you wear onto your plate ---------------- */
  const ink = c => (typeof COLOURS !== 'undefined' && COLOURS[c]) ? COLOURS[c][3] : '#a9a6b8';
  const fillOf = it => it.c === 'stribet' ? 'url(#wS)' : it.c === 'prikket' ? 'url(#wP)' : it.c === 'ternet' ? 'url(#wT)' : ink(it.c);
  const wearDefs = p => { const c = ink(p || 'blaa'); return `<defs><pattern id="wS" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#fff"/><rect width="12" height="6" fill="${c}"/></pattern>
    <pattern id="wP" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#fff"/><circle cx="6" cy="6" r="2.6" fill="${c}"/></pattern>
    <pattern id="wT" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="14" height="14" fill="#fff"/><rect width="7" height="7" fill="${c}" opacity=".8"/><rect x="7" y="7" width="7" height="7" fill="${c}" opacity=".8"/></pattern></defs>`; };
  const self0 = ART.self;
  ART.self = (G, marks, mini) => {
    const w = G.wear || {}; let x = '';
    const it = w.krop, cf = w.frakke;
    if (!Object.keys(w).length) return self0(G, marks, mini);
    x += wearDefs((Object.values(w).find(v => v && v.p) || {}).p);
    if (it && !cf) x += it.k === 'kjole' ? `<path d="M122 124 Q150 114 178 124 L208 312 H92Z" fill="${fillOf(it)}" stroke="${INK}" stroke-width="3"/>`
      : `<path d="M112 128 Q150 116 188 128 L196 250 H104Z" fill="${fillOf(it)}" stroke="${INK}" stroke-width="3"/>${it.k === 'skjorte' ? `<path d="M150 130 V250 M138 130 L150 144 L162 130" fill="none" stroke="${INK}" stroke-width="2"/>` : ''}`;
    if (cf) {
      const wd = { stor: 70, lidt: 58, passer: 50 }[cf.fit || 'stor'], low = { stor: 340, lidt: 330, passer: 318 }[cf.fit || 'stor'];
      x += `<g class="mis"><path d="M${150 - wd + 6} 122 Q150 ${108} ${150 + wd - 6} 122 L${150 + wd + 6} ${low} H${150 - wd - 6}Z" fill="${fillOf(cf)}" ${M} opacity=".55"/></g>
        <path d="M${150 - wd} 120 Q150 104 ${150 + wd} 120 L${150 + wd + 4} ${low - 4} H${150 - wd - 4}Z" fill="${fillOf(cf)}" stroke="${INK}" stroke-width="3.2" opacity=".93"/>
        <path d="M134 118 L150 ${it ? 200 : 150} L166 118" fill="${it ? fillOf(it) : PAPER}" stroke="${INK}" stroke-width="2.6"/>
        ${[170, 220, 270].map(y => `<circle cx="158" cy="${y}" r="4.5" fill="${TAN}" stroke="${INK}" stroke-width="1.5"/>`).join('')}
        ${cf.fit === 'stor' ? `<path d="M${150 - wd} 130 Q${150 - wd - 30} 220 ${150 - wd - 18} 330" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M${150 - wd} 130 Q${150 - wd - 30} 220 ${150 - wd - 18} 330" fill="none" stroke="${ink(cf.c)}" stroke-width="10" stroke-linecap="round"/>
          <path d="M${150 + wd} 130 Q${150 + wd + 30} 220 ${150 + wd + 18} 330" fill="none" stroke="${INK}" stroke-width="16" stroke-linecap="round"/><path d="M${150 + wd} 130 Q${150 + wd + 30} 220 ${150 + wd + 18} 330" fill="none" stroke="${ink(cf.c)}" stroke-width="10" stroke-linecap="round"/>` : ''}
        <rect x="140" y="112" width="20" height="8" fill="#fff" stroke="${INK}" stroke-width="1.5"/>`;
    }
    const h = w.hals;
    if (h) x += h.k === 'slips' ? `<path d="M146 116 h8 l4 12 l-6 60 l-6 -60z" fill="${fillOf(h)}" stroke="${INK}" stroke-width="2.4"/>`
      : `<path d="M116 112 Q150 128 184 112 L186 128 Q150 144 114 128Z" fill="${fillOf(h)}" stroke="${INK}" stroke-width="2.6"/><path d="M168 128 l6 46 l12 -4 l-4 -44" fill="${fillOf(h)}" stroke="${INK}" stroke-width="2.6"/>`;
    const hd = w.hoved;
    if (hd) x += hd.k === 'kasket' ? `<path d="M118 70 Q150 38 182 70Z" fill="${fillOf(hd)}" stroke="${INK}" stroke-width="3"/><path d="M178 68 q30 -2 34 8 h-36z" fill="${fillOf(hd)}" stroke="${INK}" stroke-width="3"/>`
      : `<path d="M114 74 Q150 22 186 74Z" fill="${fillOf(hd)}" stroke="${INK}" stroke-width="3"/><path d="M112 74 H188 V84 H112Z" fill="${fillOf(hd)}" stroke="${INK}" stroke-width="3"/><circle cx="150" cy="30" r="9" fill="${fillOf(hd)}" stroke="${INK}" stroke-width="2.5"/>`;
    const fo = w.fod;
    if (fo) x += fo.k === 'stoevler' ? `<path d="M116 300 v30 h-20 q0 -12 8 -12 v-18z M176 300 v18 q8 0 8 12 h-20 v-30z" fill="${fillOf(fo)}" stroke="${INK}" stroke-width="2.6"/>`
      : `<path d="M100 330 q0 -14 26 -14 h10 v14z M200 330 q0 -14 -26 -14 h-10 v14z" fill="${fillOf(fo)}" stroke="${INK}" stroke-width="2.6"/>`;
    const an = w.ansigt;
    if (an) x += `<g fill="${ink(an.c) === '#ffffff' ? INK : ink(an.c)}" stroke="${INK}" stroke-width="2"><rect x="126" y="96" width="20" height="13" rx="5"/><rect x="154" y="96" width="20" height="13" rx="5"/></g><path d="M146 100 h8" stroke="${INK}" stroke-width="2.5"/>`;
    return self0(G, marks, mini).replace(/<\/svg>$/, x + '</svg>');
  };

  /* ---------------- icons ---------------- */
  const sw = (c, extra = '') => `<rect x="8" y="10" width="32" height="28" rx="4" fill="${c}"/>${extra}<path d="M8 38 L40 38"/>`;
  Object.assign(ART.ICONS, {
    pung: '<path d="M6 16 H38 Q42 16 42 20 V36 Q42 40 38 40 H10 Q6 40 6 36Z"/><path d="M30 24 H42 V32 H30Z"/><circle cx="34" cy="28" r="1.6"/><path d="M10 16 L30 8 L34 16"/>',
    briller: '<circle cx="14" cy="26" r="8"/><circle cx="34" cy="26" r="8"/><path d="M22 26 Q24 22 26 26 M6 24 L2 18 M42 24 L46 18"/>',
    hoeretlf: '<path d="M8 30 V24 Q8 8 24 8 Q40 8 40 24 V30"/><rect x="4" y="28" width="10" height="14" rx="3"/><rect x="34" y="28" width="10" height="14" rx="3"/>',
    paraply: '<path d="M4 24 Q24 2 44 24 Q38 20 34 24 Q29 20 24 24 Q19 20 14 24 Q10 20 4 24Z"/><path d="M24 24 V40 Q24 44 20 44 Q16 44 16 40"/>',
    armbaandsur: '<circle cx="24" cy="24" r="10"/><path d="M24 24 V18 M24 24 L28 26"/><path d="M18 15 L20 4 H28 L30 15 M18 33 L20 44 H28 L30 33"/>',
    mobil: '<rect x="14" y="4" width="20" height="40" rx="4"/><path d="M20 38 H28"/><rect x="18" y="10" width="12" height="22"/>',
    haandkl: '<path d="M8 8 H40 V14 H8Z"/><path d="M12 14 V42 H36 V14"/><path d="M12 32 H36 M12 36 H36"/>',
    tandb: '<path d="M10 40 L34 16"/><rect x="30" y="6" width="10" height="14" rx="2" transform="rotate(45 35 13)"/><path d="M31 8 l3 -3 M35 12 l3 -3 M39 16 l3 -3"/>',
    taske: '<path d="M6 20 H42 V40 H6Z"/><path d="M16 20 Q16 8 24 8 Q32 8 32 20"/><path d="M6 28 H42"/><rect x="21" y="25" width="6" height="6"/>',
    baelte: '<path d="M2 20 H46 V28 H2Z"/><rect x="16" y="16" width="14" height="16" rx="2"/><path d="M23 20 V28"/>',
    dankort: '<rect x="4" y="10" width="40" height="28" rx="4"/><path d="M4 18 H44"/><rect x="10" y="26" width="10" height="6"/><path d="M28 30 H38"/>',
    hjelm: '<path d="M6 32 Q6 10 24 10 Q42 10 42 32Z"/><path d="M14 18 L18 32 M24 12 V32 M34 18 L30 32"/><path d="M10 32 L14 40 H20"/>',
    pas: '<rect x="10" y="4" width="28" height="40" rx="3"/><circle cx="24" cy="20" r="7"/><path d="M17 20 H31 M24 13 Q20 20 24 27 Q28 20 24 13"/><path d="M16 34 H32"/>',
    handske: '<path d="M14 44 V22 Q14 18 17 18 Q20 18 20 22 V12 Q20 8 23 8 Q26 8 26 12 V10 Q26 6 29 6 Q32 6 32 10 V22 Q36 18 38 22 Q40 26 34 34 L30 44Z"/>',
    kamera: '<rect x="4" y="14" width="40" height="26" rx="3"/><path d="M16 14 L20 8 H28 L32 14"/><circle cx="24" cy="27" r="8"/><circle cx="24" cy="27" r="3"/>',
    sofa: '<path d="M8 20 Q8 14 14 14 H34 Q40 14 40 20 V28 H8Z"/><path d="M4 26 Q4 22 8 22 V36 H40 V22 Q44 22 44 26 V38 H4Z"/><path d="M8 38 V42 M40 38 V42"/>',
    gryde: '<path d="M8 20 H40 V36 Q40 42 34 42 H14 Q8 42 8 36Z"/><path d="M4 20 H44 M2 26 H8 M40 26 H46"/><path d="M18 14 q2 -4 0 -8 M30 14 q2 -4 0 -8"/>',
    badekar: '<path d="M4 22 H44 V30 Q44 40 34 40 H14 Q4 40 4 30Z"/><path d="M10 40 L8 44 M38 40 L40 44"/><path d="M10 22 V8 Q10 4 14 4 Q18 4 18 8"/>',
    kaelder: '<path d="M4 8 H44"/><path d="M8 8 V16 H16 V24 H24 V32 H32 V40 H44"/><path d="M30 14 L38 22 M38 14 V22 H30"/>',
    loft: '<path d="M4 28 L24 6 L44 28"/><path d="M8 28 V44 H40 V28"/><rect x="19" y="18" width="10" height="10"/><path d="M24 18 V28 M19 23 H29"/>',
    bil: '<path d="M4 32 V24 L10 14 H34 L42 24 V32Z"/><path d="M12 16 L10 24 H38 L34 16"/><circle cx="14" cy="34" r="5"/><circle cx="34" cy="34" r="5"/>',
    frakke: '<path d="M16 6 H32 L40 12 L44 42 H4 L8 12Z"/><path d="M16 6 L24 18 L32 6 M24 18 V42"/><circle cx="28" cy="26" r="1.6"/><circle cx="28" cy="34" r="1.6"/><path d="M8 12 L4 30 M40 12 L44 30"/>',
    jakke: '<path d="M14 8 H34 L44 16 L40 26 L36 24 V40 H12 V24 L8 26 L4 16Z"/><path d="M24 8 V40"/><path d="M20 8 L24 14 L28 8"/>',
    strik: '<path d="M8 32 Q8 10 24 10 Q40 10 40 32Z"/><path d="M6 32 H42 V40 H6Z"/><circle cx="24" cy="7" r="4"/><path d="M14 18 V30 M24 14 V30 M34 18 V30"/>',
    kasket: '<path d="M6 30 Q6 12 24 12 Q38 12 40 26"/><path d="M6 30 H40 Q46 30 46 34 H26"/><circle cx="24" cy="12" r="2"/>',
    toerkl: '<path d="M6 12 Q24 22 42 12 L42 20 Q24 30 6 20Z"/><path d="M30 24 L32 44 L38 42 L36 22"/><path d="M32 40 h6 M31 36 h6"/>',
    slips: '<path d="M18 4 H30 L28 12 H20Z"/><path d="M20 12 L14 38 L24 46 L34 38 L28 12"/><path d="M17 26 L31 30"/>',
    troeje: '<path d="M16 8 Q24 14 32 8 L44 16 L40 28 L36 26 V42 H12 V26 L8 28 L4 16Z"/><path d="M12 36 H36 M16 8 Q24 18 32 8"/>',
    skjorte: '<path d="M16 6 L24 14 L32 6 L44 14 L40 26 L36 24 V42 H12 V24 L8 26 L4 14Z"/><path d="M24 14 V42"/><path d="M16 6 L20 16 M32 6 L28 16"/><circle cx="24" cy="24" r="1.4"/><circle cx="24" cy="32" r="1.4"/>',
    kjole: '<path d="M18 4 L18 14 Q24 18 30 14 L30 4"/><path d="M18 14 L16 22 L8 44 H40 L32 22 L30 14"/><path d="M16 22 H32"/>',
    bukser: '<path d="M12 6 H36 L40 44 H28 L24 18 L20 44 H8Z"/><path d="M12 12 H36"/>',
    nederdel: '<path d="M14 8 H34 V14 H14Z"/><path d="M14 14 L6 40 H42 L34 14"/><path d="M20 14 L16 40 M28 14 L32 40"/>',
    stoevle: '<path d="M14 4 H28 V30 L42 34 Q44 40 40 42 H14Z"/><path d="M14 36 H42 M14 12 H28"/>',
    solbriller: '<path d="M4 18 H44"/><path d="M6 18 Q6 30 14 30 Q22 30 22 18"/><path d="M26 18 Q26 30 34 30 Q42 30 42 18"/><path d="M8 22 L16 26 M28 22 L36 26"/>',
    sokker: '<path d="M10 4 H22 V24 L28 34 Q30 40 24 42 Q18 44 14 38 L10 30Z"/><path d="M26 4 H38 V24 L44 34 Q46 40 40 42"/><path d="M10 10 H22 M26 10 H38"/>',
    lampe: '<path d="M14 6 H34 L40 22 H8Z"/><path d="M24 22 V42 M16 44 H32"/><path d="M18 26 L14 32 M30 26 L34 32"/>',
    laenestol: '<path d="M12 6 Q24 2 36 6 V26 H12Z"/><path d="M6 20 Q6 16 12 18 V36 H6Z M42 20 Q42 16 36 18 V36 H42Z"/><path d="M12 26 H36 V36 H12Z"/><path d="M8 36 V42 M40 36 V42"/>',
    stol3: '<path d="M14 4 V26 H34 V4"/><path d="M14 12 H34 M14 26 L12 44 M34 26 L36 44 M14 34 H34"/>',
    bord: '<path d="M4 16 H44 V22 H4Z"/><path d="M8 22 V42 M40 22 V42 M8 30 H40"/>',
    kommode: '<rect x="8" y="6" width="32" height="34"/><path d="M8 17 H40 M8 28 H40"/><circle cx="24" cy="12" r="1.8"/><circle cx="24" cy="23" r="1.8"/><circle cx="24" cy="34" r="1.8"/><path d="M10 40 V44 M38 40 V44"/>',
    reol: '<rect x="8" y="4" width="32" height="40"/><path d="M8 16 H40 M8 28 H40"/><path d="M12 16 V8 M16 16 V10 M20 16 V8 M30 28 V20 M34 28 V22 M12 40 L18 32"/>',
    hylde: '<path d="M4 20 H44 M4 34 H44"/><path d="M8 20 L12 26 M40 20 L36 26 M8 34 L12 40 M40 34 L36 40"/><rect x="10" y="10" width="6" height="10"/><circle cx="32" cy="29" r="5"/>',
    gardin: '<path d="M4 6 H44"/><path d="M8 6 Q6 26 10 44 H18 Q20 24 20 6 M40 6 Q42 26 38 44 H30 Q28 24 28 6"/><path d="M18 28 Q24 24 30 28"/>',
    pude: '<path d="M8 12 Q24 6 40 12 Q44 24 40 36 Q24 42 8 36 Q4 24 8 12Z"/><path d="M8 12 L4 8 M40 12 L44 8 M8 36 L4 40 M40 36 L44 40"/><circle cx="24" cy="24" r="2"/>',
    taeppe: '<path d="M4 14 H44 L40 36 H8Z"/><path d="M8 14 L12 36 M16 14 L18 36 M24 14 V36 M32 14 L30 36 M40 14 L36 36"/><path d="M8 36 V42 M16 36 V42 M24 36 V42 M32 36 V42 M40 36 V42"/>',
    skab: '<rect x="8" y="4" width="32" height="38"/><path d="M24 4 V42"/><circle cx="21" cy="24" r="1.6"/><circle cx="27" cy="24" r="1.6"/><path d="M10 42 V46 M38 42 V46"/>',
    f_roed: sw('#e8322f'), f_hvid: sw('#ffffff'), f_sort: sw('#1d1a5e'), f_groen: sw('#2fae4f'), f_gul: sw('#ffd400'), f_blaa: sw('#2b3bd6'), f_graa: sw('#a9a6b8'), f_brun: sw('#9a5b2e'),
    f_orange: sw('#ff8a1f'), f_lyseroed: sw('#ff9ccd'), f_lilla: sw('#9b6fd0'),
    f_stribet: sw('#ffffff', '<path d="M8 16 H40 M8 22 H40 M8 28 H40 M8 34 H40" stroke-width="3"/>'),
    f_prikket: sw('#ffffff', '<g fill="currentColor"><circle cx="16" cy="18" r="2.4"/><circle cx="28" cy="18" r="2.4"/><circle cx="22" cy="26" r="2.4"/><circle cx="34" cy="26" r="2.4"/><circle cx="16" cy="32" r="2.4"/><circle cx="28" cy="32" r="2.4"/></g>'),
    f_ternet: sw('#ffffff', '<path d="M8 19 H40 M8 28 H40 M18 10 V38 M29 10 V38" stroke-width="3.4"/>'),
    hus3: '<path d="M4 22 L24 6 L44 22"/><path d="M8 20 V42 H40 V20"/><path d="M8 30 H40"/><rect x="20" y="32" width="8" height="10"/>',
  });
})();
