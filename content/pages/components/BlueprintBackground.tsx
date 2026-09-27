import { type CSSProperties, type ReactNode, useEffect, useRef } from 'react';

/*
 * Animated "technical drawing" backdrop for the home page: a blueprint grid
 * that brightens under the pointer and a sweeping scan beam, plus line-art
 * figures (page anatomy, site map, build pipeline, protractor) that draw
 * themselves, hold, and erase on a loop. Styles live in /styles.css (bp-*).
 * Purely decorative: aria-hidden, pointer-events: none, and static when the
 * visitor prefers reduced motion.
 */

// Shape helpers. Everything is a <path> with pathLength=1 so a single
// dash-offset keyframe can "draw" any shape regardless of its real length.
const rect = (x: number, y: number, w: number, h: number) => `M${x} ${y}h${w}v${h}h${-w}Z`;

const roundRect = (x: number, y: number, w: number, h: number, r = 4) =>
  `M${x + r} ${y}H${x + w - r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h - r}` +
  `A${r} ${r} 0 0 1 ${x + w - r} ${y + h}H${x + r}A${r} ${r} 0 0 1 ${x} ${y + h - r}` +
  `V${y + r}A${r} ${r} 0 0 1 ${x + r} ${y}Z`;

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;

const rhombus = (cx: number, cy: number, w: number, h: number) =>
  `M${cx} ${cy - h / 2}L${cx + w / 2} ${cy}L${cx} ${cy + h / 2}L${cx - w / 2} ${cy}Z`;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** A stroked path that draws itself. `i` staggers it within its figure. */
function Draw({ d, i = 0, className = '' }: { d: string; i?: number; className?: string }) {
  return (
    <path d={d} pathLength={1} className={`bp-draw ${className}`} style={{ '--i': i } as Vars} />
  );
}

/** Text or filled shapes that fade in once the strokes around them are drawn. */
function Fade({ i = 0, children }: { i?: number; children: ReactNode }) {
  return (
    <g className="bp-fade" style={{ '--i': i } as Vars}>
      {children}
    </g>
  );
}

function Label({
  x,
  y,
  children,
  anchor = 'start',
  rotate,
}: {
  x: number;
  y: number;
  children: ReactNode;
  anchor?: 'start' | 'middle' | 'end';
  rotate?: number;
}) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      transform={rotate ? `rotate(${rotate} ${x} ${y})` : undefined}
      className="bp-label"
    >
      {children}
    </text>
  );
}

function Callout({ x, y, n, i }: { x: number; y: number; n: number; i: number }) {
  return (
    <>
      <Draw d={circle(x, y, 7)} i={i} />
      <Fade i={i + 1}>
        <text x={x} y={y + 3} textAnchor="middle" className="bp-label bp-label-sm">
          {n}
        </text>
      </Fade>
    </>
  );
}

