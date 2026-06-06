## Purpose

Defines the loading state behavior for form submit buttons inside Dialog components that trigger mutations, ensuring users receive clear visual feedback during submission.

## Requirements

### Requirement: Form submit buttons show Spinner during pending mutation
All form submit buttons in Dialog components that use `useMutation` SHALL display a `Spinner` (size `sm`) in place of their label text while `isPending === true`, and SHALL be disabled during that period.

#### Scenario: Button shows Spinner while submitting
- **WHEN** the user submits a form and `isPending` becomes `true`
- **THEN** the submit button becomes disabled and its label is replaced by `<Spinner size="sm" />`

#### Scenario: Button restores label after mutation completes
- **WHEN** the mutation resolves (success or error) and `isPending` becomes `false`
- **THEN** the submit button is re-enabled and its original label text is restored

#### Scenario: Applied to all cadastro and edição dialogs
- **WHEN** any of `NovaDespesaDialog`, `NovaReceitaDialog`, `NovoPatrimonioDialog`, or their edit equivalents is open
- **THEN** the same Spinner-in-button pattern is applied to their submit button

#### Scenario: No other form elements are disabled
- **WHEN** `isPending === true`
- **THEN** only the submit button is disabled; input fields and other controls remain interactive
