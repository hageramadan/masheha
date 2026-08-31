/* eslint-disable @typescript-eslint/no-explicit-any */

const BASE_URL = "https://admin.masheha.com/api";

export class ApiService {
  protected static async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "accept-language": "ar",
      ...options.headers,
    };

    console.log(`📡 ${options.method || "GET"} Request:`, {
      url,
      headers,
      body: options.body,
    });

    try {
      const response = await fetch(url, { ...options, headers });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Error response:", errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }

  protected static async get<T>(
    endpoint: string,
    customHeaders?: Record<string, string>,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "GET",
      headers: customHeaders,
    });
  }

  protected static async post<T>(
    endpoint: string,
    data?: any,
    customHeaders?: Record<string, string>,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      headers: customHeaders,
      body: JSON.stringify(data),
    });
  }

  protected static async put<T>(
    endpoint: string,
    data?: any,
    customHeaders?: Record<string, string>,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      headers: customHeaders,
      body: JSON.stringify(data),
    });
  }

  protected static async delete<T>(
    endpoint: string,
    customHeaders?: Record<string, string>,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      method: "DELETE",
      headers: customHeaders,
    });
  }
  
}
