import { useState, useCallback } from 'react'
import { uploadFile } from '@/lib/api/storage'

export function useFileUpload(deckId: string) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const upload = useCallback(
    async (file: File): Promise<string | null> => {
      setUploading(true)
      setError(null)
      try {
        const url = await uploadFile(file, deckId)
        return url
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed')
        return null
      } finally {
        setUploading(false)
      }
    },
    [deckId]
  )

  return { upload, uploading, error }
}
