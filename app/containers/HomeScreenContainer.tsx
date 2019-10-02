import { Asset, Transaction, User, Wallet } from '@bitcapital/base-sdk';
import * as React from 'react';
import { Animated, Clipboard, Dimensions, Linking } from 'react-native';
import I18n from 'react-native-i18n';
import Ripple from 'react-native-material-ripple';
import QRCode from 'react-native-qrcode-svg';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { NavigationScreenProp } from 'react-navigation';
import styled from 'styled-components/native';
import { AppScreens } from '../App';
import { BigCard, Col, Container, HistoryOverview, HomeAvatar, HomeButtonIcon, RoundedButton, Row, SmallCard, CreditCardEntry } from '../components';
import * as Config from '../config';
import Colors from '../config/Colors';
import { BitcapitalService } from '../services/Bitcapital';
import Toast from 'react-native-easy-toast';

const DepositButton = styled.View`
  align-items: center;
  align-content: center;
  justify-content: center;
`;

const TotalText = styled.Text`
  font-size: 16px;
  text-align: right;
  font-family: 'Lato-Light'
  color: ${Config.colors.white};
`;

const MoneyText = styled.Text`
  font-size: 36px;
  text-align: right;
  font-family: 'Lato'
  color: ${Config.colors.white};
`;

const HelpButton = styled(RoundedButton)`
  color: ${Colors.warn}
  border-color: ${Colors.warn}
`;

const SettingsButton = styled(RoundedButton)`
  color: ${Colors.white}
  border-color: ${Colors.white}
`;

const LogoutButton = styled(RoundedButton)`
  color: ${Colors.white}
  border-color: ${Colors.white}
`;

export interface HomeScreenContainerProps {
  current?: User;
  wallet?: Wallet;
  asset?: Asset;
  history?: Transaction[];
  pan: Animated.ValueXY;
  items: JSX.Element[];
  showOptions: boolean;
  navigation: NavigationScreenProp<any>;
  onToggleOptions: () => void;
  openDepositScreen: () => void;
  openHistoryScreen: () => void;
}

export interface HomeScreenContainerState {

}

export class HomeScreenContainer extends React.Component<HomeScreenContainerProps, HomeScreenContainerState> {
  protected async onLogout() {
    const bitcapital = await BitcapitalService.getInstance();

    await bitcapital.session().destroy();
  }

  protected async onHelp() {
    await Linking.openURL(Config.links.help);
  }

  copyNumber(cardNumber: string) {
    const toast: Toast = this.refs.toast as any;
    Clipboard.setString(cardNumber);
    toast.show(I18n.t('CopiedToClipboard'));
  }

  public onSettings(): void {
    this.props.navigation.navigate(AppScreens.SETTINGS);
  }

  renderItems() {
    let balance = '...';
    const { showOptions, wallet, history, asset } = this.props;
    const payload = wallet ? wallet.id : undefined;

    if (asset) {
      balance = (+asset.balance || 0).toFixed(2);
    }

    return (
      <>
        <Toast ref="toast" {...{ positionValue: Dimensions.get('window').height }} />
        {showOptions ? <>
          <Row style={{ justifyContent: 'center', marginBottom: 32 }}>
            <CreditCardEntry
              label={null}
              icon="content-copy"
              value={payload}
              textStyle={{ fontSize: 12 }}
              onPress={() => this.copyNumber(payload)} />
          </Row>
          <Row style={{ justifyContent: 'center' }}>
            {payload ?
              <SmallCard style={{ marginBottom: 32 }}>
                <QRCode
                  size={200}
                  logoSize={54}
                  value={payload} />
              </SmallCard>
              : null}
          </Row>
          <HelpButton title={I18n.t('NeedHelp')} onPress={() => this.onHelp()} />
          <SettingsButton title={I18n.t('Settings')} onPress={() => this.onSettings()} />
          <LogoutButton title={I18n.t('Logout')} onPress={() => this.onLogout()} />
        </> : null}

        <Animated.View style={{ transform: this.props.pan.getTranslateTransform() }}>
          <BigCard style={{ backgroundColor: Colors.grayDarker, paddingHorizontal: 0, paddingVertical: 0 }}>
            <Ripple onPress={() => this.props.openDepositScreen()}>
              <Row style={{ alignItems: 'center', margin: 8 }}>
                <DepositButton>
                  <HomeButtonIcon
                    size={64}
                    iconClass={MaterialIcons}
                    name="add-circle-outline" />
                </DepositButton>
                <Col>
                  <TotalText>{I18n.t('BALANCE')}</TotalText>
                  <MoneyText>R$ {balance}</MoneyText>
                </Col>
              </Row>
            </Ripple>
          </BigCard>

          <HistoryOverview
            viewMore={true}
            source={wallet}
            onPress={() => this.props.openHistoryScreen()}
            title={I18n.t('LatestTransactions')}
            history={(history || []).slice(0, 5)} />

          {wallet ? this.props.items : null}
        </Animated.View>
      </>
    )
  }

  render() {
    const { current, showOptions } = this.props;

    return (
      <>
        <Ripple onPress={() => this.props.onToggleOptions()}>
          <Container>
            <HomeAvatar current={current} showOptions={showOptions} />
          </Container>
        </Ripple>
        {this.renderItems()}
      </>
    )
  }
}