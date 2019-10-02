import * as Config from '../../config';
import { systemWeights } from 'react-native-typography';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styled from 'styled-components/native';
import { SmallCard, InlineCard } from './Card';
import Colors from '../../config/Colors';

export const CreditCard = styled(SmallCard)`
  width: 90%;
  padding: 16px;
`;

export const BaseCreditCardEntry = styled(InlineCard)`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${Colors.grayDarker};
`

export const CreditCardEntryValue = styled.Text`
  ${systemWeights.bold as any}
  flex: 1;
  color: ${Config.colors.white};
  font-size: 16px;
  text-align: center;
  align-self: center;
`;

export const CreditCardEntryIcon = styled(Icon)`
  margin-top: 0;
  margin-left: 16;
  align-self: center;
`;

export const CreditCardLabel = styled.Text`
  color: ${Config.colors.white};
  margin-top: 8px;
  margin-left: 4px;
  margin-bottom: 4px;
`;