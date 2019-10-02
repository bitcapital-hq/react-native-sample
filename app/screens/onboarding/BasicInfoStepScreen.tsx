import Bitcapital, { AddressStatus, ConsumerStatus } from '@bitcapital/core-sdk';
import * as React from 'react';
import { Platform, StatusBar, TouchableOpacity } from 'react-native';
import I18n from 'react-native-i18n';
import Spinner from 'react-native-loading-spinner-overlay';
import { NavigationActions, NavigationScreenProps, ScrollView, StackActions } from 'react-navigation';
import styled from 'styled-components/native';
import { AppScreens } from '../../App';
import { Container, DarkLayout, SmallCard, ScreenTitle } from '../../components';
import Colors from '../../config/Colors';
import { BitcapitalService } from '../../services/Bitcapital';
import cep from 'cep-promise';
import { UserRole, AccountType, AddressType } from '@bitcapital/base-sdk';
import moment from 'moment';

const DatePickerIOSStyled = styled.DatePickerIOS`
  color: ${Colors.white};
`

const InfoText = styled.Text`
	font-size: 18px;
	font-weight: 600;
	margin-right: 15px;
`;

const InfoInput = styled.TextInput`
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

const NextButton = styled(TouchableOpacity)`
  border: 0;
  elevation: 0;
  padding: 16px;
  background-color: ${Colors.primaryDark};
`;

const NextButtonLabel = styled.Text`
  color: ${Colors.white};
  text-align: center;
  font-size: 20px;
  font-family: 'Lato';
`;

const PhoneInputContainer = styled.View`
  flex-direction: row;
`;

const PhoneCodeInput = styled.TextInput`
  border: 0;
  margin-bottom: 16px;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 16px;
  padding-right: 16px;
  color: ${Colors.white};
  font-size: 20px;
  font-family: 'Lato';
  flex: 1;
`;

const PhoneNumberInput = styled.TextInput`
  border: 0;
  margin-bottom: 16px;
  padding-top: 2px;
  padding-bottom: 2px;
  padding-left: 16px;
  padding-right: 16px;
  color: ${Colors.white};
  font-size: 20px;
  font-family: 'Lato';
  flex: 4;
