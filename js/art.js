/* =========================================================================
   ART — Feberdrøm: everything is a risograph print. Flat fluorescent inks
   (pink, cobalt, yellow, green, orange) overprinted with multiply, halftone
   dots, slightly off register, and always moving a little.
   Creatures never face you. Their eyes go where attention lets them:
   gaze 0 away · 1 a sideways glance · 2 the head half turned · 3 looking at you (rare).
   Moving parts carry classes animated in css/style.css:
   mis/mis2 (misregistration jitter), wob (squash and stretch), sway, spin, flt (float),
   fall, rip (ripple), dart (eyes twitch), conf (confetti), blink.
   ========================================================================= */
const ART = (() => {
  const INK = '#1d1a5e', PINK = '#ff48b0', BLUE = '#0078bf', YEL = '#ffe800', GRN = '#00a95c', ORA = '#ff6c2f', VIO = '#765ba7', PAPER = '#fff4dc';

  const DEFS = `
  <pattern id="dP" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="1.8" fill="${PINK}"/></pattern>
  <pattern id="dB" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><circle cx="3.5" cy="3.5" r="1.6" fill="${BLUE}"/></pattern>
  <pattern id="dY" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.7" fill="${YEL}"/></pattern>
  <pattern id="dI" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="1" fill="${INK}"/></pattern>
  <pattern id="lnP" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="6" stroke="${PINK}" stroke-width="2.2"/></pattern>
  <pattern id="lnB" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)"><line x1="0" y1="0" x2="0" y2="8" stroke="${BLUE}" stroke-width="2"/></pattern>
  <pattern id="stripe" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="8" height="16" fill="${PINK}"/><rect x="8" width="8" height="16" fill="${YEL}"/></pattern>
  <pattern id="check" width="14" height="14" patternUnits="userSpaceOnUse"><rect width="7" height="7" fill="${GRN}"/><rect x="7" y="7" width="7" height="7" fill="${GRN}"/></pattern>
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".9" seed="3"/><feColorMatrix values="0 0 0 0 .12 0 0 0 0 .1 0 0 0 0 .35 0 0 0 .13 0"/></filter>
  <filter id="rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".6" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="2.2"/></filter>`;
  const M = 'style="mix-blend-mode:multiply"';

  /* ---------------- eyes: the whole game is about where they point ---------------- */
  function eye(x, y, r, away, g, opt = {}) {
    const lid = opt.lid || '#fff', a = away * Math.PI / 180;
    if (g >= 3) return `<g><ellipse cx="${x}" cy="${y}" rx="${r * 1.08}" ry="${r}" fill="${lid}" stroke="${INK}" stroke-width="2.4"/><circle cx="${x}" cy="${y}" r="${r * .56}" fill="${opt.iris || PINK}"/><circle cx="${x}" cy="${y}" r="${r * .3}" fill="${INK}"/><circle cx="${x - r * .2}" cy="${y - r * .25}" r="${r * .13}" fill="#fff"/></g>`;
    const px = g === 0 ? x + Math.cos(a) * r * .5 : g === 1 ? x - Math.cos(a) * r * .32 : x - Math.cos(a) * r * .12, py = g === 0 ? y + Math.sin(a) * r * .32 : y + r * .15;
    const ry = g === 0 ? r * .62 : g === 1 ? r * .72 : r * .88;
    return `<g class="blink"><ellipse cx="${x}" cy="${y}" rx="${r}" ry="${ry}" fill="${lid}" stroke="${INK}" stroke-width="2.2"/><g class="dart"><circle cx="${px}" cy="${py}" r="${r * .36}" fill="${INK}"/></g>${g >= 1 ? `<circle cx="${px - r * .1}" cy="${py - r * .12}" r="${r * .09}" fill="#fff"/>` : ''}</g>`;
  }
  // other kinds of eyes: not every creature has round ones
  // a slit: lies flat and closed when ignoring you, opens and tilts as attention grows
  function slit(x, y, w, g, rot = 0) {
    const h = [1.5, 4, 7, 10][g];
    return `<g transform="rotate(${g >= 2 ? 0 : rot} ${x} ${y})" class="blink"><path d="M${x - w} ${y} Q${x} ${y - h * 1.4} ${x + w} ${y} Q${x} ${y + h * 1.4} ${x - w} ${y}Z" fill="${g ? '#fff' : INK}" stroke="${INK}" stroke-width="2.4"/>${g ? `<rect x="${x - 1.5 + (g >= 2 ? 0 : w * .4)}" y="${y - h}" width="3" height="${h * 2}" fill="${INK}"/>` : ''}</g>`;
  }
  // a ripple: rings that drift away from you, then settle on you
  function ripple(x, y, g) {
    const dx = [16, 9, 3, 0][g];
    return `<g class="rip2">${[16, 10, 5].map((r, i) => `<ellipse cx="${x + dx * (i + 1) / 3}" cy="${y}" rx="${r}" ry="${r * .6}" fill="${i === 2 && g >= 3 ? INK : 'none'}" stroke="#fff" stroke-width="${3 - i * .6}"/>`).join('')}</g>`;
  }
  // a compound eye: a cluster of tiny windows; lit windows face you
  function compound(x, y, r, g) {
    let s = ''; const lit = [0, 2, 5, 9][g];
    let k = 0; for (let j = -2; j <= 2; j++) for (let i = -2; i <= 2; i++) { if (i * i + j * j > 5) continue; const on = k++ < lit; s += `<rect x="${(x + i * r * .42 - r * .18).toFixed(1)}" y="${(y + j * r * .42 - r * .18).toFixed(1)}" width="${(r * .36).toFixed(1)}" height="${(r * .36).toFixed(1)}" fill="${on ? YEL : INK}" stroke="${INK}" stroke-width="1"/>`; }
    return `<g>${s}</g>`;
  }
  const shadow = (cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx * .12}" fill="${BLUE}" opacity=".35" ${M}/>`;

  /* ---------------- creatures (300 × 360) ---------------- */
  const C = {
    /* Tælleren: a trumpet on stilts that honks numbers at the sun */
    taeller(g) {
      const tilt = [0, 0, -30, -55][g];
      return `${shadow(150, 352, 110)}
      <g class="wob">
        <g stroke="${INK}" stroke-width="5" stroke-linecap="round" fill="none"><path d="M100 270 L84 350"/><path d="M130 280 L128 352"/><path d="M170 280 L178 352"/><path d="M200 266 L222 348"/></g>
        <g class="mis"><ellipse cx="150" cy="232" rx="82" ry="56" fill="${PINK}" ${M}/></g>
        <g class="mis2"><ellipse cx="156" cy="226" rx="76" ry="50" fill="url(#dB)" ${M}/></g>
        <ellipse cx="150" cy="232" rx="82" ry="56" fill="none" stroke="${INK}" stroke-width="3.5"/>
        ${eye(112, 222, 11, 160, Math.min(g, 2))}${eye(148, 248, 8, 120, Math.min(g, 2))}${eye(186, 220, 9, 140, Math.min(g, 2))}
        <path d="M206 210 C226 170 232 130 240 104" stroke="${INK}" stroke-width="14" fill="none" stroke-linecap="round"/>
        <path d="M206 210 C226 170 232 130 240 104" stroke="${YEL}" stroke-width="7" fill="none" stroke-linecap="round"/>
        <g transform="rotate(${tilt} 240 100)">
          <g class="honk">
            <path d="M232 106 L246 96 L290 40 L300 92 L252 112Z" fill="${YEL}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round"/>
            <path d="M290 40 L300 92" stroke="${INK}" stroke-width="5"/>
            <path d="M262 70 l6 10 M272 60 l6 10" stroke="${ORA}" stroke-width="3"/>
          </g>
          ${eye(248, 92, 8, -60, g, { iris: ORA })}
        </g>
      </g>`;
    },
    /* Samleren: a shell spiral with many arms, each holding something it is thrilled about */
    samler(g) {
      const stalks = g === 0 ? [[172, 128, 214, 150], [184, 132, 230, 166]] : g === 1 ? [[172, 128, 214, 150], [184, 132, 168, 98]] : [[172, 128, 146, 92], [184, 132, 178, 88]];
      const arms = [[62, 210, 16, 160, PINK], [76, 280, 10, 262, YEL], [96, 300, 40, 344, GRN], [196, 282, 268, 266, ORA], [212, 240, 284, 222, PINK], [206, 200, 274, 172, YEL], [122, 166, 100, 108, GRN], [152, 162, 156, 100, ORA]];
      return `${shadow(150, 342, 120)}
      <g class="wob">
        <g class="sway" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round">
          ${arms.map(([x0, y0, x1, y1, c]) => `<path d="M${x0} ${y0} Q${(x0 + x1) / 2} ${(y0 + y1) / 2 - 16} ${x1} ${y1}"/><circle cx="${x1}" cy="${y1}" r="7" fill="${c}" stroke="${INK}"/>`).join('')}
        </g>
        <g class="mis"><circle cx="134" cy="236" r="80" fill="${GRN}" ${M}/></g>
        <g class="mis2"><circle cx="140" cy="230" r="72" fill="url(#dY)" ${M}/></g>
        <path d="M134 236 m-62 0 a62 62 0 1 1 62 62 a46 46 0 1 1 -46 -46 a32 32 0 1 1 32 32 a18 18 0 1 1 -18 -18 a8 8 0 1 1 8 8" fill="none" stroke="${INK}" stroke-width="3"/>
        <circle cx="134" cy="236" r="80" fill="none" stroke="${INK}" stroke-width="3.5"/>
        <path d="M56 336 Q150 296 254 336" stroke="${INK}" stroke-width="4" fill="${PINK}"/>
        <path d="M204 266 C224 240 216 180 192 132" stroke="${INK}" stroke-width="3" fill="none"/>
        ${stalks.map(([x0, y0, x1, y1]) => `<path d="M${x0} ${y0} Q${(x0 + x1) / 2 + 6} ${(y0 + y1) / 2 - 10} ${x1} ${y1}" stroke="${INK}" stroke-width="3" fill="none"/>`).join('')}
        ${stalks.map(([, , x1, y1], i) => eye(x1, y1, 9, i === 0 ? 30 : 60, g, { iris: GRN })).join('')}
      </g>`;
    },
    /* Grundvæversken: tall, striped robe, a tiny mask face tilted up at her lamp */
    vaever(g) {
      const turn = [0, 0, 1, 2][g];
      const mx = [164, 164, 156, 150][g];
      const eyes = turn === 0 ? (g === 0 ? `<path d="M${mx + 2} 46 q6 -5 12 0" fill="none" stroke="${INK}" stroke-width="2.4"/>` : eye(mx + 8, 47, 6, -50, 1, { iris: VIO }))
        : turn === 1 ? eye(mx + 4, 52, 7, -20, 2, { iris: VIO }) + `<path d="M${mx - 18} 52 q6 -4 12 0" fill="none" stroke="${INK}" stroke-width="2"/>`
        : eye(mx - 10, 56, 7, 0, 3, { iris: VIO }) + eye(mx + 12, 56, 7, 0, 3, { iris: VIO });
      return `${shadow(150, 354, 90)}
      <g class="sway">
        <g class="mis"><path d="M86 360 C80 280 96 190 118 132 C128 108 140 98 152 98 C166 98 180 108 188 132 C208 190 220 280 214 360Z" fill="url(#stripe)" ${M}/></g>
        <g class="mis2"><path d="M92 360 C86 284 102 196 122 140 L184 140 C204 196 214 284 208 360Z" fill="url(#lnB)" ${M} opacity=".8"/></g>
        <path d="M86 360 C80 280 96 190 118 132 C128 108 140 98 152 98 C166 98 180 108 188 132 C208 190 220 280 214 360Z" fill="none" stroke="${INK}" stroke-width="3.5"/>
        <path d="M168 124 C200 118 228 98 244 70" fill="none" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>
        <path d="M168 124 C200 118 228 98 244 70" fill="none" stroke="${YEL}" stroke-width="2.5" stroke-linecap="round"/>
        <g class="spin" style="transform-origin:250px 62px"><path d="M240 54 l20 0 l-6 18 l-8 0z" fill="${ORA}" stroke="${INK}" stroke-width="2.5"/></g>
        <path d="M128 82 C112 50 128 12 160 8 C190 6 204 30 196 46" fill="${VIO}" stroke="${INK}" stroke-width="3" ${M}/>
        <ellipse cx="${mx}" cy="52" rx="${turn === 2 ? 30 : 26}" ry="34" fill="#fff" stroke="${INK}" stroke-width="3" transform="rotate(${turn === 0 ? -14 : turn === 1 ? -6 : 0} ${mx} 52)"/>
        <circle cx="${mx - 12}" cy="70" r="5" fill="${PINK}" opacity=".7"/>
        ${eyes}
      </g>`;
    },
    /* Ikket: a hole on legs, with a pink halo, hopping */
    ikket(g) {
      const hx = g >= 3 ? 150 : g === 2 ? 142 : g === 1 ? 134 : 170, hy = g >= 3 ? 250 : 236;
      return `${shadow(150, 352, 54)}
      <g class="hop">
        <g stroke="${INK}" stroke-width="4" stroke-linecap="round" fill="none"><path d="M126 276 L110 316 L102 350"/><path d="M142 282 L140 322 L132 352"/><path d="M160 282 L166 324 L176 352"/><path d="M174 274 L194 314 L204 348"/></g>
        <g class="spin" style="transform-origin:150px 248px"><circle cx="150" cy="248" r="56" fill="none" stroke="${PINK}" stroke-width="8" stroke-dasharray="10 12" ${M}/></g>
        <circle cx="150" cy="248" r="42" fill="${INK}"/>
        <circle cx="146" cy="244" r="42" fill="none" stroke="${YEL}" stroke-width="4"/>
        <circle cx="${hx}" cy="${hy}" r="${g >= 3 ? 10 : 5}" fill="#fff"/>${g >= 3 ? `<circle cx="${hx}" cy="${hy}" r="4" fill="${INK}"/>` : ''}
      </g>`;
    },
    /* Den Bagvendte: huge and hairy, from behind; if it ever turns: the front of a house, all windows lit */
    bagvendt(g) {
      if (g >= 3) return `${shadow(150, 362, 140)}
        <g class="wob">
          <g class="mis"><path d="M30 362 C24 290 30 220 60 170 C84 134 120 118 150 118 C180 118 218 134 240 170 C270 220 276 290 270 362Z" fill="${VIO}" ${M}/></g>
          <path d="M66 362 L66 214 L150 150 L234 214 L234 362Z" fill="${ORA}" stroke="${INK}" stroke-width="4"/>
          <path d="M66 214 L150 150 L234 214" fill="none" stroke="${INK}" stroke-width="5"/>
          <g class="glow"><rect x="92" y="224" width="40" height="44" fill="${YEL}" stroke="${INK}" stroke-width="3.5"/><rect x="168" y="224" width="40" height="44" fill="${YEL}" stroke="${INK}" stroke-width="3.5"/></g>
          <path d="M92 246 h40 M112 224 v44 M168 246 h40 M188 224 v44" stroke="${INK}" stroke-width="3"/>
          <path d="M132 362 L132 300 Q150 282 168 300 L168 362Z" fill="${PINK}" stroke="${INK}" stroke-width="3.5"/>
          <circle cx="160" cy="330" r="3" fill="${INK}"/>
          <g class="sway" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"><path d="M150 120 C152 80 146 52 160 22"/><path d="M152 80 C168 70 178 56 194 52"/><path d="M150 96 C136 80 120 76 108 60"/></g>
        </g>`;
      return `${shadow(150, 364, 140)}
        <g class="wob">
          <g class="mis"><path d="M36 364 C28 300 26 236 48 184 C62 150 98 136 124 140 C136 126 158 124 172 138 C198 148 222 176 238 214 C258 262 264 310 260 364Z" fill="${VIO}" ${M}/></g>
          <g class="mis2"><path d="M44 364 C38 300 38 240 58 194 C76 160 108 150 132 152 C150 142 170 146 186 158 C210 172 230 206 242 246 C254 290 256 330 252 364Z" fill="url(#dP)" ${M}/></g>
          <path d="M36 364 C28 300 26 236 48 184 C62 150 98 136 124 140 C136 126 158 124 172 138 C198 148 222 176 238 214 C258 262 264 310 260 364Z" fill="none" stroke="${INK}" stroke-width="4"/>
          <g stroke="${INK}" stroke-width="2.2" fill="none" opacity=".75">${[70, 100, 132, 166, 204].map((x, i) => `<path d="M${x} ${190 - i * 6} C${x - 6} 260 ${x - 4} 320 ${x} 364"/>`).join('')}</g>
          <g class="sway" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"><path d="M150 132 C160 96 154 66 170 34"/><path d="M158 92 C176 84 186 70 202 66"/><path d="M170 34 C180 24 184 14 196 10"/><path d="M146 110 C132 94 118 88 108 72"/></g>
          <g class="sway" fill="${GRN}" stroke="${INK}" stroke-width="2"><circle cx="196" cy="10" r="6"/><circle cx="202" cy="66" r="6"/><circle cx="108" cy="72" r="6"/></g>
          <g class="win" fill="${YEL}" stroke="${INK}" stroke-width="2"><rect x="90" y="300" width="10" height="12"/><rect x="186" y="286" width="10" height="12"/><rect x="140" y="326" width="10" height="12"/></g>
        </g>`;
    },
    /* Husfolket: thumb-sized gossips with doors in their bellies */
    husfolk(g) {
      const folk = [[66, 300, 1, PINK], [108, 290, -1, YEL], [150, 304, 1, GRN], [194, 292, -1, ORA], [236, 306, -1, BLUE]];
      return folk.map(([x, y, d, c], i) => {
        const look = g >= 2 && i % 2 === 0 ? 3 : g >= 1 && i === 2 ? 1 : 0;
        return `<g class="hop" style="animation-delay:-${i * .17}s">${shadow(x, y + 52, 22)}
          <path d="M${x - 18} ${y + 50} C${x - 22} ${y + 8} ${x - 16} ${y - 28} ${x} ${y - 32} C${x + 16} ${y - 28} ${x + 22} ${y + 8} ${x + 18} ${y + 50}Z" fill="#fff" stroke="${INK}" stroke-width="3"/>
          <path d="M${x - 18} ${y + 50} C${x - 22} ${y + 8} ${x - 16} ${y - 28} ${x} ${y - 32}" fill="none" stroke="${c}" stroke-width="8" opacity=".7" ${M}/>
          <path d="M${x - 7} ${y + 50} L${x - 7} ${y + 24} Q${x} ${y + 16} ${x + 7} ${y + 24} L${x + 7} ${y + 50}Z" fill="${c}" stroke="${INK}" stroke-width="2.2"/>
          ${look >= 3 ? eye(x, y - 12, 6, 0, 3) : eye(x + d * 4, y - 12, 6, d > 0 ? 0 : 180, look)}</g>`;
      }).join('');
    },
    /* Spejlet: a pond standing on its edge, showing someone else, looking somewhere else */
    spejl(g) {
      return `${shadow(150, 352, 96)}
      <g class="wob">
        <g class="mis"><ellipse cx="150" cy="200" rx="90" ry="150" fill="${BLUE}" ${M}/></g>
        <g class="mis2"><ellipse cx="156" cy="194" rx="80" ry="138" fill="url(#dP)" ${M}/></g>
        <g class="rip" fill="none" stroke="#fff" stroke-width="3" opacity=".8"><path d="M86 150 q64 -14 128 0"/><path d="M78 214 q72 -14 144 0"/><path d="M90 280 q60 -12 120 0"/></g>
        <path d="M122 330 C120 250 130 172 150 132 C170 172 180 250 178 330Z" fill="${YEL}" opacity=".7" ${M}/>
        <ellipse cx="150" cy="200" rx="90" ry="150" fill="none" stroke="${INK}" stroke-width="4"/>
        ${ripple(g >= 2 ? 150 : 176, 112, g)}
      </g>`;
    },
    /* Sluget: a mouth on a stalk, chewing a word */
    sluget(g) {
      const hx = g >= 2 ? 140 : 166, ang = g >= 2 ? -8 : 16;
      return `${shadow(126, 356, 60)}
      <g class="sway">
        <path d="M120 360 C130 300 116 230 132 170 C140 140 152 120 ${hx - 6} 112" stroke="${INK}" stroke-width="30" fill="none" stroke-linecap="round"/>
        <path d="M120 360 C130 300 116 230 132 170 C140 140 152 120 ${hx - 6} 112" stroke="${ORA}" stroke-width="22" fill="none" stroke-linecap="round"/>
        <path d="M120 360 C130 300 116 230 132 170 C140 140 152 120 ${hx - 6} 112" stroke="url(#dP)" stroke-width="22" fill="none" stroke-linecap="round" ${M}/>
        <g transform="rotate(${ang} ${hx} 96)">
          <g class="mis"><ellipse cx="${hx}" cy="96" rx="52" ry="38" fill="${PINK}" ${M}/></g>
          <ellipse cx="${hx}" cy="96" rx="52" ry="38" fill="none" stroke="${INK}" stroke-width="3.5"/>
          <g class="chew"><path d="M${hx - 40} 100 C${hx - 20} 90 ${hx + 12} 92 ${hx + 44} 104 C${hx + 14} 124 ${hx - 22} 122 ${hx - 40} 100Z" fill="${INK}"/>
          <path d="M${hx - 26} 106 C${hx - 8} 114 ${hx + 8} 112 ${hx + 24} 106" fill="none" stroke="${YEL}" stroke-width="5" stroke-linecap="round"/></g>
          ${slit(hx + 18, 74, 14, g, -20)}
        </g>
      </g>`;
    },
    /* Mølen: a moth the size of a coat; the eyespots on its wings do the looking */
    moel(g) {
      const open = [0, 14, 30, 40][g];
      const wing = s => `<path d="M150 150 C${150 + s * (60 + open)} 110 ${150 + s * (110 + open)} 170 ${150 + s * (80 + open)} 300 C${150 + s * 40} 290 ${150 + s * 10} 250 150 230Z" fill="${s < 0 ? PINK : YEL}" stroke="${INK}" stroke-width="3" ${M}/>`;
      return `<g class="flt"><g class="flap">${wing(-1)}${wing(1)}</g>
          <path d="M150 150 C140 170 140 260 150 290 C160 260 160 170 150 150Z" fill="${INK}"/>
          <path d="M146 152 q-20 -40 -34 -50 M154 152 q20 -40 34 -50" fill="none" stroke="${INK}" stroke-width="3"/>
          <g class="mis2"><rect x="${150 - 80 - open}" y="190" width="${160 + open * 2}" height="70" fill="url(#dB)" ${M} opacity=".6"/></g>
          ${g >= 1 ? eye(150 - 50 - open * .6, 230, 11, 180, Math.min(3, g)) : ''}${g >= 2 ? eye(150 + 50 + open * .6, 230, 11, 0, g) : ''}</g>`;
    },
    /* Ungen: small, eager, umbrella ears, a lot of legs */
    unge(g) {
      const hx = g >= 2 ? 150 : 176;
      return `${shadow(150, 352, 70)}
      <g class="hop">
        <g class="sway"><path d="M${hx - 20} 196 C${hx - 70} 150 ${hx - 120} 150 ${hx - 140} 176 C${hx - 100} 176 ${hx - 60} 196 ${hx - 26} 214Z" fill="${PINK}" stroke="${INK}" stroke-width="3" ${M}/>
        <path d="M${hx + 18} 192 C${hx + 40} 140 ${hx + 70} 120 ${hx + 96} 130 C${hx + 70} 150 ${hx + 50} 180 ${hx + 30} 210Z" fill="${BLUE}" stroke="${INK}" stroke-width="3" ${M}/></g>
        <g class="mis"><path d="M96 330 C92 280 110 236 150 228 C190 236 208 280 204 330Z" fill="${YEL}" ${M}/></g>
        <path d="M96 330 C92 280 110 236 150 228 C190 236 208 280 204 330Z" fill="url(#dP)" stroke="${INK}" stroke-width="3.5" ${M}/>
        <path d="M150 228 C150 214 ${hx - 6} 206 ${hx} 200" stroke="${INK}" stroke-width="4" fill="none"/>
        <path d="M${hx - 30} 204 C${hx - 28} 182 ${hx + 28} 178 ${hx + 32} 204 C${hx + 28} 224 ${hx - 28} 226 ${hx - 30} 204Z" fill="#fff" stroke="${INK}" stroke-width="3"/>
        <g stroke="${INK}" stroke-width="3.2" stroke-linecap="round">${[104, 118, 132, 146, 160, 174, 188].map((x, i) => `<path d="M${x} 328 l${(i - 3) * 3} 24"/>`).join('')}</g>
        ${eye(hx - 12, 204, 7, 200, g)}${eye(hx + 14, 202, 5.5, 200, g)}
      </g>`;
    },

    /* Uret: a wardrobe on chicken legs; its face is a clock and the hands are its eyes. They point away from you */
    uret(g) {
      const ang = [60, 110, 180, 180][g], ang2 = [100, 140, 200, 160][g];
      return `${shadow(150, 354, 100)}
      <g class="hop">
        <g stroke="${INK}" stroke-width="5" stroke-linecap="round" fill="none" class="sway2"><path d="M112 300 L100 340 L84 350 M100 340 L104 354 M100 340 L116 352"/><path d="M188 300 L200 340 L216 350 M200 340 L196 354 M200 340 L184 352"/></g>
        <g class="mis"><rect x="84" y="70" width="132" height="232" fill="${ORA}" ${M}/></g>
        <g class="mis2"><rect x="92" y="78" width="132" height="232" fill="url(#dB)" ${M} opacity=".6"/></g>
        <rect x="84" y="70" width="132" height="232" fill="none" stroke="${INK}" stroke-width="4"/>
        <path d="M84 70 L150 30 L216 70" fill="${PINK}" stroke="${INK}" stroke-width="4" ${M}/>
        <rect x="138" y="40" width="24" height="20" fill="${YEL}" stroke="${INK}" stroke-width="3"/>
        <g class="spin2" style="transform-origin:150px 150px"><circle cx="150" cy="150" r="50" fill="#fff" stroke="${INK}" stroke-width="4"/>
        ${Array.from({ length: 12 }, (_, i) => `<path d="M150 104 V${i % 3 ? 110 : 116}" stroke="${INK}" stroke-width="3" transform="rotate(${i * 30} 150 150)"/>`).join('')}</g>
        <path d="M150 150 L150 116" stroke="${PINK}" stroke-width="7" stroke-linecap="round" transform="rotate(${ang} 150 150)"/>
        <path d="M150 150 L150 106" stroke="${INK}" stroke-width="4" stroke-linecap="round" transform="rotate(${ang2} 150 150)"/>
        ${g >= 3 ? `<circle cx="150" cy="150" r="9" fill="${PINK}" stroke="${INK}" stroke-width="2"/><circle cx="150" cy="150" r="4" fill="${INK}"/>` : `<circle cx="150" cy="150" r="5" fill="${INK}"/>`}
        <rect x="110" y="220" width="80" height="64" fill="${YEL}" stroke="${INK}" stroke-width="3" ${M}/>
        <g class="swing" style="transform-origin:150px 222px"><line x1="150" y1="222" x2="150" y2="268" stroke="${INK}" stroke-width="3"/><circle cx="150" cy="272" r="9" fill="${PINK}" stroke="${INK}" stroke-width="3"/></g>
      </g>`;
    },
    /* Savnet: a striped balloon with no eyes, only a mouth that turns. Missed things hang from it on strings */
    savnet(g) {
      const mx = [214, 196, 170, 150][g], sq = [.35, .55, .8, 1][g];
      return `<g class="flt">
        <g stroke="${INK}" stroke-width="2" fill="none" class="sway"><path d="M140 250 C130 280 150 300 136 330"/><path d="M160 250 C170 290 154 300 168 336"/><path d="M150 254 L150 300"/></g>
        <g class="sway" stroke="${INK}" stroke-width="2.5"><rect x="124" y="328" width="22" height="18" fill="${GRN}"/><path d="M160 336 l16 0 l-3 14 l-10 0z" fill="${ORA}"/><circle cx="150" cy="306" r="7" fill="${YEL}"/></g>
        <g class="mis"><ellipse cx="150" cy="150" rx="104" ry="108" fill="url(#stripe)" ${M}/></g>
        <g class="mis2"><ellipse cx="160" cy="140" rx="70" ry="74" fill="url(#dB)" opacity=".5" ${M}/></g><ellipse cx="112" cy="104" rx="20" ry="30" fill="#fff" opacity=".6" transform="rotate(30 112 104)"/>
        <ellipse cx="150" cy="150" rx="104" ry="108" fill="none" stroke="${INK}" stroke-width="4"/>
        <path d="M140 256 L150 248 L160 256Z" fill="${PINK}" stroke="${INK}" stroke-width="3"/>
        <g class="chew"><path d="M${mx - 26 * sq} 176 Q${mx} ${176 + 22 * sq} ${mx + 26 * sq} 176 Q${mx} ${176 + 6} ${mx - 26 * sq} 176Z" fill="${INK}"/>${g >= 3 ? `<path d="M${mx - 8} 186 q8 8 16 0" fill="${PINK}"/>` : ''}</g>
        <g fill="${PINK}" opacity=".6"><circle cx="${mx - 34 * sq}" cy="166" r="${9 * sq}"/><circle cx="${mx + 34 * sq}" cy="166" r="${9 * sq}"/></g>
      </g>`;
    },
    /* Timerne: the hours, small and woolly, with a clock in the belly and slit eyes */
    timerne(g) {
      const herd = [[60, 300, 1], [118, 284, -1], [176, 304, 1], [234, 288, -1]];
      return herd.map(([x, y, d], i) => `<g class="hop" style="animation-delay:-${i * .23}s">${shadow(x, y + 46, 30)}
        <g stroke="${INK}" stroke-width="3" stroke-linecap="round"><path d="M${x - 14} ${y + 26} v18 M${x + 14} ${y + 26} v18"/></g>
        <g class="mis"><ellipse cx="${x}" cy="${y}" rx="34" ry="28" fill="${[PINK, YEL, GRN, BLUE][i]}" ${M}/></g>
        <path d="M${x - 34} ${y} ${Array.from({ length: 10 }, (_, k) => { const a = Math.PI + k * Math.PI / 9; return `Q${(x + Math.cos(a - .17) * 42).toFixed(0)} ${(y + Math.sin(a - .17) * 34).toFixed(0)} ${(x + Math.cos(a) * 34).toFixed(0)} ${(y + Math.sin(a) * 28).toFixed(0)}`; }).join(' ')} L${x + 34} ${y} Q${x} ${y + 40} ${x - 34} ${y}Z" fill="none" stroke="${INK}" stroke-width="3"/>
        <circle cx="${x}" cy="${y + 6}" r="12" fill="#fff" stroke="${INK}" stroke-width="2.4"/><path d="M${x} ${y + 6} v-8 M${x} ${y + 6} l${5 + i} 3" stroke="${INK}" stroke-width="2"/>
        ${slit(x + d * 18, y - 14, 7, Math.min(g, i % 2 ? g : Math.max(0, g - 1)), d * 20)}</g>`).join('');
    },
    /* Mølen, before it has arrived: a cocoon hanging upside down, with a compound eye of tiny windows */
    kokon(g) {
      return `<line x1="150" y1="0" x2="150" y2="60" stroke="${INK}" stroke-width="3"/>
      <g class="sway2" style="transform-origin:150px 60px">
        <g class="mis"><path d="M150 60 C210 80 220 200 196 280 C184 320 116 320 104 280 C80 200 90 80 150 60Z" fill="${YEL}" ${M}/></g>
        <path d="M150 60 C210 80 220 200 196 280 C184 320 116 320 104 280 C80 200 90 80 150 60Z" fill="url(#lnP)" stroke="${INK}" stroke-width="4"/>
        ${[100, 140, 180, 220, 260].map(y => `<path d="M${100 + (y - 100) * .02} ${y} Q150 ${y + 14} ${200 - (y - 100) * .02} ${y}" fill="none" stroke="${INK}" stroke-width="2"/>`).join('')}
        ${compound(g >= 2 ? 150 : 176, 210, 30, g)}
      </g>`;
    },
    /* Ungen, four hundred times over (the same Tuesday) */
    ungerne(g) {
      const one = C.unge(g);
      return [[-70, 30, .55], [70, 40, .55], [0, 10, .7], [-120, 60, .4], [120, 64, .4]].map(([dx, dy, sc], i) => `<g transform="translate(${150 + dx - 150 * sc} ${dy + 360 - 360 * sc - 20}) scale(${sc})" style="opacity:${1 - i * .12}">${one}</g>`).join('');
    },
    /* Huset: what Den Bagvendte became, small and on legs, one vertical eye in the door */
    huset(g) {
      return `${shadow(150, 352, 90)}
      <g class="hop">
        <g stroke="${INK}" stroke-width="5" stroke-linecap="round" class="sway2"><path d="M110 300 l-14 48"/><path d="M190 300 l14 48"/><path d="M150 300 l0 50"/></g>
        <g class="mis"><path d="M70 300 L70 170 L150 100 L230 170 L230 300Z" fill="${ORA}" ${M}/></g>
        <path d="M70 300 L70 170 L150 100 L230 170 L230 300Z" fill="url(#dY)" stroke="${INK}" stroke-width="4"/>
        <path d="M60 176 L150 96 L240 176" fill="none" stroke="${INK}" stroke-width="6"/>
        <rect x="88" y="190" width="34" height="34" fill="${YEL}" stroke="${INK}" stroke-width="3"/><rect x="178" y="190" width="34" height="34" fill="${YEL}" stroke="${INK}" stroke-width="3"/>
        <path d="M128 300 L128 236 Q150 220 172 236 L172 300Z" fill="${PINK}" stroke="${INK}" stroke-width="3.5"/>
        <g transform="rotate(90 150 262)">${slit(150, 262, 18, g, g >= 2 ? 0 : 25)}</g>
        <g class="flt" fill="${BLUE}" opacity=".7"><circle cx="210" cy="80" r="8"/><circle cx="222" cy="60" r="11"/><circle cx="238" cy="36" r="14"/></g>
      </g>`;
    },
    /* HVORNÅR: a door that asks. Its keyhole is its eye */
    hvornaar(g) {
      return `${shadow(150, 352, 80)}
      <g class="wob">
        <g class="mis"><rect x="86" y="40" width="128" height="310" fill="${VIO}" ${M}/></g>
        <rect x="86" y="40" width="128" height="310" fill="url(#lnB)" stroke="${INK}" stroke-width="4"/>
        <rect x="104" y="64" width="92" height="110" fill="none" stroke="${INK}" stroke-width="3"/><rect x="104" y="196" width="92" height="130" fill="none" stroke="${INK}" stroke-width="3"/>
        <text x="150" y="128" text-anchor="middle" font-family="Rubik Mono One, monospace" font-size="15" fill="${YEL}" stroke="${INK}" stroke-width="1">HVOR</text><text x="150" y="150" text-anchor="middle" font-family="Rubik Mono One, monospace" font-size="15" fill="${YEL}" stroke="${INK}" stroke-width="1">NÅR?</text>
        <circle cx="184" cy="250" r="10" fill="${YEL}" stroke="${INK}" stroke-width="3"/>
        <g transform="rotate(90 150 262)">${slit(150, 262, 20, g, -30)}</g>
      </g>`;
    },
  };
  function creature(name, g = 0, plate = false) {
    const body = (C[name] || C.ikket)(g);
    const bg = plate ? `<rect width="300" height="360" fill="${PAPER}"/><rect x="10" y="10" width="280" height="340" fill="none" stroke="${PINK}" stroke-width="3" stroke-dasharray="2 6"/>` : '';
    const vb = name === 'bagvendt' && !plate ? '0 -20 300 384' : '0 0 300 366';
    return `<svg class="creature-svg ${plate ? 'plate-svg' : ''}" viewBox="${vb}" preserveAspectRatio="xMidYMax meet"><defs>${DEFS}</defs>${bg}${body}</svg>`;
  }

  /* ---------------- you: a plate printed from what you have said and caught ---------------- */
  function self(G, marks = 0, mini = false) {
    const b = k => G.boons.includes(k);
    let s = `<rect width="300" height="360" fill="${PAPER}"/><rect width="300" height="360" fill="url(#dY)" opacity=".35"/>`;
    s += `<g class="mis"><path d="M150 60 C200 60 210 120 204 180 C198 250 186 300 150 320 C114 300 102 250 96 180 C90 120 100 60 150 60Z" fill="${G.flags.Areason ? BLUE : '#c9c4dc'}" ${M} opacity=".75"/></g>`;
    s += `<g class="mis2"><path d="M150 70 C194 72 200 126 196 180 C190 244 180 290 150 306 C120 290 110 244 104 180 C100 126 106 72 150 70Z" fill="url(#dP)" ${M}/></g>`;
    s += `<path d="M150 60 C200 60 210 120 204 180 C198 250 186 300 150 320 C114 300 102 250 96 180 C90 120 100 60 150 60Z" fill="none" stroke="${INK}" stroke-width="3.5" stroke-dasharray="${G.flags.Areason ? '0' : '6 6'}"/>`;
    if (b('moenster')) s += `<g font-family="Rubik Mono One, monospace" font-size="9" fill="${INK}" opacity=".8"><text x="112" y="150">FORDI JEG</text><text x="116" y="168">IKKE KUNNE</text><text x="118" y="186">BLIVE DER</text></g>`;
    if (b('anker')) s += `<path d="M150 200 L150 250" stroke="${INK}" stroke-width="3"/><path d="M132 250 C128 272 140 286 152 284 C168 282 172 262 164 250Z" fill="${ORA}" stroke="${INK}" stroke-width="3"/>`;
    if (b('traad')) s += `<path d="M170 150 C210 140 240 160 288 128" fill="none" stroke="${PINK}" stroke-width="5" stroke-linecap="round"/>`;
    if (b('laant')) s += `<g fill="${YEL}" stroke="${INK}" stroke-width="2.5"><path d="M124 232 L124 198 L150 178 L176 198 L176 232Z"/><rect x="144" y="212" width="12" height="20" fill="${PINK}"/></g>`;
    if (b('vaev')) s += `<path d="M96 200 q-16 6 -6 20 q12 6 16 -4" fill="none" stroke="${GRN}" stroke-width="5"/>`;
    if (b('doer')) s += `<path d="M234 300 L234 250 Q250 236 266 250 L266 300Z" fill="${GRN}" stroke="${INK}" stroke-width="3"/>`;
    if (b('ikket')) s += `<circle cx="150" cy="128" r="9" fill="${INK}"/><circle cx="148" cy="126" r="9" fill="none" stroke="${YEL}" stroke-width="2"/>`;
    s += b('blik') ? eye(150, 104, 10, 0, 3) : `<path d="M138 104 q12 -8 24 0" fill="none" stroke="${INK}" stroke-width="3"/>`;
    let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    const cols = [PINK, ORA, GRN, INK];
    for (let i = 0; i < Math.min(60, marks); i++) { const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()), x = 150 + Math.cos(a) * r * 44, y = 190 + Math.sin(a) * r * 110; s += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="5" height="5" transform="rotate(${(rnd() * 90).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${cols[i % 4]}"/>`; }
    if (!mini) s += `<g font-family="Rubik Mono One, monospace" fill="${INK}"><text x="22" y="40" font-size="13">DIG · ?</text><text x="22" y="342" font-size="10">SPOR ${G.glimpses.length}</text><text x="278" y="342" font-size="10" text-anchor="end">AFTRYK ${marks}</text></g>`;
    return `<svg class="self-svg" viewBox="0 0 300 360"><defs>${DEFS}</defs>${s}</svg>`;
  }

  /* ---------------- scenes (393 × 560, portrait) ---------------- */
  const sun = (x, y, r, c = YEL) => `<g class="spin" style="transform-origin:${x}px ${y}px"><g stroke="${INK}" stroke-width="4" stroke-linecap="round">${Array.from({ length: 10 }, (_, i) => { const a = i * Math.PI / 5; return `<line x1="${(x + Math.cos(a) * (r + 8)).toFixed(1)}" y1="${(y + Math.sin(a) * (r + 8)).toFixed(1)}" x2="${(x + Math.cos(a) * (r + 22)).toFixed(1)}" y2="${(y + Math.sin(a) * (r + 22)).toFixed(1)}"/>`; }).join('')}</g></g>
    <g class="mis"><circle cx="${x}" cy="${y}" r="${r}" fill="${c}" ${M}/></g><circle cx="${x + 4}" cy="${y - 3}" r="${r}" fill="none" stroke="${INK}" stroke-width="3"/>`;
  const confetti = (n, y0, y1, seedN = 1) => { let s = '', seed = seedN * 977; const r = () => (seed = (seed * 9301 + 49297) % 233280) / 233280; const cs = [PINK, BLUE, YEL, GRN, ORA]; for (let i = 0; i < n; i++) { const x = r() * 393, y = y0 + r() * (y1 - y0); s += `<rect class="conf" style="animation-delay:-${(r() * 6).toFixed(1)}s" x="${x.toFixed(0)}" y="${y.toFixed(0)}" width="${(4 + r() * 6).toFixed(0)}" height="${(3 + r() * 4).toFixed(0)}" fill="${cs[i % 5]}" transform="rotate(${(r() * 90).toFixed(0)} ${x.toFixed(0)} ${y.toFixed(0)})"/>`; } return `<g>${s}</g>`; };
  const towers = y => `<g class="mis2" ${M}><path d="M30 ${y} L40 ${y - 150} Q46 ${y - 172} 52 ${y - 150} L60 ${y}Z" fill="${BLUE}" opacity=".6"/><path d="M92 ${y} L100 ${y - 90} Q104 ${y - 106} 108 ${y - 90} L114 ${y}Z" fill="${GRN}" opacity=".6"/><path d="M270 ${y} L280 ${y - 120} Q286 ${y - 140} 292 ${y - 120} L300 ${y}Z" fill="${VIO}" opacity=".6"/><path d="M330 ${y} L336 ${y - 70} Q340 ${y - 82} 344 ${y - 70} L350 ${y}Z" fill="${BLUE}" opacity=".6"/></g>
    <g class="nite" fill="${YEL}"><rect x="44" y="${y - 120}" width="4" height="6"/><rect x="100" y="${y - 60}" width="3" height="5"/><rect x="284" y="${y - 90}" width="4" height="6"/></g>`;
  const paper = (c = PAPER) => `<rect width="393" height="560" fill="${c}"/>`;
  const fallen = y => `<g class="flt" fill="#fff" stroke="${INK}" stroke-width="2.4"><path d="M50 ${y} q18 -10 36 0 q-18 7 -36 0z" fill="${PINK}"/><path d="M110 ${y + 18} l18 -14 l5 5 l-18 14z" fill="${YEL}"/><circle cx="300" cy="${y + 8}" r="8" fill="${GRN}"/><path d="M250 ${y + 22} q8 -18 16 0" fill="${ORA}"/><path d="M180 ${y - 10} l4 -14 l4 14z" fill="${BLUE}"/><path d="M330 ${y + 36} q12 -8 24 0 q-12 8 -24 0z"/></g>`;

  const SCENES = {
    void() {
      return `${paper(VIO)}<g ${M}><rect y="0" width="393" height="140" fill="${PINK}" opacity=".6"/><rect y="200" width="393" height="120" fill="${YEL}" opacity=".5"/><rect y="380" width="393" height="180" fill="${BLUE}" opacity=".5"/></g>
        <g class="fall">${[[60, 80, PINK], [300, 30, YEL], [180, 200, GRN], [90, 330, ORA], [320, 400, PINK], [220, 470, YEL]].map(([x, y, c], i) => `<g style="animation-delay:-${i * .7}s" class="fall1"><rect x="${x}" y="${y}" width="22" height="22" fill="${c}" stroke="${INK}" stroke-width="3" transform="rotate(${i * 30} ${x + 11} ${y + 11})"/></g>`).join('')}</g>
        <path d="M150 300 l18 -50 l8 50z" fill="${YEL}" stroke="${INK}" stroke-width="3" class="spin" style="transform-origin:163px 280px"/>${confetti(50, 0, 560, 2)}`;
    },
    bottom() {
      return `${paper()}<g class="mis2"><rect width="393" height="330" fill="url(#dB)" opacity=".35" ${M}/></g>${sun(300, 100, 46)}${towers(330)}
        <g class="mis"><path d="M0 340 Q100 300 200 336 T393 324 V560 H0Z" fill="${PINK}" ${M}/></g>
        <g class="mis2"><path d="M0 400 Q120 370 240 400 T393 390 V560 H0Z" fill="${YEL}" ${M}/></g>
        <path d="M0 340 Q100 300 200 336 T393 324" fill="none" stroke="${INK}" stroke-width="3"/>
        ${fallen(440)}${confetti(30, 60, 300, 3)}`;
    },
    road() {
      return `${paper()}${sun(80, 90, 34, ORA)}${towers(360)}
        <g class="mis"><path d="M0 380 Q200 340 393 380 V560 H0Z" fill="${GRN}" ${M}/></g>
        <g class="mis2"><path d="M150 560 Q180 470 196 384 L226 384 Q232 470 260 560Z" fill="${YEL}"/></g>
        <path d="M150 560 Q180 470 196 384 M260 560 Q232 470 226 384" fill="none" stroke="${INK}" stroke-width="3"/>
        <g class="flt"><circle cx="320" cy="160" r="18" fill="${YEL}" stroke="${INK}" stroke-width="3"/><rect x="40" y="220" width="22" height="22" fill="${BLUE}" stroke="${INK}" stroke-width="3" transform="rotate(20 51 231)"/></g>${confetti(24, 80, 360, 4)}`;
    },
    plain() {
      return `${paper()}${sun(300, 120, 58)}${towers(380)}
        <g class="mis"><path d="M0 380 Q200 368 393 384 V560 H0Z" fill="${PINK}" ${M}/></g>
        <g class="mis2"><path d="M0 420 Q200 400 393 424 V560 H0Z" fill="url(#dP)" ${M}/></g>
        <path d="M0 380 Q200 368 393 384" fill="none" stroke="${INK}" stroke-width="3"/>
        <g class="flt" stroke="${INK}" stroke-width="2.4"><path d="M40 470 q14 -20 28 0" fill="${YEL}"/><path d="M330 500 q10 -16 20 0" fill="${GRN}"/></g>${confetti(36, 60, 540, 5)}`;
    },
    stair() {
      const steps = 'M150 470 L150 430 L190 430 L190 390 L230 390 L230 350 L270 350 L270 310 L310 310 L310 270 L330 240 L340 200 L338 160 L326 126 L306 104';
      return `${paper()}<g class="mis2"><rect width="393" height="560" fill="url(#dY)" opacity=".5" ${M}/></g>
        <g class="mis"><path d="M20 470 L20 170 Q20 110 76 110 Q132 110 132 170 L132 470Z" fill="${PINK}" ${M}/></g>
        <path d="M40 470 L40 182 Q40 136 76 136 Q112 136 112 182 L112 470Z" fill="${VIO}" stroke="${INK}" stroke-width="3"/>
        <g class="mis"><path d="${steps} L340 470Z" fill="${BLUE}" ${M}/></g>
        <path d="${steps}" fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>
        <ellipse cx="300" cy="102" rx="16" ry="8" fill="${INK}"/>
        <path d="M0 470 L393 470 L393 560 L0 560Z" fill="${GRN}" stroke="${INK}" stroke-width="3" ${M}/>
        <rect y="470" width="393" height="90" fill="url(#check)" opacity=".5" ${M}/>
        <line x1="236" y1="0" x2="236" y2="58" stroke="${INK}" stroke-width="3"/>${sun(236, 84, 22)}${confetti(18, 20, 300, 6)}`;
    },
    nest() {
      return `${paper(YEL)}<g class="mis2"><rect width="393" height="560" fill="url(#dP)" opacity=".4" ${M}/></g>
        <g class="mis"><ellipse cx="196" cy="300" rx="170" ry="230" fill="${ORA}" ${M}/></g>
        <ellipse cx="196" cy="320" rx="136" ry="188" fill="${PINK}" stroke="${INK}" stroke-width="4"/>
        <ellipse cx="196" cy="340" rx="104" ry="138" fill="${VIO}" stroke="${INK}" stroke-width="3"/>
        <g class="spin" style="transform-origin:196px 340px"><ellipse cx="196" cy="340" rx="78" ry="104" fill="none" stroke="${YEL}" stroke-width="5" stroke-dasharray="6 14"/></g>
        <path d="M90 470 Q196 420 302 470 L302 560 L90 560Z" fill="${GRN}" stroke="${INK}" stroke-width="3"/>${confetti(20, 40, 520, 7)}`;
    },
    hall() { return SCENES.hallBase(false); },
    hall_torn() { return SCENES.hallBase(true); },
    hallBase(torn) {
      const cs = [PINK, BLUE, YEL, GRN, ORA, VIO];
      const threads = Array.from({ length: 26 }, (_, i) => { const x = 14 + i * 14.6, cut = torn && i % 3 === 1; return `<line class="${i % 2 ? 'sway' : 'sway2'}" x1="${x}" y1="0" x2="${x + (i % 3 - 1) * 6}" y2="${cut ? 160 + (i * 37) % 140 : 466}" stroke="${cs[i % 6]}" stroke-width="${i % 3 ? 4 : 6}" ${M}/>`; }).join('');
      return `${paper()}<g class="mis2"><path d="M0 0 L0 466 L40 466 L40 150 Q90 60 140 150 L140 466 L250 466 L250 150 Q300 60 350 150 L350 466 L393 466 L393 0Z" fill="url(#dY)" ${M}/></g>
        <path d="M40 466 L40 150 Q90 60 140 150 L140 466 M250 466 L250 150 Q300 60 350 150 L350 466" fill="none" stroke="${INK}" stroke-width="4"/>
        ${threads}<line x1="300" y1="0" x2="300" y2="96" stroke="${INK}" stroke-width="3"/>${sun(300, 116, 16, ORA)}
        <path d="M0 466 L393 466 L393 560 L0 560Z" fill="url(#stripe)" ${M}/><path d="M0 466 H393" stroke="${INK}" stroke-width="4"/>
        ${torn ? `<g fill="${INK}"><ellipse cx="90" cy="500" rx="40" ry="12"/><ellipse cx="240" cy="520" rx="56" ry="15"/><ellipse cx="340" cy="490" rx="22" ry="7"/><ellipse cx="170" cy="485" rx="14" ry="5"/></g>${confetti(70, 0, 560, 8)}` : confetti(12, 0, 400, 9)}`;
    },
    ponds() {
      return `${paper()}${sun(80, 100, 36, PINK)}${towers(320)}
        <g class="mis"><path d="M0 320 Q200 300 393 320 V560 H0Z" fill="${YEL}" ${M}/></g>
        <path d="M0 320 Q200 300 393 320" fill="none" stroke="${INK}" stroke-width="3"/>
        ${[[70, 440, 66, GRN], [196, 474, 72, BLUE], [324, 440, 62, VIO]].map(([x, y, rx, c]) => `<g class="mis2"><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx * .34}" fill="${c}" ${M}/></g><ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${rx * .34}" fill="none" stroke="${INK}" stroke-width="3"/><g class="rip"><ellipse cx="${x}" cy="${y}" rx="${rx * .5}" ry="${rx * .15}" fill="none" stroke="#fff" stroke-width="2.5"/></g>`).join('')}
        ${confetti(20, 60, 300, 10)}`;
    },
    market() {
      const stall = (x, y, h, c, i) => `<g class="sway" style="animation-delay:-${i * .4}s"><line x1="${x + 35}" y1="0" x2="${x + 35}" y2="${y}" stroke="${INK}" stroke-width="3"/>
        <path d="M${x} ${y} L${x + 70} ${y} L${x + 60} ${y + h} L${x + 10} ${y + h}Z" fill="${c}" stroke="${INK}" stroke-width="3" ${M}/>
        <g fill="${INK}"><circle cx="${x + 20}" cy="${y + h - 14}" r="6"/><circle cx="${x + 36}" cy="${y + h - 10}" r="7"/><circle cx="${x + 52}" cy="${y + h - 14}" r="5"/></g></g>`;
      const flags = Array.from({ length: 12 }, (_, i) => `<path d="M${i * 34} 40 l17 26 l17 -26z" fill="${[PINK, YEL, BLUE, GRN][i % 4]}" stroke="${INK}" stroke-width="2" ${M}/>`).join('');
      return `${paper(ORA)}<g class="mis2"><rect width="393" height="560" fill="url(#dY)" opacity=".5" ${M}/></g>
        <path d="M0 40 Q196 60 393 40" fill="none" stroke="${INK}" stroke-width="2"/><g class="sway2">${flags}</g>
        ${stall(20, 130, 90, PINK, 0)}${stall(290, 150, 80, BLUE, 1)}${stall(156, 110, 70, GRN, 2)}
        <g class="mis"><path d="M0 400 Q200 380 393 404 V560 H0Z" fill="${VIO}" ${M}/></g><path d="M0 400 Q200 380 393 404" fill="none" stroke="${INK}" stroke-width="3"/>${confetti(40, 80, 540, 11)}`;
    },
    enge() {
      const grass = Array.from({ length: 40 }, (_, i) => { const x = (i * 37) % 393, y = 380 + (i * 53) % 170; return `<path class="${i % 2 ? 'sway' : 'sway2'}" d="M${x} ${y} q4 -16 0 -26 M${x + 6} ${y} q-2 -14 4 -22" stroke="${INK}" stroke-width="2" fill="none"/>`; }).join('');
      return `${paper()}<g class="mis2"><rect width="393" height="360" fill="url(#dP)" opacity=".3" ${M}/></g>
        <g class="spin" style="transform-origin:300px 110px"><circle cx="300" cy="110" r="70" fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="4 10"/></g>${sun(300, 110, 40, YEL)}
        <g stroke="${INK}" stroke-width="3"><line x1="300" y1="110" x2="300" y2="82"/><line x1="300" y1="110" x2="322" y2="118" class="spin" style="transform-origin:300px 110px"/></g>
        ${towers(350)}
        <g class="mis"><path d="M0 360 Q120 330 220 356 T393 346 V560 H0Z" fill="${GRN}" ${M}/></g>
        <g class="mis2"><path d="M0 420 Q160 396 393 430 V560 H0Z" fill="url(#dY)" ${M}/></g>
        <path d="M0 360 Q120 330 220 356 T393 346" fill="none" stroke="${INK}" stroke-width="3"/>${grass}${confetti(20, 60, 340, 12)}`;
    },
    himmel() {
      const cloud = (x, y, s, c) => `<g class="flt" style="animation-delay:-${x % 3}s"><g class="mis"><path d="M${x} ${y} q${10 * s} ${-24 * s} ${30 * s} ${-12 * s} q${14 * s} ${-26 * s} ${40 * s} ${-6 * s} q${26 * s} ${-6 * s} ${26 * s} ${18 * s}Z" fill="${c}" ${M}/></g><path d="M${x} ${y} q${10 * s} ${-24 * s} ${30 * s} ${-12 * s} q${14 * s} ${-26 * s} ${40 * s} ${-6 * s} q${26 * s} ${-6 * s} ${26 * s} ${18 * s}Z" fill="none" stroke="${INK}" stroke-width="3"/></g>`;
      return `${paper('#bfe8ff')}<g class="mis2"><rect width="393" height="560" fill="url(#dB)" opacity=".35" ${M}/></g>
        ${cloud(20, 120, 1.4, '#fff')}${cloud(250, 90, 1, PINK)}${cloud(60, 300, 1.1, YEL)}${cloud(240, 400, 1.6, '#fff')}${cloud(10, 500, 1, GRN)}
        <g class="fall1" style="animation-duration:5s"><path d="M120 0 l10 18 l-20 0z" fill="${ORA}" stroke="${INK}" stroke-width="2"/></g>
        <g class="fall1" style="animation-duration:6.5s;animation-delay:-2s"><rect x="300" y="0" width="16" height="12" fill="${PINK}" stroke="${INK}" stroke-width="2"/></g>
        ${confetti(30, 0, 560, 13)}`;
    },
    doere() {
      const door = (x, c, lab, i) => `<g class="wob" style="animation-delay:-${i * .4}s"><g class="mis"><rect x="${x}" y="190" width="96" height="250" fill="${c}" ${M}/></g>
        <rect x="${x}" y="190" width="96" height="250" fill="none" stroke="${INK}" stroke-width="4"/><rect x="${x + 14}" y="214" width="68" height="80" fill="none" stroke="${INK}" stroke-width="2.5"/>
        <circle cx="${x + 78}" cy="330" r="7" fill="${YEL}" stroke="${INK}" stroke-width="2.5"/>
        <rect x="${x + 6}" y="150" width="84" height="30" fill="#fff" stroke="${INK}" stroke-width="3" transform="rotate(${i % 2 ? 3 : -3} ${x + 48} 165)"/>
        <text x="${x + 48}" y="172" text-anchor="middle" font-family="Rubik Mono One, monospace" font-size="${lab.length > 4 ? 12 : 16}" fill="${INK}">${lab}</text></g>`;
      return `${paper()}<g class="mis2"><rect width="393" height="560" fill="url(#dY)" opacity=".5" ${M}/></g>
        <path d="M0 440 L393 440 L393 560 L0 560Z" fill="url(#check)" ${M}/><path d="M0 440 H393" stroke="${INK}" stroke-width="4"/>
        ${door(20, PINK, 'DA', 0)}${door(148, GRN, 'NÅR', 1)}${door(276, VIO, 'HVORNÅR', 2)}
        <line x1="196" y1="0" x2="196" y2="70" stroke="${INK}" stroke-width="3"/>${sun(196, 96, 20, ORA)}${confetti(16, 0, 140, 14)}`;
    },
    forgaars() {
      // yesterday-before-yesterday: the same Hertil, upside down and in the wrong inks
      return `${paper('#d9f5e4')}<g transform="rotate(180 196 280)"><g class="mis"><path d="M0 340 Q100 300 200 336 T393 324 V560 H0Z" fill="${VIO}" ${M}/></g>
        <g class="mis2"><path d="M0 400 Q120 370 240 400 T393 390 V560 H0Z" fill="${GRN}" ${M}/></g>${towers(330)}${fallen(440)}</g>
        ${sun(90, 470, 40, PINK)}
        <g font-family="Rubik Mono One, monospace" font-size="13" fill="${INK}" opacity=".5"><text x="250" y="520" transform="rotate(-8 250 520)">I FORGÅRS</text></g>${confetti(30, 0, 560, 15)}`;
    },
    map() {
      return `${paper()}<rect width="393" height="560" fill="url(#dY)" opacity=".35"/>
        <g ${M}><ellipse cx="290" cy="134" rx="90" ry="50" fill="${PINK}" opacity=".55"/><ellipse cx="173" cy="448" rx="60" ry="22" fill="${GRN}" opacity=".6"/><ellipse cx="86" cy="200" rx="60" ry="46" fill="${BLUE}" opacity=".45"/><ellipse cx="196" cy="280" rx="70" ry="40" fill="${ORA}" opacity=".35"/><ellipse cx="118" cy="350" rx="50" ry="36" fill="${YEL}" opacity=".9"/></g>
        <g fill="none" stroke="${INK}" stroke-width="1.4" opacity=".5" stroke-dasharray="3 6">${[60, 100, 140, 180].map(r => `<ellipse cx="196" cy="280" rx="${r * 1.2}" ry="${r * 1.5}"/>`).join('')}</g>
        <g font-family="Rubik Mono One, monospace" font-size="11" fill="${INK}" opacity=".7"><text x="16" y="546">HERTIL · 1 : ?</text></g>`;
    },
    title() { return SCENES.plain() + C.bagvendt(0).replace(/<ellipse[^>]*opacity=".35"[^>]*\/>/, '').replace('<g class="wob">', '<g class="wob" transform="translate(122 196) scale(.5)">'); },
  };

  // the light of Hertil: Gult (as printed), Lyserødt (pink wash), Blåt (blue wash), Lilla nat (violet night, inks glow)
  const FIXED = { void: 1, map: 0, title: 0 };
  const INDOOR = ['nest', 'hall', 'hall_torn', 'stair', 'doere'];
  const GRADE = [
    '',
    `<rect width="393" height="560" fill="${PINK}" opacity=".22" ${M}/>`,
    `<rect width="393" height="560" fill="${BLUE}" opacity=".28" ${M}/>`,
    `<rect width="393" height="560" fill="#3a1a6a" opacity=".62" ${M}/><rect width="393" height="560" fill="${PINK}" opacity=".08" style="mix-blend-mode:screen"/>`,
  ];
  const GRADE_IN = ['', `<rect width="393" height="560" fill="${PINK}" opacity=".12" ${M}/>`, `<rect width="393" height="560" fill="${BLUE}" opacity=".14" ${M}/>`, `<rect width="393" height="560" fill="#3a1a6a" opacity=".4" ${M}/>`];
  function scene(name, ph = 0) {
    const P = FIXED[name] !== undefined ? FIXED[name] : ph;
    const body = (SCENES[name] || SCENES.bottom)();
    const out = !INDOOR.includes(name);
    const grade = name === 'map' ? ['', GRADE_IN[1], GRADE_IN[2], GRADE_IN[3]][ph] : name === 'void' ? '' : (out ? GRADE : GRADE_IN)[P];
    return `<svg class="scene-svg ph${P} ${out ? 'out' : 'in'}" viewBox="0 0 393 560" preserveAspectRatio="xMidYMin slice"><defs>${DEFS}</defs>${body}${grade}<rect width="393" height="560" filter="url(#grain)"/></svg>`;
  }


  function clock(h, m) {
    const ha = ((h % 12) + m / 60) * 30, ma = m * 6;
    return `<svg class="clock" viewBox="0 0 100 100"><circle cx="53" cy="53" r="44" fill="${PINK}"/><circle cx="50" cy="50" r="44" fill="#fff" stroke="${INK}" stroke-width="4"/>
      ${Array.from({ length: 12 }, (_, i) => `<path d="M50 10 V${i % 3 ? 15 : 19}" stroke="${INK}" stroke-width="${i % 3 ? 2 : 3.6}" transform="rotate(${i * 30} 50 50)"/>`).join('')}
      <path d="M50 50 V28" stroke="${INK}" stroke-width="6" stroke-linecap="round" transform="rotate(${ha} 50 50)"/>
      <path d="M50 50 V14" stroke="${PINK}" stroke-width="3.4" stroke-linecap="round" transform="rotate(${ma} 50 50)"/><circle cx="50" cy="50" r="4" fill="${INK}"/></svg>`;
  }
  function timeline(kind, lab = '?') {
    const T = (x, t, c = INK, sz = 10) => `<text x="${x}" y="66" font-size="${sz}" text-anchor="middle" fill="${c}" font-family="Rubik Mono One, monospace">${t}</text>`;
    const L = x => `<text x="${x}" y="22" font-size="11" text-anchor="middle" fill="${INK}" font-weight="700">${lab}</text>`;
    let mk = '';
    if (kind === 'ago' || kind === 'once') mk = `<path d="M80 34 Q115 10 150 34" stroke="${PINK}" stroke-width="2.5" stroke-dasharray="4 3" fill="none"/><circle cx="80" cy="40" r="7" fill="${PINK}" stroke="${INK}" stroke-width="2"/>${L(80)}`;
    if (kind === 'in' || kind === 'future') mk = `<path d="M150 34 Q185 10 220 34" stroke="${BLUE}" stroke-width="2.5" stroke-dasharray="4 3" fill="none"/><circle cx="220" cy="40" r="7" fill="${BLUE}" stroke="${INK}" stroke-width="2"/>${L(220)}`;
    if (kind === 'len') mk = `<rect x="70" y="33" width="80" height="14" fill="${YEL}" stroke="${INK}" stroke-width="2"/>${L(110)}`;
    if (kind === 'lenF') mk = `<rect x="150" y="33" width="80" height="14" fill="${YEL}" stroke="${INK}" stroke-width="2"/>${L(190)}`;
    if (kind === 'often') mk = [40, 85, 130, 175, 220, 265].map(x => `<circle cx="${x}" cy="40" r="5" fill="${GRN}" stroke="${INK}" stroke-width="1.5"/>`).join('') + L(150);
    return `<svg class="tline" viewBox="0 0 300 72"><path d="M12 40 H288" stroke="${INK}" stroke-width="3"/><path d="M280 34 L290 40 L280 46" stroke="${INK}" stroke-width="3" fill="none"/>
      <path d="M150 28 V52" stroke="${PINK}" stroke-width="4"/>${mk}${T(30, 'FØR')}${T(150, 'NU', PINK, 12)}${T(270, 'SENERE')}</svg>`;
  }
  function d20(n, cls = '') {
    return `<svg class="d20 ${cls}" viewBox="0 0 54 58"><path d="M30 5 L54 18 L54 46 L30 59 L6 46 L6 18Z" fill="${PINK}" opacity=".9"/><path d="M27 2 L51 15 L51 43 L27 56 L3 43 L3 15Z" fill="${YEL}" stroke="${INK}" stroke-width="2.4"/><path d="M27 2 L27 18 M3 15 L15 24 M51 15 L39 24 M15 24 L39 24 L27 44Z M27 44 V56 M15 24 L3 43 M39 24 L51 43" stroke="${INK}" stroke-width="1.4" fill="none"/><text x="27" y="36" text-anchor="middle" font-family="Rubik Mono One, monospace" font-size="12" fill="${INK}">${n}</text></svg>`;
  }

  const I = {
    ur: '<circle cx="24" cy="24" r="18"/><path d="M24 12 V24 L32 28"/>',
    kalender: '<rect x="6" y="10" width="36" height="32" rx="2"/><path d="M6 18 H42 M14 6 V14 M34 6 V14"/><path d="M12 24 h4 M22 24 h4 M32 24 h4 M12 32 h4 M22 32 h4 M32 32 h4" stroke-width="3"/>',
    uge: '<rect x="4" y="14" width="40" height="20" rx="2"/><path d="M4 20 H44"/><path d="M8 27 h1 M13 27 h1 M18 27 h1 M23 27 h1 M28 27 h1 M33 27 h1 M38 27 h1" stroke-width="3.4"/>',
    maaned: '<rect x="6" y="10" width="36" height="32" rx="2"/><path d="M6 18 H42"/><text x="24" y="37" font-size="15" text-anchor="middle" fill="currentColor" stroke="none" font-family="Marcellus, serif">30</text>',
    aar: '<circle cx="24" cy="24" r="18"/><path d="M24 6 V42 M6 24 H42"/><circle cx="15" cy="15" r="3"/><path d="M33 12 l0 6 M30 15 l6 0"/><path d="M13 33 q3 -6 6 0"/><path d="M31 31 l4 4 M35 31 l-4 4"/>',
    morgen: '<path d="M4 34 H44 M14 34 C14 22 34 22 34 34 M24 18 V8 M20 12 L24 8 L28 12 M8 26 L11 28 M40 26 L37 28"/>',
    aften: '<path d="M4 34 H44 M14 34 C14 22 34 22 34 34 M24 8 V18 M20 14 L24 18 L28 14 M10 40 H38" opacity=".9"/>',
    maane: '<path d="M30 6 C18 8 12 20 16 30 C20 40 32 44 40 38 C28 38 20 28 22 18 C24 12 28 8 30 6Z"/><path d="M38 12 l1 3 l3 1 l-3 1 l-1 3 l-1 -3 l-3 -1 l3 -1Z" fill="currentColor"/>',
    sol: '<circle cx="24" cy="24" r="8"/><path d="M24 4 V10 M24 38 V44 M4 24 H10 M38 24 H44 M10 10 L14 14 M34 34 L38 38 M38 10 L34 14 M10 38 L14 34"/>',
    regn: '<path d="M12 30 C4 30 4 20 12 20 C12 12 24 10 27 16 C31 10 42 13 40 22 C46 23 46 30 40 30Z"/><path d="M14 36 L11 43 M23 36 L20 43 M32 36 L29 43"/>',
    sne: '<path d="M12 30 C4 30 4 20 12 20 C12 12 24 10 27 16 C31 10 42 13 40 22 C46 23 46 30 40 30Z"/><path d="M13 38 h4 M15 36 v4 M23 40 h4 M25 38 v4 M33 37 h4 M35 35 v4"/>',
    blaest: '<path d="M4 16 H30 C36 16 36 8 30 8 M4 26 H38 C46 26 46 36 38 36 M4 36 H22"/>',
    taage: '<path d="M6 14 H34 M12 22 H42 M4 30 H30 M14 38 H40"/>',
    sky: '<path d="M12 30 C4 30 4 20 12 20 C12 12 24 10 27 16 C31 10 42 13 40 22 C46 23 46 30 40 30Z"/><path d="M30 18 C32 10 42 10 44 18" opacity=".7"/>',
    torden: '<path d="M12 30 C4 30 4 20 12 20 C12 12 24 10 27 16 C31 10 42 13 40 22 C46 23 46 30 40 30Z"/><path d="M24 30 L18 40 H25 L21 47 L31 35 H24 L28 30Z" fill="#f0c873" stroke="#f0c873"/>',
    regnbue: '<path d="M4 38 C4 14 44 14 44 38 M10 38 C10 22 38 22 38 38 M16 38 C16 28 32 28 32 38"/>',
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
    return `<svg class="ico ${cls}" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">${I[name] || '<circle cx="24" cy="24" r="16"/>'}</svg>`;
  }
  return { creature, self, scene, d20, icon, clock, timeline, ICONS: I, COLORS: { INK, PINK, BLUE, YEL, GRN, ORA, VIO, PAPER } };
})();
