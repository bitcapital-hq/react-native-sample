import { Platform, SafeAreaView, View, ViewProps } from 'react-native';
import styled from 'styled-components/native';
import * as Config from '../../config';
import Colors from '../../config/Colors';

export const BaseLayout = Platform.select({
  ios: SafeAreaView,
  android: View,
});

export const Layout = styled(BaseLayout)`
  flex: 1;
  backgroundColor: ${Config.colors.primary}
`;

export const DarkLayout = styled(BaseLayout)`
  flex: 1;
  backgroundColor: ${Config.colors.black}
`;

export const Divider = styled.View<ViewProps & { line?: boolean }>`
  margin-bottom: 8px;
  ${props => props.line ? `
    padding-bottom: 8px;
    border-bottom-width: 1px;
    border-bottom-color: ${Colors.black}
  ` : ''}
`;