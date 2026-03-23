import { supabase } from '../supabase'

const BUCKET = 'slide-assets'

export async function uploadFile(
  file: File,
  deckId: string,
): Promise<string> {
  const ext = file.name.split('.').pop()
  const path = `${deckId}/${crypto.randomUUID()}.${ext}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })
  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function deleteFile(url: string): Promise<void> {
  const path = url.split(`${BUCKET}/`)[1]
  if (!path) return
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw error
}
