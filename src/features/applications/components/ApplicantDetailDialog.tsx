import { FileText, MapPin, Mail, X } from 'lucide-react'
import { useEffect, useId, useRef } from 'react'
import { Button, IconButton } from '../../../design-system/components'
import type { IncomingApplication } from '../types/incomingApplication.types'
import { formatDateTime } from '../utils/formatDate'
import { ApplicationStatusBadge } from './ApplicationStatusBadge'
import tones from './buttonTones.module.css'
import styles from './ApplicantDetailDialog.module.css'

interface ApplicantDetailDialogProps {
  application: IncomingApplication | null
  onClose(): void
}

/**
 * Dialog detail pelamar memakai elemen <dialog> native (focus trap, Esc,
 * dan inert background bawaan browser). Design system belum memiliki Dialog.
 */
export function ApplicantDetailDialog({ application, onClose }: ApplicantDetailDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const documentsNoteId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (application && !dialog.open) dialog.showModal()
    if (!application && dialog.open) dialog.close()
  }, [application])

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        // Klik pada backdrop (di luar panel) menutup dialog.
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {application && (
        <div className={styles.panel}>
          <header className={styles.header}>
            <div className={styles.identity}>
              <h2 id={titleId} className={styles.title}>
                {application.applicantName}
              </h2>
              <p className={styles.subtitle}>Melamar sebagai {application.jobTitle}</p>
            </div>
            <IconButton
              aria-label="Tutup detail pelamar"
              icon={<X size={18} />}
              onClick={onClose}
            />
          </header>

          <div className={styles.body}>
            <ApplicationStatusBadge status={application.status} />

            <ul className={styles.meta}>
              <li>
                <Mail aria-hidden="true" size={16} />
                <a href={`mailto:${application.applicantEmail}`}>
                  {application.applicantEmail}
                </a>
              </li>
              <li>
                <MapPin aria-hidden="true" size={16} />
                {application.applicantLocation}
              </li>
            </ul>

            <dl className={styles.summary}>
              <div>
                <dt>Tanggal melamar</dt>
                <dd>
                  <time dateTime={application.appliedAt}>
                    {formatDateTime(application.appliedAt)}
                  </time>
                </dd>
              </div>
              <div>
                <dt>Terakhir diperbarui</dt>
                <dd>
                  <time dateTime={application.updatedAt}>
                    {formatDateTime(application.updatedAt)}
                  </time>
                </dd>
              </div>
              <div>
                <dt>ID Lamaran</dt>
                <dd>{application.id}</dd>
              </div>
            </dl>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Cover Letter</h3>
              <div className={styles.coverLetter}>
                {application.coverLetter.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>Dokumen</h3>
              <p id={documentsNoteId} className={styles.visuallyHidden}>
                Pratinjau dokumen akan tersedia setelah layanan dokumen terhubung.
              </p>
              <ul className={styles.documents}>
                {application.documents.map((document) => (
                  <li key={document.id} className={styles.document}>
                    <span className={styles.documentIcon} aria-hidden="true">
                      <FileText size={16} />
                    </span>
                    <span className={styles.documentInfo}>
                      <span className={styles.documentName}>{document.fileName}</span>
                      <span className={styles.documentMeta}>
                        {document.format} • {document.sizeLabel}
                      </span>
                    </span>
                    <Button
                      variant="outline"
                      size="small"
                      className={tones.brandOutline}
                      disabled
                      aria-label={`Lihat ${document.fileName}`}
                      aria-describedby={documentsNoteId}
                    >
                      Lihat
                    </Button>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <footer className={styles.footer}>
            <Button variant="outline" onClick={onClose}>
              Tutup
            </Button>
          </footer>
        </div>
      )}
    </dialog>
  )
}
