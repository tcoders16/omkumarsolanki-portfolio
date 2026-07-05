/**
 * Animated "Omkumar Solanki" wordmark — companion to the OmMark dispatch
 * animation. Each letter rises in from a slight blur on a stagger while the
 * word's tracking settles from airy to the brand's tight -0.015em: slow,
 * cinematic, still monochrome-austere. Pure CSS (server-component safe);
 * static under prefers-reduced-motion. Screen readers get the plain string
 * via aria-label; the letter spans are presentation only.
 */
type Props = {
  text?: string;
  delay?: number; // s before the first letter starts (defaults to just after the ring begins drawing)
  stagger?: number; // s between letters
  className?: string;
};

const CSS = `
.bn { display:inline-block; white-space:nowrap; }
@media (prefers-reduced-motion: no-preference) {
  .bn { letter-spacing:0.06em; animation:bnTrack 1.8s cubic-bezier(0.22,1,0.36,1) 0.2s both; }
  .bn-ch { display:inline-block; opacity:0; transform:translateY(0.45em); filter:blur(5px);
    animation:bnIn 0.9s cubic-bezier(0.22,1,0.36,1) both; }
}
@keyframes bnIn { to { opacity:1; transform:translateY(0); filter:blur(0); } }
@keyframes bnTrack { to { letter-spacing:-0.015em; } }
`;

export default function BrandName({
  text = "Omkumar Solanki",
  delay = 0.3,
  stagger = 0.045,
  className,
}: Props) {
  return (
    <span className={["bn", className].filter(Boolean).join(" ")} aria-label={text}>
      <style>{CSS}</style>
      {Array.from(text).map((ch, i) =>
        ch === " " ? (
          " "
        ) : (
          <span
            key={i}
            className="bn-ch"
            aria-hidden="true"
            style={{ animationDelay: `${+(delay + i * stagger).toFixed(3)}s` }}
          >
            {ch}
          </span>
        )
      )}
    </span>
  );
}
