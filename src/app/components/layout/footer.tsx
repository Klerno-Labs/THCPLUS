'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Phone, Mail, Clock, Instagram, User } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-primary text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="animate-fade-in-up">
            <div className="flex items-center space-x-3 mb-4">
              <div className="relative w-12 h-12">
                <Image
                  src="/images/cross2.png"
                  alt="THC Plus Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>
              <span className="font-bold text-xl">THC Plus</span>
            </div>
            <p className="text-gray-300 text-sm">
              Your trusted source for premium hemp products in Houston, TX. Quality, education, and
              customer service are our priorities.
            </p>
          </div>

          {/* Quick Links */}
          <div className="animate-fade-in-up animation-delay-100">
            <h3 className="text-secondary font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#about"
                  className="text-gray-300 hover:text-secondary transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/education"
                  className="text-gray-300 hover:text-secondary transition-colors"
                >
                  Education
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-secondary transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/visit-us"
                  className="text-gray-300 hover:text-secondary transition-colors"
                >
                  Visit Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="animate-fade-in-up animation-delay-200">
            <h3 className="text-secondary font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin
                  className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span className="text-gray-300 text-sm">
                  8302 N Eldridge Pkwy
                  <br />
                  Houston, TX 77041
                </span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-secondary" aria-hidden="true" />
                <span className="text-gray-300 text-sm">(346) 206-3949</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-secondary" aria-hidden="true" />
                <span className="text-gray-300 text-sm">info@thcplus.com</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div className="animate-fade-in-up animation-delay-300">
            <h3 className="text-secondary font-semibold mb-4">Hours</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-secondary" aria-hidden="true" />
                <div className="text-gray-300 text-sm">
                  <p>Monday - Sunday</p>
                  <p>Open Daily Until 11:00 PM</p>
                </div>
              </li>
            </ul>
            <div className="flex space-x-4 mt-4">
              <a
                href="https://www.instagram.com/thcplusnwhouston/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-secondary transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-6 w-6" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} THC Plus Smoke Company. All Rights Reserved.
          </p>
          <Link
            href="/admin/login"
            className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-400 transition-colors text-xs mt-2"
            aria-label="Staff Login"
          >
            <User className="h-3 w-3" aria-hidden="true" />
            Staff
          </Link>
          <p className="text-gray-500 text-xs mt-4 max-w-4xl mx-auto leading-relaxed">
            Must be 21 or over to purchase these products or visit locations. This product contains
            industrial (Lab Tested) hemp (Hemp Flower) that was grown pursuant to state and federal
            law (Containing not more than 0.3% THC on a dry weight basis) by licensed farmers in
            accordance with the industrial Hemp provisions of the Agricultural Act of 2014 (known as
            the &quot;Farm Act&quot;) and its state law counterparts thus it is not subject to
            regulation, or control, under the Federal Controlled Substances Act. The FDA has not
            evaluated this product and these statements for safety or efficacy. As with any new
            product, consult your physician before consuming this product. Do not consume if
            pregnant or breastfeeding. This hemp-derived product may contain trace amounts of THC in
            accordance with the 2018 Farm Bill.
          </p>
        </div>
      </div>
    </footer>
  )
}
