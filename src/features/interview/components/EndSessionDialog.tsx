import { X } from 'lucide-react'
import { Button } from '../../../design-system/components'
import type { InterviewSession } from '../types/interview'
import { getAnsweredCount } from '../utils/interviewFormatters'
import styles from '../pages/InterviewPage.module.css'

interface EndSessionDialogProps {
  session: InterviewSession
  isSubmitting: boolean
  errorMessage: string
  onContinue(): void
  onConfirmEnd(): void
}

export function EndSessionDialog({
  session,
  isSubmitting,
  errorMessage,
  onContinue,
  onConfirmEnd,
}: EndSessionDialogProps) {
  const answeredCount = getAnsweredCount(session.questions)

  return (
    <div
      className={styles.dialogBackdrop}
      onClick={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) onContinue()
      }}
      role="presentation"
    >
      <section
        aria-labelledby="end-session-title"
        aria-modal="true"
        aria-busy={isSubmitting}
        className={styles.dialog}
        role="dialog"
      >
        <button
          aria-label="Tutup dialog"
          className={styles.dialogClose}
          disabled={isSubmitting}
          onClick={onContinue}
          type="button"
        >
          <X size={19} aria-hidden="true" />
        </button>
        <span className={styles.dialogIcon} aria-hidden="true">
          <X size={22} />
        </span>
        <h2 id="end-session-title">Selesaikan Sesi Wawancara?</h2>
        <p>
          {answeredCount} jawaban telah dievaluasi. Backend akan menyimpan status
          selesai dan mengembalikan ringkasan sesi.
        </p>
        {errorMessage && (
          <p className={styles.errorMessage} role="alert">
            {errorMessage}
          </p>
        )}
        <div className={styles.dialogActions}>
          <Button
            disabled={isSubmitting}
            onClick={onContinue}
            type="button"
            variant="outline"
          >
            Lanjutkan Latihan
          </Button>
          <Button disabled={isSubmitting} onClick={onConfirmEnd} type="button">
            {isSubmitting ? 'Menyelesaikan...' : 'Ya, Selesaikan Sesi'}
          </Button>
        </div>
      </section>
    </div>
  )
}
