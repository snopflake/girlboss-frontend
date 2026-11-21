import { ChevronDown } from 'lucide-react'
import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { NavLink, useLocation } from 'react-router'
import type { NavigationGroup, SidebarItem } from '../../navigation'
import styles from './Sidebar.module.css'

interface SidebarProps {
  label: string
  items: SidebarItem[]
}

export function Sidebar({ label, items }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <nav aria-label={label}>
        <p className={styles.label}>{label}</p>
        <ul className={styles.list}>
          {items.map((item) => {
            if ('items' in item) {
              return <SidebarGroup key={item.label} group={item} />
            }

            const Icon = item.icon

            return (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    [styles.link, isActive ? styles.active : '']
                      .filter(Boolean)
                      .join(' ')
                  }
                >
                  {Icon && <Icon size={18} aria-hidden="true" />}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}

function SidebarGroup({ group }: { group: NavigationGroup }) {
  const { pathname } = useLocation()
  const panelId = useId()
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [disclosure, setDisclosure] = useState<{
    pathname: string
    open: boolean
  } | null>(null)
  const isActive = group.items.some(
    ({ to }) => pathname === to || pathname.startsWith(`${to}/`),
  )
  const isOpen =
    disclosure?.pathname === pathname ? disclosure.open : isActive
  const Icon = group.icon

  function toggleDisclosure() {
    setDisclosure({ pathname, open: !isOpen })
  }

  function handleKeyDown(event: KeyboardEvent<HTMLLIElement>) {
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault()
      setDisclosure({ pathname, open: false })
      triggerRef.current?.focus()
    }
  }

  return (
    <li className={styles.group} onKeyDown={handleKeyDown}>
      <button
        ref={triggerRef}
        className={[
          styles.link,
          styles.groupButton,
          isActive ? styles.active : '',
        ]
          .filter(Boolean)
          .join(' ')}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-current={isActive ? 'page' : undefined}
        onClick={toggleDisclosure}
      >
        <Icon size={18} aria-hidden="true" />
        <span>{group.label}</span>
        <ChevronDown
          className={[styles.chevron, isOpen ? styles.chevronOpen : '']
            .filter(Boolean)
            .join(' ')}
          size={16}
          aria-hidden="true"
        />
      </button>
      <ul className={styles.submenu} id={panelId} hidden={!isOpen}>
        {group.items.map((item) => {
          const SubmenuIcon = item.icon

          return (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end ?? true}
                className={({ isActive: isItemActive }) =>
                  [
                    styles.submenuLink,
                    isItemActive ? styles.active : '',
                  ]
                    .filter(Boolean)
                    .join(' ')
                }
              >
                {SubmenuIcon && (
                  <SubmenuIcon size={18} aria-hidden="true" />
                )}
                <span>{item.label}</span>
              </NavLink>
            </li>
          )
        })}
      </ul>
    </li>
  )
}
