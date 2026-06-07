import { AxiosError } from 'axios';

export function getErrorMessage(
  error: unknown,
  fallback = 'Ocorreu um erro. Tente novamente.'
): string {
  if (error instanceof AxiosError) {
    const apiMessage = error.response?.data?.message;
    if (typeof apiMessage === 'string' && apiMessage.trim()) {
      return apiMessage;
    }

    switch (error.response?.status) {
      case 400: return 'Dados inválidos. Verifique os campos e tente novamente.';
      case 401: return 'Sessão expirada. Faça login novamente.';
      case 403: return 'Você não tem permissão para realizar esta ação.';
      case 404: return 'Registro não encontrado.';
      case 409: return 'Já existe um registro com esses dados.';
      case 500: return 'Erro interno do servidor. Tente novamente mais tarde.';
    }
  }

  return fallback;
}
