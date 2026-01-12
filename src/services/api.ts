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
  getFinanceiro: async (): Promise<FinanceiroData> => {
    const response = await fetch(`${API_BASE_URL}/api/custos/`);
    if (!response.ok) throw new Error("Erro ao buscar dados financeiros");
    return response.json();
  },

  getStatusMG: async (): Promise<StatusData> => {
    const response = await fetch(`${API_BASE_URL}/api/status/MG`);
    if (!response.ok) throw new Error("Erro ao buscar status MG");
    return response.json();
  },

  getStatusSP: async (): Promise<StatusData> => {
    const response = await fetch(`${API_BASE_URL}/api/status/SP`);
    if (!response.ok) throw new Error("Erro ao buscar status SP");
    return response.json();
  },

  uploadMailing: async (server: 'SP' | 'MG', fileBase64: string, fileName: string): Promise<any> => {
    console.log(`[API-LOG] 📡 Enviando para Railway: ${server}`);
    const cleanBase64 = fileBase64.includes(',') ? fileBase64.split(',')[1] : fileBase64;

    const response = await fetch(`${API_BASE_URL}/api/upload/${server}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file_content_base64: cleanBase64,
        mailling_name: fileName,
        login_crm: 'DASHBOARD_LOVABLE'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "Erro no servidor" }));
      throw new Error(errorData.detail || "Erro ao realizar upload");
    }
    return response.json();
  }
};
