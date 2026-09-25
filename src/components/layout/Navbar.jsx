import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import MagneticButton from '../ui/MagneticButton'
import Logo from '../ui/Logo'
import { links, navLinks } from '../../data/content'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 80)
  })

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled || mobileMenuOpen
            ? 'backdrop-blur-xl bg-noir-950/85 border-b border-white/5 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 flex justify-between items-center">
          <a href="#topo" className="z-50" aria-label="Barbearia VIP — início">
            <Logo className={`transition-all duration-500 ${scrolled ? 'w-24' : 'w-28 md:w-32'}`} />
          </a>

          <nav className="hidden md:flex items-center gap-8" aria-label="Seções">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-body text-sm text-smoke-500 hover:text-white transition-colors relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-[2px] bg-gold w-0 group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <MagneticButton
              href={links.app}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-gold text-gold text-sm font-semibold hover:bg-gold hover:text-noir-950 transition-colors"
            >
              Indicar agora
              <ArrowUpRight size={16} />
            </MagneticButton>
          </div>

          <button
            className="md:hidden z-50 text-white p-2 -mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-noir-900 z-40 flex flex-col justify-center px-6"
          >
            <nav className="flex flex-col gap-5 mt-10" aria-label="Seções">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ x: -60, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.07, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="font-display font-bold text-5xl tracking-tight text-white hover:text-gold transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>
            <motion.a
              href={links.app}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-12 inline-flex w-fit items-center gap-2 bg-gold text-noir-950 font-semibold px-7 py-4 rounded-full"
            >
              Indicar um amigo agora
              <ArrowUpRight size={18} />
            </motion.a>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-10 left-6 text-sm text-smoke-500"
            >
              Quem é amigo, <span className="text-gold font-semibold">indica VIP.</span>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
