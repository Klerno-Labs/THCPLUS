import Link from 'next/link'
import { Button } from '@/app/components/ui/button'

/**
 * Custom 404 Page
 *
 * Displayed when a user navigates to a non-existent route.
 * Provides helpful navigation options and maintains brand consistency.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/not-found
 */
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Illustration */}
        <div className="space-y-4">
          <div className="flex justify-center items-baseline gap-2">
            <span className="text-9xl font-bold text-primary-900">4</span>
            <div className="relative">
              <span className="text-9xl font-bold text-primary-900">0</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-secondary-400 opacity-20 animate-ping" />
                <div className="absolute w-12 h-12 rounded-full bg-secondary-500 opacity-40" />
              </div>
            </div>
            <span className="text-9xl font-bold text-primary-900">4</span>
          </div>
          <div className="h-2 w-64 mx-auto bg-gradient-to-r from-primary-500 via-secondary-400 to-primary-500 rounded-full" />
        </div>

        {/* Error Message */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-primary-900">Page Not Found</h1>
          <p className="text-xl text-gray-600 max-w-md mx-auto">
            Looks like this page took a wrong turn. Let&apos;s get you back on track.
          </p>
        </div>

        {/* Helpful Links */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="default" size="lg">
                Go Home
              </Button>
            </Link>
            <Link href="/#products">
              <Button variant="outline" size="lg">
                Browse Products
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="pt-4">
            <p className="text-sm text-gray-500 mb-3">Or try these popular pages:</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/#about"
                className="text-sm text-secondary-600 hover:text-secondary-700 hover:underline"
              >
                About Us
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/#education"
                className="text-sm text-secondary-600 hover:text-secondary-700 hover:underline"
              >
                Education
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/#contact"
                className="text-sm text-secondary-600 hover:text-secondary-700 hover:underline"
              >
                Contact Us
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/visit-us"
                className="text-sm text-secondary-600 hover:text-secondary-700 hover:underline"
              >
                Visit Us
              </Link>
            </div>
          </div>
        </div>

        {/* Fun Cannabis Fact */}
        <div className="bg-white border border-primary-200 rounded-lg p-6 max-w-lg mx-auto">
          <p className="text-sm text-primary-700 font-semibold mb-2">Did you know?</p>
          <p className="text-sm text-gray-600">
            Hemp has been cultivated for over 10,000 years and was one of the first crops to be
            spun into fiber. It&apos;s been used to make everything from paper to rope to clothing!
          </p>
        </div>
      </div>
    </div>
  )
}
