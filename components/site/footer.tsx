import Link from 'next/link'
import { Zap, Mail, Phone, MapPin, Instagram, Linkedin, Youtube, Twitter } from 'lucide-react'

const footerLinks = {
  servicos: [
    { label: 'Tráfego Pago', href: '/servicos#trafego-pago' },
    { label: 'SDR com IA', href: '/servicos#sdr-ia' },
    { label: 'Automação Comercial', href: '/servicos#automacao' },
    { label: 'Captação de Leads', href: '/servicos#captacao' },
    { label: 'WhatsApp Inteligente', href: '/servicos#whatsapp' },
    { label: 'CRM e Vendas', href: '/servicos#crm' },
  ],
  empresa: [
    { label: 'Sobre Nós', href: '/sobre' },
    { label: 'Cases de Sucesso', href: '/cases' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contato', href: '/contato' },
  ],
  legal: [
    { label: 'Política de Privacidade', href: '/politica-de-privacidade' },
    { label: 'Termos de Uso', href: '/termos' },
  ],
}

export function Footer() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5511999999999'
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Olá! Gostaria de conhecer os serviços da GM Mídia Digital.')}`

  return (
    <footer className="bg-[#080808] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-white text-xl leading-tight block">GM Mídia</span>
                <span className="text-indigo-400 text-sm font-medium leading-tight block -mt-0.5">Digital</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Agência especializada em Tráfego Pago, SDR com IA e Automação Comercial.
              Transformamos tráfego em vendas com tecnologia e estratégia.
            </p>
            <div className="space-y-3">
              <a
                href="mailto:contato@gmmidia.com.br"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-indigo-400 transition-colors duration-200"
              >
                <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                contato@gmmidia.com.br
              </a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-green-400 transition-colors duration-200"
              >
                <Phone className="w-4 h-4 text-green-500 shrink-0" />
                +55 (11) 99999-9999
              </a>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                São Paulo, SP — Brasil
              </div>
            </div>
            <div className="flex items-center gap-3">
              {[
                { href: '#', icon: Instagram, label: 'Instagram' },
                { href: '#', icon: Linkedin, label: 'LinkedIn' },
                { href: '#', icon: Youtube, label: 'YouTube' },
                { href: '#', icon: Twitter, label: 'Twitter' },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-indigo-500/20 flex items-center justify-center text-gray-400 hover:text-indigo-400 border border-white/5 hover:border-indigo-500/30 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm tracking-wide uppercase">Serviços</h4>
            <ul className="space-y-2.5">
              {footerLinks.servicos.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-indigo-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm tracking-wide uppercase">Empresa</h4>
            <ul className="space-y-2.5">
              {footerLinks.empresa.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-indigo-400 transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Card */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold text-sm tracking-wide uppercase">Comece Agora</h4>
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 space-y-4">
              <p className="text-sm text-gray-300 leading-relaxed">
                Agende um diagnóstico gratuito e descubra como podemos escalar suas vendas.
              </p>
              <Link
                href="/contato"
                className="block text-center px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:from-indigo-500 hover:to-purple-500 transition-all duration-200"
              >
                Diagnóstico Gratuito
              </Link>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center px-4 py-2.5 rounded-xl border border-green-500/30 text-green-400 text-sm font-medium hover:bg-green-500/10 transition-all duration-200"
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} GM Mídia Digital. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-gray-500 hover:text-gray-300 transition-colors duration-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
