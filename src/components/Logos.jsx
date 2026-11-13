/*
 * Les Benjamins logosu + Scorpio amblemi birlikte (lockup).
 *
 * Dosyalar src/assets/logo/ klasörüne şu adlarla konur (siyah versiyon):
 *   lb-logo.svg          → Les Benjamins yazı logosu
 *   scorpio-emblem.svg   → Scorpio amblemi
 * Koyu zeminlerde CSS ile beyaza çevrilir. Dosya yoksa yazı ile yedek gösterilir.
 */
const files = import.meta.glob('../assets/logo/*.{svg,png}', { eager: true, query: '?url', import: 'default' });
const find = (name) => Object.entries(files).find(([p]) => p.includes(`/${name}.`))?.[1];

const LB = find('lb-logo');
const EMBLEM = find('scorpio-emblem');

export default function Logos({ size = 'sm', className = '' }) {
  return (
    <span className={`lockup lockup--${size} ${className}`} aria-label="Les Benjamins">
      {EMBLEM ? (
        <img className="lockup__emblem" src={EMBLEM} alt="" />
      ) : (
        <span className="lockup__emblem lockup__emblem--fallback" aria-hidden="true">
          ♏︎
        </span>
      )}
      <span className="lockup__rule" aria-hidden="true" />
      {LB ? (
        <img className="lockup__word" src={LB} alt="" />
      ) : (
        <span className="lockup__word lockup__word--fallback" aria-hidden="true">
          LES BENJAMINS
        </span>
      )}
    </span>
  );
}
