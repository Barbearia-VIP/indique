import { twMerge } from 'tailwind-merge'

// Tela do app recortada das peças da campanha, apresentada como um "card".
export default function PhoneShot({ src, alt, className, eager = false }) {
  return (
    <div
      className={twMerge(
        'relative aspect-[1/2] overflow-hidden rounded-[2rem] border border-white/10 bg-noir-800 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.9)]',
        className,
      )}
    >
      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/5" />
    </div>
  )
}
