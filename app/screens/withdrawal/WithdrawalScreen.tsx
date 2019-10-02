import Bitcapital, { AccountType } from '@bitcapital/core-sdk';
import * as React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import I18n from 'react-native-i18n';
import { Text, Alert, Picker, Button } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { TextInputMask } from 'react-native-masked-text';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions, NavigationScreenProps, ScrollView, StackActions } from 'react-navigation';
import styled from 'styled-components/native';
import { AppScreens } from '../../App';
import { Center, Container, GoBackButton, ScreenTitle, SmallCard, Row, DarkLayout, CPFInput } from '../../components';
import * as Config from '../../config';
import { BitcapitalService } from '../../services/Bitcapital';
import { SecureConfirmation } from '../../services/SecureConfirmation';
import Toast from 'react-native-easy-toast';

const AuxiliaryButton = styled(TouchableOpacity)`
  color: ${Config.colors.white};
  margin: 15px;
  margin-left: 0;
  width: auto;
`;

const WhiteInputMask = styled(TextInputMask)`
  border-bottom-width: 1px;
  margin-top: 8px;
  margin-bottom: 8px;
  padding: 8px;
  color: ${Config.colors.white};
`;

const AuxiliaryButtonLabel = styled.Text`
  width: auto;
  color: ${Config.colors.white};
  text-align: left;
`;

const AuxiliaryCenterButtonLabel = styled.Text`
  width: auto;
  color: ${Config.colors.white};
  text-align: center;
`;

const WithdrawPickerContainer = styled.View`
  border-bottom-width: 1px;
  margin-bottom: 16px;
  padding: 5px;
`;

const WithdrawalInput = styled.TextInput`
  border-bottom-width: 1px;
  margin-top: 8px;
  margin-bottom: 8px;
  padding: 8px;
  color: ${Config.colors.white};
`;

const NumericInput = styled(TextInputMask)`
  font-size: 32px;
`;

