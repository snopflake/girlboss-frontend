import { Upload } from 'lucide-react'
import { useRef } from 'react'
import { Button } from '../../../design-system/components'
import { imageAccept } from '../utils/imageUpload'

interface ImageUploadButtonProps {
  label: string
  onSelect(file: File): void
  className?: string
  describedBy?: string
}

/** Tombol unggah gambar (Button design system + input file tersembunyi). */
export function ImageUploadButton({ label, onSelect, className, describedBy }: ImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <>
      <Button
        variant="outline"
        className={className}
        leadingIcon={<Upload size={16} />}
        aria-describedby={describedBy}
        onClick={() => inputRef.current?.click()}
      >
        {label}
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept={imageAccept}
        hidden
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ''
          if (file) onSelect(file)
        }}
      />
    </>
  )
}
