const P = ({ d, size = 20, fill = 'none', ...rest }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill={fill} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...rest}>
    {Array.isArray(d) ? d.map((x, i) => <path key={i} d={x} />) : <path d={d} />}
  </svg>
)

export const Home = (p) => <P {...p} d={['M3 10.5 12 3l9 7.5', 'M5 9v11h5v-6h4v6h5V9']} />
export const Bolt = (p) => <P {...p} d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
export const Tag = (p) => <P {...p} d={['M3 12V4a1 1 0 0 1 1-1h8l9 9-9 9-9-9Z', 'M7.5 7.5h.01']} />
export const Trophy = (p) => <P {...p} d={['M8 21h8', 'M12 17v4', 'M7 4h10v5a5 5 0 0 1-10 0V4Z', 'M17 5h3v2a3 3 0 0 1-3 3', 'M7 5H4v2a3 3 0 0 0 3 3']} />
export const Steps = (p) => <P {...p} d={['M4 6h16', 'M4 12h10', 'M4 18h6']} />
export const Image = (p) => <P {...p} d={['M4 4h16v16H4z', 'm4 16 5-5 4 4 3-3 4 4', 'M15 8.5h.01']} />
export const Mail = (p) => <P {...p} d={['M3 5h18v14H3z', 'm3 6 9 7 9-7']} />
export const Reply = (p) => <P {...p} d="M4 12a8 8 0 0 1 8-8h1a7 7 0 0 1 0 14h-2l-4 3v-3.5A8 8 0 0 1 4 12Z" />
export const Repost = (p) => <P {...p} d={['M7 7h11l-3-3', 'M18 7v5', 'M17 17H6l3 3', 'M6 17v-5']} />
export const Heart = ({ filled, ...p }) => <P {...p} fill={filled ? 'currentColor' : 'none'} d="M12 20s-7-4.4-9-9.2C1.7 7.3 4 4 7.3 4c2 0 3.5 1.1 4.7 2.7C13.2 5.1 14.7 4 16.7 4 20 4 22.3 7.3 21 10.8 19 15.6 12 20 12 20Z" />
export const Views = (p) => <P {...p} d={['M5 20V12', 'M10 20V6', 'M15 20v-9', 'M20 20V9']} />
export const Share = (p) => <P {...p} d={['M12 3v13', 'm7 8 5-5 5 5', 'M5 15v5h14v-5']} />
export const Pin = (p) => <P {...p} size={14} d={['M9 3h6l-1 6 4 3v2H6v-2l4-3-1-6Z', 'M12 14v7']} />
export const Link = (p) => <P {...p} size={16} d={['M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1', 'M14 10a4 4 0 0 0-5.7 0l-3 3A4 4 0 0 0 11 18.7l1-1']} />
export const Calendar = (p) => <P {...p} size={16} d={['M4 6h16v14H4z', 'M4 10h16', 'M8 3v4', 'M16 3v4']} />
export const Search = (p) => <P {...p} size={18} d={['M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z', 'm20 20-4-4']} />
export const Quill = (p) => <P {...p} d={['M20 4c-6 0-11 4-13 11l-2 5', 'M7 15c4 0 8-2 10-6']} />
export const Ext = (p) => <P {...p} size={14} d={['M7 17 17 7', 'M8 7h9v9']} />
export const Check = (p) => <P {...p} size={16} d="m5 12 4 4 10-10" />
