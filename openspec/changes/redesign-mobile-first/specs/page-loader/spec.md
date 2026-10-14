## MODIFIED Requirements

### Requirement: PageLoader displays centered Spinner for full-page loading
The system SHALL provide a `PageLoader` component at `components/ui/page-loader.tsx` that renders a `Spinner` (size `md`) centered both horizontally and vertically within the available space. Its use SHALL be restricted to blocking the entire route — session resolution and route protection — and it MUST NOT be used as the loading state of a listing, card or chart, which SHALL use skeletons that preserve layout instead.

#### Scenario: Centered rendering
- **WHEN** `<PageLoader />` is rendered
- **THEN** the Spinner appears centered using flexbox (`flex items-center justify-center`) with a minimum height so it is visible even in short viewports

#### Scenario: Used in place of page content during isLoading
- **WHEN** the authenticated session is still being resolved and no route content can be rendered yet
- **THEN** `<PageLoader />` is rendered in place of the route content

#### Scenario: Not used for listing loading states
- **WHEN** a listing, card or chart is loading data for the active competência
- **THEN** skeletons matching the real content structure are rendered instead of `<PageLoader />`, and the page's navigation and filter controls remain rendered

#### Scenario: No props required
- **WHEN** `<PageLoader />` is rendered without any props
- **THEN** it renders correctly with sensible defaults (no required props)
