import { Wallet } from '@bitcapital/base-sdk';
import * as React from 'react';
import { StatusBar } from 'react-native';
import Biometrics from 'react-native-biometrics';
import Spinner from 'react-native-loading-spinner-overlay';
import Ripple from 'react-native-material-ripple';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationScreenProps } from 'react-navigation';
import styled from 'styled-components/native';
import { Center, Col, DarkLayout, Keypad, ScreenTitle } from '../../components';
import * as Config from '../../config';
import Colors from '../../config/Colors';
import { BitcapitalService } from '../../services/Bitcapital';
import { SecureConfirmation } from '../../services/SecureConfirmation';

const ConfirmButton = styled(Ripple)`
  background-color: ${Config.colors.primaryDark}
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

export interface ConfirmationScreenProps extends NavigationScreenProps {

}

export interface ConfirmationScreenState {
  amount?: number;
  isLoading: boolean;
  destination?: Wallet;
  biometryType?: string;
}

export class ConfirmationScreen extends React.Component<ConfirmationScreenProps, ConfirmationScreenState> {
  state: ConfirmationScreenState = { isLoading: false };

  async componentDidMount() {
    const biometryType = await Biometrics.isSensorAvailable()
    console.log({ biometryType })
    await this.setState({ biometryType });
  }

  async onConfirm(response) {
    const onConfirm = this.props.navigation.getParam('onConfirm');

    if (onConfirm) {
      onConfirm(response);
    }

    this.props.navigation.goBack();
  }

  async onException(exception) {
    const onException = this.props.navigation.getParam('onException');

    if (onException) {
      onException(exception);
    }

    this.props.navigation.goBack();
  }

  async confirm() {
    if (this.state.biometryType) {
      try {
        await SecureConfirmation.confirm('Confirm your payment');
      } catch (exception) {
        console.log(exception);
      }
    }

    const wallet = this.props.navigation.getParam('source');
    const destination = this.props.navigation.getParam('destination');
    const bitcapital = await BitcapitalService.getInstance();

    await this.setState({ isLoading: true });

    try {
      const result = await bitcapital.payments().pay({
        source: wallet.id,
        recipients: [{
          asset: 'BRLD',
          destination: destination.id || destination,
          amount: this.state.amount.toFixed(2),
        }]
      })

      await this.setState({ isLoading: false });
      return this.onConfirm(result);
    } catch (exception) {
      await this.setState({ isLoading: false });
      return this.onException(exception);
    }
  }

  render() {
    const source = this.props.navigation.getParam('source');
    const destination = this.props.navigation.getParam('destination');
    const firstName = destination ? (
      `${destination.user.firstName[0].toUpperCase()}${destination.user.firstName.substring(1).toLowerCase()}`
    ) : undefined;

    const isDisabled = this.state.amount === 0.00;

    return (
      <DarkLayout>
        <Spinner visible={this.state.isLoading} />
        <StatusBar backgroundColor={Colors.black} barStyle="light-content" />
        <Col>
          <ScreenTitle
            dark={true}
            title="Payments" />
          <Keypad
            dark
            decimalPlaces={2}
            value={this.state.amount}
            onCancel={() => this.props.navigation.goBack()}
            onValueChange={(amount) => this.setState({ amount })}
            display={{
              asset: source.assets.find(a => a.code === 'BRLD'),
              prefix: firstName ? 'Send  ' : undefined,
              suffix: firstName ? ` to ${firstName}` : undefined,
            }} />
          <Center style={{ marginTop: 16 }}>
            <ConfirmButton
              onPress={() => this.confirm()}
              style={{ backgroundColor: isDisabled ? Colors.gray : Colors.primaryDark }}>
              <MaterialIcons
                size={36}
                color={Config.colors.white}
                name={this.state.biometryType ? 'fingerprint' : 'check'} />
            </ConfirmButton>
          </Center>
        </Col>
      </DarkLayout>
    );
  }
}