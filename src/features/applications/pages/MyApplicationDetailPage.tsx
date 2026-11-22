import {
  ArrowLeft,
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CircleAlert,
  FileSearch,
  FileText,
  Sparkles,
} from 'lucide-react'
import { useId, useState } from 'react'
import { generatePath, Link, useNavigate, useParams } from 'react-router'
import { routePaths } from '../../../app/router/routePaths'
import { Button, Card } from '../../../design-system/components'
import { ApplicationNotice, type ApplicationNoticeVariant } from '../components/ApplicationNotice'
import { ApplicationsSkeleton } from '../components/ApplicationsSkeleton'
import { ApplicationsStateCard } from '../components/ApplicationsStateCard'
import { ApplicationStatusBadge } from '../components/ApplicationStatusBadge'
import { ApplicationTimeline } from '../components/ApplicationTimeline'
import tones from '../components/buttonTones.module.css'
import { useCancelMyApplication, useMyApplication } from '../hooks/useMyApplications'
import type { ApplicationStatus, MyApplication } from '../types/application.types'
import {
  applicationStatusMessages,
  canCancelApplication,
  isActiveStatus,
} from '../utils/applicationStatus'
import { formatDate, formatDateTime } from '../utils/formatDate'
import styles from './MyApplicationDetailPage.module.css'

const noticeVariants: Record<ApplicationStatus, ApplicationNoticeVariant> = {
  submitted: 'info',
  reviewed: 'info',
  interview: 'info',
  accepted: 'success',
  rejected: 'neutral',
}

const coverLetterPreviewLength = 240

export default function MyApplicationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const headingId = useId()
  const applicationQuery = useMyApplication(id)
  const application = applicationQuery.data

  const backToList = (
    <Button variant="outline" onClick={() => navigate(routePaths.applicant.applications)}>
      Kembali ke Lamaran Saya
    </Button>
  )

  let content
  if (applicationQuery.isPending) {
    content = <ApplicationsSkeleton variant="detail" label="Memuat detail lamaran…" />
  } else if (applicationQuery.isError) {
    content = (
      <ApplicationsStateCard
        icon={CircleAlert}
        tone="danger"
        role="alert"
        title="Gagal memuat detail lamaran"
        description="Detail lamaran tidak dapat dimuat. Periksa koneksi lalu coba lagi."
        action={
          <Button
            variant="outline"
            onClick={() => void applicationQuery.refetch()}
            disabled={applicationQuery.isFetching}
          >
            {applicationQuery.isFetching ? 'Memuat ulang…' : 'Coba Lagi'}
          </Button>
        }
      />
    )
  } else if (!application) {
    content = (
      <ApplicationsStateCard
        icon={FileSearch}
        title="Lamaran tidak ditemukan"
        description="Lamaran ini mungkin sudah dibatalkan atau tautannya tidak valid."
        action={backToList}
      />
    )
  } else {
    content = <ApplicationDetail application={application} titleId={headingId} />
  }

  return (
    <section className={styles.page} aria-labelledby={headingId}>
      {!application && (
        <h1 id={headingId} className={styles.visuallyHidden}>
          Detail Lamaran
        </h1>
      )}
      <div className={styles.topBar}>
        <nav aria-label="Breadcrumb">
          <ol className={styles.breadcrumbs}>
            <li>
              <Link to={routePaths.applicant.applications}>Lamaran Saya</Link>
            </li>
            <li>
              <span aria-current="page">{application?.jobTitle ?? 'Detail Lamaran'}</span>
            </li>
          </ol>
        </nav>
        <Link to={routePaths.applicant.applications} className={styles.textLink}>
          <ArrowLeft aria-hidden="true" size={16} />
          Kembali ke Lamaran Saya
        </Link>
      </div>
      {content}
    </section>
  )
}

