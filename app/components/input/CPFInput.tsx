import * as React from 'react';
import styled from 'styled-components';
import * as Config from '../../config';
import { TextInputMask, TextInputMaskProps } from 'react-native-masked-text';

const StyledTextInput = styled(TextInputMask)`
  color: ${Config.colors.white}
`;


export interface CPFInputProps extends TextInputMaskProps {
}

export interface CPFInputState {

}

export class CPFInput extends React.Component<CPFInputProps, CPFInputState> {
  render() {
    return (
      <StyledTextInput
        type=""
        {...this.props} />
    );
  }
}