import { motion } from 'framer-motion'
import ScrollReveal from '../ui/ScrollReveal'
import { chapters } from '../../data/content'

const ease = [0.25, 0.46, 0.45, 0.94]

function ChapterArt({ chapter }) {
  return (
    <div className="relative">
      <div className="absolute -inset-6 bg-gold/10 blur-3xl rounded-full pointer-events-none" />
      <motion.div
        initial={{ clipPath: 'inset(12% 12% 12% 12% round 2rem)' }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 2rem)' }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1.1, ease }}
        className="relative aspect-[4/5] md:aspect-[4/5] overflow-hidden rounded-[2rem] border border-white/10"
      >
        <img src={chapter.img} alt={chapter.alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-noir-950/60 via-transparent to-transparent" />
      </motion.div>
      <img
        src="img/emblema-vip.svg"
        alt=""
        className={`absolute -bottom-6 w-16 md:w-20 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)] ${chapter.align === 'right' ? '-left-4' : '-right-4'}`}
      />
    </div>
  )
}

export default function StorySection() {
  return (
    <section className="bg-noir-900 pt-32 pb-24 md:pt-44 md:pb-32 relative overflow-hidden" id="vantagens">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <ScrollReveal className="max-w-3xl mb-20 md:mb-32">
          <p className="text-xs text-gold uppercase tracking-[0.3em] font-semibold mb-4">Programa de indicação</p>
          <h2 className="font-display font-bold text-4xl md:text-6xl tracking-tight leading-[1.05] text-balance">
            Recomendação que vira <span className="text-gold">benefício</span> dentro da experiência VIP.
          </h2>
        </ScrollReveal>

        {chapters.map((chapter, i) => (
          <div key={chapter.num} className="mb-24 md:mb-40 last:mb-0">
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.9, ease }}
              className="grid grid-cols-1 md:grid-cols-2 gap-14 md:gap-24 items-center"
            >
              {/* Texto */}
              <div className={`relative z-10 ${chapter.align === 'right' ? 'md:col-start-2 md:row-start-1' : ''}`}>
                <div className="absolute -top-20 md:-top-32 -left-4 md:-left-10 font-display font-extrabold text-[11rem] md:text-[16rem] text-white/[0.03] leading-none select-none pointer-events-none">
                  {chapter.num}
                </div>

                <h3 className="relative font-display font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight leading-[1.05] mb-8">
                  <span className="block text-gold">{chapter.title[0]}</span>
                  <span className="block text-white">{chapter.title[1]}</span>
                </h3>

                <div className="relative flex flex-col gap-6 text-smoke-500 text-lg leading-relaxed max-w-lg">
                  <p>{chapter.p1}</p>
                  <p className="border-l-2 border-gold pl-4 text-smoke-100 font-medium">{chapter.p2}</p>
                </div>
              </div>

              {/* Imagem */}
              <div className={`relative z-0 max-w-md md:max-w-none w-full mx-auto ${chapter.align === 'right' ? 'md:col-start-1 md:row-start-1' : ''}`}>
                <ChapterArt chapter={chapter} />
              </div>
            </motion.div>

            {i < chapters.length - 1 && (
              <div className="mt-24 md:mt-40 relative flex justify-center items-center">
                <hr className="w-full border-white/5 absolute" />
                <span className="bg-noir-900 px-4 text-xs text-white/25 uppercase tracking-[0.3em] relative">
                  Quem é amigo, indica VIP
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
