import dynamic from 'next/dynamic'
import { HeroSection } from '../components/sections/hero-section'
import { LocalBusinessStructuredData, FAQStructuredData } from '../components/structured-data'

// Lazy load below-the-fold sections to reduce initial bundle size
const AboutSection = dynamic(
  () =>
    import('../components/sections/about-section').then((mod) => ({ default: mod.AboutSection })),
  {
    loading: () => <div className="py-20 bg-background" />,
  }
)

const EducationSection = dynamic(
  () =>
    import('../components/sections/education-section').then((mod) => ({
      default: mod.EducationSection,
    })),
  {
    loading: () => <div className="py-16 bg-primary/5" />,
  }
)

const NewsletterSignup = dynamic(
  () =>
    import('../components/newsletter-signup').then((mod) => ({ default: mod.NewsletterSignup })),
  {
    loading: () => <div className="py-16 bg-background" />,
  }
)

const ContactSection = dynamic(
  () =>
    import('../components/sections/contact-section').then((mod) => ({
      default: mod.ContactSection,
    })),
  {
    loading: () => <div className="py-20 bg-background" />,
  }
)

export default function Home() {
  return (
    <>
      {/* Structured Data for SEO */}
      <LocalBusinessStructuredData />
      <FAQStructuredData />

      <div>
        <HeroSection />
        <AboutSection />
        <EducationSection />

        {/* Newsletter Signup Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4 max-w-2xl">
            <NewsletterSignup variant="card" />
          </div>
        </section>

        <ContactSection />
      </div>
    </>
  )
}
