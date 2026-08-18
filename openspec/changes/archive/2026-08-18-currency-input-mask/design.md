## Context

Os quatro formulários que capturam um valor monetário (`DespesaForm`, `ReceitaForm`, `PatrimonioForm`, `ContaRecorrenteForm`) usam hoje, de forma idêntica e duplicada, um `<Input type="number" step="0.01" min="0.01">` dentro de um `FormField` (react-hook-form via `Controller`, padrão shadcn), com `onChange={(e) => field.onChange(e.target.valueAsNumber)}`. O schema zod em todos eles é `valor: z.number().positive(...)` (ou `valorPadrao` em contas recorrentes) — um `number` puro, sem `.transform()`.

Os diálogos "Editar" (`EditarDespesaDialog`, `EditarReceitaDialog`, `EditarContaRecorrenteDialog`) renderizam o formulário dentro de um `DialogContent` do Radix, que desmonta o conteúdo quando fechado — ou seja, cada abertura do dialog monta o formulário do zero, com `defaultValues` já corretos. Isso significa que um componente de valor não precisa re-sincronizar seu estado interno quando o `value` externo muda depois de montado: o valor inicial correto já chega no primeiro render.

Não há biblioteca de máscara instalada (`react-number-format`, `imask`, etc.) e a proposta é não adicionar nenhuma.

## Goals / Non-Goals

**Goals:**
- Um único componente reutilizável de input de moeda, usado pelos 4 formulários, sem duplicar lógica de máscara.
- Contrato externo continua sendo um `number` puro em reais (não string, não centavos) — os schemas zod existentes (`z.number().positive(...)`) não mudam.
- Formatação em tempo real no padrão `R$ 1.234,56` (separador de milhar `.`, decimal `,`), seguindo o padrão "digitar da direita pra esquerda" (dígitos digitados preenchem os centavos primeiro) — o padrão mais comum em apps financeiros brasileiros.
- Nenhuma dependência nova.

**Non-Goals:**
- Preservar a posição do cursor ao editar no meio do valor já digitado — como todo o texto é reformatado a cada tecla, o cursor pode saltar para o fim do campo; comportamento aceito conscientemente (é a mesma limitação de praticamente toda implementação simples desse tipo de máscara sem lib dedicada).
- Suporte a outras moedas/locales — fixo em BRL/pt-BR, igual ao resto do app.
- Mudar o schema zod ou o payload enviado à API — o componente é só de UI/digitação.

## Decisions

### 1. Algoritmo de máscara: acumulação de dígitos, sem parsing de posição do cursor
`CurrencyInput` mantém apenas um `value: number` controlado de fora (igual a qualquer outro input controlado) e formata a exibição a partir dele. A cada `onChange` do `<input>` nativo:

1. `rawDigits = e.target.value.replace(/\D/g, '')` — remove tudo que não é dígito (isso automaticamente ignora "R$", ".", "," e espaços que a própria máscara inseriu no texto anterior).
2. `cents = rawDigits === '' ? 0 : parseInt(rawDigits, 10)`.
3. `novoValor = cents / 100`.
4. Chama `onChange(novoValor)` (o `number` que o formulário espera) e atualiza o texto exibido para `novoValor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })`.

Esse é o mesmo algoritmo usado por praticamente toda implementação de "máscara de dinheiro" sem dependência externa (inclusive é o que libs como `react-number-format` fazem por baixo dos panos no modo de formatação monetária). Como a formatação nunca insere dígitos — só separadores — remover tudo que não é dígito do texto atual sempre reconstrói exatamente a sequência de dígitos que o usuário quis digitar, incluindo backspace.

Alternativa considerada: parsear a string formatada como número diretamente (`parseFloat` trocando `.`/`,`). Rejeitada — mais frágil (formatos `1.234,56` confundem `parseFloat`) e não dá o comportamento "preenche centavos primeiro" que é o padrão esperado.

### 2. Estado inicial: derivado do `value` prop no mount, sem `useEffect` de sincronização
Como os dialogs de edição desmontam/remontam o formulário a cada abertura (ver Context), `CurrencyInput` só precisa inicializar seu texto exibido uma vez, a partir do `value` recebido:
- `value > 0` (edição, valor existente): mostra já formatado, ex. `R$ 1.234,56`.
- `value === 0` ou ausente (cadastro novo): mostra vazio (placeholder `R$ 0,00` assume esse papel), em vez de forçar `R$ 0,00` como texto digitável — evita o usuário ter que apagar um "0,00" antes de digitar.

Não há `useEffect` reagindo a mudanças externas de `value` depois do mount — mantém o componente simples e evita a armadilha clássica de "cursor pulando" que aparece quando um efeito re-formata o texto toda vez que o valor externo muda por qualquer motivo (inclusive pela própria digitação do usuário, criando um loop).

### 3. Contrato de props e integração com `FormField`
```ts
interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  onBlur?: () => void;
  disabled?: boolean;
  placeholder?: string; // default "R$ 0,00"
  id?: string;
  name?: string;
}
```
Uso dentro de cada formulário, substituindo o `<Input type="number">` atual:
```tsx
<FormField
  control={form.control}
  name="valor"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Valor (R$)</FormLabel>
      <FormControl>
        <CurrencyInput
          value={field.value}
          onChange={field.onChange}
          onBlur={field.onBlur}
          name={field.name}
          disabled={field.disabled}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```
Esse é o mesmo estilo já usado no `Select` dentro desses formulários (`onValueChange={field.onChange} defaultValue={field.value}` em vez de `{...field}` espalhado) — consistente com a convenção existente no código para campos que não são `<input>` nativos simples.

### 4. Local do componente: `components/ui/currency-input.tsx`
Fica em `components/ui/` (não em `components/features/shared/`) porque é um primitivo de input genérico e sem lógica de domínio — no mesmo nível de `Input`/`Select`, reutilizável por qualquer feature futura que precise de um valor monetário, e consistente com onde vivem os outros primitivos de formulário do shadcn.

## Risks / Trade-offs

- [Trade-off] Cursor sempre pula para o fim do texto ao editar no meio do valor → aceito como Non-Goal; edição no meio de um valor monetário já formatado é um caso de uso raro (a imensa maioria digita do zero ou usa backspace no fim).
- [Risco] `toLocaleString('pt-BR', ...)` roda no cliente a cada tecla — para um campo de formulário isso é irrelevante em custo (poucas chamadas por segundo, no máximo), sem necessidade de debounce/memoização.
