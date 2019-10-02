import _ from 'lodash';
import moment from 'moment';
import * as React from 'react';
import { RefreshControl, StatusBar } from 'react-native';
import I18n from 'react-native-i18n';
import { NavigationScreenProps, ScrollView } from 'react-navigation';
import styled from 'styled-components/native';
import { CenterContainer, DarkLayout, GoBackButton, HistoryOverview, ScreenTitle } from '../components';
import Colors from '../config/Colors';

const HistoryDivider = styled.Text`
  margin-left: 16px;
  margin-right: 16px;
  margin-bottom: 16px;
  margin-top: 10px;
  color: ${Colors.white};
`;

export interface HistoryScreenProps extends NavigationScreenProps {
}

export interface HistoryScreenState {
  refreshing: boolean;
}

export class HistoryScreen extends React.Component<HistoryScreenProps, HistoryScreenState> {
  state = { refreshing: false };

  async onRefresh() {
    await this.setState({ refreshing: true })
    setTimeout(() => this.setState({ refreshing: false }), 1500);
  }

  render() {
    const wallet = this.props.navigation.getParam('wallet');
    const history = this.props.navigation.getParam('history');

    const days = _.groupBy(history, item => {
      return moment(item.createdAt).format('DD/MM/YYYY');
    });

    return (
      <DarkLayout>
        <StatusBar backgroundColor={Colors.black} barStyle="light-content" />
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => this.onRefresh()}
            />
          }>
            <ScreenTitle
              dark={true}
              title={I18n.t('HistoryScreenTitle')} 
              description={I18n.t('HistoryScreenDescription')} />
          <CenterContainer>
            {Object.keys(days).map(day => (
              <React.Fragment key={day}>
                <HistoryDivider>{day}</HistoryDivider>
                <HistoryOverview source={wallet} history={days[day]} />
              </React.Fragment>
            ))}
          </CenterContainer>
          <GoBackButton
            title={I18n.t('GoBack')}
            onPress={() => this.props.navigation.goBack()} />
        </ScrollView>
      </DarkLayout>
    );
  }
}