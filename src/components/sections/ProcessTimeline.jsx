import { useRef, useState } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import ScrollReveal from '../ui/ScrollReveal'
import PhoneShot from '../ui/PhoneShot'
import { steps } from '../../data/content'

const ease = [0.25, 0.46, 0.45, 0.94]

function StepItem({ step, index, active, onActive }) {
  // Faixa no meio da viewport: o passo que cruza o centro vira o ativo
  const { ref } = useInView({
    rootMargin: '-45% 0px -45% 0px',
    onChange: (inView) => inView && onActive(index),
  })
  const isActive = active === index

  return (
    <div ref={ref} className="relative pl-12 md:pl-16 py-14 lg:py-0 lg:min-h-[75vh] flex items-center">
      {/* Marcador */}
      <div className="absolute left-0 top-16 lg:top-1/2 -translate-x-1/2 lg:-translate-y-1/2 flex items-center justify-center">
        <div
          className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-display font-bold text-sm transition-colors duration-500 ${
            isActive ? 'border-gold bg-gold text-noir-950' : 'border-white/15 bg-noir-950 text-smoke-500'
          }`}
        >
          {index + 1}
        </div>
      </div>

      <motion.div
        initial={{ x: 60, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.8, ease }}
        className="relative w-full max-w-xl"
      >
        <div className="absolute -top-14 md:-top-20 -left-2 font-display font-extrabold text-[7rem] md:text-[10rem] text-white/[0.04] leading-none select-none pointer-events-none">
          0{index + 1}
        </div>

        <div className="relative z-10">
          <span className="inline-block border border-white/10 text-smoke-500 bg-noir-900 text-xs px-3 py-1 rounded-full mb-5 uppercase tracking-widest">
            Passo 0{index + 1}
          </span>
          <h3
            className={`font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-4 tracking-tight transition-colors duration-500 ${
              isActive ? 'text-white' : 'text-smoke-700'
            }`}
          >
            {step.title}
            <span className="text-gold">.</span>
          </h3>
          <p
            className={`text-xl md:text-2xl font-semibold mb-5 transition-colors duration-500 ${
              isActive ? 'text-gold' : 'text-smoke-700'
            }`}
          >
            {step.tagline}
          </p>
          <p className="text-smoke-500 text-base md:text-lg leading-relaxed max-w-lg">{step.desc}</p>

          {/* Tela do app no mobile (no desktop fica fixa ao lado) */}
          <PhoneShot src={step.img} alt={step.alt} className="lg:hidden mt-10 w-52 sm:w-60" />
        </div>
      </motion.div>
    </div>
  )
}

export default function ProcessTimeline() {
  const [active, setActive] = useState(0)
  const listRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start center', 'end center'],
  })
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section className="bg-noir-950 relative" id="como-funciona">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 pt-28 md:pt-36 pb-10 lg:pb-0">
        <ScrollReveal className="max-w-3xl">
          <p className="text-xs text-gold uppercase tracking-[0.3em] font-semibold mb-4">Como funciona</p>
          <h2 className="font-display font-bold text-5xl md:text-7xl tracking-tight leading-[1]">
            Indicar é simples<span className="text-gold">.</span>
          </h2>
          <p className="text-smoke-500 text-lg md:text-xl mt-6 max-w-xl">
            Tudo acontece no app Barbearia VIP — do convite ao crédito na sua conta.
          </p>
        </ScrollReveal>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 pb-24 md:pb-36">
        {/* Celular fixo (desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-0 h-screen flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 -m-16 bg-gold/15 blur-[90px] rounded-full pointer-events-none" />
              <div className="relative w-[18rem] xl:w-[20rem] aspect-[1/2]">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, y: 30, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.97 }}
                    transition={{ duration: 0.5, ease }}
                    className="absolute inset-0"
                  >
                    <PhoneShot src={steps[active].img} alt={steps[active].alt} className="w-full h-full" />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progresso */}
              <div className="absolute -right-10 top-1/2 -translate-y-1/2 flex flex-col gap-2" aria-hidden="true">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 rounded-full transition-all duration-500 ${i === active ? 'h-8 bg-gold' : 'h-1.5 bg-white/20'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Passos */}
        <div ref={listRef} className="relative ml-5 lg:ml-0">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-white/10" />
          <motion.div
            className="absolute left-0 top-0 bottom-0 w-[3px] -ml-px bg-gradient-to-b from-gold/20 via-gold to-gold/20 origin-top shadow-[0_0_15px_rgba(235,185,3,0.5)]"
            style={{ scaleY }}
          />
          {steps.map((step, index) => (
            <StepItem key={step.title} step={step} index={index} active={active} onActive={setActive} />
          ))}
        </div>
      </div>
    </section>
  )
}
