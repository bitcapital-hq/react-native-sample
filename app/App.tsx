
require('./devtools');
import './config/ReactotronConfig';

import Bitcapital from '@bitcapital/core-sdk';
import * as React from 'react';
import { NativeModules, Platform, View, AppState } from 'react-native';
import I18n from 'react-native-i18n';
import { createAppContainer, createStackNavigator } from "react-navigation";
import * as Config from './config';
import Colors from './config/Colors';
import { I18nTranslations } from './i18n/translations';
import { 
  BoletoEmitResultScreen, BoletoEmitScreen, BoletoValidationScreen, ConfirmationScreen, 
  DepositScreen, HistoryScreen, HomeScreen, BasicInfoStepScreen, PaymentScreen, 
  ScannerScreen, VirtualCardScreen, WithdrawalScreen, SettingsScreen, LoginScreen, DocumentsStepScreen, BankSelectScreen, WithdrawalConfirmationScreen 
} from './screens';
import { BitcapitalService } from './services/Bitcapital';
import moment from 'moment';
import { SecureConfirmation } from './services/SecureConfirmation';

export enum AppScreens {
  HOME = 'Home',
  CONFIRMATION = 'Confirmation',
  LOGIN = 'Login',
  HISTORY = 'History',
  VIRTUAL_CARD = 'VirtualCard',
  DEPOSIT = 'Deposit',
  SCANNER = 'Scanner',
  PAYMENT = 'Payment',
  BOLETO_VALIDATION = 'BoletoValidation',
  BOLETO_EMIT = 'BoletoEmit',
  BOLETO_EMIT_RESULT = 'BoletoEmitResult',
  WITHDRAWAL = 'Withdrawal',
  WITHDRAWAL_CONFIRMATION = 'WithdrawalConfirmation',
  SETTINGS = 'Settings',
  ONBOARDING_BASIC_INFO = 'OnboardingBasicInfo',
  ONBOARDING_DOCUMENTS = 'OnboardingDocuments',
  ONBOARDING_WAITING = 'OnboardingWaiting',
  BANK_SELECT = 'BankSelect',
}

console.disableYellowBox = true;

I18n.fallbacks = true;
I18n.translations = I18nTranslations;

if (Platform.OS === 'ios') {
  console.log(NativeModules.SettingsManager.settings.AppleLocale);
  I18n.locale = NativeModules.SettingsManager.settings.AppleLocale;
} else if (Platform.OS === 'android') {
  console.log(NativeModules.I18nManager.localeIdentifier);
  I18n.locale = NativeModules.I18nManager.localeIdentifier;
}

