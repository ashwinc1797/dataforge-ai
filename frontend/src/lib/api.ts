import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const DatasetAPI = {
  generate: async (config: any) => {
    const response = await api.post('/datasets/generate', config);
    return response.data;
  },
  
  generateML: async (config: any) => {
    const response = await api.post('/specialized/ml', config);
    return response.data;
  },
  
  generateAI: async (config: any) => {
    const response = await api.post('/ai/generate', config);
    return response.data;
  },
  
  getPreview: async (jobId: string) => {
    const response = await api.get(`/datasets/${jobId}/preview`);
    return response.data;
  },

  getStatus: async (jobId: string) => {
    const response = await api.get(`/datasets/${jobId}/status`);
    return response.data;
  },

  getQuality: async (jobId: string) => {
    const response = await api.get(`/datasets/${jobId}/quality`);
    return response.data;
  },
  
  exportData: async (jobId: string, format: string) => {
    // We handle export by opening a new window or creating an anchor tag
    // since it's a file download
    window.open(`/api/v1/export?job_id=${jobId}&format=${format}`, '_blank');
  },
  
  reorderColumns: async (jobId: string, tableName: string, columns: string[]) => {
    const response = await api.post(`/datasets/${jobId}/reorder_columns`, {
      table_name: tableName,
      columns: columns
    });
    return response.data;
  }
};

export default api;
