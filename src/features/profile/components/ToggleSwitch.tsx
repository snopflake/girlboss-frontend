import styles from './ToggleSwitch.module.css'

interface ToggleSwitchProps {
  checked: boolean
  onChange(checked: boolean): void
  'aria-labelledby'?: string
  'aria-describedby'?: string
  disabled?: boolean
}

/**
 * Switch on/off (role="switch"). Design system belum memiliki Switch;
 * kandidat untuk dipindahkan ke sana setelah dikoordinasikan.
 */
export function ToggleSwitch({ checked, onChange, disabled, ...aria }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      className={styles.switch}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      {...aria}
    >
      <span className={styles.thumb} aria-hidden="true" />
    </button>
  )
}
