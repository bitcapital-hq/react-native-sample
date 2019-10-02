import { User } from '@bitcapital/base-sdk';
import * as React from 'react';
import { Text } from 'react-native';
import I18n from 'react-native-i18n';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styled from 'styled-components/native';
import * as Config from '../../config';
import { Row, Col } from '../layout';

const AvatarContainer = styled.View`
  width: 48px;
  height: 48px;
  padding: 4px;
  margin-right: 8px;
  border-radius: 48px;
  background-color: white;
`;

const Avatar = styled.Image`
  width: 40px;
  height: 40px;
`;

const Title = styled.Text`
  font-size: 20px;
  margin-left: 8px;
  margin-right: 32px;
  font-family: 'Lato-Light'
  color: ${Config.colors.white};
`;

const Name = styled.Text`
  font-size: 20px;
  margin-left: 8px;
  margin-right: 32px;
  font-family: 'Lato';
  text-align: left;
  color: ${Config.colors.white};
`;

export const HomeAvatar = (props: { current: User, showOptions: boolean }) => {
  const firstName = props.current.firstName;
  const lastNames = props.current.lastName.split(' ');
  const lastName = lastNames[lastNames.length - 1];

  return (
  <Row>
    <AvatarContainer>
      <Avatar source={require('../../../assets/logo.png')} />
    </AvatarContainer>
    <Col>
      <Title>{I18n.t('WelcomeBack')},</Title>
      <Name>
        {firstName[0].toUpperCase()}{firstName.substring(1).toLowerCase()}{' '}
        {lastName[0].toUpperCase()}{lastName.substring(1).toLowerCase()}
      </Name>
    </Col>
    <Ionicons
      size={28}
      style={{ marginTop: 12 }}
      color={Config.colors.white}
      name={props.showOptions ? "ios-arrow-up" : "ios-arrow-down"} />
  </Row>
);
}