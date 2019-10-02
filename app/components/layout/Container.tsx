import styled from 'styled-components/native';

export const Container = styled.View`
  margin-left: 16px;
  margin-right: 16px;
  margin-bottom: 48px;
`;

export const TopContainer = styled(Container)`
  margin-top: 48px;
`;

export const CenterContainer = styled(Container)`
	align-items: center;
`;

export const TopCenterContainer = styled(Container)`
  margin-top: 128px;
	justify-content: center;
  align-items: center;
`;