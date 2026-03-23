import { type ReactNode, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface PopoverProps {
  trigger: ReactNode
  children: ReactNode
  align?: 'start' | 'center' | 'end'
  className?: string
}

export function Popover({ trigger, children, align = 'center', className }: PopoverProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={ref} className="relative inline-flex">
      <div onClick={() => setOpen(!open)}>{trigger}</div>
      {open && (
        <div
          className={cn(
            'absolute top-full mt-2 z-50 min-w-[200px] rounded-md border border-border bg-popover p-4 shadow-md',
            align === 'start' && 'left-0',
            align === 'center' && 'left-1/2 -translate-x-1/2',
            align === 'end' && 'right-0',
            className
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}
