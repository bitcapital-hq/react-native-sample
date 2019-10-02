import Bitcapital from '@bitcapital/core-sdk';
import moment from 'moment';
import * as React from 'react';
import { Alert, StatusBar } from 'react-native';
import I18n from 'react-native-i18n';
import Spinner from 'react-native-loading-spinner-overlay';
import Ripple from 'react-native-material-ripple';
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationActions, NavigationScreenProps, ScrollView, StackActions } from 'react-navigation';
import styled from 'styled-components/native';
import { AppScreens } from '../../App';
import { Center, DarkLayout, Divider, SmallCard, ScreenTitle } from '../../components';
import Colors from '../../config/Colors';
import { BitcapitalService } from '../../services/Bitcapital';

const InfoText = styled.Text`
	font-size: 18px;
	font-weight: 600;
  margin-right: 15px;
  font-family: 'Lato-Light';
`;

const ConfirmButton = styled(Ripple)`
  background-color: ${Colors.primaryDark}
  margin-bottom: 72px;
  margin-left: 12px;
  margin-right: 12px;
  width: 72px;
  height: 72px;
  align-items: center;
  justify-content: center;
  border-radius: 48px;
  elevation: 1;
  font-family: 'Lato-Light';
`;

const BoletoCard = styled(SmallCard)`
  margin-top: 48px
  margin-bottom: 32px
  margin-left: 32px;
  margin-right: 32px;
  font-family: 'Lato-Light';
`

export interface BoletoValidationScreenProps extends NavigationScreenProps {
}

export interface BoletoValidationScreenState {
  isLoading: boolean;
}

export class BoletoValidationScreen extends React.Component<BoletoValidationScreenProps, BoletoValidationScreenState>  {
  bitCapital: Bitcapital;
  state = {
    isLoading: false,
  };

  async componentDidMount() {
    this.bitCapital = await BitcapitalService.getInstance();
  }

  async componentWillUnmount() {
  }

  async goToHome() {
    const bitcapital = await BitcapitalService.getInstance();
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: AppScreens.HOME,
          params: {
            current: bitcapital.session().current
          }
        })
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }

  async payBoleto() {
    this.setState({ isLoading: true });

    const wallet = this.props.navigation.getParam('wallet');
    const barCode = this.props.navigation.getParam('barCode');
    const boletoInfo = this.props.navigation.getParam('boletoInfo');

    console.log({ boletoInfo })

    try {
      debugger;
      await this.bitCapital.boletos().pay({
        barCode,
        source: wallet.id,
        amount: parseInt(boletoInfo.totalAmount),
        extra: {},
      });

      this.setState({ isLoading: false });

      Alert.alert(
        I18n.t('Success'),
        I18n.t('BoletoValidationScreenSuccessAlert'),
        [
          { text: I18n.t('OK'), onPress: () => this.goToHome() },
        ],
        { cancelable: true },
      );
    } catch (e) {
      console.error(e);
      this.setState({ isLoading: false });
    }
  }

  render() {
    const boletoInfo = this.props.navigation.getParam('boletoInfo');
    return (
      <DarkLayout>
        <Spinner visible={this.state.isLoading} />
        <StatusBar backgroundColor={Colors.black} barStyle="light-content" />
        <ScrollView>
          <ScreenTitle dark={true} title={I18n.t('Pay')} />
          {boletoInfo !== null && (
            <BoletoCard>
              <InfoText numberOfLines={1}> {boletoInfo.traders.recipient} </InfoText>
              <Divider line />
              <InfoText numberOfLines={1}> {boletoInfo.traders.payerName} </InfoText>
              <Divider />
              <InfoText numberOfLines={1}>
                {I18n.t('Amount')}: {`R$${parseInt(boletoInfo.totalAmount).toFixed(2)}`}
              </InfoText>
              <InfoText numberOfLines={1}>
                {I18n.t('ExpirationDate')}: {boletoInfo.expiresAt}
              </InfoText>
            </BoletoCard>
          )}
          <Center style={{ marginTop: 16 }}>
            <ConfirmButton
              onPress={() => this.payBoleto()}
              style={{ backgroundColor: Colors.primaryDark }}>
              <MaterialIcons name="check" size={36} color={Colors.white} />
            </ConfirmButton>
          </Center>
        </ScrollView>
      </DarkLayout>
    );
  }
}