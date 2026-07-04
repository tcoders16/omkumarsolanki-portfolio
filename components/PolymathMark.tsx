/**
 * Polymath aperture mark — three 60×60 squares rotated 0°/30°/60° about
 * center (48,48) plus a center dot, per the Polymath logo system.
 * Stroke-width is specified in screen px (`sw`) and converted to viewBox
 * units so the rendered stroke stays ~1.5px at any size.
 */
type Props = {
  size?: number;
  ink?: string;
  sw?: number;
  dot?: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function PolymathMark({
  size = 96,
  ink = "#FAFAF8",
  sw = 1.5,
  dot = 3.5,
  className,
  style,
}: Props) {
  const swv = +((sw * 96) / size).toFixed(3);
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
      <rect x="18" y="18" width="60" height="60" stroke={ink} strokeWidth={swv} />
      <rect x="18" y="18" width="60" height="60" stroke={ink} strokeWidth={swv} transform="rotate(30 48 48)" />
      <rect x="18" y="18" width="60" height="60" stroke={ink} strokeWidth={swv} transform="rotate(60 48 48)" />
      <circle cx="48" cy="48" r={dot} fill={ink} />
    </svg>
  );
}
