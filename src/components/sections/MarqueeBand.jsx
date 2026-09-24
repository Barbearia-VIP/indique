import MarqueeText from '../ui/MarqueeText'
import { marqueeItems } from '../../data/content'

export default function MarqueeBand() {
  return (
    <section aria-label="Indicou. Ele veio. Você ganhou." className="relative z-10 bg-gold text-noir-950 py-5 md:py-7 -rotate-1 scale-[1.03] shadow-[0_20px_60px_-20px_rgba(235,185,3,0.4)]">
      <MarqueeText
        items={marqueeItems}
        className="font-display font-extrabold text-3xl md:text-5xl tracking-tight"
        separatorClassName="text-noir-950/40 text-base md:text-xl"
      />
    </section>
  )
}
