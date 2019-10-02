import * as React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import { NavigationActions, NavigationScreenProps, ScrollView, StackActions } from 'react-navigation';
import styled from 'styled-components/native';
import { AppScreens } from '../../App';
import { Container, ScreenTitle, BigCard, GoBackButton, DarkLayout} from '../../components';
import { BitcapitalService } from '../../services/Bitcapital';
import I18n from 'react-native-i18n';
import { BoletoSchema } from '@bitcapital/base-sdk';
import moment from 'moment';
import Toast from 'react-native-easy-toast';
import { Clipboard, TouchableOpacity, Dimensions } from 'react-native';

const InfoText = styled.Text`
	font-size: 18px;
	font-weight: 600;
	margin-right: 15px;
`;

export interface BoletoEmitResultScreenProps extends NavigationScreenProps {
}

export interface BoletoEmitResultScreenState {
  isLoading: boolean;
}

export class BoletoEmitResultScreen extends React.Component<BoletoEmitResultScreenProps, BoletoEmitResultScreenState>  {
  state = {
    isLoading: false,
  };

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

  onCopyBarCode(barCode: string) {
    const toast: Toast = this.refs.toast as any;
    Clipboard.setString(barCode);
    toast.show(I18n.t('CopiedToClipboard'));
  }

  render() {
    const boleto: BoletoSchema = this.props.navigation.getParam('boleto');
    return (
      <DarkLayout>
        <Spinner visible={this.state.isLoading} />
        <Toast ref="toast" {...{ positionValue: Dimensions.get('window').height }} />
        <ScrollView>
          <ScreenTitle
            title={I18n.t('BoletoEmitResultScreenTitle')}
            description={I18n.t('BoletoEmitResultScreenDescription')}
            dark={true} />
          <Container>
            { boleto !== null && 
              [
                <BigCard>
                  <InfoText> {I18n.t('Amount')}: R${parseInt(boleto.amount).toFixed(2)} </InfoText>
                </BigCard>,
                <TouchableOpacity onPress={() => this.onCopyBarCode(boleto.digitableLine)}>
                  <BigCard>
                    <InfoText> {I18n.t('BarCode')}: {boleto.digitableLine} </InfoText>
                  </BigCard>
                </TouchableOpacity>,
                <BigCard>
                  <InfoText> {I18n.t('ExpirationDate')}: {moment(boleto.expiresAt).format('DD/MM/YYYY')} </InfoText>
                </BigCard>,
              ]
            }
          </Container>
          <GoBackButton
            title={I18n.t('GoBack')}
            onPress={() => this.goToHome()} />
        </ScrollView>
      </DarkLayout>
    );
  }
}