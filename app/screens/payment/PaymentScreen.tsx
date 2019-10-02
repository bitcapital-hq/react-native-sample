import Bitcapital from '@bitcapital/core-sdk';
import IsUUID from 'is-uuid';
import * as React from 'react';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { Alert, Clipboard, Dimensions, TouchableOpacity, StatusBar } from 'react-native';
import Toast from 'react-native-easy-toast';
import I18n from 'react-native-i18n';
import Spinner from 'react-native-loading-spinner-overlay';
import Ripple from 'react-native-material-ripple';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { NavigationScreenProps, ScrollView } from 'react-navigation';
import styled from 'styled-components/native';
import { AppScreens } from '../../App';
import { BaseCard, Center, DarkLayout, Row, ScreenTitle } from '../../components';
import Colors from '../../config/Colors';

const PaymentInputContainer = styled(Row)`
  padding: 32px;
  margin-top: 32px;
`;

const PaymentInput = styled.TextInput`
  flex: 1;
  border-bottom-width: 2px;
  border-bottom-color: ${Colors.gray}
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 16px;
  padding-right: 16px;
  color: ${Colors.white};
  font-size: 16px;
  font-family: 'Lato';
`;

const CaptureButton = styled(BaseCard)`
  margin: 8px;
  padding: 8px;
  elevation: 8;
  border-radius: 32;
  border-width: 0;
`;

const ContinueButton = styled(Ripple)`
  background-color: ${Colors.primaryDark}
  margin-top: 64px;
  margin-bottom: 72px;
  margin-left: 12px;
  margin-right: 12px;
  width: 72px;
  height: 72px;
  align-items: center;
  justify-content: center;
  border-radius: 48px;
  elevation: 1;
`;

export interface PaymentScreenProps extends NavigationScreenProps {
}

export interface PaymentScreenState {
  text: string,
  isLoading: boolean;
}

export class PaymentScreen extends React.Component<PaymentScreenProps, PaymentScreenState> {
  bitcapital: Bitcapital;
  state = {
    isLoading: false,
    text: ''
  };

  openScanner() {
    this.props.navigation.navigate(AppScreens.SCANNER, {
      wallet: this.props.navigation.getParam('wallet'),
      onException: exception => this.onException(exception),
      onConfirm: async result => {
        await this.setState({ text: result });
        return this.parseInputCode();
      },
    });
  }

  async componentDidMount() {
    this.bitcapital = await Bitcapital.getInstance();
    const clipboard = await Clipboard.getString();

    if (clipboard && IsUUID.v4(clipboard)) {
      // Auto recognize wallet id from clipboard
      await this.setState({ text: clipboard });
    } else if(clipboard && clipboard.replace(/\./g, '').replace(/\ /g, '').length === 47) {
      // Auto boleto id from clipboard
      await this.setState({ text: clipboard });
    }
  }

  async onConfirm(result) {
    setTimeout(() => {
      // Works on both iOS and Android
      Alert.alert(
        I18n.t('Success'),
        I18n.t('ConfirmationScreenSuccessAlert'),
        [
          {
            text: I18n.t('OK'),
            onPress: () => {
              const onConfirm = this.props.navigation.getParam('onConfirm');

              if (onConfirm) {
                onConfirm(result);
              }

              // this.props.navigation.goBack()
            }
          },
        ],
        { cancelable: false },
      );
    }, 150);
  }

  async onException(exception: Error) {
    let msg;
    console.log(exception);
    const response = exception['response'] || {};

    if (response.data && response.data.message) {
      msg = response.data.message;
    } else if (response && response.message) {
      msg = response.message;
    } else if (exception.message) {
      msg = exception.message;
    } else {
      msg = exception || 'Unknown error';
    }

    setTimeout(() => {
      // Works on both iOS and Android
      Alert.alert(
        'Ops',
        msg,
        [
          { text: I18n.t('OK') },
        ],
        {
          cancelable: false,
        },
      );
    }, 150);
  }

  async parseInputCode() {
    ReactNativeHapticFeedback.trigger("impactLight", {
      enableVibrateFallback: false,
      ignoreAndroidSystemSettings: false
    });

    await this.setState({ isLoading: true });

    setTimeout(() => {
      const isWalletId = IsUUID.v4(this.state.text);
      console.log(isWalletId, this.state.text);

      if (isWalletId) {
        this.goToConfirmationScreen();
      } else {
        this.goToBoletoValidation();
      }
    }, 150);
  }

  async goToConfirmationScreen() {
    const walletId = this.state.text;
    try {
      const info = await this.bitcapital.wallets().findOne(walletId);
      this.setState({ isLoading: false });

      this.props.navigation.navigate(AppScreens.CONFIRMATION, {
        source: this.props.navigation.getParam('wallet'),
        destination: info,
        onConfirm: result => this.onConfirm(result),
        onException: exception => this.onException(exception),
      });
    } catch (e) {
      this.setState({ isLoading: false });
      const toast: Toast = this.refs.toast as any;
      console.log(e);
      if (e.response && e.response.status === 400) {
        toast.show(I18n.t('InvalidBarCode'));
      } else {
        toast.show(I18n.t('Error'));
      }
    }
  }

  async goToBoletoValidation() {
    const barCode = this.state.text;
    try {
      const info = await this.bitcapital.boletos().getPaymentInfo(barCode);
      this.setState({ isLoading: false });

      this.props.navigation.navigate(AppScreens.BOLETO_VALIDATION, {
        barCode,
        wallet: this.props.navigation.getParam('wallet'),
        boletoInfo: info['boletoNPCInfo'],
      });
    } catch (e) {
      this.setState({ isLoading: false });
      const toast: Toast = this.refs.toast as any;
      if (e.response && e.response.status === 400) {
        toast.show(I18n.t('InvalidBarCode'));
      } else {
        toast.show(I18n.t('Error'));
      }
    }
  }

  render() {
    const isDisabled = !this.state.text || !this.state.text.length;

    return (
      <DarkLayout>
        <Spinner visible={this.state.isLoading} />
        <Toast ref="toast" {...{ positionValue: Dimensions.get('window').height }} />
        <StatusBar backgroundColor={Colors.black} barStyle="light-content" />
        <ScrollView>
          <ScreenTitle
            dark={true}
            title={I18n.t('PaymentScreenTitle')}
            description={I18n.t('PaymentScreenDescription')} />
          <PaymentInputContainer>
            <PaymentInput
              placeholder={I18n.t('PaymentInputPlaceholder')}
              autoCapitalize="none"
              textContentType="none"
              placeholderTextColor={Colors.gray}
              value={this.state.text}
              onChangeText={text => this.setState({ text })} />
            <TouchableOpacity onPress={() => this.openScanner()}>
              <CaptureButton>
                <MaterialIcon name="camera-alt" size={22} color={Colors.primaryDark} />
              </CaptureButton>
            </TouchableOpacity>
          </PaymentInputContainer>
          <Center>
            <ContinueButton
              style={{ backgroundColor: isDisabled ? Colors.gray : Colors.primaryDark }}
              onPress={() => this.parseInputCode()} disabled={isDisabled}>
              <MaterialIcons
                size={36}
                name="arrow-right"
                color={Colors.white} />
            </ContinueButton>
          </Center>
        </ScrollView>
      </DarkLayout>
    );
  }
}