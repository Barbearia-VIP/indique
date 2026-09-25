import { twMerge } from 'tailwind-merge'

export default function Logo({ className, variant = 'full', dark = false }) {
  const src = variant === 'emblem' ? 'img/emblema-vip.svg' : 'img/logo-barbearia-vip.svg'
  return (
    <img
      src={src}
      alt="Barbearia VIP"
      className={twMerge('block h-auto select-none', dark && 'brightness-0', className)}
      draggable="false"
    />
  )
}
