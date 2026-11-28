import type { InterviewSpeechMetrics } from '../types/interview'
import styles from '../pages/InterviewPage.module.css'

interface SpeechMetricsViewProps {
  metrics: InterviewSpeechMetrics
}

function formatMetric(value: number | null | undefined, unit: string) {
  return value === null || value === undefined
    ? 'Tidak tersedia'
    : `${value.toLocaleString('id-ID', { maximumFractionDigits: 1 })} ${unit}`
}

function pitchUnavailableMessage(status: InterviewSpeechMetrics['pitchStatus']) {
  if (status === 'INSUFFICIENT_VOICED_FRAMES') {
    return 'Frame bersuara valid tidak mencukupi'
  }
  if (status === 'UNSUPPORTED_FORMAT') {
    return 'Tidak tersedia untuk format audio ini'
  }
  if (status === 'NOT_ANALYZED') return 'Belum dianalisis'
  return 'Tidak tersedia'
}

export function SpeechMetricsView({ metrics }: SpeechMetricsViewProps) {
  const pitchAvailable =
    metrics.pitchStatus === 'MEASURED' &&
    metrics.pitchMedianHz !== null &&
    metrics.pitchMedianHz !== undefined &&
    metrics.pitchVariation !== null
  const pauseDescription =
    metrics.pauseStatus === 'ESTIMATED_FROM_SEGMENTS' &&
    metrics.pauseCount !== null &&
    metrics.totalPauseSeconds !== null
      ? `${metrics.pauseCount} gap · ${formatMetric(metrics.totalPauseSeconds, 'dtk')}; estimasi timestamp segmen Whisper, bukan deteksi hening akustik`
      : metrics.pauseStatus === 'MEASURED' &&
          metrics.pauseCount !== null &&
          metrics.totalPauseSeconds !== null
        ? `${metrics.pauseCount} jeda · ${formatMetric(metrics.totalPauseSeconds, 'dtk')}`
        : 'Tidak tersedia dari segmen transkripsi'

  return (
    <section className={styles.speechMetrics} aria-label="Metrik penyampaian suara">
      <h4>Metrik penyampaian</h4>
      <dl>
        <div>
          <dt>Durasi</dt>
          <dd>
            {metrics.durationStatus === 'MEASURED'
              ? formatMetric(metrics.durationSeconds, 'dtk')
              : 'Tidak tersedia'}
          </dd>
        </div>
        <div>
          <dt>Kecepatan bicara</dt>
          <dd>
            {metrics.speechRateStatus === 'MEASURED'
              ? formatMetric(metrics.wordsPerMinute, 'kata/menit')
              : 'Belum dapat dinilai dari transkrip'}
          </dd>
        </div>
        <div>
          <dt>Estimasi jeda</dt>
          <dd>{pauseDescription}</dd>
        </div>
        <div>
          <dt>Median pitch</dt>
          <dd>
            {pitchAvailable
              ? formatMetric(metrics.pitchMedianHz, 'Hz')
              : pitchUnavailableMessage(metrics.pitchStatus)}
          </dd>
        </div>
        <div>
          <dt>Variasi pitch</dt>
          <dd>
            {pitchAvailable
              ? formatMetric(
                  metrics.pitchVariation,
                  metrics.pitchVariationUnit ?? 'semiton',
                )
              : pitchUnavailableMessage(metrics.pitchStatus)}
          </dd>
        </div>
      </dl>
      {metrics.pitchFeedback && <p>{metrics.pitchFeedback}</p>}
      <p>{metrics.deliveryFeedback}</p>
    </section>
  )
}
