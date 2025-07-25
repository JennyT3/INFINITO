// lib/api/fetcher.ts
export async function fetcher<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      credentials: 'include', // Always include credentials for session
    });

    if (!res.ok) {
      // Handle different error types
      if (res.status === 401) {
        const errorText = await res.text();
        throw new Error(`401 Unauthorized: ${errorText}`);
      }
      
      if (res.status === 403) {
        throw new Error('403 Forbidden: Access denied');
      }
      
      if (res.status === 404) {
        throw new Error('404 Not Found: Resource not found');
      }
      
      if (res.status >= 500) {
        throw new Error(`Server Error (${res.status}): ${res.statusText}`);
      }
      
      // Try to get error details from response
      try {
        const error = await res.json();
        throw new Error(error.message || error.error || res.statusText);
      } catch (parseError) {
        // If JSON parsing fails, use status text
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
    }

    return res.json();
  } catch (error) {
    // Re-throw with additional context
    if (error instanceof Error) {
      throw error;
    }
    throw new Error(`Network error: ${String(error)}`);
  }
}