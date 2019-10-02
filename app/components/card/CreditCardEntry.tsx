import * as React from 'react';
import { TextStyle, View } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { systemWeights } from 'react-native-typography';
import * as Config from '../../config';
import { Row } from '../layout';
import { BaseCreditCardEntry, CreditCardEntryIcon, CreditCardEntryValue, CreditCardLabel } from './CreditCard';

export interface CreditCardEntryProps {
  label: string,
  value: string,
  prefix?: JSX.Element;
  textStyle?: TextStyle;
  onPress?: (gesture) => void, icon?: string
}

export class CreditCardEntry extends React.Component<CreditCardEntryProps, {}> {
  render() {
    const ButtonContainer = this.props.onPress ? Ripple : View;

    return (
      <React.Fragment>
        <CreditCardLabel style={systemWeights.light}>{this.props.label}</CreditCardLabel>
        <BaseCreditCardEntry style={{ marginBottom: 0, paddingHorizontal: 0, paddingVertical: 0 }}>
          <ButtonContainer onPress={this.props.onPress} style={{ flex: 1, height: '100%' }}>
            <Row style={{ justifyContent: 'center', margin: 8, alignItems: 'center' }}>
              {this.props.prefix ? this.props.prefix : null}
              <CreditCardEntryValue style={this.props.textStyle}>
                {this.props.value}
              </CreditCardEntryValue>
              {this.props.icon ? <CreditCardEntryIcon name={this.props.icon} color={Config.colors.white} size={24} /> : null}
            </Row>
          </ButtonContainer>
        </BaseCreditCardEntry>
      </React.Fragment>
    )
  }
}