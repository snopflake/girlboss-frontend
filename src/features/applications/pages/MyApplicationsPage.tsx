import {
  BriefcaseBusiness,
  CircleAlert,
  CircleCheck,
  CircleX,
  FileText,
  Search,
  SearchX,
} from 'lucide-react'
import { useId, useMemo, useState } from 'react'
import { generatePath, useLocation, useNavigate } from 'react-router'
import { routePaths } from '../../../app/router/routePaths'
import { Button, Input, Select } from '../../../design-system/components'
import { ApplicationCard } from '../components/ApplicationCard'
import { ApplicationNotice } from '../components/ApplicationNotice'
import { ApplicationsPagination } from '../components/ApplicationsPagination'
import { ApplicationsSkeleton } from '../components/ApplicationsSkeleton'
import { ApplicationsStateCard } from '../components/ApplicationsStateCard'
import { ApplicationStatCards, type StatItem } from '../components/ApplicationStatCards'
import { ApplicationTabs, type ApplicationTabItem } from '../components/ApplicationTabs'
import {
  useCancelMyApplication,
  useMyApplications,
} from '../hooks/useMyApplications'
import type {
  ApplicationFilter,
  ApplicationSort,
  MyApplication,
} from '../types/application.types'
import { matchesFilter, summarizeApplications } from '../utils/applicationStatus'
import styles from './MyApplicationsPage.module.css'

const pageSize = 5

const sortOptions: { value: ApplicationSort; label: string }[] = [
  { value: 'newest', label: 'Urutkan: Terbaru' },
  { value: 'oldest', label: 'Urutkan: Terlama' },
  { value: 'recentlyUpdated', label: 'Urutkan: Terakhir diperbarui' },
]

function sortApplications(items: MyApplication[], sort: ApplicationSort) {
  const sorted = [...items]
  const time = (value: string) => new Date(value).getTime()

  switch (sort) {
    case 'newest':
      return sorted.sort((a, b) => time(b.submittedAt) - time(a.submittedAt))
    case 'oldest':
      return sorted.sort((a, b) => time(a.submittedAt) - time(b.submittedAt))
    case 'recentlyUpdated':
      return sorted.sort((a, b) => time(b.updatedAt) - time(a.updatedAt))
  }
}

interface FeedbackMessage {
  variant: 'success' | 'danger'
  text: string
}

interface CancelledLocationState {
  cancelledJobTitle?: string
}

