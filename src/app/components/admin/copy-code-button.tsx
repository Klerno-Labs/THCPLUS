'use client'

import { useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { Copy, Check } from 'lucide-react'

interface CopyCodeButtonProps {
  code: string
}

export function CopyCodeButton({ code }: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className="transition-all"
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-2 text-emerald-600" />
          Copied!
        </>
      ) : (
        <>
          <Copy className="w-4 h-4 mr-2" />
          Copy Code
        </>
      )}
    </Button>
  )
}
