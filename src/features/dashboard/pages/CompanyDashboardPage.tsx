import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  ChevronRight,
  CircleAlert,
  Clock,
  Inbox,
  Plus,
  type LucideIcon,
} from 'lucide-react'
import { useId, useMemo, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../../app/providers/useAuth'
import { routePaths } from '../../../app/router/routePaths'
import { Button, Card } from '../../../design-system/components'
// Dashboard menggabungkan data dari fitur Lamaran & Profil (mock lokal yang
// sama), sehingga angka di dashboard konsisten dengan halaman detailnya.
import { ApplicationStatCards, type StatItem } from '../../applications/components/ApplicationStatCards'
import { ApplicationStatusBadge } from '../../applications/components/ApplicationStatusBadge'
import { ApplicationsSkeleton } from '../../applications/components/ApplicationsSkeleton'
import { ApplicationsStateCard } from '../../applications/components/ApplicationsStateCard'
import { useIncomingApplications } from '../../applications/hooks/useIncomingApplications'
import type { IncomingApplication } from '../../applications/types/incomingApplication.types'
import { formatLongDate } from '../../applications/utils/formatDate'
import { useCompanyProfile } from '../../profile/hooks/useCompanyProfile'
import styles from './CompanyDashboardPage.module.css'

const recentLimit = 5

const quickActions: { label: string; description: string; to: string; icon: LucideIcon }[] = [
  {
    label: 'Posting Lowongan Baru',
    description: 'Buka posisi baru untuk talenta perempuan',
    to: routePaths.company.newJob,
    icon: Plus,
  },
  {
    label: 'Kelola Lowongan',
    description: 'Perbarui atau tutup lowongan aktif',
    to: routePaths.company.jobs,
    icon: BriefcaseBusiness,
  },
  {
    label: 'Kelola Lamaran',
    description: 'Tinjau dan perbarui status pelamar',
    to: routePaths.company.applications,
    icon: Inbox,
  },
  {
    label: 'Profil Perusahaan',
    description: 'Lengkapi informasi dan branding',
    to: routePaths.company.profile,
    icon: Building2,
  },
]

export default function CompanyDashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const headingId = useId()
  const applicationsQuery = useIncomingApplications()
  const profileQuery = useCompanyProfile()

  const companyName = profileQuery.data?.info.companyName
  const greetingName = companyName || user?.fullName || 'Perusahaan'
  const verification = profileQuery.data?.verification

  return (
    <section className={styles.page} aria-labelledby={headingId}>
      <header className={styles.header}>
        <div className={styles.headerText}>
          <p className={styles.eyebrow}>Dashboard Perusahaan</p>
          <h1 id={headingId} className={styles.title}>
            Halo, {greetingName}
          </h1>
          <p className={styles.subtitle}>
            Pantau lamaran yang masuk dan kelola rekrutmen perusahaan Anda di satu tempat.
          </p>
        </div>
        <Button leadingIcon={<Plus size={16} />} onClick={() => navigate(routePaths.company.newJob)}>
          Posting Lowongan Baru
        </Button>
      </header>

      {verification && verification.status !== 'verified' && (
        <div className={styles.verification} role="status">
          <span className={styles.verificationIcon} aria-hidden="true">
            {verification.status === 'pending' ? <Clock size={20} /> : <CircleAlert size={20} />}
          </span>
          <div className={styles.verificationText}>
            <p className={styles.verificationTitle}>
              {verification.status === 'pending'
                ? 'Verifikasi perusahaan sedang diproses'
                : 'Perusahaan Anda belum terverifikasi'}
            </p>
            <p className={styles.verificationBody}>
              Perusahaan terverifikasi mendapat lencana khusus dan lowongannya tampil lebih tinggi
              di hasil pencarian.
            </p>
          </div>
          <Link
            to={`${routePaths.company.profile}?tab=verification`}
            className={styles.verificationLink}
          >
            Lihat Status
            <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      )}

      <DashboardContent query={applicationsQuery} />
    </section>
  )
}

