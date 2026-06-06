## ADDED Requirements

### Requirement: Top progress bar displays during route navigation
The system SHALL install `nextjs-toploader` and render `<NextTopLoader />` in `app/layout.tsx` to display a top progress bar during client-side route transitions.

#### Scenario: Progress bar appears on navigation start
- **WHEN** the user clicks a navigation link (sidebar, breadcrumb, or programmatic navigation)
- **THEN** a thin progress bar appears at the top of the viewport and advances until the new page renders

#### Scenario: Progress bar color matches theme primary
- **WHEN** the progress bar is displayed
- **THEN** its color uses `hsl(var(--primary))` matching the shadcn theme primary color

#### Scenario: No duplicate spinner from toploader
- **WHEN** the progress bar is active
- **THEN** `showSpinner={false}` ensures no additional spinner is rendered by `nextjs-toploader` itself

#### Scenario: Works in both light and dark mode
- **WHEN** the user switches theme
- **THEN** the progress bar color follows the `--primary` CSS variable for the active theme
