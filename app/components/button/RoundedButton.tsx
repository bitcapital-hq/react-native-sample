import * as React from 'react';
import styled from 'styled-components/native';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import Colors from '../../config/Colors';

export const BaseRoundedButton = styled(TouchableOpacity)`
  margin-left: 16px;
  margin-right: 16px;
  margin-bottom: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 16px;
  padding-right: 16px;
  border-color: #000;
  border-width: 1px;
  border-radius: 16px;
`;

export const BaseRoundedButtonText = styled(Text)`
  color: ${Colors.white};
  text-align: center;
`;

export const RoundedButton = ({ title, label: Label, ...props }: { title: string, label?: any } & TouchableOpacityProps) => (
  <BaseRoundedButton {...props}>
    {Label ? <Label>{title}</Label> : <BaseRoundedButtonText>{title}</BaseRoundedButtonText>}
  </BaseRoundedButton>
)