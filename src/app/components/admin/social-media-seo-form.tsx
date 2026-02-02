'use client'

import { useState } from 'react'
import { updateSocialMedia, updateSEOSettings } from '@/app/actions/settings'
import { Button } from '@/app/components/ui/button'
import { toast } from 'sonner'
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react'

interface SocialMediaSEOFormProps {
  initialData: {
    facebookUrl?: string | null
    instagramUrl?: string | null
    twitterUrl?: string | null
    linkedinUrl?: string | null
    youtubeUrl?: string | null
    tiktokUrl?: string | null
    seoMetaDescription?: string | null
    seoKeywords?: string | null
    seoTitle?: string | null
    ogImage?: string | null
    twitterHandle?: string | null
  }
}

export function SocialMediaSEOForm({ initialData }: SocialMediaSEOFormProps) {
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'social' | 'seo'>('social')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)

    if (activeTab === 'social') {
      const data = {
        facebookUrl: formData.get('facebookUrl') as string,
        instagramUrl: formData.get('instagramUrl') as string,
        twitterUrl: formData.get('twitterUrl') as string,
        linkedinUrl: formData.get('linkedinUrl') as string,
        youtubeUrl: formData.get('youtubeUrl') as string,
        tiktokUrl: formData.get('tiktokUrl') as string,
      }

      const result = await updateSocialMedia(data)

      if (result.success) {
        toast.success('Social media links updated successfully')
      } else {
        toast.error(result.error || 'Failed to update social media links')
      }
    } else {
      const data = {
        seoMetaDescription: formData.get('seoMetaDescription') as string,
        seoKeywords: formData.get('seoKeywords') as string,
        seoTitle: formData.get('seoTitle') as string,
        ogImage: formData.get('ogImage') as string,
        twitterHandle: formData.get('twitterHandle') as string,
      }

      const result = await updateSEOSettings(data)

      if (result.success) {
        toast.success('SEO settings updated successfully')
      } else {
        toast.error(result.error || 'Failed to update SEO settings')
      }
    }

    setLoading(false)
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            type="button"
            onClick={() => setActiveTab('social')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'social'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Social Media
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('seo')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'seo'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            SEO Settings
          </button>
        </nav>
      </div>

      {/* Forms */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Social Media Tab */}
        {activeTab === 'social' && (
          <div className="space-y-4">
            {/* Facebook */}
            <div>
              <label
                htmlFor="facebookUrl"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"
              >
                <Facebook className="w-4 h-4" />
                Facebook URL
              </label>
              <input
                type="url"
                id="facebookUrl"
                name="facebookUrl"
                defaultValue={initialData.facebookUrl || ''}
                placeholder="https://facebook.com/yourpage"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Instagram */}
            <div>
              <label
                htmlFor="instagramUrl"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"
              >
                <Instagram className="w-4 h-4" />
                Instagram URL
              </label>
              <input
                type="url"
                id="instagramUrl"
                name="instagramUrl"
                defaultValue={initialData.instagramUrl || ''}
                placeholder="https://instagram.com/yourpage"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Twitter */}
            <div>
              <label
                htmlFor="twitterUrl"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"
              >
                <Twitter className="w-4 h-4" />
                Twitter/X URL
              </label>
              <input
                type="url"
                id="twitterUrl"
                name="twitterUrl"
                defaultValue={initialData.twitterUrl || ''}
                placeholder="https://twitter.com/yourpage"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label
                htmlFor="linkedinUrl"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn URL
              </label>
              <input
                type="url"
                id="linkedinUrl"
                name="linkedinUrl"
                defaultValue={initialData.linkedinUrl || ''}
                placeholder="https://linkedin.com/company/yourcompany"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* YouTube */}
            <div>
              <label
                htmlFor="youtubeUrl"
                className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"
              >
                <Youtube className="w-4 h-4" />
                YouTube URL
              </label>
              <input
                type="url"
                id="youtubeUrl"
                name="youtubeUrl"
                defaultValue={initialData.youtubeUrl || ''}
                placeholder="https://youtube.com/@yourchannel"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* TikTok */}
            <div>
              <label htmlFor="tiktokUrl" className="block text-sm font-medium text-gray-700 mb-1">
                TikTok URL
              </label>
              <input
                type="url"
                id="tiktokUrl"
                name="tiktokUrl"
                defaultValue={initialData.tiktokUrl || ''}
                placeholder="https://tiktok.com/@yourpage"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* SEO Tab */}
        {activeTab === 'seo' && (
          <div className="space-y-4">
            {/* SEO Title */}
            <div>
              <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700 mb-1">
                SEO Title
              </label>
              <input
                type="text"
                id="seoTitle"
                name="seoTitle"
                defaultValue={initialData.seoTitle || ''}
                placeholder="3rd Coast Smoke Company - Premium Smoking Accessories"
                maxLength={60}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Recommended: 50-60 characters</p>
            </div>

            {/* Meta Description */}
            <div>
              <label
                htmlFor="seoMetaDescription"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Meta Description
              </label>
              <textarea
                id="seoMetaDescription"
                name="seoMetaDescription"
                defaultValue={initialData.seoMetaDescription || ''}
                placeholder="Your premier destination for quality smoking accessories..."
                rows={3}
                maxLength={160}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Recommended: 150-160 characters</p>
            </div>

            {/* Keywords */}
            <div>
              <label htmlFor="seoKeywords" className="block text-sm font-medium text-gray-700 mb-1">
                SEO Keywords
              </label>
              <input
                type="text"
                id="seoKeywords"
                name="seoKeywords"
                defaultValue={initialData.seoKeywords || ''}
                placeholder="smoke shop, vape, glass, accessories, houston"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Comma-separated list of keywords</p>
            </div>

            {/* OG Image */}
            <div>
              <label htmlFor="ogImage" className="block text-sm font-medium text-gray-700 mb-1">
                Open Graph Image URL
              </label>
              <input
                type="url"
                id="ogImage"
                name="ogImage"
                defaultValue={initialData.ogImage || ''}
                placeholder="https://yourdomain.com/og-image.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Image shown when sharing on social media (1200x630px recommended)
              </p>
            </div>

            {/* Twitter Handle */}
            <div>
              <label
                htmlFor="twitterHandle"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Twitter Handle
              </label>
              <input
                type="text"
                id="twitterHandle"
                name="twitterHandle"
                defaultValue={initialData.twitterHandle || ''}
                placeholder="@yourhandle"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">Your Twitter/X username (include @)</p>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  )
}