/** Left column: wireframe of a docs page with dimensions, and the build pipeline. */
function LeftColumn() {
  const nav = [44, 36, 48, 30, 40, 34].map((w, n) => ({ w, y: 86 + n * 16 }));
  const paragraph = [196, 188, 200, 120].map((w, n) => ({ w, y: 114 + n * 12 }));
  const code = [70, 120, 96, 54].map((w, n) => ({
    w,
    y: 184 + n * 12,
    x: n === 1 || n === 2 ? 150 : 138,
  }));

  return (
    <svg
      aria-hidden="true"
      className="bp-col bp-col-left"
      width="380"
      height="680"
      viewBox="0 0 380 680"
      fill="none"
    >
      {/* FIG. 01: page anatomy */}
      <g style={{ '--fig': '0s' } as Vars}>
        {/* dimension lines */}
        <Draw d="M40 18H160M220 18H340M40 12v12M340 12v12M40 18l6-3v6zM340 18l-6-3v6z" i={0} />
        <Fade i={2}>
          <Label x={190} y={21} anchor="middle">
            300
          </Label>
        </Fade>
        <Draw d="M18 40V195M18 245V400M12 40h12M12 400h12" i={1} />
        <Fade i={3}>
          <Label x={21} y={220} anchor="middle" rotate={-90}>
            360
          </Label>
        </Fade>

        {/* browser frame */}
        <Draw d={rect(40, 40, 300, 360)} i={2} />
        <Draw d="M40 64H340" i={3} />
        <Draw d={circle(54, 52, 3)} i={4} />
        <Draw d={circle(66, 52, 3)} i={4} />
        <Draw d={circle(78, 52, 3)} i={4} />
        <Draw d={roundRect(250, 46, 78, 12, 6)} i={5} />

        {/* sidebar */}
        <Draw d="M110 64V400" i={5} />
        <Fade i={8}>
          <path d={rect(46, 112, 58, 12)} className="bp-fill" />
        </Fade>
        {nav.map(({ w, y }, n) => (
          <Draw key={y} d={`M52 ${y}h${w}`} i={6 + n * 0.5} />
        ))}

        {/* content */}
        <Draw d={rect(126, 84, 140, 14)} i={7} />
        {paragraph.map(({ w, y }, n) => (
          <Draw key={y} d={`M126 ${y}h${w}`} i={8 + n * 0.5} />
        ))}
        <Draw d={rect(126, 166, 200, 64)} i={10} />
        <Draw d={rect(310, 172, 10, 10)} i={11} />
        {code.map(({ w, y, x }, n) => (
          <Draw key={y} d={`M${x} ${y}h${w * 0.8}`} i={11 + n * 0.5} />
        ))}
        <Draw d={rect(126, 244, 200, 96)} i={12} />
        <Draw d="M126 244L326 340M326 244L126 340" i={13} />
        <Draw d="M126 356h184M126 368h150" i={14} />
        <Draw d={roundRect(126, 380, 50, 12, 3)} i={14} />

        {/* numbered callouts */}
        <Draw d="M266 91h9" i={15} />
        <Callout x={282} y={91} n={1} i={15} />
        <Draw d="M326 198h25" i={16} />
        <Callout x={358} y={198} n={2} i={16} />
        <Draw d="M326 292h25" i={17} />
        <Callout x={358} y={292} n={3} i={17} />

        <Fade i={18}>
          <Label x={40} y={424}>
            FIG. 01 — PAGE ANATOMY
          </Label>
        </Fade>
      </g>

      {/* FIG. 03: build pipeline as floating isometric plates */}
      <g style={{ '--fig': '1.2s' } as Vars}>
        <Draw d="M190 452V640" i={0} className="bp-dash" />
        {[
          { cy: 580, label: 'static html', dy: '0px' },
          { cy: 540, label: 'react', dy: '-8px' },
          { cy: 500, label: 'content.mdx', dy: '-16px' },
        ].map(({ cy, label, dy }, n) => (
          <g
            key={label}
            className="bp-float"
            style={{ '--dy': dy, '--float-delay': `${n * 0.2}s` } as Vars}
          >
            <Fade i={n * 2 + 1}>
              <path d={rhombus(190, cy, 160, 80)} className="bp-plate" />
            </Fade>
            <Draw d={rhombus(190, cy, 160, 80)} i={n * 2 + 1} />
            <Draw
              d={`M110 ${cy}v8L190 ${cy + 48}L270 ${cy + 8}v-8M190 ${cy + 40}v8`}
              i={n * 2 + 1.5}
            />
            <Draw d={`M230 ${cy - 20}L258 ${cy - 34}H300`} i={n * 2 + 2} />
            <Fade i={n * 2 + 3}>
              <Label x={304} y={cy - 31}>
                {label}
              </Label>
            </Fade>
          </g>
        ))}
        <Fade i={8}>
          <Label x={40} y={650}>
            FIG. 03 — BUILD PIPELINE
          </Label>
        </Fade>
      </g>
    </svg>
  );
}

