type MascotProps = {
  small?: boolean
}

export function Mascot({ small = false }: MascotProps) {
  return (
    <svg
      className={small ? 'mascot mascot-small' : 'mascot'}
      viewBox="0 0 220 190"
      role="img"
      aria-label="一个戴着黄色帽子的可爱数学小方块"
    >
      <ellipse cx="112" cy="171" rx="62" ry="10" fill="#c9e6d8" opacity=".8" />
      <path d="M43 67 111 35l67 32v75l-67 33-68-33Z" fill="#70c9ef" stroke="#23577c" strokeWidth="5" strokeLinejoin="round" />
      <path d="m43 67 68 34 67-34v75l-67 33-68-33Z" fill="#8ddbbf" opacity=".7" />
      <path d="M111 101v74" stroke="#23577c" strokeWidth="4" opacity=".7" />
      <path d="m47 69 64 31 62-31" stroke="#fff" strokeWidth="3" opacity=".55" />
      <path d="M63 58 76 32l20 8-12 29Z" fill="#ffb369" stroke="#9a5838" strokeWidth="4" strokeLinejoin="round" />
      <path d="m76 32 12-17 20 8-12 17Z" fill="#ffcb7d" stroke="#9a5838" strokeWidth="4" strokeLinejoin="round" />
      <path d="M72 86c0-6 5-10 11-10s11 4 11 10" stroke="#23577c" strokeWidth="4" strokeLinecap="round" />
      <path d="M127 86c0-6 5-10 11-10s11 4 11 10" stroke="#23577c" strokeWidth="4" strokeLinecap="round" />
      <circle cx="82" cy="86" r="3.5" fill="#23577c" />
      <circle cx="138" cy="86" r="3.5" fill="#23577c" />
      <path d="M102 115c6 7 14 7 20 0" stroke="#23577c" strokeWidth="4" strokeLinecap="round" />
      <path d="M52 119c-17-3-28 6-25 19 2 11 16 14 28 4" fill="#ffb369" stroke="#9a5838" strokeWidth="4" />
      <path d="M170 119c17-3 28 6 25 19-2 11-16 14-28 4" fill="#ffb369" stroke="#9a5838" strokeWidth="4" />
      <path d="M95 44c7-9 18-12 29-7" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".8" />
      <path d="m31 48 3 7m-7-3 7-1M191 72l3 7m-7-3 7-1" stroke="#ffcf70" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
