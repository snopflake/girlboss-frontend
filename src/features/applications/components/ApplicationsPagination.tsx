import { ChevronLeft, ChevronRight } from 'lucide-react'
import { IconButton } from '../../../design-system/components'
import styles from './ApplicationsPagination.module.css'

interface ApplicationsPaginationProps {
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange(page: number): void
}

export function ApplicationsPagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: ApplicationsPaginationProps) {
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)

  return (
    <div className={styles.wrapper}>
      {totalPages > 1 && (
        <nav aria-label="Navigasi halaman lamaran">
          <ul className={styles.pages}>
            <li>
              <IconButton
                aria-label="Halaman sebelumnya"
                icon={<ChevronLeft size={16} />}
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
              />
            </li>
            {pages.map((pageNumber) => {
              const isCurrent = pageNumber === page
              return (
                <li key={pageNumber}>
                  <button
                    type="button"
                    className={[styles.page, isCurrent ? styles.current : '']
                      .filter(Boolean)
                      .join(' ')}
                    aria-label={`Halaman ${pageNumber}`}
                    aria-current={isCurrent ? 'page' : undefined}
                    onClick={() => onPageChange(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                </li>
              )
            })}
            <li>
              <IconButton
                aria-label="Halaman berikutnya"
                icon={<ChevronRight size={16} />}
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
              />
            </li>
          </ul>
        </nav>
      )}
      <p className={styles.summary} aria-live="polite">
        Menampilkan {start}–{end} dari {totalItems} lamaran
      </p>
    </div>
  )
}
