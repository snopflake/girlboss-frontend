import { useEffect, useState } from 'react'
import { validateImageFile } from '../utils/imageUpload'

/**
 * Pratinjau gambar lokal (object URL) dengan validasi. Belum ada layanan
 * unggah, sehingga gambar hanya tersimpan di perangkat selama sesi halaman.
 */
export function useImagePreview(maxMegabytes: number) {
  const [url, setUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [url])

  function select(file: File) {
    const message = validateImageFile(file, maxMegabytes)
    if (message) {
      setError(message)
      return
    }
    setError(null)
    setUrl(URL.createObjectURL(file))
  }

  function clear() {
    setError(null)
    setUrl(null)
  }

  return { url, error, select, clear }
}
