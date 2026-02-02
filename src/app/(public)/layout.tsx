import { Header } from '../components/layout/header'
import { Footer } from '../components/layout/footer'

/**
 * Public Pages Layout
 *
 * Provides header and footer for all public-facing pages.
 */
export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main id="main-content" className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}
