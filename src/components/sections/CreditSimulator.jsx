import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { Percent, Layers, Scissors } from 'lucide-react'
import ScrollReveal from '../ui/ScrollReveal'
import { CREDIT_RATE } from '../../data/content'

const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

const facts = [
  { icon: Percent, title: '30% do valor', desc: 'do atendimento do amigo volta pra você em créditos.' },
  { icon: Layers, title: 'Cumulativos', desc: 'quanto mais amigos virarem VIP, mais créditos você junta.' },
  { icon: Scissors, title: 'Use na VIP', desc: 'nos seus próximos serviços da Barbearia VIP.' },
]

function Slider({ id, label, value, display, min, max, step, onChange }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 mb-3">
        <label htmlFor={id} className="text-sm text-smoke-500">{label}</label>
        <span className="font-display font-bold text-xl text-white tabular-nums">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range-vip w-full"
        style={{ background: `linear-gradient(to right, #ebb903 ${pct}%, rgba(255,255,255,0.12) ${pct}%)` }}
      />
    </div>
  )
}

export default function CreditSimulator() {
  const [friends, setFriends] = useState(4)
  const [ticket, setTicket] = useState(60)

  const credits = friends * ticket * CREDIT_RATE
  const cutsCovered = friends * CREDIT_RATE // em cortes do mesmo valor
  const fullCuts = Math.floor(cutsCovered + 1e-9)
  const progress = cutsCovered - fullCuts
  const friendsToNext = Math.ceil((fullCuts + 1 - cutsCovered) / CREDIT_RATE - 1e-9)

  const spring = useSpring(credits, { stiffness: 120, damping: 20 })
  const creditsText = useTransform(spring, (v) => brl.format(v))
  useEffect(() => { spring.set(credits) }, [credits, spring])

  return (
    <section className="bg-gold text-noir-950 py-24 md:py-32 relative overflow-hidden" id="simulador">
      <img
        src="img/emblema-vip.svg"
        alt=""
        className="absolute -right-24 -bottom-24 w-[28rem] opacity-[0.08] brightness-0 pointer-events-none select-none"
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.3em] font-bold mb-4 opacity-70">Simule seus créditos</p>
          <h2 className="font-display font-extrabold text-5xl md:text-7xl tracking-tight leading-[0.95] mb-6">
            Mais amigos.
            <br />
            Mais créditos.
            <br />
            <span className="bg-noir-950 text-gold px-3 -ml-1 inline-block mt-2">Mais VIP.</span>
          </h2>
          <p className="text-lg md:text-xl max-w-md mb-12 font-medium opacity-80">
            Arraste e veja quanto você pode acumular indicando a Barbearia VIP para quem ainda não conhece.
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {facts.map(({ icon: Icon, title, desc }) => (
              <li key={title} className="border-t-2 border-noir-950/80 pt-4">
                <Icon size={22} strokeWidth={2.5} className="mb-3" />
                <p className="font-display font-bold text-lg leading-tight">{title}</p>
                <p className="text-sm opacity-75 mt-1 leading-snug">{desc}</p>
              </li>
            ))}
          </ul>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div className="bg-noir-950 text-white rounded-[2rem] p-6 sm:p-10 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
            <div className="flex flex-col gap-8">
              <Slider
                id="sim-amigos"
                label="Amigos que viraram clientes VIP"
                value={friends}
                display={friends}
                min={1}
                max={20}
                step={1}
                onChange={setFriends}
              />
              <Slider
                id="sim-valor"
                label="Valor médio do atendimento de cada amigo"
                value={ticket}
                display={brl.format(ticket)}
                min={30}
                max={200}
                step={5}
                onChange={setTicket}
              />
            </div>

            <div className="mt-10 pt-8 border-t border-white/10">
              <p className="text-sm text-smoke-500 mb-1">Você acumula em créditos</p>
              <motion.p
                className="font-display font-extrabold text-5xl sm:text-6xl text-gold tracking-tight tabular-nums"
                aria-live="polite"
              >
                {creditsText}
              </motion.p>

              <div className="mt-8">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-smoke-300">
                    {fullCuts > 0 ? (
                      <>
                        Já paga <strong className="text-white">{fullCuts} {fullCuts === 1 ? 'corte' : 'cortes'}</strong>*
                      </>
                    ) : (
                      'Rumo ao corte grátis*'
                    )}
                  </span>
                  <span className="text-smoke-500">
                    +{friendsToNext} {friendsToNext === 1 ? 'amigo' : 'amigos'} para o próximo
                  </span>
                </div>
                <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-app to-gold"
                    animate={{ width: `${Math.max(progress * 100, 4)}%` }}
                    transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                  />
                </div>
              </div>

              <p className="text-xs text-smoke-700 mt-6 leading-relaxed">
                *Simulação ilustrativa, considerando cortes do mesmo valor do atendimento do amigo. O crédito
                corresponde a 30% do valor efetivamente gasto por cada amigo indicado no atendimento.
              </p>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
