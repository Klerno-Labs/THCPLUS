import { HeroSection } from './components/sections/hero-section'
import { AboutSection } from './components/sections/about-section'
import { EducationSection } from './components/sections/education-section'
import { TestimonialsSection } from './components/sections/testimonials-section'
import { ContactSection } from './components/sections/contact-section'
import { NewsletterSignup } from './components/newsletter-signup'
import { LocalBusinessStructuredData, FAQStructuredData } from './components/structured-data'

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

        <TestimonialsSection />
        <ContactSection />
      </div>
    </>
  )
}
