import IsUUID from 'is-uuid';
import * as React from 'react';
import { Alert } from 'react-native';
import I18n from 'react-native-i18n';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { NavigationScreenProps } from 'react-navigation';
import styled from 'styled-components/native';
import URI from 'urijs';
import { DarkLayout, Row } from '../../components';

export const EnterCodeButton = styled.Button`
  padding: 8px
`;

export interface ScannerScreenProps extends NavigationScreenProps {

}

export class ScannerScreen extends React.Component<ScannerScreenProps, {}> {

  onSuccess(e) {
    if (IsUUID.v4(e.data)) {
      this.openConfirmation(e.data);
    } else {
      const payload = URI(e.data);
      const protocol = payload.protocol();

      if (protocol === 'bitcapital') {
        const path = payload.path().split('/');
        this.openConfirmation(path[path.length - 1]);
      } else {
        setTimeout(() => {
          // Works on both iOS and Android
          Alert.alert(
            I18n.t('Ops'),
            I18n.t('UnrecognizedQrCode'),
            [
              { text: I18n.t('OK'), onPress: () => this.props.navigation.goBack() },
            ],
            { cancelable: false },
          );

        }, 150);

      }
    }
  }

  openConfirmation(destination) {
    const callback = this.props.navigation.getParam('onConfirm');

    if (callback) {
      callback(destination);
    }

    this.props.navigation.goBack();
  }

  render() {
    return (
      <DarkLayout>
        <Row>
          <QRCodeScanner
            cameraStyle={{ height: '100%' } as any}
            cameraProps={{
              captureAudio: false
            }}
            showMarker={true}
            onRead={this.onSuccess.bind(this)} />
        </Row>
      </DarkLayout >
    );
  }
}