export function PalmFrondCluster({
  className,
  small = false,
}: {
  className: string;
  small?: boolean;
}) {
  const symbolId = `${className.replace(/[^a-z0-9]+/gi, '-')}-frond`;
  // Denser stations near the tip keep the final stretch finely feathered.
  const leafletStations = Array.from(
    { length: 28 },
    (_, index) => 0.05 + 0.949 * (1 - (1 - index / 27) ** 1.35),
  );
  const frondColors = ['palm-sage', 'palm-olive', 'palm-mist', 'palm-sage'];
  const frondCount = small ? 2 : 4;

  return (
    <svg className={className} viewBox="0 0 560 300" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <filter id={`${symbolId}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.4" floodColor="#344333" floodOpacity=".12" />
        </filter>
        <g id={symbolId} filter={`url(#${symbolId}-shadow)`}>
          <path className="palm-stem" d="M530 41C423 74 259 158.5 24 245C259 159.5 423 76 530 43Z" />
          {leafletStations.map((t) => {
            const u = 1 - t;
            const x = u ** 3 * 530 + 3 * u ** 2 * t * 423 + 3 * u * t ** 2 * 259 + t ** 3 * 24;
            const y = u ** 3 * 42 + 3 * u ** 2 * t * 75 + 3 * u * t ** 2 * 159 + t ** 3 * 245;
            const length = (35 + 45 * Math.sin(t * Math.PI)) * Math.min(1, ((1 - t) / 0.38) ** 0.6);
            const tangentX = 3 * u ** 2 * (423 - 530) + 6 * u * t * (259 - 423) + 3 * t ** 2 * (24 - 259);
            const tangentY = 3 * u ** 2 * (75 - 42) + 6 * u * t * (159 - 75) + 3 * t ** 2 * (245 - 159);
            const heading = Math.atan2(tangentY, tangentX);
            const spread = 1.05 * Math.min(1, (1 - t) / 0.3);
            const width = length * 0.085;
            return (
              <g key={t}>
                {[-1, 1].map((side) => {
                  const angle = heading + side * spread;
                  const dx = Math.cos(angle) * length;
                  const dy = Math.sin(angle) * length;
                  const nx = -Math.sin(angle) * width;
                  const ny = Math.cos(angle) * width;
                  return (
                    <g key={side}>
                      <path
                        className="palm-leaf"
                        d={`M${x} ${y}C${x + dx * 0.25 + nx} ${y + dy * 0.25 + ny} ${x + dx * 0.7 + nx} ${y + dy * 0.7 + ny} ${x + dx} ${y + dy}C${x + dx * 0.66 - nx} ${y + dy * 0.66 - ny} ${x + dx * 0.26 - nx * 0.4} ${y + dy * 0.26 - ny * 0.4} ${x} ${y}Z`}
                      />
                      <path className="palm-vein" style={{ strokeWidth: Math.min(0.65, width * 0.3) }} d={`M${x} ${y}Q${x + dx * 0.5} ${y + dy * 0.5} ${x + dx} ${y + dy}`} />
                    </g>
                  );
                })}
              </g>
            );
          })}
        </g>
      </defs>
      {Array.from({ length: frondCount }, (_, index) => (
        <g
          key={index}
          transform={`translate(0 ${index * (small ? 54 : 47)}) rotate(${[-9, -3, 4, 10][index]} 530 42) scale(${1 - index * 0.045} ${1 - index * 0.025})`}
        >
          <g className={`${frondColors[index]} frond-sway frond-sway-${index + 1}`}>
            <use href={`#${symbolId}`} className="frond-flutter" />
          </g>
        </g>
      ))}
    </svg>
  );
}
