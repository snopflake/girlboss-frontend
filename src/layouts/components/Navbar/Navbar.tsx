import { Menu, Sparkles, X, type LucideIcon } from 'lucide-react'
import { Link, NavLink } from 'react-router'
import type { ReactNode } from 'react'
import { useState } from 'react'
import type { NavigationItem } from '../../navigation'
import styles from './Navbar.module.css'

interface NavbarProps {
  brandHref: string
  items?: NavigationItem[]
  actions?: ReactNode
  contextLabel?: string
  brandIcon?: LucideIcon
  responsiveMenu?: boolean
  applicantStyle?: boolean
}

export function Navbar({
  brandHref,
  items = [],
  actions,
  contextLabel,
  brandIcon: BrandIcon = Sparkles,
  responsiveMenu = false,
  applicantStyle = false,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className={styles.header}>
      <div
        className={[
          styles.inner,
          responsiveMenu ? styles.responsive : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <Link
          className={[
            styles.brand,
            applicantStyle ? styles.applicantBrand : '',
          ]
            .filter(Boolean)
            .join(' ')}
          to={brandHref}
        >
          <span className={styles.brandIcon} aria-hidden="true">
            <BrandIcon size={20} />
          </span>
          <span>GirlBoss</span>
        </Link>
        {responsiveMenu && (
          <button
            aria-controls="primary-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? 'Tutup navigasi' : 'Buka navigasi'}
            className={styles.mobileToggle}
            onClick={() => setMenuOpen((open) => !open)}
            type="button"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        )}
        {items.length > 0 && (
          <nav
            className={[
              styles.navigation,
              applicantStyle ? styles.applicantNavigation : '',
              menuOpen ? styles.navigationOpen : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-label="Navigasi utama"
            id="primary-navigation"
          >
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
                onClick={() => setMenuOpen(false)}
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
