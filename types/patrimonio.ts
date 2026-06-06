export interface Patrimonio {
  id: string;
  descricao: string;
  valor: number;
  competencia: string;
}

export interface CadastrarPatrimonioRequest {
  descricao: string;
  valor: number;
  competencia: string;
}

export interface ListaPatrimonioResponse {
  patrimonios: Patrimonio[];
  total: number;
}
