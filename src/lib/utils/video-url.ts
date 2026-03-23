type VideoProvider = 'youtube' | 'vimeo' | 'loom' | 'custom'

interface VideoInfo {
  embedUrl: string
  provider: VideoProvider
}

export function parseVideoUrl(url: string): VideoInfo {
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  )
  if (youtubeMatch) {
    return {
      embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
      provider: 'youtube',
    }
  }

  const vimeoMatch = url.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/)
  if (vimeoMatch) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      provider: 'vimeo',
    }
  }

  const loomMatch = url.match(/loom\.com\/(?:share|embed)\/([a-f0-9]+)/)
  if (loomMatch) {
    return {
      embedUrl: `https://www.loom.com/embed/${loomMatch[1]}`,
      provider: 'loom',
    }
  }

  return { embedUrl: url, provider: 'custom' }
}