const ConfirmButton = styled(SmallCard)`
  background-color: ${Config.colors.primary};
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

export interface WithdrawalScreenProps extends NavigationScreenProps {
}

export interface WithdrawalScreenState {
  bankCode: string;
  agency: string;
  agencyDigit: string;
  account: string;
  accountDigit: string;
  name: string;
  taxId: string;
  accountType: AccountType;
  isLoading: boolean;
}

export class WithdrawalScreen extends React.Component<WithdrawalScreenProps, WithdrawalScreenState> {
  bitcapital: Bitcapital;
  state = {
    isLoading: false,
    bankCode: '',
    agency: '',
    agencyDigit: '',
    account: '',
    accountDigit: '',
    name: '',
    taxId: '',
    accountType: AccountType.PERSONAL,
  };

  async componentDidMount() {
    this.bitcapital = await BitcapitalService.getInstance();

  }

  async goToHome() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: AppScreens.HOME,
          params: {
            current: this.bitcapital.session().current
          }
        })
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }

  async goToBankSelect() {
    this.props.navigation.navigate(AppScreens.BANK_SELECT, {
      onSelect: (bankCode) => this.onBankSelect(bankCode),
    })
  }

  async onBankSelect(bankCode: string) {
    this.setState({ bankCode });
  }

  async onConfirm(result?) {
    setTimeout(() => Alert.alert(
      I18n.t('TransactionExecuted'),
      I18n.t('TransactionExecutedFull'),
      [{ text: I18n.t('OK'), onPress: () => true }]
    ), 150);
    await this.goToHome();
  }

  async onException(e) {
    Alert.alert(
      I18n.t('SomethingWentWrong'),
      I18n.t('WithdrawalError'),
      [{ text: I18n.t('OK'), onPress: () => true }]
    );

    console.error(e);
  }

  async goToConfirmationScreen() {
    try {
      this.props.navigation.navigate(AppScreens.WITHDRAWAL_CONFIRMATION, {
        info: {
          bankCode: this.state.bankCode,
          agency: this.state.agency,
          agencyDigit: this.state.agencyDigit,
          account: this.state.account,
          accountDigit: this.state.accountDigit,
          name: this.state.name,
          taxId: this.state.taxId.replace(/(\.|\-|\/)/g, ''),
          accountType: this.state.accountType,
        },
        onConfirm: result => this.onConfirm(result),
        onException: exception => this.onException(exception),
        walletId: this.props.navigation.getParam('wallet').id,
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

  render() {
    return (
      <DarkLayout>
        <Spinner visible={this.state.isLoading} />
        <ScrollView>
          <ScreenTitle
            dark={true}
            title={I18n.t('WithdrawalScreenTitle')}
            description={I18n.t('WithdrawalScreenDescription')} />
          <Container>
            <WithdrawPickerContainer>
              <AuxiliaryButton onPress={() => this.goToBankSelect()}>
                <AuxiliaryButtonLabel>{
                  this.state.bankCode === '' ? 
                    I18n.t('WithdrawalScreenPickABank') : 
                    `${this.state.bankCode} - ${Config.banks.find(item => item.Número_Código == this.state.bankCode).Nome_Reduzido}`
                }</AuxiliaryButtonLabel>
              </AuxiliaryButton>
            </WithdrawPickerContainer>
            <Row>
              <WithdrawalInput
                style={{ flex: 3 }}
                placeholder={I18n.t('Agency')}
                placeholderTextColor={Config.colors.white}
                autoCapitalize="none"
                textContentType="none"
                keyboardType="numeric"
                value={this.state.agency}
                onChangeText={text => this.setState({ agency: text })} />
              <Text style={{color: Config.colors.white, marginTop: 15}}>-</Text>
              <WithdrawalInput
                style={{ flex: 1 }}
                placeholder={I18n.t('AgencyDigit')}
                placeholderTextColor={Config.colors.white}
                autoCapitalize="none"
                textContentType="none"
                keyboardType="numeric"
                value={this.state.agencyDigit}
                onChangeText={text => this.setState({ agencyDigit: text })} />
            </Row>
            <Row>
              <WithdrawalInput
                style={{ flex: 3 }}
                placeholder={I18n.t('Account')}
                placeholderTextColor={Config.colors.white}
                autoCapitalize="none"
                textContentType="none"
                keyboardType="numeric"
                value={this.state.account}
                onChangeText={text => this.setState({ account: text })} />
              <Text style={{color: Config.colors.white, marginTop: 15}}>-</Text>
              <WithdrawalInput
                style={{ flex: 1 }}
                placeholder={I18n.t('AccountDigit')}
                placeholderTextColor={Config.colors.white}
                autoCapitalize="none"
                textContentType="none"
                keyboardType="numeric"
                value={this.state.accountDigit}
                onChangeText={text => this.setState({ accountDigit: text })} />
            </Row>
            <WithdrawalInput
              placeholder={I18n.t('Name')}
              placeholderTextColor={Config.colors.white}
              autoCapitalize="none"
              textContentType="name"
              keyboardType="default"
              value={this.state.name}
              onChangeText={text => this.setState({ name: text })} />

            <WithdrawalInput
              placeholder={I18n.t('TaxId')}
              placeholderTextColor={Config.colors.white}
              autoCapitalize="none"
              textContentType="none"
              keyboardType="numeric"
              value={this.state.taxId}
              onChangeText={text => this.setState({ taxId: text })} />

            <Picker
              selectedValue={this.state.accountType}
              onValueChange={(itemValue) =>
                this.setState({ accountType: itemValue })
              }>
              {Object.keys(AccountType).map(key => <Picker.Item label={key} color={Config.colors.white} value={AccountType[key]} />)}
            </Picker>
            <Center>
              <GoBackButton
                title={I18n.t('Cancel')}
                onPress={() => this.props.navigation.goBack()} />
              <Button
                title="Next"
                onPress={() => this.goToConfirmationScreen()} />
            </Center>
          </Container>
        </ScrollView>
      </DarkLayout>
    );
  }
}