function ApplicationDetail({
  application,
  titleId,
}: {
  application: MyApplication
  titleId: string
}) {
  const navigate = useNavigate()
  const cancelMutation = useCancelMyApplication()
  const [isCoverLetterExpanded, setIsCoverLetterExpanded] = useState(false)
  const coverLetterId = useId()
  const documentsNoteId = useId()
  const companyNoteId = useId()
  const cancelNoteId = useId()

  const isCoverLetterLong = application.coverLetter.length > coverLetterPreviewLength
  const metaParts = [
    application.location,
    application.employmentType,
    application.salaryRange,
  ].filter(Boolean)

  function cancelApplication() {
    const confirmed = window.confirm(
      `Batalkan lamaran ${application.jobTitle} di ${application.companyName}?\n\nLamaran yang dibatalkan tidak dapat dikirim ulang ke lowongan yang sama.`,
    )
    if (!confirmed) return

    cancelMutation.mutate(application.id, {
      onSuccess: () =>
        navigate(routePaths.applicant.applications, {
          state: { cancelledJobTitle: application.jobTitle },
        }),
    })
  }

  return (
    <div className={styles.layout}>
      <div className={styles.main}>
        <Card variant="outlined" className={styles.section}>
          <div className={styles.position}>
            <span className={[styles.logo, styles.logoLarge].join(' ')} aria-hidden="true">
              <BriefcaseBusiness size={24} />
            </span>
            <div className={styles.identity}>
              <h1 id={titleId} className={styles.jobTitle}>
                {application.jobTitle}
              </h1>
              <p className={styles.company}>{application.companyName}</p>
            </div>
            <ApplicationStatusBadge status={application.status} />
          </div>

          <p className={styles.meta}>{metaParts.join('  •  ')}</p>

          <Link
            to={generatePath(routePaths.jobDetail, { id: application.jobId })}
            className={styles.textLink}
          >
            Lihat Lowongan
            <ArrowUpRight aria-hidden="true" size={16} />
          </Link>

          <ApplicationNotice variant={noticeVariants[application.status]}>
            {applicationStatusMessages[application.status]}
          </ApplicationNotice>
        </Card>

        <Card variant="outlined" className={styles.section}>
          <h2 className={styles.sectionTitle}>Status Lamaran</h2>
          <ApplicationTimeline application={application} />
        </Card>

        <Card variant="outlined" className={styles.section}>
          <h2 className={styles.sectionTitle}>Dokumen Lamaran</h2>
          <p id={documentsNoteId} className={styles.visuallyHidden}>
            Pratinjau dokumen akan tersedia setelah layanan dokumen terhubung.
          </p>
          <ul className={styles.documents}>
            {application.documents.map((document) => (
              <li key={document.id}>
                <Card variant="outlined" padding="compact" className={styles.document}>
                  <span className={styles.logo} aria-hidden="true">
                    <FileText size={16} />
                  </span>
                  <div className={styles.documentInfo}>
                    <span className={styles.documentName}>{document.fileName}</span>
                    <span className={styles.documentMeta}>
                      {document.format} • {document.sizeLabel}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className={tones.brandOutline}
                    disabled
                    aria-label={`Lihat ${document.fileName}`}
                    aria-describedby={documentsNoteId}
                  >
                    Lihat
                  </Button>
                </Card>
              </li>
            ))}
          </ul>
        </Card>

        <Card variant="outlined" className={styles.section}>
          <h2 className={styles.sectionTitle}>Cover Letter</h2>
          <div
            id={coverLetterId}
            className={[
              styles.coverLetter,
              isCoverLetterLong && !isCoverLetterExpanded ? styles.clamped : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {application.coverLetter.split('\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          {isCoverLetterLong && (
            <Button
              variant="ghost"
              className={styles.inlineAction}
              aria-expanded={isCoverLetterExpanded}
              aria-controls={coverLetterId}
              onClick={() => setIsCoverLetterExpanded((value) => !value)}
            >
              {isCoverLetterExpanded ? 'Tampilkan lebih sedikit' : 'Baca selengkapnya'}
            </Button>
          )}
        </Card>
      </div>

      <aside className={styles.aside} aria-label="Ringkasan dan bantuan">
        <Card variant="outlined" className={styles.section}>
          <h2 className={styles.sectionTitle}>Ringkasan</h2>
          <dl className={styles.summary}>
            <div>
              <dt>Dikirim</dt>
              <dd>
                <time dateTime={application.submittedAt}>
                  {formatDateTime(application.submittedAt)}
                </time>
              </dd>
            </div>
            <div>
              <dt>Terakhir diperbarui</dt>
              <dd>
                <time dateTime={application.updatedAt}>
                  {formatDate(application.updatedAt)}
                </time>
              </dd>
            </div>
            <div>
              <dt>ID Lamaran</dt>
              <dd>{application.id}</dd>
            </div>
          </dl>
        </Card>

        {isActiveStatus(application.status) && (
          <Card variant="outlined" className={[styles.section, styles.interviewCard].join(' ')}>
            <span className={styles.logo} aria-hidden="true">
              <BriefcaseBusiness size={24} />
            </span>
            <h2 className={styles.interviewTitle}>Siap untuk wawancara?</h2>
            <p className={styles.interviewText}>
              Bangun rasa percaya dirimu dengan simulasi wawancara dan umpan balik dari AI.
            </p>
            <Button
              className={tones.fullWidth}
              leadingIcon={<Sparkles size={16} />}
              onClick={() => navigate(routePaths.applicant.interview)}
            >
              Latihan dengan AI Interview
            </Button>
          </Card>
        )}

        <Card variant="outlined" className={styles.section}>
          <span className={[styles.logo, styles.logoMedium].join(' ')} aria-hidden="true">
            <Building2 size={24} />
          </span>
          <div className={styles.companyInfo}>
            <h2 className={styles.companyName}>{application.companyName}</h2>
            <p className={styles.industry}>{application.companyIndustry}</p>
          </div>
          <p id={companyNoteId} className={styles.visuallyHidden}>
            Halaman profil perusahaan untuk pelamar belum tersedia.
          </p>
          <Button
            variant="outline"
            className={[tones.brandOutline, tones.fullWidth].join(' ')}
            disabled
            aria-describedby={companyNoteId}
          >
            Lihat Profil Perusahaan
          </Button>
        </Card>

        {canCancelApplication(application.status) && (
          <div className={styles.cancel}>
            {cancelMutation.isError && (
              <ApplicationNotice variant="danger">
                {cancelMutation.error instanceof Error
                  ? cancelMutation.error.message
                  : 'Lamaran tidak dapat dibatalkan. Coba lagi.'}
              </ApplicationNotice>
            )}
            <Button
              variant="outline"
              className={[tones.dangerOutline, tones.fullWidth].join(' ')}
              onClick={cancelApplication}
              disabled={cancelMutation.isPending}
              aria-describedby={cancelNoteId}
            >
              {cancelMutation.isPending ? 'Membatalkan…' : 'Batalkan Lamaran'}
            </Button>
            <p id={cancelNoteId} className={styles.cancelNote}>
              Lamaran yang dibatalkan tidak dapat dikirim ulang ke lowongan yang sama.
            </p>
          </div>
        )}
      </aside>
    </div>
  )
}
