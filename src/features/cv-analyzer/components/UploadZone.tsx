import { FileText, FileUp, Trash2 } from 'lucide-react'
import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { Button, Card } from '../../../design-system/components'
import type { CvFileError } from '../types/cvAnalyzer'
import { formatCvFileSize } from '../utils/cvFormatters'
import styles from '../pages/CvAnalyzerPage.module.css'

interface UploadZoneProps {
  file: File | null
  fileError: CvFileError | null
  onFileSelect(file: File | null): void
}

const fileErrorText: Record<CvFileError, string> = {
  'unsupported-format': 'Format file tidak didukung. Pilih file PDF atau DOCX.',
  'too-large': 'Ukuran file melebihi batas maksimum 10 MiB.',
}

export function UploadZone({
  file,
  fileError,
  onFileSelect,
}: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function acceptFiles(files: FileList | null) {
    onFileSelect(files?.[0] ?? null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDragging(false)
    acceptFiles(event.dataTransfer.files)
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    acceptFiles(event.currentTarget.files)
  }

  function removeFile() {
    onFileSelect(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className={styles.uploadContent}>
      <div
        className={[
          styles.dropZone,
          dragging ? styles.dropZoneActive : '',
          fileError ? styles.dropZoneInvalid : '',
        ]
          .filter(Boolean)
          .join(' ')}
        onDragEnter={(event) => {
          event.preventDefault()
          setDragging(true)
        }}
        onDragLeave={(event) => {
          if (
            !(event.relatedTarget instanceof Node) ||
            !event.currentTarget.contains(event.relatedTarget)
          ) {
            setDragging(false)
          }
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={handleDrop}
      >
        <span className={styles.dropIcon} aria-hidden="true">
          <FileUp size={26} />
        </span>
        <strong>Seret dan letakkan CV di sini</strong>
        <span className={styles.mutedText}>atau pilih berkas dari perangkat</span>
        <Button
          leadingIcon={<FileUp size={17} />}
          onClick={() => fileInputRef.current?.click()}
          type="button"
          variant="outline"
        >
          Pilih Berkas
        </Button>
        <input
          ref={fileInputRef}
          aria-label="Pilih CV untuk diunggah"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className={styles.visuallyHidden}
          onChange={handleFileChange}
          tabIndex={-1}
          type="file"
        />
      </div>

      {file && (
        <Card
          className={[
            styles.filePreview,
            fileError ? styles.filePreviewInvalid : '',
          ]
            .filter(Boolean)
            .join(' ')}
          padding="compact"
        >
          <span className={styles.fileIcon} aria-hidden="true">
            <FileText size={20} />
          </span>
          <div className={styles.fileInfo}>
            <strong title={file.name}>{file.name}</strong>
            <span>
              {file.name.split('.').pop()?.toUpperCase()} ·{' '}
              {formatCvFileSize(file.size)}
            </span>
            {fileError && (
              <span className={styles.fileError} role="alert">
                {fileErrorText[fileError]}
              </span>
            )}
          </div>
          <Button
            aria-label="Hapus berkas terpilih"
            className={styles.iconAction}
            leadingIcon={<Trash2 size={17} />}
            onClick={removeFile}
            size="small"
            type="button"
            variant="ghost"
          >
            Hapus
          </Button>
        </Card>
      )}
    </div>
  )
}
