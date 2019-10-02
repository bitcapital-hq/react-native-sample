import { Asset, Observer, PaginatedArray, Transaction, Wallet } from '@bitcapital/base-sdk';
import Bitcapital, { ConsumerStatus } from '@bitcapital/core-sdk';
import * as React from 'react';
import { Alert, Animated, RefreshControl, StatusBar } from 'react-native';
import I18n from 'react-native-i18n';
import { NavigationActions, NavigationScreenProps, ScrollView, StackActions } from 'react-navigation';
import { AppScreens } from '../App';
import { Container, DarkLayout, HomeButton } from '../components';
import Colors from '../config/Colors';
import { HomeScreenContainer } from '../containers/HomeScreenContainer';
import { BitcapitalService } from '../services/Bitcapital';

const SPRING_CONFIG = { tension: 3, friction: 5 };


export interface HomeScreenProps extends NavigationScreenProps {
}

export interface HomeScreenState {
  asset?: Asset;
  wallet?: Wallet;
  history?: PaginatedArray<Transaction>;
  refreshing: boolean;
  showOptions: boolean;
  viewportX?: number;
  viewportY?: number;
  animatedValue?: Animated.ValueXY
}


export class HomeScreen extends React.Component<HomeScreenProps, HomeScreenState> implements Observer {
  bitcapital?: Bitcapital;
  state: HomeScreenState = { refreshing: false, showOptions: false };
  pan: Animated.ValueXY = new Animated.ValueXY();

  async componentDidMount() {
    this.bitcapital = await BitcapitalService.getInstance();
    this.bitcapital.session().subscribe(this);

    if (this.bitcapital.session().current) {
      const current = this.bitcapital.session().current;

      if (current.consumer && current.consumer.status === ConsumerStatus.PENDING_DOCUMENTS) {
        return setTimeout(() => this.props.navigation.navigate(AppScreens.ONBOARDING_DOCUMENTS));
      }
      await this.onRefresh();
    }
  }

  update() {
    const current = this.bitcapital.session().current;
    console.log('LOGIN UPDATE', current)

    if (this.state.wallet && (!current || !current.virtual)) {
      this.goToLogin();
    }

    return this.setState({ refreshing: false });
  }

  async goToLogin() {
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: AppScreens.LOGIN,
          params: {}
        })
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }

  async toggleOptions() {
    let anim;

    if (!this.state.showOptions) {
      anim = Animated.spring(this.pan, {
        ...SPRING_CONFIG,
        toValue: { x: 0, y: 2 * this.state.viewportY }
      })
    } else {
      anim = Animated.spring(this.pan, {
        ...SPRING_CONFIG,
        toValue: { x: 0, y: 0 }
      })
    }

    await this.setState({
      showOptions: !this.state.showOptions,
    })

    anim.start();
  }

  openVirtualCard() {
    this.props.navigation.navigate(AppScreens.VIRTUAL_CARD, {
      wallet: this.state.wallet,
    });
  }

  openDepositScreen() {
    this.props.navigation.navigate(AppScreens.DEPOSIT, {
      wallet: this.state.wallet,
    });
  }

  openHistoryScreen() {
    this.props.navigation.navigate(AppScreens.HISTORY, {
      history: this.state.history,
      wallet: this.state.wallet,
    });
  }

  openPaymentScreen() {
    this.props.navigation.navigate(AppScreens.PAYMENT, {
      wallet: this.state.wallet,
      onConfirm: () => this.onRefresh()
    });
  }

  openBoletoEmitScreen() {
    this.props.navigation.navigate(AppScreens.BOLETO_EMIT, {
      wallet: this.state.wallet,
    });
  }

  openWithdrawalScreen() {
    this.props.navigation.navigate(AppScreens.WITHDRAWAL, {
      wallet: this.state.wallet,
    });
  }

  async onRefresh() {
    await this.setState({ refreshing: true })
    const bitcapital = await BitcapitalService.getInstance();

    try {
      const current = bitcapital.session().current;
      console.log('USER REFRESH', current);
      const wallet = await bitcapital.wallets().findOne(current.wallets[0].id);
      const history = await bitcapital.wallets().findWalletPayments(wallet.id, {});
      const asset = wallet.assets.find(a => a.code === 'BRLD');

      await this.setState({
        wallet,
        asset,
        history,
        refreshing: false,
      })
    } catch (exception) {
      console.error(exception)
      await this.setState({
        refreshing: false,
      });
      setTimeout(() => {
        Alert.alert(
          I18n.t('Error'),
          I18n.t('CouldNotGetWalletInfo'),
          [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: true },
        );
      }, 150);
    }
  }

  render() {
    const current = this.props.navigation.getParam('current') || [];

    return (
      <DarkLayout onLayout={event => {
        const { width, height } = event.nativeEvent.layout;
        this.setState({
          viewportX: width,
          viewportY: height,
        })
      }}>
        <StatusBar backgroundColor={Colors.black} barStyle="light-content" />
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.onRefresh()}
            />
          }>
          <Container style={{ paddingTop: 64 }}>
            <HomeScreenContainer
              pan={this.pan}
              current={current}
              wallet={this.state.wallet}
              asset={this.state.asset}
              history={this.state.history}
              showOptions={this.state.showOptions}
              navigation={this.props.navigation}
              onToggleOptions={() => this.toggleOptions()}
              openDepositScreen={() => this.openDepositScreen()}
              openHistoryScreen={() => this.openHistoryScreen()}
              items={[
                <HomeButton
                  label={I18n.t('PaymentScreenTitle')}
                  icon="qrcode"
                  key="qrcode"
                  onPress={() => this.openPaymentScreen()} />,
                <HomeButton
                  label={I18n.t('VirtualCardScreenTitle')}
                  icon="credit-card"
                  key="credit-card"
                  onPress={() => this.openVirtualCard()} />,
                <HomeButton
                  label={I18n.t('WithdrawalScreenTitle')}
                  icon="bank-transfer-out"
                  key="bank-transfer-out"
                  onPress={() => this.openWithdrawalScreen()} />,
                <HomeButton
                  label={I18n.t('BoletoEmitScreenTitle')}
                  icon="barcode"
                  key="barcode1"
                  onPress={() => this.openBoletoEmitScreen()} />,
              ]} />
          </Container>
        </ScrollView>
      </DarkLayout >
    );
  }
}