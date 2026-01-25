import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from './components/layout/header'
import { Footer } from './components/layout/footer'
import { Analytics } from './components/analytics'
import { Toaster } from 'sonner'
import { Providers } from './components/providers'
import { SkipLink } from './components/accessibility/skip-link'
import { SmokeCursor } from './components/effects/smoke-cursor'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '3rd Coast Smoke Company - Premium Hemp Products in Houston, TX',
  description: '3rd Coast Smoke Company offers high-quality, lab-tested hemp products in Houston, TX. Visit us at 8302 N Eldridge Pkwy for a premium shopping experience with expert guidance.',
  keywords: 'smoke shop, hemp products, Houston, TX, 3rd Coast Smoke Company, Delta-8, CBD, THCA, HHC, vape, kratom, glass pipes',
  authors: [{ name: '3rd Coast Smoke Company' }],
  creator: '3rd Coast Smoke Company',
  publisher: '3rd Coast Smoke Company',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: '3rd Coast Smoke Company - Premium Hemp Products in Houston, TX',
    description: 'Houston\'s premier destination for premium, lab-tested hemp products. Located at 8302 N Eldridge Pkwy. Open daily until 11 PM.',
    url: 'https://thcplus.com',
    siteName: '3rd Coast Smoke Company',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '3rd Coast Smoke Company - Premium Hemp Products',
    description: 'Houston\'s premier destination for premium, lab-tested hemp products. Open daily until 11 PM.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SkipLink />
        <Providers>
          <SmokeCursor enabled={false} color="rgba(147, 51, 234, 0.25)" throttle={80} />
          <div className="min-h-screen flex flex-col">
            <Header />
            <main id="main-content" className="flex-grow">{children}</main>
            <Footer />
          </div>
          <Analytics />
          <Toaster position="top-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  )
}
