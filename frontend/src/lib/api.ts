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
  
  exportData: async (jobId: string, format: string, tableCount: number = 1) => {
    try {
      const response = await api.post('/export/', {
        job_id: jobId,
        format: format,
      }, {
        responseType: 'blob',
      });
      
      const blob = new Blob([response.data]);
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      
      let ext = format;
      if (format === 'excel') ext = 'xlsx';
      else if (format === 'sqlite') ext = 'db';
      else if (format === 'csv' || format === 'json' || format === 'parquet') {
        ext = tableCount > 1 ? 'zip' : format;
      }
      
      a.download = `dataset_${jobId}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err: any) {
      console.error('Export download error:', err);
      // Fallback: try opening backend direct export URL if popup/blob fails
      const baseUrl = import.meta.env.VITE_API_URL || '/api/v1';
      window.open(`${baseUrl}/export/?job_id=${jobId}&format=${format}`, '_blank');
    }
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
