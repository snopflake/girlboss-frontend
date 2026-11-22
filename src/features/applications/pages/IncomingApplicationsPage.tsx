import { CircleAlert, Inbox, Plus, Search, SearchX } from 'lucide-react'
import { useId, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { routePaths } from '../../../app/router/routePaths'
import { Button, Card, Input, Select } from '../../../design-system/components'
import { ApplicantDetailDialog } from '../components/ApplicantDetailDialog'
import { ApplicationNotice } from '../components/ApplicationNotice'
import { ApplicationsPagination } from '../components/ApplicationsPagination'
import { ApplicationsSkeleton } from '../components/ApplicationsSkeleton'
import { ApplicationsStateCard } from '../components/ApplicationsStateCard'
import { ApplicationStatCards, type StatItem } from '../components/ApplicationStatCards'
import { IncomingApplicationsTable } from '../components/IncomingApplicationsTable'
import {
  useIncomingApplications,
  useUpdateIncomingApplicationStatus,
} from '../hooks/useIncomingApplications'
import type { ApplicationStatus } from '../types/application.types'
import type {
  IncomingApplication,
  IncomingStatusFilter,
} from '../types/incomingApplication.types'
import { applicationStatusLabels } from '../utils/applicationStatus'
import styles from './IncomingApplicationsPage.module.css'

const pageSize = 10
const allPositions = 'all'

const statusFilterOptions = Object.entries(applicationStatusLabels) as [
  ApplicationStatus,
  string,
][]

interface FeedbackMessage {
  variant: 'success' | 'danger'
  text: string
}

export default function IncomingApplicationsPage() {
  const navigate = useNavigate()
  const headingId = useId()
  const searchId = useId()
  const positionId = useId()
  const statusId = useId()

  const applicationsQuery = useIncomingApplications()
  const statusMutation = useUpdateIncomingApplicationStatus()

  const [search, setSearch] = useState('')
  const [position, setPosition] = useState<string>(allPositions)
  const [statusFilter, setStatusFilter] = useState<IncomingStatusFilter>('all')
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null)

  const applications = useMemo(
    () => applicationsQuery.data ?? [],
    [applicationsQuery.data],
  )
  const selectedApplication =
    applications.find((item) => item.id === selectedId) ?? null

  const statItems: StatItem[] = [
    { label: 'Total Lamaran', value: applications.length, tone: 'brand' },
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

  const positions = useMemo(
    () =>
      [...new Map(applications.map((item) => [item.jobId, item.jobTitle])).entries()].sort(
        (a, b) => a[1].localeCompare(b[1], 'id'),
      ),
    [applications],
  )

  const visible = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return applications
      .filter(
        (item) =>
          !keyword ||
          item.applicantName.toLowerCase().includes(keyword) ||
          item.applicantEmail.toLowerCase().includes(keyword),
      )
      .filter((item) => position === allPositions || item.jobId === position)
      .filter((item) => statusFilter === 'all' || item.status === statusFilter)
      .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
  }, [applications, position, search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageItems = visible.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const hasActiveFilter =
    search.trim() !== '' || position !== allPositions || statusFilter !== 'all'

  function resetFilters() {
    setSearch('')
    setPosition(allPositions)
    setStatusFilter('all')
    setPage(1)
  }

  function changeStatus(application: IncomingApplication, status: ApplicationStatus) {
    if (status === application.status) return

    setFeedback(null)
    statusMutation.mutate(
      { id: application.id, status },
      {
        onSuccess: () =>
          setFeedback({
            variant: 'success',
            text: `Status lamaran ${application.applicantName} diubah menjadi ${applicationStatusLabels[status]}.`,
          }),
        onError: (error) =>
          setFeedback({
            variant: 'danger',
            text:
              error instanceof Error
                ? error.message
                : 'Status lamaran tidak dapat diubah. Coba lagi.',
          }),
      },
    )
  }

  const postJobButton = (
    <Button
      leadingIcon={<Plus size={16} />}
      onClick={() => navigate(routePaths.company.newJob)}
    >
      Posting Lowongan Baru
    </Button>
  )

  let content
  if (applicationsQuery.isPending) {
    content = <ApplicationsSkeleton label="Memuat lamaran masuk…" />
  } else if (applicationsQuery.isError) {
    content = (
      <ApplicationsStateCard
        icon={CircleAlert}
        tone="danger"
        role="alert"
        title="Gagal memuat lamaran"
        description={
          applicationsQuery.error instanceof Error
            ? `${applicationsQuery.error.message} Periksa koneksi lalu coba lagi.`
            : 'Daftar lamaran tidak dapat dimuat. Periksa koneksi lalu coba lagi.'
        }
        action={
          <Button
            variant="outline"
            onClick={() => void applicationsQuery.refetch()}
            disabled={applicationsQuery.isFetching}
          >
            {applicationsQuery.isFetching ? 'Memuat ulang…' : 'Coba Lagi'}
          </Button>
        }
      />
    )
  } else if (applications.length === 0) {
    content = (
      <>
        <ApplicationStatCards items={statItems} />
        <ApplicationsStateCard
          icon={Inbox}
          title="Belum ada lamaran masuk"
          description="Lamaran dari pelamar akan muncul di sini setelah lowongan Anda dipublikasikan."
          action={postJobButton}
        />
      </>
    )
  } else {
    content = (
      <>
        <ApplicationStatCards items={statItems} />

        <Card variant="outlined" className={styles.filters} role="search">
          <div className={styles.field}>
            <label htmlFor={searchId} className={styles.visuallyHidden}>
              Cari nama atau email pelamar
            </label>
            <Input
              id={searchId}
              type="search"
              placeholder="Cari nama atau email pelamar..."
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setPage(1)
              }}
              startAdornment={<Search size={16} />}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor={positionId} className={styles.visuallyHidden}>
              Filter posisi
            </label>
            <Select
              id={positionId}
              value={position}
              onChange={(event) => {
                setPosition(event.target.value)
                setPage(1)
              }}
            >
              <option value={allPositions}>Semua Posisi</option>
              {positions.map(([jobId, jobTitle]) => (
                <option key={jobId} value={jobId}>
                  {jobTitle}
                </option>
              ))}
            </Select>
          </div>
          <div className={styles.field}>
            <label htmlFor={statusId} className={styles.visuallyHidden}>
              Filter status
            </label>
            <Select
              id={statusId}
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(event.target.value as IncomingStatusFilter)
                setPage(1)
              }}
            >
              <option value="all">Semua Status</option>
              {statusFilterOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
        </Card>

        {pageItems.length > 0 ? (
          <>
            <Card variant="outlined" padding="none" className={styles.tableCard}>
              <IncomingApplicationsTable
                applications={pageItems}
                onView={(application) => setSelectedId(application.id)}
                onStatusChange={changeStatus}
                updatingId={
                  statusMutation.isPending ? statusMutation.variables?.id : undefined
                }
              />
            </Card>
            <ApplicationsPagination
              page={currentPage}
              totalPages={totalPages}
              totalItems={visible.length}
              pageSize={pageSize}
              onPageChange={setPage}
            />
          </>
        ) : (
          <ApplicationsStateCard
            icon={SearchX}
            title="Tidak ada pelamar yang cocok"
            description="Coba ubah kata kunci pencarian atau filter yang dipilih."
            action={
              hasActiveFilter ? (
                <Button variant="outline" onClick={resetFilters}>
                  Reset Filter
                </Button>
              ) : undefined
            }
          />
        )}
      </>
    )
  }

  return (
    <section className={styles.page} aria-labelledby={headingId}>
      <header className={styles.header}>
        <h1 id={headingId} className={styles.title}>
          Kelola Lamaran
        </h1>
        {postJobButton}
      </header>

      {feedback && (
        <ApplicationNotice variant={feedback.variant}>{feedback.text}</ApplicationNotice>
      )}

      {content}

      <ApplicantDetailDialog
        application={selectedApplication}
        onClose={() => setSelectedId(null)}
      />
    </section>
  )
}
