import Bitcapital from '@bitcapital/core-sdk';
import * as React from 'react';
import { StatusBar, TouchableOpacity } from 'react-native';
import I18n from 'react-native-i18n';
import Spinner from 'react-native-loading-spinner-overlay';
import { NavigationScreenProps, ScrollView } from 'react-navigation';
import styled from 'styled-components/native';
import { AppScreens } from '../../App';
import { Container, DarkLayout, BaseCard, ScreenTitle } from '../../components';
import Colors from '../../config/Colors';
import { BitcapitalService } from '../../services/Bitcapital';
import ImagePicker from 'react-native-image-picker';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { DocumentType } from '@bitcapital/core-sdk';

const NextButton = styled(TouchableOpacity)`
  border: 0;
  elevation: 0;
  padding: 16px;
  background-color: ${Colors.primaryDark};
`;

const NextButtonLabel = styled.Text`
  color: ${Colors.white};
  text-align: center;
  font-size: 20px;
  font-family: 'Lato';
`;

const ImageSelectorContainer = styled.View`
  flex-direction: row;
`;

const ImageSelectorText = styled.Text`
  flex: 5;
  font-size: 18px;
	font-weight: 600;
  margin-right: 15px;
  color: ${Colors.white}
`;

const ImageSelectButton = styled(BaseCard)`
  margin: 8px;
  margin-top: 0px;
  padding: 8px;
  elevation: 8;
  border-radius: 32;
  border-width: 0;
`;

export interface DocumentsStepScreenProps extends NavigationScreenProps {
}

export interface DocumentsStepScreenState {
  isLoading: boolean;
  front: string|null;
  back: string|null;
  selfie: string|null;
}

export class DocumentsStepScreen extends React.Component<DocumentsStepScreenProps, DocumentsStepScreenState> {
  bitcapital: Bitcapital;
  state = {
    isLoading: false,
    front: null,
    back: null, 
    selfie: null,
  }

  async componentDidMount() {
    this.bitcapital = await BitcapitalService.getInstance();

    const me = await this.bitcapital.users().me();

    if (me && me.consumer && me.consumer.states) {
      
    }
  }

  goToNext() {
    this.props.navigation.navigate(AppScreens.ONBOARDING_WAITING, {
      currentState: this.state,
      lastState: this.props.navigation.getParam('currentState'),
    });
  }

  async onClick(type: string) {
    this.setState({ isLoading: true });
    ImagePicker.showImagePicker({
      title: 'Select Document',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      }
    }, async (response) => {
      if (response.didCancel) {
        this.setState({ isLoading: false });
      } else if (response.error) {
        this.setState({ isLoading: false });
      } else {
        const state = this.state;
        state[type] = response.uri;
        state.isLoading = false;
        const current = this.bitcapital.session().current;
        const document = await this.bitcapital.documents().uploadPictureFromBase64(
          current.id, 
          // @ts-ignore
          DocumentType.BRL_INDIVIDUAL_REG, 
          type, 
          `data:${response.type};base64,${response.data}`,
        );
        console.log(document);
        this.setState(this.state);
      }
    });
  }

  onLogout() {
    this.bitcapital.session().destroy();
    this.props.navigation.navigate(AppScreens.LOGIN);
  }

  render() {
    return (
      <DarkLayout>
        <StatusBar backgroundColor={Colors.black} barStyle="light-content" />
        <Spinner visible={this.state.isLoading} />
        <ScrollView>
          <ScreenTitle
            dark={true}
            title={I18n.t('Onboarding')} />
          <Container style={{ flex: 1, flexGrow: 1 }}>

            <ImageSelectorContainer>
              <ImageSelectorText>
                {
                  this.state.front === null ? 'Front of your document:' : 'Front selected!'
                }
              </ImageSelectorText>
              <TouchableOpacity onPress={() => this.onClick('front')}>
                <ImageSelectButton>
                  <MaterialIcon name="camera-alt" size={22} color={Colors.primaryDark} />
                </ImageSelectButton>
              </TouchableOpacity>
            </ImageSelectorContainer>

            <ImageSelectorContainer>
              <ImageSelectorText>
                {
                  this.state.back === null ? 'Back of your document:' : 'Back selected!'
                }
              </ImageSelectorText>
              <TouchableOpacity onPress={() => this.onClick('back')}>
                <ImageSelectButton>
                  <MaterialIcon name="camera-alt" size={22} color={Colors.primaryDark} />
                </ImageSelectButton>
              </TouchableOpacity>
            </ImageSelectorContainer>

            <ImageSelectorContainer>
              <ImageSelectorText>
                {
                  this.state.selfie === null ? 'Selfie:' : 'Selfie selected!'
                }
              </ImageSelectorText>
              <TouchableOpacity onPress={() => this.onClick('selfie')}>
                <ImageSelectButton>
                  <MaterialIcon name="camera-alt" size={22} color={Colors.primaryDark} />
                </ImageSelectButton>
              </TouchableOpacity>
            </ImageSelectorContainer>
          </Container>
        </ScrollView>

        <NextButton onPress={() => this.goToNext() } disabled={!(this.state.front && this.state.back && this.state.selfie)} >
          <NextButtonLabel>{I18n.t('Next')}</NextButtonLabel>
        </NextButton>
        <NextButton onPress={() => this.onLogout() } >
          <NextButtonLabel>{I18n.t('Logout')}</NextButtonLabel>
        </NextButton>
      </DarkLayout>
    );
  }
}