`;

export interface BasicInfoStepScreenProps extends NavigationScreenProps {
  name: string,
  balance: number
}

export interface BasicInfoStepScreenState {
  email: string,
  password: string,
  name: string;
  taxId: string;
  motherName: string;
  phoneCode: string;
  phoneNumber: string;
  postalCode: string;
  number: string;
  complement: string;
  reference: string;
  birthday: Date;
  isLoading: boolean;
  address: {
    cep: string;
    state: string;
    city: string;
    neighborhood: string;
    street: string;
  } | null ;
}

export class BasicInfoStepScreen extends React.Component<BasicInfoStepScreenProps, BasicInfoStepScreenState> {
  bitcapital: Bitcapital;
  state = {
    isLoading: false,
    ...Platform.select({
      ios: {
        email: '',
        name: '',
        password: '',
        taxId: '',
        motherName: '',
        phoneCode: '',
        phoneNumber: '',
        postalCode: '',
        number: '',
        complement: '',
        reference: '',
        birthday: moment().subtract(20, 'years').toDate(),
        address: null,
      },
      android: {
        email: '',
        name: '',
        password: '',
        taxId: '',
        motherName: '',
        phoneCode: '',
        phoneNumber: '',
        postalCode: '',
        number: '',
        complement: '',
        reference: '',
        birthday: moment().subtract(20, 'years').toDate(),
        address: null,
      }
    })
  }

  async componentDidMount() {
    this.bitcapital = await BitcapitalService.getInstance();
  }

  onError(err) {
    this.setState({ isLoading: false });
    console.error(err);
  }

  async goToNext() {
    this.setState({ isLoading: true });
    const user = await this.bitcapital.session().clientCredentials();
    debugger;
    const consumer = await this.bitcapital.consumers().create({
      firstName: this.state.name.split(' ')[0],
      lastName: this.state.name.split(' ').slice(1).join(' '),
      email: this.state.email,
      password: this.state.password,
      role: UserRole.CONSUMER,
      consumer: {
        status: ConsumerStatus.PENDING_DOCUMENTS,
        motherName: this.state.motherName,
        taxId: this.state.taxId,
        type: AccountType.PERSONAL,
        addresses: [{
          code: this.state.postalCode,
          country: 'Brasil',
          state: this.state.address.state,
          neighborhood: this.state.address.neighborhood,
          street: this.state.address.street,
          city: this.state.address.city,
          number: this.state.number,
          complement: this.state.complement,
          reference: this.state.reference,
          type: AddressType.HOME,
          status: AddressStatus.OWN,
        }],
        phones: [{
          code: this.state.phoneCode,
          number: this.state.phoneNumber,
        }],
        birthday: moment(this.state.birthday).startOf('day').toDate(),
      }
    });

    console.log(consumer);

    await this.bitcapital.session().password({
      username: this.state.email,
      password: this.state.password,
    });

    this.setState({ isLoading: false });

    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: AppScreens.ONBOARDING_DOCUMENTS,
        })
      ],
    });
    this.props.navigation.dispatch(resetAction);
  }

  async onPostalCodeChange(text: string) {
    this.setState({ postalCode: text });

    if (text.length === 8) {
      this.setState({ isLoading: true });
      const address = await cep(parseInt(text)).catch(err => console.error(err));

      this.setState({ address: address as any, isLoading: false });
    }
  }

  render() {
    return (
      <DarkLayout>
        <StatusBar backgroundColor={Colors.black} barStyle="light-content" />
        <Spinner visible={this.state.isLoading} />
        <ScrollView>
          <Container style={{ flex: 1, flexGrow: 1 }}>
            <ScreenTitle
              dark={true}
              title={I18n.t('Onboarding')} />
            <InfoInput
              placeholder={I18n.t('FullName')}
              autoCapitalize="words"
              textContentType="name"
              placeholderTextColor={Colors.gray}
              keyboardType="default"
              value={this.state.name}
              onChangeText={text => this.setState({ name: text })} />

            <InfoInput
              placeholder={I18n.t('Email')}
              autoCapitalize="none"
              textContentType="emailAddress"
              placeholderTextColor={Colors.gray}
              keyboardType="email-address"
              value={this.state.email}
              onChangeText={text => this.setState({ email: text })} />

            <InfoInput
              placeholder={I18n.t('TaxId')}
              autoCapitalize="none"
              textContentType="none"
              placeholderTextColor={Colors.gray}
              keyboardType="number-pad"
              value={this.state.taxId}
              onChangeText={text => this.setState({ taxId: text })} />
            
            
            <InfoInput
              placeholder={I18n.t('MotherName')}
              autoCapitalize="words"
              textContentType="name"
              placeholderTextColor={Colors.gray}
              keyboardType="default"
              value={this.state.motherName}
              onChangeText={text => this.setState({ motherName: text })} />

            <PhoneInputContainer>
              <PhoneCodeInput
                placeholder={I18n.t('AreaCode')}
                textContentType="none"
                maxLength={2}
                placeholderTextColor={Colors.gray}
                keyboardType="phone-pad"
                value={this.state.phoneCode}
                onChangeText={text => this.setState({ phoneCode: text })} />

              <PhoneNumberInput
                placeholder={I18n.t('PhoneNumber')}
                textContentType="telephoneNumber"
                maxLength={9}
                placeholderTextColor={Colors.gray}
                keyboardType="phone-pad"
                value={this.state.phoneNumber}
                onChangeText={text => this.setState({ phoneNumber: text })} />    
            </PhoneInputContainer>

            <InfoInput
              placeholder={I18n.t('PostalCode')}
              textContentType="postalCode"
              maxLength={8}
              placeholderTextColor={Colors.gray}
              keyboardType="number-pad"
              value={this.state.postalCode}
              onChangeText={text => this.onPostalCodeChange(text)} />

            { this.state.address && 
              <SmallCard>
                <InfoText>
                  {this.state.address.street} - {this.state.address.neighborhood}, 
                  {this.state.address.city} - {this.state.address.state}
                </InfoText>
              </SmallCard>
            }
            
            <InfoInput
              placeholder={I18n.t('Number')}
              textContentType="none"
              placeholderTextColor={Colors.gray}
              keyboardType="number-pad"
              value={this.state.number}
              onChangeText={text => this.setState({ number: text })} />

            <InfoInput
              placeholder={I18n.t('Complement')}
              autoCapitalize="words"
              textContentType="none"
              placeholderTextColor={Colors.gray}
              keyboardType="default"
              value={this.state.complement}
              onChangeText={text => this.setState({ complement: text })} />
            
            <InfoInput
              placeholder={I18n.t('Reference')}
              autoCapitalize="words"
              textContentType="none"
              placeholderTextColor={Colors.gray}
              keyboardType="default"
              value={this.state.reference}
              onChangeText={text => this.setState({ reference: text })} />

            <InfoInput
              placeholder={I18n.t('Password')}
              secureTextEntry={true}
              autoCapitalize="none"
              textContentType="password"
              placeholderTextColor={Colors.gray}
              keyboardType="default"
              value={this.state.password}
              onChangeText={text => this.setState({ password: text })} />

            <DatePickerIOSStyled
              style={{flex: 1, width: '100%'}}
              minimumDate={moment().subtract(100, 'years').toDate()}
              maximumDate={moment().subtract(18, 'years').toDate()}
              mode="date"
              date={this.state.birthday}
              onDateChange={date => this.setState({ birthday: date})} />
          </Container>
        </ScrollView>

        <NextButton onPress={() => this.goToNext().catch(err => this.onError(err)) } >
          <NextButtonLabel>{I18n.t('Next')}</NextButtonLabel>
        </NextButton>
      </DarkLayout>
    );
  }
}