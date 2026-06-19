import type { Metadata } from 'next'
import { Hero } from '@/components/site/hero'
import { StatsSection } from '@/components/site/stats-section'
import { ServicesSection } from '@/components/site/services-section'
import { MetricsSection } from '@/components/site/metrics-section'
import { ProcessSection } from '@/components/site/process-section'
import { CasesSection } from '@/components/site/cases-section'
import { TestimonialsSection } from '@/components/site/testimonials-section'
import { CTASection } from '@/components/site/cta-section'

export const metadata: Metadata = {
  title: 'GM Mídia Digital — Tráfego Pago, SDR IA e Automação Comercial',
  description:
    'Transformamos tráfego em vendas com IA. Especialistas em Gestão de Tráfego Pago, SDR com Inteligência Artificial, Automação Comercial e CRM. +150 clientes, 340% ROI médio.',
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsSection />
      <ServicesSection />
      <MetricsSection />
      <ProcessSection />
      <CasesSection />
      <TestimonialsSection />
      <CTASection />
    </>
  )
}