// Tick marks for the protractor, every 5° with longer marks every 10° and 30°.
const TICKS = Array.from({ length: 72 }, (_, n) => {
  const angle = (n * 5 * Math.PI) / 180;
  const inner = n % 6 === 0 ? 92 : n % 2 === 0 ? 100 : 104;
  const x1 = 190 + Math.cos(angle) * inner;
  const y1 = 430 + Math.sin(angle) * inner;
  const x2 = 190 + Math.cos(angle) * 110;
  const y2 = 430 + Math.sin(angle) * 110;
  return `M${x1.toFixed(2)} ${y1.toFixed(2)}L${x2.toFixed(2)} ${y2.toFixed(2)}`;
}).join('');

// Signal pulses that travel down the site map's connectors.
const PULSES = [
  { path: 'M190 62V90H70V112', dur: '1.4s', begin: '0s' },
  { path: 'M190 62V112', dur: '1.2s', begin: '0.4s' },
  { path: 'M190 62V90H310V112', dur: '1.4s', begin: '0.7s' },
  { path: 'M40 140V236H56', dur: '1.6s', begin: '1s' },
  { path: 'M190 140V228', dur: '1.3s', begin: '1.3s' },
];

/** Right column: site map with signal pulses, and a rotating protractor. */
function RightColumn() {
  const leaves = [159, 193, 227];

  return (
    <svg
      aria-hidden="true"
      className="bp-col bp-col-right"
      width="380"
      height="680"
      viewBox="0 0 380 680"
      fill="none"
    >
      {/* FIG. 02: site map */}
      <g style={{ '--fig': '0.6s' } as Vars}>
        <Draw d={roundRect(125, 30, 130, 32)} i={0} />
        <Fade i={1}>
          <Label x={190} y={50} anchor="middle">
            docs.json
          </Label>
        </Fade>
        <Draw d="M190 62V90M70 90H310M70 90v22M190 90v22M310 90v22" i={1} />
        {[
          { x: 25, label: 'guides' },
          { x: 145, label: 'api' },
          { x: 265, label: 'components' },
        ].map(({ x, label }, n) => (
          <g key={label}>
            <Draw d={roundRect(x, 112, 90, 28)} i={2 + n * 0.5} />
            <Fade i={3 + n * 0.5}>
              <Label x={x + 45} y={130} anchor="middle">
                {label}
              </Label>
            </Fade>
          </g>
        ))}

        {/* guides: pages */}
        <Draw d="M40 140V236M40 168h16M40 202h16M40 236h16" i={4} />
        {leaves.map((y, n) => (
          <g key={`g-${y}`}>
            <Draw d={rect(56, y, 62, 18)} i={5 + n * 0.5} />
            <Draw d={`M64 ${y + 9}h${[40, 30, 36][n]}`} i={6 + n * 0.5} />
          </g>
        ))}

        {/* api: request flow */}
        <Draw d="M190 140v30" i={4} />
        <Draw d="M190 170L206 186L190 202L174 186Z" i={5} />
        <Draw d="M190 202v26" i={6} />
        <Draw d={circle(190, 240, 13)} i={6.5} />
        <Fade i={7}>
          <text x={190} y={243} textAnchor="middle" className="bp-label bp-label-sm">
            200
          </text>
          <Label x={214} y={189}>
            auth
          </Label>
        </Fade>

        {/* components: pages */}
        <Draw d="M280 140V204M280 170h16M280 204h16" i={4} />
        {leaves.slice(0, 2).map((y, n) => (
          <g key={`c-${y}`}>
            <Draw d={rect(296, y + 2, 62, 18)} i={5 + n * 0.5} />
            <Draw d={`M304 ${y + 11}h${[34, 44][n]}`} i={6 + n * 0.5} />
          </g>
        ))}

        <g className="bp-pulses">
          {PULSES.map(({ path, dur, begin }) => (
            <circle key={path} r={2.5} className="bp-pulse">
              <animateMotion path={path} dur={dur} begin={begin} repeatCount="indefinite" />
            </circle>
          ))}
        </g>

        <Fade i={8}>
          <Label x={25} y={290}>
            FIG. 02 — SITE MAP
          </Label>
        </Fade>
      </g>

      {/* FIG. 04: protractor */}
      <g style={{ '--fig': '1.8s' } as Vars}>
        <Draw d="M50 430H330M190 305V555" i={0} className="bp-dash" />
        <Draw d={circle(190, 430, 110)} i={1} />
        <Draw d={circle(190, 430, 78)} i={2} />
        <Draw d={circle(190, 430, 3)} i={3} />
        <g className="bp-spin">
          <Fade i={3}>
            <path d={TICKS} className="bp-stroke" />
          </Fade>
        </g>
        <Draw d="M230 430A40 40 0 0 0 210 395.36" i={4} />
        <g className="bp-sweep">
          <Fade i={4}>
            <path d="M190 430L300 430" className="bp-stroke bp-stroke-strong" />
            <circle cx={300} cy={430} r={3} className="bp-pulse" />
          </Fade>
        </g>
        <Fade i={5}>
          <Label x={238} y={406}>
            60°
          </Label>
          <Label x={190} y={310} anchor="middle">
            0°
          </Label>
          <Label x={316} y={426} anchor="middle">
            90°
          </Label>
        </Fade>
        <Fade i={6}>
          <Label x={25} y={590}>
            FIG. 04 — GEOMETRY
          </Label>
        </Fade>
      </g>
    </svg>
  );
}

