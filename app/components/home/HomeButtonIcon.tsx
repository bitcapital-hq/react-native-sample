import * as React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Config from '../../config';

export const HomeButtonIcon = (props: { name: string, size?: number, iconClass?: any }) => {
  const Icon = props.iconClass || MaterialCommunityIcons;

  return <Icon
    size={props.size || 56}
    name={props.name}
    style={{
      margin: 8,
      shadowOpacity: 0.25,
      shadowRadius: 0.75,
      shadowOffset: { height: 1, width: 0 },
      textShadowColor: Config.colors.shadow,
    }}
    color={Config.colors.primaryDark} />
}