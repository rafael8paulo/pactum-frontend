export type CategoriaReceita =
  | 'SALARIO'
  | 'FREELANCE'
  | 'INVESTIMENTO'
  | 'OUTROS';

export interface Receita {
  id: string;
  descricao: string;
  valor: number;
  competencia: string;
  categoria: CategoriaReceita;
  /** ISO yyyy-MM-dd. Ainda não fornecido pela API. */
  data?: string | null;
}

export interface CadastrarReceitaRequest {
  descricao: string;
  valor: number;
  competencia: string;
  categoria: CategoriaReceita;
}

export interface ListaReceitasResponse {
  receitas: Receita[];
  total: number;
}
