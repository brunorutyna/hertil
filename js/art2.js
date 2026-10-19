/* =========================================================================
   ART · Kapitel 2 — Derhenne, in Natskift: the same risograph zine, new inks
   (teal, signal red, mustard, lilac on cream), off-register, halftone, jittering.
   Derhenne is a building that never finished being built; its creatures are what they do.
   Eyes are never plain: a floor dial, a label window, a window frame, a compass needle,
   dial holes, a ring drawn round a date, a scanning light. Some have no eyes at all.
   Gaze g: 0 busy elsewhere · 1 a glance · 2 half turned · 3 looking at you (rare).
   ========================================================================= */
(() => {
  const { C, SCENES, INDOOR, GRADES, slit, M } = ART;
  const INK = '#1d1a5e', PAPER = '#fff4dc', TEAL = '#00838a', RED = '#ff3b30', MUS = '#ffb511', LIL = '#b28dd6', PINE = '#2e9e5b', ORG = '#ff7a1a', SKY = '#bfe7e4';
  const D2 = `<pattern id="n2T" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="1.7" fill="${TEAL}"/></pattern>
    <pattern id="n2R" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="3.5" cy="3.5" r="1.6" fill="${RED}"/></pattern>
    <pattern id="n2M" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.7" fill="${MUS}"/></pattern>
    <pattern id="n2L" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="${LIL}" stroke-width="2.4"/></pattern>
    <pattern id="n2G" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M14 0H0V14" fill="none" stroke="${TEAL}" stroke-width="1" opacity=".5"/></pattern>
    <pattern id="n2B" width="20" height="10" patternUnits="userSpaceOnUse"><rect width="20" height="10" fill="${RED}"/><path d="M0 9.5H20M10 0V5M0 5H20M0 0V5" stroke="${PAPER}" stroke-width="1.4"/></pattern>
    <pattern id="n2C" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="${LIL}"/><rect x="8" y="8" width="8" height="8" fill="${LIL}"/></pattern>`;
  const defs = s => `<defs>${D2}</defs>${s}`;
  const sh = (cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx * .12}" fill="${TEAL}" opacity=".35" ${M}/>`;
  // a dial eye: a half moon with a needle. Away: hard over to one side. At you: straight up, with a red tip
  const dial = (x, y, r, g) => { const a = [-70, -48, -22, 0][g]; return `<path d="M${x - r} ${y} A${r} ${r} 0 0 1 ${x + r} ${y}Z" fill="#fff" stroke="${INK}" stroke-width="3"/>
    ${[-60, -30, 0, 30, 60].map(t => `<path d="M${x} ${y - r + 2} V${y - r + 7}" stroke="${INK}" stroke-width="2" transform="rotate(${t} ${x} ${y})"/>`).join('')}
    <g transform="rotate(${a} ${x} ${y})"><path d="M${x} ${y} V${y - r + 5}" stroke="${g >= 3 ? RED : INK}" stroke-width="3.4" stroke-linecap="round"/></g><circle cx="${x}" cy="${y}" r="4" fill="${INK}"/>`; };

  Object.assign(C, {
    /* Elevatoren: a lift cage hanging from its cable. A folding gate for a mouth, the floor dial is its eye */
    elevator(g) {
      return defs(`${sh(150, 352, 70)}
      <g class="flt">
        <path d="M150 0 V64" stroke="${INK}" stroke-width="5"/><path d="M138 0 V60 M162 0 V60" stroke="${INK}" stroke-width="2" stroke-dasharray="3 5"/>
        ${dial(150, 104, 40, g)}
        <g class="mis"><rect x="80" y="112" width="140" height="210" fill="${TEAL}" ${M}/></g>
        <g class="mis2"><rect x="88" y="118" width="130" height="200" fill="url(#n2M)" ${M}/></g>
        <rect x="80" y="112" width="140" height="210" fill="none" stroke="${INK}" stroke-width="4"/>
        <g class="chew" style="transform-origin:150px 220px"><path d="M92 136 L116 300 L140 136 L164 300 L188 136 L208 300" fill="none" stroke="${INK}" stroke-width="3"/></g>
        <path d="M80 322 h140" stroke="${INK}" stroke-width="7"/>
        <g class="sway"><path d="M80 170 q-36 10 -40 60" fill="none" stroke="${INK}" stroke-width="4"/><circle cx="40" cy="234" r="9" fill="${RED}" stroke="${INK}" stroke-width="3"/></g>
        <g class="sway2"><path d="M220 170 q36 10 40 60" fill="none" stroke="${INK}" stroke-width="4"/><rect x="250" y="228" width="20" height="26" rx="3" fill="${MUS}" stroke="${INK}" stroke-width="3"/><circle cx="260" cy="236" r="3" fill="${INK}"/><circle cx="260" cy="246" r="3" fill="${INK}"/></g>
      </g>`);
    },
    /* Stemplet: a rubber stamp on a spring. No eyes: it has a face only when it stamps */
    stempel(g) {
      const tilt = [-24, -14, -5, 0][g];
      return defs(`${sh(150, 352, 90)}
      <rect x="62" y="328" width="176" height="22" rx="4" fill="${INK}"/><rect x="70" y="330" width="160" height="10" fill="${RED}" ${M}/>
      <g class="hop"><g transform="rotate(${tilt} 150 300)">
        <path d="M150 300 ${Array.from({ length: 7 }, (_, i) => `l${i % 2 ? -34 : 34} -12`).join(' ')}" fill="none" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>
        <g class="mis"><rect x="96" y="150" width="108" height="78" rx="6" fill="${MUS}" ${M}/></g>
        <rect x="96" y="150" width="108" height="78" rx="6" fill="url(#n2T)" stroke="${INK}" stroke-width="4"/>
        <path d="M134 150 V110 M166 150 V110" stroke="${INK}" stroke-width="5"/>
        <g class="mis2"><circle cx="150" cy="84" r="34" fill="${RED}" ${M}/></g><circle cx="150" cy="84" r="34" fill="none" stroke="${INK}" stroke-width="4"/>
        <rect x="90" y="228" width="120" height="16" fill="${INK}"/>
        ${g >= 2 ? `<g fill="${RED}" font-family="Rubik Mono One, monospace" font-size="14"><text x="150" y="200" text-anchor="middle">SET</text></g>` : ''}
        ${g >= 3 ? `<path d="M128 214 q22 14 44 0" fill="none" stroke="${RED}" stroke-width="4"/>` : ''}
      </g></g>`);
    },
    /* Kranen: a construction crane that is also a crane. Lattice legs, a long jib, a hook on a cable. A slit in the cab */
    kran(g) {
      const lat = (x1, y1, x2, y2, n) => { let s = ''; for (let i = 0; i < n; i++) { const t0 = i / n, t1 = (i + 1) / n, ax = x1 + (x2 - x1) * t0, ay = y1 + (y2 - y1) * t0, bx = x1 + (x2 - x1) * t1, by = y1 + (y2 - y1) * t1; s += `<path d="M${ax - 8} ${ay} L${bx + 8} ${by} M${ax + 8} ${ay} L${bx - 8} ${by}"/>`; } return s; };
      return defs(`${sh(150, 352, 90)}
      <g class="sway" style="transform-origin:150px 350px">
        <g stroke="${INK}" stroke-width="3" fill="none"><path d="M118 352 L136 196 M182 352 L164 196"/>${lat(127, 340, 150, 200, 6)}</g>
        <path d="M110 352 h20 M170 352 h20" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
        <g class="mis"><rect x="120" y="150" width="70" height="56" fill="${MUS}" ${M}/></g>
        <rect x="120" y="150" width="70" height="56" fill="url(#n2R)" stroke="${INK}" stroke-width="4"/>
        ${slit(162, 176, 16, g, -12)}
        <g stroke="${INK}" stroke-width="3" fill="none"><path d="M20 140 H290 M20 128 H290"/>${Array.from({ length: 18 }, (_, i) => `<path d="M${20 + i * 15} 140 L${27 + i * 15} 128 L${35 + i * 15} 140"/>`).join('')}</g>
        <path d="M150 128 L150 92 L250 128" fill="none" stroke="${INK}" stroke-width="3"/>
        <rect x="16" y="120" width="30" height="34" fill="${TEAL}" stroke="${INK}" stroke-width="3"/>
        <g class="swing" style="transform-origin:262px 140px"><path d="M262 140 V250" stroke="${INK}" stroke-width="2.5"/><path d="M262 250 q0 18 -14 18 q-12 0 -12 -12" fill="none" stroke="${RED}" stroke-width="6" stroke-linecap="round"/></g>
      </g>`);
    },
    /* Arkivet: a filing cabinet on bird legs. Its eye is the label window on the middle drawer; the slider is the pupil */
    arkiv(g) {
      const px = [12, 7, 2, 0][g];
      return defs(`${sh(150, 352, 70)}
      <g class="hop">
        <path d="M134 290 l-12 58 M166 290 l12 58 M108 350 h28 M164 350 h28" stroke="${INK}" stroke-width="5" fill="none" stroke-linecap="round"/>
        <g class="mis"><rect x="86" y="70" width="128" height="222" fill="${LIL}" ${M}/></g>
        <rect x="92" y="76" width="120" height="216" fill="url(#n2T)" ${M}/>
        <rect x="86" y="70" width="128" height="222" fill="none" stroke="${INK}" stroke-width="4"/>
        ${[0, 1, 2].map(k => `<rect x="98" y="${82 + k * 70}" width="104" height="60" fill="${k === 1 ? RED : PAPER}" stroke="${INK}" stroke-width="3" ${k === 1 ? M : ''}/>`).join('')}
        <rect x="118" y="160" width="64" height="22" fill="#fff" stroke="${INK}" stroke-width="3"/>
        <rect x="${144 + px}" y="162" width="12" height="18" fill="${INK}"/>${g >= 3 ? `<rect x="146" y="164" width="4" height="5" fill="#fff"/>` : ''}
        <path d="M136 120 h28 M136 260 h28" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
        <g class="flt">${[[60, 60, -14], [236, 90, 18], [44, 170, 8]].map(([x, y, r]) => `<rect x="${x}" y="${y}" width="26" height="32" fill="#fff" stroke="${INK}" stroke-width="2.5" transform="rotate(${r} ${x + 13} ${y + 16})"/><path d="M${x + 5} ${y + 10} h16 M${x + 5} ${y + 17} h12" stroke="${TEAL}" stroke-width="2" transform="rotate(${r} ${x + 13} ${y + 16})"/>`).join('')}</g>
      </g>`);
    },
    /* Halvdelen: half a wall, half scaffolding, frozen while it is "ved at blive færdig". Its eye is an empty window frame */
    halv(g) { return C.halvBase(g, 'half'); },
    helt(g) { return C.halvBase(g, 'whole'); },
    have(g) { return C.halvBase(g, 'garden'); },
    halvBase(g, mode) {
      const lit = [1, 2, 3, 4][g];
      const panes = [[118, 150], [140, 150], [118, 172], [140, 172]].map(([x, y], i) => `<rect x="${x}" y="${y}" width="20" height="20" fill="${i < lit ? MUS : INK}" stroke="${INK}" stroke-width="2"/>`).join('');
      const right = mode === 'half' ? `<g stroke="${TEAL}" stroke-width="4" fill="none"><path d="M168 340 V60 M226 340 V90 M168 120 H226 M168 200 H226 M168 280 H226 M168 120 L226 200 M226 200 L168 280"/></g>
          <g class="flt" style="animation-duration:6s">${[[196, 40, 18], [230, 64, -10], [180, 20, 30]].map(([x, y, r]) => `<rect x="${x}" y="${y}" width="26" height="13" fill="url(#n2B)" stroke="${INK}" stroke-width="2" transform="rotate(${r} ${x} ${y})"/>`).join('')}</g>`
        : mode === 'whole' ? `<g class="mis2"><rect x="168" y="60" width="60" height="282" fill="${RED}" ${M}/></g><rect x="168" y="60" width="60" height="282" fill="url(#n2B)" stroke="${INK}" stroke-width="4"/>
          <path d="M60 60 L150 18 L240 60Z" fill="${MUS}" stroke="${INK}" stroke-width="4"/>`
        : `<g class="sway">${Array.from({ length: 9 }, (_, i) => `<path d="M${172 + i * 7} 340 q${i % 2 ? 10 : -10} -${90 + (i * 23) % 80} ${i % 3 * 4} -${150 + (i * 31) % 90}" fill="none" stroke="${PINE}" stroke-width="4"/>`).join('')}</g>
          ${[[180, 150, RED], [214, 110, MUS], [196, 200, LIL], [228, 180, RED], [176, 90, MUS]].map(([x, y, c]) => `<g class="spin" style="transform-origin:${x}px ${y}px">${[0, 1, 2, 3, 4].map(k => `<ellipse cx="${x}" cy="${y - 8}" rx="5" ry="9" fill="${c}" stroke="${INK}" stroke-width="1.5" transform="rotate(${k * 72} ${x} ${y})"/>`).join('')}</g><circle cx="${x}" cy="${y}" r="5" fill="${MUS}" stroke="${INK}" stroke-width="2"/>`).join('')}`;
      return defs(`${sh(150, 352, 110)}
      <g class="wob">
        <g class="mis"><rect x="66" y="60" width="104" height="282" fill="${RED}" ${M}/></g>
        <rect x="66" y="60" width="104" height="282" fill="url(#n2B)" stroke="${INK}" stroke-width="4"/>
        <rect x="112" y="144" width="54" height="54" fill="#fff" stroke="${INK}" stroke-width="4"/>${panes}
        ${right}
        <path d="M60 342 H240" stroke="${INK}" stroke-width="6"/>
      </g>`);
    },
    /* Kantinen: a soup pot on stove legs, ladles for arms. Only a mouth: the pot itself */
    kantine(g) {
      const lid = [-22, -14, -6, 0][g];
      return defs(`${sh(150, 352, 110)}
      <g class="wob">
        <path d="M86 300 l-10 48 M214 300 l10 48 M120 304 l-4 44 M180 304 l4 44" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
        <g class="mis"><path d="M54 150 H246 L232 300 Q150 324 68 300Z" fill="${TEAL}" ${M}/></g>
        <path d="M60 156 H240 L228 296 Q150 318 72 296Z" fill="url(#n2M)" stroke="${INK}" stroke-width="4"/>
        <ellipse cx="150" cy="152" rx="96" ry="22" fill="${INK}"/><ellipse cx="150" cy="156" rx="80" ry="14" fill="${ORG}"/>
        <g class="chew" style="transform-origin:150px 156px">${[[120, 156], [150, 160], [178, 154]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="${MUS}" stroke="${INK}" stroke-width="2"/>`).join('')}</g>
        <g transform="rotate(${lid} 60 140)"><path d="M56 140 Q150 100 244 140Z" fill="${RED}" stroke="${INK}" stroke-width="4"/><circle cx="150" cy="112" r="10" fill="${MUS}" stroke="${INK}" stroke-width="3"/></g>
        <g class="flt" fill="none" stroke="${INK}" stroke-width="3" opacity=".7"><path d="M120 96 q-10 -16 0 -30 q10 -14 0 -28"/><path d="M180 92 q10 -16 0 -30 q-10 -14 0 -28"/></g>
        <g class="sway"><path d="M60 200 q-40 -10 -40 -60" fill="none" stroke="${INK}" stroke-width="5"/><ellipse cx="20" cy="132" rx="16" ry="11" fill="${LIL}" stroke="${INK}" stroke-width="3"/></g>
        <g class="sway2"><path d="M240 200 q40 0 38 50" fill="none" stroke="${INK}" stroke-width="5"/><ellipse cx="278" cy="258" rx="16" ry="11" fill="${LIL}" stroke="${INK}" stroke-width="3"/></g>
      </g>`);
    },
    /* Blyanten: a pencil drawing its own floor plans. A slit in the metal band */
    blyant(g) {
      return defs(`${sh(150, 352, 80)}
      <g class="sway" style="transform-origin:150px 340px">
        <path d="M128 280 L150 344 L172 280Z" fill="${PAPER}" stroke="${INK}" stroke-width="3"/><path d="M144 326 L150 344 L156 326Z" fill="${INK}"/>
        <g class="mis"><rect x="122" y="70" width="56" height="212" fill="${MUS}" ${M}/></g>
        <rect x="128" y="76" width="44" height="206" fill="url(#n2R)" ${M}/>
        <rect x="122" y="70" width="56" height="212" fill="none" stroke="${INK}" stroke-width="4"/><path d="M141 70 V282 M159 70 V282" stroke="${INK}" stroke-width="2"/>
        <rect x="118" y="44" width="64" height="30" fill="${SKY}" stroke="${INK}" stroke-width="4"/>${slit(150, 59, 18, g, 8)}
        <path d="M122 44 Q150 4 178 44Z" fill="${RED}" stroke="${INK}" stroke-width="4"/>
        <g class="swing" style="transform-origin:178px 170px"><path d="M178 170 l70 -30" stroke="${INK}" stroke-width="4"/><rect x="228" y="80" width="18" height="120" fill="${PAPER}" stroke="${INK}" stroke-width="3" transform="rotate(20 237 140)"/></g>
        <path d="M40 350 q40 -20 80 0 t80 0" fill="none" stroke="${TEAL}" stroke-width="3" stroke-dasharray="6 6"/>
      </g>`);
    },
    /* Kopimaskinen: a copier. A bar of light sweeps under its lid: that is how it looks at things */
    kopi(g) {
      const bar = [70, 110, 140, 150][g];
      return defs(`${sh(150, 352, 110)}
      <g class="hop">
        <g class="mis"><rect x="50" y="170" width="200" height="170" rx="8" fill="${LIL}" ${M}/></g>
        <rect x="50" y="170" width="200" height="170" rx="8" fill="url(#n2G)" stroke="${INK}" stroke-width="4"/>
        <rect x="70" y="240" width="160" height="16" fill="${INK}"/><rect x="70" y="270" width="160" height="16" fill="${INK}"/>
        <g class="chew" style="transform-origin:150px 170px"><path d="M40 170 L260 170 L250 130 L50 130Z" fill="${TEAL}" stroke="${INK}" stroke-width="4"/></g>
        <rect x="62" y="192" width="176" height="30" fill="${INK}"/><g class="glow"><rect x="${bar + 8}" y="194" width="10" height="26" fill="${MUS}"/><rect x="${bar - 10}" y="194" width="46" height="26" fill="${MUS}" opacity=".4"/></g>
        <g class="flt">${[[200, 80, 10], [80, 60, -12], [150, 30, 4]].map(([x, y, r]) => `<g transform="rotate(${r} ${x} ${y})"><rect x="${x - 18}" y="${y - 24}" width="36" height="48" fill="#fff" stroke="${INK}" stroke-width="2.5"/><path d="M${x} ${y - 14} q10 4 6 18 q-6 10 -12 0 q-4 -14 6 -18z" fill="${RED}" opacity=".7" ${M}/></g>`).join('')}</g>
      </g>`);
    },
    /* Vejlederen: a compass in a long coat, always on its way from somewhere it should already have left. The needle is its eye */
    vejleder(g) {
      const a = [130, 70, 30, 0][g];
      return defs(`${sh(150, 352, 70)}
      <g class="sway" style="transform-origin:150px 350px">
        <path d="M120 300 l-8 48 M180 300 l8 48" stroke="${INK}" stroke-width="5" stroke-linecap="round"/>
        <g class="mis"><path d="M150 140 L230 310 L70 310Z" fill="${TEAL}" ${M}/></g>
        <path d="M150 140 L226 306 L74 306Z" fill="url(#n2L)" stroke="${INK}" stroke-width="4"/>
        <path d="M150 160 V300" stroke="${INK}" stroke-width="2.5"/>${[190, 220, 250].map(y => `<circle cx="150" cy="${y}" r="4" fill="${MUS}" stroke="${INK}" stroke-width="1.5"/>`).join('')}
        <circle cx="150" cy="96" r="52" fill="${PAPER}" stroke="${INK}" stroke-width="4"/><circle cx="150" cy="96" r="40" fill="none" stroke="${INK}" stroke-width="1.5" stroke-dasharray="2 5"/>
        <g font-family="Rubik Mono One, monospace" font-size="10" fill="${INK}" text-anchor="middle"><text x="150" y="56">N</text><text x="150" y="146">S</text><text x="104" y="100">V</text><text x="196" y="100">Ø</text></g>
        <g class="${g >= 3 ? '' : 'spin2'}" style="transform-origin:150px 96px"><g transform="rotate(${a} 150 96)"><path d="M150 96 L142 96 L150 52 L158 96Z" fill="${RED}" stroke="${INK}" stroke-width="2"/><path d="M150 96 L142 96 L150 140 L158 96Z" fill="${INK}"/></g></g>
        <circle cx="150" cy="96" r="5" fill="${MUS}" stroke="${INK}" stroke-width="2"/>
        <g class="swing" style="transform-origin:174px 196px"><path d="M172 194 L240 230" stroke="${INK}" stroke-width="13" stroke-linecap="round"/><path d="M172 194 L240 230" stroke="${TEAL}" stroke-width="7" stroke-linecap="round"/><path d="M234 222 l-6 12" stroke="${INK}" stroke-width="2.5"/><circle cx="256" cy="240" r="16" fill="${MUS}" stroke="${INK}" stroke-width="3"/><path d="M256 240 V230 M256 240 L264 244" stroke="${INK}" stroke-width="2.5"/></g>
      </g>`);
    },
    /* Knagen: a coat stand with a magpie's head, wearing everything it has taken. A buttonhole for an eye */
    knage(g) {
      return defs(`${sh(150, 352, 70)}
      <g class="wob">
        <path d="M150 340 V100" stroke="${INK}" stroke-width="9"/><path d="M150 340 V100" stroke="${LIL}" stroke-width="4"/>
        <path d="M100 350 L150 320 L200 350" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
        <g stroke="${INK}" stroke-width="4" fill="none" stroke-linecap="round"><path d="M150 150 q-40 -6 -50 20 M150 150 q40 -6 50 20 M150 220 q-36 0 -46 26 M150 220 q36 0 46 26"/></g>
        <g class="sway2"><path d="M96 170 l-30 60 l40 0z" fill="${RED}" stroke="${INK}" stroke-width="3"/></g>
        <g class="sway"><path d="M200 172 q20 60 -4 110" fill="none" stroke="${MUS}" stroke-width="12"/><path d="M200 172 q20 60 -4 110" fill="none" stroke="${INK}" stroke-width="2" stroke-dasharray="4 6"/></g>
        <g class="swing" style="transform-origin:104px 246px"><path d="M104 246 v20 l14 6 l2 -8 l-8 -2 v-16z" fill="${TEAL}" stroke="${INK}" stroke-width="2.5"/></g>
        <path d="M196 246 q-14 26 4 30 q18 -4 4 -30z" fill="${MUS}" stroke="${INK}" stroke-width="2.5"/>
        <g class="mis"><ellipse cx="150" cy="78" rx="38" ry="30" fill="${INK}"/></g><ellipse cx="146" cy="74" rx="38" ry="30" fill="url(#n2T)" stroke="${INK}" stroke-width="3"/>
        <path d="M180 70 L234 ${g >= 2 ? 78 : 60} L182 86Z" fill="${MUS}" stroke="${INK}" stroke-width="3"/>
        ${slit(160, 70, 10, g, 20)}
        <path d="M112 60 q-20 -26 6 -30 q10 0 12 14" fill="${RED}" stroke="${INK}" stroke-width="3"/>
      </g>`);
    },
    /* Holdet: a class, which is a row of school chairs on legs. Each has a small lamp; the lit ones are paying attention */
    holdet(g) {
      const lit = [1, 2, 4, 5][g];
      const chair = (x, y, s, i) => `<g class="${i % 2 ? 'hop' : 'wob'}" style="animation-delay:-${i * .23}s"><g transform="translate(${x} ${y}) scale(${s})">
        <path d="M0 60 v36 M36 60 v36" stroke="${INK}" stroke-width="5"/><rect x="-4" y="52" width="44" height="10" fill="${[TEAL, RED, MUS, LIL, PINE][i]}" stroke="${INK}" stroke-width="3"/>
        <rect x="0" y="0" width="36" height="52" fill="${[MUS, LIL, TEAL, RED, MUS][i]}" stroke="${INK}" stroke-width="3" ${M}/>
        <circle cx="18" cy="22" r="8" fill="${i < lit ? MUS : INK}" stroke="${INK}" stroke-width="2.5"/>${i < lit ? `<circle cx="18" cy="22" r="13" fill="${MUS}" opacity=".3"/>` : ''}</g></g>`;
      return defs(`${sh(150, 352, 130)}${[[30, 240, 1], [92, 222, 1.08], [160, 228, 1.04], [226, 244, .96], [120, 120, .82]].map(([x, y, s], i) => chair(x, y, s, i)).join('')}`);
    },
    /* Rygtet: a ribbon of ticker tape. It has mouths printed along it and no eyes at all */
    rygtet(g) {
      const words = ['HUN ER', 'HAN ER', 'SYNES', 'DER', 'ALTID', 'SØD', 'SUR'];
      return defs(`${sh(150, 352, 90)}
      <g class="flt">
        <g class="mis"><path d="M30 300 C10 200 120 230 110 150 C100 70 220 110 240 50 C260 0 290 40 270 80" fill="none" stroke="${RED}" stroke-width="44" ${M} stroke-linecap="round"/></g>
        <path d="M30 300 C10 200 120 230 110 150 C100 70 220 110 240 50 C260 0 290 40 270 80" fill="none" stroke="${PAPER}" stroke-width="36" stroke-linecap="round"/>
        <path d="M30 300 C10 200 120 230 110 150 C100 70 220 110 240 50 C260 0 290 40 270 80" fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="1 0" opacity=".9"/>
        <path id="rygP" d="M30 300 C10 200 120 230 110 150 C100 70 220 110 240 50 C260 0 290 40 270 80" fill="none"/>
        <text font-family="Rubik Mono One, monospace" font-size="11" fill="${TEAL}"><textPath href="#rygP" startOffset="4%">${words.join(' · ')}</textPath></text>
        ${[[44, 262], [108, 168], [214, 82]].map(([x, y], i) => `<g class="${i % 2 ? 'chew' : 'honk'}"><ellipse cx="${x}" cy="${y + 14}" rx="${12 + g * 2}" ry="${6 + g}" fill="${INK}"/><ellipse cx="${x}" cy="${y + 16}" rx="${6 + g}" ry="3" fill="${RED}"/></g>`).join('')}
        <path d="M30 300 l-14 30 M30 300 l10 34" stroke="${INK}" stroke-width="3"/>
      </g>`);
    },
    /* Kalenderen: a wall calendar that eats its own days. Its eye is the red ring drawn round a date */
    kalender(g) {
      const pos = [[5, 3], [3, 2], [2, 1], [1, 1]][g];
      return defs(`${sh(150, 352, 90)}
      <g class="wob">
        <path d="M110 330 l-10 18 M190 330 l10 18" stroke="${INK}" stroke-width="5"/>
        <g class="flap" style="transform-origin:150px 80px"><path d="M64 70 L236 70 L230 34 L70 30Z" fill="${LIL}" stroke="${INK}" stroke-width="3"/></g>
        <g class="mis"><rect x="60" y="74" width="180" height="256" fill="${RED}" ${M}/></g>
        <rect x="66" y="80" width="168" height="244" fill="${PAPER}" stroke="${INK}" stroke-width="4"/>
        <rect x="66" y="80" width="168" height="40" fill="url(#n2R)" stroke="${INK}" stroke-width="3"/>
        <g font-family="Rubik Mono One, monospace" font-size="12" fill="${INK}"><text x="150" y="106" text-anchor="middle">UGE ?</text></g>
        ${Array.from({ length: 35 }, (_, i) => { const c = i % 7, r = Math.floor(i / 7); return `<text x="${80 + c * 23}" y="${146 + r * 34}" font-family="Chivo, sans-serif" font-weight="700" font-size="13" fill="${(i * 7) % 5 === 0 ? 'none' : INK}">${(i % 31) + 1}</text>`; }).join('')}
        <circle cx="${86 + pos[0] * 23}" cy="${141 + pos[1] * 34}" r="${[14, 15, 16, 18][g]}" fill="none" stroke="${RED}" stroke-width="4"/>
        ${g >= 3 ? `<circle cx="${86 + pos[0] * 23}" cy="${141 + pos[1] * 34}" r="5" fill="${INK}"/>` : ''}
        <g class="flt"><path d="M240 60 l30 -10 l4 36 l-32 6z" fill="${PAPER}" stroke="${INK}" stroke-width="2.5"/><path d="M28 140 l26 -6 l6 30 l-28 6z" fill="${PAPER}" stroke="${INK}" stroke-width="2.5"/></g>
      </g>`);
    },
    /* Telefonen: a rotary phone with a curly cord for a tail. The dial is its eye: the lit holes are the ones on you */
    telefon(g) {
      const lit = [1, 3, 6, 10][g];
      return defs(`${sh(150, 352, 100)}
      <g class="hop">
        <path d="M230 300 ${Array.from({ length: 8 }, (_, i) => `c8 -14 16 -14 14 0 c-2 14 -12 10 -8 -2`).join(' ')}" fill="none" stroke="${INK}" stroke-width="3" transform="translate(0 0)"/>
        <g class="mis"><path d="M60 330 L80 190 Q150 160 220 190 L240 330Z" fill="${TEAL}" ${M}/></g>
        <path d="M66 326 L84 196 Q150 168 216 196 L234 326Z" fill="url(#n2M)" stroke="${INK}" stroke-width="4"/>
        <circle cx="150" cy="260" r="52" fill="${PAPER}" stroke="${INK}" stroke-width="4"/>
        ${Array.from({ length: 10 }, (_, i) => { const a = (-60 + i * 30) * Math.PI / 180; return `<circle cx="${(150 + Math.cos(a) * 36).toFixed(1)}" cy="${(260 + Math.sin(a) * 36).toFixed(1)}" r="8" fill="${i < lit ? MUS : INK}" stroke="${INK}" stroke-width="2"/>`; }).join('')}
        <circle cx="150" cy="260" r="12" fill="${RED}" stroke="${INK}" stroke-width="3"/>
        <g class="swing" style="transform-origin:150px 170px"><path d="M60 170 Q60 130 90 136 L210 136 Q240 130 240 170 L214 176 Q210 156 190 156 L110 156 Q90 156 86 176Z" fill="${RED}" stroke="${INK}" stroke-width="4"/></g>
      </g>`);
    },
    /* Chefen: an office chair, empty. It swivels a little. At a full look, a dashed outline sits in it */
    stol(g) {
      return defs(`${sh(150, 352, 90)}
      <g class="sway" style="transform-origin:150px 340px">
        <path d="M150 300 V250" stroke="${INK}" stroke-width="10"/>
        ${[[-70, 340], [-36, 350], [36, 350], [70, 340], [0, 352]].map(([dx, y]) => `<path d="M150 300 L${150 + dx} ${y}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><circle cx="${150 + dx}" cy="${y}" r="7" fill="${MUS}" stroke="${INK}" stroke-width="2.5"/>`).join('')}
        <g class="mis"><rect x="84" y="210" width="132" height="40" rx="12" fill="${RED}" ${M}/></g>
        <rect x="84" y="210" width="132" height="40" rx="12" fill="url(#n2R)" stroke="${INK}" stroke-width="4"/>
        <g class="mis2"><path d="M96 210 L90 70 Q150 40 210 70 L204 210Z" fill="${TEAL}" ${M}/></g>
        <path d="M96 210 L90 70 Q150 40 210 70 L204 210Z" fill="url(#n2T)" stroke="${INK}" stroke-width="4"/>
        <path d="M84 170 h-20 v40 M216 170 h20 v40" fill="none" stroke="${INK}" stroke-width="6"/>
        ${g >= 3 ? `<path d="M150 70 C180 70 184 110 180 140 C176 180 170 210 150 220 C130 210 124 180 120 140 C116 110 120 70 150 70Z" fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="6 6" class="glow"/>` : ''}
      </g>`);
    },
  });

  /* ---------------- scenes (393 × 560) ---------------- */
  const paper = (c = PAPER) => `<rect width="393" height="560" fill="${c}"/>`;
  const conf = (n, y0, y1, seedN) => { let s = '', seed = seedN * 613; const r = () => (seed = (seed * 9301 + 49297) % 233280) / 233280; const cs = [TEAL, RED, MUS, LIL]; for (let i = 0; i < n; i++) { const x = r() * 393, y = y0 + r() * (y1 - y0); s += `<rect class="conf" style="animation-delay:-${(r() * 6).toFixed(1)}s" x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${(5 + r() * 7).toFixed(0)}" height="${(6 + r() * 6).toFixed(0)}" fill="#fff" stroke="${cs[i % 4]}" stroke-width="1.5" transform="rotate(${(r() * 90).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`; } return `<g>${s}</g>`; }; // paper slips, not confetti
  const floor = (y, c = 'url(#n2C)') => `<path d="M0 ${y} H393 V560 H0Z" fill="${c}" ${M}/><path d="M0 ${y} H393" stroke="${INK}" stroke-width="4"/>`;
  const lamp = (x, y) => `<g class="sway2" style="transform-origin:${x}px 0px"><path d="M${x} 0 V${y}" stroke="${INK}" stroke-width="2"/><path d="M${x - 22} ${y + 18} L${x} ${y} L${x + 22} ${y + 18}Z" fill="${MUS}" stroke="${INK}" stroke-width="3"/><path d="M${x - 22} ${y + 18} L${x - 50} ${y + 140} H${x + 50} L${x + 22} ${y + 18}" fill="${MUS}" opacity=".18" ${M}/></g>`;
  const S2 = {
    port() {
      const tubes = Array.from({ length: 6 }, (_, i) => `<path d="M${30 + i * 24} 0 V${120 + (i % 3) * 20} q0 14 14 14" fill="none" stroke="${[TEAL, RED, MUS][i % 3]}" stroke-width="12" ${M}/><path d="M${30 + i * 24} 0 V${120 + (i % 3) * 20}" stroke="${INK}" stroke-width="2"/>`).join('');
      return `${paper()}<g class="mis2"><rect width="393" height="380" fill="url(#n2M)" opacity=".35" ${M}/></g>${tubes}
        <g class="flt"><rect x="78" y="150" width="30" height="16" rx="8" fill="${RED}" stroke="${INK}" stroke-width="2.5" transform="rotate(30 93 158)"/></g>
        <rect x="236" y="40" width="130" height="190" fill="#fff" stroke="${INK}" stroke-width="3"/><text x="301" y="62" text-anchor="middle" font-family="Rubik Mono One, monospace" font-size="11" fill="${INK}">ETAGER</text>
        ${['TAGET', '4 · KONTOR', '3 · ½', '2 · TEGNESTUE', '1 · KØJER', 'STUEN', 'KÆLDER'].map((t, i) => `<text x="250" y="${86 + i * 21}" font-family="Chivo Mono, monospace" font-weight="700" font-size="11" fill="${i === 2 ? RED : TEAL}">${t}</text>`).join('')}
        <g class="mis"><rect x="0" y="330" width="393" height="70" fill="${TEAL}" ${M}/></g><rect x="0" y="330" width="393" height="70" fill="url(#n2R)" opacity=".5" ${M}/><path d="M0 330 H393 M0 400 H393" stroke="${INK}" stroke-width="4"/>
        ${floor(400, 'url(#n2C)')}${conf(16, 120, 320, 31)}`;
    },
    koeje() {
      const bunk = (x) => `<g><rect x="${x}" y="160" width="130" height="10" fill="${INK}"/><rect x="${x}" y="300" width="130" height="10" fill="${INK}"/><path d="M${x} 100 V420 M${x + 130} 100 V420" stroke="${INK}" stroke-width="6"/>
        <rect x="${x + 6}" y="140" width="118" height="22" rx="8" fill="${LIL}" stroke="${INK}" stroke-width="2.5"/><rect x="${x + 6}" y="280" width="118" height="22" rx="8" fill="${MUS}" stroke="${INK}" stroke-width="2.5"/>
        <rect x="${x + 10}" y="128" width="30" height="16" rx="6" fill="#fff" stroke="${INK}" stroke-width="2"/></g>`;
      return `${paper()}<g class="mis2"><rect width="393" height="420" fill="url(#n2T)" opacity=".28" ${M}/></g>${bunk(30)}${bunk(232)}
        <rect x="176" y="80" width="42" height="80" fill="${SKY}" stroke="${INK}" stroke-width="3"/><path d="M197 80 V160" stroke="${INK}" stroke-width="2"/><g class="flt"><rect x="186" y="100" width="22" height="14" fill="${MUS}" stroke="${INK}" stroke-width="2"/></g>
        ${floor(420, 'url(#n2C)')}<path d="M150 470 q46 -24 92 0" fill="none" stroke="${RED}" stroke-width="5"/>${conf(8, 40, 400, 32)}`;
    },
    tag() {
      const beams = Array.from({ length: 6 }, (_, i) => `<path d="M${20 + i * 70} 560 V${380 - (i % 3) * 40}" stroke="${RED}" stroke-width="10" ${M}/><path d="M${20 + i * 70} 560 V${380 - (i % 3) * 40}" stroke="${INK}" stroke-width="2"/>`).join('');
      return `${paper(MUS)}<g class="mis2"><rect width="393" height="560" fill="url(#n2M)" opacity=".5" ${M}/></g>
        <g class="spin" style="transform-origin:300px 100px"><circle cx="300" cy="100" r="62" fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="3 9"/></g><g class="mis"><circle cx="300" cy="100" r="40" fill="${RED}" ${M}/></g><circle cx="304" cy="96" r="40" fill="none" stroke="${INK}" stroke-width="3"/>
        <g ${M} opacity=".8">${Array.from({ length: 22 }, (_, i) => `<circle cx="${30 + i * 7}" cy="${300 + Math.sin(i) * 6}" r="${2 + (i % 3)}" fill="${['#ff48b0', '#0078bf', '#ffe800', '#00a95c'][i % 4]}"/>`).join('')}</g>
        <text x="30" y="328" font-family="Rubik Mono One, monospace" font-size="9" fill="${INK}" opacity=".6">HERTIL ↓</text>
        ${beams}<path d="M0 420 H393" stroke="${INK}" stroke-width="5"/><path d="M0 380 H260" stroke="${TEAL}" stroke-width="8" ${M}/>${conf(14, 120, 360, 33)}`;
    },
    kontor() {
      const desk = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="0" y="0" width="110" height="12" fill="${TEAL}" stroke="${INK}" stroke-width="3"/><path d="M8 12 V70 M102 12 V70" stroke="${INK}" stroke-width="4"/>
        <rect x="14" y="-30" width="26" height="30" fill="#fff" stroke="${INK}" stroke-width="2"/><rect x="16" y="-36" width="26" height="30" fill="#fff" stroke="${INK}" stroke-width="2"/><path d="M70 0 V-26 l14 -8" stroke="${INK}" stroke-width="3" fill="none"/></g>`;
      return `${paper()}<g class="mis2"><rect width="393" height="390" fill="url(#n2L)" opacity=".4" ${M}/></g>${lamp(90, 40)}${lamp(300, 60)}
        <rect x="24" y="120" width="70" height="120" fill="${LIL}" stroke="${INK}" stroke-width="3"/>${[0, 1, 2].map(k => `<rect x="30" y="${128 + k * 36}" width="58" height="28" fill="${PAPER}" stroke="${INK}" stroke-width="2"/>`).join('')}
        ${desk(130, 300, 1)}${desk(260, 330, .9)}${desk(40, 360, 1.1)}${floor(420, 'url(#n2C)')}${conf(22, 60, 380, 34)}`;
    },
    halv() {
      return `${paper()}<g class="mis2"><rect width="393" height="560" fill="url(#n2G)" ${M}/></g>
        <g class="mis"><rect x="0" y="150" width="190" height="270" fill="${RED}" ${M}/></g><rect x="0" y="150" width="190" height="270" fill="url(#n2B)" opacity=".8"/><path d="M190 150 V420" stroke="${INK}" stroke-width="4"/>
        <g stroke="${TEAL}" stroke-width="5" fill="none"><path d="M200 420 V120 M300 420 V120 M380 420 V140 M200 200 H380 M200 300 H380 M200 200 L300 300 M300 200 L380 300"/></g>
        <g transform="rotate(-28 300 330)"><rect x="262" y="320" width="80" height="12" fill="${MUS}" stroke="${INK}" stroke-width="3"/><path d="M268 332 v30 M336 332 v30" stroke="${INK}" stroke-width="4"/></g>
        <g transform="rotate(14 80 110)"><path d="M60 96 h40 l-6 30 h-28z" fill="#fff" stroke="${INK}" stroke-width="3"/><path d="M76 92 q2 -10 8 -16" stroke="${INK}" stroke-width="2" fill="none"/></g>
        <g font-family="Rubik Mono One, monospace" font-size="10" fill="${RED}"><text x="236" y="110">VED AT …</text></g>
        ${floor(420, 'url(#n2M)')}`;
    },
    tegnestue() {
      const table = (x, y, r) => `<g transform="rotate(${r} ${x} ${y})"><rect x="${x - 70}" y="${y - 40}" width="140" height="80" fill="${SKY}" stroke="${INK}" stroke-width="3"/><rect x="${x - 70}" y="${y - 40}" width="140" height="80" fill="url(#n2G)"/><path d="M${x - 50} ${y + 10} h60 v-30 h30" fill="none" stroke="#fff" stroke-width="2.5"/></g><path d="M${x} ${y + 40} V${y + 120}" stroke="${INK}" stroke-width="5"/>`;
      return `${paper()}<g class="mis2"><rect width="393" height="420" fill="url(#n2T)" opacity=".25" ${M}/></g>
        ${[[30, 50, -4], [150, 40, 3], [270, 56, -2]].map(([x, y, r]) => `<g class="sway2" style="transform-origin:${x + 45}px ${y}px"><rect x="${x}" y="${y}" width="90" height="110" fill="#fff" stroke="${INK}" stroke-width="2.5" transform="rotate(${r} ${x + 45} ${y})"/><path d="M${x + 14} ${y + 30} h60 M${x + 14} ${y + 50} h40 v40" stroke="${TEAL}" stroke-width="2" fill="none" transform="rotate(${r} ${x + 45} ${y})"/></g>`).join('')}
        ${table(110, 280, -8)}${table(290, 300, 6)}${floor(420, 'url(#n2C)')}${conf(10, 180, 400, 35)}`;
    },
    kantine() {
      return `${paper(TEAL)}<g class="mis2"><rect width="393" height="560" fill="url(#n2M)" opacity=".45" ${M}/></g>
        <rect x="40" y="70" width="313" height="120" fill="${INK}"/><rect x="52" y="82" width="289" height="96" fill="${MUS}" class="glow"/>
        <g class="flt" fill="none" stroke="#fff" stroke-width="4" opacity=".8"><path d="M120 70 q-12 -20 0 -40 q12 -16 0 -30"/><path d="M200 66 q12 -20 0 -40"/><path d="M280 70 q-12 -20 0 -40"/></g>
        ${[300, 380].map(y => `<rect x="20" y="${y}" width="353" height="16" fill="${RED}" stroke="${INK}" stroke-width="3"/><path d="M40 ${y + 16} v40 M353 ${y + 16} v40" stroke="${INK}" stroke-width="4"/>${[60, 140, 220, 300].map(x => `<rect x="${x}" y="${y - 10}" width="40" height="10" fill="${PAPER}" stroke="${INK}" stroke-width="2"/>`).join('')}`).join('')}
        ${floor(460, 'url(#n2C)')}`;
    },
    kopi() {
      return `${paper(LIL)}<g class="mis2"><rect width="393" height="560" fill="url(#n2T)" opacity=".4" ${M}/></g>
        <g class="glow"><rect x="0" y="250" width="393" height="26" fill="${MUS}" opacity=".7"/></g>
        <g class="fall1" style="animation-duration:4s">${[40, 130, 220, 310].map((x, i) => `<rect x="${x}" y="${20 + i * 30}" width="44" height="58" fill="#fff" stroke="${INK}" stroke-width="2.5" transform="rotate(${i * 13 - 20} ${x + 22} ${50 + i * 30})"/>`).join('')}</g>
        ${floor(430, 'url(#n2G)')}${conf(30, 0, 420, 36)}`;
    },
    skole() {
      return `${paper()}<g class="mis2"><rect width="393" height="420" fill="url(#n2R)" opacity=".18" ${M}/></g>
        <rect x="40" y="60" width="313" height="170" fill="${PINE}" stroke="${INK}" stroke-width="5"/><rect x="40" y="60" width="313" height="170" fill="url(#n2G)" opacity=".5"/>
        <g font-family="Chivo, sans-serif" font-weight="700" font-size="17" fill="#fff" opacity=".9"><text x="60" y="100">Det er ham, der …</text><text x="60" y="130">Han elsker sin hat.</text><text x="60" y="160" text-decoration="line-through">Han elsker hans hat.</text><text x="60" y="200">sød · sur · tjekket</text></g>
        <g class="spin2" style="transform-origin:330px 40px"><path d="M330 40 V24" stroke="${INK}" stroke-width="3"/></g><circle cx="330" cy="40" r="18" fill="none" stroke="${INK}" stroke-width="3"/>
        ${floor(420, 'url(#n2C)')}<rect x="40" y="230" width="313" height="8" fill="${INK}"/>${conf(10, 250, 410, 37)}`;
    },
    gang() {
      return `${paper()}<g class="mis2"><path d="M0 0 L160 200 L233 200 L393 0Z" fill="url(#n2M)" opacity=".5" ${M}/></g>
        <path d="M0 0 L160 200 M393 0 L233 200 M0 560 L160 330 M393 560 L233 330" stroke="${INK}" stroke-width="3"/><rect x="160" y="200" width="73" height="130" fill="${TEAL}" stroke="${INK}" stroke-width="3" ${M}/>
        ${[[40, 130, 60, 170], [100, 185, 40, 110]].map(([x, y, w, h]) => `<path d="M${x} ${y} l${w * .6} ${h * .14} v${h} l-${w * .6} ${h * .16}z" fill="${RED}" stroke="${INK}" stroke-width="2.5" ${M}/><path d="M${393 - x} ${y} l-${w * .6} ${h * .14} v${h} l${w * .6} ${h * .16}z" fill="${LIL}" stroke="${INK}" stroke-width="2.5" ${M}/>`).join('')}
        <path d="M0 560 L160 330 L233 330 L393 560Z" fill="url(#n2C)" ${M}/>${conf(14, 40, 420, 38)}`;
    },
    chef() {
      return `${paper(SKY)}<g class="mis2"><rect width="393" height="560" fill="url(#n2T)" opacity=".3" ${M}/></g>
        <rect x="30" y="40" width="333" height="300" fill="#fff" stroke="${INK}" stroke-width="5"/><path d="M196 40 V340 M30 190 H363" stroke="${INK}" stroke-width="4"/>
        <g ${M}><circle cx="100" cy="110" r="30" fill="${MUS}"/><path d="M220 300 q40 -60 80 -40 q30 -30 50 0" fill="${LIL}" opacity=".6"/></g>
        <rect x="80" y="380" width="233" height="20" fill="${RED}" stroke="${INK}" stroke-width="3"/><path d="M96 400 v80 M297 400 v80" stroke="${INK}" stroke-width="5"/>
        <rect x="120" y="356" width="40" height="24" fill="#fff" stroke="${INK}" stroke-width="2"/>${floor(480, 'url(#n2C)')}`;
    },
    /* the map: Derhenne in cross-section. Floors as bands, a lift shaft up the middle */
    tarn() {
      const bands = [[0, 'TAGET', MUS], [1, '4', PAPER], [2, '3 · ½', PAPER], [3, '2', PAPER], [4, '1', PAPER], [5, 'STUEN', PAPER], [6, 'KÆLDER', LIL]];
      return `${paper()}<rect width="393" height="560" fill="url(#n2M)" opacity=".3"/>
        ${bands.map(([i, t, c]) => { const y = 14 + i * 78; return `<rect x="22" y="${y}" width="349" height="70" fill="${c}" ${c === PAPER ? '' : M} opacity="${c === PAPER ? .55 : .5}"/><path d="M22 ${y + 70} H371" stroke="${INK}" stroke-width="2.5"/><text x="28" y="${y + 13}" font-family="Rubik Mono One, monospace" font-size="8" fill="${INK}" opacity=".6">${t}</text>`; }).join('')}
        <path d="M22 14 V560 M371 14 V560" stroke="${INK}" stroke-width="3"/>
        <g class="mis"><rect x="180" y="0" width="33" height="560" fill="${TEAL}" opacity=".35" ${M}/></g><path d="M180 0 V560 M213 0 V560" stroke="${INK}" stroke-width="2" stroke-dasharray="4 4"/>
        <g stroke="${RED}" stroke-width="4" fill="none" opacity=".7"><path d="M300 14 V-40"/></g>
        <g ${M} opacity=".5"><path d="M220 14 L240 -20 L360 -20" fill="none" stroke="${INK}" stroke-width="2"/></g>
        <text x="16" y="552" font-family="Rubik Mono One, monospace" font-size="10" fill="${INK}" opacity=".6">DERHENNE · snit</text>`;
    },
  };
  Object.keys(S2).forEach(k => { const f = S2[k]; S2[k] = () => `<defs>${D2}</defs>` + f(); }); // scenes need the chapter's patterns too
  Object.assign(SCENES, S2);
  INDOOR.push('port', 'koeje', 'kontor', 'halv', 'tegnestue', 'kantine', 'kopi', 'skole', 'gang', 'chef');
  // the shifts of Derhenne: morgenvagt (as printed), dagvagt (mustard warmth), aftenvagt (teal), natskift (navy, the inks glow red)
  const G2 = ['', `<rect width="393" height="560" fill="${MUS}" opacity=".16" ${M}/>`, `<rect width="393" height="560" fill="${TEAL}" opacity=".24" ${M}/>`,
    `<rect width="393" height="560" fill="#14235a" opacity=".58" ${M}/><rect width="393" height="560" fill="${RED}" opacity=".07" style="mix-blend-mode:screen"/>`];
  Object.keys(S2).forEach(k => GRADES[k] = G2);
  GRADES.tarn = ['', G2[1], G2[2], `<rect width="393" height="560" fill="#14235a" opacity=".35" ${M}/>`];

  /* ---------------- you: Derhenne prints its gifts onto your plate too ---------------- */
  const self0 = ART.self;
  ART.self = (G, marks, mini) => {
    const b = k => G.boons.includes(k); let x = '';
    if (b('hue')) x += `<path d="M112 70 L150 54 L188 70 L150 84Z" fill="${INK}"/><path d="M182 72 V92" stroke="${MUS}" stroke-width="3"/><circle cx="182" cy="94" r="4" fill="${MUS}"/>`;
    if (b('hat')) x += `<path d="M118 66 L124 36 Q150 26 176 36 L182 66Z" fill="${RED}" stroke="${INK}" stroke-width="3"/>`;
    if (b('bakke')) x += `<ellipse cx="236" cy="210" rx="34" ry="8" fill="${LIL}" stroke="${INK}" stroke-width="3"/><path d="M210 206 h10 v-12 h-10z M232 204 h8 v-16 h-8z" fill="#fff" stroke="${INK}" stroke-width="2"/>`;
    if (b('kode')) x += `<g font-family="Chivo Mono, monospace" font-size="10" fill="${TEAL}"><text x="118" y="226">{ ; }</text><text x="160" y="250">01</text></g>`;
    if (b('kompas')) x += `<path d="M99 196 Q84 214 78 204" fill="none" stroke="${MUS}" stroke-width="2.5" stroke-dasharray="3 2"/><circle cx="64" cy="210" r="18" fill="${PAPER}" stroke="${INK}" stroke-width="3"/><path d="M64 196 L68 210 L64 224 L60 210Z" fill="${RED}"/>`;
    if (b('stillads')) x += `<g stroke="${TEAL}" stroke-width="3"><path d="M30 320 V150 M60 320 V150 M30 200 H60 M30 260 H60 M30 200 L60 260"/></g>`;
    if (b('froe') || b('soed')) x += `<path d="M196 150 Q206 136 204 122" fill="none" stroke="${TEAL}" stroke-width="3"/><g transform="translate(204 118) scale(.8)">${[0, 1, 2, 3, 4].map(k => `<ellipse cx="0" cy="-8" rx="5" ry="9" fill="${RED}" stroke="${INK}" stroke-width="1.5" transform="rotate(${k * 72})"/>`).join('')}<circle r="5" fill="${MUS}" stroke="${INK}" stroke-width="2"/></g>`;
    if (b('kalenderblad')) x += `<rect x="176" y="248" width="40" height="46" fill="#fff" stroke="${INK}" stroke-width="2.5" transform="rotate(8 196 271)"/><circle cx="196" cy="274" r="9" fill="none" stroke="${RED}" stroke-width="3"/>`;
    return x ? self0(G, marks, mini).replace(/<\/svg>$/, x + '</svg>') : self0(G, marks, mini);
  };

  /* ---------------- icons ---------------- */
  Object.assign(ART.ICONS, {
    laptop: '<rect x="10" y="10" width="28" height="20" rx="2"/><path d="M4 36 H44 L40 30 H8Z"/><path d="M18 18 l-4 3 l4 3 M30 18 l4 3 l-4 3"/>',
    kors: '<rect x="8" y="8" width="32" height="32" rx="4"/><path d="M24 14 V34 M14 24 H34" stroke-width="4"/>',
    tavle: '<rect x="6" y="8" width="36" height="26"/><path d="M12 16 h14 M12 22 h20 M12 28 h8"/><path d="M14 34 L10 44 M34 34 L38 44"/>',
    hue: '<path d="M4 18 L24 10 L44 18 L24 26Z"/><path d="M12 22 V32 Q24 38 36 32 V22"/><path d="M40 20 V32"/><circle cx="40" cy="34" r="2"/>',
    seng: '<path d="M4 38 V14 M44 38 V24 M4 30 H44 M4 24 H44"/><rect x="8" y="18" width="10" height="6" rx="2"/>',
    avis: '<rect x="6" y="8" width="36" height="32"/><path d="M12 14 H36 M12 20 H22 M12 26 H22 M12 32 H22"/><rect x="26" y="20" width="10" height="12"/>',
    klods: '<rect x="8" y="22" width="18" height="18"/><rect x="22" y="8" width="18" height="18"/><path d="M14 31 h6 M31 13 v8"/>',
    linjal: '<path d="M6 36 L36 6 L42 12 L12 42Z"/><path d="M14 28 l4 4 M20 22 l3 3 M26 16 l4 4 M32 10 l3 3"/>',
    maske: '<path d="M8 12 Q24 6 40 12 Q42 30 24 40 Q6 30 8 12Z"/><path d="M14 20 q4 -3 8 0 M26 20 q4 -3 8 0 M16 30 q8 6 16 0"/>',
    stempel: '<circle cx="24" cy="10" r="6"/><path d="M20 16 V24 M28 16 V24"/><rect x="12" y="24" width="24" height="10" rx="2"/><path d="M8 40 H40"/>',
    skuffe: '<rect x="8" y="6" width="32" height="36"/><path d="M8 18 H40 M8 30 H40 M20 12 h8 M20 24 h8 M20 36 h8"/>',
    mursten: '<path d="M4 14 H44 V40 H4Z M4 27 H44 M18 14 V27 M32 14 V27 M11 27 V40 M25 27 V40 M39 27 V40"/>',
    kopi: '<rect x="12" y="6" width="22" height="28"/><rect x="18" y="12" width="22" height="28" fill="currentColor" fill-opacity=".15"/><path d="M22 20 h12 M22 26 h12 M22 32 h8"/>',
    stol: '<path d="M14 8 H34 L32 28 H16Z"/><path d="M10 28 H38 M24 28 V36 M14 44 L24 36 L34 44"/>',
    telefon: '<path d="M8 16 Q8 8 16 9 H32 Q40 8 40 16 L34 18 Q32 14 28 14 H20 Q16 14 14 18Z"/><path d="M12 40 L16 22 H32 L36 40Z"/><circle cx="24" cy="31" r="4"/>',
    kran: '<path d="M14 44 V8 M6 12 H44 M14 8 L40 12 M40 12 V26"/><path d="M36 26 h8 q0 6 -4 6"/><path d="M10 44 H18"/>',
    kompas: '<circle cx="24" cy="24" r="18"/><path d="M24 10 L28 24 L24 38 L20 24Z"/>',
    knage: '<path d="M24 44 V10 M14 44 H34 M24 16 L14 12 M24 16 L34 12 M24 26 L14 22 M24 26 L34 22"/><circle cx="24" cy="8" r="3"/>',
    elevator: '<rect x="10" y="10" width="28" height="34"/><path d="M24 10 V44"/><path d="M18 4 L24 0 M30 4 L24 0 M16 20 l4 -4 l4 4 M26 32 l4 4 l4 -4"/>',
    kantine: '<path d="M8 20 H40 L36 40 H12Z"/><path d="M6 20 H42 M18 14 q2 -4 0 -8 M30 14 q2 -4 0 -8"/>',
    kalender2: '<rect x="6" y="10" width="36" height="32" rx="2"/><path d="M6 18 H42 M14 6 V14 M34 6 V14"/><circle cx="30" cy="30" r="6"/>',
    bank: '<path d="M6 18 L24 6 L42 18 Z M8 40 H40 M12 20 V36 M20 20 V36 M28 20 V36 M36 20 V36"/>',
    kurs: '<path d="M8 40 V20 H40 V40 M14 26 h8 M26 26 h8 M14 32 h8 M26 32 h8"/><path d="M24 20 V10 l8 3 l-8 3"/>',
    mappe: '<rect x="6" y="14" width="36" height="26" rx="2"/><path d="M18 14 V8 H30 V14 M6 24 H42"/>',
    termometer: '<path d="M20 30 V10 Q20 6 24 6 Q28 6 28 10 V30"/><circle cx="24" cy="36" r="7"/><path d="M24 34 V16" stroke-width="3.4"/>',
    hat: '<path d="M10 32 Q24 38 38 32"/><path d="M14 32 L16 14 Q24 8 32 14 L34 32"/><path d="M4 34 Q24 44 44 34"/>',
    skema: '<rect x="6" y="6" width="36" height="36"/><path d="M6 16 H42 M6 26 H42 M18 6 V42 M30 6 V42"/><path d="M9 21 l3 3 l5 -6 M33 33 l3 3 l5 -6"/>',
    hjem: '<path d="M6 24 L24 8 L42 24"/><path d="M12 20 V40 H36 V20"/><rect x="20" y="28" width="8" height="12"/>',
  });
})();
