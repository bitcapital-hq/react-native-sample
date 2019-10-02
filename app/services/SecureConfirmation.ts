import Biometrics from 'react-native-biometrics';
import Settings from './Settings';
import I18n from 'react-native-i18n';

export class SecureConfirmation {
  static async confirm(message: string = I18n.t('DefaultSecureConfirmMessage')) {
    const settings = Settings.getInstance();

    const type = await Biometrics.isSensorAvailable();
    if (type === null) {
      // TODO: Implement manual password validation 
    } else if (settings.getBool('useTouchId')) {
      console.log('Validating Biometrics');
      return await Biometrics.simplePrompt(message);
    } 
  }
}