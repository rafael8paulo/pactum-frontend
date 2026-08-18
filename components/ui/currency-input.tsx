import * as React from 'react';

import { Input } from '@/components/ui/input';

function formatBRL(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

interface CurrencyInputProps
  extends Omit<React.ComponentProps<'input'>, 'value' | 'onChange' | 'type'> {
  value: number;
  onChange: (value: number) => void;
}

const CurrencyInput = React.forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ value, onChange, placeholder = 'R$ 0,00', ...props }, ref) => {
    const [display, setDisplay] = React.useState(() => (value ? formatBRL(value) : ''));

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
      const rawDigits = event.target.value.replace(/\D/g, '');
      const cents = rawDigits === '' ? 0 : parseInt(rawDigits, 10);
      const numericValue = cents / 100;

      onChange(numericValue);
      setDisplay(cents === 0 ? '' : formatBRL(numericValue));
    }

    return (
      <Input
        ref={ref}
        type="text"
        inputMode="decimal"
        placeholder={placeholder}
        value={display}
        onChange={handleChange}
        {...props}
      />
    );
  }
);
CurrencyInput.displayName = 'CurrencyInput';

export { CurrencyInput };
