import type { VideoBlock as VideoBlockType } from '@/lib/types/block'

interface VideoBlockProps {
  block: VideoBlockType
}

export function VideoBlock({ block }: VideoBlockProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full" style={{ aspectRatio: '16/9', maxHeight: '100%' }}>
        <iframe
          src={block.src}
          className="w-full h-full rounded-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  )
}
