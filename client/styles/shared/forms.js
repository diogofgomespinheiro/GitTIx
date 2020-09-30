import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  padding-top: 100px;
`;

export const FormContainer = styled.form`
  width: 90%;
  max-width: 500px;
  margin: 0 auto;
  background: ${props => props.theme.colors.background_80};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 0;
  box-shadow: 7px 2px 14px -6px rgba(0, 0, 0, 0.75);
  padding: 0 50px;
`;

export const Title = styled.h1`
  color: ${props => props.theme.colors.text};
`;
