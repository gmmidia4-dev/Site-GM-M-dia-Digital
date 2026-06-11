import { Header } from '@/components/site/header'
import { Footer } from '@/components/site/footer'
import { WhatsAppButton } from '@/components/site/whatsapp-button'

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