const AppNavigator = createStackNavigator({
  [AppScreens.HOME]: { 
    screen: HomeScreen,
    navigationOptions: ({ }) => ({
      header: null,
    })
  },
  [AppScreens.LOGIN]: {
    screen: LoginScreen,
    navigationOptions: ({ }) => ({
      header: null,
    })
  },
  [AppScreens.HISTORY]: {
    screen: HistoryScreen,
    navigationOptions: ({ }) => ({
      headerBackTitle: null,
      headerTransparent: true,
      headerStyle: {
        elevation: 0,
        borderBottomWidth: 0,
        backgroundColor: 'transparent'
      },
    })
  },
  [AppScreens.DEPOSIT]: {
    screen: DepositScreen,
    navigationOptions: ({ }) => ({ headerBackTitle: null })
  },
  [AppScreens.VIRTUAL_CARD]: {
    screen: VirtualCardScreen,
    navigationOptions: ({ }) => ({
      headerBackTitle: null,
      headerTransparent: true,
      headerStyle: {
        elevation: 0,
        borderBottomWidth: 0,
        backgroundColor: 'transparent'
      },
    })
  },
  [AppScreens.SCANNER]: {
    screen: ScannerScreen,
    navigationOptions: ({ }) => ({ headerBackTitle: null })
  },
  [AppScreens.PAYMENT]: {
    screen: PaymentScreen,
    navigationOptions: ({ }) => ({
      headerBackTitle: null,
      headerTransparent: true,
      headerStyle: {
        elevation: 0,
        borderBottomWidth: 0,
        backgroundColor: 'transparent'
      },
    })
  },
  [AppScreens.CONFIRMATION]: {
    screen: ConfirmationScreen,
    navigationOptions: ({ }) => ({
      headerBackTitle: null,
      headerTransparent: true,
      headerStyle: {
        elevation: 0,
        borderBottomWidth: 0,
        backgroundColor: 'transparent'
      },
    })
  },
  [AppScreens.BOLETO_VALIDATION]: {
    screen: BoletoValidationScreen,
    navigationOptions: ({ }) => ({
      headerBackTitle: null,
      headerTransparent: true,
      headerStyle: {
        elevation: 0,
        borderBottomWidth: 0,
        backgroundColor: 'transparent'
      },
    })
  },
  [AppScreens.BOLETO_EMIT]: {
    screen: BoletoEmitScreen,
    navigationOptions: ({ }) => ({ headerBackTitle: null })
  },
  [AppScreens.BOLETO_EMIT_RESULT]: {
    screen: BoletoEmitResultScreen,
    navigationOptions: ({ }) => ({ headerBackTitle: null })
  },
  [AppScreens.WITHDRAWAL]: {
    screen: WithdrawalScreen,
    navigationOptions: ({ }) => ({ headerBackTitle: null })
  },
  [AppScreens.SETTINGS]: {
    screen: SettingsScreen,
    navigationOptions: ({ }) => ({ headerBackTitle: null })
  },
  [AppScreens.ONBOARDING_BASIC_INFO]: {
    screen: BasicInfoStepScreen,
    navigationOptions: ({ }) => ({ headerBackTitle: null })
  },
  [AppScreens.ONBOARDING_DOCUMENTS]: {
    screen: DocumentsStepScreen,
    navigationOptions: ({ }) => ({ headerBackTitle: null })
  },
  [AppScreens.BANK_SELECT]: {
    screen: BankSelectScreen,
    navigationOptions: ({ }) => ({ headerBackTitle: null })
  },
  [AppScreens.WITHDRAWAL_CONFIRMATION]: {
    screen: WithdrawalConfirmationScreen,
    navigationOptions: ({ }) => ({ headerBackTitle: null })
  }
}, {
    initialRouteName: AppScreens.LOGIN,

    defaultNavigationOptions: {
      headerBackTitle: null,
      headerTransparent: true,
      headerStyle: {
        elevation: 0,
        borderBottomWidth: 0,
        backgroundColor: 'transparent'
      },
      headerTintColor: Config.colors.white,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
  });

// Initialize service instances
// export const bitcapital = Bitcapital.initialize({ session, ...sessionConfig });

// try {
//   // Authenticate in the Bitcapital Platform
//   this.logger.debug("Authenticating in the Bitcapital platform...");
//   await this.bitcapital.session().clientCredentials();
//   this.logger.info("Successfully authenticated in the Bitcapital platform", this.bitcapital.session().current);
// } catch (exception) {
//   this.logger.error(`Could not initialize services: ${exception.message}`);
//   process.exit(-1);
// }


interface AppContainerNavigatorState {
  appState: string;
  lastAppStateChange: Date;
  bitcapital?: Bitcapital;
}

class AppContainerNavigator extends React.Component<any, AppContainerNavigatorState> {
  static router = AppNavigator.router;
  static bitcapital: Bitcapital;
  state: AppContainerNavigatorState = {
    appState: AppState.currentState,
    lastAppStateChange: new Date(),
  }

  async componentDidMount() {
    AppState.addEventListener('change', this.onAppStateChange.bind(this));

    let bitcapital = AppContainerNavigator.bitcapital

    if (!bitcapital) {
      // TODO: Move to safe config
      bitcapital = await BitcapitalService.initialize(Config.bitcapital);
      AppContainerNavigator.bitcapital = bitcapital;
    }

    const current = bitcapital.session().current;

    if (!current) {
      await bitcapital.session().fetch();
    }

    if (current) {
      await bitcapital.session().reload();
    }

    await this.setState({ bitcapital });
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.onAppStateChange.bind(this));
  }

  async onAppStateChange() {
    if (
      AppState.currentState === 'active' && 
      moment(this.state.lastAppStateChange).add(5, 'minutes').isBefore(moment()) &&
      this.state.bitcapital &&
      this.state.bitcapital.session().current
    ) {
      console.log('active');
      await SecureConfirmation.confirm('Confirm your identity'); // TODO: Add i18n in this
      this.setState({ lastAppStateChange: new Date() });
    }
  }

  render() {
    if (this.state.bitcapital) {
      return <AppNavigator {...this.props} />;
    }
    return <View style={{ backgroundColor: Colors.black, flex: 1, height: '100%' }} />
  }
}

export default createAppContainer(AppContainerNavigator);