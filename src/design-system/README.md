# GirlBoss Design System

## Foundations

The CSS variables are defined in `tokens/` and loaded through `tokens/globals.css`.
The interface uses the Inter font stack, the GirlBoss pink-to-purple primary
gradient, and semantic colors, spacing, radius, sizing, and shadow tokens.

## Component choices

- **Button:** primary, secondary, outline, ghost, and danger variants; small and
  medium sizes; hover, keyboard focus, and disabled states. Native `button`
  semantics are retained and the default type is `button`.
- **IconButton:** default, primary, ghost, and danger variants; small, medium,
  and large sizes. An accessible name is required with `aria-label`.
- **Input, Select, Textarea:** native form controls with focused, disabled, and
  invalid states. Textarea supports vertical, no, or both-axis resizing.
- **Checkbox:** native checkbox behavior with optional associated label and
  description; checked, focus, invalid, and disabled states.
- **Badge:** neutral, primary, success, warning, danger, and info status styles.
- **Card:** semantic `article` surface with default, outlined, and elevated
  appearances plus default, compact, and no-padding spacing.
- **FormField:** associates a visible label and messages with the control ID.
  Its child is a render function so the generated accessible properties
  (`id`, `required`, `aria-describedby`, and invalid state) reach the control.

Where Figma did not specify interaction states, controls use visible keyboard
focus, reduced-contrast disabled styling, and a consistent semantic error
palette. Hover states use subtle surface or gradient changes rather than
changing component geometry. The showcase is a temporary development view and
does not add application routes or business behavior.
