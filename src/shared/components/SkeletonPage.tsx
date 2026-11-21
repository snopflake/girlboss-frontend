import { useId } from 'react'
import { Link } from 'react-router'
import { Badge, Card } from '../../design-system/components'
import styles from './SkeletonPage.module.css'

export interface SkeletonSection {
  title: string
  description: string
}

export interface BreadcrumbItem {
  label: string
  to?: string
}

interface SkeletonPageProps {
  title: string
  description: string
  statusTitle?: string
  statusDescription?: string
  sections?: SkeletonSection[]
  breadcrumbs?: BreadcrumbItem[]
}

export function SkeletonPage({
  title,
  description,
  statusTitle = 'Ruang kerja sedang disiapkan',
  statusDescription = 'Struktur tampilan sudah tersedia. Data dan aksi akan disambungkan ke layanan yang terotorisasi pada tahap berikutnya.',
  sections = [],
  breadcrumbs = [],
}: SkeletonPageProps) {
  const headingId = useId()

  return (
    <section className={styles.page} aria-labelledby={headingId}>
      {breadcrumbs.length > 0 && (
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <ol>
            {breadcrumbs.map((item, index) => {
              const isCurrent = index === breadcrumbs.length - 1

              return (
                <li key={`${item.label}-${index}`}>
                  {item.to && !isCurrent ? (
                    <Link to={item.to}>{item.label}</Link>
                  ) : (
                    <span aria-current={isCurrent ? 'page' : undefined}>
                      {item.label}
                    </span>
                  )}
                </li>
              )
            })}
          </ol>
        </nav>
      )}

      <header className={styles.header}>
        <p className={styles.eyebrow}>GirlBoss</p>
        <h1 id={headingId}>{title}</h1>
        <p className={styles.description}>{description}</p>
      </header>

      {sections.length > 0 && (
        <div className={styles.sections}>
          {sections.map((section) => (
            <Card key={section.title} padding="compact">
              <h2>{section.title}</h2>
              <p>{section.description}</p>
            </Card>
          ))}
        </div>
      )}

      <Card className={styles.statusCard}>
        <Badge variant="info">Kerangka antarmuka</Badge>
        <div>
          <h2>{statusTitle}</h2>
          <p>{statusDescription}</p>
        </div>
      </Card>
    </section>
  )
}
