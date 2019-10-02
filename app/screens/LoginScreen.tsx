import Bitcapital, { Observer, ConsumerStatus } from '@bitcapital/core-sdk';
import * as React from 'react';
import { Alert, Platform, StatusBar, TouchableOpacity, Linking } from 'react-native';
import I18n from 'react-native-i18n';
import Spinner from 'react-native-loading-spinner-overlay';
import { NavigationActions, NavigationScreenProps, ScrollView, StackActions } from 'react-navigation';
import styled from 'styled-components/native';
import Logo from "../../assets/svg/badge.svg";
import { AppScreens } from '../App';
import { Container, DarkLayout } from '../components';
import { colors as Colors, links as Links } from '../config';
import { BitcapitalService } from '../services/Bitcapital';

const LoginTitle = styled.Text`
  flex: 1;
  font-size: 32px;
  font-family: 'Lato-Light';
  margin-top: 8px;
  margin-left: 16px;
  margin-right: 16px;
  margin-bottom: 48px;
  color: ${Colors.white};
`;

const LoginInput = styled.TextInput`
  border: 0;
  margin-bottom: 16px;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 16px;
  padding-right: 16px;
  color: ${Colors.white};
  font-size: 20px;
  font-family: 'Lato';
`;

const LoginButton = styled(TouchableOpacity)`
  border: 0;
  elevation: 0;
  padding: 16px;
  background-color: ${Colors.primaryDark};
`;

const LoginButtonLabel = styled.Text`
  color: ${Colors.white};
  text-align: center;
  font-size: 20px;
  font-family: 'Lato';
`;

const AuxiliaryButton = styled(TouchableOpacity)`
  color: ${Colors.gray};
  margin: 15px;
  width: auto;
`;

const AuxiliaryButtonLabel = styled.Text`
  width: auto;
  color: ${Colors.gray};
  text-align: center;
  font-family: 'Lato-Light';
  font-size: 20px;
`;

export interface LoginScreenProps extends NavigationScreenProps {
  name: string,
  balance: number
}

export interface LoginScreenState {
  email: string,
  password: string,
  isLoading: boolean;
}

export class LoginScreen extends React.Component<LoginScreenProps, LoginScreenState> implements Observer {
  bitcapital: Bitcapital;
  state = {
    isLoading: false,
    ...Platform.select({
      ios: {
        email: '',
        password: '',
      },
      android: {
        email: '',
        password: '',
      }
    })
  }

  async componentDidMount() {
    this.bitcapital = await BitcapitalService.getInstance();
    this.bitcapital.session().subscribe(this);
  }

  async componentWillUnmount() {
    this.bitcapital.session().unsubscribe(this);
  }

  async update() {
    let isLoading = false;
    const current = this.bitcapital.session().current;
    console.log('LOGIN UPDATE', current);

    if (current) {
      await this.setState({ isLoading: false });

      if (!current.virtual) {

        if (current.consumer && current.consumer.status === ConsumerStatus.PENDING_DOCUMENTS) {
          const resetAction = StackActions.reset({
            index: 0,
            actions: [
              NavigationActions.navigate({
                routeName: AppScreens.ONBOARDING_DOCUMENTS,
              })
            ],
          });
          return this.props.navigation.dispatch(resetAction);
        }
        
        return setTimeout(() => this.goToHome(), 10);
      }
    }

    if (this.bitcapital.session().isFetching) {
      isLoading = true;
    }

    return this.setState({ isLoading });
  }

  async recover() {
    await Linking.openURL(Links.help);
  }

  async signUp() {
    this.props.navigation.navigate(AppScreens.ONBOARDING_BASIC_INFO);
  }

  async goToSettings() {
    this.props.navigation.navigate(AppScreens.SETTINGS);
  }

  async login() {
    await this.setState({ isLoading: true });

    try {
      const bitcapital = await BitcapitalService.getInstance();

      await bitcapital.session().password({
        username: this.state.email,
        password: this.state.password
      });

      return this.goToHome();
    } catch (exception) {
      let msg;
      const response = exception.response;

      if (response && response.data && response.data.message) {
        msg = response.data.message;
      } else if (response && response.message) {
        msg = response.message;
      } else if (exception.message) {
        msg = exception.message;
      } else {
        msg = exception || I18n.t('UnknownError');
      }

      setTimeout(() => {
        // Works on both iOS and Android
        Alert.alert(
          'Ops',
          msg,
          [
            { text: I18n.t('OK'), onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: true },
        );
      }, 150);
    }

    return this.setState({ isLoading: false });
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

  render() {
    const isDisabled = !this.state.email && !this.state.password;

    return (
      <DarkLayout>
        <StatusBar backgroundColor={Colors.black} barStyle="light-content" />
        <Spinner visible={this.state.isLoading} />
        <ScrollView>
          <Logo width="64px" height="64px" style={{ marginLeft: 32, marginTop: 48, marginBottom: 48 }} />
          <Container style={{ flex: 1, flexGrow: 1 }}>
            <LoginTitle>
              {I18n.t('LoginScreenDescription')}
            </LoginTitle>
            <LoginInput
              placeholder={I18n.t('Email')}
              autoCapitalize="none"
              textContentType="emailAddress"
              placeholderTextColor={Colors.gray}
              keyboardType="email-address"
              value={this.state.email}
              onChangeText={text => this.setState({ email: text })} />
            <LoginInput
              placeholder={I18n.t('Password')}
              secureTextEntry={true}
              placeholderTextColor={Colors.gray}
              value={this.state.password}
              onChangeText={text => this.setState({ password: text })} />
          </Container>

          <AuxiliaryButton onPress={() => this.recover()}>
            <AuxiliaryButtonLabel>{I18n.t('NeedHelp')}</AuxiliaryButtonLabel>
          </AuxiliaryButton>

          <AuxiliaryButton onPress={() => this.signUp()}>
            <AuxiliaryButtonLabel>{I18n.t('SignUp')}</AuxiliaryButtonLabel>
          </AuxiliaryButton>

          <AuxiliaryButton onPress={() => this.goToSettings()}>
            <AuxiliaryButtonLabel>{I18n.t('Settings')}</AuxiliaryButtonLabel>
          </AuxiliaryButton>
        </ScrollView>

        <LoginButton onPress={() => this.login()} disabled={isDisabled}>
          <LoginButtonLabel>{I18n.t('SignIn')}</LoginButtonLabel>
        </LoginButton>
      </DarkLayout>
    );
  }
}