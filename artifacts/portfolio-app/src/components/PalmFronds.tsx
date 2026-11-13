export function PalmFrondCluster({
  className,
  small = false,
}: {
  className: string;
  small?: boolean;
}) {
  const symbolId = `${className.replace(/[^a-z0-9]+/gi, '-')}-frond`;
  const leafletStations = Array.from({ length: 18 }, (_, index) => (index + 1) / 20);
  const frondColors = ['palm-sage', 'palm-olive', 'palm-mist', 'palm-sage'];
  const frondCount = small ? 2 : 4;

  return (
    <svg className={className} viewBox="0 0 560 300" fill="none" aria-hidden="true" focusable="false">
      <defs>
        <filter id={`${symbolId}-shadow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.4" floodColor="#344333" floodOpacity=".12" />
        </filter>
        <g id={symbolId} filter={`url(#${symbolId}-shadow)`}>
          <path className="palm-stem" d="M530 42C423 75 259 159 24 245" />
          {leafletStations.map((t) => {
            const u = 1 - t;
            const x = u ** 3 * 530 + 3 * u ** 2 * t * 423 + 3 * u * t ** 2 * 259 + t ** 3 * 24;
            const y = u ** 3 * 42 + 3 * u ** 2 * t * 75 + 3 * u * t ** 2 * 159 + t ** 3 * 245;
            const length = 28 + 46 * Math.sin(t * Math.PI);
            return (
              <g key={t}>
                <path
                  className="palm-leaf"
                  d={`M${x} ${y} C${x - 2} ${y - length * 0.45} ${x - length * 0.42} ${y - length * 0.84} ${x - length} ${y - length} C${x - length * 0.68} ${y - length * 0.48} ${x - length * 0.34} ${y - length * 0.12} ${x} ${y}Z`}
                />
                <path className="palm-vein" d={`M${x} ${y}Q${x - length * 0.48} ${y - length * 0.62} ${x - length} ${y - length}`} />
                <path
                  className="palm-leaf"
                  d={`M${x} ${y} C${x + length * 0.32} ${y + length * 0.08} ${x + length * 0.72} ${y + length * 0.24} ${x + length} ${y + length * 0.55} C${x + length * 0.61} ${y + length * 0.37} ${x + length * 0.27} ${y + length * 0.14} ${x} ${y}Z`}
                />
                <path className="palm-vein" d={`M${x} ${y}Q${x + length * 0.5} ${y + length * 0.27} ${x + length} ${y + length * 0.55}`} />
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
