// src/services/api.ts

const API_BASE_URL = "https://api-discador-production.up.railway.app";

export interface FinanceiroData {
  saldo_atual: string;
  custo_diario: string;
  custo_semanal: string;
  data_coleta: string;
}

export interface StatusData {
  nome: string;
  progresso: string;
  saidas: string | number;
  id?: string | null;
}

export const dialingApi = {
  // Busca Saldo e Custos (Endpoint 2)
  getFinanceiro: async (): Promise<FinanceiroData> => {
    // fetch: O comando padrão dos navegadores para buscar dados em URLs.
    const response = await fetch(`${API_BASE_URL}/api/custos/`);
    if (!response.ok) throw new Error("Erro ao buscar dados financeiros");
    // .json(): Pega o texto bruto que veio da API e converte em um objeto que o TypeScript entende.
    return response.json();
  },

  // Busca Status MG (Endpoint 1)
  getStatusMG: async (): Promise<StatusData> => {
    const response = await fetch(`${API_BASE_URL}/api/status/MG`);
    if (!response.ok) throw new Error("Erro ao buscar status MG");
    return response.json();
  },

  // Busca Status SP (Endpoint 1)
  getStatusSP: async (): Promise<StatusData> => {
    const response = await fetch(`${API_BASE_URL}/api/status/SP`);
    if (!response.ok) throw new Error("Erro ao buscar status SP");
    return response.json();
  }
};
