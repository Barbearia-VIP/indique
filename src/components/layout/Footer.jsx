import { ArrowUpRight } from 'lucide-react'
import Logo from '../ui/Logo'
import { links, navLinks } from '../../data/content'

export default function Footer() {
  const siteLabel = links.site.replace(/^https?:\/\//, '').replace(/\/$/, '')

  return (
    <footer className="bg-noir-950 border-t border-white/5 pt-20 pb-8" id="contato">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-20">
          <div className="md:col-span-2 md:border-r md:border-white/5 md:pr-8">
            <Logo className="w-40 mb-6" />
            <p className="font-display font-semibold text-2xl leading-snug max-w-xs">
              <span className="text-gold">Quem é amigo,</span>
              <br />
              indica VIP.
            </p>
          </div>

          <div>
            <h3 className="text-xs text-gold uppercase tracking-[0.3em] font-semibold mb-6">Programa</h3>
            <ul className="flex flex-col gap-4 text-sm text-smoke-300">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs text-gold uppercase tracking-[0.3em] font-semibold mb-6">Barbearia VIP</h3>
            <div className="flex flex-col gap-4 text-sm text-smoke-300">
              <a href={links.site} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:text-white transition-colors">
                {siteLabel}
                <ArrowUpRight size={14} />
              </a>
              <a href={links.app} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-gold hover:underline">
                Baixe o app
                <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between gap-4 text-xs text-smoke-700">
          <p>© {new Date().getFullYear()} Barbearia VIP. Todos os direitos reservados.</p>
          <p className="md:text-right max-w-xl">
            Créditos equivalentes a 30% do valor gasto pelo amigo indicado no atendimento, cumulativos e válidos nos
            serviços da Barbearia VIP. Consulte as condições no app.
          </p>
        </div>
      </div>
    </footer>
  )
}
