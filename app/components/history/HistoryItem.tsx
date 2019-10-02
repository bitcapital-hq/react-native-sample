import { Payment, PaymentType, Transaction, TransactionStatus, Wallet } from '@bitcapital/base-sdk';
import moment from 'moment';
import * as React from 'react';
import I18n from 'react-native-i18n';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
import Colors from '../../config/Colors';
import { Col, Row } from '../layout';

const Label = styled.Text`
  flex: 1;
	font-size: 16px;
  font-weight: 600;
  color: ${Colors.white};
`;

const Sublabel = styled.Text`
  flex: 1;
	font-size: 12px;
  font-weight: 600;
  margin-left: 12px;
  padding-top: 4px;
  padding-bottom: 2px;
  color: ${Colors.gray};
`;

const Subtitle = styled.Text`
  flex: 1;
	font-size: 12px;
	font-weight: 600;
  text-align: right;
  align-self: flex-end;
  align-items: flex-end;
  color: ${Colors.gray};
`;

const Debit = styled.Text`
  flex: 1;
	font-size: 18px;
	font-weight: 600;
  color: #990000;
  text-align: right;
  align-self: flex-end;
  align-items: flex-end;
`;

const Credit = styled.Text`
  flex: 1;
	font-size: 18px;
	font-weight: 600;
  color: green;
  text-align: right;
  align-self: flex-end;
  align-items: flex-end;
`;

const HistoryIcon = styled(Icon)`
  padding-top: 2px;
  margin-right: 8px;
  margin-left: -10px;
`;

export interface HistoryItemProps {
  source: Wallet;
  payment: Payment;
  transaction: Transaction;
}

export interface HistoryItemState {

}

export class HistoryItem extends React.Component<HistoryItemProps, HistoryItemState> {
  renderIcon() {
    const { source, transaction, payment } = this.props;
    const isDebit = transaction.source.id === source.id;
    const isPending = transaction.status === TransactionStatus.AUTHORIZED;

    if (isPending) {
      return <HistoryIcon
        size={16}
        name="clock-alert-outline"
        color={isPending ? Colors.info : Colors.black} />
    } else {
      switch (payment.type) {
        case PaymentType.DEPOSIT:
          return <HistoryIcon
            size={16}
            name="call-made"
            color={isPending ? Colors.info : Colors.white} />
        case PaymentType.TRANSFER:
          return <HistoryIcon
            size={16}
            name={isDebit ? "call-made" : "call-received"}
            color={isPending ? Colors.info : Colors.white} />
        case PaymentType.CARD:
          return <HistoryIcon
            size={16}
            name="credit-card"
            color={isPending ? Colors.info : Colors.white} />
        default:
          return <HistoryIcon
            size={16}
            name={transaction.additionalData.card_id ? 'credit-card' : 'call-made'}
            color={isPending ? Colors.info : Colors.white} />
      }
    }
  }


  renderLabel() {
    const { source, transaction, payment } = this.props;
    let label;
    let sublabel;

    const hasFailed = transaction.status === TransactionStatus.FAILED;
    const isPending = transaction.status === TransactionStatus.AUTHORIZED;
    const isDebit = transaction.source.id === source.id;
    const timestamp = moment(transaction.createdAt).fromNow();

    switch (payment.type) {
      case PaymentType.BOLETO:
        label = I18n.t('Boleto');
        break;
      case PaymentType.CARD:
        label = I18n.t('Card');
        break;
      case PaymentType.DEPOSIT:
        label = I18n.t('Deposit');
        break;
      case PaymentType.TRANSFER:
        label = I18n.t('Transfer');
        sublabel = payment.destination.user.name;
        break;
      case PaymentType.WITHDRAWAL:
        if (transaction.additionalData.card_id) {
          label = I18n.t('CardPurchase');
        } else {
          label = I18n.t('Withdrawal');
        }
        break;
      default:
        if (isDebit) {
          label = I18n.t('Payment');
        } else {
          label = I18n.t('Deposit');
        }
        break;
    }

    if (transaction.additionalData['externalTransaction'] && transaction.additionalData['externalTransaction'].store) {
      label = transaction.additionalData['externalTransaction'].store;
    }

    return (
      <Row style={{ flex: 1, marginTop: 4 }}>
        <Col style={{ flex: 2 }}>
          <Row>
            {this.renderIcon()}
            <Label
              numberOfLines={1}
              style={{
                color: isPending ? Colors.info : Colors.white,
                textDecorationLine: hasFailed ? 'line-through' : undefined
              }}>
              {label}
            </Label>
          </Row>
          <Sublabel
            numberOfLines={1}
            style={{ textDecorationLine: hasFailed ? 'line-through' : undefined }}>
            {sublabel}
          </Sublabel>
        </Col>
        <Col style={{ flex: 1 }}>
          {this.renderAmount()}
          <Subtitle> {timestamp} </Subtitle>
        </Col>
      </Row>

    );
  }

  renderAmount() {
    const { source, transaction, payment } = this.props;
    const hasFailed = transaction.status === TransactionStatus.FAILED;
    const isDebit = transaction.source.id === source.id;
    const label = `R$ ${(+payment.amount).toFixed(2)}`;
    return (isDebit ? (
      <Debit style={{ textDecorationLine: hasFailed ? 'line-through' : undefined }}>{label}</Debit>
    ) : (
        <Credit style={{ textDecorationLine: hasFailed ? 'line-through' : undefined }}>{label}</Credit>
      )
    );
  }

  render() {
    return (
      <Col>
        {this.renderLabel()}
      </Col>
    );
  }
}
