import styles from './RoleSelector.module.css'

export interface RoleOption<Value extends string> {
  value: Value
  label: string
  description?: string
}

interface RoleSelectorProps<Value extends string> {
  label: string
  value: Value
  options: readonly RoleOption<Value>[]
  onChange(value: Value): void
  variant?: 'segmented' | 'cards'
}

export function RoleSelector<Value extends string>({
  label,
  value,
  options,
  onChange,
  variant = 'segmented',
}: RoleSelectorProps<Value>) {
  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{label}</legend>
      <div
        className={[
          styles.options,
          variant === 'cards' ? styles.cards : styles.segmented,
        ].join(' ')}
      >
        {options.map((option) => (
          <label
            className={[
              styles.option,
              value === option.value ? styles.selected : '',
            ]
              .filter(Boolean)
              .join(' ')}
            key={option.value}
          >
            <input
              checked={value === option.value}
              className={styles.radio}
              name="accountType"
              onChange={() => onChange(option.value)}
              type="radio"
              value={option.value}
            />
            <span className={styles.copy}>
              <span className={styles.optionLabel}>{option.label}</span>
              {option.description && (
                <span className={styles.description}>{option.description}</span>
              )}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}
