import type { ImageBlock as ImageBlockType } from '@/lib/types/block'

interface ImageBlockProps {
  block: ImageBlockType
}

export function ImageBlock({ block }: ImageBlockProps) {
  return (
    <div className="w-full h-full flex items-center justify-center rounded-lg overflow-hidden">
      <img
        src={block.src}
        alt={block.alt ?? ''}
        className="w-full h-full rounded-lg"
        style={{ objectFit: block.fit ?? 'contain' }}
      />
    </div>
  )
}
