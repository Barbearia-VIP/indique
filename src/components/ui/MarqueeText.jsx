import { twMerge } from 'tailwind-merge'

export default function MarqueeText({ items, direction = 'forward', className, separatorClassName }) {
  const animationClass = direction === 'reverse' ? 'animate-marquee-reverse' : 'animate-marquee'

  const renderItems = (prefix) =>
    items.map((item, index) => (
      <div key={`${prefix}-${index}`} className="flex items-center" aria-hidden={prefix === 'dup' || undefined}>
        <span className="mx-6 md:mx-10">{item}</span>
        <span className={twMerge('text-gold/40 text-sm', separatorClassName)}>◆</span>
      </div>
    ))

  return (
    <div className={twMerge('flex overflow-hidden relative w-full', className)}>
      <div className={twMerge('flex whitespace-nowrap motion-reduce:animate-none', animationClass)}>
        {renderItems('item')}
        {/* Duplicado para o loop contínuo */}
        {renderItems('dup')}
      </div>
    </div>
  )
}
