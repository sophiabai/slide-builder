export interface ImageBlock {
  type: 'image'
  src: string
  alt?: string
  fit?: 'cover' | 'contain'
}

export interface VideoBlock {
  type: 'video'
  src: string
  provider: 'youtube' | 'vimeo' | 'loom' | 'custom'
}

export interface IframeBlock {
  type: 'iframe'
  src: string
  sandbox?: string
}

export interface CodeBlock {
  type: 'code'
  language: 'typescript' | 'jsx' | 'css' | 'json' | 'html' | 'python'
  code: string
}

export interface LottieBlock {
  type: 'lottie'
  src: string
  loop?: boolean
  autoplay?: boolean
}

export type Block = ImageBlock | VideoBlock | IframeBlock | CodeBlock | LottieBlock

export type BlockType = Block['type']

export const BLOCK_TYPES: { type: BlockType; label: string; icon: string }[] = [
  { type: 'image', label: 'Image', icon: 'Image' },
  { type: 'video', label: 'Video', icon: 'Play' },
  { type: 'iframe', label: 'iFrame', icon: 'Globe' },
  { type: 'code', label: 'Code', icon: 'Code' },
  { type: 'lottie', label: 'Lottie', icon: 'Sparkles' },
]

export const CODE_LANGUAGES: CodeBlock['language'][] = [
  'typescript',
  'jsx',
  'css',
  'json',
  'html',
  'python',
]
