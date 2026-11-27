import { useEffect } from 'react'
import { LoaderCircle, Mic, RotateCcw, Send, Square } from 'lucide-react'
import { Button, Card } from '../../../design-system/components'
import { maxInterviewAudioDurationSeconds } from '../utils/wavAudio'
import { useInterviewAudioRecorder } from '../hooks/useInterviewAudioRecorder'
import styles from '../pages/InterviewPage.module.css'

interface InterviewAudioAnswerProps {
  isSubmitting: boolean
  isRetry: boolean
  submissionError: string
  onFileChange(file: File | null): void
  onSubmit(file: File): void
  onRetry(): void
}

function formatRecordingDuration(durationMs: number) {
  const totalSeconds = Math.floor(durationMs / 1_000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

export function InterviewAudioAnswer({
  isSubmitting,
  isRetry,
  submissionError,
  onFileChange,
  onSubmit,
  onRetry,
}: InterviewAudioAnswerProps) {
  const {
    audioFile,
    audioUrl,
    durationMs,
    errorMessage,
    resetRecording,
    startRecording,
    status,
    stopRecording,
  } = useInterviewAudioRecorder()

  function recordAgain() {
    resetRecording()
    onFileChange(null)
  }

  function stopAndNotify() {
    void stopRecording()
  }

  useEffect(() => {
    if (audioFile) onFileChange(audioFile)
  }, [audioFile, onFileChange])

  return (
    <Card className={styles.audioRecorderCard} padding="compact">
      <div className={styles.sectionTitle}>
        <h4>Jawab dengan rekaman suara</h4>
        <span>WAV PCM · Maks. 03:00 · 20 MiB</span>
      </div>
      <p className={styles.mutedText}>
        Rekaman dikirim untuk ditranskripsikan dan dievaluasi. Audio tidak
        disimpan secara permanen.
      </p>
      <div className={styles.audioRecorderActions}>
        {status === 'recording' ? (
          <Button
            leadingIcon={<Square size={16} />}
            onClick={stopAndNotify}
            type="button"
            variant="outline"
          >
            Berhenti
          </Button>
        ) : status === 'processing' ? (
          <Button disabled type="button">
            Memproses rekaman...
          </Button>
        ) : !audioFile ? (
          <Button
            disabled={isSubmitting}
            leadingIcon={<Mic size={16} />}
            onClick={() => void startRecording()}
            type="button"
          >
            Mulai Rekam
          </Button>
        ) : (
          <>
            <Button
              disabled={isSubmitting}
              leadingIcon={<RotateCcw size={16} />}
              onClick={recordAgain}
              type="button"
              variant="outline"
            >
              Rekam Ulang
            </Button>
            <Button
              disabled={isSubmitting}
              leadingIcon={
                isSubmitting ? (
                  <LoaderCircle className={styles.smallSpinner} size={16} />
                ) : (
                  <Send size={16} />
                )
              }
              onClick={() => {
                if (isRetry) onRetry()
                  else if (audioFile) onSubmit(audioFile)
              }}
              type="button"
            >
              {isSubmitting
                ? 'Mengirim...'
                : isRetry
                  ? 'Cek status & coba lagi'
                  : 'Kirim Jawaban'}
            </Button>
          </>
        )}
        <span className={styles.recordingDuration} role="timer">
          {formatRecordingDuration(durationMs)} / 03:00
        </span>
      </div>
      {status === 'recording' && (
        <p className={styles.evaluationLoading} role="status">
          <LoaderCircle className={styles.smallSpinner} size={16} />
          Sedang merekam. Batas maksimum {maxInterviewAudioDurationSeconds} detik.
        </p>
      )}
      {audioUrl && audioFile && (
        <audio
          aria-label="Putar ulang rekaman jawaban"
          className={styles.audioPlayback}
          controls
          src={audioUrl}
        />
      )}
      {errorMessage && (
        <p className={styles.errorMessage} role="alert">
          {errorMessage}
        </p>
      )}
      {isRetry && submissionError && (
        <p className={styles.errorMessage} role="alert">
          {submissionError}
        </p>
      )}
    </Card>
  )
}
