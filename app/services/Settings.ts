import { LocalStorage } from './LocalStorage';

export default class Settings {
  protected readonly localStorage: LocalStorage = new LocalStorage();

  public async getString(key: string): Promise<string> {
    return this.localStorage.getItem(`settings.${key}`);
  }

  public async getBool(key: string): Promise<boolean> {
    return (await this.localStorage.getItem(key)) === 'true';
  }

  private static instance: Settings|null;
  public static getInstance(): Settings {
    if (!Settings.instance) {
      Settings.instance = new Settings();
    }

    return Settings.instance;
  }
}