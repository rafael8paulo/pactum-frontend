## Purpose

Defines the reusable `Spinner` UI component used across the application to indicate loading states for pages, forms, and inline actions.

## Requirements

### Requirement: Spinner component exists and is reusable
The system SHALL provide a `Spinner` component at `components/ui/spinner.tsx` exported as a named export. It MUST accept a `size` prop (`sm | md | lg`, default `md`) and an optional `className` prop for additional Tailwind classes.

#### Scenario: Default render
- **WHEN** `<Spinner />` is rendered with no props
- **THEN** it displays an animated spinning SVG with medium size using `animate-spin`

#### Scenario: Small size
- **WHEN** `<Spinner size="sm" />` is rendered
- **THEN** the SVG renders at small dimensions (e.g., `w-4 h-4`)

#### Scenario: Large size
- **WHEN** `<Spinner size="lg" />` is rendered
- **THEN** the SVG renders at large dimensions (e.g., `w-8 h-8`)

#### Scenario: Custom className
- **WHEN** `<Spinner className="text-red-500" />` is rendered
- **THEN** the spinner applies the additional class alongside its base classes

#### Scenario: Animation is continuous
- **WHEN** the Spinner is mounted
- **THEN** it spins continuously via Tailwind `animate-spin` without stopping
