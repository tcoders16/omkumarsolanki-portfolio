/**
 * Omkumar Solanki personal mark — "the orchestrator".
 * A hairline ring (the O) with a spoke drawn from a filled center dot out
 * through the ring to a node beyond it at 45°: orchestrator at center,
 * agent dispatched past the loop. Circular counterpart to the Polymath
 * square aperture — same monochrome hairline language, distinct geometry.
 * Stroke-width (`sw`) and dot radius (`dot`) are specified in screen px and
 * converted to viewBox units, so hairlines stay ~1.5px and dots stay legible
 * at any render size.
 */
type Props = {
  size?: number;
  ink?: string;
  sw?: number;
  dot?: number;
  className?: string;
  style?: React.CSSProperties;
};

// ring r=26 about (48,48); node beyond the ring at 45° up-right (r=37.5)
const NODE_X = 74.5; // 48 + 37.5·cos45
const NODE_Y = 21.5; // 48 − 37.5·sin45

export default function OmMark({
  size = 96,
  ink = "#FAFAF8",
  sw = 1.5,
  dot = 2.4,
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
      className={className}
      style={{ display: "block", ...style }}
    >
      <circle cx="48" cy="48" r="26" stroke={ink} strokeWidth={swv} />
      <line x1="48" y1="48" x2={NODE_X} y2={NODE_Y} stroke={ink} strokeWidth={swv} />
      <circle cx="48" cy="48" r={dotv} fill={ink} />
      <circle cx={NODE_X} cy={NODE_Y} r={dotv * 0.86} fill={ink} />
    </svg>
  );
}
