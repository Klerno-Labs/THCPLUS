# Google Analytics 4 (GA4) Setup Guide

This guide explains how to set up and configure Google Analytics 4 for tracking user behavior, conversions, and website performance in THC Plus.

## Overview

Google Analytics 4 (GA4) provides comprehensive analytics for understanding user behavior, tracking conversions, and optimizing your website. Our implementation includes custom event tracking for all major user interactions.

## Features Implemented

### Automatic Tracking

- ✅ **Page views** - Automatically tracked for all pages
- ✅ **Scroll depth** - Tracks how far users scroll on pages
- ✅ **Outbound clicks** - Tracks clicks on external links
- ✅ **Site search** - Tracks internal search queries (if applicable)
- ✅ **Video engagement** - Tracks video plays, pauses, completions

### Custom Event Tracking

- ✅ **Age verification** - Tracks acceptance/denial rates
- ✅ **Contact form submissions** - Tracks success/failure
- ✅ **Newsletter signups** - Tracks signup location
- ✅ **Navigation clicks** - Tracks menu and link clicks
- ✅ **CTA button clicks** - Tracks call-to-action interactions
- ✅ **Testimonial views** - Tracks testimonial carousel engagement
- ✅ **Education content** - Tracks engagement with educational content
- ✅ **Phone clicks** - Tracks click-to-call interactions
- ✅ **Social media clicks** - Tracks social link clicks
- ✅ **Review link clicks** - Tracks Google Reviews clicks
- ✅ **FAQ interactions** - Tracks which questions users expand

---

## Setup Instructions

### Step 1: Create Google Analytics Account

