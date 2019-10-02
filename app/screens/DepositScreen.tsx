
import Bitcapital from '@bitcapital/core-sdk';
import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import I18n from 'react-native-i18n';
import Spinner from 'react-native-loading-spinner-overlay';
import styled from 'styled-components/native';
import { BigCard, DarkLayout, ScreenTitle } from '../components';
import Colors from '../config/Colors';
import { BitcapitalService } from '../services/Bitcapital';

const InfoText = styled.Text`
	font-size: 18px;
  margin-right: 15px;
  font-family: 'Lato-Light';
`;

const BankingInfo = styled(BigCard)``;

interface DepositScreenProps { }

interface DepositScreenState {
  depositInfo?: DepositInfo;
  isLoading: boolean;
}

interface DepositInfo {
  taxId: string;
  externalId: string;
  bank: Bank;
  account: Account;
  name: string; // TODO: Add deposit name
}

interface Account {
  agency: string;
  number: string;
  digit: string;
}

interface Bank {
  code: string;
  name: string;
}

export class DepositScreen extends Component<DepositScreenProps, DepositScreenState> {
  private bitcapital: Bitcapital;
  state = { depositInfo: null, isLoading: true };

  async componentDidMount() {
    this.bitcapital = await BitcapitalService.getInstance();
    const user = this.bitcapital.session().current;
    const depositInfo: DepositInfo = await this.bitcapital.wallets().getDepositInfo(user.wallets[0].id); // TODO: Check if user has wallet before doing this
    this.setState({ depositInfo, isLoading: false });
  }

  render() {
    return (
      <DarkLayout>
        <Spinner visible={this.state.isLoading} />
        <StatusBar backgroundColor={Colors.black} barStyle="light-content" />
        <ScrollView>
          <ScreenTitle
            dark={true}
            title={I18n.t('DepositScreenTitle')}
            description={I18n.t('DepositScreenDescription')} />
          {this.state.depositInfo &&
            <BankingInfo>
              <InfoText>{this.state.depositInfo.name }</InfoText>
              <InfoText>{this.state.depositInfo.bank.name} ({this.state.depositInfo.bank.code})</InfoText>
              <InfoText>{I18n.t('Agency')}: {this.state.depositInfo.account.agency}</InfoText>
              <InfoText>{I18n.t('Account')}: {this.state.depositInfo.account.number}-{this.state.depositInfo.account.digit}</InfoText>
              <InfoText>{I18n.t('TaxId')}: {this.state.depositInfo.taxId}</InfoText>
            </BankingInfo>
          }
        </ScrollView>
      </DarkLayout>
    );
  }
}
