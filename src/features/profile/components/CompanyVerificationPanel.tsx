import {
  BadgeCheck,
  CircleCheck,
  CircleX,
  Clock,
  FileWarning,
  Lightbulb,
  Mail,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { useId } from 'react'
import { Badge, Button, type BadgeVariant } from '../../../design-system/components'
import type { CompanyVerification, VerificationStatus } from '../types/companyProfile.types'
import { ProfileSectionCard } from './ProfileSectionCard'
import formStyles from './profileForm.module.css'
import styles from './CompanyVerificationPanel.module.css'

const statusConfig: Record<
  VerificationStatus,
  { title: string; badge: string; tone: 'warning' | 'success' | 'danger' | 'neutral'; icon: LucideIcon; message: string }
> = {
  pending: {
    title: 'Verifikasi Diproses',
    badge: 'Sedang Ditinjau',
    tone: 'warning',
    icon: Clock,
    message:
      'Terima kasih telah mengirimkan dokumen verifikasi. Tim kami sedang meninjau informasi perusahaan Anda.',
  },
  verified: {
    title: 'Perusahaan Terverifikasi',
    badge: 'Terverifikasi',
    tone: 'success',
    icon: ShieldCheck,
    message: 'Perusahaan Anda telah terverifikasi dan mendapatkan lencana terverifikasi.',
  },
  rejected: {
    title: 'Verifikasi Ditolak',
    badge: 'Perlu Perbaikan',
    tone: 'danger',
    icon: CircleX,
    message: 'Beberapa dokumen perlu diperbaiki. Silakan periksa catatan dan kirim ulang dokumen.',
  },
  unverified: {
    title: 'Belum Diverifikasi',
    badge: 'Belum Dikirim',
    tone: 'neutral',
    icon: FileWarning,
    message: 'Kirim dokumen perusahaan untuk mendapatkan status terverifikasi.',
  },
}

const benefits = [
  { title: 'Lencana Terverifikasi', description: 'Tampil menonjol dengan tanda centang terverifikasi' },
  { title: 'Kepercayaan Lebih Tinggi', description: 'Pencari kerja lebih percaya pada perusahaan terverifikasi' },
  { title: 'Prioritas Listing', description: 'Lowongan tampil lebih tinggi di hasil pencarian' },
  { title: 'Kandidat Berkualitas', description: 'Menarik lebih banyak pelamar yang sesuai' },
]

const documentStatus: Record<'submitted' | 'approved' | 'rejected', { label: string; variant: BadgeVariant }> = {
  submitted: { label: 'Terkirim', variant: 'success' },
  approved: { label: 'Disetujui', variant: 'success' },
  rejected: { label: 'Ditolak', variant: 'danger' },
}

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

export function CompanyVerificationPanel({ verification }: { verification: CompanyVerification }) {
  const config = statusConfig[verification.status]
  const StatusIcon = config.icon
  const benefitsId = useId()
  const documentsId = useId()
  const supportNoteId = useId()

  return (
    <ProfileSectionCard
      title="Status Verifikasi Akun"
      description="Lihat dan kelola status verifikasi perusahaan Anda"
    >
      <div className={[styles.status, styles[config.tone]].join(' ')} role="status">
        <span className={styles.statusIcon} aria-hidden="true">
          <StatusIcon size={24} />
        </span>
        <div className={styles.statusBody}>
          <div className={styles.statusHeading}>
            <h3 className={styles.statusTitle}>{config.title}</h3>
            <Badge
              variant={config.tone === 'neutral' ? 'neutral' : config.tone}
              className={styles.statusBadge}
            >
              {config.badge}
            </Badge>
          </div>
          <p className={styles.statusMessage}>{config.message}</p>
          {verification.status === 'pending' && (
            <ul className={styles.statusDetails}>
              {verification.submittedAt && (
                <li>
                  <CircleCheck aria-hidden="true" size={16} className={styles.successIcon} />
                  <span>
                    Dokumen dikirim:{' '}
                    <strong>
                      <time dateTime={verification.submittedAt}>
                        {dateFormatter.format(new Date(verification.submittedAt))}
                      </time>
                    </strong>
                  </span>
                </li>
              )}
              <li>
                <Clock aria-hidden="true" size={16} className={styles.warningIcon} />
                <span>
                  Estimasi waktu peninjauan: <strong>{verification.estimatedReview}</strong>
                </span>
              </li>
              <li>
                <Mail aria-hidden="true" size={16} className={styles.infoIcon} />
                <span>Kami akan mengabari Anda melalui email setelah peninjauan selesai</span>
              </li>
            </ul>
          )}
        </div>
      </div>

      <hr className={formStyles.divider} />

      <section className={styles.block} aria-labelledby={benefitsId}>
        <h3 id={benefitsId} className={formStyles.subTitle}>
          Keuntungan Status Terverifikasi
        </h3>
        <ul className={styles.benefits}>
          {benefits.map((benefit) => (
            <li key={benefit.title} className={styles.benefit}>
              <BadgeCheck aria-hidden="true" size={18} />
              <span>
                <span className={styles.benefitTitle}>{benefit.title}</span>
                <span className={styles.benefitText}>{benefit.description}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <hr className={formStyles.divider} />

      <section className={styles.block} aria-labelledby={documentsId}>
        <h3 id={documentsId} className={formStyles.subTitle}>
          Dokumen yang Dikirim
        </h3>
        {verification.documents.length === 0 ? (
          <p className={formStyles.emptyNote}>Belum ada dokumen verifikasi yang dikirim.</p>
        ) : (
          <ul className={styles.documents}>
            {verification.documents.map((document) => {
              const docStatus = documentStatus[document.status]
              return (
                <li key={document.id} className={styles.document}>
                  <CircleCheck aria-hidden="true" size={16} className={styles.successIcon} />
                  <span className={styles.documentName}>{document.name}</span>
                  <Badge variant={docStatus.variant}>{docStatus.label}</Badge>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <div className={formStyles.infoBox}>
        <p className={styles.helpTitle}>
          <Lightbulb aria-hidden="true" size={14} />
          Butuh Bantuan?
        </p>
        <p>Jika ada pertanyaan tentang proses verifikasi, silakan hubungi tim dukungan kami.</p>
        <div>
          <Button variant="outline" disabled aria-describedby={supportNoteId}>
            Hubungi Dukungan
          </Button>
        </div>
        <p id={supportNoteId} className={formStyles.visuallyHidden}>
          Kanal dukungan belum tersedia.
        </p>
      </div>
    </ProfileSectionCard>
  )
}
