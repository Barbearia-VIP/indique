import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown, ArrowUpRight } from 'lucide-react'
import MagneticButton from '../ui/MagneticButton'
import AnimatedCounter from '../ui/AnimatedCounter'
import PhoneShot from '../ui/PhoneShot'
import { links } from '../../data/content'

const ease = [0.25, 0.46, 0.45, 0.94]

export default function Hero() {
  const containerRef = useRef(null)
  const blobRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const y = useTransform(scrollYProgress, [0, 1], [0, 120])
  const photoY = useTransform(scrollYProgress, [0, 1], [0, -60])

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!blobRef.current) return
      blobRef.current.style.transform = `translate(${e.clientX - 400}px, ${e.clientY - 400}px)`
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const lines = [
    { words: ['Tenha'] },
    { words: ['seu', 'corte'] },
    { words: ['grátis'], accentDot: true },
  ]

  let wordIndex = 0
  const renderWords = ({ words, accentDot }) =>
    words.map((word, i) => {
      const delay = 0.35 + wordIndex++ * 0.08
      const isLast = i === words.length - 1
      return (
        <motion.span
          key={word}
          initial={{ opacity: 0, y: 60, rotateX: -40 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay, duration: 0.7, ease }}
          className="inline-block mr-[0.22em] last:mr-0 text-white"
          style={{ transformOrigin: 'bottom center' }}
        >
          {word}
          {isLast && accentDot && <span className="text-gold">.</span>}
        </motion.span>
      )
    })

  return (
    <section
      ref={containerRef}
      id="topo"
      className="relative min-h-screen bg-noir-900 overflow-hidden flex flex-col justify-center pt-28 pb-24 lg:pt-24"
    >
      {/* Fundos */}
      <div
        ref={blobRef}
        className="absolute top-0 left-0 w-[800px] h-[800px] bg-gold/10 rounded-full blur-[120px] pointer-events-none transition-transform duration-1000 ease-out z-0 hidden md:block"
      />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[140px] pointer-events-none md:hidden" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none z-0" />
      <div className="grain absolute inset-0 z-[1]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-8 items-center">
        {/* Texto */}
        <motion.div style={{ opacity, y }} className="lg:col-span-7 flex flex-col items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="bg-noir-800 border border-white/10 text-smoke-300 text-xs px-4 py-2 rounded-full mb-8 flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 bg-app rounded-full animate-pulse-slow" />
            Novo no app Barbearia VIP · Indique um amigo
          </motion.div>

          <motion.span
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease }}
            className="tag-vip text-xl sm:text-2xl md:text-3xl mb-4"
          >
            Indique amigos.
          </motion.span>

          <h1
            className="font-display font-extrabold text-[3.6rem] leading-[0.95] sm:text-7xl md:text-8xl xl:text-[7.25rem] tracking-[-0.045em] mb-8"
            style={{ perspective: 1000 }}
          >
            {lines.map((line, i) => (
              <span key={i} className="block pb-1">{renderWords(line)}</span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="text-smoke-300 text-lg md:text-xl max-w-xl mb-10 leading-relaxed"
          >
            A cada amigo indicado que virar cliente VIP, você recebe{' '}
            <strong className="text-gold font-semibold">30% do valor do atendimento dele em créditos no app.</strong>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="flex flex-wrap items-center gap-4 sm:gap-6"
          >
            <MagneticButton
              href={links.app}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gold text-noir-950 font-display font-semibold px-8 py-4 rounded-full text-base sm:text-lg hover:shadow-[0_0_40px_rgba(235,185,3,0.35)] transition-shadow"
            >
              Quero indicar um amigo
              <ArrowUpRight size={20} />
            </MagneticButton>
            <a
              href="#como-funciona"
              className="border border-white/20 text-smoke-300 hover:text-white hover:border-white/40 hover:bg-white/5 font-display font-medium px-8 py-4 rounded-full text-base sm:text-lg transition-all"
            >
              Veja como funciona
            </a>
          </motion.div>
        </motion.div>

        {/* Composição de imagem */}
        <motion.div
          style={{ y: photoY }}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4, ease }}
          className="lg:col-span-5 relative mx-auto w-full max-w-[26rem] lg:max-w-none pl-10 sm:pl-16 lg:pl-0"
        >
          <div className="relative aspect-[2/3] rounded-[2rem] overflow-hidden border border-white/10">
            <img
              src="img/foto-cliente-vip.jpg"
              alt="Cliente sorridente na cadeira da Barbearia VIP com a capa da marca"
              className="absolute inset-0 w-full h-full object-cover"
              fetchpriority="high"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-noir-950/80 via-transparent to-transparent" />
            <p className="absolute bottom-5 right-5 left-24 sm:left-28 text-right text-sm sm:text-base font-semibold leading-snug">
              <span className="text-gold">Quem é amigo,</span>
              <br />
              indica VIP.
            </p>
          </div>

          {/* Selo giratório */}
          <div className="absolute top-6 -right-3 sm:-right-8 w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center">
            <motion.svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              aria-hidden="true"
            >
              <circle cx="50" cy="50" r="48" className="fill-noir-950" />
              <path id="circlePath" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" fill="transparent" />
              <text className="fill-gold text-[9.6px] font-semibold uppercase" style={{ letterSpacing: '0.18em' }}>
                <textPath href="#circlePath">Quem é amigo · indica VIP · </textPath>
              </text>
            </motion.svg>
            <img src="img/emblema-vip.svg" alt="" className="relative w-10 sm:w-12" />
          </div>

          {/* Celular flutuante */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.9, ease }}
            className="absolute left-0 lg:-left-16 bottom-10 w-32 sm:w-40 lg:w-44"
          >
            <div className="animate-float motion-reduce:animate-none">
              <PhoneShot
                src="img/app-passo-1.jpg"
                alt="App Barbearia VIP com a opção Indique um amigo"
                className="rounded-[1.4rem] shadow-[0_30px_60px_-10px_rgba(0,0,0,0.95)]"
                eager
              />
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Destaque 30% */}
      <div className="absolute bottom-8 left-6 md:left-12 z-20 hidden md:block">
        <div className="font-display flex flex-col gap-1 items-start">
          <span className="text-4xl font-extrabold text-gold tracking-tight">
            <AnimatedCounter end={30} suffix="%" />
          </span>
          <span className="text-xs text-smoke-500 tracking-wider uppercase">do valor gasto pelo amigo volta pra você</span>
        </div>
      </div>

      <motion.a
        href="#vantagens"
        aria-label="Rolar para a próxima seção"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/30 hover:text-white/60 z-20"
      >
        <ChevronDown size={26} />
      </motion.a>
    </section>
  )
}
