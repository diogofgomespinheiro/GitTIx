import styled from 'styled-components';

export const Container = styled.div`
  width: 90%;
  margin: 0 auto;
  padding-top: 100px;
`;

export const Text = styled.h1`
  color: ${props => props.theme.colors.text};
`;
