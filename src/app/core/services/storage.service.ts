import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private TOKEN_KEY = 'auth_token';
  private NAME_KEY = 'auth_name';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  async setToken(token: string): Promise<void> {
    if (!this.isBrowser) return;
    await Preferences.set({ key: this.TOKEN_KEY, value: token });
  }

  async getToken(): Promise<string | null> {
    if (!this.isBrowser) return null;
    const { value } = await Preferences.get({ key: this.TOKEN_KEY });
    return value;
  }

  async setName(name: string): Promise<void> {
    if (!this.isBrowser) return;
    await Preferences.set({ key: this.NAME_KEY, value: name });
  }

  async getName(): Promise<string | null> {
    if (!this.isBrowser) return null;
    const { value } = await Preferences.get({ key: this.NAME_KEY });
    return value;
  }

  async clear(): Promise<void> {
    if (!this.isBrowser) return;
    await Preferences.remove({ key: this.TOKEN_KEY });
    await Preferences.remove({ key: this.NAME_KEY });
  }

  async isLoggedIn(): Promise<boolean> {
    if (!this.isBrowser) return false;
    const token = await this.getToken();
    return !!token;
  }
}
