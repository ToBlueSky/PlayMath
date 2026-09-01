import type { SVGProps } from 'react'

export type IconName =
  | 'arrow'
  | 'back'
  | 'book'
  | 'check'
  | 'cube'
  | 'cursor'
  | 'home'
  | 'layers'
  | 'play'
  | 'refresh'
  | 'rotate'
  | 'sparkle'
  | 'target'
  | 'volume'

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName
  size?: number
}

export function Icon({ name, size = 18, ...props }: IconProps) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.9,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
    ...props,
  }

  switch (name) {
    case 'arrow':
      return <svg {...common}><path d="M5 12h13" /><path d="m13 6 6 6-6 6" /></svg>
    case 'back':
      return <svg {...common}><path d="m14.5 5-7 7 7 7" /><path d="M8 12h11" /></svg>
    case 'book':
      return <svg {...common}><path d="M4.5 5.5A2.5 2.5 0 0 1 7 3h12.5v16H7a2.5 2.5 0 0 0-2.5 2.5Z" /><path d="M4.5 5.5v16" /><path d="M7 19h12.5" /></svg>
    case 'check':
      return <svg {...common}><path d="m5 12.5 4.2 4.2L19 7" /></svg>
    case 'cube':
      return <svg {...common}><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9Z" /><path d="m4.3 7.7 7.7 4.4 7.7-4.4" /><path d="M12 12.1V21" /></svg>
    case 'cursor':
      return <svg {...common}><path d="m5 3 4.1 16.5 3.2-5.1 5.7 2.2L5 3Z" /><path d="m12.3 14.4 3.2 4.3" /></svg>
    case 'home':
      return <svg {...common}><path d="m3.5 10.5 8.5-7 8.5 7" /><path d="M5.5 9.5v10h13v-10" /><path d="M9.5 19.5v-5h5v5" /></svg>
    case 'layers':
      return <svg {...common}><path d="m12 3.5 8 4.5-8 4.5-8-4.5Z" /><path d="m4 12 8 4.5 8-4.5" /><path d="m4 16.5 8 4 8-4" /></svg>
    case 'play':
      return <svg {...common}><path d="m8 5 11 7-11 7Z" fill="currentColor" stroke="none" /></svg>
    case 'refresh':
      return <svg {...common}><path d="M19 8a7.5 7.5 0 1 0 1 5" /><path d="M19 4v4h-4" /></svg>
    case 'rotate':
      return <svg {...common}><path d="M5 8a7.5 7.5 0 0 1 12.8-1.8L20 8" /><path d="M20 4v4h-4" /><path d="M19 16a7.5 7.5 0 0 1-12.8 1.8L4 16" /><path d="M4 20v-4h4" /></svg>
    case 'sparkle':
      return <svg {...common}><path d="m12 3 1.4 5.6L19 10l-5.6 1.4L12 17l-1.4-5.6L5 10l5.6-1.4Z" /><path d="m19 16 .6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6Z" /></svg>
    case 'target':
      return <svg {...common}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.2" /><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" /></svg>
    case 'volume':
      return <svg {...common}><path d="M4 10v4h3l4 3V7l-4 3Z" /><path d="M15 9.5a3.5 3.5 0 0 1 0 5" /><path d="M17.5 7a7 7 0 0 1 0 10" /></svg>
    default:
      return null
  }
}
