import Bitcapital from '@bitcapital/core-sdk';
import * as React from 'react';
import I18n from 'react-native-i18n';
import Spinner from 'react-native-loading-spinner-overlay';
import { NavigationScreenProps, ScrollView, FlatList } from 'react-navigation';
import styled from 'styled-components/native';
import { AppScreens } from '../../App';
import { Container, ScreenTitle, DarkLayout } from '../../components';
import * as Config from '../../config';
import { BitcapitalService } from '../../services/Bitcapital';
import unidecode from 'unidecode';

const BankSelectInput = styled.TextInput`
  padding: 10px;
  margin-bottom: 20px;
  color: ${Config.colors.white};
`;

const BankItem = styled.TouchableOpacity`
  width: auto;
  text-align: left;
  font-family: 'Lato-Light';
  font-size: 15px;
`;

const BankItemText = styled.Text`
  border-bottom-width: 1px;
  margin-bottom: 16px;
  padding: 8px;
  color: ${Config.colors.white};
`;

export interface BankSelectScreenProps extends NavigationScreenProps {
}

export interface BankSelectScreenState {
  isLoading: boolean;
  search: string;
  data: any[];
}

export class BankSelectScreen extends React.Component<BankSelectScreenProps, BankSelectScreenState> {
  bitcapital: Bitcapital;
  state = {
    isLoading: false,
    search: '',
    data: Config.banks,
  };

  async componentDidMount() {
    this.bitcapital = await BitcapitalService.getInstance();
  }

  onSearch(searchText: string) {
    if (searchText === '') {
      return this.setState({
        search: searchText,
        data: Config.banks,
      });
    }

    const filtered = Config.banks.filter(bank => {
      // TODO: Replace with something way faster
      return (
        bank.Número_Código.toString().indexOf(searchText) > -1 ||
        unidecode(bank.Nome_Extenso.toLowerCase()).indexOf(unidecode(searchText.toLowerCase())) > -1
      );
    });

    this.setState({
      search: searchText,
      data: filtered,
    });
  }

  onSelectItem(bankCode: number|string) {
    this.props.navigation.goBack();
    this.props.navigation.getParam('onSelect')(bankCode);
  }

  renderItem(item: (typeof Config.banks)[0]) {
    return (
      <BankItem onPress={() => this.onSelectItem(item.Número_Código)}>
        <BankItemText>{item.Número_Código} - {item.Nome_Extenso}</BankItemText>
      </BankItem>
    )
  }

  render() {
    return (
      <DarkLayout>
        <Spinner visible={this.state.isLoading} />
        <ScreenTitle
          dark={true}
          title={I18n.t('WithdrawalScreenTitle')}
          description={I18n.t('WithdrawalScreenDescription')} />
        <BankSelectInput
          placeholder="Search by bank name or code"
          placeholderTextColor={Config.colors.gray}
          onChangeText={(search) => this.onSearch(search) } />
        <ScrollView>
          <FlatList
            data={this.state.data}
            renderItem={({item}) => this.renderItem(item)} />
        </ScrollView>
      </DarkLayout>
    );
  }
}