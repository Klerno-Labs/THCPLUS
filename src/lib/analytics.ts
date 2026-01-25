/**
 * Google Analytics Event Tracking Utilities
 *
 * Helper functions to track custom events throughout the application.
 * Only tracks if Google Analytics is properly configured.
 */

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void
  }
}

/**
 * Track a custom event in Google Analytics
 */
export function trackEvent(eventName: string, eventParams?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams)
  }
}

/**
 * Track age verification acceptance
 */
export function trackAgeVerification(accepted: boolean) {
  trackEvent('age_verification', {
    verification_status: accepted ? 'accepted' : 'declined',
  })
}

/**
 * Track contact form submission
 */
export function trackContactFormSubmit(success: boolean) {
  trackEvent('contact_form_submit', {
    form_location: 'contact_section',
    success: success,
  })
}

/**
 * Track newsletter signup
 */
export function trackNewsletterSignup(location: string) {
  trackEvent('newsletter_signup', {
    signup_location: location,
  })
}

/**
 * Track navigation clicks
 */
export function trackNavigation(destination: string, source: string = 'header') {
  trackEvent('navigation_click', {
    destination: destination,
    source: source,
  })
}

/**
 * Track CTA button clicks
 */
export function trackCTAClick(ctaName: string, ctaLocation: string) {
  trackEvent('cta_click', {
    cta_name: ctaName,
    cta_location: ctaLocation,
  })
}

/**
 * Track testimonial interactions
 */
export function trackTestimonialView(testimonialIndex: number) {
  trackEvent('testimonial_view', {
    testimonial_index: testimonialIndex,
  })
}

/**
 * Track education content engagement
 */
export function trackEducationEngagement(contentType: string) {
  trackEvent('education_engagement', {
    content_type: contentType,
  })
}

/**
 * Track phone call clicks
 */
export function trackPhoneClick(location: string) {
  trackEvent('phone_click', {
    click_location: location,
  })
}

/**
 * Track social media link clicks
 */
export function trackSocialClick(platform: string) {
  trackEvent('social_click', {
    social_platform: platform,
  })
}

/**
 * Track Google Reviews link clicks
 */
export function trackReviewClick(location: string) {
  trackEvent('review_click', {
    click_location: location,
  })
}

/**
 * Track FAQ interactions
 */
export function trackFAQClick(question: string) {
  trackEvent('faq_click', {
    question: question,
  })
}

/**
 * Track page views (called automatically by Next.js)
 */
export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '', {
      page_path: url,
    })
  }
}
