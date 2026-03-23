import type { IframeBlock as IframeBlockType } from '@/lib/types/block'

interface IframeBlockProps {
  block: IframeBlockType
  mode: 'edit' | 'present'
}

export function IframeBlock({ block, mode }: IframeBlockProps) {
  return (
    <div className="w-full h-full relative rounded-lg overflow-hidden">
      <iframe
        src={block.src}
        sandbox={block.sandbox ?? 'allow-scripts allow-same-origin'}
        className="w-full h-full"
      />
      {mode === 'edit' && (
        <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5 bg-black/70 text-white text-xs truncate opacity-0 hover:opacity-100 transition-opacity">
          {block.src}
        </div>
      )}
    </div>
  )
}
