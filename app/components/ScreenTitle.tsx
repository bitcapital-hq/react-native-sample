import * as React from 'react';
import { CenterContainer, Instructions, Title } from './layout';

export const ScreenTitle = (props: { title: string, description?: string, dark?: boolean }) => (
  <CenterContainer>
    <Title dark={props.dark}>{props.title}</Title>
    {props.description ? (
      <Instructions dark={props.dark}>
        {props.description}
      </Instructions>
    ) : null}
  </CenterContainer>
)