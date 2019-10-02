
import React, { Component, Fragment } from 'react';
import { SectionList, Switch, Dimensions, StatusBar, ScrollView, Picker, Text } from 'react-native';
import I18n from 'react-native-i18n';
import Colors from '../config/Colors';
import { DarkLayout, ScreenTitle } from '../components';
import Toast from 'react-native-easy-toast';
import styled from 'styled-components/native';
import Spinner from 'react-native-loading-spinner-overlay';
import { LocalStorage } from '../services/LocalStorage';
import { BitcapitalService } from '../services/Bitcapital';

const SettingsContainer = styled.View`
  flex: 1;
  flex-direction: row;
	justify-content: flex-start;
  align-items: flex-start;
  margin-left: 10px;
`;

const StyledPicker = styled.Picker`
  margin-top: 0;
`;

const PickerTitle = styled.Text`
  color: ${Colors.white};
  text-align: center;
`;

const SettingsText = styled.Text`
  margin-top: 5px;
  margin-left: 5px;
  font-size: 15px;
  font-family: 'Lato-Light';
  color: ${Colors.white};
`;

enum SettingsTranslations {
  useTouchId = 'SettingsScreenUseTouchId',
}

interface SettingsScreenProps { }

interface SettingsScreenState {
  isLoading: boolean;
  isAuthenticated: boolean;
  settings: {
    useTouchId: boolean;
    instance: number;
  },
}

export class SettingsScreen extends Component<SettingsScreenProps, SettingsScreenState> {
  protected readonly localStorage = new LocalStorage();
  constructor(props: SettingsScreen) {
    super(props);

    this.state = {
      isLoading: true,
      isAuthenticated: false,
      settings: {
        useTouchId: false,
        instance: 0,
      }
    };

    this.loadConfig();
  }

  async loadConfig() {
    const settings: any = {};

    const bitCapital = BitcapitalService.getInstance();
    if (bitCapital.session().current) {
      settings['isAuthenticated'] = true;
    }

    const useTouchId = (await this.localStorage.getItem(`settings.useTouchId`)) === 'true';
    const instance = parseInt(await this.localStorage.getItem(`settings.instance`)) || 0;

    this.setState({ 
      isLoading: false,
      settings: {
        useTouchId,
        instance,
      }
    });
  }

  onSwitchChange(key: string, value: boolean): void {
    const { settings } = this.state;
    settings[key] = value;
    this.setState({ settings });

    this.localStorage.setItem(`settings.${key}`, value.toString());
  }

  onRenderItem(options: {item: string, index, section}): JSX.Element {
    return (
      <SettingsContainer>
        <Switch onValueChange={this.onSwitchChange.bind(this, options.item)} value={this.state.settings[options.item]}  />
        <SettingsText>{I18n.t(SettingsTranslations[options.item])}</SettingsText>
      </SettingsContainer>
    );
  }

  render(): JSX.Element {
    return (
      <DarkLayout>
        <Spinner visible={this.state.isLoading} />
        <Toast ref="toast" {...{ positionValue: Dimensions.get('window').height }} />
        <StatusBar backgroundColor={Colors.black} barStyle="light-content" />
        <ScrollView>
          <ScreenTitle
            dark={true}
            title={I18n.t('SettingsScreenTitle')}
            description={I18n.t('SettingsScreenDescription')} />
            
            { this.state.isAuthenticated && 
              <Fragment>
                <SectionList
                  renderItem={this.onRenderItem.bind(this)}
                  sections={[
                    { title: 'Security', data: ['useTouchId']}
                  ]} />
              </Fragment>
            }
          
        </ScrollView>
      </DarkLayout>
    );
  }
}