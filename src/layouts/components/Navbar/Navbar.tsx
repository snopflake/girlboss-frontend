import { Sparkles } from 'lucide-react'
import { Link, NavLink } from 'react-router'
import type { ReactNode } from 'react'
import type { NavigationItem } from '../../navigation'
import styles from './Navbar.module.css'

interface NavbarProps {
  brandHref: string
  items?: NavigationItem[]
  actions?: ReactNode
  contextLabel?: string
}

export function Navbar({
  brandHref,
  items = [],
  actions,
  contextLabel,
}: NavbarProps) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.brand} to={brandHref}>
          <span className={styles.brandIcon} aria-hidden="true">
            <Sparkles size={18} />
          </span>
          <span>GirlBoss</span>
        </Link>
        {items.length > 0 && (
          <nav className={styles.navigation} aria-label="Navigasi utama">
            {items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  [styles.navLink, isActive ? styles.active : '']
                    .filter(Boolean)
                    .join(' ')
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}
        {contextLabel && (
          <span className={styles.contextLabel}>{contextLabel}</span>
        )}
        {actions && <div className={styles.actions}>{actions}</div>}
      </div>
    </header>
  )
}
