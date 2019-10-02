import * as React from 'react';
import Ripple from 'react-native-material-ripple';
import styled from 'styled-components/native';
import Colors from '../../config/Colors';
import { SmallCard } from '../card';
import { Center, Row } from '../layout';
import { HomeButtonIcon } from './HomeButtonIcon';

const InfoText = styled.Text`
  font-size: 18px;
  margin-left: 22px;
  margin-right: 12px;
  color: ${Colors.white}
`;

export const HomeButton = ({ label, icon, onPress }) => (
  <SmallCard style={{ marginBottom: 8, paddingHorizontal: 0, paddingVertical: 0, backgroundColor: Colors.grayDarker }}>
    <Ripple onPress={onPress} style={{ flex: 1, height: '100%' }}>
      <Row>
        <HomeButtonIcon name={icon} />
        <Center>
          <InfoText>{label}</InfoText>
        </Center>
      </Row>
    </Ripple>
  </SmallCard>
)