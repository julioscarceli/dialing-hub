// src/services/api.ts

const API_BASE_URL = "https://api-discador-production.up.railway.app";
// URL pública do seu novo worker de monitoramento confirmada pelo print
const LOG_WORKER_URL = "https://api-discador-production-36c2.up.railway.app"; 

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
    const response = await fetch(`${API_BASE_URL}/api/custos/`);
    if (!response.ok) throw new Error("Erro ao buscar dados financeiros");
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
  },

  // Envio de Mailing (Endpoint de Upload)
  uploadMailing: async (server: 'SP' | 'MG', fileBase64: string, fileName: string): Promise<any> => {
    console.log(`[API-LOG] 📡 Iniciando fetch para ${server}...`);
    const cleanBase64 = fileBase64.includes(',') ? fileBase64.split(',')[1] : fileBase64;

    const response = await fetch(`${API_BASE_URL}/api/upload/${server}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        file_content_base64: cleanBase64,
        mailling_name: fileName,
        login_crm: 'DASHBOARD_LOVABLE'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "Erro desconhecido" }));
      throw new Error(errorData.detail || "Erro ao realizar upload");
    }
    
    const result = await response.json();
    console.log(`[API-LOG] ✅ Resposta da API:`, result);
    return result;
  },

  // NOVA FUNÇÃO: Enviar logs para o import-monitor no Railway
  sendImportLog: async (logData: {
    region: string;
    action: string;
    status: 'sucesso' | 'erro' | 'processando';
    message: string;
    file_name?: string;
    campaign_id?: string;
  }) => {
    try {
      await fetch(`${LOG_WORKER_URL}/api/logs/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timestamp: new Date().toLocaleTimeString('pt-BR'),
          ...logData
        }),
      });
    } catch (err) {
      console.error("Falha ao reportar log para o Railway", err);
    }
  }
};
