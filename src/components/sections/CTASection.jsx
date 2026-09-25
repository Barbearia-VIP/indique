import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import MagneticButton from '../ui/MagneticButton'
import { links } from '../../data/content'

export default function CTASection() {
  return (
    <section className="relative min-h-screen bg-noir-950 flex flex-col justify-center items-center overflow-hidden py-32" id="indicar">
      {/* Foto de fundo */}
      <img
        src="img/foto-corte.jpg"
        alt=""
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover object-[70%_30%] opacity-30"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-noir-950 via-noir-950/70 to-noir-950" />
      <div className="grain absolute inset-0 z-0 opacity-60" />

      {/* Spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(235,185,3,0.12),transparent)] rounded-full blur-[50px] pointer-events-none" />
      <motion.div
        animate={{ y: [0, -80, 0], x: [0, 40, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-20 left-[10%] w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] bg-gold rounded-full opacity-[0.05] blur-3xl"
      />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
        <motion.img
          src="img/emblema-vip.svg"
          alt=""
          initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-16 md:w-20 mb-10"
        />

        <motion.h2
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="font-display font-extrabold text-5xl sm:text-7xl md:text-8xl lg:text-[8.5rem] tracking-[-0.045em] leading-[0.92] mb-10 flex flex-col"
        >
          <span className="text-white">Seu próximo</span>
          <span className="text-white">corte pode</span>
          <span className="text-gold">sair grátis!</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-smoke-300 text-lg md:text-2xl mb-14 max-w-2xl"
        >
          Indique um amigo pelo app. Ele se cadastra pelo seu convite e realiza um atendimento.{' '}
          <strong className="text-gold font-semibold">Você recebe 30% do valor gasto por ele em créditos.</strong>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col items-center gap-6 w-full"
        >
          <MagneticButton
            href={links.app}
            target="_blank"
            rel="noopener noreferrer"
            className="px-10 sm:px-12 py-5 sm:py-6 text-lg md:text-2xl font-display font-semibold bg-gold text-noir-950 rounded-full hover:shadow-[0_0_50px_rgba(235,185,3,0.4)] transition-shadow group overflow-hidden relative"
          >
            <span className="relative z-10 flex items-center gap-3">
              Indicar um amigo agora
              <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ArrowRight size={24} />
              </motion.span>
            </span>
            <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity z-0" />
          </MagneticButton>

          <p className="text-sm text-smoke-500 mt-2">
            Abra o app Barbearia VIP e toque em <span className="text-white font-medium">“Indique um amigo”</span>.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
