// src/services/settingsService.ts

export interface SettingsResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  facebook: string;
  instagram: string;
  snapchat: string;
  tik_tok: string;
  pinterest: string;
  fav_icon: string;
  light_logo: string;
  dark_logo: string;
  no_data_icon: string;
  default_user: string;
  login_background: string;
  hover_color: string;
  color: string;
  address: string;
  privacy_policy: string;
  terms_and_conditions: string;
  created_at: string;
  updated_at: string;
}

export class SettingsService {
  private static cachedSettings: SettingsResponse | null = null;
  private static cacheTimestamp: number | null = null;
  private static CACHE_DURATION = 10 * 60 * 1000; // 10 دقائق

  static async getSettings(forceRefresh: boolean = false): Promise<SettingsResponse> {
    // التحقق من Cache
    if (!forceRefresh && this.cachedSettings && this.cacheTimestamp) {
      const now = Date.now();
      if (now - this.cacheTimestamp < this.CACHE_DURATION) {
        return this.cachedSettings;
      }
    }

    try {
      const response = await fetch(`https://admin.masheha.com/api/settings`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Accept-Language": "ar",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.result) {
        throw new Error(data.message || "فشل في جلب الإعدادات");
      }

      // تخزين في Cache
      this.cachedSettings = data.data;
      this.cacheTimestamp = Date.now();

      return data.data;
    } catch (error) {
      console.error("Error fetching settings:", error);
      throw error;
    }
  }

  static clearCache(): void {
    this.cachedSettings = null;
    this.cacheTimestamp = null;
  }
}