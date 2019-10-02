import { StorageUtilEngine } from '@bitcapital/core-sdk';
import AsyncStorage from '@react-native-community/async-storage';

export class LocalStorage implements StorageUtilEngine {
  public async setItem(key: string, value: string): Promise<void> {
    return AsyncStorage.setItem(key, value);
  }
  public async getItem(key: string): Promise<string> {
    return AsyncStorage.getItem(key);

  }
  public async removeItem(key: string): Promise<void> {
    return AsyncStorage.removeItem(key);
  }
  public async clear(): Promise<void> {
    return AsyncStorage.clear();
  }
}
