import { useState } from 'react'
import { Image, Play, Globe, Code, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { useFileUpload } from '@/hooks/useFileUpload'
import { parseVideoUrl } from '@/lib/utils/video-url'
import { CODE_LANGUAGES } from '@/lib/types/block'
import type { Block, BlockType, CodeBlock as CodeBlockType } from '@/lib/types/block'
import type { Page } from '@/lib/types/database'
import { cn } from '@/lib/utils'

interface BlockTypePickerProps {
  page: Page
  deckId: string
  onSelect: (block: Block) => void
  onCancel: () => void
  initialBlock?: Block | null
}

const BLOCK_OPTIONS: { type: BlockType; label: string; icon: typeof Image }[] = [
  { type: 'image', label: 'Image', icon: Image },
  { type: 'video', label: 'Video', icon: Play },
  { type: 'iframe', label: 'iFrame', icon: Globe },
  { type: 'code', label: 'Code', icon: Code },
  { type: 'lottie', label: 'Lottie', icon: Sparkles },
]

export function BlockTypePicker({ deckId, onSelect, onCancel, initialBlock }: BlockTypePickerProps) {
  const [activeType, setActiveType] = useState<BlockType | null>(initialBlock?.type ?? null)

  return (
    <div
      className="w-full h-full rounded-lg border flex flex-col overflow-hidden"
      style={{
        backgroundColor: 'var(--slide-surface)',
        borderColor: 'var(--slide-border)',
      }}
    >
      {!activeType ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8">
          <p className="text-lg font-medium opacity-60">Choose block type</p>
          <div className="flex gap-3">
            {BLOCK_OPTIONS.map(({ type, label, icon: Icon }) => (
              <button
                key={type}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors hover:border-[var(--slide-accent)] cursor-pointer"
                style={{ borderColor: 'var(--slide-border)' }}
                onClick={() => setActiveType(type)}
              >
                <Icon className="h-6 w-6 opacity-60" />
                <span className="text-sm">{label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col p-6">
          <div className="flex items-center gap-2 mb-4">
            <button
              className="text-sm opacity-60 hover:opacity-100 cursor-pointer"
              onClick={() => setActiveType(null)}
            >
              &larr; Back
            </button>
            <span className="text-sm font-medium capitalize">{activeType}</span>
          </div>
          <div className="flex-1 min-h-0">
            <BlockForm
              type={activeType}
              deckId={deckId}
              initialBlock={initialBlock?.type === activeType ? initialBlock : undefined}
              onSubmit={onSelect}
              onCancel={onCancel}
            />
          </div>
        </div>
      )}
    </div>
  )
}

function BlockForm({
  type,
  deckId,
  initialBlock,
  onSubmit,
  onCancel,
}: {
  type: BlockType
  deckId: string
  initialBlock?: Block
  onSubmit: (block: Block) => void
  onCancel: () => void
}) {
  switch (type) {
    case 'image':
      return <ImageForm deckId={deckId} initialBlock={initialBlock} onSubmit={onSubmit} onCancel={onCancel} />
    case 'video':
      return <VideoForm initialBlock={initialBlock} onSubmit={onSubmit} onCancel={onCancel} />
    case 'iframe':
      return <IframeForm initialBlock={initialBlock} onSubmit={onSubmit} onCancel={onCancel} />
    case 'code':
      return <CodeForm initialBlock={initialBlock} onSubmit={onSubmit} onCancel={onCancel} />
    case 'lottie':
      return <LottieForm deckId={deckId} initialBlock={initialBlock} onSubmit={onSubmit} onCancel={onCancel} />
  }
}

function ImageForm({ deckId, initialBlock, onSubmit, onCancel }: {
  deckId: string; initialBlock?: Block; onSubmit: (b: Block) => void; onCancel: () => void
}) {
  const { upload, uploading } = useFileUpload(deckId)
  const [fit, setFit] = useState<'cover' | 'contain'>(
    initialBlock?.type === 'image' ? (initialBlock.fit ?? 'contain') : 'contain'
  )
  const [alt, setAlt] = useState(initialBlock?.type === 'image' ? (initialBlock.alt ?? '') : '')

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await upload(file)
    if (url) onSubmit({ type: 'image', src: url, alt, fit })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Upload Image</Label>
        <Input type="file" accept=".jpg,.jpeg,.png,.gif,.webp,.svg" onChange={handleFile} disabled={uploading} />
        {uploading && <p className="text-sm opacity-60">Uploading...</p>}
      </div>
      <div className="space-y-2">
        <Label>Alt Text</Label>
        <Input value={alt} onChange={(e) => setAlt(e.target.value)} placeholder="Image description" />
      </div>
      <div className="space-y-2">
        <Label>Fit</Label>
        <div className="flex gap-2">
          {(['contain', 'cover'] as const).map((f) => (
            <button
              key={f}
              className={cn(
                'px-3 py-1.5 rounded border text-sm capitalize cursor-pointer',
                fit === f ? 'border-[var(--slide-accent)] bg-[var(--slide-accent)]/10' : 'border-[var(--slide-border)]'
              )}
              onClick={() => setFit(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  )
}

function VideoForm({ initialBlock, onSubmit, onCancel }: {
  initialBlock?: Block; onSubmit: (b: Block) => void; onCancel: () => void
}) {
  const [url, setUrl] = useState(initialBlock?.type === 'video' ? initialBlock.src : '')

  function handleSubmit() {
    if (!url) return
    const { embedUrl, provider } = parseVideoUrl(url)
    onSubmit({ type: 'video', src: embedUrl, provider })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Video URL</Label>
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://youtube.com/watch?v=..."
        />
        <p className="text-xs opacity-50">Supports YouTube, Vimeo, Loom, or any embed URL</p>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" onClick={handleSubmit} disabled={!url}>Add Video</Button>
      </div>
    </div>
  )
}

function IframeForm({ initialBlock, onSubmit, onCancel }: {
  initialBlock?: Block; onSubmit: (b: Block) => void; onCancel: () => void
}) {
  const [url, setUrl] = useState(initialBlock?.type === 'iframe' ? initialBlock.src : '')

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>iFrame URL</Label>
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://www.figma.com/embed?..."
        />
        <p className="text-xs opacity-50">Figma embeds, Framer prototypes, CodeSandbox, etc.</p>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" onClick={() => url && onSubmit({ type: 'iframe', src: url, sandbox: 'allow-scripts allow-same-origin' })} disabled={!url}>
          Embed
        </Button>
      </div>
    </div>
  )
}

function CodeForm({ initialBlock, onSubmit, onCancel }: {
  initialBlock?: Block; onSubmit: (b: Block) => void; onCancel: () => void
}) {
  const [code, setCode] = useState(initialBlock?.type === 'code' ? initialBlock.code : '')
  const [language, setLanguage] = useState<CodeBlockType['language']>(
    initialBlock?.type === 'code' ? initialBlock.language : 'typescript'
  )

  return (
    <div className="space-y-4 flex-1 flex flex-col">
      <div className="space-y-2">
        <Label>Language</Label>
        <Select value={language} onChange={(e) => setLanguage(e.target.value as CodeBlockType['language'])}>
          {CODE_LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </Select>
      </div>
      <div className="space-y-2 flex-1 flex flex-col">
        <Label>Code</Label>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="flex-1 min-h-[120px] w-full rounded-md border bg-black/80 text-green-400 p-3 text-sm font-mono outline-none resize-none"
          style={{ borderColor: 'var(--slide-border)' }}
          placeholder="Enter code here..."
        />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
        <Button size="sm" onClick={() => code && onSubmit({ type: 'code', language, code })} disabled={!code}>
          Add Code
        </Button>
      </div>
    </div>
  )
}

function LottieForm({ deckId, initialBlock, onSubmit, onCancel }: {
  deckId: string; initialBlock?: Block; onSubmit: (b: Block) => void; onCancel: () => void
}) {
  const { upload, uploading } = useFileUpload(deckId)
  const [loop, setLoop] = useState(initialBlock?.type === 'lottie' ? (initialBlock.loop ?? true) : true)
  const [autoplay, setAutoplay] = useState(initialBlock?.type === 'lottie' ? (initialBlock.autoplay ?? true) : true)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const url = await upload(file)
    if (url) onSubmit({ type: 'lottie', src: url, loop, autoplay })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Upload Lottie JSON</Label>
        <Input type="file" accept=".json" onChange={handleFile} disabled={uploading} />
        {uploading && <p className="text-sm opacity-60">Uploading...</p>}
      </div>
      <div className="flex gap-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={loop} onChange={(e) => setLoop(e.target.checked)} />
          Loop
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input type="checkbox" checked={autoplay} onChange={(e) => setAutoplay(e.target.checked)} />
          Autoplay
        </label>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
      </div>
    </div>
  )
}
