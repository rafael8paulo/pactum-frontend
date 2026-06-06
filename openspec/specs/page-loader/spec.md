## Purpose

Defines the `PageLoader` component used to indicate full-page loading states while TanStack Query fetches initial data.

## Requirements

### Requirement: PageLoader displays centered Spinner for full-page loading
The system SHALL provide a `PageLoader` component at `components/ui/page-loader.tsx` that renders a `Spinner` (size `md`) centered both horizontally and vertically within the available space.

#### Scenario: Centered rendering
- **WHEN** `<PageLoader />` is rendered
- **THEN** the Spinner appears centered using flexbox (`flex items-center justify-center`) with a minimum height so it is visible even in short viewports

#### Scenario: Used in place of page content during isLoading
- **WHEN** a page component has `isLoading === true` from a TanStack Query hook
- **THEN** it MUST return `<PageLoader />` instead of the normal page content

#### Scenario: No props required
- **WHEN** `<PageLoader />` is rendered without any props
- **THEN** it renders correctly with sensible defaults (no required props)
