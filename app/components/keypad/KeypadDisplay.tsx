import { Asset } from '@bitcapital/base-sdk';
import * as React from 'react';
import { TextProps } from 'react-native';
import styled from 'styled-components/native';
import Colors from '../../config/Colors';
import { Row } from '../layout';

const KeypadDisplayContainer = styled(Row)`
  margin-top: 48px;
  padding-left: 32px;
  padding-right: 32px;
  margin-bottom: 24px;
`;

const KeypadDisplayTitle = styled.Text`
  flex: 1;
  color: ${Colors.gray};
  margin-bottom: 16px;
  font-size: 32px;
  font-family: Lato-Light;
  padding-bottom: 4px;
  text-align: left;
`

const KeypadDisplaySubtitle = styled.Text`
  color: ${Colors.white}
  padding-left: 4px;
  margin-left: 4px;
  margin-right: 16px;
  margin-bottom: 4px;
  font-size: 14px;
  font-family: Lato;
  text-align: left;
`

const KeypadDisplayValue = styled.Text<TextProps & { dark?: boolean }>`
  font-size: 26px;
  font-family: Lato-Light;
  text-align: left;
  color: ${props => props.dark ? Colors.white : Colors.black}
`;

export interface KeypadDisplayProps {
  value: string | number;
  decimalPlaces: number;
  asset?: Asset;
  dark?: boolean;
  prefix?: string;
  suffix?: string;
  destination?: string;
}

export const KeypadDisplay = (props: KeypadDisplayProps) => (
  <KeypadDisplayContainer>
    <KeypadDisplayTitle>
      {props.prefix}

      <KeypadDisplayValue dark={props.dark}>
        {Number(props.value).toFixed(props.decimalPlaces)}
        <KeypadDisplaySubtitle>
          {' '}{props.asset.code}
        </KeypadDisplaySubtitle>
      </KeypadDisplayValue>

      {props.suffix}
    </KeypadDisplayTitle>
  </KeypadDisplayContainer>
)