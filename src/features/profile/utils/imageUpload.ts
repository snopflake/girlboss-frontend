const allowedTypes = ['image/png', 'image/jpeg', 'image/webp']

/** Validasi file gambar sebelum dipratinjau. Mengembalikan pesan error atau null. */
export function validateImageFile(file: File, maxMegabytes: number) {
  if (!allowedTypes.includes(file.type)) {
    return 'File harus berupa gambar PNG, JPG, atau WebP.'
  }
  if (file.size > maxMegabytes * 1024 * 1024) {
    return `Ukuran file maksimal ${maxMegabytes} MB.`
  }
  return null
}

export const imageAccept = allowedTypes.join(',')