const RULER_MARKS = [0, 80, 160, 240, 320, 400, 480, 560, 640];

/** A measuring ruler under the call to action, with a sliding marker. */
function Ruler() {
  const ticks = Array.from({ length: 81 }, (_, n) => {
    const h = n % 10 === 0 ? 12 : n % 5 === 0 ? 8 : 4;
    return `M${n * 8} 4v${h}`;
  }).join('');

  return (
    <svg
      aria-hidden="true"
      className="bp-ruler"
      width="648"
      height="40"
      viewBox="-4 0 648 40"
      fill="none"
    >
      <g style={{ '--fig': '0.9s' } as Vars}>
        <Draw d="M0 4H640" i={0} />
        <Fade i={2}>
          <path d={ticks} className="bp-stroke" />
          {RULER_MARKS.map(mark => (
            <Label key={mark} x={mark} y={32} anchor="middle">
              {mark}
            </Label>
          ))}
        </Fade>
        <g className="bp-slide">
          <Fade i={3}>
            <path d="M0 4l-4-4h8z" className="bp-fill-strong" />
          </Fade>
        </g>
      </g>
    </svg>
  );
}

export function BlueprintBackground() {
  const rootRef = useRef<HTMLDivElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);

  // Track the pointer for the grid spotlight and the coordinate readout.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const update = () => {
      frame = 0;
      const bounds = root.getBoundingClientRect();
      const px = x - bounds.left;
      const py = y - bounds.top;
      root.style.setProperty('--mx', `${px}px`);
      root.style.setProperty('--my', `${py}px`);
      root.dataset.pointer = 'on';
      if (readoutRef.current) {
        const pad = (value: number) => String(Math.max(0, Math.round(value))).padStart(4, '0');
        readoutRef.current.textContent = `X ${pad(px)}  Y ${pad(py)}`;
      }
    };

    const onMove = (event: PointerEvent) => {
      x = event.clientX;
      y = event.clientY;
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onLeave = () => {
      delete root.dataset.pointer;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={rootRef} className="bp-bg" aria-hidden="true">
      <div className="bp-glow" />
      <div className="bp-grid" />
      <div className="bp-grid bp-grid-spot" />
      <div className="bp-grid bp-grid-scan" />

      <div className="bp-figures">
        <LeftColumn />
        <RightColumn />
        <Ruler />
      </div>

      <div className="bp-meta bp-meta-left">
        <span ref={readoutRef}>X 0000 Y 0000</span>
      </div>
      <div className="bp-meta bp-meta-right">
        <span>SHEET 01 / 01</span>
        <span>SCALE 1:1</span>
      </div>
    </div>
  );
}
