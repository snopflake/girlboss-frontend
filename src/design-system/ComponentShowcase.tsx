import {
  ArrowRight,
  Check,
  Heart,
  Search,
  Sparkles,
} from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  Checkbox,
  FormField,
  IconButton,
  Input,
  Select,
  Textarea,
  type ButtonVariant,
} from './components'
import styles from './ComponentShowcase.module.css'

const buttonVariants: ButtonVariant[] = [
  'primary',
  'secondary',
  'outline',
  'ghost',
  'danger',
]

const badgeVariants = [
  { variant: 'success', label: 'Aktif' },
  { variant: 'warning', label: 'Menunggu' },
  { variant: 'danger', label: 'Ditolak' },
  { variant: 'info', label: 'Dalam proses' },
  { variant: 'primary', label: 'Baru' },
  { variant: 'neutral', label: 'Arsip' },
] as const

export default function ComponentShowcase() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandIcon} aria-hidden="true">
            <Sparkles size={20} />
          </span>
          <span>GirlBoss</span>
          <Badge variant="primary">Design System</Badge>
        </div>
        <p className={styles.headerCaption}>Reusable interface primitives</p>
      </header>

      <section className={styles.intro} aria-labelledby="showcase-title">
        <p className={styles.eyebrow}>FOUNDATION / COMPONENTS</p>
        <h1 id="showcase-title">Component Showcase</h1>
        <p className={styles.lead}>
          A quick visual reference for GirlBoss design tokens and accessible
          interface building blocks.
        </p>
      </section>

      <div className={styles.sections}>
        <section className={styles.section} aria-labelledby="buttons-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>ACTIONS</p>
              <h2 id="buttons-title">Buttons</h2>
            </div>
            <span className={styles.componentPath}>Button</span>
          </div>
          <Card className={styles.demoCard}>
            <div className={styles.buttonGrid}>
              {buttonVariants.map((variant) => (
                <Button key={variant} variant={variant}>
                  {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </Button>
              ))}
              <Button leadingIcon={<Heart size={16} />}>Save role</Button>
              <Button
                variant="outline"
                trailingIcon={<ArrowRight size={16} />}
              >
                Continue
              </Button>
              <Button size="small">Small button</Button>
              <Button disabled>Disabled</Button>
            </div>
            <div className={styles.iconButtonRow}>
              <IconButton
                icon={<Search size={18} />}
                aria-label="Search"
                variant="default"
              />
              <IconButton
                icon={<Heart size={18} />}
                aria-label="Save"
                variant="primary"
              />
              <IconButton
                icon={<Check size={18} />}
                aria-label="Confirm"
                size="small"
                variant="ghost"
              />
              <IconButton
                icon={<Heart size={18} />}
                aria-label="Disabled save"
                disabled
              />
            </div>
          </Card>
        </section>

        <section className={styles.section} aria-labelledby="inputs-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>FORM CONTROLS</p>
              <h2 id="inputs-title">Inputs</h2>
            </div>
            <span className={styles.componentPath}>Input · Select · Textarea</span>
          </div>
          <Card className={styles.demoCard}>
            <div className={styles.formGrid}>
              <FormField
                id="showcase-name"
                label="Full name"
                hint="Use the name shown on your professional profile."
                required
              >
                {(fieldProps) => (
                  <Input {...fieldProps} placeholder="e.g. Maya Putri" />
                )}
              </FormField>
              <FormField
                id="showcase-email"
                label="Email address"
                error="Enter a valid email address."
              >
                {(fieldProps) => (
                  <Input
                    {...fieldProps}
                    type="email"
                    placeholder="maya@example.com"
                  />
                )}
              </FormField>
              <FormField id="showcase-disabled" label="Disabled input">
                {(fieldProps) => (
                  <Input
                    {...fieldProps}
                    disabled
                    value="This field is disabled"
                    readOnly
                  />
                )}
              </FormField>
              <FormField
                id="showcase-role"
                label="Career level"
                required
              >
                {(fieldProps) => (
                  <Select {...fieldProps} defaultValue="">
                    <option value="" disabled>
                      Select a career level
                    </option>
                    <option value="entry">Entry level</option>
                    <option value="mid">Mid level</option>
                    <option value="senior">Senior level</option>
                  </Select>
                )}
              </FormField>
              <div className={styles.fullWidth}>
                <FormField
                  id="showcase-message"
                  label="Professional summary"
                  hint="A few sentences about your experience and goals."
                >
                  {(fieldProps) => (
                    <Textarea
                      {...fieldProps}
                      placeholder="Tell us what makes your work meaningful..."
                    />
                  )}
                </FormField>
              </div>
              <div className={styles.fullWidth}>
                <Checkbox
                  label="I agree to the community guidelines"
                  description="You can update your preferences at any time."
                />
              </div>
            </div>
          </Card>
        </section>

        <section className={styles.section} aria-labelledby="badges-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>STATUS</p>
              <h2 id="badges-title">Badges</h2>
            </div>
            <span className={styles.componentPath}>Badge</span>
          </div>
          <Card className={styles.demoCard}>
            <div className={styles.badgeRow}>
              {badgeVariants.map(({ variant, label }) => (
                <Badge key={variant} variant={variant}>
                  {label}
                </Badge>
              ))}
            </div>
          </Card>
        </section>

        <section className={styles.section} aria-labelledby="cards-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.eyebrow}>SURFACES</p>
              <h2 id="cards-title">Cards</h2>
            </div>
            <span className={styles.componentPath}>Card</span>
          </div>
          <div className={styles.cardGrid}>
            <Card>
              <div className={styles.cardContent}>
                <Badge variant="success">Open</Badge>
                <h3>Product Designer</h3>
                <p>
                  Create thoughtful experiences with a collaborative design
                  team.
                </p>
                <Button variant="outline" size="small">
                  View opportunity
                </Button>
              </div>
            </Card>
            <Card padding="compact" variant="outlined">
              <div className={styles.cardContent}>
                <span className={styles.eyebrow}>COMPACT CARD</span>
                <h3>Application status</h3>
                <p>Interview scheduled for Thursday, 10:30 AM.</p>
                <Badge variant="info">Next step</Badge>
              </div>
            </Card>
          </div>
        </section>
      </div>

      <footer className={styles.footer}>
        GirlBoss Design System <span aria-hidden="true">·</span> Foundations
        before application skeleton
      </footer>
    </main>
  )
}
