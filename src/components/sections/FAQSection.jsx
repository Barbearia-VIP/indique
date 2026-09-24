import * as Accordion from '@radix-ui/react-accordion'
import { Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { faqs } from '../../data/content'
import ScrollReveal from '../ui/ScrollReveal'

export default function FAQSection() {
  const [value, setValue] = useState('item-0')

  return (
    <section className="bg-noir-900 py-28 md:py-36 border-b border-white/5" id="duvidas">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-24 items-start">
          <ScrollReveal className="lg:sticky lg:top-28">
            <p className="text-xs text-gold uppercase tracking-[0.3em] font-semibold mb-4">Regras e dúvidas</p>
            <h2 className="font-display font-bold text-4xl md:text-6xl tracking-tight leading-[1.05] mb-6">
              Tudo o que você precisa saber<span className="text-gold">.</span>
            </h2>
            <p className="text-smoke-500 text-lg leading-relaxed max-w-md mb-10">
              Uma dinâmica simples que valoriza quem já faz parte da comunidade VIP e apresenta a experiência para
              novos clientes.
            </p>

            <div className="relative hidden lg:block max-w-md">
              <div className="aspect-[5/4] rounded-[2rem] overflow-hidden border border-white/10 relative">
                <img
                  src="img/foto-barbeiro-cliente.jpg"
                  alt="Barbeiro da Barbearia VIP finalizando o corte de um cliente"
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-noir-950/90 via-noir-950/10 to-transparent" />
                <p className="absolute bottom-6 left-6 right-6 font-display font-semibold text-xl">
                  <span className="text-gold">Quem é amigo,</span> indica VIP.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.15} className="w-full">
            <Accordion.Root type="single" collapsible className="w-full flex flex-col" value={value} onValueChange={setValue}>
              {faqs.map((faq, index) => {
                const id = `item-${index}`
                const open = value === id
                return (
                  <Accordion.Item key={id} value={id} className="border-b border-white/10 overflow-hidden">
                    <Accordion.Header className="flex">
                      <Accordion.Trigger className="group text-lg md:text-xl py-6 md:py-7 flex justify-between items-center w-full text-left focus:outline-none focus-visible:text-gold">
                        <span
                          className={`font-medium tracking-tight pr-8 transition-colors duration-300 ${
                            open ? 'text-gold' : 'text-smoke-100 group-hover:text-white'
                          }`}
                        >
                          {faq.q}
                        </span>
                        <span
                          className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center border transition-colors duration-300 ${
                            open ? 'border-gold bg-gold text-noir-950' : 'border-white/15 text-smoke-500 group-hover:text-white'
                          }`}
                        >
                          {open ? <Minus size={18} /> : <Plus size={18} />}
                        </span>
                      </Accordion.Trigger>
                    </Accordion.Header>
                    <Accordion.Content asChild forceMount>
                      <AnimatePresence initial={false}>
                        {open && (
                          <motion.div
                            initial="collapsed"
                            animate="open"
                            exit="collapsed"
                            variants={{
                              open: { opacity: 1, height: 'auto', marginBottom: 24, marginTop: -4 },
                              collapsed: { opacity: 0, height: 0, marginBottom: 0, marginTop: 0 },
                            }}
                            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className="overflow-hidden"
                          >
                            <p className="text-smoke-500 text-base leading-relaxed pr-12">{faq.a}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Accordion.Content>
                  </Accordion.Item>
                )
              })}
            </Accordion.Root>
            <p className="text-sm text-smoke-700 mt-8">
              Consulte as condições do programa no app Barbearia VIP.
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
