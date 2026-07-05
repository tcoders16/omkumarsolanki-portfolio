/**
 * Shared surface-switch button — the single component used on BOTH navbars
 * (engineering ⇄ consulting) so the two sides can hand visitors to each
 * other. Hairline outline, 7px radius (the only rounded element allowed by
 * the system), arrow nudges right on hover. Stays visible on mobile where
 * the plain nav links collapse.
 */
type Props = { href: string; label: string };

const CSS = `
.swl { display:inline-flex; align-items:center; gap:8px; font-size:13.5px; font-weight:500;
  color:#FAFAF8; background:transparent; border:1px solid #26262E; border-radius:7px;
  padding:8px 14px; text-decoration:none; white-space:nowrap;
  transition:border-color 0.15s, color 0.15s; }
.swl:hover { border-color:#6E6E78; }
.swl-a { display:inline-block; transition:transform 0.2s cubic-bezier(0.22,1,0.36,1); }
.swl:hover .swl-a { transform:translateX(3px); }
`;

export default function SwitchLink({ href, label }: Props) {
  return (
    <a className="swl" href={href}>
      <style>{CSS}</style>
      {label}
      <span className="swl-a" aria-hidden="true">
        →
      </span>
    </a>
  );
}