function DashboardContent({ query }: { query: ReturnType<typeof useIncomingApplications> }) {
  const navigate = useNavigate()
  const applications = useMemo(() => query.data ?? [], [query.data])

  if (query.isPending) {
    return <ApplicationsSkeleton label="Memuat ringkasan dashboard…" />
  }

  if (query.isError) {
    return (
      <ApplicationsStateCard
        icon={CircleAlert}
        tone="danger"
        role="alert"
        title="Gagal memuat dashboard"
        description="Ringkasan lamaran tidak dapat dimuat. Periksa koneksi lalu coba lagi."
        action={
          <Button
            variant="outline"
            onClick={() => void query.refetch()}
            disabled={query.isFetching}
          >
            {query.isFetching ? 'Memuat ulang…' : 'Coba Lagi'}
          </Button>
        }
      />
    )
  }

  const statItems: StatItem[] = [
    { label: 'Total Lamaran', value: applications.length, tone: 'brand', icon: Inbox },
    {
      label: 'Baru Masuk',
      value: applications.filter((item) => item.status === 'submitted').length,
      tone: 'neutral',
    },
    {
      label: 'Sedang Ditinjau',
      value: applications.filter((item) => item.status === 'reviewed').length,
      tone: 'info',
    },
    {
      label: 'Proses Wawancara',
      value: applications.filter((item) => item.status === 'interview').length,
      tone: 'accent',
    },
  ]

  return (
    <>
      <ApplicationStatCards items={statItems} label="Ringkasan lamaran masuk" />

      <div className={styles.grid}>
        <div className={styles.mainColumn}>
          {applications.length === 0 ? (
            <ApplicationsStateCard
              icon={Inbox}
              title="Belum ada lamaran masuk"
              description="Lamaran dari pelamar akan muncul di sini setelah lowongan Anda dipublikasikan."
              action={
                <Button onClick={() => navigate(routePaths.company.newJob)}>
                  Posting Lowongan Baru
                </Button>
              }
            />
          ) : (
            <RecentApplications applications={applications} />
          )}
        </div>

        <div className={styles.sideColumn}>
          {applications.length > 0 && <ApplicationsByPosition applications={applications} />}
          <QuickActions />
        </div>
      </div>
    </>
  )
}

function DashboardCard({
  title,
  action,
  children,
}: {
  title: string
  action?: ReactNode
  children: ReactNode
}) {
  const titleId = useId()
  return (
    <Card variant="outlined" padding="none" className={styles.card} aria-labelledby={titleId}>
      <header className={styles.cardHeader}>
        <h2 id={titleId} className={styles.cardTitle}>
          {title}
        </h2>
        {action}
      </header>
      {children}
    </Card>
  )
}

function RecentApplications({ applications }: { applications: IncomingApplication[] }) {
  const recent = [...applications]
    .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    .slice(0, recentLimit)

  return (
    <DashboardCard
      title="Lamaran Terbaru"
      action={
        <Link to={routePaths.company.applications} className={styles.textLink}>
          Lihat Semua
          <ChevronRight aria-hidden="true" size={16} />
        </Link>
      }
    >
      <ul className={styles.recentList}>
        {recent.map((application) => (
          <li key={application.id} className={styles.recentItem}>
            <span className={styles.avatar} aria-hidden="true">
              {application.applicantName.charAt(0).toUpperCase()}
            </span>
            <div className={styles.recentText}>
              <span className={styles.recentName}>{application.applicantName}</span>
              <span className={styles.recentMeta}>
                {application.jobTitle} •{' '}
                <time dateTime={application.appliedAt}>{formatLongDate(application.appliedAt)}</time>
              </span>
            </div>
            <ApplicationStatusBadge status={application.status} />
          </li>
        ))}
      </ul>
    </DashboardCard>
  )
}

function ApplicationsByPosition({ applications }: { applications: IncomingApplication[] }) {
  const positions = useMemo(() => {
    const counts = new Map<string, number>()
    for (const item of applications) {
      counts.set(item.jobTitle, (counts.get(item.jobTitle) ?? 0) + 1)
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1])
  }, [applications])
  const max = positions[0]?.[1] ?? 1

  return (
    <DashboardCard title="Lamaran per Posisi">
      <ul className={styles.positions}>
        {positions.map(([title, count]) => (
          <li key={title} className={styles.position}>
            <div className={styles.positionRow}>
              <span className={styles.positionTitle}>{title}</span>
              <span className={styles.positionCount}>{count} lamaran</span>
            </div>
            <span className={styles.bar} aria-hidden="true">
              <span className={styles.barFill} style={{ width: `${(count / max) * 100}%` }} />
            </span>
          </li>
        ))}
      </ul>
    </DashboardCard>
  )
}

function QuickActions() {
  return (
    <DashboardCard title="Aksi Cepat">
      <ul className={styles.actions}>
        {quickActions.map(({ label, description, to, icon: Icon }) => (
          <li key={label}>
            <Link to={to} className={styles.action}>
              <span className={styles.actionIcon} aria-hidden="true">
                <Icon size={18} />
              </span>
              <span className={styles.actionText}>
                <span className={styles.actionLabel}>{label}</span>
                <span className={styles.actionDescription}>{description}</span>
              </span>
              <ChevronRight aria-hidden="true" size={16} className={styles.actionChevron} />
            </Link>
          </li>
        ))}
      </ul>
    </DashboardCard>
  )
}
