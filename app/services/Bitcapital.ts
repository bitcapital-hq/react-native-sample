import Bitcapital, { Session, StorageUtil } from "@bitcapital/core-sdk";
import { LocalStorage } from './LocalStorage';


/* TODO: Move this to a centralized config */
export const DEFAULT_SESSION_STORAGE = 'client.db';

export interface initOptions {
  baseURL?: string,
  clientId?: string,
  clientSecret?: string
};

export class BitcapitalService {
  protected static instance: Bitcapital;
  protected static storage: LocalStorage = new LocalStorage();

  /**
   * Initialize a Bitcapital service instance.
   * 
   * @param options The initialization options
   */
  public static async initialize(options: initOptions = {}, renew = true): Promise<Bitcapital> {
    try {
      const credentials = {
        baseURL: options.baseURL,
        clientId: options.clientId,
        clientSecret: options.clientSecret,
      };

      const sessionStorage = new LocalStorage();

      const session = new Session({
        storage: new StorageUtil("session", sessionStorage),
        http: credentials,
        oauth: credentials,
        autoFetch: true,
      });

      await session.onFetch();

      this.instance = Bitcapital.initialize({ session, ...credentials });

      if (renew && !this.instance.session().current) {
        await this.instance.session().clientCredentials();
      }

      // Set client information in storage
      await this.storage.setItem('oauth:client', JSON.stringify({
        client: {
          baseURL: options.baseURL,
          clientId: options.clientId,
          clientSecret: options.clientSecret,
        },
        ...this.instance.session().current
      }));

      return this.instance;
    } catch (exception) {
      console.warn(exception);
      throw exception;
    }
  }

  /**
   * Gets singleton bitcapital service instance.
   */
  public static getInstance(): Bitcapital {
    if (!this.instance) {
      // const clientCredentials = JSON.parse(await this.storage.getItem('oauth:client'));

      // // Try to reinitialize bitcapital client using credentials
      // if (clientCredentials && clientCredentials.client) {
      //   return this.initialize(clientCredentials.client, false);
      // }

      throw new Error('Bitcapital client not initialized yet, you must set its client credentials');
    }
    return this.instance;
  }
}