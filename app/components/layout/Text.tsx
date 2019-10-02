import styled from 'styled-components/native';
import { TextProps } from 'react-native';

export const Bold = styled.Text`
  font-weight: bold;
`;

export const Title = styled.Text<TextProps & { dark?: boolean }>`
	font-size: 28px;
  font-weight: 600;
  ${props => props.dark ? 'color: white;' : ''}
`;

export const Instructions = styled.Text<TextProps & { dark?: boolean }>`
  margin-top: 16px;
  font-size: 16px;
  ${props => props.dark ? 'color: white;' : ''}
`;