1. Go to [https://analytics.google.com/](https://analytics.google.com/)
2. Sign in with your Google account
3. Click **"Start measuring"**
4. Create an **Account**:
   - Account name: `3rd Coast Smoke Company`
   - Data sharing settings: Select all (recommended)
   - Click **"Next"**

### Step 2: Create Property

1. Property setup:
   - Property name: `THC Plus Website`
   - Reporting time zone: `United States - Central Time`
   - Currency: `US Dollar (USD)`
   - Click **"Next"**

2. Business information:
   - Industry category: `Retail`
   - Business size: `Small` (1-10 employees)
   - Click **"Next"**

3. Business objectives:
   - Select: **"Generate leads"** and **"Examine user behavior"**
   - Click **"Create"**

4. Accept the Terms of Service

### Step 3: Set Up Data Stream

1. Select platform: **Web**
2. Configure stream:
   - Website URL: `https://thcplus.vercel.app` (or your production domain)
   - Stream name: `THC Plus Production`
   - Click **"Create stream"**

3. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 4: Add to Environment Variables

#### Local Development (.env.local)

Add this to your `.env.local` file:

```bash
# Google Analytics 4
NEXT_PUBLIC_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

#### Vercel Production

1. Go to [https://vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add variable:
   - Key: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - Value: Your Measurement ID (G-XXXXXXXXXX)
   - Environment: **Production**, **Preview**, **Development** (check all)
   - Click **Save**

5. **Redeploy** your application:
   - Go to **Deployments** tab
   - Click **...** on latest deployment
   - Select **Redeploy**

---

## How It Works

### 1. Analytics Component

**File**: [src/app/components/analytics.tsx](../src/app/components/analytics.tsx:1-29)

Loads Google Tag Manager script:

- Loaded with `afterInteractive` strategy (after page is interactive)
- Only loads if `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set
- Initializes `gtag` function for event tracking

### 2. Analytics Utilities

**File**: [src/lib/analytics.ts](../src/lib/analytics.ts:1-135)

Provides helper functions for tracking custom events:

```typescript
// Age verification
trackAgeVerification(accepted: boolean)

// Contact form
trackContactFormSubmit(success: boolean)

// Newsletter
trackNewsletterSignup(location: string)

// Navigation
trackNavigation(destination: string, source?: string)

// CTA clicks
trackCTAClick(ctaName: string, ctaLocation: string)

// Testimonials
trackTestimonialView(testimonialIndex: number)

// Education
trackEducationEngagement(contentType: string)

// Phone clicks
trackPhoneClick(location: string)

// Social media
trackSocialClick(platform: string)

// Reviews
trackReviewClick(location: string)

// FAQ
trackFAQClick(question: string)

// Page views (automatic)
trackPageView(url: string)
```

### 3. Event Tracking Implementation

**Age Verification** ([src/app/(auth)/age-verification/page.tsx](<../src/app/(auth)/age-verification/page.tsx:14-38>))

```typescript
import { trackAgeVerification } from '@/lib/analytics'

// On accept
trackAgeVerification(true)

// On deny
trackAgeVerification(false)
```

**Contact Form** ([src/app/components/sections/contact-section.tsx](../src/app/components/sections/contact-section.tsx:15))

```typescript
import { trackContactFormSubmit, trackPhoneClick } from '@/lib/analytics'

// On successful submission
trackContactFormSubmit(true)

// On failed submission
trackContactFormSubmit(false)

// On phone number click
trackPhoneClick('contact_section')
```

---

## Custom Events Reference

### Event Structure

All custom events follow GA4 best practices with consistent naming and parameters:

| Event Name             | Parameters                                      | Description                   |
| ---------------------- | ----------------------------------------------- | ----------------------------- |
| `age_verification`     | `verification_status: 'accepted' \| 'declined'` | User verifies age             |
| `contact_form_submit`  | `form_location: string, success: boolean`       | Contact form submission       |
| `newsletter_signup`    | `signup_location: string`                       | Newsletter signup             |
| `navigation_click`     | `destination: string, source: string`           | Navigation interaction        |
| `cta_click`            | `cta_name: string, cta_location: string`        | Call-to-action click          |
| `testimonial_view`     | `testimonial_index: number`                     | Testimonial carousel view     |
| `education_engagement` | `content_type: string`                          | Education content interaction |
| `phone_click`          | `click_location: string`                        | Click-to-call interaction     |
| `social_click`         | `social_platform: string`                       | Social media link click       |
| `review_click`         | `click_location: string`                        | Google Reviews link click     |
| `faq_click`            | `question: string`                              | FAQ expansion click           |

---

## Viewing Analytics Data

### Real-Time Reports

1. Go to **Reports** → **Realtime**
2. View:
   - Users currently on site
   - Page views in last 30 minutes
   - Events being triggered
   - Geographic location of users
   - Traffic sources

### Engagement Reports

1. Go to **Reports** → **Engagement**
2. View:
   - **Events**: All tracked events with counts
   - **Pages and screens**: Most viewed pages
   - **Landing pages**: Entry points to your site
   - **User engagement**: Session duration, engagement rate

### Custom Reports

#### Create Conversion Events

1. Go to **Configure** → **Events**
2. Find your event (e.g., `contact_form_submit`)
3. Toggle **"Mark as conversion"**
4. Now you can track this as a conversion in reports

#### Create Custom Funnels

1. Go to **Explore** → **Funnel exploration**
2. Create funnel:
   - **Step 1**: Age verification accepted
   - **Step 2**: Page view (any page)
   - **Step 3**: Contact form submit
3. Analyze drop-off rates at each step

---

## Key Metrics to Monitor

### User Acquisition

- **New users**: How many first-time visitors
- **Traffic sources**: Where users are coming from
  - Organic Search
  - Direct
  - Social
  - Referral
- **Geographic location**: Where users are located

### Engagement

- **Engagement rate**: Percentage of engaged sessions
- **Average engagement time**: How long users stay
- **Pages per session**: How many pages users view
- **Scroll depth**: How far users scroll

### Conversions

- **Age verification rate**: % who click "I am 21 or older"
- **Contact form submissions**: Total submissions
- **Newsletter signups**: Total signups
- **Phone clicks**: Click-to-call interactions
- **Review clicks**: Google Reviews link clicks

### Custom Events Performance

View all custom events under **Reports** → **Engagement** → **Events**:

| Event                 | What to Monitor                  |
| --------------------- | -------------------------------- |
| `age_verification`    | Acceptance rate (should be >90%) |
| `contact_form_submit` | Success rate, volume trends      |
| `newsletter_signup`   | Signup location performance      |
| `navigation_click`    | Most popular destinations        |
| `cta_click`           | Which CTAs perform best          |
| `phone_click`         | Phone engagement by page         |
| `social_click`        | Most popular social platform     |
| `faq_click`           | Most frequently asked questions  |

---

## Enhanced Tracking (Optional)

### E-Commerce Tracking

If you add e-commerce functionality later, you can enable enhanced e-commerce:

```typescript
// Track product views
window.gtag('event', 'view_item', {
  currency: 'USD',
  value: 29.99,
  items: [
    {
      item_id: 'SKU_12345',
      item_name: 'Delta-8 Gummies',
      price: 29.99,
      quantity: 1,
    },
  ],
})

// Track add to cart
window.gtag('event', 'add_to_cart', {
  currency: 'USD',
  value: 29.99,
  items: [
    /* ... */
  ],
})

// Track purchases
window.gtag('event', 'purchase', {
  transaction_id: 'T_12345',
  value: 79.99,
  currency: 'USD',
  items: [
    /* ... */
  ],
})
```

### User Properties

Set custom user properties for segmentation:

```typescript
import * as gtag from '@/lib/analytics'

// Set user properties
if (typeof window !== 'undefined' && window.gtag) {
  window.gtag('set', 'user_properties', {
    user_type: 'returning_customer',
    preferred_category: 'edibles',
  })
}
```

### Custom Dimensions

1. Go to **Configure** → **Custom definitions**
2. Create custom dimensions:
   - **User properties**: For user-level data (e.g., customer type)
   - **Event parameters**: For event-level data (e.g., product category)

---

## Testing Event Tracking

### Test in Development

1. Start dev server: `npm run dev`
2. Open browser with GA Debugger extension: [Chrome Extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
3. Enable the debugger
4. Perform actions on your site
5. Check browser console for GA debug messages

### Test with GA4 DebugView

1. Go to **Configure** → **DebugView**
2. Ensure debug mode is enabled (automatically enabled in development)
3. Perform actions on your site
4. View events in real-time in DebugView

### Test in Production

1. Deploy to Vercel
2. Go to **Reports** → **Realtime**
3. Visit your production site
4. Perform actions (age verification, contact form, etc.)
5. Events should appear within 30 seconds in Realtime reports

---

## Privacy & Compliance

### GDPR/CCPA Compliance

GA4 is configured to be privacy-friendly:

1. **IP Anonymization**:
   - Enabled by default in GA4
   - IP addresses are anonymized before storage

2. **Cookie Consent**:
   - Consider adding a cookie consent banner
   - Example libraries: `cookie-consent`, `cookiebot`
   - Delay GA4 initialization until consent given

3. **Data Retention**:
   - Go to **Admin** → **Data Settings** → **Data Retention**
   - Set retention period: **14 months** (recommended)

4. **User Rights**:
   - Users can request data deletion
   - Go to **Admin** → **Data Deletion Requests**

### User Opt-Out

Implement opt-out functionality:

```typescript
// Disable GA4 tracking
window['ga-disable-G-XXXXXXXXXX'] = true
```

### Privacy Policy Update

Ensure your privacy policy mentions:

- Google Analytics usage
- What data is collected
- How users can opt-out
- Data retention period
- Cookie usage

---

## Troubleshooting

### Events not showing in GA4

**Symptoms**: Click buttons but no events in dashboard

**Solutions**:

1. Check Measurement ID is correct:

   ```bash
   echo $NEXT_PUBLIC_GA_MEASUREMENT_ID
   ```

2. Verify Analytics component is in layout:
   - Check [src/app/layout.tsx](../src/app/layout.tsx:61) line 61

3. Check browser console for errors:
   - Open DevTools → Console
   - Look for GA-related errors

4. Use GA Debugger Chrome extension to see events being sent

5. Wait 24-48 hours for data to appear in standard reports
   - Realtime reports show data within 30 seconds
   - Standard reports can take up to 48 hours

### Real-time reports empty

**Symptoms**: Realtime report shows 0 users

**Solutions**:

1. Check ad blockers are disabled (they block GA)

2. Verify script is loading:
   - Open DevTools → Network tab
   - Look for `gtag/js?id=G-XXXXXXXXXX`
   - Should return 200 OK

3. Check browser console for `gtag is not defined` errors

4. Ensure cookies are enabled in browser

### Events showing incorrect data

**Symptoms**: Event parameters have wrong values

**Solutions**:

1. Check tracking function calls:

   ```typescript
   // Good
   trackContactFormSubmit(true)

   // Bad - wrong parameter
   trackContactFormSubmit('yes') // Should be boolean
   ```

2. Verify parameter names match GA4 conventions:
   - Use snake_case (e.g., `form_location`, not `formLocation`)
   - Avoid special characters

3. Check DebugView for event payload details

---

## Advanced Features

### Google Ads Integration

1. Go to **Admin** → **Google Ads Links**
2. Link your Google Ads account
3. Enable auto-tagging for campaign tracking

### Google Search Console Integration

1. Go to **Admin** → **Search Console Links**
2. Link your Search Console property
3. View search queries in **Acquisition** → **Search Console**

### BigQuery Export

For advanced analysis (requires paid GA4 or Firebase plan):

1. Go to **Admin** → **BigQuery Links**
2. Link your Google Cloud project
3. Enable daily/streaming export
4. Query data with SQL in BigQuery

---

## Cost Analysis

### Free Tier (Current)

- **Price**: $0/month
- **Events**: Unlimited (up to 10M events/month)
- **Data retention**: 14 months
- **Standard reports**: ✅
- **Explorations**: 200 per day
- **Estimated usage**: ~50,000-100,000 events/month

**Conclusion**: Free tier is more than sufficient for typical usage

### GA4 360 (Enterprise)

Only needed for very large websites:

- **Price**: $150,000/year
- **Events**: Unlimited
- **Data retention**: 50 months
- **SLA**: 99.9% uptime
- **Support**: Dedicated support team

---

## Files Reference

All Google Analytics files:

- [src/app/components/analytics.tsx](../src/app/components/analytics.tsx) - GA4 script loader
- [src/lib/analytics.ts](../src/lib/analytics.ts) - Tracking utility functions
- [src/app/layout.tsx](../src/app/layout.tsx#L61) - Analytics component inclusion
- [src/app/(auth)/age-verification/page.tsx](<../src/app/(auth)/age-verification/page.tsx>) - Age verification tracking
- [src/app/components/sections/contact-section.tsx](../src/app/components/sections/contact-section.tsx) - Contact form tracking

---

## Additional Resources

- [GA4 Documentation](https://support.google.com/analytics/answer/10089681)
- [GA4 Event Tracking Guide](https://support.google.com/analytics/answer/9322688)
- [GA4 vs Universal Analytics](https://support.google.com/analytics/answer/11583528)
- [GA4 Best Practices](https://support.google.com/analytics/answer/9267735)

---

## Summary

**Phase 5: Google Analytics 4 - COMPLETED ✅**

**Implemented:**

- ✅ GA4 script integration with Next.js Script component
- ✅ 11 custom event tracking functions
- ✅ Age verification tracking (accept/deny)
- ✅ Contact form tracking (success/fail)
- ✅ Phone, social, and review click tracking
- ✅ Navigation and CTA tracking
- ✅ FAQ and education engagement tracking
- ✅ Testimonial view tracking
- ✅ Privacy-focused configuration
- ✅ Complete documentation

**Ready for:**

- Production deployment
- Conversion tracking
- User behavior analysis
- A/B testing
- Marketing campaign optimization

**Metrics to Monitor:**

- Age verification acceptance rate (target: >90%)
- Contact form conversion rate
- Most popular pages
- Traffic sources
- User engagement time
- Conversion funnel performance

---

## Next Steps

1. **Deploy to production** with GA_MEASUREMENT_ID configured
2. **Mark key events as conversions** in GA4 admin
3. **Create custom reports** for business KPIs
4. **Set up alerts** for significant metric changes
5. **Integrate with Google Ads** for campaign tracking (if applicable)
6. **Review data weekly** to identify optimization opportunities
