const logAxiosError = (error: any, context: string) => {
  if (error.response) {
    console.error(`❌ [${context}] Server responded with an error:`, {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers,
    });
  } else if (error.request) {
    console.error(`⚠️ [${context}] No response received from server:`, {
      url: error.config?.url,
      method: error.config?.method,
      request: error.request,
    });
  } else {
    console.error(`💥 [${context}] Request setup error:`, error.message);
  }
};

export default logAxiosError;