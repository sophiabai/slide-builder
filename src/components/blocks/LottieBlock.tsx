import { useState, useEffect } from 'react'
import Lottie from 'lottie-react'
import type { LottieBlock as LottieBlockType } from '@/lib/types/block'

interface LottieBlockProps {
  block: LottieBlockType
  deckId?: string
}

export function LottieBlock({ block }: LottieBlockProps) {
  const [animationData, setAnimationData] = useState<Record<string, unknown> | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch(block.src)
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(() => setError(true))
  }, [block.src])

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm opacity-50">
        Failed to load Lottie animation
      </div>
    )
  }

  if (!animationData) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin opacity-30" />
      </div>
    )
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Lottie
        animationData={animationData}
        loop={block.loop ?? true}
        autoplay={block.autoplay ?? true}
        style={{ maxWidth: '100%', maxHeight: '100%' }}
      />
    </div>
  )
}
