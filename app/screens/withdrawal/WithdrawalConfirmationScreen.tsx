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
import { AccountType } from '@bitcapital/core-sdk';

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

export interface WithdrawalConfirmationScreenProps extends NavigationScreenProps {
  bankCode: string;
  agency: string;
  agencyDigit: string;
  account: string;
  accountDigit: string;
  name: string;
  taxId: string;
  accountType: AccountType;
}

export interface WithdrawalConfirmationScreenState {
  isLoading: boolean;
  biometryType?: string;

  amount?: number;
}

export class WithdrawalConfirmationScreen extends React.Component<WithdrawalConfirmationScreenProps, WithdrawalConfirmationScreenState> {
  state: WithdrawalConfirmationScreenState = { isLoading: false };

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

    const walletId = this.props.navigation.getParam('walletId');
    const withdrawalInfo = this.props.navigation.getParam('info');

    const bitcapital = await BitcapitalService.getInstance();

    await this.setState({ isLoading: true });

    try {
      const result = await bitcapital.wallets().withdraw(walletId, {
        amount: this.state.amount,
        bank: {
          holderType: withdrawalInfo.accountType,
          name: withdrawalInfo.name,
          taxId: withdrawalInfo.taxId,
          agency: withdrawalInfo.agency,
          agencyDigit: withdrawalInfo.agencyDigit,
          account: withdrawalInfo.account,
          accountDigit: withdrawalInfo.accountDigit,
          bank: withdrawalInfo.bankCode,
        }
      });

      await this.setState({ isLoading: false });
      return this.onConfirm(result);
    } catch (exception) {
      await this.setState({ isLoading: false });
      return this.onException(exception);
    }
  }

  render() {
    const isDisabled = this.state.amount === 0.00;

    return (
      <DarkLayout>
        <Spinner visible={this.state.isLoading} />
        <StatusBar backgroundColor={Colors.black} barStyle="light-content" />
        <Col>
          <ScreenTitle
            dark={true}
            title="Confirm" />
          <Keypad
            dark
            decimalPlaces={2}
            value={this.state.amount}
            onCancel={() => this.props.navigation.goBack()}
            onValueChange={(amount) => this.setState({ amount })}
            display={{
              asset: {
                code: 'BRLD',
              },
              prefix: 'Send  ',
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