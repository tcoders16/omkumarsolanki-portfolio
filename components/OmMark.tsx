/**
 * Omkumar Solanki personal mark — "the orchestrator".
 * A hairline ring (the O) with a spoke drawn from a filled center dot out
 * through the ring to a node beyond it at 45°: orchestrator at center,
 * agent dispatched past the loop. Circular counterpart to the Polymath
 * square aperture — same monochrome hairline language, distinct geometry.
 * Stroke-width (`sw`) and dot radius (`dot`) are specified in screen px and
 * converted to viewBox units, so hairlines stay ~1.5px and dots stay legible
 * at any render size.
 *
 * `animate` plays the dispatch sequence once on mount — ring draws in from
 * the top, orchestrator dot lands, spoke draws outward, node pops — then a
 * faint pulse rings the node every few seconds. Pure CSS, so it works in
 * server components; disabled under prefers-reduced-motion.
 */
type Props = {
  size?: number;
  ink?: string;
  sw?: number;
  dot?: number;
  animate?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

// ring r=26 about (48,48); node beyond the ring at 45° up-right (r=37.5)
const NODE_X = 74.5; // 48 + 37.5·cos45
const NODE_Y = 21.5; // 48 − 37.5·sin45
const RING_LEN = 163.4; // 2π·26
const SPOKE_LEN = 37.6; // center → node

const ANIM_CSS = `
@media (prefers-reduced-motion: no-preference) {
  .omk-anim .omk-ring { stroke-dasharray:${RING_LEN}; stroke-dashoffset:${RING_LEN};
    animation:omkRing 0.9s cubic-bezier(0.4,0,0.2,1) 0.1s forwards; }
  .omk-anim .omk-core { transform:scale(0); transform-origin:48px 48px;
    animation:omkPop 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.45s forwards; }
  .omk-anim .omk-spoke { stroke-dasharray:${SPOKE_LEN}; stroke-dashoffset:${SPOKE_LEN};
    animation:omkSpoke 0.45s cubic-bezier(0.4,0,0.2,1) 0.7s forwards; }
  .omk-anim .omk-node { transform:scale(0); transform-origin:${NODE_X}px ${NODE_Y}px;
    animation:omkPop 0.35s cubic-bezier(0.34,1.56,0.64,1) 1.05s forwards; }
  .omk-anim .omk-pulse { transform-origin:${NODE_X}px ${NODE_Y}px;
    animation:omkPulse 3.6s cubic-bezier(0.4,0,0.2,1) 1.5s infinite; }
}
@keyframes omkRing { to { stroke-dashoffset:0; } }
@keyframes omkSpoke { to { stroke-dashoffset:0; } }
@keyframes omkPop { to { transform:scale(1); } }
@keyframes omkPulse {
  0% { transform:scale(1); opacity:0.55; }
  32% { transform:scale(2.6); opacity:0; }
  100% { transform:scale(2.6); opacity:0; }
}
`;

export default function OmMark({
  size = 96,
  ink = "#FAFAF8",
  sw = 1.5,
  dot = 2.4,
  animate = false,
  className,
  style,
}: Props) {
  const swv = +((sw * 96) / size).toFixed(3);
  const dotv = +((dot * 96) / size).toFixed(3);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
      className={[animate ? "omk-anim" : "", className].filter(Boolean).join(" ") || undefined}
      style={{ display: "block", ...style }}
    >
      {animate && <style>{ANIM_CSS}</style>}
      {/* rotate −90° so the ring draws from 12 o'clock */}
      <circle
        className="omk-ring"
        cx="48"
        cy="48"
        r="26"
        stroke={ink}
        strokeWidth={swv}
        transform="rotate(-90 48 48)"
      />
      <line
        className="omk-spoke"
        x1="48"
        y1="48"
        x2={NODE_X}
        y2={NODE_Y}
        stroke={ink}
        strokeWidth={swv}
      />
      <circle className="omk-core" cx="48" cy="48" r={dotv} fill={ink} />
      <circle className="omk-node" cx={NODE_X} cy={NODE_Y} r={dotv * 0.86} fill={ink} />
      {animate && (
        <circle
          className="omk-pulse"
          cx={NODE_X}
          cy={NODE_Y}
          r={dotv * 0.86}
          stroke={ink}
          strokeWidth={swv}
          opacity="0"
        />
      )}
    </svg>
  );
}
