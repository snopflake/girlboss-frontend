import { Eye } from 'lucide-react'
import { IconButton, Select } from '../../../design-system/components'
import type { ApplicationStatus } from '../types/application.types'
import type { IncomingApplication } from '../types/incomingApplication.types'
import { applicationStatusLabels } from '../utils/applicationStatus'
import { formatLongDate } from '../utils/formatDate'
import { ApplicationStatusBadge } from './ApplicationStatusBadge'
import tones from './buttonTones.module.css'
import styles from './IncomingApplicationsTable.module.css'

const statusOptions = Object.entries(applicationStatusLabels) as [
  ApplicationStatus,
  string,
][]

interface IncomingApplicationsTableProps {
  applications: IncomingApplication[]
  onView(application: IncomingApplication): void
  onStatusChange(application: IncomingApplication, status: ApplicationStatus): void
  updatingId?: string
}

/**
 * Tabel lamaran masuk. Design system belum memiliki DataTable (folder masih
 * kosong), sehingga dibuat lokal. Pada layar kecil tabel dapat digeser
 * horizontal di dalam kartunya.
 */
export function IncomingApplicationsTable({
  applications,
  onView,
  onStatusChange,
  updatingId,
}: IncomingApplicationsTableProps) {
  return (
    <div
      className={styles.scroller}
      role="region"
      aria-label="Tabel lamaran masuk"
      tabIndex={0}
    >
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">Nama Pelamar</th>
            <th scope="col">Posisi</th>
            <th scope="col">Tanggal Melamar</th>
            <th scope="col">Status</th>
            <th scope="col">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => {
            const isUpdating = updatingId === application.id

            return (
              <tr key={application.id} aria-busy={isUpdating || undefined}>
                <th scope="row" className={styles.applicantCell}>
                  <span className={styles.applicant}>
                    <span className={styles.name}>{application.applicantName}</span>
                    <span className={styles.email}>{application.applicantEmail}</span>
                  </span>
                </th>
                <td>{application.jobTitle}</td>
                <td className={styles.muted}>
                  <time dateTime={application.appliedAt}>
                    {formatLongDate(application.appliedAt)}
                  </time>
                </td>
                <td>
                  <ApplicationStatusBadge status={application.status} />
                </td>
                <td>
                  <div className={styles.actions}>
                    <IconButton
                      variant="default"
                      size="small"
                      className={tones.brandOutline}
                      icon={<Eye size={16} />}
                      aria-label={`Lihat detail lamaran ${application.applicantName}`}
                      onClick={() => onView(application)}
                    />
                    <div className={styles.statusSelect}>
                      <Select
                        aria-label={`Ubah status lamaran ${application.applicantName}`}
                        value={application.status}
                        disabled={isUpdating}
                        onChange={(event) =>
                          onStatusChange(
                            application,
                            event.target.value as ApplicationStatus,
                          )
                        }
                      >
                        {statusOptions.map(([value, label]) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </Select>
                    </div>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
