/* =========================================================================
   ART — everything drawn in SVG, in three manners:
   · Atlas: creatures as specimen plates, ink line and wash, fine hatching
   · Tempera: interiors like faded frescoes, impossible architecture, cracks
   · Støv: open places in amber dust, monumental, seen from far away
   Creatures never face you. Their eyes go where attention lets them:
   gaze 0 away · 1 a sideways glance · 2 the head half turned · 3 looking at you (rare).
   ========================================================================= */
const ART = (() => {
  let uid = 0;
  const id = p => p + (++uid);
  const INK = '#2b2219';

  const DEFS = `
  <filter id="ink" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="2"/><feDisplacementMap in="SourceGraphic" scale="1.8"/></filter>
  <filter id="wash" x="-15%" y="-15%" width="130%" height="130%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="7"/><feDisplacementMap in="SourceGraphic" scale="12"/><feGaussianBlur stdDeviation="1.4"/></filter>
  <filter id="paint" x="-8%" y="-8%" width="116%" height="116%"><feTurbulence type="fractalNoise" baseFrequency=".014 .05" numOctaves="3" seed="12"/><feDisplacementMap in="SourceGraphic" scale="14"/></filter>
  <filter id="soft" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="5"/><feDisplacementMap in="SourceGraphic" scale="4"/></filter>
  <filter id="b2"><feGaussianBlur stdDeviation="2"/></filter>
  <filter id="b6" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="6"/></filter>
  <filter id="b16" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="16"/></filter>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="1.1" seed="3"/><feColorMatrix type="matrix" values="0 0 0 0 .2 0 0 0 0 .14 0 0 0 0 .08 0 0 0 .16 0"/></filter>
  <filter id="paper"><feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="3" seed="4"/><feColorMatrix values="0 0 0 0 .35 0 0 0 0 .28 0 0 0 0 .18 0 0 0 .22 0"/></filter>
  <filter id="stain"><feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="2" seed="9"/><feColorMatrix values="0 0 0 0 .55 0 0 0 0 .42 0 0 0 0 .25 0 0 0 .9 -.35"/></filter>
  <pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="4" stroke="${INK}" stroke-width=".6"/></pattern>
  <pattern id="hatchL" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)"><line x1="0" y1="0" x2="0" y2="5" stroke="#f2e2b8" stroke-width=".5"/></pattern>
  <pattern id="cells" width="14" height="12" patternUnits="userSpaceOnUse"><path d="M0 6 Q7 -2 14 6 Q7 14 0 6Z" fill="none" stroke="${INK}" stroke-width=".55"/><circle cx="7" cy="6" r="1" fill="${INK}"/></pattern>
  <pattern id="weave" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M0 5 Q2.5 0 5 5 T10 5" fill="none" stroke="#c9a24a" stroke-width=".8"/><path d="M0 10 Q2.5 5 5 10 T10 10" fill="none" stroke="#5a1e1a" stroke-width=".6"/><circle cx="5" cy="2.5" r=".9" fill="#ead6a4"/></pattern>
  <pattern id="script" width="22" height="7" patternUnits="userSpaceOnUse"><path d="M1 4 q2 -3 4 0 t4 0 m3 0 q2 -3 3 0 t3 0 m2 0 q1 -2 2 0" fill="none" stroke="${INK}" stroke-width=".5"/></pattern>
  <pattern id="scale" width="8" height="6" patternUnits="userSpaceOnUse"><path d="M0 6 Q4 0 8 6" fill="none" stroke="${INK}" stroke-width=".5"/></pattern>
  <radialGradient id="glowG"><stop offset="0" stop-color="#f6dc9a"/><stop offset="1" stop-color="#f6dc9a" stop-opacity="0"/></radialGradient>
  <radialGradient id="lampG"><stop offset="0" stop-color="#ffe2a0" stop-opacity=".75"/><stop offset=".4" stop-color="#e0a050" stop-opacity=".25"/><stop offset="1" stop-color="#e0a050" stop-opacity="0"/></radialGradient>`;

  /* ---------------- eyes: the whole game is about where they point ---------------- */
  // (x, y): centre; r: size; away: angle (deg) the eye points when it ignores you; g: gaze level
  function eye(x, y, r, away, g, opt = {}) {
    const lid = opt.lid || '#e9dcc0', iris = opt.iris || '#5a6a4a';
    const a = away * Math.PI / 180;
    if (g >= 3) return `<g><ellipse cx="${x}" cy="${y}" rx="${r * 1.05}" ry="${r}" fill="${lid}" stroke="${INK}" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="${r * .55}" fill="${iris}"/><circle cx="${x}" cy="${y}" r="${r * .3}" fill="#0c0806"/><circle cx="${x - r * .2}" cy="${y - r * .22}" r="${r * .12}" fill="#fff"/></g>`;
    const px = g === 0 ? x + Math.cos(a) * r * .55 : g === 1 ? x - Math.cos(a) * r * .35 : x - Math.cos(a) * r * .15, py = g === 0 ? y + Math.sin(a) * r * .35 : y + r * .2;
    const ry = g === 0 ? r * .55 : g === 1 ? r * .6 : r * .8;
    return `<g><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${ry}" fill="${lid}" stroke="${INK}" stroke-width="1.1"/><circle cx="${px}" cy="${py}" r="${r * .32}" fill="#0c0806"/>${g >= 1 ? `<circle cx="${px - r * .1}" cy="${py - r * .12}" r="${r * .08}" fill="#fff"/>` : ''}<path d="M${x - r} ${y} Q${x} ${y - ry * 1.7} ${x + r} ${y}" fill="none" stroke="${INK}" stroke-width="1"/></g>`;
  }

  /* ---------------- creatures ---------------- */
  const C = {
    /* Tælleren: a specimen on four stilts, long neck, crest of quills; counts, looking up at its sphere */
    taeller(g) {
      const tilt = [0, 0, -38, -62][g];
      return `<g filter="url(#wash)" opacity=".8"><ellipse cx="140" cy="236" rx="78" ry="54" fill="#6f9a8a"/><path d="M196 206 C214 160 228 120 244 96" stroke="#b5545c" stroke-width="22" fill="none" stroke-linecap="round"/></g>
      <g filter="url(#ink)" fill="none" stroke="${INK}" stroke-linecap="round">
        <ellipse cx="140" cy="236" rx="78" ry="54" stroke-width="2"/><ellipse cx="140" cy="238" rx="64" ry="42" fill="url(#cells)" stroke-width=".7"/>
        <path d="M84 270 Q90 280 104 286" stroke-width=".8"/><rect x="98" y="244" width="56" height="34" fill="url(#hatch)" stroke="none" opacity=".45"/>
        <path d="M104 286 L92 324 L100 360" stroke-width="2"/><path d="M130 290 L134 330 L122 360" stroke-width="2"/><path d="M170 288 L186 326 L180 360" stroke-width="2"/><path d="M200 266 L226 316 L240 360" stroke-width="2"/>
        <circle cx="92" cy="324" r="4"/><circle cx="134" cy="330" r="4"/><circle cx="186" cy="326" r="4"/><circle cx="226" cy="316" r="4"/>
        <path d="M66 236 C40 236 26 218 12 224 C2 230 4 248 16 250" stroke-width="1.6"/>
        <path d="M190 204 C206 160 222 122 236 100" stroke-width="2"/><path d="M206 222 C226 170 246 136 258 110" stroke-width="2"/>
      </g>
      <g transform="rotate(${tilt} 246 104)">
        <g filter="url(#wash)" opacity=".8"><path d="M232 98 C238 74 262 66 276 76 C286 86 282 100 266 104 Z" fill="#c98a7a"/></g>
        <g filter="url(#ink)" fill="none" stroke="${INK}" stroke-linecap="round">
          <path d="M232 100 C236 76 262 64 278 76 C290 88 282 104 262 106 C250 107 240 106 232 100Z" stroke-width="2"/>
          <path d="M278 82 q12 -2 14 6" stroke-width="1.4"/>
          ${[[-80, 44], [-100, 46], [-120, 44], [-140, 40], [-160, 36], [-176, 30]].map(([an, l]) => { const ra = an * Math.PI / 180; return `<path d="M246 86 l${Math.cos(ra) * l} ${Math.sin(ra) * l}" stroke-width=".7"/><circle cx="${246 + Math.cos(ra) * l}" cy="${86 + Math.sin(ra) * l}" r="1.8" fill="${INK}"/>`; }).join('')}
        </g>
        ${eye(264, 86, 7, -55, g, { iris: '#6a5a2a' })}
      </g>`;
    },
    /* Samleren: a spiral of shell with many thin arms, each holding something */
    samler(g) {
      const stalks = g === 0 ? [[176, 120, 210, 150], [186, 124, 222, 160]] : g === 1 ? [[176, 120, 210, 150], [186, 124, 172, 92]] : [[176, 120, 150, 86], [186, 124, 180, 84]];
      return `<g filter="url(#wash)" opacity=".85"><circle cx="130" cy="236" r="78" fill="#7f8e62"/><path d="M60 330 Q150 290 250 330 L250 350 Q150 320 60 350Z" fill="#9a7e5a"/></g>
      <g filter="url(#ink)" fill="none" stroke="${INK}" stroke-linecap="round">
        <circle cx="130" cy="236" r="78" stroke-width="2"/>
        <path d="M130 236 m-60 0 a60 60 0 1 1 60 60 a44 44 0 1 1 -44 -44 a30 30 0 1 1 30 30 a18 18 0 1 1 -18 -18 a8 8 0 1 1 8 8" stroke-width="1.2"/>
        <rect x="70" y="176" width="120" height="120" fill="url(#scale)" stroke="none" opacity=".5"/>
        <path d="M54 336 Q150 300 252 336" stroke-width="1.8"/>
        <path d="M200 260 C220 240 214 180 190 128 C186 118 178 116 176 124" stroke-width="2"/>
        ${stalks.map(([x0, y0, x1, y1]) => `<path d="M${x0} ${y0} Q${(x0 + x1) / 2 + 6} ${(y0 + y1) / 2 - 10} ${x1} ${y1}" stroke-width="1.3"/>`).join('')}
        ${[[62, 200, 18, 150], [70, 270, 6, 252], [96, 300, 40, 340], [190, 280, 262, 262], [210, 240, 276, 220], [206, 200, 268, 170], [120, 166, 98, 104], [150, 160, 152, 96]].map(([x0, y0, x1, y1]) => `<path d="M${x0} ${y0} Q${(x0 + x1) / 2} ${(y0 + y1) / 2 - 14} ${x1} ${y1}" stroke-width=".9"/>`).join('')}
        <path d="M18 150 l-6 -8 l4 -4 l6 8z" fill="#e9dcc0" stroke-width=".8"/><circle cx="6" cy="252" r="5" fill="#d8c8a0"/><path d="M40 340 l8 -10 l4 6z" fill="#e9dcc0"/>
        <path d="M262 262 q8 -10 14 0 q-6 8 -14 0z" fill="#e9dcc0"/><path d="M276 220 l10 -2 l0 6z" fill="#d8c8a0"/><circle cx="268" cy="170" r="4" stroke-width="1"/>
        <path d="M98 104 l-4 -10 m4 10 l6 -8" stroke-width="1"/><path d="M148 92 q4 -8 8 0 q-4 8 -8 0z" fill="#efe4cc"/>
      </g>
      ${stalks.map(([, , x1, y1], i) => eye(x1, y1, 7, i === 0 ? 40 : 60, g, { iris: '#7a6a3a' })).join('')}`;
    },
    /* Grundvæversken: long, veiled, in a robe too finely patterned to follow; her mask looks up at the lamp */
    vaever(g) {
      const turn = [0, 0, 1, 2][g];
      const mask = turn === 0 ? `<path d="M136 74 C126 50 136 30 156 28 C172 26 182 38 180 56 C176 72 164 82 150 84Z" fill="#efe4cc" stroke="${INK}" stroke-width="1.2"/>`
        : turn === 1 ? `<path d="M128 78 C120 54 130 32 152 30 C172 30 182 44 178 62 C174 78 160 86 146 86Z" fill="#efe4cc" stroke="${INK}" stroke-width="1.2"/>`
        : `<ellipse cx="152" cy="58" rx="26" ry="32" fill="#efe4cc" stroke="${INK}" stroke-width="1.2"/>`;
      const eyes = turn === 0 ? (g === 0 ? `<path d="M164 46 q6 -4 10 0" fill="none" stroke="${INK}" stroke-width="1.2"/>` : eye(168, 47, 5, -40, 1, { iris: '#3a2a3a' }))
        : turn === 1 ? eye(160, 50, 6, -30, 2, { iris: '#3a2a3a' }) + `<path d="M138 50 q5 -3 10 0" fill="none" stroke="${INK}" stroke-width="1"/>`
        : eye(141, 54, 6, 0, 3, { iris: '#3a2a3a' }) + eye(163, 54, 6, 0, 3, { iris: '#3a2a3a' });
      return `<g filter="url(#soft)">
        <path d="M92 360 C84 280 96 190 118 130 C126 108 140 96 152 96 C166 96 180 108 188 130 C206 190 216 280 210 360Z" fill="#6a2424"/>
        <path d="M104 360 C98 284 108 196 126 144 C134 124 144 116 152 116 C162 116 172 124 180 144 C196 196 204 284 198 360Z" fill="url(#weave)"/>
        <path d="M92 360 C84 280 96 190 118 130" fill="none" stroke="#2a0e0c" stroke-width="3"/>
        <path d="M132 84 C120 60 118 30 146 12 C170 0 196 10 200 30 C186 24 170 28 164 40" fill="#4a3a56"/>
        <path d="M136 92 C112 140 106 220 116 300" fill="none" stroke="#efe4cc" stroke-width="1.2" opacity=".6"/>
        <path d="M168 120 C196 116 222 100 236 76" fill="none" stroke="#efe4cc" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M232 70 l12 -10 l4 6 z" fill="#c9a24a"/>
      </g>
      <g filter="url(#ink)">${mask}${eyes}</g>`;
    },
    /* Ikket: a small round absence on thin legs, with a white rim */
    ikket(g) {
      const hx = g >= 3 ? 150 : g === 2 ? 144 : g === 1 ? 136 : 168, hy = g >= 3 ? 250 : 236;
      return `<ellipse cx="150" cy="352" rx="44" ry="6" fill="#000" opacity=".35" filter="url(#b6)"/>
      <g filter="url(#ink)" fill="none" stroke="${INK}" stroke-linecap="round" stroke-width="1.4">
        <path d="M128 276 L112 316 L104 350"/><path d="M142 282 L140 320 L132 352"/><path d="M160 282 L166 322 L176 352"/><path d="M174 274 L194 314 L204 348"/>
      </g>
      <circle cx="150" cy="248" r="38" fill="#050302"/>
      <circle cx="150" cy="248" r="38" fill="none" stroke="#efe4cc" stroke-width="2" filter="url(#ink)"/>
      <circle cx="150" cy="248" r="44" fill="none" stroke="#efe4cc" stroke-width=".6" stroke-dasharray="2 4" opacity=".7"/>
      <circle cx="${hx}" cy="${hy}" r="${g >= 3 ? 9 : 4}" fill="#f4ecdc"/>${g >= 3 ? `<circle cx="${hx}" cy="${hy}" r="4" fill="#050302"/>` : ''}`;
    },
    /* Den Bagvendte: monumental, seen from behind. If it ever turns: the front of a house */
    bagvendt(g) {
      if (g >= 3) return `<g filter="url(#paint)">
          <path d="M40 360 C30 290 34 220 60 170 C80 132 120 116 150 116 C180 116 220 132 240 170 C266 220 270 290 260 360Z" fill="#2a1a10"/>
          <path d="M70 360 L70 210 L150 150 L230 210 L230 360Z" fill="#4a3220"/>
        </g>
        <g filter="url(#soft)">
          <rect x="96" y="220" width="34" height="40" fill="#f2c870"/><rect x="170" y="220" width="34" height="40" fill="#f2c870"/>
          <circle cx="113" cy="240" r="40" fill="url(#lampG)"/><circle cx="187" cy="240" r="40" fill="url(#lampG)"/>
          <path d="M96 240 h34 M113 220 v40 M170 240 h34 M187 220 v40" stroke="#4a3220" stroke-width="2"/>
          <path d="M134 360 L134 296 Q150 280 166 296 L166 360Z" fill="#120a06"/>
          <path d="M70 210 L150 150 L230 210" fill="none" stroke="#d9a75a" stroke-width="1.4" opacity=".6"/>
        </g>
        <g fill="none" stroke="#1d1008" stroke-width="2" stroke-linecap="round"><path d="M150 118 C152 80 146 52 160 24"/><path d="M152 80 C168 70 176 56 192 52"/><path d="M150 96 C136 80 120 76 108 60"/><path d="M160 24 C170 16 172 6 184 2"/></g>`;
      return `<g filter="url(#paint)">
          <path d="M40 360 C32 300 30 240 50 188 C64 152 98 138 122 142 C134 128 156 126 170 140 C196 150 220 176 236 214 C256 262 262 310 258 360Z" fill="#160c06"/>
          <path d="M120 144 C116 112 128 84 150 70 C164 62 180 64 186 74 C176 82 166 98 162 118 C158 134 148 144 136 146Z" fill="#1d1008"/>
        </g>
        <g fill="none" stroke="#1d1008" stroke-width="2.2" stroke-linecap="round"><path d="M176 70 C182 46 176 26 188 6"/><path d="M180 48 C194 42 202 30 216 28"/><path d="M188 6 C196 0 198 -6 206 -8"/><path d="M168 72 C160 52 146 46 138 30"/><path d="M150 50 C140 48 130 50 122 42"/></g>
        <g fill="none" stroke-linecap="round" filter="url(#paint)">
          <path d="M226 200 C244 260 250 320 244 360" stroke="#d9a75a" stroke-width="1.6" opacity=".55"/>
          <path d="M184 74 C190 70 196 70 200 72" stroke="#e6b86a" stroke-width="1.2" opacity=".7"/>
        </g>
        <g fill="none" stroke="#4a2c16" stroke-width="1.3" opacity=".9" filter="url(#paint)">
          <path d="M70 200 C62 260 58 320 62 360"/><path d="M100 170 C94 240 94 310 98 360"/><path d="M134 160 C134 240 136 310 132 360"/><path d="M168 166 C176 240 178 310 172 360"/><path d="M204 186 C216 250 218 310 210 360"/>
        </g>
        <g fill="#2a1a0e"><circle cx="136" cy="168" r="3.5"/><circle cx="134" cy="186" r="3.5"/><circle cx="133" cy="204" r="3.5"/><circle cx="133" cy="222" r="3.5"/></g>`;
    },
    /* Husfolket: thumb-sized, plaster-coloured, doors in their bellies; they look at each other */
    husfolk(g) {
      const folk = [[70, 300, 1], [110, 290, -1], [150, 304, 1], [196, 292, -1], [236, 306, -1]];
      return folk.map(([x, y, d], i) => {
        const look = g >= 1 && i % 2 === (g >= 2 ? i % 2 : 0) ? (g >= 2 ? 3 : 1) : 0;
        return `<g filter="url(#ink)"><path d="M${x - 16} ${y + 50} C${x - 20} ${y + 10} ${x - 14} ${y - 26} ${x} ${y - 30} C${x + 14} ${y - 26} ${x + 20} ${y + 10} ${x + 16} ${y + 50}Z" fill="#d8ccb4" stroke="${INK}" stroke-width="1.2"/>
          <path d="M${x - 6} ${y + 50} L${x - 6} ${y + 26} Q${x} ${y + 18} ${x + 6} ${y + 26} L${x + 6} ${y + 50}" fill="#4a3220" stroke="${INK}" stroke-width=".8"/><circle cx="${x + 3}" cy="${y + 38}" r="1" fill="#d9a75a"/></g>
          ${look >= 3 ? eye(x, y - 12, 4, 0, 3, { iris: '#3a2a1a' }) : eye(x + d * 3, y - 12, 4, d > 0 ? 0 : 180, look, { iris: '#3a2a1a' })}`;
      }).join('');
    },
    /* Spejlet: an upright pond. It shows someone else, looking somewhere else */
    spejl(g) {
      return `<ellipse cx="150" cy="350" rx="90" ry="10" fill="#000" opacity=".3" filter="url(#b6)"/>
      <g filter="url(#soft)"><ellipse cx="150" cy="200" rx="86" ry="150" fill="#5a6e6a"/><ellipse cx="150" cy="200" rx="78" ry="140" fill="#8aa29a"/></g>
      <g opacity=".55" filter="url(#wash)"><path d="M120 330 C118 250 128 170 150 130 C170 170 180 250 178 330Z" fill="#3a4a46"/><circle cx="${g >= 2 ? 150 : 166}" cy="112" r="20" fill="#3a4a46"/></g>
      <g fill="none" stroke="#e8f0e8" stroke-width=".8" opacity=".6"><path d="M90 160 q60 -10 120 0"/><path d="M84 220 q66 -12 132 0"/><path d="M92 280 q58 -10 116 0"/></g>
      <ellipse cx="150" cy="200" rx="86" ry="150" fill="none" stroke="${INK}" stroke-width="2" filter="url(#ink)"/>
      ${eye(g >= 2 ? 150 : 172, 110, 7, 10, g, { lid: '#c8dad2', iris: '#2a3a36' })}`;
    },
    /* Sluget: a mouth on a long stalk, chewing a word */
    sluget(g) {
      const hx = g >= 2 ? 140 : 168, ang = g >= 2 ? -10 : 18;
      return `<g filter="url(#wash)" opacity=".9"><path d="M120 360 C130 300 116 230 132 170 C140 140 152 120 160 110" stroke="#c98a7a" stroke-width="26" fill="none" stroke-linecap="round"/></g>
      <g filter="url(#ink)" fill="none" stroke="${INK}" stroke-linecap="round">
        <path d="M108 360 C118 300 104 230 120 170 C128 140 140 118 150 106" stroke-width="1.8"/><path d="M134 360 C144 300 130 232 146 174 C152 150 162 130 172 120" stroke-width="1.8"/>
        <path d="M112 300 h22 M114 260 h22 M118 220 h22 M124 180 h22" stroke-width=".6" stroke-dasharray="2 3"/>
      </g>
      <g transform="rotate(${ang} ${hx} 96)">
        <g filter="url(#wash)"><ellipse cx="${hx}" cy="96" rx="46" ry="34" fill="#d9a7a0"/></g>
        <g filter="url(#ink)" stroke="${INK}">
          <ellipse cx="${hx}" cy="96" rx="46" ry="34" fill="none" stroke-width="2"/>
          <path d="M${hx - 38} 100 C${hx - 20} 92 ${hx + 10} 94 ${hx + 40} 104 C${hx + 14} 120 ${hx - 20} 118 ${hx - 38} 100Z" fill="#3a0d1f" stroke-width="1.4"/>
          <path d="M${hx - 26} 104 C${hx - 10} 112 ${hx + 6} 110 ${hx + 22} 106" fill="none" stroke="#b5545c" stroke-width="4" stroke-linecap="round"/>
          <path d="M${hx - 40} 84 q14 -8 30 -4 M${hx - 44} 112 q16 10 40 10 M${hx + 26} 78 q10 4 16 14" fill="none" stroke-width=".8"/>
          <rect x="${hx - 30}" y="70" width="40" height="22" fill="url(#hatch)" stroke="none" opacity=".4"/>
        </g>
        ${eye(hx + 18, 78, 6, -20, g, { iris: '#5a2a2a' })}
      </g>`;
    },
    /* Mølen: a moth the size of a coat, wings shut. The eyespots on its wings do the looking */
    moel(g) {
      const open = [0, 14, 30, 40][g];
      const wing = s => `<path d="M150 150 C${150 + s * (60 + open)} 110 ${150 + s * (110 + open)} 170 ${150 + s * (80 + open)} 300 C${150 + s * 40} 290 ${150 + s * 10} 250 150 230Z" fill="#8a7a64" stroke="${INK}" stroke-width="1.4"/>`;
      return `<circle cx="150" cy="230" r="70" fill="url(#lampG)" opacity="${.5 + g * .1}"/>
        <g filter="url(#ink)">${wing(-1)}${wing(1)}
          <path d="M150 150 C140 170 140 260 150 290 C160 260 160 170 150 150Z" fill="#3a2e22" stroke="${INK}"/>
          <path d="M146 152 q-20 -40 -34 -50 M154 152 q20 -40 34 -50" fill="none" stroke="${INK}" stroke-width="1.2"/>
          <rect x="${150 - 80 - open}" y="190" width="${160 + open * 2}" height="70" fill="url(#hatch)" opacity=".35"/>
        </g>
        ${g >= 1 ? eye(150 - 50 - open * .6, 230, 9, 180, Math.min(3, g), { lid: '#d8c090', iris: '#6a2a1a' }) : ''}${g >= 2 ? eye(150 + 50 + open * .6, 230, 9, 0, g, { lid: '#d8c090', iris: '#6a2a1a' }) : ''}`;
    },
    /* Ungen: small, eager, too many legs; membrane ears; it looks where it thinks you are */
    unge(g) {
      const hx = g >= 2 ? 150 : 176;
      return `<ellipse cx="150" cy="352" rx="70" ry="6" fill="#000" opacity=".3" filter="url(#b6)"/>
      <g filter="url(#wash)" opacity=".8"><path d="M96 330 C92 280 110 236 150 228 C190 236 208 280 204 330Z" fill="#a89aa8"/>
        <path d="M${hx - 20} 196 C${hx - 70} 150 ${hx - 120} 150 ${hx - 140} 176 C${hx - 100} 176 ${hx - 60} 196 ${hx - 26} 214Z" fill="#c98a7a" opacity=".7"/>
        <path d="M${hx + 18} 192 C${hx + 40} 140 ${hx + 70} 120 ${hx + 96} 130 C${hx + 70} 150 ${hx + 50} 180 ${hx + 30} 210Z" fill="#c98a7a" opacity=".7"/></g>
      <g filter="url(#ink)" fill="none" stroke="${INK}" stroke-linecap="round">
        <path d="M96 330 C92 280 110 236 150 228 C190 236 208 280 204 330Z" stroke-width="1.6"/><rect x="104" y="262" width="92" height="60" fill="url(#hatch)" stroke="none" opacity=".35"/>
        <path d="M150 228 C150 214 ${hx - 6} 206 ${hx} 200"/>
        <path d="M${hx - 28} 204 C${hx - 26} 184 ${hx + 26} 180 ${hx + 30} 204 C${hx + 26} 222 ${hx - 26} 224 ${hx - 28} 204Z" fill="#d8ccc4" stroke-width="1.4"/>
        <path d="M${hx - 20} 196 C${hx - 70} 150 ${hx - 120} 150 ${hx - 140} 176 C${hx - 100} 176 ${hx - 60} 196 ${hx - 26} 214" stroke-width="1.2"/>
        <path d="M${hx - 40} 186 l-30 -14 M${hx - 60} 182 l-40 -6 M${hx - 52} 194 l-50 -4" stroke-width=".5"/>
        <path d="M${hx + 18} 192 C${hx + 40} 140 ${hx + 70} 120 ${hx + 96} 130 C${hx + 70} 150 ${hx + 50} 180 ${hx + 30} 210" stroke-width="1.2"/>
        <path d="M${hx + 30} 180 l30 -34 M${hx + 40} 186 l44 -40" stroke-width=".5"/>
        ${[104, 118, 132, 146, 160, 174, 188].map((x, i) => `<path d="M${x} 326 l${(i - 3) * 3} 26" stroke-width="1.1"/>`).join('')}
      </g>
      ${eye(hx - 12, 204, 5, 200, g, { iris: '#4a3a2a' })}${eye(hx + 14, 202, 4, 200, g, { iris: '#4a3a2a' })}`;
    },
  };
  function creature(name, g = 0, plate = false) {
    const body = (C[name] || C.ikket)(g);
    const bg = plate ? `<rect width="300" height="360" fill="#e6dcc3"/><rect width="300" height="360" filter="url(#stain)"/><rect width="300" height="360" filter="url(#paper)"/><rect x="8" y="8" width="284" height="344" fill="none" stroke="${INK}" stroke-width="1"/>` : '';
    return `<svg class="creature-svg ${plate ? 'plate-svg' : ''}" viewBox="0 ${name === 'bagvendt' && !plate ? -20 : 0} 300 ${name === 'bagvendt' && !plate ? 380 : 360}" preserveAspectRatio="xMidYMax meet"><defs>${DEFS}</defs>${bg}${body}</svg>`;
  }

  /* ---------------- you: a plate drawn from what you have said and caught ---------------- */
  function self(G, marks = 0, mini = false) {
    const b = k => G.boons.includes(k);
    let s = `<rect width="300" height="360" fill="#e6dcc3"/><rect width="300" height="360" filter="url(#stain)"/><rect width="300" height="360" filter="url(#paper)"/><rect x="8" y="8" width="284" height="344" fill="none" stroke="${INK}" stroke-width="1"/>`;
    s += `<g filter="url(#wash)" opacity=".55"><path d="M150 60 C200 60 210 120 204 180 C198 250 186 300 150 320 C114 300 102 250 96 180 C90 120 100 60 150 60Z" fill="#b8b4c4"/></g>`;
    s += `<g filter="url(#ink)" fill="none" stroke="${INK}" stroke-width="1.6"><path d="M150 60 C200 60 210 120 204 180 C198 250 186 300 150 320 C114 300 102 250 96 180 C90 120 100 60 150 60Z" stroke-dasharray="${G.flags.Areason ? '0' : '4 4'}"/></g>`;
    if (b('moenster')) s += `<path d="M150 72 C192 74 200 130 196 180 C192 240 182 290 150 308 C118 290 108 240 104 180 C100 130 108 74 150 72Z" fill="url(#script)" opacity=".8"/>`;
    if (b('anker')) s += `<g filter="url(#ink)"><path d="M150 200 L150 250" stroke="${INK}" stroke-width="1"/><path d="M134 250 C130 270 140 284 152 282 C166 280 170 262 162 250Z" fill="#7a7468" stroke="${INK}" stroke-width="1.2"/></g>`;
    if (b('traad')) s += `<g filter="url(#ink)"><path d="M168 150 C210 140 240 160 286 130" fill="none" stroke="#b5545c" stroke-width="1.6"/></g>`;
    if (b('laant')) s += `<g filter="url(#ink)" fill="none" stroke="${INK}" stroke-width="1"><path d="M126 230 L126 196 L150 178 L174 196 L174 230Z"/><rect x="144" y="210" width="12" height="20"/><rect x="132" y="200" width="8" height="8"/><rect x="160" y="200" width="8" height="8"/></g>`;
    if (b('vaev')) s += `<path d="M98 200 q-14 6 -6 18 q10 6 14 -4" fill="none" stroke="#c9a24a" stroke-width="2.4"/>`;
    if (b('doer')) s += `<path d="M232 300 L232 250 Q248 236 264 250 L264 300" fill="none" stroke="${INK}" stroke-width="1.4" filter="url(#ink)"/>`;
    if (b('ikket')) s += `<circle cx="150" cy="128" r="6" fill="#050302"/><circle cx="150" cy="128" r="6" fill="none" stroke="#efe4cc" stroke-width=".8"/>`;
    s += b('blik') ? eye(150, 104, 8, 0, 3, { iris: '#5a4a6a' }) : `<path d="M140 104 q10 -6 20 0" fill="none" stroke="${INK}" stroke-width="1.2"/>`;
    // the marks of the Danish you have caught
    let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    const n = Math.min(60, marks);
    for (let i = 0; i < n; i++) { const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()), x = 150 + Math.cos(a) * r * 44, y = 190 + Math.sin(a) * r * 110; s += `<path d="M${x.toFixed(1)} ${y.toFixed(1)} l${(rnd() * 6 - 3).toFixed(1)} ${(rnd() * 5 + 2).toFixed(1)} m2 -4 l3 3" stroke="#5a1e1a" stroke-width=".9" fill="none"/>`; }
    if (!mini) s += `<g font-family="Georgia,serif" fill="${INK}"><text x="24" y="40" font-size="13" letter-spacing="2">TAV. ?</text><text x="24" y="340" font-size="12" font-style="italic">${G.glimpses.length ? 'spor: ' + G.glimpses.length : 'uden spor'}</text><text x="276" y="340" font-size="12" font-style="italic" text-anchor="end">aftryk: ${marks}</text></g>`;
    return `<svg class="self-svg" viewBox="0 0 300 360"><defs>${DEFS}</defs>${s}</svg>`;
  }

  /* ---------------- scenes (393 × 560, portrait) ---------------- */
  let PH = 1;
  const dust = (n, y0, y1, col = '#f2d8a0', op = .5) => { let s = '', seed = n * 13 + y0; const r = () => (seed = (seed * 9301 + 49297) % 233280) / 233280; for (let i = 0; i < n; i++) s += `<circle cx="${(r() * 393).toFixed(0)}" cy="${(y0 + r() * (y1 - y0)).toFixed(0)}" r="${(r() * 1.6 + .4).toFixed(1)}" fill="${col}" opacity="${(op * (.3 + r() * .7)).toFixed(2)}"/>`; return `<g class="motes">${s}</g>`; };
  const stoevSky = (top, mid, low) => `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset=".55" stop-color="${mid}"/><stop offset=".8" stop-color="${low}"/><stop offset="1" stop-color="#2a1a0e"/></linearGradient></defs><rect width="393" height="560" fill="url(#sky)"/>`;
  const towers = (y, col = '#5a3a20', op = .55) => `<g filter="url(#b2)" opacity="${op}" fill="${col}"><path d="M40 ${y} L50 ${y - 150} Q56 ${y - 170} 62 ${y - 150} L70 ${y}Z"/><path d="M96 ${y} L104 ${y - 90} Q108 ${y - 104} 112 ${y - 90} L118 ${y}Z"/><path d="M262 ${y} L272 ${y - 120} Q278 ${y - 138} 284 ${y - 120} L292 ${y}Z"/><path d="M318 ${y} L324 ${y - 70} Q328 ${y - 80} 332 ${y - 70} L338 ${y}Z"/></g>
    <g class="nite" fill="#f6dc9a"><rect x="54" y="${y - 120}" width="3" height="5"/><rect x="104" y="${y - 60}" width="2" height="4"/><rect x="276" y="${y - 90}" width="3" height="5"/><rect x="326" y="${y - 50}" width="2" height="4"/></g>`;
  const crack = `<g fill="none" stroke="#5a4028" stroke-width=".7" opacity=".6"><path d="M70 0 l6 30 l-8 22 l10 40 l-4 30"/><path d="M76 30 l18 8 l6 20"/><path d="M330 140 l-10 30 l6 26 l-12 40"/><path d="M320 170 l-20 6"/><path d="M360 400 l-30 20 l-10 40 l14 30"/></g>`;
  const fresco = (base = '#d8c29a') => `<rect width="393" height="560" fill="${base}"/><rect width="393" height="560" filter="url(#stain)" opacity=".5"/>`;
  const lamp = (x, y, len = 80) => `<line x1="${x}" y1="0" x2="${x}" y2="${y - 14}" stroke="#3b2a1e" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="110" fill="url(#lampG)" class="flicker"/><g filter="url(#soft)"><path d="M${x - 9} ${y - 14} L${x + 9} ${y - 14} L${x + 6} ${y + 10} L${x - 6} ${y + 10}Z" fill="#e7c46a" stroke="#3b2a1e"/><path d="M${x - 6} ${y + 10} Q${x} ${y + 18} ${x + 6} ${y + 10}" fill="#f8e7b0"/></g>`;

  const SCENES = {
    void() {
      return `${stoevSky('#0c0806', '#3a2412', '#7a4a22')}<circle cx="196" cy="560" r="300" fill="url(#glowG)" opacity=".35"/>
        <g stroke="#c99a52" stroke-width="1" opacity=".35">${Array.from({ length: 22 }, (_, i) => { const x = 20 + (i * 53) % 360; return `<line x1="${x}" y1="${(i * 97) % 500}" x2="${x}" y2="${(i * 97) % 500 + 40 + (i % 5) * 20}"/>`; }).join('')}</g>
        <g fill="#1a0f08" filter="url(#soft)"><path d="M90 160 l14 -4 l2 30 l-14 4z"/><path d="M280 240 q10 -14 20 0 q-10 14 -20 0z"/><circle cx="160" cy="380" r="7"/><path d="M300 90 l4 -16 l4 16z"/><path d="M60 420 q20 -30 30 0"/></g>${dust(60, 0, 560, '#f2d8a0', .6)}`;
    },
    bottom() {
      return `${stoevSky('#2a1a10', '#8a5a2a', '#c99a52')}<circle cx="300" cy="300" r="140" fill="url(#glowG)" opacity=".5"/>${towers(360)}
        <g filter="url(#paint)"><path d="M0 380 Q100 340 200 372 T393 360 V560 H0Z" fill="#7a4e26"/><path d="M0 430 Q120 400 240 430 T393 420 V560 H0Z" fill="#5a3a1c"/></g>
        <g filter="url(#soft)" fill="#e6d2a8" stroke="#2b2219" stroke-width="1"><path d="M60 430 q20 -10 40 0 q-20 6 -40 0z"/><path d="M110 446 l18 -14 l4 4 l-18 14z"/><circle cx="300" cy="440" r="6"/><path d="M250 452 q8 -16 16 0"/><path d="M180 420 l3 -12 l3 12z"/><path d="M330 470 q10 -6 20 0 q-10 6 -20 0z"/><path d="M40 480 l12 -2 l2 8 l-12 2z"/></g>
        <g fill="#2b1a0e" opacity=".6"><path d="M120 120 l3 10 l-3 0z"/><circle cx="240" cy="70" r="2"/><path d="M80 200 l4 -2 l1 6z"/><circle cx="320" cy="160" r="2.5"/></g>${dust(70, 80, 520)}`;
    },
    road() {
      return `${stoevSky('#2a1a10', '#9a6a32', '#c99a52')}${towers(380, '#5a3a20', .4)}
        <g filter="url(#paint)"><path d="M0 400 Q200 370 393 400 V560 H0Z" fill="#6a4422"/></g>
        <path d="M150 560 Q180 470 196 400" fill="none" stroke="#c99a52" stroke-width="30" opacity=".35" filter="url(#b6)"/>
        <g fill="#2b1a0e" opacity=".7"><path d="M60 410 l4 -40 l4 40z"/><path d="M330 420 l3 -30 l3 30z"/></g>${dust(50, 100, 540)}`;
    },
    plain() {
      return `${stoevSky('#2a1a10', '#8a5a2a', '#d4a85e')}<circle cx="300" cy="350" r="120" fill="url(#glowG)" opacity=".6"/>${towers(392, '#5a3a20', .45)}
        <g filter="url(#paint)"><path d="M0 392 Q200 384 393 394 V560 H0Z" fill="#4a2e16"/></g>
        <g stroke="#6a4424" stroke-width="1" opacity=".5"><line x1="0" y1="430" x2="393" y2="426"/><line x1="0" y1="470" x2="393" y2="474"/><line x1="0" y1="520" x2="393" y2="514"/></g>${dust(80, 60, 540)}`;
    },
    stair() {
      return `${fresco('#d8c29a')}
        <g filter="url(#soft)">
          <path d="M0 470 L393 450 L393 560 L0 560Z" fill="#a7744a"/><path d="M0 470 L393 450" stroke="#7a4f30" stroke-width="2"/>
          <path d="M24 470 L24 160 Q24 110 70 110 Q116 110 116 160 L116 468Z" fill="#c4ab80" stroke="#6e5034" stroke-width="1.2"/><path d="M42 470 L42 172 Q42 136 70 136 Q98 136 98 172 L98 469Z" fill="#3e2a22"/>
          <path d="M180 452 L180 420 L210 420 L210 390 L240 390 L240 360 L270 360 L270 330 L300 330 L300 300 L326 300 L326 270 L340 250 L350 220 L356 190 L358 150 L354 110 L346 76 L334 52" fill="none" stroke="#6e5034" stroke-width="3"/>
          <path d="M180 452 L180 420 L210 420 L210 390 L240 390 L240 360 L270 360 L270 330 L300 330 L300 300 L326 300 L326 270 L340 250 L340 452Z" fill="#b89a6e" opacity=".7"/>
          <ellipse cx="330" cy="50" rx="18" ry="8" fill="#2a1a12"/>
          <path d="M140 0 L140 40 Q270 80 393 30 L393 0" fill="#b88a5c" stroke="#6e5034"/>
        </g>
        <line x1="236" y1="40" x2="236" y2="86" stroke="#3b2a1e"/><circle cx="236" cy="100" r="14" fill="#d9b04a" stroke="#6e5034" filter="url(#soft)"/><circle cx="236" cy="100" r="60" fill="url(#glowG)" opacity=".45"/>
        ${crack}<rect width="393" height="560" filter="url(#paper)"/>`;
    },
    nest() {
      return `${fresco('#b8925e')}
        <g filter="url(#soft)"><ellipse cx="196" cy="300" rx="170" ry="230" fill="#8a5e34"/><ellipse cx="196" cy="320" rx="140" ry="190" fill="#5a3a20"/>
          <ellipse cx="196" cy="340" rx="110" ry="140" fill="#3a2414"/><path d="M90 470 Q196 420 300 470 L300 560 L90 560Z" fill="#6a4628"/></g>
        <ellipse cx="196" cy="340" rx="110" ry="140" fill="url(#weave)" opacity=".18"/>
        <g><circle cx="300" cy="190" r="70" fill="url(#lampG)" class="flicker"/><path d="M294 176 h12 v16 h-12z" fill="#e7c46a" filter="url(#soft)"/></g>
        ${crack}<rect width="393" height="560" filter="url(#paper)"/>`;
    },
    hall() { return SCENES.hallBase(false); },
    hall_torn() { return SCENES.hallBase(true); },
    hallBase(torn) {
      const threads = Array.from({ length: 30 }, (_, i) => { const x = 20 + i * 12.5, cut = torn && i % 4 === 1; return `<line x1="${x}" y1="0" x2="${x + (i % 3 - 1) * 4}" y2="${cut ? 180 + (i * 37) % 120 : 460}" stroke="${i % 5 ? '#c9a24a' : '#7d2f2a'}" stroke-width="${i % 3 ? .6 : 1}" opacity=".55"/>`; }).join('');
      return `${fresco('#d2b88a')}
        <g filter="url(#soft)"><path d="M0 0 L0 470 L40 470 L40 150 Q90 60 140 150 L140 470 L250 470 L250 150 Q300 60 350 150 L350 470 L393 470 L393 0Z" fill="#c4ab80" stroke="#6e5034" stroke-width="1.2"/>
          <path d="M0 470 L393 470 L393 560 L0 560Z" fill="url(#weave)"/><path d="M0 470 L393 470 L393 560 L0 560Z" fill="#7a4a2a" opacity=".55"/></g>
        ${threads}${lamp(300, 120)}
        ${torn ? `<g filter="url(#soft)"><ellipse cx="90" cy="500" rx="40" ry="12" fill="#120a06"/><ellipse cx="240" cy="520" rx="56" ry="15" fill="#120a06"/><ellipse cx="340" cy="490" rx="22" ry="7" fill="#120a06"/><ellipse cx="170" cy="485" rx="14" ry="5" fill="#120a06"/></g>` : ''}
        ${crack}<rect width="393" height="560" filter="url(#paper)"/>`;
    },
    ponds() {
      return `${stoevSky('#3a2814', '#9a7a4a', '#c8a868')}${towers(330, '#5a4a30', .35)}
        <g filter="url(#paint)"><path d="M0 330 Q200 316 393 330 V560 H0Z" fill="#6a5634"/></g>
        <g filter="url(#soft)"><ellipse cx="70" cy="440" rx="66" ry="22" fill="#7e9a7a"/><ellipse cx="196" cy="470" rx="70" ry="24" fill="#4e5a62"/><ellipse cx="324" cy="440" rx="62" ry="22" fill="#6a4a72"/>
          <ellipse cx="70" cy="440" rx="66" ry="22" fill="none" stroke="#2b2219" stroke-width="1.2"/><ellipse cx="196" cy="470" rx="70" ry="24" fill="none" stroke="#2b2219" stroke-width="1.2"/><ellipse cx="324" cy="440" rx="62" ry="22" fill="none" stroke="#2b2219" stroke-width="1.2"/></g>
        <g fill="none" stroke="#e8f0e8" stroke-width=".7" opacity=".5"><path d="M30 436 q40 -6 80 0"/><path d="M150 466 l12 0 m8 0 l12 0 m8 0 l12 0"/><path d="M290 436 q10 -10 20 0 q10 10 20 0 q10 -10 20 0"/></g>${dust(40, 80, 400)}`;
    },
    market() {
      const stall = (x, y, h, c) => `<g filter="url(#soft)"><path d="M${x} ${y} L${x} ${y - h} M${x + 70} ${y} L${x + 70} ${y - h}" stroke="#e6d2a8" stroke-width="4"/><path d="M${x - 8} ${y - h} Q${x + 35} ${y - h - 24} ${x + 78} ${y - h} L${x + 70} ${y - h + 30} Q${x + 35} ${y - h + 14} ${x} ${y - h + 30}Z" fill="${c}" opacity=".85"/>
        <g fill="#3a1a12"><ellipse cx="${x + 18}" cy="${y - h + 50}" rx="6" ry="10"/><ellipse cx="${x + 38}" cy="${y - h + 56}" rx="5" ry="12"/><ellipse cx="${x + 56}" cy="${y - h + 48}" rx="6" ry="9"/></g></g>`;
      return `${stoevSky('#2a1a10', '#8a4a2a', '#c98a52')}${towers(380, '#5a3a20', .35)}
        <g filter="url(#paint)"><path d="M0 400 Q200 384 393 404 V560 H0Z" fill="#5a3a1c"/></g>
        ${stall(20, 420, 150, '#9a5a4a')}${stall(290, 430, 130, '#7a6a4a')}${stall(150, 400, 110, '#6a4a5a')}${dust(60, 80, 520)}`;
    },
    map() {
      return `<rect width="393" height="560" fill="#e2d2ae"/><rect width="393" height="560" filter="url(#stain)"/>
        <g fill="none" stroke="#7a5a3a" stroke-width=".6" opacity=".55">${[60, 100, 140, 180, 220].map(r => `<ellipse cx="196" cy="280" rx="${r * 1.2}" ry="${r * 1.5}"/>`).join('')}</g>
        <g filter="url(#soft)"><ellipse cx="173" cy="448" rx="40" ry="14" fill="#7e9a7a" opacity=".6"/><ellipse cx="290" cy="134" rx="80" ry="40" fill="#c99a52" opacity=".35"/><path d="M60 180 L60 220 M100 180 L100 220 M70 170 Q80 160 90 170" stroke="#6e5034" stroke-width="2" fill="none"/></g>
        <g fill="#2b2219" font-family="Georgia,serif" font-size="11" font-style="italic" opacity=".7"><text x="20" y="540">hic sunt nulla</text></g>
        <rect width="393" height="560" filter="url(#paper)"/>`;
    },
    title() { return SCENES.plain() + `<g filter="url(#paint)" opacity=".9"><path d="M150 400 C146 330 150 280 170 250 C180 236 196 232 206 240 C220 250 226 300 222 400Z" fill="#160c06"/></g><g fill="none" stroke="#160c06" stroke-width="1.8"><path d="M196 238 C200 210 196 190 206 170"/><path d="M200 210 C212 204 218 196 228 194"/></g>`; },
  };

  // light phases: Hvidt (bleached), Gult (amber, as drawn), Rødt (rust), Mørke (dark)
  const FIXED = { void: 3, map: 1, title: 1 };
  const INDOOR = ['nest', 'hall', 'hall_torn', 'stair'];
  const GRADE = [
    '<rect width="393" height="560" fill="#f4f0e2" opacity=".28" style="mix-blend-mode:screen"/><rect width="393" height="560" fill="#9aa0a0" opacity=".12" style="mix-blend-mode:saturation"/>',
    '',
    '<rect width="393" height="560" fill="#b8402a" opacity=".32" style="mix-blend-mode:multiply"/><rect width="393" height="560" fill="#ff8a4a" opacity=".08" style="mix-blend-mode:screen"/>',
    '<rect width="393" height="560" fill="#0c0806" opacity=".66"/><rect width="393" height="560" fill="#3a2a5a" opacity=".22" style="mix-blend-mode:screen"/>',
  ];
  const GRADE_IN = ['<rect width="393" height="560" fill="#f4f0e2" opacity=".12" style="mix-blend-mode:screen"/>', '', '<rect width="393" height="560" fill="#b8402a" opacity=".16" style="mix-blend-mode:multiply"/>', '<rect width="393" height="560" fill="#0c0806" opacity=".45"/>'];
  function scene(name, ph = 1) {
    PH = FIXED[name] !== undefined ? FIXED[name] : ph;
    const body = (SCENES[name] || SCENES.bottom)();
    const out = !INDOOR.includes(name);
    const grade = name === 'map' || name === 'void' ? (name === 'map' ? ['<rect width="393" height="560" fill="#fff" opacity=".1"/>', '', '<rect width="393" height="560" fill="#b8402a" opacity=".15" style="mix-blend-mode:multiply"/>', '<rect width="393" height="560" fill="#0c0806" opacity=".45"/>'][ph] : '') : (out ? GRADE : GRADE_IN)[PH];
    return `<svg class="scene-svg ph${PH} ${out ? 'out' : 'in'}" viewBox="0 0 393 560" preserveAspectRatio="xMidYMin slice"><defs>${DEFS}</defs>${body}${grade}<rect width="393" height="560" filter="url(#grain)"/></svg>`;
  }

  function d20(n, cls = '') {
    return `<svg class="d20 ${cls}" viewBox="0 0 54 58"><path d="M27 2 L51 15 L51 43 L27 56 L3 43 L3 15Z" fill="#1e140c" stroke="#d8a952" stroke-width="1.6"/><path d="M27 2 L27 18 M3 15 L15 24 M51 15 L39 24 M15 24 L39 24 L27 44Z M27 44 V56 M15 24 L3 43 M39 24 L51 43" stroke="#7a5f2e" stroke-width="1" fill="none"/><text x="27" y="36" text-anchor="middle" font-family="Georgia,serif" font-size="13" fill="#f0d898">${n}</text></svg>`;
  }

  /* ---------------- icons (48×48 ink line) ---------------- */
  const I = {
    fjer: '<path d="M14 40 C18 26 26 12 38 8 C38 20 30 32 18 36 Z"/><path d="M14 40 L30 18"/>',
    knogle: '<path d="M14 18 a4 4 0 1 1 4 -6 l12 12 a4 4 0 1 1 6 4 a4 4 0 1 1 -4 6 l-12 -12 a4 4 0 1 1 -6 -4z"/>',
    tand: '<path d="M14 12 C14 8 22 8 24 12 C26 8 34 8 34 12 C34 22 32 26 30 38 C28 40 27 32 24 28 C21 32 20 40 18 38 C16 26 14 22 14 12Z"/>',
    oeje: '<path d="M6 24 Q24 8 42 24 Q24 40 6 24Z"/><circle cx="24" cy="24" r="6"/><circle cx="24" cy="24" r="2" fill="currentColor"/>',
    skal: '<path d="M8 32 Q24 4 40 32 Z"/><path d="M24 12 L24 32 M16 18 L20 32 M32 18 L28 32"/>',
    traad: '<path d="M6 30 C14 10 22 40 30 20 C34 12 40 16 42 22"/><circle cx="12" cy="36" r="4"/>',
    sten: '<path d="M8 32 C8 22 16 14 26 14 C36 14 42 22 40 30 C38 38 28 40 20 40 C12 40 8 38 8 32Z"/>',
    klokke: '<path d="M14 34 C14 20 18 12 24 12 C30 12 34 20 34 34 Z"/><path d="M10 34 H38"/><circle cx="24" cy="38" r="2.5"/><path d="M24 12 V8"/>',
    noegle: '<circle cx="14" cy="24" r="7"/><path d="M21 24 H42 M36 24 V31 M41 24 V29"/>',
    spejl: '<ellipse cx="24" cy="20" rx="12" ry="14"/><path d="M24 34 V44 M18 44 H30"/><path d="M18 14 Q20 10 24 10" />',
    lygte: '<path d="M18 14 H30 L32 36 H16 Z"/><path d="M20 14 V10 H28 V14 M14 36 H34"/><path d="M24 20 Q20 26 24 30 Q28 26 24 20Z"/>',
    aeg: '<path d="M24 8 C14 8 10 22 10 30 C10 38 16 42 24 42 C32 42 38 38 38 30 C38 22 34 8 24 8Z"/>',
    ring: '<circle cx="24" cy="28" r="12"/><path d="M18 16 L24 8 L30 16"/>',
    hjerte: '<path d="M24 40 C10 30 6 22 10 14 C14 8 22 10 24 16 C26 10 34 8 38 14 C42 22 38 30 24 40Z"/><path d="M24 16 V10 M20 10 H28"/>',
    haand: '<path d="M16 40 L12 24 Q12 20 16 22 L18 28 L18 10 Q20 6 22 10 L22 24 L22 8 Q24 4 26 8 L26 24 L26 10 Q28 6 30 10 L30 26 L32 18 Q36 16 34 22 L32 32 Q30 40 24 42 Z"/>',
    timeglas: '<path d="M14 8 H34 M14 40 H34 M16 8 C16 18 32 22 32 24 C32 26 16 30 16 40 M32 8 C32 18 16 22 16 24 C16 26 32 30 32 40"/>',
    grod: '<path d="M8 22 H40 C40 34 32 40 24 40 C16 40 8 34 8 22Z"/><path d="M18 16 Q20 12 18 8 M26 16 Q28 12 26 8"/>',
    bog: '<path d="M8 10 H22 Q24 10 24 12 V40 Q24 38 22 38 H8Z M40 10 H26 Q24 10 24 12 V40 Q24 38 26 38 H40Z"/>',
    medicin: '<rect x="14" y="14" width="20" height="26" rx="3"/><path d="M18 8 H30 V14 H18Z M24 20 V34 M17 27 H31"/>',
    hus: '<path d="M8 22 L24 8 L40 22 V40 H8Z"/><path d="M20 40 V28 H28 V40"/>',
    tandhjul: '<circle cx="24" cy="24" r="8"/><path d="M24 6 V12 M24 36 V42 M6 24 H12 M36 24 H42 M11 11 L15 15 M33 33 L37 37 M11 37 L15 33 M33 15 L37 11"/>',
    pen: '<path d="M10 38 L14 26 L32 8 L40 16 L22 34 Z"/><path d="M14 26 L22 34"/>',
    blad: '<path d="M10 38 C10 20 22 10 40 8 C38 26 28 38 10 38Z"/><path d="M10 38 L30 18"/>',
    skael: '<path d="M10 30 Q24 6 38 30 Q24 40 10 30Z"/><path d="M16 28 Q24 14 32 28"/>',
    trappe: '<path d="M6 40 V34 H14 V28 H22 V22 H30 V16 H38 V10 Q44 10 40 18"/>',
    gren: '<path d="M24 44 V20 M24 30 L14 18 M24 24 L34 12 M14 18 L10 10 M14 18 L20 10 M34 12 L38 6"/>',
  };
  function icon(name, cls = '') {
    return `<svg class="ico ${cls}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">${I[name] || '<circle cx="24" cy="24" r="16"/>'}</svg>`;
  }
  return { creature, self, scene, d20, icon, ICONS: I };
})();
