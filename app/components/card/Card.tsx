import styled from 'styled-components/native';
import * as Config from '../../config';

export const BaseCard = styled.View`
  width: auto;
  background-color: ${Config.colors.white};
  border-radius: 8;
  shadow-offset: 2px 2px;
  shadow-color: rgb(27, 27, 27);
  shadow-opacity: 0.3;
  elevation: 1;
  margin-bottom: 16px;
`;

export const BigCard = styled(BaseCard)`
  padding-horizontal: 15;
  padding-vertical: 15;
`;

export const SmallCard = styled(BaseCard)`
  padding-horizontal: 8px;
  padding-vertical: 8px;
`;

export const InlineCard = styled(BaseCard)`
  padding-horizontal: 8px;
  padding-vertical: 8px;
  border-radius: 4;
  shadow-offset: 1px 1px;
  shadow-opacity: 0.2;
`;