import { Card } from '@bitcapital/base-sdk';
import moment from 'moment';
import * as React from 'react';
import { Clipboard, Dimensions, StatusBar } from 'react-native';
import Toast from 'react-native-easy-toast';
import I18n from 'react-native-i18n';
import Spinner from 'react-native-loading-spinner-overlay';
import { NavigationScreenProps, ScrollView } from 'react-navigation';
import styled from 'styled-components/native';
import Visa from '../../../assets/svg/visa.svg';
import { CenterContainer, Col, CreditCard, CreditCardEntry, DarkLayout, HiddenCreditCardEntry, Row, ScreenTitle } from '../../components';
import Colors from '../../config/Colors';
import { BitcapitalService } from '../../services/Bitcapital';

const CreateButton = styled.Button``;

export interface VirtualCardScreenProps extends NavigationScreenProps {

}

// TODO: Fix SDK for this
interface RawCard extends Card {
  raw: RawData;
}

interface RawData {
  cardNumber: string;
  expirationDate: string;
  securityCode: string;
  holderName: string;
  cardStatus: string;
}

export interface VirtualCardsScreenState {
  cards: RawCard[];
  noCards: boolean;
  isLoading: boolean;
}

export class VirtualCardScreen extends React.Component<VirtualCardScreenProps, VirtualCardsScreenState> {
  state = {
    isLoading: true,
    noCards: false,
    cards: [],
  };

  copyNumber(cardNumber: string) {
    const toast: Toast = this.refs.toast as any;
    Clipboard.setString(cardNumber);
    toast.show(I18n.t('CopiedToClipboard'));
  }

  public async componentDidMount() {
    await this.refreshCards();
  }

  async refreshCards() {
    const wallet = this.props.navigation.getParam('wallet');
    const bitcapital = await BitcapitalService.getInstance();
    const cards = await bitcapital.wallets().findCards(wallet.id);
    const currentCards = [];

    if (cards.length > 0) {
      for (const card of cards) {
        if (card.virtual) {
          const infoCard: RawCard = await bitcapital.cards().findOne(wallet.id, card.id) as RawCard;
          currentCards.push(infoCard);
        }
      }

      this.setState({ isLoading: false, cards: currentCards });
    } else {
      this.setState({ noCards: true, isLoading: false });
    }
  }

  async generateNew() {
    this.setState({ isLoading: true });
    const wallet = this.props.navigation.getParam('wallet');
    const bitcapital = await BitcapitalService.getInstance();

    try {
      await bitcapital.cards().emit(wallet.id, { type: 'virtual', expirationDate: moment().add(2, 'years').toDate() });
      await this.refreshCards();

      this.setState({ isLoading: false, noCards: false });
    } catch (e) {
      this.setState({ isLoading: false });
      const toast: Toast = this.refs.toast as any;
      toast.show(I18n.t('ErrorOnNewVirtualCard'));
    }

  }

  renderCard(card: RawCard, idx?: number) {
    return (
      <CreditCard style={{ backgroundColor: Colors.grayDark }} key={idx}>
        <CreditCardEntry
          prefix={<Visa width={32} height={32} style={{ marginRight: 8 }} />}
          label={I18n.t('CARDNUMBER')}
          icon="content-copy"
          value={card.raw.cardNumber.match(/(.{1,4})/g).join(' ')}
          onPress={() => this.copyNumber(card.raw.cardNumber)} />
        <Row>
          <Col>
            <CreditCardEntry
              label={I18n.t('EXPIRATION')}
              value={moment.utc(card.raw.expirationDate).format('MM[ ]/[ ]YYYY')}
              onPress={() => true} />
          </Col>
          <Col>
            <HiddenCreditCardEntry label={I18n.t('CVV')} value={card.raw.securityCode} />
          </Col>
        </Row>
        <CreditCardEntry label={I18n.t('CARDHOLDER')} value={card.raw.holderName} />
      </CreditCard>
    );
  }

  render() {
    return (
      <DarkLayout>
        <Spinner visible={this.state.isLoading} />
        <StatusBar backgroundColor={Colors.black} barStyle="light-content" />
        <Toast ref="toast" {...{ positionValue: Dimensions.get('window').height }} />
        <ScrollView>
          <ScreenTitle
            dark={true}
            title={I18n.t('VirtualCardScreenTitle')}
            description={I18n.t('VirtualCardScreenDescription')} />
          <CenterContainer>
            {this.state.cards.map((card, idx) => this.renderCard(card, idx))}
            {this.state.noCards &&
              <CreateButton
                title={I18n.t('Create')}
                onPress={() => this.generateNew()} />
            }
          </CenterContainer>
        </ScrollView>
      </DarkLayout >
    );
  }
}