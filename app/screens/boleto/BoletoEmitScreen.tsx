import Bitcapital from '@bitcapital/core-sdk';
import * as React from 'react';
import { NavigationScreenProps, ScrollView } from 'react-navigation';
import styled from 'styled-components/native';
import Spinner from 'react-native-loading-spinner-overlay';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { AppScreens } from '../../App';
import { Container, Layout, ScreenTitle, SmallCard, GoBackButton, Center, DarkLayout } from '../../components';
import { BitcapitalService } from '../../services/Bitcapital';
import { TextInputMask } from 'react-native-masked-text';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Config from '../../config';
import { Text, KeyboardAvoidingView } from 'react-native';
import I18n from 'react-native-i18n';
import moment from 'moment';

const NumericInput = styled(TextInputMask)`
  margin: 8px;
  font-size: 32px;
`;

const DatePickerTextMask = styled(TextInputMask)`
  font-size: 20px;
  margin: 8px;
  color: ${Config.colors.white};
`;

const ConfirmButton = styled(SmallCard)`
  background-color: ${Config.colors.info}
  margin-top: 20px;
  margin-bottom: 96px;
  margin-left: 12px;
  margin-right: 12px;
  width: 96px;
  height: 96px;
  align-items: center;
  justify-content: center;
  border-radius: 48px;
  elevation: 1;
`;

export interface BoletoEmitScreenProps extends NavigationScreenProps {
}

export interface BoletoEmitScreenState {
  amount: string;
  expiresAt: string;
  isLoading: boolean;
}

export class BoletoEmitScreen extends React.Component<BoletoEmitScreenProps, BoletoEmitScreenState> {
  bitcapital: Bitcapital;
  state = {
    isLoading: false,
    expiresAt: moment().format('DD-MM-YYYY'),
    amount: '0',
  };

  async componentDidMount() {
    this.bitcapital = await BitcapitalService.getInstance();
    
  }

  async onEmit() {
    this.setState({ isLoading: true });
    const wallet = this.props.navigation.getParam('wallet');
    const boleto = await this.bitcapital.boletos().emit({
      /// @ts-ignore
      amount: this.state.amount,
      destination: wallet.id,
      extra: {
        expiresAt: moment(this.state.expiresAt, 'DD-MM-YYYY').toDate().toISOString(),
      }
    });

    this.setState({ isLoading: false });
    this.props.navigation.navigate(AppScreens.BOLETO_EMIT_RESULT, { boleto: boleto });
  }

  render() {
    return (
      <DarkLayout>
        <Spinner visible={this.state.isLoading} />
        <ScrollView>
          <ScreenTitle
            dark={true}
            title={I18n.t('BoletoEmitScreenTitle')}
            description={I18n.t('BoletoEmitScreenDescription')} />
          <KeyboardAvoidingView>
            <Center>
              <Text style={{color: Config.colors.white }}>{I18n.t('BoletoEmitScreenDatePlaceholder')}</Text>
              <DatePickerTextMask
                type="custom"
                options={{
                  mask: '99-99-9999',
                }}
                value={this.state.expiresAt}
                onChangeText={date => this.setState({ expiresAt: date })} />
              <NumericInput
                type={'money'}
                value={this.state.amount}
                style={{color: Config.colors.white}}
                autoFocus={true}
                options={{ unit: 'R$  ', suffixUnit: '', separator: '.' }}
                keyboardType="decimal-pad"
                onChangeText={amount => this.setState({ amount: amount.substr(3) })} />
              <GoBackButton
                title={I18n.t('Cancel')}
                onPress={() => this.props.navigation.goBack()} />
              <TouchableOpacity
                onPress={() => this.onEmit()}>
                <ConfirmButton>
                  <MaterialIcons name="check" size={36} color={Config.colors.primary} />
                </ConfirmButton>
              </TouchableOpacity>
            </Center>
          </KeyboardAvoidingView>
        </ScrollView>
      </DarkLayout>
    );
  }
}