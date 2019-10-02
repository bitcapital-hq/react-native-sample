import { Transaction, Wallet } from '@bitcapital/base-sdk';
import * as React from 'react';
import I18n from 'react-native-i18n';
import Ripple from 'react-native-material-ripple';
import styled from 'styled-components/native';
import Colors from '../../config/Colors';
import { SmallCard } from '../card';
import { Center } from '../layout';
import { HistoryItem } from './HistoryItem';

const List = styled.View`
  display: flex;
  flex-direction: column;
`;

const Title = styled.Text`
  display: flex;
  color: ${Colors.white};
  flex-direction: column;
  margin-top: 4px;
  margin-left: 8px;
  margin-right: 8px;
  margin-bottom: 12px;
`;

const ViewMore = styled.Text`
  color: ${Colors.white};
  margin-top: 16px;
  margin-bottom: 12px;
`;

export interface HistoryOverviewProps {
  title?: string;
  viewMore?: boolean;
  source: Wallet;
  history: Transaction[];
  onPress?: () => void
}

export interface HistoryOverviewState {

}

export class HistoryOverview extends React.Component<HistoryOverviewProps, HistoryOverviewState> {
  render() {
    const { title, history, viewMore, onPress } = this.props;

    return (
      <SmallCard style={{ width: '100%', paddingVertical: 0, paddingHorizontal: 0, backgroundColor: Colors.grayDarker }}>
        <Ripple onPress={onPress}>
          <List style={{ margin: 8 }}>
            {title ? <Title>{title}</Title> : null}
            {(history || []).map((transaction, i) => (
              transaction.payments.map((payment, j) => (
                <HistoryItem
                  key={payment.id}
                  payment={payment}
                  transaction={transaction}
                  source={this.props.source} />
              ))
            ))}
            {viewMore ? <Center>
              <ViewMore>{I18n.t('ViewMore')}</ViewMore>
            </Center> : null}
          </List>
        </Ripple>
      </SmallCard>
    );
  }
}
