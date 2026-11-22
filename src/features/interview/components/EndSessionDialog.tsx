import { X } from 'lucide-react'
import { Button } from '../../../design-system/components'
import type { InterviewSession } from '../types/interview'
import { getAnsweredCount } from '../utils/interviewFormatters'
import styles from '../pages/InterviewPage.module.css'

interface EndSessionDialogProps {
  session: InterviewSession
  onContinue(): void
  onConfirmEnd(): void
}

export function EndSessionDialog({
  session,
  onContinue,
  onConfirmEnd,
}: EndSessionDialogProps) {
  const answeredCount = getAnsweredCount(session.questions)
  const remainingCount = session.questions.length - answeredCount

  return (
    <div
      className={styles.dialogBackdrop}
      onClick={(event) => {
        if (event.target === event.currentTarget) onContinue()
      }}
      role="presentation"
    >
      <section
        aria-labelledby="end-session-title"
        aria-modal="true"
        className={styles.dialog}
        role="dialog"
      >
        <button
          aria-label="Tutup dialog"
          className={styles.dialogClose}
          onClick={onContinue}
          type="button"
        >
          <X size={19} aria-hidden="true" />
        </button>
        <span className={styles.dialogIcon} aria-hidden="true">
          <X size={22} />
        </span>
        <h2 id="end-session-title">Akhiri Sesi Latihan?</h2>
        <p>
          {answeredCount} jawaban telah dikirim. {remainingCount} pertanyaan
          belum dijawab atau dilewati dan akan tetap tercatat dalam ringkasan.
        </p>
        <div className={styles.dialogActions}>
          <Button onClick={onContinue} type="button" variant="outline">
            Lanjutkan Latihan
          </Button>
          <Button onClick={onConfirmEnd} type="button">
            Ya, Akhiri Sesi
          </Button>
        </div>
      </section>
    </div>
  )
}
