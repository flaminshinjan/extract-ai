export interface ErrorResponse {
  error: string;
  status?: number;
  url?: string;
}

export const formatErrorMessage = (error: unknown, url?: string): ErrorResponse => {
  
  const defaultResponse: ErrorResponse = {
    error: "An unexpected error occurred",
    url,
  };

  
  if (error instanceof Error) {
    const errorMessage = error.message;
    
    
    if (errorMessage.includes("ENOTFOUND") || errorMessage.includes("ETIMEDOUT")) {
      return {
        error: `Could not connect to ${url || 'the URL'}. Please check that the URL is correct and accessible.`,
        url,
      };
    }
    
    
    if (errorMessage.includes("status code")) {
      const statusMatch = errorMessage.match(/status code (\d+)/);
      const status = statusMatch ? parseInt(statusMatch[1], 10) : undefined;
      
      if (status === 403 || status === 401) {
        return {
          error: `Access to ${url || 'the URL'} is forbidden or requires authentication.`,
          status,
          url,
        };
      }
      
      if (status === 404) {
        return {
          error: `The page at ${url || 'the URL'} could not be found. Please check the URL.`,
          status,
          url,
        };
      }
      
      if (status === 429) {
        return {
          error: `Too many requests to ${url || 'the URL'}. Please try again later.`,
          status,
          url,
        };
      }
      
      if (status && status >= 500) {
        return {
          error: `The server at ${url || 'the URL'} encountered an error. Please try again later.`,
          status,
          url,
        };
      }
    }
    
    
    if (errorMessage.includes("parse") || errorMessage.includes("JSON")) {
      return {
        error: "Failed to parse the content. This might not be a valid webpage or the content format is unsupported.",
        url,
      };
    }
    
    
    return {
      error: errorMessage,
      url,
    };
  }
  
  
  if (typeof error === "string") {
    return {
      error,
      url,
    };
  }
  
  return defaultResponse;
}; 