## ADDED Requirements

### Requirement: Inline action buttons show per-item Spinner via loadingId
Table and card action buttons (delete, status toggle) SHALL track which item is being processed via a `loadingId: string | null` state. Only the button corresponding to the `loadingId` SHALL be disabled and show `<Spinner size="sm" />`.

#### Scenario: Only the active item's button shows Spinner
- **WHEN** the user triggers an inline action on item X
- **THEN** only item X's action button shows `<Spinner size="sm" />` and is disabled; all other items' buttons remain fully interactive

#### Scenario: loadingId resets after action completes
- **WHEN** the mutation resolves (success or error)
- **THEN** `loadingId` is set back to `null`, restoring the button to its original icon/label

#### Scenario: loadingId resets even on error
- **WHEN** the mutation fails (network error or API error)
- **THEN** `loadingId` is still reset to `null` so the button does not remain stuck in loading state

#### Scenario: Applied to delete buttons in all tables and cards
- **WHEN** delete buttons exist in `DespesaTable`, `ReceitaTable`, or `PatrimonioCard`/`PatrimonioGrid`
- **THEN** each uses `loadingId` to control its per-item Spinner

#### Scenario: Applied to status toggle in DespesaTable
- **WHEN** a status toggle action exists in `DespesaTable`
- **THEN** it uses `loadingId` to show Spinner only on the toggled item's button
