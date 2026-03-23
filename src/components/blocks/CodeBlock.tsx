import { useEffect, useRef } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-python'
import type { CodeBlock as CodeBlockType } from '@/lib/types/block'

interface CodeBlockProps {
  block: CodeBlockType
}

const PRISM_LANG_MAP: Record<string, string> = {
  typescript: 'typescript',
  jsx: 'jsx',
  css: 'css',
  json: 'json',
  html: 'html',
  python: 'python',
}

export function CodeBlock({ block }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [block.code, block.language])

  return (
    <div className="w-full h-full rounded-lg overflow-auto bg-[#1e1e2e] relative">
      <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-white/10 text-white/60">
        {block.language}
      </div>
      <pre className="p-6 text-sm leading-relaxed overflow-auto h-full">
        <code
          ref={codeRef}
          className={`language-${PRISM_LANG_MAP[block.language] || block.language}`}
          style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
        >
          {block.code}
        </code>
      </pre>
      <style>{`
        .token.comment { color: #6a737d; }
        .token.keyword { color: #c678dd; }
        .token.string { color: #98c379; }
        .token.number { color: #d19a66; }
        .token.function { color: #61afef; }
        .token.operator { color: #56b6c2; }
        .token.punctuation { color: #abb2bf; }
        .token.property { color: #e06c75; }
        .token.class-name { color: #e5c07b; }
        .token.boolean { color: #d19a66; }
        .token.tag { color: #e06c75; }
        .token.attr-name { color: #d19a66; }
        .token.attr-value { color: #98c379; }
        pre[class*="language-"] { background: transparent; margin: 0; }
        code[class*="language-"] { color: #abb2bf; text-shadow: none; }
      `}</style>
    </div>
  )
}
