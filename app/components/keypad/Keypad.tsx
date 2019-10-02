import * as React from 'react';
import { TextProps } from 'react-native';
import Ripple from 'react-native-material-ripple';
import styled from 'styled-components/native';
import Colors from '../../config/Colors';
import { Col, Row } from '../layout';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { KeypadDisplay, KeypadDisplayProps } from './KeypadDisplay';

const KeypadItemContainer = styled(Col)`
  justify-content: center;
  align-items: center;
`;

const KeypadRipple = styled(Ripple)`
  width: 100%;
  height: 64px;
  justify-content: center;
  align-items: center;
`;

const KeypadItemLabel = styled.Text<TextProps & { dark?: boolean }>`
  font-size: 26px;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: Lato-Light;
  color: ${props => props.dark ? Colors.white : Colors.black}
`;

export const KeypadItem = (props: { dark, style?, children, onPress }) => (
  <KeypadItemContainer>
    <KeypadRipple onPress={props.onPress}>
      <KeypadItemLabel dark={props.dark} style={props.style}>{props.children}</KeypadItemLabel>
    </KeypadRipple>
  </KeypadItemContainer>
);

export interface KeypadProps {
  value?: string | number;
  initialValue?: string | number;
  dark?: boolean;
  decimalPlaces?: number;
  maxValue?: number;
  onValueChange?: (value: number) => void;
  onCancel?: () => void;
  display?: Partial<KeypadDisplayProps>;
}

export interface KeypadState {
  value: number;
}

export class Keypad extends React.Component<KeypadProps, KeypadState> {

  constructor(props) {
    super(props);
    this.state = {
      value: +(props.value || props.initialValue || 0)
    };
  }

  async addKey(key: number) {
    const current = this.state.value;
    const next = (current * 10) + (key / Math.pow(10, this.props.decimalPlaces));

    if (next > (this.props.maxValue || Math.pow(10, 6))) {
      throw new Error('Number cannot be higher than: ' + (this.props.maxValue || Math.pow(10, 6)));
    }

    await this.setState({ value: Math.min(next) });

    if (this.props.onValueChange) {
      this.props.onValueChange(next);
    }

    ReactNativeHapticFeedback.trigger("impactLight", {
      enableVibrateFallback: false,
      ignoreAndroidSystemSettings: false
    });
  }

  async delKey() {
    if (this.props.onCancel && this.state.value === 0.00) {
      this.props.onCancel();
    }

    const current = this.state.value;
    const lastKey = this.state.value.toString()[this.state.value.toString().length - 1]
    const last = (current + (-lastKey / Math.pow(10, this.props.decimalPlaces))) / 10;
    await this.setState({ value: Math.max(0, last) });

    if (this.props.onValueChange) {
      this.props.onValueChange(Math.max(0, last));
    }

    ReactNativeHapticFeedback.trigger("impactLight", {
      enableVibrateFallback: false,
      ignoreAndroidSystemSettings: false
    });
  }

  render() {
    const { dark, decimalPlaces, display } = this.props;
    const { value } = this.state;

    return (
      <>
        <KeypadDisplay
          decimalPlaces={decimalPlaces}
          dark={dark}
          {...display}
          value={value} />
        <Row>
          <KeypadItem onPress={() => this.addKey(1)} dark={dark}>1</KeypadItem>
          <KeypadItem onPress={() => this.addKey(2)} dark={dark}>2</KeypadItem>
          <KeypadItem onPress={() => this.addKey(3)} dark={dark}>3</KeypadItem>
        </Row>
        <Row>
          <KeypadItem onPress={() => this.addKey(4)} dark={dark}>4</KeypadItem>
          <KeypadItem onPress={() => this.addKey(5)} dark={dark}>5</KeypadItem>
          <KeypadItem onPress={() => this.addKey(6)} dark={dark}>6</KeypadItem>
        </Row>
        <Row>
          <KeypadItem onPress={() => this.addKey(7)} dark={dark}>7</KeypadItem>
          <KeypadItem onPress={() => this.addKey(8)} dark={dark}>8</KeypadItem>
          <KeypadItem onPress={() => this.addKey(9)} dark={dark}>9</KeypadItem>
        </Row>
        <Row>
          <KeypadItem onPress={null} dark={dark} style={{ color: Colors.gray }}>.</KeypadItem>
          <KeypadItem onPress={() => this.addKey(0)} dark={dark}>0</KeypadItem>
          <KeypadItem onPress={() => this.delKey()} dark={dark} style={{ color: Colors.error }}>
            {this.state.value === 0.00 ? 'x' : '<'}
          </KeypadItem>
        </Row>
      </>
    )
  }
}