export default function MyApplicationsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const headingId = useId()
  const searchId = useId()
  const sortId = useId()
  const panelId = useId()

  const applicationsQuery = useMyApplications()
  const cancelMutation = useCancelMyApplication()

  const [filter, setFilter] = useState<ApplicationFilter>('all')
  const [sort, setSort] = useState<ApplicationSort>('newest')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(() => {
    const state = location.state as CancelledLocationState | null
    return state?.cancelledJobTitle
      ? {
          variant: 'success',
          text: `Lamaran ${state.cancelledJobTitle} berhasil dibatalkan.`,
        }
      : null
  })

  const applications = useMemo(
    () => applicationsQuery.data ?? [],
    [applicationsQuery.data],
  )
  const summary = useMemo(() => summarizeApplications(applications), [applications])
  const statItems: StatItem[] = [
    { label: 'Total Lamaran', value: summary.total, tone: 'brand', icon: BriefcaseBusiness },
    { label: 'Sedang Diproses', value: summary.active, tone: 'info', icon: FileText },
    { label: 'Diterima', value: summary.accepted, tone: 'success', icon: CircleCheck },
    { label: 'Ditolak', value: summary.rejected, tone: 'danger', icon: CircleX },
  ]

  const searched = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    if (!keyword) return applications
    return applications.filter(
      (item) =>
        item.jobTitle.toLowerCase().includes(keyword) ||
        item.companyName.toLowerCase().includes(keyword),
    )
  }, [applications, search])

  const tabItems: ApplicationTabItem<ApplicationFilter>[] = [
    { value: 'all', label: 'Semua', count: summary.total },
    { value: 'active', label: 'Aktif', count: summary.active },
    { value: 'accepted', label: 'Diterima', count: summary.accepted },
    { value: 'rejected', label: 'Ditolak', count: summary.rejected },
  ]

  const visible = useMemo(
    () =>
      sortApplications(
        searched.filter((item) => matchesFilter(item, filter)),
        sort,
      ),
    [filter, searched, sort],
  )

  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageItems = visible.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  function changeFilter(value: ApplicationFilter) {
    setFilter(value)
    setPage(1)
  }

  function changeSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  function resetFilters() {
    setSearch('')
    setFilter('all')
    setPage(1)
  }

  function openDetail(application: MyApplication) {
    navigate(
      generatePath(routePaths.applicant.applicationDetail, { id: application.id }),
    )
  }

  function cancelApplication(application: MyApplication) {
    const confirmed = window.confirm(
      `Batalkan lamaran ${application.jobTitle} di ${application.companyName}?\n\nLamaran yang dibatalkan tidak dapat dikirim ulang ke lowongan yang sama.`,
    )
    if (!confirmed) return

    setFeedback(null)
    cancelMutation.mutate(application.id, {
      onSuccess: () =>
        setFeedback({
          variant: 'success',
          text: `Lamaran ${application.jobTitle} berhasil dibatalkan.`,
        }),
      onError: (error) =>
        setFeedback({
          variant: 'danger',
          text:
            error instanceof Error
              ? error.message
              : 'Lamaran tidak dapat dibatalkan. Coba lagi.',
        }),
    })
  }

  const goToJobs = (
    <Button onClick={() => navigate(routePaths.applicant.jobs)}>Cari Lowongan</Button>
  )

  let content
  if (applicationsQuery.isPending) {
    content = <ApplicationsSkeleton label="Memuat riwayat lamaran…" />
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
            : 'Riwayat lamaran tidak dapat dimuat. Periksa koneksi lalu coba lagi.'
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
          icon={FileText}
          title="Belum ada lamaran"
          description="Lamaran yang kamu kirim akan muncul di sini."
          action={goToJobs}
        />
      </>
    )
  } else {
    content = (
      <>
        <ApplicationStatCards items={statItems} />

        <div className={styles.toolbar} role="search">
          <div className={styles.searchField}>
            <label htmlFor={searchId} className={styles.visuallyHidden}>
              Cari posisi atau perusahaan
            </label>
            <Input
              id={searchId}
              type="search"
              placeholder="Cari posisi atau perusahaan"
              value={search}
              onChange={(event) => changeSearch(event.target.value)}
              startAdornment={<Search size={16} />}
            />
          </div>
          <div className={styles.sortField}>
            <label htmlFor={sortId} className={styles.visuallyHidden}>
              Urutkan lamaran
            </label>
            <Select
              id={sortId}
              value={sort}
              onChange={(event) => setSort(event.target.value as ApplicationSort)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <ApplicationTabs
          label="Filter status lamaran"
          items={tabItems}
          value={filter}
          onChange={changeFilter}
          panelId={panelId}
        />

        <div
          id={panelId}
          role="tabpanel"
          aria-labelledby={`${panelId}-tab-${filter}`}
          className={styles.panel}
        >
          {pageItems.length > 0 ? (
            <>
              <ul className={styles.list} aria-label="Daftar lamaran">
                {pageItems.map((application) => (
                  <li key={application.id}>
                    <ApplicationCard
                      application={application}
                      onViewDetail={openDetail}
                      onCancel={cancelApplication}
                      isCancelling={
                        cancelMutation.isPending &&
                        cancelMutation.variables === application.id
                      }
                    />
                  </li>
                ))}
              </ul>
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
              title="Tidak ada lamaran yang cocok"
              description={
                search.trim()
                  ? `Tidak ditemukan lamaran untuk "${search.trim()}" pada filter ini.`
                  : 'Belum ada lamaran dengan status ini.'
              }
              action={
                <Button variant="outline" onClick={resetFilters}>
                  Tampilkan Semua Lamaran
                </Button>
              }
            />
          )}
        </div>
      </>
    )
  }

  return (
    <section className={styles.page} aria-labelledby={headingId}>
      <h1 id={headingId} className={styles.visuallyHidden}>
        Lamaran Saya
      </h1>
      {feedback && (
        <ApplicationNotice variant={feedback.variant}>{feedback.text}</ApplicationNotice>
      )}
      {content}
    </section>
  )
}
